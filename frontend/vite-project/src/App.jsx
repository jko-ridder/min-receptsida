import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer.jsx';
import RecipeList from './components/RecipeList';
import LoginPage from './pages/Login.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CreateRecipe from './pages/CreateRecipe.jsx';
import './App.css';
import API_BASE_URL from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './pages/RegisterPage.jsx';
import RecipePage from './pages/RecipePage.jsx';


function App() {
  return (
    <Router>
      <Header/>
      <div className="content-wrapper">
      <Routes>
        <Route exact path="/" element={<RecipeList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/create-recipe" Component={CreateRecipe} />
        <Route path="/recipe/:id" element={<RecipePage />} />

      </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
