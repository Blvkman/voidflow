import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


// import components
import NavigationBar from './components/navbar/Navbar';

// import pages
import Home from './Pages/Home/Home';

// App function
export default function App() {
  return (
    <Router>
        <NavigationBar />

        <Switch>
          <Route path="/contact" exact>
            Contatti
          </Route>
          <Route path="/catalog" exact>
            Catalogo
          </Route>
          <Route path="/" exact>
            <Home/>
          </Route>
        </Switch>
    </Router>
  );
}

