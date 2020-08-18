var editorCount = 0;
var editorArray = [];

setup();
function setup() {
    //alert("This is the setup function.");
    makeTitle();
    appendInput();
    //activateClick();
}

// Credit to https://gist.github.com/EdCharbeneau/9552248 
// and many a JavaScript forum which provides a function to test for lots of spaces and enters, 
// but which is inevitably all empty space.
function isNullOrWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str));
}

// Outputs, if string is non empty (which we hope it is!), the input box
// Else an error that the box is empty.
// This will get more complex as we add more textboxes to parse...

function appendInput() {
    var x0 = makeSubTitle();
    var x = makeRibbon();
    var page = document.createElement("div");
    page.className = "pageblock";
    page.appendChild(x0);
    page.appendChild(x);
    activateClick();
    document.getElementById("input_console").appendChild(page);
    activateClick();
}

function printToBox() {
    clearBox();
    titles = document.getElementsByClassName("TitleInput");
    outputs = document.getElementsByClassName("content-area");
    // console.log(titles.length);
    // console.log(outputs.length);
    // console.log( (titles.length === outputs.length+1) );
    let N = outputs.length;
    // console.log("Let the printing commence...");
    // console.log(titles[0].value);
    var tempStr = "";
    tempStr += "!Book [";
    tempStr += titles[0].value + "]" + '\n';
    for (let i = 0; i < N; i++) {
        temp_title = titles[i+1].value;
        temp_body = outputs[i].innerHTML;
        tempStr += "!Page ";
        if ( !isNullOrWhiteSpace(temp_title) ) {
            tempStr+= temp_title + '\n'; 
            console.log(temp_title);
        } else { tempStr += '\n'; console.log("Page " + i + "."); }

        if ( isNullOrWhiteSpace(temp_body) ) {
            tempStr += "Body " + i + " is empty." + '\n';
            console.log("Body " + i + " is empty.");
        } else { tempStr += parseText(temp_body); console.log(temp_body); }
        if ( tempStr.slice(-1) != '\n' ) {
            tempStr += '\n';
        }
        tempStr += "!endPage" + '\n';
    }
    document.getElementById("output_box").innerText = tempStr;
}

function clearDIV(str) {
    document.getElementById(str).innerHTML = "";
}

function clearAllInput() {
    temp = document.getElementsByClassName("content-area");
    for (i in temp) {
        temp[i].innerHTML = "";
    }
}

function clearLastInput() {
    temp = document.getElementsByClassName("content-area");
    temp[temp.length-1].innerHTML = "";
}

function clearBox() {
    clearDIV("output_box");
}

function makeTitle() {
    var x = document.createElement("div");
    x.className = "titlebox";
    var label = document.createElement("label");
    var t = document.createTextNode("Book Title: ");
    label.appendChild(t);
    x.appendChild(label);
    var inbox = document.createElement("input");
    inbox.type = "text";
    inbox.className = "TitleInput";
    inbox.value = "Insert Title Here";
    x.appendChild(inbox);
    document.getElementById("input_console").appendChild(x);
}

function makeSubTitle() {
    var x = document.createElement("div");
    x.className = "titlebox";
    var label = document.createElement("label");
    var t = document.createTextNode("Page Title: ");
    label.appendChild(t);
    x.appendChild(label);
    var inbox = document.createElement("input");
    inbox.type = "text";
    inbox.className = "TitleInput";
    inbox.value = "Insert Title Here";
    x.appendChild(inbox);
    return x;
}

function parseText(str) {
    var newStr = str;
    // replacements will be ordered pairs of [what to replace, replacement]
    // then we just loop through the array
    var replacements = [ 
        ['<i>','*'], 
        ["</i>",'*'], 
        ["<b>","**"], 
        ["</b>","**"], 
        ["<h1>",'# '],
        ["</h1>",'\n'],
        ["<h2>",'## '],
        ["</h2>",'\n'],
        ["<h3>","### "],
        ["</h3>",'\n'],
        ["<br>", "!brk\n"],
        ["<ul>", "!list\n"],
        ["</ul>", "!endList \n"],
        ["<ol>", "!oList \n"],
        ["</ol>","!endList \n"],
        ["<li>", "!item "],
        ["</li>", '\n'],
        ["</div><div>", "!brk\n"],
        ["<div>", ""],
        ["</div>", "!brk\n"],
        ["!brk!brk","!brk"],
        ['\n\n', '\n'],
        ["&nbsp;", " "]
    ];
    for (let i = 0; i < replacements.length; i++) {
        while ( newStr.search(replacements[i][0]) != -1 ) {
            temp = replacements[i][0];
            newStr = newStr.replace(replacements[i][0], replacements[i][1]);
        }
    }
    return newStr;
}

function makeRibbon() {
    let clnm = "btn icon smaller";
    var ttl1, ttl2, ttl3, ttl4;
    // box 1 actions, icons, titles
    var dataActn1 = ["bold","italic","underline","strikeThrough"];
    var icon1 = ["https://image.flaticon.com/icons/svg/25/25432.svg", "https://image.flaticon.com/icons/svg/25/25392.svg", 
    "https://image.flaticon.com/icons/svg/25/25433.svg", "https://image.flaticon.com/icons/svg/25/25626.svg"];
    var dataActn2 = ["justifyLeft","justifyCenter","justifyRight","formatBlock"];
    ttl1 = ["Bold","Italic","Underline","Strikethrough"];
    // box 2 with submenu
    var submenuIcon = "https://image.flaticon.com/icons/svg/25/25351.svg";
    var icon2 = ["https://image.flaticon.com/icons/svg/25/25351.svg", "https://image.flaticon.com/icons/svg/25/25440.svg", 
    "https://image.flaticon.com/icons/svg/25/25288.svg", "https://image.flaticon.com/icons/svg/25/25181.svg"];
    ttl2 = ["Left Aligned", "Centered", "Right Aligned","Justified"];
    // box 3
    var dataActn3 = ["insertOrderedList", "insertUnorderedList", "outdent", "indent"];
    var icon3 = ["https://image.flaticon.com/icons/svg/25/25242.svg", "https://image.flaticon.com/icons/svg/25/25648.svg",
    "https://image.flaticon.com/icons/svg/25/25410.svg", "https://image.flaticon.com/icons/svg/25/25233.svg"];
    ttl3 = ["Ordered List","Unordered List", "Outdent", "Indent"];
    // horiz rule
    var HRule = "insertHorizontalRule";
    var ttlRule = "Insert Horizontal Rule";
    var imgRule = "https://image.flaticon.com/icons/svg/25/25232.svg";
    // box 4
    var dataActn4 = ["removeFormat"];
    ttl4 = ["Remove Formatting"];
    var img4 = ["https://image.flaticon.com/icons/svg/25/25454.svg"];

    var headingIcon = "https://image.flaticon.com/icons/svg/25/25351.svg";
    var icon5 = ["https://image.flaticon.com/icons/svg/25/25351.svg", "https://image.flaticon.com/icons/svg/25/25440.svg", 
    "https://image.flaticon.com/icons/svg/25/25288.svg"];
    var ttl5 = ["Heading 1", "Heading 2", "Heading 3"];
    var dataActn5 = ["h1", "h2", "h3"]

    // now begin making it
    var EDTOR, TLBAR, LINE1, LINE2;
    EDTOR = document.createElement("div");
    EDTOR.className = "editor";
    // EDTOR.id = "editor" + editCount;
    TLBAR = document.createElement("div");
    TLBAR.className = "toolbar";
    // TLBAR.id = "toolbar" + editCount;
    // first line, containing 3 boxes
    LINE1 = document.createElement("div");
    LINE1.className = "line";

    // first box
    var div1 = document.createElement("div");
    div1.className = "box";
    for (i in dataActn1) {
        var temp = document.createElement("span");
        temp.className = "btn icon smaller";
        temp.dataset.action = dataActn1[i];
        temp.title = ttl1[i];
        var imgt = document.createElement("IMG");
        imgt.src = icon1[i];
        temp.appendChild(imgt);
        div1.appendChild(temp);
    }
    LINE1.appendChild(div1);

    // second box
    var div2 = document.createElement("div");
    div2.className = "box";
    var subMenuSpan = document.createElement("span");
    subMenuSpan.className = "btn icon has-submenu";
    var SMIMG = document.createElement("img");
    SMIMG.src = submenuIcon;
    subMenuSpan.appendChild(SMIMG);

    var subMenuClass = document.createElement("div");
    subMenuClass.className = "submenu";
    for (i in dataActn2) {
        var temp = document.createElement("span");
        temp.className = "btn icon";
        temp.dataset.action = dataActn2[i];
        temp.title = ttl2[i];
        var imgt = document.createElement("IMG");
        imgt.src = icon2[i];
        temp.appendChild(imgt);
        subMenuClass.appendChild(temp);
    }

    subMenuSpan.appendChild(subMenuClass);
    div2.appendChild(subMenuSpan);

    for (i in dataActn3) {
        var temp = document.createElement("span");
        temp.className = "btn icon";
        temp.dataset.action = dataActn3[i];
        temp.title = ttl3[i];
        var imgt = document.createElement("IMG");
        imgt.src = icon3[i];
        temp.appendChild(imgt);
        div2.appendChild(temp);
    }
    LINE1.appendChild(div2);

    // third box
    var div3 = document.createElement("div");
    div3.className = "box";
    var tempHoriz = document.createElement("span");
    tempHoriz.className = "btn icon";
    tempHoriz.dataset.action = HRule;
    tempHoriz.title = ttlRule;
    var imgHRule = document.createElement("IMG");
    imgHRule.src = imgRule;
    tempHoriz.appendChild(imgHRule);
    div3.appendChild(tempHoriz);
    LINE1.appendChild(div3);

    TLBAR.appendChild(LINE1);

    // line 2
    LINE2 = document.createElement("div");
    LINE2.className = "line";

    var div4 = document.createElement("div");
    div4.className = "box";

    for (i in dataActn4) {
        var temp = document.createElement("span");
        temp.className = "btn icon";
        temp.dataset.action = dataActn4[i];
        temp.title = ttl4[i];
        var imgt = document.createElement("IMG");
        imgt.src = img4[i];
        temp.appendChild(imgt);
        div4.appendChild(temp);
    }

    var subMenuSpan2 = document.createElement("span");
    subMenuSpan2.className = "btn icon has-submenu";
    var SMIMG2 = document.createElement("img");
    SMIMG2.src = submenuIcon;
    subMenuSpan2.appendChild(SMIMG2);

    var subMenuClass2 = document.createElement("div");
    subMenuClass2.className = "submenu";
    for (i in dataActn5) {
        var temp = document.createElement("span");
        temp.className = "btn icon";
        temp.dataset.action = dataActn5[i];
        temp.title = ttl5[i];
        var imgt = document.createElement("IMG");
        imgt.src = icon5[i];
        temp.appendChild(imgt);
        subMenuClass2.appendChild(temp);
    }
    subMenuSpan2.appendChild(subMenuClass2);
    div4.appendChild(subMenuSpan2);

    LINE2.appendChild(div4);
    TLBAR.appendChild(LINE2);


    EDTOR.appendChild(TLBAR);

    var divEditor = document.createElement("div");
    divEditor.className = "content-area";
    // divEditor.id = "content-area" + editCount;
    divEditor.contentEditable = true;

    EDTOR.appendChild(divEditor);

    // some housekeeping in global variables
    editorArray.push(divEditor.id);

    editorCount += 1;

    // return this
    return EDTOR;
}

// following code by https://webdeasy.de/en/program-your-own-wysiwyg-editor-in-10-minutes/

/*
const editor = document.getElementsByClassName('editor');

for (i in editor) {
    console.log(i);
    console.log("editor size is: " + editor.length);
}

for (i in editor) {
    var toolbar = editor[i].getElementsByClassName('toolbar')[i];
    var buttons = toolbar.querySelectorAll('.btn:not(.has-submenu)');

    for(j in buttons) {
        let button = buttons[j];
        button.addEventListener('click', function(e) {
        let action = this.dataset.action;
        
        // custom action
        if(action === 'code') {

            const contentArea = editor[i].getElementsByClassName('content-area');
            if (this.classList.contains('active')) {
                this.classList.remove('active');     
            }
            return false;
        }

        document.execCommand(action, false);
    });
}
}
*/

function activateClick() {
    var editNum = document.getElementsByClassName("editor");
    console.log("how many...editors: " + editNum.length);

    $('.btn').click(function(e) {

        var command = $(this).data('action');
       
        if (command == 'h1' || command == 'h2' || command == 'h3' || command == 'p') {
            document.execCommand('formatBlock', false, command);
        }
        if (command == 'createlink' || command == 'insertimage') {
            url = prompt('Enter the link here: ','http:\/\/');
            document.execCommand($(this).data('action'), false, url);
        }
        else document.execCommand($(this).data('action'), false, null);
   
});
}