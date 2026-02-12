import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layout/PublicLayout';
import AdminLayout from './layout/AdminLayout';
import { Home, About, Projects, Certificates, Blog, Contact } from './pages/Public';
import { Login, AdminDashboard, AdminAbout, AdminProjects, AdminCertificates, AdminBlog, AdminContact, AdminExperience } from './pages/Admin';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - In a real app, wrap these in a ProtectedRoute component */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="contact" element={<AdminContact />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;