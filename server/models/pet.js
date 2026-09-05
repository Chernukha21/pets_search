import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Pet extends Model {
    static associate(models) {
      Pet.belongsTo(models.PetTypes, {
        foreignKey: 'petTypeId',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }
  Pet.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },

      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      ownerContacts: {
        type: DataTypes.STRING(13),
        allowNull: false,
        validate: {
          is: /^\+\d{12}$/,
        },
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      city: {
        type: DataTypes.ENUM('Kyiv', 'Dnipro', 'New York'),
        allowNull: false,
      },

      isFound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      lostDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isBefore: new Date().toISOString(),
        },
      },

      petTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'pet_type_id',
      },
    },
    {
      sequelize,
      modelName: 'Pet',
      underscored: true,
    }
  );
  return Pet;
};
