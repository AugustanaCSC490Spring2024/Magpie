"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

function ViewReports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const userNames = {};
            usersSnapshot.forEach(userDoc => {
                userNames[userDoc.id] = userDoc.data().name; 
            });

            const reportsCollection = collection(db, "userReports");
            const reportsSnapshot = await getDocs(reportsCollection);
            const loadedReports = [];
            reportsSnapshot.forEach(reportDoc => {
                reportDoc.data().reports.forEach(report => {
                    loadedReports.push({
                        reporterId: reportDoc.id,
                        reporterName: userNames[reportDoc.id] || 'Unknown', 
                        ...report
                    });
                });
            });
            setReports(loadedReports);
        };

        fetchReports();
    }, []);

    return (
        <div style={{ margin: '20px' }}>
            <h1>Reported Issues</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Reporter Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Reported User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Reason</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Details</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{report.reporterName}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{report.username}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{report.reason}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{report.details}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{report.timestamp.toDate().toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewReports;
