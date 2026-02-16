from django.db import models
from django.contrib.auth.models import User


class Boulder(models.Model):
    positions = models.JSONField()
<<<<<<< Updated upstream:back/app/boulder/models.py
    summary = models.TextField(blank=True, default="")
=======
<<<<<<< Updated upstream:app/boulder/models.py
    summary = models.TextField()
=======
    summary = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to='boulders/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boulders', null=True, blank=True)
    
    def __str__(self):
        return f"Boulder {self.id} by {self.created_by.username if self.created_by else 'Unknown'}"
>>>>>>> Stashed changes:back/app/boulder/models.py
>>>>>>> Stashed changes:app/boulder/models.py
