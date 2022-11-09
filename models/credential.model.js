module.exports = (sequelize, DataTypes) => {
    const Credential = sequelize.define(
      'credential',
      {
        hash: {
          type: DataTypes.STRING(70),
          primaryKey: true,
        },
        issueDate: {
          type: DataTypes.STRING(30),
        },
        grade: {
          type: DataTypes.DOUBLE,
        },
        revoked: {
          type: DataTypes.TEXT,
        },
        issuer: {
            type: DataTypes.STRING(50)
        }
      },
      {
        tableName: 'credentials',
        timestamps: true,
      }
    );
  
    return Credential;
  };
  