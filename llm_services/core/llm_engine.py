import logging
from typing import Iterator, Dict, Any, List, Optional
from config import LLMConfig

try:
    import ollama
except ImportError:
    ollama = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMEngine:
    """
    Abstraction layer for LLM inference.
    Handles interaction with Ollama and potentially other frameworks.
    """
    
    def __init__(self, config: LLMConfig):
        """Initialize LLM engine with configuration."""
        self.config = config
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the underlying LLM client."""
        if self.config.framework == "ollama":
            if ollama is None:
                logger.error("Ollama package not installed. Run 'pip install ollama'")
                return
            
            # Simple check if service is running
            try:
                ollama.list()
                logger.info(f"Connected to Ollama. Using model: {self.config.model_name}")
            except Exception as e:
                logger.error(f"Failed to connect to Ollama: {e}")
                logger.error("Make sure 'ollama serve' is running")
    
    def generate(self, prompt: str) -> str:
        """Generate a single response for a prompt."""
        try:
            response = ollama.generate(
                model=self.config.model_name,
                prompt=prompt,
                system=self.config.system_prompt,
                options=self.config.to_dict()["options"],
                stream=False
            )
            return response['response']
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return f"Error: {str(e)}"
    
    def chat(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> str:
        """
        Chat with conversation history.
        
        Args:
            messages: List of dicts with 'role' and 'content' keys
            system: Optional system prompt to prepend
            
        Returns:
            The complete response text
        """
        try:
            # Prepare messages
            chat_messages = list(messages)
            
            # Use provided system prompt or fallback to config
            system_prompt = system or self.config.system_prompt
            
            # Check if there's already a system message
            has_system = any(msg.get('role') == 'system' for msg in chat_messages)
            
            if not has_system and system_prompt:
                chat_messages.insert(0, {'role': 'system', 'content': system_prompt})
            
            response = ollama.chat(
                model=self.config.model_name,
                messages=chat_messages,
                options=self.config.to_dict()["options"],
                stream=False
            )
            return response['message']['content']
        except Exception as e:
            logger.error(f"Chat failed: {e}")
            return f"Error: {str(e)}"
    
    def stream_chat(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> Iterator[str]:
        """
        Stream chat responses token by token.
        
        Args:
            messages: List of dicts with 'role' and 'content' keys
            system: Optional system prompt to prepend
            
        Yields:
            Response chunks as strings
        """
        try:
            # Prepare messages
            chat_messages = list(messages)
            
            # Use provided system prompt or fallback to config
            system_prompt = system or self.config.system_prompt
            
            # Check if there's already a system message
            has_system = any(msg.get('role') == 'system' for msg in chat_messages)
            
            if not has_system and system_prompt:
                chat_messages.insert(0, {'role': 'system', 'content': system_prompt})

            stream = ollama.chat(
                model=self.config.model_name,
                messages=chat_messages,
                options=self.config.to_dict()["options"],
                stream=True
            )
            
            for chunk in stream:
                content = chunk['message']['content']
                if content:
                    yield content
                    
        except Exception as e:
            logger.error(f"Streaming chat failed: {e}")
            yield f"[Error: {str(e)}]"

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model."""
        try:
            return ollama.show(self.config.model_name)
        except Exception:
            return {}
