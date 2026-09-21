import React from 'react';
import { Box, render, Text, useInput } from 'ink';

import { Sep } from './components/Separator';
import { Key } from './components/footer/Key';

import { palettes } from './utils/theme';

import { showPlay } from './play';
import { launchApp } from './app';

import { Context } from '../src/context';

import { prev, next } from './utils/list';
import { GameData } from '../src/types/GameData';
import { DEFAULT_ECONOMY_CONFIG } from '@golden-jack/engine';
import { randomUUID } from 'node:crypto';

const MAX_SAVES: number = 5;

let instance: ReturnType<typeof render>;
export function showSaves() {
    instance = render(<Saves />);
}
export function unmountSaves() {
    instance?.unmount();
}

function createNewGame(): GameData {
    return {
        id: randomUUID(),
        balance: DEFAULT_ECONOMY_CONFIG.initialBalance,
        rounds: [],
        highestBalance: DEFAULT_ECONOMY_CONFIG.initialBalance,
        startedAt: Date.now(),
        lastPlayedAt: Date.now(),
    }
}

export const Saves = () => {
    const ctx = Context.get();
    const theme = palettes[ctx.settings.theme];

    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [option, setOption] = React.useState(0);

    const emptySlots = MAX_SAVES - ctx.saves.length;
    const slots: (GameData | null)[] = [
        ...ctx.saves,
        ...Array(emptySlots).fill(null)
    ]

    const [height, setHeight] = React.useState(process.stdout.rows - 12);
    process.stdout.on('resize', () => {
        setHeight(process.stdout.rows - 12);
    })

    useInput((input, key) => {
        if (key.escape) {
            console.clear();
            unmountSaves();
            launchApp();
        }

        if (key.downArrow) setOption(next(option, slots));
        if (key.upArrow) setOption(prev(option, slots));

        if (key.return) {
            console.clear();
            unmountSaves();

            const selected = slots[option];
            if (selected === null) {
                const newGame = createNewGame();
                ctx.createSave(newGame);
            } else {
                ctx.loadSave(selected.id);
            }
            showPlay();
        }

        if (key.delete) {
            const selected = slots[option];
            if (selected !== null) {
                ctx.deleteSave(selected.id);
                forceUpdate();
            }
        }
    }, { isActive: true });

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1}>
    <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
        <Text bold color={theme.GOLD}>Golden Jack</Text>
    </Box>

    <Sep />

    <Box display='flex' flexDirection='column' height={height} alignItems='center' justifyContent='center' gap={1}>
        {slots.map((slot, i) => (
            <Box key={slot?.id ?? `empty-${i}`} display='flex' gap={1}>
                <Text bold color={theme.TEXT}>{i === option ? '<  ' : ''}</Text>
                <Text bold color={i === option ? theme.GOLD : theme.TEXT}>
                    {slot ? `${new Date(slot.lastPlayedAt).toLocaleString()} — ${slot.balance}G remaining — ${slot.rounds.length} rounds — ${slot.highestBalance}G highest balance` : 'New Save'}
                </Text>
                <Text bold color={theme.TEXT}>{i === option ? '  >' : ''}</Text>
            </Box>
        ))}
    </Box>

    <Sep />

    <Box display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' gap={2}>
        <Key keyCap='↕' color={theme.TEXT} does='Navigate' />
        <Key keyCap='return' color={theme.GREEN} does='Select' />
        <Key keyCap='delete' color={theme.RED} does='Delete' />
    </Box>
</Box>

    )
}