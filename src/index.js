import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RouterPage from './Components/RouterPage';
import { Provider } from 'react-redux';
import { store } from './red/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <RouterPage />
    {/* <Apps /> */}
  </Provider>
);

reportWebVitals();




// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <div className="safe-area-container">
//     <Provider store={store}>
//       <RouterPage />
//     </Provider>
//   </div>
// );
//  reportWebVitals();

