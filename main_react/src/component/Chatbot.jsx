import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 I am your Vehicle Management System assistant. How can I help you?"
        }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!input.trim() || loading) {
            return;
        }

        const question = input.trim();

        const userMessage = {
            sender: "user",
            text: question
        };

        setMessages(prev => [...prev, userMessage]);

        setInput("");
        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:3000/chat",
                {
                    message: question
                }
            );

            console.log("Chatbot Response:", response.data);

            if (
                response.data &&
                response.data.success &&
                response.data.answer
            ) {

                const botMessage = {
                    sender: "bot",
                    text: response.data.answer
                };

                setMessages(prev => [...prev, botMessage]);

            } else {

                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text:
                            response.data?.message ||
                            "Sorry, I did not receive a proper answer."
                    }
                ]);

            }

        } catch (error) {

            console.error("Chatbot Error:", error);

            let errorMessage =
                "Sorry, I am unable to answer right now. Please try again.";

            // Server returned an error
            if (error.response) {

                console.error(
                    "Server Error:",
                    error.response.status,
                    error.response.data
                );

                errorMessage =
                    error.response.data?.message ||
                    `Server Error: ${error.response.status}`;

            }

            // Request was sent but no response received
            else if (error.request) {

                console.error(
                    "No response from server:",
                    error.request
                );

                errorMessage =
                    "Unable to connect to the chatbot server. Please check whether the Node.js server is running.";

            }

            // Other error
            else {

                console.error(
                    "Request Error:",
                    error.message
                );

                errorMessage =
                    "Something went wrong while sending your question.";

            }

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: errorMessage
                }
            ]);

        } finally {

            setLoading(false);

        }
    };


    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    };


    return (

        <>

            {/* Chat Button */}

            <button
                className="chatbot-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Open Vehicle Assistant"
            >
                🤖
            </button>


            {/* Chat Window */}

            {isOpen && (

                <div className="chatbot-container">

                    {/* Header */}

                    <div className="chatbot-header">

                        <div>

                            <h3>
                                🤖 Vehicle Assistant
                            </h3>

                            <span>
                                ● Online
                            </span>

                        </div>

                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>

                    </div>


                    {/* Messages */}

                    <div className="chatbot-messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`message ${message.sender}`}
                            >
                                {message.text}
                            </div>

                        ))}


                        {/* Typing */}

                        {loading && (

                            <div className="message bot">
                                🤖 Typing...
                            </div>

                        )}

                    </div>


                    {/* Input */}

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Ask about vehicles..."
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            ➤
                        </button>

                    </div>

                </div>

            )}

        </>

    );
}

export default Chatbot;