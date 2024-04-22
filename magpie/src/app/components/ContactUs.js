import React, { useState } from 'react';

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('aaronyo2002@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });
      if (response.ok) {
        console.log('Email sent!');
        // Optionally, display a success message to the user
      } else {
        console.error('Failed to send email:', response.statusText);
        // Optionally, display an error message to the user
      }
      // Reset form fields
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send email:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactUs;
