import { Box, Text } from 'ink';
import { Outcome, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';

interface props {
    round: Round;
    playerId: string;
}

interface handResult {
    outcome: Outcome;
    diff: number;
}

export const OutcomeItem = ({round, playerId}: props) => {
    const handCount = round.handCount(playerId);

    const results: handResult[] = Array.from({ length: handCount }, (_, i) => {
        const outcome = round.findOutcome(playerId, i);
        if (!outcome) return null;

        const bet = round.getBet(playerId, i) ?? 0;
        return { outcome, diff: round.diff(outcome, bet) };
    }).filter((r): r is handResult => r !== null);

    if (results.length === 0) return null;

    const total = results.reduce((sum, r) => sum + r.diff, 0);

    const colorFor = (diff: number): darkTheme => diff > 0
        ? darkTheme.GREEN
        : diff < 0
            ? darkTheme.RED
            : darkTheme.TEXT;

    return (

<Box display='flex' flexDirection='column' alignItems='center' gap={1}>
    {results.length > 1
        ? results.map((r, i) => (
            <Text key={i} color={colorFor(r.diff)}>
                {r.outcome} {r.diff > 0 ? '+' : ''}{Math.round(r.diff)}G
            </Text>
        ))
        : <Text>{results[0]!.outcome}</Text>
    }
    <Text bold color={colorFor(total)}>{total > 0 ? '+' : ''}{Math.round(total)}G</Text>
</Box>

    )
}