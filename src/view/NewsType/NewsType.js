/**
 * desc：  新闻类型管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './NewsType.scss';
import {Button, Form, Input, Modal, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {NewsTypeApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";

export class NewsType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news_type_list: [],
      news_type_visible: false,
      news_type_loading: false,
      news_type_id: null,
    };
    // 表单模型
    this.news_type_formRef = React.createRef();
    // 表头信息定义
    this.news_type_column = [
      {
        title: '权限标识名称',
        dataIndex: 'news_type',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '操作',
        render: (item) => {
          return(
            <Space size="middle">
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={this.ruleUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.ruleDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.news_type_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }
  componentDidMount() {
    this.ruleInit();
  }
  // 初始化树结构
  ruleInit() {
    post(NewsTypeApi.GET_NEWS_TYPE, {})
      .then(res => {
        this.setState({
          news_type_list: res.data.map(item =>({...item,key: item.id})),
          news_type_visible: false,
        })
      })
  }
  // 添加/修改
  ruleSave () {
    let url,data;
    if (!this.state.news_type_id) {
      url = NewsTypeApi.ADD_NEWS_TYPE;
      data = this.news_type_formRef.current.getFieldsValue()
    } else {
      url = NewsTypeApi.UPDATE_NEWS_TYPE;
      data = this.news_type_formRef.current.getFieldsValue();
      data['id'] = this.state.news_type_id;
    }
    post(url, data)
      .then(() => {
        this.ruleInit();
      })
      .catch(err => {})
  }
  // 删除
  ruleDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(NewsTypeApi.DEL_NEWS_TYPE, {id: item.id})
        .then(() => {
          this.ruleInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  ruleUpdate(item) {
    this.setState({
      news_type_visible: true,
      news_type_id: item.id,
    },() => {
      this.news_type_formRef.current.setFieldsValue({
        news_type: item.news_type,
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'news-type'}>
        <h2 className="news-type-title">新闻类型管理</h2>
        <div className="news-type-btn">
          <Button type={'primary'} onClick={() => this.setState({news_type_visible: true,news_type_id: null})}>新闻类型添加</Button>
        </div>
        <div className="news-type-table">
          {
            this.state.news_type_list.length>0 &&  <Table
              columns={this.news_type_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.news_type_list}
            />
          }
        </div>
        <div className="news-type-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'权限添加'} />}
            closable={false}
            visible={this.state.news_type_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.news_type_formRef.current.resetFields();
              this.setState({
                news_type_visible: false,
              })
            }}
            onOk={() => {
              this.news_type_formRef.current.submit()
            }}
            confirmLoading={this.state.news_type_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({news_type_visible: false})}
          >
            <Form
              ref={this.news_type_formRef}
              name={'form'}
              validateMessages={this.news_type_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.ruleSave.bind(this)}
              initialValues={{
                news_type: null
              }}
            >
              <Form.Item label="新闻类型名称" name="news_type" rules={[{required: true}]}>
                <Input placeholder={'请输新闻类型管理'} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
