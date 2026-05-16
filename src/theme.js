export const getTheme = (dark) => ({
  bg:           dark ? '#0A0A0A' : '#F4F4F4',
  card:         dark ? '#141414' : '#FFFFFF',
  card2:        dark ? '#1C1C1C' : '#EEEEEE',
  text:         dark ? '#EDEDED' : '#111111',
  text2:        dark ? '#888888' : '#5A5A5A',
  text3:        dark ? '#4A4A4A' : '#AAAAAA',
  border:       dark ? '#1E1E1E' : '#E5E5E5',
  border2:      dark ? '#2A2A2A' : '#CECECE',
  inputBg:      dark ? '#141414' : '#FFFFFF',
  navBg:        dark ? '#0C0C0C' : '#FFFFFF',
  navBorder:    dark ? '#181818' : '#E5E5E5',
  accent:       '#6366F1',
  accentBg:     dark ? 'rgba(99,102,241,0.18)' : '#EEF2FF',
  btnText:      '#FFFFFF',
  shadow:       dark
    ? '0 2px 16px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)',
  toolbarShadow: dark
    ? '0 4px 24px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06)'
    : '0 2px 16px rgba(0,0,0,.09), 0 0 0 1px rgba(0,0,0,.06)',
});
