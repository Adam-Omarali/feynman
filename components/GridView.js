import { Button, Input, Link } from '@nextui-org/react'
import { useContext, useEffect, useState } from 'react'
import { appContext } from '../context/appContext'
import { deleteCourse, newCourse, updateCourse } from '../services/courseServices'
import styles from '../styles/Home.module.css'
import update from 'immutability-helper'
import { getCourseById } from '../lib/getMaterials'
import { newUnit } from '../services/unitServices'
import { useRouter } from 'next/router'

export default function GridView(props){

    const [newFolder, setNewFolder] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [editFolder, setEdit] = useState(false)

    const context = useContext(appContext)
    const router = useRouter()

    let data = context.courses
    let parentName = null

    let folderIcon = <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    width="75" height="75"
                    viewBox="0 0 48 48"
                    style={{fill: "#000000"}}><path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"></path><path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"></path>
                </svg>

    function cancelPost(e){
        if (e.key === 'Escape'){
            if(newFolder){
                setFolderName('')
            }
            else{
                setEdit(false)
            }
            setNewFolder(false)
        }
    }

    async function newData(){
        let courses = [...context.courses]

        if (props.name === "Courses"){
            const body = {userId: context.user._id, name: folderName}
            courses = await newCourse(body, courses)
        }
        else if (props.name === "Units"){
            const body = {courseId: props.course, name: folderName}
            courses = await newUnit(body, context, courses)
        }
        else {
            let lessons = [...courses.units[props.unit].lessons]
        }
        
        setNewFolder(false)
        setFolderName("")
        context.set({...context, courses})
    }

    async function updateData(id){

        let content = [...data]
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            if (element._id === id){
                content[index].name = folderName
            }
        }

        //change what we're updating based on input
        let courses = props.name === "Courses" ? content : [...context.courses]
        let body = { name: folderName, courseId: id}

        if (props.name === "Courses"){
            updateCourse(body)
        }
        else if (props.name === "Units"){
            courses.units = content
        }
        else {
            let units = [...courses.units[props.unit]]
            units.lessons = content
        }

        const newContext = update(context, {courses: {$set: courses }})
        console.log(newContext)
        setFolderName("")
        setEdit(false)
    }

    async function delData(){
        let courses = [...context.courses]

        if (props.name == "Units"){
            const body = {courseId: props.course}
            courses = await deleteCourse(body, courses)
        }

        const newContext = update(context, {courses: {$set: courses }})
        console.log(newContext)
        context.set(newContext)
        router.push('/')
    }

    function generateLink(id){
        return `/${props.name.slice(0, -1).toLowerCase()}/${encodeURIComponent(id)}`
    }

    let folderInput = <Input autoFocus onChange={(e) => setFolderName(e.target.value)} value={folderName} onKeyDown={e => cancelPost(e)}/>

    if(context.courses !== undefined){
        if (props.name === "Units"){
            let course = getCourseById(context, props.course)
            if(course !== undefined){
                data = course.units
                parentName = `Course: ${course.name}`
            }
            else{
                data = []
            }

        }
        else if(props.name === "Lessons"){
            data = context.courses[props.course].units[props.unit].lessons
        }

        return(
            <div>
                {props.name !== "Courses" &&
                <div>
                    <h1>{parentName}</h1>
                    <Button onClick={() => delData()} color="error" auto flat>Delete</Button>
                </div>}
                <h1>{props.name}</h1>
                <div className={styles.courseList}>      
                    <Button auto color="gradient" onClick={() => setNewFolder(true)}>{`New ${props.name.slice(0, -1)}`}</Button>
                    {newFolder && 
                        <div className={styles.columnFlex}>
                            {folderIcon}
                            <div className={styles.rowFlex} style={{gap: '5px'}}>
                                {folderInput}
                                <Button auto onClick={(e) => newData(e)}>Submit</Button>
                            </div>
                        </div>
                    }
                    {data && data.map(data => {
                        if (data !== null)
                        return(
                            <div key={data._id} className={styles.columnFlex}>
                                <Link href={generateLink(data._id)}>
                                    <a>
                                        {folderIcon}
                                    </a>
                                </Link>
                                <div className={styles.rowFlex} style={{gap: '5px'}}>
                                    {editFolder ?
                                        <>
                                            {folderInput} 
                                            <Button auto onClick={() => updateData(data._id)}>Update</Button>
                                        </> : 
                                        <p onDoubleClick={() => {setEdit(true); setNewFolder(false); setFolderName(data.name)}}>{data.name}</p>
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        )
    }
}