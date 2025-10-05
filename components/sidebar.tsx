import { Message } from "@/types/message";
import React, { useState } from "react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [chats, setChats] = useState<
    { id: number; title: string; messages: Message[] }[]
  >([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  // 新しいチャットを開始
  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: "新しいチャット", messages: [] };
    setChats([newChat, ...chats]);
    setCurrentChatId(newId);
  };

  return (
    <>
      {/* サイドバー */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-12"
        } bg-gray-800 transition-all duration-300 flex flex-col`}
      >
        <button
          className="p-2 bg-gray-700 hover:bg-gray-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto">
            <button
              onClick={handleNewChat}
              className="w-full p-2 bg-blue-600 hover:bg-blue-500"
            >
              ＋ 新しいチャット
            </button>
            <div>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`p-2 cursor-pointer ${
                    chat.id === currentChatId
                      ? "bg-gray-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {chat.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
