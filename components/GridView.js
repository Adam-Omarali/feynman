import { Button, Input, Link, Popover, Text } from '@nextui-org/react'
import { useContext, useEffect, useState } from 'react'
import { appContext } from '../context/appContext'
import { deleteCourse, newCourse, updateCourse } from '../services/courseServices'
import styles from '../styles/Home.module.css'
import update from 'immutability-helper'
import { deleteUnit, newUnit, updateUnit } from '../services/unitServices'
import { useRouter } from 'next/router'
import { BsChevronDown } from "react-icons/bs";
import { getCourseById } from '../lib/getMaterials'

export default function GridView(props){

    const [newFolder, setNewFolder] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [editFolder, setEdit] = useState(false)

    const context = useContext(appContext)
    const router = useRouter()

    let data = context.courses

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

        if (props.name === "Courses"){
            const body = {userId: context.user._id, name: folderName}
            let courses = await newCourse(body, context.courses)
            context.set({...context, courses})
        }
        else if (props.name === "Units"){
            const body = {courseId: props.course, name: folderName}
            let units = context.units
            units = await newUnit(body, units)
            context.set({...context, units})
        }
        
        setNewFolder(false)
        setFolderName("")
    }

    async function updateData(id){

        //find piece of content by id and change the name
        let content = [...data]
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            if (element._id === id){
                content[index].name = folderName
            }
        }

        let newContext = context
        
        //update backend
        //update context
        if (props.name === "Courses"){
            let body = { name: folderName, courseId: id}
            await updateCourse(body)
            newContext = update(context, {courses: {$set: courses }})
        }
        else if (props.name === "Units"){
            let body = { name: folderName, unitId: id}
            await updateUnit(body)
            let units = context.units
            units[props.courseId] = content
            newContext = update(context, {units: {$set: units }})
        }

        context.set(newContext)
        setFolderName("")
        setEdit(false)
    }

    async function delData(id){
        let link = '/'
        let newContext = null

        let content = [...data]
        for (let index = 0; index < content.length; index++) {
            if(content[index]._id == id){
                content.splice(index, 1)
            }
        }

        if(props.name == "Courses"){
            const body = {courseId: id}
            await deleteCourse(body)
            newContext = update(context, {courses: {$set: content }})
            router.push(link)
        }
        if (props.name == "Units"){
            const body = {unitId: id}
            await deleteUnit(body)

            let units = context.units
            units[props.course] = content
            newContext = update(context, {units: {$set: units }})

            router.asPath.includes("course") ? "" : router.push(link + "course/" + id)
        }

        context.set(newContext)
    }

    function generateLink(id){
        return `/${props.name.slice(0, -1).toLowerCase()}/${encodeURIComponent(id)}`
    }

    let folderInput = <Input autoFocus onChange={(e) => setFolderName(e.target.value)} value={folderName} onKeyDown={e => cancelPost(e)}/>

    if(context.courses !== undefined){
        if (props.name === "Units"){
            let course = getCourseById(context, props.course)
            if(course !== undefined){
                data = context.units[props.course]
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
                <h1>{props.name}</h1>
                <div className={styles.courseList}>      
                    <Button auto color="gradient" onClick={() => setNewFolder(true)} style={{width: '100%'}}>{`New ${props.name.slice(0, -1)}`}</Button>
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
                            <>
                            <div key={data._id} className={styles.columnFlex}>
                                <Link href={generateLink(data._id)}>
                                    <a>
                                        {folderIcon}
                                    </a>
                                </Link>
                                <div className={styles.rowFlex} style={{gap: '5px'}}>
                                    {editFolder == data._id ?
                                        <>
                                            {folderInput} 
                                            <Button auto onClick={() => updateData(data._id)}>Update</Button>
                                        </> : 
                                        <>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                                <p onDoubleClick={() => {setEdit(data._id); setNewFolder(false); setFolderName(data.name)}}>{data.name}</p>
                                                <Popover>
                                                    <Popover.Trigger>
                                                        <object>
                                                            <BsChevronDown fontSize={"small"} style={{marginLeft: "10px"}}></BsChevronDown>
                                                        </object>
                                                    </Popover.Trigger>
                                                    <Popover.Content>
                                                        <Button onClick={() => delData(data._id)} color="error" auto flat>Delete</Button>
                                                    </Popover.Content>
                                                </Popover>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            </>
                        )
                    })
                    }
                </div>
                <div></div>
            </div>
        )
    }
}