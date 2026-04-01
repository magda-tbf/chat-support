import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import ChatComponent from './components/ChatComponent';
import 'stream-chat-react/dist/css/v2/index.css';

import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "stream-chat-react";

let chatClient = null;

function Login() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    if (!firstName || !email) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/customer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!response.ok) throw new Error('Login failed');

      const { customerId, customerToken, channelId, streamApiKey } = await response.json();

      if (!chatClient) {
        chatClient = StreamChat.getInstance(streamApiKey);
      }

      await chatClient.connectUser(
        {
          id: customerId,
          name: `${firstName} ${lastName}`.trim() || firstName,
        },
        customerToken
      );

      const newChannel = chatClient.channel('messaging', channelId, {
        name: `Support Chat`,
      });

      await newChannel.watch();
      setChannel(newChannel);

    } catch (error) {
      console.error(error);
      alert('Connection error. Make sure the server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      chatClient?.disconnectUser().catch(console.error);
    };
  }, []);

  // ==================== CHAT UI ====================
if (channel) {
  return (
    <ChatComponent
      chatClient={chatClient}
      channel={channel}
      firstName={firstName}
    />
  );
}

  // ==================== LOGIN FORM ====================
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-8 py-12 text-center border-b border-zinc-700">
          <div className="mx-auto w-20 h-20 bg-indigo-600/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20">
            <span className="text-5xl">💬</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome back</h1>
          <p className="text-zinc-400 text-lg">Our team is ready to help you</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <form onSubmit={register} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Last Name (optional)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold py-5 rounded-2xl text-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Connecting...
                </span>
              ) : (
                'Start Chat'
              )}
            </button>
          </form>
        </div>

        <div className="text-center pb-8 text-zinc-500 text-sm">
          Your data is secure and will only be used for this conversation.
        </div>
      </div>
    </div>
  );
}

export default Login;