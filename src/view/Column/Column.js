/**
 * desc：  栏目管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Column.scss';
import {Button, Form, Image, Input, InputNumber, Modal, Radio, Space, Table, Tree} from "antd";
import {post} from "../../service/Interceptor";
import {ColumnApi} from "../../service/Apis";
import {reverseTree, transformTree} from "../../service/tools";
import {ModalHeader} from "../../components/ModalHeader";
import {Uploads} from "../../components/Uploads";
import {EyeOutlined} from '@ant-design/icons';

export class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column_list: [],
      column_action_list: [],
      column_visible: false,
      column_loading: false,
      column_tree_visible: false,
      column_tree_name: '点击选择父级栏目',
      column_id: null,
      column_has_img: false,
      column_default_img: [],
    };
    // 文件列表
    this.column_files = [];
    // 表单模型
    this.column_formRef = React.createRef();
    // 文件上传节点
    this.column_uploadRef = React.createRef();
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
        title: '栏目顺序',
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
  // 添加/修改
  columnSave () {
    let url,data;
    if (!this.state.column_id) {
      url = ColumnApi.ADD_COLUMN;
      data = this.column_formRef.current.getFieldsValue()
    } else {
      url = ColumnApi.UPDATE_COLUMN;
      data = this.column_formRef.current.getFieldsValue();
      data['id'] = this.state.column_id;
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
    if (this.column_files.length>0) {
      this.column_files.forEach(item => {
        formData.append('column_img[]', item.originFileObj)
      })
    }
    post(url, formData)
      .then(() => {
        this.columnInit();
      })
      .catch(err => {})
  }
  // 删除
  columnDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(ColumnApi.DEL_COLUMN, {id: item.id})
        .then(() => {
          this.columnInit();
        })
        .catch(err => {})
    }
  }
  // 修改
  columnUpdate(item) {
    const arr = [];
    item.column_img.split(',').forEach((val,inx) => {
      arr.push({
        uid: `-${inx}`,
        name: `原有图片-${inx}.png`,
        status: 'done',
        url: val,
      })
    })
    this.setState({
      column_visible: true,
      column_id: item.id,
      column_tree_name: item.parent_name?item.parent_name:'已是顶层栏目',
      column_has_img: item.has_img === '1',
      column_default_img: [...arr]
    },() => {
      this.column_formRef.current.setFieldsValue({
        parent_id: item.parent_id,
        column_name: item.column_name,
        column_sort: item.column_sort,
        has_img: item.has_img,
      })
    })
  }
  // radio改变
  columnRadioChange = (info) => {
    if (info.target.value === '1') {
      this.setState({column_has_img: true})
    } else {
      this.setState({column_has_img: false})
    }
  }
  // render渲染
  render() {
    return (
      <div className={'column'}>
        <h2 className="column-title">栏目管理</h2>
        <div className="column-btn">
          <Button type={'primary'} onClick={() => this.setState({column_visible: true,column_id: null},() => {
            if (this.column_formRef.current.getFieldValue('has_img') === '1') {
              this.setState({column_has_img: true})
            }
          })}>栏目添加</Button>
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
            title={<ModalHeader title={'栏目操作'} />}
            closable={false}
            visible={this.state.column_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.column_uploadRef.current.handleReset();
              this.column_formRef.current.resetFields();
              this.setState({
                column_visible: false,
                column_tree_name: '点击选择父级栏目',
                column_default_img: []
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
              className={'form'}
              ref={this.column_formRef}
              name={'form'}
              validateMessages={this.column_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.columnSave.bind(this)}
              initialValues={{
                column_name: null,
                column_sort: 0,
                has_img: '1',
              }}
            >
              <Form.Item label="父级栏目" >
                <Button type="primary" onClick={() => {
                  this.setState({column_tree_visible: true});
                }}
                        style={{borderColor: '#D9D9D9',textAlign: 'left',color: '#262626',padding: '4px 10px'}} ghost block>
                  {
                    this.state.column_tree_name === '点击选择父级栏目' || this.state.column_tree_name === '已是顶层栏目'?
                      <span style={{color: '#BFBFBF'}}>{this.state.column_tree_name}</span>:
                      this.state.column_tree_name
                  }
                </Button>
                <Form.Item name="parent_id" noStyle >
                  <InputNumber placeholder={'请选择父级栏目'} style={{display: 'none'}} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="栏目名称" name="column_name" rules={[{required: true}]}>
                <Input placeholder={'请输栏目名称'} />
              </Form.Item>
              <Form.Item label="栏目排序" name="column_sort" rules={[{required: true}]}>
                <InputNumber placeholder={'栏目排序(越小越靠前）'} rules={[{types: 'number'}]} />
              </Form.Item>
              <Form.Item label="是否有图片" name="has_img">
                <Radio.Group onChange={this.columnRadioChange}>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="图片上传" hidden={!this.state.column_has_img}>
                <Uploads ref={this.column_uploadRef} max={3} defaultFileList={this.state.column_default_img} onChange={(files) => {
                  this.column_files = [...files];
                  console.log(this.column_files);
                }} />
              </Form.Item>
              <Form.Item label="当前图片" hidden={!this.state.column_default_img.length>0}>
                {
                  this.state.column_default_img.map((item,index) =>(<
                    Image key={`column_image_${index}`} style={{paddingRight: '5px'}} preview={{mask: <EyeOutlined />}} src={item.url} width={120} />))
                }
                <p style={{color: "#FF4D4F"}}>注意：一但上传新图片，原有的图片将会被删除</p>
              </Form.Item>
            </Form>
          </Modal>
          {/*栏目树弹窗*/}
          <Modal
            destroyOnClose={true}
            title={<ModalHeader title={'父级栏目选择'} />}
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
                  if (info.selectedNodes.length === 0) {
                    this.column_formRef.current.resetFields();
                    this.setState({
                      column_tree_visible: false,
                      column_tree_name: '点击选择父级栏目',
                    })
                  } else {
                    this.setState({
                      column_tree_visible: false,
                      column_tree_name: info.selectedNodes[0].column_name
                    })
                    this.column_formRef.current.setFieldsValue({parent_id: info.selectedNodes[0].id})
                  }
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
