import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Button from '../components/Button';
import React from 'react';

export default function FormBuilder({ triggerRerender, modalStep, setModalStep }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [dataOptions, setDataOptions] = useState([]);
    const [selectedData, setSelectedData] = useState('');
    const [editData, setEditData] = useState({});
    const [editModalVisible, setEditModalVisible] = useState(false);
    
    // New Document Creation Modal state
    const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
    const [newAnswerSetName, setNewAnswerSetName] = useState('');
    const [secondaryKeys, setSecondaryKeys] = useState([]);
    const [newSecondaryKey, setNewSecondaryKey] = useState('');
    const [arrayOptions, setArrayOptions] = useState([]);
    const [selectedArray, setSelectedArray] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (modalStep === 3) fetchDocuments();
    }, [modalStep]);

    const fetchDocuments = async () => {
        const querySnapshot = await getDocs(collection(db, 'AnswerSet'));
        const tempDocuments = [];
        querySnapshot.forEach((doc) => {
            tempDocuments.push(doc.data());
        });
        setDocuments(tempDocuments);
    };

    const handleDeleteArrayClick = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'AnswerSet'));
            const arrays = [];

            // Loop through each document to collect arrays ending with 'Array'
            querySnapshot.forEach((docSnapshot) => {
                const docData = docSnapshot.data();
                console.log('Document data:', docData); // Debugging line

                Object.keys(docData).forEach((key) => {
                    if (key.endsWith('Array')) { // Corrected condition to 'Array'
                        arrays.push({
                            name: key,
                            docId: docSnapshot.id,
                        });
                    }
                });
            });

            console.log('Fetched arrays:', arrays); // Debugging line

            setArrayOptions(arrays);
            setSelectedArray(null);
            setShowDeleteConfirm(true);
        } catch (error) {
            console.error('Error fetching arrays:', error);
        }
    };

    const confirmDeleteArray = async () => {
        if (selectedArray) {
            const { docId, name } = selectedArray;

            try {
                const docRef = doc(db, 'AnswerSet', docId);
                const docSnapshot = await getDocs(docRef);
                const updatedData = { ...docSnapshot.data() };
                delete updatedData[name]; // Remove the selected array

                await setDoc(docRef, updatedData);
                triggerRerender();
                alert(`Array ${name} deleted successfully.`);
            } catch (error) {
                console.error('Error deleting array:', error);
                alert('Failed to delete the array.');
            } finally {
                setShowDeleteConfirm(false);
            }
        }
    };

   const renderDeleteArrayModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Select Array to Delete</h2>
                <select
                    className="mb-4 p-2 border rounded w-full"
                    value={selectedArray ? selectedArray.name : ""}
                    onChange={(e) => {
                        const arrayName = e.target.value;
                        const selected = arrayOptions.find(array => array.name === arrayName);
                        setSelectedArray(selected || null);
                    }}
                >
                    <option value="" disabled>Select an array</option>
                    {arrayOptions.map((array, index) => (
                        <option key={index} value={array.name}>
                            {array.name} (in Document ID: {array.docId})
                        </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={() => setShowDeleteConfirm(false)}
                        text="Cancel"
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    />
                    <Button
                        onClick={confirmDeleteArray}
                        text="Delete"
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        disabled={!selectedArray}
                    />
                </div>
            </div>
        </div>
    );

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
        const availableDataOptions = doc.answers ? doc.answers.map(answer => answer.primary) : [];
        setDataOptions(availableDataOptions);
        
        if (availableDataOptions.length > 0) {
            setSelectedData(availableDataOptions[0]);
            handleDataSelection(availableDataOptions[0]);
        } else {
            setEditData({});
        }
        
        setEditModalVisible(true);
    };

    const handleDataSelection = (data) => {
        const selectedAnswer = selectedDocument.answers.find(answer => answer.primary === data);
        setEditData(selectedAnswer || {});
    };

    const handleEditChange = (key, value) => {
        setEditData((prevEditData) => ({
            ...prevEditData,
            [key]: value
        }));
    };

    const submitChanges = async () => {
        if (selectedDocument && selectedData) {
            const docRef = doc(db, 'AnswerSet', selectedDocument.set_name);
            const updatedAnswers = selectedDocument.answers.map((answer) =>
                answer.primary === selectedData ? { ...editData, primary: selectedData } : answer
            );
            await setDoc(docRef, { ...selectedDocument, answers: updatedAnswers });
            triggerRerender();
        }
    };

    const renderEditDataFields = () => {
        if (!editData || Object.keys(editData).length === 0) {
            return <p>No data available to edit.</p>;
        }
        return Object.entries(editData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
                <label className="text-md">{key}</label>
                <input
                    type="text"
                    className="border p-2 rounded"
                    value={value}
                    onChange={(e) => handleEditChange(key, e.target.value)}
                />
            </div>
        ));
    };

    const handleAddSecondaryKey = () => {
        if (newSecondaryKey.trim() !== '') {
            setSecondaryKeys([...secondaryKeys, newSecondaryKey]);
            setNewSecondaryKey('');
        }
    };

    const handleSubmitNewDocument = async () => {
        const docRef = collection(db, 'AnswerSet');
        await addDoc(docRef, { set_name: newAnswerSetName, secondary_keys: secondaryKeys });
        setShowNewDocumentModal(false);
        triggerRerender();
    };

    const handleAddSite = () => {
        console.log("Add Site button clicked");

    };
    
    const handleAddSpecies = () => {
        console.log("Add Species button clicked");
       
    };
    
    const handleAddTaxonomy = () => {
        console.log("Add Taxonomy button clicked");
        
    };

    const renderModalContent = () => {
        switch (modalStep) {
            case 1:
                return (
                    <div className="p-6 bg-white rounded-lg flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Collection</h2>
                    <Button
                        onClick={() => setModalStep(2)}
                        text="AnswerSet"
                        className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                    <Button
                        onClick={handleDeleteArrayClick}
                        text="Delete Array"
                        className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                    <Button
                       onClick={handleAddSite}
                       text="Add Site"
                       className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                    <Button
                       onClick={handleAddSpecies}
                       text="Add Species"
                       className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                    <Button
                       onClick={handleAddTaxonomy}
                       text="Add Taxonomy"
                       className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                </div>
                );
            case 2:
                return (
                    <div className="p-6 bg-white rounded-lg flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">Document Options</h2>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                        <Button 
                        onClick={() => setModalStep(3)} 
                        text="Modify Existing Document" 
                        className="bg-blue-500 text-white px-6 py-3 rounded w-full" 
                        />
                <Button 
                    onClick={() => setShowNewDocumentModal(true)} 
                    text="Create New Document" 
                    className="bg-blue-500 text-white px-6 py-3 rounded w-full" 
                />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-6 bg-white rounded-lg overflow-y-auto" style={{ maxHeight: '300px' }}>
                        <h2 className="text-xl font-bold mb-4">Modify Document</h2>
                        <ul className="space-y-2">
                            {documents.map((doc, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleDocumentClick(doc)}
                                    text={doc.set_name || `Document ${index + 1}`}
                                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 w-full"
                                />
                            ))}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 h-screen overflow-y-auto">
            <div className="w-[600px] h-[400px] bg-white rounded-lg shadow-lg p-4">
                {renderModalContent()}
            </div>
            {showDeleteConfirm && renderDeleteArrayModal()}
            {/* New Document Modal */}
            {showNewDocumentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Create New Document</h2>
                        <label className="block mb-2 font-medium">Answer Set Name:</label>
                        <input
                            type="text"
                            value={newAnswerSetName}
                            onChange={(e) => setNewAnswerSetName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Enter answer set name"
                        />
                        <label className="block mb-2 font-medium">Secondary Keys:</label>
                        {secondaryKeys.map((key, index) => (
                            <p key={index} className="ml-2 mb-2 text-gray-700">- {key}</p>
                        ))}
                        <input
                            type="text"
                            value={newSecondaryKey}
                            onChange={(e) => setNewSecondaryKey(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Enter secondary key"
                        />
                        <Button 
                            onClick={handleAddSecondaryKey} 
                            text="Add Secondary Key" 
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4" 
                        />
                        <Button 
                            onClick={handleSubmitNewDocument} 
                            text="Submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2" 
                        />
                        <Button 
                            onClick={() => setShowNewDocumentModal(false)} 
                            text="Cancel" 
                            className="bg-gray-400 text-white px-4 py-2 rounded w-full" 
                        />
                    </div>
                </div>
            )}
            {editModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Data</h2>
                        <select
                            className="mb-4 p-2 border rounded w-full"
                            value={selectedData}
                            onChange={(e) => {
                                setSelectedData(e.target.value);
                                handleDataSelection(e.target.value);
                            }}
                        >
                            {dataOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <h3 className="text-lg font-bold mb-2">Edit Data</h3>
                        {renderEditDataFields()}
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button onClick={() => setEditModalVisible(false)} text="Cancel" className="bg-gray-400 text-white px-4 py-2 rounded" />
                            <Button onClick={submitChanges} text="Save" className="bg-blue-500 text-white px-4 py-2 rounded" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
