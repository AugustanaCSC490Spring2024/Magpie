// Onboarding.js
import React, { useState } from 'react';
import { db } from './firebase'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';

const Onboarding = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responses, setResponses] = useState({
    gender: '',
    major: '',
    class_year: '',
    preferred_hall: '',
    // Include all other response keys here
  });

  const handleNext = () => {
    if (currentQuestion < 15) { // Adjust based on the number of questions
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitResponses();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses({
      ...responses,
      [name]: value,
    });
  };

  const submitResponses = async () => {
    try {
      const docRef = await addDoc(collection(db, 'userResponses'), responses);
      console.log('Document written with ID: ', docRef.id);
      // You might want to redirect the user to another page after submission
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Simplified render logic for demonstration purposes
  return (
    <div>
      {currentQuestion === 1 && (
        <div>
          <label htmlFor="gender">What is your gender?</label>
          <select id="gender" name="gender" required onChange={handleChange} value={responses.gender}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
      {/* Render other questions based on currentQuestion */}
      <button onClick={handleBack} disabled={currentQuestion === 1}>Back</button>
      <button onClick={handleNext}>{currentQuestion === 15 ? 'Submit' : 'Next'}</button>
    </div>
  );
};

export default Onboarding;
