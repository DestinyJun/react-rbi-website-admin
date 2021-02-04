/**
 * desc：  权限管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Rule.scss';
import {Button, Table, Space, Modal, Form, Input, InputNumber, Radio, Select, Tree} from "antd";
import {post} from "../../service/Interceptor";
import {RuleApi} from "../../service/Apis";
import {reverseTree, transformTree} from "../../service/tools";
import {ModalHeader} from "../../components/ModalHeader";
import axios from "axios";
const { Option } = Select;

export class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule_list: [],
      rule_action_list: [],
      rule_visible: false,
      rule_loading: false,
      rule_tree_visible: false,
      rule_tree_name: '点击选择父级权限',
      rule_id: null,
    };
    // 表单模型
    this.rule_formRef = React.createRef();
    // 表头信息定义
    this.rule_column = [
      {
        title: '权限名称',
        dataIndex: 'rule_name',
      },
      {
        title: '权限标识名称',
        dataIndex: 'action_name',
      },
      {
        title: '权限标识编码',
        dataIndex: 'action_code',
        key: 'action_code',
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
    this.rule_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }
  componentDidMount() {
    axios.all([
      post(RuleApi.GET_RULE_TREE, {}),
      post(RuleApi.GET_RULE_ACTION, {}),
    ])
      .then(res => {
        this.setState({
          rule_list: transformTree(reverseTree(res[0].data).map(item => ({...item,key: item.id}))),
          rule_action_list: [...res[1].data],
        }, () => {
          // console.log(reverseTree[this.state.rule_list]);
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  // 初始化树结构
  ruleInit() {
    post(RuleApi.GET_RULE_TREE, {})
      .then(res => {
        this.setState({
          rule_list: transformTree(reverseTree(res.data).map(item => ({...item,key: item.id}))),
          rule_visible: false,
        })
      })
  }
  // 添加/修改
  ruleSave () {
    let url,data;
    if (!this.state.rule_id) {
      url = RuleApi.ADD_RULE;
      data = this.rule_formRef.current.getFieldsValue()
    } else {
      url = RuleApi.UPDATE_RULE;
      data = this.rule_formRef.current.getFieldsValue();
      data['id'] = this.state.rule_id;
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
      post(RuleApi.DEL_RULE, {id: item.id})
        .then(() => {
          this.ruleInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  ruleUpdate(item) {
    this.setState({
      rule_visible: true,
      rule_id: item.id,
      rule_tree_name: item.parent_name?item.parent_name:'已是顶层结构'
    },() => {
      this.rule_formRef.current.setFieldsValue({
        parent_id: item.parent_id,
        rule_name: item.rule_name,
        action_id: item.action_id,
        rule_router: item.rule_router,
        is_show: item.is_show,
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'rule'}>
        <h2 className="rule-title">权限管理</h2>
        <div className="rule-btn">
          <Button type={'primary'} onClick={() => this.setState({rule_visible: true,rule_id: null})}>权限添加</Button>
        </div>
        <div className="rule-table">
          {
            this.state.rule_list.length>0 &&  <Table
              columns={this.rule_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.rule_list}
            />
          }
        </div>
        <div className="rule-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'权限添加'} />}
            closable={false}
            visible={this.state.rule_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.rule_formRef.current.resetFields();
              this.setState({
                rule_visible: false,
                rule_tree_name: '点击选择父级权限',
              })
            }}
            onOk={() => {
              this.rule_formRef.current.submit()
            }}
            confirmLoading={this.state.rule_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({rule_visible: false})}
          >
            <Form
              ref={this.rule_formRef}
              name={'form'}
              validateMessages={this.rule_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.ruleSave.bind(this)}
              initialValues={{
                parent_id: null,
                rule_name: null,
                action_id: 1,
                rule_router: null,
                is_show: '1',
              }}
            >
              <Form.Item label="父级权限" >
                <Button type="primary" onClick={() => {
                  this.setState({rule_tree_visible: true},() => this.rule_formRef.current.resetFields());
                }}
                  style={{borderColor: '#D9D9D9',textAlign: 'left',color: '#262626',padding: '4px 10px'}} ghost block>
                  {
                    this.state.rule_tree_name === '点击选择父级权限' || this.state.rule_tree_name === '已是顶层结构'?
                    <span style={{color: '#BFBFBF'}}>{this.state.rule_tree_name}</span>:
                    this.state.rule_tree_name
                  }
                </Button>
                <Form.Item name="parent_id" noStyle >
                  <InputNumber placeholder={'请选择父级权限'} style={{display: 'none'}} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="权限名称" name="rule_name" rules={[{required: true}]}>
                <Input placeholder={'请输权限名称'} />
              </Form.Item>
              <Form.Item label="权限标识" name="action_id" rules={[{required: true}]}>
                <Select notFoundContent={<span>暂无内容</span>}>
                  {
                    this.state.rule_action_list.length > 0 &&
                    this.state.rule_action_list.map((item,index) => (<Option key={`rule_${index}`} value={item.id}>{item.action_name}</Option>))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="权限路由标识" name="rule_router" rules={[{required: true}]}>
                <Input placeholder={'请输权限路由标识'} />
              </Form.Item>
              <Form.Item label="是否显示" name="is_show">
                <Radio.Group>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
          {/*权限树弹窗*/}
          <Modal
            title={<ModalHeader title={'父级权限选择'} />}
            width={'30vw'}
            centered
            closable={false}
            visible={this.state.rule_tree_visible}
            footer={<Button type="primary" ghost danger  onClick={() => this.setState({rule_tree_visible: false})}>关闭</Button>}
            onCancel={() => this.setState({rule_tree_visible: false})}
          >
            <div className={'rule-tree-box'}>
              <Tree
                showLine={true}
                onSelect={(key,info) => {
                  this.setState({
                    rule_tree_visible: false,
                    rule_tree_name: info.selectedNodes[0].rule_name
                  })
                  this.rule_formRef.current.setFieldsValue({parent_id: info.selectedNodes[0].id})
                }}
                titleRender={(nodeData) => {
                  return (<span>{nodeData.rule_name}</span>)
                }}
                treeData={this.state.rule_list}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
