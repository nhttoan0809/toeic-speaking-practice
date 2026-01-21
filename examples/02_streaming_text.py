import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.cli_utils import parse_args
from services.llm.llm_service import LLMService

def main():
    print("=== Example 2: Streaming Text (No Audio) ===")
    llm_config, _ = parse_args()
    
    llm = LLMService(llm_config)
    
    text = "Write a haiku about rain."
    print(f"User: {text}")
    print("Assistant: ", end="", flush=True)
    
    llm.add_user_message(text)
    
    for chunk in llm.generate_stream():
        print(chunk, end="", flush=True)
        
    print("\n")

if __name__ == "__main__":
    main()
