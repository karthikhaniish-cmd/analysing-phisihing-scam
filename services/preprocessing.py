"""
Preprocessing Service for Email Text Normalization & Feature Extraction
"""
import re

URL_PATTERN = re.compile(r'https?://[^\s$.?#].[^\s]*', re.IGNORECASE)
EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
CURRENCY_PATTERN = re.compile(r'[$€£¥]')

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", 
    "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", 
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", 
    "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", 
    "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", 
    "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", 
    "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
}

def clean_email_text(text: str) -> str:
    """Preprocesses email text while preserving domain & structural cues."""
    if not text:
        return ""
    cleaned = URL_PATTERN.sub(' url_token ', text)
    cleaned = EMAIL_PATTERN.sub(' email_token ', cleaned)
    cleaned = CURRENCY_PATTERN.sub(' currency_token ', cleaned)
    cleaned = cleaned.lower()
    cleaned = re.sub(r'[^\w\s]', ' ', cleaned)
    words = [w for w in cleaned.split() if len(w) > 1 and w not in STOPWORDS]
    return " ".join(words)

def extract_urls(text: str) -> list:
    """Extracts all URLs found in the text."""
    return URL_PATTERN.findall(text or "")

def calculate_caps_ratio(text: str) -> float:
    """Calculates uppercase letter ratio for urgency detection."""
    letters = [c for c in (text or "") if c.isalpha()]
    if not letters:
        return 0.0
    caps = [c for c in letters if c.isupper()]
    return round(len(caps) / len(letters), 3)
