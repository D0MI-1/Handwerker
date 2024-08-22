import React, { useState } from 'react';
import '../styles/components/EditBaustellePopup.css';

const EditBaustellePopup = ({ baustelle, onSave, onCancel }) => {
    const [editedBaustelle, setEditedBaustelle] = useState(baustelle);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBaustelle(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedBaustelle);
    };

    return (
        <div className="edit-baustelle-overlay">
            <div className="edit-baustelle-popup">
                <h2>Edit Baustelle</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={editedBaustelle.name}
                        onChange={handleChange}
                        placeholder="Baustelle Name"
                        required
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={editedBaustelle.startDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={editedBaustelle.endDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="maschinenrate"
                        value={editedBaustelle.maschinenrate}
                        onChange={handleChange}
                        placeholder="Maschinenrate"
                        required
                    />
                    <input
                        type="number"
                        name="fahrzeugrate"
                        value={editedBaustelle.fahrzeugrate}
                        onChange={handleChange}
                        placeholder="Fahrzeugrate"
                        required
                    />
                    <input
                        type="number"
                        name="stundenrate"
                        value={editedBaustelle.stundenrate}
                        onChange={handleChange}
                        placeholder="Stundenrate"
                        required
                    />
                    <div className="popup-buttons">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBaustellePopup;