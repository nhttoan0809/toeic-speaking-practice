import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Home from './pages/home/HomePage';
import SpeakingWriting from './pages/speaking-writing/SpeakingWritingPage';
import AdminLogin from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/toeic-speaking-practice" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="speaking-writing" element={<SpeakingWriting />} />

          {/* Admin Routes */}
          <Route path="admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
