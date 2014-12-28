// Classe Regra Ambigua
function RegraAmbigua(regras) {
    this.regras = regras; // Array de regras
}

// Retorna um array de saídas caso exista mais de uma saída
RegraAmbigua.prototype.aplicar = function (input) {

    var outputs = [];
    for (var i = 0; i < this.regras.length; i++) {
        outputs[i] = (this.regras[i].aplicar(input));
    }
    // Elimina duplicatas
    var uniqueOutputs = outputs.filter(function(item, pos) {
        return outputs.indexOf(item) == pos;
    });

    return uniqueOutputs.length > 1 ? uniqueOutputs : uniqueOutputs[0];
};
