from django.shortcuts import render

from django.http import HttpResponse

# Create your views here.
def index(request):
    #return HttpResponse("testing")
    if not request.POST:
        return render(request, 'klein_testing.html')
    return HttpResponse("yes sir")