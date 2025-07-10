import { useState } from "react";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");

    const res = await fetch("https://api.triffnix.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });

    const { content } = await res.json();
    setMessages([...updated, { role: "assistant", content }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="text-center p-4 text-xl font-bold border-b border-gray-700">
        ChatGPT SPA
      </header>
      <main className="flex-1 overflow-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 rounded px-3 py-2 bg-gray-800 border border-gray-600 text-white focus:outline-none"
            placeholder="Type your message…"
          />
          <button
            onClick={send}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
