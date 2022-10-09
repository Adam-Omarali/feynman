import config from '../config'
import { getCourseById } from '../lib/getMaterials'

async function updateUnit(body){
    const res = await fetch(`${config.server}/api/unit`, 
                {method: "PUT", 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})
}

async function newUnit(body, units){
    const res = await fetch(`${config.server}/api/unit`, 
                {method: 'POST', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})

    units[body.courseId].push(await res.json())

    return units
}

async function deleteUnit(body){
    const res = await fetch(`${config.server}/api/unit`, 
                {method: 'DELETE', 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}})
}

export {newUnit, updateUnit, deleteUnit}