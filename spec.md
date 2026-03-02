# Synapse Studio

## Current State
Full-stack subliminal audio/video creation app. VideoEditorPage has canvas recording, uploaded TTS, uploaded ambient audio, frequency tones, nature sounds, and FFmpeg-based MP4 conversion. The last attempt to fix MP4 and uploaded TTS failed due to build errors.

## Requested Changes (Diff)

### Add
- Store raw ArrayBuffer bytes alongside AudioBuffer for uploaded TTS file so it can be re-decoded into each new AudioContext without cross-context sharing issues

### Modify
- Fix FFmpeg MP4 conversion: use `@ffmpeg/core-mt` multithreaded build with proper CORS headers via `toBlobURL`, fall back gracefully to WebM if WASM fails to load
- Fix uploaded TTS audio in recordings: decode from stored raw bytes into the recording AudioContext instead of sharing AudioBuffer across contexts
- Fix uploaded TTS audio in TTS export: same raw-bytes re-decode approach
- FFmpeg exec command: use `-c:v libx264 -preset ultrafast -c:a aac` instead of `-c:v copy` for reliable MP4 encoding

### Remove
- Nothing

## Implementation Plan
1. Add `uploadedTTSBytes` ref/state (ArrayBuffer) alongside `uploadedTTSBuffer`
2. In `handleTTSFileSelect`, store the raw arrayBuffer in state
3. In `handleRecord`, re-decode `uploadedTTSBytes` into `audioCtx` instead of using `uploadedTTSBuffer`
4. In `handleTTSExport`, same re-decode approach
5. Fix FFmpeg: use `@ffmpeg/core@0.12.6` with `toBlobURL` for both .js and .wasm, catch SharedArrayBuffer not available error, use libx264+aac encoding
6. Add crossOriginIsolated check and fall back to WebM download immediately if COOP/COEP headers aren't set (FFmpeg WASM requires SharedArrayBuffer)
