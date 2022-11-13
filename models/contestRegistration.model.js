module.exports = (sequelize, DataTypes) => {
    const ContestRegistration = sequelize.define("contestRegistration", {
        
    }, 
    {
        tableName: "contestRegistrations",
        timestamps: false
    });
    
    return ContestRegistration;

};