import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoundsListPage from './pages/RoundsListPage';
import RoundPage from './pages/RoundPage';

export const router = createBrowserRouter([
    { path: '/', element: <RoundsListPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/rounds/:id', element: <RoundPage /> }
]);