import React, { createContext, useState, useEffect } from 'react';

 const AuthContext = createContext();

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userType, email, password) => {
    const users = {
      'company': { 
        email: 'company@company.example.com', 
        password: 'password123',
        name: 'Acme Corporation',
        industry: 'Technology'
      },
      'scad': { 
        email: 'scad@scad.example.com', 
        password: 'scadpass',
        name: 'SCAD Admin'
      },
      'faculty': { 
        email: 'faculty@faculty.example.com', 
        password: 'faculty123',
        name: 'Johnson',
        department: 'Computer Science'
      },
      'pro-student': { 
        email: 'pro@prostudent.example.com', 
        password: 'pro123',
        name: 'Jane Smith',
        major: 'Design',
        year: 'Junior'
      },
      'student': { 
        email: 'student@student.example.com', 
        password: 'student123',
        name: 'John Doe',
        major: 'Computer Science',
        year: 'Sophomore'
      },
    };

    if (users[userType] && users[userType].email === email && users[userType].password === password) {
      const userData = { 
        ...users[userType],
        userType 
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log(`Login successful for ${userType}:`, userData);
      return true;
    }

    console.log(`Login failed for ${userType}. Email: ${email}, Password: ${password}`);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };