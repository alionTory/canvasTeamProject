var ball="playerBall";
var lifemax=0;
var explosionrange=0;

$(document).ready(function(){
    $(".bullet").text("selected");
    $(".bullet").attr("disabled",true);
    $(".bullet").click(function(){
        ball="bullet";
        game.selectBall(0);
        $(this).text("selected");
        $(this).attr("disabled",true);
    })
    $(".cannon").click(function(){
        if($(this).text()=="1000g"){
            if(game.coin>=1000){
                $(this).text("select");
                game.coin-=1000;
                $(".money").text(game.coin+"g");
            }
       }
        else{
            ball="cannon";
            game.selectBall(1);
            $(this).text("selected");
            $(this).attr("disabled",true);
        }
    })
    $(".lazer").click(function(){
        if($(this).text()=="1000g"){
            if(game.coin>=1000){
                $(this).text("select");
                game.coin-=1000;
                $(".money").text(game.coin+"g");
            }
        }
        else{
            ball="lazer";
            game.selectBall(2);
            $(this).text("selected");
            $(this).attr("disabled",true);
        }
    })
    $("#lifeaddition").click(function(){
        if(game.coin>=1000){
            lifemax+=1;
            $("#lifemax").text("생명 최대량 추가("+(3-lifemax)+"/3)");
            buy_maxHealth(lifemax);
            if(lifemax==3){
                $(this).text("sold out");
                $(this).attr("disabled",true);
            }
            game.coin-=1000;
            $(".money").text(game.coin+"g");
        }
    })
    $("#lifepurchase").click(function(){
        if(game.coin>=500){
            buy_regeneration();
            game.coin-=500;
            $(".money").text(game.coin+"g");
        }
    })
    $("#shieldpurchase").click(function(){
        if(game.coin>=2000){
            buy_shield();
            game.coin-=2000;
            $(".money").text(game.coin+"g");
        }
    })
    $("#parringtime").click(function(){
        if(game.coin>=500){
            buy_parryCool();
            game.coin-=500;
            $(".money").text(game.coin+"g");
        }
    })
    $("#explosionrange").click(function(){
        if(game.coin>=500){
            buy_explodeUp();
            game.coin-=500;
            $(".money").text(game.coin+"g");
        }
    })
    $("#reloadtime").click(function(){
        if(game.coin>=1000){
            buy_reloadCool();
            game.coin-=1000;
            $(".money").text(game.coin+"g");
        }
    })
    $("#stealthpurchase").click(function(){
        if(game.coin>=2000){
            buy_hidingSkill();
            game.coin-=2000;
            $(".money").text(game.coin+"g");
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