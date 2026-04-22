import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../utils/theme';

interface props {
    amount: number;
    isConfirmed: boolean;
    min: number;
    max?: number;
}

export const Bet = ({amount, isConfirmed, min, max}: props) => {
    return (

<Box display='flex' flexDirection='row'>
    <Text bold color={amount <= min ? darkTheme.GRAY : darkTheme.TEXT}>{!isConfirmed ? '< ' : ''}</Text>
    <Text color={darkTheme.TEXT}>Bet : </Text>
    <Text bold color={isConfirmed ? darkTheme.GREEN : ''}>{amount}</Text>
    <Text bold color={(max && amount >= max) ? darkTheme.GRAY : darkTheme.TEXT}>{!isConfirmed ? ' >' : ''}</Text>
</Box>

    )
}