"use client";

import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { auth, provider } from "../../firebase/clientConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserState, login } from "@/redux/user";
import { setCourses } from "@/redux/courses";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser === null) {
        await signInWithPopup(auth, provider);
      } else {
        let newUser: UserState = {
          name: currentUser?.displayName!,
          email: currentUser?.email!,
          photo: currentUser?.photoURL!,
          id: currentUser?.uid,
        };
        dispatch(login(newUser));
        let materials = await (
          await fetch("/api/getMaterials", {
            body: JSON.stringify({ id: currentUser.uid }),
            method: "POST",
          })
        ).json();
        dispatch(setCourses(materials));
      }
    });
    return () => {
      subscribe();
    };
  });

  if (user.id === "") {
    return <Spinner />;
  } else {
    return <>{children}</>;
  }
}

export default AuthProvider;
