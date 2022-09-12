import { createTheme } from "@nextui-org/react"

export const darkTheme = createTheme({
  type: 'dark',
  theme:{
      colors: {
        background: '#101010',
        myDarkColor: '#ff4ecd'
      }
  },
  name: 'hi'
});

export const lightTheme = createTheme({
  type: 'light'
});