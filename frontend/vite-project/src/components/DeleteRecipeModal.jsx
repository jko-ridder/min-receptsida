import React from 'react';
import Modal from 'react-modal';
import Button from './Button';
const DeleteRecipeModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-dialog modal-dialog-centered"
            aria-labelledby="deleteRecipeModalLabel"
            style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, content: { background: '#fff', padding: '20px', maxWidth: '500px', margin: '0 auto' } }}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="deleteRecipeModalLabel">Confirm Deletion</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this recipe?</p>
                </div>
                <div className="modal-footer">
                    <Button className="btn btn-secondary" onClick={onClose}>Cancel</Button>
                    <Button className="btn btn-danger" onClick={onConfirm}>Delete</Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteRecipeModal;
