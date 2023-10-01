import { useState } from 'react';
export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const toggleVisibility = () => {
    setPasswordVisibility(prev => !prev);
  };
  return {
    passwordVisibility,
    toggleVisibility,
  };
};
