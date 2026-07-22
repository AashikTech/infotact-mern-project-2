import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Search from './pages/Search';
import AdminUsers from './pages/AdminUsers';
import Shop from './pages/Shop';
import Cart from './pages/Cart';

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return <Navigate to="/shop" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>}>
            <Route index element={<Products />} />
            <Route path="products" element={<Products />} />
            <Route path="search" element={<Search />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/shop" element={<ProtectedRoute requiredRole="customer"><Shop /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute requiredRole="customer"><Cart /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
