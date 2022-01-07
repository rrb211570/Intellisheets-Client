import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MenuPanel, SpreadSheetPanel } from './components'
import reportWebVitals from './reportWebVitals';

const ALL = -1;
const RESIZING = 0;
const TEXTCHANGE = 1;

function App() {
  return (
    <div>
      <div className="header" style={{ height: window.innerHeight * .05 }}>
        Lifestyle Trackers
      </div>
      <div id="pageID" className="page">
        <SpreadSheetPanel outerHeight='600' outerWidth='600' defaultRowHeight='20' defaultColWidth='100' cols='5' rows='9' loadedSheet='' whichTests={[RESIZING]} />
      </div>
    </div>

  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();