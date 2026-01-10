import React from "react";
import { magicBentoCardData } from "./magic-bento-data";

const MagicBentoStatic: React.FC = () => {
  return (
    <div className="card-grid">
      {magicBentoCardData.map((card) => (
        <div
          key={card.id}
          className="card"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--card-foreground)",
          }}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
          )}
          <div className="card__header">
            <div className="card__label text-2xl uppercase font-bold">
              {card.label}
            </div>
          </div>
          <div className="card__content">
            <h2 className="card__title text-m">{card.title}</h2>
            <p className="card__description text-sm">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MagicBentoStatic;
