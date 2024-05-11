import React, { useState } from 'react';
import Button from './Button';
import axios from 'axios';

const RecipeForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:3000/api/recipes/add',
                {
                    title,
                    description,
                    ingredients: ingredients.split('\n'),
                    instructions: instructions.split('\n'),
                    image: imageUrl 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                setSuccessMessage('Recipe added successfully.');
                onSubmit();
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            setErrorMessage('Error adding recipe. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded bg-light" style={{ width: '500px', margin: '0 auto' }}>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title:</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                    className="form-control"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="ingredients" className="form-label">Ingredients:</label>
                <textarea
                    className="form-control"
                    id="ingredients"
                    placeholder="Ingredients (One per line)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required 
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="instructions" className="form-label">Instructions:</label>
                <textarea
                    className="form-control"
                    id="instructions"
                    placeholder="Instructions (One step per line)"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required 
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">Image URL:</label>
                <input
                    type="url"
                    className="form-control"
                    id="imageUrl"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    
                />
            </div>
            <Button type="submit" className="btn btn-primary">Submit</Button>
        </form>
    );
}

export default RecipeForm;
