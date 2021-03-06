module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(100),
      },
      name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      phoneNo: {
        type: Sequelize.BIGINT,
      },
      company: {
        type: Sequelize.STRING(100),
      },
      website: {
        type: Sequelize.STRING(100),
      },
      address: {
        type: Sequelize.STRING,
      },
      picture: {
        type: Sequelize.STRING,
      },
      publicId: {
        type: Sequelize.STRING,
      },
      accountType: {
        // admin, super or regular
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'regular',
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('Users'),
};
