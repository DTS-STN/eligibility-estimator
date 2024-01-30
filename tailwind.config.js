module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        // please note that the order here is important, and will determine how some styles are applied
        xs: '320px',
        ss: '350px',
        s: '480px',
        sm: '768px',
        md: '992px',
        lg: '1200px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0',
          s: '1rem',
          sm: '1rem',
          lg: '3rem',
        },
      },
      fontSize: {
        // https://www.figma.com/file/TodbPq5LF1G6l1E3Kx2qPP/GC-Design-Library?node-id=22%3A76
        h6: ['19px', '21px'],
        base: ['20px', '33px'],
        h5: ['20px', '22px'],
        h4: ['22px', '24px'],
        h3: ['24px', '26px'],
        h2: ['36px', '40px'],
        xs: ['32px', '36px'],
        h1: ['38px', '42px'], // requires red <hr /> below
        mobile: ['34px', '38px'],
        small: ['14px', '16px'],
      },
      colors: {
        'white': '#FFF',
        'black': '#000',
        'content': '#333',
        'light-green': '#D8EECA',

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
        'info': '#269abc;',
        'info-border': '#666666',
        'info-hover': '#343333',

        // warning
        'warning': '#EE7100;',
        'warning-border': '#917f08',
        'warning-hover': '#c2aa0a',

        // danger
        'danger': '#D3080C',
        'danger-border': '#942826',
        'danger-hover': '#3b100f',

        // link
        'transparent': 'transparent',
        'details-link': '#2b4380',

        // misc
        'muted': '#555',
        'form-border': '#6f6f6f',
        'form-highlighted': '#66afe9;',

        'header-rule': '#AF3C43',

        'emphasis': '#F5F5F5',

        //button background color
        'button-background': '#26374a',
      },
      fontFamily: {
        'header-gc': '"Lato", sans-serif',
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
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          '@screen xs': {
            maxWidth: '90%',
          },
          '@screen s': {
            maxWidth: '95%',
          },
          '@screen lg': {
            maxWidth: '1200px',
          },
        },
      })
    },
  ],
}
