import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import "./LoggingIn.css";
import mockUsers from "../mockUsers";

function LoggingIn() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = () => {
        const storedUsers = JSON.parse(sessionStorage.getItem("users")) || [];
        const allUsers = [...mockUsers, ...storedUsers]; 
    
        const foundUser = allUsers.find(user => user.email === userName && user.password === password);
    
        if (foundUser) {
            if (foundUser.type === "main") {
                setIsLoading(true);
                setTimeout(() => {
                navigate("/primaryhomepage")
                }, 2000); 
            } else if (foundUser.type === "support") {
                setIsLoading(true);
                setTimeout(() => {
                navigate("/supporthomepage");
                }, 2000); 
            } else {
                setIsLoading(true);
                setTimeout(() => {
                navigate("/primaryhomepage"); 
                }, 2000); 
            }
        } else {
            setError("Invalid username or password.");
        }
    };
    

    return (
        <div className="logging-in-container">
            <div className="top-right-title">CogniSphere</div> 
            <div className="logging-in-box">
                <button className="exit-button" onClick={() => navigate("/")}>X</button>
                
                <h2>Log In</h2>
    
                {isLoading ? (
                    <p className="loading-text">Logging in...</p>
                ) : (
                    <>

                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="input-field" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="input-field" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        {error && <p className="error-text">{error}</p>}
                        
                        <button className="login-button" onClick={handleLogin}>Log In</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default LoggingIn;