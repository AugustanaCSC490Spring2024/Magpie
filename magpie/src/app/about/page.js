import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: '#003459', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <h1 style={{ textAlign: 'center', color: 'white', paddingTop: '30px' }}>About Us</h1>
      <p style={{ fontSize: '20px' , paddingLeft: '1000px',textAlign: 'center', color: 'white', paddingTop: '70px', paddingRight: '120px'}}>
        This is the About page content. Here, you can learn more about the talented
        individuals who brought this project to life. We are a passionate team of
        developers, designers, and content creators dedicated to building
        innovative and user-friendly experiences.
      </p>
      <p style={{fontSize: '20px' , paddingRight: '1000px', textAlign: 'center', color: 'white', paddingTop: '70px', paddingLeft: '120px'}}>
        Each member brings a unique set of skills and experiences to the table,
        fostering a collaborative and creative environment. We are constantly
        learning and growing, striving to push the boundaries of what's possible.
      </p>
      <p style={{ fontSize: '20px' , paddingLeft: '1000px',textAlign: 'center', color: 'white', paddingTop: '70px', paddingRight: '120px'}}>
        We are driven by a shared desire to make a positive impact and believe that
        technology can be a powerful tool for good. We are excited to share our
        creations with the world and hope you enjoy using them!
      </p>
      <div className="creators" style={{color: 'white', paddingLeft:'10px', paddingRight:'10px',paddingTop: '70px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: 'auto',backgroundColor: 'rgba(0, 126, 167, .3)', borderRadius: '15px' }}>
        <CreatorCard name="John Doe" title="Lead Developer" />
        <CreatorCard name="Jane Smith" title="UX/UI Designer" />
        <CreatorCard name="Michael Chen" title="Content Writer" />
        <CreatorCard name="Sarah Lee" title="Data Scientist" />
      </div>
    </div>
  );
};

const CreatorCard = ({ name, title }) => (
    <div
      className="creator-card"
      style={{
        width: '300px',
        height: '500px',
        margin: '10px',
        padding: '15px',
        paddingTop: '400px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        textAlign: 'bottom',
        Color: 'white',
       
      }}
    >
      <h3>{name}</h3>
      <p>{title}</p>
    </div>
  );

export default AboutPage;