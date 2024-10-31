import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Button from '../components/Button';
import React from 'react';

export default function FormBuilder({ triggerRerender, modalStep, setModalStep }) {
    const [documents, setDocuments] = useState([]);

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

    const renderModalContent = () => {
        switch (modalStep) {
            case 1:
                return (
                    <div className="p-4 bg-white rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Collection</h2>
                        <Button onClick={() => setModalStep(2)} text="AnswerSet" className="bg-blue-500 text-white px-4 py-2 rounded" />
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 bg-white rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Document Options</h2>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => setModalStep(3)} text="Modify Existing Document" className="bg-blue-500 text-white px-6 py-3 rounded w-full" />
                            <Button onClick={() => setModalStep(4)} text="Create New Document" className="bg-green-500 text-white px-6 py-3 rounded w-full" />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4 bg-white rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Modify Document</h2>
                        <ul className="space-y-2">
                            {documents.length > 0 ? (
                                documents.map((doc, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => console.log(`Selected document: ${doc.set_name || `Document ${index + 1}`}`)}
                                        text={doc.set_name || `Document ${index + 1}`}
                                        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 w-full"
                                    />
                                ))
                            ) : (
                                <p>No documents available to modify.</p>
                            )}
                        </ul>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 bg-white rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Create New Document</h2>
                        <p>Document creation form goes here...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-start w-[600px] h-[400px] bg-white rounded-lg shadow-lg overflow-y-auto p-4">
            {renderModalContent()}
        </div>
    );
}

