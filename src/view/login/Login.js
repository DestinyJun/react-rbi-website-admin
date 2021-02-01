/**
 * desc：  登录
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Login.scss';
import { Form, Input, Button } from 'antd';
import {post} from "../../service/Interceptor";
import {setObject} from "../../service/sessionStorage";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onFinish = (values) => {
    post('/login',values)
      .then(res => {
        setObject('token',res.token)
        this.props.history.push('/')
      })
      .catch(err => {
        console.log(err);
      })
  };
  onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  render() {
    return (
      <div className={'login'}>
        <div className="login-box">
          <div className={'logo'}>
            <h3 style={{fontWeight: 'bolder'}}>贵阳红鸟智能技术服务有限公司</h3>
          </div>
          <Form
            name="basic"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item label="用户名" name="username" rules={
              [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]
            }>
              <Input />
            </Form.Item>

            <Form.Item label="密码" name="password" rules={
              [
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]
            }>
              <Input.Password />
            </Form.Item>

            <Form.Item style={{textAlign:'center'}} wrapperCol={{span: 24}}>
              <Button type="primary" htmlType="submit">登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
