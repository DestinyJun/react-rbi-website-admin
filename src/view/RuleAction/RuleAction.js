/**
 * desc：  权限标识管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './RuleAction.scss';
import {Button, Form, Input, Modal, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {RuleActionApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";

export class RuleAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule_action_list: [],
      rule_action_visible: false,
      rule_action_loading: false,
      rule_action_action_id: null,
    };
    // 表单模型
    this.rule_action_formRef = React.createRef();
    // 表头信息定义
    this.rule_action_column = [
      {
        title: '权限标识名称',
        dataIndex: 'action_name',
      },
      {
        title: '权限标识编码',
        dataIndex: 'action_code',
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
    this.rule_action_validateMessages = {
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
    post(RuleActionApi.GET_RULE_ACTION, {})
      .then(res => {
        this.setState({
          rule_action_list: res.data.map(item =>({...item,key: item.id})),
          rule_action_visible: false,
        })
      })
  }
  // 添加/修改
  ruleSave () {
    let url,data;
    if (!this.state.rule_action_action_id) {
      url = RuleActionApi.ADD_RULE_ACTION;
      data = this.rule_action_formRef.current.getFieldsValue()
    } else {
      url = RuleActionApi.UPDATE_RULE_ACTION;
      data = this.rule_action_formRef.current.getFieldsValue();
      data['id'] = this.state.rule_action_action_id;
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
      post(RuleActionApi.DEL_RULE_ACTION, {id: item.id})
        .then(() => {
          this.ruleInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  ruleUpdate(item) {
    this.setState({
      rule_action_visible: true,
      rule_action_action_id: item.id,
    },() => {
      this.rule_action_formRef.current.setFieldsValue({
        action_name: item.action_name,
        action_code: item.action_code
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'ruleAction'}>
        <h2 className="rule-action-title">权限标识管理</h2>
        <div className="rule-action-btn">
          <Button type={'primary'} onClick={() => this.setState({rule_action_visible: true,rule_action_id: null})}>权限标识添加</Button>
        </div>
        <div className="rule-action-table">
          {
            this.state.rule_action_list.length>0 &&  <Table
              columns={this.rule_action_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.rule_action_list}
            />
          }
        </div>
        <div className="rule-action-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'权限添加'} />}
            closable={false}
            visible={this.state.rule_action_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.rule_action_formRef.current.resetFields();
              this.setState({
                rule_action_visible: false,
                rule_action_tree_name: '点击选择父级权限',
              })
            }}
            onOk={() => {
              this.rule_action_formRef.current.submit()
            }}
            confirmLoading={this.state.rule_action_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({rule_action_visible: false})}
          >
            <Form
              ref={this.rule_action_formRef}
              name={'form'}
              validateMessages={this.rule_action_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.ruleSave.bind(this)}
              initialValues={{
                action_name: null,
                action_code: null,
              }}
            >
              <Form.Item label="权限标识名称" name="action_name" rules={[{required: true}]}>
                <Input placeholder={'请输权限标识名称'} />
              </Form.Item>
              <Form.Item label="权限标识编码" name="action_code" rules={[{required: true}]}>
                <Input placeholder={'请输权限标识编码'} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
