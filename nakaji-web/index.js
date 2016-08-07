var math = require('mathjs');
const _ = require('lodash');
var Shape = require('clipper-js');

// const verts2Shape = vs => new Shape([vs.map(v => ({X: v[0], Y: v[1]}))]);
// //let s1 = verts2Shape([[0,0], [1,0], [0.5, 0.5], [0, 0.5]]);
// //let s2 = verts2Shape([[0,0], [1,0], [1,1], [0,1]]);
// let s1 = new Shape([[{X:0, Y:0}, {X:1, Y:0}, {X:0.5, Y: 0.5}, {X:0, Y: 0.5}]]);
// let s2 = new Shape([[{X:0, Y:0}, {X:1, Y:0}, {X:1, Y:1}, {X:0, Y:1}]]);
// let s1_ = s1.clone(),
//     s2_ = s2.clone();
// s1_.scaleUp(10000);
// s2_.scaleUp(10000)
// console.log(s1_,s2_);
// let s = s1_.intersect(s2_);
// console.log(s);

function fold(l, z, f) {
  for (var i = 0; i < l.length; i++) z = f(z, l[i]);
  return z;
}

function push(l, x) {
  l = l.concat();
  l.push(x);
  return l;
}

var problems={sample:[[[[0,0],[1,0],[.5,.5],[0,.5]]],[],[[[.5,.5],[0,0]],[[0,0],[1,0]],[[1,0],[.5,.5]],[[.5,.5],[0,.5]],[[0,.5],[0,0]]]],small_square:[[[[1/7,1/7],[6/7,1/7],[6/7,6/7],[1/7,6/7]]],[],[[[1/7,1/7],[1/7,6/7]],[[3/7,1/7],[3/7,6/7]],[[6/7,1/7],[6/7,6/7]],[[1/7,1/7],[6/7,1/7]],[[1/7,3/7],[6/7,3/7]],[[1/7,6/7],[6/7,6/7]]]],decagon:[[[[27/68,13/71],[41/68,13/71],[57/74,24/79],[54/65,.5],[57/74,55/79],[41/68,58/71],[27/68,58/71],[17/74,55/79],[11/65,.5],[17/74,24/79]]],[],[[[57/74,24/79],[54/65,.5]],[[.7286845433607295,.5814599800650041],[57/74,55/79]],[[41/68,13/71],[57/74,24/79]],[[.738099142769453,.5812537190347948],[.7731811856604474,.686762221196457]],[[.5232865147639836,13/71],[.5556742304919766,.28637395263026993]],[[.4100097080204199,13/71],[.7631753433054331,.7013202890912382]],[[.4887568165388007,13/71],[.5082005270056249,.25143751407940623]],[[.6487944987736216,.5513562752397606],[.7631753433054331,.7013202890912382]],[[.40998625588783894,13/71],[.45243450937087176,.31076081630311847]],[[.4175447549894666,13/71],[.5556742304919766,.28637395263026993]],[[27/68,13/71],[.5,607710/2361389]],[[.40934780078982536,.18406984881326252],[.5082005270056249,.25143751407940623]],[[17/74,24/79],[.27131545663927037,.4185400199349959]],[[.35600602675372783,.6934359902363784],[27/68,58/71]],[[.23682465669456684,.2986797109087618],[.5899902919795801,58/71]],[[.23682465669456684,.2986797109087618],[.4622464191439451,.5942287816011118]],[[11/65,.5],[17/74,55/79]],[[.7056568857567658,.5079860847641432],[.8061745685831988,.5797622793196576]],[[.7339258374391964,.5959216596084586],[1671681/2117362,45/71]],[[17/74,24/79],[11/65,.5]],[[.40998625588783894,13/71],[.4074854824205284,.19061961487172313]],[[.4887568165388007,13/71],[.45243450937087176,.31076081630311847]],[[48223/149110,45/71],[.29062111550001396,.7401250898970351]],[[.5232865147639836,13/71],[.5,607710/2361389]],[[27/68,13/71],[41/68,13/71]],[[.1938254314168011,.4202377206803424],[.45027511755701616,.6033595560482007]],[[.5556742304919766,.28637395263026993],[.45027511755701616,.6033595560482007]],[[.738099142769453,.5812537190347948],[.7339258374391964,.5959216596084586]],[[.4100097080204199,13/71],[.40934780078982536,.18406984881326252]],[[.7056568857567658,.5079860847641432],[41/68,58/71]],[[54/65,.5],[57/74,55/79]],[[48223/149110,45/71],[.5906521992101746,.8159301511867375]],[[27/68,13/71],[17/74,24/79]],[[.4175447549894666,13/71],[.4074854824205284,.19061961487172313]],[[57/74,24/79],[.45243450937087176,.31076081630311847]],[[17/74,55/79],[27/68,58/71]],[[.27131545663927037,.4185400199349959],[11/65,.5]],[[41/68,13/71],[.5,607710/2361389]],[[.27131545663927037,.4185400199349959],[.1938254314168011,.4202377206803424]],[[.5906521992101746,.8159301511867375],[.5899902919795801,58/71]],[[.8061745685831988,.5797622793196576],[.7286845433607295,.5814599800650041]],[[.4622464191439451,.5942287816011118],[.45027511755701616,.6033595560482007]],[[.35600602675372783,.6934359902363784],[.29062111550001396,.7401250898970351]],[[48223/149110,45/71],[1671681/2117362,45/71]],[[.7056568857567658,.5079860847641432],[.6487944987736216,.5513562752397606]],[[.35600602675372783,.6934359902363784],[17/74,55/79]],[[54/65,.5],[.7286845433607295,.5814599800650041]],[[.7731811856604474,.686762221196457],[.7598354166911885,.6969413320806329]],[[27/68,58/71],[41/68,58/71]],[[57/74,55/79],[41/68,58/71]]]],donut:[[[[0,1/8],[1/8,0],[.25,0],[3/8,1/8],[3/8,.25],[.25,3/8],[1/8,3/8],[0,.25]]],[[[1/8,1/8],[1/8,.25],[.25,.25],[.25,1/8]]],[[[3/8,1/8],[0,1/8]],[[1/8,3/8],[1/8,0]],[[1/8,0],[.25,0]],[[.25,3/8],[1/8,3/8]],[[.25,0],[3/8,1/8]],[[3/8,.25],[.25,3/8]],[[0,.25],[3/8,.25]],[[3/8,.25],[3/8,1/8]],[[.25,0],[.25,3/8]],[[1/8,3/8],[0,.25]],[[0,.25],[0,1/8]],[[1/8,0],[0,1/8]]]],crane:[[[[.16,.72],[1831/6745,4749/6745],[49/195,224/585],[.35,.35],[224/585,49/195],[.84,.28],[448/895,294/895],[168/295,441/1180],[.7,.7],[441/1180,168/295],[294/895,448/895],[.3,.7],[277/1015,738/1015]]],[],[[[5603/14650,2777/7325],[39221/111815,38878/111815]],[[112/265,147/530],[5603/14650,2777/7325]],[[14/41,147/410],[.7,.7]],[[.7,.7],[168/295,441/1180]],[[.35,.35],[.84,.28]],[[49/195,224/585],[.35,.35]],[[147/415,28/83],[21/58,10/29]],[[39221/111815,38878/111815],[.84,.28]],[[.35,.35],[.3,.7]],[[5603/14650,2777/7325],[168/295,441/1180]],[[.5,21/64],[.5,.5]],[[21/58,10/29],[116/273,29/104]],[[2777/7325,5603/14650],[38878/111815,39221/111815]],[[21/64,.5],[2777/7325,5603/14650]],[[112/265,147/530],[147/530,112/265]],[[224/585,49/195],[.84,.28]],[[28/83,147/415],[188/635,447/635]],[[116/273,29/104],[5603/14650,2777/7325]],[[277/1015,738/1015],[.3,.7]],[[147/410,14/41],[.7,.7]],[[50378/168335,117957/168335],[38878/111815,39221/111815]],[[5603/14650,2777/7325],[.5,21/64]],[[.84,.28],[147/415,28/83]],[[10/29,21/58],[28/83,147/415]],[[.7,.7],[441/1180,168/295]],[[168/295,441/1180],[224/585,49/195]],[[.16,.72],[188/635,447/635]],[[.5,.5],[21/64,.5]],[[49/195,224/585],[441/1180,168/295]],[[2777/7325,5603/14650],[147/530,112/265]],[[441/1180,168/295],[2777/7325,5603/14650]],[[50378/168335,117957/168335],[.16,.72]],[[29/104,116/273],[2777/7325,5603/14650]],[[224/585,49/195],[.35,.35]],[[29/104,116/273],[10/29,21/58]],[[.16,.72],[277/1015,738/1015]],[[.3,.7],[.16,.72]],[[.5,.5],[.35,.35]],[[49/195,224/585],[277/1015,738/1015]]]]};

$('#solve').click(() => {
  const v = $('#problemInput').val(),
        lines = _.split(v, '\n'),
        polyNum = _.toInteger(lines[0]);
  if (polyNum != 1) {
    console.error('warning 1', polyNum);
    return;
  }
  const vertNum = _.toInteger(lines[1]),
        verts = lines.splice(2, vertNum).map(parseVert);
  let results = [];
  const silhouettes = [verts]
  // fst is silhouette
  results.push(silhouettes);
  // 未対応
  results.push([])
  results.push([])

  const pid = Math.floor(Math.random() * 100000)
  console.log(pid, results);
  problems[pid] = results
  $("#origami #silhouette-list").append('<li data-silhouette-id="' + pid + `"><a id="${pid}">` + pid + '</a></li>')
      $(`#${pid}`).click(function(d) {
      d.preventDefault();
      d = "active";
      $("#origami #silhouette li").removeClass(d);
      $(this).parent().addClass(d);
      B(I)
    });

})

const parseVert = x => {
  console.log(x);
  const xs = _.split(x, ',')
  return [math.fraction(xs[0]), math.fraction(xs[1])]
}

$('#solve2').click(() => {
  // Z([0.5, 1], [0.5, 0])
  const z = T("silhouette");
  const p = problems[z];
  const poly = p[0][0];
  console.log('poly',poly);
  const vecs = poly.map((v,k) => {
    return [poly[k > 0 ? k - 1 : poly.length - 1], v];
  });
  console.log('vecs', JSON.stringify(vecs));
  const f = (vec) => {
    let from = vec[0],
        to = vec[1],
        center = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
    console.log('center', from, to, center);
    let vec_ = [to[0] - from[0], to[1] - from[1]],
        verti = [vec_[1], -vec_[0]]
    console.log('vec_', vec_, verti);
    let mv = [verti[0] * 10, verti[1] * 10],
        mf = [center[0] + mv[0], center[1] + mv[1]],
        mt = [center[0] - mv[0], center[1] - mv[1]];
    console.log('mv', mv, mf, mt);
    return [mf, mt];
  }

  let polyS = verts2Shape(poly);
  
  let g = () => {
    return fold(I, null, (acc, i) => {
      let verts = i[1].map(x => x[1]);
      let poly = verts.length >= 3 ? verts2Shape(verts) : null;
      if (poly) {
        poly.scaleUp(gRate);
      }
      if (acc && poly) {
        console.log('acc', acc, poly.totalArea());
        if (poly.totalArea() <= 0) {
          return acc;
        }
        return acc.union(poly)
      }else {
        return poly
      }
    })
  }

  let firstRegion = verts2Shape([[0,0], [1,0], [1,1], [0,1]]);
  console.log('first region', polyS, firstRegion, polyS.intersect(firstRegion));
  var lastScore = scoreing(firstRegion, polyS, true)
  vecs.forEach((vec) =>{
    console.log('------start test -----')
    let mv = f(vec);
    Z(mv[0], mv[1]);
    let curRegion = g();
    let use = false
    try {
      var score = scoreing(curRegion, polyS, false);
      console.log('score', score, lastScore);
      if (score > lastScore) {
        lastScore = score;
        use = 1;
      }
    } catch(e) {
      console.log('ERR score', e);
    }
    if (use) {
    } else {
      if (G.length >= 1) I = G.pop();
      B(I)
    }
  });
});

const verts2Shape = vs => new Shape([vs.map(v => ({X: v[0], Y: v[1]}))]);

const gRate = 10000;
const scoreing = (f, t, suf) => {
  let f2 = f.clone();
  let t2 = t.clone();
  if (suf) {
    f2.scaleUp(gRate);
  }
  t2.scaleUp(gRate);
  console.log('f, t', f, t);
  let s = f2.intersect(t2);
  console.log('s', s);
  return s.totalArea() / f2.totalArea();
}

//j: from
//z: to
function Z(j, z, f) {
  if (j) {
    var b = F(z, j),
        q = W(R(j, z), [2, 0]),
        y, p;
    q = b[0] * q[0] + b[1] * q[1];
    if (b[0]) {
      y = [q / b[0], 0];
      p = [(q - b[1]) / b[0], 1]
    } else {
      if (!b[1]) return;
      y = [0, q / b[1]];
      p = [1, q / b[1]]
    }
    L(F(z, j), N(F(y, j)))[1] >= 0 && (q = y, y = p, p = q);
    q = fold(I.concat().reverse(), [], function(d, w) {
      var s = C(w[1], [
        [],
        []
      ], function(s, c, v) {
        var m = push(s[0], c),
            g = F(p, y),
            q = W(F(v[1], c[1]), g);
        return q[1] != 0 && (q = W(F(c[1], y), g)[1] / -q[1], 0 <= q && q < 1) ? (q = R(c[1], L(F(v[1], c[1]), [q, 0])), q = [R(L(F(v[0], c[0]), W(F(q, c[1]), F(v[1], c[1]))), c[0]), q], [push(s[1], q), push(m, q)]) : [m, s[1]]
      });
      s = s[1].length ? (L(F(p, y), N(F(s[0][0][1], y)))[1] >= 0 && (s = s.reverse()), U(s, function(o) {
        return [w[0], C(o, [], function(s, y, p) {
          return y[1][0] == p[1][0] && y[1][1] == p[1][1] && y[0][0] == p[0][0] && y[0][1] == p[0][1] ? s : push(s, y)
        })]
      })) : L(F(p, y), N(F(w[1][0][1], y)))[1] >= 0 ? [0, w] : [w];
      s[0] && d.unshift(s[0]);
      if (s[1]) {
        var k = F(p, y);
        k = W(k, N(k));
        d = push(d, [!s[1][0], U(s[1][1], function(t) {
          return [t[0], R(L(N(F(t[1], y)), k), y)]
        })])
      }
      return d
    });
    if (f) {
      B(q);
      var e = $("#dst")[0].getContext("2d");
      O([j, z], function(l) {
        e.fillStyle = "#000000";
        e.fillRect(l[0] - 1 / 128, l[1] - 1 / 128, 1 / 64, 1 / 64)
      })
    } else G.push(I), I = q, E = 0, B(I)
  }
}

function B(n) {
  Q(n, 1);
  Q(n, 0)
}

function F(f, q) {
  return [f[0] - q[0], f[1] - q[1]]
}

function T(h) {
  return $("#origami #" + h + " li.active").data(h + "-id")
}

function Y(r) {
  if (r.length == 0) $("#flip").click(function() {
    I = E ? G.pop() : (G.push(I), U(I, function(w) {
      return [!w[0], U(w[1], function(z) {
        return [z[0], S(z[1])]
      })]
    }).reverse());
    E = !E;
    B(I)
  }), $("#undo").click(function() {
    if (G.length >= 1) I = G.pop();
    B(I)
  }), $.map(problems, function(s, g) {
    console.log();
    $("#origami #silhouette-list").append('<li data-silhouette-id="' + g + '"><a href="#">' + g + '</a></li>')
  }), O([0, 1], function(q) {
    var y = "#origami #" + (q ? "silhouette" : "texture"),
        f = $(q ? "#dst" : "#src"),
        c = f.height() / 2 + 128,
        j = f.width() / 2 - 128,
        m = 0;
    $(y + " a").click(function(d) {
      d.preventDefault();
      d = "active";
      $(y + " li").removeClass(d);
      $(this).parent().addClass(d);
      B(I)
    });
    if (q) {
      var u = function(b) {
        var o = b.offsetX,
            t = b.offsetY;
        var k = b.originalEvent.changedTouches;
        if (k) {
          var n = $("#dst")[0].getBoundingClientRect();
          o = k[0].pageX - n.left;
          t = k[0].pageY - n.top
        }
        return [(o - j) / 256, (c - t) / 256]
      },
          h;
      f.mousedown(h = function(d) {
        $("#navi").remove();
        m = u(d);
        return !1
      });
      f.bind("touchstart", h);
      f.mousemove(h = function(d) {
        Z(m, u(d), 1);
        return !1
      });
      f.bind("touchmove", h);
      f.mouseup(h = function(d) {
        Z(m, u(d));
        m = 0;
        console.log("I", JSON.stringify(I, null, 4));
        output();
        return !1
      });
      f.bind("touchend", h)
    }
    f[0].getContext("2d").setTransform(256, 0, 0, -256, j, c)
  }), B(I);
  else {
    var e = new Image();
    J.push(e);
    e.onload = function() {
      Y(r)
    };
    e.src = "./static/texture" + r.shift() + ".png"
  }
}

function S(e) {
  return [1 - e[0], e[1]]
}

function R(t, m) {
  return [t[0] + m[0], t[1] + m[1]]
}

function Q(i, e) {
  var k = $(e ? "#dst" : "#src")[0].getContext("2d");
  k.clearRect(-1, -1, 3, 3);
  k.beginPath();
  k.lineWidth = .001;
  k.strokeStyle = "#000000";
  fold(Array.apply(null, {
    length: 40
  }), -10, function(a, o) {
    k.moveTo(-1, o = a / 10);
    k.lineTo(3, o);
    k.moveTo(o, -1);
    k.lineTo(o, 3);
    return a + 1
  });
  k.stroke();
  O(i, function(v) {
    k.beginPath();
    var g = v[1];
    O(g, function(y) {
      k.lineTo(y[e][0], y[e][1])
    });
    k.closePath();
     var j = T("texture");
    //var j = '1';
    j && (e && v[0] ? (k.save(), k.clip(), k.translate(g[0][1][0], g[0][1][1]), i = S(g[0][0]), g = W(F(S(g[1][0]), i), F(g[1][1], g[0][1])), k.rotate(-Math.atan2(g[1], g[0])), k.translate(-i[0], -i[1]), k.drawImage(J[j - 1], 0, 0, 512, 512, 0, 0, 1, 1), k.restore()) : (k.fillStyle = "#cccccc", k.fill()));
    k.lineWidth = .003;
    k.strokeStyle = "#000000";
    k.stroke()
  });
  if (e) {
    var z = T("silhouette");
    if (z = z ? problems[z] : null) k.beginPath(), O([z[0], z[1]], function(n) {
      O(n, function(l) {
        O(l, function(y) {
          k.lineTo(y[0], y[1])
        });
        k.closePath()
      })
    }), k.fillStyle = "rgba(255,192,192,.8)", k.fill(), k.beginPath(), O(z[2], function(u) {
      k.moveTo(u[0][0], u[0][1]);
      k.lineTo(u[1][0], u[1][1])
    }), k.lineWidth = .005, k.strokeStyle = "rgba(255,128,128,.8)", k.stroke()
  }
}

function C(n, l, k) {
  l = fold(n, [l], function(l, v) {
    return [l[1] ? k(l[0], l[1], v) : l[0], v]
  });
  return k(l[0], l[1], n[0])
}

function L(g, t) {
  return [g[0] * t[0] - g[1] * t[1], g[0] * t[1] + g[1] * t[0]]
}

function W(p, x) {
  var d = x[0] * x[0] + x[1] * x[1];
  return [(x[0] * p[0] + x[1] * p[1]) / d, (x[0] * p[1] - x[1] * p[0]) / d]
}

function U(q, n) {
  return fold(q, [], function(w, y) {
    return push(w, n(y))
  })
}

function N(y) {
  return [y[0], -y[1]]
}

function O(c, z) {
  fold(c, 0, function(t, x) {
    z(x)
  })
}
var I = [
  // [!1, [
  //   [
  //     [new Fraction(0), new Fraction(0)],
  //     [new Fraction(0), new Fraction(0)]
  //   ],
  //   [
  //     [new Fraction(1), new Fraction(0)],
  //     [new Fraction(1), new Fraction(0)]
  //   ],
  //   [
  //     [new Fraction(1), new Fraction(1)],
  //     [new Fraction(1), new Fraction(1)]
  //   ],
  //   [
  //     [new Fraction(0), new Fraction(1)],
  //     [new Fraction(0), new Fraction(1)]
  //   ]
  // ]]
  [!1, [
    [
      [0, 0],
      [0, 0]
    ],
    [
      [1, 0],
      [1, 0]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [0, 1],
      [0, 1]
    ]
  ]]
],
    G = [],
    E = 0,
    J = [];
$(function() {
  Y([0])
});


const output = (i = I) => {
  console.log('i', JSON.stringify(i, null, 4));
  const allPolys = i.map(x => x[1].map(y => y.map(z => z.map(a => math.fraction(a)))))
  console.log('all polys', JSON.stringify(allPolys, null, 4));
  
  
  let results = [];

  // 頂点
  const allFromVerts = fold(allPolys, [], (acc, vecs) => {
    return acc.concat(fold(vecs, [], (acc_, y) => {
      return push(acc_, y[0]);
    }));
  })
  console.log('allVerts', allFromVerts);
  const srcVerts = _.uniqWith(allFromVerts, (a, b) =>
                              math.equal(a[0], b[0]) && math.equal(a[1], b[1]));
  console.log('srcVerts', srcVerts);
  results.push(srcVerts.length);
  srcVerts.forEach(x => {
    results.push((showF(x[0]) + ',' + showF(x[1])));
  })
  
  // 折り目ん
  results.push(allPolys.length);
  allPolys.forEach(vecs => {
    const froms = vecs.map(fst);
    const indecies = froms.map(x => {
      const r =  srcVerts.findIndex(s => math.equal(s[0], x[0]) && math.equal(s[1], x[1]));
      if (r == -1) {
        console.error('error 1');
      }
      return r;
    });    
    results.push(`${froms.length} ${_.join(indecies, ' ')}`);
  })
  //　行き先
  const allVecs = fold(allPolys, [], (acc, vecs) => {
    return acc.concat(vecs);
  })

  srcVerts.forEach(x => {
    const i = allVecs.findIndex(vec => math.equal(vec[0][0], x[0]) && math.equal(vec[0][1], x[1]));
    if (i == -1) {
      console.log('allVecs', showListVecs(allVecs));
      console.error('error 2', showTupleF(x));
      console.log(_.join(results, '\n'));
    }
    const toV = allVecs[i][1];
    console.log('tov', toV);
    results.push(showF(toV[0]) + ',' + showF(toV[1]));
  });
  console.log(_.join(results, '\n'));
}

const fst = xs => xs[0];

const toFStr = (d) => {
  let f = new math.fraction(d)
  return (f.n * f.s) + '/' + f.d;
}

const showF = (f) => {
  return (f.n * f.s)+ '/' + f.d;
}

const showTupleF = (fs) => {
  return '(' + showF(fs[0]) + ', ' + showF(fs[1]) + ')';
}

const showListVertex = (vs) => {
  console.log('vs', vs);
  return vs.map(showTupleF);
}

const showListVecs = (vs) => {
  console.log('vs', vs[0][0]);
  return vs.map(vec => showTupleF(vec[0]) + ' -> ' + showTupleF(vec[1]));
}

const sampleI =   [
  [
    false,
    [
      [
        [
          0,
          0
        ],
        [
          0,
          0
        ]
      ],
      [
        [
          1,
          0
        ],
        [
          1,
          0
        ]
      ],
      [
        [
          0.5,
          0.5
        ],
        [
          0.5,
          0.5
        ]
      ],
      [
        [
          0,
          0.5
        ],
        [
          0,
          0.5
        ]
      ]
    ]
  ],
  [
    true,
    [
      [
        [
          1,
          0
        ],
        [
          1,
          0
        ]
      ],
      [
        [
          1,
          1
        ],
        [
          0,
          0
        ]
      ],
      [
        [
          0.5,
          1
        ],
        [
          0,
          0.5
        ]
      ],
      [
        [
          0.5,
          0.5
        ],
        [
          0.5,
          0.5
        ]
      ]
    ]
  ],
  [
    false,
    [
      [
        [
          0.5,
          1
        ],
        [
          0,
          0.5
        ]
      ],
      [
        [
          0,
          1
        ],
        [
          0,
          0
        ]
      ],
      [
        [
          0.5,
          0.5
        ],
        [
          0.5,
          0.5
        ]
      ]
    ]
  ],
  [
    true,
    [
      [
        [
          0.5,
          0.5
        ],
        [
          0.5,
          0.5
        ]
      ],
      [
        [
          0,
          1
        ],
        [
          0,
          0
        ]
      ],
      [
        [
          0,
          0.5
        ],
        [
          0,
          0.5
        ]
      ]
    ]
  ]
]

console.log('start test--');
output(sampleI)
console.log('--finish test');

$('#output').click(() => {
  output();
})
