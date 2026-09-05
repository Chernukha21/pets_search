import db from '../models/index.js';
import { Op } from 'sequelize';

const { Pet } = db;

export const createPet = async (req, res, next) => {
  const { body } = req;
  try {
    const createdPet = await Pet.create(body);
    const { createdAt, updatedAt, ...preparedPet } = createdPet.get();
    return res.status(201).json({
      data: preparedPet,
      message: 'Pet created successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getPets = async (req, res, next) => {
  try {
    const { petTypeIds, isFound } = req.query;
    const whereConditions = {};
    if (petTypeIds) {
      const ids = petTypeIds.split(',').map(Number);

      const areIdsValid = ids.every((id) => Number.isInteger(id) && id > 0);

      if (!areIdsValid) {
        return res.status(400).json({
          message: 'Invalid pet type IDs',
        });
      }

      whereConditions.petTypeId = {
        [Op.in]: ids,
      };
    }

    if (isFound !== undefined) {
      const preparedIsFound = isFound.trim().toLowerCase();

      if (preparedIsFound !== 'true' && preparedIsFound !== 'false') {
        return res.status(400).json({
          message: 'isFound must be true or false',
        });
      }

      whereConditions.isFound = preparedIsFound === 'true';
    }

    const pets = await Pet.findAll({
      where: whereConditions,
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      data: pets,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPetById = async (req, res, next) => {};

export const updatePetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isFound } = req.body ?? {};
    console.log('BODY:', req.body);
    console.log('IS FOUND:', req.body?.isFound);
    console.log('TYPE:', typeof req.body?.isFound);
    if (typeof isFound !== 'boolean') {
      return res.status(400).json({
        message: 'isFound must be a boolean',
      });
    }

    const foundPet = await Pet.findByPk(id);

    if (!foundPet) {
      return res.status(404).json({
        message: 'Pet not found',
      });
    }

    await foundPet.update({ isFound });

    return res.status(200).json({
      data: foundPet,
      message: 'Pet status updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const deletePetById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id)
      return res.status(400).json({
        message: 'Pet is not found',
      });
    const deletedPet = await Pet.destroy({
      where: { id },
    });
    return res.status(200).json({
      data: deletedPet,
      message: 'Pet deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
