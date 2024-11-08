import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getDoc, updateDoc, deleteField  } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
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
    const [primaryFields, setPrimaryFields] = useState([]); 
    const [selectedField, setSelectedField] = useState(null);
    const [deleteMode, setDeleteMode] = useState('');
    const [showAddSiteModal, setShowAddSiteModal] = useState(false);
    const [newSiteName, setNewSiteName] = useState('');
    const [sites, setSites] = useState([]);
    const [refreshSites, setRefreshSites] = useState(false);
    const [showViewSites, setShowViewSites] = useState(false);
    const [showAddSiteForm, setShowAddSiteForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [siteOptions, setSiteOptions] = useState([]);

    const [newSpeciesName, setNewSpeciesName] = useState('');
    const [species, setSpecies] = useState([]);
    const [refreshSpecies, setRefreshSpecies] = useState(false);
    const [showViewSpecies, setShowViewSpecies] = useState(false);
    const [showAddSpeciesModal, setShowAddSpeciesModal] = useState(false);
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [showAddSpeciesForm, setShowAddSpeciesForm] = useState(false);
    const [selectedCritter, setSelectedCritter] = useState('');


    const critterOptions = ["Lizard", "Mammal", "Snake", "Amphibian", "Turtle"];



    useEffect(() => {
        if (modalStep === 3) fetchDocuments();
    }, [modalStep]);

  
    useEffect(() => {
        if (refreshSites) {
            fetchSites();
            setRefreshSites(false);
        }
    }, [refreshSites]);

    useEffect(() => {
        if (refreshSpecies) {
            fetchSpecies();
            setRefreshSpecies(false);
        }
    }, [refreshSpecies]);

    const handleCritterSelection = (critter) => {
        setSelectedCritter(critter);
    };



    const fetchDocuments = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'AnswerSet'));
            const tempDocuments = [];
            const tempArrayOptions = [];

            querySnapshot.forEach((docSnapshot) => {
                const docData = docSnapshot.data();
                tempDocuments.push({ ...docData, docId: docSnapshot.id }); // Store full documents for modifying
                if (docData.set_name && docData.set_name.endsWith("Array")) {
                    tempArrayOptions.push({
                        name: docData.set_name,
                        docId: docSnapshot.id,
                    });
                }
            });

            setDocuments(tempDocuments); // Store fetched documents
            setArrayOptions(tempArrayOptions); // Store array options for dropdown
            console.log('Fetched Documents:', tempDocuments);
            console.log('Array Options for Dropdown:', tempArrayOptions);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleArraySelection = async (e) => {
        const arrayName = e.target.value;
        const selected = arrayOptions.find(array => array.name === arrayName);
        setSelectedArray(selected);
        setPrimaryFields([]);
        setSelectedField(null);

        if (selected && selected.docId && deleteMode === 'field') {
            try {
                const docRef = doc(db, 'AnswerSet', selected.docId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const answers = docSnapshot.data().answers || [];
                    const primaryFields = answers.map(field => field.primary).filter(Boolean);
                    setPrimaryFields(primaryFields);
                    console.log("Primary fields:", primaryFields);
                }
            } catch (error) {
                console.error('Error fetching primary fields:', error);
            }
        }
    };

    const handleDeleteArrayClick = async () => {
        if (arrayOptions.length === 0) {
            await fetchDocuments(); // Ensure arrays are loaded
        }
        setShowDeleteConfirm(true); // Open delete confirmation modal
        setDeleteMode(''); // Reset the delete mode
    };
    
    
    const confirmDeleteArray = async () => {
        if (selectedArray) {
            const { docId, name } = selectedArray;

            try {
                const docRef = doc(db, 'AnswerSet', docId);
                await deleteDoc(docRef);

                setArrayOptions(prevArrayOptions => 
                    prevArrayOptions.filter(array => array.docId !== docId)
                );

                setSelectedArray(null);
                triggerRerender();
                alert(`Document ${name} deleted successfully.`);
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete the document.');
            } finally {
                setShowDeleteConfirm(false);
            }
        }
    };
    


    const renderDeleteArrayModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Delete Options</h2>
                
                <div className="flex flex-col mb-4">
                    <Button 
                        onClick={() => setDeleteMode('array')}
                        text="Delete Entire Array"
                        className="bg-white-500 text-white px-4 py-2 rounded mb-2"
                    />
                    <Button 
                        onClick={() => setDeleteMode('field')}
                        text="Delete Array Field"
                        className="bg-white-500 text-white px-4 py-2 rounded"
                    />
                </div>

                {deleteMode && (
                    <>
                        <select
                            className="mb-4 p-2 border rounded w-full"
                            value={selectedArray ? selectedArray.name : ""}
                            onChange={handleArraySelection}
                        >
                            <option value="" disabled>Select an array</option>
                            {arrayOptions.map((array, index) => (
                                <option key={index} value={array.name}>
                                    {array.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {deleteMode === 'field' && primaryFields.length > 0 && (
                    <select
                        className="mb-4 p-2 border rounded w-full"
                        value={selectedField || ""}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        <option value="" disabled>Select a primary field</option>
                        {primaryFields.map((field, index) => (
                            <option key={index} value={field}>{field}</option>
                        ))}
                    </select>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteMode('');
                        }}
                        text="Cancel"
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    />
                    {deleteMode === 'array' ? (
                        <Button
                            onClick={confirmDeleteArray}
                            text="Delete Array"
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            disabled={!selectedArray}
                        />
                    ) : (
                        <Button
                            onClick={confirmDeletePrimaryField}
                            text="Delete Field"
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            disabled={!selectedField}
                        />
                    )}
                </div>
            </div>
        </div>
    );




    const confirmDeletePrimaryField = async () => {
        if (selectedArray && selectedArray.docId && selectedField) {
            try {
                const docRef = doc(db, 'AnswerSet', selectedArray.docId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const updatedAnswers = data.answers.filter(field => field.primary !== selectedField);

                    await setDoc(docRef, { ...data, answers: updatedAnswers });
                    triggerRerender();
                    alert(`Field ${selectedField} deleted successfully.`);
                    setPrimaryFields(updatedAnswers.map(field => field.primary).filter(Boolean));
                    setSelectedField(null);
                }
            } catch (error) {
                console.error('Error deleting field:', error);
                alert('Failed to delete the field.');
            } finally {
                setShowDeleteConfirm(false);
            }
        }
    };

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
        setShowAddSiteModal(true); // Open the "Add Site" modal
        setShowAddSiteForm(false);  // Reset to not show the form initially
        setShowViewSites(false);    // Reset to not show the view list initially
        setSelectedProject('');     // Reset the project selection
    };

    const handleAddSpecies = () => {
        setShowAddSpeciesModal(true); 
        setShowAddSpeciesForm(false);  // Reset to not show the form initially
        setShowViewSpecies(false);    // Reset to not show the view list initially
        setSelectedProject('');     // Reset the project selection
    };
    
    const fetchSpeciesForProjectAndCritter = async () => {
        const projectCritterSetName = `${selectedProject}${selectedCritter}Species`; // e.g., GatewayLizardSpecies

        try {
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', projectCritterSetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const data = docSnapshot.data();
                const speciesList = data.answers.map(answer => answer.primary); // Assuming each answer entry has a `primary` field for species name

                setSpeciesOptions(speciesList); // Set fetched species list
                console.log(`Fetched species for ${projectCritterSetName}:`, speciesList);
            } else {
                console.error(`Document with set_name ${projectCritterSetName} does not exist.`);
                setSpeciesOptions([]); // Clear if no document found
            }
        } catch (error) {
            console.error(`Error fetching species for ${projectCritterSetName}:`, error);
        }
    };

    const fetchSites = async () => {
        try {
            const sitesSnapshot = await getDocs(collection(db, 'Sites')); // Ensure 'Sites' is the correct collection name
            const siteList = sitesSnapshot.docs.map(doc => doc.data().name);
            setSites(siteList);
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

    const fetchSitesForProject = async (projectName) => {
        const projectSetName = `${projectName}Sites`; // Construct the value to match in the `set_name` field
    
        try {
            // Query the AnswerSet collection to find the document with set_name equal to projectSetName
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', projectSetName));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0]; // Assuming there's only one document per project
    
                const data = docSnapshot.data();
                const answers = data.answers || {}; // Retrieve answers map
                const siteNames = Object.values(answers).map((entry) => entry.primary); // Extract primary fields
    
                setSiteOptions(siteNames); // Populate site options with primary field values
                console.log(`Fetched sites for project ${projectName}:`, siteNames);
            } else {
                console.error(`Document with set_name ${projectSetName} does not exist in the AnswerSet collection.`);
                setSiteOptions([]); // Clear sites if no matching document is found
            }
        } catch (error) {
            console.error(`Error fetching sites for project ${projectName}:`, error);
        }
    };

    

    const handleProjectSelection = (projectName) => {
        setSelectedProject(projectName);
        fetchSitesForProject(projectName); // Populate site options for the selected project
    };

    const renderExistingSites = () => {
        return (
            <ul className="space-y-2">
                {siteOptions.map((site, index) => (
                    <li key={index} className="text-black-800">{site}</li>
                ))}
            </ul>
        );
    };
    
    

    const addNewSite = async () => {
        if (selectedProject && newSiteName.trim()) {
            try {
                const projectSetName = `${selectedProject}Sites`; // Construct the document identifier
    
                // Query to find the specific document in the AnswerSet collection
                const q = query(collection(db, 'AnswerSet'), where('set_name', '==', projectSetName));
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0]; // Get the first matching document
                    const docRef = doc(db, 'AnswerSet', docSnapshot.id); // Reference to the correct document
    
                    // Update the `answers` field with the new site name
                    await updateDoc(docRef, {
                        answers: [...docSnapshot.data().answers, { primary: newSiteName }]
                    });
    
                    console.log(`Site "${newSiteName}" added to ${projectSetName} successfully.`);
                    setNewSiteName(''); // Clear input field
                    fetchSitesForProject(selectedProject); // Refresh site list to include the new site
                } else {
                    console.error(`Document with set_name ${projectSetName} does not exist in the AnswerSet collection.`);
                }
            } catch (error) {
                console.error(`Error adding new site to ${selectedProject}:`, error);
                alert('Failed to add the site.');
            }
        } else {
            alert("Please select a project and enter a site name.");
        }
    };
    
    const addNewSpecies = async () => {
        if (selectedProject && selectedCritter && newSpeciesName.trim()) {
            const projectCritterSetName = `${selectedProject}${selectedCritter}Species`;

            try {
                const q = query(collection(db, 'AnswerSet'), where('set_name', '==', projectCritterSetName));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    const docRef = doc(db, 'AnswerSet', docSnapshot.id);

                    await updateDoc(docRef, {
                        answers: [...docSnapshot.data().answers, { primary: newSpeciesName }]
                    });

                    console.log(`Species "${newSpeciesName}" added to ${projectCritterSetName} successfully.`);
                    setNewSpeciesName('');
                    fetchSpeciesForProjectAndCritter(); // Refresh species list
                } else {
                    console.error(`Document with set_name ${projectCritterSetName} does not exist.`);
                }
            } catch (error) {
                console.error(`Error adding new species to ${projectCritterSetName}:`, error);
            }
        } else {
            alert("Please select a project, critter, and enter a species name.");
        }
    };
    
    const addSiteToProjectDocument = async (project, siteName) => {
        const projectDocument = `${project}Sites`;
        await updateDoc(doc(db, 'AnswerSet', projectDocument), {
            answers: arrayUnion({ primary: siteName })
        });
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
                            className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                        />
                        <Button
                            onClick={handleDeleteArrayClick}
                            text="Delete Array"
                            className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                        />
                        <Button
                           onClick={handleAddSite}
                           text="Add Site"
                           className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                        />
                        <Button
                           onClick={handleAddSpecies}
                           text="Add Species"
                           className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
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
                                className="bg-white text-black border border-black px-6 py-3 rounded w-full" 
                            />
                            <Button 
                                onClick={() => setShowNewDocumentModal(true)} 
                                text="Create New Document" 
                                className="bg-white text-black border border-black px-6 py-3 rounded w-full" 
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
                                    className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-300 w-full"
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
            {/* Add Site Options Modal */}
            {showAddSiteModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Site Options</h2>
             {/* Project Selection Dropdown */}
             <label className="block mb-2 font-medium">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => handleProjectSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Project</option>
                            <option value="Gateway">Gateway</option>
                            <option value="San Pedro">San Pedro</option>
                            <option value="Virgin River">Virgin River</option>
                        </select>

                        {/* Conditional buttons displayed after project selection */}
                        {selectedProject && (
                            <>
                                <Button
                                    onClick={() => {
                                        setShowViewSites(true);
                                        setShowAddSiteForm(false);
                                        fetchSitesForProject(selectedProject);
                                    }}
                                    text="View Existing Sites"
                                    className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                                />
                                <Button
                                    onClick={() => {
                                        setShowAddSiteForm(true);
                                        setShowViewSites(false);
                                    }}
                                    text="Add New Site"
                                    className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                                />
                            </>
                        )}

            <Button
                onClick={() => setShowAddSiteModal(false)}
                text="Close"
                className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
            />
        </div>
    </div>
)}
            {/* View Sites Modal */}
            {showViewSites && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Existing Sites for {selectedProject}</h2>
            {renderExistingSites()}
            <Button
                onClick={() => setShowViewSites(false)}
                text="Close"
                className="bg-white text-black border border-black px-4 py-2 rounded mt-4"
            />
        </div>
    </div>
)}

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
                            className="bg-white text-black border border-black px-4 py-2 rounded w-full mb-4" 
                        />
                        <Button 
                            onClick={handleSubmitNewDocument} 
                            text="Submit" 
                            className="bg-white text-black border border-black px-4 py-2 rounded w-full mb-2" 
                        />
                        <Button 
                            onClick={() => setShowNewDocumentModal(false)} 
                            text="Cancel" 
                            className="bg-white text-black border brder-black px-4 py-2 rounded w-full" 
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
                            <Button onClick={submitChanges} text="Save" className="bg-white-500 text-black px-4 py-2 rounded" />
                        </div>
                    </div>
                </div>
            )}
            

            {showAddSiteForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Enter New Site</h2>
            <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                placeholder="Enter site name"
            />
            <div className="flex justify-end space-x-2">
                <Button
                    onClick={() => setShowAddSiteForm(false)}
                    text="Cancel"
                    className="bg-white-400 text-black px-4 py-2 rounded"
                />
                <Button
                    onClick={async () => {
                        if (newSiteName.trim()) {
                            await addNewSite(); // Call the addNewSite function here
                            setNewSiteName(''); // Clear input field
                            setShowAddSiteForm(false);
                            setShowAddSiteModal(false);
                        } else {
                            alert("Please enter a site name.");
                        }
                    }}
                    text="Add Site"
                    className="bg-white-500 text-black px-4 py-2 rounded"
                />
            </div>
        </div>
    </div>
)}

{/* Add Species Modal */}
{showAddSpeciesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Species Options</h2>

                        {/* Project Selection Dropdown */}
                        <label className="block mb-2 font-medium">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => handleProjectSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Project</option>
                            <option value="Gateway">Gateway</option>
                            <option value="San Pedro">San Pedro</option>
                            <option value="Virgin River">Virgin River</option>
                        </select>

                        {/* Critter Selection Dropdown */}
                        <label className="block mb-2 font-medium">Select Critter:</label>
                        <select
                            value={selectedCritter}
                            onChange={(e) => handleCritterSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Critter</option>
                            {critterOptions.map((critter, index) => (
                                <option key={index} value={critter}>{critter}</option>
                            ))}
                        </select>

                        {/* View and Add Buttons */}
                        {selectedProject && selectedCritter && (
                            <>
                                <Button
                                    onClick={() => {
                                        setShowViewSpecies(true);
                                        setShowAddSpeciesForm(false);
                                        fetchSpeciesForProjectAndCritter();
                                    }}
                                    text="View Existing Species"
                                    className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                                />
                                <Button
                                    onClick={() => {
                                        setShowAddSpeciesForm(true);
                                        setShowViewSpecies(false);
                                    }}
                                    text="Add New Species"
                                    className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                                />
                            </>
                        )}

                        <Button
                            onClick={() => setShowAddSpeciesModal(false)}
                            text="Close"
                            className="bg-white text-black border border-black px-4 py-2 rounded mb-2"
                        />
                    </div>
                </div>
            )}

            {/* View Species Modal */}
            {showViewSpecies && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Existing Species for {selectedProject} - {selectedCritter}</h2>
                        <ul className="space-y-2">
                            {speciesOptions.map((species, index) => (
                                <li key={index} className="text-black-800">{species}</li>
                            ))}
                        </ul>
                        <Button
                            onClick={() => setShowViewSpecies(false)}
                            text="Close"
                            className="bg-white text-black border border-black px-4 py-2 rounded mt-4"
                        />
                    </div>
                </div>
            )}

            {/* Add New Species Modal */}
            {showAddSpeciesForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Enter New Species</h2>
                        <input
                            type="text"
                            value={newSpeciesName}
                            onChange={(e) => setNewSpeciesName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Enter species name"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => setShowAddSpeciesForm(false)}
                                text="Cancel"
                                className="bg-white-400 text-black px-4 py-2 rounded"
                            />
                            <Button
                                onClick={addNewSpecies}
                                text="Add Species"
                                className="bg-white-500 text-black px-4 py-2 rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


    