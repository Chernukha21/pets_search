import classes from './Select.module.scss';

const Select = ({
  id,
  label,
  value,
  options = [],
  onChange,
  disabled = false,
}) => {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className={classes.selectGroup}>
      {label && (
        <label htmlFor={id} className={classes.selectLabel}>
          {label}
        </label>
      )}

      <div className={classes.selectWrapper}>
        <select
          id={id}
          className={classes.select}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        >
          {safeOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className={classes.selectArrow} aria-hidden="true">
          ▼
        </span>
      </div>
    </div>
  );
};

export default Select;
