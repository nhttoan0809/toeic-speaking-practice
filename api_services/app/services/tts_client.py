import logging
from typing import Optional
from config.tts_config import TTSConfig
from core.tts_engine import TTSEngine

logger = logging.getLogger(__name__)

class TTSClient:
    """Wrapper around TTS Service for API integration."""
    
    def __init__(self, config: TTSConfig):
        """Initialize TTS client."""
        self.config = config
        self.engine = TTSEngine(config)
        logger.info(f"TTSClient initialized with engine: {config.engine}")
    
    async def generate_audio(self, text: str) -> Optional[bytes]:
        """
        Generate audio bytes from text (async version).
        
        Args:
            text: Text to convert to speech
            
        Returns:
            Audio bytes in MP3 format, or None if generation fails
            
        Raises:
            Exception: If TTS generation fails critically
        """
        try:
            if not text or not text.strip():
                logger.warning("Empty text provided for TTS generation")
                return None
            
            # Use the async edge-tts synthesis if using edge-tts
            if self.config.engine == "edge-tts":
                audio_bytes = await self.engine.synthesize_bytes_edge_tts(text)
            else:
                # For piper or other sync engines
                audio_bytes = self.engine.synthesize_to_bytes(text)
            
            if audio_bytes is None:
                logger.error("TTS engine returned None")
                raise Exception("Audio generation failed")
            
            logger.info(f"Generated audio: {len(audio_bytes)} bytes")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            raise
