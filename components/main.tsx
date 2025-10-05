// App.tsx
import { Slide, toast, ToastContainer } from "react-toastify";
import Chat from "./chat";
import Sidebar from "./sidebar";

type MainProps = {
  paramSessionId?: number | null;
};

export default function Main({ paramSessionId }: MainProps) {
  console.log("paramSessionId:", paramSessionId);
  toast.success("paramSessionId: " + paramSessionId);

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
      <Sidebar />
      <Chat />
    </div>
  );
}
