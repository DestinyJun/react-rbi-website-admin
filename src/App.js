import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Login} from "./view/login/Login";
import {ErrorPage} from "./view/Error/ErrorPage";
import {Auth} from "./auth/Auth";
import {Layouts} from "./view/Layouts/Layout";


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/error">
          <ErrorPage />
        </Route>
        <Auth path="/">
          <Route exact path='/' component={Layouts} />
        </Auth>
      </Switch>
    </Router>
  );
}


export default App;
