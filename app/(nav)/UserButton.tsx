"use client";
import { auth } from "@/firebase/clientConfig";

export function UserButton() {
  return (
    <div className="w-full flex p-3 gap-4 items-center">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img
            src={auth.currentUser?.photoURL ? auth.currentUser?.photoURL : ""}
          />
        </div>
      </div>
      <div className="text-sm">
        <p>{auth.currentUser?.displayName}</p>
      </div>
    </div>
  );
}
