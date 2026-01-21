from tts_service import TTSService
from audio_player import AudioPlayer

logger = logging.getLogger(__name__)

class AudioQueue:
    """
    Manages a queue of text sentences to be synthesized and played sequentially.
    """
    
    def __init__(self, tts_service: TTSService):
        self.tts = tts_service
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
        with self.queue.mutex:
            self.queue.queue.clear()
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
                text = self.queue.get(timeout=0.5)
                
                if text is None:
                    break
                    
                if self._stop_event.is_set():
                    break
                    
                # Synthesize to bytes
                audio_data = self.tts.generate_audio(text)
                
                # Play directly from memory
                if audio_data:
                    AudioPlayer.play_audio_data(audio_data)
                
                self.queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"AudioQueue worker error: {e}")
                
        logger.info("AudioQueue worker stopped")
