import React, { Component } from 'react'
import { Select } from 'antd'
import { getChannels } from 'api/channel'
const { Option } = Select
export default class Channel extends Component {
  state = {
    //频道列表数据
    channels: [],
  }
  render() {
    console.log(this.props, 'sfdfs')
    return (
      <div>
        <Select
          style={{ width: 400 }}
          placeholder="请选择文章频道"
          value={this.props.value}
          onChange={this.props.onChange}
        >
          {this.state.channels.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    )
  }
  componentDidMount() {
    this.getChannelList()
  }

  // 发送请求获取频道数据
  async getChannelList() {
    const res = await getChannels()
    this.setState({
      channels: res.data.channels,
    })
  }
}
