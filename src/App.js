import Layout from 'pages/Layout'
import PrivateRoute from 'components/PrivateRoute'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import history from 'utils/history'
import Login from './pages/Login'
function App() {
  return (
    <Router history={history}>
      <div className="App">
        {/* <Link to="/login">登录</Link>
        <Link to="/home">首页</Link> */}
        {/* 配置路由规则 */}
        <Switch>
          <Redirect exact from="/" to="/home"></Redirect>
          <PrivateRoute path="/home" component={Layout}></PrivateRoute>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
