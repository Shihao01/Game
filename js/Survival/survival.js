var Survivalgame = new Phaser.Game(1000,600,Phaser.AUTO,'Survival'); //create phaser game 
Survivalgame.States = {}; // to save Scenes we need for this game. 


// Boot Scene : running preload gif ! Then run Perload scene. 
Survivalgame.State.boot = function(){	
	this.preload = function(){
		Survivalgame.load.image('loading','assert/Survival/preloader.gif');
	}; 
	this.create = function(){
		Survivalgame.state.start('preload'); 
	}
}; 


//Preload scene : loading all files we need to this game
Survivalgame.State.preload = function(){
	
	this.perload = function(){
	//use setPreloadSprite to display perload schedule 
		var PreloadSprite = Survivalgame.add.sprite(50,Survivalgame.height/2,'loading'); 
		Survivalgame.load.setPreloadSprite(PreloadSprite); 
	
	//All file need to be load 	
		Survivalgame.load.image('background','assert/Survival/background.jpg'); 
		Survivalgame.load.image('ground','assert/Survival/ground.png'); 
		Survivalgame.load.image('title','assert/Survival/title.png'); 
		Survivalgame.load.image('btn','assert/Survival/startbutton.png'); 
		Survivalgame.load.image('rbtn','assert/Survival/replaybutton.jpg'); 
		Survivalgame.load.image('ready','assert/Survival/getready.png'); 
		Survivalgame.load.image('playtip','assert/Survival/gametip.png'); 
		Survivalgame.load.image('gameover','assert/Survival/gameover.png'); 
		Survivalgame.load.image('scoreboadr','assert/Survival/scoreboard.png'); 	
		Survivalgame.load.spritesheet('player','assert/Survival/player.png'34,24,3);
		Survivalgame.load.spritesheet('barrer','assert/Survival/barrer.jpg'54,400,2);	
		Survivalgame.load.bitmapFont('font','assert/Survival/fonts/Survival.png','assert/Survival/fonts/Survival.fnt');
		Survivalgame.load.audio('flysound','assert/Survival/fly.wav');
		Survivalgame.load.audio('scoresound','assert/Survival/score.wav');
		Survivalgame.load.audio('hitbarrersound','assert/Survival/barrerhit.wav');
		Survivalgame.load.audio('hitgroundsound','assert/Survival/groundhit.wav');
	}
// run menu scene after load all file 	
	this.create = function(){
		Survivalgame.state.start.('menu');
	}
}; 


//Menu scene: Game Menu 
Survivalgame.State.menu = function(){
	//use tileSorite to make image move. 
	this.create = function(){		
		var background = Survivalgame.add.tileSprite(0,0,game.width,game.height,'background');
		var ground = game.add.tileSprite(0,game.height-112,game.width,112,'ground').autoScroll(-100,0);
		background.autoScroll(-10,0); 
		ground.autoScroll(-100,0);
		
	// create a group which has title and playerimg
    // add amimations to make it move as a group 
	// tween animations up and down move
	var titleGroup = Survivalgame.add.group(); 
	titleGroup.create(0,0,'title'); 
	var player = titleGroup.create(190,10,'player');
	player.animations.add('fly'); 
	player.animations.play('fly',12,true); 
	titleGroup.x = 35; 
	titleGroup.y = 100; 
	Survivalgame.add.tween(titleGroup).to({y:120},1000,null,ture,0,Number.MAX_VALUE,true); 
	
	//create play button jump to play scene when you click it 
	var btn = Survivalgame.add.button(500,500,'btn',function(){
		Survivalgame.state.start('play'); 
	});
	// set mid of button	
	btn.anchor.setTo(0.5,0.5); 
	}	
}; 


//Play scene: real game code 
Survivalgame.State.play = function(){
	this.create = function(){		
		this.bg= Survivalgame.add.tileSprite(0,0,Survivalgame.width,Survivalgame.height,'background'); 
		this.barrerGroup = Survivalgame.add.group(); 
		this.barrerGroup.enableBody = true; 
		this.ground = Survivalgame.add.tileSprite(0,Survivalgame.height-500,Survivalgame.width,500,'ground');
		this.player = game.add.sprite(50,150,'player'); 
		this.player.animations.add('fly'); 
		this.player.animations.play('fly',12,true); 
		this.player.anchor.setTo(0.5,0.5); 
		Survivalgame.physics.enable(this.player,Phaser.physics.ARCADE);
		this.player.body.gravity.y = 0; // set as 0 before game start to keep player not die yet.
		Survivalgame.physics.enable(this.ground,Phaser.physics.ARCADE); 
		this.ground.body.immovable = true; 
		this.readytext = Survivalgame.add.image(500,40,'ready'); 
		this.playtip = Survivalgame.add.imae (500,200,'playtip'); 
		this.readytext.anchor.setTo(0.5,0); 
		this.playtip.anchor.setTo(0.5,0); 
		this.hasStarted = false; // game start or not
		
		//loop(delay, callback, callbackContext, arguments);
		//repeat(delay, repeatCount, callback, callbackContext, arguments);
		// both works we used loop this time. To create barrers. 
		game.time.events.loop(900,this.generateBarrers,this); 
		Survivalgame.time.events.stop(false); // not start yet before game start 
		// stat game after hit screen. used mouse event ,start function use same thing on fly function.
		// var input = game.input; the game input object
		// var signal = input.onDown; when mouse hit down
		// signal.add(function(){}); bound function  
		Survivalgame.input.onDown.addOnce(this.startGame,this); 		
	}
	
	this.startGame = function(){
		this.gameSpeed = 200; 
		this.gameIsOver = false; 
		this.hasHitGround = false ; 
		this.hasStarted = true; 
		this.score = 0 ; // game score start at 0 
		// start move background and ground
		this.bg.autoScroll(-(this.gameSpeed/10),0); 
		this.ground.autoScroll(-this.gameSpeed,0); 
		this.player.body.gravity.y = 1150; 
		//remover tip and ready image 
		this.readytext.destory(); 
		this.playtip.destory(); 
		Survivalgame.input.onDown.add(this.fly,this); 
		Survivalgame.time.events.start(); 		
	}
	
	this.fly = function(){
		this.player.body.velocity.y = -350; // a up speed to let player fly
		// make the hit up animations,just left imgae slant
		Survivalgame.add.tween(this.player).to({angle:-30}, 100, null, true, 0, 0, false);
		this.flysound.play(); 
	}
	
	this.generateBarrers = function(gap){
		gap = gap || 100; // 
		//get a random position between barrers and set barrer position
		var position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());
		var topBarrerY = position-360; 
		var bottomBarrerY = position+gap; 

        //if barrer passed then rest them. so we get enough barrer to use. 
		if(this.resetBarrer(topBarrerY,bottomBarrerY)) return; 

		var topBarrer = Survivalgame.add.sprite(game.width, topBarrerY, 'barrer', 0, this.barrerGroup); 
		var bottomBarrer = Survivalgame.add.sprite(game.width, bottomBarrerY, 'barrer', 1, this.barrerGroup); 
		this.barrerGroup.setAll('checkWorldBounds',true); // check boundary
		this.barrerGroup.setAll('outOfBoundsKill',true); //kill player if they out of boundary
		this.barrerGroup.setAll('body.velocity.x', -this.gameSpeed); //set barrer speed 
	}
	
	this.resetBarrer = function((topBarrerY,bottomBarrerY){
		var i = 0 ; 
		this.barrerGroup.forEachDead(function(barrer)){
			if(barrer.y<=0)//top barrer
			{
				barrer.reset(Survivalgame.width,topBarrerY); 
				barrer.hasScored = false; //no score for reset
			}
		else
		{
			barrer.reset(Survivalgame.width,bottomBarrerY);
		}
		barrer.body.velocity.x = -this.gameSpeed; // set barrer speed 
		i++; 
		},this); 
		return i == 2; // if i =2 means alreayd has one barrer passed bound which can be reset
	}
	
	this.Update = function(){
		if (!this.hasStarted) return; 
		Survivalgame.physics.arcade.collide(this.player,this.ground, this.hitGround, null, this);
		Survivalgame.physics.arcade.overlap(this.player, this.barrerGroup, this.hitbarrer, null, this);
		if(this.player.angle < 90) this.player.angle += 2.5; //下降时鸟的头朝下的动画
    this.barrerGroup.forEachExists(this.checkScore,this);
	}
	
	this.checkScore = function(barrer){
		if (!barrer.hasScored && barrer.y<=0 &&barrer.x<=this.player.x-17-54){
			barrer.hasScored = true; 
			this.scoretext.text = ++this.score; 
			this.scoresound.play(); 
			return true; 
		}
		return false ; 
	}
	
	
}; 


// add all scenes to Survivalgame 
Survivalgame.state.add('boot',Survivalgame.boot); 
Survivalgame.state.add('perload',Survivalgame.perload); 
Survivalgame.state.add('menu',Survivalgame.menu); 
Survivalgame.state.add('play',Survivalgame.play); 


// run boot scene to start game 
Survivalgame.start('boot'); 
