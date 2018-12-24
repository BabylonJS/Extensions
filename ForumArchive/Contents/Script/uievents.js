first('.panelclick').addEventListener("click", function () {
    first('panel').classList.toggle('hdn-i');
    first('.panelclick').classList.toggle('cwgray');
});

first('.helperclick').addEventListener("click", function () {
    first('helper').classList.toggle('hdn-i');
    first('.helperclick').classList.toggle('cwgray');
});

first('.propclick').addEventListener("click", function () {
    first('prop').classList.toggle('hdn-i');
    first('.propclick').classList.toggle('cwgray');
});

function refreshStorage() {
    first('storage > div').innerHTML = "";

    first('storage > div').innerHTML += "<div class=' bb-i-01 c-b-itrwhite w-full f-i11 h-01 c-twhite b pl-005 pr-005'> TempDb : Geometries Instance </div>";
    db_temp.all(function (c, v) {
        var html = first('storageMeshTemp').innerHTML
       .replaceAll('#[Name]', c.name)
            .replaceAll('#[detail]', c.op.id)
       .replaceAll('#[ActionDb]', 'deleteDbMesh')
       .replaceAll('#[Action]', 'editDbMesh')
       .replaceAll('#[Option]', JSON.stringify(c.op).replaceAll('"', '^'))
       .replaceAll('#[Theme]', 'm-00125 w-auto cdark cnavy c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 c-b-iblack')
       .replaceAll('#[Index]', c.ind)
       .replaceAll('#[dbInd]', c.id)
       .replaceAll('#[Select]', geos[c.ind] ? "corg" : "")
        ;
        first('storage > div').innerHTML += html;
    }, function () {

        first('storage > div').innerHTML += "<div class='mt-01 bb-i-01 c-b-itrwhite w-full f-i11 h-01 c-twhite b pl-005 pr-005'> Main : Geometries Instance </div>";
        db_main.all(function (c, v) {
            var html = first('storageMeshTemp').innerHTML
           .replaceAll('#[Name]', c.name)
           .replaceAll('#[detail]', c.op.id)
                .replaceAll('#[ActionDb]', 'deleteDbMesh')
           .replaceAll('#[Action]', 'editDbMesh')
           .replaceAll('#[Theme]', 'm-00125 w-auto cdark cnavy c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 c-b-iblack')
           .replaceAll('#[Index]', c.ind)
                 .replaceAll('#[dbInd]', c.id)
            .replaceAll('#[Select]', geos[c.ind] ? "corg" : "");
            first('storage > div').innerHTML += html;

        }, function () {

        }, 0);
    }, 0);
}

first('.storageclick').addEventListener("click", function () {
    dy.body.iclick(event, this, function () { console.log('storage logo'); }, 1)
    first('storage').classList.toggle('hdn-i');
    first('.storageclick').classList.toggle('c-iwhite');

    if (first('storage').className.indexOf('hdn-i') == -1) {
        refreshStorage();
    }

});

first('.storageiclick').addEventListener("click", function () {
    first('publish').classList.toggle('hdn-i'); 
});



document.body.addEventListener("keyup", function (event) {
    if (event.keyCode == 27) {
        backToPanel();

        showRotateGizmo(false);
        showMoveGizmo(false);
        showScaleGizmo(false);
        first('TS').classList.add('hdn-i');
    }
    if (event.keyCode == 192 && event.altKey) {

        if (first('panel').className.indexOf('hdn-i') == -1) {
            first('panel').classList.add('hdn-i');
            first('.panelclick').classList.remove('cwgray');
            first('panel').classList.add('sphide');
        } else if (first('panel').className.indexOf('hdn-i') != -1 && first('panel').className.indexOf('sphide') != -1) {
            first('panel').classList.remove('hdn-i');
            first('.panelclick').classList.add('cwgray');
            first('panel').classList.remove('sphide');
        }

        if (first('helper').className.indexOf('hdn-i') == -1) {
            first('helper').classList.add('hdn-i');
            first('.helperclick').classList.remove('cwgray');
            first('helper').classList.add('sphide');
        } else if (first('helper').className.indexOf('hdn-i') != -1 && first('helper').className.indexOf('sphide') != -1) {
            first('helper').classList.remove('hdn-i');
            first('.helperclick').classList.add('cwgray');
            first('helper').classList.remove('sphide');
        }

        if (first('prop').className.indexOf('hdn-i') == -1) {
            first('prop').classList.add('hdn-i');
            first('.propclick').classList.remove('cwgray');
            first('prop').classList.add('sphide');
        } else if (first('prop').className.indexOf('hdn-i') != -1 && first('prop').className.indexOf('sphide') != -1) {
            first('prop').classList.remove('hdn-i');
            first('.propclick').classList.add('cwgray');
            first('prop').classList.remove('sphide');
        }


        event.preventDefault();
        return false;
    }

    if (event.keyCode == 49 && event.altKey) {

        first('panel').classList.toggle('hdn-i');
        first('.panelclick').classList.toggle('cwgray');
        event.preventDefault();
        return false;
    }

    if (event.keyCode == 50 && event.altKey) {

        first('helper').classList.toggle('hdn-i');
        first('.helperclick').classList.toggle('cwgray');
        event.preventDefault();
        return false;
    }

    if (event.keyCode == 51 && event.altKey) {

        first('prop').classList.toggle('hdn-i');
        first('.propclick').classList.toggle('cwgray');
        event.preventDefault();
        return false;
    }
});



var geometryIndex = 0;
var geos = [], params = [];
 

var attachToModelsList = function (name) {
    geometryIndex++;
    all('.geoInstance', function (at) {
        at.classList.remove('cnavy');
        at.classList.remove('c-i-hblue');
    }, function () {

    });
    var html = first('modelTemp').innerHTML
        .replaceAll('#[Name]', name)
         .replaceAll('#[Action]', 'editParameters')
        .replaceAll('#[Theme]', 'geoInstance m-00125 w-auto cdark cnavy c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 c-b-iblack')

        .replaceAll('#[Index]', geometryIndex);
    first('panel').innerHTML += html;
    var obj;
    eval('obj = geo_' + name + ';');

    first('prop').innerHTML = "";
    var ii = 0;
    for (var prp in obj.prps) {
        ii++;
        var pr2 = obj.prps[prp].toString().substr(obj.prps[prp].toString().indexOf(':') + 1, obj.prps[prp].toString().length - obj.prps[prp].toString().indexOf(":") - 1);
        prp = obj.prps[prp].split(':');
        var prpItem = first('parameterTemp').innerHTML
            .replaceAll('#[Value]', pr2)
            .replaceAll('#[Name]', prp[0])
            .replaceAll('#[Parent]', name)
            .replaceAll('#[Theme]', ii % 2 == 0 ? 'ctrblack' : ' ')
                .replaceAll('type="text"', checkCtl(prp[0]))
            .replaceAll('#[Index]', geometryIndex);
        first('prop').innerHTML += prpItem;
    }

    geos[geometryIndex] = obj.toMesh(getParameters(geometryIndex, name));

}

var editParameters = function (name, ind, th,t) {

    var obj;
    eval('obj = geo_' + name + ';');
    var pp = params[ind];
    first('prop').innerHTML = "";
    var ii = 0;
    all('.geoInstance', function (at) {
        at.classList.remove('cnavy');
        at.classList.remove('c-i-hblue');
    }, function () {
        th.classList.add('cnavy');
        th.classList.add('c-i-hblue');
    });
    for (var prp in obj.prps) {
        ii++;
        prp = obj.prps[prp].split(':');
        var itval = (eval('params[' + ind + '].' + prp[0]));
        if (typeof itval == typeof [{}]) {
            itval = JSON.stringify(itval).replaceAll('{"', "{")
            .replaceAll(',"', ",")
            .replaceAll('":', ":")
        .replaceAll('"', "'");
            
        }

        var prpItem = first('parameterTemp').innerHTML
            .replaceAll('#[Value]', itval)
            .replaceAll('#[Name]', prp[0])
            .replaceAll('#[Parent]', name)
            .replaceAll('#[Theme]', ii % 2 == 0 ? 'ctrblack' : ' ')
                .replaceAll('type="text"', checkCtl(prp[0]))
            .replaceAll('#[Index]', ind);
        first('prop').innerHTML += prpItem;
    }


    if (t) {

        var o = getParameters(ind, name);

        var s = 'GB.mesh = function(){ var obj = geo_' + name + ';';
        s += 'var op =  ' + JSON.stringify(o) + ';';
        s += ' return { ms: obj.toMesh(op), op: op, n: "' + name + '"   }; }; updateMesh(GB.mesh());';

        first('textarea').value += s;
    }


    //geos[ind] = obj.toMesh(getParameters(ind));

}

var getParameters = function (i, n) {
    var op = {};
    return all('prop input', function (at) {
        if (at && at.id) {
            eval('op.' + at.id + ' = "' + at.value + '";');
        }
    }, function () {
        if (i) try {
            params[i] = op;
            // saved 

            db_temp.add({ ind: i, op: op, name: n }, function () {

                var ids = [];
                db_temp.all(function (c, v) {
                    if (c.ind == i && c.name == n)
                        ids.push(c.id);
                }, function (m, e) {

                    var n1 = 0;
                    for (var id in ids) {
                        n1++
                        if (n1 < ids.length)
                            var id2 = ids[id];
                        try {
                            db_temp.remove(id2, function () { }, 0);
                        } catch (e) { }
                    }
                });

            }, 0);



        } catch (e) { }
        console.log(op);
        return op;
    })
}

var getOptionParameters = function () {
    var op = {};
    return all('opt input', function (at) {
        if (at && at.id) {
            eval('op.' + at.id + ' = "' + at.value + '";');
        }
    }, function () {
        return JSON.stringify(op)
            .replaceAll('{"', "{")
            .replaceAll(',"', ",")
            .replaceAll('":', ":")
        .replaceAll('"', "'");
    })
}

var setParameter = function (v, n, p, i  ) {
    var obj, mat;
    if (geos[i]) {
        mat = geos[i].material;
        geos[i].dispose();
    }
    eval('obj = geo_' + p + ';');


    var o = getParameters(i, p);

    geos[i] = obj.toMesh(o);

    currMesh = geos[i];


}

var backToPanel = function () {
    if (!backEnableToPanel) return;
    first('mats').classList.toggle('hdn-i');
    first('panel').classList.toggle('hdn-i');

    first('prop').classList.toggle('hdn-i');
    first('opt').classList.toggle('hdn-i');
    backEnableToPanel = false;
}

var setMatParameter = function () {
    currMatOption.value = getOptionParameters();
    currMatItem.onkeyup();
}


var backEnableToPanel = false;
var currMatItem, currMatOption, currTextureItem,currTsItem;

var editMaterialParameters = function (name, ind, th) {
    var obj = mats[name]();
    var oldObj = js(currMatOption.value);


    var pp = params[ind];
    first('opt').innerHTML = "";
    var ii = 0;
    all('.matitem', function (at) {
        at.classList.remove('cdark');
        at.classList.remove('c-i-hblue');
    }, function () {
        th.classList.add('cdark');
        th.classList.add('c-i-hblue');
    });
    for (var prp in obj) {
        ii++;

        if (eval('oldObj.' + prp)) {
            eval('obj.' + prp + ' = oldObj.' + prp);
        }

        var prpItem = first('matParameterTemp').innerHTML
            .replaceAll('#[Value]', eval('obj.' + prp))
            .replaceAll('#[Name]', prp)
            .replaceAll('#[Parent]', name)
            .replaceAll('#[Theme]', ii % 2 == 0 ? 'ctrwhite' : ' ')
            .replaceAll('type="text"', checkCtl(prp))
            .replaceAll('#[Index]', ind);
        first('opt').innerHTML += prpItem;
    }

    currMatItem.value = name;

    currMatItem.onkeyup();


}

var applyTransform = function () {
    if (currTsItem) {

        var t_ss = {
              rx: first('TS #rx').value.valueOf()*1.0,
              ry: first('TS #ry').value.valueOf()*1.0,
              rz: first('TS #rz').value.valueOf()*1.0,
              mx: first('TS #mx').value.valueOf()*1.0,
              my: first('TS #my').value.valueOf()*1.0,
              mz: first('TS #mz').value.valueOf()*1.0,
              sx: first('TS #sx').value.valueOf()*1.0,
              sy: first('TS #sy').value.valueOf()*1.0,
              sz: first('TS #sz').value.valueOf()*1.0,
              cx: first('TS #cx').value.valueOf()*1.0,
              cy: first('TS #cy').value.valueOf()*1.0,
              cz: first('TS #cz').value.valueOf()*1.0,
              rcx: first('TS #rcx').value.valueOf() * 1.0,
              rcy: first('TS #rcy').value.valueOf() * 1.0,
              rcz: first('TS #rcz').value.valueOf() * 1.0,
        };
        currTsItem.value = JSON.stringify(t_ss).replaceAll('{"', "{")
            .replaceAll(',"', ",")
            .replaceAll('":', ":")
        .replaceAll('"', "'");

        first('TS').classList.add('hdn-i');
        showRotateGizmo(false);
        showMoveGizmo(false);
        showScaleGizmo(false);
        currTsItem.onkeyup();

        currTsItem = null;
    }
}
var checkParam = function (t, v, n, p, i) {
    if (n == "material") {
        backEnableToPanel = true;
        buildMats(t, v, n, p, i);
    }

    if (n == "transform") {
        t.onkeyup();
        currTsItem = t;
        first('TS').classList.remove('hdn-i');
         
        option_ts = js(t.value);
        option_ts = def(option_ts, {})
        first('TS #rx').value = def(option_ts.rx, 0);
        first('TS #ry').value = def(option_ts.ry, 0);
        first('TS #rz').value = def(option_ts.rz, 0);
        first('TS #mx').value = def(option_ts.mx, 0);
        first('TS #my').value = def(option_ts.my, 0);
        first('TS #mz').value = def(option_ts.mz, 0);
        first('TS #sx').value = def(option_ts.sx, 1);
        first('TS #sy').value = def(option_ts.sy, 1);
        first('TS #sz').value = def(option_ts.sz, 1);
        first('TS #cx').value = def(option_ts.cx, 0);
        first('TS #cy').value = def(option_ts.cy, 0);
        first('TS #cz').value = def(option_ts.cz, 0);
        first('TS #rcx').value = def(option_ts.rcx, 0);
        first('TS #rcy').value = def(option_ts.rcy, 0);
        first('TS #rcz').value = def(option_ts.rcz, 0);

    }

    if (n.indexOf("map") == 0) {
        currTextureItem = t;
        first('textures').classList.remove('hdn-i');
    }

}

var updateTexture = function (th) {
    first('textures').classList.add('hdn-i');
    currTextureItem.value = th.attributes['val'].value;
    currTextureItem.onkeyup();
}

var buildMats = function (t, v, n, p, i) {

    currMatItem = t;
    currMatOption = first('input', null, currMatItem.parentNode.nextElementSibling);

    first('mats').classList.toggle('hdn-i');
    first('panel').classList.toggle('hdn-i');

    first('prop').classList.toggle('hdn-i');
    first('opt').classList.toggle('hdn-i');


    var html = first('modelTemp').innerHTML
            .replaceAll('#[Name]', 'back')
            .replaceAll('#[Action]', 'backToPanel')
            .replaceAll('#[Theme]', 'm-00125 w-auto  cwhite c-hblack c-i-hblue c-tblack pl-005 pr-005 rad-05 ba-i-02 h-0125 f-center c-b-iblack')
            .replaceAll('#[Index]', '');

    for (var mt in mats) {

        html += first('modelTemp').innerHTML
            .replaceAll('#[Name]', mt)
            .replaceAll('#[Action]', 'editMaterialParameters')
            .replaceAll('#[Theme]', 'mat_' + mt + ' matitem m-00125 w-auto   c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 h-0125 f-center c-b-iblack')
            .replaceAll('#[Index]', '');

    }
    first('mats').innerHTML = html;
    first('.mat_' + currMatItem.value + '.matitem ').onclick();
}

var showDbMesh = function (n, o, i, th) {
    if (th.className.indexOf('corg') == -1) {
        geos[i].dispose();
    }
    else {
      //  var obj;
       // eval('obj = geo_' + n + ';');
       // var pp = JSON.parse(o.replaceAll('^', '"'));

        //geos[i] = obj.toMesh(pp);

        var s = 'GB.mesh = function(){ var obj = geo_' + n + ';';
        s += 'var op = \"' + o.replaceAll('"', '^').replaceAll('\'', '~').replaceAll('\t', '') + '\";';
        s += 'var pp = JSON.parse(op.replaceAll(\'^\', \'"\').replaceAll(\'~\', \'\'\'));';
        s += 'obj.toMesh(pp);}; GB.mesh();'; 

        console.log(s);
    }
}


var checkCtl = function (n) {
    if (n == "material")
        return "type='text' mode='btn'";
    else if (n == "transform")
        return "type='text'  mode='btn'";
    else if (n.indexOf('options') != -1)
        return "type='label' disabled='disable'";
    else if (n.indexOf('map') == 0)
        return "type='button' ";
    else return "type='text'";
};

var editDbMesh = function (n, o, i, th) {


    if (geos[i] && confirm('this index is exist in Temp Storag if you wanna keep both instance')) {

        i = ++geometryIndex;
    }

    if (i >= geometryIndex) geometryIndex = i + 1;

    var obj;
    eval('obj = geo_' + n + ';');
    var pp = JSON.parse(o.replaceAll('^', '"'));

    geos[i] = obj.toMesh(pp);
    params[i] = pp;
    all('.geoInstance', function (at) {
        at.classList.remove('cnavy');
        at.classList.remove('c-i-hblue');
    }, function () {

    });

    var html = first('modelTemp').innerHTML
        .replaceAll('#[Name]', n)
         .replaceAll('#[Action]', 'editParameters')
        .replaceAll('#[Theme]', 'geoInstance m-00125 w-auto cdark cnavy c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 c-b-iblack')

        .replaceAll('#[Index]', i);


    first('panel').innerHTML += html;

    var pp = params[i];
    first('prop').innerHTML = "";
    var ii = 0;

    for (var prp in obj.prps) {
        ii++;
        prp = obj.prps[prp].split(':');
        var prpItem = first('parameterTemp').innerHTML
            .replaceAll('#[Value]', eval('params[' + i + '].' + prp[0]))
            .replaceAll('#[Name]', prp[0])
            .replaceAll('#[Parent]', n)
            .replaceAll('#[Theme]', ii % 2 == 0 ? 'ctrblack' : ' ')
            .replaceAll('type="text"', checkCtl(prp[0]))

            .replaceAll('#[Index]', i);
        first('prop').innerHTML += prpItem;
    }

    first('storage').classList.add('hdn-i');
    first('.storageclick').classList.add('c-iwhite');

}

function updateMesh(p) {
    var n = p.n;
    var i =  ++geometryIndex;
    geos[i] = p.ms;
    params[i] = p.op;
    all('.geoInstance', function (at) {
        at.classList.remove('cnavy');
        at.classList.remove('c-i-hblue');
    }, function () {

    });

    var html = first('modelTemp').innerHTML
        .replaceAll('#[Name]', n)
         .replaceAll('#[Action]', 'editParameters')
        .replaceAll('#[Theme]', 'geoInstance m-00125 w-auto cdark cnavy c-hblack c-i-hblue c-twhite pl-005 pr-005 rad-05 ba-i-02 c-b-iblack')

        .replaceAll('#[Index]', i);


    first('panel').innerHTML += html;

   
}


var deleteDbMesh = function (n, o, i, th, dbInd) {


    if (confirm('remove mesh from temp db')) {


        db_temp.remove(dbInd, function () {
            if (geos[i]) {
                geos[i].dispose();
                geos[i] = null;
                params[i] = null;
            }

            refreshStorage();
        }, 0);

    }
}



var dom_body = function () {


    first('storage').classList.add('hdn-i');
    first('.storageclick').classList.add('c-iwhite');

}