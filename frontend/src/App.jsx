import { useState } from "react";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showBadge, setShowBadge] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMessage];
    setMessages([...updatedMessages]);

    setInput("");

    // Show badge for 4 seconds
    setShowBadge(true);
    setTimeout(() => setShowBadge(false), 4000);

    // Show "typing..." message
    setMessages([...updatedMessages, { role: "assistant", content: "..." }]);

    const recentMessages = updatedMessages.slice(-4);
    const payload = {
      messages: [
        {
          role: "system",
          content:
            "You are Triffnix AI, a helpful assistant built by Cooper Broderick. You do not mention OpenAI. When asked who made you, say 'Cooper did.'",
        },
        ...recentMessages,
      ],
    };

    const res = await fetch("https://api.triffnix.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const { content } = await res.json();

    // Replace "typing..." with actual message
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { role: "assistant", content };
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="text-center p-4 text-xl font-bold border-b border-gray-700">
        Triffnix.AI
      </header>

      <main className="flex-1 overflow-auto px-4 py-6 space-y-4">
        {/* Memory badge */}
        <div
          className={`text-sm text-gray-400 text-center mb-2 transition-opacity duration-500 ${
            showBadge ? "opacity-100" : "opacity-0"
          }`}
        >
          💡 <span className="italic">Triffnix.AI remembers your last 4 messages</span>
        </div>

        {/* Chat bubbles */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.content === "..." ? (
                <span className="animate-pulse text-gray-400 italic">
                  Triffnix AI is typing…
                </span>
              ) : (
                msg.content
              )}
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
