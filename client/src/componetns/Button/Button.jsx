import classes from './Button.module.scss';

const Button = ({ value }) => {
  return <button className={classes.button}>{value}</button>;
};

export default Button;
