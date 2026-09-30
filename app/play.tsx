#!/usr/bin/env node

import React from 'react';
import { Box, render, Text, useInput } from 'ink';
import { randomUUID } from 'node:crypto';

import {
    EconomyConfig, GameConfig,
    DEFAULT_ECONOMY_CONFIG, DEFAULT_GAME_CONFIG,
    Casino, Player, Game, GameState
} from '@golden-jack/engine';

import { launchApp } from './app';

import { Header } from './components/header/Header';
import { Sep } from './components/Separator';
import { Footer } from './components/footer/Footer';
import { HandItem } from './components/main/HandItem';

import { canDecrease } from './composables/canDecrease';
import { canIncrease } from './composables/canIncrease';
import { OutcomeItem } from './components/main/OutcomeItem';
import { Context } from '../src/context';
import { PLATFORM, updatePresence } from '@golden-jack/discord-rpc/src/presence';
import { version } from '../package.json';

const economyConfig: EconomyConfig = DEFAULT_ECONOMY_CONFIG;
    economyConfig.minBet = 50;
const gameConfig: GameConfig = DEFAULT_GAME_CONFIG;

Casino.init(economyConfig.bankroll);

let instance: ReturnType<typeof render>;
export function showPlay() {
    const ctx = Context.get();
    instance = render(<Play key={ctx.activeSave?.id} />);
}
export function unmountPlay() {
    instance?.unmount();
}

export const Play = () => {
    const ctx = Context.get();
    const activeSave = ctx.activeSave;

    if (!activeSave) {
        launchApp();
        return;
    }

    const [player] = React.useState(() => new Player(randomUUID(), ctx.profile.username, ctx.activeSave!.balance));
    const [game] = React.useState(() => new Game([player], gameConfig, economyConfig));

    const [betConfirmed, setBetConfirmed] = React.useState(false);
    const [bet, setBet] = React.useState(Math.min(economyConfig.minBet, player.balance));

    const [lastRound, setLastRound] = React.useState(() => {
        game.startRound();
        return game.rounds[game.rounds.length - 1];
    })
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    const [height, setHeight] = React.useState(process.stdout.rows - 12);
    React.useEffect(() => {
        const onResize = () => setHeight(process.stdout.rows - 12);
        process.stdout.on('resize', onResize);
        return () => { process.stdout.off('resize', onResize); };
    }, []);

    function persistBalance() {
        if (!activeSave) return;

        ctx.updateActiveSave({
            ...activeSave,
            balance: player.balance,
            highestBalance: Math.max(player.balance, activeSave.highestBalance),
            rounds: [...game.rounds],
            lastPlayedAt: Date.now()
        })
    }

    const phase = (state: GameState): string | null => {
        switch (state) {
            case GameState.BET: return 'BETTING';
            case GameState.PLAYER: return 'DRAWING';
            case GameState.END: return 'END OF ROUND';
            default: return null;
        }
    }
    updatePresence({
        phase: phase(lastRound.state) ?? 'Idling',
        balance: player.balance,
        round: game.rounds.length,
        platform: PLATFORM.CLI,
        version: version
    })

    useInput((input, key) => {
        if (key.escape && (lastRound.state === GameState.END || lastRound.state === GameState.BET)) {
            console.clear();
            unmountPlay();
            persistBalance();
            launchApp();
        }

        if (!betConfirmed) { // Bet
            if (key.rightArrow && canIncrease(bet, player.balance, economyConfig.maxBet)) setBet(prev => prev + economyConfig.minBet);
            if (key.leftArrow && canDecrease(bet, economyConfig.minBet)) setBet(prev => prev - economyConfig.minBet);
            if (key.return && player.balance >= economyConfig.minBet && player.balance >= bet && bet > 0) {
                lastRound.bet(player.id, bet);
                setBetConfirmed(true);
            }
            if (input.toLowerCase() === 'a') setBet(player.balance); // all-in
            if (input.toLowerCase() === 'h') setBet(player.balance / 2); // half-in
            if (input.toLowerCase() === 'd') setBet(player.balance >= bet * 2 // double
                ? bet * 2
                : player.balance
            );
            if (input.toLowerCase() === 'f') setBet(player.balance >= ctx.settings.favoriteBet // favorite
                ? ctx.settings.favoriteBet
                : player.balance
            );
            if (input.toLowerCase() === 'l') setBet(player.balance >= 50 ? 50 : player.balance); // min
        }

        if (lastRound.state === GameState.PLAYER) { // Player action
            if (input.toLowerCase() === 'h') {
                lastRound.hit(player.id);
                forceUpdate();
            }
            if (input.toLowerCase() === 's') {
                lastRound.stand(player.id);
                forceUpdate();
            }
            if (input.toLowerCase() === 'p') {
                if (player.balance < bet) return;
                lastRound.split(player.id);
                forceUpdate();
            }
            if (input.toLowerCase() === 'd') {
                if (player.balance < bet) return;
                lastRound.double(player.id);
                forceUpdate();
            }
        }

        if (lastRound.state === GameState.END) { // End of Round
            if (input === ' ') {
                persistBalance();
                game.startRound();
                setLastRound(game.rounds[game.rounds.length - 1]);
                setBet(Math.min(bet, player.balance));
                setBetConfirmed(false);
            }
        }
    }, { isActive: true });

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1}>  
    <Header bet={Math.round(bet)} playerBalance={Math.round(player.balance)} min={economyConfig.minBet} max={economyConfig.maxBet} isBetConfirmed={betConfirmed} />

    <Sep />
    
    <Box display='flex' flexDirection='column' height={height} alignItems='center' justifyContent='center'>
        {!betConfirmed && <Text>SELECT YOUR BET ABOVE</Text>}
        {betConfirmed && (
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-evenly' width='100%' height='100%'>
                <HandItem lastRound={lastRound} isDealer />
                <OutcomeItem round={lastRound} playerId={player.id} />
                <HandItem lastRound={lastRound} player={player} />
            </Box>
        )}
    </Box>

    <Sep />

    <Footer lastRound={lastRound} isBetConfirmed={betConfirmed} player={player} gameConfig={gameConfig} />
</Box>

    )
}