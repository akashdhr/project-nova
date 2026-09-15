from pathlib import Path
import fitz
from docx import Document

def extract_text(path:Path, content_type:str)->str:
    if content_type=="application/pdf":
        with fitz.open(path) as doc: return "\n".join(page.get_text() for page in doc)
    if content_type in {"application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/msword"}:
        return "\n".join(p.text for p in Document(path).paragraphs)
    if content_type.startswith("text/"): return path.read_text(errors="ignore")
    raise ValueError("Unsupported resume format")
