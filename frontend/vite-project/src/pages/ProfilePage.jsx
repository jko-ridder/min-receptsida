import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditRecipeForm from '../components/EditRecipeForm';
import DeleteRecipeModal from '../components/DeleteRecipeModal';
import API_BASE_URL from '../config';
import '../ProfilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('own');

    useEffect(() => {
        const fetchUserDataAndRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await axios.get('http://localhost:3000/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (!userResponse.data.user) {
                    console.error('User data not found');
                    return;
                }
        
                setUserData(userResponse.data.user);
        
                const userId = userResponse.data.user.userId;
        
                const recipesResponse = await axios.get(`http://localhost:3000/api/recipes/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserRecipes(recipesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data and recipes:', error);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/recipes/saved-recipes', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSavedRecipes(response.data);
            } catch (error) {
                console.error('Error fetching saved recipes:', error);
            }
        };

        fetchUserDataAndRecipes();
        fetchSavedRecipes();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getDisplayedRecipes = () => {
        if (activeTab === 'own') {
            return userRecipes;
        } else {
            return savedRecipes;
        }
    };

    const isRecipeLikedByCurrentUser = (recipeId) => {
    };

    const handleEditRecipe = (recipeId) => {
        const recipeToEdit = userRecipes.find(recipe => recipe._id === recipeId);
        setEditingRecipe(recipeToEdit);
        setIsModalOpen(true);
    };

    const handleCloseEditForm = () => {
        setIsModalOpen(false);
        setEditingRecipe(null);
    };

    const handleSaveChanges = async () => {
        setIsModalOpen(false);
        try {
            const token = localStorage.getItem('token');
            const recipesResponse = await axios.get(`http://localhost:3000/api/recipes/user/${userData.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserRecipes(recipesResponse.data);
        } catch (error) {
            console.error('Error fetching updated recipes:', error);
        }
    };

    const handleDeleteConfirmation = (recipeId) => {
        setRecipeToDelete(recipeId);
        setShowDeleteModal(true);
    };

    const handleDeleteRecipe = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/recipes/${recipeToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedRecipes = userRecipes.filter(recipe => recipe._id !== recipeToDelete);
            setUserRecipes(updatedRecipes);
            setShowDeleteModal(false);
            setDeleteSuccess(true);
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleUnlikeRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const likedRecipeIndex = isRecipeLikedByCurrentUser(recipeId);
            if (likedRecipeIndex !== -1 && likedRecipeIndex < savedRecipes.length) {
                setSavedRecipes(prevRecipes => {
                    const updatedRecipes = [...prevRecipes];
                    updatedRecipes[likedRecipeIndex].liked = false;
                    return updatedRecipes;
                });
    
                return;
            }
    

            await axios.post(`${API_BASE_URL}/api/recipes/${recipeId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const response = await axios.get(`${API_BASE_URL}/api/recipes/saved-recipes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            setSavedRecipes(response.data);
        } catch (error) {
            console.error('Error unliking recipe:', error);
        }
    };
    return (
        <div className="container mt-5">
            <h3>Welcome to Your Profile</h3>
            <div className="tabs">
                <button className={activeTab === 'own' ? 'active' : ''} onClick={() => handleTabChange('own')}>Your Recipes</button>
                <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => handleTabChange('saved')}>Saved Recipes</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {userData && (
                        <div>
                            <h2 className="mb-4">Logged in as: {userData.username}</h2>
                        </div>
                    )}
                    <ul className="list-group">
                    {getDisplayedRecipes().map(recipe => (
    <li key={recipe._id} className="list-group-item">
        <img src={recipe.image} alt="recipe-image" className='recipe-image'/>
        <h3>{recipe.title}</h3>
        <p>Description: {recipe.description}</p>
        {activeTab === 'own' ? (
            <>
                <button className="btn btn-primary mr-2" onClick={() => handleEditRecipe(recipe._id)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(recipe._id)}>Delete</button>
            </>
        ) : (
            <button className="btn btn-secondary" onClick={() => handleUnlikeRecipe(recipe._id)}>Unlike</button>
        )}
    </li>
))}
                    </ul>
                    {editingRecipe && (
                        <EditRecipeForm
                            recipe={editingRecipe}
                            isOpen={isModalOpen}
                            onClose={handleCloseEditForm}
                            onSave={handleSaveChanges}
                        />
                    )}
                    <DeleteRecipeModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteRecipe} />
                    {deleteSuccess && (
                        <div className="alert alert-success" role="alert">
                            Recipe deleted successfully!
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;
