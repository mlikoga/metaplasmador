/**
 * Created by MLK on 09/11/2014.
 */

function criarCadeia(arrStrSilabas) {
    var silabas = [];
    for (var i=0; i < arrStrSilabas.length; i++) {
        silabas.push(new Silaba(arrStrSilabas[i]));
    }
    var cadeia = new Cadeia( arrStrSilabas.join(''), silabas);
    return cadeia;
}

QUnit.test( "Regra basica i > e", function( assert ) {
    var regra = new Regra("i","e");
    assert.equal( regra.aplicar( criarCadeia(["si","di"])).str, "sede" );
    assert.equal( regra.aplicar( criarCadeia(["se","de"])).str, "sede" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("uu","o");
    assert.equal( regra.aplicar(criarCadeia(["arvu","ure"])).str, "arvore" );
    assert.equal( regra.aplicar(criarCadeia(["ui","vo"])).str, "uivo" );
});

QUnit.test( "Regra destino vazio d > ", function( assert ) {
    var regra = new Regra("c","");
    assert.equal( regra.aplicar(criarCadeia(["fac","to"])).str, "fato" );
});

QUnit.test( "Regra inicio # #h > ", function( assert ) {
    var regra = new Regra("#h","");
    assert.equal( regra.aplicar(criarCadeia(["hal","ma"])).str, "alma" );
    assert.equal( regra.aplicar(criarCadeia(["ha","char"])).str, "achar" );
    assert.equal( regra.aplicar(criarCadeia(["hha"])).str, "ha" );
});

QUnit.test( "Regra fim # #m > ", function( assert ) {
    var regra = new Regra("m#","");
    assert.equal( regra.aplicar(criarCadeia(["ma","du","rum"])).str, "maduru" );
});

QUnit.test( "Regra comeco e fim # #et# > e", function( assert ) {
    var regra = new Regra("#et#","e");
    assert.equal( regra.aplicar(criarCadeia(["et"])).str, "e" );
});

QUnit.test( "2 Regra ambiguas i > e; i > u", function( assert ) {
    var regra1 = new Regra("i","e");
    var regra2 = new Regra("i","u");
    var regraAmbigua = new RegraAmbigua([regra1, regra2]);
    assert.equal( regraAmbigua.aplicar(criarCadeia(["pe"])).str, "pe" );
    var outPi = regraAmbigua.aplicar(criarCadeia(["pi"]));
    assert.ok( outPi.constructor === Array);
    assert.equal( outPi.length, 2);
    assert.equal( outPi[0].str, "pe");
    assert.equal( outPi[1].str, "pu");
});

QUnit.module("Conjuntos", {
    setup: function() {
        _conjuntos = {"V" : "a,e,i,o,u"}; // Sem var para ser global
    }
});

QUnit.test( "Regra contexto ph{V} > f", function( assert ) {
    var regra = new Regra("ph{V}","f");
    assert.equal( regra.aplicar(criarCadeia(["phi","no"])).str, "fino" );
    assert.equal( regra.aplicar(criarCadeia(["Ralph"])).str, "Ralph" );
    assert.equal( regra.aplicar(criarCadeia(["alepht"])).str, "alepht" );
});

QUnit.test( "Regra contexto {V}t > ", function( assert ) {
    var regra = new Regra("{V}t","");
    assert.equal( regra.aplicar(criarCadeia(["et"])).str, "e" );
    assert.equal( regra.aplicar(criarCadeia(["teia"])).str, "teia" );
    assert.equal( regra.aplicar(criarCadeia(["fac","to"])).str, "facto" );
});

QUnit.test( "Regra contexto {V}ll{V} > ", function( assert ) {
    var regra = new Regra("{V}ll{V}","l");
    assert.equal( regra.aplicar(criarCadeia(["el","la"])).str, "ela" );
    assert.equal( regra.aplicar(criarCadeia(["be","la"])).str, "bela" );
    assert.equal( regra.aplicar(criarCadeia(["lla","ma"])).str, "llama" );
    assert.equal( regra.aplicar(criarCadeia(["clla","ma"])).str, "cllama" );
});

QUnit.test( "Regra contexto {V}a > x", function( assert ) {
    var regra = new Regra("{V}a","x");
    assert.equal( regra.aplicar(criarCadeia(["eat"])).str, "ext" );
    assert.equal( regra.aplicar(criarCadeia(["aa"])).str, "ax" );
});

