import React, {useState} from 'react';
import { FaUsers, FaTruck, FaBoxes, FaPlus, FaTrash   } from 'react-icons/fa';
import {GiGearHammer} from 'react-icons/gi';
import AddItemPopup from './AddItemPopup';
import EditItemPopup from './EditItemPopup';
import DeleteItemConfirmation from './DeleteItemConfirmation';

const categoryIcons = {
    People: FaUsers,
    Machines: GiGearHammer,
    Vehicles: FaTruck,
    Material: FaBoxes
};

const Sidebar = ({ categories, selectedCategory, setSelectedCategory, items, addItem, updateItem, deleteItem }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const handleAddItem = () => {
        setIsPopupOpen(true);
        console.log('Add item to', selectedCategory);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false); // Hide the popup
    };

    const handlePopupConfirm = (newItem) => {
        addItem(selectedCategory, newItem)
    };

    const handleItemClick = (item) => {
        setEditingItem(item);
        setIsEditPopupOpen(true);
    };

    const handleEditPopupClose = () => {
        setIsEditPopupOpen(false);
        setEditingItem(null);
    };

    const handleEditPopupConfirm = (updatedItem) => {
        updateItem(selectedCategory, updatedItem);
        setIsEditPopupOpen(false);
        setEditingItem(null);
    };

    const handleDeleteClick = (e, item) => {
        e.stopPropagation();
        setDeletingItem(item);
    };

    const handleDeleteConfirm = () => {
        if (deletingItem) {
            deleteItem(selectedCategory, deletingItem);
            setDeletingItem(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeletingItem(null);
    };

    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kennzeichen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.marke?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hersteller?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="sidebar">
            <div className="category-buttons">

                {categories.map(category => {
                    const Icon = categoryIcons[category] || FaUsers; // Default to FaUsers if icon not found
                    const isSelected = selectedCategory === category;
                    const isHovered = hoveredCategory === category;

                    return (
                        <button
                            key={category}
                            title={category}
                            className={`category-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                            onMouseEnter={() => setHoveredCategory(category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <Icon/>
                            {(isHovered || (isSelected && !hoveredCategory)) &&
                                <span className="category-name" style={{marginLeft: '3px'}}>
                                    {category}
                                </span>}
                        </button>
                    );
                })}
            </div>
            <div className="sidebar-footer">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sidebar-search"
                />
                <button className="add-item-btn" onClick={handleAddItem}>
                    <FaPlus/> Add Item
                </button>
            </div>
            <div className="category-items-container">

                <div className="category-items">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className="item"
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {selectedCategory === 'People' && (
                                <>
                                    Name: {item.name} <br/>
                                    Position: {item.position} <br/>
                                </>
                            )}
                            {selectedCategory === 'Vehicles' && (
                                <>
                                    Kennzeichen: {item.kennzeichen} <br />
                                    Model: {item.model} <br />
                                </>
                            )}
                            {selectedCategory === 'Machines' && (
                                <>
                                    Marke: {item.marke} <br />
                                    Model: {item.model} <br />
                                </>
                            )}
                            {selectedCategory === 'Material' && (
                                <>
                                    Hersteller: {item.hersteller} <br />
                                    Typ: {item.typ} <br />
                                </>
                            )}
                            {hoveredItem === item &&(
                                <FaTrash
                                    className={"delete-icon-sidebar-item"}
                                    onClick={(e) => handleDeleteClick(e, item)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {isPopupOpen && (
                <AddItemPopup
                    selectedCategory={selectedCategory}
                    onClose={handlePopupClose}
                    onConfirm={handlePopupConfirm}
                />
            )}
            {isEditPopupOpen && (
                <EditItemPopup
                    selectedCategory={selectedCategory}
                    item={editingItem}
                    onClose={handleEditPopupClose}
                    onConfirm={handleEditPopupConfirm}
                />
            )}
            {deletingItem && (
                <DeleteItemConfirmation
                    item={deletingItem}
                    category={selectedCategory}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default Sidebar;