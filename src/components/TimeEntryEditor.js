import React, { useState } from 'react';
import '../styles/components/TimeEntryEditor.css';

const TimeEntryEditor = ({ day, itemId, initialEntry, onSave, onCancel }) => {
    const [startTime, setStartTime] = useState(initialEntry ? initialEntry.split('-')[0] : '');
    const [endTime, setEndTime] = useState(initialEntry ? initialEntry.split('-')[1] : '');

    const handleSave = () => {
        onSave({ day, itemId, startTime, endTime });
    };

    return(
        <div className="time-entry-editor-overlay">
            <div className="time-entry-editor">
                <h3>Edit Time Entry</h3>
                <div>
                    <label>Start Time:</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <label>End Time:</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <div className="editor-buttons">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default TimeEntryEditor;