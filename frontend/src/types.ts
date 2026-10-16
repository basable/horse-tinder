export type Coat = "bay" | "chestnut" | "black" | "grey" | "palomino" | "buckskin" | "dun" | "roan";

export interface Horse {
  id: number;
  name: string;
  breed: string;
  age: number;
  coat: Coat;
  location: string;
  bio: string;
  interests: string[];
}

export interface Match extends Horse {
  matchedAt: string;
}

export type HorseInput = Omit<Horse, "id">;
