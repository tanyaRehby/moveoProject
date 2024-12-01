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
  const { id } = useParams(); //extracting the id from the URL parameters
  const [codeBlock, setCodeBlock] = useState(null); // state to store the code block data
  const [output, setOutput] = useState(""); // state to store the output of the executed code
  const { socket, studentCount, role, code, sendCodeUpdate } = useSocket(id); // using the custom hook to manage socket connections and get room data

  useEffect(() => {
    const initializeCodeBlock = async () => {
      try {
        const block = await codeBlocksService.getCodeBlockById(id); // fetch code block by id
        setCodeBlock(block); // setting the fetched codeblock to state
      } catch (error) {
        console.error("Failed to fetch block:", error);
      }
    };
    initializeCodeBlock();
  }, [id]); // effect runs every time the 'id' parameter changes
  useEffect(() => {
    if (role) {
      console.log(role); // log the role mentor or student when it is set
    }
  }, [role]); // effect runs when the role changes

  const runCode = () => {
    const logs = [];
    const customConsule = {
      log: (...args) => {
        logs.push(args.join(" "));
      },
    };
    debugger;
    try {
      if (!codeBlock?.template) {
        setOutput("no code to executing");
        return;
      }

      const fn = new Function("console", codeBlock.template);
      fn(customConsule);

      setOutput(logs.join("\n") || "code execute sucssesfuly");
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };
  useEffect(() => {
    if (code) {
      setCodeBlock((prevBlock) => ({
        ...prevBlock,
        template: code,
      }));
    }
  }, [code]);
  return (
    <div className="block-code-page">
      <h1>{codeBlock?.title}</h1>
      <h2>{codeBlock?.instructions}</h2>
      <p>Number of students in the room: {studentCount?.toString()}</p>
      <div className="code-mirror-container">
        <CodeMirror
          value={codeBlock?.template} // the initial codeblock template to display in the editor
          height="500px"
          style={{ fontSize: "16px" }}
          extensions={[javascript(), autocompletion()]} //js and autocompletion features
          theme={oneDark} //dark theme that makes syntax highlighting
          //check
          onChange={(value) => {
            setCodeBlock((prevBlock) => ({
              ...prevBlock,
              template: value,
            }));
            sendCodeUpdate(code);
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
