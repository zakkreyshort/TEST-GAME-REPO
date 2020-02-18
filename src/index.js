import Phaser from 'phaser'; 

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map2.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', 'assets/coloredJewel.png');
    // hopefully load background image 
    this.load.image('background', 'assets/castleBackground.jpg');
    // player animations
    this.load.atlas('player', 'assets/useKnight.png', 'assets/player.json');
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // background
  let bg = this.add.sprite(0, 0, 'background');
 
  // change origin to the top-left of the sprite
  bg.setOrigin(0,0);

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('Tile Layer 1', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // // coin image used as tileset
    // var coinTiles = map.addTilesetImage('coin');
    // // add coins as tiles
    // coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player');
    // hitboxes = game.add.group();
    // hitboxes.enableBody = true;
    // player.addChild(hitboxes);
    // var hitbox1 = hitboxes.create(0,0,null);
    // hitbox1.body.setSize(50,50, player.width, player.height /2);
    // hitbox1.name = "punch";
    // hitbox1.damage = 50;
    // hitbox1.knockbackDirection = 0.5;
    // hitbox1.knockbackAmt = 600;}

    // for(var i = 0; i < hitboxes.children.length; i++){          // if we find the hitbox with the "name" specified      
    //              if(hitboxes.children[i].name === hitboxName){               // reset it         
    //                       hitboxes.children[i].reset(0,0);          }     }}// disable all active hitboxes
    //                       function disableAllHitboxes() {    
    //                            hitboxes.forEachExists(function(hitbox) {        
    //                                  hitbox.kill();     });}



    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width-35, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);

    // coinLayer.setTileIndexCallback(17, collectCoin, this);
    // // when the player overlaps with a tile with index 17, collectCoin 
    // // will be called    
    // this.physics.add.overlap(player, coinLayer);

    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 3, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });
    // swings sword when down arrow is held
    this.anims.create({
        key: 'swing',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_swing', start: 1, end: 5, zeroPad: 1}),
        frameRate: 10,
    });

    //jump animation
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNames('player',  {prefix: 'p1_jump', start: 1, end: 4, zeroPad: 0}),
        frameRate: 10,
        repeat: -1
    });


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#222222');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '30px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

function update(time, delta) {
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-500);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }  else if (cursors.down.isDown)
    {
        player.anims.play('swing', true);
    } else if (cursors.right.isDown)
    {
        player.body.setVelocityX(500);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    } 
    // jump - think about jump counter and double-jump
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-900);     
    }


}