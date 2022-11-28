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

Course.hasMany(Student, {foreignKey: 'course'});


module.exports.initialize = function(){
  return new Promise((resolve,reject)=>{
    sequelize.sync().then(()=>{
      resolve("connected to database")
    }).catch(err=>{
      reject(err.message);
    })
  })
}

module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    reject();
  });
}

module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    reject();
  });
}

module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    reject();
  });
}


module.exports.getStudentsByCourse = function (course) {
  return new Promise(function (resolve, reject) {
    reject();
  });
}


module.exports.getStudentsByNum = function (num) {
  return new Promise(function (resolve, reject) {
    reject();
  });
}

module.exports.addStudent = function (addStudent) {
  return new Promise(function (resolve, reject) {
    reject();
  });
}

module.exports.updateStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    reject();
  });


}

module.exports.getCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    reject();
  });
}


