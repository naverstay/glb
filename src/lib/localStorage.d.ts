export type Stats = {
  worldleGamesPlayed: number;
  worldleGamesWon: number;
  worldleLastWin: string;
  worldleCurrentStreak: number;
  worldleMaxStreak: number;
  worldleUsedGuesses: number[];
  worldleEmojiGuesses: string;
};

export type Guesses = {
  day: string;
  countries: string[];
}
