/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";
import { SetData } from "../../actions";
import { useHistory } from "react-router-dom";
import NewPost from "../NewPost/NewPost";

import io from "socket.io-client";
const socket = io("");

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true)
  const [Array, setArray] = useState([]);
  const [DisableLIKE, setDisableLIKE] = useState(false);
  const UserData = useSelector((state) => state.UserData);
  const [Modal, setModal] = useState(false);
  const [LISTS, setLISTS] = useState([]);

  const TokenReducer = useSelector((state) => state.TokenReducer);
  // var Posts = useSelector((state) => state.Posts);

  useEffect(() => {
    GetPosts();
  }, []);

  useEffect(() => {
    socket.on("LIKE", (data) => {
      dispatch(SetData(data));
    });
  }, [Array]);

  const LIKE = async (PostId) => {
    document.getElementById(PostId).disabled = true;
    let data = {
      PostId,
      UserId: UserData._id,
    };

    const newList = [...LISTS];
    const index = newList.findIndex((el) => el._id === PostId);

    var i = newList[index].likes.indexOf(UserData._id);
    if (i > -1) {
      newList[index].likes.indexOf(UserData._id);
      if (index !== -1) newList[index].likes.splice(i, 1);
    } else newList[index].likes.push(UserData._id);

    setLISTS(newList);

    socket.emit("LIKE", data);
  };

  const show_modal = () => {
    setModal(true);
  };

  const GetPosts = () => {
    axios
      .get("/get_posts")
      .then(function (res) {
        // handle success
        dispatch(SetData(res.data));
        setArray(res.data);
        setLISTS(res.data);
        setLoading(false)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const SinglePost = (PostID) => {
    history.push(`/post/${PostID}`);
  };

  return (
    <div>
     
      {TokenReducer && UserData.email === "admin@gmail.com" && (
        <div onClick={() => show_modal()} className="ADD">
          <i className="fas fa-plus"></i>
        </div>
      )}
      {Modal && (
        <NewPost
          update_data={() => GetPosts()}
          HideModal={() => setModal(false)}
        />
      )}
      <div>
        <h2>Showroom Cars</h2>
        {
        Loading && 
        <div  className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      }
        <ResponsiveMasonry
          className="masonry"
          columnsCountBreakPoints={{ 450: 1, 550: 2, 900: 3 }}
        >
          <Masonry>
            {LISTS.map((post) => (
              <div key={post._id} className="">
                <div className="single-post">
                  {/* <div onClick={() => SinglePost(post._id)} className="owner">
                    <i className="far fa-user-circle"></i>
                    {post.owner}{" "}
                  </div> */}
                  <img
                    onClick={() => SinglePost(post._id)}
                    className="img-places"
                    src={post.img}
                    alt=""
                  />

                  <div className="desc">
                    <b> {post.model} </b>
                    <br />
                    {post.description.length > 0 ? (
                      post.description
                    ) : (
                      <p className="no-desc">No description</p>
                    )}
                  </div>
                  <div className="like-section">
                    <span className="like-count"> {post.likes.length} </span>
                    {TokenReducer ? (
                      <button
                        className="button-like"
                        id={post._id}
                        onClick={() => LIKE(post._id)}
                      >
                        {post.likes.includes(UserData._id) ? (
                          <i
                            style={{ color: " #f44336" }}
                            className="fas fa-heart"
                          ></i>
                        ) : (
                          <i
                            style={{ color: "grey" }}
                            className="far fa-heart"
                          ></i>
                        )}
                      </button>
                    ) : (
                      <i className="far fa-heart"></i>
                    )}
                    <div onClick={()=> SinglePost(post._id)} className="comment-section">
                      <i className="far fa-comment"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
};

export default Home;
