import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";

interface FlipCardProps {
  flip?: boolean;
  disabled?: boolean;
  oneWay?: boolean;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({
  disabled = false,
  frontContent,
  backContent,
  oneWay = false,
  flip = false,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (disabled) return;
    if (oneWay) {
      if (!flipped) setFlipped(true);
      return;
    }
    setFlipped(!flipped);
  };

  useEffect(() => {
    if (flip) setFlipped(true);
  }, [flip]);

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
      <div onClick={handleFlip}>{backContent}</div>
      <div onClick={handleFlip}>{frontContent}</div>
    </ReactCardFlip>
  );
};

export default FlipCard;
