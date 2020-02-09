import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSync,
  faTrash,
  faChevronUp,
  faChevronDown,
  faTerminal,
  faBars,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/rootReducer";

import './index.css';

library.add(
  faSync,
  faTrash,
  faChevronUp,
  faChevronDown,
  faTerminal,
  faBars,
  faQuestionCircle
);

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware( thunk )
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

ReactDOM.render( <Provider store={ store }><App/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
