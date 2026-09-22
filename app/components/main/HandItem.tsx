import { Box, Text } from 'ink';
import { Card, GameState, Hand, Player, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';
import { CardItem } from './CardItem';
import { Score } from './Score';

interface props {
    lastRound: Round;
    isDealer?: boolean;
    player?: Player;
}

export const HandItem = ({lastRound, isDealer, player}: props) => {
    if (isDealer) {
        const hand: Hand = lastRound.dealerHand;

        return (

<Box display='flex' flexDirection='column' gap={1} alignItems='center' justifyContent='center'>
    <Text bold>DEALER</Text>
    <Box display='flex' flexDirection='row' justifyContent='center'>
        {hand.cards.map((card: Card, index: number) => {
            return <CardItem key={card.id} card={card} index={index} lastRound={lastRound} isDealer />
        })}
    </Box>
    <Score value={lastRound.state === GameState.PLAYER ? '?' : hand.score} />
</Box>

        )
    }

    const handCount = lastRound.handCount(player!.id);
    const activeIndex = lastRound.getCurrentHandIndex(player!.id);

    return (

<Box display='flex' flexDirection='column' gap={1} alignItems='center' justifyContent='center'>
    <Text bold>{player!.displayName}</Text>
    <Box display='flex' flexDirection='row' gap={2} justifyContent='center'>
        {Array.from({ length: handCount }, (_, handIndex) => {
            const hand: Hand = lastRound.findHand(player!.id, handIndex)!;
            const isActive = handCount > 1 && handIndex === activeIndex;

            return (
                <Box
                    key={handIndex}
                    display='flex'
                    flexDirection='column'
                    gap={1}
                    alignItems='center'
                    borderStyle={isActive ? 'single' : undefined}
                    borderColor={darkTheme.GOLD}
                    borderTop={isActive}
                    borderBottom={false}
                    borderLeft={false}
                    borderRight={false}
                >
                    <Box display='flex' flexDirection='row' justifyContent='center'>
                        {hand.cards.map((card: Card, index: number) => {
                            return <CardItem key={card.id} card={card} index={index} lastRound={lastRound} isDealer={false} />
                        })}
                    </Box>
                    <Score value={hand.score} />
                </Box>
            )
        })}
    </Box>
</Box>

    )
}