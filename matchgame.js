$(function(){

	/*
	**********************************************************
	***    First some setup:                               ***
	***    Create the answers that the users will drag     ***
	***    to the appropriate categories.                  ***
	***    No need to change the "order"                   ***
	***    element as it is just a placeholder - order     ***
	***    is randomized later.                            ***
	**********************************************************
	*/
	var answers = [{
			"text":		"Orange",
			"order":	"1"
		}, {
			"text":		"Pear",
			"order":	"2"
		}, {
			"text":		"Mango",
			"order":	"3"
		}, {
			"text":		"Broccoli",
			"order":	"4"
		}, {
			"text":		"Asparagus",
			"order":	"5"
		}, {
			"text":		"Corn",
			"order":	"6"
		}, {
			"text":		"Windows",
			"order":	"7"
		}, {
			"text":		"Linux",
			"order":	"8"
		}, {
			"text":		"Android",
			"order":	"9"
	}];


	/*
	**********************************************************
	***    Now create the three categories to which the    ***
	***    user will drag their answers                    ***
	**********************************************************
	*/
	var subcontainers = [{
			"text":		"Fruits",
			"id":		"fruits"
		}, {
			"text":		"Vegetables",
			"id":		"vegetables"
		}, {
			"text":		"Operating Systems",
			"id":		"neverpresent"
	}];



	/*
	**********************************************************
	***    Now define which answers belong in which        ***
	***    categories. The numbers here (i.e. the 3 in     ***
	***    answer3, etc) are derived from the 'order'      ***
	***    element of the answers[] array.                 ***
	**********************************************************
	*/
	var fruits_correct = new Array('answer1','answer2','answer3');
	var veggies_correct = new Array('answer4','answer5','answer6');
	var os_correct = new Array('answer7','answer8','answer9');

	/*
	**********************************************************
	***    NOTE!!! The names of the *_correct arrays and   ***
	***    the subcontainer ids also have to be changed    ***
	***    down at the bottom of the score_game()          ***
	***    function. If anyone wants to help me            ***
	***    abstract that so they only need to be set       ***
	***    once, here at the top of the document, that     ***
	***    would be great.                                 ***
	**********************************************************
	*/










	reset_game();																// this initializes the game
	
	$('#game_container #button_container #reset_button').click(function(){
		reset_game();
	});
	
	$('#game_container #button_container #check_button').click(function(){
		$("#game_container .qanswer").promise().done(function() { 				// promise().done() waits for any animations to complete before firing the function
			score_game();														// this is necessary because any divs that have not yet finished the "drop" animation will not be scored
		});
	});
	
	$('#game_container #ok_button').click(function(){
		$('#game_container #message').animate( {
			width: '0',
			height: '0',
			padding: '0',
			opacity: 0
		}, 1000).hide(1000);
	});

	function reset_game() {
		// empty the divs
		$('#game_container #draggable_container').html('').removeClass();
		$('#game_container #droppable_container').html('');
		
		// enable the "check" button
		$('#game_container #check_button').removeAttr('disabled');
		
		// hide the incomplete message and the game score if they are showing
		$('#game_container #message').hide();
		$('#game_container #score_container').hide();

		// now place the answer containers on the page and make them accept the dragged answers from above
		for (var j=0; j<3; j++) {
			$('<div><strong>' + subcontainers[j].text + '</strong></div>').attr('class', 'subcontainer').attr('id', subcontainers[j].id).appendTo('#game_container #droppable_container').sortable({
				containment: "#game_container",
				cursor: "move",
				items: "div",
				revert: 250,
				connectWith: "#game_container .subcontainer",
				receive: function(event, ui) {
					if (ui.item.parents('#game_container .subcontainer')) {
						ui.item.removeClass('dragthis').addClass('dropped');
					} else {
						ui.item.removeClass('dropped').addClass('dragthis');
					}
				}
			}).disableSelection();
		}

		// randomize the order of the answer divs
		answers.sort(function(){ return (Math.round(Math.random())-0.5); });
		
		// place them on the page and make them sortable
		for (var i=0; i<answers.length; i++) {
			$('<div>' + answers[i].text + '</div>').attr('id', 'answer' + answers[i].order).attr('class', 'dragthis qanswer').appendTo('#game_container #draggable_container').disableSelection();
		}
		$("#game_container #draggable_container").sortable({
			connectWith: '#game_container .subcontainer',
			containment: '#game_container',
			cursor: 'move',
			items: 'div',
			revert: 250
		}).disableSelection();
	}
	
	function score_game() {
		// check to see if they are finished
		// do this by making sure that #draggable_container is empty
		if (!$("#game_container #draggable_container").is(":empty")) {
			// it's not empty! it would be madness to try to calculate this score.
			
			// fill the message div with text accordingly
			$('#game_container #message #text').html('The game is not complete! Please drag all answers to a category first.');
			
			// now we'll animate it growing and appearing. neato
			$('#game_container #message').show().css({
				top: $("#game_container #droppable_container").position().top-50,
				left: $("#game_container #droppable_container").position().left+100
			}).animate( {
				width: '450px',
				height: '80px',
				padding: '20px',
				opacity: 1
			}, 500);
			
			// you don't get a score yet. stop here.
			return;
		}

		// if we got this far, it means each draggable has been dragged to one of the containers.

		// make the items no longer sortable by disabling them
		$("#game_container .subcontainer").each(function(index){
			$(this).sortable("option","disabled",true);
		});
		
		// also disable the "check" button
		$('#game_container #button_container #check_button').attr("disabled", "disabled");
		


		// go through each and see if it's in the right place
		$correctcounter = 0;																				// keep track of how many are right
		$("#game_container .dropped").each(function(index){
			$thisid = $(this).attr('id');																	// shortcuts
			$parentid = $(this).parent().attr('id');
			$(this).css('cursor','default');																// UI helper to help the user know the elements are no longer draggable
			if (																							// big long if statement to see if the element is in the right place
				($.inArray($thisid, fruits_correct) > -1 && $parentid == 'fruits') ||
				($.inArray($thisid, veggies_correct) > -1 && $parentid == 'vegetables') ||
				($.inArray($thisid, os_correct) > -1 && $parentid == 'neverpresent')
			) {
				$(this).addClass('correct', 800).removeClass('dropped', 800);								// it's in the right place - make it all green and happy
				$correctcounter++;																			// +1 to the counter of correct answers
			} else {
				$(this).addClass('incorrect', 800).removeClass('dropped', 800);								// it's in the wrong place - make it all red and sad
			}
		});
		
		// tell the user their score, we'll use the heretofore hidden #score_container div for that.
		$('#game_container #score_container #score_text').html('You got <span class="score">' + $correctcounter + '</span> out of 9 correct!');
		$('#game_container #score_container').slideDown(500);
	}
})