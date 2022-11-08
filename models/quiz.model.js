module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define("quiz", {
        quizID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100)
        },
        week: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        description: {
            type: DataTypes.TEXT
        },
        answer: {
            type: DataTypes.STRING(100)
        }
    }, {
        tableName: "quiz",
        timestamps: true,
    })

    return Quiz;
};