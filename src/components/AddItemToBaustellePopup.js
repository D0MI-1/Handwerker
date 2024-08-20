import React, {useState} from 'react';
import '../styles/components/AddItemPopup.css';

const AddItemToBaustellePopup = ({ items, onSelect, onClose, category }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleConfirm = () => {
        if (selectedItem) {
            onSelect(selectedItem);
        }
        onClose();
    };

    const renderItemAttributes = (item) => {
        switch (category) {
            case 'People':
                return `${item.name}`;
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
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add {category} to Baustelle</h2>
                {items.length > 0 ? (
                    <div className="item-list">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => setSelectedItem(item)}
                            >
                                {renderItemAttributes(item)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No items available for this category.</p>
                )}
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleConfirm} disabled={!selectedItem || items.length === 0}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddItemToBaustellePopup;
