from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

@api_view(['POST'])
def save_tasks(request):
    print("Hello World")
    print("DATA RECEIVED:", request.data)
    Task.objects.all().delete()  # clear existing

    serializer = TaskSerializer(data=request.data, many=True)
    #print(serializer)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)