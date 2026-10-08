export const colors = {
  background: '#151816', sunken: '#121513', surface: '#1c201d', raised: '#232824',
  line: '#262b27', border: '#454c46', text: '#eef0ec', secondary: '#a9afa9',
  muted: '#858c86', accent: '#c7dba8', onAccent: '#19210f', danger: '#f0a99c', cream: '#faf6ea',
} as const;
export const type = {
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 20 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16 },
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
