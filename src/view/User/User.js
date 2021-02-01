/**
 * desc：  用户管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './User.scss';

export class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={'user'}>
        <p>User</p>
      </div>
    );
  }
}
