!bookVariables

	!var %x:1:10:2
	!var %y:10:100:3
	!var %test: %x + %y
	!var %z:10
	!var %q: 1+5

!endBookVariables

!Book Multiple choice testing 


!Page TEST 
	# LETS PRETEND THAT THIS IS A QUESTION HEADING

	TESTing 123 %x + %y \*\* %x /%y 
	
	Whats %x + %y^ %x /%y : testing eqn:{tan(90 deg)  , %lol} : %test

	testing z : %z
	
	testing q : %q

	!ans numeric:(%x + %y ^ %x / %y):0.01 numAns2 serverside


	
	!multipleChoice 2 multi1 :this is a test question
		
		!option yes testing eqn:{1 +2 \* 5, %z}

		!option no eqn:{%x+%y + %z}

		!option this question is dumb

		!option ok buddy

	!endMultipleChoice 

	!multipleChoice 5 multi2 :this is another test question 
		
		!option yes

		!option no 

		!option this question is dumb

		!option ok buddy

	!endMultipleChoice 
	
	!multipleChoice 2 multi3 :this is another nother test question
		
		!option yes

		!option no 

		!option this question is dumb

		!option ok buddy %x
	!endMultipleChoice
!endPage
!Page test2

	# is a big number lol testing

	is this working i dont know hahaha %y

	lets have more content maybe so it doesnt break or something  
	
	!checkpoint
		this is testing lol idk %x

		## test

		### tst

		!ans numeric:2.03:0.01 numAns1
	!endCheckpoint
	xd %x
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
		
!endPage
!Page test3

	# is a big number lol testing

	is this working i dont know hahaha

	lets have more content maybe so it doesnt break or something  
	
	xd	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
		
!endPage
!Page test

	# is a big number lol testing

	is this working i dont know hahaha

	lets have more content maybe so it doesnt break or something  lets make this even longer for testing purposes lol 123 idk ok hehe lol
	
	xd	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	xd
	
	x
		
!endPage
!Page ok buddy
	# testing 12345

!endPage
!addPage testFolder/testing.pg
