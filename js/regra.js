

function Regra(origem, destino) {
    this.origem = origem;
    this.destino = destino;
}

Regra.prototype.aplicar = function (input) {
    var regex = new RegExp(this.origem, 'g');
    var output = input.replace(regex, this.destino);
    return output;
}