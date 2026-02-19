import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Slide, toast, ToastContainer } from "react-toastify";
import Sidebar from "./sidebar";
import { Character } from "@/types/character";
import { Chat } from "@/types/chat";
import ChatComponent from "./ChatComponent";
import { Message } from "@/types/message";

type MainProps = {
  paramChatId: number | null;
};

export default function Main({ paramChatId }: MainProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ローディングのステート（初期表示時のみ）
  const [initLoading, setInitLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(true);

  // 全体のステート
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  // サイドバーのステート
  const [chats, setChats] = useState<Chat[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // チャット画面のステート
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * チャット履歴を取得
   */
  const getChats = async () => {
    try {
      setChatLoading(true);
      const response = await fetch(`${apiUrl}/chats`);
      const data: Chat[] = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("チャット履歴の取得に失敗しました。");
    } finally {
      setChatLoading(false);
    }
  };

  /**
   * キャラクタ一覧を取得
   */
  const getCharacters = async (characterId: number | null) => {
    try {
      setCharacterLoading(true);
      const response = await fetch(`${apiUrl}/characters`);
      let data: Character[] = await response.json();
      // 日本語キャラクターのみ使用可
      data = data.filter((char) => char.language_id === "ja-JP");

      setCharacters(data);
      if (data.length > 0) {
        setCurrentCharacter(
          data.find((char) => char.id === characterId) || data[0],
        );
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("キャラクタ一覧の取得に失敗しました。");
    } finally {
      setCharacterLoading(false);
    }
  };

  /**
   * 会話履歴を取得
   * @param chatId
   * @returns
   */
  const getMessages = async (chatId: number | null) => {
    // chatIdがnullの場合は空配列をセットして終了
    if (chatId == null) {
      setMessages([]);
      setMessageLoading(false);
      return;
    }

    try {
      setMessageLoading(true);
      const response = await fetch(`${apiUrl}/messages/${chatId}`);
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("メッセージの取得に失敗しました。");
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    getCharacters(null);
    getChats();
  }, []);

  useEffect(() => {
    // console.log("Param Chat ID changed:", paramChatId);
    if (paramChatId != null) {
      // toast.info(`Param Chat ID: ${paramChatId}`);
      setCurrentChatId(paramChatId ? Number(paramChatId) : null);
    }
  }, [paramChatId]);

  useEffect(() => {
    if (currentChatId != null && chats != null && chats.length > 0) {
      const chat = chats.find((c) => c.id === currentChatId);
      getCharacters(chat ? chat.character_id : null);
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    // console.log("Current Chat ID changed:", currentChatId);
    // toast.info(`Current Chat ID: ${currentChatId}`);
    getMessages(currentChatId);
  }, [currentChatId]);

  const loading = chatLoading || characterLoading || messageLoading;

  // 初回以外のローディングでスピナーを出したくないため追加
  if (initLoading && !loading) {
    setInitLoading(false);
  }

  return (
    <>
      {initLoading && loading ? (
        <div className="flex absolute w-full h-full items-center justify-center bg-black/50 z10">
          <MoonLoader
            loading={true}
            color="#36d7b7"
            size={150}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="flex h-screen relative">
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

        {/* 開くボタン（スマホ時のみ表示） */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-1 left-1 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
          >
            ☰
          </button>
        )}

        {/* 背景オーバーレイ（スマホのみ） */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          chats={chats}
        />
        <div className="flex-1 min-w-0">
          <ChatComponent
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
            getChats={getChats}
            characters={characters}
            currentCharacter={currentCharacter}
            setCurrentCharacter={setCurrentCharacter}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </>
  );
}
