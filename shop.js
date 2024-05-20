var balllist=["playerBall","black","black","black","black"];
var ballpowerlist=[0,0,0,0,0];
var lifemax=3;
var life=3;
var shield=0;

$(document).ready(function(){
    $("#playerballs li").click(function(){
        var $this=$(this);
        var tabid=$this.data("tab");

        $("#playerballs li, #strong li").removeClass("on");

        $this.addClass("on");
        $("#"+tabid).addClass("on");
    })
    $(".strongpo1").click(function(){
        var par=$(this).parent().parent().attr("id");
        ballpowerlist[par[4]]+=1;
        if(ballpowerlist[par[4]]>=20){
            soldout(par);
        }
        $("#"+par+" .pweapon").text(ballpowerlist[par[4]]+"/20");
    })
    $(".strongpo2").click(function(){
        var par=$(this).parent().parent().attr("id");
        ran = Math.floor((Math.random() * 2) +1);
        if(ran==1){
            ballpowerlist[par[4]]+=2;
        }
        if(ballpowerlist[par[4]]>=20){
            soldout(par);
        }
        $("#"+par+" .pweapon").text(ballpowerlist[par[4]]+"/20");
    })
    $(".strongpo3").click(function(){
        var par=$(this).parent().parent().attr("id");
        ran = Math.floor((Math.random() * 3) +1);
        if(ran==1){
            ballpowerlist[par[4]]+=3;
        }
        if(ballpowerlist[par[4]]>=20){
            soldout(par);
        }
        $("#"+par+" .pweapon").text(ballpowerlist[par[4]]+"/20");
    })
    $(".strongpo4").click(function(){
        var par=$(this).parent().parent().attr("id");
        ran = Math.floor((Math.random() * 4) +1);
        if(ran==1){
            
            ballpowerlist[par[4]]+=4;
        }
        if(ballpowerlist[par[4]]>=20){
            soldout(par);
        }
        $("#"+par+" .pweapon").text(ballpowerlist[par[4]]+"/20");
    })
    $(".ball1").click(function(){
        if($(this).text()=="buy"){
            $(this).text("selet");
        }
        else{
            var par=$(this).parent().parent().attr("id");
            balllist[par[4]]="bullet";
            var img="imgFolder\\"+balllist[par[4]]+".png";
            if($("#"+par+" .ball2").text()=="seleted"){
                $("#"+par+" .ball2").text("selet");
                $("#"+par+" .ball2").attr("disabled",false);
            }
            if($("#"+par+" .ball3").text()=="seleted"){
                $("#"+par+" .ball3").text("selet");
                $("#"+par+" .ball3").attr("disabled",false);
            }
            $(this).text("seleted");
            $(this).attr("disabled",true);
        }
    })
    $(".ball2").click(function(){
        if($(this).text()=="buy"){
            $(this).text("selet");
        }
        else{
            var par=$(this).parent().parent().attr("id");
            balllist[par[4]]="bullet";
            var img="imgFolder\\"+balllist[par[4]]+".png";
            if($("#"+par+" .ball1").text()=="seleted"){
                $("#"+par+" .ball1").text("selet");
                $("#"+par+" .ball1").attr("disabled",false);
            }
            if($("#"+par+" .ball3").text()=="seleted"){
                $("#"+par+" .ball3").text("selet");
                $("#"+par+" .ball3").attr("disabled",false);
            }
            
            $(this).text("seleted");
            $(this).attr("disabled",true);
        }
    })
    $(".ball3").click(function(){
        if($(this).text()=="buy"){
            $(this).text("selet");
        }
        else{
            var par=$(this).parent().parent().attr("id");
            balllist[par[4]]="bullet";
            var img="imgFolder\\"+balllist[par[4]]+".png";
            if($("#"+par+" .ball2").text()=="seleted"){
                $("#"+par+" .ball2").text("selet");
                $("#"+par+" .ball2").attr("disabled",false);
            }
            if($("#"+par+" .ball1").text()=="seleted"){
                $("#"+par+" .ball1").text("selet");
                $("#"+par+" .ball1").attr("disabled",false);
            }
            
            $(this).text("seleted");
            $(this).attr("disabled",true);
        }
    })
    $("#lifeaddition").click(function(){
        if(lifemax==6){
            alert("생명 최대량 증가를 사용할 수 없습니다.");
        }
        else{
            lifemax+=1;
            life+=1;
            $("#lifemax").text("생명 최대량 추가("+(6-lifemax)+"/3)");
        }
    })
    $("#lifepurchase").click(function(){
        if(life>=lifemax){
            alert("생명 최대량 증가를 사용할 수 없습니다.");
        }
        else{
            life+=1;
        }
    })
    $("#shieldpurchase").click(function(){
        if(shield>=2){
            alert("보호막을 더이상 추가 할 수 없습니다.");
        }
        else{
            shield+=1;
            $("#shield").text("보호막("+(2-shield)+"/2)");
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