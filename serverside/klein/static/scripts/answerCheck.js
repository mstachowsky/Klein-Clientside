function checkAnswer(answer, override){
    if(answer.AnsString != "")
		{
			//obtain the data string components
			var correctAns = ""
			// override is used solely for serverside checking. Override will be the answer provided from the server
			// Makes it such that it uses the server answer over the empty string clientside
			if(override){
				correctAns = override;
			}
			else{
				correctAns = answer.dataString;
			}
			var comps = correctAns.split(":");
			//answer will be updated later and totally replaced if we go server-side
			
			if(comps[0] == "numeric")
			{
				var idealAns;
				// checks for enclosing brackets to determine if it's an expression
				if(comps[1][0] == "(" && comps[1][comps[1].length - 1] == ")")
				{
					// evaluates the expression, can handle wide varity of expressions. Look into math.js documentation for more details
					idealAns = math.evaluate(comps[1]);
				
				}
				else
				{
					idealAns = Number(comps[1]);
				}
				
				var tolerance = 0;
				if(comps[2] !== "absolute")
					tolerance = Number(comps[2]);
				var studentAns = Number(answer.AnsString); 
				if(Math.abs(studentAns-idealAns) <= tolerance)
				{
					answer.isCorrect = true;
					return true;
				}
				else
				{
					answer.isCorrect = false;
					return false;
				}
			}
			
			if(answer.type == "MC")
			{
				if(document.getElementById(correctAns + answer.id))	
				{
					// check to see if the correct radio button is selected 
					if(document.getElementById(correctAns + answer.id).checked == true)
					{
						answer.isCorrect = true;
						return true;
					}	
				}
				else 
				{
					answer.isCorrect = false;
					return false; 
				}
					
			}
			else{
				// check if the string is equivalent 
				if(answer.AnsString === correctAns)
				{
					answer.isCorrect=true;
					return true;
				}
				else
				{
					answer.isCorrect=false;
					return false;
				}
			}
		}
	else
		return false;
}

function serverAnsCheck(ans){
	var bool = false;
	$.ajax({
		type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)

		//defines the data being sent to the server, contains the answer ID, dataString (answkerkey) and page number in addition to the type of operation, here is to check the answer
		data        :  JSON.stringify({
			'id' : ans.ID,
			'ans' : ans.dataString,
			'page' : ans.pageNum,
			'operation' : 'check'
		}), 
		contentType    : 'json', //defines the type of data being sent to the server, in our case it's a JSON string 
		dataType    : 'json', // what type of data do we expect back from the server
		success     : 
		//When the data from the server is received successfully, the below function is called.
		//Performs answercheck based on the data received from the server, activates the appropriate correct/incorrect answer symbol
		function(msg){
			bool = checkAnswer(ans, msg.ans);
			var yesBx = document.getElementById("AnswerCheck"+ans.ID);
			if(yesBx){
				if(bool == true){
					yesBx.innerHTML = " \u2705";
				}
				else{
					yesBx.innerHTML = " \u274C";
				}
			}
		}
	});
}