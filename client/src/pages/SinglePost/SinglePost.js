/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./SinglePost.css";
import io from "socket.io-client";
// const socket = io("https://camping-app-tun.herokuapp.com/")
const socket = io("http://localhost:5000");
import { BrowserRouter as Router, useParams } from "react-router-dom";
import axios from "axios";

import Feedback from "./Feedback";
import { SetSingle } from "../../actions/index";
import { useSelector, useDispatch } from "react-redux";
function SinglePost() {
  const dispatch = useDispatch();
  const TokenReducer = useSelector((state) => state.TokenReducer);

  let { id } = useParams();
  const [Array, setArray] = useState([]);
  const [onepost, setonepost] = useState([]);
  const [LIKES, setLIKES] = useState(0);

  useEffect(() => {
    get_post();

    socket.on("LIKE_ONE", (data) => {
   
      setonepost(data)
      setLIKES(data.likes.length)
    });
  }, []);

  const UserData = useSelector((state) => state.UserData);

  const LIKE = async () => {
    let arr = onepost;
    if (onepost.likes.includes(UserData._id)) {
      var i = arr.likes.indexOf(UserData._id);
      arr.likes.splice(i, 1);
      setLIKES(LIKES - 1);
    } else {
      arr.likes.push(UserData._id);
      setLIKES(LIKES + 1);
    }
    setonepost(arr);
    let data = {
      PostId: onepost._id,
      UserId: UserData._id,
    };

    socket.emit("LIKE_ONE", data);
  };

  const get_post = () => {
    axios
      .post("/single_post", { id: id })
      .then(function (res) {
     
        dispatch(SetSingle(res.data));
        setonepost(res.data); 
        setLIKES(res.data.likes.length);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const send_comment = (comment) => {
    let data = {
      comment,
      UserData,
      post_id: onepost._id,
    };
    socket.emit("Comment", data);
  };

  return (
    <div >
       {
        !onepost._id && 
        <div  className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      }

      {onepost._id && (
        <div className="post">
            <b style={{ margin: 10 }}> {onepost.model} </b>
          <div className="img-content">
            <img src={onepost.img} alt="" />
          </div>
        
            
          <div className="like-section">
     
            <span className="like-count"> {LIKES} </span>
            {TokenReducer ? (
              <button
                className="button-like"
                id={onepost._id}
                onClick={() => LIKE(onepost._id)}
              >
                {onepost.likes.includes(UserData._id) ? (
                  <i style={{ color: " #f44336" }} className="fas fa-heart"></i>
                ) : (
                  <i style={{ color:'grey' }} className="far fa-heart"></i>
                )}
              </button>
            ) : (
              <i className="far fa-heart"></i>
            )}
          </div>
         
        </div>
        
      )}
           {TokenReducer && onepost._id && (
            <Feedback send_comment={(comment) => send_comment(comment)} />
          )}
          {
            !TokenReducer && onepost._id &&
            <h6 style={{ marginTop:20 }}>Pour afficher les commentaires vous devez authentfier</h6>
          }
    </div>
  );
}

export default SinglePost;
