import React from 'react';
import { Text, useStdout } from 'ink';

export const Sep = () => {
    const { stdout } = useStdout();

    return (

<Text color="gray">{'─'.repeat(stdout.columns * 0.75 - 4)}</Text>

    )
};