import os
import uuid
import requests
from django.core.files.base import ContentFile
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UploadedPDF, QAHistory
from document_qa_backend.services.vector_store import process_pdf

from document_qa_backend.services.rag_chain import get_semantic_answer



class UploadPDFView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        session_id = request.POST.get('session_id', 'default')

        if not file:
            return Response({'error': 'No file uploaded'}, status=400)

        pdf_obj = UploadedPDF.objects.create(file=file, session_id=session_id)

        try:
            index_path = process_pdf(pdf_obj.file.path,pdf_obj.id)
            pdf_obj.vector_index_path = index_path
            pdf_obj.save()
        except Exception as e:
            return Response({'error': str(e)}, status=500)

        return Response({'id': pdf_obj.id, 'message': 'Upload successful'})


@api_view(['POST'])
def upload_pdf_from_url(request):
    url = request.data.get('url')
    session_id = request.data.get('session_id', str(uuid.uuid4()))

    if not url or not url.endswith('.pdf'):
        return Response({'error': 'Invalid or missing PDF URL'}, status=400)

    try:
        response = requests.get(url)
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch PDF'}, status=400)

        file_name = os.path.basename(url)
        pdf_file = ContentFile(response.content, name=file_name)

        pdf_obj = UploadedPDF.objects.create(file=pdf_file, session_id=session_id)
        index_path = process_pdf(pdf_obj.file.path, session_id)
        pdf_obj.vector_index_path = index_path
        pdf_obj.save()

        return Response({'id': pdf_obj.id})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def chat_with_pdf(request):
    try:
        pdf_id = request.data.get('pdf_id')
        query = request.data.get('query')
        session_id = request.data.get('session_id')

        print(f"Received: pdf_id={pdf_id}, query={query}, session_id={session_id}")

        if not pdf_id or not query:
            return Response({'error': 'Missing pdf_id or query'}, status=400)

        pdf_obj = UploadedPDF.objects.get(id=pdf_id)
        response = get_semantic_answer(pdf_obj.vector_index_path, query, session_id)

        QAHistory.objects.create(
            pdf=pdf_obj,
            session_id=session_id,
            question=query,
            answer=response
        )

        return Response({'response': response})
    except Exception as e:
        import traceback
        traceback.print_exc()  # 👈 Print full error in terminal
        return Response({'error': str(e)}, status=500)

