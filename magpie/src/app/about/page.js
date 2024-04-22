// pages/about.js
"use client";
import React from 'react';
import { Header, AboutSection, CreatorCard, CreatorCard2, GettingStartedSection, PlaceholderImage} from '../components/About';
import '../styles/styles.css'; 
import { useRouter } from 'next/navigation'; 
import Dropdown from '../components/Dropdown';

const AboutPage = () => {
  const router = useRouter()
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
  const handleHomeButtonClick = () => {
    router.push('/'); 
  };
  return (
    <div className="about-page">
      <Header title="About Us" />
      <AboutSection />
      <div className="creators">
        <CreatorCard2 name="Aaron Afework" title="Front-End Designer"/>
        <CreatorCard name="Aymane Sghier" title="UX/UI Designer"  />
        <CreatorCard name="Elnatan Tesfa" title="Lead Developer"  />
        <CreatorCard name="Ilyas Jamil" title="Back-End Developer" />
      </div>
      <GettingStartedSection />
      {options.map((option, index) => (
  <Dropdown key={index} option={[option]} />
))}
      <button type="button" className="button" onClick={handleHomeButtonClick} >Home Page</button>
    </div>
    
  );
};

export default AboutPage;