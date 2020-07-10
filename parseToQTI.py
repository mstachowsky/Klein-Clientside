# -*- coding: utf-8 -*-
"""
Created on Fri Jul 10 13:25:00 2020

@author: xd memes
"""

import os
import sys
import time

startTime = time.time();



#Here is where we parse the file.  This script assumes that the md file is in a folder named FILE_NAME and the script is called FILE_NAME.md.  This can be made MUCH more generic
#fName = os.getcwd()+sys.argv[1]
#f = open(fName+'.md','r')
#outFile = open(fName+'.bk','w')

#path = 'C:\\Users\\Space Invader\\Desktop\\Klein-Clientside\\BOOKS\\Lab_2_ArduinoPower' #for laptop
path = 'C:\\Users\\Kevin Zhang\\Downloads\\Lab_2_ArduinoPower' #for desktop
#path = 'BOOKS\\Lab_2_ArduinoPower'

f = open(path +'.md', 'r')
outFile = open(path +'.xml','w')

QTIString = ''
for line in f:
    if line.startswith('!multipleChoice'):
        numOptions = 0 
        line = line.replace("!multipleChoice", '')

        lineAr = line.split()
        radioId = lineAr[1] #name of radio button set lineAr[0] is the answer key
        ans = lineAr[0]
        line = line.replace(radioId, '')
        line = line.replace(lineAr[0], '')
        
        QTIString += '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2p2.xsd" identifier="choice" title="" adaptive="false" timeDependent="false">'
        QTIString += '<responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier"><correctResponse>'
        QTIString += '<value>' +ans + radioId+'</value>'
        QTIString += '</correctResponse></responseDeclaration><outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float"><defaultValue><value>0</value></defaultValue></outcomeDeclaration><itemBody>'
        if line.startswith(":"):
            line = line.replace(":", '')
        #QTIString += '<p>'+line+'</p>'
        QTIString += '<choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1"><prompt>'+line+'</prompt>'
        
    elif line.startswith('!option'):
        line = line.replace('!option', '')
        numOptions += 1
        QTIString += '<simpleChoice identifier="'+numOptions+radioId+'">'+line+'</simpleChoice>'
        
    elif line.startswith('!endMultipleChoice'):
        QTIString += '</choiceInteraction></itemBody><responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/></assessmentItem>'

endTime = time.time();

print('Parsing done.  Wrote: ' + str(outFile.write(QTIString.strip())) + ' characters in ' + str(endTime-startTime) + ' seconds');