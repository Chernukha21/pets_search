import { Router } from 'express';
import {
  createPet,
  deletePetById,
  getPetById,
  getPets,
  updatePetById,
} from '../controllers/petCotroller.js';
import { validatePetOnCreate } from '../middleware/validate.js';

const petsRouter = Router();
petsRouter.route('/').post(validatePetOnCreate, createPet).get(getPets);

petsRouter
  .route('/:id')
  .get(getPetById)
  .patch(updatePetById)
  .delete(deletePetById);

export default petsRouter;
