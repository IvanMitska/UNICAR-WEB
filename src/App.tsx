import { Suspense, lazy, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

/**
 * Управление прокруткой между страницами.
 *
 * Переход вперёд (клик по ссылке) — в начало страницы.
 * Возврат назад/вперёд по истории — на то место, где пользователь ушёл:
 * открыл карточку машины из середины каталога и вернулся — каталог
 * остаётся там же, а не отматывается в начало.
 */
const SCROLL_KEY_PREFIX = 'scroll:';

const readScroll = (key: string): number | null => {
  try {
    const value = sessionStorage.getItem(SCROLL_KEY_PREFIX + key);
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
};

const writeScroll = (key: string, offset: number) => {
  try {
    sessionStorage.setItem(SCROLL_KEY_PREFIX + key, String(offset));
  } catch {
    // приватный режим — просто не запоминаем позицию
  }
};

const ScrollManager = () => {
  const { key } = useLocation();
  const navigationType = useNavigationType();

  /**
   * Позиция покидаемой страницы сохраняется в cleanup layout-эффекта: он
   * срабатывает раньше, чем следующий экран успевает сдвинуть страницу.
   * Слушать scroll нельзя — событие от нашей же прокрутки в начало
   * записывало ноль поверх позиции каталога, и возврат уходил в шапку.
   */
  useLayoutEffect(() => () => writeScroll(key, window.scrollY), [key]);

  // На случай закрытия или перезагрузки вкладки
  useEffect(() => {
    const save = () => writeScroll(key, window.scrollY);
    window.addEventListener('pagehide', save);
    return () => window.removeEventListener('pagehide', save);
  }, [key]);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Назад/вперёд — возвращаем позицию, обычный переход — в начало
    const target = (navigationType === 'POP' ? readScroll(key) : null) ?? 0;

    // Контент может дорисовываться (ленивые чанки, изображения), поэтому
    // повторяем несколько кадров, пока страница не дорастёт до нужной высоты
    let frames = 0;
    let raf = 0;
    const apply = () => {
      window.scrollTo({ top: target, left: 0, behavior: 'instant' });
      if (Math.abs(window.scrollY - target) > 2 && frames++ < 30) {
        raf = requestAnimationFrame(apply);
      }
    };
    apply();

    return () => cancelAnimationFrame(raf);
  }, [key, navigationType]);

  return null;
};

// Lazy load less frequently visited pages
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage').then(m => ({ default: m.CarDetailsPage })));
const MotorcyclesPage = lazy(() => import('./pages/MotorcyclesPage').then(m => ({ default: m.MotorcyclesPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const ContactsPage = lazy(() => import('./pages/ContactsPage').then(m => ({ default: m.ContactsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const BookingConfirmationPage = lazy(() => import('./pages/BookingConfirmationPage').then(m => ({ default: m.BookingConfirmationPage })));
const SignInPage = lazy(() => import('./pages/SignInPage').then(m => ({ default: m.SignInPage })));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <ScrollManager />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Auth pages - without Layout */}
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Main pages - with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="cars" element={<CarsPage />} />
              <Route path="cars/:id" element={<CarDetailsPage />} />
              <Route path="motorcycles" element={<MotorcyclesPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="favorites" element={<Navigate to="/profile" replace />} />
              <Route path="buy" element={<Navigate to="/cars" replace />} />
              <Route path="about" element={<Navigate to="/" replace />} />
            </Route>

            {/* Unknown URLs render nothing otherwise — send them home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;