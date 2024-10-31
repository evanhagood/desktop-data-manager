import Modal from "../components/Modal";
import { FormBuilder } from "../pages";
import React, { useState } from 'react';

export default function FormBuilderModal({ showModal, onCancel, onOkay, triggerRerender }) {
    const [modalStep, setModalStep] = useState(1);

    const handleBack = () => {
        console.log("Back button clicked");
        setModalStep(2);
        console.log("modalStep after setting to 2:", modalStep);
    };

    console.log("Rendering FormBuilderModal - Current modalStep:", modalStep);

    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            onBack={handleBack}
            title="Form Builder"
            text="Create custom forms in a few easy steps with Field Day!"
            buttonOptions={{
                back: 'Back',
                cancel: 'Close',
                okay: '',
            }}
        >
            <div className="w-[600px] h-[400px] p-4 bg-white rounded-lg shadow-lg flex items-center justify-center">
                {/* Ensure inner FormBuilder also respects square shape */}
                <FormBuilder
                    triggerRerender={triggerRerender}
                    modalStep={modalStep}
                    setModalStep={setModalStep}
                />
            </div>
        </Modal>
    );
}

