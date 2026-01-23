import logging
import os
import sys
import subprocess
from typing import Optional
from config import TTSConfig

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
        
    async def synthesize_bytes_edge_tts(self, text: str) -> Optional[bytes]:
        """Generate audio bytes using Edge-TTS (async because edge-tts is async native)."""
        try:
            import edge_tts
            communicate = edge_tts.Communicate(text, self.config.edge_voice, rate=self.config.edge_rate, volume=self.config.edge_volume, pitch=self.config.edge_pitch)
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            return audio_data
        except ImportError:
            logger.error("edge-tts library not found. Please install it.")
            return None
        except Exception as e:
            logger.error(f"Edge-TTS synthesis error: {e}")
            return None

    def synthesize_to_bytes(self, text: str) -> Optional[bytes]:
        """
        Convert text to speech and return audio data as bytes.
        """
        if not text.strip():
            return None

        if self.config.engine == "piper":
            return self._synthesize_bytes_piper(text)
        elif self.config.engine == "edge-tts":
            # Bridge async edge-tts to sync for now using asyncio.run
            # In a full async app we would keep it async.
            import asyncio
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return loop.run_until_complete(self.synthesize_bytes_edge_tts(text))
            finally:
                loop.close()
        else:
            logger.error(f"Unknown TTS engine: {self.config.engine}")
            return None

    def _synthesize_bytes_piper(self, text: str) -> Optional[bytes]:
        """Synthesize using Piper and return bytes."""
        try:
            if not os.path.exists(self.config.piper_model_path):
                logger.error("Piper model not found")
                return None

            # Piper outputs to stdout if output-file is -
            cmd = [
                sys.executable, '-m', 'piper',
                '--model', self.config.piper_model_path,
                '--output_file', '-' 
            ]

            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            stdout, stderr = process.communicate(input=text.encode())

            if process.returncode != 0:
                logger.error(f"Piper execution failed: {stderr.decode()}")
                return None

            return stdout

        except Exception as e:
            logger.error(f"Piper synthesis error: {e}")
            return None

    def speak(self, text: str):
        """Deprecated: Use TTSService and AudioPlayer instead."""
        pass

