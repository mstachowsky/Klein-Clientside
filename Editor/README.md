# WYSIWYG Editor To Markdown
## Summary
It's a simple html webpage and almost all vanilla JS (relies on downloaded JQuery folder and 'stylemytooltips' folder), but all non-vanilla JS scripts are downloaded and in a folder called 'addedJS'. It is a '**w**hat **y**ou **s**ee **i**s **w**hat **y**ou **g**et' (WYSIWYG) editor, where you can type into contenteditable boxes and either use ctrl-B/ctrl-I and other keyboard shortcuts to customize text, or use a button ribbon at the top of the page to style font, headings and lists (unordered and ordered). The output is also content editable, so its easy to copy and paste into another file.

## File structure.
I have this in my own branch, and so for whichever co-op student comes after me there is all my archived file/iterations. This is just to see how it looked earlier in case anything is helpful. For the web editor, previous iterations are basically useless, but for my shell script the previous version might be more useful... I had about a million div classes and IDs floating around until I used css grid functions and then it made the UI of this a lot prettier/simpler and more flexible.
## Things to be completed, corrected/fixed.
### To be completed
There are a few things which are incomplete:
- Currently adding and removing book variables you must type in in the correct format. So a possibility to rectify this is to simply add a button for 'standard variable form' which has fields for name, min, max, precision, and then a button for 'arithmetic' or 'dependent' variable which takes a name and equation related from other variables. When doing this make a function which checks that dependent variables do in fact rely on existing variables.
- Ordering/selective removal. I only have add and remove 'last' for both variables and pages. So if you want to delete something you can only delete the last page or the last variable. This isn't the end of the world because if something is left blank it will not output. But it could be helpful/useful to have a mechanism of choosing which page and deleting that one. The way these are handled is by class and so JS makes an array of all instances of that class so it won't be too difficult.
- Limited functionality: no 'code' button to give the back apostrophe which makes `this` in Markdown, there is also **no functionality for checkpoint / endcheckpoint, !img or !video directives**. This is a must.
- There is no method of making a link, but this is a quick fix since there is an execCommand() function for this, so it just needs to have an icon, add the command for making a link and maybe have an `alert()` which asks for the url.
- Would also be ideal to have a download/save button to quickly download the output as .md file.
 

### To be corrected
- The only bug currently is a weird one, when everything is bolded and then you make a list and then exit the list there is the rare case that `<font face="Helvetica, sans-serif"><span style="font-size: 14px;">` and `</span></font>` appears around the font following the list. A hard coded fix would be to just replace that with the empty string, since the font and size are all constants of the html which makes this document. Another fix is also welcome. 
- Coverage of execCommand(), it works fine on Chrome and Safari, but Firefox coverage may be spotty, I know execCommand() is not highly recommended anymore. I'm not sure of a better replacement. 
- A good way to incorporate this into the Klein project would be for it to eventually have a fetched url so that clients who download this simply go to their server `/editor/` and then draft their documents. Which leads to:
- There is no dynamic memory / recent webpage memory. I don't remember the exact name but there is a way to have it when the page is reloaded and such that all the text contained in it is still there. Currently if you reload or close the page, you will lose all your work... Which isn't ideal. 

Most of the fixes are quite simple, and the 'add-ons' are not entirely necessary so absolutely up to you to address them or not. (This was made in the editor!)

