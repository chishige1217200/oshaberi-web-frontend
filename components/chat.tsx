import Image from "next/image";
import { useState } from "react";
import { Message } from "@/types/message";

type ChatProps = {
  currentChatId: number | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function Chat({ currentChatId }: ChatProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // メッセージ送信
  const handleSend = () => {
    if (!input.trim() || currentChatId === null) return;

    const newMessage: Message = {
      chat_id: currentChatId,
      id: Date.now(),
      language_id: "ja-JP",
      role: "user",
      content: input,
      audio_path: null,
      upd_datetime: "",
    };

    const aiMessage: Message = {
      chat_id: currentChatId,
      id: Date.now() + 1,
      language_id: "ja-JP",
      role: "assistant",
      content: "AIレスポンス: " + input,
      audio_path: null,
      upd_datetime: "",
    };

    setMessages((prev) => [...prev, newMessage, aiMessage]);

    setInput("");
  };

  return (
    <>
      {/* メインチャット画面 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI側アイコン */}
              {msg.role === "assistant" && (
                <Image
                  src={`${apiUrl}/static/sample.png`}
                  alt="AI"
                  className="w-8 h-8 rounded-full mr-2"
                  width={180}
                  height={38}
                  priority
                />
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
          ))}
        </div>

        {/* 入力欄 */}
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
      </div>
    </>
  );
}
