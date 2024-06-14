
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneralLayout from './components/GeneralLayout';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './components/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/Product/ProductPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='login' element={<LoginPage />} />
        <Route path='/' element={<ProtectedRoute><GeneralLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path='categories' element={<CategoryPage />} />
          <Route path='product' element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;