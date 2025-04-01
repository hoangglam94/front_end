import React, { useState } from 'react';
import './AddUser.css'; // You can create this CSS file for styling

const AddUser = ({ onClose, onAdd }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleAdd = () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        onAdd(email);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add User to Your Workspace</h2>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <div className="modal-actions">
                    <button onClick={handleAdd}>Add</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddUser;