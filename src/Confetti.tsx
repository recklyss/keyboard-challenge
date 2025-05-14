import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

type ConfettiPiece = {
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  id: string;
};

const confettiColors = [
  'var(--flamingo-pink)',
  'var(--wave-blue)',
  'var(--turmeric-yellow)',
  'var(--jade-green)',
  'var(--sapphire-blue)',
  'var(--amethyst-purple)'
];

export const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 36; i++) {
        pieces.push({
          left: Math.random() * 100,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 0.7,
          duration: 1.2 + Math.random() * 0.8,
          size: 10 + Math.random() * 10,
          rotate: Math.random() * 360,
          id: `${Date.now()}-${i}-${Math.random()}`
        });
      }
      setConfetti(pieces);
    } else {
      setConfetti([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {confetti.map(piece => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * (0.5 + Math.random()),
            background: piece.color,
            transform: `rotate(${piece.rotate}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}; 