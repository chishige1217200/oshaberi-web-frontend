import Main from "@/components/main";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  // パスパラメータから値を取得
  const { session_id } = router.query;
  return (
    <Main paramSessionId={session_id ? Number(session_id) : null} />
  );
};

export default Index;
