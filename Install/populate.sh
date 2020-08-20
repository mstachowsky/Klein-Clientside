# !/bin/bash

# takes 4 optional arguments 
# for project name, for parent directory/folder name,
# for the 'appname' which is where most of the magic happens
# then the virtualenvironment name...
# this will be more work since I will have to add depth by one 
# and add an optional "1/0" field to see if they want us to make a venv

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

if [ -d "Klein-Clientside" ] ; then 
    echo ""
    echo "${red}---"
    echo "Project directory already exists. Either change directory or directory name for new project folder. Exiting..."
    echo "---${reset}"
    echo ""
    exit 1
else 
    echo "---"
    echo "${bold}Project directory made successfully. Now cloning Klein-Clientside.${reset}"
    echo "---"
    echo ""
fi

# clones the source klein files 

git clone -b master 'https://github.com/mstachowsky/Klein-Clientside/'

echo ""
echo "---"
echo "${bold}Cloning complete.${reset}"
echo "---"
echo ""

# done! 

echo ""
echo "${bold}${green}---"
echo "Installation successful. Happy creating!"
echo "---${reset}${reset}"
echo ""
