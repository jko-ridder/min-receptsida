import React from 'react';
import '../Header.css';

function Header() {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  }

  const goToHome = () => {
    window.location.href = '/';
  }

  const goToProfile = () => {
    window.location.href = '/profile'
  }

  const createNewRecipe = () => {
    window.location.href = '/create-recipe'
  }

  return (
    <header className="navbar sticky">
      <nav className="nav-container">
        <ul className="nav-links">
          <li><button onClick={goToHome}>Home</button></li>
        </ul>
        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li><button onClick={goToProfile}>Profile</button></li>
              <li><button onClick={createNewRecipe}>New Recipe</button></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <li><button onClick={handleLogin}>Login</button></li> 
          )}
        </ul>
      </nav>
    </header>
  );  
}

export default Header;
