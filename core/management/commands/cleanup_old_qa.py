from django.core.management.base import BaseCommand
from core.models import QuestionAnswer
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Deletes QuestionAnswer entries older than 3 hours'

    def handle(self, *args, **kwargs):
        cutoff = timezone.now() - timedelta(hours=3)
        deleted_count, _ = QuestionAnswer.objects.filter(timestamp__lt=cutoff).delete()
        self.stdout.write(f"Deleted {deleted_count} old Q&A entries.")
