import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MenuPanel, FormatPanel, SpreadSheetPanel} from './components'
import reportWebVitals from './reportWebVitals';

function App() {
  return (
    <div>
      <div className="header" style={{ height: window.innerHeight * .05 }}>
          Lifestyle Trackers
      </div>
      <FormatPanel />
      <div id="pageID" className="page">
        <MenuPanel />
        {/*<SpreadSheetPanel outerHeight='200' outerWidth='200' cols='5' rows='5' loadedSheet='<p>Loaded</p>'/>*/}
        <SpreadSheetPanel outerHeight='600' outerWidth='600' defaultRowHeight='20' defaultColWidth='100' cols='5' rows='9' loadedSheet=''/>
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

