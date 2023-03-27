import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { hasToken } from 'utils/storage'
export default class AuthRoute extends Component {
  render() {
    //把接收到的component属性改成用render进行渲染
    //...rest：解构的剩余属性
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...this.rest}
        render={(props) => {
          console.log(props, 'ceshi')
          if (hasToken()) {
            return <Component {...props}></Component>
          } else {
            return <Redirect to="/login"></Redirect>
          }
        }}
      ></Route>
    )
  }
}
