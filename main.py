#!/usr/bin/env python3
"""
Main entry point for the Self-Hosted Voice Assistant.

Combines LLM intelligence (Ollama) with Spoken Output (TTS).
Usage:
    python main.py
    python main.py --model qwq:32b --tts-engine edge-tts
"""

import sys
import argparse
import logging
from config.model_config import LLMConfig
from config.tts_config import TTSConfig
from core.llm_engine import LLMEngine
from core.tts_engine import TTSEngine

from utils.text_processing import SentenceSplitter
from utils.audio_queue import AudioQueue

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.ERROR  # Keep it quiet for CLI usage
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

class VoiceAssistant:
    def __init__(self, llm_config: LLMConfig, tts_config: TTSConfig):
        self.llm = LLMEngine(llm_config)
        self.tts = TTSEngine(tts_config)
        
        # New streaming components
        self.audio_queue = AudioQueue(self.tts)
        self.splitter = SentenceSplitter()
        self.history = []
        
        print(f"Initializing Voice Assistant...")
        print(f"LLM: {llm_config.model_name}")
        print(f"TTS: {tts_config.engine}")
        if tts_config.engine == "piper":
            print(f"Voice: {tts_config.piper_voice}")
            
    def run_interactive(self):
        """Run the main interaction loop."""
        print("\n" + "=" * 50)
        print("🎙️  Voice Assistant Ready!")
        print("Type 'quit', 'exit', or press Ctrl+C to stop.")
        print("=" * 50 + "\n")
        
        # Start audio worker thread
        self.audio_queue.start()
        
        try:
            while True:
                user_input = input("You: ").strip()
                if not user_input:
                    continue
                    
                if user_input.lower() in ['quit', 'exit']:
                    print("\nGoodbye! 👋")
                    break
                
                self.history.append({'role': 'user', 'content': user_input})
                
                print("Assistant: ", end="", flush=True)
                
                # Streaming generation loop
                full_response = ""
                
                # Use streaming chat from LLM engine
                # Reset splitter buffer for new turn
                self.splitter.buffer = ""
                
                for chunk in self.llm.stream_chat(self.history):
                    # Print chunk to terminal immediately
                    print(chunk, end="", flush=True)
                    full_response += chunk
                    
                    # Process for sentences
                    for sentence in self.splitter.process(chunk):
                        self.audio_queue.add(sentence)
                
                # Flush remaining text (incomplete sentence at end)
                for sentence in self.splitter.flush():
                    self.audio_queue.add(sentence)
                
                print("\n")
                
                self.history.append({'role': 'assistant', 'content': full_response})
                
        except KeyboardInterrupt:
            print("\n\nGoodbye! 👋")
            self.audio_queue.stop()
            sys.exit(0)
        finally:
            self.audio_queue.stop()
            
def parsing_args():
    parser = argparse.ArgumentParser(description="Self-Hosted Voice Assistant")
    
    parser.add_argument('--model', type=str, default='mistral-small', 
                        help='Ollama model name (default: mistral-small)')
    
    parser.add_argument('--tts-engine', type=str, default='edge-tts',
                        choices=['piper', 'edge-tts'],
                        help='TTS engine to use (default: edge-tts)')
                        
    parser.add_argument('--voice', type=str, default=None,
                        help='Specific voice ID (depends on engine)')
                        
    return parser.parse_args()

def main():
    args = parsing_args()
    
    # Configuration
    llm_conf = LLMConfig(model_name=args.model)
    tts_conf = TTSConfig(engine=args.tts_engine)
    
    if args.voice:
        if args.tts_engine == 'edge-tts':
            tts_conf.edge_voice = args.voice
        else:
            tts_conf.piper_voice = args.voice
            # Need to handle model path logic here if changing piper voice dynamically
            # For now default logic assumes standard path structure
    
    app = VoiceAssistant(llm_conf, tts_conf)
    app.run_interactive()

if __name__ == "__main__":
    main()
