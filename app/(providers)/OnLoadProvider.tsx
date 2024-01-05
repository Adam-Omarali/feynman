"use client";

import { User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { auth, provider } from "../../firebase/clientConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserState, courseObj, login } from "@/redux/user";
import { CourseState, courseMenu, setCourses } from "@/redux/courses";
import { isObjectEmpty } from "@/util/helper";
import { fetched } from "@/redux/loading";
import { question, setQuestions } from "@/redux/questions";
import { getUser } from "@/services/fetchMaterial";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

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

  async function fetchUser(currentUser: User) {
    let courses: courseObj = (await getUser(currentUser.uid)).courses;
    let newUser: UserState = {
      name: currentUser?.displayName!,
      email: currentUser?.email!,
      photo: currentUser?.photoURL!,
      id: currentUser.uid,
      courses,
    };
    dispatch(login(newUser));
    dispatch(fetched());
  }

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser === null || currentUser.uid === null) {
        await signInWithPopup(auth, provider);
      } else if (!loaded) {
        setLoaded(true);
        // if (isObjectEmpty(courses)) {
        //   let tempCourses = localStorage.getItem("courses");
        //   let tempQuestions = localStorage.getItem("questions");
        //   if (tempCourses != null && tempQuestions != null) {
        //     let questions = JSON.parse(tempQuestions);
        //     let course: { [key: string]: courseMenu } = JSON.parse(tempCourses);
        //     let storeValues = Object.values(course);
        //     if (storeValues.length > 0) {
        //       if (storeValues[0].userId === currentUser.uid && loading) {
        //         dispatch(setQuestions(questions));
        //         dispatch(setCourses(course));
        //         dispatch(fetched());
        //       } else {
        //         getMaterials(currentUser.uid);
        //       }
        //     } else {
        //       dispatch(fetched());
        //     }
        //   } else {
        //     getMaterials(currentUser.uid);
        //   }
        // }
        fetchUser(currentUser);
        console.log(1);
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
