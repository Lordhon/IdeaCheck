from django.db import models
from User.models import UserProfile


class ExpertApplication(models.Model):
    STATUS_CHOICES = [
        ('pending' , "Проверка") ,
        ('approved' ,"Одобрен"),
        ('rejected' , 'Откланен')
    ]

    user = models.OneToOneField(UserProfile , models.CASCADE)
    about = models.TextField()
    experience = models.TextField()
    project = models.TextField()
    status = models.CharField(choices=STATUS_CHOICES , default='pending')

    def __str__(self):
        return f" Заявка {self.user}"






