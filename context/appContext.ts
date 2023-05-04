import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface courseMenu {
    name: string,
    emoji: string,
    description: string,
    userId: string,
    questions: {}[],
    lastTest: {},
    id: string,
    units: {
        [key: string]: {
            name?: string,
            emoji?: string,
            id?: string
            userId?: string,
            questions?: {}[],
            lastTest?: {},
            lessons?: {
                [key: string]: {
                    name?: string,
                    id?: string,
                    emoji?: string
                    content?: string
                }
            }
        }
    }
}

export interface contextInterface {
    value?: {
        user: {
            name: string,
            image: string,
            email: string,
            id: string
        } | {},
        courses: {[key: string]: {
            units: {[key: string]: {
                lessons?: {[key: string]: {}}
            }}},
        }
    }
    set?: Function
}

export interface context2 {
    value?: {
        user: {
            name: string,
            image: string,
            email: string,
            id: string
        } | {},
        courses: {[key: string]: courseMenu
        }
    }
    set?: Function
}

export const defaultContext = {
    value: {
        user: {},
        courses: {},
    }
}

export const appContext = createContext({})
