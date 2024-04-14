"use client";
import AdminHome from "../components/AdminHome";
import React from 'react';
import "../globals.css";

const AdminPage = () => {
  return (
    <div className="admin-page-background">
      <div>
        <img src="/Viking.png" alt="Admin Logo" className="Viking-img" />
      </div>
      <AdminHome />
    </div>
  );
};

export default AdminPage;
