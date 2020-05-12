var inputs = ["input_box0"];
var inCount = 0;

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
    inCount+= 1;
    var x = document.createElement("div");
    x.id = "input_box" + inCount;
    x.className = "input_box";
    x.contentEditable = true;
    inputs.push(x.id);
    x.innerHTML = "Try me.";
    document.getElementById("input_console").appendChild(x);
}

function printToBox() {
    clearBox();
    var teller = 0;
    var x = document.createElement("p");
    for (i in inputs) {
        var x0 = document.createElement("p");
        var Thing = document.getElementById(inputs[i]).innerText;
        var Thing2 = document.createTextNode(document.getElementById(inputs[i]).innerHTML);
        x0.appendChild(Thing2);
        if (!isNullOrWhiteSpace(Thing)) {
            x.appendChild(x0);
            teller += 1;
        }
    }
    console.log(x);
    var Ex = document.createElement("p");
    Ex.appendChild(document.createTextNode("Error, input box is empty."));
    // if every box was white space teller is still 0 so we output our error message.
    if (teller === 0) {
        document.getElementById("output_box").appendChild(Ex);
    }
    else {
        document.getElementById("output_box").appendChild(x);
    }
}

function clearDIV(str) {
    document.getElementById(str).innerHTML = "";
}

function clearAllInput() {
    for (i in inputs) {
        clearDIV(inputs[i]);
    }
}

function clearLastInput() {
    clearDIV(inputs[inCount]);
}

function clearBox() {
    clearDIV("output_box");
}

function parseText() {

}