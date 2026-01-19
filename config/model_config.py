from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List

@dataclass
class LLMConfig:
    """Configuration for LLM model."""
    
    # Framework and Model
    framework: str = "ollama"  # Options: "ollama", "llama-cpp" 
    model_name: str = "mistral-small"
    model_path: Optional[str] = None  # Full path for llama.cpp models
    
    # Inference Parameters
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: int = 2048
    context_window: int = 8192
    
    # System Prompt
    system_prompt: str = (
        "You are a helpful and intelligent AI assistant. "
        "Answer questions clearly and concisely."
    )
    
    # Advanced Options
    seed: Optional[int] = None
    stream: bool = True  # Enable streaming by default for better responsiveness
    stop_sequences: List[str] = field(default_factory=lambda: ["User:", "\n\nUser:"])
    
    # Apple Silicon specific (mainly for llama.cpp)
    use_metal: bool = True
    n_gpu_layers: int = -1  # -1 = all layers on GPU

    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary for API calls."""
        return {
            "model": self.model_name,
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p,
                "num_ctx": self.context_window,
                "seed": self.seed,
                "stop": self.stop_sequences,
            },
            "stream": self.stream,
            "system": self.system_prompt
        }
