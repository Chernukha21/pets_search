import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import classes from './RootLayout.module.scss';

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const home = location.pathname === '/';
  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <nav className={classes.navigation}>
          {home ? (
            ''
          ) : (
            <button
              type="button"
              className={classes.backButton}
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          )}

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${classes.link} ${isActive ? classes.active : ''}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pets"
            className={({ isActive }) =>
              `${classes.link} ${isActive ? classes.active : ''}`
            }
          >
            Pets
          </NavLink>

          <NavLink
            to="/form"
            className={({ isActive }) =>
              `${classes.link} ${isActive ? classes.active : ''}`
            }
          >
            Create pet
          </NavLink>
        </nav>
      </header>

      <main className={classes.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
