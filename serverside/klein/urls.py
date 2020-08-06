from django.urls import path

from . import views

urlpatterns = [
    #sets up the url path as serverAddress/klein to use the function index from views.py
    #Eg. http://127.0.0.1:8000/klein
    path('', views.index, name='klein'),
]