/* eslint-disable */

import React, { useEffect } from "react";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/connect/Login";
import NavBar from "./NavBar";
import Register from "./pages/connect/Register";

import { SetToken, GetUserData } from "./actions/index";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
// eslint-disable-next-line
import { useSelector, useDispatch } from "react-redux";
import SinglePost from "./pages/SinglePost/SinglePost";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    const user = JSON.parse(localStorage.getItem("user_data"));

    if (token) {
      dispatch(SetToken(token));
      dispatch(GetUserData(user));
    }
  }, []);

  return (
      <div  >
    <img className="wallpaper" src={"https://res.cloudinary.com/dg3ftjfp0/image/upload/v1626367303/showroom_esqhbb.jpg"} alt="" />
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/Register" component={Register} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/post/:id" component={SinglePost} />
      </Switch>
    </Router>
      </div>
  );
}

export default App;
