import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import GlobalHomeButton from '@/components/Navigation/GlobalHomeButton';
import LoadingScreen from '@/components/ui/LoadingScreen';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SuperAdminRoute from '@/components/Navigation/SuperAdminRoute';

// Lazy load route pages for maximum initial load performance
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const CreateProposal = lazy(() => import('@/pages/Proposal/CreateProposal'));
const EditProposal = lazy(() => import('@/pages/Proposal/EditProposal'));
const SavedProposals = lazy(() => import('@/pages/Proposal/SavedProposals'));
const ProposalPreview = lazy(() => import('@/pages/Proposal/ProposalPreview'));
const UserProfile = lazy(() => import('@/pages/Users/UserProfile'));

// New Strategic Pages
const ActiveDrafts = lazy(() => import('@/pages/Strategic/ActiveDrafts'));
const InstitutionalAssets = lazy(() => import('@/pages/Strategic/InstitutionalAssets'));
const ClientNetwork = lazy(() => import('@/pages/Strategic/ClientNetwork'));
const SuperAdminLayout = lazy(() => import('@/components/Layout/SuperAdminLayout'));
const SuperAdminDashboard = lazy(() => import('@/pages/SuperAdmin/SuperAdminDashboard'));
const SuperAdminUsers = lazy(() => import('@/pages/SuperAdmin/SuperAdminUsers'));
const SuperAdminProposals = lazy(() => import('@/pages/SuperAdmin/SuperAdminProposals'));
const ErrorPage = lazy(() => import('@/pages/Error/ErrorPage'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || "";
        const isDomainAuthorized = email.endsWith("@weblozy.com") || email.endsWith("@weblozy.in");
        
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if ((user.emailVerified || isLocal) && isDomainAuthorized) {
          setUser(user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isOnline) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ErrorPage type="offline" />
      </Suspense>
    );
  }

  return (
    <Router>
      <GlobalHomeButton />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          
          <Route path="/saved" element={user ? <SavedProposals /> : <Navigate to="/login" />} />
          <Route path="/drafts" element={user ? <ActiveDrafts /> : <Navigate to="/login" />} />
          <Route path="/assets" element={user ? <InstitutionalAssets /> : <Navigate to="/login" />} />
          <Route path="/clients" element={user ? <ClientNetwork /> : <Navigate to="/login" />} />
        
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/create" 
            element={user ? <CreateProposal /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/edit/:id" 
            element={user ? <EditProposal /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/preview/:id" 
            element={user ? <ProposalPreview /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/profile" 
            element={user ? <UserProfile /> : <Navigate to="/login" />} 
          />

          {/* SUPER ADMIN ROUTES */}
          <Route path="/super-admin" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
            <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="proposals" element={<SuperAdminProposals />} />
            <Route path="*" element={<div className="p-8 text-white">Module Under Construction</div>} />
          </Route>
          
          <Route path="*" element={<ErrorPage type="404" />} />
        </Routes>
      </Suspense>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
