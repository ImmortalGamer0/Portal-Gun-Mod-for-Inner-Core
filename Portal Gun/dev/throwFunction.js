function getDirectionByRadians(yaw, pitch){
    var dir = {};
    dir.x = -Math.sin(yaw) * Math.cos(pitch);
    dir.y = Math.sin(pitch);
    dir.z = Math.cos(yaw) * Math.cos(pitch);
    return dir;
};
function throwF(color){
    if(!PortalManager.portalBalls[color]){
        PortalManager.destroyPortal(color);
        var pos = Entity.getPosition(Player.get());
        var angle = Entity.getLookAngle(Player.get());
        
        var dir = getDirectionByRadians(angle.yaw,angle.pitch);
        
        var spawnX = pos.x + dir.x;
        var spawnY = pos.y + dir.y;
        var spawnZ = pos.z + dir.z; 
        
        var multiplier = 1;
        
        var ball = new portalBall(color,spawnX,spawnY,spawnZ ,dir.x*multiplier,dir.y*multiplier,dir.z*multiplier);
        ball.init();
        PortalManager.portalBalls[color] = ball;
        Updatable.addUpdatable(ball);
    }
};
portalWindow = new UI.Window({
    location: {
        x: 430,
        y: 404 ,
        width: 120,
        height: 60
    },
    drawing: [{type: "background", color: 0}],
    elements: {
        blue: {
            y: 0,
            x:0,
            type: "button",
            bitmap: "blue_closed",
            scale:17,
            clicker: {
                onClick: function(){
                    throwF("blue");
                }
            }
        },
         orange: {
            x: 500,
            y:0,
            type: "button",
            bitmap: "orange_closed",
            scale: 17,
            clicker: {
                onClick: function(){
                    throwF("orange");
                }
            }
        }
    }
});
Callback.addCallback("NativeGuiChanged", function(screenName){
    currentUIscreen = screenName;
});

Callback.addCallback("tick", function(){
    //Не бейте, когда я писал это, то был особенно упорот.
    var close = false;
     if(Player.getCarriedItem().id==ItemID.portalGun){
        if(currentUIscreen == "hud_screen" || currentUIscreen == "in_game_play_screen"){
            if(!containerUIbuttons.isOpened()){
                containerUIbuttons.openAs(portalWindow);
                PortalManager.content = containerUIbuttons.getGuiContent();
            }
            //containerUIbuttons = new UI.Container();
            
        }else{ close = true}
     }else{ close = true;}
      
     if(close){
        containerUIbuttons.close();
        //containerUIbuttons = null;
        //PortalManager.content = null;
      }
});
