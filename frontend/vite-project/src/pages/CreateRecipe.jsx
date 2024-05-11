import React from 'react';
import RecipeForm from '../components/RecipeForm';

const CreateRecipe = () => {
    const handleSubmit = (recipeData) => {
        console.log('Recipe data:', recipeData);
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div>
                    <h5>Create Recipe</h5>
                </div>
                <div className="card-body">
                    <RecipeForm onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default CreateRecipe;
