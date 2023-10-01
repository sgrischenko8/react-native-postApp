import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const Flipicon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="rgba(189, 189, 189, 0.3)"
  >
    <Path
      fillRule="evenodd"
      d="M18 7.762v-7.762l12 12-12 12v-7.932c-13.961-0.328-13.362 9.493-9.808 15.932-8.772-9.482-6.909-24.674 9.808-24.238z"
    />
  </Svg>
);
