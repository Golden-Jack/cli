import { Card } from '@golden-jack/engine';

export const cardText = (hidden: boolean, card: Card): string => {
    return hidden
        ? '??'
        : isNaN(parseInt(card.rank))
            ? card.rank + card.rank
            : card.rank.padStart(2, '0');
}