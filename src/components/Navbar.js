// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import SearchBar from './SearchBar'; // Import the SearchBar component
import FollowRequests from './FollowRequests'; // Import the FollowRequests component

const NavigationBar = () => {
  const navigate = useNavigate();

  // Check if the user is signed in (i.e., a token exists)
  const isSignedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/feed">MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            {isSignedIn && <Nav.Link as={Link} to="/friends">Friends</Nav.Link>} {/* Add Friends link */}
          </Nav>
          <Nav className="ms-auto">
            {isSignedIn && (
              <>
                <SearchBar /> {/* Add the SearchBar component */}
                <FollowRequests /> {/* Add the FollowRequests component */}
                <Button variant="outline-light" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            )}
            {!isSignedIn && (
              <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;