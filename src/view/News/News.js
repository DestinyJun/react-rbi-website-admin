/**
 * desc：  新闻管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './News.scss';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  Popover,
  Row,
  Select,
  Modal,
  Tree,
  InputNumber, message
} from "antd";
import {post} from "../../service/Interceptor";
import {NewsApi} from "../../service/Apis";
import axios from "axios";
import {reverseTree, transformTree} from "../../service/tools";
import {ModalHeader} from "../../components/ModalHeader";
import {Uploads} from "../../components/Uploads";
import {TextEditor} from "../../components/TextEditor";
const { Meta } = Card;
const { Option } = Select;

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news_list: [],
      news_thumb_img: [], // 新闻默认封面图片
      news_type_list: [],
      news_column_list: [],
      news_column_name: '点击选择栏目',
      news_column_visible: false,
      news_list_visible: false,
      news_id: null,
      news_keyword: '', // 搜索关键字
      news_pageNo: 1, // 当前页
      news_content: null, // 新闻内容
    };
    // 每页显示条数
    // 文件列表
    this.news_files = [];
    // 表单模型
    this.news_formRef = React.createRef();
    // 文件上传节点
    this.news_uploadRef = React.createRef();
    // 校验信息定义
    this.news_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
    // 文本编辑器节点
    this.news_editorRef = React.createRef();
  }

  // 生命周期
  componentDidMount() {
    // 初始化新闻列表
    this.newsInit(this.state.news_pageNo,this.state.news_keyword);
    // 初始化选项
    axios.all([
      post(NewsApi.GET_COLUMN_TREE, {}),
      post(NewsApi.GET_NEWS_TYPE, {}),
    ])
      .then(res => {
        this.setState({
          news_column_list: transformTree(reverseTree(res[0].data).map(item => ({...item,key: item.id}))), // 栏目列表
          news_type_list: res[1].data.map(item =>({...item,key: item.id})), // 新闻类型列表
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  // 新闻数据初始化
  newsInit(pageNo,title) {
    post(NewsApi.GET_NEWS, {pageSize: 10,pageNo,title})
      .then(res => {
        this.setState({
          news_list: res.data.map(item =>({...item,key: item.id})),
        })
      })
  }

  // 添加/修改
  newsSave () {
    let url,data;
    if (!this.state.news_id) {
      url = NewsApi.ADD_NEWS;
      data = this.news_formRef.current.getFieldsValue()
    } else {
      url = NewsApi.UPDATE_NEWS;
      data = this.news_formRef.current.getFieldsValue();
      data['id'] = this.state.news_id;
    }
    data = {...data,...this.news_editorRef.current.getEditorContent()}
    const formData = new FormData;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (!data[key]){
          continue
        }
        if (Array.isArray(data[key])) {
          formData.append('source_url', JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      }
    }
    if (this.news_files.length>0) {
      this.news_files.forEach(item => {
        formData.append('thumb_img', item.originFileObj)
      })
      post(url, formData)
        .then(() => {
          this.setState({
            news_list_visible: false,
          });
          this.newsInit(this.state.news_pageNo,this.state.news_keyword);
        })
        .catch(err => {})
    } else {
      message.error('封面图片必须有！')
    }
  }

  //删除
  newsDel(id) {
    if (window.confirm('确定删除吗？')) {
      post(NewsApi.DEL_NEWS, {id})
        .then(() => {
          this.newsInit(this.state.news_pageNo,this.state.news_keyword);
        })
        .catch(err => {})
    }
  }

  // 编辑初始化
  newsUpdate(item) {
    post(NewsApi.GET_NEWS_CONTENT, {id: item.id})
      .then((res) => {
        this.setState({
          news_id: item.id,
          news_content: res.article_content,
          news_list_visible: true,
          news_column_name: item.column_name,
          news_thumb_img: [item.thumb_img],
        },() => {
          this.news_formRef.current.setFieldsValue({
            article_title: item.article_title,
            article_summary: item.article_summary,
            article_author: item.article_author,
            article_column_id: item.article_column_id,
            article_type_id: item.article_type_id,
          })
          this.news_editorRef.current.setEditorValue(res.article_content)
        })
      })
      .catch(err => {})
  }

  render() {
    return (
      <div className={'news'}>
        <div className="news-title">
          <h2>新闻列表管理</h2>
        </div>
        <div className={"news-add"}>
          <Button style={{textAlign: 'left'}} type={'primary'} onClick={() => this.setState({news_list_visible: true,flink_type_id: null})}>新闻添加</Button>
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
                      <EditOutlined key="编辑" onClick={this.newsUpdate.bind(this,item)} />
                    </Popover>,
                    <Popover content={'删除'}>
                      <DeleteOutlined color={'red'} onClick={this.newsDel.bind(this,item.id)}  key="删除" style={{color: '#ff4d4f'}} />
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
        <div className={'new-drawer'}>
          <Drawer
            title="添加新闻"
            width={'50vw'}
            afterVisibleChange={(event) => {
              if (!event) {
                this.news_formRef.current.resetFields();
                this.news_uploadRef.current.handleReset();
                this.news_editorRef.current.handleReset();
                this.setState({
                  news_column_name: '点击选择栏目',
                  news_thumb_img: [],
                  news_id: null,
                })
              }
            }}
            onClose={() => {
              this.setState({
                news_list_visible: false,
              });
            }}
            visible={this.state.news_list_visible}
            bodyStyle={{ paddingBottom: 24 }}
            footer={
              <div style={{textAlign: 'right',}}>
                <Button onClick={() => {
                  this.setState({
                    news_list_visible: false,
                  });
                }} style={{ marginRight: 8 }}>
                  取消
                </Button>
                <Button onClick={() => {this.news_formRef.current.submit()}} type="primary">
                  添加
                </Button>
              </div>
            }
          >
           <div className={'news-drawer'}>
             <TextEditor ref={this.news_editorRef} />
             <Form
               ref={this.news_formRef}
               name={'newsForm'}
               validateMessages={this.news_validateMessages}
               onFinish={this.newsSave.bind(this)}
               layout="vertical"
               initialValues={{
                 article_title: null,
                 article_summary: null,
                 article_column_id: null,
                 article_type_id: null,
                 article_author: '红鸟智能',
               }}
             >
               <Row gutter={16}>
                 <Col span={12}>
                   <Form.Item label="新闻标题" name="article_title" rules={[{required: true}]}>
                     <Input placeholder={'请输新闻标题'} />
                   </Form.Item>
                 </Col>
                 <Col span={12}>
                   <Form.Item label="新闻摘要" name="article_summary" rules={[{required: true}]}>
                     <Input placeholder={'请输新闻摘要'} />
                   </Form.Item>
                 </Col>
               </Row>
               <Row gutter={16}>
                 <Col span={12}>
                   <Form.Item name="article_column_id" rules={[{required: true}]} label="所属栏目">
                     <Button type="primary" onClick={() => {
                       this.setState({news_column_visible: true});
                     }}
                             style={{borderColor: '#D9D9D9',textAlign: 'left',color: '#262626',padding: '4px 10px'}} ghost block>
                       {
                         this.state.news_column_name === '点击选择栏目' ?
                           <span style={{color: '#BFBFBF'}}>{this.state.news_column_name}</span>:
                           this.state.news_column_name
                       }
                     </Button>
                     <Form.Item noStyle >
                       <InputNumber style={{display: 'none'}} />
                     </Form.Item>
                   </Form.Item>
                 </Col>
                 <Col span={12}>
                   <Form.Item label="新闻类型" name="article_type_id" rules={[{required: true}]}>
                     <Select placeholder={'请选择新闻类型'} notFoundContent={<span>暂无内容</span>}>
                       {
                         this.state.news_type_list.length > 0 &&
                         this.state.news_type_list.map((item,index) => (<Option key={`rule_${index}`} value={item.id}>{item.news_type}</Option>))
                       }
                     </Select>
                   </Form.Item>
                 </Col>
               </Row>
               <Row gutter={16}>
                 <Col span={12}>
                   <Form.Item label="新闻作者" name="article_author" rules={[{required: true}]}>
                     <Input placeholder={'请输新闻作者'} />
                   </Form.Item>
                 </Col>
               </Row>
               <Row gutter={16}>
                 <Col span={12}>
                   <div>
                     <span style={{color: 'red'}}>*</span>
                     <span style={{marginLeft: 5}}>封面图片</span>
                     <Uploads ref={this.news_uploadRef} max={1} defaultFileList={this.state.news_thumb_img} onChange={(files) => {
                       this.news_files = [...files];
                     }} />
                   </div>
                 </Col>
                 <Col span={12}>
                   <Form.Item label="当前封面图片" hidden={!this.state.news_thumb_img.length>0}>
                     {
                       this.state.news_thumb_img.map((item,index) =>(<
                         Image key={`column_image_${index}`} style={{paddingRight: '5px'}} preview={{mask: <EyeOutlined />}} src={item} width={120} />))
                     }
                     <p style={{color: "#FF4D4F"}}>注意：一但上传新图片，原有的图片将会被删除</p>
                   </Form.Item>
                 </Col>
               </Row>
             </Form>
           </div>
          </Drawer>
          {/*栏目树弹窗*/}
          <Modal
            destroyOnClose={true}
            title={<ModalHeader title={'请选择栏目'} />}
            width={'30vw'}
            centered
            closable={false}
            visible={this.state.news_column_visible}
            footer={<Button type="primary" ghost danger  onClick={() => this.setState({news_column_visible: false})}>关闭</Button>}
            onCancel={() => this.setState({news_column_visible: false})}
          >
            <div className={'column-tree-box'}>
              <Tree
                showLine={true}
                onSelect={(key,info) => {
                  if (info.selectedNodes.length === 0) {
                    this.news_formRef.current.resetFields();
                    this.setState({
                      news_column_visible: false,
                      news_column_name: '点击选择栏目',
                    })
                  } else {
                    this.setState({
                      news_column_visible: false,
                      news_column_name: info.selectedNodes[0].column_name
                    })
                    this.news_formRef.current.setFieldsValue({article_column_id: info.selectedNodes[0].id})
                  }
                }}
                titleRender={(nodeData) => {
                  return (<span>{nodeData.column_name}</span>)
                }}
                treeData={this.state.news_column_list}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
