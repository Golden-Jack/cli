import { Card, Type } from '@golden-jack/engine';
import { darkTheme } from '../utils/theme';

export const cardColor = (hidden: boolean, card: Card): darkTheme => {
    return hidden
        ? darkTheme.GOLD
        : card.type === Type.HEART || card.type === Type.DIAMOND
            ? darkTheme.RED
            : darkTheme.TEXT;
}