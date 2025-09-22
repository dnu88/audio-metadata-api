const express = require('express');
const axios = require('axios');
const mm = require('music-metadata');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Tes API jalan
app.get('/', (req, res) => res.send('Media metadata API running'));

// Endpoint untuk audio metadata
app.post('/audio-metadata', async (req, res) => {
  try {
    const { audio_url } = req.body;
    if (!audio_url) return res.status(400).json({ error: 'audio_url required' });

    // Download audio dari URL
    const r = await axios.get(audio_url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(r.data);

    // Ambil metadata
    const metadata = await mm.parseBuffer(buffer);
    res.json({
      duration: metadata.format.duration,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      codec: metadata.format.codec,
      container: metadata.format.container
    });
  } catch (err) {
    console.error('audio-metadata error', err.message || err);
    res.status(500).json({ error: String(err.message || err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
