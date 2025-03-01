import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SurveyPage.css"; 

function SurveyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cognitiveChallenges: "",
    memoryIssues1: "",
    memoryIssues2: "",
    memoryIssues3: "", 
    preferredExercise: "",
    socialSupport: "",
    feelingLoved: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStepComplete = () => {
    if (step === 1) return formData.memoryIssues1 && formData.memoryIssues2 && formData.memoryIssues3 && formData.cognitiveChallenges;
    if (step === 2) return formData.preferredExercise;
    if (step === 3) return formData.socialSupport && formData.feelingLoved;
    return false; 
    };

    const handleNext = () => {
        if (isStepComplete()) setStep(step + 1);
      }; 
      
    // const handleBack = () => setStep(step - 1);


  const handleSubmit = () => {
    console.log("Survey Data:", formData);
    localStorage.setItem("surveyCompleted", "true"); 
    localStorage.setItem("surveyData", JSON.stringify(formData)); 
    navigate("/primaryhomepage"); 
  };

  const sendSurveyDataToBackend = async (userId, surveyData) => {
    try {
        const payload = {
            userId: userId,  
            responses: surveyData
        };

        /*
        const response = await fetch("http://localhost:5000/api/saveSurvey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Survey successfully saved:", result);
        */

        console.log("Survey data (not sent yet):", payload);

    } catch (error) {
        console.error("Error sending survey data:", error);
    }
    };

    return (
        <div className="survey-page">
          <nav className="nav-bar">
            <a href="/">
              <div className="title">CogniSphere</div>
            </a>
            <button
              className="logout-button"
              onClick={() => navigate("/presurvey")}
            >
              ← Back
            </button>
          </nav>
      
          <div className="survey-container">
            <h2>Baseline Cognitive & Wellness Survey</h2>
      
            {step === 1 && (
              <div>
                <h3>Cognitive Health</h3>
                <label>Do you have trouble remembering recent events?</label>
                <select name="memoryIssues1" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="rarely">Rarely</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                </select>
      
                <label>Do you often forget where you put things?</label>
                <select name="memoryIssues2" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="rarely">Rarely</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                </select>
      
                <label>Are you having difficulty with names?</label>
                <select name="memoryIssues3" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="rarely">Rarely</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                </select>
      
                <label>Do you struggle with focus or problem-solving?</label>
                <select name="cognitiveChallenges" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="no">No</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="frequently">Frequently</option>
                </select>
      
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className={`next-button ${!isStepComplete() ? "disabled" : ""}`}
                >
                  Next
                </button>
              </div>
            )}
      
            {step === 2 && (
              <div>
                <h3>Physical Activity Preferences</h3>
                <label>What type of exercise do you prefer?</label>
                <select name="preferredExercise" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="walking">Walking</option>
                  <option value="stretching">Stretching</option>
                  <option value="light aerobics">Light Aerobics</option>
                  <option value="yoga">Yoga</option>
                  <option value="dancing">Dancing</option>
                  <option value="swimming">Swimming</option>
                  <option value="cycling">Cycling</option>
                  <option value="weight training">Weight Training</option >
                  <option value="other">Other</option> 
                </select>
      
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className={`next-button ${!isStepComplete() ? "disabled" : ""}`}
                >
                  Next
                </button>
              </div>
            )}
      
            {step === 3 && (
              <div>
                <h3>Social Well-Being</h3>
                <label>Do you have a strong support system?</label>
                <select name="socialSupport" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="yes">Yes, I feel supported</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="no">No, I often feel isolated</option>
                </select>
      
                <label>Do you regularly receive loving or motivational messages?</label>
                <select name="feelingLoved" onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="yes">Yes, frequently</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="rarely">Rarely</option>
                </select>
      
                <button
                  onClick={handleSubmit}
                  disabled={!isStepComplete()}
                  className={`next-button ${!isStepComplete() ? "disabled" : ""}`}
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      );
}

console.log(localStorage.getItem("surveyData")); // access local storage 

export default SurveyPage;
