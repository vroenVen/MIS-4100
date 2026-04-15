import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

from .Scripts import OpalAIPrompt


@api_view(['POST'])
def save_tasks(request):
    Task.objects.all().delete()  # clear existing

    serializer = TaskSerializer(data=request.data, many=True)

    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        
        
        data = '''
                [
                {
                    "title": "a",
                    "completed": false,
                    "subtasks": [],
                    "priority": 4,
                    "id": "1776232258908"
                },
                {
                    "title": "4",
                    "completed": false,
                    "subtasks": [],
                    "priority": 6,
                    "id": "1776232825155"
                }
                ]
                '''
        
        return Response( json.loads(data),status=201);
        # return Response(serializer.data, status=201)

    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    print(serializer.data)
    # data = "{'id': '1775778652280', 'title': '1', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 6}, {'id': '1775778654477', 'title': '2', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 10}, {'id': '1775778656951', 'title': '3', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 6}, {'id': '1775778793902', 'title': '4', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 10}, {'id': '1775778887493', 'title': '4', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 0}, {'id': '1775778962214', 'title': '5', 'completed': False, 'date': '', 'isRecurring': False, 'recurringDay': '', 'priority': 4}"
    # data = "{'id': '1773694739847', 'title': 'testing update', 'type': 'event', 'date': '2026-03-16', 'completed': False, 'created_at': 1773694739847, 'cognitive_load': 0, 'priority': 0}, {'id': '1774299165175', 'title': 'test 2', 'type': 'event', 'date': '2026-03-23', 'completed': False, 'created_at': 1774299165175, 'cognitive_load': 0, 'priority': 0}, {'id': '1774566970988', 'title': 'Laundry', 'type': 'event', 'date': '2026-03-26', 'completed': False, 'created_at': 1774566970988, 'cognitive_load': 0, 'priority': 0}"
    return Response(serializer.data)