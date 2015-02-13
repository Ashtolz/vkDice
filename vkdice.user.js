// ==UserScript==
// @name          vkDice
// @namespace     vkDice by A. Shtolz
// @description   Позволяет бросать дайсы в диалогах вконтакте. roll(3d6+2) - бросить 3 раза шестигранный куб с модификатором 2
// @include       *vk.com/im*
// @version       1.1
// @updateURL     https://github.com/Ashtolz/vkDice/raw/master/vkdice.user.js
// ==/UserScript==


function replaceAll(){
  for(var i = 0; i < document.getElementsByClassName('im_log_t').length; i++){
    var im_table = document.getElementsByClassName('im_log_t')[i];
    var im_tbody = im_table.childNodes[0];
    //out
    for(var j = 0; j < im_tbody.getElementsByClassName('im_out').length; j++){
      var im_msg = im_tbody.getElementsByClassName('im_out')[j];
      var im_date = im_msg.getAttribute("data-date")*1;
      var im_text_elem = im_msg.getElementsByClassName('im_msg_text')[0];
      var im_text = im_text_elem.innerHTML;
      var d1 = im_date%100;
      var d2 = (im_date/1000)%100;
      var d3 = (im_date/1000000)%100;
      im_text_elem.innerHTML = generate(im_text,[d1,d2,d3]);
      im_msg.className = 'im_out_dice_done';
    }
    for(var j = 0; j < im_tbody.getElementsByClassName('im_in').length; j++){
      var im_msg = im_tbody.getElementsByClassName('im_in')[j];
      var im_date = im_msg.getAttribute("data-date")*1;
      var im_text_elem = im_msg.getElementsByClassName('im_msg_text')[0];
      var im_text = im_text_elem.innerHTML;
      var d1 = im_date%100;
      var d2 = (im_date/1000)%100;
      var d3 = (im_date/1000000)%100;
      im_text_elem.innerHTML = generate(im_text,[d1,d2,d3]);
      im_msg.className = 'im_out_dice_done';
    }
  }
}

function generate(txt,times){
 // var txt = 'roll(1d5+2) roll(1d3+3)';
 var ccc = 0;
  for(var i = 0; i < txt.length; i++){
    if(txt.substr(i,5)=='roll('){
      var temps = '';
      ccc++;
      for(var j = i+5; j < txt.length; j++){
        if(txt.substr(j,1)==')'){
          i += j;
          break;
        }else{
          temps+=txt.substr(j,1);
        }
      }
      var count;//колво бросаний
      var faces;//граниtimes
      var mod;//модификатор
      
      if(temps.split('d').length ==2 ){
        
        if(isNaN(temps.split('d')[0]*1)==false){
          count = temps.split('d')[0]*1;
        }
        
        if(isNaN(temps.split('d')[1].split('+')[0]*1)==false){
          faces = temps.split('d')[1].split('+')[0]*1;
        }else{
          faces = 6;
        }
        
        if(isNaN(temps.split('d')[1].split('+')[1]*1)==false){
          mod = temps.split('d')[1].split('+')[1]*1;
        }else{
          mod = 0;
        }
        var rept = '<span class="replaceddice">';
        rept += '<span class="dicecond">'+count+"x"+faces+"+"+mod+'=</span>';
        if(count == 1){
          var tccc = Math.ceil(rand(times[0]*(ccc+1),times[1]*(ccc+1),times[2]*(ccc+1))*1000)%faces+1+mod;
          rept += '<span class="dice">'+tccc+'</span>';
        }else{
          var tcr = 0;
          for(var l = 0; l < count; l++){
            var tcc = Math.ceil(rand(times[0]*(ccc+1)*(l+2),times[1]*(ccc+1)*(l+3),times[2]*(ccc+1)*(l+1))*1000)%faces+1+mod;
            tcr += tcc;
            rept += '<span class="dice">'+tcc+'</span>';
            if(l!=count-1){
              rept += '<span class="plus">'+'+'+'</span>';
            }else{
              rept += '<span class="equal">'+'='+tcr+'</span>';
            }
          }
        }
        rept += '</span>';
        txt = txt.replace(temps,rept);
      }
    }
  }
  return txt;
}

function rand(a,b,c){
  var r = a*b + b*c + c*a + a*b*c + (b-a) + (a-b)+(c-a);
  r = r%100;
  r = r/100;
  return r;
}

function appendStyle(){
  var s = document.createElement('style');
  s.innerHTML = '.dicecond{ color: grey; }';
  s.innerHTML+= '.dice{ color: green; font-weight: bold;}';
  s.innerHTML+= '.im_out_dice_done{ cursor: pointer;}';
  s.innerHTML+= '.equal{ color: green;font-weight: bold;}';
  document.head.appendChild(s);
}
appendStyle();
setInterval(replaceAll, 1000);