/**
 * desc：  首页轮播图
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Carousel.scss';
import {Button, Col, Form, Image, Input, InputNumber, Modal, Row, Select, Space, Table} from "antd";
import {post} from "../../service/Interceptor";
import {CarouselApi} from "../../service/Apis";
import {ModalHeader} from "../../components/ModalHeader";
import {Uploads} from "../../components/Uploads";
import {EyeOutlined} from "@ant-design/icons";

export class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carousel_list: [],
      carousel_visible: false,
      carousel_view_visible: false,
      carousel_view_url: null,
      carousel_view_title: null,
      carousel_id: null,
      carousel_default_img: [],
    };
    // 初始化第一页
    this.carousel_pageNo = 1;
    // 文件列表
    this.carousel_files = [];
    // 表单模型
    this.carousel_formRef = React.createRef();
    // 文件上传节点
    this.carousel_uploadRef = React.createRef();
    // 表头信息定义
    this.carousel_column = [
      {
        title: '超链接网址',
        dataIndex: 'carousel_url',
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
              <Button type={'primary'} style={{background: '#00E3CA',borderColor: '#00E3CA'}} onClick={() => {window.open(item.carousel_img)}}>查看图片</Button>
              <Button type={'primary'} style={{background: '#FFA347',borderColor: '#FFA347'}} onClick={() => {window.open(item.carousel_url)}}>查看链接</Button>
              <Button type={'primary'} style={{background: '#44A8EF',borderColor: '#44A8EF'}} onClick={this.carouselUpdate.bind(this,item)}>编辑</Button>
              <Button type={'primary'} danger onClick={this.carouselDel.bind(this,item)}>删除</Button>
            </Space>
          )
        },
      }
    ]
    // 校验信息定义
    this.carousel_validateMessages = {
      required: '${label}是必填项!',
      types: {
        number: '${label}必须是数字',
      },
    };
  }

  // 生命周期
  componentDidMount() {
    this.carouselInit(this.carousel_pageNo);
  }

  // 初始化树结构
  carouselInit(pageNo) {
    post(CarouselApi.GET_CAROUSE, {pageNo,pageSize: 10})
      .then(res => {
        this.setState({
          carousel_list: res.data.map(item => ({...item,key: item.id})),
          carousel_visible: false,
        })
      })
  }

  // 添加/编辑保存
  carouselSave () {
    let url,data;
    data = this.carousel_formRef.current.getFieldsValue()
    if (!this.state.carousel_id) {
      url = CarouselApi.ADD_CAROUSE;
    } else {
      url = CarouselApi.UPDATE_CAROUSE;
      data['id'] = this.state.carousel_id;
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
    if (this.carousel_files.length>0) {
      this.carousel_files.forEach(item => {
        formData.append('carousel_img[]', item.originFileObj)
      })
    }
    post(url, formData)
      .then(() => {
        this.carouselInit(this.carousel_pageNo);
      })
      .catch(err => {})

  }

  // 删除
  carouselDel (item) {
    if (window.confirm('确定要删除么?')) {
      post(CarouselApi.DEL_CAROUSE, {id: item.id})
        .then(() => {
          this.carouselInit(this.carousel_pageNo);
        })
        .catch(err => {})
    }
  }

  // 编辑初始化
  carouselUpdate (item) {
    this.setState({
      carousel_visible: true,
      carousel_id: item.id,
      carousel_default_img: [item.carousel_img]
    },() => {
      this.carousel_formRef.current.setFieldsValue({
        carousel_url: item.carousel_url
      })
    })
  }

  // render渲染
  render() {
    return (
      <div className={'carousel'}>
        <h2 className="carousel-title">轮播图管理</h2>
        <div className="carousel-btn">
          <Button type={'primary'} onClick={() => this.setState({carousel_visible: true})}>轮播图添加</Button>
        </div>
        <div className="carousel-table">
          {
            this.state.carousel_list.length>0 &&
            <Table
              columns={this.carousel_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              dataSource={this.state.carousel_list}
            />
          }
        </div>
        <div className="carousel-modal">
          {/*form弹窗*/}
          <Modal
            title={<ModalHeader title={'轮播图管理操作'} />}
            closable={false}
            visible={this.state.carousel_visible}
            centered
            okText={'确认'}
            afterClose={() => {
              this.carousel_uploadRef.current.handleReset();
              this.carousel_formRef.current.resetFields();
              this.setState({
                carousel_visible: false,
                carousel_default_img: [],
              })
            }}
            onOk={() => {
              this.carousel_formRef.current.submit()
            }}
            cancelText={'取消'}
            onCancel={() => this.setState({carousel_visible: false})}
          >
            <Form
              className={'form'}
              ref={this.carousel_formRef}
              name={'form'}
              validateMessages={this.carousel_validateMessages}
              labelCol={{span: 6}}
              wrapperCol={{span: 16}}
              onFinish={this.carouselSave.bind(this)}
            >
              <Form.Item label="超链接网址" name="carousel_url" rules={[{required: true}]}>
                <Input placeholder={'请输友超链接网址'} />
              </Form.Item>
              <Row>
                <Col span={6} style={{textAlign: 'right'}}>
                  <span style={{color: 'red'}}>*</span>
                  <span style={{marginLeft: 5}}>轮播图上传：</span>
                </Col>
                <Col span={18}>
                  <Uploads ref={this.carousel_uploadRef} max={1}  onChange={(files) => {
                    this.carousel_files = [...files];
                  }} />
                </Col>
              </Row>
              <Form.Item label="当前轮播图" hidden={!this.state.carousel_default_img.length>0}>
                {
                  this.state.carousel_default_img.map((item,index) =>(<
                    Image key={`column_image_${index}`} style={{paddingRight: '5px'}} preview={{mask: <EyeOutlined />}} src={item} width={120} />))
                }
                <p style={{color: "#FF4D4F"}}>注意：一但上传新图片，原有的图片将会被删除</p>
              </Form.Item>
            </Form>
          </Modal>
          {/*资源查看弹窗*/}
          <Modal
            destroyOnClose={true}
            title={<ModalHeader title={this.state.carousel_view_title} />}
            width={'30vw'}
            centered
            closable={false}
            visible={this.state.carousel_view_visible}
            footer={<Button type="primary" ghost danger  onClick={() => this.setState({carousel_view_visible: false})}>关闭</Button>}
            onCancel={() => this.setState({carousel_view_visible: false})}
          >
            <div className={'carousel-tree-box'}>
              {this.state.carousel_view_url && <Image placeholder={true} height={'auto'} width={'auto'} src={this.state.carousel_view_url} />}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
