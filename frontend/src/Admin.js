import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import {
  Chat,
  Channel,
  ChannelHeader,
  Window,
  MessageList,
  ChannelList,
  MessageInput,
  ChannelPreviewMessenger,
  Thread,
} from "stream-chat-react";
import { CustomMessage } from "./CustomMessage";

let chatClient;

function Admin() {
  document.title = "Admin";

  const [adminId, setAdminId] = useState("");
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response = await fetch("http://localhost:8080/admin-login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId }),
      });

      const { adminToken, streamApiKey, adminName } = await response.json();

      chatClient = new StreamChat(streamApiKey);

      await chatClient.setUser(
        {
          id: adminName,
          name: "Administrator",
        },
        adminToken
      );

      const channel = chatClient.channel("messaging", "livechat");
      await channel.watch();
      setChannel(channel);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (channel) {
    return (
      <div className="h-screen bg-gray-100 p-4">
        <div className="h-full rounded-2xl overflow-hidden shadow-xl bg-white flex">
          <Chat client={chatClient} theme="messaging light">
            {/* Sidebar */}
            <div className="w-[320px] border-r">
              <div className="p-4 font-semibold text-lg border-b">
                Conversations
              </div>

              <ChannelList
                sort={{ last_message_at: -1 }}
                Preview={ChannelPreviewMessenger}
                onSelect={(channel) => setChannel(channel)}
              />
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <Channel>
                <Window>
                  <ChannelHeader />
                  <MessageList Message={CustomMessage}/>
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            </div>
          </Chat>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-cyan-500">
      <form
        onSubmit={register}
        className="bg-white p-8 rounded-2xl shadow-xl w-[360px] space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Admin Chat</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Admin ID</label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            placeholder="Enter your admin ID"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Connecting..." : "Start chat"}
        </button>
      </form>
    </div>
  );
}

export default Admin;