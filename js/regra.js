// Classe Regra
function Regra(origem, destino) {
    this.origem = origem;
    this.destino = destino;
}

Regra.EMPTY_CHAR = '#';
Regra.CJ_START = '{';
Regra.CJ_END   = '}';

Regra.prototype.aplicar = function (input) {
    var patternPrefix = '';
    var patternCore = '';
    var patternSuffix = '';
    var origemAux = this.origem;

    // Simbolo #
    if (origemAux[0] == Regra.EMPTY_CHAR) {
        origemAux = origemAux.substr(1);
        patternPrefix = '^' + patternPrefix;
    }
    if (origemAux[origemAux.length - 1] == Regra.EMPTY_CHAR) {
        origemAux = origemAux.substr(0, origemAux.length - 1);
        patternSuffix = patternSuffix + '$';
    }

    // Conjuntos
    

    // O que sobrou da origem é o core
    patternCore = origemAux;
    var regex = new RegExp(patternPrefix + patternCore + patternSuffix, 'g');
    var output = input.replace(regex, this.destino);
    return output;
}