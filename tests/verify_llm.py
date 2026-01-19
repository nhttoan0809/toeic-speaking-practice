#!/usr/bin/env python3
"""
Minimal verification script for LLM functionality.

Prerequisites:
1. Ollama must be installed: https://ollama.ai/download
2. A model must be pulled: ollama pull mistral-small (or another model)
3. Python package installed: pip install ollama

Usage:
    python verify_llm.py
    python verify_llm.py --model qwq:32b
"""

import sys
import argparse
from typing import Optional

try:
    from ollama import chat
except ImportError:
    print("❌ Error: 'ollama' package not installed.")
    print("Install it with: pip install ollama")
    sys.exit(1)


def test_llm(model_name: str = "mistral-small") -> bool:
    """
    Minimal command-line test of LLM via STDIO.
    
    Args:
        model_name: Name of the Ollama model to test
        
    Returns:
        True if test passed, False otherwise
    """
    print("=" * 60)
    print("LLM Verification Test")
    print("=" * 60)
    print(f"\nModel: {model_name}")
    print("Test Query: 'What is the capital of France? Answer in one sentence.'\n")
    
    try:
        print("Connecting to Ollama and generating response...")
        print("-" * 60)
        
        response = chat(
            model=model_name,
            messages=[{
                'role': 'user',
                'content': 'What is the capital of France? Answer in one sentence.'
            }]
        )
        
        answer = response['message']['content']
        
        print(f"\n✓ Response received:\n{answer}\n")
        print("-" * 60)
        print("✅ LLM test PASSED!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n❌ LLM test FAILED!")
        print(f"Error: {e}")
        print("\nTroubleshooting:")
        print("1. Is Ollama running? Check with: ollama serve")
        print(f"2. Is the model downloaded? Try: ollama pull {model_name}")
        print("3. Check available models with: ollama list")
        print("=" * 60)
        return False


def main():
    """Main entry point with argument parsing."""
    parser = argparse.ArgumentParser(
        description="Verify LLM setup with Ollama",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python verify_llm.py
  python verify_llm.py --model mistral-small
  python verify_llm.py --model qwq:32b
  python verify_llm.py --model qwen2.5-coder:32b
        """
    )
    parser.add_argument(
        '--model',
        type=str,
        default='mistral-small',
        help='Ollama model name (default: mistral-small)'
    )
    
    args = parser.parse_args()
    
    success = test_llm(args.model)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
