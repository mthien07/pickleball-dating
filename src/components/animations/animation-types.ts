import { ViewStyle } from 'react-native';

export interface AnimationProps extends React.PropsWithChildren {
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  visible?: boolean;
}

export interface SlideProps extends AnimationProps {
  direction?: 'top' | 'bottom' | 'left' | 'right';
  distance?: number;
}

export interface StaggerContainerProps extends AnimationProps {
  staggerTime?: number;
}
