import logging
from typing import Iterator, List, Dict
from core.llm_engine import LLMEngine
from config.model_config import LLMConfig

logger = logging.getLogger(__name__)

class LLMService:
    """
    Service responsible for LLM interaction.
    """
    
    def __init__(self, config: LLMConfig):
        self.engine = LLMEngine(config)
        self.history: List[Dict[str, str]] = []
        logger.info(f"LLMService initialized with model: {config.model_name}")
        
    def add_user_message(self, message: str):
        self.history.append({'role': 'user', 'content': message})
        
    def add_assistant_message(self, message: str):
        self.history.append({'role': 'assistant', 'content': message})
        
    def generate_text(self) -> str:
        """Generate full text response based on current history."""
        return self.engine.chat(self.history)
        
    def generate_stream(self) -> Iterator[str]:
        """Generate streaming response based on current history."""
        return self.engine.stream_chat(self.history)
