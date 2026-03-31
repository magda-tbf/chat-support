import React from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "stream-chat-react";

function ChatComponent({ chatClient, channel, firstName }) {
  return (
    <Chat client={chatClient} theme="commerce dark">
      <Channel channel={channel}>
        <Window>

          {/* Header */}
          <div className="str-chat__header bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                  👨‍💼
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
              </div>

              <div>
                <h2 className="font-semibold text-white text-xl tracking-tight">
                  Customer Support
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">
                    Online • Ready to help
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 px-4 py-2 rounded-2xl">
              <span className="text-zinc-400 text-sm">Logged in as:</span>
              <span className="text-white font-medium">
                {chatClient?.user?.name || firstName}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden bg-zinc-950">
            <MessageList typingIndicator={<TypingIndicator />} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-700 bg-zinc-900 px-4 py-4">
            <MessageInput
              focus
              additionalTextareaProps={{
                placeholder: "Type your message here...",
              }}
            />
          </div>

        </Window>
      </Channel>
    </Chat>
  );
}

export default ChatComponent;