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
# This method will convert the string sent through a POST request into human readable text.
# Then, after checking the filename is not duplicate, or null, if the filename is a duplicate, 
# it will return a HttpResponse. If the string in the subsequent POST request has an <overwrite>
# tag, then the method will overwrite the md file.
# Finally, after the user decides to print the book file, the method will convert the 
# MD file into a .bk file and place both md and bk files into a sub folder.
# This method will also handle image/video files in the form of a formData, sent through a POST request,
# by writing the files in the static folder of Klein.
def index(request):
	if request.method == 'POST':
		if request.content_type == 'text/plain':
			str = parse(request)
			name = str.split("<bookName>", 1)[-1]
			str = str.split("<bookName>", 1)[0]
			
			l = str.split("\n")
			
			# save img/video tags and their names for transport.
			img = []
			for element in l:
				if "img" in element or "video" in element:
					img.append(element)

			count = 0
			for element in img:
				img[count] = element.rpartition('/')[2]
				count += 1

			print(img)
			
			bookDevDir = os.path.join(BASE_DIR, f'{name}_dev' + '/')
			if "<overwrite>" in name:	
				name = name.replace("<overwrite>", "")
				bookDevDir = os.path.join(BASE_DIR, f'{name}_dev' + '/')
				file_path = os.path.join(BASE_DIR + f'{name}_dev' + '/', f'{name}.md')
				overwriteFile(file_path, str)
			else: 
				if not name or name == "null":
					response = HttpResponse("[ERROR]: bookEditor/views.py : Your Assignment needs a title!", content_type='text/plain')
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
			return parseToJSON(name, bookDevDir, img)
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
	return render(request, 'book_editor_index.html')

# This method creates the bk file, and moves said bk file, to the corresponding subfolder.
# It also moves the images and videos into their respective subfolder, using the img tags, and their names.
# Then, it returns a HttpResponse, confirming its actions or giving an exception.
def parseToJSON(name, base_dir, img):
	try:
		os.system('python3 ' + SUBFOLDER_PATH + ' ' + name)
		for element in img:
			try:
				os.system('mv ' + BASE_DIR + 'res/' + element + ' ' + base_dir + 'res')
			except:
				response = HttpResponse("[EXCEPTION] - bookEditor/views.py : Exception Occured with parseToJSON", content_type='text/plain')
				return response;
		os.system('python3 ' + PARSE_PATH + ' ' + BOOK_ROOT + f'{name}_dev' + '/' + name + ' move *.bk ' + base_dir + ' > /dev/null')
		response = HttpResponse("[SUCCESS] : (" + name + ") Successfully Created!", content_type='text/plain')
		return response;
	except:
		response = HttpResponse("[EXCEPTION] - bookEditor/views.py : Exception Occured with parseToJSON", content_type='text/plain')
		return response;

# This method parses through the string sent by Assignment Editor, by removing certain tags or replacing with newline characters.
def parse(request):
	str = request.body.decode(encoding='UTF-8')
	str = re.sub(r'<div(.*?)">', '', str)
	str = str.replace("<div></div>", "")
	overwriteFile("/home/mike/klein/klein/test.txt", str)
	str = str.replace("</div>", "")
	str = str.replace("<div>", "\n")
	str = str.replace("</li>", "")
	str = str.replace("<br>", "\n")
	str = re.sub(r'&(.*?);', '', str)
	return str

# This method overwrites any file (i.e. the md file) into the chosen file path.
def overwriteFile(file_path, str):
	with open(file_path, 'w+') as outfile:
		outfile.write(str)

# This method writes the file(i.e. images/videos) in chunks into a chosen file path.
def handle_uploaded_file(f, name):
	with open(BASE_DIR + 'res/' + name, 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)
