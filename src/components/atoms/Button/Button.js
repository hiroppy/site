import React from 'react';
import cx from 'classnames';
import styles from './style.css';

const Button = (props) => (
  <a
    rel="noopener"
    href={props.link}
    style={{ borderColor: props.color }}
    target="_blank"
    className={cx(styles.container, props.className)}
  >
    {
      props.children
    }
  </a>
);

export default Button;
