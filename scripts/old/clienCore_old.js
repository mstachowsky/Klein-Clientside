/*
	Clien viewer, V0.1
*/

/*
	data is a variable that holds all of the pages and the current page to 
	display.  It gets filled during the JSON parse
*/
var data = {
  pages: [],
  currentPage : {},
}

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
var answers=[];

/*
	This pushes a new component onto a given page.  All components require:
	
	type: basically the tag that is used to declare it, like h1
	opts: a Mithril options object
	content: the content itself.  May be blank, may be HTML
	id: the ID for the component, which gets added to the DOM
*/
function addContent (page,contType,contOpts,cont,idIn) {
  page.push({
    type    : contType,
    opts    : contOpts,
    content : cont,
	id : idIn
  })
}

/*
	DataDisplay is a Mithril component that unpacks each page so that we can
	mount it appropriately.
*/
var DataDisplay = {
  view : (vnode) => {
    return vnode.attrs.page.map((elem) => 
      m(elem.type, elem.opts, elem.content)
    )
  } 
}

/*
	ButtonDisplay is a Mithril component that unpacks each button so that we can mount it appropriately
*/
var ButtonDisplay = {
  view : (vnode) => {
    return vnode.attrs.butt.map((elem) => 
      m(elem.type, elem.opts, elem.content)
    )
  } 
}

/*
	This searches for a component with a given ID in the current page.
	It is used for checking answers, where all answer boxes are searched 
	through
*/
function findPageIndex(id)
{
	for(var i = 0; i < data.currentPage.page1.length; i++)
	{
		if(data.currentPage.page1[i].id == id)
			return i;
	}
	return -1;
}

/*
	There must be a single "How did I do" button, and that must be global
	to Clien.  This way, once you click it, the entire page is searched.
	It cannot be question-specific, otherwise it will not properly search
	every answer and change the DOM.
*/
function howDidIDo()
{
	for(var i = 0; i < answers.length; i++)
	{
		var indx = findPageIndex(answers[i].ID);
		if(indx >= 0)
		{
			data.currentPage.page1[indx+1].type="b";
			if(answers[i].checkAnswer())
			{
				data.currentPage.page1[indx+1].content=" \u2705";
			}
			else
			{
				data.currentPage.page1[indx+1].content=" \u274C";
			}
		}
	}
	
	
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

/*
	The onclick for the page select buttons
*/
function changePage(elem){
	//force a deep copy
	console.log("Changing: ",document.readyState);
	console.log(JSON.parse(JSON.stringify(document.getElementById('contentPlace'))));
	console.log(data.currentPage)
	console.log(data.pages[elem.id])
	data.currentPage = JSON.parse(JSON.stringify(data.pages[elem.id]))
}

/*
	This mounts the whole thing.  It gets called exactly once, after
	all of the JSON is parsed.  It sets up "how did I do", as well as
	displays all pages and buttons
*/
function makeNewPage(){
	var checkRoot = document.getElementById('HDID');
	var contentRoot = document.getElementById('contentPlace');
	var selectRoot = document.getElementById('selectRow')
	//addContent('button',{},'Click me');
	m.mount(checkRoot, {
	  view : () => [
		m('button', { onclick: howDidIDo }, 'How did I Do?')
	  ]
	})
	m.mount(contentRoot, {
	  view : () => [
		m(DataDisplay, { page: data.currentPage.page1 })
	  ]
	})
	
	//now mount the buttons
	m.mount(selectRoot, {
	  view : () => [
		m(ButtonDisplay, { butt: pageButtons.buttons })
	  ]
	})
}

/*
	This function parses the JSON file and creates the book, finally
	calling on a function to mount it.
*/
function parseBookFromJSON(inputBook)
{
	for (var i = 0; i < inputBook.pages.length; i++)
	{
		//make a new page
		data.pages.push({page1:[]});
		
		//push a new button
		pageButtons.buttons.push(
		{
			type    : 'button[id="'+i+'"]',
			content : inputBook.pages[i].name,
			id : i,
			opts    : {onclick: function(){changePage(this)}}
		}
		)
		//add content to the page
		for(var j = 0; j < inputBook.pages[i].components.length;j++)
		{
			var curPage = data.pages[data.pages.length-1].page1;
			var cmp = inputBook.pages[i].components[j];
			if(cmp.type==="HTML")
			{
				addContent(curPage,cmp.tag,cmp.options,cmp.content,cmp.id);
			}
			else if(cmp.type == "CHECKPOINT")
			{
				cmp.options = {class:"checkpoint"};
				addContent(curPage,cmp.tag,cmp.options,cmp.content,cmp.id);
			}
			else if(cmp.type == "ENDCHECK")
			{
				cmp.options = {class:"endcheckpoint"}
				addContent(curPage,"h2",cmp.options,"End of Checkpoint","")
			}
			else if(cmp.type==="answerBox")
			{
				var newAns = new answerBox(cmp.dataString,cmp.id);
				answers.push(newAns);
				newAns.addContent(curPage);
			}
			else if(cmp.type==="video")
			{
				var tag = 'video[controls][width="'+cmp.width+'"][height="'+cmp.height+'"]'
				var src = cmp.src;
				addContent(curPage,tag,{src},"",cmp.id);
			}
			else if(cmp.type==="img")
			{
				var tag = 'img[width="'+cmp.width+'"][height="'+cmp.height+'"]'
				var src = cmp.src;
				addContent(curPage,tag,{src},"",cmp.id);
			}
		}
	}
	//set the current page to the beginning of the book
	data.currentPage = data.pages[0];
	
	//mount the book's title, which should never change throughout an assignment
	var headerRoot = document.getElementById("header");
	m.mount(headerRoot,{view:()=>{return inputBook.bookName}});
	
	//finally, create the first page
	makeNewPage();
}

/*
	What follows is required for MathJax.  Basically, once we change
	a page, MathJax has to re-render the DOM.  It can't do that until the
	DOM is done rendering, and we must explicitly tell it to re-render.
	
	So, we create a MutationObserver (Javascript standard object that looks
	for mutations in a particular element), and then call MathJax's 
	typesetting functions
*/
function mutate()
{
	//disconnect, or else we will infinitely change/mutate
	observer.disconnect();
	
	//at first, MathJax may not exist (this is only for the first page load)
	if(MathJax){
		//re-typeset
		MathJax.typesetPromise();
	}
	/*We need to ensure that the data displayed in the answer boxes is not 
	  stale after the DOM reloads
	*/
	for(var i = 0; i < answers.length; i++)
	{
		if(document.getElementById(answers[i].ID + "_answerBox"))
		{
			document.getElementById(answers[i].ID + "_answerBox").value = answers[i].AnsString;
		}
	}
	//reconnect so that we can see mutations again
	observer.observe(targetNode,config);
}


//mutation observer for Mathjax
const observer = new MutationObserver(mutate);
// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
observer.observe(targetNode,config);
observer.observe(targetNode,config);