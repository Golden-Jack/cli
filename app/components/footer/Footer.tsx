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
        if (input.toLowerCase() === 'h') {
            setKeyDisplayed(!keyDisplayed);
        }
    }, { isActive: true });

    return (

<Box display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' gap={2}>
    {!keyDisplayed && <Key keyCap='h' color={darkTheme.TEXT} does='Shortcuts' />}
    {keyDisplayed && <Key keyCap='escape' color={darkTheme.GRAY} does='Quit' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='<-' color={darkTheme.TEXT} does='Decrease' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='->' color={darkTheme.TEXT} does='Increase' />}
    {!isBetConfirmed && keyDisplayed && <Key keyCap='enter' color={darkTheme.GREEN} does='Valid' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && <Key keyCap='h' color={darkTheme.GREEN} does='Hit' />}
    {lastRound.state === GameState.PLAYER && keyDisplayed && <Key keyCap='s' color={darkTheme.RED} does='Stand' />}
    {lastRound.state === GameState.END && keyDisplayed && <Key keyCap='Space' color={darkTheme.BLUE} does='New Round' />}
</Box>

    )
}