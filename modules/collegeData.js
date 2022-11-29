const Sequelize = require('sequelize');
var sequelize = new Sequelize('ckftadkq', 'ckftadkq', 'r03ikTEOpl7WCszBnA2kR-2eVa2BDDzA', {
  host: 'heffalump.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

var Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      resolve("connected to database")
    }).catch(err => {
      reject(err.message);
    })
  })
}


module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll().then(data => {
      resolve(data);
    }).catch(err => {
      reject("no results returned", err.message);
    });
  });
}

module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll().then(data => {
      resolve(data);
    }).catch(err => {
      reject("no results returned", err.message);
    });
  });
}

module.exports.getStudentsByCourse = function (course) {
  return new Promise(function (resolve, reject) {
    Student.findAll(
      {
        where: {
          course: course
        }
      }
    ).then(data => {
      resolve(data);
    }).catch(err => {
      reject("no results returned", err.message);
    });
  });
}

module.exports.getStudentByNum = function (num) {
  return new Promise(function (resolve, reject) {
    Student.findOne(
      {
        where: {
          studentNum: num
        }
      }
    ).then(data => {
      resolve(data);
    }).catch(err => {
      reject("no results returned", err.message);
    });
  });
}

module.exports.getCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.findOne({
      where: {
        courseId: id
      }
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject("no results returned", err.message);
    });
  });
}


module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    reject();
  });
}

module.exports.addStudent = function (addStudent) {
  return new Promise(function (resolve, reject) {
    addStudent.TA = (addStudent.TA) ? true : false;
    for (variable in addStudent) {
      if (!addStudent[variable]) {
        addStudent[variable] = null;
      }
    }
    Student.create(addStudent, {
      omitNull: false
    }).then(newUser => {
      resolve(newUser);
    }).catch(err => {
      reject("unable to create user", err.message);
    })

  });
}

module.exports.updateStudent = function (idToSearchFor, newData) {
  return new Promise((resolve, reject) => {
    Student.update(newData, {
      where: {
        studentNum: idToSearchFor
      }
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject("unable to update user by id", err.message)
    })
  });
}


module.exports.addCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    Course.create(courseData).then(courseData => {
      resolve(courseData);
    }).catch(err => {
      reject("unable to create user", err.message);
    })
  });
}

module.exports.updateCourse = function (idToSearchFor, newData) {
  return new Promise((resolve, reject) => {
    Course.update(newData, {
      where: {
        courseId: idToSearchFor
      }
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject("unable to update user by id", err.message)
    })
  });
}


module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id
      }
    }).then(() => {
      resolve();
    }).catch(err => {
      reject("unable to delete user", err.message);
    })
  });
}

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: studentNum
      }
    }).then(() => {
      resolve();
    }).catch(err => {
      reject("unable to delete user", err.message);
    })
  });
}