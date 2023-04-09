import { LoadingOverlay } from "@mantine/core";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { defaultContext, appContext, context } from "../../context/appContext";
import { auth, provider } from "../../firebase/clientConfig";

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState(defaultContext);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser === null) {
        await signInWithPopup(auth, provider);
      } else {
        let newContext = context;
        newContext.value.user = {
          name: currentUser?.displayName!,
          email: currentUser?.email!,
          image: currentUser?.photoURL!,
          id: currentUser?.uid,
        };
        let materials = await (
          await fetch("/api/getMaterials", {
            body: JSON.stringify({ id: currentUser.uid }),
            method: "POST",
          })
        ).json();
        newContext.value.courses = materials;
        setContext(newContext);
      }
    });
    return () => {
      subscribe();
    };
  });

  if (loading) {
    return <>Loading...</>;
  } else {
    return (
      <appContext.Provider value={{ ...context, set: setContext }}>
        {children}
      </appContext.Provider>
    );
  }
}

export default ContextProvider;
