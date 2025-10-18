import Main from "@/components/main";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  // パスパラメータから値を取得
  const { chat_id } = router.query;
  return <Main paramChatId={chat_id != null ? Number(chat_id) : null} />;
};

export default Index;
