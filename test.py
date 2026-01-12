
import queue
import heapq 
import random
print("Hello World")

class Task:
    def __init__(self, taskName: str,length:int):
        self.taskName = taskName
        self.length = length # In minutes


class Point:
    def __init__(self, priority: float, task: Task):
        self.priority = priority
        self.task = task
q = queue.Queue

pq = []

testTask = Task("test",1)


while(True):
    taskName = input("Enter Task Name: ")
    taskTime = input("Task Time: ")
    if(taskName == "" or taskTime == 0):
        break
    test = Task(taskName,taskTime)
    heapq.heappush(pq,(random.randint(1,50),test))
    


#heapq.heappush(pq,(1,"Test"))


while(pq.count != 0):
    priority, task = heapq.heappop(pq)
    print(priority)
    print(task)


"""
task
Name of task
mental load
time estimate

"""

