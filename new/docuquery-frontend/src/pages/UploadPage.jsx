import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const isPdf = (f) => f && f.type === 'application/pdf';

  const handleFileUpload = async () => {
    if (!file || !isPdf(file)) return toast.error('Please select a valid PDF file.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', 'default');

    try {
      const res = await axios.post('http://localhost:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('PDF uploaded successfully!');
      navigate(`/query/${res.data.id}`);
    } catch (err) {
      toast.error('Upload failed. Check the file and server.');
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.endsWith('.pdf')) return toast.error('Please enter a valid PDF URL.');
    try {
      const res = await axios.post('http://localhost:8000/upload_url/', {
        url,
        session_id: 'default',
      });
      toast.success('URL submitted successfully!');
      navigate(`/query/${res.data.id}`);
    } catch (err) {
      toast.error('URL submission failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-start py-20 px-4 text-gray-800 animate-fadeIn">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-4">Chat with PDF using AI</h1>
      <p className="text-lg text-center text-gray-600 mb-10 max-w-xl">
        Get instant answers, translate content to other languages or extract data from charts,
        images or tables—all in chat.
      </p>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-10 border-2 border-dashed border-purple-300">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const dropped = e.dataTransfer.files[0];
            if (!isPdf(dropped)) return toast.error('Only PDF files are allowed.');
            setFile(dropped);
          }}
          className={`transition-all text-center p-6 border-2 border-dashed rounded-2xl ${dragActive ? 'border-purple-600 bg-purple-50' : 'border-transparent'}`}
        >
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="uploadFile" />
          <label htmlFor="uploadFile" className="cursor-pointer flex flex-col items-center justify-center">
            <img src="/pdf-icon.png" alt="PDF Icon" className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Upload a PDF file or drag & drop it here</p>
            <p className="text-sm text-gray-500 mt-1">Note: PDF must contain text and be under 5MB</p>
          </label>
        </div>

        <button
          onClick={handleFileUpload}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold tracking-wide shadow-md hover:scale-105 transition-transform"
        >
          📤 Upload PDF
        </button>

        <div className="text-center my-6 text-gray-400 font-semibold">OR</div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter PDF URL Here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleUrlSubmit}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium tracking-wide shadow-md hover:scale-105 transition-transform"
          >
            🔗 Submit URL
          </button>
        </div>
      </div>
    </div>
  );
}
