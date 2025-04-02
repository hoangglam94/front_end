import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

const url = "https://backend-server-d9vj.onrender.com"; 

const Chat = ({ projectId, userId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    console.log("Chat Component Loaded:");
    console.log("Project ID:", projectId);
    console.log("User ID:", userId);

    // Fetch previous messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${url}/chat/messages/${projectId}`);
            console.log("Fetched messages:", response.data); // Debugging
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!userId) {
            console.error("Cannot send message: userId is missing!");
            return;
        }

        const messageData = {
            chat_id: projectId,
            userId: userId,
            line_text: message,
        };

        try {
            const response = await axios.post(`${url}/chat/send-message`, messageData);
            if (response.data.success) {
                setMessage(""); // Clear input
                fetchMessages(); // Refresh messages
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Fetch messages on load and every 5 seconds (polling)
    useEffect(() => {
        if (!projectId) return;

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll messages every 5 seconds

        return () => clearInterval(interval);
    }, [projectId]);

    return (
        <div className="chat-container">
            <h3 className="chat-title">Project Chat</h3>
            <div className="chat-box">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.user_id === userId ? "sent" : "received"}`}>
                        <p><strong>{msg.eName}:</strong> {msg.line_text}</p>
                        <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                        /*<div key={index} className={`message ${msg.userId === userId ? "sent" : "received"}`}>
                            <p><strong>{msg.eName}:</strong> {msg.line_text}</p>
                            <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>*/
                    ))
                ) : (
                    <p className="no-messages">No messages yet. Start the conversation!</p>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="chat-input-field"
                />
                <button onClick={sendMessage} className="chat-send-button">Send</button>
            </div>
        </div>
    );
};

export default Chat;
