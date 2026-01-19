from dataclasses import dataclass
from typing import Optional
import os

@dataclass
class TTSConfig:
    """Configuration for Text-to-Speech engine."""
    
    # Engine Selection
    engine: str = "piper"  # Options: "piper", "edge-tts"
    
    # Piper Configuration
    # Default to lessac voice (good balance of quality/speed)
    piper_voice: str = "en_US-lessac-medium"
    piper_model_name: str = "en_US-lessac-medium.onnx"
    piper_model_path: str = os.path.expanduser("~/tts-models/en_US-lessac-medium.onnx")
    
    # Edge-TTS Configuration
    edge_voice: str = "en-US-GuyNeural"
    edge_rate: str = "+0%"
    edge_volume: str = "+0%"
    edge_pitch: str = "+0Hz"
    
    # Output Settings
    output_dir: str = "audio_output"
    output_format: str = "wav"
    play_audio: bool = True
    keep_audio_files: bool = False  # Whether to delete files after playing
    
    # Playback Settings
    playback_cmd: str = "afplay"  # macOS default player
    
    def validate(self) -> bool:
        """Validate configuration settings."""
        if self.engine == "piper":
            if not os.path.exists(self.piper_model_path):
                print(f"Warning: Piper model not found at {self.piper_model_path}")
                return False
        return True
