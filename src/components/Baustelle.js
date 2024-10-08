import React, { useState} from 'react';
import '../styles/components/Baustelle.css';
import { FaPlus, FaTrash, FaCopy, FaPaste, FaEdit, FaFileInvoiceDollar   } from 'react-icons/fa';
import AddItemToBaustellePopup from "./AddItemToBaustellePopup";
import TimeFrameEditor from "./TimeFrameEditor";
import DeleteItemConfirmation from "./DeleteItemConfirmation";
import EditBaustellePopup from "./EditBaustellePopup";
import axios from 'axios';

const Baustelle = ({
                        useruid,
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

    //USE THIS IF U NEED THE UUID OF UR CONTACTS
    /*useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const WORKER_URL = 'https://delicate-rain-e5ee.dominik-urban1.workers.dev';
        let allContacts = [];
        let page = 0;
        let hasMore = true;

        try {
            while (hasMore) {
                const response = await axios.get(`${WORKER_URL}/contacts`, {
                    params: { page: page, size: 100 } // Request 100 contacts per page
                });

                const { content, last } = response.data;
                allContacts = allContacts.concat(content);
                hasMore = !last;
                page++;
            }

            console.log('All contacts:', allContacts);
            console.log('Total number of contacts:', allContacts.length);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };*/

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

    const calculateHoursForPosition = (position) => {
        return itemsOfBaustelle
            .filter(item => item.position === position)
            .reduce((total, item) => total + parseFloat(calculateTotalHours(item.id, timeEntries)), 0);
    };

    const createLexofficeBill = async (sendImmediately = false) => {
        const authorizedUserId = process.env.REACT_APP_LEXOFFICE_USERID;

        if (useruid !== authorizedUserId) {
            console.error('Unauthorized user attempted to create a Lexoffice bill');
            alert('You are not authorized to create Lexoffice bills.');
            return;
        }

        const WORKER_URL = process.env.REACT_APP_WORKER_URL;


        //const LEXOFFICE_API_KEY = process.env.REACT_APP_LEXOFFICE_API_KEY;
        //const LEXOFFICE_API_URL = 'https://api.lexoffice.io/v1/invoices';

        //const headers = {
        //    'Authorization': `Bearer ${LEXOFFICE_API_KEY}`,
        //    'Content-Type': 'application/json'
        //};

        let remarkText = "Bei Fragen stehen wir Ihnen gerne zur Verfügung.";
        let tax = true;
        if (name.substring(0, 2).toUpperCase() === "BV") {
            remarkText = "Bei den oben genannten Leistungen handelt es sich um Bauleistungen im Sinne § 13b UStG. Es liegt eine Steuerschuldnerschaft des Leistungsempfängers vor.";
            tax = false;
        }

        const taxRate = tax ? 19 : 0;

        const polierHours = calculateHoursForPosition("Baustellenleiter (Polier)");
        const baustellenleiterHours = calculateHoursForPosition("Baustellenleiter");
        const facharbeiterHours = calculateHoursForPosition("Facharbeiter");
        const totalHours = calculateTotalHoursAllItems();

        const lineItems = [];

        // Helper function to add Bauarbeiten items only if hours > 0
        const addBauarbeitenItem = (hours, position) => {
            if (hours > 0) {
                const netAmount = parseFloat(stundenrate);
                const grossAmount = parseFloat((netAmount * (1 + taxRate / 100)).toFixed(4));
                lineItems.push({
                    type: "custom",
                    name: "Bauarbeiten",
                    description: `${position}stunden ${hours} Stunden zu ${stundenrate},-€ pro Stunde\n\nZeitraum: ${formatDate(startDate)} bis ${formatDate(endDate)}`,
                    quantity: hours,
                    unitName: "Stunden",
                    unitPrice: {
                        currency: "EUR",
                        netAmount: netAmount,
                        grossAmount: grossAmount,
                        taxRatePercentage: taxRate
                    }
                });
            }
        };

        const addPolierItem = (hours, position) => {
            if (hours > 0) {
                const netAmount = parseFloat(stundenrate);
                const grossAmount = parseFloat((netAmount * (1 + taxRate / 100)).toFixed(4));
                lineItems.push({
                    type: "custom",
                    name: "Bauarbeiten",
                    description: `Baustellenleiterstunden (Polier)  ${hours} Stunden zu ${stundenrate},-€ pro Stunde\n\nZeitraum: ${formatDate(startDate)} bis ${formatDate(endDate)}`,
                    quantity: hours,
                    unitName: "Stunden",
                    unitPrice: {
                        currency: "EUR",
                        netAmount: netAmount,
                        grossAmount: grossAmount,
                        taxRatePercentage: taxRate
                    }
                });
            }
        };

            // Add Bauarbeiten items only if they have non-zero hours
        addPolierItem(polierHours, "Baustellenleiter (Polier)");
        addBauarbeitenItem(baustellenleiterHours, "Baustellenleiter");
        addBauarbeitenItem(facharbeiterHours, "Facharbeiter");

        // Add Materialtransport and Miete für Maschine items
        lineItems.push({
                type: "custom",
                name: "Materialtransport- Anfahrts- und Lieferkosten",
                description: `Zeitraum: ${formatDate(startDate)} bis ${formatDate(endDate)}`,
                quantity: 1,
                unitName: "Stück",
                unitPrice: {
                    currency: "EUR",
                    netAmount: totalHours * fahrzeugrate,
                    grossAmount: parseFloat((totalHours * fahrzeugrate * (1 + taxRate / 100)).toFixed(4)),
                    taxRatePercentage: taxRate
                }
            },
            {
                type: "custom",
                name: "Miete für Maschine",
                description: `Zeitraum: ${formatDate(startDate)} bis ${formatDate(endDate)}`,
                quantity: 1,
                unitName: "Stück",
                unitPrice: {
                    currency: "EUR",
                    netAmount: totalHours * maschinenrate,
                    grossAmount: parseFloat((totalHours * maschinenrate * (1 + taxRate / 100)).toFixed(4)),
                    taxRatePercentage: taxRate
                }
            });
        //fetchContacts();
        const totalNetAmount = parseFloat(lineItems.reduce((total, item) => total + item.quantity * item.unitPrice.netAmount, 0).toFixed(4));
        const totalGrossAmount = parseFloat(lineItems.reduce((total, item) => total + item.quantity * item.unitPrice.grossAmount, 0).toFixed(4));

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const timePart = "T00:00:07.480+02:00"; // Customize as needed
        const finalDate = formattedDate + timePart;


        try {
            const invoiceData = {
                voucherDate: finalDate,
                address: {
                    street: process.env.REACT_APP_STREET,
                    zip: process.env.REACT_APP_ZIP ,
                    city: process.env.REACT_APP_CITY,
                    name: process.env.REACT_APP_NAME,
                    countryCode: process.env.REACT_APP_COUNTRY_CODE,
                    contactId: process.env.REACT_APP_CONTACTID // Replace with actual customer contact ID if available
                },
                lineItems: lineItems,
                totalPrice: {
                    currency: "EUR",
                    totalNetAmount: totalNetAmount,
                    totalGrossAmount: totalGrossAmount,
                    totalTaxAmount: parseFloat((totalGrossAmount - totalNetAmount).toFixed(4))
                },
                taxConditions: {
                    taxType: tax ? "net" : "vatfree"
                },
                paymentConditions: {
                    paymentTermLabel: "Zahlbar innerhalb von 7 Tagen",
                    paymentTermDuration: 7
                },
                shippingConditions: {
                    shippingType: "none"
                },
                title: `Rechnung`,
                introduction: `Sehr geehrte Damen und Herren\n\nwir erlauben uns, wie folgt Rechnung zu stellen: \n\nObjekt: ${name}`,
                remark: remarkText,
                customFields: [
                    // Add any custom fields here if needed
                ]
            };

            // Create the invoice using your Cloudflare Worker
            const response = await axios.post(WORKER_URL, invoiceData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });            console.log('Invoice created successfully:', response.data);

            if (sendImmediately && response.data.id) {
                const finalizeResponse = await axios.post(`${WORKER_URL}/finalize/${response.data.id}`, null, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (finalizeResponse.status === 204) {
                    console.log('Invoice finalized and sent successfully');
                }
            }
        } catch (error) {
            console.error('Error creating or sending invoice:', error);

        }
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

/*const getTimeEntryForDayAndItem = (day, itemId, timeEntries) => {
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
};*/

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