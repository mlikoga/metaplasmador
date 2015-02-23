/**
 * Created by MLK on 09/11/2014.
 */

function criarCadeia(arrStrSilabas) {
    var silabas = [];
    for (var i=0; i < arrStrSilabas.length; i++) {
        var silaba = new Silaba(arrStrSilabas[i]);
        if(arrStrSilabas[i].search("!") > -1) {
            silaba.str = silaba.str.replace('!','');
            silaba.tonica = true;
        }
        silabas.push(silaba);
    }
    var cadeia = new Cadeia(silabas);
    return cadeia;
}

QUnit.test( "Regra basica i > e", function( assert ) {
    var regra = new Regra("i","e");
    assert.equal( regra.aplicar( criarCadeia(["si","di"])).imprimir(), "sede" );
    assert.equal( regra.aplicar( criarCadeia(["se","de"])).imprimir(), "sede" );
});

QUnit.test( "Regra varios caracteres uu > o", function( assert ) {
    var regra = new Regra("u$u","$o");
    assert.equal( regra.aplicar(criarCadeia(["arvu","ure"])).imprimir(), "arvore" );
    assert.equal( regra.aplicar(criarCadeia(["ui","vo"])).imprimir(), "uivo" );
});

QUnit.test( "Regra destino vazio d > ", function( assert ) {
    var regra = new Regra("c","");
    assert.equal( regra.aplicar(criarCadeia(["fac","to"])).imprimir(), "fato" );
});

QUnit.test( "Regra inicio # #h > ", function( assert ) {
    var regra = new Regra("#h","");
    assert.equal( regra.aplicar(criarCadeia(["hal","ma"])).imprimir(), "alma" );
    assert.equal( regra.aplicar(criarCadeia(["ha","char"])).imprimir(), "achar" );
    assert.equal( regra.aplicar(criarCadeia(["hha"])).imprimir(), "ha" );
});

QUnit.test( "Regra fim # #m > ", function( assert ) {
    var regra = new Regra("m#","");
    assert.equal( regra.aplicar(criarCadeia(["ma","du","rum"])).imprimir(), "maduru" );
});

QUnit.test( "Regra comeco e fim # #et# > e", function( assert ) {
    var regra = new Regra("#et#","e");
    assert.equal( regra.aplicar(criarCadeia(["et"])).imprimir(), "e" );
});

QUnit.test( "2 Regra ambiguas i > e; i > u", function( assert ) {
    var regra1 = new Regra("i","e");
    var regra2 = new Regra("i","u");
    var regraAmbigua = new RegraAmbigua([regra1, regra2]);
    assert.equal( regraAmbigua.aplicar(criarCadeia(["pe"])).imprimir(), "pe" );
    var outPi = regraAmbigua.aplicar(criarCadeia(["pi"]));
    assert.ok( outPi.constructor === Array);
    assert.equal( outPi.length, 2);
    assert.equal( outPi[0].imprimir(), "pe");
    assert.equal( outPi[1].imprimir(), "pu");
});

QUnit.module("Conjuntos", {
    setup: function() {
        _conjuntos = {"V" : "a,e,i,o,u"}; // Sem var para ser global
    }
});

QUnit.test( "Regra contexto ph{V} > f", function( assert ) {
    var regra = new Regra("ph{V}","f");
    assert.equal( regra.aplicar(criarCadeia(["phi","no"])).imprimir(), "fino" );
    assert.equal( regra.aplicar(criarCadeia(["Ralph"])).imprimir(), "Ralph" );
    assert.equal( regra.aplicar(criarCadeia(["alepht"])).imprimir(), "alepht" );
});

QUnit.test( "Regra contexto {V}t > ", function( assert ) {
    var regra = new Regra("{V}t","");
    assert.equal( regra.aplicar(criarCadeia(["et"])).imprimir(), "e" );
    assert.equal( regra.aplicar(criarCadeia(["teia"])).imprimir(), "teia" );
    assert.equal( regra.aplicar(criarCadeia(["fac","to"])).imprimir(), "facto" );
});

QUnit.test( "Regra contexto {V}ll{V} > ", function( assert ) {
    var regra = new Regra("{V}l$l{V}","l");
    assert.equal( regra.aplicar(criarCadeia(["el","la"])).imprimir(), "ela" );
    assert.equal( regra.aplicar(criarCadeia(["be","la"])).imprimir(), "bela" );
    assert.equal( regra.aplicar(criarCadeia(["lla","ma"])).imprimir(), "llama" );
    assert.equal( regra.aplicar(criarCadeia(["clla","ma"])).imprimir(), "cllama" );
});

QUnit.test( "Regra contexto {V}a > x", function( assert ) {
    var regra = new Regra("{V}a","x");
    assert.equal( regra.aplicar(criarCadeia(["eat"])).imprimir(), "ext" );
    assert.equal( regra.aplicar(criarCadeia(["aa"])).imprimir(), "ax" );
});

QUnit.module("Silabas tonicas", {
    setup: function () {
        _conjuntos = {"V": "a,e,i,o,u"}; // Sem var para ser global
    }
});

QUnit.test( "Atonas", function( assert ) {
    var regra = new Regra("ºi","e");
    assert.equal( regra.aplicar(criarCadeia(["!si","di"])).imprimir(), "side" );
    assert.equal( regra.aplicar(criarCadeia(["si","!di"])).imprimir(), "sedi" );
});

QUnit.test( "Tonicas", function( assert ) {
    var regra = new Regra("\u02c8i","e");
    assert.equal( regra.aplicar(criarCadeia(["!si","di"])).imprimir(), "sedi" );
    assert.equal( regra.aplicar(criarCadeia(["si","!di"])).imprimir(), "side" );
});

QUnit.test( "Pretonica imediata", function( assert ) {
    var regra = new Regra("-!i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "temilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "timelis" );
});

QUnit.test( "Postonica imediata", function( assert ) {
    var regra = new Regra("=!i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timelis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "timiles" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "timilis" );
});

QUnit.test( "Pretonica nao-imediata", function( assert ) {
    var regra = new Regra("--i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "timilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "temilis" );
});

QUnit.test( "Postonica nao-imediata", function( assert ) {
    var regra = new Regra("==i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timiles" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "timilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "timilis" );
});

QUnit.test( "Pretonica", function( assert ) {
    var regra = new Regra("-i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "temilis" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "temelis" );
});

QUnit.test( "Postonica", function( assert ) {
    var regra = new Regra("=i","e");
    assert.equal( regra.aplicar(criarCadeia(["!ti","mi","lis"])).imprimir(), "timeles" );
    assert.equal( regra.aplicar(criarCadeia(["ti","!mi","lis"])).imprimir(), "timiles" );
    assert.equal( regra.aplicar(criarCadeia(["ti","mi","!lis"])).imprimir(), "timilis" );
});
