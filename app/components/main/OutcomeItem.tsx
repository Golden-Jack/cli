import React from 'react';
import { Box, Text } from 'ink';
import { Outcome, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';

interface props {
    round: Round;
    playerId: string;
    bet: number;
}

export const OutcomeItem = ({round, playerId, bet}: props) => {
    const outcome: Outcome | undefined = round.findOutcome(playerId);

    if (outcome) {
        const diff: number = round.diff(outcome, bet);

        const color: darkTheme = diff >= 0
            ? diff === 0
                ? darkTheme.TEXT
                : darkTheme.GREEN
            : darkTheme.RED;

        return (

<Box display='flex' flexDirection='column' alignItems='center' gap={1}>
    <Text>{outcome}</Text>
    <Text color={color}>{diff > 0 ? '+' : ''}{diff}G</Text>
 </Box>

        )
    }
}