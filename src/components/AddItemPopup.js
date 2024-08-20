import React, { useState } from 'react';
import '../styles/components/AddItemPopup.css';
import {GiGearHammer} from "react-icons/gi";
import {FaBoxes, FaTruck} from "react-icons/fa";

const AddItemPopup = ({ selectedCategory, onClose, onConfirm }) => {
    const categoryInputFields = {
        People: [
            { name: 'name', placeholder: 'Name' },
            { name: 'position', placeholder: 'Position' },
            { name: 'stundenlohn', placeholder: 'Stundenlohn' },
        ],
        Vehicles: [
            { name: 'kennzeichen', placeholder: 'Kennzeichen' },
            { name: 'model', placeholder: 'Model' },
            { name: 'fahrer', placeholder: 'Fahrer' },
        ],
        Machines:[
            { name: 'marke', placeholder: 'Marke' },
            { name: 'model', placeholder: 'Model' },
            { name: 'baujahr', placeholder: 'Baujahr' },
        ],
        Material:[
            { name: 'hersteller', placeholder: 'Hersteller' },
            { name: 'typ', placeholder: 'Typ' },
            { name: 'haendler', placeholder: 'Händler' },
        ]

    };

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        stundenlohn: '',
        kennzeichen: '',
        model: '',
        fahrer: '',
        marke: '',
        baujahr: '',
        hersteller: '',
        typ: '',
        haendler: '',
        // Add more fields if necessary
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (formData.hasOwnProperty(name)) { // Check if field exists in formData
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleConfirm = () => {
        const newItem = { ...formData }; // Create a copy of formData
        onConfirm(newItem); // Pass the new item data to the confirmation handler (optional)
        onClose(); // Close the popup after confirmation
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add New {selectedCategory}</h2>
                {categoryInputFields[selectedCategory] && (
                    categoryInputFields[selectedCategory].map((field) => (
                        <input
                            key={field.name}
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                        />
                    ))
                )}
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default AddItemPopup;