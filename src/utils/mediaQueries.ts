import { css, Interpolation } from 'styled-components';
import { smartphoneSize, tabletSize, pcSize } from '../variables';

export const mediaQueryBuilder = (size: number) => (
  strings: TemplateStringsArray,
  ...interpolations: Interpolation<any>[]
) => css`
  @media (max-width: ${size}px) {
    ${css(strings, ...interpolations)};
  }
`;

export const mediaQueries = {
  tablet: mediaQueryBuilder(tabletSize),
  smartphone: mediaQueryBuilder(smartphoneSize),
  pcSize: mediaQueryBuilder(pcSize)
};
