import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';

type Card = { suit: '♠' | '♥' | '♦' | '♣'; value: string };
type Phase = 'betting' | 'playing' | 'result';

const SUITS: Card['suit'][] = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const randomCard = (): Card => ({
  suit: SUITS[Math.floor(Math.random() * 4)],
  value: VALUES[Math.floor(Math.random() * 13)],
});
const cardScore = (v: string) => v === 'A' ? 11 : ['J','Q','K'].includes(v) ? 10 : parseInt(v);
const handScore = (hand: Card[]) => {
  let score = hand.reduce((s, c) => s + cardScore(c.value), 0);
  let aces = hand.filter(c => c.value === 'A').length;
  while (score > 21 && aces-- > 0) score -= 10;
  return score;
};
const isRed = (s: Card['suit']) => s === '♥' || s === '♦';

const CardView = ({ card, hidden }: { card: Card; hidden?: boolean }) => (
  <Box borderStyle="round" borderColor="white" paddingX={1}>
    {hidden
      ? <Text color="gray">?</Text>
      : <Text color={isRed(card.suit) ? 'red' : 'white'}>{card.value} {card.suit}</Text>
    }
  </Box>
);

const Hand = ({ cards, label, hideSecond }: { cards: Card[]; label: string; hideSecond?: boolean }) => (
  <Box flexDirection="column">
    <Text color="gray">{label}{!hideSecond ? `  (${handScore(cards)})` : ''}</Text>
    <Box gap={1}>
      {cards.map((c, i) => <CardView key={i} card={c} hidden={hideSecond && i === 1} />)}
    </Box>
  </Box>
);

const Sep = () => <Text color="gray">{'─'.repeat(32)}</Text>;

function App() {
  const [phase, setPhase]     = useState<Phase>('betting');
  const [balance, setBalance] = useState(1000);
  const [bet, setBet]         = useState(50);
  const [player, setPlayer]   = useState<Card[]>([]);
  const [dealer, setDealer]   = useState<Card[]>([]);
  const [message, setMessage] = useState('');

  const deal = () => {
    setPlayer([randomCard(), randomCard()]);
    setDealer([randomCard(), randomCard()]);
    setMessage('');
    setPhase('playing');
  };

  const resolve = (p: Card[], d: Card[]) => {
    let fd = [...d];
    while (handScore(fd) < 17) fd.push(randomCard());
    setDealer(fd);
    const ps = handScore(p), ds = handScore(fd);
    let msg = '';
    if (ps > 21)            { msg = '💀 Bust — perdu';    setBalance(b => b - bet); }
    else if (ds > 21 || ps > ds) { msg = '🎉 Gagné !';   setBalance(b => b + bet); }
    else if (ps === ds)     { msg = '🤝 Égalité'; }
    else                    { msg = '😞 Perdu';            setBalance(b => b - bet); }
    setMessage(msg);
    setPhase('result');
  };

  const hit = () => {
    const h = [...player, randomCard()];
    setPlayer(h);
    if (handScore(h) > 21) resolve(h, dealer);
  };

  useInput((input, key) => {
    if (phase === 'betting') {
      if (key.upArrow)   setBet(b => Math.min(balance, b + 50));
      if (key.downArrow) setBet(b => Math.max(50, b - 50));
      if (key.return)    deal();
    }
    if (phase === 'playing') {
      if (input === 'h') hit();
      if (input === 's') resolve(player, dealer);
    }
    if (phase === 'result' && key.return) setPhase('betting');
    if (input === 'q') process.exit(0);
  });

  return (
    <Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>
      <Box gap={2}>
        <Text bold color="green">♠ BLACKJACK</Text>
        <Text color="gray">solde:</Text>
        <Text color="yellow" bold>{balance}€</Text>
      </Box>
      <Sep />
      {phase === 'betting' ? (
        <Box flexDirection="column" gap={1}>
          <Text>Mise : <Text color="white" bold>{bet}€</Text>  <Text color="gray">(↑↓ pour ajuster)</Text></Text>
          <Text color="gray">Entrée pour distribuer</Text>
        </Box>
      ) : (
        <Box flexDirection="column" gap={1}>
          <Hand cards={dealer} label="Dealer" hideSecond={phase === 'playing'} />
          <Sep />
          <Hand cards={player} label="Vous" />
        </Box>
      )}
      <Sep />
      {phase === 'playing' && (
        <Box gap={3}>
          <Text>[<Text color="green" bold>H</Text>] Hit</Text>
          <Text>[<Text color="red" bold>S</Text>] Stand</Text>
        </Box>
      )}
      {phase === 'result' && (
        <Box flexDirection="column">
          <Text bold>{message}</Text>
          <Text color="gray">Entrée pour rejouer · [q] quitter</Text>
        </Box>
      )}
      {phase === 'betting' && <Text color="gray" dimColor>[q] quitter</Text>}
    </Box>
  );
}

render(<App />);