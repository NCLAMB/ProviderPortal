import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './scss/app.scss';
import AppRouter from './routers/AppRouter.jsx';


//ReactDOM.render(<h1>HELLO WORLD</h1>, document.getElementById('app'));  
ReactDOM.render(<AppRouter />, document.getElementById('app')); 
