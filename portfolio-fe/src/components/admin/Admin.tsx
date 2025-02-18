import React from 'react';
import AdminProjects from './AdminProjects';
import AdminTestimonials from './AdminTestimonials';
import styles from './Admin.module.css';

const Admin = () => {
  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>
      <AdminProjects />
      <AdminTestimonials />
    </div>
  );
};

export default Admin;