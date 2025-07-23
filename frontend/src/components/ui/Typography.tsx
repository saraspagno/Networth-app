import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
}) => {
  const variantClasses = {
    h1: 'text-heading-1',
    h2: 'text-heading-2',
    h3: 'text-heading-3',
    body: 'text-body',
    caption: 'text-caption',
  };

  const classes = `${variantClasses[variant]} ${className}`;

  switch (variant) {
    case 'h1':
      return <h1 className={classes}>{children}</h1>;
    case 'h2':
      return <h2 className={classes}>{children}</h2>;
    case 'h3':
      return <h3 className={classes}>{children}</h3>;
    case 'caption':
      return <span className={classes}>{children}</span>;
    default:
      return <p className={classes}>{children}</p>;
  }
}; 