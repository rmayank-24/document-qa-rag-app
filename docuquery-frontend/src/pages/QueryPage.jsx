import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function QueryPage() {
  const { pdfId } = useParams();
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const newQ = { question, answer: 'Loading...' };
    setChat([...chat, newQ]);
    setQuestion('');
    try {
      const res = await axios.post(`http://localhost:8000/chat/`, {
        pdf_id: pdfId,
        query: question,
        session_id: 'default'
      });
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = res.data.response;
        return updated;
      });
    } catch {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = 'Error in fetching response';
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">Chat with your PDF</h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-4 rounded-xl shadow-md mb-4 h-[60vh] overflow-y-auto">
          {chat.map((msg, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-semibold text-purple-700">You: {msg.question}</p>
              <p className="ml-4 text-gray-700">AI: {msg.answer}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 border p-3 rounded-xl"
            placeholder="Ask your PDF something..."
          />
          <button
            onClick={handleAsk}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}