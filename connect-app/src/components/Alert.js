import React, { useState } from "react";
import "./Alert.css";


const Alert = ({ title, description, show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="alert-overlay" onClick={onClose}>
            <div className="alert-box" onClick={(e) => e.stopPropagation()}>
                <button className="close-alert" onClick={onClose}>×</button>
                <h2 className="alert-title">{title}</h2>
                <p className="alert-text">{description}</p>
                <div className="alert-buttons">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Alert;