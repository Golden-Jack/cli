import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../../utils/theme';

interface props {
    amount: number;
    isConfirmed: boolean;
    min: number;
    max?: number;
    playerBalance: number;
}

export const Bet = ({amount, isConfirmed, min, max, playerBalance}: props) => {

    return (

<Box display='flex' flexDirection='row'>
    <Text bold color={amount <= min ? darkTheme.GRAY : darkTheme.TEXT}>{!isConfirmed ? '< ' : ''}</Text>
    <Text color={darkTheme.TEXT}>Bet : </Text>
    <Text bold color={isConfirmed ? darkTheme.GREEN : darkTheme.BLUE}>{amount}</Text>
    <Text bold color={(amount >= (max ?? Infinity) || amount >= playerBalance) ? darkTheme.GRAY : darkTheme.TEXT}>{!isConfirmed ? ' >' : ''}</Text>
</Box>

    )
}