import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc  } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import Sidebar from '../components/Sidebar';
import Baustelle from '../components/Baustelle';
import AddBaustelleButton from '../components/AddBaustelleButton';
import AddBaustellePopup from '../components/AddBaustellePopup';
import '../styles/pages/dashboard.css'

const Dashboard = () => {
    const [user] = useAuthState(auth);

    //_setCategories
    const [categories, ] = useState(['People', 'Machines', 'Vehicles', 'Material']);
    const [selectedCategory, setSelectedCategory] = useState('People');

    const [items, setItems] = useState([]);

    const [baustellen, setBaustellen] = useState([]);
    const [isAddBaustellePopupOpen, setIsAddBaustellePopupOpen] = useState(false);

    //_baustelleItems
    const [, setBaustelleItems] = useState([]);
    //_timeEntries
    const [, setTimeEntries] = useState([]);

    const fetchBaustelleItems = async () => {
        // Fetch items associated with this Baustelle
        // This is a placeholder. Implement the actual fetching logic.
        const items = [
            { id: '1', name: 'Worker 1' },
            { id: '2', name: 'Machine 1' },
            { id: '3', name: 'Vehicle 1' },
        ];
        setBaustelleItems(items);
    };

    const fetchTimeEntries = async () => {
        // Fetch time entries for this Baustelle
        // This is a placeholder. Implement the actual fetching logic.
        const entries = [
            { date: '20.08.2024', itemId: '1', startTime: '10:00', endTime: '12:00' },
            { date: '20.08.2024', itemId: '1', startTime: '13:30', endTime: '18:30' },
            { date: '21.08.2024', itemId: '2', startTime: '09:00', endTime: '17:00' },
        ];
        setTimeEntries(entries);
    };

    useEffect(() => {
        if (baustellen.length > 0) {
            fetchBaustelleItems(baustellen[0].id);
            fetchTimeEntries(baustellen[0].id);
        }
    }, [baustellen]);
    useEffect(() => {
        if (user) {
            fetchBaustellen();
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    useEffect(() => {
        if (user && selectedCategory) {
            fetchItemsForCategory(selectedCategory);
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, selectedCategory]);



    const fetchItemsForCategory = async (category) => {
        try {
            const itemsCollectionRef = collection(db, `users/${user.uid}/categories/${category}/items`);
            const snapshot = await getDocs(itemsCollectionRef);
            const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchBaustellen = async () => {
        try {
            const baustellenCollectionRef = collection(db, `users/${user.uid}/baustellen`);
            const snapshot = await getDocs(baustellenCollectionRef);
            const baustellenData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBaustellen(baustellenData);
        } catch (error) {
            console.error("Error fetching baustellen:", error);
        }
    };

    const addItem = async (category, newItem) => {
        try {
            const itemsCollectionRef = collection(db, `users/${user.uid}/categories/${category}/items`);
            await addDoc(itemsCollectionRef, newItem);
            fetchItemsForCategory(category); // Refresh the items list
        } catch (error) {
            console.error("Error adding item:", error);
            console.error("Error details:", error.code, error.message);
        }
    };

    const updateItem = async (category, updatedItem) => {
        try {
            const itemRef = doc(db, `users/${user.uid}/categories/${category}/items`, updatedItem.id);
            await updateDoc(itemRef, updatedItem);
            fetchItemsForCategory(category); // Refresh the items list
        } catch (error) {
            console.error("Error updating item:", error);
            console.error("Error details:", error.code, error.message);
        }
    };

    const addBaustelle = async (newBaustelle) => {
        try {
            const baustellenCollectionRef = collection(db, `users/${user.uid}/baustellen`);
            await addDoc(baustellenCollectionRef, {
                ...newBaustelle,
                people: [],
                machines: [],
                vehicles: [],
                materials: [],
                timeEntries: {}
            });
            fetchBaustellen();
        } catch (error) {
            console.error("Error adding baustelle:", error);
        }
    };

    const addItemToBaustelle = async (baustelleId, item) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            const baustelleSnap = await getDoc(baustelleRef);

            if (baustelleSnap.exists()) {
                const baustelleData = baustelleSnap.data();
                const categoryItems = baustelleData[selectedCategory.toLowerCase()] || [];
                const updatedItems = [...categoryItems, item];

                await updateDoc(baustelleRef, {
                    [selectedCategory.toLowerCase()]: updatedItems
                });

                fetchBaustellen(); // Refresh the baustellen list
            } else {
                console.error("Baustelle document does not exist");
            }
        } catch (error) {
            console.error("Error adding item to baustelle:", error);
        }
    };

    const updateTimeEntry = async (baustelleId, day, itemId, timeFrames) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            const baustelleSnap = await getDoc(baustelleRef);

            if (baustelleSnap.exists()) {
                const baustelleData = baustelleSnap.data();
                const updatedTimeEntries = {
                    ...baustelleData.timeEntries,
                    [day]: {
                        ...(baustelleData.timeEntries[day] || {}),
                        [itemId]: timeFrames
                    }
                };

                await updateDoc(baustelleRef, { timeEntries: updatedTimeEntries });
                fetchBaustellen(); // Refresh the baustellen list
            } else {
                console.error("Baustelle document does not exist");
            }
        } catch (error) {
            console.error("Error updating time entry:", error);
        }
    };

    const removeItemFromBaustelle = async (baustelleId, category, item) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            const baustelleSnap = await getDoc(baustelleRef);

            if (baustelleSnap.exists()) {
                const baustelleData = baustelleSnap.data();
                const categoryItems = baustelleData[category.toLowerCase()] || [];
                const updatedItems = categoryItems.filter(i => i.id !== item.id);

                await updateDoc(baustelleRef, {
                    [category.toLowerCase()]: updatedItems
                });

                fetchBaustellen(); // Refresh the baustellen list
            } else {
                console.error("Baustelle document does not exist");
            }
        } catch (error) {
            console.error("Error removing item from baustelle:", error);
        }
    };

    const updateBaustelle = async (baustelleId, updatedBaustelle) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            await updateDoc(baustelleRef, updatedBaustelle);
            fetchBaustellen();
        } catch (error) {
            console.error("Error updating baustelle:", error);
        }
    };

    const deleteBaustelle = async (baustelleId) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            await deleteDoc(baustelleRef);
            fetchBaustellen();
        } catch (error) {
            console.error("Error deleting baustelle:", error);
        }
    };

    const handleDeleteItem = async (category, item) => {
        try {
        const  itemRef = doc(db, `users/${user.uid}/categories/${category}/items`, item.id);
        await deleteDoc(itemRef);
        fetchItemsForCategory(category);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    /*const updateTimeEntry = async (baustelleId, updatedEntry) => {
        try {
            const baustelleRef = doc(db, `users/${user.uid}/baustellen`, baustelleId);
            const baustelleSnap = await getDoc(baustelleRef);

            if (baustelleSnap.exists()) {
                const baustelleData = baustelleSnap.data();
                const updatedTimeEntries = {
                    ...baustelleData.timeEntries,
                    [updatedEntry.day]: {
                        ...(baustelleData.timeEntries[updatedEntry.day] || {}),
                        [updatedEntry.itemId]: {
                            startTime: updatedEntry.startTime,
                            endTime: updatedEntry.endTime
                        }
                    }
                };

                await updateDoc(baustelleRef, { timeEntries: updatedTimeEntries });
                fetchBaustellen(); // Refresh the baustellen list
            } else {
                console.error("Baustelle document does not exist");
            }
        } catch (error) {
            console.error("Error updating time entry:", error);
        }
    };*/



    /*const addItem = async (category, item) => {
        const categoryRef = doc(db, `users/${user.uid}/categories`, category);
        await updateDoc(categoryRef, {
            items: [...categories[category], item]
        });
        setCategories(prev => ({
            ...prev,
            [category]: [...prev[category], item]
        }));
    };*/

    return (
        <div className="dashboard">
            <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                items={items}
                addItem={addItem}
                updateItem={updateItem}
                deleteItem={handleDeleteItem}
            />
            <div className="main-content">
                <h1>Mauerwerk Dashboard</h1>
                <AddBaustelleButton onClick={() => setIsAddBaustellePopupOpen(true)} />
                <div className="baustellen-container">
                    {baustellen.map(baustelle => (
                        <Baustelle
                            useruid ={user.uid}
                            key={baustelle.id}
                            id={baustelle.id}
                            name={baustelle.name}
                            startDate={baustelle.startDate}
                            endDate={baustelle.endDate}
                            maschinenrate={baustelle.maschinenrate}
                            fahrzeugrate={baustelle.fahrzeugrate}
                            stundenrate={baustelle.stundenrate}
                            itemsOfBaustelle={baustelle[selectedCategory.toLowerCase()] || []}
                            itemsOfCategory={items}
                            timeEntries={baustelle.timeEntries || {}}
                            onAddItem={(item) => addItemToBaustelle(baustelle.id, item)}
                            onRemoveItem={(category, item) => removeItemFromBaustelle(baustelle.id, category, item)}
                            selectedCategory={selectedCategory}
                            onUpdateTimeEntry={(day, itemId, timeFrames) => updateTimeEntry(baustelle.id, day, itemId, timeFrames)}
                            onUpdateBaustelle={updateBaustelle}
                            onDeleteBaustelle={deleteBaustelle}
                        />
                    ))}
                </div>
                {isAddBaustellePopupOpen && (
                    <AddBaustellePopup
                        onClose={() => setIsAddBaustellePopupOpen(false)}
                        onConfirm={addBaustelle}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;