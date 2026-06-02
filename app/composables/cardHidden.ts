import { GameState, Round } from '@golden-jack/engine';

export const cardHidden = (lastRound: Round, index: number, isDealer: boolean | undefined): boolean => {
    return lastRound.state === GameState.PLAYER && index === 1 && isDealer === true;
}