function getCourseById(context, id){
    for (let index = 0; index < context.courses.length; index++) {
        const element = context.courses[index];
        if (element._id === id){
            return element
        } 
    }
}

function getUnitsByCourseId(context, id){

}

export {getCourseById}