export interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    UserScore: number;
    errors: string[];
    message: string;
  },
  audioUrl?: string;
}
