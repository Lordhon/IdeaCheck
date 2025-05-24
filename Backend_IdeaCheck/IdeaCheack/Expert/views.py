from django.conf import settings
from django.core.mail import send_mail
from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Expert.models import ExpertApplication
from Expert.permissionsExpert import IsModerator
from Expert.serializer import ExpertApplicationSerializer
from IdeaCheack.asgi import application





class CreateApplication(APIView):
    permission_classes = [IsAuthenticated]
    def post(self , request):
        user = request.user
        user_profile = user.userprofile

        if ExpertApplication.objects.filter(user=user_profile).exists():
            return Response ( 'Вы уже подавали заявку' , status=status.HTTP_400_BAD_REQUEST)

        serializer = ExpertApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_profile)
            return Response("Заявка отправлена" , status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class GetApplication(APIView):
    permission_classes = [IsModerator]
    def get(self , request):
        application = ExpertApplication.objects.all()
        serializer = ExpertApplicationSerializer(application, many=True)
        return Response (serializer.data , status=status.HTTP_200_OK)



class ApproveApplications(APIView):
        permission_classes = [IsModerator]

        def post(self , request , pk):
            try:
                applications = ExpertApplication.objects.get(pk=pk)
                applications.status = 'approved'
                applications.save()
                user_profile = applications.user
                user_profile.role = 'expert'
                user_profile.save()

                send_mail(
                    subject='Ваша заявка одобрена',
                    message='Поздравляем! Ваша заявка на статус эксперта одобрена.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user_profile.user.email],
                    fail_silently=False,
                )
                applications.delete()
                return Response('Заявка одобрена', status=status.HTTP_200_OK)
            except ExpertApplication.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)


class RejectApplications(APIView):
    permission_classes = [IsModerator]

    def post(self, request, pk):
        try:
            applications = ExpertApplication.objects.get(pk=pk)
            applications.status = 'reject'
            applications.save()
            user_profile = applications.user

            send_mail(
                subject='Ваша заявка откланена',
                message=' Ваша заявка на статус эксперта откланена.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_profile.user.email],
                fail_silently=False,
            )
            applications.delete()
            return Response('Заявка откланена', status=status.HTTP_200_OK)
        except ExpertApplication.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)





