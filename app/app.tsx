import React from 'react';
import { Box, render, Text, useInput } from 'ink';

import { Sep } from './components/Separator';
import { Key } from './components/footer/Key';

import { prev, next } from './utils/list';
import { palettes } from './utils/theme';

import { Context } from '../src/context';
import { showSaves } from './saves';
import { showSettings } from './settings';

const options: string[] = ['Play', 'Settings'];

let instance: ReturnType<typeof render>;
export function launchApp() {
    instance = render(<App />);
}
export function unmountApp() {
    instance?.unmount();
}

export const App = () => {
    const [option, setOption] = React.useState(0);
    const ctx = Context.get();
    const theme = palettes[ctx.settings.theme];

    const [height, setHeight] = React.useState(process.stdout.rows - 12);
    process.stdout.on('resize', () => {
        setHeight(process.stdout.rows - 12);
    })

    useInput((input, key) => {
        if (key.escape) process.exit(1);

        if (key.downArrow) setOption(next(option, options));
        if (key.upArrow) setOption(prev(option, options));

        if (key.return) {
            console.clear();
            unmountApp();
            if (options[option] === 'Play') showSaves();
            if (options[option] === 'Settings') showSettings();
        }
    }, { isActive: true });

    return (

<Box display='flex' paddingX={2} paddingY={1} flexDirection='column' gap={1} alignItems='center'>
    <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
        <Text bold color={theme.GOLD}>Golden Jack</Text>
    </Box>

    <Sep />

    <Box display='flex' flexDirection='column' height={height} alignItems='center' justifyContent='center' gap={1}>
        <Box display='flex' gap={1}>
            <Text bold color={theme.TEXT}>{options[option] === 'Play' ? '<  ' : ''}</Text>
            <Text bold color={options[option] === 'Play' ? theme.GOLD : theme.TEXT}>Play</Text>
            <Text bold color={theme.TEXT}>{options[option] === 'Play' ? '  >' : ''}</Text>
        </Box>
        <Box display='flex' gap={1}>
            <Text bold color={theme.TEXT}>{options[option] === 'Settings' ? '<  ' : ''}</Text>
            <Text bold color={options[option] === 'Settings' ? theme.GOLD : theme.TEXT}>Settings</Text>
            <Text bold color={theme.TEXT}>{options[option] === 'Settings' ? '  >' : ''}</Text>
        </Box>
    </Box>

    <Sep />

    <Box display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' gap={2}>
        <Key keyCap='↕' color={theme.TEXT} does='Navigate' />
        <Key keyCap='return' color={theme.GREEN} does='Select' />
    </Box>
</Box>

    )
}