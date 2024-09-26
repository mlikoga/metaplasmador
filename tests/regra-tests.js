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

QUnit.test( "Regra perdendo sílaba $j > Q", function( assert ) {
    var regra = new Regra("$j","Q");
    assert.equal( regra.aplicar( criarCadeia(["ma","jo", "!ri", "num"])).toFullString(), "#maQo$ˈri$num#" );
    assert.equal( regra.aplicar( criarCadeia(["!ma","jo", "ri", "num"])).toFullString(), "#ˈmaQo$ri$num#" );
});

QUnit.test( "Regra perdendo 2 sílabas $j > Q", function( assert ) {
    var regra = new Regra("a$e$i","a");
    assert.equal( regra.aplicar( criarCadeia(["ma","e", "!ir"])).toFullString(), "#ˈmar#" );
    assert.equal( regra.aplicar( criarCadeia(["!ma","e", "ir"])).toFullString(), "#ˈmar#" );
});

QUnit.test( "Regra ganhando sílaba j > i$l", function( assert ) {
    var regra = new Regra("j","i$l");
    assert.equal( regra.aplicar( criarCadeia(["ma","jo", "!ri", "num"])).toFullString(), "#ma$i$lo$ˈri$num#" );
    assert.equal( regra.aplicar( criarCadeia(["!ma","jo", "ri", "num"])).toFullString(), "#ˈma$i$lo$ri$num#" );
});

QUnit.test( "Regra ganhando sílaba $s > es", function( assert ) {
    var regra = new Regra("#st","es$t");
    assert.equal( regra.aplicar( criarCadeia(["!sto","ma", "chum"])).toFullString(), "#es$ˈto$ma$chum#" );
});

QUnit.module("Conjuntos", {
    setup: function() {
        _conjuntos = {"V" : "a,e,i,o,u", "C" : "b,c,d,f,g,h,k,l,m,n,p,q,r,s,t,v,w,x,y,z"}; // Sem var para ser global
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

QUnit.test( "Regra contexto {V}$p{V} > ", function( assert ) {
    var regra = new Regra("{V}$p{V}","$b");
    assert.equal( regra.aplicar(criarCadeia(["a","pa","pa"])).imprimir(), "ababa" );
});

QUnit.test( "Regra contexto {V}{C}l > ", function( assert ) {
    var regra = new Regra("{V}{C}l","r");
    assert.equal( regra.aplicar(criarCadeia(["ablir"])).imprimir(), "abrir" );
    assert.equal( regra.aplicar(criarCadeia(["ail"])).imprimir(), "ail" );
});

QUnit.test( "Regra contexto #{V}l > ", function( assert ) {
    var regra = new Regra("#{V}l","u");
    assert.equal( regra.aplicar(criarCadeia(["!alto"])).toFullString(), "#ˈauto#" );
    assert.equal( regra.aplicar(criarCadeia(["!malta"])).toFullString(), "#ˈmalta#" );
    assert.equal( regra.aplicar(criarCadeia(["!clave"])).toFullString(), "#ˈclave#" );
});

QUnit.test( "Regra duplicação de # #p > #b", function( assert ) {
    var regra = new Regra("#p","#b"); // Essa regra deveria ser #p > b
    assert.equal( regra.aplicar(criarCadeia(["!po", "la"])).str, "#bo-la#" );
});

QUnit.test( "Regra contexto {V}{C}a${C}{V} > ", function( assert ) {
    var regra = new Regra("{C}{V}a${C}{V}","e$");
    assert.equal( regra.aplicar(criarCadeia(["koa", "la"])).imprimir(), "koela" );
    assert.equal( regra.aplicar(criarCadeia(["koala"])).imprimir(), "koala" );
    assert.equal( regra.aplicar(criarCadeia(["koa", "ui"])).imprimir(), "koaui" );
});

QUnit.test( "Regra caracter * i{C}* > e", function( assert ) {
    var regra = new Regra("i{C}*","e");
    assert.equal( regra.aplicar(criarCadeia(["i"])).imprimir(), "e" );
    assert.equal( regra.aplicar(criarCadeia(["ic"])).imprimir(), "ec" );
    assert.equal( regra.aplicar(criarCadeia(["icd"])).imprimir(), "ecd" );
});

QUnit.test( "Regra caracter * e{C}*${C}*{V} > i", function( assert ) {
    var regra = new Regra("e{C}*${C}*{V}","i");
    assert.equal( regra.aplicar(criarCadeia(["e"])).imprimir(), "e" );
    assert.equal( regra.aplicar(criarCadeia(["e","a"])).imprimir(), "ia" );
    assert.equal( regra.aplicar(criarCadeia(["fe","ci"])).imprimir(), "fici" );
});

QUnit.test( "Regra caracter * i{C}+ > e", function( assert ) {
    var regra = new Regra("i{C}+","e");
    assert.equal( regra.aplicar(criarCadeia(["i"])).imprimir(), "i" );
    assert.equal( regra.aplicar(criarCadeia(["ic"])).imprimir(), "ec" );
    assert.equal( regra.aplicar(criarCadeia(["icd"])).imprimir(), "ecd" );
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

QUnit.test( "Tonica no final da palavra", function( assert ) {
    var regra = new Regra("\'o#","u");
    assert.equal( regra.aplicar(criarCadeia(["u","ru", "!bo"])).imprimir(), "urubu" );
    assert.equal( regra.aplicar(criarCadeia(["!lo","bo"])).imprimir(), "lobo" );
});

QUnit.test( "Atona no final da palavra", function( assert ) {
    var regra = new Regra("ºu#","o");
    assert.equal( regra.aplicar(criarCadeia(["u","ru", "!bu"])).imprimir(), "urubu" );
    assert.equal( regra.aplicar(criarCadeia(["!lo","bu"])).imprimir(), "lobo" );
});