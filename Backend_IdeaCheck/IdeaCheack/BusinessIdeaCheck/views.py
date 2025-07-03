from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
import json
import os
import time 
from django.core.cache import cache
from BusinessIdeaCheck.tasks import ai_response_send

from BusinessIdeaCheck.models import BusinessIdea
from BusinessIdeaCheck.serializer import BusinessIdeaSerializer
from django.conf import settings

from ExpertEvaluation.models import ExpertEvaluationDB
from User.models import UserProfile
from BusinessIdeaCheck.permissons import  IsExpertOrInvestor


api_key = os.getenv("OPENAI_API_KEY")

class CreateBusinessIdeaAI(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        serializer = BusinessIdeaSerializer(data=request.data)
        if serializer.is_valid():
            user_profile = request.user.userprofile
            user = request.user
            

            ideas = user_profile.businessidea_set.all()
            countIdea = ideas.count()
            if user_profile.status == 'standart' and countIdea >=10:
                return Response ({"error":"Лимит достугнут купите подписку PRO "} ,  status=status.HTTP_403_FORBIDDEN)

            idea = serializer.save(user=user_profile)
            experts = UserProfile.objects.filter(role='expert')
            for i in experts :
                cache_key = f'idea_for{i.user.id}'
                cache.delete(cache_key)

            investors = UserProfile.objects.filter(role='investor')
            for i in investors :
                cache_key = f'idea_for{i.user.id}'
                cache.delete(cache_key)
            
            ai_response_send.delay(idea.id)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)



    

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
    permission_classes = [IsExpertOrInvestor]

    def get(self, request):
        userid = request.user.id
        cache_key = f"idea_for{userid}"
        idea_data = cache.get(cache_key)

        if idea_data is None:
            
            profile = UserProfile.objects.get(user=request.user)

            if profile.role == 'expert':
                rated_ideas_ids = ExpertEvaluationDB.objects.filter(expert=profile).values_list('idea_id', flat=True)
                ideas = BusinessIdea.objects.exclude(id__in=rated_ideas_ids)
            elif profile.role == 'investor':
                ideas = BusinessIdea.objects.all()
            else:
                return Response({"detail": "Доступ запрещен"}, status=403)

            if not ideas.exists():
                return Response({"detail": "Пока нет идей для оценки"}, status=200)

            serializer = BusinessIdeaSerializer(ideas, many=True)
            idea_data = serializer.data
            cache.set(cache_key, idea_data, 60*5)  

        return Response(idea_data, status=status.HTTP_200_OK)


        

        

class GetIdeaAVG(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request):
            try:
                idea = BusinessIdea.objects.order_by('-average_rating')

            except BusinessIdea.DoesNotExist:
                return Response('Идея не найдена ', status=status.HTTP_404_NOT_FOUND)

            serializer = BusinessIdeaSerializer(idea, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)





