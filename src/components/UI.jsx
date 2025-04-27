import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { StreamChat } from "stream-chat";
import { Mic, Send, Menu } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const API_KEY = "c98rquakad9f";
const USER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVXNlcnNfZTNiNDRhODItODcxYS00YzI2LThiN2QtMTgxMTJmOTNiN2YzIn0.FaAYckhZZkhnUtTyB-vvDt008UjDpCmH0UAA3upRMZ8";
const USER_ID = "Users_e3b44a82-871a-4c26-8b7d-18112f93b7f3";

const RANDOM_NAMES = ["Introvert", "Prince", "Loyal", "Clever", "Honest", "Sweet", "Toxic"];

const getRandomName = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
  return RANDOM_NAMES[randomIndex];
};

const USER_NAME = getRandomName(); 

const chatClient = StreamChat.getInstance(API_KEY);

chatClient.connectUser(
  {
    id: USER_ID,
    name: USER_NAME,
  },
  USER_TOKEN
);

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, message, error } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const channel = chatClient.channel("messaging", "general", {
      name: "General",
      members: [USER_ID],
    });

    channel.watch().then(() => {
      setChannel(channel);
    });

    const handleMessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.message]);
    };

    channel.on("message.new", handleMessage);

    return () => {
      channel.off("message.new", handleMessage);
      channel.stopWatching();
    };
  }, []);

  const sendMessage = async (text) => {
    if (!loading && text.trim()) {
      if (channel) {
        await channel.sendMessage({
          text,
          user: { id: USER_ID, name: USER_NAME },
        });
      }
      await chat(text);
      input.current.value = "";
    }
  };

  const handleVoiceMessage = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("Voice recording started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.current.value = transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("Voice recording stopped.");
    };

    recognition.start();
  };

  useEffect(() => {
    const msgText = typeof message === "string" ? message : message?.message || message?.text;
    if (msgText) {
      setMessages((prevMessages) => [...prevMessages,
        { text: msgText, user: { id: "AI", name: "Miyu" } },
      ]);
    }
    console.log(message);
  }, [message]);
  

  console.log(message)

  if (hidden) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-10 flex flex-col justify-between p-6"
      style={{ pointerEvents: "none" }}
    >
      <div>
        <nav
          className="flex flex-row md:flex-row gap-4 px-5 items-center justify-between md:items-start pointer-events-auto"
          style={{ pointerEvents: "auto" }}
        >
          <div>
            <a
              href="Home"
              className="text-white font-medium hover:text-gray-300 transition-colors duration-200"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', sans-serif", fontWeight: "bold" }}
            >
              MIYU AI
            </a>
          </div>

          <div className="md:hidden relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-3 rounded-xl bg-gray-600 bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 shadow-md"
            >
              <Menu size={22} />
            </button>

            <div
              className={`absolute ${isMenuOpen ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} 
                flex-col bg-gray-900 bg-opacity-30 backdrop-blur-md p-4 rounded-xl right-0 top-full w-48 
                transition-all duration-300 shadow-lg`}
            >
              <a
                href="#"
                className="text-white font-medium hover:text-gray-300 transition-colors duration-200 p-3 rounded-md hover:bg-gray-700 w-full text-center"
                style={{ fontFamily: "'ZCOOL QingKe HuangYou', sans-serif", fontWeight: "bold", display: "block" }}
              >
                TWITTER
              </a>
              <a
                href="#"
                className="text-white font-medium hover:text-gray-300 transition-colors duration-200 p-3 rounded-md hover:bg-gray-700 w-full text-center"
                style={{ fontFamily: "'ZCOOL QingKe HuangYou', sans-serif", fontWeight: "bold", display: "block" }}
              >
                GITHUB
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-row gap-6">
            <a
              href="#"
              className="text-white font-medium hover:text-gray-300 transition-colors duration-200"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', sans-serif", fontWeight: "bold" }}
            >
              TWITTER
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-gray-300 transition-colors duration-200"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', sans-serif", fontWeight: "bold" }}
            >
              GITHUB
            </a>
          </div>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', marginTop: '30px', marginRight: "20px" }}>
          <div className="flex items-center gap-2 py-1 px-3 rounded-[40px] bg-gray-500 bg-opacity-15 border border-gray-600">
            <span className="text-red-500 font-medium">Live Chat</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-[600px] h-[50vh] md:h-[80vh] flex flex-col bg-black bg-opacity-20 p-4 rounded-[1.2rem] shadow-xl border border-gray-600 pointer-events-auto fixed bottom-0 left-0 md:relative md:bottom-auto md:left-auto mobile-chat"
        style={{ pointerEvents: "auto", backgroundColor: "rgba(35, 35, 35, 0.2)" }}
      >
        <div className="hidden md:block text-white text-m font-semibold p-3 rounded-[1.5rem] bg-gray-500 bg-opacity-20 shadow-md ">
          Chat
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-auto  p-4 rounded-lg shadow-inner mt-2">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {messages.map((msg, index) => (
            <div key={index} className="text-white mb-2">
              <div className="flex items-center gap-2">
                <strong>{msg.user?.name || msg.user?.id}</strong>
                {msg.user?.id === USER_ID && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-green-400">Live</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <div><ReactMarkdown>{msg.text}</ReactMarkdown></div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 italic text-sm flex items-center">
              AI is thinking
              <span className="ml-1 animate-pulse">.</span>
              <span className="ml-1 animate-pulse delay-150">.</span>
              <span className="ml-1 animate-pulse delay-300">.</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            className="w-full placeholder:text-gray-400 placeholder:italic p-3 rounded-[1.5rem] bg-gray-500 bg-opacity-20 backdrop-blur-md shadow-inner border border-gray-600 text-white"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(input.current.value);
              }
            }}
          />
          <button
            onClick={handleVoiceMessage}
            className={`p-3 rounded-[3rem] shadow-lg border border-gray-500 transition-all duration-300 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : " bg-gray-500 bg-opacity-20 hover:bg-opacity-60 text-white"
            } ${loading ? "cursor-not-allowed opacity-30" : ""}`}
          >
            <Mic size={20} />
          </button>
          <button
            disabled={loading}
            onClick={() => sendMessage(input.current.value)}
            className={` bg-gray-500 bg-opacity-20 hover:bg-opacity-60 text-white p-3 rounded-[3rem] shadow-lg border border-gray-500 ${
              loading ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-chat {
            height: 40vh !important;
            background-color: transparent !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};