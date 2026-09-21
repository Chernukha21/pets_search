import Button from '../Button/Button.jsx';
import classes from './PetCard.module.scss';

const PetCard = ({
  pet,
  isFound,
  onDelete,
  onEdit,
  isDeleting,
  isUpdating,
}) => {
  return (
    <article className={classes.petCard}>
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
          <span className={classes.value}>{pet.ownerContacts}</span>
        </p>

        <p className={classes.infoRow}>
          <span className={classes.label}>Type</span>
          <span className={classes.value}>{pet.type}</span>
        </p>
        <p className={classes.infoRow}>
          <span className={classes.label}>Status</span>
          <input
            type="checkbox"
            checked={isFound}
            onChange={() => onEdit(pet)}
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
          onClick={() => onDelete(pet.id)}
          disabled={isDeleting}
          value={isDeleting ? 'Deleting' : 'Delete Pet'}
        />
      </div>
    </article>
  );
};

export default PetCard;
