/********************************************************************************* 
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
*  of this assignment has been copied manually or electronically from any other source  
*  (including 3rd party web sites) or distributed to other students. *  
*  Name:Baibhavi Karki Student ID: 120544226 Date: Nov 04, 2022 
* ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8085;
var express = require("express");
var app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const collegeData = require("./modules/collegeData");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

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

    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then(data => {
            res.render("students", { students: data });

        }).catch(err => {

            res.json({ message: "no results" });
        })
    } else {
        collegeData.getAllStudents().then(data => {
            res.render("students", { students: data });
        }).catch(err => {
            res.senc({ message: "no results" });
        });
    }
});


app.get("/student/:num", (req, res) => {

    collegeData.getStudentsByNum(req.params.num).then(data => {

        res.render("student", { student: data });
    }).catch(err => {

        res.json({ message: "no results" });
    });
});

app.get("/course/:id", (req, res) => {

    collegeData.getCourses(req.params.id).then(data => {
        res.render("course", { course: data });
    }).catch(err => {

        res.json({ message: "no results" });
    });
});


app.get("/courses", (req, res) => {
    collegeData.getCourses().then((x) => {
        res.render("courses", { courses: x });
    }).catch(error => {
        res.render("courses", { message: "no results" });
    })
});

app.get("/students/add", (req, res) => {
    //res.sendFile(path.join(__dirname, "./views/addStudent.html"));
    res.render("addStudent");
});


app.post("/students/add", (req, res) => {
    const addStudent = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "addressStreet": req.body.street,
        "addressCity": req.body.city,
        "addressProvince": req.body.province,
        "TA": req.body.collegeEmployment ? true : false,
        "status": req.body.enrollmentStatus,
        "course": req.body.enrollementCourse
    }
    if (req.body.firstName && req.body.lastName && req.body.email) {
        collegeData.addStudent(addStudent).then(() => {
            res.redirect('/students');
        }).catch(error => {
            res.send({
                message: error
            })
        })
    }else{
        res.render("addStudent");
    }

});
app.post("/students/update", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;
    collegeData.updateStudent(req.body);
    res.redirect("/students");
});

app.get("/*", (req, res) => {
    res.status(404);
    res.send("Page Not Found");
});



// setup http server to listen on HTTP_PORT

app.listen(HTTP_PORT, () => {
    console.log("server listening on port: " + HTTP_PORT)
    collegeData.initialize().then((x) => {
    }).catch(error => {
        console.log(error);
    })
});

