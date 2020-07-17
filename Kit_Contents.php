<?php  
       $servername = "localhost";  
       $username = "root";  
       $password = "";  
       $db = "test";
       $table = "testing";
       #$db = "klein_testing";
       #$table = "answers";

       $link = mysqli_connect ($servername , $username , $password) or die("unable to connect to host");  
       $sql = mysqli_select_db ($link, $db) or die("unable to connect to database"); 
       if($link){
              echo "mysql connected ";
       }
       if($sql){
              echo "db connected ";
       }
?>
<html>
<head>
	<!-- Mathjax: -->
	<script>
		MathJax = {
		  tex: {
			inlineMath: [['$', '$'], ['\\(', '\\)']]
		  },
		  svg: {
			fontCache: 'global'
		  },
		  startup: {
			typeset: false
		  }
		};
</script>
	<script id="MathJax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
	</script>
	    
	<!-- End of MathJax -->
	
	<link rel="stylesheet" type="text/css" href="/Klein-Clientside/css/kleinStyle.css">
</head>
<body style ="overflow-y: auto;">
<div id="header" class="header"></div>
<div id="contentPlace" class="main"></div>
	<div class ="sidebar">
		<div  class="btn-group" id="selectRow"></div>
		<div class="HDID" id = "HDID"></div> <!--How did I do (HDID)-->
	</div>
<p>
<script src="/Klein-Clientside/scripts/answerableComponent.js"></script>
<script src="/Klein-Clientside/scripts/kleinCore.js"></script>
<script src="/Klein-Clientside/scripts/math.js"></script>
<script>
	let url = '/Klein-Clientside/BOOKS/Lab_2_ArduinoPower.bk';
	//let url = 'https://learn.uwaterloo.ca/d2l/common/viewFile.d2lfile/Content/637273113418029494/Lab_7_CIntro_base.bk?ou=296412&fid=L2NvbnRlbnQvZW5mb3JjZWQvMjk2NDEyLVNhbmRib3hfTV9TdGFjaG93c2t5L0tldmluX3Rlc3QvQk9PS1MvdGVzdEVkaXRvci5iaw';
	var text2 = {};
	fetch(url).then(res => res.json()).then((out)=>(parseBookFromJSON(out)));

    </script>
    <?php
	$sql = "INSERT INTO $table (name, number, test, id)
    VALUES ('John', 2, 1, 1)";
    if (mysqli_query($link, $sql)) {
        #echo "New record created successfully ";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($link);
    }
    ?>
</p>
</body>
</html>