module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'provider');
  },

  down: async (queryInterface) => {
    await queryInterface.addColumn('users', 'provider', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false,
    });
  },
};
