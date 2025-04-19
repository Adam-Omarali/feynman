"use client";
import { Button } from "./ui/Button";
import {
  getAuth,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";

function SignOut() {
  const router = useRouter();

  async function onSignOut() {
    const auth = getAuth();
    try {
      // Clear local storage
      localStorage.clear();

      // Set persistence to none before signing out
      await setPersistence(auth, browserLocalPersistence);

      // Sign out
      await signOut(auth);

      // Force a hard refresh to clear any cached state
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <Button variant="outline" onClick={onSignOut}>
      Sign Out
    </Button>
  );
}

export default SignOut;
