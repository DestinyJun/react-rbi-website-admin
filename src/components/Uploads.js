/**
 * desc：  upload上传
 * author：DestinyJun
 * date：  2021/1/22 9:58
 */
import React, {Component} from 'react';
import {Upload, message, Button} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from "axios";

export class Uploads extends Component {
  state = {
    loading: false,
    fileList: [],
  };

  handleChange = info => {
    let fileList = [...info.fileList];
    this.setState({ fileList });
  };

  uploads = () => {
    const data = new FormData;
    this.state.fileList.forEach(item => {
      data.append('source[]', item.originFileObj)
    })
    axios.post(
      'http://127.0.01:8090/admin/source/upload',
      data,
      {
        headers: {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIhQCMkJSomIiwiYXVkIjoiIiwiaWF0IjoxNjA5MzIxNDMxLCJuYmYiOjE2MDkzMjE0MzQsImV4cCI6MTYxOTMyMTQzMSwiZGF0YSI6eyJ1aWQiOjEsInVpcCI6IjEyNy4wLjAuMSJ9fQ.thxpFMKoMEaMhx6p4mN-gDb-nfVwEmsSkFGUuz_9riY'
        }
    }).then(res => {
      console.log(res.data);
    })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={true}
          multiple={true}
          onChange={this.handleChange}
          beforeUpload={() => {return false}}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <Button onClick={this.uploads}>点击上传</Button>
      </div>

    );
  }
}
