# Klein
A client-side instructional material framework, with server-side capabilities. Currently the only server-side function is answer storage and checking.

## Overview

Klein is a client-side web framework for authoring and displaying instructional material.  It is based around the concept of a "book", which contains "pages".  The pages are the content that you display to your students.  Klein includes facilities to author content using a markdown-like syntax.  One of the key features of Klein is the answerbox, which allows students to test their understanding.  The answerboxes are checked using a "How did I do?" button, which tells the student if they are right or wrong.  

Klein is currently not able to store user data or grades, and as such is currently useful for lab manuals and practice but not for graded assignments. 

### The book file

You write your own books using a basic text editor.  The file is a markdown file with modified syntax (see below), so it would be a \*.md file.  Once you've written the file, you use the JSON parser (see below)  to parse it into a "book", or \*.bk, file.  Klein fetches the book file and any resources, such as images and videos, on page load.

### Web Server

Klein was developped using Python version 3.8.4 and Django version 3.0.8, to ensure the functionality of Klein, the latest versions are recommended on your device. Older versions may be sufficient, but they have not been tested. 

To set up Klein on your device, simply clone this repository into the location of your choice. To run the server open a terminal at the root of the repository and move into the `serverside` folder and run the following command:
>> python manage.py runserver 

This will start the web server at a default port of 8000, if you require the server to be run on a different port run the following command instead:

>> python manage.py runserver portNumber

## Klein's Components

Klein consists of three components: a python script for converting the content, a Javascript/css/html web front-end, and a Django web server to display the content.

### The Python to JSON Parser

parseToJSON.py is the parser that takes the md file and turns it into JSON that is ready for the front-end.  It parses directly to JSON and creates a .bk file (a "book"). Our repository has already established the directory structure. 

- Create a md file and save it into the following directory: `\Klein-Clientside\serverside\klein\static\BOOKS`.
- Open a terminal and navigate to the location of Klein on your device.
- When running parseToJSON.py, you supply it with the file name, and it will automatically search the above directory for that specific md file. For example;

>> python parseToJSON.py exampleBook.md

This will create or overwrite the file 'exampleBook.bk' and place it following directory: `\Klein-Clientside\serverside\klein\static\BOOKS`.


### The HTML Framework: V1.0 and up

Klein is currently set up to use the following folder structure:

- a root directory, which we'll call [Root].  [Root] contains the file 'parseToJSON.py' and the following sub-directory:
  - `serverside`, which contains the entire Django web application. It contains the file 'manage.py' which is used to manage the Django server, and the following sub-directories:
    - `klein` which contains default Django configuration files in addition to the sub-directories of interest:
      - `static` which contains the following sub-directories:
        - `BOOKS` which will contain all your markdown and book files.
        - `css` which must contain the file `kleinStyle.css`.
        - `scripts`which must contain the files `answerableComponent.js`, `AnswerCheck.js`, `CSRF_token.js`, `kleinCore.js`, and `math.js`.
      - `templates` which contains the `klein_testing.html` file used to display the content.
    - `serverside` which contains default Django configuration files.
  
To load a book there is one mandatory and one optional parameter in the URL to klein. See below the two options below.

`[url to your server]/klein?book=[book name]`

`[url to your server]/klein?book=[book name]&resURL=[resource folder(optional)]`

For example, if I have a book called "Lab_2_ArduinoPower.bk" in the `BOOKS` directory stated above, and I also have a folder called "res" in the `BOOKS` directory, which holds all of the images and video files.  Then I would use the following url:

`[url to your server]/klein/?book=Lab_2_ArduinoPower.bk&resURL=res/`


## Overview of the scripting language

Eventually Klein will transition to a WYSIWYG web editor.  Until that happens, books are written in a custom document format with a .md extension.  The syntax is described below, and a sample file, `sampleBook.md`, is available for you to view it in action.

In this syntax, anything shown in square brackets [like this] is optional.  The square brackets are ommitted in the text.

All directives must come at the start of a line at the moment.  Some nesting is implemented, especially for lists of text content and checkpoints.

### The `!bookVariables` and `!endBookVariables` directives 

Each book can set their own book variables that can be used throughout the document. Each variable must have an unique name such as `%x` or `%y` as every instance of the name will be replaced by it's value. The variables values can either be set randomly within a range or by using an equation, details can be seen below in `!var` directives.

Book variables are not mandatory, but if you choose to use them, this directive must placed at the start of the file.

### The `!var` directive 
To declare your book variables, the `!var` directive must be used within the `!bookVariables` and `!endBookVariables` directives.

The declaration follows the two formats: 

`!var uniqueName:minimumValue:maximumValue:decimalPercision`

`!var uniqueName:value`

The first format creates a randomized book variable within in the specified range and decimal percision. The second format simply creates a book variable with a value, the value can either be a numeric value or an equation. The equation can contain previously declared variables. 

For example, if you want a book variable named `%x` with a minimum value of 1, maximum value of 10, with a decimal percision of 2, the syntax is as follows.

`!var %x:1:10:2`

A full example using both formats can be seen below.

```
!bookVariables

	!var %x:1:10:2
	!var %y:10:100:3
	!var %z: %x + %y

!endBookVariables
```

This will create variables with the names `%x`, `%y`, and `%z`. `%x` will have a minimum value of 1, maximum value of 10, with a decimal percision of 2. `%y` will have a minimum value of 10, maximum value of 100, with a decimal percision of 3. `%z` will be the addition between `%x` and `%y`

All randomizations occur on webpage load. 

### The `!Book` directive

The book file must contain the line !Book [bookName] whether following the book variable declarations, or at the very beginning of the file, if no book variables are used.

The string [bookName] is the name of your book, and may be any valid text string, including spaces.  It is displayed at the top of each page.

Each book can contain only a single `!Book` directive, or the JSON will not parse correctly.

The markdown file can either contain all the pages in one file, or reference additional page files with the extension \*.pg using the !addPage directive seen below. 


### The `!Page` and `!endPage` directives

Each page in your book begins with a `!Page` directive and ends with a `!endPage` directive.

The `!Page` directive has an optional page name, like this:  `!Page [optional page name]`.  This name is what gets displayed on the page's selection button.  If it is left blank then the button defaults to the text "Page N", where N is the page number.

Currently, if you have multiple pages, you must include the `!Page` directive on the line immediately following an `!endPage` or a `!Book1` directive, without any whitespace.  This is being tracked as a todo and will be removed as a requirement in the future.

Additionally, you may add pages to your book by referencing another page file with \*.pg extension by using the !addPage directive. 

### The `!addPage` directive 

To use this directive, first create a file with the \*.pg file extension, and populate the file as you would a page in a book file. Then in your book file use !addPage [path to page]. 

Note the path to the page is automatically set to the `BOOKS` directory; \Klein-Clientside\serverside\klein\static\BOOKS.

For example let's say we have a markdown file called "test", and a folder called "pages" that contain pages 1 to 3 with the names "page1", "page2", "page3". All of this is within the `BOOKS` directory. The file structures can be seen below.
  ```
  >>test.md
  !Book bookName 

  !addPage pages/page1.pg
  !addPage pages/page2.pg
  !addPage pages/page3.pg 
  ```

  ```
  >>page1.pg
  !Page pageName

    some content

  !endPage
  ```

### Inline equation values

It is possible to show the resulting value from an equation anywhere within the document by using the following syntax within text. 

`eqn:{your equation [, assign variable]}`

This will be rendered as the resulting value of the equation, and can be optionally saved as a book variable. 

An example can be seen below.

```
This is some text. The voltage of the battery is eqn:{%x / %y, %z}V.
```

If `%x` was assigned a value of 10 and `%y` was assigned a value of 2, a new book variable called `%z` will be created with a value of 5.

On the webpage it will appear like below

>> This is some text. The voltage of the battery is 5V.


### Answer boxes: the `!ans` directive

Answer boxes are currently only available as text or numeric input boxes. There are two ways to create an answer box: either as a text or a numeric box.

Text answer boxes match the answer string directly.  The syntax is:

`!ans textToMatch id`

To create a numeric answer box, you specify the answer with a colon separated string.  The string always begins with "numeric", then the numeric nominal answer, then either the string "absolute" or a tolerance on the nominal answer. You may replace the numeric nomial answer with an equation surrounded by round brackets.  It looks like this:

`!ans numeric:2:absolute id`

This will be an answer box essentially identical to `!ans 2 id`.  It matches the number "2" exactly, and will mark anything else wrong.

`!ans numeric:2:0.1 id`

This will be an answer box that matches any number between 1.9 and 2.1, inclusive. 

`!ans numeric:(%x + %y + 2):0.1 id`

This will be an answer box that accepts the result of the equation `%x + %y + 2`, if `%x` and `%y` are book variables that were randomly assigned values of '1.1' and '2.2'. The answer box will accept any number between 5.2 and 5.4, inclusive.

 In general, it is `!ans numeric:nominal:tolderance id`.  The algorithm used is:

`if(Math.Abs(answerBoxValue-nominal) <= tolerance)` then it is marked correct, otherwise it is marked wrong.

### Multiple Choice: the `!multipleChoice` and `!endMultipleChoice` directives

Each multiple choice question must begin with `!multipleChoice correctChoice id [: question text]` and end with `!endMultipleChoice`. 

In between these two directives, the `!option` directive is used to produce the options present within the multiple choice question, see the `!option` directive below for more details and full examples.


### `!option` directive

Within the multiple choice directives, you may have as many options as you like, they will be automatically be numbered serially starting from 1. 

To create an option use the following syntax.

`!option some text` 

In the options text, declared variables and equations can be used. See inline equations above for details of use. 

A full multiple choice example is as follows. 

```
!multipleChoice 1 multi1 :what is 1+2?
		
	!option yes 

	!option no 

	!option %x

	!option eqn:{2*%x}

!endMultipleChoice 

```

Assuming `%x` has been randomly assigned the value of 1.1, this will create a multiple choice question with a question text of 'what is 1+2?' with an id of 'multi1', correct answer of '1' or 'option 1', and the following options: 'yes', 'no', '1.1', and '2.2'.

Visually on the webpage the multiple choice question will look something like this: 

```
what is 1+2?
o yes
o no
o 1.1
o 2.2 
```

Note: it is possible to set the correct option outside of the number of available options, when this occurs, whenever you check the answer using HDID, it will always appear as incorrect.

### Server-side Answer Checking 

The previously detailed answer box and multiple choice questions have their answers saved client-side by default. 

There is the option to have these answers saved server-side in a database. To save the answers server-side, simply add `serverside` to the end of your declarations.

Answers are saved based on ID, if an answer key already exists with a particular ID and you want to save another answer key using that ID, it will be overwritten in the database. 

For example:

```
!multipleChoice 1 multi1 :what is 1+2? serverside
		
	!option yes 

	!option no 

	!option %x

	!option eqn:{2*%x}

!endMultipleChoice 
```

```
!ans numeric:(%x + %y + 2):0.1 id serverside
```

Note: The current database in use is SQLite, which was built into Django. This database is meant only for development, not production. 

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

### The list environment directive

Entering the list environment requires either the `!list` or `!oList` (for ordered lists) directive.  Each list must be ended with an `!endList` directive, regardless of whether it is ordered or unordered.  Each item in a list must be on the same line as an `!item` directive.  So a list with one item that is unordered would be:

`!list`
`!item this is the first list item`
`!endList`

Currently you cannot place anything other than text in an `!item`.  That is a todo for future versions.

In order to support nesting, you just need to start a new `!list` or `!oList` instead of an item.  It looks like this:

```
    !list
        !item this is level 1
        !list
            !item this is level 2 inside of the first list
        !endList
        !oList
            !item this is a nested oList
                !list
                    !item this is a nested unordered list inside of an oList
                    !item Honestly, though, it's sort of ugly to do this, but that's your choice
                !endList
        !endList
   !endList
```

### The !brk directive

`!brk` includes a `<br>` in the HTML.

### The !code directive

`!code` at the beginning of a line of text will render that text in courier new font with a grey background, to distinguish code from regular text

### The `#` headers

Currently there are four levels of headers that are allowed, and they follow the Markdown convention.  A single `#` renders as `<h1>`, `##` renders as `<h2>`, and a `###` renders as `<h3>`.

### The `!link` directive

A link directive creates a block level link.  See below ("Markdown Syntax") for how to create an inline link.  A link is added using the `!link` directive.  Links always open in a new, blank tab. The syntax is:

`!link address inner text as a string with separated values ID`

The address should be a full web address (https:////www. etc).  The inner text is the hyperlink text itself.  It can be any text that is valid HTML.  The last entry must be the ID, separated from the rest by spaces.  An example:

`!link https://www.google.ca This is a link to google googleOID`

This will render as the html:

`<a href = https://www.google.ca target="_blank" id="googleOID">This is a link to google <\a>`

### Any other lines are intepreted as text

Any other lines that do not begin with a directive are interpreted as pure HTML text and are inserted into `<span>` elements.

#### Markdown Syntax

Within any text line, you may use some standard Markdown syntax for inline enclosed styling.  

- Double asterisks `**` will bold, single will italicize, and triple will bold/italic.  Asterisks must enclose (that is, they must come in pairs!).  This looks like this:

`This is **bold** and this is *italic* and this is ***both***`

- Three backticks (\`) will enclose inline code.  This puts the code directly into the line.  This can be used instead of the !code directive if you wish.

- Inline links are enclosed with three square brackets `[[[` and end with three closing square brackets `]]]`.  An inline link is broken into two components: the address and the text.  The two components are separated by three colons: `:::`.  An inline link therefore looks like this: `This is text [[[https://ww.google.ca:::this is a link to google]]] and this is more text```.
