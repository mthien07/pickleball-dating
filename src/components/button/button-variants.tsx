import React from 'react';
import { Button, ButtonProps } from './Button';

/** Convenience wrappers for common button variants */

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const TextButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="text" />
);

export const IconButton: React.FC<Omit<ButtonProps, 'variant' | 'title'>> = (props) => (
  <Button {...props} variant="icon" />
);

export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="gradient" />
);

export const ElevatedButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="elevated" />
);
