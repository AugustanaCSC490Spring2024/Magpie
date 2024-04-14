"use client";
import React from 'react';
import { AuthContextProvider } from "../context/AuthContext";
import Dashboardpage from "../components/Dashboardpage";
import Message from '../components/messaging';  // Adjust the path as necessary
import { useRouter } from 'next/navigation';  // Correct the import here

const Dashboard = () => {
    const router = useRouter(); // This seems unused; consider removing if not needed

    return (
        <AuthContextProvider>
            <Dashboardpage>
                <Message/>  
            </Dashboardpage>
        </AuthContextProvider>
    );
}

export default Dashboard;
