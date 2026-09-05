import { Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootPage/RootLayout.jsx';
import Home from '../pages/Home/Home.jsx';
import PetsList from '../pages/PetsList/PetsList.jsx';
import CreatePet from '../pages/CreatePet/CreatePet.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

export const routes = [
  {
    path: '/',
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'pets',
        element: <PetsList />,
      },
      {
        path: 'form',
        element: <CreatePet />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
];
