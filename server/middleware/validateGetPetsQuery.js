import createHttpError from 'http-errors';

export const validateGetPetsQuery = (req, res, next) => {
  const { petTypeIds, isFound } = req.query;
  const preparedFilters = {};

  if (petTypeIds !== undefined) {
    if (typeof petTypeIds !== 'string' || !petTypeIds.trim()) {
      return next(createHttpError(400, 'Invalid pet type IDs'));
    }

    const ids = petTypeIds.split(',').map((id) => Number(id.trim()));

    const areIdsValid = ids.every((id) => Number.isInteger(id) && id > 0);

    if (!areIdsValid) {
      return next(createHttpError(400, 'Invalid pet type IDs'));
    }

    preparedFilters.petTypeIds = ids;
  }

  if (isFound !== undefined) {
    if (typeof isFound !== 'string') {
      return next(createHttpError(400, 'isFound must be true or false'));
    }

    const preparedIsFound = isFound.trim().toLowerCase();

    if (preparedIsFound !== 'true' && preparedIsFound !== 'false') {
      return next(createHttpError(400, 'isFound must be true or false'));
    }

    preparedFilters.isFound = preparedIsFound === 'true';
  }

  res.locals.petFilters = preparedFilters;

  return next();
};
