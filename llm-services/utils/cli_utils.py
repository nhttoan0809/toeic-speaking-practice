import argparse
from config.model_config import LLMConfig
from config.tts_config import TTSConfig

def parse_args():
    """Parse command line arguments for LLM and TTS configuration."""
    parser = argparse.ArgumentParser(description="Self-Hosted Voice Assistant")
    
    # LLM Args
    parser.add_argument("--model", type=str, default="mistral-small", 
                        help="Ollama model name (default: mistral-small)")
    parser.add_argument("--llm-framework", type=str, default="ollama",
                        choices=["ollama", "llama-cpp"],
                        help="LLM framework to use")
    
    # TTS Args
    parser.add_argument("--tts-engine", type=str, default="edge-tts",
                        choices=["edge-tts", "piper"],
                        help="TTS engine to use")
    parser.add_argument("--voice", type=str, 
                        help="Specific voice ID (default depends on engine)")
    
    args = parser.parse_args()
    
    # Create Config Objects
    llm_config = LLMConfig(
        framework=args.llm_framework,
        model_name=args.model
    )
    
    tts_config = TTSConfig(
        engine=args.tts_engine
    )
    
    if args.voice:
        if args.tts_engine == "piper":
            tts_config.piper_voice = args.voice
        else:
            tts_config.edge_voice = args.voice
            
    return llm_config, tts_config
