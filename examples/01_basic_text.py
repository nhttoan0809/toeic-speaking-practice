import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.cli_utils import parse_args
from services.llm.llm_service import LLMService

def main():
    print("=== Example 1: Basic Text (No Audio) ===")
    llm_config, _ = parse_args()
    
    # Instantiate ONLY LLM Service
    llm = LLMService(llm_config)
    
    text = "Explain the concept of modularity in one sentence."
    print(f"User: {text}")
    
    # Full response generation
    llm.add_user_message(text)
    response = llm.generate_text()
    llm.add_assistant_message(response)
    
    print(f"Assistant: {response}")

if __name__ == "__main__":
    main()
