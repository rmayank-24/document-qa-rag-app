from django.db import models

class UploadedPDF(models.Model):
    file = models.FileField(upload_to='pdfs/')
    session_id = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    vector_index_path = models.CharField(max_length=255)

    def __str__(self):
        return self.file.name

class QAHistory(models.Model):
    pdf = models.ForeignKey(UploadedPDF, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    session_id = models.CharField(max_length=255, default='default')  # ✅ Add this
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question} | A: {self.answer[:50]}"
