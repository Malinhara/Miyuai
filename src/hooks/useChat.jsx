import { createContext, useContext, useEffect, useState } from "react";
import { ElevenLabsClient } from "elevenlabs"; // make sure you installed this

const backendUrl = "https://yuri2-back.vercel.app";

const elevenLabsApiKey = 'sk_c0017739b918d0a0da1b69d457e19f3adfef46f5150caf0c';
const voiceId = "21m00Tcm4TlvDq8ikWAM"; // your ElevenLabs voice id

const client = new ElevenLabsClient({
  apiKey: elevenLabsApiKey,
});

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [error, setError] = useState(null);

  const chat = async (messageText) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://yuri2-back.vercel.app/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const resp = await response.json();
      console.log("Response from backend:", resp);

      if (resp.success) {
        setMessages((prevMessages) => [...prevMessages, resp]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  const textToSpeech = async (text) => {
    const response = await client.textToSpeech.convert(voiceId, {
      model_id: "eleven_multilingual_v2",
      text: text,
    });

    return response; // this is a ReadableStream
  };

  useEffect(() => {
    const playAudio = async () => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];

        try {
          const stream = await textToSpeech(latestMessage.message);

          const audioBlob = await new Response(stream).blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();

          audio.onended = () => {
            onMessagePlayed();
          };
        } catch (error) {
          console.error("Error playing voice:", error);
        }
      } else {
        setMessage(null);
      }
    };

    playAudio();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[messages.length - 1]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
