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
import { useQuery } from "@tanstack/react-query";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Query to fetch user data
  const { data: fetchedUser, isLoading } = useQuery(
    ["user", currentUser?.uid],
    () => getUser(currentUser!.uid),
    {
      enabled: !!currentUser,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      onSuccess: (userData) => {
        if (currentUser) {
          const courses: courseObj = userData?.courses || {};
          const newUser: UserState = {
            name: currentUser.displayName!,
            email: currentUser.email!,
            photo: currentUser.photoURL!,
            id: currentUser.uid,
            courses,
          };
          dispatch(login(newUser));
          dispatch(fetched());
        }
      },
    }
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.uid) {
        try {
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error("Error signing in with popup:", error);
        }
      } else {
        setCurrentUser(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Render Spinner while user data is loading
  if (isLoading || user.id === "") {
    return <Spinner />;
  }

  return <>{children}</>;
}

export default AuthProvider;
