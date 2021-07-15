/* eslint-disable */
import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { SetToken, RemoveToken, RemoveUserData } from "./actions/index";
import { useHistory } from "react-router-dom";
import "./index.css";

const NavBar = () => {
  const history = useHistory();

  const UserData = useSelector((state) => state.UserData);

  const TokenReducer = useSelector((state) => state.TokenReducer);
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const logout = () => {
    dispatch(RemoveToken());
    dispatch(RemoveUserData());
    history.push("/Login");
  };

  return (
    <div className="navbar">
      <div>
        <nav>
          <ul className="menuItems">
            <li>
              <Link to="/" className="li">
                <Button variant="outline-primary">
                <i style={{ marginRight:5 }}  className="fas fa-home"></i>
                  Accueil</Button>
              </Link>
            </li>
            {!TokenReducer ? (
              <li>
                <Link to="/Login" className="li">
                  <Button variant="outline-primary">
                  <i style={{ marginRight:5 }} className="fas fa-sign-in-alt"></i>
                    Authentifier
                  </Button>
                </Link>
              </li>
            ) : (
              <div style={{ display:'flex' }}>
                <li>
                  <Button onClick={() => logout()} variant="outline-primary">
                    Log out
                  </Button>
                </li>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#0d6efd",
                  }}
                >
                  <i
                    style={{ fontSize: 25, marginRight: 5 }}
                    className="far fa-user-circle"
                  ></i>
                  {UserData && UserData.firstname + " " + UserData.lastname}
                  { UserData && UserData.email === "admin@gmail.com" && ' (ADMIN)' }
                </div>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
