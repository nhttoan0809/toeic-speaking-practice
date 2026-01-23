import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.cli_utils import parse_args
from services.llm.llm_service import LLMService

def main():
    print("=== Example 2: Streaming Text (No Audio) ===")
    print("=== Interactive Chat (type 'exit' or 'quit' to stop) ===")

    llm_config, _ = parse_args()
    
    llm = LLMService(llm_config)
    
    while True:
        text = input("User: ")

        # Exit condition
        if text.lower() in ("exit", "quit"):
            print("Goodbye 👋")
            break

        if not text:
            continue
        
        print("Assistant: ", end="", flush=True)
        
        llm.add_user_message(text)
        streaming_response = llm.generate_stream()
        for chunk in streaming_response:
            print(chunk, end="", flush=True)
            
        print("\n")

if __name__ == "__main__":
    main()
