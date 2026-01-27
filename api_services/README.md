# Chat API Service

Backend API system for chat features powered by prebuilt LLM services.

## Features

- **FastAPI Framework**: Modern, fast web framework with automatic API documentation
- **OpenAI-Compatible Chat**: Standard message format for easy integration
- **Text & Voice Responses**: Generate text or audio responses from chat history
- **Unified Response Format**: Consistent API responses across all endpoints
- **Docker Support**: Containerized deployment with Docker Compose
- **Modular Architecture**: Clean separation of concerns with versioned APIs

## Tech Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI
- **LLM Backend**: Ollama (local)
- **TTS Engine**: Edge-TTS / Piper
- **API Versioning**: `/api/v1`

## Project Structure

```
api-services/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── chat.py          # Chat endpoints (read-aloud tag)
│   │       ├── picture.py        # Placeholder (describe-a-picture tag)
│   │       └── questions.py      # Placeholder (response-to-questions tag)
│   ├── core/
│   │   ├── config.py            # Application settings
│   │   └── logging_config.py    # Logging configuration
│   ├── models/
│   │   ├── chat.py              # Chat request/response models
│   │   └── responses.py         # Unified API response model
│   ├── services/
│   │   ├── llm_client.py        # LLM service wrapper
│   │   └── tts_client.py        # TTS service wrapper
│   └── main.py                  # FastAPI application
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## API Endpoints

### Chat Service (Tag: `read-aloud`)

#### 1. POST `/api/v1/chat/text`

Generate text response from chat history.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ]
}
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "message": "I'm doing well, thank you! How can I help you today?"
  }
}
```

#### 2. POST `/api/v1/chat/voice`

Generate voice response from chat history.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Tell me a joke"}
  ]
}
```

**Response:**
- Content-Type: `audio/mpeg`
- Body: Audio bytes (MP3 format)

### OpenAI-Style Message Format

All chat endpoints accept messages in OpenAI-compatible format:

```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What about Spain?"}
  ]
}
```

**Supported roles**: `system`, `user`, `assistant`

### Placeholder Services

- **Tag: `describe-a-picture`** - No endpoints yet
- **Tag: `response-to-questions`** - No endpoints yet

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   cd api-services
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Ensure Ollama is running:**
   ```bash
   ollama serve
   ```

4. **Run the application:**
   ```bash
   python -m app.main
   # Or with uvicorn:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   cd api-services
   docker-compose up --build
   ```

2. **Access the API:**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs

3. **Stop the service:**
   ```bash
   docker-compose down
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | Chat API Service |
| `PORT` | Server port | 8000 |
| `DEBUG` | Debug mode | false |
| `LOG_LEVEL` | Logging level | INFO |
| `LLM_MODEL_NAME` | Ollama model name | mistral-small |
| `LLM_TEMPERATURE` | LLM temperature | 0.7 |
| `TTS_ENGINE` | TTS engine (edge-tts/piper) | edge-tts |
| `TTS_EDGE_VOICE` | Edge-TTS voice | en-US-GuyNeural |

See [.env.example](.env.example) for complete list.

## Testing

### Test Text Endpoint

```bash
curl -X POST http://localhost:8000/api/v1/chat/text \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Test Voice Endpoint

```bash
curl -X POST http://localhost:8000/api/v1/chat/voice \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me a joke"}
    ]
  }' \
  --output response.mp3
```

### Health Check

```bash
curl http://localhost:8000/health
```

## Unified Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T = any> {
  status_code: number;
  message: string;
  data?: T;
}
```

**Success (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "status_code": 400,
  "message": "Validation error: ..."
}
```

**Note:** The `/chat/voice` endpoint returns raw audio bytes with `Content-Type: audio/mpeg` instead of the unified JSON format.

## Integration with LLM Services

This API integrates with the `llm-services` folder, which provides:

- **LLM Service**: Text generation via Ollama
- **TTS Service**: Audio synthesis via Edge-TTS or Piper

Ensure `llm-services` is located at `../llm-services` relative to this project.

## License

MIT
