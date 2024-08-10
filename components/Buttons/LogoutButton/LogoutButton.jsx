import { useState } from 'react';
import styles from './LogoutButton.module.css';

const LogoutButton = ({ loading, onClick }) => {
  return (
    <button
      className={`${styles.customBtn} ${styles.btn10} ${loading ? styles.loading : ''}`}
      onClick={loading ? null : onClick}
      disabled={loading}
    >
      {loading ? (
        <div className="loader" >'Logout'</div>// Optional: Add a loader if needed
      ) : (
        'Logout'
      )}
    </button>
  );
};

export default LogoutButton;
