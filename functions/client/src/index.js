import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuth from './pages/UserAuth.js';
import SignUp from './pages/SignUp.js';
import ConfirmCode from './pages/ConfirmCode.js';
import { SheetManager } from './pages/SheetManager.js';
import Sheet from './pages/Sheet.js';
import NoPage from './pages/NoPage.js';
import About from './pages/About.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/about' element={<About />} />
        <Route path='/' element={<UserAuth />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/confirmCode/:username' element={<ConfirmCode />} />
        <Route path='/sheets' element={<SheetManager />} />
        <Route path='/editor/:sheetID' element={<Sheet />} />
        <Route path='/*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);