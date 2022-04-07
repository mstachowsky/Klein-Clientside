from django.urls import path

from . import views

urlpatterns = [
    #sets up the url path as serverAddress/bookEditor to use the function index from views.py
    #Eg. http://127.0.0.1:8000/bookEditor
    path('', views.index, name='assignmentEditor'),
]
