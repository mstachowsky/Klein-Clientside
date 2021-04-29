import os
import sys
import configparser

config = configparser.ConfigParser()
try:
    config.read('./config.ini')
    devRoot = config['Paths']['devRoot']
    bookRoot = config['Paths']['bookRoot']
except:
    sys.exit('Misconfigured config.ini file.')

bookName = sys.argv[1]
if not os.path.isdir(devRoot):
    print("making", devRoot)
    os.makedirs(devRoot)
if not os.path.isdir(bookRoot):
    print("making", bookRoot)
    os.makedirs(bookRoot)

os.makedirs(os.path.join(devRoot, f"{bookName}_dev"))

os.makedirs(os.path.join(bookRoot, bookName))
os.makedirs(os.path.join(bookRoot, bookName, 'res'))
