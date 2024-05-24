var ball="playerBall";
var lifemax=3;
var shield=0;
var parringtime=1;
var explosionrange=0;
var reloadtime=0;
var stealth=false;

$(document).ready(function(){
    $(".bullet").click(function(){
        if($(this).text()=="buy"){
            $(this).text("select");
        }
        else{
            ball="bullet";
            if($(".cannon").text()=="selected"){
                $(".cannon").text("select");
                $(".cannon").attr("disabled",false);
            }
            if($(".lazer").text()=="selected"){
                $(".lazer").text("select");
                $(".lazer").attr("disabled",false);
            }
            $(this).text("selected");
            $(this).attr("disabled",true);
        }
    })
    $(".cannon").click(function(){
        if($(this).text()=="buy"){
            $(this).text("select");
        }
        else{
            ball="canon";
            if($(".bullet").text()=="selected"){
                $(".bullet").text("select");
                $(".bullet").attr("disabled",false);
            }
            if($(".lazer").text()=="selected"){
                $(".lazer").text("select");
                $(".lazer").attr("disabled",false);
            }
            
            $(this).text("selected");
            $(this).attr("disabled",true);
        }
    })
    $(".lazer").click(function(){
        if($(this).text()=="buy"){
            $(this).text("select");
        }
        else{
            ball="lazer";
            if($(".cannon").text()=="selected"){
                $(".cannon").text("select");
                $(".cannon").attr("disabled",false);
            }
            if($(".bullet").text()=="selected"){
                $(".bullet").text("select");
                $(".bullet").attr("disabled",false);
            }
            
            $(this).text("selected");
            $(this).attr("disabled",true);
        }
    })
    $("#lifeaddition").click(function(){
        lifemax+=1;
        PLAYER_HEART+=100;
        $("#lifemax").text("생명 최대량 추가("+(6-lifemax)+"/3)");
        if(lifemax==6){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#lifepurchase").click(function(){
        if(PLAYER_HEART+100>lifemax){
            PLAYER_HEART+=lifemax;
        }
        else{
            PLAYER_HEART+=100;
        }
        if(PLAYER_HEART>=lifemax){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#shieldpurchase").click(function(){
        shield+=1;
        $("#shield").text("보호막("+(2-shield)+"/2)");
        if(shield>=2){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#parringtime").click(function(){
        parringtime=Math.floor((parringtime+0.2)*10)/10;
        $("#parring").html("패링시간<br>0.2초 증가<br>(현재: "+parringtime+"초)");
        if(parringtime>=2.5){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#explosionrange").click(function(){
        explosionrange+=1;
        BALL_EXPLOTION_RAD+=4;
        $("#explosion").html("폭발 범위<br>증가<br>(현재:"+explosionrange+"강)");
        if(explosionrange>=5){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#reloadtime").click(function(){
        reloadtime+=1;
        $("#reload").html("재장전 시간<br> 1초 감소<br>(현재: "+((10-reloadtime)/10)+"초)");
        if(reloadtime>=5){
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
    })
    $("#stealthpurchase").click(function(){
        if(stealth==false){
            $("#stealth").html("은신 기능<br>(0/1)");
            $(this).text("sold out");
            $(this).attr("disabled",true);
        }
        else{
            $("#stealth").html("은신 기능<br>(1/1)");
        }
    })
})

function soldout(par){
    for(var i=1; i<=4; i++){
        var id="#"+par+" .strongpo"+i;
        $(id).text("sold out");
        $(id).attr("disabled",true);
    }
}