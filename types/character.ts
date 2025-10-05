export interface Character {
  id: number;
  language_id: string;
  name: string;
  prompt: string;
  model_name: string;
  icon_path: string;
  tts_voice: string;
  f0_key_up: number;
  upd_datetime: string;
}
