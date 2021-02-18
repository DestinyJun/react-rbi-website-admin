/**
 * desc：  友情链接类型管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './FlinkType.scss';
import {Button, Form, Input, Modal, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {FlinkTypeApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";

export class FlinkType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flink_type_list: [],
      flink_type_visible: false,
      flink_type_loading: false,
      flink_type_id: null,
    };
    // 表单模型
    this.flink_type_formRef = React.createRef();
    // 表头信息定义
    this.flink_type_column = [
      {
        title: '友情链接类型名称',
        dataIndex: 'type_name',
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
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={this.flinkTypeUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.flinkTypeDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.flink_type_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }
  componentDidMount() {
    this.flinkTypeInit();
  }
  // 初始化树结构
  flinkTypeInit() {
    post(FlinkTypeApi.GET_FLINK_TYPE, {})
      .then(res => {
        this.setState({
          flink_type_list: res.data.map(item =>({...item,key: item.id})),
          flink_type_visible: false,
        })
      })
  }
  // 添加/修改
  flinkTypeSave () {
    let url,data;
    if (!this.state.flink_type_id) {
      url = FlinkTypeApi.ADD_FLINK_TYPE;
      data = this.flink_type_formRef.current.getFieldsValue()
    } else {
      url = FlinkTypeApi.UPDATE_FLINK_TYPE;
      data = this.flink_type_formRef.current.getFieldsValue();
      data['id'] = this.state.flink_type_id;
    }
    post(url, data)
      .then(() => {
        this.flinkTypeInit();
      })
      .catch(err => {})
  }
  // 删除
  flinkTypeDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(FlinkTypeApi.DEL_FLINK_TYPE, {id: item.id})
        .then(() => {
          this.flinkTypeInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  flinkTypeUpdate(item) {
    this.setState({
      flink_type_visible: true,
      flink_type_id: item.id,
    },() => {
      this.flink_type_formRef.current.setFieldsValue({
        type_name: item.type_name,
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'flink-type'}>
        <h2 className="flink-type-title">友情链接类型管理</h2>
        <div className="flink-type-btn">
          <Button type={'primary'} onClick={() => this.setState({flink_type_visible: true,flink_type_id: null})}>友情链接类型添加</Button>
        </div>
        <div className="flink-type-table">
          {
            this.state.flink_type_list.length>0 &&  <Table
              columns={this.flink_type_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.flink_type_list}
            />
          }
        </div>
        <div className="flink-type-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'友情链接类型添加'} />}
            closable={false}
            visible={this.state.flink_type_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.flink_type_formRef.current.resetFields();
              this.setState({
                flink_type_visible: false,
              })
            }}
            onOk={() => {
              this.flink_type_formRef.current.submit()
            }}
            confirmLoading={this.state.flink_type_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({flink_type_visible: false})}
          >
            <Form
              ref={this.flink_type_formRef}
              name={'form'}
              validateMessages={this.flink_type_validateMessages}
              labelCol={{span: 7}}
              wrapperCol={{span: 16}}
              onFinish={this.flinkTypeSave.bind(this)}
              initialValues={{
                flink_type: null
              }}
            >
              <Form.Item label="友情链接类型名称" name="type_name" rules={[{required: true}]}>
                <Input placeholder={'请输友情链接类型'} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
