import * as Yup from 'yup';

const CITIES = ['Kyiv', 'Dnipro', 'New York'];

export const petValidationSchema = Yup.object({
  name: Yup.string()
    .required('Pet name is required')
    .max(32, 'Name cannot exceed 32 characters'),

  owner: Yup.string()
    .required('Owner name is required')
    .max(64, 'Owner name cannot exceed 64 characters'),

  ownerContacts: Yup.string()
    .required('Contact information is required')
    .matches(/^\+\d{12}$/, 'Use international format: + followed by 12 digits'),

  description: Yup.string()
    .required('Description is required')
    .max(255, 'Description cannot exceed 255 characters'),

  city: Yup.string()
    .required('City is required')
    .oneOf(CITIES, 'Please select a valid city'),

  lostDate: Yup.date()
    .required('Date lost is required')
    .max(new Date(), 'Date cannot be in the future')
    .typeError('Please enter a valid date'),

  petTypeId: Yup.number()
    .typeError('Please select a valid pet type')
    .integer('Pet type ID must be an integer')
    .positive('Please select a valid pet type')
    .required('Pet type is required'),
});
