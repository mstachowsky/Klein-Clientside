//the answerable API



//this is the controller of the answer.
class answer{
	/*
		dataString contains identifying information about this question, like which assignment, any random
		stuff etc.
	*/
	constructor(dataString){
		this.AnsString = "";
		this.dataString=dataString;
		this.isCorrect = false;
		this.yesStr = "";
		//to register the onclick, we need a reference to this, which we can't have unless we 
		//create it, since the button's "this" is not the same as the answerBox's "this", hence, "that".
		var that = this;
		/*
			This part is a bit weird.  The function that gets called every time the input changes refers to an 'ev', 
			which is the vnode that called it (in this case, the input box).  ev.target.value means, in this case, 
			for us to get the value from the calling vnode (which is the text in the box) and call the given function.
			
			A bit weird, but just go with it.
		*/
		this.inBox = {}; //derived classes change this
		this.cls = "";
		//this.ansBox = new answerBox(this);


		//this is to distinguish between MC 
		this.type = "";
		this.id = "";

		//to tell which page the question is on
		this.pageNum = 0;
	}

	setType(type)
	{
		this.type = type;
	}
	setId(id)
	{
		this.id = id;
	}
	
	setAnsString(Ans)
	{
		this.AnsString = Ans;
	}

	//currently just boilerplate checkAnswer function.  Eventually will involve server calls.  It is the client-side controller
	checkAnswer()
	{
		if(this.AnsString != "")
		{
			//obtain the data string components
			var comps = this.dataString.split(":");
			//this will be updated later and totally replaced if we go server-side
			
			if(comps[0] == "numeric")
			{
				var idealAns;
				if(comps[1][0] == "(" && comps[1][comps[1].length - 1] == ")")
				{
					/*
					var tries = 0;
					while((idealAns === Infinity && tries < 10) || tries <1)
					{
						randomize();*/
					idealAns = math.evaluate(comps[1]);
						/*tries += 1; 
					}*/
				}
				else
				{
					idealAns = Number(comps[1]);
				}
				
				var tolerance = 0;
				if(comps[2] !== "absolute")
					tolerance = Number(comps[2]);
				var studentAns = Number(this.AnsString); 
				if(Math.abs(studentAns-idealAns) <= tolerance)
				{
					this.isCorrect = true;
					return true;
				}
				else
				{
					this.isCorrect = false;
					return false;
				}
			}
			
			if(this.type == "MC")
			{
				if(document.getElementById(this.dataString + this.id))	
				{
					if(document.getElementById(this.dataString + this.id).checked == true)
					{
						this.isCorrect = true;
						return true;
					}	
				}
				else 
				{
					this.isCorrect = false;
					return false; 
				}
					
			}
			else{
				if(this.AnsString === this.dataString)
				{
					this.isCorrect=true;
					return true;
				}
				else
				{
					this.isCorrect=false;
					return false;
				}
			}
		}
		else
			return false;
	}
	
}

class answerBox extends answer{
	constructor(dataString,newID="", page){
		super(dataString,"text");
		this.ID = newID;
		this.pageNum = page -1;
	}
	
	addContent (page) {
		var that = this;

		//add the answer box
		var ansBx = document.createElement("INPUT");
		ansBx.setAttribute("type","text");
		ansBx.setAttribute("id",that.ID+"_answerBox");
		ansBx.setAttribute("class","answerBox");
		ansBx.oninput=function(){that.setAnsString(ansBx.value)};

		page.appendChild(ansBx);

		//add the check answer feedback character
		page.appendChild(makeNewHTML({tag:"b",options:{id:"AnswerCheck"+that.ID},content:""}));

	}
}

class multipleChoice extends answer{
	constructor(dataString,newID="", page){
		super(dataString,"text");
		this.ID = newID; // this is the name of the radio button set
		this.pageNum = page -1;
	}

	addContent(page){
		var that = this;
		that.setAnsString(this.dataString+this.id);
		that.setType("MC");
		that.setId(this.ID);

		//add the check answer feedback character
		page.appendChild(makeNewHTML({tag:"b",options:{id:"AnswerCheck"+that.ID},content:""}));
	}
}

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