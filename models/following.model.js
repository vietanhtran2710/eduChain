module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define("followings", {
    }, 
    {
        tableName: "followings",
        timestamps: false
    });
    
    return Following;

};