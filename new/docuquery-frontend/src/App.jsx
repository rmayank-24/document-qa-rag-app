import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import QueryPage from './pages/QueryPage';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/query/:pdfId" element={<QueryPage />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </Router>
  );
}
