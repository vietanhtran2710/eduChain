module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define("submissions", {
        grade: {
            type: DataTypes.REAL,
        }
    }, 
    {
        tableName: "submissions",
        timestamps: false
    });
    
    return Submission;

};