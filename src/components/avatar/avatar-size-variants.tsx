import React from 'react';
import { Avatar, AvatarProps } from './Avatar';

/** Convenience size variants */
export const AvatarXS: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="xs" />
);
export const AvatarSM: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="sm" />
);
export const AvatarMD: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="md" />
);
export const AvatarLG: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="lg" />
);
export const AvatarXL: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="xl" />
);
