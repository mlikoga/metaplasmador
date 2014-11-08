// Classe Regra
function Regra(origem, destino) {
    this.origem = origem;
    this.destino = destino;
}

Regra.EMPTY_CHAR = '#';
Regra.CJ_START = '\{';
Regra.CJ_END   = '\}';

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
    if (typeof conjuntos !== 'undefined') {
        var cjIdx = origemAux.search(Regra.CJ_START);
        while (cjIdx > 0) {
            var cjIdx2 = origemAux.search(Regra.CJ_END);
            var cjNome = origemAux.substring(cjIdx + 1, cjIdx2);
            var cj = conjuntos[cjNome];
            origemAux = origemAux.substr(cjIdx2 + 2);
            var cjRegex = '' + cj;
            cjRegex = cjRegex.replace(new RegExp(',', 'g'), '');
            patternPrefix += '[' + cjRegex + ']';
        }
    }

    // O que sobrou da origem é o core
    patternCore = origemAux;
    var regex = new RegExp(patternPrefix + patternCore + patternSuffix, 'g');
    console.log(regex);
    var output = input.replace(regex, this.destino);
    return output;
}