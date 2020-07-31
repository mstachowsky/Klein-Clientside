function checkAnswer(answer, override){
    if(answer.AnsString != "")
		{
			//obtain the data string components
			var correctAns = ""
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
				if(comps[1][0] == "(" && comps[1][comps[1].length - 1] == ")")
				{
				
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