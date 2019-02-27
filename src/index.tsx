import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';

const rootEl = document.getElementById('root');

const render = () => {
  ReactDOM.render(<App />, rootEl);
};

render();

declare const module: any;

if (module.hot) {
  module.hot.accept(() => {
    render();
  });
}
