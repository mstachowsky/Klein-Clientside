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

All directives must come at the start of a line at the moment.  Nested directives are not yet implemented.

### The `!Book` directive

Every book file must begin with the line !Book [bookName]

The string [bookName] is the name of your book, and may be any valid text string, including spaces.  It is displayed at the top of each page.

Each book can contain only a single `!Book` directive, or the JSON will not parse correctly.

### The `!Page` and `!endPage` directives

Each page in your book begins with a `!Page` directive and ends with a `!endPage` directive.

The `!Page` directive has an optional page name, like this:  `!Page [optional page name]`.  This name is what gets displayed on the page's selection button.  If it is left blank then the button defaults to the text "Page N", where N is the page number.

Currently, if you have multiple pages, you must include the `!Page` directive on the line immediately following an `!endPage` or a `!Book1` directive, without any whitespace.  This is being tracked as a todo and will be removed as a requirement in the future.

### The !img and !video directives

These two directives must be on their own line.  The syntax is:

`!img imgSrc.extension width height id`

or

`!video videoSrc.extension width height id`

`imgSrc.extension` is the image source (similar for `videoSrc.extension`).  It is identical to what is used in HTML and can include a directory path.  It is not given in quotes.

`width` and `height` are width and height in pixels.  Height is required at the moment for legacy reasons, but will be made optional in the future.  

`id` is an ID string.  It must be present at the moment but again will be made optional in the future.

### The `!checkpoint` and `!endCheckpoint` directives

A checkpoint is a green box that contains other directives.  Upon encountering the `!checkpoint` directive, the parser will create a `<div>` and add anything between the `!checkpoint` and `!endCheckpoint` directives to that div.  The checkpoint environment is a place to make it easy to call attention to a step in a lab or a question that the students must answer.

### the !item directive

Klein currently does not support nested lists, but it does allow for single-layer unordered lists.  Each item in a list must be on the same line as an `!item` directive, like this:

`!item this is the first list item`

Currently you cannot place anything other than text in an `!item`.  That is a todo for future versions.

### The !brk directive

`!brk` includes a `<br>` in the HTML.

### The !code directive

`!code` at the beginning of a line of text will render that text in courier new font with a grey background, to distinguish code from regular text

### The `#` headers

Currently there are four levels of headers that are allowed, and they follow the Markdown convention.  A single `#` renders as `<h1>`, `##` renders as `<h2>`, and a `###` renders as `<h3>`.

### Any other lines are intepreted as text

Any other lines that do not begin with a directive are interpreted as pure HTML text and are inserted into `<span>` elements.

Within any text line, you may bold or italicize (or both) using standard Markdown syntax.  Double asterisks `**` will bold, single will italicize, and triple will bold/italic.  Asterisks must enclose (that is, they must come in pairs!).  This looks like this:

`This is **bold** and this is *italic* and this is ***both***`
