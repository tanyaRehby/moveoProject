import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { codeBlocksService } from "../services/api";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
import { io } from "socket.io-client";
import { useSocket } from "../services/useSocket";

const BlockCodePage = () => {
  const { id } = useParams(); // takes the id form the URl
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState(null);

  const [output, setOutput] = useState(""); //check
  const { socket, studentCount } = useSocket(id); //custom hook to manage socket connection
  //hook to listen for updates of the student count
  useEffect(() => {
    debugger;
    console.log(studentCount);
    // listen {for student count updates from the socket server
  }, []);
  //hook to fetch the codeblock data based on the room id
  useEffect(() => {
    const initlizeCodeBlock = async () => {
      try {
        const block = await codeBlocksService.getCodeBlockById(id);
        // if (!block) {
        //   navigate("./LobbyPage"); ///////////////////////////// check
        // }
        setCodeBlock(block);
      } catch (error) {
        console.error("fail to fetch block", error);
      }
    };
    initlizeCodeBlock();
  }, [id]);

  console.log("id", id); //check
  //check
  const runCode = () => {
    // if(codeBlock.solution==codeBlock){

    // }
    try {
      // הרצת הקוד באמצעות eval() ותפיסת התוצאה
      const result = eval(codeBlock.template); // זה יכול להפעיל רק קוד JavaScript
      setOutput(result); // עדכון ה-output בתוצאה של הקוד
    } catch (error) {
      setOutput("Error: " + error.message); // טיפול בשגיאה אם יש
    }
  };
  return (
    /////////////////checkkkkkkkkkkk
    <div className="block-code-page">
      <h1>{codeBlock?.title}</h1>
      <p>Number of students in the room: {studentCount?.toString()}</p>
      <div className="code-mirror-container">
        <CodeMirror // //////////////////////////////////////////////check
          value={codeBlock?.template} // the initial codeblock template to display in the editor
          height="500px"
          style={{ fontSize: "16px" }}
          extensions={[javascript(), autocompletion()]} //js and autocompletion features
          theme={oneDark} //dark theme that makes syntax highlighting
          //check
          onInput={(value) => {
            console.log("Updated Code:", value);
            setCodeBlock(value);
          }}
        />
      </div>
      <button onClick={runCode}>Run Code</button> {/* to run the code*/}
      {/*display the output*/}
      <div className="output-container">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default BlockCodePage;
