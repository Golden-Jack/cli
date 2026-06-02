import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../../utils/theme';
import { Bet } from './Bet';
import { Balance } from './Balance';

interface props {
    bet: number;
    isBetConfirmed: boolean;
    min: number;
    max?: number;
    playerBalance: number;
}

export const Header = ({bet, isBetConfirmed, min, max, playerBalance}: props) => {
    return (

<Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
    <Text bold color={darkTheme.GOLD}>Golden Jack</Text>
    <Bet amount={bet} isConfirmed={isBetConfirmed} min={Math.min(min, playerBalance)} max={max} playerBalance={playerBalance} />
    <Balance balance={playerBalance} />
</Box>

    )
}