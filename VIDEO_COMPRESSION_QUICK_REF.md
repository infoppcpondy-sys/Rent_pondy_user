# Quick Reference: Video Compression API

## Function Signature
```javascript
compressVideo(file, onProgressCallback = null, targetSizeKB = 200)
```

## Quick Start

### Basic Usage
```javascript
import { compressVideo } from './utils/propertyUtils';

const compressed = await compressVideo(videoFile);
```

### With Progress Tracking
```javascript
const compressed = await compressVideo(
  videoFile,
  (progress) => {
    console.log(`Compression: ${progress}%`);
    setProgressBar(progress);
  }
);
```

### With Custom Target Size
```javascript
const compressed = await compressVideo(
  videoFile,
  (progress) => setProgress(progress),
  100  // Target 100KB instead of 200KB
);
```

## Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `file` | File | - | Video file to compress |
| `onProgressCallback` | Function | null | Called with progress 0-100 |
| `targetSizeKB` | Number | 200 | Maximum output size in KB |

## Return Value

**Promise<File>**

Resolves with:
- `File` object containing compressed video
- Same name with "_compressed.webm" suffix
- Type: "video/webm"

Rejects with:
- Error if compression fails
- Error if final size exceeds target

## Error Handling

```javascript
try {
  const compressed = await compressVideo(file);
  // Use compressed video
} catch (error) {
  console.error('Compression failed:', error.message);
  // Use original file as fallback
  const fallback = file;
}
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to load video" | Invalid file | Check file format (MP4, WebM, MOV) |
| "Compressed video... exceeds 200KB" | Too large after compression | Use lower targetSizeKB or shorter video |
| (No error, slow compression) | Large video | Expected, show loading indicator |

## Integration Pattern (EditProperty)

```javascript
// 1. Setup state
const [isCompressing, setIsCompressing] = useState(false);
const [progress, setProgress] = useState(0);
const [status, setStatus] = useState("");

// 2. Import function
import { compressVideo } from './utils/propertyUtils';

// 3. Handle upload
const handleVideoChange = async (e) => {
  const file = e.target.files[0];
  
  try {
    setIsCompressing(true);
    setProgress(0);
    setStatus("Compressing...");
    
    const compressed = await compressVideo(
      file,
      (p) => {
        setProgress(p);
        setStatus(`Compressing... ${p}%`);
      }
    );
    
    setStatus(`Done: ${(file.size/1024/1024).toFixed(1)}MB → ${(compressed.size/1024).toFixed(0)}KB`);
    setVideo(compressed);
  } catch (error) {
    setStatus(`Error: ${error.message}`);
    setVideo(file); // Fallback to original
  } finally {
    setIsCompressing(false);
  }
};

// 4. Disable button during compression
<button disabled={isCompressing}>Submit</button>

// 5. Show progress UI
{isCompressing && (
  <div>
    <p>{status}</p>
    <div style={{width: `${progress}%`, height: '10px', background: '#ff9800'}}></div>
  </div>
)}

// 6. Submit with compressed video
const formData = new FormData();
formData.append('video', video);  // Compressed file
```

## Compression Specs

| Parameter | Value |
|-----------|-------|
| Output Resolution | 320px width |
| Frame Rate | 10 FPS |
| Bitrate | ≤ 100 kbps |
| Codec | WebM/VP8 |
| Target Size | 200 KB (configurable) |
| Typical Ratio | 250:1 (50MB → 195KB) |

## Browser Support

✅ Chrome 49+  
✅ Firefox 25+  
✅ Safari 14.1+  
✅ Edge 79+  
❌ Internet Explorer (not supported)

## Performance

| Duration | Time | Output Size |
|----------|------|------------|
| 10 sec | 8-12 sec | ~80 KB |
| 30 sec | 20-30 sec | ~150 KB |
| 60 sec | 40-60 sec | ~195 KB |

## Real-World Example

```javascript
import React, { useState } from 'react';
import { compressVideo } from './utils/propertyUtils';

function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressVideo(
        file,
        (p) => setProgress(p)
      );
      setVideo(compressed);
      alert(`Success! ${(file.size/1024/1024).toFixed(1)}MB → ${(compressed.size/1024).toFixed(0)}KB`);
    } catch (error) {
      alert('Compression failed: ' + error.message);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange}
        disabled={isCompressing}
      />
      
      {isCompressing && (
        <div>
          <p>Compressing... {progress}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}

      {video && (
        <div>
          <video width="200" controls>
            <source src={URL.createObjectURL(video)} />
          </video>
          <p>Ready to upload: {(video.size/1024).toFixed(0)}KB</p>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
```

## Troubleshooting

**Q: Compression is taking too long**  
A: Normal for large videos (>30 seconds). Show loading indicator.

**Q: Final size still too large**  
A: Use smaller targetSizeKB or shorter input video.

**Q: Video won't play after compression**  
A: Browser may not support WebM. Add format converter or use fallback.

**Q: Progress callback never fires**  
A: Callback is fired during playback. Ensure video plays without errors.

**Q: Memory usage is high**  
A: Normal during processing. Garbage collector will clean up after.

## Advanced Usage

### Parallel Compression
```javascript
const files = [video1, video2, video3];
const compressed = await Promise.all(
  files.map(file => compressVideo(file, null, 200))
);
```

### Progress with Timeout
```javascript
const timeout = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 60000)
);

const compressed = await Promise.race([
  compressVideo(file, onProgress),
  timeout
]);
```

### Batch Compression with Rate Limiting
```javascript
async function compressSequential(files) {
  const results = [];
  for (const file of files) {
    const compressed = await compressVideo(file);
    results.push(compressed);
    await new Promise(r => setTimeout(r, 100)); // Delay between compressions
  }
  return results;
}
```

## API Location

📁 File: `src/utils/propertyUtils.js`  
📝 Exported as: `compressVideo`  
✅ Status: Production Ready

## Related Documentation

- 📖 Full Guide: `VIDEO_COMPRESSION_IMPLEMENTATION.md`
- 📊 Summary: `IMPLEMENTATION_SUMMARY.md`
- 💻 Source Code: `src/EditProperty.jsx` (integration example)
- 📚 Reference: `src/Components/AddProperty.jsx` (similar pattern)
