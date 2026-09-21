import { useState } from 'react';
import {
  useDeletePetMutation,
  useGetPetsQuery,
  useGetPetTypesQuery,
  useUpdatePetMutation,
} from '../../store/petApi.js';
import classes from './PetsList.module.scss';
import PetCard from '../../componetns/PetCard/PetCard.jsx';
import PetFilters from '../../componetns/PetFilters/PetFilters.jsx';

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
  const petsWithTypes = pets.map((pet) => ({
    ...pet,
    type:
      petTypes.find((petType) => petType.id === pet.petTypeId)?.type ??
      'Unknown',
  }));

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (!confirmed) {
      return;
    }

    try {
      await deletePet(id).unwrap();
    } catch (error) {
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
      window.alert(error.data?.message ?? 'Failed to update pet');
    }
  };

  if (isLoadingPets || isLoadingPetTypes) {
    return <p>Loading pets...</p>;
  }

  return (
    <>
      <PetFilters
        petTypes={petTypes}
        selectedTypes={selectedTypes}
        foundFilter={foundFilter}
        setSelectedTypes={setSelectedTypes}
        setFoundFilter={setFoundFilter}
        isLoading={isLoadingPets}
      />
      <div className={classes.petsList}>
        {petsWithTypes.length === 0 && (
          <p>No pets match the selected filters</p>
        )}
        {petsWithTypes.map((pet) => {
          const isFound = pet.isFound ?? pet.is_found;
          return (
            <PetCard
              pet={pet}
              key={pet.id}
              isFound={Boolean(isFound)}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          );
        })}
      </div>
    </>
  );
};

export default PetsList;
