import { getSession } from 'next-auth/react'
import mongoose from 'mongoose'
import { UserModel } from '../models/User'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import GridView from '../components/GridView'

export default function Home(props) {
  
  return (
    <div className={styles.container}>

      <Header/>

      <main>
        <GridView name="Courses" />
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
        name: session.user.name
      })
    }
    
  } catch (e) {
    console.log(e)
    return {notFound : true}
  }

  return {props: {user: session.user}}

}
