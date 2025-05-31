from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from User.models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField(required=False)
    email = serializers.EmailField(required=True , validators=[UniqueValidator(queryset=User.objects.all(),message="Пользователь с таким email есть ")])
    username = serializers.CharField(validators=[UniqueValidator(queryset=User.objects.all() , message="username занят") ])


    class Meta:
        model = User
        fields = ('username' , 'password' , 'email', 'first_name' , 'last_name' , 'role' , 'status')




class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)


    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'first_name', 'last_name', 'role']