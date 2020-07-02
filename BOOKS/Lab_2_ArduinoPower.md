!Book The Arduino's Input and Output
!Page Overview
	# Overview
	
	Circuits need power in order to work.  There are many ways to power a circuit.  In this course, we are going to use the Arduino itself to power all of your circuits.  This makes things simpler, since we won't need to think about powering the Arduino and the circuit separately.  In a previous lab, we used the Arduino's fixed 5V pin to power an LED, but sometimes you want to be able to turn a circuit ON or OFF without also turning off the Arduino.  In this lab we'll show you how to do that.
	
	
	The Arduino is what we will be using to sense things that are changing in our circuits.  In this lab we will also explore how to use the Arduino to get this input, and what some of the limitations of the Arduino's input functions are.
	
	
	You will need:
	
	!list
		!item Your Arduino
		!item Your USB cable
		!item A computer
		!item Your large breadboard
		!item An LED (the color doesn't matter)
		!item Two 1k resistors - the resistors in your kit come with pieces of tape with the value written on them.  Find the set that say 1K, and remove two of them.
		!item Your bundle of jumper wires
	!endList


	In this lab, we will be:
	
	!oList
		!item Creating a programmable output voltage so that we can control when a circuit gets power using software
		!item Using the Arduino's analog input functionality to read and record voltages
	!endList

!endPage
!Page Digital Out
	# Programming a Digital Output Pin
	
	To begin, you will need to re-build the last circuit from the module titled "The Arduino Kit".  It is shown below for your convenience.  Remember to unplug the Arduino from the computer before connecting the circuit!
	
	
	!img firstLED.PNG 500 500 firstLED
	
	
	Once the circuit is built and working, proceed with the rest of this lab.
	
	## First: what are digital output pins?
	
	Using the 5V pin is great for many circuits that need to be constantly powered.  However, there are cases where we want to control whether a circuit is on or off without powering down the Arduino.  For example, we might want to turn on an LED if a sensor reading is above a certain value, and turn the LED off otherwise.
	
	
	The Arduino has digital output pins that allow this to happen.  Digital outputs are either ON or OFF.  When the output is ON, it is supplying 5V, just like the 5V pin.  When it is OFF, it is supplying 0V.
	
	
	Look at your Arduino and you should see a set of pins with the label "DIGITAL (PWM~)" next to them.  They are labelled with numbers 0 through 13.  You should also notice that some of the pins have extra labels.  Pin 0 has "RX" next to it, pin 1 has "TX" next to it, and pins 3, 5, 5, 9, 10, and 11 have a "~" next to them.
	
	
	!img digitalPins.png 400 400 digital
	
	
	Pins 0 and 1 are special pins that we won't be using in this course.  They are connected to the serial port on the Arduino.  We won't use them because whenever we use the serial port to write data (using ```Serial.write(...```), they will rapidly change from ON to OFF, and we can't control what they are doing.
	
	
	The pins with a "~" next to them can be used as a regular digital output or to output more complicated ouputs.  We will use the more complicated output features later in this course, but for today we can treat them as though they are just regular digital outputs.
	
	
	## Using a digital pin
	
	In this part we are going to modify our previous circuit, and then make an LED blink ON and OFF.
	
	
	Open a new, blank Arduino sketch on the Arduino software.  Recall that there are two functions  - ```setup``` and ```loop```.  We need to use the ```setup``` function to tell the Arduino that a particular pin is to be used as an output, and then we use the ```loop``` function to control when it is on.  Let's use pin 4 today.
	
	
	First, move the wire that is currently connected to the 5V pin and plug it into pin 4.  You'll notice that I didn't give you a diagram.  You'll need to work out how to do it on your own, to help prepare you for more advanced labs.
	
	
	In ```setup```, we need to add code to indicate that pin 4 is an output.  We use the ```pinMode``` function to do so.  In between the braces (curly brackets, ```{}```) of the ```setup``` function, add the following line, exactly as written:
	
	
	```pinMode(4,OUTPUT);```
	
	
	This line sets the mode of pin 4 to be an output.  
	
	
	Now it's time to blink the LED.  In the ```loop``` function, we want to tell the pin to turn ON, then wait a bit, then turn it OFF, then wait a bit.  To do this we will need the ```digitalWrite``` and ```delay``` functions.  Inside of the ```loop``` function, write the following four lines:
	
	
	```digitalWrite(4,HIGH); //this turns the pin ON.  It is now outputting 5V```
	
	
	```delay(1000); ///do nothing for 1000ms```
	
	
	```digitalWrite(4,LOW); ///this turns the pin OFF.  It is now outputting 0V```
	
	
	```delay(1000); ///do nothing again```
	
	
	Hopefully what you are seeing is a blinking LED.
	
	
	!checkpoint
		### Deliverable 1
		
		Answer these questions in the writeup:
		
	
		!oList
			!item What would be different if we wanted the LED to be ON for 2 seconds and OFF for $\frac{1}{4}$ seconds?  Show the updated Arduino code and briefly describe your changes.  Feel free to test your code to see if you're right.
			!item Presume that we wanted to control two separate LEDs, one on pin 4 and one on pin 9, and that we wanted pin 4's LED to be ON when pin 9's LED is OFF, and vice versa.  Change the code to accomplish this, and show that updated code in your writeup.
			!item In your own words, why would you use the 5V pin compared to a programmable output pin?  Why would you use a programmable output comared to a 5V pin?
		!endList
	!endCheckpoint
	
!endPage
!Page Analog Input
	# Introduction to Analog Input
	
	## Digital vs. Analog Input
	
	The Arduino can read voltages as well as output them.  Broadly this is called "input", and the Arduino can be used for digital input or analog input.  In digital input mode, the Arduino will measure the voltage on a pin and determine if it is high (5V) or low (0V).  It converts this reading into either a 1 (for high voltage) or a 0 (for low voltage), and we can store this number in the Arduino's memory.  In this course, we will use the digital input rarely.
	
	
	However, if you give the Arduino a voltage between 0V and 5V and try to read it using a digital input, the results will be random and undefined.  The problem is that many sensors do produce a voltage that is between 0V and 5V, and the voltage that the sensor produces is related to the variable that the sensor is measuring.  We need a way to measure these in-between voltages.
	
	
	The pins that measure the in-between voltages are labelled "Analog In".  There are 6 analog input pins on your Arduino, and they are named A0 through A5.  They are shown below:
	
	
	!img analogIn.PNG 400 400 analog
	
	## The loopback test
	
	A loopback test is a test where we plug an analog input directly into the Arduino itself.  Loopback tests are often used to determine if a circuit is working - you produce a known output, then measure that output directly to see if it is correct.  In this test we are going to do the following:
	
	
	!oList
		!item Read voltages using an analog input pin
		!item Send data back to the PC using the ```Serial``` functionality of the Arduino
		!item Use the Serial Monitor to view our data
	!endList
	
	
	Begin by making sure that none of the pins of the Arduino have any wires in them.  Then take a jumper wire and plug one end into the analog input "A0" and the other into digital pin 4, as shown:
	
	!img loopback.PNG 400 400 loopback
	
	
	Next, open the program that you wrote in the previous exercise to blink the LED.  Add the following code to the setup function:
	
	
	```pinMode(A0,INPUT);//Tell the Arduino that we are using A0 to read voltages```
	
	
	```Serial.begin(115200);//We want to send the voltage readings to the PC```
	
	
	Leave the rest of the ```setup``` code as it was for the previous exercise.  Replace all of the code in ```loop``` with the following:

	```digitalWrite(4,HIGH); //this turns the pin ON.  It is now outputting 5V```
	
	
	```Serial.println(analogRead(A0)); //send the data on the serial port```
	
	
	```delay(1000); ///do nothing for 1000ms```
	
	
	```digitalWrite(4,LOW); ///this turns the pin OFF.  It is now outputting 0V```
	
	
	```Serial.println(analogRead(A0)); //send it again```
	
	
	```delay(1000); ///do nothing again```	
	
	
	Upload the code to your Arduino, then open the Serial Monitor.  Remember to set the Serial Monitor to 115200 baud.  You should see two numbers alternating - 0 and 1023.  We will learn what these numbers mean next.
	
	
	!checkpoint
		### Deliverable 2
		
		An important thing to do with the Arduino is to take numerical data from the Serial monitor, and put it into another program, like MATLAB, for analysis.  To get the data from the monitor:
		
		!oList
			!item Begin by make sure that the Serial monitor is open and collecting data by ensuring that it is writing numeric values to the screen.
			!item Collect some data - at least 10 seconds worth
			!item On the Serial monitor's lower left corner is a checkbox that says "Autoscroll".  Uncheck that box.
			!item You can now select the numbers and use CTRL+C (on Windows) or CMD+C (on a mac) to copy the numbers to your clipboard
			!item Paste the numbers into a notepad, Excel, or other file where you want to analyze the data
			!item If you want to collect more data, re-check "Autoscale" and the monitor will bring you back to the latest data.
		!endList
		
		
		Collect at least 10 seconds worth of data, then copy and paste that data into a file.  Plot the data you collected in your favorite plotting program (I recommend MATLAB).  Put the plot into your writeup document.
		
	!endCheckpoint
!endPage
!Page ADC Readings	
	
	# What do the numbers mean?
	
	Computers, fundamentally, store data digitally.  Analog inputs are attached to a circuit known as an Analog to Digital Converter, or ADC.  ADCs are specified in the number of "bits" (1s and 0s) that can be stored for a single measurement.  In general, an $N$-bit ADC can store $2^{N}-1$ possible values.  This means that the maximum reading we can get from our ADC is $2^N-1$, and the minimum value it can read is 0.  The Arduino's ADC is 10-bit, so it can read from 0 to $2^{10}-1$.  It turns out that $2^{10}-1 = 1023$.  The ADC can only read integers.  That is, it can read, for example, 500 and 501, but it can't read anything in between, like 500.34.
	
	
	How do we interpret these numbers?  Remember that when the digital output pin is ON, it is outputting 5V, and the Arduino read 1023.  It turns out that the number 1023 maps to 5V.  The mapping is linear.  A reading of 0 corresponds to 0V, 1023 corresponds to 5V, and the voltage values increase in a straight line between those values.  The key thing we want to be able to do is turn an ADC reading into a voltage.  To convert from an ADC reading to a voltage, you multiply by the conversion factor $C_{bToV} = \frac{5}{1023}$. You can convince yourself that this is just a unit conversion.  The readings are in "bits", and the conversion factor's units are $\frac{V}{bit}$.
	
	
	As an example, let's say that my Arduino is reading a value of 215.  To convert this to a voltage, I multiply by that conversion factor, so:
	
	
	$$V = 215 \times C_{bToV} = 1.051V$$
	
	!checkpoint
		Presume that your Arduino's ADC is reading a value of 416.  What is the voltage that it is reading?
		
		!ans numeric:2.03:0.01 numberAns1
		
		### Deliverable 3
		
		Answer the following question in your writeup:
		
			
		The ADC can read 416 or 417, but nothing in between, like 416.5.  This means that there is a minimum difference in voltages that it can read.  Determine what this difference is, show all of your work, and briefly explain it in the writeup.  This value is known as the ADC's "resolution".  Describe what ADC resolution means, and what some issues are when using an ADC to read a sensor if the resolution is limited.
	!endCheckpoint
	
!endPage
!Page Voltmeters
	# Using the Arduino as a voltmeter
	
	A voltmeter is a device that measures, and sometimes records, voltages.  We've already seen that the Arduino can do this in the loopback test.  However, it wouldn't be very useful if the Arduino could measure only its own voltages.  In this exercise, we are going to measure the voltage across a resistor in a circuit.
	
	
	## Voltage measurements require two wires
	
	There is no such thing as "voltage at a point" in the circuit.  Instead, we measure the voltage across an element in the circuit.  This means that we place one wire at one end of the element, and one wire at the other end.  To use the Arduino to measure voltages, then, we need two wires:
	
	
	!oList
		!item One wire goes to the analog input we want to use.  In today's lab we'll use A0
		!item One wire has to go into another pin.  The pins you **must** use are labelled "GND", which is an old term that means "ground".  Today we call this "reference".  There are several GND pins on the Arduino, and they are all connected to each other, so you may use whichever one is convenient for you.
	!endList
	
	
	From now on, we are going to call these wires "probes".
	
	
	When measuring voltage with the Arduino, the wire connected to A0 should be placed on the higher voltage side of the element you're measuring.  You can use KVL to determine which side this is - I'm not going to do it for you!
	
	## Making an Arduino Voltmeter
	
	In this exercise you are going to write some code.  Starting from a blank sketch, the code should:
	
	!list
		!item Set the pin A0 to be an input in the ```setup``` function
		!item Set the Serial to begin at 115200 baud in the ```setup``` function
		!item Continually read and print A0's value in ```loop```. Use the ```println``` function for this, and only print A0's value - do not print any other text or numbers.
		!item Add a ```delay``` of 200 at the end of ```loop```
	!endList
	
	
	Create the following circuit.  Note that the two resistors are 1K resistors.  Yours may look different:
	
	!img voltageDivider1.PNG 400 400 vDiv1
	
	
	It is now time to take the voltage measurements.  One slight issue with using the Arduino both as a power source and as a voltmeter is that GND pin.  In the image below, we've labelled the resistors A and B.  If you were to try to measure resistor A, it wouldn't do what you expect.  This is because resistor B would be connected to GND on both sides, which would be an accidental short!  For this reason, you must measure only resistor B if you want to collect some good data.
	
	
	!img voltageDivider2.PNG 400 400 vDiv2


	Add in the two wires connected to A0 and GND.  If you've written your code correctly, then when you turn on the Serial monitor you will see values of approximately 510 being printed rapidly.  You might see something slightly different, like 500, or 520, but you won't see something that is very different, like 100.  If you do, something went wrong and you need to fix your circuit.

	
	!checkpoint
		### Deliverable 4: Viewing a graph of your voltage data
		Once you are certain that the voltmeter is working, perform the following experiment:
		
		
		!oList
			!item Make sure the Arduino is plugged in via the USB cable
			!item Close the Serial Monitor
			!item Make sure that the two probes are not in the circuit
			!item In the Arduino software, go to Tools->Serial Plotter.  The Serial plotter works just like the Serial monitor, except it displays the data as a graph.
			!item Collect a few seconds worth of data with the probes unplugged, then, keeping the Serial plotter open and the Arduino powered, connect the probes where you had them before.  You should see the graph rapidly rise.
			!item Collect a few seconds worth of this data
			!item Take a screenshot of the Serial plotter - unfortunately, Arduino doesn't have a nice way of saving this graph
		!endList
		
		
		Include your graph and your Arduino code in the writeup.
	!endCheckpoint
	
	
	From now on, there will be several times when you set up a circuit and you will be asked to read voltages in that circuit.  You will need to come back to this page and set up your Arduino as a voltmeter to do so.  We will assume in future labs that you know how to do this, so make sure you fully understood everything on this page!
!endPage
!Page Writeup
	# Writeup
	
	Format your writeup so that we understand what we are looking at.  Section headings and brief descriptions are required.  Images must be centered and captioned, with the caption at the bottom of the image.  Image captions must start with a numeric identifier like "Figure 1".  Tables must be centered and captioned, the the caption at the top of the image.  Table captions must start with a numeric identifier like "Table 1".
	
	
	Figures and tables must be introduced in the text and referred to by their numeric identifier.  This can be as simple as saying "Figure 1 shows the resistance measurement".
	
	
	Each deliverable is worth 2 marks and is graded according to the following grading scheme.  Part marks are possible:
	
	
	!oList
		!item **2 marks:** Answer is complete, correct, and well-formatted
		!item **1 mark:** Answer is complete and largely correct but either has an error or is poorly formatted
		!item **0 marks:** Answer is incomplete OR completely incorrect
	!endList
	
	
	The following is taken from the other pages, and put here for ease of reference.
	
	### Deliverable 1
	
	Answer the following questions:
	
	!oList
		!item What would be different if we wanted the LED to be ON for 2 seconds and OFF for $\frac{1}{4}$ seconds?  Show the updated Arduino code and briefly describe your changes.
		!item Presume that we wanted to control two separate LEDs, one on pin 4 and one on pin 9, and that we wanted pin 4's LED to be ON when pin 9's LED is OFF, and vice versa.  Change the code to accomplish this, and show that updated code in your writeup.
		!item In your own words, why would you use the 5V pin compared to a programmable output pin?  Why would you use a programmable output comared to a 5V pin?
	!endList
	
	### Deliverable 2
	
	Plot the data you collected in your favorite plotting program (I recommend MATLAB).  Put the plot into your writeup document.
	
	### Deliverable 3
	
	The ADC can read 416 or 417, but nothing in between, like 416.5.  This means that there is a minimum difference in voltages that it can read.  Determine what this difference is, show all of your work, and briefly explain it in the writeup.  This value is known as the ADC's "resolution".  Describe what ADC resolution means, and what some issues are when using an ADC to read a sensor if the resolution is limited.
	
	### Deliverable 4
	
	Include your graph and your Arduino code in the writeup.
	
!endPage