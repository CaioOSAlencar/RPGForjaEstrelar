import React from 'react';

const RPGBackground: React.FC = () => {
  return (
    <div className="rpg-background">
      {/* Animated Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="rpg-stars"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default RPGBackground;