from django.contrib.auth.models import User
from django.db import models

from User.models import UserProfile


class BusinessIdea(models.Model):
    user = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    short_description = models.TextField()
    target_audience = models.TextField()
    problem  = models.TextField()
    solution  = models.TextField()
    pricing = models.TextField()
    competitors = models.TextField()
    channels = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    average_rating = models.FloatField(default=0.0)



    def __str__(self):
        return f"Идея {self.user.user.username}"





