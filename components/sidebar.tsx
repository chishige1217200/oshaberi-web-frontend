import { Chat } from "@/types/chat";
import Link from "next/link";
import React, { useState } from "react";

type SidebarProps = {
  currentChatId: number | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
  chats: Chat[];
};

export default function Sidebar({
  currentChatId,
  setCurrentChatId,
  chats,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 新しいチャットを開始
  const handleNewChat = () => {
    setCurrentChatId(null);
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
                  {chat.subject || "無題のチャット"}
                  <Link href={`/c/${chat.id}`} >詳細</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
