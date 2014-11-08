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
    var patternCore;
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
        while (cjIdx >= 0) {
            var cjIdx2 = origemAux.search(Regra.CJ_END);
            var cjNome = origemAux.substring(cjIdx + 1, cjIdx2);
            var cj = conjuntos[cjNome];
            var cjRegex = '' + cj;
            cjRegex = cjRegex.replace(new RegExp(',', 'g'), '');
            origemAux = origemAux.cut(cjIdx, cjIdx2+1);

            if (cjIdx == 0) { // Conjunto está antes
                patternPrefix += '[' + cjRegex + ']';
            } else {
                patternSuffix += '[' + cjRegex + ']';
            }
            cjIdx = origemAux.search(Regra.CJ_START);
        }
    }

    // O que sobrou da origem é o core
    patternCore = origemAux;
    var regex = new RegExp(patternPrefix + patternCore + patternSuffix, 'i');

    // Substituição
    var regexIdx = input.search(regex);
    if (regexIdx >= 0) { // Verifica se essa regra se aplica ou não
        var inputLeft = input; // input a ser lido
        var output = '';
        while (regexIdx >= 0) {
            output += inputLeft.substring(0, regexIdx);
            var match = inputLeft.match(regex)[0];
            output += match.replace(patternCore, this.destino);
            inputLeft = inputLeft.substr(regexIdx + match.length);
            regexIdx = inputLeft.search(regex);
        }
        output += inputLeft;
        console.log(this + ": " + output);
        return output;
    }
    return input;
};

Regra.prototype.toString = function() {
    return this.origem + " > " + this.destino;
};

String.prototype.cut= function(i0, i1) {
    return this.substring(0, i0)+this.substring(i1);
};