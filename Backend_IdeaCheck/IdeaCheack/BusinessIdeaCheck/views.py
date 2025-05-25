from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
import json
import os

from BusinessIdeaCheck.models import BusinessIdea
from BusinessIdeaCheck.serializer import BusinessIdeaSerializer
from django.conf import settings

from ExpertEvaluation.models import ExpertEvaluationDB
from User.models import UserProfile
from ExpertEvaluation.permissionsExperions import IsExpert
from Investor.permissionsInvestor import IsInvestor


api_key = os.getenv("OPENAI_API_KEY")

class CreateBusinessIdeaAI(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        serializer = BusinessIdeaSerializer(data=request.data)
        if serializer.is_valid():
            user_profile = request.user.userprofile
            user = request.user
            email = user.email

            idea = serializer.save(user=user_profile)
            prompt = (
                f"Название: {serializer.validated_data.get('title')}\n"
                f"Краткое описание: {serializer.validated_data.get('short_description')}\n"
                f"Целевая аудитория: {serializer.validated_data.get('target_audience')}\n"
                f"Проблема: {serializer.validated_data.get('problem')}\n"
                f"Решение: {serializer.validated_data.get('solution')}\n"
                f"Ценообразование: {serializer.validated_data.get('pricing')}\n"
                f"Конкуренты: {serializer.validated_data.get('competitors')}\n"
                f"Каналы продвижения: {serializer.validated_data.get('channels')}\n\n"
                "Проанализируй и оцени бизнес идею. Укажи плюсы, минусы и рекомендации."

            )
            try:
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "HTTP-Referer": "http://87.228.89.66",
                        "X-Title": "IdeaCheck",
                        "Content-Type": "application/json",
                    },
                    data=json.dumps({
                        "model": "deepseek/deepseek-r1:free",
                        "messages": [{"role": "user", "content": prompt}],
                    })
                )
                response.raise_for_status()
                ai_response = response.json()["choices"][0]["message"]["content"]


                send_mail(
                    subject=f"AI-оценка вашей бизнес-идеи: {idea.title}",
                    message=ai_response,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False
                )



                return Response({**serializer.data, "ai_response": ai_response}, status=status.HTTP_201_CREATED)

            except requests.exceptions.RequestException as e:
                return Response(
                    {"error": f"Ошибка AI: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class GetMyIdea(APIView):
    permission_classes = [IsAuthenticated]
    def get(self , request):
        user = request.user.userprofile
        idea = BusinessIdea.objects.filter(user = user)
        serializer = BusinessIdeaSerializer(idea , many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class GetIdeaPk(APIView):
    permission_classes = [IsAuthenticated]
    def get(self , request , pk):
        try:
            idea = BusinessIdea.objects.get(pk=pk)
        except BusinessIdea.DoesNotExist:

            return Response('Идея не найдена ', status=status.HTTP_404_NOT_FOUND)
        if idea.user.user.username != request.user.username:
            return Response({'detail': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

        serializer = BusinessIdeaSerializer(idea)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetIdeaPkExpert(APIView):
    permission_classes = [IsAuthenticated]
    def get(self , request , pk):
        try:
            idea = BusinessIdea.objects.get(pk=pk)
        except BusinessIdea.DoesNotExist:
            return Response('Идея не найдена ', status=status.HTTP_404_NOT_FOUND)
        serializer = BusinessIdeaSerializer(idea)
        return Response(serializer.data, status=status.HTTP_200_OK)




class GetIdea(APIView):
    permission_classes = [IsAuthenticated , IsExpert , IsInvestor]
    def get(self , request ):
        try:
            profile = UserProfile.objects.get(user=request.user)
            rated_ideas_ids = ExpertEvaluationDB.objects.filter(expert=profile).values_list('idea_id', flat=True)
            idea = BusinessIdea.objects.exclude(id__in=rated_ideas_ids)
        except BusinessIdea.DoesNotExist:
            return Response('Идея не найдена ', status=status.HTTP_404_NOT_FOUND)

        serializer = BusinessIdeaSerializer(idea , many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)

class GetIdeaAVG(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request):
            try:
                idea = BusinessIdea.objects.order_by('-average_rating')

            except BusinessIdea.DoesNotExist:
                return Response('Идея не найдена ', status=status.HTTP_404_NOT_FOUND)

            serializer = BusinessIdeaSerializer(idea, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)





