/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(){
    
    var game = new SinkItScreen();
    
    return { 
        game: function(){ return game; }
    };

};

var screen = new Screen();
