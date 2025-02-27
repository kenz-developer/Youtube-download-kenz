const express = require("express");
const ytSearch = require("yt-search");
const { spawn } = require("child_process");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("public"));

// **Search Video**
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query tidak boleh kosong" });

  try {
    const result = await ytSearch(query);
    const videos = result.videos.slice(0, 5).map((video) => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.duration.timestamp,
    }));

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Gagal mencari video" });
  }
});

// **Download MP3 - Langsung ke HP/PC User**
app.get("/api/download", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "URL tidak boleh kosong" });

  const fileName = `music_${Date.now()}.mp3`;
  const filePath = path.join(__dirname, "music", fileName); // Simpan sementara di public

  const ytdlp = spawn("yt-dlp", ["-x", "--audio-format", "mp3", "-o", filePath, videoUrl]);

  ytdlp.on("close", (code) => {
    if (code === 0) {
      res.download(filePath, fileName, (err) => {
        if (!err) {
          fs.unlinkSync(filePath); // Hapus file setelah selesai download
        }
      });
    } else {
      res.redirect(`https://kenz-api.cloudx.biz.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`);
    }
  });
});

// **Start Server**
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));