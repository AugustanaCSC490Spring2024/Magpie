"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../globals.css";

const halls = [
    { name: "Seminary Hall", url: "https://example.com/seminary" },
    { name: "Andreen Hall", url: "https://matterport.com/discover/space/47DZGWAqyCu" },
    { name: "Swanson Commons", url: "https://matterport.com/discover/space/xsyncVsCagZ" },
    { name: "Erickson Hall", url: "https://example.com/erickson" },
    { name: "Westerlin Hall", url: "https://matterport.com/discover/space/d6s1udvDxjo" },
    { name: "Naeseth Townhouses", url: "https://example.com/naeseth" },
    { name: "Parkander", url: "https://matterport.com/discover/space/mkmTUsfHCLU" },
    { name: "Arbaugh", url: "https://example.com/arbaugh" }
];

const Tour = () => {
    const [isOpen, setOpen] = useState(false);
    const [bubbles, setBubbles] = useState([]);

    // Generate random bubbles
    useEffect(() => {
        const newBubbles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
            left: `${Math.floor(Math.random() * 100)}vw`
        }));
        setBubbles(newBubbles);
    }, []);

    const toggleDoor = () => setOpen(!isOpen);

    return (
        <div className="tour-container">
            {/* <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1.0 }}
                        style={{ textAlign: 'center', color: '#fff', fontSize: '2.5rem', marginTop: '8px', paddingTop:'50px' }}>
                        Tour the Residential Halls
                    </motion.h1> */}
            {bubbles.map(bubble => (
                <div key={bubble.id} className={`bubble ${bubble.size}`} style={{ left: bubble.left }}></div>
            ))}
            {!isOpen && (
                <motion.div className="door"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    onClick={toggleDoor}>
                    CLICK TO FULLY OPEN AND START TOURING
                </motion.div>
            )}
            {isOpen && (
                <>
                    
                    <div className="hallway">
                        {halls.map((hall, index) => (
                            <motion.div key={index} className={`hall ${index % 2 === 0 ? 'left' : 'right'}`}
                                initial={{ opacity: 0, y: 70 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                whileHover={{ scale: 1.1, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)" }}>
                                <a href={hall.url} target="_blank" rel="noopener noreferrer">{hall.name}</a>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Tour;
