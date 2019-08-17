var Particles = ModAPI.requireGlobal("Particles");
var portalWindow;
var isPortalItem = false;
var containerUIbuttons = new UI.Container();
var currentUIscreen;

var PortalManager = {
    portals:{
        blue:null,
        orange:null
    },
    portalBalls:{
        blue:null,
        orange:null
    },
    content :null,
    currentColor:"blue",
    setPortal:function(color,obj){
        if(this.portals[color])this.portals[color].destroy();
        
        this.portals[color] = obj;
        this.content.elements[color].bitmap = color;
        var invertedColor = this.getInvertedColor(color);
        if(this.portals[invertedColor]){
            this.portals[invertedColor].open();
            this.portals[color].open();
        }
        this.switchColor();
    },
    destroyPortal:function(color){
        if(this.portals[color]){
            this.content.elements[color].bitmap = color+"_closed";
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
        this.currentColor = this.currentColor=="blue"?"orange":"blue";
    },
    getColorForPortal:function(){return this.currentColor},
    getPortalFromColor:function(color){return this.portals[color]},
    getRenderItemsForColor:function(color){
        if(color=="blue"){
            return {
                bottomClosed:ItemID.portal_blue_bottom_closed,
                bottomOpened:ItemID.portal_blue_open_bottom,
                topClosed:ItemID.portal_blue_top_closed,
                topOpen:ItemID.portal_blue_top_open
            }
        }else if(color=="orange"){
            return {
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
                    this.destroyPortal(portal.color);
                    this.currentColor = portal.color;
                }
                if(portal.x==coords.x&&(portal.y-1)==coords.y&&portal.z==coords.z){
                    this.destroyPortal(portal.color);
                    this.currentColor = portal.color;
                }
            }
        }
    }
};
Callback.addCallback("DestroyBlock", function(coords, block, player){PortalManager.blockDestroyFunction(coords, block, player);});