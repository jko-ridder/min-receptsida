import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const EditRecipeForm = ({ recipe, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: recipe.title,
        description: recipe.description,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '', // Convert array to string with new lines
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : '',
        image: recipe.image // Convert array to string with new lines
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/recipes/${recipe._id}`, {
                title: formData.title,
                description: formData.description,
                ingredients: formData.ingredients.split('\n'), // Split the string into an array
                instructions: formData.instructions.split('\n'), // Split the string into an array
                image: formData.image
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onSave(); // Close the modal and update the page after successful submission
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    return (
        <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="modal-dialog modal-dialog-centered modal-lg mt-5"
    aria-labelledby="editRecipeModalLabel"
    style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, content: { background: '#fff', padding: '20px' } }} 
>
            <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
    <h5 className="modal-title" id="editRecipeModalLabel">Edit Recipe</h5>
    <button type="button" className="btn-close" onClick={onClose}></button>
</div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title:</label>
                            <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ingredients" className="form-label">Ingredients:</label>
                            <textarea className="form-control" id="ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="instructions" className="form-label">Instructions:</label>
                            <textarea className="form-control" id="instructions" name="instructions" value={formData.instructions} onChange={handleChange}></textarea>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="image" className='form-label'>Bild(URL):</label>
                            <textarea className="form-control" id="image" name='image' value={formData.image} onChange={handleChange}></textarea>

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditRecipeForm;
