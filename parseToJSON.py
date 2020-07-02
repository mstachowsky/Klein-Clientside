#The parser that takes a md type file and turns it into something that Clein can handle.  note: the user should basically never look at this
#it's ugly and just produces a JSON string.
import os
import sys
import time

#time is just here because I'm curious how long this program takes to run
startTime = time.time();

#stack for closing tags 
myStack = []
#list based stack, to push use append(x), to pop use pop(), to peek, use myStack[-1]
openingTags = ['!Page',   '!checkpoint',   '!oList',  '!list']
closingTags = ['!endPage','!endCheckpoint','!endList','!endList',]


#Here is where we parse the file.  This script assumes that the md file is in a folder named FILE_NAME and the script is called FILE_NAME.md.  This can be made MUCH more generic
#fName = os.getcwd()+sys.argv[1]
#f = open(fName+'.md','r')
#outFile = open(fName+'.bk','w')

#path = 'C:\\Users\\Space Invader\\Desktop\\Klein-Clientside\\BOOKS\\Lab_2_ArduinoPower' #for laptop
path = 'C:\\Users\\Kevin Zhang\\Downloads\\Lab_2_ArduinoPower' #for desktop
#path = 'BOOKS\\Lab_2_ArduinoPower'
f = open(path +'.md', 'r')
outFile = open(path +'.bk','w')






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
JSONString = "{"

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

'''
    This function replaces inline links with HTML links.  I can't think of an easier way to do this.
    
    Basically, this function has to be called after special characters are replaced.
    
    Links in the markdown are enclosed by three square brackets [[[like this]]].  After special character replacement, these become &#91 and &#93.  So we extract the link text from between those two substrings, create an HTML link, and replace the whole thing with that HTML.  Then we continue doing that until there are no more inline links on this line.
'''    
def inlineLink(line):
    startString = "&#91&#91&#91"
    endString = "&#93&#93&#93"
    while(line.find(startString) != -1):
        #get the start location
        indxOfLink = line.find(startString);
        #get the ending bracket
        indxOfEnd = line.find(endString);
        #extract the link text: address:::text
        linkText = line[indxOfLink+len(startString):indxOfEnd];
        linkAr = linkText.split(":::");
        linkAddr = linkAr[0];
        linkContent = linkAr[1];
        link = '<a href = \\"' + linkAddr + '\\", target=\\"_blank\\", class=\\"inlineLink\\">'+linkContent+'<\\/a>'
        line = line.replace(startString+linkText+endString,link)
    return line


#recursive function for backslash esacpe characters 
def backslashEsc(line, index):
    location = line.find('\\', index) #if this trys to find from an index outside of the string returns -1
    index = location 
    if location != -1:
        #the last character of the string seems to get cut off 
        line = line + ' '
        if line[location:location+2] == '\*':
            line = line[0:location] + '&#42' + line[location+2:-1]
        elif line[location:location+1] == '\\':
            line = line[0:location] + '\\\\' + line[location+1:-1]
        return backslashEsc(line,index+3) 
    elif location == -1:
        return line

def tagMatching(line, myStack, openingTags, closingTags):
    tag = line.split(' ', 1)[0]
    
    if openingTags.count(tag):
        myStack.append(tag)
    elif closingTags.count(tag):
        peek = myStack[-1]
        index = closingTags.index(tag,0,-1)
        if peek == openingTags[index] or peek ==openingTags[index+1]:
            myStack.pop()
    return

idNum = 0; #everything gets an ID, whether it wants one or not.  If it doesn't have an ID, we assign it a serial number ID
pageNum = 0; #every page gets a name, whether it wants one or not.  They are assigned serially

def parse(f, JSONString, idNum, pageNum):
    
        
    #There are several environments that are nested.  Pages, checkpoints etc.  We need to keep track
    #of whether we are inside or outside of one.
    
    
    #The checkpoint environment is easy - everything inside gets a special style applied
    inCheckpoint = False;
    
    #The Page environment is trickier.  We need to ensure that we don't write any components
    #outside of a page (it can't be parsed, where would it display?) HOWEVER, we also need to make sure
    #that we don't write the name of the page out once we start it, hence why there are two flags.
    inPage = False;
    firstLine = False;
    
        

    pageFile = ''
     
    for line in f:
        #remove leading and trailing whitespace
        line = line.strip()
      
        tagMatching(line, myStack, openingTags, closingTags)
        
        if line.startswith("!addPage"):
            line = line + ' '
            pageDir = line[9:-1] #takes what ever is after the command 
            if line.find('.pg') != -1: #.pg will be file extention for pages 
                pageFile = open(pageDir, 'r')
            else:
                pageFile = open(pageDir + '.pg', 'r')
                
            JSONString = parse(pageFile, JSONString, idNum, pageNum)
         
        
        
        
        #escape the backslashes and other special characters
        line = backslashEsc(line,0)
    #    line = line.replace('\*','&#42') #asterisks in math
    #    line = line.replace('\\','\\\\')
        
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
        #now inline links
        line = inlineLink(line);
        
      #  if "eqn:(" in line:
          #   line = line.replace('&#42', '*')
        
        if line.startswith("!randVar"):
            JSONString += "\"randomVariable\": ["
            #JSONString += "{\"type\":\"randomVariable\",\"variable\":\""+lineAr[0] +"\",\"variableValMin\":\""+lineAr[1]+"\",\"variableValMax\":\""+lineAr[2] +"\"},"
        
        elif line.startswith("!var"):
            line = line.replace('!var','').strip()
            lineAr = line.split(":")
            # by array location: 0 - variable identifier, 1 - min value, 2 - max value 
            if lineAr[3]:
                JSONString += "{\"variable\":\""+lineAr[0] +"\",\"variableValMin\":\""+lineAr[1]+"\",\"variableValMax\":\""+lineAr[2] +"\",\"decimals\":\""+lineAr[3] +"\"},"
        
        elif line.startswith("!endRandVar"):
            JSONString = JSONString[0:-1]
            JSONString += "],"
            
        elif line.startswith("!Book"):
            line = line.replace('!Book','').strip()
            JSONString += "\"bookName\":\"" + line + "\",\"pages\":["
            
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
                line = line.replace(lineAr[-1], '')
                line = line.replace('&#42', '*')
                JSONString+="{\"type\":\"answerBox\",\"dataString\":\""+line+"\",\"id\":\""+lineAr[-1]+"\",\"pageNum\":\""+str(pageNum)+"\"},"
                
            elif line.startswith("!multipleChoice"):
                radioId = 0
                line = line.replace("!multipleChoice", '')
                numOption = 0
                lineAr = line.split()
                radioId = lineAr[1] #name of radio button set lineAr[0] is the answer key
                JSONString += "{\"type\":\"multipleChoice\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+radioId+"\",\"pageNum\":\""+str(pageNum)+"\"},"
                line = line.replace(radioId, '')
                line = line.replace(lineAr[0], '')
                line = line.strip()
                if line.startswith(":"):
                    line = line.replace(":", '')
                    JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\"},"
                
            elif line.startswith("!option"):
                line = line.replace("!option", '')
                numOption +=1 
                JSONString +="{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\""+str(numOption)+str(radioId)+"\",\"class\":\"span\",\"type\":\"radio\", \"name\":\""+radioId+"\", \"value\":\""+str(idNum)+"\"},\"content\":\""+line+"\"},"              
                
                
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
                
            elif line.startswith("!link"):
                line = line.replace("!link","").strip();
                lineAr = line.split()
                linkText = ""
                for ln in lineAr[1:len(lineAr)-1]:
                    linkText = linkText+" "+ln
                JSONString += "{\"type\":\"LINK\",\"addr\":\""+lineAr[0]+"\",\"text\":\""+linkText+"\",\"id\":\""+lineAr[len(lineAr)-1] + "\"},"
                
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
    return JSONString


JSONString = parse(f, JSONString, idNum, pageNum)

#Now, we added an extra comma at the end of the page, so we need to remove it
JSONString = JSONString[:-1]
JSONString+= "]}"

endTime = time.time();
if myStack:
    print('Error: Tag mismatch --' + str(myStack))

print('Parsing done.  Wrote: ' + str(outFile.write(JSONString.strip())) + ' characters in ' + str(endTime-startTime) + ' seconds');