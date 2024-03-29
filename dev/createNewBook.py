import os
import sys
import configparser
import platform
import re

#  Reading Config File
config = configparser.ConfigParser()
try:
	config.read('/home/mike/klein/dev/config.ini')
	bookRoot = config['Paths']['bookRoot']
	htmlRoot = config['Paths']['htmlPath']
except:
	sys.exit('Misconfigured config.ini file.')

#  Setting Initial variables
bookName = sys.argv[1]
scriptPath = os.path.split(sys.argv[0])[0]

#  Creating root directories if they do not already exist
if not os.path.isdir(bookRoot):
	print('making bookroot = ', bookRoot)
	os.makedirs(bookRoot)
	
bookDir = os.path.join(bookRoot, f'{bookName}_dev')
try:
	resDir = os.path.join(bookDir, 'res')
	os.makedirs(resDir)
except:
	sys.exit(f"{bookDir} already exists.")

# Changes around the names to make allow the html file to be made properly
if "/" in bookName:
	htmlBookNameArr = bookName.split("/")
	htmlBookName = htmlBookNameArr[len(htmlBookNameArr)-1]
else:
	htmlBookName = bookName

with open(os.path.join(bookDir, f'{htmlBookName}.html'), 'w') as newHTMLfile:
	with open(os.path.join(scriptPath, 'TemplateHTML.html'), 'r') as oldHTMLfile:
		lines = oldHTMLfile.readlines()

		# Taking numFileUpReplace to determine how many files up the CSS and Scripts are
		htmlNumFileUpReplace = "../../"

		numFileUp = 0
		for numReplaces in range(numFileUp):
			htmlNumFileUpReplace = htmlNumFileUpReplace +  "../"

		# Removes the old url for the new one and configures the file dir for the CSS and Scripts
		count = 0
		for item in lines:
			if ("kleinStyle.css" in item or "answerableComponent.js" in item or "kleinCore.js" in item or "math.js" in item):
				lines[count] = lines[count].replace("../../", htmlNumFileUpReplace)

			# print(count)
			if "let url" in item:
				lineNumToReplace = count
			count += 1

		lines[lineNumToReplace] = f"        let url = '{os.path.join(htmlRoot, f'{htmlBookName}.bk')}';\n"
		newHTMLfile.writelines(lines)


# @license

# Licensed under the GNU GPLv3 License (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy
# of the License at

# https://www.gnu.org/licenses/gpl-3.0.en.html

# Any libraries written by third parties are provided under a license that is identical to or compatible with the License on this project.

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.
