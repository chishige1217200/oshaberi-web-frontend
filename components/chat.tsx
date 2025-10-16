import Image from "next/image";
import { useState } from "react";
import { Message } from "@/types/message";
import { Character } from "@/types/character";
import { PulseLoader } from "react-spinners";

type ChatProps = {
  currentChatId: number | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
  characters: Character[];
  currentCharacter: Character | null;
  setCurrentCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function Chat({
  currentChatId,
  characters,
  currentCharacter,
  setCurrentCharacter,
  messages,
  setMessages,
}: ChatProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [messageLoading, setMessageLoading] = useState(false);
  const [input, setInput] = useState("");

  const getCharacterIconPath = (character: Character | null) => {
    if (!character) return `${apiUrl}/static/sample.png`;
    return character.icon_path
      ? `${apiUrl}/static/${character.icon_path}`
      : `${apiUrl}/static/sample.png`;
  };

  // メッセージ送信
  const handleSend = () => {
    if (!input.trim()) return;

    // TODO: ここでAPIに送信する処理を追加
    const newMessage: Message = {
      chat_id: currentChatId ?? 0,
      id: Date.now(),
      language_id: "ja-JP",
      role: "user",
      content: input,
      audio_path: null,
      upd_datetime: "",
    };

    const aiMessage: Message = {
      chat_id: currentChatId ?? 0,
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
        <div className="p-2 bg-gray-800 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <Image
              src={getCharacterIconPath(currentCharacter)}
              alt="AI"
              className="w-10 h-10 rounded-full"
              width={180}
              height={38}
              priority
            />
            <select
              className="bg-gray-700 text-white p-1 rounded w-40 h-8"
              disabled={currentChatId != null}
              value={currentCharacter ? currentCharacter.id : ""}
              onChange={(e) => {
                const selectedCharacter = characters.find(
                  (char) => char.id === Number(e.target.value)
                );
                setCurrentCharacter(selectedCharacter || null);
              }}
            >
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                  src={getCharacterIconPath(currentCharacter)}
                  alt="AI"
                  className="w-10 h-10 rounded-full mr-2"
                  width={180}
                  height={38}
                  priority
                />
              )}

              {/* 読込中アニメーション */}
              {msg.content ? (
                <div
                  className={`p-2 rounded-lg max-w-xs text-black ${
                    msg.role === "user"
                      ? "bg-blue-200 text-right"
                      : "bg-green-200 text-left"
                  }`}
                >
                  {msg.content}
                </div>
              ) : (
                <PulseLoader loading={true} color="#36d7b7" size={10} />
              )}

              {/* ユーザー側アイコン */}
              {msg.role === "user" && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white ml-2">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
              disabled={!input.trim() || messageLoading}
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
