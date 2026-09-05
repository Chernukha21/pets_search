import {Router} from "express";
import petsRouter from "./petRouter.js";
import petTypesRouter from "./petTypesRouter.js";

const router = Router();

router.use('/pets', petsRouter);
router.use('/pet-types', petTypesRouter );

export default router;