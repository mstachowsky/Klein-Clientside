/*
	Klein Core, V0.9
	
	Changelog: 
	
		V0.3: completely removed Mithril
		V0.4: Added support for nested lists
		v0.5: Added next/back buttons
			- 0.5.1 fix for header not showing special characters properly
			- 0.5.2 Added highlight to the active button
		v0.6: Changed name (FINALLY) to Klein Core
			o Added URL book loading
			
		Skipped ahead due to rapid development by K. Jiang:
		
		v0.9: Major changes.  Implemented randomized variables and multiple choice

		v1: Implemented tables, and the Assignment directive
*/

/*
	each page gets it own button.  However, the buttons are stored in a
	separate part of the view, so I chose to put them into their own 
	variable here
*/
var pageButtons = {
	buttons: []
}

/*
	
*/
var answers = [];

// arrays to hold random variables and their randomized values
var variables = [];
var randVarMin = [];
var randVarMax = [];
var variableVal = [];
var decimals = [];
var equation = [];
var inputBookHDID;
var feedPage;
var scoreCount = [];
var feedBackPageShow = true;
var feedShown  = [];
var showFeedButton = true;
var inputFeedShown = [];
var mCBlank = true;
var isFeedback = false;
var scoreID = 0;
var showScore = []

// var feedPageNum = 0;

/*
	There must be a single "How did I do" button, and that must be global
	to Clien.  This way, once you click it, the entire page is searched.
	It cannot be question-specific, otherwise it will not properly search
	every answer and change the DOM.
*/
function howDidIDo() {
	// console.log(answers)
	for (var i = 0; i < answers.length; i++) {
		// console.log(curPage)
		var yesBx = document.getElementById("AnswerCheck" + answers[i].ID);
		if (yesBx) {
			if (answers[i].pageNum == curPage) {
				if (answers[i].checkAnswer()) {
					yesBx.innerHTML = " \u2705";
				}
				else {
					yesBx.innerHTML = " \u274C";
				}
			}
			else {
				yesBx.innerHTML = "";
			}
		}
	}
	
	// var d = document.getElementById("AnswerCheck" + answers[2].ID);
	// d.innerHTML = " \u2705"
	// console.log(d)
	// console.log(answers)
	//Checks if the book is an assignment or not to determine if it should add the feed back button
	if(inputBookHDID.assignment == "true" && isFeedback){

		//This only happens once otherwise with would create multiple buttons everytime hdid was clicked
		if(feedBackPageShow)
		{
			//Increases the page count, creates a feedback button (does not show it yet), and creates a new page div to append oll the feedback to
			totPages++;
			pageButtons.buttons.push(
				{
					type: 'button[id="' + totPages -1 + '"]',
					content: "Feedback",
					id: totPages -1,
					opts: { onclick: function () { changePage(this) } }
				}
			)
			var feedbackPage = document.createElement("DIV")
			feedbackPage.setAttribute("class", "PAGE");
			feedbackPage.setAttribute("id", "pg" + (totPages - 1));
			var contentRoot = document.getElementById('contentPlace')
			contentRoot.appendChild(feedbackPage);
			var pageStack =[];
			feedBackPageShow = false;
			//This array is used to determine if the feedback of a page has already been appended or not so it does not append feed back for a question multiple times
			for(var i = 0; i < answers.length; i++){
				feedShown[i] = true;
				inputFeedShown[i] = true;
			}

		}
		else{
			//Creates a variable that is the feedback page div to work with and append feedback to
			var feedbackPage = document.getElementById("pg" + (totPages - 1));
		}
		
		for(var i = 0; i < feedPage.length; i++){

			if(feedShown[0]){
				//Creates another div which is the feedback for each individual question to append the feedback too
				//This is done so the feed back for unanswered questions can be hidden easily
				var feedbackPageDiv = document.createElement("DIV");
				feedbackPageDiv.setAttribute("class", "FEEDPAGE");
				feedbackPageDiv.setAttribute("id", "fpg" + (scoreID));
				feedbackPage.appendChild(feedbackPageDiv);
			}

			//Checks if the feedback for page/question i has already been appended to prevent multiple copies of the same feedback
			if(feedShown[i]){
				//tableConetentCreator just renders JSON and appends it to feedbackPageDiv for each page/question i
				for(var j = 0; j < feedPage[i].length; j++){
					//Checks if there is any JSON to render
					if(feedPage[i][j]){
						feedbackPageDiv = tableContentCreator(feedPage[i][j], feedbackPageDiv, pageStack, i, j)
						// feedPage[i][j] = null;
						feedShown[i] = false;
					}

					if(feedPage[i][j] && !feedPage[i][j+1]){
						var scoreDis = scoreCount.shift();
						//Renders the score for question/page i
						if(showScore[scoreID]){
							feedbackPageDiv = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPageDiv, pageStack, i, 0)
						}
						feedbackPageDiv = tableContentCreator({"type":"HTML","tag":"span","options":{"id":"IDC" + scoreID},"content":"Score: " + scoreDis + "/" + scoreDis}, feedbackPageDiv, pageStack, i, 0)
						feedbackPageDiv = tableContentCreator({"type":"HTML","tag":"span","options":{"id":"IDI" + scoreID},"content":"Score: " + "0/" + scoreDis}, feedbackPageDiv, pageStack, i, 0)
						// feedbackPageDiv = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPageDiv, pageStack, i, 0)
						if(showScore[scoreID]){
							feedbackPageDiv = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPageDiv, pageStack, i, 0)
						}
						scoreID++
						//This is done so the feed back for unanswered questions can be hidden easily
						var feedbackPageDiv = document.createElement("DIV");
						feedbackPageDiv.setAttribute("class", "FEEDPAGE");
						feedbackPageDiv.setAttribute("id", "fpg" + (scoreID));
						feedbackPage.appendChild(feedbackPageDiv);
						//tableConetentCreator just renders JSON and appends it to feedbackPageDiv for each page/question i
					}
				}
				// feedPageNum++;
			}
			// console.log(answers[i])
		}	

		for(var i = 0; i < answers.length; i++){
			//Checks if any of the multiple choice options have been checked
			if(answers[i].type == "MC"){
				// console.log(document.getElementById(answers[i].dataString + answers[i].id))
				var radioChecked = false;
				var mCCount = 1;
				while(document.getElementById(mCCount + answers[i].id) && !radioChecked){
					if(document.getElementById(mCCount + answers[i].id).checked){
						mCBlank = false;
						radioChecked = true;
					}
					mCCount++;
				}

			}
			
			var feedbackPageDiv = document.getElementById("fpg" + (i));
			//Shows feedback only when the input isnt blank
			if(((answers[i].type == "MC" && !radioChecked) || (answers[i].type == "" && answers[i].AnsString == "")) && inputFeedShown[i]){
				feedbackPageDiv.style.display = 'none';
			}else if(inputFeedShown[i]){
				feedbackPageDiv.style.display = 'block';
				inputFeedShown[i] = false;
			}

			// console.log(feedbackPageDiv)
			// console.log(inputFeedShown)
		}
		console.log(showScore)
		for(var i = 0; i < answers.length; i++){
			if(!showScore[i]){
				var cAns = document.getElementById("IDC" + (i));
				cAns.style.display = 'none';
				var iAns = document.getElementById("IDI" + (i));
				iAns.style.display = 'none';
			}else if(answers[i].checkAnswer()){
				var cAns = document.getElementById("IDC" + (i));
				cAns.style.display = 'block';
				var iAns = document.getElementById("IDI" + (i));
				iAns.style.display = 'none';
			}else{
				var cAns = document.getElementById("IDC" + (i));
				cAns.style.display = 'none';
				var iAns = document.getElementById("IDI" + (i));
				iAns.style.display = 'block';
			}
		}

		//Shows feedback button only after an input has been made
		if(showFeedButton){
			for(var i = 0; i < answers.length; i++){
				if(((answers[i].type == "" && answers[i].AnsString != "") || (answers[i].type == "MC" && !mCBlank)) && showFeedButton && showScore[i]){
					showFeedButton = false;
					var selectRoot = document.getElementById('selectRow')
					selectRoot.appendChild(makeNewPageButton(pageButtons.buttons[pageButtons.buttons.length-1]));
				}
			}
		}

		//This shows the same page that the user was on when ever hdid was clicked
		//For some reason comenting out this code makes the page blank
		curPage++;
		curPage--;
		changePage({ id: curPage });

	}

	//need to make it so the feedback button does not show up unless the user has inputed in one inputput field DONE
	//need to make it so if the user attempted a question then makes the input blank by deleteing the answer the feedback does not disapear DONE
	//need to figure out how to check of m/c is blank or not DONE
	//need to figure out how to make sure that the answers being delt with are for the current page being delt with (i) -> pageNum
	//need to figure out how to add sub questions like a,b,c -> this is conected to pthe previous point
	//also connected but need to figure out how to link feedback to specified inputs
	
}

function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}

/*
	The onclick for the page select buttons
*/
var pageArray = [];
var curPage = 0;
var totPages = 0;

function changePage(elem) {
	//force a deep copy
	//data.currentPage = JSON.parse(JSON.stringify(data.pages[elem.id]))
	pageArray = document.getElementsByClassName("PAGE");
	for (var i = 0; i < pageArray.length; i++) {
		var id = pageArray[i].getAttribute("id").replace("pg", "");
		if (Number(id) === elem.id) {
			pageArray[i].style.display = 'block';
			curPage = id; //This is for the next/back buttons
		}
		else
			pageArray[i].style.display = "none"
	}

	//Now scroll to the top
	document.body.scrollTop = 0; //Safari compatibility
	document.documentElement.scrollTop = 0; //Everything else

	//finally highlight the button whose page it is
	var btnArray = document.getElementById('selectRow').getElementsByTagName("BUTTON");
	for (var i = 0; i < btnArray.length; i++) {
		//This is slightly sketchy, as it leaves an empty "class" attribute but it works
		btnArray[i].classList.remove("activeButton");
		if (btnArray[i].getAttribute("id") === "pageBTN" + elem.id) {
			btnArray[i].classList.remove("inactiveButton");
			btnArray[i].classList.add("activeButton");
		}
		else {
			btnArray[i].classList.add("inactiveButton");
		}
	}
}

function nextPage() {
	if (curPage < totPages - 1) {
		curPage++;
		changePage({ id: curPage });
	}
}
function backPage() {
	if (curPage > 0) {
		curPage--;
		changePage({ id: curPage });
	}
}

/*
	makes and returns a new button
*/
function makeNewPageButton(btn) {
	var newBtn = document.createElement("BUTTON");
	newBtn.onclick = function () { changePage(btn) };
	newBtn.setAttribute("id", "pageBTN" + btn.id);
	newBtn.innerHTML = btn.content;
	return newBtn;
}

/*
	This mounts the whole thing.  It gets called exactly once, after
	all of the JSON is parsed.  It sets up "how did I do", as well as
	displays all pages and buttons
*/
function makeNewPage() {
	var checkRoot = document.getElementById('HDID');
	var contentRoot = document.getElementById('contentPlace');
	var selectRoot = document.getElementById('selectRow')

	//first add how did I do button if there is any answerables
	if (answers.length > 0) {
		var hdidBtn = document.createElement("BUTTON");
		hdidBtn.onclick = howDidIDo;
		hdidBtn.setAttribute("id", "HDID");
		hdidBtn.innerHTML = "How did I do?";
		checkRoot.appendChild(hdidBtn);
	}

	//now mount the buttons
	for (var i = 0; i < pageButtons.buttons.length; i++) {
		selectRoot.appendChild(makeNewPageButton(pageButtons.buttons[i]));
	}

	//now we need to add the next/back buttons
	var nextBtn = document.createElement("BUTTON");
	nextBtn.onclick = nextPage;
	nextBtn.setAttribute("id", "NEXT");
	nextBtn.innerHTML = "Next >>";
	selectRoot.appendChild(nextBtn);

	var backBtn = document.createElement("BUTTON");
	backBtn.onclick = backPage;
	backBtn.setAttribute("id", "BACK");
	backBtn.innerHTML = "<< Previous";
	selectRoot.appendChild(backBtn);

	//finally make the first page show up
	changePage({ id: 0 });

}

function makeNewHTML(htmlNode) {
	if (htmlNode.options.type === "radio") { // this is to create the right html format for radio buttons
		var newHtml = document.createElement("INPUT");
		var label = document.createElement('label');
		var labelContent = document.createElement('label');
		newHtml.setAttribute("type", "radio");
		labelContent.setAttribute("for", htmlNode.options.id);
		labelContent.innerHTML = htmlNode.content;
	}
	else {
		var newHtml = document.createElement(htmlNode.tag.toUpperCase());
	}


	newHtml.setAttribute('id', htmlNode.options.id);
	if (htmlNode.options.class)
		newHtml.setAttribute("class", htmlNode.options.class);
	if (htmlNode.options.href) //this means it is a link
	{
		newHtml.setAttribute("href", htmlNode.options.href);
		newHtml.setAttribute("target", "_blank"); //new tab
	}

	if (htmlNode.options.name)
		newHtml.setAttribute("name", htmlNode.options.name);
	if (htmlNode.options.value)
		newHtml.setAttribute("value", htmlNode.options.value);


	// if (htmlNode.content == "this is the dollar sign \\&#36") {
	// 	test = document.createElement("SPAN");
	// 	console.log(test)
	// 	test.innerHTML = htmlNode.content;
	// 	console.log("this is the dollar sign \\&#36")
	// }
	newHtml.innerHTML = htmlNode.content;

	// if(htmlNode.tag === "hr"){
	// 	var test = document.createElement(htmlNode.tag.toUpperCase());
	// 	test.setAttribute('id',htmlNode.options.id);
	// 	test.setAttribute("class",htmlNode.options.class)
	// 	test.innerHTML = htmlNode.content;
	// 	console.log(test)
	// }

	if (htmlNode.options.type === "radio") {
		label.appendChild(newHtml);
		label.appendChild(labelContent);
		return label;
	}
	else {
		return newHtml;
	}
}

//makes videos and images
function makeNewMedia(mediaNode, type) {
	var newMedia = document.createElement(type);
	newMedia.setAttribute("width", mediaNode.width);
	if (type === "VIDEO")
		newMedia.setAttribute("controls", "controls");
	newMedia.setAttribute("src", mediaNode.src);
	newMedia.setAttribute("id", mediaNode.id);
	return newMedia;
}

/*
	This function parses the JSON file and creates the book, finally
	calling on a function to mount it.
*/
function parseBookFromJSON(inputBook, resURL = "") {

	//Creates a 2D where the first array is the the number of pages and the second array is the longest number of components in the pages
	//This array is used to store the JSON for the a specified question/page
	//An example would be the feedback for page 1 would be in feedPage[0][0-len]
	feedPage = new Array(inputBook.pages.length);
	var maxC = 0
	for(var i = 0; i < inputBook.pages.length; i++){
		if(inputBook.pages[i].type == "QUESTIONGROUP"){
			for(j = 0; j <  inputBook.pages[i].questions.length; j++){
				if(inputBook.pages[i].questions[j].components.length >= maxC)
					maxC = inputBook.pages[i].questions[j].components.length
			}
		}else{
			if (inputBook.pages[i].components.length >= maxC)
				maxC = inputBook.pages[i].components.length;
		} 
	}

	for(var f = 0; f < feedPage.length; f++){
		feedPage[f] = new Array(maxC)
	}
	// console.log(feedPage);
	// // console.log(inputBook);
	var contentRoot = document.getElementById('contentPlace');
	// console.log(contentRoot);
	totPages = inputBook.pages.length; //used so that we can do next/back - you can't move to the next page beyond the last one

	//If there are random variables, handle them now
	if (inputBook.variable) {
		for (var i = 0; i < inputBook.variable.length; i++) {
			var rand = inputBook.variable[i];
			variables.push(rand.name);
			if (rand.variableValMin && rand.variableValMax) {
				randVarMin.push(rand.variableValMin);
				randVarMax.push(rand.variableValMax);
				decimals.push(rand.decimals);
				equation.push("");
			}
			else {
				randVarMin.push(0);
				randVarMax.push(0);
				decimals.push(0);
				equation.push(rand.equation);
			}


		}
		randomize();
	}
	for (var i = 0; i < inputBook.pages.length; i++) {

		//push a new button for the new page.  This gets rendered in makeNewPage
		pageButtons.buttons.push(
			{
				type: 'button[id="' + i + '"]',
				content: inputBook.pages[i].name,
				id: i,
				opts: { onclick: function () { changePage(this) } }
			}
		)
		var newPage = document.createElement("DIV");
		// console.log(newPage);
		var pageStack = [];
		newPage.setAttribute("class", "PAGE");
		newPage.setAttribute("id", "pg" + i);
		contentRoot.appendChild(newPage);
		//add content to the page

		//If a question group is used then the next forloop should go as long as the chosen question in the question group, otherwise it should go for as long as the current question
		if(inputBook.pages[i].type == "QUESTIONGROUP"){
			var ran = Math.floor(Math.random() * (inputBook.pages[i].questions.length))
			var forLen = inputBook.pages[i].questions[ran].components.length
		}else{
			var forLen = inputBook.pages[i].components.length
		}

		for (var j = 0; j < forLen; j++) {
			//If the current page is one in a questiongroup then ot needs to be taken into account
			if(inputBook.pages[i].type == "QUESTIONGROUP"){
				var cmp = inputBook.pages[i].questions[ran].components[j];
			}
			else{
				var cmp = inputBook.pages[i].components[j];
			}

			if (cmp.content) //this replaces all instances of the random variables in the html with their randomized values
			{
				cmp.content = renderEqn(cmp.content);
			}

			if (cmp.type === "HTML") {
				newPage.appendChild(makeNewHTML(cmp));
			}
			else if (cmp.type == "CHECKPOINT") {
				var checkDiv = { tag: "div", options: { id: "check" + j + "Page" + i, class: "checkpoint" }, content: "" };
				var curPage = makeNewHTML(checkDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "ENDCHECK") {
				cmp.options = { class: "endcheckpoint", id: " " }
				cmp.tag = "h2";
				cmp.content = "   ";
				newPage.appendChild(makeNewHTML(cmp));

				newPage = pageStack.pop();//JSON.parse(JSON.stringify(pageStack.pop()));
			}
			else if (cmp.type == "BLOCKCODE") {
				var codeDiv = { tag: "div", options: { id: "blockCode" + j + "Page" + i, class: "blockCode" }, content: "" };
				var curPage = makeNewHTML(codeDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "ENDBLOCKCODE") {
				cmp.options = { class: "endBlockCode", id: " " };
				cmp.tag = "p";
				cmp.content = "   ";
				newPage.appendChild(makeNewHTML(cmp));

				newPage = pageStack.pop();
			}
			else if (cmp.type == "UL") {
				var listDiv = { tag: "ul", options: { id: "list" + j + "Page" + i }, content: "" };
				var curPage = makeNewHTML(listDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "OL") {
				var listDiv = { tag: "ol", options: { id: "list" + j + "Page" + i }, content: "" };
				var curPage = makeNewHTML(listDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "ENDLIST") {
				newPage = pageStack.pop();//JSON.parse(JSON.stringify(pageStack.pop()));
			}
			else if (cmp.type == "LINK") {
				var linkDiv = { tag: "a", options: { id: cmp.id, href: cmp.addr, class: "link" }, content: cmp.text };
				newPage.appendChild(makeNewHTML(linkDiv));
			}
			else if (cmp.type === "answerBox") {
				cmp.dataString = renderVariable(cmp.dataString);
				var newAns = new answerBox(cmp.dataString, cmp.id, cmp.pageNum);
				answers.push(newAns);
				newAns.addContent(newPage);
			}
			else if (cmp.type === "video") {
				cmp.src = resURL + cmp.src;
				newPage.appendChild(makeNewMedia(cmp, "VIDEO"));
			}
			else if (cmp.type === "img") {
				cmp.src = resURL + cmp.src;
				newPage.appendChild(makeNewMedia(cmp, "IMG"));
			}
			else if (cmp.type === "multipleChoice") {
				var newAns = new multipleChoice(cmp.dataString, cmp.id, cmp.pageNum);
				answers.push(newAns);
				newAns.addContent(newPage);
				newPage.appendChild(makeNewHTML(cmp));
				if (cmp.choices) {
					for (var n = 0; n < cmp.choices.length; n++) {
						var mc = cmp.choices[n];
						mc.content = renderEqn(mc.content);
						newPage.appendChild(makeNewHTML(mc));

					}

				}
				//cmp.id = name of radio, dataString = correct selection 

			}
			//Creates a horizontal line
			else if (cmp.type === "HORIZLINE") {
				var hLineDiv = { tag: "hr", options: { id: "horizLine" + j + "Page" + i }, content: "" };
				var curPage = makeNewHTML(hLineDiv);
				newPage.appendChild(curPage);
				// pageStack.push(newPage);
				// newPage = curPage;
			}
			else if (cmp.type === "TABLE") {
				//Creates a general table tag to then append the following content in and style in css
				var tableDiv = { tag: "table", options: { id: "table" + j + "Page" + i }, content: "" };
				var curPage = makeNewHTML(tableDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;

				//Creates a table row tag to then append the following content in
				var tableDiv = { tag: "tr", options: { id: "tableRow" + j + "Page" + i }, content: "" };
				var curPage = makeNewHTML(tableDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;

				//The first table row tag is always the header so for as many headers there are each header is encosed in a table header tag then appended to the table row tag that will append the headers
				for (var t = 0; t < cmp.tableContent.header.length; t++) {
					//Created the table header tag, then renders the JSON that needs to be enclosed in that tag, then closes the tag by poping out of the stack
					//This same logic is used when doing the other rows
					var tableDiv = { tag: "th", options: { id: "tableHead" + j + "Page" + i, class: cmp.tableContent.header[t].class }, content: "" };
					var curPage = makeNewHTML(tableDiv);
					newPage.appendChild(curPage);
					pageStack.push(newPage);
					newPage = curPage;

					for (var h = 0; h < cmp.tableContent.header[t].headerContent.length; h++) {
						newPage = tableContentCreator(cmp.tableContent.header[t].headerContent[h], newPage, pageStack, i, j);
					}

					// newPage = tableContentCreator(cmp.tableContent.header[t].headerContent, newPage, pageStack, i, j);

					newPage = pageStack.pop();
				}

				newPage = pageStack.pop();
				//This does the same thing it did for the header but inside a bigger for loop to go through all the columns
				for (var c = 0; c < cmp.tableContent.content[0].column.length; c++) {
					var tableDiv = { tag: "tr", options: { id: "tableRow" + j + "Page" + i }, content: "" };
					var curPage = makeNewHTML(tableDiv);
					newPage.appendChild(curPage);
					pageStack.push(newPage);
					newPage = curPage;

					for (var t = 0; t < cmp.tableContent.content.length; t++) {
						var tableDiv = { tag: "td", options: { id: "tableData" + j + "Page" + i, class: cmp.tableContent.content[t].class }, content: "" };
						var curPage = makeNewHTML(tableDiv);
						newPage.appendChild(curPage);
						pageStack.push(newPage);
						newPage = curPage;

						for (var cc = 0; cc < cmp.tableContent.content[t].column[c].length; cc++) {
							newPage = tableContentCreator(cmp.tableContent.content[t].column[c][cc], newPage, pageStack, i, j);
						}
						// newPage = tableContentCreator(cmp.tableContent.content[t].column[c], newPage, pageStack, i, j);

						newPage = pageStack.pop();
					}

					newPage = pageStack.pop();
				}
			}
			else if (cmp.type === "ENDTABLE") {
				newPage = pageStack.pop();
			}
			else if (cmp.type == "QTEXT") {
				var questionDiv = { tag: "div", options: { id: "qText" + j + "Page" + i, class: "qText" }, content: "" };
				var curPage = makeNewHTML(questionDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "ENDQTEXT") {
				newPage = pageStack.pop();
			}
			else if (cmp.type == "QINPUT") {
				var questionDiv = { tag: "div", options: { id: "qInput" + j + "Page" + i, class: "qInput" }, content: "" };
				var curPage = makeNewHTML(questionDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;
			}
			else if (cmp.type == "ENDQINPUT") {
				newPage = pageStack.pop();
			}
			else if (cmp.type == "FEEDBACK") {
				// var feedDiv = { tag: "div", options: { id: "qInput" + j + "Page" + i, class: "qInput" }, content: "" };
				//Goes through the next lines until the cmp type is ENDFEEDBACK and puts it into the feedPage array at the position corrisponding to the page/question the feedback is in, and the position the components were in, in the component array
				isFeedback = true;
				feedPage[i][j] = {"type":"HTML","tag":"br","options":{},"content":""};
				j++;
				if(inputBook.pages[i].type == "QUESTIONGROUP"){
					cmp = inputBook.pages[i].questions[ran].components[j];
				}
				else{
					cmp = inputBook.pages[i].components[j];
				}

				showScore.push(cmp.type != "ENDFEEDBACK")
				while(cmp.type != "ENDFEEDBACK"){
					feedPage[i][j] = cmp;
					j++;
					if(inputBook.pages[i].type == "QUESTIONGROUP"){
						cmp = inputBook.pages[i].questions[ran].components[j];
					}
					else{
						cmp = inputBook.pages[i].components[j];
					}
				}
			}
			else if(cmp.type == "SCORE"){
				scoreCount.push(cmp.score);
			}

		}
	}

	// if(inputBook.assignment == "true"){
	// 	totPages++;
	// 	pageButtons.buttons.push(
	// 		{
	// 			type: 'button[id="' + totPages -1 + '"]',
	// 			content: "Feedback",
	// 			id: totPages -1,
	// 			opts: { onclick: function () { changePage(this) } }
	// 		}
	// 	)
	// 	var feedbackPage = document.createElement("DIV")
	// 	feedbackPage.setAttribute("class", "PAGE");
	// 	feedbackPage.setAttribute("id", "pg" + (totPages - 1));
	// 	contentRoot.appendChild(feedbackPage);
	// 	for(var i = 0; i < feedPage.length; i++){
	// 		// feedbackPage = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPage, pageStack, i, 0)
	// 		// feedbackPage = tableContentCreator({"type":"HTML","tag":"span","options":{"id":"ID" + i},"content":"Score: " + inputBook.pages[i].score}, feedbackPage, pageStack, i, 0)
	// 		feedbackPage = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPage, pageStack, i, 0)
	// 		for(var j = 0; j < feedPage[i].length; j++){
	// 			if(feedPage[i][j]){
	// 				feedbackPage = tableContentCreator(feedPage[i][j], feedbackPage, pageStack, i, j)
	// 				// console.log(feedPage[i][j])
	// 			}
	// 		}

	// 		feedbackPage = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPage, pageStack, i, 0)
	// 		feedbackPage = tableContentCreator({"type":"HTML","tag":"span","options":{"id":"ID" + i},"content":"Score: " + inputBook.pages[i].score}, feedbackPage, pageStack, i, 0)
	// 		feedbackPage = tableContentCreator({"type":"HTML","tag":"br","options":{},"content":""}, feedbackPage, pageStack, i, 0)
	// 	}


	// }
	inputBookHDID = inputBook;
	//mount the book's title, which should never change throughout an assignment
	var headerRoot = document.getElementById("header");
	var headDiv = { tag: "span", options: { id: cmp.id }, content: inputBook.bookName };
	headerRoot.appendChild(makeNewHTML(headDiv));

	//finally, create the first page
	makeNewPage();
}

//This function is used to append JSON to a div given into the function as a parameter
function tableContentCreator(cmp, newPage, pageStack, i, j) {
	if (cmp.content) //this replaces all instances of the random variables in the html with their randomized values
	{
		cmp.content = renderEqn(cmp.content);
	}

	if (cmp.type === "HTML") {
		newPage.appendChild(makeNewHTML(cmp));
	}
	else if (cmp.type == "CHECKPOINT") {
		var checkDiv = { tag: "div", options: { id: "check" + j + "Page" + i, class: "checkpoint" }, content: "" };
		var curPage = makeNewHTML(checkDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "ENDCHECK") {
		cmp.options = { class: "endcheckpoint", id: " " }
		cmp.tag = "h2";
		cmp.content = "   ";
		newPage.appendChild(makeNewHTML(cmp));

		newPage = pageStack.pop();//JSON.parse(JSON.stringify(pageStack.pop()));
	}
	else if (cmp.type == "BLOCKCODE") {
		var codeDiv = { tag: "div", options: { id: "blockCode" + j + "Page" + i, class: "blockCode" }, content: "" };
		var curPage = makeNewHTML(codeDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "ENDBLOCKCODE") {
		cmp.options = { class: "endBlockCode", id: " " };
		cmp.tag = "p";
		cmp.content = "   ";
		newPage.appendChild(makeNewHTML(cmp));

		newPage = pageStack.pop();
	}
	else if (cmp.type == "UL") {
		var listDiv = { tag: "ul", options: { id: "list" + j + "Page" + i }, content: "" };
		var curPage = makeNewHTML(listDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "OL") {
		var listDiv = { tag: "ol", options: { id: "list" + j + "Page" + i }, content: "" };
		var curPage = makeNewHTML(listDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "ENDLIST") {
		newPage = pageStack.pop();//JSON.parse(JSON.stringify(pageStack.pop()));
	}
	else if (cmp.type == "LINK") {
		var linkDiv = { tag: "a", options: { id: cmp.id, href: cmp.addr, class: "link" }, content: cmp.text };
		newPage.appendChild(makeNewHTML(linkDiv));
	}
	else if (cmp.type === "answerBox") {
		cmp.dataString = renderVariable(cmp.dataString);
		var newAns = new answerBox(cmp.dataString, cmp.id, cmp.pageNum);
		answers.push(newAns);
		newAns.addContent(newPage);
	}
	else if (cmp.type === "video") {
		cmp.src = resURL + cmp.src;
		newPage.appendChild(makeNewMedia(cmp, "VIDEO"));
	}
	else if (cmp.type === "img") {
		cmp.src = resURL + cmp.src;
		newPage.appendChild(makeNewMedia(cmp, "IMG"));
	}
	else if (cmp.type === "multipleChoice") {
		var newAns = new multipleChoice(cmp.dataString, cmp.id, cmp.pageNum);
		answers.push(newAns);
		newAns.addContent(newPage);
		newPage.appendChild(makeNewHTML(cmp));
		if (cmp.choices) {
			for (var n = 0; n < cmp.choices.length; n++) {
				var mc = cmp.choices[n];
				mc.content = renderEqn(mc.content);
				newPage.appendChild(makeNewHTML(mc));

			}

		}
		//cmp.id = name of radio, dataString = correct selection 
	}else if (cmp.type === "HORIZLINE") {
		var hLineDiv = { tag: "hr", options: { id: "horizLine" + j + "Page" + i }, content: "" };
		var curPage = makeNewHTML(hLineDiv);
		newPage.appendChild(curPage);
		// pageStack.push(newPage);
		// newPage = curPage;
	}
	else if (cmp.type === "TABLE") {
		var tableDiv = { tag: "table", options: { id: "table" + j + "Page" + i }, content: "" };
		var curPage = makeNewHTML(tableDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;

		var tableDiv = { tag: "tr", options: { id: "tableRow" + j + "Page" + i }, content: "" };
		var curPage = makeNewHTML(tableDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;

		for (var t = 0; t < cmp.tableContent.header.length; t++) {
			var tableDiv = { tag: "th", options: { id: "tableHead" + j + "Page" + i, class: cmp.tableContent.header[t].class }, content: "" };
			var curPage = makeNewHTML(tableDiv);
			newPage.appendChild(curPage);
			pageStack.push(newPage);
			newPage = curPage;

			for (var h = 0; h < cmp.tableContent.header[t].headerContent.length; h++) {
				newPage = tableContentCreator(cmp.tableContent.header[t].headerContent[h], newPage, pageStack, i, j);
			}

			// newPage = tableContentCreator(cmp.tableContent.header[t].headerContent, newPage, pageStack, i, j);

			newPage = pageStack.pop();
		}

		newPage = pageStack.pop();

		for (var c = 0; c < cmp.tableContent.content[0].column.length; c++) {
			var tableDiv = { tag: "tr", options: { id: "tableRow" + j + "Page" + i }, content: "" };
			var curPage = makeNewHTML(tableDiv);
			newPage.appendChild(curPage);
			pageStack.push(newPage);
			newPage = curPage;

			for (var t = 0; t < cmp.tableContent.content.length; t++) {
				var tableDiv = { tag: "td", options: { id: "tableData" + j + "Page" + i, class: cmp.tableContent.content[t].class }, content: "" };
				var curPage = makeNewHTML(tableDiv);
				newPage.appendChild(curPage);
				pageStack.push(newPage);
				newPage = curPage;

				for (var cc = 0; cc < cmp.tableContent.content[t].column[c].length; cc++) {
					newPage = tableContentCreator(cmp.tableContent.content[t].column[c][cc], newPage, pageStack, i, j);
				}
				// newPage = tableContentCreator(cmp.tableContent.content[t].column[c], newPage, pageStack, i, j);

				newPage = pageStack.pop();
			}

			newPage = pageStack.pop();
		}
	}
	else if (cmp.type === "ENDTABLE") {
		newPage = pageStack.pop();
	}
	else if (cmp.type == "QTEXT") {
		var questionDiv = { tag: "div", options: { id: "qText" + j + "Page" + i, class: "qText" }, content: "" };
		var curPage = makeNewHTML(questionDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "ENDQTEXT") {
		newPage = pageStack.pop();
	}
	else if (cmp.type == "QINPUT") {
		var questionDiv = { tag: "div", options: { id: "qInput" + j + "Page" + i, class: "qInput" }, content: "" };
		var curPage = makeNewHTML(questionDiv);
		newPage.appendChild(curPage);
		pageStack.push(newPage);
		newPage = curPage;
	}
	else if (cmp.type == "ENDQINPUT") {
		newPage = pageStack.pop();
	}

	return newPage;
}

/*;
	What follows is required for MathJax.  Basically, once we change
	a page, MathJax has to re-render the DOM.  It can't do that until the
	DOM is done rendering, and we must explicitly tell it to re-render.
	
	So, we create a MutationObserver (Javascript standard object that looks
	for mutations in a particular element), and then call MathJax's 
	typesetting functions
*/
////////////////////////////////////

function randomize() {
	var min, max, deci, value;
	for (var i = 0; i < variables.length; i++) {
		if (variables[i] && (randVarMax[i] != 0) && (randVarMin[i] != 0)) {
			min = Number(randVarMin[i]);
			max = Number(randVarMax[i]);
			deci = Number(decimals[i]);
			deci = Math.pow(10, deci);
			value = Math.round((Math.random() * (max - min) + min) * deci) / deci;
			if (variableVal[i])
				variableVal[i] = value;
			else
				variableVal.push(value);
		}
		else if (equation[i] != "") {
			var eqn = renderVariable(equation[i]);
			var val = math.evaluate(eqn);
			variableVal.push(val);
		}

	}

}

function renderEqn(node) {
	var index = 0;
	node = renderVariable(node);

	while (node.includes("eqn:{", index)) //loops through each occurance of eqn:{}
	{
		//loops and replaces the first occurance of eqn:{} with the appropriate value until eqn:{} can not be found 
		index = node.indexOf("eqn:{");
		var eqn;
		var setVar = "";
		var index2 = node.indexOf("}", index);
		var index3 = node.indexOf(",", index);

		if (index3 < index2 && index3 != -1) {
			eqn = node.slice(index + 5, index3);
			setVar = node.slice(index3 + 1, index2);
			setVar = setVar.trim();
		}
		else {
			eqn = node.slice(index + 5, index2);

		}
		var value = math.evaluate(eqn);
		var str = node.slice(index, index2 + 1);
		node = node.replace(str, value)
		if (setVar != "") {
			variables.push(setVar);
			randVarMax.push(0);
			randVarMin.push(0);
			decimals.push(0);
			equation.push("");
			variableVal.push(value);
		}
	}
	return node;

}

function renderVariable(node) {
	for (var k = 0; k < variableVal.length; k++) {
		if (variableVal[k] != "") {
			node = node.replace(new RegExp(variables[k], 'g'), variableVal[k]);
		}
	}
	return node;
}

function mutate() {
	//disconnect, or else we will infinitely change/mutate
	observer.disconnect();

	//at first, MathJax may not exist (this is only for the first page load)
	if (MathJax) {
		//re-typeset
		MathJax.typesetPromise();
	}
	//We need to ensure that the data displayed in the answer boxes is not 
	//  stale after the DOM reloads
	for (var i = 0; i < answers.length; i++) {
		if (document.getElementById(answers[i].ID + "_answerBox")) {
			document.getElementById(answers[i].ID + "_answerBox").value = answers[i].AnsString;
		}
	}
	//reconnect so that we can see mutations again
	observer.observe(targetNode, config);
}

//mutation observer for Mathjax
const observer = new MutationObserver(mutate);
// Select the node that will be observed for mutations
const targetNode = document.getElementById("contentPlace");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
observer.observe(targetNode, config);
observer.observe(targetNode, config);

/*
 * @license
 * Licensed under the GNU GPLv3 License (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at

 * https://www.gnu.org/licenses/gpl-3.0.en.html

 * Any libraries written by third parties are provided under a license that is identical to or compatible with the License on this project.

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License
*/
