import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text }) => {
  const [visibleText, setVisibleText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setVisibleText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 70); // 调整速度
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return <div>{visibleText}</div>;
};
export default TypewriterEffect;