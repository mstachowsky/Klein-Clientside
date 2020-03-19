#The parser that takes a md type file and turns it into something that Clein can handle.  note: the user should basically never look at this
#it's ugly and just produces a JSON string.
import os
import sys
import time

startTime = time.time();
#Here is where we parse the file.  NEEDS TO BE MORE GENERIC
#fName = os.getcwd()+'\FEMM\\femm'#'\ENGG4280_IMC\\ENGG4280_IMC'
fName = os.getcwd()+sys.argv[1]#'\ENGG4280_IMC\\ENGG4280_IMC_dev'
f = open(fName+'.md','r')
outFile = open(fName+'.bk','w')

#all we do is build a huge JSON string.  You'll notice below that there are a bunch of open braces and the like.  It's just to create
#the appropriate JSON.  You should probably just follow along with the output file to better understand it, but here is the gist:

'''
    Clein files begin with a bookName and then a big array of Pages.
    
    Each Page contains a page name and a big array of Components
    
    each component is created separately according to specific things it needs.  So a bare minumum is:
    
    {bookName:name,pages:[]}
    
    Or:
    
    {bookName:name,pages:[{name:pageName,components:[]}]}
'''
JSONString = ""
inCheckpoint = False;
inPage = False;
firstLine = False;
idNum = 0; #everything gets an ID, whether it wants one or not
pageNum = 0;
for line in f:

    #remove leading and trailing whitespace
    line = line.strip()
    
    #escape the backslashes and other special characters
    line = line.replace('\\','\\\\')
    line = line.replace('"','\\"') 
    line = line.replace('\'','&#39')
    line = line.replace(';','&#59')
    line = line.replace(']','&#93')
    line = line.replace('[','&#91')

    if line.startswith("!Book"):
        line = line.replace('!Book','').strip()
       
        JSONString += "{\"bookName\":\"" + line + "\",\"pages\":["
    elif line.startswith("!Page"):
        inPage = True;
        line = line.replace('!Page','').strip()
        pageNum = pageNum + 1;
        if(line == ""):
            line = "Page" + str(pageNum)
        JSONString+="{\"name\":\"" + line + "\",\"components\":["
        firstLine = True;
    elif line.startswith("!endPage"):
        inPage = False;
        #it just looks better to add an extra few blank lines at the bottom of the page
        JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\"\"},"
        JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\"\"},"
        #Now, we added an extra comma, so we need to remove it
        JSONString = JSONString[:-1]
        JSONString+= "]},"
    if inPage == True:
        if line.startswith("!checkpoint"):
            line = line.replace('!checkpoint','').strip()
            JSONString+="{\"type\":\"CHECKPOINT\",\"tag\":\"h2\",\"options\":{},\"content\":\""+"Checkpoint"+"\"},"
            inCheckpoint = True
        elif line.startswith("!endCheckpoint"):
            JSONString+="{\"type\":\"ENDCHECK\",\"tag\":\"hr\",\"options\":{},\"content\":\""+""+"\"},"
            inCheckpoint = False
        elif line.startswith("!ans"):
            line = line.replace("!ans",'').strip()
            lineAr = line.split()
            JSONString+="{\"type\":\"answerBox\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+lineAr[1]+"\"},"
        elif line.startswith("!video"):
            line = line.replace("!video","").strip()
            lineAr = line.split()
            JSONString += "{\"type\":\"video\",\"src\":\""+lineAr[0]+"\",\"width\":\""+lineAr[1]+"\",\"height\":\""+lineAr[2]+"\",\"id\":\"" + lineAr[3] + "\"},"
        elif line.startswith("!img"):
            line = line.replace("!img","").strip()
            lineAr = line.split()
            JSONString += "{\"type\":\"img\",\"src\":\""+lineAr[0]+"\",\"width\":\""+lineAr[1]+"\",\"height\":\""+lineAr[2]+"\",\"id\":\"" + lineAr[3] + "\"},"
        elif line.startswith("# "):
            line = line.replace("#","").strip()
            JSONString+="{\"type\":\"HTML\",\"tag\":\"h1\",\"options\":{},\"content\":\""+line+"\"},"
        elif line.startswith("## "):
            line = line.replace("##","").strip()
            JSONString+="{\"type\":\"HTML\",\"tag\":\"h2\",\"options\":{},\"content\":\""+line+"\"},"
        elif line.startswith("### "):
            line = line.replace("###","").strip()
            JSONString+="{\"type\":\"HTML\",\"tag\":\"h3\",\"options\":{},\"content\":\""+line+"\"},"
        elif line.startswith("!brk"):
            JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\" \"},"
        elif line.startswith("!item"):
            line = line.replace("!item","").strip()
            JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"
        elif line.startswith("!code"):
            line=line.replace("!code","").strip();
            JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\",\"class\":\"code\"},\"content\":\""+line+"\"},"
            idNum = idNum+1
        else:
            #only way for this is to be raw text.  Note: we still need to parse MathJax syntax!
            if firstLine == False:
                #if the line, after stripping, is empty, add a break
                if(line.strip() == ""):
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\" \"},"
                    
                else:
                    JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\"},"
                    idNum = idNum+1
            else:
                firstLine = False;

#Now, we added an extra comma at the end of the page, so we need to remove it
JSONString = JSONString[:-1]
JSONString+= "]}"

endTime = time.time();
print('Parsing done.  Wrote: ' + str(outFile.write(JSONString.strip())) + ' characters in ' + str(endTime-startTime) + ' seconds');