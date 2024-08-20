import React, { useState, useEffect } from 'react';
import '../styles/components/TimeFrameEditor.css';

const TimeFrameEditor = ({ day, itemId, initialTimeFrames, onSave, onCancel }) => {
    const [timeFrames, setTimeFrames] = useState([{ startTime: '', endTime: '' }]);

    useEffect(() => {
        if (initialTimeFrames) {
            if (Array.isArray(initialTimeFrames) && initialTimeFrames.length > 0) {
                setTimeFrames(initialTimeFrames);
            } else if (typeof initialTimeFrames === 'object' && initialTimeFrames.startTime && initialTimeFrames.endTime) {
                setTimeFrames([initialTimeFrames]);
            } else {
                setTimeFrames([{ startTime: '', endTime: '' }]);
            }
        }
    }, [initialTimeFrames]);

    const handleAddTimeFrame = () => {
        setTimeFrames([...timeFrames, { startTime: '', endTime: '' }]);
    };

    const handleTimeFrameChange = (index, field, value) => {
        const updatedTimeFrames = timeFrames.map((tf, i) =>
            i === index ? { ...tf, [field]: value } : tf
        );
        setTimeFrames(updatedTimeFrames);
    };

    const handleRemoveTimeFrame = (index) => {
        if (timeFrames.length > 1) {
            setTimeFrames(timeFrames.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        const validTimeFrames = timeFrames.filter(tf => tf.startTime && tf.endTime);
        onSave(validTimeFrames);
    };

    return (
        <div className="time-frame-editor-overlay">
            <div className="time-frame-editor">
                <h3>Edit Time Frames for {day}</h3>
                {timeFrames.map((tf, index) => (
                    <div key={index} className="time-frame">
                        <div>
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={tf.startTime}
                                onChange={(e) => handleTimeFrameChange(index, 'startTime', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={tf.endTime}
                                onChange={(e) => handleTimeFrameChange(index, 'endTime', e.target.value)}
                            />
                        </div>
                        {timeFrames.length > 1 && (
                            <button onClick={() => handleRemoveTimeFrame(index)} className="remove-btn">Remove</button>
                        )}
                    </div>
                ))}
                <button onClick={handleAddTimeFrame} className="add-btn">Add Time Frame</button>
                <div className="editor-buttons">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default TimeFrameEditor;