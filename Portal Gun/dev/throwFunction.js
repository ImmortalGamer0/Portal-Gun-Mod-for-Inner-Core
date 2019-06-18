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