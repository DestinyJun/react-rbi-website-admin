/**
 * desc：  新闻管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './News.scss';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {Card, Col, Image, Popover, Row} from "antd";
import {post} from "../../service/Interceptor";
import {NewsApi} from "../../service/Apis";
const { Meta } = Card;

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news_list: []
    };
  }
  componentDidMount() {
    this.newsInit(1,'');
  }
  newsInit(pageNo,name) {
    post(NewsApi.GET_NEWS, {pageSize: '10',pageNo,name})
      .then(res => {
        console.log(res);
        this.setState({
          news_list: res.data.map(item =>({...item,key: item.id})),
        })
      })
  }
  render() {
    return (
      <div className={'news'}>
        <div className="news-title">
          <h2>新闻列表管理</h2>
        </div>
        <div className="new-list">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {
              this.state.news_list.length>0&&this.state.news_list.map((item,index) => (
                <Col key={`news_${index}`} xs={20} sm={16} md={12} lg={8} xl={6} style={{
                  textAligns: 'center',
                  paddingBottom: 10,
                  borderLeft: '1px solid white',
                  borderBottom: '1px solid white',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Card
                  style={{ width: 300,marginRight: 10}}
                  cover={
                    <Image
                      alt="图片加载中"
                      src={item.thumb_img}
                    />
                  }
                  actions={[
                    <Popover content={'预览'}>
                      <EyeOutlined key="预览"/>
                    </Popover>,
                    <Popover content={'编辑'}>
                      <EditOutlined key="编辑"/>,
                    </Popover>,
                    <Popover content={'删除'} >
                      <DeleteOutlined color={'red'} key="删除" style={{color: '#ff4d4f'}} />
                    </Popover>
                  ]}
                >
                  <Meta
                    title={item.article_title}
                    description={<div>
                      <p>{item.article_summary}</p>
                      <p>更新时间：{item.update_time}</p>
                    </div>}
                  />
                </Card>
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}
