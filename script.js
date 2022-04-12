//Keeps track of the amount of pages
var pageNum = 0;
var boldCheck = true;
//Used to replace the html of images and videos to markdown syntax
var replaceStack = [];
// var numVariables = 0;
// var numH1 = 0;
//Used to keep track the directives to images and videos for future versions
var bookPath = "";
//Used to keep track when a form is used
var noForm = true

//Creates new page by appending elements
function newPage(){
    var page = document.createElement("div");
    page.setAttribute("class", "pageBlock");
    page.setAttribute("id", "page" + pageNum);

    var pageNameText = document.createElement("label");
    pageNameText.innerHTML = "Page Name: ";
    page.appendChild(pageNameText);

    var pageNameIn = document.createElement("input");
    pageNameIn.setAttribute("type", "text");
    pageNameIn.setAttribute("id", "pageNameIn" + pageNum);
    // pageNameIn.setAttribute("class", "pageNameInText");
    page.appendChild(pageNameIn);

    var pageCol = document.createElement("button")
    pageCol.innerHTML = "Collapse"
    pageCol.setAttribute("onClick","collapse(" + pageNum + ")")
    pageCol.setAttribute("class","collapseButton")
    page.appendChild(pageCol)

    // page.appendChild(document.createElement("br"))

    var pageIn = document.createElement("div");
    pageIn.setAttribute("contenteditable", "true");
    pageIn.setAttribute("id", "pageInputText" + pageNum);
    pageIn.setAttribute("class", "pageInputText");
    page.appendChild(pageIn);

    var pageAppend = document.getElementById("input")
    pageAppend.appendChild(page)

    pageNum++;
}

//Collapses the pages with page number currPage
function collapse(currPage){
    //Takes the page at currPage and changes its display to the opposite of what it was
    var page = document.getElementById("pageInputText" + currPage);
    
    if(!(page.style.display)){
        page.style.display = 'none'
    }else if(page.style.display == 'none'){
        page.style.display = 'block'
    }else if(page.style.display == 'block'){
        page.style.display = 'none'
    }
}

//Goes through all the pages and changes their dispaly to block
function unCollapse(){
    for(var i = 0; i < pageNum; i++){
        var page = document.getElementById("pageInputText" + i);
        page.style.display = 'block'
    }
}

//Removes the last page
function removeLastPage(){
    //Removes the last page while decrementing the page numbers
    if(pageNum > 0){
        var pages = document.getElementById("input");
        pages.removeChild(pages.childNodes[pageNum--])
    }

}

function printBook(){
    //Uncollapses the pages so they can be accesed to print
    unCollapse()
    //Content that gets printed
    var content = ""
    //Output page where the the content gets appended
    var output = document.getElementById("outputContent");
    content += "!bookVariables<br><br>";
    content += variablePrint()
    content += "!endBookVariables<br>";
    var bookArr = document.getElementById("bookNameIn").value.split("/")
    // content += "!Book " + document.getElementById("bookNameIn").value + "<br>";
    content += "!Book " + bookArr[bookArr.length - 1] + "<br>";
    //Goes through the pages to add the content
    for(var i = 0; i < pageNum; i++){
        content += "!Page " + document.getElementById("pageNameIn" + i).value + "<br>"
        var pageContent = document.getElementById("pageInputText" + i).outerHTML
        pageContent = parse(pageContent);
        //Goes through a a copy of the stack not to remove elements of the original and then goes through it replacing all the elements 
        var replaceStackCopy = [...replaceStack]
        console.log(replaceStackCopy)
        while(replaceStackCopy.length > 0){
            pageContent = pageContent.replace(replaceStackCopy.shift(), replaceStackCopy.shift());
        }

        content += pageContent
        content += "!endPage<br>"
    }
    output.innerHTML = content;
}

//Makes all the replacements to markdown syntax
function parse(pageContent){
    pageContent = pageContent.replaceAll("<b>", "**");
    pageContent = pageContent.replaceAll("</b>", "**");
    pageContent = pageContent.replaceAll("<i>", "*");
    pageContent = pageContent.replaceAll("</i>", "*");
    pageContent = pageContent.replaceAll("<hr>", "---<br>");
    pageContent = pageContent.replaceAll("<ol>", "!oList");
    pageContent = pageContent.replaceAll("<ul>", "!list");
    pageContent = pageContent.replaceAll("</ol>", "<br>!endList<br>");
    pageContent = pageContent.replaceAll("</ul>", "<br>!endList<br>");
    pageContent = pageContent.replaceAll("<li>", "<br>!item ");
    pageContent = pageContent.replaceAll("class=\"pageInputText\"", "");
    pageContent = pageContent.replaceAll("<h1>", "# ");
    pageContent = pageContent.replaceAll("</h1>", "");
    pageContent = pageContent.replaceAll("<h2>", "## ");
    pageContent = pageContent.replaceAll("</h2>", "");
    pageContent = pageContent.replaceAll("<h3>", "### ");
    pageContent = pageContent.replaceAll("</h3>", "");
    // pageContent = pageContent.replaceAll("data-vscid=\"","");
    // <a href="link.com">text</a>
    return pageContent;
}

//Surrounds highlighted text with the checkpoint syntax
function addCheckpoint(){
    var selection= window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var div= document.createElement("div");
    div.innerHTML = "!checkpoint<br>"
    div.appendChild(selectedText);
    div.innerHTML = div.innerHTML + "!endCheckpoint"
    if(noForm && isInPage(window.getSelection().anchorNode)){
        selection.insertNode(div);
    }


    // var div = document.createElement("div")
    // div.innerHTML = "!checkpoint<br><br>!endCheckpoint"
    // var range = window.getSelection().getRangeAt(0);
    // range.deleteContents()
    // range.insertNode(div)
    // console.log(window.getSelection())
}

//The next few functions create a form for the function name, then have the user submit information in the form
//With the information in the form the appropriate markdown syntax is created and used to replace the form


function multipleChoice(){

    var form = document.createElement("form")
    form.setAttribute("id", "MCForm");

    var numO = document.createElement("label")
    numO.innerHTML = "Number of options: "
    form.appendChild(numO)

    var numOIn = document.createElement("input")
    numOIn.setAttribute("type", "text")
    numOIn.setAttribute("id", "numOptions");
    form.appendChild(numOIn)

    form.appendChild(document.createElement("br"))

    var correct = document.createElement("label")
    correct.innerHTML = "Correct Option: "
    form.appendChild(correct)

    var correctIn = document.createElement("input")
    correctIn.setAttribute("type", "text")
    correctIn.setAttribute("id", "correctIn");
    form.appendChild(correctIn)

    form.appendChild(document.createElement("br"))

    var id = document.createElement("label")
    id.innerHTML = "ID: "
    form.appendChild(id)

    var idIn = document.createElement("input")
    idIn.setAttribute("type", "text")
    idIn.setAttribute("id", "MCID");
    form.appendChild(idIn)

    form.appendChild(document.createElement("br"))

    var question = document.createElement("label")
    question.innerHTML = "Question: "
    form.appendChild(question)

    var questionIn = document.createElement("input")
    questionIn.setAttribute("type", "text")
    questionIn.setAttribute("id", "MCQueston");
    form.appendChild(questionIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "MCSubmit()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        numOIn.focus()
    }
}

function MCSubmit(){
    document.getElementById("numOptions").focus()
    var form = document.getElementById("MCForm")
    var question = document.getElementById("MCQueston").value
    var id = document.getElementById("MCID").value
    var correct = document.getElementById("correctIn").value
    var numO = document.getElementById("numOptions").value
    var mc = "!multipleChoice " + correct + " " + id + " :" + question + "<br>";
    for(var i = 0; i < parseInt(numO); i++){
        mc += "<br>!option <br>"
    }
    mc += "!endMultipleChoice"

    //The syntax for the multiple choice is appended to a div which is then appended to the page where the cursor is
    var div = document.createElement("div")
    div.innerHTML = mc;
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(div)
    unlock()
}

//This has a bunch of forms because each radio button makes a new form
function answerBox(){
    var pageInNum = 0

    var form = document.createElement("form")
    form.setAttribute("id", "ABForm");

    var numAbsRadIn = document.createElement("input")
    numAbsRadIn.setAttribute("type", "radio")
    numAbsRadIn.setAttribute("id", "numAbsRad");
    numAbsRadIn.setAttribute("name", "answerBox");
    numAbsRadIn.setAttribute("onClick", "ansBoxRadio(true, false, false," + pageInNum + ")");
    form.appendChild(numAbsRadIn)
    
    var numAbsRad = document.createElement("label")
    numAbsRad.innerHTML = "Numeric Absolute"
    form.appendChild(numAbsRad)

    form.appendChild(document.createElement("br"))

    var numTolRadIn = document.createElement("input")
    numTolRadIn.setAttribute("type", "radio")
    numTolRadIn.setAttribute("id", "numTolRad");
    numTolRadIn.setAttribute("name", "answerBox");
    numTolRadIn.setAttribute("onClick", "ansBoxRadio(false, true, false," + pageInNum + ")");
    form.appendChild(numTolRadIn)
    
    var numTolRad = document.createElement("label")
    numTolRad.innerHTML = "Numeric Tolerance"
    form.appendChild(numTolRad)

    form.appendChild(document.createElement("br"))

    var textRadIn = document.createElement("input")
    textRadIn.setAttribute("type", "radio")
    textRadIn.setAttribute("id", "textRad");
    textRadIn.setAttribute("name", "answerBox");
    textRadIn.setAttribute("onClick", "ansBoxRadio(false, false, true," + pageInNum + ")");
    form.appendChild(textRadIn)
    
    var textRad = document.createElement("label")
    textRad.innerHTML = "Text to Match"
    form.appendChild(textRad)

    form.appendChild(document.createElement("br"))

    // page.appendChild(form)
    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
    }
}

function ansBoxRadio(abs, tol, text, pageInNum){
    var form = document.getElementById("ABForm")
    
    var absForm = document.createElement("div")
    absForm.setAttribute("id", "absForm");

    var absVal = document.createElement("label")
    absVal.innerHTML = "Value: "
    absForm.appendChild(absVal)

    var absValIn = document.createElement("input")
    absValIn.setAttribute("type", "text")
    absValIn.setAttribute("id", "absValIn");
    absForm.appendChild(absValIn)

    absForm.appendChild(document.createElement("br"))

    var absID = document.createElement("label")
    absID.innerHTML = "ID: "
    absForm.appendChild(absID)

    var absIDIn = document.createElement("input")
    absIDIn.setAttribute("type", "text")
    absIDIn.setAttribute("id", "absIDIn");
    absForm.appendChild(absIDIn)

    absForm.appendChild(document.createElement("br"))

    var submitAbs = document.createElement("input")
    submitAbs.setAttribute("onClick", "ansBoxSub(true, false, false," + pageInNum + ")");
    submitAbs.setAttribute("type", "button");
    submitAbs.setAttribute("value", "Submit");
    absForm.appendChild(submitAbs)


    var tolForm = document.createElement("div")
    tolForm.setAttribute("id", "tolForm");

    var tolVal = document.createElement("label")
    tolVal.innerHTML = "Value: "
    tolForm.appendChild(tolVal)

    var tolValIn = document.createElement("input")
    tolValIn.setAttribute("type", "text")
    tolValIn.setAttribute("id", "tolValIn");
    tolForm.appendChild(tolValIn)

    tolForm.appendChild(document.createElement("br"))

    var toltol = document.createElement("label")
    toltol.innerHTML = "Tolerance: "
    tolForm.appendChild(toltol)

    var toltolIn = document.createElement("input")
    toltolIn.setAttribute("type", "text")
    toltolIn.setAttribute("id", "toltolIn");
    tolForm.appendChild(toltolIn)

    tolForm.appendChild(document.createElement("br"))

    var tolID = document.createElement("label")
    tolID.innerHTML = "ID: "
    tolForm.appendChild(tolID)

    var tolIDIn = document.createElement("input")
    tolIDIn.setAttribute("type", "text")
    tolIDIn.setAttribute("id", "tolIDIn");
    tolForm.appendChild(tolIDIn)

    tolForm.appendChild(document.createElement("br"))

    var submitTol = document.createElement("input")
    submitTol.setAttribute("onClick", "ansBoxSub(false, true, false," + pageInNum + ")");
    submitTol.setAttribute("type", "button");
    submitTol.setAttribute("value", "Submit");
    tolForm.appendChild(submitTol)

    var textForm = document.createElement("div")
    textForm.setAttribute("id", "textForm");

    var textVal = document.createElement("label")
    textVal.innerHTML = "Text: "
    textForm.appendChild(textVal)

    var textIn = document.createElement("input")
    textIn.setAttribute("type", "text")
    textIn.setAttribute("id", "textIn");
    textForm.appendChild(textIn)

    textForm.appendChild(document.createElement("br"))

    var textID = document.createElement("label")
    textID.innerHTML = "ID: "
    textForm.appendChild(textID)

    var textIDIn = document.createElement("input")
    textIDIn.setAttribute("type", "text")
    textIDIn.setAttribute("id", "textIDIn");
    textForm.appendChild(textIDIn)

    textForm.appendChild(document.createElement("br"))

    var submitText = document.createElement("input")
    submitText.setAttribute("onClick", "ansBoxSub(false, false, true," + pageInNum + ")");
    submitText.setAttribute("type", "button");
    submitText.setAttribute("value", "Submit");
    textForm.appendChild(submitText)


    //Checks which type of answer box needs to be created

    if(abs){
        form.appendChild(absForm)
        if(document.getElementById("tolForm"))
            form.removeChild(document.getElementById("tolForm"))
        if(document.getElementById("textForm"))
            form.removeChild(document.getElementById("textForm"))
        absValIn.focus()
    }else if(tol){
        form.appendChild(tolForm)
        if(document.getElementById("absForm"))
            form.removeChild(document.getElementById("absForm"))
        if(document.getElementById("textForm"))
            form.removeChild(document.getElementById("textForm"))
        tolValIn.focus()
    }else if(text){
        form.appendChild(textForm)
        if(document.getElementById("absForm"))
            form.removeChild(document.getElementById("absForm"))
        if(document.getElementById("tolForm"))
            form.removeChild(document.getElementById("tolForm"))
        textIn.focus()
    }
}

function ansBoxSub(abs, tol, text, pageInNum){
    // var page = document.getElementById("pageInputText" + pageInNum);
    var form = document.getElementById("ABForm");

    if(abs){
        var val = document.getElementById("absValIn").value;
        document.getElementById("absValIn").focus()
        var id = document.getElementById("absIDIn").value;
        var ab = "!ans numeric:" + val + ":absolute " + id
        // page.innerHTML = page.innerHTML + ab
        // page.removeChild(document.getElementById("ABForm"));
        // page.removeChild(form);
    }else if(tol){
        var val = document.getElementById("tolValIn").value;
        var id = document.getElementById("tolIDIn").value;
        var id = document.getElementById("tolIDIn").focus()
        var tol = document.getElementById("toltolIn").value;
        var ab = "!ans numeric:" + val + ":" + tol + " " + id
        // page.innerHTML = page.innerHTML + ab
        // page.removeChild(document.getElementById("ABForm"));
    }else if(text){
        var textIn = document.getElementById("textIn").value;
        document.getElementById("textIn").focus()
        var id = document.getElementById("textIDIn").value;
        var ab = "!ans " + textIn + " " + id
        // page.innerHTML = page.innerHTML + ab
        // page.removeChild(document.getElementById("ABForm"));
    }

    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(document.createTextNode(ab))
    unlock()

}

function table(){

    // lock()
    var form = document.createElement("form")
    form.setAttribute("id", "tableForm");

    var col = document.createElement("label")
    col.innerHTML = "Columns: "
    form.appendChild(col)

    var colIn = document.createElement("input")
    colIn.setAttribute("type", "text")
    colIn.setAttribute("id", "colIn");
    form.appendChild(colIn)

    form.appendChild(document.createElement("br"))

    var row = document.createElement("label")
    row.innerHTML = "Rows: "
    form.appendChild(row)

    var rowIn = document.createElement("input")
    rowIn.setAttribute("type", "text")
    rowIn.setAttribute("id", "rowIn");
    form.appendChild(rowIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitTable()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    // page.appendChild(form)
    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        colIn.focus()
    }

}

function submitTable(){
    var form = document.getElementById("tableForm")
    document.getElementById("colIn").focus()
    var cols = parseInt(document.getElementById("colIn").value)
    var rows = parseInt(document.getElementById("rowIn").value)
    var table = "|"
    for(var i = 0; i < cols; i ++){
        table += "&emsp;&emsp;|"
    }
    table +="<br>|"
    
    for(var i = 0; i < cols; i ++){
        table += "------|"
    }

    table +="<br>|"
    
    for (var i = 1; i < rows; i++){
        for(var j = 0; j < cols; j++){
            table += "&emsp;&emsp;|"
        }

        if(i < rows -1){
            table +="<br>|"
        }
    }
    var div = document.createElement("div")
    div.innerHTML = table
    // page.innerHTML = page.innerHTML + table
    // page.removeChild(document.getElementById("tableForm"))

    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(div)
    unlock()
}

function image(){

    // lock()
    var form = document.createElement("form")
    form.setAttribute("id", "imgForm");

    var alt = document.createElement("label")
    alt.innerHTML = "Alt Text: "
    form.appendChild(alt)

    var altIn = document.createElement("input")
    altIn.setAttribute("type", "text")
    altIn.setAttribute("id", "altIn");
    form.appendChild(altIn)

    form.appendChild(document.createElement("br"))

    var img = document.createElement("label")
    img.innerHTML = "Image Location: "
    form.appendChild(img)

    var imgIn = document.createElement("input")
    imgIn.setAttribute("type", "text")
    imgIn.setAttribute("id", "imgIn");
    form.appendChild(imgIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitImage()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    // page.appendChild(form)
    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        altIn.focus()
    }
}

function submitImage(){
    //Currently uses placeholders to fill in the image then the replaceStack stack to repace the html with mardown syntac when printed
    var form = document.getElementById("imgForm")
    document.getElementById("altIn").focus()
    var alt = document.getElementById("altIn").value
    var img = document.getElementById("imgIn").value

    //Creates the markdown syntax
    var imgPrint = "![" + alt + "](" + img + ")"

    //Initially this would be used to keep track of the path to the image then the image would be used instead of the place holder but there was not enough time in the work term to implement this idea
    bookPath = "../bookRoot/" + document.getElementById("bookNameIn").value + "/res/"
    var src = bookPath + img
    console.log(src)

    //Uses a place holder for the image to give the user a sense of how their image would look in the book
    var imgHtml = document.createElement("img")
    imgHtml.setAttribute("src", src)
    // imgHtml.setAttribute("src","https://papers.co/wp-content/uploads/papers.co-nk50-tree-nature-solo-nature-green-red-1-wallpaper-300x300.jpg")
    imgHtml.setAttribute("alt",alt)


    //Appends the repacements to be replaced when printed
    replaceStack.push(imgHtml.outerHTML)
    replaceStack.push(imgPrint)

    // page.innerHTML = page.innerHTML + imgPrint
    // // page.appendChild(imgHtml)
    // page.removeChild(document.getElementById("imgForm"))
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(imgHtml)
    unlock()
}

function video(){
    var form = document.createElement("form")
    form.setAttribute("id", "vidForm");

    var alt = document.createElement("label")
    alt.innerHTML = "Alt Text: "
    form.appendChild(alt)

    var altVidIn = document.createElement("input")
    altVidIn.setAttribute("type", "text")
    altVidIn.setAttribute("id", "altVidIn");
    form.appendChild(altVidIn)

    form.appendChild(document.createElement("br"))

    var thum = document.createElement("label")
    thum.innerHTML = "Video Thumbnail Location: "
    form.appendChild(thum)

    var thumIn = document.createElement("input")
    thumIn.setAttribute("type", "text")
    thumIn.setAttribute("id", "thumIn");
    form.appendChild(thumIn)

    form.appendChild(document.createElement("br"))

    var vid = document.createElement("label")
    vid.innerHTML = "Video Location: "
    form.appendChild(vid)

    var vidIn = document.createElement("input")
    vidIn.setAttribute("type", "text")
    vidIn.setAttribute("id", "vidIn");
    form.appendChild(vidIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitVideo()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    // page.appendChild(form)
    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        altVidIn.focus()
    }
}

function submitVideo(){

    var alt = document.getElementById("altVidIn").value;
    document.getElementById("altVidIn").focus()
    var thum = document.getElementById("thumIn").value;
    var vid = document.getElementById("vidIn").value;
    var form = document.getElementById("vidForm")

    var vidText = "[![" + alt + "](" + thum + ")](" + vid + ")";
    // page.innerHTML = page.innerHTML + vidText
    // page.removeChild(document.getElementById("vidForm"))



    //Initially this would be used to keep track of the path to the image then the image would be used instead of the place holder but there was not enough time in the work term to implement this idea
    bookPath = "../bookRoot/" + document.getElementById("bookNameIn").value + "/res/"
    var src = bookPath + vid
    var poster = bookPath + thum
    console.log(src)

    //Uses a place holder for the image to give the user a sense of how their image would look in the book
    var vidHtml = document.createElement("video")
    vidHtml.setAttribute("src", src)
    vidHtml.setAttribute("controls", "controls")
    vidHtml.setAttribute("poster", poster)
    vidHtml.setAttribute("alt",alt)

    // //Same idea as the image where currently there is a place holder but in later versions it would use a path to the video
    // var imgHtml = document.createElement("img")
    // imgHtml.setAttribute("src","https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270")
    // imgHtml.setAttribute("alt",alt)

    // var vidHtml = document.createElement("video")
    // vidHtml.setAttribute("src", )

    // replaceStack.push(imgHtml.outerHTML)
    replaceStack.push(vidHtml.outerHTML)
    replaceStack.push(vidText)

    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    // range.insertNode(imgHtml)
    range.insertNode(vidHtml)
    unlock()

}

function inLink(){

    // lock()
    var form = document.createElement("form")
    form.setAttribute("id", "linkForm");

    var text = document.createElement("label")
    text.innerHTML = "Text: "
    form.appendChild(text)

    var linkTextIn = document.createElement("input")
    linkTextIn.setAttribute("type", "text")
    linkTextIn.setAttribute("id", "linkTextIn");
    form.appendChild(linkTextIn)

    form.appendChild(document.createElement("br"))

    var link = document.createElement("label")
    link.innerHTML = "Link: "
    form.appendChild(link)

    var linkIn = document.createElement("input")
    linkIn.setAttribute("type", "text")
    linkIn.setAttribute("id", "linkIn");
    form.appendChild(linkIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitLink()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    //Appends the form where the users cursor was
    var range = window.getSelection().getRangeAt(0);
    //Checks if another form is already open and if the cursor is in an editable page 
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        linkTextIn.focus()
    }
    // page.appendChild(form)
}

function submitLink(){
    document.getElementById("linkTextIn").focus()
    var form = document.getElementById("linkForm")

    var text = document.getElementById("linkTextIn").value
    var link = document.getElementById("linkIn").value

    var inLineLink = "[" + text + "](" + link + ")"
    // var div = document.createElement("div")

    // var linkHtml = document.createElement("a")
    // linkHtml.setAttribute("href",link)
    // linkHtml.innerHTML = text

    // div.appendChild(linkHtml)
    

    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    // range.insertNode(linkHtml)
    range.insertNode(document.createTextNode(inLineLink))
    unlock()
}

//Makes all the divs un - editable when a form button is clicked so another form button cant be clicked maked multiple forms exist 
function lock(){
    noForm = false
    for(var i = 0; i < pageNum;i++ ){
        var page = document.getElementById("pageInputText" + i)
        page.contentEditable = false
    }

    document.getElementById("variables").contentEditable = false
    document.getElementById("outputContent").contentEditable = false
}

//Makes all the divs editable for new buttons to be clicked
function unlock(){
    noForm = true
    for(var i = 0; i < pageNum;i++ ){
        var page = document.getElementById("pageInputText" + i)
        page.contentEditable = true
    }

    document.getElementById("variables").contentEditable = true
    document.getElementById("outputContent").contentEditable = true
}

//Creates a form for the user to add variables
function addVariable(){
    var form = document.createElement("form")
    var page = document.getElementById("variableFormPlace")
    form.setAttribute("id", "variableForm")

    var name = document.createElement("label")
    name.innerHTML = "Name: "
    form.appendChild(name)

    var nameIn = document.createElement("input")
    nameIn.setAttribute("type", "text")
    nameIn.setAttribute("id", "nameIn");
    form.appendChild(nameIn)

    form.appendChild(document.createElement("br"))

    var val = document.createElement("label")
    val.innerHTML = "Value:  "
    form.appendChild(val)

    var valIn = document.createElement("input")
    valIn.setAttribute("type", "text")
    valIn.setAttribute("id", "valIn");
    form.appendChild(valIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitVariable()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    page.appendChild(form)
}

function addRandomVariable(){
    var form = document.createElement("form")
    var page = document.getElementById("variableFormPlace")
    form.setAttribute("id", "variableForm")

    var name = document.createElement("label")
    name.innerHTML = "Name: "
    form.appendChild(name)

    var nameIn = document.createElement("input")
    nameIn.setAttribute("type", "text")
    nameIn.setAttribute("id", "ranNameIn");
    form.appendChild(nameIn)

    form.appendChild(document.createElement("br"))

    var min = document.createElement("label")
    min.innerHTML = "Min Value:  "
    form.appendChild(min)

    var minIn = document.createElement("input")
    minIn.setAttribute("type", "text")
    minIn.setAttribute("id", "ranMinIn");
    form.appendChild(minIn)

    form.appendChild(document.createElement("br"))

    var max = document.createElement("label")
    max.innerHTML = "Max Value:  "
    form.appendChild(max)

    var maxIn = document.createElement("input")
    maxIn.setAttribute("type", "text")
    maxIn.setAttribute("id", "ranMaxIn");
    form.appendChild(maxIn)

    form.appendChild(document.createElement("br"))

    var dec = document.createElement("label")
    dec.innerHTML = "Decimal Precision:  "
    form.appendChild(dec)

    var decIn = document.createElement("input")
    decIn.setAttribute("type", "text")
    decIn.setAttribute("id", "decIn");
    form.appendChild(decIn)

    form.appendChild(document.createElement("br"))

    var submit = document.createElement("input")
    submit.setAttribute("onClick", "submitRandomVariable()");
    submit.setAttribute("type", "button");
    submit.setAttribute("value", "Submit");
    form.appendChild(submit)

    page.appendChild(form)
}

function submitVariable(){
    var form = document.getElementById("variableForm")
    var name = document.getElementById("nameIn").value
    var val = document.getElementById("valIn").value
    var page = document.getElementById("variableFormPlace")
    var variableHolder = document.getElementById("variables")
    var variable = name + ":" + val
    // console.log(variable)
    var varDiv = document.createElement("div")
    // varDiv.setAttribute("id", "variable" + numVariables)
    // numVariables++;
    varDiv.innerHTML = variable;
    variableHolder.appendChild(varDiv)
    // variableHolder.innerHTML = variableHolder.innerHTML + variable
    page.removeChild(form)
}

function submitRandomVariable(){
    var form = document.getElementById("variableForm")
    var name = document.getElementById("ranNameIn").value
    var min = document.getElementById("ranMinIn").value
    var max = document.getElementById("ranMaxIn").value
    var dec = document.getElementById("decIn").value
    var page = document.getElementById("variableFormPlace")
    var variableHolder = document.getElementById("variables")
    var variable = name + ":" + min + ":" + max + ":" + dec
    // console.log(variable)
    var varDiv = document.createElement("div")
    // varDiv.setAttribute("id", "variable" + numVariables)
    // numVariables++;
    varDiv.innerHTML = variable;
    variableHolder.appendChild(varDiv)
    // variableHolder.innerHTML = variableHolder.innerHTML + variable
    page.removeChild(form)
}

function variablePrint(){
    var variables = document.getElementById("variables").innerHTML
    variables = variables.trim()
    if(variables.trim() == ""){
        return variables
    }

    if(!(variables.startsWith("<div>"))){
        variables = "!var " + variables
        variables = variables.replace("<div>", "<br>!var ")
    }

    variables = variables.replaceAll("<div>", "!var ")
    variables = variables.replaceAll("</div>", "<br>")
    variables += "<br>"
    return variables
}


//Checks if the child node is from a page
function isInPage(child){
    var node = child

    while(child){
        if (node.id && node.id.startsWith("pageInputText")) {
            return true;
        }   

        node = node.parentNode;
    }

    return false;
}