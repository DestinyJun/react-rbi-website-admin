/**
 * desc：  首页
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Home.scss';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home">
        <span>欢迎您登录!</span>
      </div>
    );
  }
}
