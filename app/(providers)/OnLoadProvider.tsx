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
import { question, setQuestions } from "@/redux/questions";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();

  async function getMaterials(userId: string) {
    console.log("Fetching Materials On Load");
    let materials: {
      courses: { [key: string]: courseMenu };
      questions: { [key: string]: question };
    } = await (
      await fetch("/api/getMaterials", {
        body: JSON.stringify({ id: userId }),
        method: "POST",
      })
    ).json();
    dispatch(setCourses(materials.courses));
    dispatch(setQuestions(materials.questions));
    dispatch(fetched());
  }

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser === null) {
        await signInWithPopup(auth, provider);
      } else {
        if (isObjectEmpty(courses)) {
          let tempCourses = localStorage.getItem("courses");
          let tempQuestions = localStorage.getItem("questions");
          if (tempCourses != null && tempQuestions != null) {
            let questions = JSON.parse(tempQuestions);
            let course: { [key: string]: courseMenu } = JSON.parse(tempCourses);
            let storeValues = Object.values(course);
            if (storeValues.length > 0) {
              if (storeValues[0].userId === currentUser.uid && loading) {
                dispatch(setQuestions(questions));
                dispatch(setCourses(course));
                dispatch(fetched());
              } else {
                getMaterials(currentUser.uid);
              }
            } else {
              dispatch(fetched());
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
