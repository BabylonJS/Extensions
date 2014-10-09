var shootaudio = new Audio("assets/shoot2.wav");
var lightspeedaudio = new Audio("assets/lightspeed.wav");
lightspeedaudio.volume = .25;
var lightspeedstartaudio = new Audio("assets/lightspeedstart.wav");
lightspeedstartaudio.volume = .25;
var explode = new Audio("assets/explosion.wav");
explode.volume = .5;

var GameSound = new sound();

function sound()
{
	this.mute = true;
	
	this.play = function(sound){
		if (!this.mute){
			switch(sound){
			case "shoot":
				//explode = new Audio("assets/explosion.wav");
				//explode.volume = .05;
				//shootaudio.play();
				break;
			case "LSstart":
				lightspeedstartaudio.play();
				break;
			case "LSgo":
				lightspeedaudio.play();
				break;
			case "explode":
				explode = new Audio("assets/explosion.wav");
				explode.volume = .05;
				explode.play();
				break;
			case "playerexplode":
				break;
			case "playerhit":
				break;
			case "levelup":
				break;
			case "lightspeedready":
				break;
			}
		}
	}
}