import React from 'react';

interface Props {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function ShapeButton({ active, onClick, title, children }: Props) {
  return (
    <button
      className={`shape-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}
