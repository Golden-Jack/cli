import React from 'react';
import { Box, render, Text, useInput } from 'ink';
import { randomUUID } from 'uncrypto';

import { darkTheme } from './utils/theme';

import { Bet } from './components/Bet';
import { Balance } from './components/Balance';
import { Sep } from './components/Separator';
import { Key } from './components/Key';
import { Score } from './components/Score';

import { canDecrease } from './composables/canDecrease';
import { canIncrease } from './composables/canIncrease';

import {
    EconomyConfig, GameConfig,
    DEFAULT_ECONOMY_CONFIG, DEFAULT_GAME_CONFIG,
    Casino, Player, Game, Card,
    Type,
    GameState
} from '@golden-jack/engine';

const economyConfig: EconomyConfig = DEFAULT_ECONOMY_CONFIG;
    economyConfig.minBet = 50;
const gameConfig: GameConfig = DEFAULT_GAME_CONFIG;

Casino.init(economyConfig.bankroll);
const player: Player = new Player(randomUUID(), 'player', economyConfig.initialBalance);
const game: Game = new Game([player], gameConfig, economyConfig);

game.startRound();

const App = () => {
    const [betConfirmed, setBetConfirmed] = React.useState(false);
    const [bet, setBet] = React.useState(economyConfig.minBet);
    const [lastRound, setLastRound] = React.useState(game.rounds[game.rounds.length - 1]);

    useInput((input, key) => {
        if (key.escape) process.exit(1);

        if (!betConfirmed) { // Betting
            if (key.rightArrow && canIncrease(bet, player.balance, economyConfig.maxBet)) setBet(prev => prev + economyConfig.minBet);
            if (key.leftArrow && canDecrease(bet, economyConfig.minBet)) setBet(prev => prev - economyConfig.minBet);
            if (key.return && player.balance >= economyConfig.minBet) {
                lastRound.bet(player.id, bet);
                setBetConfirmed(true);
            }
        }

        if (betConfirmed && lastRound.state === GameState.PLAYER) { // Hit or Stand
            if (input.toLowerCase() === 'h') {
                lastRound.hit(player.id);
                setLastRound(Object.assign(Object.create(Object.getPrototypeOf(lastRound)), lastRound));
            }
            if (input.toLowerCase() === 's') {
                lastRound.stand(player.id);
                setLastRound(Object.assign(Object.create(Object.getPrototypeOf(lastRound)), lastRound));
            }
        }


        if (key.return && betConfirmed && lastRound.state === GameState.END) { // New Round
            const currentLast = game.rounds[game.rounds.length - 1];
            if (currentLast.state === GameState.END) { 
                game.startRound();
                setLastRound(game.rounds[game.rounds.length - 1]);
                setBetConfirmed(false);
                setBet(Math.min(economyConfig.minBet, player.balance));
            }
        }
    }, { isActive: true });

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1}>  
    <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
        <Text bold color={darkTheme.GOLD}>Golden Jack</Text>
        <Bet amount={bet} isConfirmed={betConfirmed} min={economyConfig.minBet} max={economyConfig.maxBet} playerBalance={player.balance} />
        <Balance balance={player.balance} />
    </Box>
    <Sep />
    <Box display='flex' flexDirection='column' height={10} alignItems='center' justifyContent='center'>
        {!betConfirmed && <Text>SELECT YOUR BET ABOVE</Text>}
        {betConfirmed && <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-around' width='100%'>
            <Box display='flex' flexDirection='column' gap={1} alignItems='center' justifyContent='center'>
                <Text bold>DEALER</Text>
                <Box display='flex' flexDirection='row' justifyContent='center'>
                    {lastRound.dealerHand.cards.map((card: Card, index: number) => {
                        const hidden: boolean = lastRound.state === GameState.PLAYER && index === 1;

                        const color: darkTheme = hidden
                            ? darkTheme.GOLD
                            : card.type === Type.HEART || card.type === Type.DIAMOND
                                ? darkTheme.RED
                                : darkTheme.TEXT;

                        const text: string = hidden
                            ? '??'
                            : isNaN(parseInt(card.rank))
                                ? card.rank + card.rank
                                : card.rank.padStart(2, '0');
                        
                        const symbol: string = hidden ? '?' : card.symbol;

                        return (
                            <Box key={card.id} borderStyle='round' borderColor={color} display='flex' flexDirection='column' width={8}>
                                <Box display='flex' justifyContent='flex-start'>
                                    <Text bold color={color}>{symbol}</Text>
                                </Box>
                                <Box display='flex' justifyContent='center'>
                                    <Text bold color={darkTheme.TEXT}>{text}</Text>
                                </Box>
                                <Box display='flex' justifyContent='flex-end'>
                                    <Text bold color={color}>{symbol}</Text>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
                <Score value={lastRound.state === GameState.PLAYER ? '?' : lastRound.dealerHand.score} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1} alignItems='center' justifyContent='center'>
                <Text bold>{player.username.toUpperCase()}</Text>
                <Box display='flex' flexDirection='row' justifyContent='center'>
                    {lastRound.findHand(player.id)!.cards.map((card: Card) => {
                        const color = card.type === Type.HEART || card.type === Type.DIAMOND ? darkTheme.RED : darkTheme.TEXT;
                        const text = isNaN(parseInt(card.rank)) ? card.rank + card.rank : card.rank.padStart(2, '0');
                        return (
                            <Box key={card.id} borderStyle='round' borderColor={color} display='flex' flexDirection='column' width={8}>
                                <Box display='flex' justifyContent='flex-start'>
                                    <Text bold color={color}>{card.symbol}</Text>
                                </Box>
                                <Box display='flex' justifyContent='center'>
                                    <Text bold color={darkTheme.TEXT}>{text}</Text>
                                </Box>
                                <Box display='flex' justifyContent='flex-end'>
                                    <Text bold color={color}>{card.symbol}</Text>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
                <Score value={lastRound.findHand(player.id)!.score} />
            </Box>
        </Box>}
    </Box>
    <Sep />
    <Box display='flex' flexDirection='row' justifyContent='space-around'>
        <Key keyCap='escape' color={darkTheme.GRAY} does='Quit' />
        {!betConfirmed && <Key keyCap='<-' color={darkTheme.TEXT} does='Decrease' />}
        {!betConfirmed && <Key keyCap='->' color={darkTheme.TEXT} does='Increase' />}
        {!betConfirmed && <Key keyCap='enter' color={darkTheme.GREEN} does='Valid' />}
        {lastRound.state === GameState.PLAYER && <Key keyCap='h' color={darkTheme.GREEN} does='Hit' />}
        {lastRound.state === GameState.PLAYER && <Key keyCap='s' color={darkTheme.RED} does='Stand' />}
        {lastRound.state === GameState.END && <Key keyCap='enter' color={darkTheme.BLUE} does='New Round' />}
    </Box>
</Box>

    )
}

console.clear();

render(<App />);