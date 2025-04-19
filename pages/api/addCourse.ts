import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { courseMenu } from "@/redux/courses";

// Define fixed limits
const COURSE_LIMITS = {
    free: 3,  // Free users can create 3 courses
    pro: 100  // Pro users can create 100 courses
};

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, description, courseObj} = JSON.parse(req.body)

        if (name && userId){
            // Get user document to check subscription and course count
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const userData = userDoc.data();
            
            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Get current course count and subscription type
            const currentCourseCount = Object.keys(userData.courses || {}).length;
            const subscription = userData.subscription || 'free';
            const courseLimit = COURSE_LIMITS[subscription as keyof typeof COURSE_LIMITS];

            // Check if user has reached their course limit
            if (currentCourseCount >= courseLimit) {
                return res.status(403).json({
                    error: subscription === 'free' 
                        ? 'You have reached the maximum number of courses for free users. Please upgrade to Pro for more courses.'
                        : 'You have reached the maximum number of courses allowed.'
                });
            }

            // If under limit, proceed with course creation
            const courseRef = db.collection('courses').doc();
            const newCourse: courseMenu = {
                id: courseRef.id,
                userId: userId,
                name: name,
                emoji: emoji,
                description: description ? description : "",
                unitOrder: []
            };
            
            courseObj[courseRef.id] = {
                name: name,
                emoji: emoji,
                units: {}
            }
            
            await userRef.update({courses: courseObj})
            await courseRef.set(newCourse);
            
            res.status(200).json(newCourse);
        } else {
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
    }
}