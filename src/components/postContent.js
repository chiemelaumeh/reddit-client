import React, { useState } from "react";
import TimeAgo from "timeago-react";
import { useContext } from "react";
import { FaShare } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserContext from "../context/UserContext";
import RedirectContext from "../context/RedirectContext";
import RerenderContext from "../context/RerenderContext";
import Voting from "./Voting";

import AuthModalContext from "../context/AuthModalContext";
import { Link } from "react-router-dom";

import axios from "axios";
<TimeAgo datetime={"2016-08-08 08:08:08"} locale="zh_CN" />;

const PostContent = (props) => {
  const postComments = [props];
  const [shareBox, setSharebox] = useState("")
  const [realArticles, setRealArticles ] = useState([])

  const {
    setPostModalVisibility,
    setModalVisibility,
    lightMode,
    showEditandDelete,
    setShowEditandDelete,
    deleteModalVisibility,
    setDeleteModalVisibility,
    confirmDeleteVisibility,
    setConfirmDeleteVisibility,
  } = useContext(AuthModalContext);
  const { user } = useContext(UserContext);
  const { setRedirect, showHeader, setShowHeader } = useContext(RedirectContext);
  const { setDeleted } = useContext(RerenderContext);


  const theLightMode = lightMode ? "post-icon-light" : "post-icon";
  const deleteOnePost = async () => {
    try {
      const response = await axios.delete(`/delete/${props.id}`);
      setDeleted(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const fetchReal = async() => {
  //   try {
  //     const response = await axios.get("https://newsapi.org/v2/everything?q=tesla&from=2023-10-12&sortBy=publishedAt&apiKey=ea6a8c6758644057912459fd1c3d169c")
  //     setRealArticles(response.data.articles)
  //   } catch (error) {
  //     console.log(error.message)
      
  //   }
  // }
  // fetchReal()

  const navigateToCommunity = () => {
    setRedirect(`/r/` + props.chosenCommunity);
    setShowHeader(true)
  };

  const popUpModal = () => {
    if (!user.username) {
      setModalVisibility(true);
    } else {
      setPostModalVisibility(true);
    }
  };
  

  return (
    <div>
      {postComments.map((singleComment, index) => {
        return (
          <div key={index}>
            <div className="text-dots">
              <div className="posted-by-h5">
                {" "}
                Posted by {singleComment.author}, in{" "}
                <p onClick={navigateToCommunity} className="community-text">
                  {" "}
                  m/{singleComment.chosenCommunity}
                </p>{" "}
                - <TimeAgo datetime={singleComment.postedAt} />{" "}
              </div>

              {singleComment._id === showEditandDelete && (
                <div id={singleComment._id} className="edit-delete-div">
                  {!confirmDeleteVisibility && (
                    <button
                      onClick={() => {
                        setShowEditandDelete(false);
                      }}
                      className="edit-btn"
                    >
                      Cancel
                    </button>
                  )}
                  {confirmDeleteVisibility && (
                    <button
                      id={singleComment.id}
                      onClick={() => {
                        deleteOnePost();
                        setShowEditandDelete(false);
                      }}
                      className="confirm-delete-btn"
                    >
                      {" "}
                      Yes, Delete
                    </button>
                  )}
                  <button
                    className={
                      !deleteModalVisibility ? "delete-btn" : "hide-delete-btn"
                    }
                    id={singleComment.id}
                    onClick={() => {
                      setDeleteModalVisibility(true);
                      setConfirmDeleteVisibility(true);
                    }}
                  >
                    Delete
                  </button>
                  {deleteModalVisibility && (
                    <button
                      onClick={() => {
                        setShowEditandDelete(false);
                      }}
                      className="edit-btn"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {/* {singleComment.author === user.username && !showEditandDelete && ( */}
                <BsThreeDotsVertical
                  className="dots"
                  id={singleComment._id}
                  onClick={() => {
                    if (!showEditandDelete) {
                      setShowEditandDelete(singleComment._id);
                    } else {
                      setShowEditandDelete(false);
                    }
                    setConfirmDeleteVisibility(false);
                    setDeleteModalVisibility(false);
                  }}
                />
              {/* )} */}
            </div>
            <h2>{singleComment.title}</h2>
            <div className="post-text">{singleComment.body}</div>
          </div>
        );
      })}
      <div className="vote-reply">
        <Voting props={props} />
        <Link
          // to={"/comments/" + (props.rootId || props._id)}
          state={{ commentId: props.rootId || props._id }}
        >
          <FaRegCommentDots onClick={popUpModal} className={theLightMode} />
        </Link>
        {/* {
          shareBox   &&(

          <div className="share-box">
      
            <FacebookShareButton
              url={`http://myreddit-api.onrender.com/comments/${props._id}`}
            >
              
              <FacebookIcon></FacebookIcon>
            </FacebookShareButton>
          </div>
          )

        }
        <FaShare onClick={()=>{setSharebox(!shareBox)}} className={theLightMode} /> */}
      </div>
    </div>
  );
};

export default PostContent;
