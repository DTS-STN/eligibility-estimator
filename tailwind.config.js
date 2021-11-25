module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    screens: {
      desktop: '1200px',
      tablet: '992px',
      mobile: '768px',
    },
    colors: {
      'white': '#FFF',
      'black': '#000',
      // default
      'default-text': '#335075',
      'default-bg': '#eaebed',
      'default-hover-bg': '#cfd1d5',
      'default-border': '#dcdee1',

      // primary - text is white
      'primary-bg': '#2572b4',
      'primary-border': '#091c2d',
      'primary-hover-bg': '#1c578a;',

      // success
      'success-bg': '#1b6c1c',
      'success-border': '#071a07',
      'success-hover-bg': '#114311;',

      // info
      'info-bg': '#4d4d4d;',
      'info-border': '#000',
      'info-hover-bg': '#343333',

      // warning
      'warning-bg': '#f2d40d;',
      'warning-border': '#917f08',
      'warning-hover-bg': '#c2aa0a',

      // danger
      'danger-bg': '#bc3331',
      'danger-border': '#942826',
      'danger-hover-bg': '#3b100f',

      // link
      'link-bg': 'transparent',
      'link-border': 'none',
      'link-hover-bg': 'none',
    },
    extend: {
      minHeight: {
        9: '36px',
      },
      minWidth: {
        9: '36px',
      },
    },
  },
  variants: {
    extend: {
      borderStyle: [
        'separate',
        'solid',
        'dashed',
        'collapsed',
        'dotted',
        'double',
        'none',
        'outset',
      ],
    },
  },
  plugins: [],
}
