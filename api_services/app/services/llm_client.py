import logging
from typing import List, Dict
from config.model_config import LLMConfig
from services.llm.llm_service import LLMService

logger = logging.getLogger(__name__)

class LLMClient:
    """Wrapper around LLM Service for API integration."""
    
    def __init__(self, config: LLMConfig):
        """Initialize LLM client."""
        self.service = LLMService(config)
        logger.info(f"LLMClient initialized with model: {config.model_name}")
    
    def chat(self, messages: List[Dict[str, str]]) -> str:
        """
        Generate chat response from message history.
        
        Args:
            messages: List of message dicts with 'role' and 'content' keys
            
        Returns:
            Generated text response
            
        Raises:
            Exception: If LLM generation fails
        """
        try:
            # Clear existing history and set new messages
            self.service.history = messages
            response = self.service.generate_text()
            
            if response.startswith("Error:"):
                raise Exception(response)
            
            return response
        except Exception as e:
            logger.error(f"LLM chat failed: {e}")
            raise
