/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('pet_types', [
      {
        type: 'Cat',
        created_at: now,
        updated_at: now,
      },
      {
        type: 'Dog',
        created_at: now,
        updated_at: now,
      },
      {
        type: 'Parrot',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pet_types', {
      type: ['Cat', 'Dog', 'Parrot'],
    });
  },
};
