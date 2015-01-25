/**
 * Created by MLK on 25/01/2015.
 */


var C = ['b','c','d','r'];
var V = ['a','e','i','o','u','y'];
var regexV = new RegExp('(ae|oe|au|a|e|i|o|u|y)', 'gi');
var DITONGOS = ['ae','oe','au'];

var separar = function(input) {
    var silabas = [];

    var partes = input.split(regexV);
    // As vogais estão nos indices ímpares sempre.

    if (partes.length <= 2) {
        silabas.push(input);
    } else {
        var silabaAnterior = partes[0] + partes[1];
        for (var i = 2; i < partes.length; i = i + 2) {
            var consoantes = partes[i];

            if (i >= partes.length - 1) { // ùltima sílaba
                silabas.push(silabaAnterior + partes[i]);
                break;
            }

            if (consoantes.length <= 1) {
                silabas.push(silabaAnterior);
                silabaAnterior = partes[i] + partes[i + 1];
            } else {
                var metade = Math.floor(consoantes.length / 2);
                // Regra #3 Quando 2+ consoantes apoiam-se entre 2 vogais, a uiltima vai com a 2a vogal
                var c1 = consoantes.substr(0,consoantes.length-1);
                var c2 = consoantes[consoantes.length - 1];
                silabas.push(silabaAnterior + c1);
                silabaAnterior = c2 + partes[i+1];
            }
        }
    }


    return silabas;
}