const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");
const stream = require("stream");
const { promisify } = require("util");
const { createWriteStream } = require("fs");
const { spawn } = require("child_process");

const app = express();
app.use(express.json());
app.use(express.static("./videos/final"));
app.use(cors());

const urlBuilder = (word) => `https://www.signingsavvy.com/sign/${word}`;

/**
 * 1. words param = "Tihsi sthe thing I want ot translate and such"
 * 2. Parse words, turn into array of strings
 * 3. Using each word, send request to that one cool website and shit
 * 4. get those videos and download them, probably to a assets folder.
 * 5. Get the path to each video and create an array out of it
 * 6. python merge.py '[\"path/to/clip1\", \"path/to/clip2\"]'
 */

app.get("/videos/final/:fileName", (req, res) => {
  res.sendFile(
    path.resolve(`${__dirname}/../videos/final/${req.params.fileName}`)
  );
});

// How to use this
/**

http://localhost:5000/translate
BODY
{
  "words": "this is the thing I wanna translate"
}

*/
app.post("/translate", async (req, res) => {
  const { words } = req.body;

  if (words && words.length) {
    const wordList = words.split(" ");
    const urls = wordList.map((l) => [l, urlBuilder(l)]);

    const paths = (
      await Promise.all(urls.map(([word, url]) => downloadVideo(url, word)))
    ).filter((e) => !!e);

    if (paths.length == 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    const parsedPaths = paths.map((path) => `\"${path}\"`);
    const thingToSendToPython = `[${parsedPaths.join(",")}]`;
    const pyRes = await callPythonScript(thingToSendToPython);
    const linkToMergedVid = `http://198.199.90.102:5000/${pyRes}`;

    res.status(200).send({
      link: linkToMergedVid,
    });
  }
});

async function getVideoLink(url) {
  try {
    const resp = await axios.get(url);
    const body = await resp.data;
    const $ = cheerio.load(body);

    // Check if we have access to vid
    const access = $(
      `#main_content_left > div.content_module > div.search_results`
    );
    if (access.length) {
      const redirect = access
        .children()
        .first()
        .children()
        .first()
        .children()
        .first()
        .attr().href;

      const redirRes = await axios.get(
        `https://www.signingsavvy.com/${redirect}`
      );
      const redirBody = redirRes.data;

      const $$ = cheerio.load(redirBody);
      const link = $$(
        `#main_content_left > div.content_module > div > div.signing_body > div > link`
      ).attr().href;

      return link;
    } else {
      const link = $(
        `#main_content_left > div.content_module > div > div.signing_body > div > link`
      ).attr().href;
      return link;
    }
  } catch (err) {
    return undefined;
  }
}

async function downloadVideoToServer(videoUrl, filePath) {
  try {
    const finished = promisify(stream.finished);
    const writer = createWriteStream(filePath);
    return axios({
      method: "get",
      url: videoUrl,
      responseType: "stream",
    }).then((response) => {
      response.data.pipe(writer);
      return finished(writer);
    });
  } catch (err) {
    console.log(err);
  }
}

async function downloadVideo(url, word) {
  try {
    const videoUrl = await getVideoLink(url);
    const filePath = path.join("./src", "..", "videos", `${word}.mp4`);
    await downloadVideoToServer(videoUrl, filePath);
    return `./videos/${word}.mp4`;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function callPythonScript(arg) {
  var dataToSend;
  const python = spawn("python", ["./scripts/merge.py", arg]);
  return new Promise((resolve, reject) => {
    python.stdout.on("data", (data) => {
      dataToSend = data.toString();
      console.log(dataToSend);
    });

    python.stderr.on("data", (data) => {
      console.log("ERROR:", data.toString());
    });

    python.on("exit", (code) => {
      if (code != 0) reject("An error has occured! Scroll up!");

      console.log("Finished running merge.py", code);
      console.log(dataToSend);
      dataToSend = dataToSend.split("XX");
      dataToSend = dataToSend[dataToSend.length - 1];
      resolve(dataToSend);
    });
  });
}

app.listen(process.env.PORT || 5000, () => console.log("Started backend"));
