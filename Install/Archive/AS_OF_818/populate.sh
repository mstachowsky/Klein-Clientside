# !/bin/bash

# takes 4 optional arguments 
# for project name, for parent directory/folder name,
# for the 'appname' which is where most of the magic happens
# then the virtualenvironment name...
# this will be more work since I will have to add depth by one 
# and add an optional "1/0" field to see if they want us to make a venv

PROJNAME=${1:-KleinProj}
APPNAME=${2:-KleinApp}
DIRNAME=${3:-KleinSrc}
ENVNAME=${4:-venv}

cyan=$(tput setaf 6)
red=$(tput setaf 1)
green=$(tput setaf 2)
bold=$(tput bold)
reset=$(tput sgr0)

# if pip and python aren't installed 

echo "---"
echo "${bold}Checking versions.${reset}"
echo "---"
echo ""

if command -V python >/dev/null 2>&1 ; then
    echo "Python found."
    echo "Version: $(python -V 2>&1)."
else
    echo "Python not found. Exiting."
    exit 1
fi

if command -V pip >/dev/null 2>&1 ; then
    echo "pip found"
    echo "version: $(pip -V 2>&1)."
else
    echo "Pip not found. Exiting."
    exit 1
fi

if command [ "$(python3 -m django version)" ] ; then
    echo "Django found."
    echo "Version: $(python3 -m django version)."
else
    echo "Django not found or up to date, installing..."
    pip install django
fi

echo ""
echo "---"
echo "${bold}Version check complete.${reset}"
echo "---"
echo ""

# checks to make sure this has not already been run / a folder named the project name already exists

if [ -d "$DIRNAME" ] ; then 
    echo ""
    echo "${red}---"
    echo "Project directory already exists. Either change directory or directory name for new project folder. Exiting..."
    echo "---${reset}"
    echo ""
    exit 1
else 
    mkdir "$DIRNAME"
    cd "$DIRNAME"
    echo ""
    echo "---"
    echo "${bold}Project directory made successfully. Now cloning Klein-Clientside.${reset}"
    echo "---"
    echo ""
fi

# clones the source klein files 

git clone -b kevin_testing 'https://github.com/mstachowsky/Klein-Clientside/'

echo ""
echo "---"
echo "${bold}Cloning complete. Making Django project.${reset}"
echo "---"
echo ""

# makes a project

django-admin startproject "$PROJNAME"

echo ""
echo "---"
echo "${bold}Project created, migrating.${reset}"
echo "---"
echo ""

cd "$PROJNAME" 

python manage.py makemigrations
python manage.py migrate

python manage.py startapp "$APPNAME"

cd "$APPNAME"

echo ""
echo "---"
echo "${bold}Migrations complete. Populating project with Klein templates.${reset}"
echo "---"
echo ""

if [ -f views.py ]; then
	rm views.py
	echo "  Default/existing views.py removed successfully."
else
	echo "  No default views.py to remove."
fi

if [ -f urls.py ]; then
	rm urls.py
	echo "  Default/existing urls.py removed successfully."
else
	echo "  No default urls.py to remove."
fi


cd ../../Klein-Clientside/serverside/klein/

DEST="../../../$PROJNAME/$APPNAME"

# can add -v for 'verbose' description for debugging.

cp -R ./static "$DEST"
cp -R ./templates "$DEST"
cp views.py "$DEST"
cp urls.py "$DEST"

cd ../../../$PROJNAME/$APPNAME

if [ -f "urls.py" ] && [ -f "views.py" ] && [ -d "static" ] && [ -d "templates" ]; then
    echo ""
    echo "---"
    echo "${bold}Files moved successfully.${reset}"
    echo "---"
    echo ""
else 
    echo ""
    echo "${red}---"
    echo "Files not moved. Exiting..."
    echo "---${reset}"
    echo ""
    exit 1
fi

cd ../../$PROJNAME
echo "$(pwd)"

python manage.py makemigrations
python manage.py migrate

cd $PROJNAME
echo "$(pwd)"

echo "---"
echo "${bold}Population complete. Appending django source files with necessary urls.${reset}"
echo "---"
echo ""

CURRENTDIR="$(pwd)"

python ../../../populate.py "$CURRENTDIR" $APPNAME

ERR_ID=$?

if [ $ERR_ID == 0 ]; then 
    echo ""
    echo "${bold}---"
    echo "Appending lines successful. Making final migrations..."
    echo "---${reset}"
    echo ""
elif [ $ERR_ID == 1 ]; then 
    echo ""
    echo "${red}---"
    echo "Appending lines unsuccessful. You should never see this, this means populate.py was called with the wrong number of arguments."
    echo "---${reset}"
    echo ""
    exit 1
elif [ $ERR_ID == 2 ]; then 
    echo ""
    echo "${red}---"
    echo "Appending lines unsuccessful. You should never see this, this means populate.py was called in the wrong folder, and urls.py and settings.py were not found."
    echo "---${reset}"
    echo ""
    exit 1
else 
    echo ""
    echo "${red}---"
    echo "Something went wrong. All installs were correct except for adding lines to:"
    echo "  urls.py"
    echo "  - at the end of 'from django.urls import path', add ', include'."
    echo "  - add 'path('AppName', include('AppName.urls'))' to 'urlpatterns' array."
    echo ""
    echo "  settings.py"
    echo "  - add 'appname.apps.AppnameConfig' to INSTALLED_APPS array."
    echo ""
    echo "and you're all set."
    echo "---${reset}"
    echo ""
    exit 1
fi

echo ""
echo "${bold}${green}---"
echo "Installation successful. Happy creating!"
echo "---${reset}${reset}"
echo ""
