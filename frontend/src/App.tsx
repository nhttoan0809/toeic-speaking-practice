import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import SpeakingWriting from './pages/SpeakingWriting';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
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
