// Classe Cadeia
function Cadeia(str, silabas) {
    this.strOriginal = str;
    this.str = str;
    this.silabas = silabas;
    this.index = 0;
}

Cadeia.prototype.toString = function() {
    return this.str;
};

Cadeia.prototype.imprimir = function() {
    var str = '';
    for (var i = 0; i < this.silabas.length; i++) {
        if (this.silabas[i].tonica) {
            str += Silabas.acentoTonico;
        }
        str += this.silabas[i].str;
    }
    return str;
}

// Classe Regra
function Regra(origem, destino) {
    this.origem = origem;
    this.destino = destino;

    var patternPrefix = '';
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
    this.patternCore = origemAux;
    this.regex = new RegExp(patternPrefix + this.patternCore + patternSuffix);
}

Regra.EMPTY_CHAR = '#';
Regra.CJ_START = '\{';
Regra.CJ_END   = '\}';

Regra.prototype.verificar = function (input) {
    var auxInput = input.strOriginal;

    var regexIdx = auxInput.search(this.regex);
    if (regexIdx >= 0) {
        var match = auxInput.match(this.regex)[0];
        var coreIdx = match.search(this.patternCore);
        if (regexIdx + coreIdx == input.index) {
            return true;
        }
    }
    return false;
}

Regra.prototype.aplicar = function (input) {

    // Substituição
    var regexIdx = input.str.search(this.regex);
    if (regexIdx >= 0) { // Verifica se essa regra se aplica ou não
        var inputLeft = input.str; // input a ser lido
        var silabas = input.silabas;
        var output = new Cadeia('');
        while (regexIdx >= 0) {
            output.str += inputLeft.substring(0, regexIdx); // output recebe inicio do input
            var strMatch = inputLeft.match(this.regex)[0]; // pega trecho do input que interessa
            var coreIdx = strMatch.search(this.patternCore); // pega indice do core (ATENCAO: aqui dá erro se prefixo contiver o core)
            strMatch = strMatch.slice(0, coreIdx + this.patternCore.length); // Corta contexto (sufixo) fora
            output.str += strMatch.replace(this.patternCore, this.destino); // realiza a substituição na string
            if (silabas != undefined) { // realiza a mesma substituição nas silabas
                var silabaIdx = Silabas.encontrarSilabaIdx(silabas, coreIdx);
                silabas[silabaIdx].str = silabas[silabaIdx].str.replace(this.patternCore, this.destino);
            }
            inputLeft = inputLeft.substr(regexIdx + strMatch.length); // atualiza input a ser lido
            regexIdx = inputLeft.search(this.regex); // procura se existem mais aplicações para a regra
        }
        output.str += inputLeft; // output recebe restante do input
        output.silabas = silabas;
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