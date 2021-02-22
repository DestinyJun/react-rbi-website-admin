/**
 * desc：  资源管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Source.scss';
import {Button, Col, Form, Image, message, Modal, Row, Select, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {SourceApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";
import {Uploads} from "../../components/Uploads";
const { Option } = Select;

export class Source extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source_list: [],
      source_visible: false,
      source_view_visible: false,
      source_view_url: null,
      source_view_title: null,
      source_id: null,
      source_type_list: [],
    };
    // 初始化第一页
    this.source_pageNo = 1;
    // 文件列表
    this.source_files = [];
    // 表单模型
    this.source_formRef = React.createRef();
    // 文件上传节点
    this.source_uploadRef = React.createRef();
    // 表头信息定义
    this.source_column = [
      {
        title: '资源类型',
        dataIndex: 'type_name',
      },
      {
        title: '类型标识',
        dataIndex: 'type',
      },
      {
        title: '操作',
        render: (item) => {
          return(
            <Space size="middle">
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={this.sourceView.bind(this,item)}>查看</Button>
              <Button type={'primary'} danger onClick={this.sourceDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.source_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }

  // 生命周期
  componentDidMount() {
    this.sourceInit(this.source_pageNo);
    // 初始化文件类型
    post(SourceApi.GET_SOURCE_TYPE, {})
      .then(res => {
        this.setState({
          source_type_list: res.data.map(item => ({...item,key: item.id})),
        })
      })
  }

  // 初始化树结构
  sourceInit(pageNo) {
    post(SourceApi.GET_SOURCE, {pageNo,pageSize: 10})
      .then(res => {
        this.setState({
          source_list: res.data.map(item => ({...item,key: item.id})),
          source_visible: false,
        })
      })
  }

  // 添加
  sourceSave () {
    console.log('进阿里饿了');
    let url,data;
    url = SourceApi.ADD_SOURCE;
    data = this.source_formRef.current.getFieldsValue()
    const formData = new FormData;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (!data[key]){
          continue
        }
        formData.append(key, data[key])
      }
    }
    if (this.source_files.length>0) {
      this.source_files.forEach(item => {
        formData.append('source', item.originFileObj)
      })
      post(url, formData)
        .then(() => {
          this.sourceInit(this.source_pageNo);
        })
        .catch(err => {})
    } else {
      message.error('请选择资源文件！')
    }

  }

  // 删除
  sourceDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(SourceApi.DEL_ID_SOURCE, {id: item.id})
        .then(() => {
          this.sourceInit(this.source_pageNo);
        })
        .catch(err => {})
    }
  }

  // 查看资源
  sourceView(item) {
    this.setState({
      source_view_visible: true,
      source_view_url: item.url,
      source_view_title: item.type_name,
    })
  }

  // render渲染
  render() {
    return (
      <div className={'source'}>
        <h2 className="source-title">资源管理</h2>
        <div className="source-btn">
          <Button type={'primary'} onClick={() => this.setState({source_visible: true})}>栏目添加</Button>
        </div>
        <div className="source-table">
          {
            this.state.source_list.length>0 &&
            <Table
              columns={this.source_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.source_list}
            />
          }
        </div>
        <div className="source-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'栏目操作'} />}
            closable={false}
            visible={this.state.source_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.source_uploadRef.current.handleReset();
              this.source_formRef.current.resetFields();
              this.setState({
                source_visible: false,
              })
            }}
            onOk={() => {
              this.source_formRef.current.submit()
            }}
            cancelText={'取消'}
            onCancel={() => this.setState({source_visible: false})}
          >
            <Form
              className={'form'}
              ref={this.source_formRef}
              name={'form'}
              validateMessages={this.source_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.sourceSave.bind(this)}
            >
              <Form.Item label="请选择文件类型" name="source_type_id" rules={[{required: true}]}>
                <Select notFoundContent={<span>暂无内容</span>}>
                  {
                    this.state.source_type_list.length > 0 &&
                    this.state.source_type_list.map((item,index) => (<Option key={`rule_${index}`} value={item.id}>{item.type_name}</Option>))
                  }
                </Select>
              </Form.Item>
              <Row>
                <Col span={6} style={{textAlign: 'right'}}>
                  <span style={{color: 'red'}}>*</span>
                  <span style={{marginLeft: 5}}>文件上传：</span>
                </Col>
                <Col span={18}>
                  <Uploads ref={this.source_uploadRef} max={1}  onChange={(files) => {
                    this.source_files = [...files];
                  }} />
                </Col>
              </Row>
            </Form>
          </Modal>
          {/*资源查看弹窗*/}
          <Modal
            destroyOnClose={true}
            title={<ModalHeader title={this.state.source_view_title} />}
            width={'30vw'}
            centered
            closable={false}
            visible={this.state.source_view_visible}
            footer={<Button type="primary" ghost danger  onClick={() => this.setState({source_view_visible: false})}>关闭</Button>}
            onCancel={() => this.setState({source_view_visible: false})}
          >
            <div className={'source-tree-box'}>
              {this.state.source_view_url && <Image placeholder={true} height={'auto'} width={'auto'} src={this.state.source_view_url} />}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
