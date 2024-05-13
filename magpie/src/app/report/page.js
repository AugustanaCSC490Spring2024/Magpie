"use client"
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function ReportPage() {
    const [username, setUsername] = useState('');
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userReportRef = doc(db, "userReports", username);

        try {
            const userReportSnap = await getDoc(userReportRef);
            const reportEntry = {
                reason: reason,
                details: details,
                timestamp: new Date()
            };

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
        fontFamily: 'Arial, sans-serif'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '16px'
    };

    return (
        <div style={formStyle}>
            <h1>Report Inappropriate Behavior</h1>
            <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                <label style={{ width: '100%', marginBottom: '10px' }}>
                    Username of User:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    />
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
                <button type="submit" style={{ ...inputStyle, backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }}>Submit Report</button>
            </form>
        </div>
    );
}

export default ReportPage;
