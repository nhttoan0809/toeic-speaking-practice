from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class MessageRole(str, Enum):
    """Chat message role enum (OpenAI-compatible)."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"

class ChatMessage(BaseModel):
    """Chat message model (OpenAI-compatible)."""
    role: MessageRole
    content: str = Field(..., min_length=1, description="Message content")
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Hello, how are you?"
            }
        }

class ChatRequest(BaseModel):
    """Chat request with message history."""
    messages: List[ChatMessage] = Field(..., min_length=1, description="Chat message history")
    
    @field_validator('messages')
    @classmethod
    def validate_messages(cls, v):
        """Ensure at least one message exists."""
        if not v:
            raise ValueError("At least one message is required")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "messages": [
                    {"role": "user", "content": "Tell me a joke"}
                ]
            }
        }

class ChatTextResponseData(BaseModel):
    """Chat text response data."""
    message: str = Field(..., description="AI-generated text response")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Sure! Why did the programmer quit his job? Because he didn't get arrays!"
            }
        }

class ChatVoiceMetadata(BaseModel):
    """Metadata for voice response."""
    text: str = Field(..., description="Generated text that was converted to audio")
    audio_format: str = Field(default="mp3", description="Audio format")
    duration_estimate: Optional[float] = Field(None, description="Estimated duration in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Hello, this is the text that was converted to audio",
                "audio_format": "mp3",
                "duration_estimate": 3.5
            }
        }
