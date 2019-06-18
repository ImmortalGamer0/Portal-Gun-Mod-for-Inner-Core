/*
NIDE BUILD INFO:
  dir: dev
  target: main.js
  files: 6
*/



// file: portalManager.js

var PortalManager = {
    portals:{
        blue:null,
        orange:null
    },
    currentColor:"blue",
    setPortal:function(color,obj){
        if(this.portals[color])this.portals[color].destroy();
        
        this.portals[color] = obj;
        var invertedColor = this.getInvertedColor(color);
        if(this.portals[invertedColor]){
            this.portals[invertedColor].open();
            this.portals[color].open();
        }
        this.switchColor();
    },
    destroyPortal:function(color){
        if(this.portals[color]){
            this.portals[color].destroy();
            this.portals[color] = null;
        }
        var invColor = this.getInvertedColor(color);
        if(this.portals[invColor]){
            this.portals[invColor].close();
        }
    },
    getInvertedColor:function(color){return (color =="blue" ? "orange":"blue")},
    switchColor:function(){
        alert("current color "+this.currentColor);          
        this.currentColor = this.currentColor=="blue"?"orange":"blue";
        alert("new color " +this.currentColor);
    },
    getColorForPortal:function(){return this.currentColor},
    getPortalFromColor:function(color){return this.portals[color]},
    getRenderItemsForColor:function(color){
        if(color=="blue"){
            return {
                ball:ItemID.blueBall,
                bottomClosed:ItemID.portal_blue_bottom_closed,
                bottomOpened:ItemID.portal_blue_open_bottom,
                topClosed:ItemID.portal_blue_top_closed,
                topOpen:ItemID.portal_blue_top_open
            }
        }else if(color=="orange"){
            return {
                ball:ItemID.orangeBall,
                bottomClosed:ItemID.portal_orange_bottom_closed,
                bottomOpened:ItemID.portal_orange_open_bottom,
                topClosed:ItemID.portal_orange_top_closed,
                topOpen:ItemID.portal_orange_top_open
            }
        }
    },
    blockDestroyFunction:function(coords, block, player){
        for(var p in this.portals){
            var portal = this.portals[p];
            if(portal){
                if(portal.x==coords.x&&portal.y==coords.y&&portal.z==coords.z){
                    Debug.m("WAT A U DOING????");
                    this.destroyPortal(portal.color);
                    this.currentColor = portal.color;
                }
                if(portal.x==coords.x&&(portal.y-1)==coords.y&&portal.z==coords.z){
                    Debug.m("WAT A U DOING????");
                    this.destroyPortal(portal.color);
                    this.currentColor = portal.color;
                }
            }
        }
    }
};
Callback.addCallback("ItemUse", function(coords, item, block){
    if(Entity.getSneaking(Player.get())){
        Debug.m(Entity.getPosition(Player.get()));
    }
});
Callback.addCallback("DestroyBlock", function(coords, block, player){PortalManager.blockDestroyFunction(coords, block, player);});



// file: portalConstructor.js

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function particlesss(x,y,z){
    this.x = x; this.y = y; this.z = z;
    this.time = 0;
    this.update = function(){
        Particles.addFarParticle(7,this.x,this.y,this.z,0,.1,0);
        
       this.time++;
       if(this.time>40){
        this.remove = true;
            World.setBlock(this.x,this.y,this.z,3);
        }
    }
};
function rotateVel(secondPortalIndex,vx,vy,vz){
    var vel = {x:vx, y:vy, z:vz};
    switch(parseInt(secondPortalIndex)){
        case 2: 
        vel.y = 11
        break;
    }
};

var BlockSide = Native.BlockSide;
var PortalCoordsHelper = {
    getCoordsAndRotationByIndex:function(index){
        var data = {coords0:[],coords1:[],rot:[]};
        switch(parseInt(index)){
            case 0 :
                data.coords0 = [-.5,0,.5];
                data.coords1 = [.5,0,.5];
                data.rot = [0,Math.PI*3/2,Math.PI/2];
                break;
            case 1 :
                data.coords0 = [-.5,1,.5];
                data.coords1 = [.5,1,.5];
                data.rot = [0,Math.PI/2,Math.PI/2];
                break;
            case 2 :
                data.coords0 = [.5,-.5,1];
                data.coords1 = [.5,.5,1];
                data.rot = [0,0,0];
                break; 
            case 3 : 
                data.coords0 = [.5,-.5,0];
                data.coords1 = [.5,.5,0];
                data.rot = [0,Math.PI,0];
                break; 
            case 4 :
                data.coords0 = [0,-.5,.5];
                data.coords1 = [0,.5,.5];
                data.rot = [0,Math.PI/2,0];
                break;
            case 5 :
                data.coords0 = [1,-.5,.5];
                data.coords1 = [1,.5,.5];
                data.rot = [0,Math.PI*3/2,0];
                break;  
        };return data;
    }
};
function portalBall(color, x,y,z, vx,vy,vz){
    
    this.animation = null;
    this.inBlock = false;
    
    this.x = x; this.y = y; this.z = z;
    this.vx = vx; this.vy = vy; this.vz = vz;
    this.color = color;
    
    this.frameMultiplier = 10;
    this.age = 0; 
    
    this.checkBlock = function(x,y,z){return !GenerationUtils.isTransparentBlock(World.getBlockID(x,y,z));};
    this.findSide = function(x,y,z){
        var dis = [];
        dis.push(y-Math.floor(y));
        dis.push(Math.ceil(y)-y);
        dis[BlockSide.WEST] = x - Math.floor(x);
        dis[BlockSide.EAST] = Math.ceil(x)-x;
        dis[BlockSide.NORTH] = Math.ceil(z)-z;
        dis[BlockSide.SOUTH] = z- Math.floor(z);
        var min = dis.min();
        for(var i in dis){
            if(dis[i]==min)return i;
        }
    }; 
    this.getRelativePortalCoords1 = function(index){
        switch(parseInt(index)){
            case BlockSide.DOWN: 
                alert('DOWN');
                return [{x:-1,y:-1,z:0},{x:0,y:-1,z:0}];
            case BlockSide.UP:
                alert('UP');
              return [{x:0,y:1,z:0},{x:-1,y:1,z:0}];
            case BlockSide.WEST: 
              alert('WEST');//4
               return [{x: -1, y:0, z:0},{x: -1, y:-1, z:0}];
            case BlockSide.EAST:
               alert('EAST');//5
              return [{x:1,y:0,z:0},{x:1,y:-1,z:0}];
            case BlockSide.NORTH:
              alert('NORTH'); //2
                return [{x:0,y:0,z:1},{x:0,y:-1,z:1}];
            case BlockSide.SOUTH: 
                alert('SOUTH'); //3
                return [{x:0,y:0,z:-1},{x:0,y:-1,z:-1}];
        }
    }; 
    this.hasSpaceForPortal1 = function(index,x,y,z){
        var relativeCoords = this.getRelativePortalCoords1(index);
        var upID = World.getBlockID(x+relativeCoords[0].x,y+relativeCoords[0].y,z+relativeCoords[0].z);
        var dwID = World.getBlockID(x+relativeCoords[1].x,y+relativeCoords[1].y,z+relativeCoords[1].z);
        
      //  var part1 = new particlesss(x+relativeCoords[0].x,y+relativeCoords[0].y,z+relativeCoords[0].z);        
       // var part2 = new particlesss(x+relativeCoords[1].x,y+relativeCoords[1].y,z+relativeCoords[1].z);
      //  Updatable.addUpdatable(part1);
      //  UpdatableAPI.addUpdatable(part2);
        if(dwID||upID)return false;
        
        return true;
    };
    this.getTriggers = function(index,x,y,z){
        var relativeCoords = this.getRelativePortalCoords1(index);
        return [[x+relativeCoords[0].x,y+relativeCoords[0].y,z+relativeCoords[0].z],[x+relativeCoords[1].x,y+relativeCoords[1].y,z+relativeCoords[1].z]]
    };
    this.update = function(){
        this.age++;
        if(this.age >100) this.destroy();
        
        this.updateAnimation();
        for(var frame = 0; frame<this.frameMultiplier;frame++){
            this.inBlock = this.checkBlock(Math.floor(this.x),Math.floor(this.y) ,Math.floor(this.z));
            if(this.inBlock){
                this.OnCollisionEnter(this.findSide(this.x,this.y,this.z));
                break;
            }else{
                 this.vy = this.vy-0.00125;
                 this.y += this.vy/this.frameMultiplier;
                 this.x += this.vx/this.frameMultiplier;
                 this.z += this.vz/this.frameMultiplier;
            }  
        }
    }
    
    this.updateAnimation = function(){
        if(this.animation) this.animation.destroy();
        
        var items = PortalManager.getRenderItemsForColor(this.color);
        
        this.animation = new Animation.Item(this.x, this.y, this.z); 
        this.animation.describeItem({
            id: items.ball,
            count: 1,
            data: 0,
            size: 1,
            rotation: [0, Entity.getLookAngle(Player.get()).yaw+Math.PI,0],
            notRandomize: true
        });
        this.animation.load();
    };
    
    this.OnCollisionEnter = function(side){
        alert("collised "+side);
        if(this.hasSpaceForPortal1(side,Math.floor(this.x), Math.floor(this.y),Math.floor (this.z))){
            var trigg = this.getTriggers(side,Math.floor(this.x),Math.floor(this.y),Math.floor(this.z));
            var portal = new inworldPortal(this.color,Math.floor(this.x),Math.floor(this.y),Math.floor(this.z),trigg,side);
            portal.init();
            Updatable.addUpdatable(portal);
        }else{alert("no space")}
        this.destroy();
    };
    this.destroy = function(){
        if(this.animation)this.animation.destroy();
        this.remove = true;
    };
};



function inworldPortal(color,x,y,z,relativeCoords,side){    
    this.x=x; this.y=y; this.z=z;
    this.triggers = relativeCoords; 
    
    this.lifeTime = 0;
    this.side = side;
    this.color = color;
    this.opened = false;
    
    this.bottomAnimation = null;
    this.topAnimation = null;
    this.sideVectors = [[0,-1,0],[0,1,0],[0,0,1],[0,0,-1],[-1,0,0],[1,0,0]];
    
    this.destroy = function(){
        alert("Holy shit!!! Portal destroyed!! "+this.color);
        //World.setBlock(this.x,this.y,this.z,3,0);
        this.close();
        
        if(this.bottomAnimation)this.bottomAnimation.destroy();
        if(this.topAnimation)this.topAnimation.destroy();
        
        this.remove = true;
    };
    
    this.open = function(){
        this.opened = true;
        this.initAnimation();
        alert("portal opened "+this.color);
    };
    this.close = function(){
        this.opened = false;
        this.initAnimation();
        alert("portal closed "+this.color);
    };
    this.getEntity = function(ent){};
    this.update = function(){
        this.lifeTime++;
        var nColor = PortalManager.getInvertedColor(this.color);
        var sPortal = PortalManager.getPortalFromColor(nColor);
        if(sPortal){
            var checkTickRate = 2;
            if(World.getThreadTime()%checkTickRate==0){
                var triggers = this.triggers;
                for(var i in triggers){
                    var trig = triggers[i];
                    var pl = Entity.getPosition(Player.get());
                    var vel = Entity.getVelocity(Player.get());
                    for(var a = -1;a<0;a++){
                        var coords = [Math.floor( pl.x+vel.x),Math.floor(pl.y+vel.y)+a,Math.floor(pl.z+vel.z)];
                        Particles.addFarParticle(7,coords.x,coords.y,coords.z,0,.1,0);
                        if(this.compareCoords(trig,coords)){
                            var pSide = sPortal.side;
                            var addCoords = PortalCoordsHelper.getCoordsAndRotationByIndex(pSide);
                            var newCoords = [sPortal.x+this.sideVectors[pSide][0]+addCoords.coords0[0], 
                                sPortal.y+this.sideVectors[pSide][1]+addCoords.coords0[1], 
                                sPortal.z+this.sideVectors[pSide][2]+addCoords.coords0[2]];
                            var curRot = Entity.getLookAngle(Player.get()); 
                            
                            Entity.setPosition(Player.get(),newCoords[0],newCoords[1]+1,newCoords[2]);
                            Entity.setVelocity(Player.get(),(vel.x+1)*this.sideVectors[pSide][0],(vel.y+1)*this.sideVectors[pSide][1],(vel.z+1)*this.sideVectors[pSide][2]);
                            if(pSide!=0&&pSide!=1){
                                Entity.setLookAngle(Player.get(),addCoords.rot[1],curRot.pitch);
                            }
                            
                        }
                    }
                }
            } 
        }
        
    };
    this.compareCoords = function(coords1,coords2){
      if(coords1[0]==coords2[0]&&coords1[1]==coords2[1]&&coords1[2]==coords2[2]){return true}; 
      return false;
    };
    this.init = function(){
        this.initAnimation();
        PortalManager.setPortal(this.color,this);
    };
    this.initAnimation = function(){
        alert("anim");
        var items = PortalManager.getRenderItemsForColor(this.color);
        var bottomItem = this.opened ? items.bottomOpened : items.bottomClosed;
        var topItem = this.opened ? items.topOpen : items.topClosed;
        
        var coordsData = PortalCoordsHelper.getCoordsAndRotationByIndex(this.side);
        
        if(this.bottomAnimation) this.bottomAnimation.destroy();
        if(this.topAnimation) this.topAnimation.destroy();
        
        this.bottomAnimation = new Animation.Item(this.x+coordsData.coords0[0],this.y+coordsData.coords0[1],this.z+coordsData.coords0[2]);
        this.topAnimation = new Animation.Item(this.x+coordsData.coords1[0],this.y+coordsData.coords1[1],this.z+coordsData.coords1[2]);
        this.bottomAnimation.describeItem({
            id: bottomItem,
            count: 1,
            data: 0,
            size: 1,
            rotation: coordsData.rot,
            notRandomize: true
        });
        this.bottomAnimation.load();  
        this.topAnimation.describeItem({
            id: topItem,
            count: 1,
            data: 0,
            size: 1,
            rotation: coordsData.rot,
            notRandomize: true
        });
        this.topAnimation.load();
    };
}




// file: item.js

IDRegistry.genItemID("portalGun");
Item.createItem("portalGun", "Portal Gun",{name: "portalgunAtlasA", meta: 0},{stack:1});



// file: renderItems.js

IDRegistry.genItemID("blueBall");
Item.createItem("blueBall","portal ball",{name: "portalball_blue", meta: 0},{stack:1});

IDRegistry.genItemID("orangeBall");
Item.createItem("orangeBall","portal ball",{name: "portalball_orange", meta: 0},{stack:1});
//////////////////////////////////////////

//BOTTOM
    //OPEN
IDRegistry.genItemID("portal_blue_open_bottom");
Item.createItem("portal_blue_open_bottom","portal",{name: "portal_blue_open_bottom", meta: 0},{stack:1});

IDRegistry.genItemID("portal_orange_open_bottom");
Item.createItem("portal_orange_open_bottom","portal",{name: "portal_orange_open_bottom", meta: 0},{stack:1});
    //CLOSED
IDRegistry.genItemID("portal_blue_bottom_closed");
Item.createItem("portal_blue_bottom_closed","portal",{name: "portal_blue_bottom_closed", meta: 0},{stack:1});

IDRegistry.genItemID("portal_orange_bottom_closed");
Item.createItem("portal_orange_bottom_closed","portal",{name: "portal_orange_bottom_closed", meta: 0},{stack:1});

//TOP
    //OPEN
IDRegistry.genItemID("portal_blue_top_open");
Item.createItem("portal_blue_top_open","portal",{name: "portal_blue_top_open", meta: 0},{stack:1});

IDRegistry.genItemID("portal_orange_top_open");
Item.createItem("portal_orange_top_open","portal",{name: "portal_orange_top_open", meta: 0},{stack:1});
    //CLOSED
IDRegistry.genItemID("portal_blue_top_closed");
Item.createItem("portal_blue_top_closed","portal",{name: "portal_blue_top_closed", meta: 0},{stack:1});

IDRegistry.genItemID("portal_orange_top_closed");
Item.createItem("portal_orange_top_closed","portal",{name: "portal_orange_top_closed", meta: 0},{stack:1});
//////////////////////////////////////



// file: portalBallItem.js

IDRegistry.genItemID("blueBall");
Item.createItem("blueBall","portal ball",{name: "portalball_blue", meta: 0},{stack:1});

IDRegistry.genItemID("orangeBall");
Item.createItem("orangeBall","portal ball",{name: "portalball_orange", meta: 0},{stack:1});



// file: throwFunction.js

function getDirectionByRadians(yaw, pitch){
    var dir = {};
    dir.x = -Math.sin(yaw) * Math.cos(pitch);
    dir.y = Math.sin(pitch);
    dir.z = Math.cos(yaw) * Math.cos(pitch);
    return dir;
}
Item.registerNoTargetUseFunction("portalGun", function(item) {
    var pos = Entity.getPosition(Player.get());
    var angle = Entity.getLookAngle(Player.get());
    
    var dir = getDirectionByRadians(angle.yaw,angle.pitch);
    
    var spawnX = pos.x + dir.x;
    var spawnY = pos.y + dir.y;
    var spawnZ = pos.z + dir.z; 
    
    var multiplier = 1;
    var color = PortalManager.getColorForPortal();
    
    var ball = new portalBall(color,spawnX,spawnY,spawnZ ,dir.x*multiplier,dir.y*multiplier,dir.z*multiplier);
    Updatable.addUpdatable(ball);
});