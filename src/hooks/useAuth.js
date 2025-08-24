import { useContext, createContext } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const user = useSelector(state => state.user?.user);
  const loading = useSelector(state => state.user?.loading);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 