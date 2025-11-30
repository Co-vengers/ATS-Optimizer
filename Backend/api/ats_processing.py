import pdfplumber
import spacy
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from keybert import KeyBERT

nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

model_name = 'all-MiniLM-L6-v2'
sts_model = SentenceTransformer(model_name)
kw_model = KeyBERT(model=sts_model)

def parse_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading pdf: {e}")
        return None
    return text

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)

    doc = nlp(text)
    cleaned_text = [token.text for token in doc if not token.is_stop and not token.is_space]
    return " ".join(cleaned_text)

def chunk_text(text, max_words = 400, overlap = 50):
    words = text.split()
    if max_words <= 0:
        return []
    step = max_words - overlap
    if step <= 0:
        step = max_words
    chunks = []
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + max_words])
        if chunk:
            chunks.append(chunk)
    return chunks

def extract_missing_keywords(resume_text, job_desc):
    if not resume_text or not job_desc:
        return []
    jd_keywords = kw_model.extract_keywords(job_desc, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=20)
    resume_keywords_list = kw_model.extract_keywords(resume_text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=50)
    resume_keys = {item[0].lower() for item in resume_keywords_list}

    missing = []
    for keyword, score in jd_keywords:
        if keyword.lower() not in resume_keys:
            missing.append(keyword)
    return missing

def calculate_ats_score(resume_text, job_desc):
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(job_desc)

    resume_chunks = chunk_text(clean_resume)
    if not resume_chunks:
        return 0.0
    
    # Ensure embeddings are 2D arrays: encode JD as a list to get shape (1, dim)
    jd_embeddings = sts_model.encode([clean_jd])
    chunk_embeddings = sts_model.encode(resume_chunks)

    similarities = cosine_similarity(chunk_embeddings, jd_embeddings)  # shape (n_chunks, 1)
    max_score = float(np.max(similarities)) if similarities.size else 0.0

    return round(max_score * 100, 2)

def start_processing(resume_file_path, job_des):
    parse_resume = parse_pdf(resume_file_path)
    if not parse_resume:
        return 0.0, []
    ats_score = calculate_ats_score(parse_resume, job_des)
    missing_skills = extract_missing_keywords(parse_resume, job_des)
    return ats_score, missing_skills