import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.cli_utils import parse_args
from utils.audio_player import AudioPlayer
from services.llm.llm_service import LLMService
from services.tts.tts_service import TTSService

def main():
    print("=== Example 3: Text with Audio (Sequential) ===")
    print("=== Interactive Chat (type 'exit' or 'quit' to stop) ===")
    llm_config, tts_config = parse_args()
    
    # INDEPENDENT Services
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
        
        # 1. LLM Step
        llm.add_user_message(text)
        response = llm.generate_text()
        llm.add_assistant_message(response)
        print(f"Assistant: {response}")
        
        # 2. TTS Step (Explicitly composed)
        print("(Synthesizing audio...)")
        audio = tts.generate_audio(response)
        
        # 3. Audio Step
        if audio:
            print("(Playing audio...)")
            AudioPlayer.play_audio_data(audio)

if __name__ == "__main__":
    main()
