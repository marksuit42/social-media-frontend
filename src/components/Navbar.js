import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import FollowRequests from './FollowRequests';

const NavbarComponent = () => {
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
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isSignedIn ? (
              <>
                <SearchBar /> {/* Add the SearchBar component */}
                <FollowRequests /> {/* Add the FollowRequests component */}
                <Button variant="outline-light" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;