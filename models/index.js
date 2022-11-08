const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  timezone: '+07:00'
});

users = require("./user.model")(sequelize, DataTypes)
courses = require("./course.model")(sequelize, DataTypes)
questions = require("./question.model")(sequelize, DataTypes)
quizes = require("./quiz.model")(sequelize, DataTypes)
enrollments = require('./enrollment.model')(sequelize, DataTypes)
// tests = require("./test.model")(sequelize, DataTypes)
// questions = require('./question.model')(sequelize, DataTypes)
// contestRegistrations = require('./contestRegistration.model')(sequelize, DataTypes)
// parentalControls = require('./parentalControl.model')(sequelize, DataTypes)
// sponsoredContests = require('./sponsoredContest.model')(sequelize, DataTypes)

users.hasMany(courses)
courses.belongsTo(users)
courses.hasMany(quizes)
quizes.hasMany(questions)
// users.hasMany(tests)
// courses.hasMany(tests)

// tests.hasMany(questions)


users.belongsToMany(courses, { through: enrollments})
courses.belongsToMany(users, { through: enrollments})

// users.belongsToMany(tests, { through: contestRegistrations})
// tests.belongsToMany(users, { through: contestRegistrations})

// tests.belongsToMany(users, { through: sponsoredContests})
// users.belongsToMany(tests, { through: sponsoredContests})

// users.belongsToMany(users, { as: 'children', foreignKey: 'childrenAddress', through: {model: parentalControls }});
// users.belongsToMany(users, { as: 'parents', foreignKey: 'parentAddress', through: {model: parentalControls }});

const db = {
  users,
  courses,
  quizes,
  questions,
  enrollments
//   tests,
//   contestRegistrations,
//   parentalControls,
//   sponsoredContests
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;