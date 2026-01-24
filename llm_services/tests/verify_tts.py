#!/usr/bin/env python3
"""
Minimal verification script for TTS (Text-to-Speech) functionality.

Prerequisites:
1. Piper TTS installed: pip install piper-tts
   OR Edge-TTS installed: pip install edge-tts
2. For Piper: Download voice model files to ~/tts-models/
3. For macOS: afplay command is available by default

Usage:
    python verify_tts.py --engine piper
    python verify_tts.py --engine edge-tts
    python verify_tts.py --engine piper --text "Custom test message"
"""

import sys
import subprocess
import argparse
import os
from typing import Optional


def test_piper_tts(text: str, model_path: Optional[str] = None) -> bool:
    """
    Test Piper TTS engine.
    
    Args:
        text: Text to synthesize
        model_path: Path to Piper .onnx model file
        
    Returns:
        True if test passed, False otherwise
    """
    print("=" * 60)
    print("Piper TTS Verification Test")
    print("=" * 60)
    
    # Default model path
    if model_path is None:
        model_path = os.path.expanduser("~/tts-models/en_US-lessac-medium.onnx")
    
    print(f"\nModel: {model_path}")
    print(f"Text: '{text}'\n")
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        print("\nTo download Piper models:")
        print("1. Create directory: mkdir -p ~/tts-models")
        print("2. Download model files from:")
        print("   https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/lessac/medium")
        print("3. Download both .onnx and .onnx.json files")
        return False
    
    output_file = "verify_tts_output.wav"
    
    try:
        print("Generating speech...")
        print("-" * 60)
        
        # Generate audio using piper via python module
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
            return False
        
        if not os.path.exists(output_file):
            print(f"❌ Audio file not created: {output_file}")
            return False
        
        print(f"✓ Audio file created: {output_file}")
        print(f"✓ File size: {os.path.getsize(output_file)} bytes\n")
        
        # Play audio
        print("Playing audio...")
        subprocess.run(['afplay', output_file], check=True)
        
        print("-" * 60)
        print("✅ Piper TTS test PASSED!")
        print("=" * 60)
        return True
        
    except FileNotFoundError as e:
        print(f"❌ Command not found: {e}")
        print("Make sure 'afplay' is available (macOS) or use another audio player")
        return False
    except Exception as e:
        print(f"❌ Piper TTS test FAILED!")
        print(f"Error: {e}")
        return False


def test_edge_tts(text: str) -> bool:
    """
    Test Edge-TTS engine.
    
    Args:
        text: Text to synthesize
        
    Returns:
        True if test passed, False otherwise
    """
    print("=" * 60)
    print("Edge-TTS Verification Test")
    print("=" * 60)
    print(f"\nText: '{text}'")
    print("Voice: en-US-GuyNeural\n")
    
    output_file = "verify_edge_tts_output.mp3"
    
    try:
        print("Generating speech (requires internet connection)...")
        print("-" * 60)
        
        # Generate audio using edge-tts via python module
        # This is more robust than calling the command directly
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
            print("\nNote: Edge-TTS requires internet connection")
            return False
        
        if not os.path.exists(output_file):
            print(f"❌ Audio file not created: {output_file}")
            return False
        
        print(f"✓ Audio file created: {output_file}")
        print(f"✓ File size: {os.path.getsize(output_file)} bytes\n")
        
        # Play audio
        print("Playing audio...")
        subprocess.run(['afplay', output_file], check=True)
        
        print("-" * 60)
        print("✅ Edge-TTS test PASSED!")
        print("=" * 60)
        return True
        
    except subprocess.TimeoutExpired:
        print("❌ Edge-TTS request timed out")
        print("Check your internet connection")
        return False
    except FileNotFoundError as e:
        print(f"❌ Command not found: {e}")
        return False
    except Exception as e:
        print(f"❌ Edge-TTS test FAILED!")
        print(f"Error: {e}")
        return False


def main():
    """Main entry point with argument parsing."""
    parser = argparse.ArgumentParser(
        description="Verify TTS setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python verify_tts.py --engine piper
  python verify_tts.py --engine edge-tts
  python verify_tts.py --engine piper --model ~/my-models/voice.onnx
  python verify_tts.py --engine piper --text "Hello, world!"
        """
    )
    parser.add_argument(
        '--engine',
        type=str,
        choices=['piper', 'edge-tts'],
        default='piper',
        help='TTS engine to test (default: piper)'
    )
    parser.add_argument(
        '--text',
        type=str,
        default='Hello, this is a test of the text to speech system.',
        help='Text to synthesize'
    )
    parser.add_argument(
        '--model',
        type=str,
        default=None,
        help='Path to Piper model file (only for piper engine)'
    )
    
    args = parser.parse_args()
    
    if args.engine == 'piper':
        success = test_piper_tts(args.text, args.model)
    else:
        success = test_edge_tts(args.text)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
