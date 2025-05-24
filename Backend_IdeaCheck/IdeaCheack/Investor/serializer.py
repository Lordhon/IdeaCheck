from rest_framework import serializers

from Investor.models import InvestorApplication


class InvestorApplicationSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = InvestorApplication
        fields = ['id' , 'first_name' ,'last_name' ,  'about' , 'experience' , 'project' , 'status' , 'email']
        read_only_fields = ['email' , 'first_name' ,'last_name']

    def get_email(self,obj):
        return obj.user.user.email
    def get_first_name(self,obj):
        return obj.user.first_name
    def get_last_name(self,obj):
        return obj.user.last_name



