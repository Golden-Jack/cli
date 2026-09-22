import React from 'react';
import { Box, useInput } from 'ink';
import { GameConfig, GameState, Hand, Player, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';
import { Key } from './Key';

interface props {
    lastRound: Round;
    isBetConfirmed: boolean;
    player?: Player;
    gameConfig?: GameConfig;
}

export const Footer = ({lastRound, isBetConfirmed, player, gameConfig}: props) => {
    const [keyDisplayed, setKeyDisplayed] = React.useState(false);

    useInput((input, key) => {
        if (input.toLowerCase() === 'm') {
            setKeyDisplayed(!keyDisplayed);
        }
    }, { isActive: true });

    let canSplit = false;
    let canDouble = false;

    if (lastRound.state === GameState.PLAYER && player && gameConfig) {
        const activeIndex = lastRound.getCurrentHandIndex(player.id);

        if (activeIndex >= 0) {
            const hand: Hand = lastRound.findHand(player.id, activeIndex)!;
            const bet: number = lastRound.getBet(player.id, activeIndex) ?? 0;
            const fromSplit: boolean = lastRound.isFromSplit(player.id, activeIndex);
            const [first, second] = [...hand];

            canSplit = hand.size === 2
                && !!first && !!second && first.rank === second.rank
                && player.balance >= bet
                && lastRound.handCount(player.id) < gameConfig.maxSplitHands;

            canDouble = hand.size === 2
                && player.balance >= bet
                && (!fromSplit || gameConfig.allowDoubleAfterSplit)
                && (gameConfig.doubleOnly.length === 0 || gameConfig.doubleOnly.includes(hand.score));
        }
    }

    return (

<Box display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' gap={2}>
    {!keyDisplayed && <Key keyCap='m' color={darkTheme.TEXT} does='Shortcuts' />}
    {keyDisplayed && (lastRound.state === GameState.END || lastRound.state === GameState.BET) && <Key keyCap='escape' color={darkTheme.GOLD} does='Home' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='↔' color={darkTheme.TEXT} does='Change Bet' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='return' color={darkTheme.GREEN} does='Valid' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='a' color={darkTheme.GOLD} does='All-in' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='h' color={darkTheme.BLUE} does='Half-in' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='f' color={darkTheme.GREEN} does='Favorite' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='l' color={darkTheme.TEXT} does='Minimum' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && <Key keyCap='h' color={darkTheme.GREEN} does='Hit' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && <Key keyCap='s' color={darkTheme.RED} does='Stand' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && canSplit && <Key keyCap='p' color={darkTheme.RED} does='Split' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && canDouble && <Key keyCap='d' color={darkTheme.GREEN} does='Double' />}
    {lastRound.state === GameState.END && keyDisplayed && <Key keyCap='space' color={darkTheme.BLUE} does='New Round' />}
</Box>

    )
}