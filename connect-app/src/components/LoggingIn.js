import { useNavigate } from "react-router-dom";
import "./LoggingIn.css";

function LoggingIn() {
    const navigate = useNavigate();

    return(
        <div className="logging-in-container">
            <div className="top-right-title"> CogniSphere </div> 
            <div className="logging-in-box">
                <button className="exit-button" onClick={() => navigate("/")}>X</button>
                <h2>Log In</h2>

                <input type="email" placeholder="Email" className="input-field" />
                <input type="password" placeholder="Password" className="input-field" />
                <button className="login-button">Log In</button>
            </div>
        </div>
    );
}

export default LoggingIn; 