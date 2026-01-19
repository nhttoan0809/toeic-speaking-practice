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

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.ERROR  # Keep it quiet for CLI usage
)
logger = logging.getLogger(__name__)

class VoiceAssistant:
    def __init__(self, llm_config: LLMConfig, tts_config: TTSConfig):
        self.llm = LLMEngine(llm_config)
        self.tts = TTSEngine(tts_config)
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
                
                # Streaming generation with TTS processing
                full_response = ""
                
                # Simple implementation: Wait for full response, then speak
                # (For real streaming TTS, we'd need a sentence buffer implementation)
                print("(thinking...)", end="\r")
                
                response_text = self.llm.chat(self.history)
                print(f"{response_text}\n")
                
                self.history.append({'role': 'assistant', 'content': response_text})
                
                # Speak response
                print("🔊 Speaking...", end="\r")
                self.tts.speak(response_text)
                print(" " * 20, end="\r")  # Clear speaking status
                
        except KeyboardInterrupt:
            print("\n\nGoodbye! 👋")
            sys.exit(0)
            
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
