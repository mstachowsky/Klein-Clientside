#The parser that takes a md type file and turns it into something that Clein can handle.  note: the user should basically never look at this
#it's ugly and just produces a JSON string.
import os
import sys
import time

#time is just here because I'm curious
startTime = time.time();
#Here is where we parse the file.  This script assumes that the md file is in a folder named FILE_NAME and the script is called FILE_NAME.md.  This can be made MUCH more generic
fName = os.getcwd()+sys.argv[1]
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

#There are several environments that are nested.  Pages, checkpoints etc.  We need to keep track
#of whether we are inside or outside of one.
#The checkpoint environment is easy - everything inside gets a special style applied
inCheckpoint = False;

#The Page environment is trickier.  We need to ensure that we don't write any components
#outside of a page (it can't be parsed, where would it display?) HOWEVER, we also need to make sure
#that we don't write the name of the page out once we start it, hence why there are two flags.
inPage = False;
firstLine = False;

idNum = 0; #everything gets an ID, whether it wants one or not.  If it doesn't have an ID, we assign it a serial number ID
pageNum = 0; #every page gets a name, whether it wants one or not.  They are assigned serially

'''
    This function replaces enclosing delimiters with HTML.  Like **bold** (two asterisks) replace with <b>bold</b>
'''
def replaceEnclosing(line,delims,beginTag,endTag):
    lineAr = line.split(delims);
    if(len(lineAr) > 1): #if there is nothing to split, lineAr contains just one thing
        ind = line.find(delims) #if this is zero, then we need to adjust
        bldNum = 0
        if(ind != 0):
            bldNum = 1;
        line = ""
        for strng in lineAr:
            if(strng != ''):
                if(bldNum % 2 == 0):
                    line = line + beginTag + strng + endTag
                else:
                    line = line + strng
                bldNum = bldNum+1
    else:
        if(line.find(delims) != -1): #handle the case where the entire line is bolded
            line = beginTag + line + endTag
    return line

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
    
    #handle inline tags
    #Bolding first
    line = replaceEnclosing(line,"**","<b>","</b>")
    #now italics
    line = replaceEnclosing(line,"*","<i>","</i>")
    #now code, using Discord-like syntax
    line = replaceEnclosing(line,"```",'<span class=\\"inlineCode\\">',"</span>")
    
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
        elif line.startswith("!list"):
            line = line.replace("!list","").strip()
            JSONString+="{\"type\":\"UL\"},"
        elif line.startswith("!oList"): #ordered list
            line = line.replace("!oList","").strip()
            JSONString+="{\"type\":\"OL\"},"
        elif line.startswith("!endList"):
            line = line.replace("!endList","").strip()
            JSONString+="{\"type\":\"ENDLIST\"},"
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