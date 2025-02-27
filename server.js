const express = require("express");
const ytSearch = require("yt-search");
const { spawn } = require("child_process");
const ytdl = require("ytdl-core") 
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Midd
app.use(cors())
app.use(express.static("public")) 

app.get("/api/search", async (req, res) => {
  res.json({ error: "Fitur search perlu API tambahan!" });
});

app.get("/api/download", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL tidak boleh kosong!" });

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "URL tidak valid!" });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ""); // Hilangkan karakter aneh

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Gagal mendownload, coba lagi!" });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
