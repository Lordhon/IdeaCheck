from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from functools import wraps
from rest_framework.permissions import AllowAny

from User.tokens import account_activation_token
from User.models import UserProfile
from User.serializer import RegisterSerializer, UserProfileSerializer


class RegisterUser(APIView):
    def post(self,request):
        serializer =RegisterSerializer(data = request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            last_name = serializer.validated_data['last_name']
            first_name = serializer.validated_data['first_name']


            user = User.objects.create_user(username = username , password=password , email=email  , is_active=False)
            UserProfile.objects.create(user = user , last_name = last_name , first_name = first_name , role = 'entrepreneur')

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)
            activation_link = f"http://83.222.16.195/user/activate/{uid}/{token}/"

            send_mail(
                'Активация Аккаунта',
                f'Привет , {user.username}!\nПерейди по ссылке для активации:\n{activation_link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False

            )
            return Response('Пользователь создан', status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivateUser(APIView):
    def get(self , reqeust , uidb64 , token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Неверная ссылка'}, status=400)

        if account_activation_token.check_token(user , token):
            user.is_active  = True
            user.save()
            return Response('Аккаунт активирован')
        return Response({'error': 'Ссылка недействительна или устарела'}, status=400)


def send_password_reset_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_link = f"http://83.222.16.195/user/reset_password/{uid}/{token}"


    send_mail(
        'Сбросить пароль',
        f'Привет, {user.username}!\nПерейди по ссылке чтобы изменить пароль:{reset_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False
    )

class PasswordResetRequest(APIView):
    def post(self , request):
        email = request.data.get('email')

        try:
            user =  User.objects.get(email=email)
        except User.DoesNotExist:
            return Response('Пользователь с таким email не найден', status=status.HTTP_404_NOT_FOUND)
        send_password_reset_email(user)
        return Response('Ссылка для сброса пароля отправлена ', status=status.HTTP_200_OK)

class PasswordResetConfirm(APIView):
    def post(self,request,uidb64,token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Неверная ссылка'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user , token):
            return Response('Ссылка недействительна')
        new_password = request.data.get('password')
        if new_password is None:
            return Response('Поле не может быть пустым',status=status.HTTP_400_BAD_REQUEST)

        try:
            password_validation.validate_password(new_password, user)
        except ValueError as e:
            return Response(e.messages , status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Пароль успешно изменен'}, status=status.HTTP_200_OK)




class MyProfile(APIView):
    def get(self , request):
        user = request.user.userprofile
        serializer = UserProfileSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


class CheckUserAPIView(APIView):
    def get(self  , request):
        login = request.query_params.get("login","").strip()
        if not login:
            return Response("Неправильный login" , status=status.HTTP_400_BAD_REQUEST)
        found = User.objects.filter(username=login).exists()
        return Response({"found":found})
    
def api_security(func):
    @wraps(func)
    def wrapped(self,request, *args, **kwargs):
        authheaders = request.headers.get("Authorization")
        
        if not authheaders:
            return Response(
                {"error": "Отсутствует заголовок Authorization"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        split = authheaders.split()
        if len(split) != 2 or split[0].lower() != "bearer":
            return Response(
                {"error": "Неверный формат токена"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        secret = split[1]
        if secret != settings.SECRET_API_TOKEN:
            return Response(
                {"error": "Неверный токен"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return func(self,request, *args, **kwargs)
    return wrapped
    

class UpdateUserAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    @api_security
    def get(self  , request):
        login = request.query_params.get("login","").strip()
        if not login:
            return Response("Неправильный login" , status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=login)
            user.userprofile.status = 'pro'
            user.userprofile.save()
            return Response({"message": "Status updated to pro"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
