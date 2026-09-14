import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  bgColor = '#ff6b00',
  textColor = '#ffffff',
  fullWidth = false,
  disabled = false,
  type = 'button',
  href,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      style={{
        height: '44px',
        padding: '0 20px',
        borderRadius: '4px',
        fontSize: '20px',
        fontWeight: 'bold',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: '200px',
        boxSizing: 'border-box',
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {children}
    </button>
  );
};