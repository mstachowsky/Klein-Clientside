from django.shortcuts import render

from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):
    #return HttpResponse("testing")
    
    if request.is_ajax():
        return JsonResponse({
            'message': 'success'
        }) 
    return render(request, 'klein_testing.html')