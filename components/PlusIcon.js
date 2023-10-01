import * as React from 'react';

import Svg, { Path, Circle } from 'react-native-svg';

export const PlusIcon = ({ fill }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none">
    <Circle
      cx={12.5}
      cy={12.5}
      r={12}
      fill="none"
      transform="rotate(-45 12.5 12.5)"
    />
    <Path
      fill={fill}
      fillRule="evenodd"
      d="M13 6H12V12H6V13H12V19H13V13H19V12H13V6Z"
      clipRule="evenodd"
    />
  </Svg>
);
