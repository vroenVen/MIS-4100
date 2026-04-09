from django.db import models

class Message(models.Model):
    text = models.CharField(max_length=200)



    def __str__(self):
        return self.text
    
class subtasks(models.Model):
  id = models.CharField(max_length=100, primary_key=True)
  title = models.CharField(max_length=255)
  completed = models.BooleanField


class Task(models.Model):
    id = models.CharField(primary_key=True, max_length=100)  # React id
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    date = models.CharField(max_length=255, blank=True)
    subtasks = subtasks
    isRecurring = models.BooleanField(default=False, blank=True)
    recurringDay = models.CharField(max_length=255, default="", blank=True)
    priority = models.IntegerField(default = 0)

'''
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
  subtasks?: SubTask[];
  isRecurring?: boolean;
  recurringDay?: string;
  priority?: number; // AI-generated priority score (1-10)
}

completed	false
id	"1775773049844"
priority	3
subtasks	[]
title	"f1134"
'''