class Data {
  students
  courses
  
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;
module.exports.initialize = function () {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    let courseDataFromFile;
    let studentDataFromFile;
    try {
      studentDataFromFile = fs.readFileSync('./data/students.json', 'utf8');
    } catch (err) {
      reject("unable to read students.json");
    }

    try {
      courseDataFromFile = fs.readFileSync('./data/courses.json', 'utf8');
    } catch (err) {
      reject("unable to read course.json");
    }
    dataCollection = new Data(JSON.parse(studentDataFromFile), JSON.parse(courseDataFromFile));
    resolve(dataCollection);
  })
}

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("no results returned");
    }
  })
}

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("no results returned");
    }
  })
}

module.exports.getTAs = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      var studentTa = [];
      for (var i = 0; i < dataCollection.students.length; i++) {
        if (dataCollection.students[i].TA == true) {
          studentTa.push(dataCollection.students[i]);
        }
      }
      resolve(studentTa);
    } else {
      reject("no results returned");
    }
  })
}


module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      var courseMatch = [];
      for (var i = 0; i < dataCollection.students.length; i++) {
        if (dataCollection.students[i].course == course) {
          courseMatch.push(dataCollection.students[i]);
        }
      }

      if(courseMatch.length == 0) {
        reject("no course match returned");
      }
      resolve(courseMatch);
    } else {
      reject("no results returned");
    }
    resolve();
  })
}


module.exports.getStudentsByNum = function (num) {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      var studentsByNum = [];
      for (var i = 0; i < dataCollection.students.length; i++) {
        if (dataCollection.students[i].studentNum == num) {
          studentsByNum.push(dataCollection.students[i]);
        }
      }

      if(studentsByNum.length == 0) {
        reject("no student num match returned");
      }
      resolve(studentsByNum[0]);
    } else {
      reject("no results returned");
    }
    resolve();
  })
}

module.exports.addStudent = function (addStudent) { 
  return new Promise((resolve, reject) => { 
    addStudent.studentNum = dataCollection.students.length++;
    dataCollection.students.push(addStudent); 
    resolve(dataCollection.students); 
}) 
}






