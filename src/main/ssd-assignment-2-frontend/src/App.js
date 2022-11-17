import './App.css';
import { BrowserRouter, Switch, Route, Link, Router } from 'react-router-dom';
import Login from './Components/Login';
import authService from './Services/AuthService';
import Sidebar from './Components/Sidebar';
import Users from './Pages/Users';
import Messages from './Pages/Messages';
import Files from './Pages/Files';
import Profile from './Pages/Profile';
import Header from './Components/Header';

function App() {
  const user = authService.getCurrentUser();

  return (
    <div className="App">
      <BrowserRouter>

      <div className="AppSidebar">
        <Sidebar authorized={user} />
      </div>

      <div className="AppHeader">
        <Header authorized={user} />
      </div>

      <div className="AppBody">
        <Switch>
            {
                user === null ?
                <Route exact path={"/login"} component={Login} />
                :
                user.roles[0] === "ROLE_ADMIN" ?
                <>
                    <Route exact path={"/login"} component={Login} />
                    <Route path={"/users"} exact component={Users} />
                    <Route path={"/messages"} exact component={Messages} />
                    <Route path={"/files"} exact component={Files} />
                    <Route path={"/profile"} exact component={Profile} />
                </>
                :
                user.roles[0] === "ROLE_MANAGER" ?
                <>
                    <Route exact path={"/login"} component={Login} />
                    <Route path={"/messages"} exact component={Messages} />
                    <Route path={"/files"} exact component={Files} />
                    <Route path={"/profile"} exact component={Profile} />
                </>
                :
                // if role is worker
                <>
                    <Route exact path={"/login"} component={Login} />
                    <Route path={"/messages"} exact component={Messages} />
                    <Route path={"/profile"} exact component={Profile} />
                </>
            }
        </Switch>
      </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
