/**
 * desc：  富文本编辑器
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器组件样式
import './TextEditor.scss';
import {post} from "../service/Interceptor";
import {Col, Form, message, Modal, Row, Select} from "antd";
import {ModalHeader} from "./ModalHeader";
import {Uploads} from "./Uploads";
import {NewsApi, SourceApi, SourceTypeApi} from "../service/Apis";
const { Option } = Select;

export class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
      upload_visible: false,
      file_type_list: [],
      source_list: [],
    };
    // 表单模型
    this.formRef = React.createRef();
    // 校验信息定义
    this.validateMessages = {
      required: '${label}是必填项!'
    };
    // 文件上传节点
    this.uploadRef = React.createRef();
    // 上传文件列表
    this.files = []
    // 编辑器节点
    this.braftFinder = React.createRef()
  }

  // 获取编辑器内容及已插入的图片地址
  getEditorContent() {
    const str = this.braftFinder.current.getValue().toHTML();
    const imgRex = /<img.*?(?:>|\/>)/gi;
    const imgSrcRex = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    const arr = str.match(imgRex)
    const arrUrl = []
    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        arrUrl.push(arr[i].match(imgSrcRex)[1])
      }
    }
    return {
      article_content: str,
      source_url: arrUrl
    }
  }
  // 生命周期
  componentDidMount () {
    // 获取媒体库实例
    // this.braftFinder = this.editorInstance.getFinderInstance()
    // 初始化媒体类型
    post(SourceTypeApi.GET_SOURCE_TYPE,{})
      .then(res => {
        this.setState({
          file_type_list: res.data.map(item =>({...item,key: item.id})), // 媒体文件类型列表
        })
      })
      .catch(err => {
        console.log(err);
      })
    // 媒体文件初始化
    this.mediaInit(10,1)
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = await fetchEditorContent()
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    /*this.setState({
      editorState: BraftEditor.createEditorState(htmlContent)
    })*/
  }

  // 媒体文件初始化
  mediaInit(pageSize, pageNo) {
    post(NewsApi.GET_SOURCE, {pageSize,pageNo})
      .then(res => {
        this.braftFinder.current.braftFinder.setItems(res.data.map(item =>({...item,key: item.id})))
      })
  }

  // 保存编辑器内容
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML()
    console.log(htmlContent);
    // const result = await saveEditorContent(htmlContent)
  }

  // 编辑器内容改变时执行
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  // 多媒体文件上传
  imageUpload(params) {
    if(this.files.length === 0) {
      message.error('请选择需要上传的图片！')
      return;
    }
    const data = new FormData;
    data.append('source_type_id',params.source_type_id);
    this.files.forEach(item => {
      data.append('source',item.originFileObj);
    })
    post(SourceApi.ADD_SOURCE_TYPE, data)
      .then(() => {
        this.mediaInit(10,1)
        this.setState({upload_visible: false})
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { editorState } = this.state
    const extendControls = [
      'separator',
      {
        key: 'add-media',
        type: 'button',
        text: '上传图片到媒体库',
        onClick:() => {this.setState({upload_visible: true})}
      }
    ]
    return (
      <div className="my-component">
        <BraftEditor
          ref={this.braftFinder}
          value={editorState}
          extendControls={extendControls}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          media={{
            pasteImage: false
          }}
        />
        <Modal
          title={<ModalHeader title={'媒体文件上传'} />}
          closable={false}
          visible={this.state.upload_visible}
          centered
          okText={'确认'}
          afterClose={() => {
            this.uploadRef.current.handleReset();
            this.formRef.current.resetFields();
            this.setState({
              upload_visible: false,
            })
          }}
          onOk={() => {
            this.formRef.current.submit()
          }}
          confirmLoading={false}
          cancelText={'取消'}
          onCancel={() => this.setState({upload_visible: false})}
        >
          <Form
            ref={this.formRef}
            name={'textEditForm'}
            validateMessages={this.validateMessages}
            layout="vertical"
            onFinish={this.imageUpload.bind(this)}
            initialValues={{
              source_type_id: null
            }}
          >
            <Row>
              <Col span={24}>
                <Form.Item label="权限标识" name="source_type_id" rules={[{required: true}]}>
                  <Select placeholder={'请选择媒体文件类型'} notFoundContent={<span>暂无内容</span>}>
                    {
                      this.state.file_type_list.length > 0 &&
                      this.state.file_type_list.map((item,index) => (<Option key={`rule_${index}`} value={item.id}>{item.type_name}</Option>))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <div>
                  <span style={{color: 'red'}}>*</span>
                  <span style={{marginLeft: 5}}>选择媒体文件</span>
                  <Uploads ref={this.uploadRef} max={8} onChange={(files) => {
                    this.files = [...files];
                  }} />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
