import * as yup from 'yup';

const PET_VALIDATION_SCHEMA = yup.object({
  name: yup.string().trim().min(1).max(32).required(),
  owner: yup.string().trim().min(1).max(64).required(),
  ownerContacts: yup
    .string()
    .length(13)
    .matches(/^\+\d{12}$/, 'Phone number must correspond +XX XXX XXX XX XX')
    .required(),
  description: yup.string().trim().min(1).max(255).required(),
  city: yup.string().oneOf(['Kyiv', 'Dnipro', 'New York']).required(),
  lostDate: yup.date().max(new Date()).required(),
  petTypeId: yup.number().min(1).required(),
});

export const validatePetOnCreate = async (req, res, next) => {
  const { body } = req;
  try {
    req.body = await PET_VALIDATION_SCHEMA.validate(body);
    next();
  } catch (err) {
    next(err);
  }
};
