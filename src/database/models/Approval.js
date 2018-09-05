export default (sequelize, DataTypes) => {
  const Approval = sequelize.define('Approval', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    requestId: {
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: 'Requests',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'requestId cannot be empty'
        }
      }
    },
    approverId: {
      // in future, this should be a foreignKey referencing users table
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'approverId cannot be empty'
        }
      }
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('Open', 'Approved', 'Rejected')
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  });
  Approval.associate = (models) => {
    Approval.belongsTo(models.Request, {
      foreignKey: 'requestId',
      targetKey: 'id',
      as: 'Request'
    });
  };
  return Approval;
};
