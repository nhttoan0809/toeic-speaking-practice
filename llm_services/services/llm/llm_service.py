import logging
from typing import Iterator, List, Dict, Optional
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
        
    def generate_text(self, system_prompt: Optional[str] = None) -> str:
        """Generate full text response based on current history."""
        return self.engine.chat(self.history, system=system_prompt)
        
    def generate_stream(self, system_prompt: Optional[str] = None) -> Iterator[str]:
        """Generate streaming response based on current history."""
        return self.engine.stream_chat(self.history, system=system_prompt)
