import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { codeBlocksService } from "../services/api";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import { useSocket } from "../services/useSocket";

const BlockCodePage = () => {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState(null);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { studentCount, role, code, sendCodeUpdate } = useSocket(id);

  // Fetch code block on component mount
  useEffect(() => {
    const initializeCodeBlock = async () => {
      try {
        const block = await codeBlocksService.getCodeBlockById(id);
        setCodeBlock(block);
      } catch (error) {
        console.error("Failed to fetch block:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeCodeBlock();
  }, [id]);

  // Update code block when code changes from socket
  useEffect(() => {
    if (code) {
      setCodeBlock((prevBlock) => ({
        ...prevBlock,
        template: code,
      }));
    }
  }, [code]);

  // Log role changes
  useEffect(() => {
    if (role) {
      console.log("Current role:", role);
    }
  }, [role]);

  const runCode = () => {
    const logs = [];

    try {
      if (!codeBlock?.template) {
        setOutput("No code to execute");
        return;
      }

      const userCode = codeBlock.template.replace(/\s+/g, "").trim();
      const solution = codeBlock.solution.replace(/\s+/g, "").trim();

      if (userCode !== solution) {
        alert("code is incorrect ❌");
        return;
      }

      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      /* eslint-disable no-eval */
      eval(codeBlock.template);
      /* eslint-enable no-eval */

      console.log = originalConsoleLog;

      setOutput(logs.join("\n") || "Code executed successfully");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!codeBlock) {
    return <div>Code block not found</div>;
  }

  return (
    <div className="block-code-page">
      <h1>{codeBlock.title}</h1>
      <h2>{codeBlock.instructions}</h2>
      <p>Number of students in the room: {studentCount?.toString()}</p>
      <p>Your role: {role || "Not assigned"}</p>

      <div className="code-mirror-container">
        <CodeMirror
          value={codeBlock.template}
          height="500px"
          style={{ fontSize: "16px" }}
          extensions={[javascript(), autocompletion()]}
          theme={oneDark}
          readOnly={role === "mentor"}
          onChange={(value) => {
            if (role !== "mentor") {
              setCodeBlock((prevBlock) => ({
                ...prevBlock,
                template: value,
              }));
              sendCodeUpdate(value);
            }
          }}
        />
      </div>

      <button
        onClick={runCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Code
      </button>

      <div className="output-container mt-4 p-4 bg-gray-800 text-white rounded">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default BlockCodePage;
