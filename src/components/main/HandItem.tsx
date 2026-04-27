import React from 'react';
import { Box, Text } from 'ink';
import { Card, GameState, Hand, Player, Round } from '@golden-jack/engine';
import { CardItem } from './CardItem';
import { Score } from './Score';

interface props {
    lastRound: Round;
    isDealer?: boolean;
    player?: Player;
}

export const HandItem = ({lastRound, isDealer, player}: props) => {
    const hand: Hand = isDealer
        ? lastRound.dealerHand
        : lastRound.findHand(player!.id)!;

    return (

<Box display='flex' flexDirection='column' gap={1} alignItems='center' justifyContent='center'>
    <Text bold>{isDealer ? 'DEALER' : player!.displayName}</Text>
    <Box display='flex' flexDirection='row' justifyContent='center'>
        {hand.cards.map((card: Card, index: number) => {
            return <CardItem key={card.id} card={card} index={index} lastRound={lastRound} isDealer={isDealer} />
        })}
    </Box>
    <Score value={isDealer
        ? (lastRound.state === GameState.PLAYER ? '?' : lastRound.dealerHand.score)
        : lastRound.findHand(player!.id)!.score
    } />    
</Box>

    )
}