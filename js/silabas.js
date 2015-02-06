/**
 * Created by MLK on 25/01/2015.
 */

var Silabas = Silabas || {};

Silabas.acentoTonico = '\u02c8';
Silabas.regexV = new RegExp('(ae|oe|au|æ|œ|a|e|i|o|u|y|ā|ă|ē|ĕ|ī|ĭ|ō|ŏ|ū|ŭ)', 'gi');
Silabas.regexCC = new RegExp('(pl|pr|bl|br|tl|tr|dl|dr|cl|cr|gl|gr|ph|ch|th|rh|ps)', 'gi');
Silabas.regexMacron = new RegExp('(ā|ē|ī|ō|ū)', 'gi');
Silabas.regexBraquia = new RegExp('(ă|ĕ|ĭ|ŏ|ŭ)', 'gi');

Silabas.separar = function(input) {
    var silabas = [];

    var partes = input.split(Silabas.regexV);
    // As vogais estão nos indices ímpares sempre.

    if (partes.length <= 2) {
        silabas.push(input);
    } else {
        var silabaAnterior = partes[0] + partes[1];
        var quGuJaJuntados = false;
        for (var i = 2; i < partes.length; i = i + 2) {


            if (i >= partes.length - 1) { // ùltima sílaba
                silabas.push(silabaAnterior + partes[i]);
                break;
            }

            // # Regra 5 - QU e GU contam como consoante
            if (!quGuJaJuntados && silabaAnterior.search(new RegExp('(gu|qu)', 'gi')) > -1 && partes[i].length == 0) {
                silabaAnterior += partes[i] + partes[i + 1];
                quGuJaJuntados = true;
            } else {
                var consoantes = partes[i];
                if (consoantes.length <= 1) {
                    silabas.push(silabaAnterior);
                    quGuJaJuntados = false;
                    silabaAnterior = partes[i] + partes[i + 1];
                } else {
                    // Regra #4 - P,B,T,D,C,G seguidos de L ou R não se separam e vão com a vogal seguinte.
                    var idxCorte = consoantes.search(Silabas.regexCC);
                    if (idxCorte < 0) {
                        // Regra #3 Quando 2+ consoantes apoiam-se entre 2 vogais, a uiltima vai com a 2a vogal
                        idxCorte = consoantes.length - 1;
                    }

                    var c1 = consoantes.substr(0,idxCorte);
                    var c2 = consoantes.substr(idxCorte);

                    silabas.push(silabaAnterior + c1);
                    quGuJaJuntados = false;
                    silabaAnterior = c2 + partes[i+1];
                }
            }
        }
    }

    return silabas;
}

Silabas.encontrarTonica = function(silabas) {
    if(silabas.length < 1) {
        return silabas;
    }
    if (silabas.length <= 2) {
        silabas[0] = Silabas.acentoTonico + silabas[0];
    } else {
        var penultima = silabas[silabas.length - 2];
        if (penultima.search(Silabas.regexMacron) > -1) {
            silabas[silabas.length - 2] = Silabas.acentoTonico + silabas[silabas.length - 2];
        } else {
            silabas[silabas.length - 3] = Silabas.acentoTonico + silabas[silabas.length - 3];
        }
    }
    return silabas;
}