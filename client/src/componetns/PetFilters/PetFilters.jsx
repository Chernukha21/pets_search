import Select from '../Select/Select.jsx';
import classes from './PetFilters.module.scss';

const FOUND_OPTIONS = [
  { value: '', label: 'All pets' },
  { value: 'true', label: 'Found' },
  { value: 'false', label: 'Still missing' },
];

const PetFilters = ({
  petTypes,
  selectedTypes,
  foundFilter,
  setSelectedTypes,
  setFoundFilter,
  isLoading,
}) => {
  const handleTypeChange = (event) => {
    const { value, checked } = event.target;

    setSelectedTypes((previousTypes) =>
      checked
        ? [...previousTypes, value]
        : previousTypes.filter((id) => id !== value)
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setFoundFilter('');
  };

  return (
    <div className={classes.filters}>
      <span className={classes.title}>Choose a type of pet</span>

      <button
        type="button"
        className={classes.resetButton}
        onClick={handleReset}
        disabled={!selectedTypes.length && !foundFilter}
      >
        Show All Pets
      </button>

      {petTypes.map((petType) => {
        const inputId = `pet-type-${petType.id}`;
        const value = String(petType.id);

        return (
          <div className={classes.checkboxGroup} key={petType.id}>
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
        onChange={setFoundFilter}
        disabled={isLoading}
      />
    </div>
  );
};

export default PetFilters;
