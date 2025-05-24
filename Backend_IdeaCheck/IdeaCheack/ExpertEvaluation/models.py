from django.db import models


from BusinessIdeaCheck.models import BusinessIdea
from User.models import UserProfile


class ExpertEvaluationDB(models.Model):
    idea = models.ForeignKey(BusinessIdea , on_delete=models.CASCADE )
    expert = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    relevance = models.IntegerField()
    innovation = models.IntegerField()
    feasibility = models.IntegerField()
    scalability = models.IntegerField()
    clarity = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('idea', 'expert')

    def __str__(self):
        return f"{self.idea.title}  {self.expert.user.username}"



