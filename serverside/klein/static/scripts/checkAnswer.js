function checkAnswer(answer){
    if(answer.AnsString != "")
		{
			//obtain the data string components
			var comps = answer.dataString.split(":");
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
				if(document.getElementById(answer.dataString + answer.id))	
				{
					if(document.getElementById(answer.dataString + answer.id).checked == true)
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
				if(answer.AnsString === answer.dataString)
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