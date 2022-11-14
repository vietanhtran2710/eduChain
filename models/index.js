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
submissions = require('./submission.model')(sequelize, DataTypes)
followings = require("./following.model")(sequelize, DataTypes)
credentials = require("./credential.model")(sequelize, DataTypes)
contests = require("./contest.model")(sequelize, DataTypes)
contestRegistrations = require('./contestRegistration.model')(sequelize, DataTypes)

users.hasMany(courses)
courses.belongsTo(users)
courses.hasMany(quizes)
quizes.belongsTo(courses);
quizes.hasMany(questions);
courses.hasMany(submissions);
users.hasMany(contests, {as: "owner"});
contests.belongsTo(users, {as: "user"});
contests.hasMany(questions);

users.belongsToMany(users, { as: 'following', foreignKey: 'followingAddress', through: {model: followings }});
users.belongsToMany(users, { as: 'followed', foreignKey: 'followedAddress', through: {model: followings }});

users.belongsToMany(quizes, { through: submissions, as: "submission"})
quizes.belongsToMany(users, { through: submissions, as: "result"})

users.belongsToMany(courses, { through: enrollments, as: "enroll"})
courses.belongsToMany(users, { through: enrollments, as: "student"})

users.belongsToMany(contests, { through: contestRegistrations, as: "contestant"})
contests.belongsToMany(users, { through: contestRegistrations, as: "registration"})

users.hasMany(credentials)
courses.hasMany(credentials)
credentials.belongsTo(courses)
credentials.belongsTo(users)

const db = {
  users,
  courses,
  quizes,
  questions,
  enrollments,
  submissions,
  followings,
  credentials,
  contests,
  contestRegistrations
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;