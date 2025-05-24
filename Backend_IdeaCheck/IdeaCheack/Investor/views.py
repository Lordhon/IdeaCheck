from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from Expert.permissionsExpert import IsModerator
from Investor.models import InvestorApplication
from Investor.serializer import InvestorApplicationSerializer


class CreateApplicationInvestor(APIView):
    permission_classes = [IsAuthenticated]
    def post(self , request):
        user = request.user
        user_profile = user.userprofile

        if InvestorApplication.objects.filter(user=user_profile).exists():
            return Response ( 'Вы уже подавали заявку' , status=status.HTTP_400_BAD_REQUEST)

        serializer = InvestorApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_profile)
            return Response("Заявка отправлена" , status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class GetApplicationInvestor(APIView):
    permission_classes = [IsModerator]
    def get(self , request):
        applications = InvestorApplication.objects.all()
        serializer = InvestorApplicationSerializer(applications, many=True)
        return Response (serializer.data , status=status.HTTP_200_OK)

class ApproveApplicationsInvestor(APIView):
        permission_classes = [IsModerator]
        def post(self , request , pk):
            try:
                applications = InvestorApplication.objects.get(pk=pk)
                applications.status = 'approved'
                applications.save()
                user_profile = applications.user
                user_profile.role = 'investor'
                user_profile.save()

                send_mail(
                    subject='Ваша заявка одобрена',
                    message='Поздравляем! Ваша заявка на статус инвесторв одобрена.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user_profile.user.email],
                    fail_silently=False,
                )
                applications.delete()
                return Response('Заявка одобрена', status=status.HTTP_200_OK)
            except InvestorApplication.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)


class RejectApplicationsInvestor(APIView):
    permission_classes = [IsModerator]

    def post(self, request, pk):
        try:
            applications = InvestorApplication.objects.get(pk=pk)
            applications.status = 'reject'
            applications.save()
            user_profile = applications.user

            send_mail(
                subject='Ваша заявка откланена',
                message=' Ваша заявка на статус инвестора откланена.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_profile.user.email],
                fail_silently=False,
            )
            applications.delete()
            return Response('Заявка откланена', status=status.HTTP_200_OK)
        except InvestorApplication.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)





