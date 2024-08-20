import React, { useState, useEffect } from 'react';
import '../styles/components/EditItemPopup.css';

const EditItemPopup = ({ selectedCategory, item, onClose, onConfirm }) => {
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
        Machines: [
            { name: 'marke', placeholder: 'Marke' },
            { name: 'model', placeholder: 'Model' },
            { name: 'baujahr', placeholder: 'Baujahr' },
        ],
        Material: [
            { name: 'hersteller', placeholder: 'Hersteller' },
            { name: 'typ', placeholder: 'Typ' },
            { name: 'haendler', placeholder: 'Händler' },
        ]
    };

    const [formData, setFormData] = useState(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirm = () => {
        onConfirm(formData);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit {selectedCategory}</h2>
                {categoryInputFields[selectedCategory] && (
                    categoryInputFields[selectedCategory].map((field) => (
                        <input
                            key={field.name}
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required
                        />
                    ))
                )}
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleConfirm}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditItemPopup;