Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
function rotateVel(secondPortalIndex,vx,vy,vz){
    var vel = {x:vx, y:vy, z:vz};
    switch(parseInt(secondPortalIndex)){
        case 1:  
            vel.y = -vy;
            break;
        case 2: 
        vel.z = -vy;
        vel.y = vz;
            break;
        case 3:
        vel.z = vy;
        vel.y = vz; 
            break;
        case 4:
        vel.x = vy;
        vel.y = vx;
            break;
        case 5:
        vel.x = -vy;
        vel.y = vx;
            break;
    };return vel;
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
    
    this.emitter = null;
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
                return [{x:-1,y:-1,z:0},{x:0,y:-1,z:0}];
            case BlockSide.UP:
              return [{x:0,y:1,z:0},{x:-1,y:1,z:0}];
            case BlockSide.WEST: 
               return [{x: -1, y:0, z:0},{x: -1, y:-1, z:0}];
            case BlockSide.EAST:
              return [{x:1,y:0,z:0},{x:1,y:-1,z:0}];
            case BlockSide.NORTH:
                return [{x:0,y:0,z:1},{x:0,y:-1,z:1}];
            case BlockSide.SOUTH: 
                return [{x:0,y:0,z:-1},{x:0,y:-1,z:-1}];
        }
    }; 
    this.hasSpaceForPortal = function(index,x,y,z){
        var relativeCoords = this.getRelativePortalCoords1(index);
        var upID = World.getBlockID(x+relativeCoords[0].x,y+relativeCoords[0].y,z+relativeCoords[0].z);
        var dwID = World.getBlockID(x+relativeCoords[1].x,y+relativeCoords[1].y,z+relativeCoords[1].z);
         
        if(dwID||upID)return false;
        
        return true;
    };
    this.getTriggers = function(index,x,y,z){
        var relativeCoords = this.getRelativePortalCoords1(index);
        return [[x+relativeCoords[0].x,y+relativeCoords[0].y,z+relativeCoords[0].z],[x+relativeCoords[1].x,y+relativeCoords[1].y,z+relativeCoords[1].z]]
    };
    this.init = function(){
        var part = this.color == "orange" ? particleOrange : particleBlue;
        this.emitter = Particles.ParticleEmitter(this.x,this.y, this.z);
        this.emitter.emit(part, 0, this.emitter.getPosition().x, this.emitter.getPosition().y, this.emitter.getPosition().z);
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
        if(this.emitter){
            this.emitter.moveTo(this.x, this.y, this.z);
        }
    };
    
    this.OnCollisionEnter = function(side){
        if(this.hasSpaceForPortal(side,Math.floor(this.x), Math.floor(this.y),Math.floor (this.z))){
            var trigg = this.getTriggers(side,Math.floor(this.x),Math.floor(this.y),Math.floor(this.z));
            var portal = new inworldPortal(this.color,Math.floor(this.x),Math.floor(this.y),Math.floor(this.z),trigg,side);
            portal.init();
            Updatable.addUpdatable(portal);
        }
        this.destroy();
    };
    this.destroy = function(){
        PortalManager.portalBalls[this.color] = null;
        this.emitter.moveTo(0, -1, 0);
        this.remove = true;  
    };
};



function inworldPortal(color,x,y,z,relativeCoords,side){    
    this.x=x; this.y=y; this.z=z;
    this.triggers = relativeCoords; 
    
    this.timeForTeleport = 0;
    this.side = side;
    this.color = color;
    this.opened = false;
    
    this.bottomAnimation = null;
    this.topAnimation = null;
    this.sideVectors = [[0,-1,0],[0,1,0],[0,0,1],[0,0,-1],[-1,0,0],[1,0,0]];  
    
    this.destroy = function(){
        this.close();
        
        if(this.bottomAnimation)this.bottomAnimation.destroy();
        if(this.topAnimation)this.topAnimation.destroy();
        
        this.remove = true;
    };
    
    this.open = function(){
        this.opened = true;
        this.initAnimation();
    };
    this.close = function(){
        this.opened = false;
        this.initAnimation();
    };
    this.getEntity = function(ent){};
    this.update = function(){
        if(this.timeForTeleport>0){
            this.timeForTeleport--;
            return null;
        }
        var nColor = PortalManager.getInvertedColor(this.color);
        var sPortal = PortalManager.getPortalFromColor(nColor);
        if(sPortal){
            var checkTickRate = 1;
            if(World.getThreadTime()%checkTickRate==0){
                var triggers = this.triggers;
                for(var i in triggers){
                    var trig = triggers[i];
                    var pl = Entity.getPosition(Player.get());
                    var vel = Entity.getVelocity(Player.get());
                    for(var a = -1;a<1;a++){
                        var coords = [Math.floor( pl.x+vel.x),Math.floor(pl.y+vel.y)+a,Math.floor(pl.z+vel.z)];
                        Particles.addFarParticle(7,coords.x,coords.y,coords.z,0,.1,0);
                        if(this.compareCoords(trig,coords)){
                            var pSide = sPortal.side;
                            
                            var addCoords = PortalCoordsHelper.getCoordsAndRotationByIndex(pSide);
                            var newCoords = [sPortal.x+this.sideVectors[pSide][0]+addCoords.coords0[0], 
                                sPortal.y+this.sideVectors[pSide][1]+addCoords.coords0[1], 
                                sPortal.z+this.sideVectors[pSide][2]+addCoords.coords0[2]];
                            var curRot = Entity.getLookAngle(Player.get());
                            //TELEPORTING
                            Entity.setPosition(Player.get(),newCoords[0],newCoords[1]+1,newCoords[2]);
                            if(this.side==1){
                                var newVel = rotateVel(pSide,vel.x,vel.y,vel.z);
                                Entity.setVelocity(Player.get(),newVel.x,newVel.y,newVel.z);
                            }else{
                                var constantForce = 1;
                                Entity.setVelocity(Player.get(),(vel.x+constantForce)*this.sideVectors[pSide][0],(vel.y+constantForce)*this.sideVectors[pSide][1],(vel.z+constantForce)*this.sideVectors[pSide][2]);
                            }
                            if(pSide!=0&&pSide!=1){
                                Entity.setLookAngle(Player.get(),addCoords.rot[1],curRot.pitch);
                            }
                            sPortal.timeForTeleport = 10;
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
