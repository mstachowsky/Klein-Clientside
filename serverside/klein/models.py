from django.db import models

# Create your models here.

class answerKey(models.Model):
    questionID = models.CharField('ID', max_length=20, unique=True)
    answer = models.CharField('dataString', max_length=100)
    page = models.IntegerField('pageNum')


