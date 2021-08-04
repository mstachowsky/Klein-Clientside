var pageNum = 0;
var boldCheck = true;
var replaceStack = [];
var numVariables = 0;
var numH1 = 0;
var noForm = true
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

function removeLastPage(){
    if(pageNum > 0){
        var pages = document.getElementById("input");
        pages.removeChild(pages.childNodes[pageNum--])
    }

}

function printBook(){
    var content = ""
    var output = document.getElementById("outputContent");
    content += "!bookVariables<br><br>";
    content += variablePrint()
    content += "!endBookVariables<br>";
    content += "!Book " + document.getElementById("bookNameIn").value + "<br>";
    var pages = document.getElementsByClassName("pageBlock")
    for(var i = 0; i < pageNum; i++){
        content += "!Page " + document.getElementById("pageNameIn" + i).value + "<br>"
        var pageContent = document.getElementById("pageInputText" + i).outerHTML
        pageContent = parse(pageContent);
        // console.log(pageContent)
        // while(replaceStack.length > 0){
        //     pageContent = pageContent.replace(replaceStack.shift(), replaceStack.shift());
        // }

        content += pageContent
        content += "!endPage<br>"
    }
    output.innerHTML = content;
}

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
    return pageContent;
}

function addCheckpoint(){
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // page.innerHTML = page.innerHTML + "!checkpoint<br><br>!endCheckpoint"
    var div = document.createElement("div")
    div.innerHTML = "!checkpoint<br><br>!endCheckpoint"
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    range.insertNode(div)
    // console.log(window.getSelection())
}

function multipleChoice(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }

    // lock()

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

    // page.appendChild(form)
    // console.log(window.getSelection())
    var range = window.getSelection().getRangeAt(0);
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        numOIn.focus()
    }
    // console.log(form)
}

function MCSubmit(){
    var form = document.getElementById("MCForm")
    var question = document.getElementById("MCQueston").value
    var id = document.getElementById("MCID").value
    var correct = document.getElementById("correctIn").value
    var numO = document.getElementById("numOptions").value
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }
    var mc = "!multipleChoice " + correct + " " + id + " :" + question + "<br>";
    for(var i = 0; i < parseInt(numO); i++){
        mc += "<br>!option <br>"
    }
    mc += "!endMultipleChoice"

    // page.removeChild(form)
    // page.innerHTML = page.innerHTML+ mc
    var div = document.createElement("div")
    div.innerHTML = mc;
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(div)
    unlock()
}

function answerBox(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    //     var pageInNum = window.getSelection().anchorNode.parentElement.id.slice(-1);
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    //     var pageInNum = window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1);
    // }

    // var pageInNum = window.getSelection().anchorNode.parentElement.id.slice(-1);

    // lock()
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
    var range = window.getSelection().getRangeAt(0);
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
        var id = document.getElementById("absIDIn").value;
        var ab = "!ans numeric:" + val + ":absulute " + id
        // page.innerHTML = page.innerHTML + ab
        // page.removeChild(document.getElementById("ABForm"));
        // page.removeChild(form);
    }else if(tol){
        var val = document.getElementById("tolValIn").value;
        var id = document.getElementById("tolIDIn").value;
        var tol = document.getElementById("toltolIn").value;
        var ab = "!ans numeric:" + val + ":" + tol + " " + id
        // page.innerHTML = page.innerHTML + ab
        // page.removeChild(document.getElementById("ABForm"));
    }else if(text){
        var textIn = document.getElementById("textIn").value;
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
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }

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
    var range = window.getSelection().getRangeAt(0);
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        colIn.focus()
    }

}

function submitTable(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }
    var form = document.getElementById("tableForm")
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
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }

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
    var range = window.getSelection().getRangeAt(0);
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        altIn.focus()
    }
}

function submitImage(){
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }
    var form = document.getElementById("imgForm")
    var alt = document.getElementById("altIn").value
    var img = document.getElementById("imgIn").value

    var imgPrint = "![" + alt + "](" + img + ")"

    // var imgHtml = document.createElement("img")
    // imgHtml.setAttribute("src",img)
    // imgHtml.setAttribute("alt",alt)

    // replaceStack.push(imgHtml.outerHTML)
    // replaceStack.push(imgPrint)

    // page.innerHTML = page.innerHTML + imgPrint
    // // page.appendChild(imgHtml)
    // page.removeChild(document.getElementById("imgForm"))
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(document.createTextNode(imgPrint))
    unlock()
}

function video(){
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }

    // lock()
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
    var range = window.getSelection().getRangeAt(0);
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        altVidIn.focus()
    }
}

function submitVideo(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }

    var alt = document.getElementById("altVidIn").value;
    var thum = document.getElementById("thumIn").value;
    var vid = document.getElementById("vidIn").value;
    var form = document.getElementById("vidForm")

    var vidText = "[![" + alt + "(" + thum + ")](" + vid + ")";
    // page.innerHTML = page.innerHTML + vidText
    // page.removeChild(document.getElementById("vidForm"))
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(document.createTextNode(vidText))
    unlock()

}

function inLink(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // } 

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

    var range = window.getSelection().getRangeAt(0);
    if(noForm && isInPage(window.getSelection().anchorNode)){
        lock()
        range.deleteContents()
        range.insertNode(form)
        linkTextIn.focus()
    }
    // page.appendChild(form)
}

function submitLink(){
    // var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // if(document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1))){
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.id.slice(-1));
    // }else{
    //     var page = document.getElementById("pageInputText" + window.getSelection().anchorNode.parentElement.parentElement.id.slice(-1));
    // }
    var form = document.getElementById("linkForm")

    var text = document.getElementById("linkTextIn").value
    var link = document.getElementById("linkIn").value

    var inLineLink = "[" + text + "](" + link + ")"
    // var linkHtml = document.createElement("a")
    // linkHtml.setAttribute("href",link)
    // linkHtml.innerHTML = text

    // replaceStack.push(linkHtml.outerHTML)
    // replaceStack.push(inLineLink)
    
    // page.removeChild(linkHtml)
    // page.innerHTML = page.innerHTML + inLineLink
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents()
    form.parentNode.removeChild(form)
    range.insertNode(document.createTextNode(inLineLink))
    unlock()
}

function lock(){
    noForm = false
    for(var i = 0; i < pageNum;i++ ){
        var page = document.getElementById("pageInputText" + i)
        page.contentEditable = false
    }
}

function unlock(){
    noForm = true
    for(var i = 0; i < pageNum;i++ ){
        var page = document.getElementById("pageInputText" + i)
        page.contentEditable = true
    }
}

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
    var varDiv = document.createElement("div")
    // varDiv.setAttribute("id", "variable" + numVariables)
    // numVariables++;
    varDiv.innerHTML = variable;
    variableHolder.appendChild(varDiv)
    // variableHolder.innerHTML = variableHolder.innerHTML + variable
    page.removeChild(form)
}

// function removeLastVariable(){
//     if(numVariables > 0){
//         var pages = document.getElementById("variables");
//         pages.removeChild(pages.childNodes[numVariables--])
//     }

// }

function variablePrint(){
    var variables = document.getElementById("variables").innerHTML
    if(variables.trim() == ""){
        return variables
    }

    if(!(variables.startsWith("<div>"))){
        variables = "!var " + variables
        variables = variables.replace("<div>", "<br>!var ")
    }
    // for(var i = 0; i < numVariables; i++){
    //     variables += "!var " + document.getElementById("variable" + i).innerHTML + "<br>"
    // }
    variables = variables.replaceAll("<div>", "!var ")
    variables = variables.replaceAll("</div>", "<br>")
    variables += "<br>"
    return variables
}

// function h1(){
//     var sel = window.getSelection()
//     var div = document.createElement("div")
//     div.setAttribute("class", "h1")
//     var range = sel.getRangeAt(0).cloneRange();
//     range.surroundContents(div)
//     // range.deleteContents()
//     // range.insertNode(div)
//     sel.removeAllRanges()
//     sel.addRange(range)
//     if(div.innerHTML == ""){
//         div.innerHTML = "&nbsp;"
//     }

//     // var range = window.getSelection().getRangeAt(0);
//     // range.deleteContents()
//     // range.insertNode(form)

//     // console.log(window.getSelection().anchorNode.getAttribute("class"))
//     // if(window.getSelection().anchorNode.getAttribute("class") && window.getSelection().anchorNode.getAttribute("class") == "h1"){
//     //     var sel= window.getSelection().getRangeAt(0);
//     //     var text = sel.extractContents();
//     //     var div = document.createElement("div")
//     //     div.setAttribute("class", "normal")
//     //     div.appendChild(text);
//     //     sel.insertNode(div);
//     //     if(div.innerHTML == ""){
//     //         div.innerHTML = "&nbsp;"
//     //     }
//     // }
//     // else{
//     //     var sel= window.getSelection().getRangeAt(0);
//     //     var text = sel.extractContents();
//     //     var div = document.createElement("div")
//     //     div.setAttribute("class", "h1")
//     //     div.appendChild(text);
//     //     sel.insertNode(div);
//     //     if(div.innerHTML == ""){
//     //         div.innerHTML = "&nbsp;"
//     //     }
//     // }

//     // var sel= window.getSelection().getRangeAt(0);
//     // var text = sel.extractContents();
//     // var div = document.createElement("div")
//     // div.setAttribute("class", "h1")
//     // div.appendChild(text);
//     // sel.insertNode(div);
//     // if(div.innerHTML == ""){
//     //     div.innerHTML = "&nbsp;"
//     // }

// }

function isInPage(child){
    var node = child
    // console.log(node)

    while(child){
        if (node.id && node.id.startsWith("pageInputText")) {
            return true;
        }   

        node = node.parentNode;
    }

    return false;
}

function test(){
    console.log(window.getSelection().getRangeAt(0).insertNode(document.createTextNode("heklo")))
}