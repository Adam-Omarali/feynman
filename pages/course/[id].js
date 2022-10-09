import GridView from "../../components/GridView";
import Header from "../../components/Header";
import styles from '../../styles/Home.module.css'
import { useRouter } from "next/router";
import { useContext } from "react";
import { appContext } from "../../context/appContext";
import config from '../../config';
import { getSession } from "next-auth/react";
import { getCourseById } from "../../lib/getMaterials";

export default function Course(props){
    const router = useRouter()
    const course = router.asPath.split('/')[2]

    const context = useContext(appContext)
    if(context.courses !== undefined){
        return (
            <div className={styles.container}>
    
                <Header title={getCourseById(context, course).name}/>
    
                <main>
                    {context.courses != undefined && course === "[...course]" ? "Loading" : <GridView name={"Units"} course={course} context={context}/>}
                </main>
            </div>
        )
    }
}