/**
 * Created by MLK on 09/11/2014.
 */

QUnit.test( "Regra basica i > e", function( assert ) {
    var regra = new Regra("i","e");
    assert.equal( regra.aplicar( new Cadeia("sidi")).str, "sede" );
    assert.equal( regra.aplicar( new Cadeia("sede")).str, "sede" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("uu","o");
    assert.equal( regra.aplicar(new Cadeia("arvuure")).str, "arvore" );
    assert.equal( regra.aplicar(new Cadeia("uivo")).str, "uivo" );
});

QUnit.test( "Regra destino vazio d > ", function( assert ) {
    var regra = new Regra("c","");
    assert.equal( regra.aplicar(new Cadeia("facto")).str, "fato" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("uu","o");
    assert.equal( regra.aplicar(new Cadeia("arvuure")).str, "arvore" );
    assert.equal( regra.aplicar(new Cadeia("uivo")).str, "uivo" );
});

QUnit.test( "Regra inicio # #h > ", function( assert ) {
    var regra = new Regra("#h","");
    assert.equal( regra.aplicar(new Cadeia("halma")).str, "alma" );
    assert.equal( regra.aplicar(new Cadeia("hachar")).str, "achar" );
    assert.equal( regra.aplicar(new Cadeia("hha")).str, "ha" );
});

QUnit.test( "Regra fim # #m > ", function( assert ) {
    var regra = new Regra("m#","");
    assert.equal( regra.aplicar(new Cadeia("madurum")).str, "maduru" );
});

QUnit.test( "Regra comeco e fim # #et# > e", function( assert ) {
    var regra = new Regra("#et#","e");
    assert.equal( regra.aplicar(new Cadeia("et")).str, "e" );
});

QUnit.test( "2 Regra ambiguas i > e; i > u", function( assert ) {
    var regra1 = new Regra("i","e");
    var regra2 = new Regra("i","u");
    var regraAmbigua = new RegraAmbigua([regra1, regra2]);
    assert.equal( regraAmbigua.aplicar(new Cadeia("pe")).str, "pe" );
    var outPi = regraAmbigua.aplicar(new Cadeia("pi"));
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
    assert.equal( regra.aplicar(new Cadeia("phino")).str, "fino" );
    assert.equal( regra.aplicar(new Cadeia("Ralph")).str, "Ralph" );
    assert.equal( regra.aplicar(new Cadeia("alepht")).str, "alepht" );
});

QUnit.test( "Regra contexto {V}t > ", function( assert ) {
    var regra = new Regra("{V}t","");
    assert.equal( regra.aplicar(new Cadeia("et")).str, "e" );
    assert.equal( regra.aplicar(new Cadeia("teia")).str, "teia" );
    assert.equal( regra.aplicar(new Cadeia("facto")).str, "facto" );
});

QUnit.test( "Regra contexto {V}ll{V} > ", function( assert ) {
    var regra = new Regra("{V}ll{V}","l");
    assert.equal( regra.aplicar(new Cadeia("ella")).str, "ela" );
    assert.equal( regra.aplicar(new Cadeia("bela")).str, "bela" );
    assert.equal( regra.aplicar(new Cadeia("llama")).str, "llama" );
    assert.equal( regra.aplicar(new Cadeia("cllama")).str, "cllama" );
});


