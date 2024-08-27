"use client";

import { User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { auth, provider } from "../../firebase/clientConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserState, courseObj, login } from "@/redux/user";
import { fetched } from "@/redux/loading";
import { getUser } from "@/services/fetchMaterial";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  async function fetchUser(currentUser: User) {
    let user = await getUser(currentUser.uid);
    let courses: courseObj = {};
    if (user) {
      courses = user.courses;
    }
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
        fetchUser(currentUser);
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
