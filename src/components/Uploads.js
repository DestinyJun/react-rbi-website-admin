/**
 * desc：  upload上传
 * author：DestinyJun
 * date：  2021/1/22 9:58
 */
import React, {Component} from 'react';
import {Upload, message, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {getBase64} from "../service/tools";



export class Uploads extends Component {
  static defaultProps= {
    multiple: false, // 是否上传多张图片，默认false
    max: 1, // 是否上传多张图片，默认false
    imgList: [], // 是否上传多张图片，默认false
  }
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: props.imgList,
    };
    this.fileArray = []
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({fileList }) => {
    this.setState({ fileList })
    this.props.onChange(fileList);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你只能上传JPG/PNG类型的图片文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大只能是2MB!');
    }
    return false;
  }

  handleReset = () => {
    this.setState({fileList: []})
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    // console.log(this.props.imgList);
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>点击上传图片</div>
      </div>
    );
    return (
      <>
        <Upload
          multiple={this.props.multiple}
          accept={'image/png,image/jpeg'}
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= this.props.max ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
