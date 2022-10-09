import config from '../config'

async function updateCourse(body){
    const res = await fetch(`${config.server}/api/course`, 
                {method: "PUT", 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})
}

async function newCourse(body, courses){
    const res = await fetch(`${config.server}/api/course`, 
                {method: 'POST', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})

    courses = [...courses, await res.json()]
    return courses
    
}

async function deleteCourse(body){
    const res = await fetch(`${config.server}/api/course`, 
                {method: 'DELETE', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})
}

export {newCourse, updateCourse, deleteCourse}