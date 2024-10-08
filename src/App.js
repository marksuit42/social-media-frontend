import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import AppRoutes from './routes'; // Assuming you have a routes file
import ChatBox from './components/ChatBox'; // 
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <NavigationBar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        <AppRoutes setIsSignedIn={setIsSignedIn} />
        {isSignedIn && <ChatBox />} {/* Render ChatBox only if signed in */}
      </div>
    </Router>
  );
};

export default App;