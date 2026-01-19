import queue
import threading
import logging
from typing import Optional
from core.tts_engine import TTSEngine

logger = logging.getLogger(__name__)

class AudioQueue:
    """
    Manages a queue of text sentences to be synthesized and played sequentially.
    Crucial for streaming TTS where generation speed != playback speed.
    """
    
    def __init__(self, tts_engine: TTSEngine):
        self.tts = tts_engine
        self.queue = queue.Queue()
        self.is_running = False
        self.playback_thread = None
        self._stop_event = threading.Event()
        
    def start(self):
        """Start the background playback worker."""
        if self.is_running:
            return
            
        self.is_running = True
        self._stop_event.clear()
        self.playback_thread = threading.Thread(target=self._worker, daemon=True)
        self.playback_thread.start()
        
    def stop(self):
        """Stop playback and clear queue."""
        self.is_running = False
        self._stop_event.set()
        # Clear queue
        with self.queue.mutex:
            self.queue.queue.clear()
        # Add Sentinel to unblock get() if stuck (though we use timeout)
        self.queue.put(None) 
            
    def add(self, text: str):
        """Add text sentence to queue."""
        if self.is_running:
            self.queue.put(text)
            
    def _worker(self):
        """Worker loop to synthesize and play audio."""
        logger.info("AudioQueue worker started")
        
        while not self._stop_event.is_set():
            try:
                # Wait for text with timeout to check stop_event periodically
                text = self.queue.get(timeout=0.5)
                
                if text is None: # Sentinel
                    break
                    
                if self._stop_event.is_set():
                    break
                    
                # Synthesize and play (blocking operation)
                # Note: Ideally synthesize could be parallel to playback of previous chunk
                # For MVP, sequential synthesis -> playback in this thread is acceptable
                # but might cause small gaps if synthesis is slow.
                # A better design would be: 
                # Thread 1: Synthesize -> AudioBuffer
                # Thread 2: Play from AudioBuffer
                
                # Using existing synchronous speak() which handles synth + play
                self.tts.speak(text)
                
                self.queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"AudioQueue worker error: {e}")
                
        logger.info("AudioQueue worker stopped")
