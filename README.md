# Self-Hosted LLM with TTS Integration

This project provides verification scripts and setup instructions for self-hosting a Large Language Model (LLM) with Text-to-Speech (TTS) capabilities on Apple M4 Pro (24GB RAM).

## 📋 Quick Start

### Prerequisites

1. **macOS Sonoma (v14) or newer**
2. **Apple Silicon (M4 Pro with 24GB RAM)**
3. **Python 3.8+**

### Installation Steps

#### 1. Install Ollama

Download and install Ollama from [ollama.ai](https://ollama.ai/download) or use Homebrew:

```bash
brew install ollama
```

Start Ollama service:

```bash
ollama serve
```

#### 2. Download a Model

Choose one of the recommended models:

```bash
# Option A: Mistral Small 3 (24B) - Best balance for 24GB RAM
ollama pull mistral-small

# Option B: Qwen QwQ (32B) - Advanced reasoning
ollama pull qwq:32b

# Option C: Qwen2.5 Coder (32B) - Best for coding tasks
ollama pull qwen2.5-coder:32b
```

The download will take some time (~14-18GB depending on model).

#### 3. Set Up Python Environment

```bash
# Create virtual environment (in this directory)
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install Python dependencies
pip install ollama piper-tts

# Optional: Install edge-tts as alternative
pip install edge-tts
```

#### 4. Download TTS Voice Models (for Piper)

```bash
# Create directory for TTS models
mkdir -p ~/tts-models
cd ~/tts-models

# Download Piper voice model (en_US-lessac-medium)
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
```

**Alternative:** If you prefer Edge-TTS (requires internet), skip the Piper model download.

## 🧪 Running Verification Tests

### Test 1: Verify LLM

```bash
python tests/verify_llm.py
```

This tests:

- Ollama connection
- Model response generation
- Basic natural language understanding

**Options:**

```bash
# Test with different model
python tests/verify_llm.py --model qwq:32b

# See all options
python tests/verify_llm.py --help
```

### Test 2: Verify TTS

```bash
# Test Piper TTS
python tests/verify_tts.py --engine piper

# Test Edge-TTS (requires internet)
python tests/verify_tts.py --engine edge-tts
```

This tests:

- TTS engine installation
- Audio file generation
- Audio playback

**Options:**

```bash
# Custom text
python tests/verify_tts.py --engine piper --text "Hello, world!"

# Custom Piper model
python tests/verify_tts.py --engine piper --model ~/my-models/voice.onnx

# See all options
python tests/verify_tts.py --help
```

### Test 3: Verify Combined LLM + TTS

```bash
python tests/verify_combined.py
```

This tests the complete pipeline:

1. LLM generates a response
2. TTS converts response to speech
3. Audio is played

**Options:**

```bash
# Different model and question
python tests/verify_combined.py --model qwq:32b --question "What is Python?"

# Use Edge-TTS instead of Piper
python tests/verify_combined.py --tts-engine edge-tts

# See all options
python tests/verify_combined.py --help
```

## ✅ Expected Results

### Successful LLM Test

```
==============================================================
LLM Verification Test
==============================================================

Model: mistral-small
Test Query: 'What is the capital of France? Answer in one sentence.'

Connecting to Ollama and generating response...
------------------------------------------------------------

✓ Response received:
The capital of France is Paris.

------------------------------------------------------------
✅ LLM test PASSED!
==============================================================
```

### Successful TTS Test

```
==============================================================
Piper TTS Verification Test
==============================================================

Model: /Users/username/tts-models/en_US-lessac-medium.onnx
Text: 'Hello, this is a test of the text to speech system.'

Generating speech...
------------------------------------------------------------
✓ Audio file created: verify_tts_output.wav
✓ File size: 123456 bytes

Playing audio...
------------------------------------------------------------
✅ Piper TTS test PASSED!
==============================================================
```

### Successful Combined Test

```
==============================================================
Combined LLM + TTS Verification Test
==============================================================

LLM Model: mistral-small
TTS Engine: piper
Question: 'What is artificial intelligence? Answer in one short sentence.'

==============================================================

[STEP 1/3] Generating LLM response...
Asking LLM (mistral-small): 'What is artificial intelligence? Answer in one short sentence.'
------------------------------------------------------------

✓ LLM Response:
Artificial intelligence is the simulation of human intelligence by machines.

------------------------------------------------------------

[STEP 2/3] Converting to speech...
Converting to speech with Piper...
✓ Audio generated: combined_test_piper.wav

[STEP 3/3] Playing audio...
Playing audio...
✓ Audio played successfully

==============================================================
✅ Combined LLM + TTS test PASSED!
==============================================================

Summary:
  • LLM responded successfully
  • TTS converted 68 characters to speech
  • Audio played successfully
==============================================================
```

## 🔧 Troubleshooting

### Ollama Issues

**Problem:** `Connection refused` or `Ollama not running`

```bash
# Start Ollama service
ollama serve

# In another terminal, check if it's running
ollama list
```

**Problem:** Model not found

```bash
# List downloaded models
ollama list

# Pull the required model
ollama pull mistral-small
```

### Piper TTS Issues

**Problem:** `piper: command not found`

```bash
# Reinstall piper-tts
pip install --upgrade piper-tts
```

**Problem:** Model file not found

```bash
# Verify model exists
ls -lh ~/tts-models/

# Re-download if needed (see Installation Steps above)
```

### Edge-TTS Issues

**Problem:** `edge-tts: command not found`

```bash
pip install edge-tts
```

**Problem:** Timeout or connection error

- Edge-TTS requires internet connection
- Check your network connection
- Try again or use Piper instead

## 📊 Model Recommendations

| Model                 | Size (Q4) | Best For                              | RAM Usage |
| --------------------- | --------- | ------------------------------------- | --------- |
| **Mistral Small 3**   | ~14GB     | General NLU, balanced performance     | ~15GB     |
| **Qwen QwQ 32B**      | ~18GB     | Advanced reasoning, complex questions | ~19GB     |
| **Qwen2.5 Coder 32B** | ~18GB     | Code generation, technical tasks      | ~19GB     |
| Llama 3.1 8B          | ~5GB      | Quick responses, simple tasks         | ~6GB      |

All models run efficiently on Apple M4 Pro (24GB RAM) with Metal acceleration.

## 🚀 Running the Full Application

Now that you have verified the components, you can run the full interactive assistant:

```bash
# Run with default settings (Mistral Small + Edge-TTS)
python main.py

# Run with specific model
python main.py --model qwq:32b

# Switch to Piper TTS (offline)
python main.py --tts-engine piper
```

### Key Features

- **Interactive Chat**: Remembers conversation history
- **Streaming Response**: Shows text as it generates
- **Voice Output**: Reads responses aloud automatically
- **Robustness**: Handles errors gracefully

## 🎯 Next Steps

Once all verification tests pass, you can:

1. **Build the full application** - Create a complete LLM + TTS application (see implementation plan)
2. **Experiment with models** - Try different models for different use cases
3. **Customize TTS voices** - Download additional Piper voices from [Hugging Face](https://huggingface.co/rhasspy/piper-voices)
4. **Integrate into your projects** - Use these scripts as foundation for your own applications

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Piper TTS Repository](https://github.com/rhasspy/piper)
- [Edge-TTS Documentation](https://github.com/rhasspy/piper-voices)
- [Implementation Plan](/.gemini/antigravity/brain/33b8ba41-70a6-440c-bd3d-9af6d71255e4/implementation_plan.md)

## 📝 License

These verification scripts are provided as-is for testing and development purposes.
