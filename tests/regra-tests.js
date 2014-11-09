/**
 * Created by MLK on 09/11/2014.
 */

QUnit.test( "Regra basica i > e", function( assert ) {
    var regra = new Regra("i","e");
    assert.equal( regra.aplicar("sidi"), "sede" );
    assert.equal( regra.aplicar("sede"), "sede" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("uu","o");
    assert.equal( regra.aplicar("arvuure"), "arvore" );
    assert.equal( regra.aplicar("uivo"), "uivo" );
});

QUnit.test( "Regra destino vazio d > ", function( assert ) {
    var regra = new Regra("c","");
    assert.equal( regra.aplicar("facto"), "fato" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("uu","o");
    assert.equal( regra.aplicar("arvuure"), "arvore" );
    assert.equal( regra.aplicar("uivo"), "uivo" );
});

QUnit.test( "Regra inicio # #h > ", function( assert ) {
    var regra = new Regra("#h","");
    assert.equal( regra.aplicar("halma"), "alma" );
    assert.equal( regra.aplicar("hachar"), "achar" );
});

QUnit.test( "Regra fim # #m > ", function( assert ) {
    var regra = new Regra("m#","");
    assert.equal( regra.aplicar("madurum"), "maduru" );
});

QUnit.test( "Regra comeco e fim # #et# > e", function( assert ) {
    var regra = new Regra("#et#","e");
    assert.equal( regra.aplicar("et"), "e" );
});

QUnit.module("Conjuntos", {
    setup: function() {
        conjuntos = {"V" : "a,e,i,o,u"}; // Sem var para ser global
    }
});

QUnit.test( "Regra contexto ph{V} > f", function( assert ) {
    var regra = new Regra("ph{V}","f");
    assert.equal( regra.aplicar("phino"), "fino" );
    assert.equal( regra.aplicar("Ralph"), "Ralph" );
    assert.equal( regra.aplicar("alepht"), "alepht" );
});

QUnit.test( "Regra contexto {V}t > ", function( assert ) {
    var regra = new Regra("{V}t","");
    assert.equal( regra.aplicar("et"), "e" );
    assert.equal( regra.aplicar("teia"), "teia" );
    assert.equal( regra.aplicar("facto"), "facto" );
});

QUnit.test( "Regra contexto {V}ll{V} > ", function( assert ) {
    var regra = new Regra("{V}ll{V}","l");
    assert.equal( regra.aplicar("ella"), "ela" );
    assert.equal( regra.aplicar("bela"), "bela" );
    assert.equal( regra.aplicar("llama"), "llama" );
    assert.equal( regra.aplicar("cllama"), "cllama" );
});
