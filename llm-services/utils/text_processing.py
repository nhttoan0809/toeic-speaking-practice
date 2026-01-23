import re
from typing import Iterator

class SentenceSplitter:
    """
    Splits streaming text into sentences for TTS processing.
    Handles Markdown code blocks by skipping them or replacing with a placeholder.
    """
    
    def __init__(self):
        self.buffer = ""
        self.in_code_block = False
        # Regex for sentence limiters (. ? ! ...) followed by space or end of string
        self.sentence_end_pattern = re.compile(r'([.?!]+)(?:\s+|$)')
        
        # Regex for abbreviations that shouldn't split sentences
        self.abbreviations = {'mr.', 'mrs.', 'ms.', 'dr.', 'vs.', 'etc.', 'e.g.', 'i.e.'}
    
    def process(self, text_chunk: str) -> Iterator[str]:
        """
        Process a new text chunk and yield complete sentences.
        Buffers incomplete sentences.
        """
        self.buffer += text_chunk
        
        while True:
            if self.in_code_block:
                # Find closing ```
                end_code = self.buffer.find("```")
                if end_code != -1:
                    self.in_code_block = False
                    # Skip code content, remove from buffer
                    # +3 for the ```
                    self.buffer = self.buffer[end_code + 3:]
                else:
                    # Still in code block, wait for more chunks
                    break
                    
            else:
                # Normal text mode
                start_code = self.buffer.find("```")
                match = self.sentence_end_pattern.search(self.buffer)
                
                # Check if a code block starts
                if start_code != -1:
                    # If sentence ends BEFORE code block, process sentence first
                    if match and match.end() <= start_code:
                        end_pos = match.end()
                        sentence = self.buffer[:end_pos].strip()
                        if sentence:
                            yield sentence
                        self.buffer = self.buffer[end_pos:]
                        continue
                    else:
                        # Code block starts now (or before any sentence end)
                        self.in_code_block = True
                        
                        # Yield text before code block
                        pre_code = self.buffer[:start_code].strip()
                        if pre_code:
                            yield pre_code
                        
                        # Announce code block
                        yield "Code block."
                        
                        # Remove processed part including ```
                        self.buffer = self.buffer[start_code + 3:]
                        continue

                # No code block start detected, check for sentence end
                if not match:
                    break
                    
                end_pos = match.end()
                sentence = self.buffer[:end_pos].strip()
                
                # Simple abbreviation check
                last_word = sentence.split()[-1].lower() if sentence else ""
                if last_word in self.abbreviations:
                    # Very simple fallback: just accept it for now to avoid indefinite buffering
                    # In a robust system we would lookahead
                    pass
                
                if sentence:
                    # Cleanup markdown artifacts
                    clean_sentence = sentence.replace("*", "").replace("#", "")
                    if clean_sentence.strip():
                        yield clean_sentence
                
                self.buffer = self.buffer[end_pos:]

    def flush(self) -> Iterator[str]:
        """Yield remaining buffer content."""
        if self.buffer.strip() and not self.in_code_block:
            yield self.buffer.strip()
        self.buffer = ""
