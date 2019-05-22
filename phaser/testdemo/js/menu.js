BasicGame.Menu = function (game) {
    this.bgaudio = null;
    this.nokissnoplay = null;
    this.kissbutton = null;
    this.nokissbutton = null;
    this.mykissaudio = null;
    this.nokissaudio = null;
    this.nokissnoplayState = function () {
        this.nokissnoplay = this.add.button(MainGame.world.width/2, 170, 'nokissnoplay');
        this.nokissnoplay.anchor.setTo(0.5,0.5);
        this.nokissnoplay.width = 200;
        this.nokissnoplay.height = 300;
        this.kissbutton = this.add.button(20, 360, 'kissarr', this.onKissButton, this, 0,1,2);
        this.kissbutton.width = 60;
        this.kissbutton.height = 30;

        this.nokissbutton = this.add.button(140, 360, 'nokissbutton',this.onNoKissButton, this);
        //按钮触发音乐
        this.mykissaudio = this.add.audio('mykissaudio');
        this.mykissaudio.volume += 3.2;
        this.nokissaudio = this.add.audio('nokissaudio');
        this.nokissaudio.volume += 3.2;
    };
    this.clearnokissnoplayState = function () {
        // 动画
        MainGame.add.tween(this.nokissnoplay).to({ y: 0, alpha: 0 }, 2000, Phaser.Easing.Sinusoidal.InOut, true);
        var nokissnoplayTween = MainGame.add.tween(this.nokissnoplay.scale).to({ x: 0.1,y:0.1 }, 2000, Phaser.Easing.Sinusoidal.InOut, true);
        nokissnoplayTween.onComplete.add(function () {
            this.nokissnoplay.kill();
        }, this);
        //if (this.nokissnoplay) this.nokissnoplay.kill();
        if(this.kissbutton) this.kissbutton.kill();
        if(this.nokissbutton) this.nokissbutton.kill();
        if (this.mykissaudio) this.mykissaudio.destroy();
        if (this.nokissaudio) this.nokissaudio.destroy();
    }
    this.onKissButton = function () {
        this.mykissaudio.play();
        var passRate = 0.2;
        var randomNum = Math.random();
        if(passRate>=randomNum){
            //亲够了，可以继续
            this.clearnokissnoplayState();
        }else{
            //还不够，还要亲亲
        }
    }
    this.onNoKissButton = function () {
        this.nokissaudio.play();
    }

    this.playmylovebga = function () {
        // 背景音乐
        this.bgaudio = this.add.audio('myworldinloveriver', 0.2, true);
        this.bgaudio.play();
    }
    this.playnormalbga = function () {
        // 背景音乐
        this.bgaudio = this.add.audio('normalback', 0.2, true);
        this.bgaudio.play();
    }
}

BasicGame.Menu.prototype = {
    create: function () {
        // 背景
        var bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');
        // 我的飞机
        this.myplane = this.add.sprite(100, 100, 'myplane');
        this.myplane.animations.add('fly');
        this.myplane.animations.play('fly', 12, true);
        // 开始按钮
        this.startbutton = this.add.button(70, 200, 'startbutton', this.onStartClick, this, 1, 1, 0);
        
        
        this.playmylovebga();

        this.nokissnoplayState();
    },
    onStartClick: function(){
        this.state.start('game');
        this.normalback.stop();
    },
    render: function () {
        
    }
};