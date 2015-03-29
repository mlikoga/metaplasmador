/**
 * Created by MLK on 23/02/2015.
 */
// Globals
const numSincronias = 6;

var _sincronias = []; // array de array de regras
var _conjuntos = {}; // mapa nome -> elementos

var _regrasOrto2Fone = [];
var _regrasFone2Orto = [];

function inserirCaracter(button) {
    var inputTxt = $('#input');
    var cursorPos = inputTxt.textrange().position;
    var txt1 = inputTxt.val().slice(0, cursorPos);
    var txt2 = inputTxt.val().slice(cursorPos);
    inputTxt.val(txt1 + $(button).text() + txt2);
    inputTxt.textrange('setcursor', cursorPos + 1);
}

function loadRegras() {
    for (var i = 0 ; i < numSincronias; i++) {
        var sincroniaId = "s" + i;
        getFileFromServer("regras/" + sincroniaId + ".txt", fillTextArea, "#" + sincroniaId);
    }
    getFileFromServer("regras/conjuntos.txt", fillTextArea, "#conjuntos");
    getFileFromServer("regras/ortografico-fonetico.txt", fillTextArea, "#orto2fone");
    getFileFromServer("regras/fonetico-ortografico.txt", fillTextArea, "#fone2orto");
    getFileFromServer("ajuda.txt", fillText, "#helpModal-text");
}

function fillTextArea(text, cssSelector) {
    if (text === null) {
        console.log('Erro ao ler arquivo.');
    } else {
        $(cssSelector).val(text);
    }
}

function appendHTML(text, cssSelector) {
    if (text === null) {
        console.log('Erro ao ler arquivo.');
    } else {
        var html = $.parseHTML(text);
        $(cssSelector).append();
    }
}

function storeRegras(text, array) {
    if (text === null) {
        console.log('Erro ao ler arquivo.');
    } else {
        array.push.apply(array, parseRegras(text)); // Adiciona todas regras em array.
    }
}

function lerRegras() {
    _sincronias = [];
    for (var i = 0 ; i < numSincronias; i++) {
        var sincroniaId = "s" + i;
        var text = $('#' + sincroniaId).val();
        var regras = parseRegras(text);
        _sincronias.push(regras);
    }
    _regrasOrto2Fone = parseRegras($('#orto2fone').val());
    _regrasFone2Orto = parseRegras($('#fone2orto').val());
}

function parseRegras(text) {
    var mapaRegras = {}; // key: origem da regra; value: array de regras
    var regexSpaces = new RegExp('[ \\[\\]\r\n]', 'g');
    var lines = text.split('\n')
    for (var j = 0; j < lines.length; j++) {
        var line = lines[j].replace(regexSpaces, '');
        if (!line || 0 === line.length)
            continue;

        var parts = line.split('>'); // Trim spaces
        var novaRegra;
        if (parts.length == 2) {
            novaRegra = new Regra(parts[0], parts[1]);
        } else if (parts.length == 1) {
            novaRegra = new Regra(parts[0], '');
        }
        if (novaRegra.origem in mapaRegras) {
            mapaRegras[novaRegra.origem].push(novaRegra); // Adiciona no array
        } else {
            mapaRegras[novaRegra.origem] = [ novaRegra ]; // Cria o array
        }
    }
    var regras = [];
    for (var key in mapaRegras) {
        // Verifica se existem regras ambiguas
        if (mapaRegras[key].length > 1) {
            regras.push(new RegraAmbigua(mapaRegras[key]));
        } else {
            regras.push(mapaRegras[key][0]);
        }
    }
    return regras;
}

function lerConjuntos() {
    _conjuntos = {};
    var regexSpaces = new RegExp('[ {}]', 'g');
    var lines = $('#conjuntos').val().split('\n');
    for (var i = 0; i < lines.length; i++) {
        var parts = lines[i].replace(regexSpaces, '').split('=');
        if (parts.length == 2) {
            _conjuntos[parts[0]] = parts[1].split(',');
        }
    }
}

function transformar(regras, input) {
    var inputAtual = [ input ];
    for (var j = 0; j < regras.length; j++) {
        var auxInputAtual = [];
        for (var k = 0; k < inputAtual.length; k++) {
            var regraOutputs = regras[j].aplicar(inputAtual[k]);
            auxInputAtual = auxInputAtual.concat(regraOutputs);
        }
        inputAtual = auxInputAtual;
    }
    return inputAtual;
}

function aplicarRegras() {
    lerConjuntos();
    lerRegras();
    var strInput = $('input').val().trim().toLowerCase();
    console.log('Input: ' + strInput);
    var silabas = Silabas.encontrarTonica(Silabas.separar(strInput));

    var input = new Cadeia(silabas);
    var inputFoneticos = transformar(_regrasOrto2Fone, input);
    showInputs(input, inputFoneticos, silabas);

    var lastOutputs = inputFoneticos;
    var fullOutputs = [];
    for (var i = 0; i < inputFoneticos.length; i++) {
        fullOutputs.push('*[' + inputFoneticos[i].toString() + ']');
    }

    for (var s = 0; s < _sincronias.length; s++) {
        console.log("------ Sincronia " + s + " ------");
        var regras = _sincronias[s];
        // Auxliliares para não perder o controle da iteração 'i', pois os vetores mudam de tamanho.
        var auxOutputs = [];
        var auxFullOutputs = [];
        for (var i = 0; i < lastOutputs.length; i++) {
            var inputAtual = [ lastOutputs[i] ];
            for (var j = 0; j < regras.length; j++) {
                var regra = regras[j];
                var auxInputAtual = [];
                for (var k = 0; k < inputAtual.length; k++) {
                    var regraOutputs = regra.aplicar(inputAtual[k]);
                    auxInputAtual = auxInputAtual.concat(regraOutputs); // Seja regraOutputs array ou elemento, concat funciona.
                }
                inputAtual = auxInputAtual;
            }

            auxOutputs = auxOutputs.concat(inputAtual);
            for (var k = 0; k < inputAtual.length; k++) {
                auxFullOutputs.push(fullOutputs[i].concat(' > *[',  inputAtual[k].toString(), ']'));
            }
        }
        lastOutputs = auxOutputs;
        fullOutputs = auxFullOutputs;
    }

    // Transformar de volta
    var lastOutputsOrto = [];
    for (var i = 0; i < lastOutputs.length; i++) {
        lastOutputsOrto.push(transformar(_regrasFone2Orto, lastOutputs[i]));
    }

    var fullOutput = '';
    var lastOutput = '';
    for (var k = 0; k < fullOutputs.length; k++) {
        fullOutput += fullOutputs[k] + '\n';
        for (var i = 0; i < lastOutputsOrto[k].length; i++) {
            if (i > 0)
                lastOutput += ', ';
            lastOutput += lastOutputsOrto[k][i].imprimir();
        }
        lastOutput += '\n';
    }

    $('#fulloutput').text(fullOutput);
    $('#fulloutput').html($('#fulloutput').html().replace(/\n/g,'<br/>'));
    $('#output').text(lastOutput);
    $('#output').html($('#output').html().replace(/\n/g,'<br/>'));
}

// inOrto: string, inFone: array e silabas: array de Silaba
function showInputs(inOrto, inFone, silabas) {
    $('#input-ortografico').text(inOrto.str);
    var strFonetico = '';
    for (var i = 0; i < inFone.length; i++) {
        strFonetico += '[' + inFone[i].imprimir() + ']';
        if (i < inFone.length - 1) {
            strFonetico += ', ';
        }
    }
    $('#input-fonetico').text(strFonetico);
    var strSilabas = '';
    for (var i = 0; i < silabas.length; i++) {
        if (silabas[i].tonica) {
            strSilabas += Silabas.acentoTonico;
        }
        strSilabas += silabas[i].str;
        if (i < silabas.length - 1) {
            strSilabas += '-';
        }
    }
    $('#input-silabas').text(strSilabas);
}