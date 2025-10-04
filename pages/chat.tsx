// App.tsx
import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<
    { id: number; title: string; messages: Message[] }[]
  >([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");

  // 新しいチャットを開始
  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: "新しいチャット", messages: [] };
    setChats([newChat, ...chats]);
    setCurrentChatId(newId);
  };

  // メッセージ送信
  const handleSend = () => {
    if (!input.trim() || currentChatId === null) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "user", content: input },
                // ダミーでAIレスポンス
                { role: "assistant", content: "AIレスポンス: " + input },
              ],
            }
          : chat
      )
    );

    setInput("");
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  return (
    <div className="flex h-screen">
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

      {/* メインチャット画面 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat ? (
            currentChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI側アイコン */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white mr-2">
                    A
                  </div>
                )}

                {/* 吹き出し */}
                <div
                  className={`p-2 rounded-lg max-w-xs text-black ${
                    msg.role === "user"
                      ? "bg-blue-200 text-right"
                      : "bg-green-200 text-left"
                  }`}
                >
                  {msg.content}
                </div>

                {/* ユーザー側アイコン */}
                {msg.role === "user" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white ml-2">
                    U
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">
              左の「新しいチャット」から始めてください。
            </div>
          )}
        </div>

        {/* 入力欄 */}
        {currentChat && (
          <div className="p-4 border-t flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // 改行を無効化
                  handleSend(); // 送信
                }
                // Shift+Enter の場合は何もしない → textarea の改行が働く
              }}
              className="flex-1 border rounded-md p-2 resize-none"
              placeholder="メッセージを入力...(Shift+Enterで改行)"
              rows={2}
            />
            <div className="items-center flex">
                <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                送信
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
