import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageSupport.css";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import getLinkedAccounts from "../api/database";

function ManageSupport() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [primaryUsers, setPrimaryUsers] = useState([]);
    const [selectedPrimary, setSelectedPrimary] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        if (!token) {
            setTimeout(() => navigate("/"), 100);
            return;
        }

        const fetchLinkedAccounts = async () => {
            try {
                const response = await getLinkedAccounts();
                const user_names = response.data.linked_user_names;
                setPrimaryUsers(user_names);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLinkedAccounts();
    }, [token, navigate]);

    const handleRemoveSupportUser = () => {
        // backend logic here
    };

    return (
        <div className="manage-support-container">
            <nav className="nav-bar">
                <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
                <div className="navbar-separator"></div>
                <DarkModeToggle />
                <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
            </nav>
            <div className="inner-box">
                <p className="manage-support-title">Manage Support Users</p>
                <div className="support-user-list">
                    {primaryUsers.map((name) => (
                        <div className="support-user-list-item" key={name} value={name}>
                            {name}
                            <button
                                className="remove-support-btn"
                                onClick={() => setShowModal(true)}
                            >
                                Remove Support User?
                            </button>

                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <h2 className="modal-header">Remove Support User</h2>
                        <p className="modal-text">Are you sure you want to remove this support user?</p>
                        <div className="modal-buttons">
                            <button className="confirm-remove-btn" onClick={handleRemoveSupportUser}>Yes, Remove</button>
                            <button className="cancel-remove-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default ManageSupport;