import Link from "next/link";
import React from "react";
import { Chat } from "@/types/chat";

type SidebarProps = {
  currentChatId: number | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chat[];
};

export default function Sidebar({
  currentChatId,
  sidebarOpen,
  setSidebarOpen,
  chats,
}: SidebarProps) {
  return (
    <>
      {/* サイドバー */}
      <div
        className={`
          bg-gray-800 flex flex-col transition-all duration-300

          /* PC表示 */
          md:relative md:translate-x-0
          ${sidebarOpen ? "md:w-64" : "md:w-12"}

          /* スマホ表示 */
          fixed top-0 left-0 h-full z-50
          w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="p-2 bg-gray-700 hover:bg-gray-600 md:block"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto">
            {/* <button
              onClick={handleNewChat}
              className="w-full p-2 bg-blue-600 hover:bg-blue-500"
            >
              ＋ 新しいチャット
            </button> */}
            <Link href={`/`}>
              <div className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-center">
                ＋ 新しいチャット
              </div>
            </Link>
            <div>
              {chats.map((chat) => (
                <React.Fragment key={chat.id}>
                  <Link href={`/c/${chat.id}`}>
                    <div
                      // onClick={() => setCurrentChatId(chat.id)}
                      className={`p-2 cursor-pointer ${
                        chat.id === currentChatId
                          ? "bg-gray-600"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {chat.subject || "無題のチャット"}
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
