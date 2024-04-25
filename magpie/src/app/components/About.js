
import React from 'react';
import Image from 'next/image';
import catImage1 from '../../../public/cat1.jpg';
import catImage2 from '../../../public/cat2.jpg';
import './../styles/Dropdown.css';
import roomate1 from '../../../public/Roomate1.jpg';
import roomate2 from '../../../public/Roomate2.jpg';
import '../styles/styles.css'




export const Header = ({ title }) => (
  <div className="section">
    <h1>{title}</h1>
  </div>
);

export const AboutSection = () => (
    <div className="section">
      <div style={{color: 'white', display: 'flex', alignItems: 'center' }}>
        <div className='image-container' style={{ marginLeft: '10%' ,  marginRight: '10%' }}>
          <Image src={roomate1} 
          placeholder='blur'
          quality={100} 
          width={700}
          style={{ borderRadius: '15px' }}
          height={350}
          alt="roomate1" />
        </div>
        <div style={{paddingBottom:  '5%', marginLeft: '1%', marginRight: '5%'}}>
          <p>
          Roommixer revolutionizes college roommate selection by connecting you with compatible roommates based on shared interests and preferences. No more random assignments or compatibility issues – just seamless connections for a harmonious college experience. Join Roommixer today and find your perfect roommate match effortlessly!
          </p>
        </div>
      </div>
      <div style={{ paddingBottom:  '5%',display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <div style={{marginLeft: '5%', marginRight: '1%'}}>
          <p>
            
At Roommixer, we're not just about finding roommates – we're about fostering a community where every student feels supported and understood. Our mission is to create inclusive living environments where diversity is celebrated and friendships thrive. Join us in building a brighter, more connected college experience where everyone belongs.
          </p>
        </div>
        <div className='image-container' style={{borderRadius: '5%', marginLeft: '10%' , marginRight: '10%'}}>
          <Image 
          src= {roomate2} 
          style={{ borderRadius: '15px' }}
          width={700}
          height={350}
          placeholder='blur'
          quality={100} 
          alt="roomate2" />
        </div>
      </div>
      <div style={{ paddingBottom:  '5%', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <div className='image-container' style={{  marginLeft: '10%' , marginRight: '10%' }}>
        <Image 
          src= {roomate2} 
          style={{ borderRadius: '15px' }}
          width={700}
          height={350}
          placeholder='blur'
          quality={100} 
          alt="roomate2" />
        </div>
        <div style={{marginLeft: '1%', marginRight: '5%'}}>
          <p>
            
Looking ahead, our aspirations extend beyond just matching roommates. We envision Roommixer as a platform that empowers students to connect, collaborate, and grow together. We're committed to expanding our services to offer resources for academic support, career development, and personal growth. By continuously innovating and listening to our users, we aim to be the go-to destination for all aspects of the college experience, helping students make the most of their journey both inside and outside the classroom.
          </p>
        </div>
      </div>
      <h3>This is our Team</h3>
    </div>
  );

export const CreatorCard = ({ name, title }) => (
  <div className="creator-card">
    <Image src={catImage1} 
    alt="catImage1"
    placeholder='blur'
    quality={100} />
    <h3>{name}</h3>
    <p>{title}</p>
  </div>
);
export const CreatorCard2 = ({ name, title }) => (
    <div className="creator-card">
      <Image src={catImage2} 
      alt="catImage2"
      placeholder='blur'
      quality={100} />
      <h3>{name}</h3>
      <p>{title}</p>
    </div>
  );
export const GettingStartedSection = () => (
  <div className="section">
    {/* Getting started section content */}
  </div>
  
);
