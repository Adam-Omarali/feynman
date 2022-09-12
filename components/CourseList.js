import { Button, Input } from '@nextui-org/react'
import { useContext, useEffect, useState } from 'react'
import config from '../config'
import { appContext } from '../context/appContext'
import styles from '../styles/Home.module.css'
import update from 'immutability-helper'

export default function CourseList(props){

    const [newFolder, setNewFolder] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [editFolder, setEdit] = useState(false)

    const context = useContext(appContext)

    let folder = <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
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

    async function newCourse(){
        const body = {userId: context.user._id, name: folderName, units: []}
        const res = await fetch(`${config.server}/api/course`, 
                    {method: 'POST', 
                    body: JSON.stringify(body), 
                    headers: {'Content-Type': 'application/json'}})
        
        setNewFolder(false)
        setFolderName("")
        let courses = [...context.courses, res]
        context.set({...context, courses})
    }

    async function updateCourse(id){
        const body = { name: folderName, courseId: id}
        const res = await fetch(`${config.server}/api/course`, 
                    {method: "PUT", 
                    body: JSON.stringify(body), 
                    headers: {'Content-Type': 'application/json'}})
        
        let courses = [...context.courses]
        for (let index = 0; index < courses.length; index++) {
            const element = courses[index];
            if (element._id === id){
                courses[index].name = folderName
            }
        }
        const newContext = update(context, {courses: {$set: courses }})
        console.log(newContext)
        setFolderName("")
        setEdit(false)
    }

    let folderInput = <Input autoFocus onChange={(e) => setFolderName(e.target.value)} value={folderName} onKeyDown={e => cancelPost(e)}/>


    return(
        <div>
            <h1>Courses</h1>
            <div className={styles.courseList}>      
                <Button auto color="gradient" onClick={() => setNewFolder(true)}>New Course</Button>
                {newFolder && 
                    <div className={styles.columnFlex}>
                        {folder}
                        <div className={styles.rowFlex} style={{gap: '5px'}}>
                            {folderInput}
                            <Button auto onClick={(e) => newCourse(e)}>Submit</Button>
                        </div>
                    </div>
                }
                {context.courses && context.courses.map(course => {
                    return(
                        <div key={course._id} className={styles.columnFlex}>
                            {folder}
                            <div className={styles.rowFlex} style={{gap: '5px'}}>
                                {editFolder ?
                                    <>
                                        {folderInput} 
                                        <Button auto onClick={() => updateCourse(course._id)}>Update</Button>
                                    </> : 
                                    <p onDoubleClick={() => {setEdit(true); setNewFolder(false); setFolderName(course.name)}}>{course.name}</p>
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