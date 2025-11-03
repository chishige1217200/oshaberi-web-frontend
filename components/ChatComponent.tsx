import Image from "next/image";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Message } from "@/types/message";
import { Character } from "@/types/character";
import { Chat } from "@/types/chat";

type ChatComponentProps = {
  currentChatId: number | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
  getChats: () => Promise<void>;
  characters: Character[];
  currentCharacter: Character | null;
  setCurrentCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function ChatComponent({
  currentChatId,
  setCurrentChatId,
  getChats,
  characters,
  currentCharacter,
  setCurrentCharacter,
  messages,
  setMessages,
}: ChatComponentProps) {
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
  const handleSend = async () => {
    if (!input.trim() || !currentCharacter) return;

    const userInput = input;
    setInput("");

    try {
      setMessageLoading(true);

      let chatId = currentChatId;

      // チャットが存在しない場合に作成する
      if (chatId === null) {
        const response = await fetch(`${apiUrl}/create-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            character_id: currentCharacter ? currentCharacter.id : null,
          }),
        });

        if (!response.ok) {
          throw new Error("チャットの作成に失敗しました。");
        }

        const data: Chat = await response.json();
        chatId = data.id;
        setCurrentChatId(chatId);
      }

      const tempMessages = messages;

      // 現在日時を取得
      const nowTime = new Date();

      // 年月日 時間・分・秒を取得
      const year = nowTime.getFullYear();
      const month = nowTime.getMonth() + 1;
      const date = nowTime.getDate();
      const hours = nowTime.getHours();
      const minutes = nowTime.getMinutes();
      const seconds = nowTime.getSeconds();
      const formatDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      // ユーザメッセージを追加
      const newMessage: Message = {
        chat_id: chatId,
        id:
          tempMessages.length > 0
            ? tempMessages[tempMessages.length - 1].id + 1
            : 1,
        language_id: "ja-JP",
        role: "user",
        content: userInput,
        audio_path: null,
        upd_datetime: formatDateTime,
      };
      tempMessages.push(newMessage);

      // ローディングを表示するために空のAIメッセージを追加
      const aiMessage: Message = {
        chat_id: chatId,
        id:
          tempMessages.length > 0
            ? tempMessages[tempMessages.length - 1].id + 1
            : 1,
        language_id: "ja-JP",
        role: "assistant",
        content: "",
        audio_path: null,
        upd_datetime: formatDateTime,
      };
      tempMessages.push(aiMessage);
      setMessages(tempMessages);

      // APIにメッセージを送信
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          content: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error("チャットの送信に失敗しました。");
      }

      // AIメッセージを更新
      const data: Message = await response.json();
      tempMessages[tempMessages.length - 1].content = data.content;
      setMessages(tempMessages);

      // サイドバーのチャット一覧を更新
      getChats();

      // 音声の生成を非同期で実行
      generateAudio(chatId, tempMessages[tempMessages.length - 1].id);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("メッセージの送信に失敗しました。");
    } finally {
      setMessageLoading(false);
    }
  };

  // 音声生成
  const generateAudio = async (chatId: number, id: number) => {
    try {
      const response = await fetch(`${apiUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("音声の生成に失敗しました。");
      }

      // AIメッセージを更新
      const data: Message = await response.json();
      console.log(data);
      const newMessages = messages.map((msg) =>
        msg.id === data.id ? data : msg
      );
      setMessages(newMessages);
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("音声の生成に失敗しました。");
    }
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
              className="bg-gray-700 text-white p-1 rounded w-40 h-8 disabled:opacity-50"
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
                <React.Fragment key={char.id}>
                  <option value={char.id}>{char.name}</option>
                </React.Fragment>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              <div
                key={i}
                className={`flex items-start ${
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
                    className={`p-2 rounded-lg max-w-xs text-start text-black ${
                      msg.role === "user"
                        ? "bg-blue-200 text-right"
                        : "bg-green-200 text-left"
                    }`}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div className="mt-4">
                    <PulseLoader loading={true} color="#36d7b7" size={10} />
                  </div>
                )}

                {msg.audio_path ? (
                  <audio controls>
                    <source
                      src={`${apiUrl}/static/${msg.audio_path}`}
                      type="audio/wav"
                    />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <></>
                )}

                {/* ユーザー側アイコン */}
                {msg.role === "user" && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white ml-2">
                    U
                  </div>
                )}
              </div>
            </React.Fragment>
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
