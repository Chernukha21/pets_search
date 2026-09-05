import {Router} from "express";
import {getPetTypes} from "../controllers/petTypeController.js";

const petTypesRouter = Router();

petTypesRouter.get("/", getPetTypes);

export default petTypesRouter;