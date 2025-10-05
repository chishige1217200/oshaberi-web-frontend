// App.tsx
import { Slide, toast, ToastContainer } from "react-toastify";
import Chat from "./chat";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

type MainProps = {
  paramSessionId?: number | null;
};

export default function Main({ paramSessionId }: MainProps) {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

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
      />
      <Chat currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} />
    </div>
  );
}
