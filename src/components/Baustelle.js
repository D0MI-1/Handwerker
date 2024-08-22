import React, { useState, useEffect } from 'react';
import '../styles/components/Baustelle.css';
import { FaPlus, FaTrash, FaCopy, FaPaste, FaEdit, FaFileInvoiceDollar   } from 'react-icons/fa';
import AddItemToBaustellePopup from "./AddItemToBaustellePopup";
import TimeEntryEditor from "./TimeEntryEditor";
import TimeFrameEditor from "./TimeFrameEditor";
import DeleteItemConfirmation from "./DeleteItemConfirmation";
import EditBaustellePopup from "./EditBaustellePopup";

const Baustelle = ({
                       id,
                       name,
                       startDate,
                       endDate,
                       maschinenrate,
                       fahrzeugrate,
                       stundenrate,
                       itemsOfBaustelle = [],
                       itemsOfCategory,
                       timeEntries = {},
                       onAddItem,
                       onRemoveItem,
                       selectedCategory,
                       onUpdateTimeEntry,
                       onUpdateBaustelle,
                       onDeleteBaustelle
                   }) => {
    const days = selectedCategory !== 'Material' ? getDaysBetween(startDate, endDate) : [];
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [copiedTimeFrame, setCopiedTimeFrame] = useState(null);
    const [isEditingBaustelle, setIsEditingBaustelle] = useState(false);
    const [isDeletingBaustelle, setIsDeletingBaustelle] = useState(false);


    const handleAddItem = () => {
        setIsAddingItem(true);
    };

    const handleItemSelect = (item) => {
        onAddItem(item);
        setIsAddingItem(false);
    };


    const handleCellClick = (day, itemId) => {
        setEditingEntry({ day: formatDate(day), itemId });
    };

    const handleTimeEntryUpdate = (updatedEntry) => {
        onUpdateTimeEntry(updatedEntry);
        setEditingEntry(null);
    };

    const handleTimeFrameUpdate = (day, itemId, timeFrames) => {
        onUpdateTimeEntry(day, itemId, timeFrames);
        setEditingEntry(null);
    };

    const handleCopyTimeFrame = (day, itemId, timeFrame) => {
        setCopiedTimeFrame({ day, itemId, timeFrame });
    };
    const handlePasteTimeFrame = (day, itemId) => {
        if (copiedTimeFrame && copiedTimeFrame.timeFrame) {
            const currentTimeFrames = timeEntries[day]?.[itemId] || [];
            const updatedTimeFrames = [...currentTimeFrames, { ...copiedTimeFrame.timeFrame }];
            handleTimeFrameUpdate(day, itemId, updatedTimeFrames);
        }
    };

    const handleDeleteTimeFrame = (day, itemId, index) => {
        const currentTimeFrames = timeEntries[day]?.[itemId] || [];
        const updatedTimeFrames = currentTimeFrames.filter((_, i) => i !== index);
        handleTimeFrameUpdate(day, itemId, updatedTimeFrames);
    };

    const renderItemAttributes = (item) => {
        switch (selectedCategory) {
            case 'People':
                return `${item.name} - ${item.position}`;
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

    const renderTimeFrames = (day, itemId) => {
        const formattedDay = formatDate(day);
        const entries = timeEntries[formattedDay]?.[itemId] || [];

        return (
            <div className="time-frames-container">
                {entries.map((timeFrame, index) => (
                    <div key={index} className="time-frame">
                        <span onClick={() => handleCellClick(day, itemId)}>
                            {`${timeFrame.startTime} - ${timeFrame.endTime}`}
                        </span>
                        <div className="time-frame-actions">
                            <FaCopy
                                onClick={() => handleCopyTimeFrame(formattedDay, itemId, timeFrame)}
                                className="action-icon"
                                title="Copy time frame"
                            />
                            <FaTrash
                                onClick={() => handleDeleteTimeFrame(formattedDay, itemId, index)}
                                className="action-icon"
                                title="Delete time frame"
                            />
                        </div>
                    </div>
                ))}
                {copiedTimeFrame && (
                    <FaPaste
                        onClick={() => handlePasteTimeFrame(formattedDay, itemId)}
                        className="paste-icon"
                        title="Paste copied time frame"
                    />
                )}
                <div className="add-time-frame" onClick={() => handleCellClick(day, itemId)}>
                    + Add Time Frame
                </div>
            </div>
        );
    };


    const renderMaterialList = () => (
        <div className="material-list">
            {itemsOfBaustelle.map(item => (
                <div key={item.id} className="material-item">
                    {renderItemAttributes(item)}
                </div>
            ))}
            <button className="add-item-to-baustelle-btn" onClick={handleAddItem}>
                <FaPlus /> Add Material
            </button>
        </div>
    );

    const renderTimeTable = () => (
        <table className="baustelle-table">
            <thead>
            <tr>
                <th>Date</th>
                {itemsOfBaustelle.map(item => (
                    <th key={item.id}>{renderItemHeader(item)}</th>
                ))}
                <th>
                    <button className="add-item-to-baustelle-btn" onClick={handleAddItem}>
                        <FaPlus />
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {days.map(day => (
                <tr key={day.toISOString()}>
                    <td>{formatDate(day)}</td>
                    {itemsOfBaustelle.map(item => (
                        <td key={`${day.toISOString()}-${item.id}`}>
                            {renderTimeFrames(day, item.id)}
                        </td>
                    ))}
                    <td></td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td>Total Hours</td>
                {itemsOfBaustelle.map(item => (
                    <td key={`total-${item.id}`}>
                        {calculateTotalHours(item.id, timeEntries)}
                    </td>
                ))}
                <td>{calculateTotalHoursAllItems()}</td>
            </tr>
            </tfoot>
        </table>
    );

    const handleDeleteClick = (item) => {
        setDeletingItem(item);
    };

    const handleDeleteConfirm = () => {
        if (deletingItem) {
            onRemoveItem(selectedCategory, deletingItem);
            setDeletingItem(null);
        }
    };

    const renderItemHeader = (item) => (
        <div className="item-header">
            {renderItemAttributes(item)}
            <FaTrash
                className="delete-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(item);
                }}
            />
        </div>
    );

    const handleEditBaustelle = () => {
        setIsEditingBaustelle(true);
    };

    const handleUpdateBaustelle = (updatedBaustelle) => {
        onUpdateBaustelle(id, updatedBaustelle);
        setIsEditingBaustelle(false);
    };

    const calculateTotalHoursAllItems = () => {
        return Object.values(timeEntries).reduce((total, dayEntries) => {
            itemsOfBaustelle.forEach(item => {
                const itemEntries = dayEntries[item.id] || [];
                itemEntries.forEach(entry => {
                    const start = new Date(`2000-01-01T${entry.startTime}`);
                    const end = new Date(`2000-01-01T${entry.endTime}`);
                    total += (end - start) / 3600000; // Convert milliseconds to hours
                });
            });
            return total;
        }, 0).toFixed(2);
    };

    const createLexofficeBill = () => {
        console.log('Creating Lexoffice bill for Baustelle:', {
            id,
            name,
            startDate,
            endDate,
            maschinenrate,
            fahrzeugrate,
            stundenrate,
            totalHours: calculateTotalHoursAllItems(),
            items: itemsOfBaustelle.map(item => ({
                ...item,
                totalHours: calculateTotalHours(item.id, timeEntries)
            }))
        });
        console.log('Using Lexoffice API Key:', process.env.LEXOFFICE_API_KEY);
        // TODO: Implement actual Lexoffice API call here
    };

    const handleDeleteBaustelleClick = () => {
        setIsDeletingBaustelle(true);
    };

    const handleDeleteBaustelleConfirm = () => {
        onDeleteBaustelle(id);
        setIsDeletingBaustelle(false);
    };

    const handleDeleteBaustelleCancel = () => {
        setIsDeletingBaustelle(false);
    };

    return (
        <div className="baustelle">
            <div className="baustelle-header">
                <h2>{name}</h2>
                <div className="baustelle-actions">
                    <FaEdit onClick={handleEditBaustelle} className="edit-icon" title="Edit Baustelle"/>
                    <FaTrash onClick={handleDeleteBaustelleClick} className="delete-icon-Baustelle" title="Delete Baustelle"/>
                    <FaFileInvoiceDollar onClick={createLexofficeBill} className="create-bill-icon" title="Create Lexoffice Bill"/>
                </div>
            </div>
            <p>{formatDate(startDate)} to {formatDate(endDate)}</p>
            <p>Maschinenrate: {maschinenrate} | Fahrzeugrate: {fahrzeugrate} | Stundenrate: {stundenrate}</p>
            <div className="table-container">
                {selectedCategory === 'Material' ? renderMaterialList() : renderTimeTable()}
            </div>
            {isAddingItem && (
                <AddItemToBaustellePopup
                    items={itemsOfCategory}
                    onSelect={handleItemSelect}
                    onClose={() => setIsAddingItem(false)}
                    category={selectedCategory}
                />
            )}
            {editingEntry && (
                <TimeFrameEditor
                    day={editingEntry.day}
                    itemId={editingEntry.itemId}
                    initialTimeFrames={timeEntries[editingEntry.day]?.[editingEntry.itemId] || []}
                    onSave={(updatedTimeFrames) => handleTimeFrameUpdate(editingEntry.day, editingEntry.itemId, updatedTimeFrames)}
                    onCancel={() => setEditingEntry(null)}
                />
            )}
            {deletingItem && (
                <DeleteItemConfirmation
                    item={deletingItem}
                    category={selectedCategory}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingItem(null)}
                />
            )}
            {isEditingBaustelle && (
                <EditBaustellePopup
                    baustelle={{ id, name, startDate, endDate, maschinenrate, fahrzeugrate, stundenrate }}
                    onSave={handleUpdateBaustelle}
                    onCancel={() => setIsEditingBaustelle(false)}
                />
            )}
            {isDeletingBaustelle && (
                <DeleteItemConfirmation
                    item={{ name }}
                    category="Baustelle"
                    onConfirm={handleDeleteBaustelleConfirm}
                    onCancel={handleDeleteBaustelleCancel}
                />
            )}
        </div>
    );
};

const getDaysBetween = (start, end) => {
    const days = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
};
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getTimeEntryForDayAndItem = (day, itemId, timeEntries) => {
    // Convert the day to a Date object if it's not already
    const dayDate = day instanceof Date ? day : new Date(day);

    // Find the matching date in timeEntries
    const matchingDate = Object.keys(timeEntries).find(dateString => {
        const entryDate = new Date(dateString);
        return entryDate.toDateString() === dayDate.toDateString();
    });

    if (matchingDate && timeEntries[matchingDate][itemId]) {
        const entry = timeEntries[matchingDate][itemId];
        return `${entry.startTime}-${entry.endTime}`;
    }
    return '';
};

const calculateTotalHours = (itemId, timeEntries) => {
    let totalMinutes = 0;
    Object.values(timeEntries).forEach(dayEntries => {
        if (dayEntries[itemId]) {
            const entries = Array.isArray(dayEntries[itemId]) ? dayEntries[itemId] : [dayEntries[itemId]];
            entries.forEach(entry => {
                if (entry && entry.startTime && entry.endTime) {
                    const [startHour, startMinute] = entry.startTime.split(':').map(Number);
                    const [endHour, endMinute] = entry.endTime.split(':').map(Number);
                    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                    totalMinutes += durationMinutes;
                }
            });
        }
    });
    return (totalMinutes / 60).toFixed(2);
};

export default Baustelle;