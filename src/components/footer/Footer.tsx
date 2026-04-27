import React from 'react';
import { Box } from 'ink';
import { GameState, Round } from '@golden-jack/engine';
import { darkTheme } from '../../utils/theme';
import { Key } from './Key';

interface props {
    lastRound: Round;
    isBetConfirmed: boolean;
}

export const Footer = ({lastRound, isBetConfirmed}: props) => {
    return (

<Box display='flex' flexDirection='row' justifyContent='space-around'>
    <Key keyCap='escape' color={darkTheme.GRAY} does='Quit' />
    {!isBetConfirmed && <Key keyCap='<-' color={darkTheme.TEXT} does='Decrease' />}
    {!isBetConfirmed && <Key keyCap='->' color={darkTheme.TEXT} does='Increase' />}
    {!isBetConfirmed && <Key keyCap='enter' color={darkTheme.GREEN} does='Valid' />}
    {lastRound.state === GameState.PLAYER && <Key keyCap='h' color={darkTheme.GREEN} does='Hit' />}
    {lastRound.state === GameState.PLAYER && <Key keyCap='s' color={darkTheme.RED} does='Stand' />}
    {lastRound.state === GameState.END && <Key keyCap='Space' color={darkTheme.BLUE} does='New Round' />}
</Box>

    )
}