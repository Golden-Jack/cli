import React from 'react';
import { Box, Text } from 'ink';
import { Card, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';
import { cardHidden } from '../../composables/cardHidden';
import { cardColor } from '../../composables/cardColor';
import { cardText } from '../../composables/cardText';

interface props {
    card: Card;
    index: number;
    lastRound: Round;
    isDealer?: boolean;
}

export const CardItem = ({card, index, lastRound, isDealer}: props) => {
    const hidden: boolean = cardHidden(lastRound, index, isDealer);
    const color: darkTheme = cardColor(hidden, card);
    const text: string = cardText(hidden, card);
    const symbol: string = hidden ? '?' : card.symbol;
    
    return (
        <Box key={card.id} borderStyle='round' borderColor={color} display='flex' flexDirection='column' width={8}>
            <Box display='flex' justifyContent='flex-start'>
                <Text bold color={color}>{symbol}</Text>
            </Box>
            <Box display='flex' justifyContent='center'>
                <Text bold color={darkTheme.TEXT}>{text}</Text>
            </Box>
            <Box display='flex' justifyContent='flex-end'>
                <Text bold color={color}>{symbol}</Text>
            </Box>
        </Box>
    )
}