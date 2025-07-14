from django.urls import path
from .views import UploadPDFView, upload_pdf_from_url, chat_with_pdf,health_check

urlpatterns = [
    path('', health_check, name='health'),
    path('upload/', UploadPDFView.as_view(), name='upload'),
    path('upload_url/', upload_pdf_from_url, name='upload_url'),
    path('chat/', chat_with_pdf, name='chat'),
]
