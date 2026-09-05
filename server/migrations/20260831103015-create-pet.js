/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      owner: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      owner_contacts: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pet_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pet_types',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      city: {
        type: Sequelize.ENUM('Kyiv', 'Dnipro', 'New York'),
        allowNull: false,
      },
      is_found: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lost_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // TODO check constraint
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pets');
  },
};
