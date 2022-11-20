/********************************************************************************* 
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
*  of this assignment has been copied manually or electronically from any other source  
*  (including 3rd party web sites) or distributed to other students. *  
*  Name:Baibhavi Karki Student ID: 120544226 Date: Nov 04, 2022 
* ********************************************************************************/  

var HTTP_PORT = process.env.PORT || 8082;
var express = require("express");
var app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const collegeData = require("./modules/collegeData");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", exphbs.engine({
    extname: ".hbs"
}));
  
app.set("view engine", ".hbs");
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
//  res.sendFile(path.join(__dirname, "./views/home.html"));
res.render("home");
});

app.get("/about", (req, res) => {
   //res.sendFile(path.join(__dirname, "./views/about.html"));
    res.render("about");
   });

app.get("/htmlDemo", (req, res) => {
    //res.sendFile(path.join(__dirname, "./views/htmlDemo.html"));
    res.render("htmlDemo");
   });

app.get("/students", (req, res) => {
    collegeData.getAllStudents().then((x) =>{
        res.send(x);
    }).catch(error =>{
        res.send({
            message: error
        })
    })
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then((x) =>{
        res.send(x);
    }).catch(error =>{
        res.send({
            message: error
        })
    })
});



app.get("/courses", (req, res) => {
    collegeData.getCourses().then((x) =>{
        res.send(x);
    }).catch(error =>{
        res.send({
            message: error
        })
    })
});



app.get("/students/add", (req, res) => {
    //res.sendFile(path.join(__dirname, "./views/addStudent.html"));
    res.render("addStudent");
});

app.post("/students/add", (req, res) => { 
    const addStudent =  { 
        "firstName": req.body.firstName, 
        "lastName":req.body.lastName, 
        "email": req.body.email, 
        "addressStreet": req.body.street, 
        "addressCity": req.body.city, 
        "addressProvince": req.body.province, 
        "TA": req.body.collegeEmployment ? true : false, 
        "status": req.body.enrollmentStatus, 
        "course": req.body.enrollementCourse 
    } 
       
    collegeData.addStudent(addStudent).then(() =>{
            res.redirect('/students');
    }).catch(error =>{
        res.send({
            message: error
        })
    })
});

app.get("/*", (req, res) => {
    res.status(404);
    res.send("Page Not Found");
});



// setup http server to listen on HTTP_PORT

app.listen(HTTP_PORT, ()=>{
    console.log("server listening on port: " + HTTP_PORT)
    collegeData.initialize().then((x)=>{
    }).catch(error =>{
        console.log(error);
    }) 
});

