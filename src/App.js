// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import AppRoutes from './routes'; // Assuming you have a routes file
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div>
        <NavigationBar />
        <AppRoutes />
        <ToastContainer 
        position="top-right"
        autoClose={3000} // Automatically close toast after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
      </div>
    </Router>
  );
};

export default App;
