import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./App.css";

const languages = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++"
};

function App() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    const res = await axios.post("http://localhost:5000/run", { code, language });
    setOutput(res.data.output);
  };

  const saveSnippet = async () => {
    const res = await axios.post("http://localhost:5000/save", { code, language });
    alert(`Code saved! Share this link: ${res.data.link}`);
  };

  return (
    <div className="app">
      <h2 className="title">💻 Online Code Editor with Debugging</h2>
      <select onChange={e => setLanguage(e.target.value)} value={language}>
        {Object.keys(languages).map(lang => (
          <option key={lang} value={lang}>{languages[lang]}</option>
        ))}
      </select>
      <Editor
        height="60vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <div className="buttons">
        <button onClick={runCode}>▶️ Run</button>
        <button onClick={saveSnippet}>💾 Save</button>
      </div>
      <pre className="output">{output}</pre>
    </div>
  );
}

export default App;
