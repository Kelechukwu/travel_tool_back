module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Approvals', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    requestId: {
      allowNull: false,
      type: Sequelize.STRING,
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
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'approverId cannot be empty'
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    }
  }),

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.dropTable('Approvals');
  }
};
