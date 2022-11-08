module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define("enrollment", {
    }, 
    {
        tableName: "enrollments",
        timestamps: false
    });
    
    return Enrollment;
};