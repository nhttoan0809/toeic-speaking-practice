import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.cli_utils import parse_args
from utils.audio_player import AudioPlayer
from services.llm.llm_service import LLMService
from services.tts.tts_service import TTSService

def main():
    print("=== Example 4: Streaming Text + Audio At End ===")
    print("=== Interactive Chat (type 'exit' or 'quit' to stop) ===")
    llm_config, tts_config = parse_args()
    
    llm = LLMService(llm_config)
    tts = TTSService(tts_config)
    
    while True:
        text = input("User: ")

        # Exit condition
        if text.lower() in ("exit", "quit"):
            print("Goodbye 👋")
            break

        if not text:
            continue
        
        # 1. Streaming LLM Step
        llm.add_user_message(text)
        full_response = ""
    
        for chunk in llm.generate_stream():
            print(chunk, end="", flush=True)
            full_response += chunk
        
        print("\n")
        llm.add_assistant_message(full_response)
    
        # 2. TTS Step (After FULL creation)
        print("(Synthesizing audio...)")
        audio = tts.generate_audio(full_response)
    
        # 3. Audio Step
        if audio:
            print("(Playing audio...)")
            AudioPlayer.play_audio_data(audio)

if __name__ == "__main__":
    main()
