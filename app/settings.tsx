import React from 'react';
import { Box, render, Text, useInput } from 'ink';
import packageInfos from '../package.json';

import { Sep } from './components/Separator';
import { Key } from './components/footer/Key';

import { prev, next } from './utils/list';
import { palettes } from './utils/theme';

import { Context } from '../src/context';
import { unmountPlay } from './play';
import { launchApp } from './app';

const options: string[] = ['username', 'favorite_bet', ];

let instance: ReturnType<typeof render>;
export function showSettings() {
    instance = render(<Settings />);
}
export function unmountSettings() {
    instance?.unmount();
}

export const Settings = () => {
    const ctx = Context.get();
    const theme = palettes[ctx.settings.theme];

    const [option, setOption] = React.useState(0);
    const [isTyping, setIsTyping] = React.useState(false);
    const [username, setUsername] = React.useState(ctx.profile.username);
    const [favoriteBet, setFavoriteBet] = React.useState(ctx.settings.favoriteBet);

    const [height, setHeight] = React.useState(process.stdout.rows - 12);
    process.stdout.on('resize', () => {
        setHeight(process.stdout.rows - 12);
    })

    useInput((input, key) => {
        if (key.escape) {
            if (isTyping) {
                setIsTyping(false);
            } else {
                console.clear();
                unmountPlay();
                launchApp();
            }
        }

        if (key.downArrow && !isTyping) setOption(next(option, options));
        if (key.upArrow && !isTyping) setOption(prev(option, options));

        if (key.return) {
            setIsTyping(!isTyping);
        }

        if (isTyping) {
            switch (options[option]) {
                case 'username':
                    let newUsername = ctx.profile.username;

                    if (key.backspace) {
                        newUsername = newUsername.slice(0, -1);
                    } else if (key.return) {} else {
                        newUsername += input;
                    }

                    ctx.updateProfile({ username: newUsername });
                    setUsername(newUsername);

                    break;
                
                case 'favorite_bet':
                    let newFavoriteBet: string = ctx.settings.favoriteBet.toString();

                    if (key.backspace) {
                        newFavoriteBet = newFavoriteBet.slice(0, -1);
                        if (isNaN(parseInt(newFavoriteBet))) newFavoriteBet = '0';
                    } else if (key.return && parseInt(input) > 0) {} else {
                        if (!isNaN(parseInt(input))) {
                            newFavoriteBet += input;
                        }
                    }

                    ctx.updateSettings({ favoriteBet: parseInt(newFavoriteBet) });
                    setFavoriteBet(parseInt(newFavoriteBet));

                    break;
            }
        }
    }, { isActive: true });

    return (

<Box paddingX={2} paddingY={1} flexDirection='column' gap={1}>
    <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
        <Text bold color={theme.GOLD}>Golden Jack</Text>
        <Text bold color={theme.TEXT}>Settings</Text>
    </Box>

    <Sep />

    <Box display='flex' flexDirection='column' height={height} alignItems='center' justifyContent='center' gap={1}>
        <Box display='flex' gap={1}>
            <Text bold color={theme.TEXT}>{options[option] === 'username' ? '<  ' : ''}</Text>
            <Box display='flex' gap={1}>
                <Text bold color={options[option] === 'username'
                    ? isTyping
                        ? theme.BLUE
                        : theme.GOLD
                    : theme.TEXT
                }>Username</Text>
                <Text color={theme.TEXT}>{username}</Text>
            </Box>
            <Text bold color={theme.TEXT}>{options[option] === 'username' ? '  >' : ''}</Text>
        </Box>
        <Box display='flex' gap={1}>
            <Text bold color={theme.TEXT}>{options[option] === 'favorite_bet' ? '<  ' : ''}</Text>
            <Box display='flex' gap={1}>
                <Text bold color={options[option] === 'favorite_bet'
                    ? isTyping
                        ? theme.BLUE
                        : theme.GOLD
                    : theme.TEXT
                }>Favorite Bet</Text>
                <Text color={theme.TEXT}>{favoriteBet}G</Text>
            </Box>
            <Text bold color={theme.TEXT}>{options[option] === 'favorite_bet' ? '  >' : ''}</Text>
        </Box>

        <Box><Text>©Golden Jack V{ packageInfos.version }</Text></Box>
    </Box>

    <Sep />

    <Box display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' gap={2}>
        <Key keyCap='↕' color={theme.TEXT} does='Navigate' />
        <Key keyCap='return' color={theme.GREEN} does='Select' />
    </Box>
</Box>

    )
}