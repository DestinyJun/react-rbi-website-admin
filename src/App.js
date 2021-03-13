import React, {useState,useEffect} from 'react';
import './App.scss';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {Login} from "./view/login/Login";
import {ErrorPage} from "./view/Error/ErrorPage";
import {Layouts} from "./view/Layouts/Layout";
import {Store} from "./redux/store";
import {Spin} from "antd";

function PrivateRoute({ children, ...rest }) {
  const [isLogin] = useState(Store.getState().isLogin);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLogin ? (
          <Layouts {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default function App (){
  const [loading,setLoading] = useState(false);
  const subscription = Store.subscribe(() => {
    setLoading(Store.getState().isLoading);
  });
  // 组件挂载
  useEffect(() => {
    return function cleanup() {
      // 取消redux订阅
      subscription()
    };
  });
  // 渲染
  return(
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/rbi" />
        </Route>
        <Route exact path="/login" component={Login } />
        <Route exact path="/error" component={ErrorPage} />
        <PrivateRoute path="/rbi" />
      </Switch>
      <div className="loading" hidden={!loading} ><Spin size={"large"}/></div>
    </Router>
  )
}
