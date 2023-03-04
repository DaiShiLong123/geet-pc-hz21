import React, { Component } from 'react'
import './index.scss'
import { Card } from 'antd'
import logo from '../../assets/images/logo.png'

export default class index extends Component {
  render() {
    return (
      <div className="login">
        <Card className="login-container">
          <img src={logo} className="login-logo"></img>
        </Card>
      </div>
    )
  }
}
