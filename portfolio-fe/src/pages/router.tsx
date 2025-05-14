import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Login from '../components/auth/Login';
import AdminProjects from '../components/admin/AdminProjects';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import Home from '../pages/home';
import Projects from '../components/projects/Projects';
import Testimonials from '../pages/testimonials';
import Skills from './skills';
import Contact from '@/components/contact/Contact';

const Router = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/login" element={<Login />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected routes */}
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/testimonials"
        element={
          <ProtectedRoute>
            <AdminTestimonials />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
