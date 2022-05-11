import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Network from "./ServiceFlow";
import reportWebVitals from './reportWebVitals';
import CircuitBreakerFlow from "./CircuitBreakerFlow";

ReactDOM.render(
  <React.StrictMode>
    <CircuitBreakerFlow />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
