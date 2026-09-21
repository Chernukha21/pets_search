import { Router } from 'express';
import {
  createPet,
  deletePetById,
  getPetById,
  getPets,
  updatePetById,
} from '../controllers/petCotroller.js';
import { validatePetOnCreate } from '../middleware/validate.js';
import { validateGetPetsQuery } from '../middleware/validateGetPetsQuery.js';

const petsRouter = Router();
petsRouter
  .route('/')
  .post(validatePetOnCreate, createPet)
  .get(validateGetPetsQuery, getPets);

petsRouter
  .route('/:id')
  .get(getPetById)
  .patch(updatePetById)
  .delete(deletePetById);

export default petsRouter;
