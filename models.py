from django.db import models

# Create your models here.
#currently using SQLlite, builtin developmental database
class answerKey(models.Model):
    #creates database model answerKey with the following fields
    questionID = models.CharField('ID', max_length=20)
    answer = models.CharField('dataString', max_length=100)
    page = models.IntegerField('pageNum')


