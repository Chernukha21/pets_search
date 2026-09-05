import * as Yup from 'yup';

export const petValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Pet name is required')
    .max(50, 'Name is too long'),

  owner: Yup.string()
    .required('Owner name is required')
    .max(100, 'Owner name is too long'),

  ownerContacts: Yup.string()
    .required('Contact information is required')
    .max(200, 'Contact information is too long'),

  description: Yup.string().max(
    1000,
    'Description cannot exceed 1000 characters'
  ),

  city: Yup.string()
    .required('City is required')
    .max(100, 'City name is too long'),

  lostDate: Yup.date()
    .required('Date lost is required')
    .max(new Date(), 'Date cannot be in the future')
    .typeError('Please enter a valid date'),

  petTypeId: Yup.number().required('Pet type is required'),
});
