export interface Message {
  chat_id: number;
  id: number;
  language_id: string;
  role: "user" | "assistant";
  content: string;
  audio_path: string | null;
  upd_datetime: string;
}