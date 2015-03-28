// Classe Cadeia
function Cadeia(silabas) {
    this.str = Cadeia.EMPTY_CHAR;
    this.silabaTonicaIdx = -1;
    if (silabas != undefined) {
        for (var i=0; i < silabas.length; i++) {
            this.str += silabas[i];
            if (silabas[i].tonica) {
                this.silabaTonicaIdx = i;
            }
            if (i < silabas.length - 1) {
                this.str += Cadeia.SILABA_CHAR;
            }
        }
    }
    this.str += Cadeia.EMPTY_CHAR;
    this.index = 0;

}

Cadeia.EMPTY_CHAR = '#';
Cadeia.SILABA_CHAR = '-';
Cadeia.TONICA_CHAR = '\u02c8';

/**
 * Dado o indice de um caractere, retorna o indice da sílaba que contém esse caractere.
 * @param charIdx
 */
Cadeia.prototype.encontrarSilabaIdx = function(charIdx) {
        var silabaIdx = 0;
        for (var i = 0; i <= charIdx && i < this.str.length; i++) {
            if (this.str[i] == Cadeia.SILABA_CHAR) {
                silabaIdx++;
            }
        }

        return silabaIdx;
}

Cadeia.prototype.toString = function() {
    var silabas = this.str.split(Cadeia.SILABA_CHAR);
    silabas[this.silabaTonicaIdx] = Cadeia.TONICA_CHAR + silabas[this.silabaTonicaIdx];
    return silabas.join('').replace(new RegExp('[#-]', 'gi'),'');
};

Cadeia.prototype.equals = function(other) {
    return this.str == other.str;
}

Cadeia.prototype.imprimir = function() {
    return this.str.replace(new RegExp('[#-]', 'gi'),'');
}
