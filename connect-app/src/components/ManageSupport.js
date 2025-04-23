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

    // useEffect(() => {

    //     if (!token) {
    //         setTimeout(() => navigate("/"), 100);
    //         return;
    //     }

    //     const fetchLinkedAccounts = async () => {
    //         try {
    //             const response = await getLinkedAccounts();
    //             const user_names = response.data.linked_user_names;
    //             setPrimaryUsers(user_names);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchLinkedAccounts();
    // }, [token, navigate]);


    return (
        <div className="manage-support-container">
            <nav className="nav-bar">
                <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
                <div className="navbar-separator"></div>
                <DarkModeToggle />
                <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
            </nav>
            <div className="inner-box">
                <p>Manage Support System</p>
                <p>Your connected support users:</p>
                <div className="support-user-list">

                </div>
            </div>
        </div >
    );
}

export default ManageSupport;