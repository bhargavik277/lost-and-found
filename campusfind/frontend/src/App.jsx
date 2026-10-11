import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import useScrollReveal from './hooks/useScrollReveal'

// Public Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'

// Student Pages
import Dashboard from './pages/Dashboard'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import MyReports from './pages/MyReports'
import Matches from './pages/Matches'
import Claims from './pages/Claims'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminItems from './pages/admin/AdminItems'
import AdminClaims from './pages/admin/AdminClaims'
import AdminUsers from './pages/admin/AdminUsers'

// Security Desk Pages
import SecurityDashboard from './pages/security/SecurityDashboard'

// Inner component so we can read the location for page transitions.
function AppRoutes() {
  const location = useLocation()
  // Kick off the global scroll-reveal observer once for the whole app.
  useScrollReveal()

  return (
    <>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            {/* keying on pathname replays the fade/slide transition on route change */}
            <div key={location.pathname} className="page-transition">
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />

              {/* Student Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-lost"
                element={
                  <ProtectedRoute>
                    <ReportLost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-found"
                element={
                  <ProtectedRoute>
                    <ReportFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reports"
                element={
                  <ProtectedRoute>
                    <MyReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedRoute>
                    <Matches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claims"
                element={
                  <ProtectedRoute>
                    <Claims />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/items"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/claims"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminClaims />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Security Desk Protected Route */}
              <Route
                path="/security"
                element={
                  <ProtectedRoute allowedRoles={['SECURITY', 'ADMIN']}>
                    <SecurityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
          </main>
          <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-indigo-500/15 selection:text-indigo-900 relative">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
