from django.shortcuts import render

from django.http import HttpResponse, JsonResponse

from .models import answerKey
import json 

# Create your views here.
def index(request):
    #return HttpResponse("testing")
    
    if request.is_ajax():
        #data = json.loads(request.POST.get(''))

        json_str = request.body.decode(encoding='UTF-8')
        #json_obj = json.loads(json_str, ensure_ascii = False)
        json_obj = json.loads(json_str)
        key = answerKey()
        key.questionID = json_obj["id"]
        key.page = json_obj["page"]
        key.answer = json_obj["ans"]
        key.save()
        
        return JsonResponse({
            'message': 'success',
            'id' : json_obj["id"],
            'page' : json_obj["page"],
            'ans' : json_obj["ans"],

        }) 
    return render(request, 'klein_testing.html')