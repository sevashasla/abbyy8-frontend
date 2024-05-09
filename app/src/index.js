import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Project from './Project';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <p style={{"font-size": "large", "textAlign": "center"}}>Projects</p>
    <div class="lenta">
      <Project projectId={0} />
      <Project projectId={1} />
      <Project projectId={2} />
    </div>
    <p style={{"font-size": "large", "textAlign": "center"}}>Posts</p>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
