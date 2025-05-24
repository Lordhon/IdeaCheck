from rest_framework import serializers

from BusinessIdeaCheck.models import BusinessIdea


class BusinessIdeaSerializer(serializers.ModelSerializer):

    email = serializers.SerializerMethodField()
    class Meta:
        model = BusinessIdea
        fields = ['id','title' ,'short_description' ,'target_audience' ,'problem', 'solution', 'pricing' ,'competitors', 'channels' ,'created_at' , 'email' , 'average_rating']
        read_only_fields = ['created_at' , 'email' , 'average_rating']


    def get_email(self,obj):
        return obj.user.user.email

