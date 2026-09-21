import React from 'react';
import { Box, useInput } from 'ink';
import { GameState, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';
import { Key } from './Key';

interface props {
    lastRound: Round;
    isBetConfirmed: boolean;
}

export const Footer = ({lastRound, isBetConfirmed}: props) => {
    const [keyDisplayed, setKeyDisplayed] = React.useState(false);

    useInput((input, key) => {
        if (input.toLowerCase() === 'm') {
            setKeyDisplayed(!keyDisplayed);
        }
    }, { isActive: true });

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
    {lastRound.state === GameState.END && keyDisplayed && <Key keyCap='space' color={darkTheme.BLUE} does='New Round' />}
</Box>

    )
}