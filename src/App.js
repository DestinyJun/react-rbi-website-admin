import React,{ useEffect, useState } from 'react';
import './App.scss';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import {Login} from "./view/login/Login";
import {ErrorPage} from "./view/Error/ErrorPage";
// import {Auth} from "./auth/Auth";
import {Layouts} from "./view/Layouts/Layout";
import {LoadingStore} from "./redux/store";
import {Spin} from "antd";

function App() {
  const [loadingShow, setLoadingShow] = useState(false)
  useEffect(() => {
    const subscription = LoadingStore.subscribe(() => {
      setLoadingShow(LoadingStore.getState().isLoading)
    });
    return () => {
      subscription();
    }
  })
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/rbi" />
        </Route>
        <Route exact path="/login" component={Login } />
        <Route exact path="/error" component={ErrorPage} />
        <Route path='/rbi' component={Layouts} />
      </Switch>
      <div className="loading" hidden={!loadingShow} ><Spin size={"large"}/></div>
    </Router>
  );
}


export default App;
