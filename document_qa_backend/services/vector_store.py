import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-MiniLM-L3-v2")



def process_pdf(file_path, pdf_id):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(documents)

    index_path = f"faiss_indexes/pdf_{pdf_id}"  # 🔁 Fixed: Use unique folder per PDF
    os.makedirs(index_path, exist_ok=True)

    Chroma.from_documents(splits, embedding=embeddings, persist_directory=index_path)
    return index_path
