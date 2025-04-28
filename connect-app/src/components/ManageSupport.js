import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageSupport.css";
import DarkModeToggle from "./DarkModeToggle";
import Alert from "./Alert";
import { useAuth } from "../context/AuthContext";
// import { getLinkedAccounts } from "../api/database";

function ManageSupport() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [linkedAccounts, setLinkedAccounts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // if (!token) {
        //     setTimeout(() => navigate("/"), 100);
        //     return;
        // }

        // const fetchLinkedAccounts = async () => {
        //     try {
        //         const response = await getLinkedAccounts();
        //         const user_names = response.data.linked_user_names;
        //         setLinkedAccounts(user_names);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // };
        // fetchLinkedAccounts();
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

                {linkedAccounts.length > 0 ? (<div className="support-user-list">
                    {linkedAccounts.map((name) => (
                        <div className="support-user-list-item" key={name} value={name}>
                            {name}
                            <button
                                className="remove-support-btn"
                                onClick={() => setShowAlert(true)}
                            >
                                Remove Support User?
                            </button>

                        </div>
                    ))}
                </div>
                ) : (
                    <div>
                        <p className="no-users-found">No linked users found.</p>
                        <button
                            className="add-support-btn"
                            onClick={() => navigate('/addsupport')}
                        >
                            Add a support user?
                        </button>
                    </div>
                )}
            </div>
            {showAlert && (
                <div>
                    <Alert
                        title="Remove Support User?"
                        description="Are you sure you want to remove this support user?"
                        show={showAlert}
                        onClose={() => setShowAlert(false)}
                    >
                        <button className="confirm-remove-btn" onClick={handleRemoveSupportUser()}>Yes, Remove</button>
                        <button className="cancel-remove-btn" onClick={() => setShowAlert(false)}>Cancel</button>
                    </Alert>
                </div>
            )}
        </div >
    );
}

export default ManageSupport;