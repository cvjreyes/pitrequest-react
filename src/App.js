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
import ProjectsView from './pages/projectsView/projectsView';
import ProjectManager from './pages/projectManager/projectManager';
import OffersTreeGrid from './components/offersTreeGrid/offersTreeGrid';
import OfferManager from './pages/offerManager/offerManager';
import CSPTracker from './pages/sptracker/sptracker';
import ChangePasswordPage from './pages/changePassword/changePassword'
import Library from './pages/library/library';
import LibraryFiltersView from './pages/libraryFiltersView/libraryFiltersView';
import PipingGeneral from './pages/pipingGeneral/pipingGeneral';
import PipingPSV from './pages/pipingPSV/pipingPSV';
import PipingSpecial from './pages/pipingSpecial/pipingSpecial';
import PipingExpansionJoins from './pages/pipingExpansionJoins/pipingExpansionJoins';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/"} element={<WelcomeLoginF/>} />
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/changepassword"} element={<ChangePasswordPage/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pitrequests"} element={<PITRequests/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pitrequestsview"} element={<PitRequestView/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/projectsview"} element={<ProjectsView/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/projectManager"} element={<ProjectManager/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/offersManager"} element={<OfferManager/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/sptracker"} element={<CSPTracker/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/library"} element={<Library/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/libraryFiltersView"} element={<LibraryFiltersView/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pipingGeneral"} element={<PipingGeneral/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pipingPSV"} element={<PipingPSV/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pipingSpecial"} element={<PipingSpecial/>}></Route>
            <Route path={"/"+process.env.REACT_APP_PROJECT+"/pipingExpansionJoins"} element={<PipingExpansionJoins/>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
