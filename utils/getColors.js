export const getColors = theme => {
  return {
    primaryBackground: theme === 'light' ? '#fff' : 'rgb(28, 28, 44)',
    inputBackground: theme === 'light' ? '#f6f6f6' : 'rgba(189, 189, 189, 0.2)',
    primaryTextColor: theme === 'light' ? 'rgb(33, 33, 33)' : '#fff',
    subtleTextColorEmail:
      theme === 'light' ? 'rgba(33, 33, 33, 0.8)' : 'rgba(250, 250, 250, 0.5)',
    subtleTextColor:
      theme === 'light' ? 'rgb(189, 189, 189)' : 'rgb(232, 232, 232)',
    secondaryRegisterTextColor:
      theme === 'light' ? '#1b4371' : 'rgba(27, 67, 113, 0.5)',
    avatarBorderColor:
      theme === 'light' ? 'transparent' : 'rgba(27, 67, 113, 0.5)',
    avatarBackground: theme === 'light' ? '#f6f6f6' : 'rgba(33, 33, 33, 0.8)',
    iconFill: theme === 'light' ? 'rgba(33, 33, 33, 0.8)' : '#1b4371',
    inputBorder: theme === 'light' ? '#e8e8e8' : 'rgba(189, 189, 189, 0.2)',
    commentBackground:
      theme === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(27, 67, 113, 0.5)',
    showPasswordTxt: theme === 'light' ? '#1B4371' : 'rgb(28, 28, 44)',
  };
};
