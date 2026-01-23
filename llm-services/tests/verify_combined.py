#!/usr/bin/env python3
"""
Combined verification script for LLM + TTS integration.

This script tests the full pipeline:
1. LLM generates a response
2. TTS converts the response to speech
3. Audio is played

Prerequisites:
1. Ollama installed and running with a model
2. Either Piper or Edge-TTS installed
3. Python packages: pip install ollama piper-tts (or edge-tts)

Usage:
    python verify_combined.py
    python verify_combined.py --model qwq:32b --tts-engine edge-tts
    python verify_combined.py --question "What is Python?"
"""

import sys
import subprocess
import argparse
import os
from typing import Optional

try:
    from ollama import chat
except ImportError:
    print("❌ Error: 'ollama' package not installed.")
    print("Install it with: pip install ollama")
    sys.exit(1)


def generate_llm_response(model_name: str, question: str) -> Optional[str]:
    """
    Generate response from LLM.
    
    Args:
        model_name: Ollama model name
        question: Question to ask
        
    Returns:
        Response text or None if failed
    """
    try:
        print(f"Asking LLM ({model_name}): '{question}'")
        print("-" * 60)
        
        response = chat(
            model=model_name,
            messages=[{
                'role': 'user',
                'content': question
            }]
        )
        
        answer = response['message']['content']
        print(f"\n✓ LLM Response:\n{answer}\n")
        print("-" * 60)
        return answer
        
    except Exception as e:
        print(f"❌ LLM failed: {e}")
        print("\nTroubleshooting:")
        print("1. Is Ollama running? Check with: ollama serve")
        print(f"2. Is the model downloaded? Try: ollama pull {model_name}")
        return None


def synthesize_with_piper(text: str, model_path: str) -> Optional[str]:
    """
    Convert text to speech using Piper (via python module).
    
    Args:
        text: Text to synthesize
        model_path: Path to Piper model
        
    Returns:
        Path to audio file or None if failed
    """
    output_file = "combined_test_piper.wav"
    
    try:
        print(f"Converting to speech with Piper...")
        
        # Check if model exists
        if not os.path.exists(model_path):
            print(f"❌ Piper model not found: {model_path}")
            return None
        
        cmd = [
            sys.executable, '-m', 'piper',
            '--model', model_path,
            '--output_file', output_file
        ]
        
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        stdout, stderr = process.communicate(input=text.encode())
        
        if process.returncode != 0:
            print(f"❌ Piper failed: {stderr.decode()}")
            print(f"Command used: {' '.join(cmd)}")
            return None
        
        if not os.path.exists(output_file):
            print(f"❌ Audio file not created")
            return None
        
        print(f"✓ Audio generated: {output_file}")
        return output_file
        
    except Exception as e:
        print(f"❌ TTS failed: {e}")
        return None


def synthesize_with_edge_tts(text: str) -> Optional[str]:
    """
    Convert text to speech using Edge-TTS (via python module).
    
    Args:
        text: Text to synthesize
        
    Returns:
        Path to audio file or None if failed
    """
    output_file = "combined_test_edge.mp3"
    
    try:
        print(f"Converting to speech with Edge-TTS...")
        
        cmd = [
            sys.executable, '-m', 'edge_tts',
            '--text', text,
            '--voice', 'en-US-GuyNeural',
            '--write-media', output_file
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"❌ Edge-TTS failed: {result.stderr}")
            print(f"Command used: {' '.join(cmd)}")
            return None
        
        if not os.path.exists(output_file):
            print(f"❌ Audio file not created")
            return None
        
        print(f"✓ Audio generated: {output_file}")
        return output_file
        
    except subprocess.TimeoutExpired:
        print("❌ Edge-TTS request timed out")
        return None
    except Exception as e:
        print(f"❌ TTS failed: {e}")
        return None


def play_audio(file_path: str) -> bool:
    """
    Play audio file.
    
    Args:
        file_path: Path to audio file
        
    Returns:
        True if successful
    """
    try:
        print(f"Playing audio...")
        subprocess.run(['afplay', file_path], check=True)
        print("✓ Audio played successfully")
        return True
    except Exception as e:
        print(f"❌ Audio playback failed: {e}")
        return False


def test_combined(
    model_name: str,
    question: str,
    tts_engine: str,
    piper_model_path: Optional[str] = None
) -> bool:
    """
    Test complete LLM + TTS pipeline.
    
    Args:
        model_name: Ollama model name
        question: Question to ask LLM
        tts_engine: 'piper' or 'edge-tts'
        piper_model_path: Path to Piper model (if using piper)
        
    Returns:
        True if test passed
    """
    print("=" * 60)
    print("Combined LLM + TTS Verification Test")
    print("=" * 60)
    print(f"\nLLM Model: {model_name}")
    print(f"TTS Engine: {tts_engine}")
    print(f"Question: '{question}'\n")
    print("=" * 60)
    
    # Step 1: Get LLM response
    print("\n[STEP 1/3] Generating LLM response...")
    answer = generate_llm_response(model_name, question)
    if answer is None:
        print("\n❌ Combined test FAILED at LLM step")
        return False
    
    # Step 2: Convert to speech
    print("\n[STEP 2/3] Converting to speech...")
    if tts_engine == 'piper':
        if piper_model_path is None:
            piper_model_path = os.path.expanduser("~/tts-models/en_US-lessac-medium.onnx")
        audio_file = synthesize_with_piper(answer, piper_model_path)
    else:
        audio_file = synthesize_with_edge_tts(answer)
    
    if audio_file is None:
        print("\n❌ Combined test FAILED at TTS step")
        return False
    
    # Step 3: Play audio
    print("\n[STEP 3/3] Playing audio...")
    success = play_audio(audio_file)
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Combined LLM + TTS test PASSED!")
        print("=" * 60)
        print("\nSummary:")
        print(f"  • LLM responded successfully")
        print(f"  • TTS converted {len(answer)} characters to speech")
        print(f"  • Audio played successfully")
        print("=" * 60)
        return True
    else:
        print("\n❌ Combined test FAILED at audio playback step")
        return False


def main():
    """Main entry point with argument parsing."""
    parser = argparse.ArgumentParser(
        description="Verify combined LLM + TTS setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python verify_combined.py
  python verify_combined.py --model qwq:32b
  python verify_combined.py --tts-engine edge-tts
  python verify_combined.py --question "What is machine learning?"
  python verify_combined.py --model mistral-small --tts-engine piper
        """
    )
    parser.add_argument(
        '--model',
        type=str,
        default='mistral-small',
        help='Ollama model name (default: mistral-small)'
    )
    parser.add_argument(
        '--question',
        type=str,
        default='What is artificial intelligence? Answer in one short sentence.',
        help='Question to ask the LLM'
    )
    parser.add_argument(
        '--tts-engine',
        type=str,
        choices=['piper', 'edge-tts'],
        default='piper',
        help='TTS engine to use (default: piper)'
    )
    parser.add_argument(
        '--piper-model',
        type=str,
        default=None,
        help='Path to Piper model file (only for piper engine)'
    )
    
    args = parser.parse_args()
    
    success = test_combined(
        model_name=args.model,
        question=args.question,
        tts_engine=args.tts_engine,
        piper_model_path=args.piper_model
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
