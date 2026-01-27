import logging
from typing import List
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.core.config import get_settings
from app.models.chat import ChatRequest, ChatTextResponseData
from app.models.responses import ApiResponse, success_response, error_response
from app.services.llm_client import LLMClient
from app.services.tts_client import TTSClient
from config.model_config import LLMConfig
from config.tts_config import TTSConfig
from app.core.prompt_loader import load_prompt

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize settings
settings = get_settings()

# Initialize LLM and TTS clients
llm_config = LLMConfig(
    framework=settings.LLM_FRAMEWORK,
    model_name=settings.LLM_MODEL_NAME,
    temperature=settings.LLM_TEMPERATURE,
    top_p=settings.LLM_TOP_P,
    max_tokens=settings.LLM_MAX_TOKENS,
    context_window=settings.LLM_CONTEXT_WINDOW,
    system_prompt=settings.LLM_SYSTEM_PROMPT
)

tts_config = TTSConfig(
    engine=settings.TTS_ENGINE,
    edge_voice=settings.TTS_EDGE_VOICE,
    edge_rate=settings.TTS_EDGE_RATE,
    edge_volume=settings.TTS_EDGE_VOLUME,
    edge_pitch=settings.TTS_EDGE_PITCH,
    output_dir=settings.TTS_OUTPUT_DIR,
    output_format=settings.TTS_OUTPUT_FORMAT,
    piper_model_path=settings.TTS_PIPER_MODEL_PATH or ""
)

llm_client = LLMClient(llm_config)
tts_client = TTSClient(tts_config)

@router.post(
    "/chat/text",
    response_model=ApiResponse[ChatTextResponseData],
    summary="Generate text response from chat history",
    description="Process chat history and return AI-generated text response in unified format"
)
async def chat_text(request: ChatRequest) -> ApiResponse[ChatTextResponseData]:
    """
    Generate text response from chat messages.
    
    Args:
        request: Chat request with OpenAI-style message history
        
    Returns:
        ApiResponse with text message data
        
    Raises:
        HTTPException: If LLM generation fails
    """
    try:
        # Convert Pydantic models to dict format for LLM service
        messages = [{"role": msg.role.value, "content": msg.content} for msg in request.messages]
        
        logger.info(f"Processing chat request with {len(messages)} messages")
        
        # Generate response
        response_text = llm_client.chat(messages, system_prompt=request.system_prompt)
        
        # Create response data
        response_data = ChatTextResponseData(message=response_text)
        
        return success_response(data=response_data, message="Success")
        
    except Exception as e:
        logger.error(f"Chat text endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/chat/voice",
    summary="Generate voice response from chat history",
    description="Process chat history and return AI-generated audio response as MP3 bytes",
    responses={
        200: {
            "description": "Audio file in MP3 format",
            "content": {"audio/mpeg": {}}
        },
        500: {
            "description": "Error response in unified format",
            "content": {"application/json": {}}
        }
    }
)
async def chat_voice(request: ChatRequest) -> Response:
    """
    Generate voice response from chat messages.
    
    Args:
        request: Chat request with OpenAI-style message history
        
    Returns:
        Audio bytes with Content-Type: audio/mpeg
        
    Raises:
        HTTPException: If LLM or TTS generation fails
    """
    try:
        # Convert Pydantic models to dict format for LLM service
        messages = [{"role": msg.role.value, "content": msg.content} for msg in request.messages]
        
        logger.info(f"Processing voice chat request with {len(messages)} messages")
        
        # Generate text response
        response_text = llm_client.chat(messages, system_prompt=request.system_prompt)
        logger.info(f"Generated text response: {response_text[:100]}...")
        
        # Generate audio from text (async)
        audio_bytes = await tts_client.generate_audio(response_text)
        
        if not audio_bytes:
            raise HTTPException(status_code=500, detail="Audio generation failed")
        
        logger.info(f"Successfully generated audio: {len(audio_bytes)} bytes")
        
        # Return audio as MP3
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=response.mp3"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat voice endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@router.post(
    "/transcriptions",
    response_model=ApiResponse[ChatTextResponseData],
    summary="Generate transcription with pausing and intonation",
    description="Process text and return English text with pausing/intonation and phonetic transcription"
)
async def transcriptions(request: ChatRequest) -> ApiResponse[ChatTextResponseData]:
    """
    Generate transcription with pausing and intonation.
    
    Args:
        request: Chat request with OpenAI-style message history
        
    Returns:
        ApiResponse with transcribed text message data
        
    Raises:
        HTTPException: If LLM generation fails
    """
    try:
        # Load system prompt from storage (default for this endpoint)
        prompt_from_file = load_prompt("transcriptions.txt")
        
        # Use system_prompt from request if provided, otherwise use the one from file
        system_prompt = request.system_prompt or prompt_from_file
        
        # Convert Pydantic models to dict format for LLM service
        messages = [{"role": msg.role.value, "content": msg.content} for msg in request.messages]
        
        logger.info(f"Processing transcription request with {len(messages)} messages")
        
        # Generate response using the system prompt
        response_text = llm_client.chat(messages, system_prompt=system_prompt)
        
        # Create response data
        response_data = ChatTextResponseData(message=response_text)
        
        return success_response(data=response_data, message="Success")
        
    except FileNotFoundError:
        logger.error("Transcription prompt file not found")
        raise HTTPException(status_code=500, detail="Transcription prompt configuration error")
    except Exception as e:
        logger.error(f"Transcription endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
