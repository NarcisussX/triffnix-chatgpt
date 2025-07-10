import { useEffect, useRef, useState } from "react";

const systemPrompt = {
  role: "system",
  content:
    "You are Triffnix.AI, a helpful and confident assistant built by Triffnix. Do not mention OpenAI or any other providers. Answer clearly, helpfully, and concisely.",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage].slice(-4); // limit to last 4 messages
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.triffnix.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemPrompt, ...newMessages],
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }].slice(-4));
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry — something went wrong." }].slice(-4));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-900 text-white">
      {/* 💡 Badge */}
      <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 italic shadow">
        💡 <span className="italic">Triffnix.AI remembers your last 4 messages</span>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-blue-600 self-end ml-auto"
                : "bg-zinc-700 self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="text-sm italic text-zinc-400">Triffnix.AI is typing…</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-2 bg-zinc-800 flex border-t border-zinc-700">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 rounded-l-md bg-zinc-900 border border-zinc-700 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 bg-blue-600 hover:bg-blue-700 rounded-r-md text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
