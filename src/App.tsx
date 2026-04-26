import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CataloguePage } from './pages/CataloguePage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { CartPage } from './pages/CartPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AccountPage } from './pages/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
              <Route path="/catalogue" element={<AppLayout><CataloguePage /></AppLayout>} />
              <Route path="/catalogue/:attractionId" element={<AppLayout><AttractionDetailPage /></AppLayout>} />
              <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
              <Route path="/orders" element={<AppLayout><OrderHistoryPage /></AppLayout>} />
              <Route path="/account" element={<AppLayout><AccountPage /></AppLayout>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
