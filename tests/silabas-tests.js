/**
 * Created by MLK on 01/02/2015.
 */

QUnit.module("Silabas");

QUnit.test( "Regra #1: ROMA, AMO", function( assert ) {
    assert.deepEqual( Silabas.separar("roma"), ["ro", "ma"] );
    assert.deepEqual( Silabas.separar("amo"), ["a", "mo"] );
});
QUnit.test( "Regra #1: ILLE, MITTO", function( assert ) {
    assert.deepEqual( Silabas.separar("ille"), ["il", "le"] );
    assert.deepEqual( Silabas.separar("mitto"), ["mit", "to"] );
});
QUnit.test( "Regra #2: AETERNUS", function( assert ) {
    assert.deepEqual( Silabas.separar("aeternus"), ["ae", "ter", "nus"] );
});
QUnit.test( "Regra #3: RAPTUS, CONSUMPTUS", function( assert ) {
    assert.deepEqual( Silabas.separar("raptus"), ["rap", "tus"] );
    assert.deepEqual( Silabas.separar("consumptus"), ["con", "sump", "tus"] );
});
QUnit.test( "Regra #4: PATREM, LUCRETIA", function( assert ) {
    assert.deepEqual( Silabas.separar("patrem"), ["pa", "trem"] );
    assert.deepEqual( Silabas.separar("lucretia"), ["lu", "cre", "ti", "a"] );
});
QUnit.test( "Regra #5: QU, GU, CH, PH, TH", function( assert ) {
    assert.deepEqual( Silabas.separar("quanto"), ["quan", "to"] );
    assert.deepEqual( Silabas.separar("philosophus"), ["phi", "lo", "so", "phus"] );
    assert.deepEqual( Silabas.separar("thema"), ["the", "ma"] );
    assert.deepEqual( Silabas.separar("sanguis"), ["san", "guis"] );
    assert.deepEqual( Silabas.separar("gula"), ["gu", "la"] );
});
QUnit.test( "Regra #6: MONSTRUM", function( assert ) {
    assert.deepEqual( Silabas.separar("monstrum"), ["mons", "trum"] );
});
QUnit.test( "Regra #7: PNEUMATICOS, PNYTAGORAS, MNEMONICOS", function( assert ) {
    assert.deepEqual( Silabas.separar("pneumaticos"), ["pne", "u", "ma", "ti", "cos"] );
    assert.deepEqual( Silabas.separar("pnytagoras"), ["pny", "ta", "go", "ras"] );
    assert.deepEqual( Silabas.separar("mnemonicos"), ["mne", "mo", "ni", "cos"] );
});
QUnit.test( "Regra #9: beatus, dea", function( assert ) {
    assert.deepEqual( Silabas.separar("beatus"), ["be", "a", "tus"] );
    assert.deepEqual( Silabas.separar("dea"), ["de", "a"] );
});
QUnit.test( "encontrarSilabaIdx", function ( assert ) {
    var s1 = new Silaba('be');
    var s2 = new Silaba('a');
    var s3 = new Silaba('tus');
    var silabas = [s1,s2,s3];
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 0), 0);
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 1), 0);
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 2), 1);
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 3), 2);
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 4), 2);
    assert.equal( Silabas.encontrarSilabaIdx(silabas, 5), 2);
});
