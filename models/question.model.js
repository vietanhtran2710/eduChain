module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("questions", {
        questionID: {
            type: DataTypes.INTEGER(32).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        questionText: {
            type: DataTypes.STRING(100)
        },
        choices: {
            type: DataTypes.TEXT
        },
    }, {
        tableName: "questions",
        timestamps: true,
    })
    return Question;
};