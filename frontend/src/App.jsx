import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Exchanges from './pages/Exchanges';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import OfferSkill from './pages/OfferSkill';
import Help from './pages/Help';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-gray-400">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="browse" element={<Browse />} />
        <Route path="help" element={<Help />} />
        <Route path="exchanges" element={<PrivateRoute><Exchanges /></PrivateRoute>} />
        <Route path="messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="messages/:convId" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="offer" element={<PrivateRoute><OfferSkill /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
