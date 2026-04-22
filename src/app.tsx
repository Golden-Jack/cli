import React from 'react';
import { Box, render, Text } from 'ink';
import { randomUUID } from 'uncrypto';

import { darkTheme } from './utils/theme';

import { Bet } from './components/Bet';
import { Balance } from './components/Balance';
import { Sep } from './components/Separator';

import {
    EconomyConfig, GameConfig,
    DEFAULT_ECONOMY_CONFIG, DEFAULT_GAME_CONFIG,
    Casino,
    Player,
    Game
} from '@golden-jack/engine';

const economyConfig: EconomyConfig = DEFAULT_ECONOMY_CONFIG;
const gameConfig: GameConfig = DEFAULT_GAME_CONFIG;

Casino.init(economyConfig.bankroll);
const player: Player = new Player(randomUUID(), 'singleplayer', economyConfig.initialBalance);
const game: Game = new Game([player], gameConfig, economyConfig);

const App = () => {
    let betConfirmed: boolean = false;

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1} width='75%'>
    <Box flexDirection='row' justifyContent='space-between' width='100%'>
        <Text bold color={darkTheme.GOLD}>Golden Jack</Text>
        <Bet amount={0} isConfirmed={betConfirmed} min={economyConfig.minBet} max={economyConfig.maxBet} />
        <Balance balance={player.balance} />
    </Box>
    <Sep />
</Box>

    )
}

console.clear();

render(<App />);