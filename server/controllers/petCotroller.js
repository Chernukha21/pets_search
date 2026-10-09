import createHttpError from 'http-errors';
import { Op } from 'sequelize';
import db from '../models/index.js';

const { Pet } = db;

export const createPet = async (req, res, next) => {
  try {
    const createdPet = await Pet.create(req.body);

    const { createdAt, updatedAt, ...preparedPet } = createdPet.get();

    return res.status(201).json({
      data: preparedPet,
      message: 'Pet created successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const getPets = async (req, res, next) => {
  try {
    const { petTypeIds, isFound } = res.locals.petFilters ?? {};

    const whereConditions = {};

    if (petTypeIds) {
      whereConditions.petTypeId = {
        [Op.in]: petTypeIds,
      };
    }

    if (isFound !== undefined) {
      whereConditions.isFound = isFound;
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

export const getPetById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return next(createHttpError(400, 'Invalid pet ID'));
    }

    const foundPet = await Pet.findByPk(id);

    if (!foundPet) {
      return next(createHttpError(404, 'Pet not found'));
    }

    return res.status(200).json({
      data: foundPet,
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePetById = async (req, res, next) => {
  const { id } = req.params;
  const { isFound } = req.body ?? {};

  try {
    if (typeof isFound !== 'boolean') {
      return next(createHttpError(400, 'isFound must be a boolean'));
    }

    const foundPet = await Pet.findByPk(id);

    if (!foundPet) {
      return next(createHttpError(404, 'Pet not found'));
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
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return next(createHttpError(400, 'Invalid pet ID'));
    }

    const deletedCount = await Pet.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return next(createHttpError(404, 'Pet not found'));
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
