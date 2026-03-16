from rest_framework import serializers
from .models import Message
from .models import Task

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'



class TaskSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="task_id")

    class Meta:
        model = Task
        fields = ["id", "title", "type", "date", "completed", "created_at"]