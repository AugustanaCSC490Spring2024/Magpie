"use client";
import React from 'react';
import { Header, AboutSection, CreatorCard, GettingStartedSection} from '../components/About';
import '../styles/styles.css'; 
import Link from 'next/link'; 
import catImage1 from '../../../public/cat1.jpg';
import catImage2 from '../../../public/cat2.jpg';
import Dropdown from '../components/Dropdown';
import ContactUs from '../components/ContactUs';

const AboutPage = () => {
  const options = [
    {
      value: 'Complete the Questionnaire',
      label: 'Where to Begin',
      description: "Share your interests and preferences by filling out the questionnaire. This helps us personalize your experience and match you with compatible users.",
    },
    {
      value: 'Edit Your Profile',
      label: 'Edit Your Profile',
      description: "Let your personality shine through! Customize your profile picture, bio, and any other details you'd like to share.",
    },
    {
      value: 'View Matches',
      label: 'View Matches',
      description: "Explore your matches based on your preferences and compatibility scores. You can see profiles, interests, and any additional information people choose to share.",
    },
    {
      value: 'Send Friend Requests',
      label: 'Send Friend Requests',
      description: "Once you find someone interesting, send them a friend request to initiate communication. You can chat, share messages, and build friendships.",
    },
  ];

  return (
    <div className="about-page">
      <Header title="About Us" />
      <AboutSection />
      <div className="creators">
        <CreatorCard name="Aaron Afework" title="Front-End Designer" image = {catImage1}/>
        <CreatorCard name="Aymane Sghier" title="UX/UI Designer" image = {catImage1} />
        <CreatorCard name="Elnatan Tesfa" title="Lead Developer"  image = {catImage1}/>
        <CreatorCard name="Ilyas Jamil" title="Back-End Developer" image = {catImage1}/>
      </div>
      <GettingStartedSection />
      <ContactUs /> 
      <div className="dropdown-container">
        <Dropdown options={options} /> 
      </div>
      <Link className='profile-Button' href="/profile">
        <button type="button" className="button">Profile</button>
      </Link>
    </div>
  );
};

export default AboutPage;
