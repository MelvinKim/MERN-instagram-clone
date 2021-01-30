import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import { BrowserRouter as Router} from 'react-router-dom'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
<Router>
<App />
</Router>
, document.getElementById('root'));
registerServiceWorker();
