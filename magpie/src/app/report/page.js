"use client"
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function ReportPage() {
    const [users, setUsers] = useState([]); 
    const [username, setUsername] = useState('');
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, "userProfiles");
            const snapshot = await getDocs(usersCollection);
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userReportRef = doc(db, "userReports", username); 
    
      
        const selectedUserInfo = users.find(user => user.id === username);
        const selectedUserName = selectedUserInfo ? selectedUserInfo.name : "Unknown";
    
        try {
            const reportEntry = {
                username: selectedUserName, 
                reason: reason,
                details: details,
                timestamp: new Date()
            };
    
            const userReportSnap = await getDoc(userReportRef);
            if (userReportSnap.exists()) {
                await updateDoc(userReportRef, {
                    reports: arrayUnion(reportEntry)
                });
            } else {
                await setDoc(userReportRef, {
                    reports: [reportEntry]
                });
            }
            alert('Report submitted successfully!');
            setUsername('');
            setReason('');
            setDetails('');
        } catch (error) {
            console.error("Error writing document: ", error);
            alert('Error submitting report. Please try again.');
        }
    
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#0051BA',
        color: 'white'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '16px',
        backgroundColor: 'white',
        color: '#333',
        border: '2px solid #F5A623',
    };

    const buttonStyle = {
        ...inputStyle,
        backgroundColor: '#F5A623',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
    };

    return (
        <div style={formStyle}>
            <h1>Report Inappropriate Behavior</h1>
            <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                <label style={{ width: '100%', marginBottom: '10px' }}>
                    Username of User:
                    <select
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </label>
                <label style={{ width: '100%', marginBottom: '10px' }}>
                    Reason for Report:
                    <select value={reason} onChange={e => setReason(e.target.value)} style={inputStyle} required>
                        <option value="">Select a reason</option>
                        <option value="inaccurate_profile">Inaccurate Profile Information</option>
                        <option value="unresponsive">Unresponsive or Inactive</option>
                        <option value="inappropriate_communication">Inappropriate Communication</option>
                        <option value="harassment">Harassment or Bullying</option>
                        <option value="illegal_activity">Illegal Activity</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <label style={{ width: '100%', marginBottom: '10px' }}>
                    Details (please explain the issue):
                    <textarea
                        value={details}
                        onChange={e => setDetails(e.target.value)}
                        style={{ ...inputStyle, height: '100px' }}
                        required
                    />
                </label>
                <button type="submit" style={buttonStyle}>Submit Report</button>
            </form>
        </div>
    );
}

export default ReportPage;
