/**
 * desc：  资源类型管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './SourceType.scss';
import {Button, Form, Input, Modal, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {SourceTypeApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";

export class SourceType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source_type_list: [],
      source_type_visible: false,
      source_type_loading: false,
      source_type_id: null,
    };
    // 表单模型
    this.source_type_formRef = React.createRef();
    // 表头信息定义
    this.source_type_column = [
      {
        title: '资源类型名称',
        dataIndex: 'type_name',
      },
      {
        title: '资源类型编码',
        dataIndex: 'type_code',
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
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={this.sourceTypeUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.sourceTypeDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.source_type_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }
  componentDidMount() {
    this.sourceTypeInit();
  }
  // 初始化树结构
  sourceTypeInit() {
    post(SourceTypeApi.GET_SOURCE_TYPE, {})
      .then(res => {
        this.setState({
          source_type_list: res.data.map(item =>({...item,key: item.id})),
          source_type_visible: false,
        })
      })
  }
  // 添加/修改
  sourceTypeSave () {
    let url,data;
    if (!this.state.source_type_id) {
      url = SourceTypeApi.ADD_SOURCE_TYPE;
      data = this.source_type_formRef.current.getFieldsValue()
    } else {
      url = SourceTypeApi.UPDATE_SOURCE_TYPE;
      data = this.source_type_formRef.current.getFieldsValue();
      data['id'] = this.state.source_type_id;
    }
    post(url, data)
      .then(() => {
        this.sourceTypeInit();
      })
      .catch(err => {})
  }
  // 删除
  sourceTypeDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(SourceTypeApi.DEL_SOURCE_TYPE, {id: item.id})
        .then(() => {
          this.sourceTypeInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  sourceTypeUpdate(item) {
    this.setState({
      source_type_visible: true,
      source_type_id: item.id,
    },() => {
      this.source_type_formRef.current.setFieldsValue({
        type_name: item.type_name,
        type_code: item.type_code,
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'source-type'}>
        <h2 className="source-type-title">资源类型管理</h2>
        <div className="source-type-btn">
          <Button type={'primary'} onClick={() => this.setState({source_type_visible: true,source_type_id: null})}>资源类型添加</Button>
        </div>
        <div className="source-type-table">
          {
            this.state.source_type_list.length>0 &&  <Table
              columns={this.source_type_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.source_type_list}
            />
          }
        </div>
        <div className="source-type-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'资源类型添加'} />}
            closable={false}
            visible={this.state.source_type_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.source_type_formRef.current.resetFields();
              this.setState({
                source_type_visible: false,
              })
            }}
            onOk={() => {
              this.source_type_formRef.current.submit()
            }}
            confirmLoading={this.state.source_type_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({source_type_visible: false})}
          >
            <Form
              ref={this.source_type_formRef}
              name={'form'}
              validateMessages={this.source_type_validateMessages}
              labelCol={{span: 7}}
              wrapperCol={{span: 16}}
              onFinish={this.sourceTypeSave.bind(this)}
              initialValues={{
                type_name: null,
                type_code: null,
              }}
            >
              <Form.Item label="资源类型名称" name="type_name" rules={[{required: true}]}>
                <Input placeholder={'请输资源类型'} />
              </Form.Item>
              <Form.Item label="资源类型编码" name="type_code" rules={[{required: true}]}>
                <Input placeholder={'请输资源类型编码'} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
