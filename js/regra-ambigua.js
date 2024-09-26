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
    var uniqueOutputs = outputs.filter(function(item, pos, array) {
        for (var i = pos + 1; i < array.length; i++) {
            if (item.equals(array[i])) {
                return false;
            }
        }
        return true;
    });

    return uniqueOutputs.length > 1 ? uniqueOutputs : uniqueOutputs[0];
};
