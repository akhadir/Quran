import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';
import App from './app';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App path="/" />
            <App path="/:chapter" />
            <App path="/:chapter/:startVerse" />
            <App path="/:chapter/:startVerse/:totalVerses/" />
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);
