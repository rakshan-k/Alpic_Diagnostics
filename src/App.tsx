import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import SignIn from './pages/SignIn';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Equipment from './pages/Equipment';
import MaintenanceRecords from './pages/MaintenanceRecords';
import Calendar from './pages/Calendar';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/signin"
            element={!session ? <SignIn /> : <Navigate to="/" replace />}
          />
          <Route
            path="/"
            element={session ? <Layout /> : <Navigate to="/signin" replace />}
          >
            <Route index element={<Navigate to="/customers" replace />} />
            <Route path="customers" element={<Customers />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="maintenance" element={<MaintenanceRecords />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;