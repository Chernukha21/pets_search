import db from '../models/index.js';

const { PetTypes } = db;

export const getPetTypes = async (req, res, next) => {
  try {
    const foundTypes = await PetTypes.findAll({
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    return res.status(200).json(foundTypes);
  } catch (error) {
    return next(error);
  }
};
