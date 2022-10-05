import config from '../config'
import { getCourseById } from '../lib/getMaterials'

async function updateUnit(body){
    const res = await fetch(`${config.server}/api/unit`, 
                {method: "PUT", 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})
}

async function newUnit(body, context, courses){
    const res = await fetch(`${config.server}/api/unit`, 
                {method: 'POST', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})

    let course = getCourseById(context, body.courseId)
    let units = [...course.units, res]

    console.log(units)

    //find course from courses and update it's unit property
    for (let index = 0; index < courses.length; index++) {
        const element = courses[index];
        if (element._id == course._id){
            courses[index].units = units
            console.log(courses[index].units)
        }
    }
    return courses
    
}

export {newUnit, updateUnit}