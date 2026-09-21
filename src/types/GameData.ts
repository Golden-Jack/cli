import { Round } from '@golden-jack/engine';

export interface GameData {
    id: string;
    balance: number;
    rounds: Round[];
    highestBalance: number;
    startedAt: number;
    lastPlayedAt: number;
}