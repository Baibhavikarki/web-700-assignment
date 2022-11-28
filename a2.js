const collegeData = require("./modules/collegeData");

collegeData.initialize().then((x)=>{
    collegeData.getAllStudents().then((x) =>{
        console.log(`Successfully retrieved ${x.length} students`)
    })
    
    collegeData.getCourses().then((x) =>{
        console.log(`Successfully retrieved ${x.length} courses`)
    })
    
    collegeData.getTAs().then((x) =>{
         console.log(`Successfully retrieved ${x.length} TAs`)
    })
}).catch(error =>{
    console.log(error);
}) 



