module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('course', {
        courseID: {
            type: DataTypes.INTEGER(32).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100)
        },
        week: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        description: {
            type: DataTypes.TEXT
        },
        imageURI: {
            type: DataTypes.TEXT
        },
        fee: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        requiredAverageGrade: {
            type: DataTypes.REAL
        },
        reward: {
            type: DataTypes.INTEGER.UNSIGNED
        }
    }, {
        tableName: 'courses',
        timestamps: true,
    })

    return Course;
}