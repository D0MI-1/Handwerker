import React, { useState, useEffect } from 'react';
import '../styles/components/Baustelle.css';
import { FaPlus } from 'react-icons/fa';
import AddItemToBaustellePopup from "./AddItemToBaustellePopup";
import TimeEntryEditor from "./TimeEntryEditor";

const Baustelle = ({ name, startDate, endDate, itemsOfBaustelle = [], itemsOfCategory, timeEntries = {}, onAddItem, selectedCategory,onUpdateTimeEntry   }) => {

    const days = getDaysBetween(startDate, endDate);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);


    const handleAddItem = () => {
        setIsAddingItem(true);
    };

    const handleItemSelect = (item) => {
        onAddItem(item);
        setIsAddingItem(false);
    };


    const handleCellClick = (day, itemId) => {
        setEditingEntry({ day, itemId });
    };

    const handleTimeEntryUpdate = (updatedEntry) => {
        onUpdateTimeEntry(updatedEntry);
        setEditingEntry(null);
    };

    return (
        <div className="baustelle">
            <h2>{name}</h2>
            <p>{formatDate(startDate)} to {formatDate(endDate)}</p>
            <div className="table-container">
                <table className="baustelle-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        {itemsOfBaustelle.map(item => (
                            <th key={item.id}>{item.name}</th>
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
                        <tr key={day}>
                            <td>{formatDate(day)}</td>
                            {itemsOfBaustelle.map(item => (
                                <td
                                    key={`${day}-${item.id}`}
                                    onClick={() => handleCellClick(day, item.id)}
                                    className="time-entry-cell"
                                >
                                    {getTimeEntryForDayAndItem(day, item.id, timeEntries)}
                                </td>
                            ))}
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
                    </tr>
                    </tfoot>
                </table>
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
                <TimeEntryEditor
                    day={editingEntry.day}
                    itemId={editingEntry.itemId}
                    initialEntry={getTimeEntryForDayAndItem(editingEntry.day, editingEntry.itemId, timeEntries)}
                    onSave={handleTimeEntryUpdate}
                    onCancel={() => setEditingEntry(null)}
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
            const entry = dayEntries[itemId];
            const [startHour, startMinute] = entry.startTime.split(':').map(Number);
            const [endHour, endMinute] = entry.endTime.split(':').map(Number);
            const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
            totalMinutes += durationMinutes;
        }
    });
    return (totalMinutes / 60).toFixed(2);
};

export default Baustelle;