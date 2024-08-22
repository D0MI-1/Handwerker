import React, { useState } from 'react';
import '../styles/components/AddBaustellePopup.css';

const AddBaustellePopup = ({ onClose, onConfirm }) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        maschinenrate: '',
        fahrzeugrate: '',
        stundenrate: ''
    });

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
                <h2>Add New Baustelle</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Baustelle Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="maschinenrate"
                    value={formData.maschinenrate}
                    onChange={handleChange}
                    placeholder="Maschinenrate"
                    required
                />
                <input
                    type="number"
                    name="fahrzeugrate"
                    value={formData.fahrzeugrate}
                    onChange={handleChange}
                    placeholder="Fahrzeugrate"
                    required
                />
                <input
                    type="number"
                    name="stundenrate"
                    value={formData.stundenrate}
                    onChange={handleChange}
                    placeholder="Stundenrate"
                    required
                />
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default AddBaustellePopup;