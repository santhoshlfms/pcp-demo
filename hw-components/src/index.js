import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


ReactDOM.render(
  <Suspense fallback={<h1>Loading...</h1>}>
    <App />
    </Suspense>
  ,document.getElementById('root')
);
