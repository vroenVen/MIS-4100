from django.db import models

class Message(models.Model):
    text = models.CharField(max_length=200)



    def __str__(self):
        return self.text
    
class Task(models.Model):
    task_id = models.CharField(max_length=100)  # React id
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20)
    date = models.DateField()
    completed = models.BooleanField(default=False)
    created_at = models.BigIntegerField()