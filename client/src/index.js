import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuth from './pages/UserAuth.js'
import SignUp from './pages/SignUp.js'
import SheetManager from './pages/SheetManager.js'
import Sheet from './pages/Sheet.js'
import NoPage from './pages/NoPage.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserAuth />} />
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path="/sheets" element={<SheetManager />} />
        <Route path="/editor" element={<Sheet />} />
        <Route path="/*" element={<NoPage />} />
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