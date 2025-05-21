import React from 'react';
import './tsxComponent.sass';

interface MyComponentProps {
  text: string;
}

export const MyComponent = ({ text }: MyComponentProps) => {
  return <div className="tsxDiv">{text}</div>;
};
