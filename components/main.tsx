// App.tsx
import Chat from "./chat";
import Sidebar from "./sidebar";

type MainProps = {
  paramSessionId?: number | null;
};

export default function Main({ paramSessionId }: MainProps) {
  console.log("paramSessionId:", paramSessionId);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Chat />
    </div>
  );
}
