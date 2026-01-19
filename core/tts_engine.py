import logging
import os
import sys
import subprocess
import tempfile
import time
from typing import Optional, List
from config.tts_config import TTSConfig

# Configure logging
logger = logging.getLogger(__name__)

class TTSEngine:
    """
    Abstraction layer for Text-to-Speech via command line execution.
    Supports Piper and Edge-TTS via robust 'python -m module' calls.
    """
    
    def __init__(self, config: TTSConfig):
        """Initialize TTS engine with configuration."""
        self.config = config
        self._ensure_output_dir()
        self._verify_engine()
    
    def _ensure_output_dir(self):
        """Ensure audio output directory exists."""
        if not os.path.exists(self.config.output_dir):
            os.makedirs(self.config.output_dir)
            
    def _verify_engine(self):
        """Verify the selected engine works."""
        if self.config.engine == "piper":
            if not os.path.exists(self.config.piper_model_path):
                logger.warning(f"Piper model not found at: {self.config.piper_model_path}")
        
    def synthesize(self, text: str, output_path: Optional[str] = None) -> Optional[str]:
        """
        Convert text to speech and save to file.
        
        Args:
            text: Text content to speak
            output_path: Optional specific path, otherwise auto-generated
            
        Returns:
            Path to generated audio file, or None if failed
        """
        if not text.strip():
            return None
            
        if output_path is None:
            # Generate unique filename timestamp
            timestamp = int(time.time() * 1000)
            filename = f"speech_{timestamp}.{self.config.output_format}"
            output_path = os.path.join(self.config.output_dir, filename)
            
        success = False
        if self.config.engine == "piper":
            success = self._synthesize_proper_piper(text, output_path)
        elif self.config.engine == "edge-tts":
            success = self._synthesize_edge_tts(text, output_path)
        else:
            logger.error(f"Unknown TTS engine: {self.config.engine}")
            
        return output_path if success else None

    def _synthesize_proper_piper(self, text: str, output_path: str) -> bool:
        """Synthesize using Piper via python module."""
        try:
            if not os.path.exists(self.config.piper_model_path):
                logger.error("Piper model not found")
                return False
                
            cmd = [
                sys.executable, '-m', 'piper',
                '--model', self.config.piper_model_path,
                '--output_file', output_path
            ]
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            _, stderr = process.communicate(input=text.encode())
            
            if process.returncode != 0:
                logger.error(f"Piper execution failed: {stderr.decode()}")
                return False
                
            return True
            
        except Exception as e:
            logger.error(f"Piper synthesis error: {e}")
            return False

    def _synthesize_edge_tts(self, text: str, output_path: str) -> bool:
        """Synthesize using Edge-TTS via python module."""
        try:
            cmd = [
                sys.executable, '-m', 'edge_tts',
                '--text', text,
                '--voice', self.config.edge_voice,
                '--write-media', output_path,
                '--rate', self.config.edge_rate,
                '--volume', self.config.edge_volume,
                '--pitch', self.config.edge_pitch
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30  # Timeout for network requests
            )
            
            if result.returncode != 0:
                logger.error(f"Edge-TTS failed: {result.stderr}")
                return False
                
            return True
            
        except subprocess.TimeoutExpired:
            logger.error("Edge-TTS request timed out")
            return False
        except Exception as e:
            logger.error(f"Edge-TTS error: {e}")
            return False

    def speak(self, text: str):
        """Synthesize and immediately play audio."""
        if not self.config.play_audio:
            return
            
        audio_file = self.synthesize(text)
        
        if audio_file and os.path.exists(audio_file):
            try:
                subprocess.run([self.config.playback_cmd, audio_file], check=True)
                
                # Cleanup if configured
                if not self.config.keep_audio_files:
                    os.remove(audio_file)
            except Exception as e:
                logger.error(f"Audio playback failed: {e}")
