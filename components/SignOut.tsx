"use client";
import { Button } from "./ui/Button";
import { getAuth, signOut } from "firebase/auth";

function SignOut() {
  function onSignOut() {
    localStorage.clear();
    signOut(getAuth());
  }

  return (
    <Button variant="outline" onClick={onSignOut}>
      Sign Out
    </Button>
  );
}

export default SignOut;
