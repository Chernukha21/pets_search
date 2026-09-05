import { useState } from 'react';
import {
  useDeletePetMutation,
  useGetPetsQuery,
  useGetPetTypesQuery,
  useUpdatePetMutation,
} from '../../store/petApi.js';
import classes from './PetsList.module.scss';
import Button from '../../componetns/Button/Button.jsx';
import Select from '../../componetns/Select/Select.jsx';

const FOUND_OPTIONS = [
  { value: '', label: 'All pets' },
  { value: 'true', label: 'Found' },
  { value: 'false', label: 'Still missing' },
];

const PetsList = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [foundFilter, setFoundFilter] = useState('');
  const { data: pets = [], isLoading: isLoadingPets } = useGetPetsQuery({
    petTypeIds: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
    isFound: foundFilter || undefined,
  });
  const { data: petTypes = [], isLoading: isLoadingPetTypes } =
    useGetPetTypesQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();
  const petsWithIds = pets.map((pet) => ({
    ...pet,
    type:
      petTypes.find((petType) => petType.id === pet.petTypeId)?.type ??
      'Unknown',
  }));

  const handleTypeChange = (event) => {
    const { value, checked } = event.target;

    setSelectedTypes((previousTypes) =>
      checked
        ? [...previousTypes, value]
        : previousTypes.filter((id) => id !== value)
    );
  };

  const handleResetFilter = () => {
    setSelectedTypes([]);
    setFoundFilter('');
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (!confirmed) {
      return;
    }

    try {
      await deletePet(id).unwrap();
    } catch (error) {
      console.error('Failed to delete pet:', error);
      window.alert(error.data?.message ?? 'Failed to delete pet');
    }
  };
  const handleEdit = async (pet) => {
    try {
      await updatePet({
        id: pet.id,
        isFound: !pet.isFound,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update pet:', error);
      window.alert(error.data?.message ?? 'Failed to update pet');
    }
  };
  const handleFoundFilter = (value) => {
    setFoundFilter(value);
  };

  if (isLoadingPets || isLoadingPetTypes) {
    return <p>Loading pets...</p>;
  }

  return (
    <>
      <div className={classes.actions}>
        <span className={classes.label}>Choose a type of pet</span>
        <button
          className={classes.submitBtn}
          onClick={handleResetFilter}
          disabled={!selectedTypes.length && !foundFilter}
        >
          Show All Pets
        </button>
        {petTypes.map((petType) => {
          const inputId = `pet-type-${petType.id}`;
          const value = String(petType.id);

          return (
            <div className={classes['checkbox-group']} key={petType.id}>
              <input
                type="checkbox"
                id={inputId}
                name="petTypeIds"
                value={value}
                checked={selectedTypes.includes(value)}
                onChange={handleTypeChange}
              />

              <label htmlFor={inputId}>{petType.type}</label>
            </div>
          );
        })}
        <Select
          id="found-filter"
          label="Filter by status"
          value={foundFilter}
          options={FOUND_OPTIONS}
          onChange={handleFoundFilter}
          disabled={isLoadingPets}
        />
      </div>
      <div className={classes.petsList}>
        {petsWithIds.length === 0 && <p>No pets match the selected filters</p>}
        {petsWithIds.map((pet) => {
          const isFound = pet.isFound ?? pet.is_found;
          return (
            <article key={pet.id} className={classes.petCard}>
              <h3 className={classes.petName}>{pet.name}</h3>

              <div className={classes.petInfo}>
                <p className={classes.infoRow}>
                  <span className={classes.label}>Owner</span>

                  <span className={classes.value}>{pet.owner}</span>
                </p>

                <p className={classes.infoRow}>
                  <span className={classes.label}>Lost date</span>

                  <span className={classes.value}>{pet.lostDate}</span>
                </p>

                <p className={classes.infoRow}>
                  <span className={classes.label}>Contacts</span>
                  {pet.ownerContacts}
                </p>
                <p className={classes.infoRow}>
                  <span className={classes.label}>Type</span>
                  {pet.type}
                </p>
                <p className={classes.infoRow}>
                  <span className={classes.label}>Status</span>
                  <input
                    type="checkbox"
                    checked={isFound}
                    onChange={() => handleEdit(pet)}
                    disabled={isUpdating}
                  />
                  <span
                    className={`${classes.status} ${
                      isFound ? classes.found : classes.lost
                    }`}
                  >
                    {isFound ? 'Found' : 'Still missing'}
                  </span>
                </p>
                <Button
                  type="button"
                  onClick={() => handleDelete(pet.id)}
                  disabled={isDeleting}
                  value={isDeleting ? 'Deleting' : 'Delete Pet'}
                />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default PetsList;
