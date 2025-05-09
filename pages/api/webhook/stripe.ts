import Stripe from 'stripe';
import {NextApiRequest, NextApiResponse} from 'next';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

//dev
// const priceIds = {
//   subscription: "price_1RFVCiAgvuBiMV3enKFPQKyl",
//   storage: "price_1RFVJFAgvuBiMV3eCV5r9PvX"
// }

//prod
const priceIds = {
  subscription: "price_1RFmjcAgvuBiMV3e11LQhMWb",
  storage: "price_1RFmjZAgvuBiMV3eCaJzNBlH"
}

const PURCHASED_STORAGE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
const PRO_STORAGE_BONUS = 10 * 1024 * 1024 * 1024; // 10GB in bytes

async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const userRecord = await getAuth().getUserByEmail(email);
    return userRecord.uid;
  } catch (error) {
    console.log(`No user found for email ${email}`, error);
    return null;
  }
}

async function updateUserSubscription(email: string, subscription: 'free' | 'pro') {
  const userId = await getUserIdByEmail(email);
  if (!userId) {
    console.log(`No user found for email ${email}`);
    return;
  }

  const db = getFirestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data();
    if (!userData) {
      console.log(`No data found for user ${userId}`);
      return;
    }

    const updates: { [key: string]: any } = { subscription };
    console.log(subscription, userData.subscription)
    
    // Handle storage changes based on subscription changes
    if ('maxStorage' in userData) {
      if (subscription === 'pro' && userData.subscription === 'free') {
        // Going from free to pro: add 10GB
        updates.maxStorage = FieldValue.increment(PRO_STORAGE_BONUS);
        console.log(`Added ${PRO_STORAGE_BONUS} bytes to maxStorage for user ${userId}`);
      } else if (subscription === 'free' && userData.subscription === 'pro') {
        // Going from pro to free: subtract 10GB
        updates.maxStorage = FieldValue.increment(-PRO_STORAGE_BONUS);
        console.log(`Subtracted ${PRO_STORAGE_BONUS} bytes from maxStorage for user ${userId}`);
      }
    } else {
      // Initialize maxStorage if it doesn't exist
      updates.maxStorage = subscription === 'pro' ? PRO_STORAGE_BONUS : PURCHASED_STORAGE;
      console.log(`Set initial maxStorage to ${updates.maxStorage} for user ${userId}`);
    }

    // Initialize storageUsed if it doesn't exist
    if (!('storageUsed' in userData)) {
      updates.storageUsed = 0;
      console.log(`Set initial storageUsed to 0 for user ${userId}`);
    }

    // Apply updates
    await userRef.set(updates, { merge: true });
    console.log(`Updated subscription to ${subscription} for user ${userId}`);
  } else {
    console.log(`User not found for userId ${userId} and subscription ${subscription}`);
  }
}

async function updateUserStorage(email: string, additionalStorage: number) {
  const userId = await getUserIdByEmail(email);
  if (!userId) {
    console.log(`No user found for email ${email}`);
    return;
  }

  const db = getFirestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data();
    if (!userData) {
      console.log(`No data found for user ${userId}`);
      return;
    }

    const updates: { [key: string]: any } = {};
    
    // Initialize or update maxStorage
    if (!('maxStorage' in userData)) {
      updates.maxStorage = PURCHASED_STORAGE + additionalStorage;
      console.log(`Set initial maxStorage to ${updates.maxStorage} for user ${userId}`);
    } else {
      updates.maxStorage = FieldValue.increment(additionalStorage);
      console.log(`Incremented maxStorage by ${additionalStorage} for user ${userId}`);
    }

    // Initialize storageUsed if it doesn't exist
    if (!('storageUsed' in userData)) {
      updates.storageUsed = 0;
      console.log(`Set initial storageUsed to 0 for user ${userId}`);
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      await userRef.set(updates, { merge: true });
      console.log(`Updated storage fields for user ${userId}`);
    }
  } else {
    console.log(`No user found for email ${email}`);
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET!);

  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      if (!sig) {
        res.status(400).send('No signature');
        return;
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);

    // Cast event data to Stripe object
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const customerEmail = customer.email;
      
      if (!customerEmail) {
        console.log('No email found for customer');
        return;
      }
      await updateUserSubscription(customerEmail, 'free');
    } 
    else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1, // or more if you expect multiple items
      });
      
      // Access price ID or product
      const item = lineItems.data[0];
      const priceId = item.price?.id;

      const customerEmail = session.customer_details?.email || session.customer_email;

      if (priceId === priceIds.subscription) {
        console.log('Subscription purchased');
        if (customerEmail) {
          await updateUserSubscription(customerEmail, 'pro');
        }
      } else if (priceId === priceIds.storage) {
        console.log('Storage purchased');
        if (customerEmail) {
          await updateUserStorage(customerEmail, PURCHASED_STORAGE);
        }
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks as unknown as Uint8Array[]));
    });

    req.on('error', reject);
  });
};

export default handler;