import React from 'react';
import cx from 'classnames';
import styles from './style.css';

const List = (props) => (
  <ul className={styles.ul}>
    {
      props.items.map((item, i) => (
        <li
          key={item.key || i}
          className={cx(styles.li, props.className)}
        >
          {
            item.link ? (
              <a
                href={item.link}
                target="_blank"
              >
                {item.text}
              </a>
            ) : (
              <p>{item.text}</p>
            )
          }
        </li>
      ))
    }
  </ul>
);

export default List;
