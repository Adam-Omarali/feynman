import { createContext } from "react";

export const appContext = createContext({
    user: null,
    courses: null,
    units: null,
    lessons: null,
    darkMode: false
})