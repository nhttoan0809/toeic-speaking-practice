import os
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

# Base directory for prompts
PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")

@lru_cache()
def load_prompt(filename: str) -> str:
    """
    Load a prompt from the prompts directory.
    
    Args:
        filename: Name of the prompt file (e.g., 'transcriptions.txt')
        
    Returns:
        The content of the prompt file
        
    Raises:
        FileNotFoundError: If the prompt file does not exist
    """
    file_path = os.path.join(PROMPTS_DIR, filename)
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            logger.info(f"Successfully loaded prompt from {filename}")
            return content
    except FileNotFoundError:
        logger.error(f"Prompt file not found: {file_path}")
        raise
    except Exception as e:
        logger.error(f"Error loading prompt from {filename}: {e}")
        raise
