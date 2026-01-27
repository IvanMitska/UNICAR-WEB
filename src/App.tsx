import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';

// Scroll to top on route change - instant, no animation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Instant scroll without animation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Lazy load less frequently visited pages
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage').then(m => ({ default: m.CarDetailsPage })));
const MotorcyclesPage = lazy(() => import('./pages/MotorcyclesPage').then(m => ({ default: m.MotorcyclesPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const ContactsPage = lazy(() => import('./pages/ContactsPage').then(m => ({ default: m.ContactsPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cars" element={<CarsPage />} />
            <Route path="cars/:id" element={<CarDetailsPage />} />
            <Route path="motorcycles" element={<MotorcyclesPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="favorites" element={<Navigate to="/profile" replace />} />
            <Route path="buy" element={<Navigate to="/cars" replace />} />
            <Route path="about" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;