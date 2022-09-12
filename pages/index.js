import { getSession } from 'next-auth/react'
import Head from 'next/head'
import CourseList from '../components/CourseList'
import mongoose from 'mongoose'
import { UserModel } from '../models/User'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'

export default function Home(props) {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Feynman</title>
        <meta name="description" content="Continously learn by developing your own material" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>

      <main>
        <CourseList />
      </main>
    </div>
  )
}

export async function getServerSideProps(context){

  const session = await getSession(context)

  if (!session) return {redirect: {permanent: false, destination: "/signin"}}

  try {

    await mongoose.connect(process.env.MONGODB_URL)

    const user = await UserModel.findOne({email : session.user.email})
    if (!user){
      const newUser = await UserModel.create({
        email: session.user.email,
        name: session.user.name,
        courses: []
      })
    }
    
  } catch (e) {
    console.log(e)
    return {notFound : true}
  }

  return {props: {user: session.user}}

}
