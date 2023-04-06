import React, { Component } from 'react'
import style from './index.module.scss'
import ReactQuill from 'react-quill'
import { PlusOutlined } from '@ant-design/icons'
import { addArticle, getArticleById, updateArticle } from 'api/article'
import 'react-quill/dist/quill.snow.css'
import {
  Card,
  Breadcrumb,
  Form,
  Radio,
  Button,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Modal,
  Input,
  Upload,
  message,
} from 'antd'
import { Link } from 'react-router-dom'
import Channel from 'components/Channel'
import { baseURL } from 'utils/request'
export default class ArticlePublish extends Component {
  state = {
    //文章的封面类型
    type: 0,
    //用于控制上传的图片以及图片的显示
    fileList: [],
    previewVisible: false,
    previewImage: '',
    id: this.props.match.params.id,
  }
  formRef = React.createRef()
  render() {
    const { type, fileList, previewImage, previewVisible, id } = this.state
    return (
      <div className={style.publish}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{id ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            ref={this.formRef}
            labelCol={{ span: 4 }}
            size="middle"
            onFinish={this.onFinish}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input
                style={{ width: 400 }}
                placeholder="请输入文章的标题"
              ></Input>
            </Form.Item>
            <Form.Item
              label="频道"
              name="channel_id"
              rules={[{ required: true, message: '请选择文章频道' }]}
            >
              <Channel></Channel>
            </Form.Item>
            <Form.Item label="封面" name="type">
              <Radio.Group onChange={this.changeImageType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
                {/* <Radio value={-1}>自动</Radio> */}
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              {type !== 0 && (
                //fileList:控制文件列表
                //action:控制上传的url 保证是一个完整的url
                //name:用于指定名字
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  action={`${baseURL}upload`}
                  name="image"
                  onChange={this.uploadImage}
                  onPreview={this.handlePreview}
                  beforeUpload={this.beforeUpload}
                  fileList={fileList}
                >
                  {fileList.length < type && <PlusOutlined />}
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请输入文章内容' }]}
            >
              <ReactQuill
                theme="snow"
                className="publish-quill"
                placeholder="请输入文章内容"
              ></ReactQuill>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button type="primary" htmlType="submit" size="middle">
                  {id ? '编辑文章' : '发布文章'}
                </Button>
                <Button size="middle" onClick={this.saveDraft}>
                  存入草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        {/* 弹窗，用于显示预览图片 */}
        <Modal
          visible={previewVisible}
          title="预览图片"
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
  async componentDidMount() {
    if (this.state.id) {
      const res = await getArticleById(this.state.id)
      const values = {
        ...res.data,
        type: res.data.cover.type,
      }
      this.formRef.current.setFieldsValue(values)

      const fileList = res.data.cover.images.map((item) => {
        return {
          url: item,
        }
      })
      console.log(fileList, '路径')
      this.setState({
        fileList,
        type: res.data.cover.type,
      })
    }
  }
  //存入草稿
  saveDraft = async () => {
    const values = await this.formRef.current.validateFields()
    this.save(values, true)
  }
  beforeUpload = (file) => {
    //判断图片 不能超过  500k
    if (file.size >= 1024 * 500) {
      message.warn('上传的文件不能超过500kb')
      return Upload.LIST_IGNORE
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      message.warn('只能上传jpb或者png的图片')
      return Upload.LIST_IGNORE
    }
    return true
  }
  //取消图片的预览
  handleCancel = () => {
    this.setState({
      previewVisible: false,
      previewImage: '',
    })
  }
  //注意：如果fileList是将来回显的，通过url就能够访问到
  //如果fileList的文件是上传的，需要file.response.data.url
  //打开图片预览的功能
  handlePreview = (file) => {
    const url = file.url || file.response.data.url
    this.setState({
      previewVisible: true,
      previewImage: url,
    })
    console.log(file, '打开图片')
  }
  uploadImage = ({ fileList }) => {
    this.setState({
      fileList,
    })
  }
  changeImageType = (e) => {
    this.setState({
      type: e.target.value,
      fileList: [],
    })
  }

  onFinish = async (values) => {
    console.log(values, '数据')
    this.save(values, false)
  }

  async save(values, draft) {
    const { fileList, type } = this.state
    if (fileList.length !== type) {
      return message.warn('上传的图片数量不正确')
    }
    const images = fileList.map((item) => {
      return item.url || item.response.data.url
    })
    if (this.state.id) {
      // 修改文章
      await updateArticle(
        {
          ...values,
          cover: {
            type,
            images,
          },
          id: this.state.id,
        },
        draft
      )
      message.success('修改成功')
    } else {
      // 新增文章
      await addArticle(
        {
          ...values,
          cover: {
            type,
            images,
          },
        },
        draft
      )
      message.success('添加成功')
    }
    this.props.history.push('/home/list')
  }
}
