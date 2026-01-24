import os
import sys
from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache

# Add llm-services to path for imports
LLM_SERVICES_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..', 'llm_services'))
if os.path.exists(LLM_SERVICES_PATH):
    sys.path.insert(0, LLM_SERVICES_PATH)

class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    APP_NAME: str = "Chat API Service"
    APP_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    # CORS
    CORS_ALLOW_ORIGINS: str = "*"
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: str = "*"
    CORS_ALLOW_HEADERS: str = "*"
    
    # LLM Configuration
    LLM_FRAMEWORK: str = "ollama"
    LLM_MODEL_NAME: str = "mistral-small"
    LLM_TEMPERATURE: float = 0.7
    LLM_TOP_P: float = 0.9
    LLM_MAX_TOKENS: int = 2048
    LLM_CONTEXT_WINDOW: int = 8192
    LLM_SYSTEM_PROMPT: str = "You are a helpful and intelligent AI assistant. Answer questions clearly and concisely."
    
    # TTS Configuration
    TTS_ENGINE: str = "edge-tts"
    TTS_EDGE_VOICE: str = "en-US-GuyNeural"
    TTS_EDGE_RATE: str = "+0%"
    TTS_EDGE_VOLUME: str = "+0%"
    TTS_EDGE_PITCH: str = "+0Hz"
    TTS_OUTPUT_DIR: str = "audio_output"
    TTS_OUTPUT_FORMAT: str = "mp3"
    
    # Piper TTS (alternative)
    TTS_PIPER_MODEL_PATH: Optional[str] = None
    
    @property
    def cors_origins_list(self) -> list:
        """Parse CORS origins into a list."""
        if self.CORS_ALLOW_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ALLOW_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
