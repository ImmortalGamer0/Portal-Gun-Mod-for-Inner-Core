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
        //alert("current color "+this.currentColor);          
        this.currentColor = this.currentColor=="blue"?"orange":"blue";
        //alert("new color " +this.currentColor);
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