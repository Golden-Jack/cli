import React from 'react';
import { Box, Text } from 'ink';
import { darkTheme } from '../utils/theme';

interface props {
    keyCap: string;
    color: darkTheme;
    does: string;
}

export const Key = ({keyCap, color, does}: props) => {
    return (

<Box display='flex' flexDirection='row'>
    <Text color={darkTheme.TEXT}>[</Text>
    <Text bold color={color}>{keyCap.toUpperCase()}</Text>
    <Text color={darkTheme.TEXT}>] : {does}</Text>
</Box>

    )
}