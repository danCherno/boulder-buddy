from django.db import models


class Boulder(models.Model):
    positions = models.JSONField()
    summary = models.TextField()
