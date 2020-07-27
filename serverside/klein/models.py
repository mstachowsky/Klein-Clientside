from django.db import models

# Create your models here.

class answerKey(models.Model):
    questionID = models.CharField('ansID', max_length=20)
    answer = models.CharField('dataString', max_length=100)
    page = models.IntegerField('pageNum')


