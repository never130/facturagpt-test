import React from 'react';
import styles from './SearchInput.module.css';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.searchContainer}>
      <Search className={styles.searchIcon} size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchInput; 