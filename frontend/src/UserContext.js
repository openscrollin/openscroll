import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // contains { fullName, email, role }
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const readerToken = localStorage.getItem('readerToken');
    const writerToken = localStorage.getItem('writerToken');

    if (storedUser) {
      setUser(storedUser);

      // Assign token based on role
      if (storedUser.role === 'reader' && readerToken) {
        setToken(readerToken);
      } else if (storedUser.role === 'writer' && writerToken) {
        setToken(writerToken);
      } else {
        // fallback if token is missing or role mismatch
        setToken(readerToken || writerToken || null);
      }

      console.log('🔁 Hydrated user context:', storedUser);
    }
  }, []);

  const login = (userData, jwtToken) => {
    localStorage.setItem('openscroll_current_user', JSON.stringify(userData));

    if (userData.role === 'writer') {
      localStorage.setItem('writerToken', jwtToken);
      localStorage.removeItem('readerToken');
    } else {
      localStorage.setItem('readerToken', jwtToken);
      localStorage.removeItem('writerToken');
    }

    setUser(userData);
    setToken(jwtToken);
    console.log('✅ Context updated after login:', userData);
  };

  const logout = () => {
    localStorage.removeItem('openscroll_current_user');
    localStorage.removeItem('readerToken');
    localStorage.removeItem('writerToken');
    setUser(null);
    setToken(null);
    console.log('🚪 Logged out and cleared context.');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
