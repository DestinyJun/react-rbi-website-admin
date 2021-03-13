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
  CopyrightOutlined,
  BellOutlined,
  PoweroffOutlined, MailOutlined
} from '@ant-design/icons';
import {post} from "../../service/Interceptor";
import {LayoutApi} from "../../service/Apis";
import {Rule} from "../Rule/Rule";
import {Home} from "../Home/Home";
import {Column} from "../Column/Column";
import {RuleAction} from "../RuleAction/RuleAction";
import {NewsType} from "../NewsType/NewsType";
import {FlinkType} from "../FlinkType/FlinkType";
import {SourceType} from "../SourceType/SourceType";
import {News} from "../News/News";
import {Source} from "../Source/Source";
import {Flink} from "../Flink/Flink";
import {Carousel} from "../Carousel/Carousel";
import {reverseTree, transformTree} from "../../service/tools";
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

export class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layMenuList: []
    };
  }

  // 生命周期
  componentDidMount() {
    post(LayoutApi.MENU_LIST, {})
      .then(res => {
        console.log(res);
        const treeCopy = JSON.stringify(res.data);
        const data = transformTree(
          reverseTree(JSON.parse(treeCopy)).map((item) => {
            const strArr = item.rule_router.split('/')
            const str = strArr[strArr.length-1];
            const strToUp = str.charAt(0).toUpperCase() + str.slice(1);
            return {...item, component: strToUp}
          })
        )
        this.setState({
          layMenuList: [...res.data]
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  // 渲染
  render() {
    const path = this.props.path;
    const url = this.props.path;
    const {pathname} = this.props.location;
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
              <Menu.Item icon={<UserOutlined />}>
                <Link to={`${url}`}>系统首页</Link>
              </Menu.Item>
              {
                this.state.layMenuList.length>0 && this.state.layMenuList.map((item,index) => {
                  if ('children' in item) {
                    return (<SubMenu key={`SubMenu_${index}`} icon={<UserOutlined />} title={item.rule_name}>
                      {
                        item.children.map((v,k) => (
                          <Menu.Item key={`child_Menu_${k}`}>
                            <Link key={`Menu_link_${k}`} to={`${url}${v.rule_router}`}>{v.rule_name}</Link>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>)
                  }
                  return (<Menu.Item key={`Menu_${index}`} icon={<MailOutlined />}>
                    <Link key={`Menu_link_${index}`} to={`${url}${item.rule_router}`}>{item.rule_name}</Link>
                  </Menu.Item>)
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
               {/* {
                  this.state.layMenuList.length>0 && this.state.layMenuList.map((item,index) => {
                    if ('children' in item) {
                      return (<>
                        {
                          item.children.map((v,k) => (
                          <Route exact key={`child_Menu_${k}`} path={`${path}/dataConfig/${v.rule_router}`} component={v.component} />
                          ))
                        }
                      </>)
                    }
                    return (<Route exact key={`Menu_${index}`}  path={`${path}/${item.rule_router}`} component={item.component} />)
                  })
                }*/}
                <Route exact path={`${path}/rule`} component={Rule} />
                <Route exact path={`${path}/column`} component={Column} />
                <Route exact path={`${path}/dataConfig/ruleAction`} component={RuleAction} />
                <Route exact path={`${path}/dataConfig/newsType`} component={NewsType} />
                <Route exact path={`${path}/dataConfig/flinkType`} component={FlinkType} />
                <Route exact path={`${path}/dataConfig/sourceType`} component={SourceType} />
                <Route exact path={`${path}/news`} component={News} />
                <Route exact path={`${path}/source`} component={Source} />
                <Route exact path={`${path}/flink`} component={Flink} />
                <Route exact path={`${path}/carousel`} component={Carousel} />
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
}
