import { useEffect, useRef } from "react";

interface Props {
  x: number;
  y: number;
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  color: string;
  fontSize: number;
  fontFamily: string;
}

export default function TextEditor({
  x,
  y,
  value,
  onChange,
  onSubmit,
  color,
  fontSize,
  fontFamily,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  // focus the input as soon as it appears
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onSubmit}
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize,
        fontFamily,
        color,
        background: "transparent",
        border: "1px solid #ccc",
        outline: "none",
        padding: "2px 4px",
        borderRadius: 4,
      }}
    />
  );
}
