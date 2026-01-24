import logging
from typing import Optional
from core.tts_engine import TTSEngine
from config.tts_config import TTSConfig

logger = logging.getLogger(__name__)

class TTSService:
    """
    Service responsible for converting text to audio bytes.
    It does NOT handle playback.
    """
    
    def __init__(self, config: TTSConfig):
        self.engine = TTSEngine(config)
        logger.info(f"TTSService initialized with engine: {config.engine}")
        
    def generate_audio(self, text: str) -> Optional[bytes]:
        """
        Convert text to audio bytes. 
        Returns None if generation fails or text is empty.
        """
        return self.engine.synthesize_to_bytes(text)
