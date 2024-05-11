import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import '../RecipeList.css'; 

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recipes/`);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();


    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setLoggedInUser(response.data);
      }).catch(error => {
        console.error('Error fetching logged-in user data:', error);
      });
    }
  }, []);


const handleLike = async (recipeId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!recipeId) {
      console.error('Invalid recipeId:', recipeId);
      return;
    }


    await axios.post(`${API_BASE_URL}/api/recipes/${recipeId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    const response = await axios.get(`${API_BASE_URL}/api/recipes/`);
    setRecipes(response.data);
  } catch (error) {
    console.error('Error liking recipe:', error);
  }
};


  const isRecipeLikedByCurrentUser = (recipeId) => {
    if (!loggedInUser || !loggedInUser._id) {
      return -1;
    }
  
    const likedRecipeIndex = recipes.findIndex(recipe => {
      return recipe._id === recipeId && recipe.likes.some(like => like.$oid === loggedInUser._id.$oid);
    });
  
    return likedRecipeIndex;
  };

  const navigateToRecipe = (recipe) => {
    window.location.href = `/recipe/${recipe._id}`;
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <div>
            <h2>{recipe.title}</h2>
            <img src={recipe.image} alt="Recipe" className="recipe-image" />
            <p>Kock: {recipe.creatorInfo.username}</p>
            <p>Skapad: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            <p>{recipe.description}</p>
          </div>
          <div className="button-container">
            <button onClick={() => navigateToRecipe(recipe)}>Visa recept</button> 
            <button
              className={`heart-button${isRecipeLikedByCurrentUser(recipe._id) !== -1 ? ' liked' : ''}`}
              onClick={() => handleLike(recipe._id)}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <div className='likesDisplay'>
              <p>Antal likes: {recipe.likes && recipe.likes.length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
