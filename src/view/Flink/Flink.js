/**
 * desc：  友情链接管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Flink.scss';
import {FlinkApi} from "../../service/Apis";
import {Button, Col, Form, Image, Input, InputNumber, Modal, Row, Select, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {ModalHeader} from "../../components/ModalHeader";
import {Uploads} from "../../components/Uploads";
import {EyeOutlined} from "@ant-design/icons";
const { Option } = Select;

export class Flink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flink_list: [],
      flink_visible: false,
      flink_id: null,
      flink_type_list: [],
      flink_default_img: [],
    };
    // 初始化第一页
    this.flink_pageNo = 1;
    // 文件列表
    this.flink_files = [];
    // 表单模型
    this.flink_formRef = React.createRef();
    // 文件上传节点
    this.flink_uploadRef = React.createRef();
    // 表头信息定义
    this.flink_column = [
      {
        title: '链接名称',
        dataIndex: 'web_name',
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
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={() => {window.open(item.web_url)}}>打开链接</Button>
              <Button type={'primary'} style={{background: '#44A8EF',borderColor: '#44A8EF'}} onClick={this.flinkUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.flinkDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.flink_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }

  // 生命周期
  componentDidMount() {
    this.flinkInit(this.flink_pageNo);
    // 初始化友情链接类型
    post(FlinkApi.GET_FLINK_TYPE, {})
      .then(res => {
        this.setState({
          flink_type_list: res.data.map(item => ({...item,key: item.id})),
        })
      })
  }

  // 初始化树结构
  flinkInit(pageNo) {
    post(FlinkApi.GET_FLINK, {pageNo,pageSize: 10})
      .then(res => {
        this.setState({
          flink_list: res.data.map(item => ({...item,key: item.id})),
          flink_visible: false,
        })
      })
  }

  // 添加/编辑保存
  flinkSave () {
    let url,data;
    data = this.flink_formRef.current.getFieldsValue()
    if (!this.state.flink_id) {
      url = FlinkApi.ADD_FLINK;
    } else {
      url = FlinkApi.UPDATE_FLINK;
      data['id'] = this.state.flink_id;
    }
    const formData = new FormData;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (!data[key]){
          continue
        }
        formData.append(key, data[key])
      }
    }
    if (this.flink_files.length>0) {
      this.flink_files.forEach(item => {
        formData.append('web_logo[]', item.originFileObj)
      })
    }
    post(url, formData)
      .then(() => {
        this.flinkInit(this.flink_pageNo);
      })
      .catch(err => {})

  }

  // 删除
  flinkDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(FlinkApi.DEL_FLINK, {id: item.id})
        .then(() => {
          this.flinkInit(this.flink_pageNo);
        })
        .catch(err => {})
    }
  }

  // 编辑初始化
  flinkUpdate (item) {
    this.setState({
      flink_visible: true,
      flink_id: item.id,
      flink_default_img: [item.web_logo]
    },() => {
      this.flink_formRef.current.setFieldsValue({
        web_name: item.web_name,
        web_type_id: item.web_type_id,
        web_url: item.web_url,
        web_sort: item.web_sort,
      })
    })
  }

  // render渲染
  render() {
    return (
      <div className={'flink'}>
        <h2 className="flink-title">友情链接管理</h2>
        <div className="flink-btn">
          <Button type={'primary'} onClick={() => this.setState({flink_visible: true})}>友情链接添加</Button>
        </div>
        <div className="flink-table">
          {
            this.state.flink_list.length>0 &&
            <Table
              columns={this.flink_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.flink_list}
            />
          }
        </div>
        <div className="flink-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'友情链接操作'} />}
            closable={false}
            visible={this.state.flink_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.flink_uploadRef.current.handleReset();
              this.flink_formRef.current.resetFields();
              this.setState({
                flink_visible: false,
                flink_default_img: [],
              })
            }}
            onOk={() => {
              this.flink_formRef.current.submit()
            }}
            cancelText={'取消'}
            onCancel={() => this.setState({flink_visible: false})}
          >
            <Form
              className={'form'}
              ref={this.flink_formRef}
              name={'form'}
              validateMessages={this.flink_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.flinkSave.bind(this)}
            >
              <Form.Item label="友情链接名称" name="web_name" rules={[{required: true}]}>
                <Input placeholder={'请输友情链接名称'} />
              </Form.Item>
              <Form.Item label="友情链接网址" name="web_url" rules={[{required: true}]}>
                <Input placeholder={'请输友情链接网址'} />
              </Form.Item>
              <Form.Item label="请选择链接类型" name="web_type_id" rules={[{required: true}]}>
                <Select notFoundContent={<span>暂无内容</span>}>
                  {
                    this.state.flink_type_list.length > 0 &&
                    this.state.flink_type_list.map((item,index) => (<Option key={`flink_${index}`} value={item.id}>{item.type_name}</Option>))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="友情链接排序" name="web_sort">
                <InputNumber placeholder={'友情链接排序(越小越靠前）'} style={{width: '100%'}} rules={[{types: 'number'}]} />
              </Form.Item>
              <Row>
                <Col span={6} style={{textAlign: 'right'}}>
                  <span style={{color: 'red'}}>*</span>
                  <span style={{marginLeft: 5}}>LOGO上传：</span>
                </Col>
                <Col span={18}>
                  <Uploads ref={this.flink_uploadRef} max={1}  onChange={(files) => {
                    this.flink_files = [...files];
                  }} />
                </Col>
              </Row>
              <Form.Item label="当前图片" hidden={!this.state.flink_default_img.length>0}>
                {
                  this.state.flink_default_img.map((item,index) =>(<
                    Image key={`column_image_${index}`} style={{paddingRight: '5px'}} preview={{mask: <EyeOutlined />}} src={item} width={120} />))
                }
                <p style={{color: "#FF4D4F"}}>注意：一但上传新图片，原有的图片将会被删除</p>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
