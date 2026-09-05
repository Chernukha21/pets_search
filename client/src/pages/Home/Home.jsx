import { Link } from 'react-router-dom';
import catImage from '../../assets/cat.jpg';
import dogImage from '../../assets/dog.jpg';
import parrotImage from '../../assets/parrot.jpg';
import classes from './Home.module.scss';

const Home = () => {
  return (
    <main className={classes.home}>
      <section className={classes.hero}>
        <div className={classes.photoStage}>
          <figure className={`${classes.photoCard} ${classes.catCard}`}>
            <img src={catImage} alt="Lost cat" />
            <figcaption>Cat</figcaption>
          </figure>

          <figure className={`${classes.photoCard} ${classes.dogCard}`}>
            <img src={dogImage} alt="Lost dog" />
            <figcaption>Dog</figcaption>
          </figure>

          <figure className={`${classes.photoCard} ${classes.parrotCard}`}>
            <img src={parrotImage} alt="Lost parrot" />
            <figcaption>Parrot</figcaption>
          </figure>

          <div className={classes.heroContent}>
            <p className={classes.eyebrow}>Lost, but not forgotten</p>

            <h1>
              Every pet deserves to find the way
              <em> home.</em>
            </h1>

            <p className={classes.description}>
              Search missing pet reports or tell the community about an animal
              that needs help.
            </p>

            <div className={classes.actions}>
              <Link to="/pets" className={classes.primaryAction}>
                Explore reports
              </Link>

              <Link to="/form" className={classes.secondaryAction}>
                Report a pet
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <p className={classes.footerText}>Community-powered animal search</p>
    </main>
  );
};

export default Home;
