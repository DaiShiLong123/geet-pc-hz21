import React, { Component } from 'react'
import { Breadcrumb, Layout, Menu, theme, Popconfirm, message } from 'antd'
import {
  LogoutOutlined,
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Switch, Route, Link } from 'react-router-dom'
import Home from '../Home/index'
import ArticleList from '../ArticleList/index'
import ArticlePublish from '../ArticlePublish/index'
import style from './index.module.scss'
import { removeToken } from 'utils/storage'
import { getUserProfile } from 'api/user'
const { Header, Content, Sider } = Layout
export default class LayoutComponent extends Component {
  state = {
    profile: [],
  }
  render() {
    return (
      <div className={style.layout}>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <div className="profile">
              <span>{this.state.profile.name}</span>
              <span>
                <Popconfirm
                  title="是否确认退出？"
                  onConfirm={this.logout}
                  okText="确认"
                  cancelText="取消"
                >
                  <span className="logout">
                    <LogoutOutlined /> 退出
                  </span>
                </Popconfirm>
              </span>
            </div>
          </Header>
          <Layout>
            <Sider width={200}>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[this.props.location.pathname]}
                defaultOpenKeys={['sub1']}
              >
                <Menu.Item key="/home" icon={<HomeOutlined />}>
                  <Link to="/home">数据概览</Link>
                </Menu.Item>
                <Menu.Item key="/home/list" icon={<DiffOutlined />}>
                  <Link to="/home/list">内容管理</Link>
                </Menu.Item>
                <Menu.Item key="/home/publish" icon={<EditOutlined />}>
                  <Link to="/home/publish">发布文章</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: '24px' }}>
              <Content className="site-layout-background">
                <Switch>
                  <Route exact path="/home" component={Home}></Route>
                  <Route path="/home/list" component={ArticleList}></Route>
                  <Route
                    path="/home/publish"
                    component={ArticlePublish}
                  ></Route>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
  async componentDidMount() {
    const res = await getUserProfile()
    this.setState({
      profile: res.data,
    })
  }

  //退出系统
  logout = () => {
    console.log('测试')
    // 移除token
    /* localStorage.removeItem('token') */
    removeToken()
    // 回到登录页面
    this.props.history.push('/login')
    // 提示消息
    message.success('退出成功')
  }
}
