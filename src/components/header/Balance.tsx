import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../../utils/theme';

interface props {
    balance: number;
}

export const Balance = ({balance}: props) => {
    return (

<Box display='flex' flexDirection='row'>
    <Text color={darkTheme.TEXT}>Balance : </Text>
    <Text bold color={darkTheme.GOLD}>{balance}G</Text>
</Box>

    )
}