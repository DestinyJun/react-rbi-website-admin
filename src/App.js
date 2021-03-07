import React, {Component} from 'react';
import './App.scss';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import {Login} from "./view/login/Login";
import {ErrorPage} from "./view/Error/ErrorPage";
import {Auth} from "./auth/Auth";
import {Layouts} from "./view/Layouts/Layout";
import {Store} from "./redux/store";
import {Spin} from "antd";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: Store.getState().isLoading,
      isLogin: Store.getState().isLogin
    };
    this.subscription = Store.subscribe(() => {
      this.setState({
        loadingShow: Store.getState().isLoading,
        isLogin: Store.getState().isLogin
      },() => {
        console.log(this.state.isLogin);
      })
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
    return(
      <Router>
        <Switch>
          <Route exact path="/">
            {
              this.state.isLogin? <Redirect to="/rbi" /> : <Redirect to="/login" />
              // this.state.isLogin? 'rbi' : 'login'
            }
          </Route>
          <Route exact path="/login" component={Login } />
          <Route exact path="/error" component={ErrorPage} />
          <Route path='/rbi' component={Layouts} />
        </Switch>
        <div className="loading" hidden={!this.state.loadingShow} ><Spin size={"large"}/></div>
      </Router>
    )
  }
}
