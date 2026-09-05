import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik';
import classes from './PetForm.module.scss';
import { petValidationSchema } from '../../schemas/schemas.js';
import {
  useCreatePetMutation,
  useGetPetTypesQuery,
} from '../../store/petApi.js';
import Button from '../Button/Button.jsx';

const initialValues = {
  name: '',
  owner: '',
  ownerContacts: '',
  description: '',
  city: '',
  lostDate: '',
  petTypeId: '',
};

const CITIES = ['Kyiv', 'Dnipro', 'New York'];

const PetForm = () => {
  const {
    data: petTypes = [],
    isLoading: isLoadingPetTypes,
    error: petTypesError,
  } = useGetPetTypesQuery();

  const [createPet, { isLoading: isCreating, error: createError }] =
    useCreatePetMutation();

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
    const petData = {
      ...values,
      petTypeId: Number(values.petTypeId),
    };

    try {
      const { data: createdPet, message } = await createPet(petData).unwrap();

      console.log('CREATED PET:', createdPet);
      window.alert(message);
      resetForm();
    } catch (error) {
      console.error('CREATE PET ERROR:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={classes.page}>
      <section className={classes.formCard}>
        <header className={classes.header}>
          <span className={classes.eyebrow}>Missing pet report</span>

          <h1 className={classes.title}>Help a pet return home</h1>

          <p className={classes.subtitle}>
            Provide the information that will help people recognize and find the
            animal.
          </p>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={petValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm className={classes.form}>
              <div className={classes.formGrid}>
                <div className={classes.field}>
                  <label htmlFor="name">Pet name</label>

                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="For example, Buddy"
                    autoFocus
                  />

                  <ErrorMessage
                    name="name"
                    component="span"
                    className={classes.error}
                  />
                </div>

                <div className={classes.field}>
                  <label htmlFor="owner">Owner</label>

                  <Field
                    id="owner"
                    name="owner"
                    type="text"
                    placeholder="Owner's full name"
                  />

                  <ErrorMessage
                    name="owner"
                    component="span"
                    className={classes.error}
                  />
                </div>

                <div className={classes.field}>
                  <label htmlFor="ownerContacts">Owner contacts</label>

                  <Field
                    id="ownerContacts"
                    name="ownerContacts"
                    type="tel"
                    placeholder="+380..."
                  />

                  <ErrorMessage
                    name="ownerContacts"
                    component="span"
                    className={classes.error}
                  />
                </div>

                <div className={classes.field}>
                  <label htmlFor="lostDate">Lost date</label>

                  <Field id="lostDate" name="lostDate" type="date" />

                  <ErrorMessage
                    name="lostDate"
                    component="span"
                    className={classes.error}
                  />
                </div>

                <div className={classes.field}>
                  <label htmlFor="city">City</label>

                  <Field id="city" name="city" as="select">
                    <option value="">Select city</option>

                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="city"
                    component="span"
                    className={classes.error}
                  />
                </div>

                <div className={classes.field}>
                  <label htmlFor="petTypeId">Animal type</label>

                  <Field
                    id="petTypeId"
                    name="petTypeId"
                    as="select"
                    disabled={isLoadingPetTypes}
                  >
                    <option value="" disabled>
                      {isLoadingPetTypes ? 'Loading types...' : 'Choose animal'}
                    </option>

                    {petTypes.map(({ id, type }) => (
                      <option key={id} value={id}>
                        {type}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="petTypeId"
                    component="span"
                    className={classes.error}
                  />

                  {petTypesError && (
                    <span className={classes.error}>
                      Failed to load animal types
                    </span>
                  )}
                </div>

                <div className={`${classes.field} ${classes.fullWidth}`}>
                  <label htmlFor="description">Description</label>

                  <Field
                    id="description"
                    name="description"
                    as="textarea"
                    placeholder="Color, size, distinctive features, collar..."
                  />

                  <ErrorMessage
                    name="description"
                    component="span"
                    className={classes.error}
                  />
                </div>
              </div>

              {createError && (
                <div className={classes.serverError} role="alert">
                  {createError.data?.message ?? 'Failed to create pet'}
                </div>
              )}

              <div className={classes.submitRow}>
                <Button
                  type="submit"
                  disabled={isSubmitting || isCreating || isLoadingPetTypes}
                  value={isCreating ? 'Creating...' : 'Create pet'}
                />
              </div>
            </FormikForm>
          )}
        </Formik>
      </section>
    </main>
  );
};

export default PetForm;
