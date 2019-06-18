IDRegistry.genItemID("endDust");
Item.createItem("endDust", "Ender Pearl Dust",{name: "enderPearlDust", meta: 0},{});
Translation.addTranslation("Ender Pearl Dust", {ru: "Пыль жемчуга края"});
Recipes.addFurnace(368, ItemID.endDust, 0);

IDRegistry.genItemID("minBlackWhole");
Item.createItem("minBlackWhole", "Miniature Black Hole",{name: "miniBlackHole", meta: 0},{});
Translation.addTranslation("Miniature Black Hole", {ru: "Миниатюрная черная дыра"});

IDRegistry.genItemID("portalGun");
Item.createItem("portalGun", "Portal Gun",{name: "portalgunAtlasA", meta: 0},{stack:1});
Translation.addTranslation("Portal Gun", {ru: "Переносное устройство создания порталов"});
var mes = "Руководствуясь опциональным пунктом протокола тестирования, мы рады сообщить вам занимательный факт: теперь устройство стоит дороже, чем годовой доход и внутренние органы всех жителей в городе";
Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: 368 , count:1 , data: 0}, [
         "xxx",
         "xxx",
         "xxx"
        ], ['x',ItemID.endDust,0]);
     Recipes.addShaped({id: ItemID.minBlackWhole , count:1 , data: 0}, [
      "xxx",
      "xsx",
      "xxx"
     ], ['x',ItemID.endDust,0,'s',399,0]);
    Recipes.addShaped({id: ItemID.portalGun , count:1 , data: 0}, [
         "xyy",
         "asy",
         "yxy"
        ], ['y',265, 0,'x',49,0,'a',264,0,'s',ItemID.minBlackWhole,0], function(api, field, result){
    Game.message(mes);  
    });
});
