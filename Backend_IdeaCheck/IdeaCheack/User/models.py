from django.contrib.auth.models import User
from django.db import models
from django.views.static import serve


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('entrepreneur' , 'Предприниматель '),
        ('expert' , 'Эксперт'),
        ('investor' , 'Инвестор'),
        ('moderator' , 'Модератор')
    ]


    user = models.OneToOneField(User , on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(choices=ROLE_CHOICES , default='entrepreneur')

    def __str__(self):
        return f"{self.user}"

