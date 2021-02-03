/**
 * desc：  栏目管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Column.scss';
import {Button, Form, Input, InputNumber, Modal, Radio, Select, Space, Table, Tree} from "antd";
import {post} from "../../service/Interceptor";
import {ColumnApi, RuleApi} from "../../service/Apis";
import {reverseTree, transformTree} from "../../service/tools";
import {ModalHeader} from "../../components/ModalHeader";
const { Option } = Select;

export class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column_list: [],
      column_action_list: [],
      column_visible: false,
      column_loading: false,
      column_tree_visible: false,
      column_tree_name: '点击选择父级权限',
      column_id: null,
    };
    // 表单模型
    this.column_formRef = React.createRef();
    // 表头信息定义
    this.column_column = [
      {
        title: '栏目名称',
        dataIndex: 'column_name',
      },
      {
        title: '是否有图片',
        dataIndex: 'has_img',
      },
      {
        title: '栏目顺序（越小越靠前）',
        dataIndex: 'column_sort',
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
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={this.columnUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.columnDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.column_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }
  componentDidMount() {
    this.columnInit();
  }
  // 初始化树结构
  columnInit() {
    post(ColumnApi.GET_COLUMN_TREE, {})
      .then(res => {
        this.setState({
          column_list: transformTree(reverseTree(res.data).map(item => ({...item,key: item.id}))),
          column_visible: false,
        })
      })
  }
  // 权限添加/修改
  columnSave () {
    let url,data;
    if (!this.state.column_id) {
      url = RuleApi.ADD_RULE;
      data = this.column_formRef.current.getFieldsValue()
    } else {
      url = RuleApi.UPDATE_RULE;
      data = this.column_formRef.current.getFieldsValue();
      data['id'] = this.state.column_id;
    }
    post(url, data)
      .then(() => {
        this.columnInit();
      })
      .catch(err => {})
  }
  // 权限删除
  columnDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(RuleApi.DEL_RULE, {id: item.id})
        .then(() => {
          this.columnInit();
        })
        .catch(err => {})
    }
  }
  // 权限修改
  columnUpdate(item) {
    this.setState({
      column_visible: true,
      column_id: item.id,
      column_tree_name: item.parent_name?item.parent_name:'已是顶层结构'
    },() => {
      this.column_formRef.current.setFieldsValue({
        parent_id: item.parent_id,
        column_name: item.column_name,
        action_id: item.action_id,
        column_router: item.column_router,
        is_show: item.is_show,
      })
    })
  }
  // render渲染
  render() {
    return (
      <div className={'column'}>
        <h2 className="column-title">栏目管理</h2>
        <div className="column-btn">
          <Button type={'primary'} onClick={() => this.setState({column_visible: true,column_id: null})}>栏目添加</Button>
        </div>
        <div className="column-table">
          {
            this.state.column_list.length>0 &&  <Table
              columns={this.column_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.column_list}
            />
          }
        </div>
        <div className="column-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'权限添加'} />}
            closable={false}
            visible={this.state.column_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.column_formRef.current.resetFields();
              this.setState({
                column_visible: false,
                column_tree_name: '点击选择父级权限',
              })
            }}
            onOk={() => {
              this.column_formRef.current.submit()
            }}
            confirmLoading={this.state.column_loading}
            cancelText={'取消'}
            onCancel={() => this.setState({column_visible: false})}
          >
            <Form
              ref={this.column_formRef}
              name={'form'}
              validateMessages={this.column_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.columnSave.bind(this)}
              initialValues={{
                parent_id: null,
                column_name: null,
                action_id: 1,
                column_router: null,
                is_show: '1',
              }}
            >
              <Form.Item label="父级权限" >
                <Button type="primary" onClick={() => {
                  this.setState({column_tree_visible: true},() => this.column_formRef.current.resetFields());
                }}
                        style={{borderColor: '#D9D9D9',textAlign: 'left',color: '#262626',padding: '4px 10px'}} ghost block>
                  {
                    this.state.column_tree_name === '点击选择父级权限' || this.state.column_tree_name === '已是顶层结构'?
                      <span style={{color: '#BFBFBF'}}>{this.state.column_tree_name}</span>:
                      this.state.column_tree_name
                  }
                </Button>
                <Form.Item name="parent_id" noStyle >
                  <InputNumber placeholder={'请选择父级权限'} style={{display: 'none'}} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="权限名称" name="column_name" rules={[{required: true}]}>
                <Input placeholder={'请输权限名称'} />
              </Form.Item>
              <Form.Item label="权限标识" name="action_id" rules={[{required: true}]}>
                <Select notFoundContent={<span>暂无内容</span>}>
                  {
                    this.state.column_action_list.length > 0 &&
                    this.state.column_action_list.map((item,index) => (<Option key={`column_${index}`} value={item.id}>{item.action_name}</Option>))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="权限路由标识" name="column_router" rules={[{required: true}]}>
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
            visible={this.state.column_tree_visible}
            footer={<Button type="primary" ghost danger  onClick={() => this.setState({column_tree_visible: false})}>关闭</Button>}
            onCancel={() => this.setState({column_tree_visible: false})}
          >
            <div className={'column-tree-box'}>
              <Tree
                showLine={true}
                onSelect={(key,info) => {
                  this.setState({
                    column_tree_visible: false,
                    column_tree_name: info.selectedNodes[0].column_name
                  })
                  this.column_formRef.current.setFieldsValue({parent_id: info.selectedNodes[0].id})
                }}
                titleRender={(nodeData) => {
                  return (<span>{nodeData.column_name}</span>)
                }}
                treeData={this.state.column_list}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
