import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInForm from './components/SignInForm'; // SignIn component
import SignupForm from './components/SignupForm';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Feed from './pages/Feed';
import { PostProvider } from './context/PostContext'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import FriendList from './pages/FriendList'; // Import the FriendList component

const AppRoutes = ({ setIsSignedIn }) => {
  return (
    <Routes>
      <Route path="/signup" element={<SignupForm />} />  {/* Public route */}
      <Route path="/" element={<SignInForm setIsSignedIn={setIsSignedIn} />} />  {/* Public route */}
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <PostProvider>
              <div className="App">
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                />
                <Feed />
              </div>
            </PostProvider>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;