import React from 'react';
import { Box, render, Text, useInput } from 'ink';
import { randomUUID } from 'uncrypto';

import {
    EconomyConfig, GameConfig,
    DEFAULT_ECONOMY_CONFIG, DEFAULT_GAME_CONFIG,
    Casino, Player, Game, Card, GameState
} from '@golden-jack/engine';

import { Header } from './components/header/Header';
import { Sep } from './components/Separator';
import { Footer } from './components/footer/Footer';
import { HandItem } from './components/HandItem';

import { canDecrease } from './composables/canDecrease';
import { canIncrease } from './composables/canIncrease';

const economyConfig: EconomyConfig = DEFAULT_ECONOMY_CONFIG;
    economyConfig.minBet = 50;
const gameConfig: GameConfig = DEFAULT_GAME_CONFIG;

Casino.init(economyConfig.bankroll);
const player: Player = new Player(randomUUID(), 'player', economyConfig.initialBalance);
const game: Game = new Game([player], gameConfig, economyConfig);

const App = () => {
    const [betConfirmed, setBetConfirmed] = React.useState(false);
    const [bet, setBet] = React.useState(Math.min(economyConfig.minBet, player.balance));
    const [lastRound, setLastRound] = React.useState(() => {
        game.startRound();
        return game.rounds[game.rounds.length - 1];
    })
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    useInput((input, key) => {
        if (key.escape) process.exit(1);

        if (!betConfirmed) { // Bet
            if (key.rightArrow && canIncrease(bet, player.balance, economyConfig.maxBet)) setBet(prev => prev + economyConfig.minBet);
            if (key.leftArrow && canDecrease(bet, economyConfig.minBet)) setBet(prev => prev - economyConfig.minBet);
            if (key.return && bet >= Math.min(economyConfig.minBet, player.balance) && bet > 0) {
                lastRound.bet(player.id, bet);
                setBetConfirmed(true);
            }
        }

        if (lastRound.state === GameState.PLAYER) { // Hit or Stand
            if (input.toLowerCase() === 'h') {
                lastRound.hit(player.id);
                forceUpdate();
            }
            if (input.toLowerCase() === 's') {
                lastRound.stand(player.id);
                forceUpdate();
            }
        }

        if (lastRound.state === GameState.END) { // End of Round
            if (input === ' ') {
                game.startRound();
                setLastRound(game.rounds[game.rounds.length - 1]);
                setBet(Math.min(economyConfig.minBet, player.balance));
                setBetConfirmed(false);
            }
        }
    }, { isActive: true });

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1}>  
    <Header bet={bet} playerBalance={player.balance} min={economyConfig.minBet} max={economyConfig.maxBet} isBetConfirmed={betConfirmed} />

    <Sep />
    
    <Box display='flex' flexDirection='column' height={10} alignItems='center' justifyContent='center'>
        {!betConfirmed && <Text>SELECT YOUR BET ABOVE</Text>}
        {betConfirmed && <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-around' width='100%'>
            <HandItem lastRound={lastRound} isDealer />
            <HandItem lastRound={lastRound} player={player} />
        </Box>}
    </Box>

    <Sep />

    <Footer lastRound={lastRound} isBetConfirmed={betConfirmed} />
</Box>

    )
}

console.clear();

render(<App />);