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
    if (typeof _conjuntos !== 'undefined') {
        var cjIdx = origemAux.search(Regra.CJ_START);
        while (cjIdx >= 0) {
            var cjIdx2 = origemAux.search(Regra.CJ_END);
            var cjNome = origemAux.slice(cjIdx + 1, cjIdx2);
            var cj = _conjuntos[cjNome];
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
    var regex = new RegExp(patternPrefix + patternCore + patternSuffix);

    // Substituição
    var regexIdx = input.search(regex);
    if (regexIdx >= 0) { // Verifica se essa regra se aplica ou não
        var inputLeft = input; // input a ser lido
        var output = '';
        while (regexIdx >= 0) {
            output += inputLeft.substring(0, regexIdx); // output recebe inicio do input
            var match = inputLeft.match(regex)[0]; // pega trecho do input que interessa
            match = match.slice(0, match.search(patternCore) + patternCore.length); // Corta contexto fora
            output += match.replace(patternCore, this.destino); // realiza a substituição
            inputLeft = inputLeft.substr(regexIdx + match.length); // atualiza input a ser lido
            regexIdx = inputLeft.search(regex); // procura se existem mais aplicações para a regra
        }
        output += inputLeft; // output recebe restante do input
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