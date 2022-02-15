import './App.css';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import WelcomeLoginF from './pages/welcomeLoginF/welcomeLoginF';
import PITRequests from './pages/pitrequests/pitrequests';
import 'bootstrap/dist/css/bootstrap.min.css';
import PitRequestView from './pages/pitRequestView/pitRequestView';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/"} element={<WelcomeLoginF/>} />
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pitrequests"} element={<PITRequests/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pitrequestsview"} element={<PitRequestView/>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
