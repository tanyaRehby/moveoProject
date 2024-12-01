import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { codeBlocksService } from "../services/api"; //importing the service to interact with the backend API

// component displays a list of codeblocks that a user can choose from
const LobbyPage = () => {
  // state to store the list of codeblocks retrieved from the server
  const [codeBlocks, setCodeBloks] = useState([]);
  //hook to navigate to different routes
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        //fetch all code blocks from the backend
        const blocks = await codeBlocksService.getAllCodeBlocks();
        setCodeBloks(blocks); //update the state with the fetched codeblocks
      } catch (error) {
        console.error("fail to fetch blocks", error);
      }
    };
    fetchCodeBlock();
  }, []);
  const handleBlockClick = (blockId) => {
    navigate(`/block/${blockId}`); //navigate to the BlockCodePage with the block id
  };
  return (
    <body>
      <div className="lobby-page">
        <h1>Choose code block</h1>
        {/*map over the list of codeblocks*/}
        {codeBlocks?.map((block) => {
          return (
            <div
              className="code-block"
              key={block._id}
              onClick={() => handleBlockClick(block._id)}
            >
              {block.title}
              {/*display the block title */}
            </div>
          );
        })}
      </div>
    </body>
  );
};

export default LobbyPage;
