const express = require("express");

const app = express();
app.use(express.json());

const urlBuilder = word => `https://www.signingsavvy.com/sign/${word}`;

/**
 * 1. words param = "Tihsi sthe thing I want ot translate and such"
 * 2. Parse words, turn into array of strings
 * 3. Using each word, send request to that one cool website and shit
 * 4. get those videos and download them, probably to a assets folder. 
 * 5. Get the path to each video and create an array out of it
 * 6. python merge.py '[\"path/to/clip1\", \"path/to/clip2\"]'
 */


// How to use this
/**
 * 

http://localhost:5000/translate
BODY
{
  "words": "this is the thing I wanna translate"
}

 */
app.post("/translate", async (req, res) => {
    const { words } = req.body;

    if(words && words.length) 
    {
        const wordList = words.split(" ");
        const urls = wordList.map(l => urlBuilder(l));

        const paths = await Promise.all(urls.map(url => downloadVideo(url)));
        const parsedPaths = paths.map(path => `\"${path}\"`);
        const thingToSendToPython = `'[${parsedPaths.join(",")}]'`;

        const pyRes = await callPythonScript(thingToSendToPython);

        res.status(200).send({
            message: pyRes
        });
    }
});

async function downloadVideo(url) {
    // Do this when I get home or sooemthing hahahahaha
}

async function callPythonScript(arg) {
    // Yoooooooo
}


app.listen(process.env.PORT || 5000);