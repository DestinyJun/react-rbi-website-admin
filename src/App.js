import React, {Component, useEffect, useState} from 'react';
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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: LoadingStore.getState().isLoading,
    };
    this.subscription = LoadingStore.subscribe(() => {
      this.setState({loadingShow: LoadingStore.getState().isLoading})
    });
  }
  // 生命周期
  componentDidMount() {}

  // 组件挂载
  componentWillUnmount() {
    // 取消redux订阅
    this.subscription()
  }

  // 渲染
  render() {
    return <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/rbi" />
        </Route>
        <Route exact path="/login" component={Login } />
        <Route exact path="/error" component={ErrorPage} />
        <Route path='/rbi' component={Layouts} />
      </Switch>
      <div className="loading" hidden={!this.state.loadingShow} ><Spin size={"large"}/></div>
    </Router>
  }
}
