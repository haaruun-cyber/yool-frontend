import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { DashboardSkeleton } from './components/shared/Skeleton';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const AuthCallback = lazy(() => import('./pages/AuthCallback.jsx'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const SharedDocs = lazy(() => import('./pages/SharedDocs.jsx'));
const PrivateDocs = lazy(() => import('./pages/PrivateDocs.jsx'));
const Templates = lazy(() => import('./pages/Templates.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const DocumentEditor = lazy(() => import('./pages/DocumentEditor.jsx'));

export default function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="shared" element={<SharedDocs />} />
            <Route path="private" element={<PrivateDocs />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="doc/:id" element={<DocumentEditor />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
