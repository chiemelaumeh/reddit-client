import React, { useEffect } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import axios from "axios";
import { useState, useContext } from "react";
import UserContext, { UserProvider } from "../context/UserContext";
import AuthModalContext from "../context/AuthModalContext";

const Voting = ({ props }) => {
  const [voteState, setVoteState] = useState(0);
  const [upVotedState, setUpVotedState] = useState(false);
  const [downVotedState, setDownVotedState] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setModalVisibility } = useContext(AuthModalContext);
  useEffect(() => {
    console.log(props._id);
    const refreshVotes = async () => {
      const url = `http://localhost:4000/votes/${props._id}/`;
      try {
        const response = await axios.get(url);
        setVoteState(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    refreshVotes();
  }, [props._id]);

  const sendVote = async (direction) => {
    const url = `http://localhost:4000/vote/${props._id}/${direction}`;
    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });

      setVoteState(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleVoteUp = () => {
    if (!user.username) {
      setModalVisibility(true);
    }
    if (upVotedState === false) {
      sendVote("up");
      setUpVotedState(true);
      setDownVotedState(false);
    }
  };
  const handleVoteDown = () => {
    if (!user.username) {
      setModalVisibility(true);
    }

    if (downVotedState === false) {
      if (voteState === 0) return;
      sendVote("down");
      setDownVotedState(true);
      setUpVotedState(false);
    }
  };

  return (
    <div className="voting-div">
      <BiUpvote className="vote-icon" onClick={handleVoteUp} />

      <span className="vote-icon-number">{voteState}</span>
      <BiDownvote className="vote-icon" onClick={handleVoteDown} />
    </div>
  );
};

export default Voting;
