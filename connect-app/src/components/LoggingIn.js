import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import "./LoggingIn.css";
import mockUsers from "../mockUsers";

function LoggingIn() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const handleLogin = () => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const allUsers = [...mockUsers, ...storedUsers];
    
        const foundUser = allUsers.find(user => user.email === userName && user.password === password);
    
        if (foundUser) {
            if (foundUser.type === "main") {
                navigate("/primaryhomepage");
            } else if (foundUser.type === "support") {
                navigate("/supporthomepage");
            } else {
                navigate("/primaryhomepage");
            }
        } else {
            setError("Invalid username or password.");
        }
    };
    

    return(
        <div className="logging-in-container">
            <div className="top-right-title"> CogniSphere </div> 
            <div className="logging-in-box">
                <button className="exit-button" onClick={() => navigate("/")}>X</button>
                <h2>Log In</h2>

                <input type="email" placeholder="Email" className="input-field" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <p className="error-text">{error}</p>}
                <button className="login-button" onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

export default LoggingIn; 