import classes from './Button.module.scss';

const Button = ({ value, ...props }) => {
  return (
    <button className={classes.button} {...props}>
      {value}
    </button>
  );
};

export default Button;
