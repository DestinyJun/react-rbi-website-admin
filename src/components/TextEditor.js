/**
 * desc：  富文本编辑器
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
// 引入axios
import http from 'axios';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器组件样式
import './TextEditor.scss';

export class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null)
    };
  }
  async componentDidMount () {
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = await fetchEditorContent()
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    /*this.setState({
      editorState: BraftEditor.createEditorState(htmlContent)
    })*/
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML()
    console.log(htmlContent);
    // const result = await saveEditorContent(htmlContent)
  }
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  // 多媒体文件校验（校验只允许上传图片）
  myValidateFn(files) {
    // 返回false时则自动上传函数uploadFn不执行，不过其功能跟accepts重叠了，感觉
    const types = ['image/png','image/jpeg','image/gif','image/webp','image/apng'];
    return  types.includes(files.type);
  }
  // 多媒体文件上传
  imageUpload(params) {
    console.log(params);
    return
    const data = new FormData;
    data.append('file',params.file);
    http.post(
      'http://127.0.01:8090/admin/source/upload',
      data,
      {
        headers: {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIhQCMkJSomIiwiYXVkIjoiIiwiaWF0IjoxNjA5MzIxNDMxLCJuYmYiOjE2MDkzMjE0MzQsImV4cCI6MTYxOTMyMTQzMSwiZGF0YSI6eyJ1aWQiOjEsInVpcCI6IjEyNy4wLjAuMSJ9fQ.thxpFMKoMEaMhx6p4mN-gDb-nfVwEmsSkFGUuz_9riY'
        }
      }
    )
      .then(res => {
       /* if (res.data.status === 2000) {
          successFn(res.data)
        }*/
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    // 上传成功后执行这个函数
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      params.success({
        url: response.data,
      })
    }
    // 上传进度改变执行这个函数
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      params.progress(event.loaded / event.total * 100)
    }
    // 上传失败后执行这个函数
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      params.error({
        msg: 'unable to upload.'
      })
    }
  }

  render() {
    const { editorState } = this.state
    return (
      <div className="my-component">
        <BraftEditor
          media={{
            pasteImage: false,
            uploadFn: this.imageUpload.bind(this),
            validateFn: this.myValidateFn.bind(this),
            accepts: {
              image: 'image/png,image/jpeg,image/gif,image/webp,image/apng',
            }
          }}
          extendControls={[
            'separator',
            {
              key: 'my-button', // 控件唯一标识，必传
              type: 'button',
              title: '这是一个自定义的按钮', // 指定鼠标悬停提示文案
              className: 'my-button', // 指定按钮的样式名
              html: null, // 指定在按钮中渲染的html字符串
              text: '自定义按钮', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
              onClick: () => {
                console.log('Hello World!');
              },
            }
          ]}
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
        />
      </div>
    );
  }
}
