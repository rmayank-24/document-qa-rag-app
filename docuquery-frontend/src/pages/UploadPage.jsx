import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const isPdf = (file) => file && file.type === 'application/pdf';

  const handleFileUpload = async () => {
    if (!file || !isPdf(file)) return toast.error('Upload a valid PDF.');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', 'default');
    try {
      const res = await axios.post('http://localhost:8000/upload/', formData);
      toast.success('Uploaded successfully!');
      navigate(`/query/${res.data.id}`);
    } catch (err) {
      toast.error('Upload failed.');
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.endsWith('.pdf')) return toast.error('Invalid PDF URL.');
    try {
      const res = await axios.post('http://localhost:8000/upload_url/', {
        url,
        session_id: 'default',
      });
      toast.success('URL submitted!');
      navigate(`/query/${res.data.id}`);
    } catch (err) {
      toast.error('Submission failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-purple-700 mb-2 text-center">📄 DocuQuery</h1>
        <p className="text-gray-600 text-center mb-8">Upload or link a PDF and start chatting</p>

        <div className="border-2 border-dashed rounded-xl p-6 mb-4 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />
          <button
            onClick={handleFileUpload}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Upload PDF
          </button>
        </div>

        <div className="text-center text-gray-400 mb-4 font-semibold">OR</div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter PDF URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={handleUrlSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
