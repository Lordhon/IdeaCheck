from rest_framework import serializers

from ExpertEvaluation.models import ExpertEvaluationDB


class ExpertEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertEvaluationDB
        fields = ['id' , 'relevance' , 'innovation' , 'feasibility' , 'scalability' , 'clarity' , 'comment' ,'created_at']
        read_only_fields = ['created_at']



class ExpertEvaluationSerializerGet(serializers.ModelSerializer):
    idea_title = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = ExpertEvaluationDB
        fields = ['id', 'idea', 'idea_title','innovation' ,  'feasibility' ,'scalability', 'clarity', 'relevance', 'comment' , 'created_at'  , 'first_name', 'last_name']

        read_only_fields = ['created_at', 'first_name', 'last_name']

    def get_idea_title(self, obj):
        return obj.idea.title

    def get_first_name(self, obj):
        return obj.expert.first_name

    def get_last_name(self, obj):
        return obj.expert.last_name