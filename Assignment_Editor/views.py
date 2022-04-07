from django.shortcuts import render

from django.http import HttpResponse

import re
import os
import sys

PROJECT_PATH = "/home/mike/klein"
PARSE_PATH = PROJECT_PATH + "/parseToJSON.py"
SUBFOLDER_PATH = PROJECT_PATH + "/dev/createNewBook.py"
BOOK_ROOT = "/klein/static/BOOKS/" 
BASE_DIR = PROJECT_PATH + BOOK_ROOT

# Create your views here.
def index(request):
	if request.method == 'POST':
		if request.content_type == 'text/plain':
			str = parse(request)
			name = str.split("<assignmentName>", 1)[-1]
			str = str.split("<assignmentName>", 1)[0]
			bookDevDir = os.path.join(BASE_DIR, f'{name}_dev' + '/')
			if "<overwrite>" in name:	
				name = name.replace("<overwrite>", "")
				file_path = os.path.join(BASE_DIR + f'{name}_dev' + '/', f'{name}.md')
				overwriteFile(file_path, str)
			else: 
				if not name or name == "null":
					response = HttpResponse("[ERROR]: assignmentEditor/views.py : Your Assignment needs a title!", content_type='text/plain')
					return response
				else:
					if not os.path.exists(bookDevDir):
						os.makedirs(bookDevDir)
						
					file_path = os.path.join(bookDevDir, f'{name}.md')
					if os.path.exists(file_path):
						response = HttpResponse("[WARNING]: overwrite", content_type='text/plain')
						return response
					else: 
						overwriteFile(file_path, str)

			return parseToJSON(name, bookDevDir)
		else:
			name = ""
			if 'image' in request.FILES:
				form = request.FILES['image']
				name = form.name
				handle_uploaded_file(form, name)
			elif 'video' in request.FILES:
				form = request.FILES['video']
				name = form.name
				handle_uploaded_file(form, name)
	#renders the html page 
	return render(request, 'assignment_editor_index.html')

def parseToJSON(name, base_dir):
	try:
		os.system('python3 ' + SUBFOLDER_PATH + ' ' + name)
		os.system('python3 ' + PARSE_PATH + ' ' + BOOK_ROOT + f'{name}_dev' + '/' + name + ' move *.bk ' + base_dir + ' > /dev/null')
		response = HttpResponse("[SUCCESS] : (" + name + ") Successfully Created!", content_type='text/plain')
		return response;
	except:
		response = HttpResponse("[EXCEPTION] - assignmentEditor/views.py : Exception Occured with parseToJSON", content_type='text/plain')
		return response;

def parse(request):
	str = request.body.decode(encoding='UTF-8')
	str = re.sub(r'<div(.*?)">', '', str)
	str = str.replace("</div>", "")
	str = str.replace("<div>", "\n")
	str = str.replace("</li>", "")
	str = str.replace("<br>", "\n")
	str = re.sub(r'&(.*?);', '', str)
	return str

def overwriteFile(file_path, str):
	with open(file_path, 'w') as outfile:
		outfile.write(str)

def handle_uploaded_file(f, name):
	with open(BASE_DIR + 'res/' + name, 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)