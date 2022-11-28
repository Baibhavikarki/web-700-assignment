/********************************************************************************* 
* WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
*  of this assignment has been copied manually or electronically from any other source  
*  (including 3rd party web sites) or distributed to other students. *  
*  Name:Baibhavi Karki Student ID: 120544226 Date: Nov 20, 2022 
*  Online (Cyclic) Link: https://busy-teal-binturong-vest.cyclic.app/
* ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
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
            // if (data.length > 0) {
                res.render("students", { students: data });
            // }
        }).catch(err => {

            res.json({ message: "no results" });
        })
    } else {
        collegeData.getAllStudents().then(data => {
            // if (data.length > 0) {
                res.render("students", { students: data });
            // }
        }).catch(err => {
            res.senc({ message: "no results" });
        });
    }
});

app.get("/student/:studentNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error
    }).then(data.getCourses)
        .then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {
            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
});

app.get("/students/add", (req, res) => {
    //res.sendFile(path.join(__dirname, "./views/addStudent.html"));
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.email) {
        collegeData.addStudent(req.body).then(() => {
            res.redirect('/students');
        }).catch(error => {
            res.send({
                message: error
            })
        })
    } else {
        res.render("addStudent");
    }
});



app.post("/students/update", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;
    collegeData.updateStudent(req.body);
    res.redirect("/students");
});

app.get("/student/delete/:studentNum", (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect('/students');
    }).catch(error => {
        res.sendStatus(500);
        res.send({
            message: "Unable to Remove Student / Student not found"
        })
    })
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then((x) => {
        // if (x.length > 0) {
            res.render("courses", { courses: x });
        // }
    }).catch(error => {
        res.render("courses", { message: "no results" });
    })
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then(data => {
        res.render("course", { course: data });
    }).catch(err => {
        res.json({ message: "no results", e });
    });
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
    collegeData.addCourse(req.body).then(() => {
        res.redirect('/courses');
    }).catch(error => {
        res.send({
            message: error
        })
    })
});

app.post("/course/update", (req, res) => {
    collegeData.updateCourse(req.body.id, req.body).then(data => {
        res.redirect('/courses');
    }).catch(error => {
        res.send({
            message: error
        })
    })
});

app.get("/course/delete/:id", (req, res) => {
    collegeData.deleteCourseById(req.params.id).then(() => {
        res.redirect('/courses');
    }).catch(error => {
        res.sendStatus(500);
        res.send({
            message: error
        })
    })
});

app.get("/*", (req, res) => {
    res.status(404);
    res.send("Page Not Found");
});

collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on: " + HTTP_PORT)
    });
}).catch(err => {
    console.log(err);
})
