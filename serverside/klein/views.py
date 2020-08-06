from django.shortcuts import render

from django.http import HttpResponse, JsonResponse

from .models import answerKey

from django.core.exceptions import ObjectDoesNotExist


import json 

# Create your views here.
def index(request):
    
    if request.is_ajax():

        json_str = request.body.decode(encoding='UTF-8')
        #json_obj = json.loads(json_str, ensure_ascii = False)
        json_obj = json.loads(json_str)
        
        if (json_obj["operation"] == "save"):
            #check to see if an answer key with the specified id exists updates values if it does, creates new entry if it doesn't
            try:
                key = answerKey.objects.get(questionID = json_obj["id"])  
                key.page = json_obj["page"]
                key.answer = json_obj["ans"]
            except ObjectDoesNotExist:
                key = answerKey(questionID = json_obj["id"], page = json_obj["page"], answer = json_obj["ans"])

            key.save() 

        elif (json_obj["operation"] == "check"):
            #assume the answer key has been created
            key = answerKey.objects.get(questionID = json_obj["id"], page = json_obj["page"]) 
            
            return JsonResponse({
                'message': 'success',
                'ans' : key.answer,
            }) 
    return render(request, 'klein_testing.html')