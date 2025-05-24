from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from BusinessIdeaCheck.models import BusinessIdea

from ExpertEvaluation.models import ExpertEvaluationDB
from ExpertEvaluation.serializer import ExpertEvaluationSerializer, ExpertEvaluationSerializerGet
from User.models import UserProfile


class CreateEvaluation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request , idea_id):
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response("Профиль не найден")
        if profile.role !='expert':
            return Response('Нужно быть экспертом')
        try:
            idea = BusinessIdea.objects.get(id=idea_id)
        except BusinessIdea.DoesNotExist:
            return Response("Идея не найден")


        if ExpertEvaluationDB.objects.filter(idea = idea , expert = profile).exists():
            return Response("Вы уже оценивали эту работу")
        serializer = ExpertEvaluationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(idea=idea , expert = profile)
            send_mail(
                subject='Вашу идею оценили',
                message=' Зайди в свой профиль что бы посмотреть оценку',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                fail_silently=False,
            )
            return Response(serializer.data)

        return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)

class ExpertEvaluationsByUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self , request):
        profile = UserProfile.objects.get(user=request.user)
        evaluations = ExpertEvaluationDB.objects.filter(expert=profile)
        serializer = ExpertEvaluationSerializerGet(evaluations , many=True)
        return Response(serializer.data)




class ExpertEvaluationsByIdea(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request , idea_id):
        try:
            idea = BusinessIdea.objects.get(id = idea_id)
        except BusinessIdea.DoesNotExist:
            return Response("Идея не найдена")
        evaluations = ExpertEvaluationDB.objects.filter(idea=idea )
        serializer = ExpertEvaluationSerializerGet(evaluations , many=True)
        return Response(serializer.data)


class IdeaOverallRatingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, idea_id):
        try:
            idea = BusinessIdea.objects.get(id=idea_id)
        except BusinessIdea.DoesNotExist:
            return Response({'error': 'Нет идеи'}, status=404)

        evaluations = ExpertEvaluationDB.objects.filter(idea=idea)

        if not evaluations.exists():
            return Response({'error': 'Оценок нет'}, status=404)

        fields = ['relevance', 'innovation', 'feasibility', 'scalability', 'clarity']
        total_sum = 0
        total_count = 0

        for evaluation in evaluations:
            for field in fields:
                total_sum += getattr(evaluation, field, 0)
                total_count += 1

        if total_count > 0:
            avg = total_sum / total_count
        else:
            avg=0
        idea.average_rating = avg
        idea.save()

        return Response( round(avg, 2))



