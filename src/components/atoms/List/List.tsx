import * as React from 'react';
import styled from 'styled-components';
import { whiteColor } from '../../../variables';

export interface Props {
  items: Array<{
    key?: string;
    text: string;
    link: string;
  }>;
}

const Ul = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Li = styled.li`
  align-items: baseline;
  color: ${whiteColor};
  display: flex;
  margin-left: 15px;

  &:before {
    content: '-';
    font-size: 20px;
    margin-left: -15px;
  }

  > p {
    display: inline-block;
    margin-left: 15px;
  }
`;

const A = styled.a`
  color: ${whiteColor};
  font-family: 'Questrial', sans-serif, 'Hiragino Kaku Gothic ProN', 'メイリオ';
  margin: 10px auto 10px 15px;
  line-height: 1.6;

  &:visited {
    color: ${whiteColor};
  }

  &:after {
    content: '';
    display: block;
    height: 2px;
    transition: width 0.4s;
    width: 0;
    background: black;
  }

  &:hover:after {
    width: 100%;
    transition: width 0.4s;
  }
`;

export const List: React.FC<Props> = (props) => (
  <Ul>
    {props.items.map((item, i) => (
      <Li key={item.key || i}>
        {item.link ? (
          <A rel="noopener" href={item.link} target="_blank">
            {item.text}
          </A>
        ) : (
          <p>{item.text}</p>
        )}
      </Li>
    ))}
  </Ul>
);
