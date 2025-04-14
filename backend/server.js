const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("snippets"));

app.post("/run", async (req, res) => {
  const { language, code } = req.body;
  const id = uuid();
  let filename, command;

  switch (language) {
    case "javascript":
      filename = `${id}.js`;
      fs.writeFileSync(filename, code);
      command = `node ${filename}`;
      break;
    case "python":
      filename = `${id}.py`;
      fs.writeFileSync(filename, code);
      command = `python ${filename}`;
      break;
    case "cpp":
      filename = `${id}.cpp`;
      fs.writeFileSync(filename, code);
      command = `g++ ${filename} -o ${id} && ${id}`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported language." });
  }

  exec(command, (err, stdout, stderr) => {
    fs.unlinkSync(filename);
    if (language === "cpp" && fs.existsSync(`./${id}`)) fs.unlinkSync(`./${id}`);
    return res.json({ output: err ? stderr : stdout });
  });
});

app.post("/save", (req, res) => {
  const { language, code } = req.body;
  const id = uuid();
  fs.writeFileSync(`snippets/${id}.${language}`, code);
  return res.json({ link: `http://localhost:5000/${id}.${language}` });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
