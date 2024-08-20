import React from 'react';
import '../styles/components/DeleteItemConfirmation.css';

const DeleteItemConfirmation = ({ item, category, onConfirm, onCancel }) => {
    const getItemDescription = () => {
        switch (category) {
            case 'People':
                return item.name;
            case 'Vehicles':
                return `${item.kennzeichen} - ${item.model}`;
            case 'Machines':
                return `${item.marke} - ${item.model}`;
            case 'Material':
                return `${item.hersteller} - ${item.typ}`;
            default:
                return item.name;
        }
    };

    return (
        <div className="delete-confirmation-overlay">
            <div className="delete-confirmation-content">
                <h2>Delete Confirmation</h2>
                <p>Are you sure you want to delete {getItemDescription()}?</p>
                <div className="delete-confirmation-buttons">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm} className="delete-button">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteItemConfirmation;