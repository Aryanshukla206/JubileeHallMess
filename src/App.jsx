import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { MenuProvider } from './context/MenuContext';
import { RebateProvider } from './context/RebateContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ResidentDashboard from './pages/ResidentDashboard';
import GuestBookingPage from './pages/GuestBookingPage';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  console.log("h");

  return (
    <ToastProvider>
      <AuthProvider>
        <MenuProvider>
          <BookingProvider>
            <RebateProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/guest-booking" element={<GuestBookingPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['resident']}>
                        <ResidentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/menu"
                    element={
                      <ProtectedRoute allowedRoles={['resident', 'admin']}>
                        <MenuPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute allowedRoles={['resident', 'admin']}>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </RebateProvider>
          </BookingProvider>
        </MenuProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
