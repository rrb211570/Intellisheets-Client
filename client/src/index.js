import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'
import './index.css';
import { SpreadSheetPanel } from './components'
import { rootReducer, mapStateToProps, mapDispatchToProps, updateSheetDimensions } from './store.js'
// test flags
const ALL = -1;
const RESIZING = 0;
const TEXTCHANGE = 1;

// table arguments & store initialization
const ROWS = 3;
const COLS = 3;
const DEFAULTROWHEIGHT = '20';
const DEFAULTCOLWIDTH = '100';

const store = createStore(rootReducer);
const SpreadSheetContainer = connect(mapStateToProps, mapDispatchToProps)(SpreadSheetPanel);
store.dispatch(updateSheetDimensions((parseInt(ROWS, 10) + 1) * DEFAULTROWHEIGHT, (COLS * DEFAULTCOLWIDTH) + (DEFAULTCOLWIDTH / 2)));

function App() {
  return (
    <div>
      <div className="header" style={{ height: window.innerHeight * .05 }}>
        Lifestyle Trackers
      </div>
      <div id="pageID" className="page">
        <Provider store={store}>
          <SpreadSheetContainer rows={ROWS} cols={COLS} defaultRowHeight={DEFAULTROWHEIGHT} defaultColWidth={DEFAULTCOLWIDTH} whichTests={[RESIZING]} />
        </Provider>
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