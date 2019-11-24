import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import font from '../static/fonts/StratumNo1 Medium.ttf';
import { mediaQueries } from './utils/mediaQueries';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  @import url("https://fonts.googleapis.com/css?family=Encode+Sans+Semi+Condensed|Questrial");

  @font-face {
    font-family: Stratum;
    font-display: auto;
    src: url('${font}');
  }

  html {
    font-family: Stratum, "Helvetica Neue For Number", "Hiragino Kaku Gothic ProN", "メイリオ", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 62.5%;

    ${mediaQueries.smartphone`
      font-size: 50.5%;
    `};
  }

  h1 {
    font-size: 3.6rem;
    margin: 32px 0;
  }

  h2 {
    font-size: 3.2rem;
    margin: 20px 0;
  }

  h3 {
    font-size: 2.4rem;
    margin: 16px 0;
  }

  h4 {
    font-size: 2.0rem;
    margin: 12px 0;
  }

  p, a {
    font-size: 2.0rem;
    font-weight: 100;
  }

  p {
    margin: 12px 0;
  }

  a {
    text-decoration: none;
  }
`;
