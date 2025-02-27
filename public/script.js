const searchVideo = async () => {
    const query = document.getElementById('searchQuery').value;
    const videoList = document.getElementById('videoList');
    const loading = document.getElementById('loading');

    if (!query) return alert("Masukkan kata kunci!");

    loading.style.display = "block";
    videoList.innerHTML = "";

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();
        
        loading.style.display = "none";
        
        if (videos.length === 0) {
            videoList.innerHTML = "<p>Video tidak ditemukan!</p>";
            return;
        }

        videos.forEach(video => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${video.thumbnail}" alt="Thumbnail">
                <div>
                    <p><strong>${video.title}</strong></p>
                    <p>Durasi: ${video.timestamp}</p>
                </div>
                <button class="download-btn" onclick="downloadVideo('${video.url}', 'audio')">MP3</button>
                <button class="download-btn" onclick="downloadVideo('${video.url}', 'video')">MP4</button>
            `;
            videoList.appendChild(li);
        });
    } catch (error) {
        loading.style.display = "none";
        alert("Gagal mencari video!");
    }
};

const downloadVideo = async (url, format) => {
    try {
        const response = await fetch(`/download?url=${encodeURIComponent(url)}&format=${format}`);
        const result = await response.json();

        if (result.success) {
            alert(`Download berhasil! Cek hasilnya di terminal.`);
        } else {
            alert("Gagal download!");
        }
    } catch (error) {
        alert("Gagal download!");
    }
};