import React from 'react';
import { FaPlus } from 'react-icons/fa';
import '../styles/components/AddBaustelleButton.css';

const AddBaustelleButton = ({ onClick }) => {
    return (
        <button className="add-baustelle-btn" onClick={onClick}>
            <FaPlus /> Add Baustelle
        </button>
    );
};

export default AddBaustelleButton;