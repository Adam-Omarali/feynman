"use client";

import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { auth, provider } from "../../firebase/clientConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserState, login } from "@/redux/user";
import { CourseState, courseMenu, setCourses } from "@/redux/courses";
import { isObjectEmpty } from "@/util/helper";
import { fetched } from "@/redux/loading";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();

  async function getMaterials(userId: string) {
    console.log("Fetching Materials On Load");
    let materials = await (
      await fetch("/api/getMaterials", {
        body: JSON.stringify({ id: userId }),
        method: "POST",
      })
    ).json();
    dispatch(setCourses(materials));
    dispatch(fetched());
  }

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser === null) {
        await signInWithPopup(auth, provider);
      } else {
        if (isObjectEmpty(courses)) {
          let temp = localStorage.getItem("courses");
          if (temp != null) {
            let store: { [key: string]: courseMenu } = JSON.parse(temp);
            let storeValues = Object.values(store);
            if (storeValues.length > 0) {
              if (storeValues[0].userId === currentUser.uid && loading) {
                dispatch(setCourses(store));
                dispatch(fetched());
              } else {
                getMaterials(currentUser.uid);
              }
            }
          } else {
            getMaterials(currentUser.uid);
          }
        }
        let newUser: UserState = {
          name: currentUser?.displayName!,
          email: currentUser?.email!,
          photo: currentUser?.photoURL!,
          id: currentUser?.uid,
        };
        dispatch(login(newUser));
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
