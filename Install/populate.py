import os
import sys

# I apologize in advanced to the poor soul who has to look at this and see I manually search each line and append what I want
# or I say you're welcome for the good laugh you're about to have. I looked up Django shell and the like 
# but all adding to arrays or url configurations seemed to need a manual adding of certain things to installedapps/urlpatterns
# and THEN you could use the shell...

# Appends 'appname.apps.AppnameConfig' to 'INSTALLED_APPS'
def appendSett(AppName):
	print("---")
	print("Append settings function called!")
	newstr = AppName + ".apps." + AppName.capitalize() + "Config"
	# print(newstr)
	with open('settings.py','r') as file:
		lines = file.readlines()

	for i,line in enumerate(lines):
		if (line.find("INSTALLED_APPS") > -1):
			if (lines[i+1].find(newstr) > -1):
				print("  settings.py already modified.")
				print("Append settings finished.")
				print("---")
				print("")
				return 1
			else:
				lines.insert(i+1,'    \''+newstr+'\',\n')

	lines = "".join(lines)
	# print(lines)
	with open('settings.py','w') as file:
		file.write(lines)
	
	print("Append settings finished.")
	print("---")
	print("")
	return 0

# Adds 'include' to the line which has 'from django.urls import path', so 
# From 'from django.urls import path' to 'from django.urls import path, include'
# and adds 'path('appname', include('appname.urls'))' to the 'urlpatterns' array.
def appendUrls(AppName):
	print("---")
	print("Append urls function called!")
	newstr = "path('" + AppName + "', include('" + AppName + ".urls')),\n"
	with open('urls.py','r') as file:
		lines = file.readlines()

	bool_check = False
	for i,line in enumerate(lines):
		if (line.find("from django.urls import") > -1):
			if (lines[i].find("include") == -1):
				temp = lines[i]
				temp2 = temp[0:len(temp)-1]+", include"+'\n'
				lines[i] = temp2
				bool_check = True
		if (line.find("urlpatterns = [") > -1):
			if (lines[i+1].find(newstr) > -1):
				# print(lines[i+1])
				print("  urls.py already added to array.")
			else:
				lines.insert(i+1,'    '+newstr)

	if not bool_check:
		print("  urls.py include already imported.")

	lines = "".join(lines)
	# print(lines)
	with open('urls.py','w') as file:
		file.write(lines)
	
	print("Append urls finished.")
	print("---")
	print("")
	return 0

# main function which takes in an input array of command line arguments, which are fed by populate.sh
def main(args):
	# args[0] is the directory and
	# args[1] is the name of the app
	switchSet = False
	urlSet = False
	for i in os.listdir(args[0]):
		if (i == "settings.py"):
			switchSet = True
		if (i == "urls.py"):
			urlSet = True
	if (urlSet and switchSet):
		t1 = appendSett(args[1])
		t2 = appendUrls(args[1])
		if (t1 > 0 or t2 > 0):
			return 2
		else:
			return 0
	else:
		print("settings.py or urls.py not found in current directory.")
		return 2
	return -1

# takes two arguments, path and 'appname'. If not two arguments, exits.
if (__name__ == '__main__'):
	if (len(sys.argv) < 3):
		print("Not enough arguments. Takes two additional arguments.")
		sys.exit(1)
	elif (len(sys.argv) == 3):
		sys.exit(main(sys.argv[1:]))
	else:
		print("Too many arguments. Takes two additional arguments.")
		sys.exit(1)


















