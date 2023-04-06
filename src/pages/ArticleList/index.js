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
} from 'antd'
import { Link } from 'react-router-dom'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import React, { Component } from 'react'
import style from './index.module.scss'
import { ArticleStatus } from 'api/constants'
import { getArticles, delArticle } from 'api/article'
import defaultImg from 'assets/images/defaultImage.png'
import Channel from 'components/Channel'
const { Option } = Select
const { RangePicker } = DatePicker
const { confirm } = Modal
export default class ArticleList extends Component {
  state = {
    articles: {},
    id: this.props.match.params.id,
  }
  //用于存放查询文章列表的所有的参数
  reParams = {
    page: 1,
    per_page: 10,
  }
  columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render(data) {
        if (data.type === 0) {
          //无图
          return (
            <img
              src={defaultImg}
              style={{ width: 200, height: 120, objectFit: 'cover' }}
            />
          )
        }
        //有图
        return (
          <img
            src={data.images[0]}
            style={{ width: 200, height: 120, objectFit: 'cover' }}
          />
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(status) {
        const obj = ArticleStatus.find((item) => item.id === status)
        return <Tag color={obj.color}>{obj.name}</Tag>
      },
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
      key: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space>
            <Button
              type="primary"
              shape="circle"
              onClick={() => this.handleEdit(data.id)}
            >
              <EditOutlined />
            </Button>
            <Button
              type="primary"
              shape="circle"
              danger
              onClick={() => this.handleDelete(data.id)}
            >
              <DeleteOutlined />
            </Button>
          </Space>
        )
      },
    },
  ]
  dataSource = []
  render() {
    const { total_count, results, per_page, page } = this.state.articles
    return (
      <div className={style.list}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>文章列表</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          {/* 表单结构 */}
          <Form initialValues={{ status: -1 }} onFinish={this.onFinish}>
            <Form.Item label="状态" name="status">
              <Radio.Group>
                {ArticleStatus.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="频道" name="channel_id">
              <Channel></Channel>
            </Form.Item>
            <Form.Item label="日期" name="date">
              <RangePicker style={{ width: 400 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="middle">
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到${total_count}条结果:`}>
          <Table
            columns={this.columns}
            dataSource={results}
            rowKey="id"
            pagination={{
              position: ['bottomCenter'],
              current: page,
              total: total_count,
              pageSize: per_page,
              //每页大小  或者 页码 改变是，触发的事件
              onChange: this.changePage,
            }}
          />
        </Card>
      </div>
    )
  }
  //方法在组件挂载后，立即调用
  //async用来处理异步操作的，例如从服务器获取数据或者执行某些耗时的操作
  componentDidMount() {
    this.getArticlesList()
  }

  // 修改
  handleEdit = (id) => {
    console.log(id, '修改')
    this.props.history.push(`/home/publish/${id}`)
  }
  //发送请求获取文章数据
  async getArticlesList() {
    const res = await getArticles(this.reParams)
    console.log(res, 'biaogeshuju')
    this.setState({
      articles: res.data,
    })
  }
  //改变页码
  changePage = (page, pageSize) => {
    this.reParams.page = page
    this.reParams.per_page = pageSize
    this.getArticlesList()
  }
  //删除功能
  handleDelete = (id) => {
    console.log('删除', id)
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该文章, 是否继续?',
      // 注意：此处，需要使用箭头函数，否则，会有this指向的问题
      onOk: async () => {
        //发送请求，删除文章
        await delArticle(id)
        this.getArticlesList()
      },
    })
  }
  onFinish = ({ status, channel_id, date }) => {
    if (status !== -1) {
      this.reParams.status = status
    } else {
      delete this.reParams.status
    }
    if (channel_id !== undefined) {
      this.reParams.channel_id = channel_id
    } else {
      delete this.reParams.channel_id
    }
    if (date) {
      this.reParams.begin_pubdate = date[0]
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      this.reParams.end_pubdate = date[1]
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    } else {
      delete this.reParams.begin_pubdate
      delete this.reParams.end_pubdate
    }
    //如果是查询的操作，需要让页码值重新为1
    this.reParams.page = 1
    console.log(this.reParams, '测试123')
    this.getArticlesList()
  }
}
