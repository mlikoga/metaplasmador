// Classe Cadeia
function Cadeia(str, silabas) {
    this.str = str;
    if (silabas == undefined) {
        this.silabas = [ new Silaba(str) ];
    } else {
        this.silabas = silabas;
    }
    this.index = 0;
}

Cadeia.prototype.toString = function() {
    return this.str;
};

Cadeia.prototype.equals = function(other) {
    return this.str == other.str;
}

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

    // Tonicidade
    this.tonicidade = Regra.TIPOS.QUALQUER;
    var tonIdx = origemAux.search(Regra.ATONA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.ATONA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.ATONA.length);
    }
    tonIdx = origemAux.search(Regra.TONICA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.TONICA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.TONICA.length);
    }
    tonIdx = origemAux.search(Regra.PRETONICANAOIMEDIATA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.PRETONICANAOIMEDIATA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.PRETONICANAOIMEDIATA.length);
    }
    tonIdx = origemAux.search(Regra.POSTONICANAOIMEDIATA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.POSTONICANAOIMEDIATA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.POSTONICANAOIMEDIATA.length);
    }
    tonIdx = origemAux.search(Regra.PRETONICAIMEDIATA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.PRETONICAIMEDIATA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.PRETONICAIMEDIATA.length);
    }
    tonIdx = origemAux.search(Regra.POSTONICAIMEDIATA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.POSTONICAIMEDIATA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.POSTONICAIMEDIATA.length);
    }
    tonIdx = origemAux.search(Regra.PRETONICA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.PRETONICA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.PRETONICA.length);
    }
    tonIdx = origemAux.search(Regra.POSTONICA);
    if (tonIdx > -1) {
        this.tonicidade = Regra.TIPOS.POSTONICA;
        origemAux = origemAux.cut(tonIdx, tonIdx + Regra.POSTONICA.length);
    }

    // O que sobrou da origem é o core
    this.patternCore = origemAux;
    this.regex = new RegExp(patternPrefix + this.patternCore + patternSuffix);
}

Regra.EMPTY_CHAR = '#';
Regra.CJ_START = '\{';
Regra.CJ_END   = '\}';
Regra.TONICA = '\u02c8';
Regra.ATONA = 'º';
Regra.PRETONICA = '-';
Regra.POSTONICA = '~';
Regra.PRETONICAIMEDIATA = '-!';
Regra.POSTONICAIMEDIATA = '~!';
Regra.PRETONICANAOIMEDIATA = '--';
Regra.POSTONICANAOIMEDIATA = '~~';

Regra.TIPOS = {
    QUALQUER: 0,
    ATONA: 1,
    PRETONICA: 2,
    POSTONICA: 3,
    PRETONICAIMEDIATA: 4,
    POSTONICAIMEDIATA: 5,
    PRETONICANAOIMEDIATA: 6,
    POSTONICANAOIMEDIATA: 7
}

Regra.prototype.checarTonicidade = function (input, silabaIdx) {

    var ehAplicavel = false;
    var silaba = input.silabas[silabaIdx];
    var tonicaIdx = 0; // Marca indice da silaba tonica
    for (var i=0; i < input.silabas.length; i++) {
        if (input.silabas[i].tonica) {
            tonicaIdx = i;
            break;
        }
    }
    switch(this.tonicidade) {
        case Regra.TIPOS.QUALQUER:
            ehAplicavel = true;
            break;
        case Regra.TIPOS.ATONA:
            ehAplicavel = (silaba.tonica == false);
            break;
        case Regra.TIPOS.TONICA:
            ehAplicavel = (silaba.tonica == true);
            break;
        case Regra.TIPOS.PRETONICA:
            ehAplicavel = (silaba.tonica == false && silabaIdx < tonicaIdx);
            break;
        case Regra.TIPOS.POSTONICA:
            ehAplicavel = (silaba.tonica == false && silabaIdx > tonicaIdx);
            break;
        case Regra.TIPOS.PRETONICAIMEDIATA:
            ehAplicavel = (silaba.tonica == false && silabaIdx + 1 == tonicaIdx);
            break;
        case Regra.TIPOS.POSTONICAIMEDIATA:
            ehAplicavel = (silaba.tonica == false && silabaIdx - 1 == tonicaIdx);
            break;
        case Regra.TIPOS.PRETONICANAOIMEDIATA:
            ehAplicavel = (silaba.tonica == false && silabaIdx + 1 < tonicaIdx);
            break;
        case Regra.TIPOS.POSTONICANAOIMEDIATA:
            ehAplicavel = (silaba.tonica == false && silabaIdx - 1 > tonicaIdx);
            break;
        default:
            ehAplicavel = true;
    }

    return ehAplicavel;
}

Regra.prototype.aplicar = function (input) {

    // Substituição
    var inputLeft = input.str; // input a ser lido
    var silabas = input.silabas;
    var output = new Cadeia('');
    var regexIdx = input.str.search(this.regex);
    var numMudancas = 0;
    while (regexIdx >= 0 && numMudancas < input.str.length) { // Verifica se essa regra se aplica ou não
        output.str += inputLeft.substring(0, regexIdx); // output recebe inicio do input que não foi modificado
        var strMatch = inputLeft.match(this.regex)[0]; // pega trecho do input que interessa
        var coreIdx = strMatch.search(this.patternCore); // pega indice do core (ATENCAO: aqui dá erro se prefixo contiver o core)
        var silabaIdx = Silabas.encontrarSilabaIdx(silabas, output.str.length + coreIdx);
        strMatch = strMatch.slice(0, coreIdx + this.patternCore.length); // Corta contexto (sufixo) fora
        if (this.checarTonicidade(input, silabaIdx)) {
            silabas[silabaIdx].str = silabas[silabaIdx].str.replace(this.patternCore, this.destino); // realiza a substituição nas silabas
            output.str += strMatch.replace(this.patternCore, this.destino); // realiza a mesma substituição na string
        } else {
            output.str += strMatch; // Não realiza substituição.
        }
        inputLeft = inputLeft.substr(regexIdx + strMatch.length); // atualiza input a ser lido
        regexIdx = inputLeft.search(this.regex); // procura se existem mais aplicações para a regra
        numMudancas++;
    }
    if (numMudancas == input.str.length) {
        console.error("LOOP INFINITO!! Regra: " + this.toString() + " Input: " + input);
    }
    output.str += inputLeft; // output recebe restante do input
    output.silabas = silabas;
    if (numMudancas > 0) {
        console.log(this + "\t" + output);
    }
    return output;

};

// Override
Regra.prototype.toString = function() {
    return this.origem + " > " + this.destino;
};

// Corta trecho de string. i0 inclusive até i1 exclusivo.
String.prototype.cut= function(i0, i1) {
    return this.substring(0, i0)+this.substring(i1);
};