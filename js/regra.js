// Classe Regra
function Regra(origem, destino) {

    // Inicialização dos mebros da classe
    this.origem = origem;
    this.patternCore = '';
    this.tonicidade = Regra.TIPOS.QUALQUER;
    var pattern = '';

    // Parse da regra
    for (var i = 0; i < this.origem.length; i++) {
        var char = this.origem[i];

        switch(char) {
            // Conjuntos
            case Regra.CJ_START:
                if (typeof _conjuntos !== 'undefined') {
                    var cjIdx = i;
                    var cjIdx2 = cjIdx + this.origem.substr(cjIdx).search(Regra.CJ_END);
                    var cjNome = this.origem.slice(cjIdx + 1, cjIdx2);
                    var cj = _conjuntos[cjNome];
                    var cjRegex = '' + cj;
                    cjRegex = cjRegex.replace(new RegExp(',', 'g'), '');
                    pattern += '[' + cjRegex + ']';
                    i = cjIdx2; // Avança i
                }
                break;
            // Tonicidade
            case Regra.ATONA:
                this.tonicidade = Regra.TIPOS.ATONA;
                break;
            case Regra.TONICA:
                this.tonicidade = Regra.TIPOS.TONICA;
                break;
            case Regra.PRETONICA:
                if (i+1 < this.origem.length) {
                    var nextChar = this.origem[i+1];
                    if (nextChar == Regra.IMEDIATA) {
                        this.tonicidade = Regra.TIPOS.PRETONICAIMEDIATA;
                        i = i + 1;
                    } else if (nextChar == Regra.PRETONICA) {
                        this.tonicidade = Regra.TIPOS.PRETONICANAOIMEDIATA;
                        i = i + 1;
                    } else {
                      this.tonicidade = Regra.TIPOS.PRETONICA;
                    }

                } else {
                    this.tonicidade = Regra.TIPOS.PRETONICA;
                }
                break;
            case Regra.POSTONICA:
                if (i+1 < this.origem.length) {
                    var nextChar = this.origem[i+1];
                    if (nextChar == Regra.IMEDIATA) {
                        this.tonicidade = Regra.TIPOS.POSTONICAIMEDIATA;
                        i = i + 1;
                    } else if (nextChar == Regra.POSTONICA) {
                        this.tonicidade = Regra.TIPOS.POSTONICANAOIMEDIATA;
                        i = i + 1;
                    } else {
                        this.tonicidade = Regra.TIPOS.POSTONICA;
                    }
                } else {
                    this.tonicidade = Regra.TIPOS.POSTONICA;
                }
                break;
            case Regra.ANY_QTY_CHAR:
            case Regra.ONE_MORE_CHAR:
                pattern += char;
                break;
            case Regra.SILABA_CHAR:
                pattern += Cadeia.SILABA_CHAR; // Trocar caracter pq $ dá probblema na regex
                this.patternCore += Cadeia.SILABA_CHAR;
                break;
            case Regra.EMPTY_CHAR:
            default:
                pattern += char;
                this.patternCore += char;
        }
    }

    this.regex = new RegExp(pattern, 'i');
    this.destino = destino.replace(new RegExp('\\' + Regra.SILABA_CHAR,'g'), Cadeia.SILABA_CHAR);
}

Regra.EMPTY_CHAR = '#';
Regra.SILABA_CHAR = '$';
Regra.CJ_START = '\{';
Regra.CJ_END   = '\}';
Regra.ANY_QTY_CHAR = '*';
Regra.ONE_MORE_CHAR = '+';
Regra.TONICA = '\u02c8';
Regra.ATONA = 'º';
Regra.PRETONICA = '-';
Regra.POSTONICA = '=';
Regra.IMEDIATA = '!';
Regra.PRETONICAIMEDIATA = '-!';
Regra.POSTONICAIMEDIATA = '=!';
Regra.PRETONICANAOIMEDIATA = '--';
Regra.POSTONICANAOIMEDIATA = '==';

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
    switch(this.tonicidade) {
        case Regra.TIPOS.QUALQUER:
            ehAplicavel = true;
            break;
        case Regra.TIPOS.ATONA:
            ehAplicavel = (silabaIdx != input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.TONICA:
            ehAplicavel = (silabaIdx == input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.PRETONICA:
            ehAplicavel = (silabaIdx < input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.POSTONICA:
            ehAplicavel = (silabaIdx > input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.PRETONICAIMEDIATA:
            ehAplicavel = (silabaIdx + 1 == input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.POSTONICAIMEDIATA:
            ehAplicavel = (silabaIdx - 1 == input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.PRETONICANAOIMEDIATA:
            ehAplicavel = (silabaIdx + 1 < input.silabaTonicaIdx);
            break;
        case Regra.TIPOS.POSTONICANAOIMEDIATA:
            ehAplicavel = (silabaIdx - 1 > input.silabaTonicaIdx);
            break;
        default:
            ehAplicavel = true;
    }

    return ehAplicavel;
}

Regra.prototype.aplicar = function (input) {

    // Substituição
    var inputLeft = input.str; // input a ser lido
    var strOutput ='';
    var regexIdx = input.str.search(this.regex);
    var numMudancas = 0;
    var cadeiaIdx = input.index;
    while (regexIdx >= 0 && numMudancas < input.str.length) { // Verifica se essa regra se aplica ou não
        strOutput += inputLeft.substring(0, regexIdx); // output recebe inicio do input que não foi modificado
        var strMatch = inputLeft.match(this.regex)[0]; // pega trecho do input que interessa
        var coreIdx = strMatch.search(this.patternCore); // pega indice do core (ATENCAO: aqui dá erro se prefixo contiver o core)
        var silabaIdx = input.encontrarSilabaIdx(strOutput.length + coreIdx);
        strMatch = strMatch.slice(0, coreIdx + this.patternCore.length); // Corta contexto (sufixo) fora
        if (strOutput.length + coreIdx >= cadeiaIdx && this.checarTonicidade(input, silabaIdx)) {
            strOutput += strMatch.replace(this.patternCore, this.destino); // realiza a substituição na string
            cadeiaIdx = strOutput.length + coreIdx + this.patternCore.length; // atualiza cadeiaIdx com length do que foi mudado
            numMudancas++;
        } else {
            strOutput += strMatch; // Não realiza substituição.
        }
        inputLeft = inputLeft.substr(regexIdx + strMatch.length); // atualiza input a ser lido
        regexIdx = inputLeft.search(this.regex); // procura se existem mais aplicações para a regra
    }
    if (numMudancas == input.str.length) {
        console.error("LOOP INFINITO!! Regra: " + this.toString() + " Input: " + input);
    }
    strOutput += inputLeft; // output recebe restante do input

    var output = new Cadeia();
    output.str = strOutput;
    output.silabaTonicaIdx = input.silabaTonicaIdx;

    if (numMudancas > 0) {
        console.log(this + "\t" + output.str);
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