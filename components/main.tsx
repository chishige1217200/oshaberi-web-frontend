// App.tsx
import { Slide, toast, ToastContainer } from "react-toastify";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { Character } from "@/types/character";
import { Chat } from "@/types/chat";
import ChatComponent from "./chat";
import { Message } from "@/types/message";

type MainProps = {
  paramSessionId?: number | null;
};

export default function Main({ paramSessionId }: MainProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 全体のステート
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  // サイドバーのステート
  const [chats, setChats] = useState<Chat[]>([]);

  // チャット画面のステート
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * チャット履歴を取得
   */
  const getChats = async () => {
    try {
      const response = await fetch(`${apiUrl}/chats`);
      const data: Chat[] = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("チャット履歴の取得に失敗しました。");
    }
  };

  /**
   * キャラクタ一覧を取得
   */
  const getCharacters = async () => {
    try {
      const response = await fetch(`${apiUrl}/characters`);
      let data: Character[] = await response.json();
      // 日本語キャラクターのみ使用可
      data = data.filter((char) => char.language_id === 'ja-JP');

      setCharacters(data);
      if (data.length > 0) {
        setCurrentCharacter(data[0]);
      }

    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("キャラクタ一覧の取得に失敗しました。");
    }
  };

  useEffect(() => {
    getCharacters();
    getChats();
  }, []);

  useEffect(() => {
    if (paramSessionId) {
      setCurrentChatId(paramSessionId ? Number(paramSessionId) : null);
      toast.info(`Session ID: ${paramSessionId}`);
    }
  }, [paramSessionId]);

  useEffect(() => {
    toast.info(`Current Chat ID: ${currentChatId}`);
  }, [currentChatId]);

  return (
    <div className="flex h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
      <Sidebar
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        chats={chats}
      />
      <ChatComponent
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        characters={characters}
        currentCharacter={currentCharacter}
        setCurrentCharacter={setCurrentCharacter}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
