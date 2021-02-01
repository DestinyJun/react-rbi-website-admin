/**
 * desc：  单页面入口
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import { Route, Switch, Link} from "react-router-dom";
import './Layouts.scss';
import {Layout, Menu, Breadcrumb, Avatar, Badge} from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  CopyrightOutlined,
  BellOutlined,
  PoweroffOutlined, MailOutlined
} from '@ant-design/icons';
import {post} from "../../service/Interceptor";
import {LayoutApi} from "../../service/Apis";
import {Rule} from "../Rule/Rule";
import {Home} from "../Home/Home";
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

export class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layMenuList: []
    };
    console.log(this.props);
  }
  render() {
    const {path, url} = this.props.match;
    const {pathname} = this.props.location;
    console.log(path,url);
    console.log(pathname);
    return (
      <Layout>
        <Header className="header">
          <div className="logo" >
            <h2>RBIS</h2>
          </div>
          <div className="info">
            <Badge count={1} dot>
              <BellOutlined style={{fontSize: '24px', color: 'white'}} />
            </Badge>
            <Avatar size="large" src={"/images/秀智1.jpg"} />
            <PoweroffOutlined title={'退出'} style={{fontSize: '24px', color: '#FF4D4F'}} />
          </div>
        </Header>
        <Layout className={"center"}>
          <Sider breakpoint="lg" className="sidebar-left">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              {
                this.state.layMenuList.length>0 && this.state.layMenuList.map((item,index) => {
                  if ('children' in item) {
                    return (<>
                      <SubMenu key={`SubMenu_${index}`} icon={<UserOutlined />} title={item.rule_name}>
                        {
                          item.children.map((v,k) => (
                            <Menu.Item key={`child_Menu_${k}`}>
                              <Link key={`Menu_link_${k}`} to={`${url}${v.rule_router}`}>{v.rule_name}</Link>
                            </Menu.Item>
                          ))
                        }
                      </SubMenu>
                    </>)
                  }
                  return (<>
                    <Menu.Item key={`Menu_${index}`} icon={<MailOutlined />}>
                      <Link key={`Menu_link_${index}`} to={`${url}${item.rule_router}`}>{item.rule_name}</Link>
                    </Menu.Item>
                  </>)
                })
              }
            </Menu>
          </Sider>
          <Layout className={'content'}>
            <Breadcrumb className={'content-bread'}>
              <Breadcrumb.Item>红鸟智能</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="content-body">
              <Switch>
                <Route exact path={path} component={Home} />
                <Route exact path={`${path}/rule`} component={Rule} />
                <Route exact path={`${path}/components`}>
                  <h3>components</h3>
                </Route>
                <Route exact path={`${path}/item`}>
                  <h3>item</h3>
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer className={"footer"}>
          <h3>Copyright<CopyrightOutlined />贵阳红鸟</h3>
        </Footer>
      </Layout>
    );
  }
  componentDidMount() {
    post(LayoutApi.MENU_LIST, {})
      .then(res => {
        this.setState({
          layMenuList: [...res.data]
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
}
