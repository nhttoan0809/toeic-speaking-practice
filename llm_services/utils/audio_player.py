import io
import logging

# Suppress Pygame welcome message
import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "1"
import pygame

logger = logging.getLogger(__name__)

class AudioPlayer:
    """
    Utility for playing binary audio data directly from memory.
    Connects TTS service output to system audio.
    """
    
    _initialized = False

    @classmethod
    def initialize(cls):
        """Initialize pygame mixer once."""
        if not cls._initialized:
            try:
                pygame.mixer.init()
                cls._initialized = True
            except Exception as e:
                logger.error(f"Failed to initialize audio mixer: {e}")
    
    @staticmethod
    def play_audio_data(audio_data: bytes):
        """
        Play audio from bytes.
        Blocks until playback is finished (for this MVP simple player).
        """
        if not audio_data:
            return

        if not AudioPlayer._initialized:
            AudioPlayer.initialize()
            
        try:
            # Create a file-like object from bytes
            sound_file = io.BytesIO(audio_data)
            
            # Load and play
            # Note: Pygame mixer automatic type detection might fail on raw bytes without header
            # But Piper/Edge-TTS return WAV/MP3 which have headers, so it should work.
            sound = pygame.mixer.Sound(sound_file)
            channel = sound.play()
            
            # Block until finished
            while channel.get_busy():
                pygame.time.wait(100)
                
        except Exception as e:
            logger.error(f"Error playing audio data: {e}")
