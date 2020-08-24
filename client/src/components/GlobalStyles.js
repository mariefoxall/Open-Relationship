import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

body {
  font-family: "Spartan", sans-serif;
}
:root {
  --forest-green: #004d00;
  --coral: #ffa899;
  --lavender: #b3b3ff;
  --pale-yellow: #fcffe6;
  --mint-green:  #79d2a6
}

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  html, body {
    max-width: 100vw;

    
  }


  /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;

  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  body {
    line-height: 1.25;
    color: black;

  }
  input, button{
    font-family: 'Spartan', sans-serif;
  }

  a{text-decoration: none;
  padding: 0;
  margin:0;}

`;

export default GlobalStyles;
