import '../styles/globals.css'
import {SessionProvider} from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react';
import {lightTheme, darkTheme} from '../themes/themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { appContext } from '../context/appContext'
import config from '../config';
import Head from 'next/head';


function MyApp({ Component, pageProps:{session, ...pageProps} }) {

  const [context, setContext] = useState(null)

  useEffect(() => {
    fetch(`${config.server}/api/user`, {method: 'GET'}).then(res => res.json().then(data => 
      {
        setContext(data)
        console.log(data)
      }))
  }, [])

  return (
    <SessionProvider session={pageProps.session}>
      <appContext.Provider value={{...context, set: setContext}}>
        <NextThemesProvider defaultTheme="system" attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className
          }}>
          <NextUIProvider>
                <Head>
                    <title>Feynman</title>
                    <meta name="description" content="Continously learn by developing your own material" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Component {...pageProps}/>
          </NextUIProvider>
        </NextThemesProvider>
      </appContext.Provider>
    </SessionProvider>
  )
}

export default MyApp
