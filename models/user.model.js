module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        address: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        role: {
            type: DataTypes.STRING(20)
        },
        fullName: {
            type: DataTypes.STRING(40)
        },
        email: {
            type: DataTypes.STRING(40)
        },
        workLocation: {
            type: DataTypes.TEXT
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: "users",
        timestamps: true,
    })

    return User;
};