module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    screens: {
      lg: '1200px',
      md: '992px',
      sm: '768px',
    },
    fontSize: {
      h6: ['19px', '21px'],
      base: ['20px', '33px'],
      h5: ['20px', '22px'],
      h4: ['22px', '24px'],
      h3: ['24px', '26px'],
      h2: ['32px', '36px'],
      h1: ['34px', '48px'], // requires red <hr /> below
    },
    colors: {
      'white': '#FFF',
      'black': '#000',

      // default
      'default-text': '#335075',
      'default': '#eaebed',
      'default-hover': '#cfd1d5',
      'default-border': '#dcdee1',

      // primary
      'primary': '#293749',
      'primary-border': '#091c2d',
      'primary-hover': '#1c578a;',

      // success
      'success': '#1b6c1c',
      'success-border': '#071a07',
      'success-hover': '#114311;',

      // info
      'info': '#4d4d4d;',
      'info-border': '#000',
      'info-hover': '#343333',

      // warning
      'warning': '#f2d40d;',
      'warning-border': '#917f08',
      'warning-hover': '#c2aa0a',

      // danger
      'danger': '#bc3331',
      'danger-border': '#942826',
      'danger-hover': '#3b100f',

      // link
      'transparent': 'transparent',

      // misc
      'muted': '#555',
      'form-border': '#ccc',
      'form-highlighted': '#66afe9;',
    },
    extend: {
      fontFamily: {
        'header-gc': 'Lato, sans-serif',
        'sans': '"Noto Sans", sans-serif',
      },
      minHeight: {
        9: '36px',
      },
      minWidth: {
        9: '36px',
      },
      boxShadow: {
        'active-form':
          'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)',
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
  plugins: [require('@tailwindcss/forms')],
}
