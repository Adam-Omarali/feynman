import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {id} = JSON.parse(req.body)

        let courseData = await db.collection('courses').where('userId', '==' , id).get()
        let unitData = await db.collection('units').where('userId', '==' , id).get()
        let lessonData = await db.collection('lessons').where('userId', '==' , id).get()

        let courses:{[key: string]: object} = {}

        courseData.forEach(courseObj => {
            let units:{[key: string]: object} = {}
            let lessons:{[key: string]: object} = {}
            let course = courseObj.data()
            unitData.forEach(unitObj => {
                let unit = unitObj.data()
                if (unit.courseId == course.id){
                    lessonData.forEach(lessonObj => {
                        let lesson = lessonObj.data()
                        if (lesson.unitId == unit.id){
                            lessons[lesson.id] = lesson
                        }
                    })
                    unit['lessons'] = lessons
                    units[unit.id] = unit
                }
            })
            course['units'] = units
            courses[course.id] = course
        })

        res.status(200).send(courses)
  
    }
}