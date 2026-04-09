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
        OpalAIPrompt.prompt(serializer)
        return Response(serializer.data, status=201)

    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    print(serializer.data)
    data = "{'id': '1773694739847', 'title': 'testing update', 'type': 'event', 'date': '2026-03-16', 'completed': False, 'created_at': 1773694739847, 'cognitive_load': 0, 'priority': 0}, {'id': '1774299165175', 'title': 'test 2', 'type': 'event', 'date': '2026-03-23', 'completed': False, 'created_at': 1774299165175, 'cognitive_load': 0, 'priority': 0}, {'id': '1774566970988', 'title': 'Laundry', 'type': 'event', 'date': '2026-03-26', 'completed': False, 'created_at': 1774566970988, 'cognitive_load': 0, 'priority': 0}"
    return Response(data)