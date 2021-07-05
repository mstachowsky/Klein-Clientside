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
openingTags = ['!Page',   '!checkpoint',    '!multipleChoice',   '!oList',  '!list']
closingTags = ['!endPage','!endCheckpoint', '!endMultipleChoice','!endList','!endList']


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
JSONString = "{"

'''
    This function replaces enclosing delimiters with HTML.  Like **bold** (two asterisks) replace with <b>bold</b>
'''
def replaceEnclosing(line,delims,beginTag,endTag):
    lineAdd = ""
    if delims == "*" and line.startswith("* "):
        lineAr = line.replace("* ", "", 1).split(delims);
        line = line.replace("* ", "", 1)
        lineAdd = "* "
    elif delims == "*" and line.startswith("..* "):
        lineAr = line.replace("..* ", "", 1).split(delims);
        line = line.replace("..* ", "", 1)
        lineAdd = "..* "
    else:
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
    return lineAdd + line

'''
    This function replaces inline links with HTML links.  I can't think of an easier way to do this.
    
    Basically, this function has to be called after special characters are replaced.
    
    Links in the markdown are enclosed by three square brackets [[[like this]]].  After special character replacement, these become &#91 and &#93.  So we extract the link text from between those two substrings, create an HTML link, and replace the whole thing with that HTML.  Then we continue doing that until there are no more inline links on this line.
'''    
def inlineLink(line):
    startString = "&#91&#91&#91"
    endString = "&#93&#93&#93"
    middleString = ":::"
    while(line.find(startString) != -1 and line.find(endString) != -1 and line.find(middleString) != -1):
        #get the start location
        indxOfLink = line.find(startString);
        #get the ending bracket
        indxOfEnd = line.find(endString);
        #extract the link text: address:::text
        linkText = line[indxOfLink+len(startString):indxOfEnd];
        linkAr = linkText.split(middleString);
        linkAddr = linkAr[0];
        linkContent = linkAr[1];
        link = '<a href = \\"' + linkAddr + '\\", target=\\"_blank\\", class=\\"inlineLink\\">'+linkContent+'<\\/a>'
        line = line.replace(startString+linkText+endString,link)
    return line

# gets the index of a given closed square bracket index
def closeSquareBracketCheck(line, index):
    closeIndex = -1
    for count in range(index -1, 2, -1):
        if(line[count-3] + line[count-2] + line[count-1] + line[count] == "&#93"):
            closeIndex -= 1
        elif(line[count-3] + line[count-2] + line[count-1] + line[count] == "&#91"):
            closeIndex += 1

        if(closeIndex == 0):
            return count-3
    return -1

# gets the index of a given open square bracket index
def openSquareBracketCheck(line, index):
    openIndex = 1
    for count in range(index + 4, len(line), 1):
        if(line[count] + line[count+1] + line[count+2] + line[count+3] == "&#93"):
            openIndex -= 1
        elif(line[count] + line[count+1] + line[count+2] + line[count+3] == "&#91"):
            openIndex += 1

        if(openIndex == 0):
            return count
    return -1

# gets the index of a given open bracket index
def openBracketCheck(line, index):
    openIndex = 1
    for count in range(index + 5, len(line), 1):
        if(line[count] == ")"):
            openIndex -= 1
        elif(line[count] == "("):
            openIndex += 1

        if(openIndex == 0):
            return count
    return -1

# Markdown in line link text
def inlineLinkMd(line):
    startString = "&#91"
    middleString = "&#93("
    endString = ")"
    while(line.find(startString) != -1 and line.find(middleString) != -1 and line.find(endString) != -1):
        #get the middle location
        indxOfMiddle = line.find(middleString);
        #get the start location
        indxOfText = closeSquareBracketCheck(line, indxOfMiddle);
        #get the ending bracket
        indxOfEnd = openBracketCheck(line, indxOfMiddle);
        linkText = line[indxOfText+len(startString):indxOfEnd];
        linkAr = linkText.split(middleString);
        linkAddr = linkAr[1];
        linkContent = linkAr[0];
        link = '<a href = \\"' + linkAddr + '\\", target=\\"_blank\\", class=\\"inlineLink\\">'+linkContent+'<\\/a>'
        line = line.replace(startString+linkText+endString,link)
    return line

# Markdown in line image text
def inlineImageMd(line):
    startString = "!&#91"
    middleString = "&#93("
    endString = ")"
    while(line.find(startString) != -1 and line.find(middleString) != -1 and line.find(endString) != -1):
        indxOfMiddle = line.find(middleString);
        #get the start location
        indxOfText = closeSquareBracketCheck(line, indxOfMiddle) -1;
        #get the ending bracket
        indxOfEnd = openBracketCheck(line, indxOfMiddle);
        #extract the link text: address:::text
        imageText = line[indxOfText+len(startString):indxOfEnd];
        imageAr = imageText.split(middleString);
        image = '<img src= \\"' + imageAr[1] + '\\" alt=\\"' + imageAr[0] + '\\">'
        line = line.replace(startString+imageText+endString,image)
    return line


def inlineVideoeMd(line):
    startString = "&#91!&#91"
    firstMiddleString = "&#93("
    secMiddleString = ")&#93("
    endString = ")"
    while(line.find(startString) != -1 and line.find(firstMiddleString)  and line.find(secMiddleString) != -1 and line.find(endString) != -1):
        indxOfFirstMiddle = line.find(firstMiddleString);
        indxOfSecondMiddle = line.find(secMiddleString);
        #get the start location
        indxOfText = line.find(startString);
        #get the ending bracket
        indxOfEnd = openBracketCheck(line, openSquareBracketCheck(line, indxOfText) + 4);
        vidText = line[indxOfText:indxOfEnd + 1]
        video = '<video width=\\"width\\" id=\\"' + line[indxOfText + 9:indxOfFirstMiddle] + '\\" controls=\\"controls\\" poster=\\"' + line[indxOfFirstMiddle + 5:indxOfSecondMiddle] + '\\" src=\\"' + line[indxOfSecondMiddle+6:indxOfEnd] + '\\"></video>'
        line = line.replace(vidText, video, 1)
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
            return backslashEsc(line,index+4) 
        elif line[location:location+2] == '\$':
            line = line[0:location] + '\\\\&#36' + line[location+2:-1]
            return backslashEsc(line,index+6)
        elif line[location:location+1] == '\\':
            line = line[0:location] + '\\\\' + line[location+1:-1]
            return backslashEsc(line,index+2) 
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
    inCode = False;
    oList = False;
    countList = 0;
    uList = False;
    uListSyntax = True;
    oSub = False;
    subList = False;
    countSubList = 0;
    subListSyntax = True;
    oSubList = False;
    maxTableRow = 0;
    qGroup = False;

    
    #The Page environment is trickier.  We need to ensure that we don't write any components
    #outside of a page (it can't be parsed, where would it display?) HOWEVER, we also need to make sure
    #that we don't write the name of the page out once we start it, hence why there are two flags.
    inPage = False;
    firstLine = False;
    
        

    pageFile = ''

    content = f.read()
    content = content.splitlines()
    countLine = 0

    while countLine < len(content):
        line = content[countLine]

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
        
        if line.startswith("!addQuestion"):
            line = line + ' '
            pageDir = line[13:-1] #takes what ever is after the command 
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
        if not (len(line) >= 3 and (("*" * len(line) == line) or ("_" * len(line) == line) or ("-" * len(line) == line))):
            line = replaceEnclosing(line,"**","<b>","</b>")
            line = replaceEnclosing(line,"__","<b>","</b>")
            #now italics
            line = replaceEnclosing(line,"*","<i>","</i>")
            line = replaceEnclosing(line,"~~","<del>","</del>")
        # Cant use this yet until block esc is implemented
        # line = replaceEnclosing(line,"_","<i>","</i>")
        # #now code, using Discord-like syntax
        if not ("```" in line):
            line = replaceEnclosing(line,"`",'<span class=\\"inlineCode\\">',"</span>")
        #now inline links
        line = inlineVideoeMd(line);
        line = inlineImageMd(line);
        line = inlineLink(line);
        line = inlineLinkMd(line);
        uListSyntax = True;
        subListSyntax = True;
        
        if "eqn:{" in line:
            line = line.replace('&#42', '*')
        
        if line.startswith("!bookVariables"):
            JSONString += "\"variable\": ["
            #JSONString += "{\"type\":\"randomVariable\",\"variable\":\""+lineAr[0] +"\",\"variableValMin\":\""+lineAr[1]+"\",\"variableValMax\":\""+lineAr[2] +"\"},"
        
        elif line.startswith("!assignmentVariables"):
            JSONString += "\"variable\": ["
            #JSONString += "{\"type\":\"randomVariable\",\"variable\":\""+lineAr[0] +"\",\"variableValMin\":\""+lineAr[1]+"\",\"variableValMax\":\""+lineAr[2] +"\"},"
        
        elif line.startswith("!var"):
            line = line.replace('!var','').strip()
            lineAr = line.split(":")
            # by array location: 0 - variable identifier, 1 - min value, 2 - max value 
            if len(lineAr) == 4:
                JSONString += "{\"name\":\""+lineAr[0] +"\",\"variableValMin\":\""+lineAr[1]+"\",\"variableValMax\":\""+lineAr[2] +"\",\"decimals\":\""+lineAr[3] +"\"},"
            else:
                JSONString += "{\"name\":\""+lineAr[0].strip() +"\", \"equation\":\""+lineAr[1]+"\"},"
        
        elif line.startswith("!endBookVariables"):
            JSONString = JSONString[0:-1]
            JSONString += "],"
        
        elif line.startswith("!endAssignmentVariables"):
            JSONString = JSONString[0:-1]
            JSONString += "],"
            
        elif line.startswith("!Book"):
            line = line.replace('!Book','').strip()
            JSONString += "\"bookName\":\"" + line + "\",\"pages\":["

        elif line.startswith("!Assignment"):
            line = line.replace('!Assignment','').strip()
            JSONString += "\"bookName\":\"" + line + "\",\"pages\":["
            
        elif line.startswith("!Page"):
            inPage = True;
            line = line.replace('!Page','').strip()
            pageNum = pageNum + 1;
            if(line == ""):
                line = "Page" + str(pageNum)
            JSONString+="{\"name\":\"" + line + "\",\"components\":["
            firstLine = True;
            
        elif line.startswith("!qGroup"):
            inPage = True;
            qGroup = True;
            line = line.replace('!qGroup','').strip()
            pageNum = pageNum + 1;
            if(line == ""):
                line = "Question" + str(pageNum)
            JSONString+="{\"name\":\"" + line + "\",\"type\":\"QUESTIONGROUP\",\"questions\":["
            firstLine = True;

        elif line.startswith("!Question"):
            inPage = True;
            line = line.replace('!Question','').strip()
            if not qGroup:
                pageNum = pageNum + 1;
            if(line == ""):
                line = "Question" + str(pageNum)
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
        
        elif line.startswith("!endQuestion"):
            inPage = False;
            #it just looks better to add an extra few blank lines at the bottom of the page
            JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\"\"},"
            JSONString+="{\"type\":\"HTML\",\"tag\":\"br\",\"options\":{},\"content\":\"\"},"
            #Now, we added an extra comma, so we need to remove it
            JSONString = JSONString[:-1]
            JSONString+= "]},"

        elif line.startswith("!endQGroup"):
            inPage = False;
            qGroup = False;
            JSONString = JSONString[:-1]
            JSONString+="]},"
     
    
        if inPage == True:
            if line.startswith("!checkpoint"):
                line = line.replace('!checkpoint','').strip()
                JSONString+="{\"type\":\"CHECKPOINT\",\"tag\":\"h2\",\"options\":{},\"content\":\""+"Checkpoint"+"\"},"
                inCheckpoint = True
                
            elif line.startswith("!endCheckpoint"):
                JSONString+="{\"type\":\"ENDCHECK\",\"tag\":\"hr\",\"options\":{},\"content\":\""+""+"\"},"
                inCheckpoint = False

            elif line.startswith("!qText"):
                JSONString+="{\"type\":\"QTEXT\"},"

            elif line.startswith("!endQText"):
                JSONString+="{\"type\":\"ENDQTEXT\"},"

            elif line.startswith("!qInput"):
                JSONString+="{\"type\":\"QINPUT\"},"

            elif line.startswith("!endQInput"):
                JSONString+="{\"type\":\"ENDQINPUT\"},"

            elif inCode == True or line.startswith("```"):
                if line.startswith("```"):
                    inCode = not inCode
                line=line.replace("```","").strip();
                JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\",\"class\":\"code\"},\"content\":\""+line+"\"},"
                idNum = idNum+1

            elif line.startswith("`") and line.endswith("`"):
                line=line.replace("`","").strip();
                JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\",\"class\":\"code\"},\"content\":\""+line+"\"},"
                idNum = idNum+1

            elif len(line) >= 3 and (("*" * len(line) == line) or ("_" * len(line) == line) or ("-" * len(line) == line)):
                line = ""
                JSONString += "{\"type\":\"HORIZLINE\",\"tag\":\"hr\",\"options\":{},\"content\":\"""\"},"

            elif line.startswith("!ans"):
                line = line.replace("!ans",'').strip()
                lineAr = line.split()
                line = line.replace(lineAr[-1], '')
                line = line.replace('&#42', '*')
                JSONString+="{\"type\":\"answerBox\",\"dataString\":\""+line+"\",\"id\":\""+lineAr[-1]+"\",\"pageNum\":\""+str(pageNum)+"\"},"
                
            elif line.startswith("!multipleChoice"):
                radioId = 0
                numOption = 0
                line = line.replace("!multipleChoice", '')
    
                lineAr = line.split()
                radioId = lineAr[1] #name of radio button set lineAr[0] is the answer key
                #JSONString += "{\"type\":\"multipleChoice\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+radioId+"\",\"pageNum\":\""+str(pageNum)+"\"},"
                JSONString += "{\"type\":\"multipleChoice\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+radioId+"\",\"pageNum\":\""+str(pageNum)+"\" "
                line = line.replace(radioId, '')
                line = line.replace(lineAr[0], '')
                line = line.strip()
                if line.startswith(":"):
                    line = line.replace(":", '')
                    #JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\"},"
                    JSONString += ",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\""
                JSONString +=  ",\"choices\": [   "
                idNum = idNum +1
                
            elif line.startswith("!option"):
                line = line.replace("!option", '')
                numOption +=1 
               # JSONString +="{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\""+str(numOption)+str(radioId)+"\",\"class\":\"span\",\"type\":\"radio\", \"name\":\""+radioId+"\", \"value\":\""+str(idNum)+"\"},\"content\":\""+line+"\"},"              
                JSONString +="{\"tag\":\"span\",\"options\":{\"id\":\""+str(numOption)+str(radioId)+"\",\"class\":\"span\",\"type\":\"radio\", \"name\":\""+radioId+"\", \"value\":\""+str(idNum)+"\"},\"content\":\""+line+"\"},"
                
            elif line.startswith("!endMultipleChoice"):
                JSONString = JSONString[:-1]
                JSONString += " ]},"
                
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

            elif oSubList or line.startswith(".." + str(countSubList + 1) + ". "):
                oSubList = True
                if countSubList == 0:
                    JSONString+="{\"type\":\"OL\"},"

                if not line.startswith(".." + str(countSubList + 1) + ". "):
                    oSubList = False
                    countSubList = 0
                    JSONString+="{\"type\":\"ENDLIST\"},"
                    countLine -= 1
                else:
                    countSubList += 1
                    line = line.replace(".." + str(countSubList) + ". ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((subList) or line.startswith("..* ")) and not line.startswith("..+ ") and not line.startswith("..- "):
                subListSyntax = False
                if subList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    subList = True
                
                if not line.startswith("..* "):
                    subList = False
                    JSONString+="{\"type\":\"ENDLIST\"},"
                    countLine -= 1
                else:
                    line = line.replace("..* ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((subList) or line.startswith("..+ ")) and subListSyntax and not line.startswith("..- "):
                subListSyntax = False
                if subList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    subList = True
                
                if not line.startswith("..+ "):
                    subList = False
                    JSONString+="{\"type\":\"ENDLIST\"},"
                    countLine -= 1
                else:
                    line = line.replace("..+ ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((subList) or line.startswith("..- ")) and subListSyntax:
                subListSyntax = False
                if subList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    subList = True
                
                if not line.startswith("..- "):
                    subList = False
                    JSONString+="{\"type\":\"ENDLIST\"},"
                    countLine -= 1
                else:
                    line = line.replace("..- ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((uList and not oList) or line.startswith("* ")  or oSub) and not line.startswith("+ ") and not line.startswith("- "):
                uListSyntax = False
                if uList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    uList = True
                
                if not line.startswith("* "):
                    if oList or line.startswith(str(countList + 1) + ". "):
                        oList = True
                        if countList == 0:
                            JSONString+="{\"type\":\"OL\"},"

                        if not line.startswith(str(countList + 1) + ". "):
                            oList = False
                            oSub = False
                            countList = 0
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            uList = False
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            countLine -= 1
                        else:
                            oSub = True
                            countList += 1
                            line = line.replace(str(countList) + ". ","",1).strip()
                            JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"
                    else:
                        uList = False
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        countLine -= 1
                else:
                    if oSub and oList:
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        oSub = False
                        oList = False
                    line = line.replace("* ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((uList and not oList) or line.startswith("+ ") or oSub) and uListSyntax and not line.startswith("- "):
                uListSyntax = False
                if uList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    uList = True
                
                if not line.startswith("+ "):
                    if oList or line.startswith(str(countList + 1) + ". "):
                        oList = True
                        if countList == 0:
                            JSONString+="{\"type\":\"OL\"},"

                        if not line.startswith(str(countList + 1) + ". "):
                            oSub = False
                            oList = False
                            countList = 0
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            uList = False
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            countLine -= 1
                        else:
                            oSub = True
                            countList += 1
                            line = line.replace(str(countList) + ". ","",1).strip()
                            JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"
                    else:
                        uList = False
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        countLine -= 1
                else:
                    if oSub and oList:
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        oSub = False
                        oList = False
                    line = line.replace("+ ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"

            elif ((uList and not oList) or line.startswith("- ") or oSub) and uListSyntax:
                if uList == False:
                    JSONString+="{\"type\":\"UL\"},"
                    uList = True
                
                if not line.startswith("- "):
                    if oList or line.startswith(str(countList + 1) + ". "):
                        oList = True
                        if countList == 0:
                            JSONString+="{\"type\":\"OL\"},"

                        if not line.startswith(str(countList + 1) + ". "):
                            oList = False
                            oSub = False
                            countList = 0
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            uList = False
                            JSONString+="{\"type\":\"ENDLIST\"},"
                            countLine -= 1
                        else:
                            oSub = True
                            countList += 1
                            line = line.replace(str(countList) + ". ","",1).strip()
                            JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"
                    else:
                        uList = False
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        countLine -= 1
                else:
                    if oSub and oList:
                        JSONString+="{\"type\":\"ENDLIST\"},"
                        oSub = False
                        oList = False
                    line = line.replace("- ","",1).strip()
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

            elif oList or line.startswith(str(countList + 1) + ". "):
                oList = True
                if countList == 0:
                    JSONString+="{\"type\":\"OL\"},"

                if uList:
                    uList = False
                    JSONString+="{\"type\":\"ENDLIST\"},"

                if not line.startswith(str(countList + 1) + ". "):
                    oList = False
                    countList = 0
                    JSONString+="{\"type\":\"ENDLIST\"},"
                    countLine -= 1
                else:
                    countList += 1
                    line = line.replace(str(countList) + ". ","",1).strip()
                    JSONString+="{\"type\":\"HTML\",\"tag\":\"li\",\"options\":{},\"content\":\""+line+"\"},"
                
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
                
            elif content[countLine+1].replace(" ","").replace(":","").replace("|","").replace("-","") == "" and ("|-" in content[countLine+1].replace(" ", "") or "|:-" in content[countLine+1].replace(" ", "")):
                JSONString += "{\"type\":\"TABLE\",\"tag\":\"table\",\"options\":{\"id\":\"ID" + str(idNum) + "\"},\"tableContent\":{\"header\":["
                line = line.strip()
                if line.startswith("|"):
                    line = line[1:len(line)]

                if line.endswith("|"):
                    line = line[0:len(line) -1]
                
                lineAr = line.split("|")

                lineClassCheck = content[countLine+1].replace(" ", "")

                if lineClassCheck.startswith("|"):
                    lineClassCheck = lineClassCheck[1:len(lineClassCheck)]

                if lineClassCheck.endswith("|"):
                    lineClassCheck = lineClassCheck[0:len(lineClassCheck) -1]

                lineClassCheckAr = lineClassCheck.split("|")

                lineClassAr = [""] * len(lineAr)

                for check in lineClassCheckAr:
                    if ":-" in check and "-:" in check:
                        lineClassAr[lineClassCheckAr.index(check)] = "centerCell"
                    elif ":-" in check:
                        lineClassAr[lineClassCheckAr.index(check)] = "leftCell"
                    elif "-:" in check:
                        lineClassAr[lineClassCheckAr.index(check)] = "rightCell"
                    else:
                        lineClassAr[lineClassCheckAr.index(check)] = "normalCell"

                maxTableRow = len(lineAr)

                for header in lineAr:
                    JSONString += "{\"headerContent\":["
                    JSONString = parseTable(header, JSONString, idNum, pageNum, True)
                    if JSONString.endswith(","):
                        JSONString = JSONString[0: len(JSONString) -1]
                    JSONString += "],\"class\":\"" + lineClassAr[lineAr.index(header)] + "\"},"
                
                JSONString = JSONString[0:len(JSONString)-1] + "],\"content\":["

                countTraceBack = countLine
                countLine += 2
                countMax = 0
                line = content[countLine]
                for arrInd in range(0, maxTableRow):
                    countLine = countTraceBack + 2
                    line = content[countLine]
                    JSONString += "{\"column\":["
                    while "|" in line:
                        line = line.strip()
                        if line.startswith("|"):
                            line = line[1:len(line)]

                        if line.endswith("|"):
                            line = line[0:len(line) -1]
                        rowArr = line.split("|")
                        JSONString += "["
                        if arrInd <= len(rowArr) - 1:
                            JSONString = parseTable(rowArr[arrInd], JSONString, idNum, pageNum, False)
                        else:
                            JSONString = parseTable("", JSONString, idNum, pageNum, False)
                        if JSONString.endswith(","):
                            JSONString = JSONString[0: len(JSONString) -1]
                        JSONString += "],"
                        countLine += 1
                        line = content[countLine]
                    if countLine >= countMax:
                        countMax = countLine
                    if JSONString.endswith(","):
                        JSONString = JSONString[0: len(JSONString) -1]
                    JSONString += "], \"class\":\"" + lineClassAr[arrInd] + "\"},"
                
                if JSONString.endswith(","):
                    JSONString = JSONString[0: len(JSONString) -1]
                
                countLine = countMax - 1
                JSONString += "]}},{\"type\":\"ENDTABLE\",\"tag\":\"table\",\"options\":{},\"tableContent\":\"\"},"

            elif "$$" in line:
                mathCount = countLine
                if line.find("$$", line.index("$$") + 1) == -1:
                    fullLine = line.replace("\\\\","\\")
                    mathCount += 1
                    lineMath = content[mathCount]
                    fullLine = fullLine + lineMath
                    while not "$$" in lineMath:
                        mathCount += 1
                        lineMath = content[mathCount]
                        fullLine = fullLine + lineMath
                    fullLine = fullLine.replace("$$", "&#36&#36")
                    content[mathCount] = fullLine
                    JSONString = parseTable(content[mathCount], JSONString, idNum, pageNum, False)
                    countLine = mathCount
                else:
                    content[countLine] = line.replace("$$", "&#36&#36", 2)
                    line = content[countLine]
                    JSONString = parseTable(line, JSONString, idNum, pageNum, True)
            
            # Dont need to add this condition in parseTable because tables can only take single line text in each cell
            elif "$" in line:
                mathCount = countLine
                if line.find("$", line.index("$") + 1) == -1:
                    fullLine = line.replace("\\\\","\\")
                    mathCount += 1
                    lineMath = content[mathCount]
                    fullLine = fullLine + lineMath
                    while not "$" in lineMath:
                        mathCount += 1
                        lineMath = content[mathCount]
                        fullLine = fullLine + lineMath
                    fullLine = fullLine.replace("$", "&#36")
                    content[mathCount] = fullLine
                    JSONString = parseTable(content[mathCount], JSONString, idNum, pageNum, False)
                    countLine = mathCount
                else:
                    content[countLine] = line.replace("$", "&#36", 2)
                    line = content[countLine]
                    JSONString = parseTable(line, JSONString, idNum, pageNum, True)
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
        countLine += 1
    return JSONString

# Function for tables
def parseTable(line, JSONString, idNum, pageNum, header):
    if not header:
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
        if not (len(line) >= 3 and (("*" * len(line) == line) or ("_" * len(line) == line) or ("-" * len(line) == line))):
            line = replaceEnclosing(line,"**","<b>","</b>")
            line = replaceEnclosing(line,"__","<b>","</b>")
            #now italics
            line = replaceEnclosing(line,"*","<i>","</i>")
            line = replaceEnclosing(line,"~~","<del>","</del>")
        # Cant use this yet until block esc is implemented
        # line = replaceEnclosing(line,"_","<i>","</i>")
        # #now code, using Discord-like syntax
        if not ("```" in line):
            line = replaceEnclosing(line,"`",'<span class=\\"inlineCode\\">',"</span>")
        #now inline links
        line = inlineVideoeMd(line);
        line = inlineImageMd(line);
        line = inlineLink(line);
        line = inlineLinkMd(line);
        # uListSyntax = True;
        # subListSyntax = True;

    #There are several environments that are nested.  Pages, checkpoints etc.  We need to keep track
    #of whether we are inside or outside of one.
    
    
    #The checkpoint environment is easy - everything inside gets a special style applied
    inCheckpoint = False;
    inCode = False;
    oList = False;
    countList = 0;
    uList = False;
    uListSyntax = True;
    oSub = False;
    subList = False;
    countSubList = 0;
    subListSyntax = True;
    oSubList = False;

    
    #The Page environment is trickier.  We need to ensure that we don't write any components
    #outside of a page (it can't be parsed, where would it display?) HOWEVER, we also need to make sure
    #that we don't write the name of the page out once we start it, hence why there are two flags.
    inPage = False;
    firstLine = False;
    
        

    pageFile = ''
        
    if inCode == True or line.startswith("```"):
        if line.startswith("```"):
            inCode = not inCode
        line=line.replace("```","").strip();
        JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\",\"class\":\"code\"},\"content\":\""+line+"\"},"
        idNum = idNum+1

    elif line.startswith("`") and line.endswith("`"):
        line=line.replace("`","").strip();
        JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\",\"class\":\"code\"},\"content\":\""+line+"\"},"
        idNum = idNum+1

    elif line.startswith("!ans"):
        line = line.replace("!ans",'').strip()
        lineAr = line.split()
        line = line.replace(lineAr[-1], '')
        line = line.replace('&#42', '*')
        JSONString+="{\"type\":\"answerBox\",\"dataString\":\""+line+"\",\"id\":\""+lineAr[-1]+"\",\"pageNum\":\""+str(pageNum)+"\"},"
        
    elif line.startswith("!multipleChoice"):
        radioId = 0
        numOption = 0
        line = line.replace("!multipleChoice", '')

        lineAr = line.split()
        radioId = lineAr[1] #name of radio button set lineAr[0] is the answer key
        #JSONString += "{\"type\":\"multipleChoice\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+radioId+"\",\"pageNum\":\""+str(pageNum)+"\"},"
        JSONString += "{\"type\":\"multipleChoice\",\"dataString\":\""+lineAr[0]+"\",\"id\":\""+radioId+"\",\"pageNum\":\""+str(pageNum)+"\" "
        line = line.replace(radioId, '')
        line = line.replace(lineAr[0], '')
        line = line.strip()
        if line.startswith(":"):
            line = line.replace(":", '')
            #JSONString += "{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\"},"
            JSONString += ",\"tag\":\"span\",\"options\":{\"id\":\"ID"+str(idNum)+"\"},\"content\":\""+line+"\""
        JSONString +=  ",\"choices\": [   "
        idNum = idNum +1
        
    elif line.startswith("!option"):
        line = line.replace("!option", '')
        numOption +=1 
        # JSONString +="{\"type\":\"HTML\",\"tag\":\"span\",\"options\":{\"id\":\""+str(numOption)+str(radioId)+"\",\"class\":\"span\",\"type\":\"radio\", \"name\":\""+radioId+"\", \"value\":\""+str(idNum)+"\"},\"content\":\""+line+"\"},"              
        JSONString +="{\"tag\":\"span\",\"options\":{\"id\":\""+str(numOption)+str(radioId)+"\",\"class\":\"span\",\"type\":\"radio\", \"name\":\""+radioId+"\", \"value\":\""+str(idNum)+"\"},\"content\":\""+line+"\"},"              

        
    elif line.startswith("!endMultipleChoice"):
        JSONString = JSONString[:-1]
        JSONString += " ]},"
        
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