import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';
import '../RecipePage.css';

function RecipePage() {
  const [recipe, setRecipe] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const location = useLocation();
  const recipeId = location.pathname.split('/').pop();


useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipe(response.data);
        setCompletedSteps(new Array(response.data.instructions.length).fill(false));
  
        setIsLoadingComments(true);
        const commentsResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/comments`);
  
        const commentsWithUserInfo = await Promise.all(commentsResponse.data.map(async (comment) => {
          if (comment.user && comment.user.$oid) {
            const userResponse = await axios.get(`${API_BASE_URL}/api/users/${comment.user.$oid}`);
            return {
              ...comment,
              user: userResponse.data,
            };
          } else {
            return comment;
          }
        }));
  
        setComments(commentsWithUserInfo);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };
  
    fetchRecipe();
  }, [recipeId]);
  

  const handleStepClick = (index) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
  };

  const handleCommentSubmit = async () => {
    setCommentError(null);
  
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/recipes/${recipeId}/comments`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setCommentText('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Failed to add comment. Please try again.');
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-page">
      <h1>{recipe.title}</h1>
      <img src={recipe.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbBznjz44UMQEBvKX3FppyjMFajU47p-7Hs1A8Y91kpA&s'} alt="Recipe" className="recipe-image" />
      <p><strong>Beskrivning:</strong> {recipe.description}</p>
      <div className="recipe-details">
        <div className="left-section">
          <h2>Ingredienser:</h2>
          <ul>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="right-section">
          <h2>Instruktioner:</h2>
          <ul>
            {recipe.instructions && recipe.instructions.map((instruction, index) => (
              <li key={index}>
                <span className={`instruction ${completedSteps[index] ? 'completed' : ''}`} onClick={() => handleStepClick(index)}>
                  {instruction}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Kommentarer</h2>
      {isLoadingComments ? (
        <p>Laddar kommentarer...</p>
      ) : (
        <div className="comments">
          {comments.length === 0 ? (
            <p>Inga kommentarer än.</p>
          ) : (
            <ul>
                <hr />
                {comments.map((comment) => (
  <li key={comment._id}>
    <p>Author: {comment.user ? comment.user.username : 'Unknown'}</p>
    <p>Created At: {comment.createdAt}</p>
    <p>{comment.text}</p>
    <hr />
  </li>
))}
              
            </ul>
          )}
          <div className="comment-form">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Skriv en kommentar" />
            <button type="button" disabled={!commentText} onClick={handleCommentSubmit}>
              Lägg till kommentar
            </button>
            {commentError && <p className="error-message">{commentError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipePage;
