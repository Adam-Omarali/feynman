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

async function deleteCourse(body, courses){
    const res = await fetch(`${config.server}/api/course`, 
                {method: 'DELETE', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})

    for (let index = 0; index < courses.length; index++) {
        if(courses[index]._id == body.courseId){
            console.log(1)
            courses.splice(index, 1)
        }
    }

    return courses
}

export {newCourse, updateCourse, deleteCourse}