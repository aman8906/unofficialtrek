import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { http, USE_MOCK } from './services/api';
import { writeStore } from './lib/store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { UserAuthProvider, RequireUser, DASHBOARD } from './user/UserAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import MyDetails from './pages/dashboard/MyDetails';
import Trips from './pages/dashboard/Trips';
import Wishlist from './pages/dashboard/Wishlist';
import Vouchers from './pages/dashboard/Vouchers';
import { AllTreks, SeasonPage } from './pages/Treks';
import TrekDetail from './pages/TrekDetail';
import Policy from './pages/Policy';
import { ActivityPage, VillagesPage } from './pages/Activity';
//import { WeatherPage, About, Contact, UpcomingPage } from './pages/Info';
import About from './pages/About';
import Explorations from './pages/Explorations';
import StoryDetail from './pages/StoryDetail';
import Trending from './pages/Trending';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import UpcomingTreks from './pages/UpcomingTreks';
import NotFound from './pages/NotFound';
import { AuthProvider, RequireAuth } from './admin/auth';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ResourcePage from './admin/ResourcePage';
import SettingsPage from './admin/SettingsPage';
import { resources } from './admin/resources';

function PublicLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (<><Header /><main><Outlet /></main><Footer /></>);
}

export default function App() {
  // With the real backend, load site settings (logo text, banner, contact) once before the first paint.
  useEffect(() => {
  if (USE_MOCK) return;
  http.get('/settings').then((r) => writeStore('admin:settings', r.data.data)).catch(() => {});
}, []);
  return (
    <UserAuthProvider>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
           
            <Route path="upcoming" element={<UpcomingTreks />} />
            <Route path="treks" element={<AllTreks />} />
            <Route path="treks/season/:season" element={<SeasonPage />} />
            <Route path="treks/:slug" element={<TrekDetail />} />
            <Route path="rafting" element={<ActivityPage type="rafting" />} />
            <Route path="bungee-jumping" element={<ActivityPage type="bungee" />} />
            <Route path="villages" element={<VillagesPage />} />
            
<Route path="weather" element={<NewsPage />} />
<Route path="trending" element={<Trending />} />
<Route path="explorations" element={<Explorations />} />
<Route path="explorations/:slug" element={<StoryDetail />} />

            <Route path="about" element={<About />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* trekker dashboard (after login) */}
          <Route path="/user-dashboard" element={<RequireUser><DashboardLayout /></RequireUser>}>
            <Route index element={<Navigate to="user-myprofile" replace />} />
            <Route path="user-myprofile" element={<MyDetails />} />
            <Route path="user-upcoming" element={<Trips mode="upcoming" />} />
            <Route path="user-previous" element={<Trips mode="previous" />} />
            <Route path="user-wishlist" element={<Wishlist />} />
            <Route path="user-vouchers" element={<Vouchers />} />
          </Route>
          <Route path="/profile" element={<Navigate to={DASHBOARD} replace />} />

          {/* customer login pages: full-page, no site header/footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            {resources.map((r) => <Route key={r.key} path={r.key} element={<ResourcePage key={r.key} res={r} />} />)}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </UserAuthProvider>
  );
}