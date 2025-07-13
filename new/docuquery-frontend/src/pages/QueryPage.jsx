// ✅ src/pages/QueryPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const QueryPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chat, setChat] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const pdf_id = localStorage.getItem("pdf_id");
  const session_id = localStorage.getItem("session_id");

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return toast.error("Enter a question");

    try {
      const res = await axios.post("http://127.0.0.1:8000/query/", {
        question,
        pdf_id,
        session_id,
      });

      setAnswer(res.data.answer);
      setPdfUrl(`http://127.0.0.1:8000${res.data.file}`);

      setChat((prev) => [...prev, { q: question, a: res.data.answer }]);
      setQuestion("");
    } catch (err) {
      toast.error("Error querying the document.");
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="border rounded-xl shadow-md p-2 bg-white h-[90vh]">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF"
            className="w-full h-full rounded"
          />
        ) : (
          <p className="text-gray-500">PDF will appear here after first query.</p>
        )}
      </div>

      <div className="flex flex-col h-[90vh] justify-between">
        <div className="overflow-y-auto max-h-[80vh] p-2 bg-white rounded-xl shadow-md">
          {chat.map((entry, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">You: {entry.q}</p>
              <p className="text-green-700">Bot: {entry.a}</p>
            </div>
          ))}
        </div>

        <form onSubmit={askQuestion} className="mt-2 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border px-4 py-2 rounded shadow"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default QueryPage;
