import os
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_core.runnables.history import RunnableWithMessageHistory
from .vector_store import embeddings

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="Gemma2-9b-it")

store = {}

def get_session_history(session):
    if session not in store:
        store[session] = ChatMessageHistory()
    return store[session]


def get_semantic_answer(index_path, question, session_id):
    retriever = Chroma(persist_directory=index_path, embedding_function=embeddings).as_retriever()

    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", "Given a chat history and latest user question, make it standalone."),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", "Use retrieved context to answer."
        "If unknown, say 'I don't know'. Limit to 3 sentences.\n\n{context}"),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    conversational_chain = RunnableWithMessageHistory(
        rag_chain,
        lambda session: get_session_history(session),
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer"
    )

    result = conversational_chain.invoke({"input": question}, config={"configurable": {"session_id": session_id}})
    return result['answer']
