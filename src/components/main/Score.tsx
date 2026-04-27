import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../../utils/theme';

interface props {
    value: string | number;
}

export const Score = ({value}: props) => {

    return (

<Box display='flex' flexDirection='row'>
    <Text color={darkTheme.TEXT}>Score : </Text>
    <Text bold color={darkTheme.GOLD}>{value}</Text>
</Box>

    )
}