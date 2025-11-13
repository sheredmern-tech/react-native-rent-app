import { Easing } from 'react-native';

export const Animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  spring: {
    default: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    bounce: {
      damping: 10,
      stiffness: 100,
      mass: 0.8,
    },
    gentle: {
      damping: 20,
      stiffness: 120,
      mass: 1,
    },
  },

  easing: {
    easeInOut: Easing.inOut(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeIn: Easing.in(Easing.ease),
    linear: Easing.linear,
  },

  scale: {
    press: 0.97,
    active: 1.0,
  },
};

export type AnimationType = typeof Animations;
