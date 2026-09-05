import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PetTypes extends Model {
    static associate(models) {
      PetTypes.hasMany(models.Pet, {
        foreignKey: 'petTypeId',
      });
    }
  }
  PetTypes.init(
    {
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PetTypes',
      underscored: true,
    }
  );
  return PetTypes;
};
