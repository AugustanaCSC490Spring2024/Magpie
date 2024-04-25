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

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = 'Contact Us Form Submission';
    const body = `Email: ${email}%0D%0A%0D%0AMessage: ${message}`;
    const mailtoLink = `mailto:aaronyo2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    // Attempt to open the default email client with the pre-populated email
    const opened = window.open(mailtoLink, '_self');
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      console.error('Failed to open email client.');
      // Optionally, display an error message to the user
    } else {
      console.log('Email client opened successfully.');
      // Optionally, display a success message to the user
      // Reset form fields (optional)
      setEmail('');
      setMessage('');
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
