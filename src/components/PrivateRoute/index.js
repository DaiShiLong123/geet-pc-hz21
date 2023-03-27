import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { hasToken } from 'utils/storage'

export default class PrivateRoute extends Component {
  render() {
    console.log(this.props, 'ceshi')
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={(routeProps) => {
          //判断用户是否登录，判断是否token
          if (hasToken()) {
            return <Component {...routeProps}></Component>
          } else {
            //跳转到登录页面的时候，我们需要把当前的地址传过去，登录成功就能够跳转回来
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: {
                    from: routeProps.location.pathname,
                  },
                }}
              ></Redirect>
            )
          }
        }}
      ></Route>
    )
  }
}
