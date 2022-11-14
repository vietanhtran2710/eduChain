module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("contest", {
        address: {
            type: DataTypes.STRING(50),
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.TEXT
        },
        contestEnded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: "contests",
        timestamps: true,
    })

    return Test;
};