# Klein-Clientside
A client-side instructional material framework

## Overview

Klein-Clientside is a client-side web framework for authoring and displaying instructional material.  It is based around the concept of a "book", which contains "pages".  The pages are the content that you display to your students.  Klein includes facilities to author content using a markdown-like syntax.  One of the key features of Klein is the answerbox, which allows students to test their understanding.  The answerboxes are checked using a "How did I do?" button, which tells the student if they are right or wrong.  

Klein clientside is currently not able to store user data or grades, and as such is currently useful for lab manuals and practice but not for graded assignments.

## Klein's Components

Klein consists of two components: a python script for converting the content and a Javascript/css/html web front-end for displaying the content.

### The Python to JSON Parser

parseToJSON.py is the parser that takes the md file and turns it into JSON that is ready for the front-end.  It parses directly to JSON and creates a .bk file (a "book").  It is recommended that you set up your folder structure as follows:

- Create a "books" folder, which contains parseToJSON.py
- Inside of the books folder, create sub-folders that store each book's markdown and (after parsing) its .bk file
- When running parseToJSON.py, you supply it with a command line argument that demonstrates how to find the md file.  Currently, line 10 of that file gets the current working directory from the OS, and appends the command line argument to it.  Thus if I have a book folder called BOOK1 that resides in the books folder and a markdown file BOOK1.md, I would call parseToJSON.py as follows:

    >> python parseToJSON.py /BOOK1/BOOK1.md

This will create or overwrite the file BOOK1.bk and place it into the BOOK1 folder.

You can then either point the web front-end directly to that bk file, or move it to a more convenient location on your server.  See below for instructions if you do not have a server and are just opening webpages directly.

### The HTML Framework
Klein is currently set up to use the following folder structure:

- a root directory, which we'll call [Root]
  - a `script` directory inside of root.  This must contain `clienCore.js` and `answerableComponent.js` at a minimum
  - a `css` directory that contains `kleinStyle.css'
  - a `books` directory that contains `parseToJSON.py` and the individual book folders.  
    - Inside of each book folder should be:
      - A folder that holds the HTML file and any resources.  I've called this folder `res`.

As long as your folders are set up like that and you are basing your HTML files on the GeneralKlein.html file, then:

Place a copy of the `GeneralKlein.html` file into one of the `res` folders, then modify line 35 in that file to point to the URL of your .bk file.  Once you navigate to the page Klein will parse your book and display it.

### What to do if you don't have a server

It is possible to use Klein Clientside without a server.  The only difference is that the HTML file you are using cannot make a JSON request to the server to get the .bk file.  

## Overview of the scripting language

Eventually Klein will transition to a WYSIWYG web editor.  Until that happens, books are written in a custom document format with a .md extension.  The syntax is described below, and a sample file, `sampleBook.md`, is available for you to view it in action.

In this syntax, anything shown in square brackets [like this] is optional.  The square brackets are ommitted in the text.

### The !Book directive

Every book file must begin with the line !Book [bookName]

The string [bookName] is the name of your book, and may be any valid text string, including spaces.  It is displayed at the top of each page.

### The !Page and !endPage directives

Each page in your book begins with a !Page directive and ends with a !endPage directive.

The !Page directive has an optional page name, like this:  `!Page [optional page name]`.  This name is what gets displayed on the page's selection button.  If it is left blank then the button defaults to the text "Page N", where N is the page number.

Currently, if you have multiple pages, you must include the !Page directive on the line immediately following an !endPage directive, without any whitespace.  This is being tracked as a todo and will be removed as a requirement in the future.

### The !img and !video directives

### The !checkpoint and !endCheckpoint directives

### the !item directive

### The !brk directive

### The !code directive

### The `#` headers
