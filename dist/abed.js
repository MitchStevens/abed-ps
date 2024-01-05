(() => {
  // output/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f) {
      var result = [];
      for (var i2 = 0, l2 = arr.length; i2 < l2; i2++) {
        Array.prototype.push.apply(result, f(arr[i2]));
      }
      return result;
    };
  };

  // output/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l2 = fs.length;
      var k = xs.length;
      var result = new Array(l2 * k);
      var n = 0;
      for (var i2 = 0; i2 < l2; i2++) {
        var f = fs[i2];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g2) {
        return function(x2) {
          return f(g2(x2));
        };
      };
    }
  };
  var compose = function(dict) {
    return dict.compose;
  };
  var composeFlipped = function(dictSemigroupoid) {
    var compose1 = compose(dictSemigroupoid);
    return function(f) {
      return function(g2) {
        return compose1(g2)(f);
      };
    };
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x2) {
      return x2;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var flip = function(f) {
    return function(b2) {
      return function(a3) {
        return f(a3)(b2);
      };
    };
  };
  var $$const = function(a3) {
    return function(v2) {
      return a3;
    };
  };
  var applyFlipped = function(x2) {
    return function(f) {
      return f(x2);
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l2 = arr.length;
      var result = new Array(l2);
      for (var i2 = 0; i2 < l2; i2++) {
        result[i2] = f(arr[i2]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ function() {
    function $$Proxy2() {
    }
    ;
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  }();

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var mapFlipped = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map126(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var voidLeft = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return function(f) {
      return function(x2) {
        return map126($$const(x2))(f);
      };
    };
  };
  var voidRight = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return function(x2) {
      return map126($$const(x2));
    };
  };
  var functorFn = {
    map: /* @__PURE__ */ compose(semigroupoidFn)
  };
  var functorArray = {
    map: arrayMap
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyFn = {
    apply: function(f) {
      return function(g2) {
        return function(x2) {
          return f(x2)(g2(x2));
        };
      };
    },
    Functor0: function() {
      return functorFn;
    }
  };
  var applyArray = {
    apply: arrayApply,
    Functor0: function() {
      return functorArray;
    }
  };
  var apply = function(dict) {
    return dict.apply;
  };
  var applyFirst = function(dictApply) {
    var apply12 = apply(dictApply);
    var map60 = map(dictApply.Functor0());
    return function(a3) {
      return function(b2) {
        return apply12(map60($$const)(a3))(b2);
      };
    };
  };
  var applySecond = function(dictApply) {
    var apply12 = apply(dictApply);
    var map60 = map(dictApply.Functor0());
    return function(a3) {
      return function(b2) {
        return apply12(map60($$const(identity2))(a3))(b2);
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var unless = function(dictApplicative) {
    var pure114 = pure(dictApplicative);
    return function(v2) {
      return function(v1) {
        if (!v2) {
          return v1;
        }
        ;
        if (v2) {
          return pure114(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v2.constructor.name, v1.constructor.name]);
      };
    };
  };
  var when = function(dictApplicative) {
    var pure114 = pure(dictApplicative);
    return function(v2) {
      return function(v1) {
        if (v2) {
          return v1;
        }
        ;
        if (!v2) {
          return pure114(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v2.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply7 = apply(dictApplicative.Apply0());
    var pure114 = pure(dictApplicative);
    return function(f) {
      return function(a3) {
        return apply7(pure114(f))(a3);
      };
    };
  };
  var applicativeFn = {
    pure: function(x2) {
      return function(v2) {
        return x2;
      };
    },
    Apply0: function() {
      return applyFn;
    }
  };
  var applicativeArray = {
    pure: function(x2) {
      return [x2];
    },
    Apply0: function() {
      return applyArray;
    }
  };

  // output/Control.Bind/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var discard = function(dict) {
    return dict.discard;
  };
  var bindFn = {
    bind: function(m2) {
      return function(f) {
        return function(x2) {
          return f(m2(x2))(x2);
        };
      };
    },
    Apply0: function() {
      return applyFn;
    }
  };
  var bindArray = {
    bind: arrayBind,
    Apply0: function() {
      return applyArray;
    }
  };
  var bind = function(dict) {
    return dict.bind;
  };
  var bindFlipped = function(dictBind) {
    return flip(bind(dictBind));
  };
  var composeKleisliFlipped = function(dictBind) {
    var bindFlipped13 = bindFlipped(dictBind);
    return function(f) {
      return function(g2) {
        return function(a3) {
          return bindFlipped13(f)(g2(a3));
        };
      };
    };
  };
  var composeKleisli = function(dictBind) {
    var bind118 = bind(dictBind);
    return function(f) {
      return function(g2) {
        return function(a3) {
          return bind118(f(a3))(g2);
        };
      };
    };
  };
  var discardUnit = {
    discard: function(dictBind) {
      return bind(dictBind);
    }
  };
  var join = function(dictBind) {
    var bind118 = bind(dictBind);
    return function(m2) {
      return bind118(m2)(identity3);
    };
  };

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init4) {
      return function(xs) {
        var acc = init4;
        var len = xs.length;
        for (var i2 = len - 1; i2 >= 0; i2--) {
          acc = f(xs[i2])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init4) {
      return function(xs) {
        var acc = init4;
        var len = xs.length;
        for (var i2 = 0; i2 < len; i2++) {
          acc = f(acc)(xs[i2]);
        }
        return acc;
      };
    };
  };

  // output/Data.Semigroup/foreign.js
  var concatString = function(s1) {
    return function(s2) {
      return s1 + s2;
    };
  };
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function(dict) {
    return dict.reflectSymbol;
  };

  // output/Data.Void/index.js
  var absurd = function(a3) {
    var spin = function($copy_v) {
      var $tco_result;
      function $tco_loop(v2) {
        $copy_v = v2;
        return;
      }
      ;
      while (true) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    return spin(a3);
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label5) {
    return function(rec) {
      return rec[label5];
    };
  };
  var unsafeSet = function(label5) {
    return function(value14) {
      return function(rec) {
        var copy2 = {};
        for (var key2 in rec) {
          if ({}.hasOwnProperty.call(rec, key2)) {
            copy2[key2] = rec[key2];
          }
        }
        copy2[label5] = value14;
        return copy2;
      };
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupString = {
    append: concatString
  };
  var semigroupArray = {
    append: concatArray
  };
  var append = function(dict) {
    return dict.append;
  };
  var semigroupFn = function(dictSemigroup) {
    var append112 = append(dictSemigroup);
    return {
      append: function(f) {
        return function(g2) {
          return function(x2) {
            return append112(f(x2))(g2(x2));
          };
        };
      }
    };
  };

  // output/Control.Alt/index.js
  var alt = function(dict) {
    return dict.alt;
  };

  // output/Control.Plus/index.js
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Data.Bounded/foreign.js
  var topInt = 2147483647;
  var bottomInt = -2147483648;
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq26) {
      return function(gt) {
        return function(x2) {
          return function(y2) {
            return x2 < y2 ? lt : x2 === y2 ? eq26 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;
  var ordArrayImpl = function(f) {
    return function(xs) {
      return function(ys) {
        var i2 = 0;
        var xlen = xs.length;
        var ylen = ys.length;
        while (i2 < xlen && i2 < ylen) {
          var x2 = xs[i2];
          var y2 = ys[i2];
          var o = f(x2)(y2);
          if (o !== 0) {
            return o;
          }
          i2++;
        }
        if (xlen === ylen) {
          return 0;
        } else if (xlen > ylen) {
          return -1;
        } else {
          return 1;
        }
      };
    };
  };

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqBooleanImpl = refEq;
  var eqIntImpl = refEq;
  var eqCharImpl = refEq;
  var eqStringImpl = refEq;
  var eqArrayImpl = function(f) {
    return function(xs) {
      return function(ys) {
        if (xs.length !== ys.length)
          return false;
        for (var i2 = 0; i2 < xs.length; i2++) {
          if (!f(xs[i2])(ys[i2]))
            return false;
        }
        return true;
      };
    };
  };

  // output/Data.Eq/index.js
  var eqUnit = {
    eq: function(v2) {
      return function(v1) {
        return true;
      };
    }
  };
  var eqString = {
    eq: eqStringImpl
  };
  var eqRowNil = {
    eqRecord: function(v2) {
      return function(v1) {
        return function(v22) {
          return true;
        };
      };
    }
  };
  var eqRecord = function(dict) {
    return dict.eqRecord;
  };
  var eqRec = function() {
    return function(dictEqRecord) {
      return {
        eq: eqRecord(dictEqRecord)($$Proxy.value)
      };
    };
  };
  var eqInt = {
    eq: eqIntImpl
  };
  var eqChar = {
    eq: eqCharImpl
  };
  var eqBoolean = {
    eq: eqBooleanImpl
  };
  var eq1 = function(dict) {
    return dict.eq1;
  };
  var eq = function(dict) {
    return dict.eq;
  };
  var eq2 = /* @__PURE__ */ eq(eqBoolean);
  var eqArray = function(dictEq) {
    return {
      eq: eqArrayImpl(eq(dictEq))
    };
  };
  var eqRowCons = function(dictEqRecord) {
    var eqRecord1 = eqRecord(dictEqRecord);
    return function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(dictEq) {
          var eq33 = eq(dictEq);
          return {
            eqRecord: function(v2) {
              return function(ra) {
                return function(rb) {
                  var tail3 = eqRecord1($$Proxy.value)(ra)(rb);
                  var key2 = reflectSymbol2($$Proxy.value);
                  var get5 = unsafeGet(key2);
                  return eq33(get5(ra))(get5(rb)) && tail3;
                };
              };
            }
          };
        };
      };
    };
  };
  var notEq = function(dictEq) {
    var eq33 = eq(dictEq);
    return function(x2) {
      return function(y2) {
        return eq2(eq33(x2)(y2))(false);
      };
    };
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();
  var semigroupOrdering = {
    append: function(v2) {
      return function(v1) {
        if (v2 instanceof LT) {
          return LT.value;
        }
        ;
        if (v2 instanceof GT) {
          return GT.value;
        }
        ;
        if (v2 instanceof EQ) {
          return v1;
        }
        ;
        throw new Error("Failed pattern match at Data.Ordering (line 21, column 1 - line 24, column 18): " + [v2.constructor.name, v1.constructor.name]);
      };
    }
  };
  var eqOrdering = {
    eq: function(v2) {
      return function(v1) {
        if (v2 instanceof LT && v1 instanceof LT) {
          return true;
        }
        ;
        if (v2 instanceof GT && v1 instanceof GT) {
          return true;
        }
        ;
        if (v2 instanceof EQ && v1 instanceof EQ) {
          return true;
        }
        ;
        return false;
      };
    }
  };

  // output/Data.Ring/foreign.js
  var intSub = function(x2) {
    return function(y2) {
      return x2 - y2 | 0;
    };
  };
  var numSub = function(n1) {
    return function(n2) {
      return n1 - n2;
    };
  };

  // output/Data.Semiring/foreign.js
  var intAdd = function(x2) {
    return function(y2) {
      return x2 + y2 | 0;
    };
  };
  var intMul = function(x2) {
    return function(y2) {
      return x2 * y2 | 0;
    };
  };
  var numAdd = function(n1) {
    return function(n2) {
      return n1 + n2;
    };
  };
  var numMul = function(n1) {
    return function(n2) {
      return n1 * n2;
    };
  };

  // output/Data.Semiring/index.js
  var zeroRecord = function(dict) {
    return dict.zeroRecord;
  };
  var zero = function(dict) {
    return dict.zero;
  };
  var semiringRecordNil = {
    addRecord: function(v2) {
      return function(v1) {
        return function(v22) {
          return {};
        };
      };
    },
    mulRecord: function(v2) {
      return function(v1) {
        return function(v22) {
          return {};
        };
      };
    },
    oneRecord: function(v2) {
      return function(v1) {
        return {};
      };
    },
    zeroRecord: function(v2) {
      return function(v1) {
        return {};
      };
    }
  };
  var semiringNumber = {
    add: numAdd,
    zero: 0,
    mul: numMul,
    one: 1
  };
  var semiringInt = {
    add: intAdd,
    zero: 0,
    mul: intMul,
    one: 1
  };
  var oneRecord = function(dict) {
    return dict.oneRecord;
  };
  var one = function(dict) {
    return dict.one;
  };
  var mulRecord = function(dict) {
    return dict.mulRecord;
  };
  var mul = function(dict) {
    return dict.mul;
  };
  var addRecord = function(dict) {
    return dict.addRecord;
  };
  var semiringRecord = function() {
    return function(dictSemiringRecord) {
      return {
        add: addRecord(dictSemiringRecord)($$Proxy.value),
        mul: mulRecord(dictSemiringRecord)($$Proxy.value),
        one: oneRecord(dictSemiringRecord)($$Proxy.value)($$Proxy.value),
        zero: zeroRecord(dictSemiringRecord)($$Proxy.value)($$Proxy.value)
      };
    };
  };
  var add = function(dict) {
    return dict.add;
  };
  var semiringRecordCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(dictSemiringRecord) {
        var addRecord1 = addRecord(dictSemiringRecord);
        var mulRecord1 = mulRecord(dictSemiringRecord);
        var oneRecord1 = oneRecord(dictSemiringRecord);
        var zeroRecord1 = zeroRecord(dictSemiringRecord);
        return function(dictSemiring) {
          var add1 = add(dictSemiring);
          var mul1 = mul(dictSemiring);
          var one1 = one(dictSemiring);
          var zero1 = zero(dictSemiring);
          return {
            addRecord: function(v2) {
              return function(ra) {
                return function(rb) {
                  var tail3 = addRecord1($$Proxy.value)(ra)(rb);
                  var key2 = reflectSymbol2($$Proxy.value);
                  var insert14 = unsafeSet(key2);
                  var get5 = unsafeGet(key2);
                  return insert14(add1(get5(ra))(get5(rb)))(tail3);
                };
              };
            },
            mulRecord: function(v2) {
              return function(ra) {
                return function(rb) {
                  var tail3 = mulRecord1($$Proxy.value)(ra)(rb);
                  var key2 = reflectSymbol2($$Proxy.value);
                  var insert14 = unsafeSet(key2);
                  var get5 = unsafeGet(key2);
                  return insert14(mul1(get5(ra))(get5(rb)))(tail3);
                };
              };
            },
            oneRecord: function(v2) {
              return function(v1) {
                var tail3 = oneRecord1($$Proxy.value)($$Proxy.value);
                var key2 = reflectSymbol2($$Proxy.value);
                var insert14 = unsafeSet(key2);
                return insert14(one1)(tail3);
              };
            },
            zeroRecord: function(v2) {
              return function(v1) {
                var tail3 = zeroRecord1($$Proxy.value)($$Proxy.value);
                var key2 = reflectSymbol2($$Proxy.value);
                var insert14 = unsafeSet(key2);
                return insert14(zero1)(tail3);
              };
            }
          };
        };
      };
    };
  };

  // output/Data.Ring/index.js
  var sub = function(dict) {
    return dict.sub;
  };
  var ringNumber = {
    sub: numSub,
    Semiring0: function() {
      return semiringNumber;
    }
  };
  var ringInt = {
    sub: intSub,
    Semiring0: function() {
      return semiringInt;
    }
  };

  // output/Data.Ord/index.js
  var eqRec2 = /* @__PURE__ */ eqRec();
  var notEq2 = /* @__PURE__ */ notEq(eqOrdering);
  var ordUnit = {
    compare: function(v2) {
      return function(v1) {
        return EQ.value;
      };
    },
    Eq0: function() {
      return eqUnit;
    }
  };
  var ordString = /* @__PURE__ */ function() {
    return {
      compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqString;
      }
    };
  }();
  var ordRecordNil = {
    compareRecord: function(v2) {
      return function(v1) {
        return function(v22) {
          return EQ.value;
        };
      };
    },
    EqRecord0: function() {
      return eqRowNil;
    }
  };
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var ordChar = /* @__PURE__ */ function() {
    return {
      compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqChar;
      }
    };
  }();
  var compareRecord = function(dict) {
    return dict.compareRecord;
  };
  var ordRecord = function() {
    return function(dictOrdRecord) {
      var eqRec1 = eqRec2(dictOrdRecord.EqRecord0());
      return {
        compare: compareRecord(dictOrdRecord)($$Proxy.value),
        Eq0: function() {
          return eqRec1;
        }
      };
    };
  };
  var compare1 = function(dict) {
    return dict.compare1;
  };
  var compare = function(dict) {
    return dict.compare;
  };
  var compare2 = /* @__PURE__ */ compare(ordInt);
  var comparing = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(f) {
      return function(x2) {
        return function(y2) {
          return compare33(f(x2))(f(y2));
        };
      };
    };
  };
  var greaterThan = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(a1) {
      return function(a22) {
        var v2 = compare33(a1)(a22);
        if (v2 instanceof GT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var greaterThanOrEq = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(a1) {
      return function(a22) {
        var v2 = compare33(a1)(a22);
        if (v2 instanceof LT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var lessThan = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(a1) {
      return function(a22) {
        var v2 = compare33(a1)(a22);
        if (v2 instanceof LT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var lessThanOrEq = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(a1) {
      return function(a22) {
        var v2 = compare33(a1)(a22);
        if (v2 instanceof GT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var max = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(x2) {
      return function(y2) {
        var v2 = compare33(x2)(y2);
        if (v2 instanceof LT) {
          return y2;
        }
        ;
        if (v2 instanceof EQ) {
          return x2;
        }
        ;
        if (v2 instanceof GT) {
          return x2;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v2.constructor.name]);
      };
    };
  };
  var min = function(dictOrd) {
    var compare33 = compare(dictOrd);
    return function(x2) {
      return function(y2) {
        var v2 = compare33(x2)(y2);
        if (v2 instanceof LT) {
          return x2;
        }
        ;
        if (v2 instanceof EQ) {
          return x2;
        }
        ;
        if (v2 instanceof GT) {
          return y2;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v2.constructor.name]);
      };
    };
  };
  var ordArray = function(dictOrd) {
    var compare33 = compare(dictOrd);
    var eqArray2 = eqArray(dictOrd.Eq0());
    return {
      compare: function() {
        var toDelta = function(x2) {
          return function(y2) {
            var v2 = compare33(x2)(y2);
            if (v2 instanceof EQ) {
              return 0;
            }
            ;
            if (v2 instanceof LT) {
              return 1;
            }
            ;
            if (v2 instanceof GT) {
              return -1 | 0;
            }
            ;
            throw new Error("Failed pattern match at Data.Ord (line 79, column 7 - line 82, column 17): " + [v2.constructor.name]);
          };
        };
        return function(xs) {
          return function(ys) {
            return compare2(0)(ordArrayImpl(toDelta)(xs)(ys));
          };
        };
      }(),
      Eq0: function() {
        return eqArray2;
      }
    };
  };
  var ordRecordCons = function(dictOrdRecord) {
    var compareRecord1 = compareRecord(dictOrdRecord);
    var eqRowCons2 = eqRowCons(dictOrdRecord.EqRecord0())();
    return function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        var eqRowCons1 = eqRowCons2(dictIsSymbol);
        return function(dictOrd) {
          var compare33 = compare(dictOrd);
          var eqRowCons22 = eqRowCons1(dictOrd.Eq0());
          return {
            compareRecord: function(v2) {
              return function(ra) {
                return function(rb) {
                  var key2 = reflectSymbol2($$Proxy.value);
                  var left2 = compare33(unsafeGet(key2)(ra))(unsafeGet(key2)(rb));
                  var $95 = notEq2(left2)(EQ.value);
                  if ($95) {
                    return left2;
                  }
                  ;
                  return compareRecord1($$Proxy.value)(ra)(rb);
                };
              };
            },
            EqRecord0: function() {
              return eqRowCons22;
            }
          };
        };
      };
    };
  };
  var clamp = function(dictOrd) {
    var min1 = min(dictOrd);
    var max1 = max(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x2) {
          return min1(hi)(max1(low2)(x2));
        };
      };
    };
  };
  var between = function(dictOrd) {
    var lessThan1 = lessThan(dictOrd);
    var greaterThan1 = greaterThan(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x2) {
          if (lessThan1(x2)(low2)) {
            return false;
          }
          ;
          if (greaterThan1(x2)(hi)) {
            return false;
          }
          ;
          return true;
        };
      };
    };
  };

  // output/Data.Bounded/index.js
  var top = function(dict) {
    return dict.top;
  };
  var boundedInt = {
    top: topInt,
    bottom: bottomInt,
    Ord0: function() {
      return ordInt;
    }
  };
  var boundedChar = {
    top: topChar,
    bottom: bottomChar,
    Ord0: function() {
      return ordChar;
    }
  };
  var bottom = function(dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showNumberImpl = function(n) {
    var str2 = n.toString();
    return isNaN(str2 + ".0") ? str2 : str2 + ".0";
  };
  var showStringImpl = function(s2) {
    var l2 = s2.length;
    return '"' + s2.replace(
      /[\0-\x1F\x7F"\\]/g,
      // eslint-disable-line no-control-regex
      function(c2, i2) {
        switch (c2) {
          case '"':
          case "\\":
            return "\\" + c2;
          case "\x07":
            return "\\a";
          case "\b":
            return "\\b";
          case "\f":
            return "\\f";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "	":
            return "\\t";
          case "\v":
            return "\\v";
        }
        var k = i2 + 1;
        var empty9 = k < l2 && s2[k] >= "0" && s2[k] <= "9" ? "\\&" : "";
        return "\\" + c2.charCodeAt(0).toString(10) + empty9;
      }
    ) + '"';
  };
  var showArrayImpl = function(f) {
    return function(xs) {
      var ss = [];
      for (var i2 = 0, l2 = xs.length; i2 < l2; i2++) {
        ss[i2] = f(xs[i2]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output/Data.Show/index.js
  var showString = {
    show: showStringImpl
  };
  var showRecordFields = function(dict) {
    return dict.showRecordFields;
  };
  var showRecord = function() {
    return function() {
      return function(dictShowRecordFields) {
        var showRecordFields1 = showRecordFields(dictShowRecordFields);
        return {
          show: function(record) {
            return "{" + (showRecordFields1($$Proxy.value)(record) + "}");
          }
        };
      };
    };
  };
  var showNumber = {
    show: showNumberImpl
  };
  var showInt = {
    show: showIntImpl
  };
  var showBoolean = {
    show: function(v2) {
      if (v2) {
        return "true";
      }
      ;
      if (!v2) {
        return "false";
      }
      ;
      throw new Error("Failed pattern match at Data.Show (line 29, column 1 - line 31, column 23): " + [v2.constructor.name]);
    }
  };
  var show = function(dict) {
    return dict.show;
  };
  var showArray = function(dictShow) {
    return {
      show: showArrayImpl(show(dictShow))
    };
  };
  var showRecordFieldsCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShowRecordFields) {
      var showRecordFields1 = showRecordFields(dictShowRecordFields);
      return function(dictShow) {
        var show114 = show(dictShow);
        return {
          showRecordFields: function(v2) {
            return function(record) {
              var tail3 = showRecordFields1($$Proxy.value)(record);
              var key2 = reflectSymbol2($$Proxy.value);
              var focus3 = unsafeGet(key2)(record);
              return " " + (key2 + (": " + (show114(focus3) + ("," + tail3))));
            };
          }
        };
      };
    };
  };
  var showRecordFieldsConsNil = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShow) {
      var show114 = show(dictShow);
      return {
        showRecordFields: function(v2) {
          return function(record) {
            var key2 = reflectSymbol2($$Proxy.value);
            var focus3 = unsafeGet(key2)(record);
            return " " + (key2 + (": " + (show114(focus3) + " ")));
          };
        }
      };
    };
  };

  // output/Data.Generic.Rep/index.js
  var Inl = /* @__PURE__ */ function() {
    function Inl2(value0) {
      this.value0 = value0;
    }
    ;
    Inl2.create = function(value0) {
      return new Inl2(value0);
    };
    return Inl2;
  }();
  var Inr = /* @__PURE__ */ function() {
    function Inr2(value0) {
      this.value0 = value0;
    }
    ;
    Inr2.create = function(value0) {
      return new Inr2(value0);
    };
    return Inr2;
  }();
  var Product = /* @__PURE__ */ function() {
    function Product3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Product3.create = function(value0) {
      return function(value1) {
        return new Product3(value0, value1);
      };
    };
    return Product3;
  }();
  var NoArguments = /* @__PURE__ */ function() {
    function NoArguments2() {
    }
    ;
    NoArguments2.value = new NoArguments2();
    return NoArguments2;
  }();
  var Constructor = function(x2) {
    return x2;
  };
  var Argument = function(x2) {
    return x2;
  };
  var to = function(dict) {
    return dict.to;
  };
  var from = function(dict) {
    return dict.from;
  };

  // output/Data.Maybe/index.js
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var showMaybe = function(dictShow) {
    var show29 = show(dictShow);
    return {
      show: function(v2) {
        if (v2 instanceof Just) {
          return "(Just " + (show29(v2.value0) + ")");
        }
        ;
        if (v2 instanceof Nothing) {
          return "Nothing";
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [v2.constructor.name]);
      }
    };
  };
  var semigroupMaybe = function(dictSemigroup) {
    var append112 = append(dictSemigroup);
    return {
      append: function(v2) {
        return function(v1) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v1 instanceof Nothing) {
            return v2;
          }
          ;
          if (v2 instanceof Just && v1 instanceof Just) {
            return new Just(append112(v2.value0)(v1.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 182, column 1 - line 185, column 43): " + [v2.constructor.name, v1.constructor.name]);
        };
      }
    };
  };
  var maybe$prime = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v22 instanceof Nothing) {
          return v2(unit);
        }
        ;
        if (v22 instanceof Just) {
          return v1(v22.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
      };
    };
  };
  var maybe = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v22 instanceof Nothing) {
          return v2;
        }
        ;
        if (v22 instanceof Just) {
          return v1(v22.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
  var functorMaybe = {
    map: function(v2) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v2(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe$prime = function(a3) {
    return maybe$prime(a3)(identity4);
  };
  var fromMaybe = function(a3) {
    return maybe(a3)(identity4);
  };
  var fromJust = function() {
    return function(v2) {
      if (v2 instanceof Just) {
        return v2.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v2.constructor.name]);
    };
  };
  var eqMaybe = function(dictEq) {
    var eq26 = eq(dictEq);
    return {
      eq: function(x2) {
        return function(y2) {
          if (x2 instanceof Nothing && y2 instanceof Nothing) {
            return true;
          }
          ;
          if (x2 instanceof Just && y2 instanceof Just) {
            return eq26(x2.value0)(y2.value0);
          }
          ;
          return false;
        };
      }
    };
  };
  var applyMaybe = {
    apply: function(v2) {
      return function(v1) {
        if (v2 instanceof Just) {
          return map2(v2.value0)(v1);
        }
        ;
        if (v2 instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v2) {
      return function(v1) {
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        if (v2 instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };
  var applicativeMaybe = /* @__PURE__ */ function() {
    return {
      pure: Just.create,
      Apply0: function() {
        return applyMaybe;
      }
    };
  }();
  var altMaybe = {
    alt: function(v2) {
      return function(v1) {
        if (v2 instanceof Nothing) {
          return v1;
        }
        ;
        return v2;
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var plusMaybe = /* @__PURE__ */ function() {
    return {
      empty: Nothing.value,
      Alt0: function() {
        return altMaybe;
      }
    };
  }();
  var alternativeMaybe = {
    Applicative0: function() {
      return applicativeMaybe;
    },
    Plus1: function() {
      return plusMaybe;
    }
  };

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left3(value0) {
      this.value0 = value0;
    }
    ;
    Left3.create = function(value0) {
      return new Left3(value0);
    };
    return Left3;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right3(value0) {
      this.value0 = value0;
    }
    ;
    Right3.create = function(value0) {
      return new Right3(value0);
    };
    return Right3;
  }();
  var note = function(a3) {
    return maybe(new Left(a3))(Right.create);
  };
  var functorEither = {
    map: function(f) {
      return function(m2) {
        if (m2 instanceof Left) {
          return new Left(m2.value0);
        }
        ;
        if (m2 instanceof Right) {
          return new Right(f(m2.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m2.constructor.name]);
      };
    }
  };
  var map3 = /* @__PURE__ */ map(functorEither);
  var fromLeft = function(v2) {
    return function(v1) {
      if (v1 instanceof Left) {
        return v1.value0;
      }
      ;
      return v2;
    };
  };
  var either = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v22 instanceof Left) {
          return v2(v22.value0);
        }
        ;
        if (v22 instanceof Right) {
          return v1(v22.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
      };
    };
  };
  var hush = /* @__PURE__ */ function() {
    return either($$const(Nothing.value))(Just.create);
  }();
  var isRight = /* @__PURE__ */ either(/* @__PURE__ */ $$const(false))(/* @__PURE__ */ $$const(true));
  var blush = /* @__PURE__ */ function() {
    return either(Just.create)($$const(Nothing.value));
  }();
  var applyEither = {
    apply: function(v2) {
      return function(v1) {
        if (v2 instanceof Left) {
          return new Left(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return map3(v2.value0)(v1);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorEither;
    }
  };
  var bindEither = {
    bind: /* @__PURE__ */ either(function(e) {
      return function(v2) {
        return new Left(e);
      };
    })(function(a3) {
      return function(f) {
        return f(a3);
      };
    }),
    Apply0: function() {
      return applyEither;
    }
  };
  var applicativeEither = /* @__PURE__ */ function() {
    return {
      pure: Right.create,
      Apply0: function() {
        return applyEither;
      }
    };
  }();
  var monadEither = {
    Applicative0: function() {
      return applicativeEither;
    },
    Bind1: function() {
      return bindEither;
    }
  };

  // output/Control.Comonad/index.js
  var extract = function(dict) {
    return dict.extract;
  };

  // output/Control.Lazy/index.js
  var defer = function(dict) {
    return dict.defer;
  };

  // output/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b2) {
    return !b2;
  };

  // output/Data.HeytingAlgebra/index.js
  var tt = function(dict) {
    return dict.tt;
  };
  var not = function(dict) {
    return dict.not;
  };
  var implies = function(dict) {
    return dict.implies;
  };
  var ff = function(dict) {
    return dict.ff;
  };
  var disj = function(dict) {
    return dict.disj;
  };
  var heytingAlgebraBoolean = {
    ff: false,
    tt: true,
    implies: function(a3) {
      return function(b2) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a3))(b2);
      };
    },
    conj: boolConj,
    disj: boolDisj,
    not: boolNot
  };
  var conj = function(dict) {
    return dict.conj;
  };
  var heytingAlgebraFunction = function(dictHeytingAlgebra) {
    var ff1 = ff(dictHeytingAlgebra);
    var tt1 = tt(dictHeytingAlgebra);
    var implies1 = implies(dictHeytingAlgebra);
    var conj13 = conj(dictHeytingAlgebra);
    var disj1 = disj(dictHeytingAlgebra);
    var not1 = not(dictHeytingAlgebra);
    return {
      ff: function(v2) {
        return ff1;
      },
      tt: function(v2) {
        return tt1;
      },
      implies: function(f) {
        return function(g2) {
          return function(a3) {
            return implies1(f(a3))(g2(a3));
          };
        };
      },
      conj: function(f) {
        return function(g2) {
          return function(a3) {
            return conj13(f(a3))(g2(a3));
          };
        };
      },
      disj: function(f) {
        return function(g2) {
          return function(a3) {
            return disj1(f(a3))(g2(a3));
          };
        };
      },
      not: function(f) {
        return function(a3) {
          return not1(f(a3));
        };
      }
    };
  };

  // output/Data.EuclideanRing/foreign.js
  var intDegree = function(x2) {
    return Math.min(Math.abs(x2), 2147483647);
  };
  var intDiv = function(x2) {
    return function(y2) {
      if (y2 === 0)
        return 0;
      return y2 > 0 ? Math.floor(x2 / y2) : -Math.floor(x2 / -y2);
    };
  };
  var intMod = function(x2) {
    return function(y2) {
      if (y2 === 0)
        return 0;
      var yy = Math.abs(y2);
      return (x2 % yy + yy) % yy;
    };
  };

  // output/Data.CommutativeRing/index.js
  var commutativeRingInt = {
    Ring0: function() {
      return ringInt;
    }
  };

  // output/Data.EuclideanRing/index.js
  var mod = function(dict) {
    return dict.mod;
  };
  var euclideanRingInt = {
    degree: intDegree,
    div: intDiv,
    mod: intMod,
    CommutativeRing0: function() {
      return commutativeRingInt;
    }
  };
  var div = function(dict) {
    return dict.div;
  };

  // output/Data.Monoid/index.js
  var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
  var div2 = /* @__PURE__ */ div(euclideanRingInt);
  var monoidString = {
    mempty: "",
    Semigroup0: function() {
      return semigroupString;
    }
  };
  var monoidOrdering = /* @__PURE__ */ function() {
    return {
      mempty: EQ.value,
      Semigroup0: function() {
        return semigroupOrdering;
      }
    };
  }();
  var monoidArray = {
    mempty: [],
    Semigroup0: function() {
      return semigroupArray;
    }
  };
  var mempty = function(dict) {
    return dict.mempty;
  };
  var monoidFn = function(dictMonoid) {
    var mempty1 = mempty(dictMonoid);
    var semigroupFn2 = semigroupFn(dictMonoid.Semigroup0());
    return {
      mempty: function(v2) {
        return mempty1;
      },
      Semigroup0: function() {
        return semigroupFn2;
      }
    };
  };
  var power = function(dictMonoid) {
    var mempty1 = mempty(dictMonoid);
    var append21 = append(dictMonoid.Semigroup0());
    return function(x2) {
      var go2 = function(p2) {
        if (p2 <= 0) {
          return mempty1;
        }
        ;
        if (p2 === 1) {
          return x2;
        }
        ;
        if (mod2(p2)(2) === 0) {
          var x$prime = go2(div2(p2)(2));
          return append21(x$prime)(x$prime);
        }
        ;
        if (otherwise) {
          var x$prime = go2(div2(p2)(2));
          return append21(x$prime)(append21(x$prime)(x2));
        }
        ;
        throw new Error("Failed pattern match at Data.Monoid (line 88, column 3 - line 88, column 17): " + [p2.constructor.name]);
      };
      return go2;
    };
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var uncurry = function(f) {
    return function(v2) {
      return f(v2.value0)(v2.value1);
    };
  };
  var snd = function(v2) {
    return v2.value1;
  };
  var showTuple = function(dictShow) {
    var show29 = show(dictShow);
    return function(dictShow1) {
      var show114 = show(dictShow1);
      return {
        show: function(v2) {
          return "(Tuple " + (show29(v2.value0) + (" " + (show114(v2.value1) + ")")));
        }
      };
    };
  };
  var semiringTuple = function(dictSemiring) {
    var add5 = add(dictSemiring);
    var one3 = one(dictSemiring);
    var mul3 = mul(dictSemiring);
    var zero4 = zero(dictSemiring);
    return function(dictSemiring1) {
      var add1 = add(dictSemiring1);
      var mul1 = mul(dictSemiring1);
      return {
        add: function(v2) {
          return function(v1) {
            return new Tuple(add5(v2.value0)(v1.value0), add1(v2.value1)(v1.value1));
          };
        },
        one: new Tuple(one3, one(dictSemiring1)),
        mul: function(v2) {
          return function(v1) {
            return new Tuple(mul3(v2.value0)(v1.value0), mul1(v2.value1)(v1.value1));
          };
        },
        zero: new Tuple(zero4, zero(dictSemiring1))
      };
    };
  };
  var semigroupTuple = function(dictSemigroup) {
    var append112 = append(dictSemigroup);
    return function(dictSemigroup1) {
      var append23 = append(dictSemigroup1);
      return {
        append: function(v2) {
          return function(v1) {
            return new Tuple(append112(v2.value0)(v1.value0), append23(v2.value1)(v1.value1));
          };
        }
      };
    };
  };
  var ringTuple = function(dictRing) {
    var sub4 = sub(dictRing);
    var semiringTuple1 = semiringTuple(dictRing.Semiring0());
    return function(dictRing1) {
      var sub12 = sub(dictRing1);
      var semiringTuple2 = semiringTuple1(dictRing1.Semiring0());
      return {
        sub: function(v2) {
          return function(v1) {
            return new Tuple(sub4(v2.value0)(v1.value0), sub12(v2.value1)(v1.value1));
          };
        },
        Semiring0: function() {
          return semiringTuple2;
        }
      };
    };
  };
  var monoidTuple = function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    var semigroupTuple1 = semigroupTuple(dictMonoid.Semigroup0());
    return function(dictMonoid1) {
      var semigroupTuple2 = semigroupTuple1(dictMonoid1.Semigroup0());
      return {
        mempty: new Tuple(mempty4, mempty(dictMonoid1)),
        Semigroup0: function() {
          return semigroupTuple2;
        }
      };
    };
  };
  var functorTuple = {
    map: function(f) {
      return function(m2) {
        return new Tuple(m2.value0, f(m2.value1));
      };
    }
  };
  var fst = function(v2) {
    return v2.value0;
  };
  var eqTuple = function(dictEq) {
    var eq26 = eq(dictEq);
    return function(dictEq1) {
      var eq110 = eq(dictEq1);
      return {
        eq: function(x2) {
          return function(y2) {
            return eq26(x2.value0)(y2.value0) && eq110(x2.value1)(y2.value1);
          };
        }
      };
    };
  };
  var ordTuple = function(dictOrd) {
    var compare10 = compare(dictOrd);
    var eqTuple1 = eqTuple(dictOrd.Eq0());
    return function(dictOrd1) {
      var compare17 = compare(dictOrd1);
      var eqTuple2 = eqTuple1(dictOrd1.Eq0());
      return {
        compare: function(x2) {
          return function(y2) {
            var v2 = compare10(x2.value0)(y2.value0);
            if (v2 instanceof LT) {
              return LT.value;
            }
            ;
            if (v2 instanceof GT) {
              return GT.value;
            }
            ;
            return compare17(x2.value1)(y2.value1);
          };
        },
        Eq0: function() {
          return eqTuple2;
        }
      };
    };
  };

  // output/Data.Bifunctor/index.js
  var identity5 = /* @__PURE__ */ identity(categoryFn);
  var bimap = function(dict) {
    return dict.bimap;
  };
  var lmap = function(dictBifunctor) {
    var bimap1 = bimap(dictBifunctor);
    return function(f) {
      return bimap1(f)(identity5);
    };
  };
  var bifunctorTuple = {
    bimap: function(f) {
      return function(g2) {
        return function(v2) {
          return new Tuple(f(v2.value0), g2(v2.value1));
        };
      };
    }
  };
  var bifunctorEither = {
    bimap: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Left) {
            return new Left(v2(v22.value0));
          }
          ;
          if (v22 instanceof Right) {
            return new Right(v1(v22.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
        };
      };
    }
  };

  // output/Data.Maybe.First/index.js
  var First = function(x2) {
    return x2;
  };
  var semigroupFirst = {
    append: function(v2) {
      return function(v1) {
        if (v2 instanceof Just) {
          return v2;
        }
        ;
        return v1;
      };
    }
  };
  var monoidFirst = /* @__PURE__ */ function() {
    return {
      mempty: Nothing.value,
      Semigroup0: function() {
        return semigroupFirst;
      }
    };
  }();

  // output/Data.Monoid.Conj/index.js
  var Conj = function(x2) {
    return x2;
  };
  var semigroupConj = function(dictHeytingAlgebra) {
    var conj2 = conj(dictHeytingAlgebra);
    return {
      append: function(v2) {
        return function(v1) {
          return conj2(v2)(v1);
        };
      }
    };
  };
  var monoidConj = function(dictHeytingAlgebra) {
    var semigroupConj1 = semigroupConj(dictHeytingAlgebra);
    return {
      mempty: tt(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupConj1;
      }
    };
  };

  // output/Data.Monoid.Disj/index.js
  var semigroupDisj = function(dictHeytingAlgebra) {
    var disj3 = disj(dictHeytingAlgebra);
    return {
      append: function(v2) {
        return function(v1) {
          return disj3(v2)(v1);
        };
      }
    };
  };
  var monoidDisj = function(dictHeytingAlgebra) {
    var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
    return {
      mempty: ff(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupDisj1;
      }
    };
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x2) {
    return x2;
  };

  // output/Safe.Coerce/index.js
  var coerce = function() {
    return unsafeCoerce2;
  };

  // output/Data.Newtype/index.js
  var coerce2 = /* @__PURE__ */ coerce();
  var unwrap = function() {
    return coerce2;
  };
  var under = function() {
    return function() {
      return function(v2) {
        return coerce2;
      };
    };
  };
  var over = function() {
    return function() {
      return function(v2) {
        return coerce2;
      };
    };
  };
  var alaF = function() {
    return function() {
      return function() {
        return function() {
          return function(v2) {
            return coerce2;
          };
        };
      };
    };
  };

  // output/Data.Foldable/index.js
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var alaF2 = /* @__PURE__ */ alaF()()()();
  var foldr = function(dict) {
    return dict.foldr;
  };
  var traverse_ = function(dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure34 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(f) {
        return foldr22(function($454) {
          return applySecond2(f($454));
        })(pure34(unit));
      };
    };
  };
  var for_ = function(dictApplicative) {
    var traverse_17 = traverse_(dictApplicative);
    return function(dictFoldable) {
      return flip(traverse_17(dictFoldable));
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var indexl = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(idx) {
      var go2 = function(cursor) {
        return function(a3) {
          if (cursor.elem instanceof Just) {
            return cursor;
          }
          ;
          var $296 = cursor.pos === idx;
          if ($296) {
            return {
              elem: new Just(a3),
              pos: cursor.pos
            };
          }
          ;
          return {
            pos: cursor.pos + 1 | 0,
            elem: cursor.elem
          };
        };
      };
      var $455 = foldl22(go2)({
        elem: Nothing.value,
        pos: 0
      });
      return function($456) {
        return function(v2) {
          return v2.elem;
        }($455($456));
      };
    };
  };
  var intercalate = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictMonoid) {
      var append21 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(sep) {
        return function(xs) {
          var go2 = function(v2) {
            return function(v1) {
              if (v2.init) {
                return {
                  init: false,
                  acc: v1
                };
              }
              ;
              return {
                init: false,
                acc: append21(v2.acc)(append21(sep)(v1))
              };
            };
          };
          return foldl22(go2)({
            init: true,
            acc: mempty4
          })(xs).acc;
        };
      };
    };
  };
  var length = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictSemiring) {
      var add1 = add(dictSemiring);
      var one3 = one(dictSemiring);
      return foldl22(function(c2) {
        return function(v2) {
          return add1(one3)(c2);
        };
      })(zero(dictSemiring));
    };
  };
  var sum = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictSemiring) {
      return foldl22(add(dictSemiring))(zero(dictSemiring));
    };
  };
  var foldableMaybe = {
    foldr: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Nothing) {
            return v1;
          }
          ;
          if (v22 instanceof Just) {
            return v2(v22.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
        };
      };
    },
    foldl: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Nothing) {
            return v1;
          }
          ;
          if (v22 instanceof Just) {
            return v2(v1)(v22.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      return function(v2) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return mempty4;
          }
          ;
          if (v1 instanceof Just) {
            return v2(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldableEither = {
    foldr: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Left) {
            return v1;
          }
          ;
          if (v22 instanceof Right) {
            return v2(v22.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
        };
      };
    },
    foldl: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Left) {
            return v1;
          }
          ;
          if (v22 instanceof Right) {
            return v2(v1)(v22.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      return function(v2) {
        return function(v1) {
          if (v1 instanceof Left) {
            return mempty4;
          }
          ;
          if (v1 instanceof Right) {
            return v2(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append21 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(f) {
        return foldr22(function(x2) {
          return function(acc) {
            return append21(f(x2))(acc);
          };
        })(mempty4);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function(dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    }
  };
  var foldMap = function(dict) {
    return dict.foldMap;
  };
  var fold = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictMonoid) {
      return foldMap22(dictMonoid)(identity6);
    };
  };
  var find = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(p2) {
      var go2 = function(v2) {
        return function(v1) {
          if (v2 instanceof Nothing && p2(v1)) {
            return new Just(v1);
          }
          ;
          return v2;
        };
      };
      return foldl22(go2)(Nothing.value);
    };
  };
  var all = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictHeytingAlgebra) {
      return alaF2(Conj)(foldMap22(monoidConj(dictHeytingAlgebra)));
    };
  };
  var and = function(dictFoldable) {
    var all1 = all(dictFoldable);
    return function(dictHeytingAlgebra) {
      return all1(dictHeytingAlgebra)(identity6);
    };
  };

  // output/Effect/foreign.js
  var pureE = function(a3) {
    return function() {
      return a3;
    };
  };
  var bindE = function(a3) {
    return function(f) {
      return function() {
        return f(a3())();
      };
    };
  };

  // output/Control.Monad/index.js
  var whenM = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var when13 = when(dictMonad.Applicative0());
    return function(mb) {
      return function(m2) {
        return bind36(mb)(function(b2) {
          return when13(b2)(m2);
        });
      };
    };
  };
  var unlessM = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var unless4 = unless(dictMonad.Applicative0());
    return function(mb) {
      return function(m2) {
        return bind36(mb)(function(b2) {
          return unless4(b2)(m2);
        });
      };
    };
  };
  var monadFn = {
    Applicative0: function() {
      return applicativeFn;
    },
    Bind1: function() {
      return bindFn;
    }
  };
  var liftM1 = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a3) {
        return bind36(a3)(function(a$prime) {
          return pure34(f(a$prime));
        });
      };
    };
  };
  var ap = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a3) {
        return bind36(f)(function(f$prime) {
          return bind36(a3)(function(a$prime) {
            return pure34(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
  var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);

  // output/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error4) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error4) {
        setTimeout(function() {
          throw error4;
        }, 0);
      }
    }
    function runSync(left2, right2, eff) {
      try {
        return right2(eff());
      } catch (error4) {
        return left2(error4);
      }
    }
    function runAsync(left2, eff, k) {
      try {
        return eff(k)();
      } catch (error4) {
        k(left2(error4))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size5 = 0;
      var ix5 = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size5 !== 0) {
          size5--;
          thunk = queue[ix5];
          queue[ix5] = void 0;
          ix5 = (ix5 + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i2, tmp;
          if (size5 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix5 + size5) % limit] = cb;
          size5++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util2) {
      var fibers = {};
      var fiberId = 0;
      var count2 = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count2--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count2++;
        },
        isEmpty: function() {
          return count2 === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count2 === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill3(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util2.isLeft(result) && util2.fromLeft(result)) {
                    setTimeout(function() {
                      throw util2.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill3(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count2 = 0;
            return function(error4) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util2, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step4 = aff;
      var fail2 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run5(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step4 = bhead(step4);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail2 = util2.left(e);
                step4 = null;
              }
              break;
            case STEP_RESULT:
              if (util2.isLeft(step4)) {
                status = RETURN;
                fail2 = step4;
                step4 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step4 = util2.fromRight(step4);
              }
              break;
            case CONTINUE:
              switch (step4.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step4._2;
                  status = CONTINUE;
                  step4 = step4._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step4 = util2.right(step4._1);
                  } else {
                    status = STEP_BIND;
                    step4 = step4._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step4 = runSync(util2.left, util2.right, step4._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step4 = runAsync(util2.left, step4._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step4 = result2;
                        run5(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail2 = util2.left(step4._1);
                  step4 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step4, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step4, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step4 = step4._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step4, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step4, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step4 = step4._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util2, supervisor, step4._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step4._1) {
                    tmp.run();
                  }
                  step4 = util2.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step4 = sequential3(util2, supervisor, step4._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step4 = interrupt || fail2 || step4;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail2) {
                      status = CONTINUE;
                      step4 = attempt._2(util2.fromLeft(fail2));
                      fail2 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step4 = util2.fromRight(step4);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail2 === null) {
                      result = util2.fromRight(step4);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step4 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step4, fail2), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step4 = attempt._1.killed(util2.fromLeft(interrupt))(attempt._2);
                    } else if (fail2) {
                      step4 = attempt._1.failed(util2.fromLeft(fail2))(attempt._2);
                    } else {
                      step4 = attempt._1.completed(util2.fromRight(step4))(attempt._2);
                    }
                    fail2 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step4, fail2), attempts, interrupt);
                    status = CONTINUE;
                    step4 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step4 = attempt._1;
                    fail2 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step4));
                }
              }
              joins = null;
              if (interrupt && fail2) {
                setTimeout(function() {
                  throw util2.fromLeft(fail2);
                }, 0);
              } else if (util2.isLeft(step4) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util2.fromLeft(step4);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join6) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join6.rethrow;
            join6.handler(step4)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join6;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill3(error4, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util2.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util2.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util2.left(error4);
              status = COMPLETED;
              step4 = interrupt;
              run5(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util2.left(error4);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step4(error4)), attempts, interrupt);
                }
                status = RETURN;
                step4 = null;
                fail2 = null;
                run5(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util2.left(error4);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step4 = null;
                fail2 = null;
              }
          }
          return canceler;
        };
      }
      function join5(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run5(runTick);
          }
          return canceler;
        };
      }
      return {
        kill: kill3,
        join: join5,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run5(runTick);
              });
            } else {
              run5(runTick);
            }
          }
        }
      };
    }
    function runPar(util2, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root2 = EMPTY;
      function kill3(error4, par2, cb2) {
        var step4 = par2;
        var head7 = null;
        var tail3 = null;
        var count2 = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step4.tag) {
              case FORKED:
                if (step4._3 === EMPTY) {
                  tmp = fibers[step4._1];
                  kills2[count2++] = tmp.kill(error4, function(result) {
                    return function() {
                      count2--;
                      if (count2 === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head7 === null) {
                  break loop;
                }
                step4 = head7._2;
                if (tail3 === null) {
                  head7 = null;
                } else {
                  head7 = tail3._1;
                  tail3 = tail3._2;
                }
                break;
              case MAP:
                step4 = step4._2;
                break;
              case APPLY:
              case ALT:
                if (head7) {
                  tail3 = new Aff2(CONS, head7, tail3);
                }
                head7 = step4;
                step4 = step4._1;
                break;
            }
          }
        if (count2 === 0) {
          cb2(util2.right(void 0))();
        } else {
          kid = 0;
          tmp = count2;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join5(result, head7, tail3) {
        var fail2, step4, lhs, rhs, tmp, kid;
        if (util2.isLeft(result)) {
          fail2 = result;
          step4 = null;
        } else {
          step4 = result;
          fail2 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head7 === null) {
              cb(fail2 || step4)();
              return;
            }
            if (head7._3 !== EMPTY) {
              return;
            }
            switch (head7.tag) {
              case MAP:
                if (fail2 === null) {
                  head7._3 = util2.right(head7._1(util2.fromRight(step4)));
                  step4 = head7._3;
                } else {
                  head7._3 = fail2;
                }
                break;
              case APPLY:
                lhs = head7._1._3;
                rhs = head7._2._3;
                if (fail2) {
                  head7._3 = fail2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill3(early, fail2 === lhs ? head7._2 : head7._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail3 === null) {
                        join5(fail2, null, null);
                      } else {
                        join5(fail2, tail3._1, tail3._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step4 = util2.right(util2.fromRight(lhs)(util2.fromRight(rhs)));
                  head7._3 = step4;
                }
                break;
              case ALT:
                lhs = head7._1._3;
                rhs = head7._2._3;
                if (lhs === EMPTY && util2.isLeft(rhs) || rhs === EMPTY && util2.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util2.isLeft(lhs) && rhs !== EMPTY && util2.isLeft(rhs)) {
                  fail2 = step4 === lhs ? rhs : lhs;
                  step4 = null;
                  head7._3 = fail2;
                } else {
                  head7._3 = step4;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill3(early, step4 === lhs ? head7._2 : head7._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail3 === null) {
                        join5(step4, null, null);
                      } else {
                        join5(step4, tail3._1, tail3._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail3 === null) {
              head7 = null;
            } else {
              head7 = tail3._1;
              tail3 = tail3._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join5(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run5() {
        var status = CONTINUE;
        var step4 = par;
        var head7 = null;
        var tail3 = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step4.tag) {
                  case MAP:
                    if (head7) {
                      tail3 = new Aff2(CONS, head7, tail3);
                    }
                    head7 = new Aff2(MAP, step4._1, EMPTY, EMPTY);
                    step4 = step4._2;
                    break;
                  case APPLY:
                    if (head7) {
                      tail3 = new Aff2(CONS, head7, tail3);
                    }
                    head7 = new Aff2(APPLY, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  case ALT:
                    if (head7) {
                      tail3 = new Aff2(CONS, head7, tail3);
                    }
                    head7 = new Aff2(ALT, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step4;
                    step4 = new Aff2(FORKED, fid, new Aff2(CONS, head7, tail3), EMPTY);
                    tmp = Fiber(util2, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step4)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head7 === null) {
                  break loop;
                }
                if (head7._1 === EMPTY) {
                  head7._1 = step4;
                  status = CONTINUE;
                  step4 = head7._2;
                  head7._2 = EMPTY;
                } else {
                  head7._2 = step4;
                  step4 = head7;
                  if (tail3 === null) {
                    head7 = null;
                  } else {
                    head7 = tail3._1;
                    tail3 = tail3._2;
                  }
                }
            }
          }
        root2 = step4;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error4, cb2) {
        interrupt = util2.left(error4);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill3(error4, root2, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run5();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential3(util2, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util2, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value14) {
          return Aff.Pure(f(value14));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  function _fork(immediate) {
    return function(aff) {
      return Aff.Fork(immediate, aff);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f) {
    return function(aff) {
      return Aff.ParMap(f, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options2) {
      return function(k) {
        return Aff.Bracket(acquire, options2, k);
      };
    };
  }
  function _makeFiber(util2, aff) {
    return function() {
      return Aff.Fiber(util2, null, aff);
    };
  }
  var _delay = function() {
    function setDelay(n, k) {
      if (n === 0 && typeof setImmediate !== "undefined") {
        return setImmediate(k);
      } else {
        return setTimeout(k, n);
      }
    }
    function clearDelay(n, t2) {
      if (n === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t2);
      } else {
        return clearTimeout(t2);
      }
    }
    return function(right2, ms) {
      return Aff.Async(function(cb) {
        return function() {
          var timer = setDelay(ms, cb(right2()));
          return function() {
            return Aff.Sync(function() {
              return right2(clearDelay(ms, timer));
            });
          };
        };
      });
    };
  }();
  var _sequential = Aff.Seq;

  // output/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }

  // output/Effect.Exception/index.js
  var $$throw = function($4) {
    return throwException(error($4));
  };

  // output/Control.Monad.Error.Class/index.js
  var throwError = function(dict) {
    return dict.throwError;
  };
  var monadThrowEither = /* @__PURE__ */ function() {
    return {
      throwError: Left.create,
      Monad0: function() {
        return monadEither;
      }
    };
  }();
  var monadErrorEither = {
    catchError: function(v2) {
      return function(v1) {
        if (v2 instanceof Left) {
          return v1(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return new Right(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Error.Class (line 72, column 1 - line 74, column 35): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    MonadThrow0: function() {
      return monadThrowEither;
    }
  };
  var liftEither = function(dictMonadThrow) {
    return either(throwError(dictMonadThrow))(pure(dictMonadThrow.Monad0().Applicative0()));
  };
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map60 = map(Monad0.Bind1().Apply0().Functor0());
    var pure34 = pure(Monad0.Applicative0());
    return function(a3) {
      return catchError1(map60(Right.create)(a3))(function($52) {
        return pure34(Left.create($52));
      });
    };
  };

  // output/Data.Identity/index.js
  var Identity = function(x2) {
    return x2;
  };
  var functorIdentity = {
    map: function(f) {
      return function(m2) {
        return f(m2);
      };
    }
  };
  var applyIdentity = {
    apply: function(v2) {
      return function(v1) {
        return v2(v1);
      };
    },
    Functor0: function() {
      return functorIdentity;
    }
  };
  var bindIdentity = {
    bind: function(v2) {
      return function(f) {
        return f(v2);
      };
    },
    Apply0: function() {
      return applyIdentity;
    }
  };
  var applicativeIdentity = {
    pure: Identity,
    Apply0: function() {
      return applyIdentity;
    }
  };
  var monadIdentity = {
    Applicative0: function() {
      return applicativeIdentity;
    },
    Bind1: function() {
      return bindIdentity;
    }
  };

  // output/Effect.Ref/foreign.js
  var _new = function(val) {
    return function() {
      return { value: val };
    };
  };
  var read = function(ref4) {
    return function() {
      return ref4.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref4) {
      return function() {
        var t2 = f(ref4.value);
        ref4.value = t2.state;
        return t2.value;
      };
    };
  };
  var write = function(val) {
    return function(ref4) {
      return function() {
        ref4.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s2) {
      var s$prime = f(s2);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var modify_ = function(f) {
    return function(s2) {
      return $$void2(modify(f)(s2));
    };
  };

  // output/Control.Monad.Rec.Class/index.js
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindEffect);
  var map4 = /* @__PURE__ */ map(functorEffect);
  var Loop = /* @__PURE__ */ function() {
    function Loop2(value0) {
      this.value0 = value0;
    }
    ;
    Loop2.create = function(value0) {
      return new Loop2(value0);
    };
    return Loop2;
  }();
  var Done = /* @__PURE__ */ function() {
    function Done2(value0) {
      this.value0 = value0;
    }
    ;
    Done2.create = function(value0) {
      return new Done2(value0);
    };
    return Done2;
  }();
  var tailRecM = function(dict) {
    return dict.tailRecM;
  };
  var monadRecEffect = {
    tailRecM: function(f) {
      return function(a3) {
        var fromDone = function(v2) {
          if (v2 instanceof Done) {
            return v2.value0;
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [v2.constructor.name]);
        };
        return function __do5() {
          var r2 = bindFlipped2($$new)(f(a3))();
          (function() {
            while (!function __do6() {
              var v2 = read(r2)();
              if (v2 instanceof Loop) {
                var e = f(v2.value0)();
                write(e)(r2)();
                return false;
              }
              ;
              if (v2 instanceof Done) {
                return true;
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [v2.constructor.name]);
            }()) {
            }
            ;
            return {};
          })();
          return map4(fromDone)(read(r2))();
        };
      };
    },
    Monad0: function() {
      return monadEffect;
    }
  };
  var forever = function(dictMonadRec) {
    var tailRecM1 = tailRecM(dictMonadRec);
    var voidRight3 = voidRight(dictMonadRec.Monad0().Bind1().Apply0().Functor0());
    return function(ma) {
      return tailRecM1(function(u2) {
        return voidRight3(new Loop(u2))(ma);
      })(unit);
    };
  };

  // output/Control.Monad.ST.Internal/foreign.js
  var map_ = function(f) {
    return function(a3) {
      return function() {
        return f(a3());
      };
    };
  };
  var pure_ = function(a3) {
    return function() {
      return a3;
    };
  };
  var bind_ = function(a3) {
    return function(f) {
      return function() {
        return f(a3())();
      };
    };
  };
  function forST(lo) {
    return function(hi) {
      return function(f) {
        return function() {
          for (var i2 = lo; i2 < hi; i2++) {
            f(i2)();
          }
        };
      };
    };
  }
  var foreach = function(as2) {
    return function(f) {
      return function() {
        for (var i2 = 0, l2 = as2.length; i2 < l2; i2++) {
          f(as2[i2])();
        }
      };
    };
  };
  function newSTRef(val) {
    return function() {
      return { value: val };
    };
  }
  var read2 = function(ref4) {
    return function() {
      return ref4.value;
    };
  };
  var modifyImpl2 = function(f) {
    return function(ref4) {
      return function() {
        var t2 = f(ref4.value);
        ref4.value = t2.state;
        return t2.value;
      };
    };
  };
  var write2 = function(a3) {
    return function(ref4) {
      return function() {
        return ref4.value = a3;
      };
    };
  };

  // output/Control.Monad.ST.Internal/index.js
  var $runtime_lazy2 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var modify$prime2 = modifyImpl2;
  var modify2 = function(f) {
    return modify$prime2(function(s2) {
      var s$prime = f(s2);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var functorST = {
    map: map_
  };
  var monadST = {
    Applicative0: function() {
      return applicativeST;
    },
    Bind1: function() {
      return bindST;
    }
  };
  var bindST = {
    bind: bind_,
    Apply0: function() {
      return $lazy_applyST(0);
    }
  };
  var applicativeST = {
    pure: pure_,
    Apply0: function() {
      return $lazy_applyST(0);
    }
  };
  var $lazy_applyST = /* @__PURE__ */ $runtime_lazy2("applyST", "Control.Monad.ST.Internal", function() {
    return {
      apply: ap(monadST),
      Functor0: function() {
        return functorST;
      }
    };
  });
  var applyST = /* @__PURE__ */ $lazy_applyST(47);

  // output/Control.Monad.Reader.Class/index.js
  var monadAskFun = {
    ask: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadFn;
    }
  };
  var monadReaderFun = {
    local: /* @__PURE__ */ composeFlipped(semigroupoidFn),
    MonadAsk0: function() {
      return monadAskFun;
    }
  };
  var ask = function(dict) {
    return dict.ask;
  };
  var asks = function(dictMonadAsk) {
    var map60 = map(dictMonadAsk.Monad0().Bind1().Apply0().Functor0());
    var ask1 = ask(dictMonadAsk);
    return function(f) {
      return map60(f)(ask1);
    };
  };

  // output/Control.Monad.State.Class/index.js
  var state = function(dict) {
    return dict.state;
  };
  var put = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(s2) {
      return state1(function(v2) {
        return new Tuple(unit, s2);
      });
    };
  };
  var modify_2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s2) {
        return new Tuple(unit, f(s2));
      });
    };
  };
  var modify3 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s2) {
        var s$prime = f(s2);
        return new Tuple(s$prime, s$prime);
      });
    };
  };
  var gets = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s2) {
        return new Tuple(f(s2), s2);
      });
    };
  };
  var get = function(dictMonadState) {
    return state(dictMonadState)(function(s2) {
      return new Tuple(s2, s2);
    });
  };

  // output/Control.Monad.Trans.Class/index.js
  var lift = function(dict) {
    return dict.lift;
  };

  // output/Effect.Class/index.js
  var monadEffectEffect = {
    liftEffect: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadEffect;
    }
  };
  var liftEffect = function(dict) {
    return dict.liftEffect;
  };

  // output/Control.Monad.Writer.Class/index.js
  var tell = function(dict) {
    return dict.tell;
  };

  // output/Control.Monad.Except.Trans/index.js
  var map5 = /* @__PURE__ */ map(functorEither);
  var ExceptT = function(x2) {
    return x2;
  };
  var withExceptT = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return function(f) {
      return function(v2) {
        var mapLeft = function(v1) {
          return function(v22) {
            if (v22 instanceof Right) {
              return new Right(v22.value0);
            }
            ;
            if (v22 instanceof Left) {
              return new Left(v1(v22.value0));
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 42, column 3 - line 42, column 32): " + [v1.constructor.name, v22.constructor.name]);
          };
        };
        return map126(mapLeft(f))(v2);
      };
    };
  };
  var runExceptT = function(v2) {
    return v2;
  };
  var monadTransExceptT = {
    lift: function(dictMonad) {
      var bind36 = bind(dictMonad.Bind1());
      var pure34 = pure(dictMonad.Applicative0());
      return function(m2) {
        return bind36(m2)(function(a3) {
          return pure34(new Right(a3));
        });
      };
    }
  };
  var lift3 = /* @__PURE__ */ lift(monadTransExceptT);
  var mapExceptT = function(f) {
    return function(v2) {
      return f(v2);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map126(map5(f)));
      }
    };
  };
  var monadExceptT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeExceptT(dictMonad);
      },
      Bind1: function() {
        return bindExceptT(dictMonad);
      }
    };
  };
  var bindExceptT = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    return {
      bind: function(v2) {
        return function(k) {
          return bind36(v2)(either(function($187) {
            return pure34(Left.create($187));
          })(function(a3) {
            var v1 = k(a3);
            return v1;
          }));
        };
      },
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var applyExceptT = function(dictMonad) {
    var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadExceptT(dictMonad)),
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
  var applicativeExceptT = function(dictMonad) {
    return {
      pure: function() {
        var $188 = pure(dictMonad.Applicative0());
        return function($189) {
          return ExceptT($188(Right.create($189)));
        };
      }(),
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var monadStateExceptT = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var lift1 = lift3(Monad0);
    var state3 = state(dictMonadState);
    var monadExceptT1 = monadExceptT(Monad0);
    return {
      state: function(f) {
        return lift1(state3(f));
      },
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var monadThrowExceptT = function(dictMonad) {
    var monadExceptT1 = monadExceptT(dictMonad);
    return {
      throwError: function() {
        var $198 = pure(dictMonad.Applicative0());
        return function($199) {
          return ExceptT($198(Left.create($199)));
        };
      }(),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var monadErrorExceptT = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    var monadThrowExceptT1 = monadThrowExceptT(dictMonad);
    return {
      catchError: function(v2) {
        return function(k) {
          return bind36(v2)(either(function(a3) {
            var v1 = k(a3);
            return v1;
          })(function($200) {
            return pure34(Right.create($200));
          }));
        };
      },
      MonadThrow0: function() {
        return monadThrowExceptT1;
      }
    };
  };
  var altExceptT = function(dictSemigroup) {
    var append21 = append(dictSemigroup);
    return function(dictMonad) {
      var Bind1 = dictMonad.Bind1();
      var bind36 = bind(Bind1);
      var pure34 = pure(dictMonad.Applicative0());
      var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
      return {
        alt: function(v2) {
          return function(v1) {
            return bind36(v2)(function(rm) {
              if (rm instanceof Right) {
                return pure34(new Right(rm.value0));
              }
              ;
              if (rm instanceof Left) {
                return bind36(v1)(function(rn) {
                  if (rn instanceof Right) {
                    return pure34(new Right(rn.value0));
                  }
                  ;
                  if (rn instanceof Left) {
                    return pure34(new Left(append21(rm.value0)(rn.value0)));
                  }
                  ;
                  throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
                });
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
            });
          };
        },
        Functor0: function() {
          return functorExceptT1;
        }
      };
    };
  };

  // output/Control.Monad.Maybe.Trans/index.js
  var map6 = /* @__PURE__ */ map(functorMaybe);
  var MaybeT = function(x2) {
    return x2;
  };
  var runMaybeT = function(v2) {
    return v2;
  };
  var monadTransMaybeT = {
    lift: function(dictMonad) {
      var $157 = liftM1(dictMonad)(Just.create);
      return function($158) {
        return MaybeT($157($158));
      };
    }
  };
  var lift4 = /* @__PURE__ */ lift(monadTransMaybeT);
  var functorMaybeT = function(dictFunctor) {
    var map126 = map(dictFunctor);
    return {
      map: function(f) {
        return function(v2) {
          return map126(map6(f))(v2);
        };
      }
    };
  };
  var monadMaybeT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeMaybeT(dictMonad);
      },
      Bind1: function() {
        return bindMaybeT(dictMonad);
      }
    };
  };
  var bindMaybeT = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    return {
      bind: function(v2) {
        return function(f) {
          return bind36(v2)(function(v1) {
            if (v1 instanceof Nothing) {
              return pure34(Nothing.value);
            }
            ;
            if (v1 instanceof Just) {
              var v22 = f(v1.value0);
              return v22;
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Maybe.Trans (line 54, column 11 - line 56, column 42): " + [v1.constructor.name]);
          });
        };
      },
      Apply0: function() {
        return applyMaybeT(dictMonad);
      }
    };
  };
  var applyMaybeT = function(dictMonad) {
    var functorMaybeT1 = functorMaybeT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadMaybeT(dictMonad)),
      Functor0: function() {
        return functorMaybeT1;
      }
    };
  };
  var applicativeMaybeT = function(dictMonad) {
    return {
      pure: function() {
        var $159 = pure(dictMonad.Applicative0());
        return function($160) {
          return MaybeT($159(Just.create($160)));
        };
      }(),
      Apply0: function() {
        return applyMaybeT(dictMonad);
      }
    };
  };
  var monadEffectMaybe = function(dictMonadEffect) {
    var Monad0 = dictMonadEffect.Monad0();
    var monadMaybeT1 = monadMaybeT(Monad0);
    return {
      liftEffect: function() {
        var $161 = lift4(Monad0);
        var $162 = liftEffect(dictMonadEffect);
        return function($163) {
          return $161($162($163));
        };
      }(),
      Monad0: function() {
        return monadMaybeT1;
      }
    };
  };
  var monadStateMaybeT = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var lift1 = lift4(Monad0);
    var state3 = state(dictMonadState);
    var monadMaybeT1 = monadMaybeT(Monad0);
    return {
      state: function(f) {
        return lift1(state3(f));
      },
      Monad0: function() {
        return monadMaybeT1;
      }
    };
  };

  // output/Control.Monad.Reader.Trans/index.js
  var ReaderT = function(x2) {
    return x2;
  };
  var withReaderT = function(f) {
    return function(v2) {
      return function($146) {
        return v2(f($146));
      };
    };
  };
  var runReaderT = function(v2) {
    return v2;
  };
  var monadTransReaderT = {
    lift: function(dictMonad) {
      return function($147) {
        return ReaderT($$const($147));
      };
    }
  };
  var lift5 = /* @__PURE__ */ lift(monadTransReaderT);
  var mapReaderT = function(f) {
    return function(v2) {
      return function($148) {
        return f(v2($148));
      };
    };
  };
  var functorReaderT = function(dictFunctor) {
    return {
      map: function() {
        var $149 = map(dictFunctor);
        return function($150) {
          return mapReaderT($149($150));
        };
      }()
    };
  };
  var applyReaderT = function(dictApply) {
    var apply7 = apply(dictApply);
    var functorReaderT1 = functorReaderT(dictApply.Functor0());
    return {
      apply: function(v2) {
        return function(v1) {
          return function(r2) {
            return apply7(v2(r2))(v1(r2));
          };
        };
      },
      Functor0: function() {
        return functorReaderT1;
      }
    };
  };
  var bindReaderT = function(dictBind) {
    var bind36 = bind(dictBind);
    var applyReaderT1 = applyReaderT(dictBind.Apply0());
    return {
      bind: function(v2) {
        return function(k) {
          return function(r2) {
            return bind36(v2(r2))(function(a3) {
              var v1 = k(a3);
              return v1(r2);
            });
          };
        };
      },
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var applicativeReaderT = function(dictApplicative) {
    var applyReaderT1 = applyReaderT(dictApplicative.Apply0());
    return {
      pure: function() {
        var $154 = pure(dictApplicative);
        return function($155) {
          return ReaderT($$const($154($155)));
        };
      }(),
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var monadReaderT = function(dictMonad) {
    var applicativeReaderT1 = applicativeReaderT(dictMonad.Applicative0());
    var bindReaderT1 = bindReaderT(dictMonad.Bind1());
    return {
      Applicative0: function() {
        return applicativeReaderT1;
      },
      Bind1: function() {
        return bindReaderT1;
      }
    };
  };
  var monadAskReaderT = function(dictMonad) {
    var monadReaderT1 = monadReaderT(dictMonad);
    return {
      ask: pure(dictMonad.Applicative0()),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };
  var monadReaderReaderT = function(dictMonad) {
    var monadAskReaderT1 = monadAskReaderT(dictMonad);
    return {
      local: withReaderT,
      MonadAsk0: function() {
        return monadAskReaderT1;
      }
    };
  };
  var monadEffectReader = function(dictMonadEffect) {
    var Monad0 = dictMonadEffect.Monad0();
    var monadReaderT1 = monadReaderT(Monad0);
    return {
      liftEffect: function() {
        var $157 = lift5(Monad0);
        var $158 = liftEffect(dictMonadEffect);
        return function($159) {
          return $157($158($159));
        };
      }(),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };
  var monadStateReaderT = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var monadReaderT1 = monadReaderT(Monad0);
    return {
      state: function() {
        var $160 = lift5(Monad0);
        var $161 = state(dictMonadState);
        return function($162) {
          return $160($161($162));
        };
      }(),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };

  // output/Control.Monad.Writer.Trans/index.js
  var WriterT = function(x2) {
    return x2;
  };
  var runWriterT = function(v2) {
    return v2;
  };
  var monadTransWriterT = function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    return {
      lift: function(dictMonad) {
        var bind36 = bind(dictMonad.Bind1());
        var pure34 = pure(dictMonad.Applicative0());
        return function(m2) {
          return bind36(m2)(function(a3) {
            return pure34(new Tuple(a3, mempty4));
          });
        };
      }
    };
  };
  var mapWriterT = function(f) {
    return function(v2) {
      return f(v2);
    };
  };
  var functorWriterT = function(dictFunctor) {
    var map60 = map(dictFunctor);
    return {
      map: function(f) {
        return mapWriterT(map60(function(v2) {
          return new Tuple(f(v2.value0), v2.value1);
        }));
      }
    };
  };
  var execWriterT = function(dictFunctor) {
    var map60 = map(dictFunctor);
    return function(v2) {
      return map60(snd)(v2);
    };
  };
  var applyWriterT = function(dictSemigroup) {
    var append21 = append(dictSemigroup);
    return function(dictApply) {
      var apply7 = apply(dictApply);
      var Functor0 = dictApply.Functor0();
      var map60 = map(Functor0);
      var functorWriterT1 = functorWriterT(Functor0);
      return {
        apply: function(v2) {
          return function(v1) {
            var k = function(v3) {
              return function(v4) {
                return new Tuple(v3.value0(v4.value0), append21(v3.value1)(v4.value1));
              };
            };
            return apply7(map60(k)(v2))(v1);
          };
        },
        Functor0: function() {
          return functorWriterT1;
        }
      };
    };
  };
  var bindWriterT = function(dictSemigroup) {
    var append21 = append(dictSemigroup);
    var applyWriterT1 = applyWriterT(dictSemigroup);
    return function(dictBind) {
      var bind36 = bind(dictBind);
      var Apply0 = dictBind.Apply0();
      var map60 = map(Apply0.Functor0());
      var applyWriterT2 = applyWriterT1(Apply0);
      return {
        bind: function(v2) {
          return function(k) {
            return bind36(v2)(function(v1) {
              var v22 = k(v1.value0);
              return map60(function(v3) {
                return new Tuple(v3.value0, append21(v1.value1)(v3.value1));
              })(v22);
            });
          };
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var applicativeWriterT = function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    var applyWriterT1 = applyWriterT(dictMonoid.Semigroup0());
    return function(dictApplicative) {
      var pure34 = pure(dictApplicative);
      var applyWriterT2 = applyWriterT1(dictApplicative.Apply0());
      return {
        pure: function(a3) {
          return pure34(new Tuple(a3, mempty4));
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var monadWriterT = function(dictMonoid) {
    var applicativeWriterT1 = applicativeWriterT(dictMonoid);
    var bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return function(dictMonad) {
      var applicativeWriterT22 = applicativeWriterT1(dictMonad.Applicative0());
      var bindWriterT22 = bindWriterT1(dictMonad.Bind1());
      return {
        Applicative0: function() {
          return applicativeWriterT22;
        },
        Bind1: function() {
          return bindWriterT22;
        }
      };
    };
  };
  var monadStateWriterT = function(dictMonoid) {
    var lift8 = lift(monadTransWriterT(dictMonoid));
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonadState) {
      var Monad0 = dictMonadState.Monad0();
      var lift1 = lift8(Monad0);
      var state3 = state(dictMonadState);
      var monadWriterT2 = monadWriterT1(Monad0);
      return {
        state: function(f) {
          return lift1(state3(f));
        },
        Monad0: function() {
          return monadWriterT2;
        }
      };
    };
  };
  var monadTellWriterT = function(dictMonoid) {
    var Semigroup0 = dictMonoid.Semigroup0();
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonad) {
      var monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: function() {
          var $252 = pure(dictMonad.Applicative0());
          var $253 = Tuple.create(unit);
          return function($254) {
            return WriterT($252($253($254)));
          };
        }(),
        Semigroup0: function() {
          return Semigroup0;
        },
        Monad1: function() {
          return monadWriterT2;
        }
      };
    };
  };

  // output/Data.Profunctor/index.js
  var identity7 = /* @__PURE__ */ identity(categoryFn);
  var profunctorFn = {
    dimap: function(a2b) {
      return function(c2d) {
        return function(b2c) {
          return function($18) {
            return c2d(b2c(a2b($18)));
          };
        };
      };
    }
  };
  var dimap = function(dict) {
    return dict.dimap;
  };
  var rmap = function(dictProfunctor) {
    var dimap1 = dimap(dictProfunctor);
    return function(b2c) {
      return dimap1(identity7)(b2c);
    };
  };

  // output/Control.Parallel.Class/index.js
  var sequential = function(dict) {
    return dict.sequential;
  };
  var parallel = function(dict) {
    return dict.parallel;
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a3) {
      return [a3];
    }
    function array2(a3) {
      return function(b2) {
        return [a3, b2];
      };
    }
    function array3(a3) {
      return function(b2) {
        return function(c2) {
          return [a3, b2, c2];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply7) {
      return function(map60) {
        return function(pure34) {
          return function(f) {
            return function(array) {
              function go2(bot, top3) {
                switch (top3 - bot) {
                  case 0:
                    return pure34([]);
                  case 1:
                    return map60(array1)(f(array[bot]));
                  case 2:
                    return apply7(map60(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply7(apply7(map60(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                    return apply7(map60(concat2)(go2(bot, pivot)))(go2(pivot, top3));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.Monoid.Additive/index.js
  var Additive = function(x2) {
    return x2;
  };
  var semigroupAdditive = function(dictSemiring) {
    var add5 = add(dictSemiring);
    return {
      append: function(v2) {
        return function(v1) {
          return add5(v2)(v1);
        };
      }
    };
  };
  var monoidAdditive = function(dictSemiring) {
    var semigroupAdditive1 = semigroupAdditive(dictSemiring);
    return {
      mempty: zero(dictSemiring),
      Semigroup0: function() {
        return semigroupAdditive1;
      }
    };
  };

  // output/Data.Traversable/index.js
  var identity8 = /* @__PURE__ */ identity(categoryFn);
  var traverse = function(dict) {
    return dict.traverse;
  };
  var traversableMaybe = {
    traverse: function(dictApplicative) {
      var pure34 = pure(dictApplicative);
      var map60 = map(dictApplicative.Apply0().Functor0());
      return function(v2) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return pure34(Nothing.value);
          }
          ;
          if (v1 instanceof Just) {
            return map60(Just.create)(v2(v1.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    },
    sequence: function(dictApplicative) {
      var pure34 = pure(dictApplicative);
      var map60 = map(dictApplicative.Apply0().Functor0());
      return function(v2) {
        if (v2 instanceof Nothing) {
          return pure34(Nothing.value);
        }
        ;
        if (v2 instanceof Just) {
          return map60(Just.create)(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [v2.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    },
    Foldable1: function() {
      return foldableMaybe;
    }
  };
  var sequenceDefault = function(dictTraversable) {
    var traverse22 = traverse(dictTraversable);
    return function(dictApplicative) {
      return traverse22(dictApplicative)(identity8);
    };
  };
  var traversableArray = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
    },
    sequence: function(dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
    },
    Functor0: function() {
      return functorArray;
    },
    Foldable1: function() {
      return foldableArray;
    }
  };
  var $$for = function(dictApplicative) {
    return function(dictTraversable) {
      var traverse22 = traverse(dictTraversable)(dictApplicative);
      return function(x2) {
        return function(f) {
          return traverse22(f)(x2);
        };
      };
    };
  };

  // output/Control.Parallel/index.js
  var identity9 = /* @__PURE__ */ identity(categoryFn);
  var parTraverse_ = function(dictParallel) {
    var sequential3 = sequential(dictParallel);
    var traverse_17 = traverse_(dictParallel.Applicative1());
    var parallel3 = parallel(dictParallel);
    return function(dictFoldable) {
      var traverse_18 = traverse_17(dictFoldable);
      return function(f) {
        var $48 = traverse_18(function($50) {
          return parallel3(f($50));
        });
        return function($49) {
          return sequential3($48($49));
        };
      };
    };
  };
  var parSequence_ = function(dictParallel) {
    var parTraverse_1 = parTraverse_(dictParallel);
    return function(dictFoldable) {
      return parTraverse_1(dictFoldable)(identity9);
    };
  };

  // output/Data.Time.Duration/index.js
  var over2 = /* @__PURE__ */ over()();
  var Seconds = function(x2) {
    return x2;
  };
  var Milliseconds = function(x2) {
    return x2;
  };
  var semigroupSeconds = {
    append: function(v2) {
      return function(v1) {
        return v2 + v1;
      };
    }
  };
  var fromDuration = function(dict) {
    return dict.fromDuration;
  };
  var durationSeconds = {
    fromDuration: /* @__PURE__ */ over2(Seconds)(function(v2) {
      return v2 * 1e3;
    }),
    toDuration: /* @__PURE__ */ over2(Milliseconds)(function(v2) {
      return v2 / 1e3;
    })
  };

  // output/Effect.Unsafe/foreign.js
  var unsafePerformEffect = function(f) {
    return f();
  };

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Effect.Aff/index.js
  var $runtime_lazy3 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var pure2 = /* @__PURE__ */ pure(applicativeEffect);
  var $$void3 = /* @__PURE__ */ $$void(functorEffect);
  var map7 = /* @__PURE__ */ map(functorEffect);
  var Canceler = function(x2) {
    return x2;
  };
  var suspendAff = /* @__PURE__ */ _fork(false);
  var functorParAff = {
    map: _parAffMap
  };
  var functorAff = {
    map: _map
  };
  var map1 = /* @__PURE__ */ map(functorAff);
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = /* @__PURE__ */ function() {
    var unsafeFromRight = function(v2) {
      if (v2 instanceof Right) {
        return v2.value0;
      }
      ;
      if (v2 instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v2.constructor.name]);
    };
    var unsafeFromLeft = function(v2) {
      if (v2 instanceof Left) {
        return v2.value0;
      }
      ;
      if (v2 instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v2.constructor.name]);
    };
    var isLeft = function(v2) {
      if (v2 instanceof Left) {
        return true;
      }
      ;
      if (v2 instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v2.constructor.name]);
    };
    return {
      isLeft,
      fromLeft: unsafeFromLeft,
      fromRight: unsafeFromRight,
      left: Left.create,
      right: Right.create
    };
  }();
  var makeFiber = function(aff) {
    return _makeFiber(ffiUtil, aff);
  };
  var launchAff = function(aff) {
    return function __do5() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var delay = function(v2) {
    return _delay(Right.create, v2);
  };
  var bracket = function(acquire) {
    return function(completed) {
      return generalBracket(acquire)({
        killed: $$const(completed),
        failed: $$const(completed),
        completed: $$const(completed)
      });
    };
  };
  var applyParAff = {
    apply: _parAffApply,
    Functor0: function() {
      return functorParAff;
    }
  };
  var monadAff = {
    Applicative0: function() {
      return applicativeAff;
    },
    Bind1: function() {
      return bindAff;
    }
  };
  var bindAff = {
    bind: _bind,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var applicativeAff = {
    pure: _pure,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy3("applyAff", "Effect.Aff", function() {
    return {
      apply: ap(monadAff),
      Functor0: function() {
        return functorAff;
      }
    };
  });
  var pure22 = /* @__PURE__ */ pure(applicativeAff);
  var bind1 = /* @__PURE__ */ bind(bindAff);
  var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindAff);
  var $$finally = function(fin) {
    return function(a3) {
      return bracket(pure22(unit))($$const(fin))($$const(a3));
    };
  };
  var monadEffectAff = {
    liftEffect: _liftEffect,
    Monad0: function() {
      return monadAff;
    }
  };
  var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var effectCanceler = function($75) {
    return Canceler($$const(liftEffect2($75)));
  };
  var joinFiber = function(v2) {
    return makeAff(function(k) {
      return map7(effectCanceler)(v2.join(k));
    });
  };
  var functorFiber = {
    map: function(f) {
      return function(t2) {
        return unsafePerformEffect(makeFiber(map1(f)(joinFiber(t2))));
      };
    }
  };
  var killFiber = function(e) {
    return function(v2) {
      return bind1(liftEffect2(v2.isSuspended))(function(suspended) {
        if (suspended) {
          return liftEffect2($$void3(v2.kill(e, $$const(pure2(unit)))));
        }
        ;
        return makeAff(function(k) {
          return map7(effectCanceler)(v2.kill(e, k));
        });
      });
    };
  };
  var monadThrowAff = {
    throwError: _throwError,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadErrorAff = {
    catchError: _catchError,
    MonadThrow0: function() {
      return monadThrowAff;
    }
  };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = function(k) {
    return function(aff) {
      return launchAff(bindFlipped3(function($80) {
        return liftEffect2(k($80));
      })($$try2(aff)));
    };
  };
  var runAff_ = function(k) {
    return function(aff) {
      return $$void3(runAff(k)(aff));
    };
  };
  var parallelAff = {
    parallel: unsafeCoerce2,
    sequential: _sequential,
    Monad0: function() {
      return monadAff;
    },
    Applicative1: function() {
      return $lazy_applicativeParAff(0);
    }
  };
  var $lazy_applicativeParAff = /* @__PURE__ */ $runtime_lazy3("applicativeParAff", "Effect.Aff", function() {
    return {
      pure: function() {
        var $82 = parallel(parallelAff);
        return function($83) {
          return $82(pure22($83));
        };
      }(),
      Apply0: function() {
        return applyParAff;
      }
    };
  });
  var applicativeParAff = /* @__PURE__ */ $lazy_applicativeParAff(136);
  var monadRecAff = {
    tailRecM: function(k) {
      var go2 = function(a3) {
        return bind1(k(a3))(function(res) {
          if (res instanceof Done) {
            return pure22(res.value0);
          }
          ;
          if (res instanceof Loop) {
            return go2(res.value0);
          }
          ;
          throw new Error("Failed pattern match at Effect.Aff (line 104, column 7 - line 106, column 23): " + [res.constructor.name]);
        });
      };
      return go2;
    },
    Monad0: function() {
      return monadAff;
    }
  };
  var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));

  // output/Data.Lazy/foreign.js
  var defer2 = function(thunk) {
    var v2 = null;
    return function() {
      if (thunk === void 0)
        return v2;
      v2 = thunk();
      thunk = void 0;
      return v2;
    };
  };
  var force = function(l2) {
    return l2();
  };

  // output/Data.Lazy/index.js
  var functorLazy = {
    map: function(f) {
      return function(l2) {
        return defer2(function(v2) {
          return f(force(l2));
        });
      };
    }
  };

  // output/Control.Monad.State.Trans/index.js
  var runStateT = function(v2) {
    return v2;
  };
  var monadTransStateT = {
    lift: function(dictMonad) {
      var bind36 = bind(dictMonad.Bind1());
      var pure34 = pure(dictMonad.Applicative0());
      return function(m2) {
        return function(s2) {
          return bind36(m2)(function(x2) {
            return pure34(new Tuple(x2, s2));
          });
        };
      };
    }
  };
  var lift6 = /* @__PURE__ */ lift(monadTransStateT);
  var functorStateT = function(dictFunctor) {
    var map60 = map(dictFunctor);
    return {
      map: function(f) {
        return function(v2) {
          return function(s2) {
            return map60(function(v1) {
              return new Tuple(f(v1.value0), v1.value1);
            })(v2(s2));
          };
        };
      }
    };
  };
  var evalStateT = function(dictFunctor) {
    var map60 = map(dictFunctor);
    return function(v2) {
      return function(s2) {
        return map60(fst)(v2(s2));
      };
    };
  };
  var monadStateT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeStateT(dictMonad);
      },
      Bind1: function() {
        return bindStateT(dictMonad);
      }
    };
  };
  var bindStateT = function(dictMonad) {
    var bind36 = bind(dictMonad.Bind1());
    return {
      bind: function(v2) {
        return function(f) {
          return function(s2) {
            return bind36(v2(s2))(function(v1) {
              var v3 = f(v1.value0);
              return v3(v1.value1);
            });
          };
        };
      },
      Apply0: function() {
        return applyStateT(dictMonad);
      }
    };
  };
  var applyStateT = function(dictMonad) {
    var functorStateT1 = functorStateT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadStateT(dictMonad)),
      Functor0: function() {
        return functorStateT1;
      }
    };
  };
  var applicativeStateT = function(dictMonad) {
    var pure34 = pure(dictMonad.Applicative0());
    return {
      pure: function(a3) {
        return function(s2) {
          return pure34(new Tuple(a3, s2));
        };
      },
      Apply0: function() {
        return applyStateT(dictMonad);
      }
    };
  };
  var monadStateStateT = function(dictMonad) {
    var pure34 = pure(dictMonad.Applicative0());
    var monadStateT1 = monadStateT(dictMonad);
    return {
      state: function(f) {
        return function($200) {
          return pure34(f($200));
        };
      },
      Monad0: function() {
        return monadStateT1;
      }
    };
  };
  var monadThrowStateT = function(dictMonadThrow) {
    var Monad0 = dictMonadThrow.Monad0();
    var lift1 = lift6(Monad0);
    var throwError3 = throwError(dictMonadThrow);
    var monadStateT1 = monadStateT(Monad0);
    return {
      throwError: function(e) {
        return lift1(throwError3(e));
      },
      Monad0: function() {
        return monadStateT1;
      }
    };
  };
  var monadErrorStateT = function(dictMonadError) {
    var catchError2 = catchError(dictMonadError);
    var monadThrowStateT1 = monadThrowStateT(dictMonadError.MonadThrow0());
    return {
      catchError: function(v2) {
        return function(h7) {
          return function(s2) {
            return catchError2(v2(s2))(function(e) {
              var v1 = h7(e);
              return v1(s2);
            });
          };
        };
      },
      MonadThrow0: function() {
        return monadThrowStateT1;
      }
    };
  };

  // output/Effect.Aff.Class/index.js
  var lift42 = /* @__PURE__ */ lift(monadTransReaderT);
  var monadAffAff = {
    liftAff: /* @__PURE__ */ identity(categoryFn),
    MonadEffect0: function() {
      return monadEffectAff;
    }
  };
  var liftAff = function(dict) {
    return dict.liftAff;
  };
  var monadAffReader = function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var monadEffectReader2 = monadEffectReader(MonadEffect0);
    return {
      liftAff: function() {
        var $79 = lift42(MonadEffect0.Monad0());
        var $80 = liftAff(dictMonadAff);
        return function($81) {
          return $79($80($81));
        };
      }(),
      MonadEffect0: function() {
        return monadEffectReader2;
      }
    };
  };

  // output/Effect.Console/foreign.js
  var log = function(s2) {
    return function() {
      console.log(s2);
    };
  };
  var warn = function(s2) {
    return function() {
      console.warn(s2);
    };
  };

  // output/Effect.Class.Console/index.js
  var log2 = function(dictMonadEffect) {
    var $51 = liftEffect(dictMonadEffect);
    return function($52) {
      return $51(log($52));
    };
  };

  // output/Web.DOM.DOMTokenList/foreign.js
  function add2(list) {
    return function(token) {
      return function() {
        return list.add(token);
      };
    };
  }
  function remove(list) {
    return function(token) {
      return function() {
        return list.remove(token);
      };
    };
  }

  // output/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a3, r2, f) {
    return a3 == null ? r2 : f(a3);
  }
  function notNull(x2) {
    return x2;
  }

  // output/Data.Nullable/index.js
  var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name16) {
    return function(doctype) {
      return doctype[name16];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");
  function classList(element4) {
    return function() {
      return element4.classList;
    };
  }
  function setScrollTop(scrollTop2) {
    return function(node) {
      return function() {
        node.scrollTop = scrollTop2;
      };
    };
  }
  function clientWidth(el) {
    return function() {
      return el.clientWidth;
    };
  }
  function getBoundingClientRect(el) {
    return function() {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    };
  }

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector2) {
    return function(node) {
      return function() {
        return node.querySelector(selector2);
      };
    };
  }
  function querySelectorAll(selector2) {
    return function(node) {
      return function() {
        return node.querySelectorAll(selector2);
      };
    };
  }

  // output/Web.DOM.ParentNode/index.js
  var map8 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map8(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name16, value14) {
    if (typeof window !== "undefined") {
      var ty = window[name16];
      if (ty != null && value14 instanceof ty) {
        return just(value14);
      }
    }
    var obj = value14;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name16) {
        return just(value14);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = function(name16) {
    return function(value14) {
      return _unsafeReadProtoTagged(Nothing.value, Just.create, name16, value14);
    };
  };

  // output/Web.DOM.Element/index.js
  var toNode = unsafeCoerce2;
  var fromNode = /* @__PURE__ */ unsafeReadProtoTagged("Element");
  var fromEventTarget = /* @__PURE__ */ unsafeReadProtoTagged("Element");

  // output/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  function nodeName(node) {
    return node.nodeName;
  }
  var baseURI = getEffProp2("baseURI");
  var _ownerDocument = getEffProp2("ownerDocument");
  var _parentNode = getEffProp2("parentNode");
  var _parentElement = getEffProp2("parentElement");
  var childNodes = getEffProp2("childNodes");
  var _firstChild = getEffProp2("firstChild");
  var _lastChild = getEffProp2("lastChild");
  var _previousSibling = getEffProp2("previousSibling");
  var _nextSibling = getEffProp2("nextSibling");
  var _nodeValue = getEffProp2("nodeValue");
  var textContent = getEffProp2("textContent");
  function insertBefore(node1) {
    return function(node2) {
      return function(parent2) {
        return function() {
          parent2.insertBefore(node1, node2);
        };
      };
    };
  }
  function appendChild(node) {
    return function(parent2) {
      return function() {
        parent2.appendChild(node);
      };
    };
  }
  function removeChild(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output/Data.Enum/foreign.js
  function toCharCode(c2) {
    return c2.charCodeAt(0);
  }
  function fromCharCode(c2) {
    return String.fromCharCode(c2);
  }

  // output/Control.Alternative/index.js
  var guard = function(dictAlternative) {
    var pure34 = pure(dictAlternative.Applicative0());
    var empty9 = empty(dictAlternative.Plus1());
    return function(v2) {
      if (v2) {
        return pure34(unit);
      }
      ;
      if (!v2) {
        return empty9;
      }
      ;
      throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [v2.constructor.name]);
    };
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust8) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value14 = b2;
              while (true) {
                var maybe2 = f(value14);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust8(maybe2);
                result.push(fst2(tuple));
                value14 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust8) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value14 = b2;
              while (true) {
                var tuple = f(value14);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value14 = fromJust8(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldr1 = function(dict) {
    return dict.unfoldr1;
  };
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
  };
  var replicate1 = function(dictUnfoldable1) {
    var unfoldr11 = unfoldr1(dictUnfoldable1);
    return function(n) {
      return function(v2) {
        var step4 = function(i2) {
          if (i2 <= 0) {
            return new Tuple(v2, Nothing.value);
          }
          ;
          if (otherwise) {
            return new Tuple(v2, new Just(i2 - 1 | 0));
          }
          ;
          throw new Error("Failed pattern match at Data.Unfoldable1 (line 68, column 5 - line 68, column 39): " + [i2.constructor.name]);
        };
        return unfoldr11(step4)(n - 1 | 0);
      };
    };
  };
  var singleton = function(dictUnfoldable1) {
    return replicate1(dictUnfoldable1)(1);
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function(dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function() {
      return unfoldable1Array;
    }
  };

  // output/Data.Enum/index.js
  var bind2 = /* @__PURE__ */ bind(bindMaybe);
  var voidLeft2 = /* @__PURE__ */ voidLeft(functorMaybe);
  var guard2 = /* @__PURE__ */ guard(alternativeMaybe);
  var bottom1 = /* @__PURE__ */ bottom(boundedChar);
  var top1 = /* @__PURE__ */ top(boundedChar);
  var toEnum = function(dict) {
    return dict.toEnum;
  };
  var succ = function(dict) {
    return dict.succ;
  };
  var pred = function(dict) {
    return dict.pred;
  };
  var fromEnum = function(dict) {
    return dict.fromEnum;
  };
  var enumFromTo = function(dictEnum) {
    var Ord0 = dictEnum.Ord0();
    var eq110 = eq(Ord0.Eq0());
    var lessThan1 = lessThan(Ord0);
    var succ1 = succ(dictEnum);
    var lessThanOrEq1 = lessThanOrEq(Ord0);
    var pred1 = pred(dictEnum);
    var greaterThanOrEq1 = greaterThanOrEq(Ord0);
    return function(dictUnfoldable1) {
      var singleton11 = singleton(dictUnfoldable1);
      var unfoldr12 = unfoldr1(dictUnfoldable1);
      var go2 = function(step4) {
        return function(op) {
          return function(to3) {
            return function(a3) {
              return new Tuple(a3, bind2(step4(a3))(function(a$prime) {
                return voidLeft2(guard2(op(a$prime)(to3)))(a$prime);
              }));
            };
          };
        };
      };
      return function(v2) {
        return function(v1) {
          if (eq110(v2)(v1)) {
            return singleton11(v2);
          }
          ;
          if (lessThan1(v2)(v1)) {
            return unfoldr12(go2(succ1)(lessThanOrEq1)(v1))(v2);
          }
          ;
          if (otherwise) {
            return unfoldr12(go2(pred1)(greaterThanOrEq1)(v1))(v2);
          }
          ;
          throw new Error("Failed pattern match at Data.Enum (line 186, column 14 - line 190, column 51): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    };
  };
  var defaultSucc = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a3) {
        return toEnum$prime(fromEnum$prime(a3) + 1 | 0);
      };
    };
  };
  var defaultPred = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a3) {
        return toEnum$prime(fromEnum$prime(a3) - 1 | 0);
      };
    };
  };
  var charToEnum = function(v2) {
    if (v2 >= toCharCode(bottom1) && v2 <= toCharCode(top1)) {
      return new Just(fromCharCode(v2));
    }
    ;
    return Nothing.value;
  };
  var enumChar = {
    succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
    pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
    Ord0: function() {
      return ordChar;
    }
  };
  var boundedEnumChar = /* @__PURE__ */ function() {
    return {
      cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
      toEnum: charToEnum,
      fromEnum: toCharCode,
      Bounded0: function() {
        return boundedChar;
      },
      Enum1: function() {
        return enumChar;
      }
    };
  }();

  // output/Web.DOM.Node/index.js
  var map9 = /* @__PURE__ */ map(functorEffect);
  var parentNode = /* @__PURE__ */ function() {
    var $6 = map9(toMaybe);
    return function($7) {
      return $6(_parentNode($7));
    };
  }();
  var nextSibling = /* @__PURE__ */ function() {
    var $15 = map9(toMaybe);
    return function($16) {
      return $15(_nextSibling($16));
    };
  }();

  // output/Web.DOM.NodeList/foreign.js
  function toArray(list) {
    return function() {
      return [].slice.call(list);
    };
  }

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.HTML.HTMLDocument/foreign.js
  function _readyState(doc) {
    return doc.readyState;
  }

  // output/Web.HTML.HTMLDocument.ReadyState/index.js
  var Loading = /* @__PURE__ */ function() {
    function Loading2() {
    }
    ;
    Loading2.value = new Loading2();
    return Loading2;
  }();
  var Interactive = /* @__PURE__ */ function() {
    function Interactive2() {
    }
    ;
    Interactive2.value = new Interactive2();
    return Interactive2;
  }();
  var Complete = /* @__PURE__ */ function() {
    function Complete2() {
    }
    ;
    Complete2.value = new Complete2();
    return Complete2;
  }();
  var parse = function(v2) {
    if (v2 === "loading") {
      return new Just(Loading.value);
    }
    ;
    if (v2 === "interactive") {
      return new Just(Interactive.value);
    }
    ;
    if (v2 === "complete") {
      return new Just(Complete.value);
    }
    ;
    return Nothing.value;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var map10 = /* @__PURE__ */ map(functorEffect);
  var toParentNode = unsafeCoerce2;
  var toEventTarget = unsafeCoerce2;
  var toDocument = unsafeCoerce2;
  var readyState = function(doc) {
    return map10(function() {
      var $4 = fromMaybe(Loading.value);
      return function($5) {
        return $4(parse($5));
      };
    }())(function() {
      return _readyState(doc);
    });
  };

  // output/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value14) {
    var tag = Object.prototype.toString.call(value14);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value14);
    } else {
      return nothing;
    }
  }
  function setDraggable(draggable3) {
    return function(elt) {
      return function() {
        elt.draggable = draggable3;
      };
    };
  }

  // output/Web.HTML.HTMLElement/index.js
  var toNode2 = unsafeCoerce2;
  var toElement = unsafeCoerce2;
  var fromElement = function(x2) {
    return _read(Nothing.value, Just.create, x2);
  };

  // output/Web.HTML.Location/foreign.js
  function hash(location4) {
    return function() {
      return location4.hash;
    };
  }
  function setHash(hash4) {
    return function(location4) {
      return function() {
        location4.hash = hash4;
      };
    };
  }

  // output/Web.HTML.Window/foreign.js
  function document(window2) {
    return function() {
      return window2.document;
    };
  }
  function location(window2) {
    return function() {
      return window2.location;
    };
  }
  function confirm(str2) {
    return function(window2) {
      return function() {
        return window2.confirm(str2);
      };
    };
  }
  function localStorage(window2) {
    return function() {
      return window2.localStorage;
    };
  }

  // output/Web.HTML.Window/index.js
  var toEventTarget2 = unsafeCoerce2;

  // output/Capability.Spotlight/index.js
  var discard2 = /* @__PURE__ */ discard(discardUnit);
  var bind3 = /* @__PURE__ */ bind(bindEffect);
  var spotlight = function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var Monad0 = MonadEffect0.Monad0();
    var Bind1 = Monad0.Bind1();
    var discard112 = discard2(Bind1);
    var log5 = log2(MonadEffect0);
    var bind118 = bind(Bind1);
    var liftEffect11 = liftEffect(MonadEffect0);
    var Applicative0 = Monad0.Applicative0();
    var traverse_17 = traverse_(Applicative0)(foldableArray);
    var for_10 = for_(Applicative0)(foldableMaybe);
    var liftAff3 = liftAff(dictMonadAff);
    return function(selector2) {
      return discard112(log5("starting spotlight"))(function() {
        return bind118(liftEffect11(bind3(windowImpl)(document)))(function(htmlDocument) {
          return bind118(liftEffect11(querySelectorAll(selector2)(toParentNode(htmlDocument))))(function(nodeList) {
            return bind118(liftEffect11(toArray(nodeList)))(traverse_17(function(node) {
              return for_10(fromNode(node))(function(element4) {
                return discard112(log5("spotlighting " + (nodeName(node) + (" with local name " + localName(element4)))))(function() {
                  return bind118(liftEffect11(classList(element4)))(function(tokenList) {
                    return discard112(liftEffect11(add2(tokenList)("spotlight")))(function() {
                      return discard112(liftAff3(delay(1e3)))(function() {
                        return liftEffect11(remove(tokenList)("spotlight"));
                      });
                    });
                  });
                });
              });
            }));
          });
        });
      });
    };
  };

  // output/Data.Array/foreign.js
  var rangeImpl = function(start2, end3) {
    var step4 = start2 > end3 ? -1 : 1;
    var result = new Array(step4 * (end3 - start2) + 1);
    var i2 = start2, n = 0;
    while (i2 !== end3) {
      result[n++] = i2;
      i2 += step4;
    }
    result[n] = i2;
    return result;
  };
  var replicateFill = function(count2, value14) {
    if (count2 < 1) {
      return [];
    }
    var result = new Array(count2);
    return result.fill(value14);
  };
  var replicatePolyfill = function(count2, value14) {
    var result = [];
    var n = 0;
    for (var i2 = 0; i2 < count2; i2++) {
      result[n++] = value14;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons3(head7, tail3) {
      this.head = head7;
      this.tail = tail3;
    }
    var emptyList = {};
    function curryCons(head7) {
      return function(tail3) {
        return new Cons3(head7, tail3);
      };
    }
    function listToArray(list) {
      var result = [];
      var count2 = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count2++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr6, xs) {
      return listToArray(foldr6(curryCons)(emptyList)(xs));
    };
  }();
  var length5 = function(xs) {
    return xs.length;
  };
  var unconsImpl = function(empty9, next2, xs) {
    return xs.length === 0 ? empty9({}) : next2(xs[0])(xs.slice(1));
  };
  var indexImpl = function(just, nothing, xs, i2) {
    return i2 < 0 || i2 >= xs.length ? nothing : just(xs[i2]);
  };
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i2 = 0, l2 = xs.length; i2 < l2; i2++) {
      if (f(xs[i2]))
        return just(i2);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i2, l2) {
    if (i2 < 0 || i2 >= l2.length)
      return nothing;
    var l1 = l2.slice();
    l1.splice(i2, 1);
    return just(l1);
  };
  var filterImpl = function(f, xs) {
    return xs.filter(f);
  };
  var partitionImpl = function(f, xs) {
    var yes = [];
    var no = [];
    for (var i2 = 0; i2 < xs.length; i2++) {
      var x2 = xs[i2];
      if (f(x2))
        yes.push(x2);
      else
        no.push(x2);
    }
    return { yes, no };
  };
  var sortByImpl = function() {
    function mergeFromTo(compare10, fromOrdering, xs1, xs2, from3, to3) {
      var mid;
      var i2;
      var j;
      var k;
      var x2;
      var y2;
      var c2;
      mid = from3 + (to3 - from3 >> 1);
      if (mid - from3 > 1)
        mergeFromTo(compare10, fromOrdering, xs2, xs1, from3, mid);
      if (to3 - mid > 1)
        mergeFromTo(compare10, fromOrdering, xs2, xs1, mid, to3);
      i2 = from3;
      j = mid;
      k = from3;
      while (i2 < mid && j < to3) {
        x2 = xs2[i2];
        y2 = xs2[j];
        c2 = fromOrdering(compare10(x2)(y2));
        if (c2 > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to3) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare10, fromOrdering, xs) {
      var out;
      if (xs.length < 2)
        return xs;
      out = xs.slice(0);
      mergeFromTo(compare10, fromOrdering, out, xs.slice(0), 0, xs.length);
      return out;
    };
  }();
  var sliceImpl = function(s2, e, l2) {
    return l2.slice(s2, e);
  };
  var zipWithImpl = function(f, xs, ys) {
    var l2 = xs.length < ys.length ? xs.length : ys.length;
    var result = new Array(l2);
    for (var i2 = 0; i2 < l2; i2++) {
      result[i2] = f(xs[i2])(ys[i2]);
    }
    return result;
  };
  var unsafeIndexImpl = function(xs, n) {
    return xs[n];
  };

  // output/Data.Array.ST/foreign.js
  function newSTArray() {
    return [];
  }
  var pushAllImpl = function(as2, xs) {
    return xs.push.apply(xs, as2);
  };
  function unsafeFreezeThawImpl(xs) {
    return xs;
  }
  var unsafeFreezeImpl = unsafeFreezeThawImpl;
  var unsafeThawImpl = unsafeFreezeThawImpl;
  function copyImpl(xs) {
    return xs.slice();
  }
  var thawImpl = copyImpl;
  var sortByImpl2 = function() {
    function mergeFromTo(compare10, fromOrdering, xs1, xs2, from3, to3) {
      var mid;
      var i2;
      var j;
      var k;
      var x2;
      var y2;
      var c2;
      mid = from3 + (to3 - from3 >> 1);
      if (mid - from3 > 1)
        mergeFromTo(compare10, fromOrdering, xs2, xs1, from3, mid);
      if (to3 - mid > 1)
        mergeFromTo(compare10, fromOrdering, xs2, xs1, mid, to3);
      i2 = from3;
      j = mid;
      k = from3;
      while (i2 < mid && j < to3) {
        x2 = xs2[i2];
        y2 = xs2[j];
        c2 = fromOrdering(compare10(x2)(y2));
        if (c2 > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to3) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare10, fromOrdering, xs) {
      if (xs.length < 2)
        return xs;
      mergeFromTo(compare10, fromOrdering, xs, xs.slice(0), 0, xs.length);
      return xs;
    };
  }();

  // output/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn1 = function runSTFn12(fn) {
    return function(a3) {
      return function() {
        return fn(a3);
      };
    };
  };
  var runSTFn2 = function runSTFn22(fn) {
    return function(a3) {
      return function(b2) {
        return function() {
          return fn(a3, b2);
        };
      };
    };
  };

  // output/Data.Array.ST/index.js
  var bind4 = /* @__PURE__ */ bind(bindST);
  var unsafeThaw = /* @__PURE__ */ runSTFn1(unsafeThawImpl);
  var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
  var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
  var withArray = function(f) {
    return function(xs) {
      return function __do5() {
        var result = thaw(xs)();
        f(result)();
        return unsafeFreeze(result)();
      };
    };
  };
  var run2 = function(st) {
    return bind4(st)(unsafeFreeze)();
  };
  var push = function(a3) {
    return runSTFn2(pushAllImpl)([a3]);
  };

  // output/Data.Array.ST.Iterator/index.js
  var map11 = /* @__PURE__ */ map(functorST);
  var not2 = /* @__PURE__ */ not(heytingAlgebraBoolean);
  var $$void4 = /* @__PURE__ */ $$void(functorST);
  var Iterator = /* @__PURE__ */ function() {
    function Iterator2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Iterator2.create = function(value0) {
      return function(value1) {
        return new Iterator2(value0, value1);
      };
    };
    return Iterator2;
  }();
  var next = function(v2) {
    return function __do5() {
      var i2 = read2(v2.value1)();
      modify2(function(v1) {
        return v1 + 1 | 0;
      })(v2.value1)();
      return v2.value0(i2);
    };
  };
  var iterator = function(f) {
    return map11(Iterator.create(f))(newSTRef(0));
  };
  var iterate = function(iter) {
    return function(f) {
      return function __do5() {
        var $$break = newSTRef(false)();
        while (map11(not2)(read2($$break))()) {
          (function __do6() {
            var mx = next(iter)();
            if (mx instanceof Just) {
              return f(mx.value0)();
            }
            ;
            if (mx instanceof Nothing) {
              return $$void4(write2(true)($$break))();
            }
            ;
            throw new Error("Failed pattern match at Data.Array.ST.Iterator (line 42, column 5 - line 44, column 47): " + [mx.constructor.name]);
          })();
        }
        ;
        return {};
      };
    };
  };

  // output/Data.Function.Uncurried/foreign.js
  var runFn2 = function(fn) {
    return function(a3) {
      return function(b2) {
        return fn(a3, b2);
      };
    };
  };
  var runFn3 = function(fn) {
    return function(a3) {
      return function(b2) {
        return function(c2) {
          return fn(a3, b2, c2);
        };
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a3) {
      return function(b2) {
        return function(c2) {
          return function(d2) {
            return fn(a3, b2, c2, d2);
          };
        };
      };
    };
  };

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l2 = xs.length;
      var result = Array(l2);
      for (var i2 = 0; i2 < l2; i2++) {
        result[i2] = f(i2)(xs[i2]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex = function(dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function() {
      return functorArray;
    }
  };

  // output/Data.Array/index.js
  var $$void5 = /* @__PURE__ */ $$void(functorST);
  var intercalate1 = /* @__PURE__ */ intercalate(foldableArray);
  var map12 = /* @__PURE__ */ map(functorMaybe);
  var map13 = /* @__PURE__ */ map(functorArray);
  var map22 = /* @__PURE__ */ map(functorST);
  var fromJust4 = /* @__PURE__ */ fromJust();
  var when2 = /* @__PURE__ */ when(applicativeST);
  var notEq3 = /* @__PURE__ */ notEq(eqOrdering);
  var fold1 = /* @__PURE__ */ fold(foldableArray);
  var append2 = /* @__PURE__ */ append(semigroupArray);
  var zipWith = /* @__PURE__ */ runFn3(zipWithImpl);
  var zip = /* @__PURE__ */ function() {
    return zipWith(Tuple.create);
  }();
  var unsafeIndex = function() {
    return runFn2(unsafeIndexImpl);
  };
  var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
  var uncons = /* @__PURE__ */ function() {
    return runFn3(unconsImpl)($$const(Nothing.value))(function(x2) {
      return function(xs) {
        return new Just({
          head: x2,
          tail: xs
        });
      };
    });
  }();
  var toUnfoldable = function(dictUnfoldable) {
    var unfoldr4 = unfoldr(dictUnfoldable);
    return function(xs) {
      var len = length5(xs);
      var f = function(i2) {
        if (i2 < len) {
          return new Just(new Tuple(unsafeIndex1(xs)(i2), i2 + 1 | 0));
        }
        ;
        if (otherwise) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Array (line 163, column 3 - line 165, column 26): " + [i2.constructor.name]);
      };
      return unfoldr4(f)(0);
    };
  };
  var tail = /* @__PURE__ */ function() {
    return runFn3(unconsImpl)($$const(Nothing.value))(function(v2) {
      return function(xs) {
        return new Just(xs);
      };
    });
  }();
  var sortBy = function(comp) {
    return runFn3(sortByImpl)(comp)(function(v2) {
      if (v2 instanceof GT) {
        return 1;
      }
      ;
      if (v2 instanceof EQ) {
        return 0;
      }
      ;
      if (v2 instanceof LT) {
        return -1 | 0;
      }
      ;
      throw new Error("Failed pattern match at Data.Array (line 897, column 38 - line 900, column 11): " + [v2.constructor.name]);
    });
  };
  var sortWith = function(dictOrd) {
    var comparing2 = comparing(dictOrd);
    return function(f) {
      return sortBy(comparing2(f));
    };
  };
  var sortWith1 = /* @__PURE__ */ sortWith(ordInt);
  var snoc = function(xs) {
    return function(x2) {
      return withArray(push(x2))(xs)();
    };
  };
  var slice = /* @__PURE__ */ runFn3(sliceImpl);
  var singleton2 = function(a3) {
    return [a3];
  };
  var range2 = /* @__PURE__ */ runFn2(rangeImpl);
  var partition = /* @__PURE__ */ runFn2(partitionImpl);
  var $$null = function(xs) {
    return length5(xs) === 0;
  };
  var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
  var intersperse = function(a3) {
    return function(arr) {
      var v2 = length5(arr);
      if (v2 < 2) {
        return arr;
      }
      ;
      if (otherwise) {
        return run2(function() {
          var unsafeGetElem = function(idx) {
            return unsafeIndex1(arr)(idx);
          };
          return function __do5() {
            var out = newSTArray();
            push(unsafeGetElem(0))(out)();
            forST(1)(v2)(function(idx) {
              return function __do6() {
                push(a3)(out)();
                return $$void5(push(unsafeGetElem(idx))(out))();
              };
            })();
            return out;
          };
        }());
      }
      ;
      throw new Error("Failed pattern match at Data.Array (line 623, column 21 - line 633, column 17): " + [v2.constructor.name]);
    };
  };
  var intercalate2 = function(dictMonoid) {
    return intercalate1(dictMonoid);
  };
  var init = function(xs) {
    if ($$null(xs)) {
      return Nothing.value;
    }
    ;
    if (otherwise) {
      return new Just(slice(0)(length5(xs) - 1 | 0)(xs));
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 351, column 1 - line 351, column 45): " + [xs.constructor.name]);
  };
  var index2 = /* @__PURE__ */ function() {
    return runFn4(indexImpl)(Just.create)(Nothing.value);
  }();
  var last = function(xs) {
    return index2(xs)(length5(xs) - 1 | 0);
  };
  var head = function(xs) {
    return index2(xs)(0);
  };
  var nubBy = function(comp) {
    return function(xs) {
      var indexedAndSorted = sortBy(function(x2) {
        return function(y2) {
          return comp(snd(x2))(snd(y2));
        };
      })(mapWithIndex2(Tuple.create)(xs));
      var v2 = head(indexedAndSorted);
      if (v2 instanceof Nothing) {
        return [];
      }
      ;
      if (v2 instanceof Just) {
        return map13(snd)(sortWith1(fst)(function __do5() {
          var result = unsafeThaw(singleton2(v2.value0))();
          foreach(indexedAndSorted)(function(v1) {
            return function __do6() {
              var lst = map22(function() {
                var $183 = function($185) {
                  return fromJust4(last($185));
                };
                return function($184) {
                  return snd($183($184));
                };
              }())(unsafeFreeze(result))();
              return when2(notEq3(comp(lst)(v1.value1))(EQ.value))($$void5(push(v1)(result)))();
            };
          })();
          return unsafeFreeze(result)();
        }()));
      }
      ;
      throw new Error("Failed pattern match at Data.Array (line 1115, column 17 - line 1123, column 28): " + [v2.constructor.name]);
    };
  };
  var nub = function(dictOrd) {
    return nubBy(compare(dictOrd));
  };
  var fromFoldable = function(dictFoldable) {
    return runFn2(fromFoldableImpl)(foldr(dictFoldable));
  };
  var fold2 = function(dictMonoid) {
    return fold1(dictMonoid);
  };
  var findIndex = /* @__PURE__ */ function() {
    return runFn4(findIndexImpl)(Just.create)(Nothing.value);
  }();
  var find2 = function(f) {
    return function(xs) {
      return map12(unsafeIndex1(xs))(findIndex(f)(xs));
    };
  };
  var filter = /* @__PURE__ */ runFn2(filterImpl);
  var elemIndex = function(dictEq) {
    var eq26 = eq(dictEq);
    return function(x2) {
      return findIndex(function(v2) {
        return eq26(v2)(x2);
      });
    };
  };
  var elem2 = function(dictEq) {
    var elemIndex1 = elemIndex(dictEq);
    return function(a3) {
      return function(arr) {
        return isJust(elemIndex1(a3)(arr));
      };
    };
  };
  var drop = function(n) {
    return function(xs) {
      var $173 = n < 1;
      if ($173) {
        return xs;
      }
      ;
      return slice(n)(length5(xs))(xs);
    };
  };
  var deleteAt = /* @__PURE__ */ function() {
    return runFn4(_deleteAt)(Just.create)(Nothing.value);
  }();
  var deleteBy = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v22.length === 0) {
          return [];
        }
        ;
        return maybe(v22)(function(i2) {
          return fromJust4(deleteAt(i2)(v22));
        })(findIndex(v2(v1))(v22));
      };
    };
  };
  var cons = function(x2) {
    return function(xs) {
      return append2([x2])(xs);
    };
  };
  var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
  var mapMaybe = function(f) {
    return concatMap(function() {
      var $189 = maybe([])(singleton2);
      return function($190) {
        return $189(f($190));
      };
    }());
  };

  // output/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a3) {
    return function(b2) {
      return a3 === b2;
    };
  }

  // output/Unsafe.Reference/index.js
  var unsafeRefEq = reallyUnsafeRefEq;

  // output/Halogen.Subscription/index.js
  var $$void6 = /* @__PURE__ */ $$void(functorEffect);
  var coerce3 = /* @__PURE__ */ coerce();
  var bind5 = /* @__PURE__ */ bind(bindEffect);
  var append3 = /* @__PURE__ */ append(semigroupArray);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
  var unsubscribe = function(v2) {
    return v2;
  };
  var subscribe = function(v2) {
    return function(k) {
      return v2(function($76) {
        return $$void6(k($76));
      });
    };
  };
  var notify = function(v2) {
    return function(a3) {
      return v2(a3);
    };
  };
  var makeEmitter = coerce3;
  var functorEmitter = {
    map: function(f) {
      return function(v2) {
        return function(k) {
          return v2(function($77) {
            return k(f($77));
          });
        };
      };
    }
  };
  var create3 = function __do() {
    var subscribers = $$new([])();
    return {
      emitter: function(k) {
        return function __do5() {
          modify_(function(v2) {
            return append3(v2)([k]);
          })(subscribers)();
          return modify_(deleteBy(unsafeRefEq)(k))(subscribers);
        };
      },
      listener: function(a3) {
        return bind5(read(subscribers))(traverse_1(function(k) {
          return k(a3);
        }));
      }
    };
  };

  // output/Capability.ChatServer/index.js
  var discard3 = /* @__PURE__ */ discard(discardUnit);
  var log3 = /* @__PURE__ */ log2(monadEffectEffect);
  var discard1 = /* @__PURE__ */ discard3(bindAff);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var $$void7 = /* @__PURE__ */ $$void(functorAff);
  var bind6 = /* @__PURE__ */ bind(bindAff);
  var forever2 = /* @__PURE__ */ forever(monadRecAff);
  var for_2 = /* @__PURE__ */ for_(applicativeAff)(foldableMaybe);
  var liftAff2 = /* @__PURE__ */ liftAff(monadAffAff);
  var fromDuration2 = /* @__PURE__ */ fromDuration(durationSeconds);
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeAff)(foldableMaybe);
  var spotlight2 = /* @__PURE__ */ spotlight(monadAffAff);
  var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
  var sendMessage = function(dictMonadAsk) {
    var Bind1 = dictMonadAsk.Monad0().Bind1();
    var bind210 = bind(Bind1);
    var asks2 = asks(dictMonadAsk);
    var discard27 = discard3(Bind1);
    return function(dictMonadEffect) {
      var liftEffect22 = liftEffect(dictMonadEffect);
      return function(message3) {
        return bind210(asks2(function(v2) {
          return v2.chatServer.isRunning;
        }))(function(isRunningRef) {
          return bind210(liftEffect22(read(isRunningRef)))(function(isRunning) {
            if (isRunning) {
              return bind210(asks2(function(v2) {
                return v2.chatServer.listener;
              }))(function(listener) {
                return liftEffect22(notify(listener)(message3));
              });
            }
            ;
            return discard27(liftEffect22(log3("server is not running!")))(function() {
              return liftEffect22($$throw("SERVER NOT RUNNING, CRASH THE PLANE NO SURVIVOR"));
            });
          });
        });
      };
    };
  };
  var runChatServer = function(chatServer) {
    return discard1(liftEffect3(write(true)(chatServer.isRunning)))(function() {
      return $$void7(forkAff(bind6(forever2(bind6(liftEffect3(read(chatServer.queuedMessages)))(function(queued) {
        var v2 = uncons(queued);
        if (v2 instanceof Just) {
          return discard1(for_2(v2.value0.head.delayBy)(function(d2) {
            return liftAff2(delay(fromDuration2(d2)));
          }))(function() {
            return discard1(liftEffect3(notify(chatServer.listener)(v2.value0.head)))(function() {
              return discard1(traverse_3(spotlight2)(v2.value0.head.selector))(function() {
                return liftEffect3(write(v2.value0.tail)(chatServer.queuedMessages));
              });
            });
          });
        }
        ;
        if (v2 instanceof Nothing) {
          return liftAff2(delay(100));
        }
        ;
        throw new Error("Failed pattern match at Capability.ChatServer (line 78, column 7 - line 88, column 47): " + [v2.constructor.name]);
      })))(function() {
        return liftEffect3(write(false)(chatServer.isRunning));
      })));
    });
  };
  var putQueuedMessages = function(dictMonadAsk) {
    var bind210 = bind(dictMonadAsk.Monad0().Bind1());
    var asks2 = asks(dictMonadAsk);
    return function(dictMonadEffect) {
      var liftEffect22 = liftEffect(dictMonadEffect);
      return function(queuedMessages) {
        return bind210(asks2(function(v2) {
          return v2.chatServer.queuedMessages;
        }))(function(ref4) {
          return liftEffect22(write(queuedMessages)(ref4));
        });
      };
    };
  };
  var newChatServer = function __do2() {
    var v2 = liftEffect1(create3)();
    var queuedMessages = liftEffect1($$new([]))();
    var isRunning = liftEffect1($$new(false))();
    return {
      listener: v2.listener,
      emitter: v2.emitter,
      queuedMessages,
      isRunning
    };
  };

  // output/Data.FoldableWithIndex/index.js
  var foldrWithIndex = function(dict) {
    return dict.foldrWithIndex;
  };
  var traverseWithIndex_ = function(dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure34 = pure(dictApplicative);
    return function(dictFoldableWithIndex) {
      var foldrWithIndex1 = foldrWithIndex(dictFoldableWithIndex);
      return function(f) {
        return foldrWithIndex1(function(i2) {
          var $289 = f(i2);
          return function($290) {
            return applySecond2($289($290));
          };
        })(pure34(unit));
      };
    };
  };
  var forWithIndex_ = function(dictApplicative) {
    var traverseWithIndex_1 = traverseWithIndex_(dictApplicative);
    return function(dictFoldableWithIndex) {
      return flip(traverseWithIndex_1(dictFoldableWithIndex));
    };
  };
  var foldlWithIndex = function(dict) {
    return dict.foldlWithIndex;
  };
  var foldMapWithIndex = function(dict) {
    return dict.foldMapWithIndex;
  };

  // output/Data.TraversableWithIndex/index.js
  var traverseWithIndex = function(dict) {
    return dict.traverseWithIndex;
  };
  var forWithIndex = function(dictApplicative) {
    return function(dictTraversableWithIndex) {
      return flip(traverseWithIndex(dictTraversableWithIndex)(dictApplicative));
    };
  };

  // output/Data.NonEmpty/index.js
  var NonEmpty = /* @__PURE__ */ function() {
    function NonEmpty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NonEmpty2.create = function(value0) {
      return function(value1) {
        return new NonEmpty2(value0, value1);
      };
    };
    return NonEmpty2;
  }();
  var singleton3 = function(dictPlus) {
    var empty9 = empty(dictPlus);
    return function(a3) {
      return new NonEmpty(a3, empty9);
    };
  };

  // output/Data.List.Types/index.js
  var Nil = /* @__PURE__ */ function() {
    function Nil3() {
    }
    ;
    Nil3.value = new Nil3();
    return Nil3;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons3.create = function(value0) {
      return function(value1) {
        return new Cons3(value0, value1);
      };
    };
    return Cons3;
  }();
  var NonEmptyList = function(x2) {
    return x2;
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v2, v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
            $tco_var_v = new Cons(v1, v2);
            $copy_v1 = v1.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v22) {
            if (v22 instanceof Cons && (v22.value1 instanceof Cons && v22.value1.value1 instanceof Nil)) {
              return new Cons(f(v22.value0), new Cons(f(v22.value1.value0), Nil.value));
            }
            ;
            if (v22 instanceof Cons && v22.value1 instanceof Nil) {
              return new Cons(f(v22.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v2) {
            return function($copy_v3) {
              var $tco_var_v2 = $copy_v2;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v22, v3) {
                if (v22 instanceof Cons && (v22.value0 instanceof Cons && (v22.value0.value1 instanceof Cons && v22.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v2 = v22.value1;
                  $copy_v3 = new Cons(f(v22.value0.value0), new Cons(f(v22.value0.value1.value0), new Cons(f(v22.value0.value1.value1.value0), v3)));
                  return;
                }
                ;
                $tco_done1 = true;
                return v3;
              }
              ;
              while (!$tco_done1) {
                $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
              }
              ;
              return $tco_result2;
            };
          };
          $tco_done = true;
          return reverseUnrolledMap(v2)(unrolledMap(v1));
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return chunkedRevMap(Nil.value);
  };
  var functorList = {
    map: listMap
  };
  var foldableList = {
    foldr: function(f) {
      return function(b2) {
        var rev3 = function() {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v2, v1) {
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return v2;
                }
                ;
                if (v1 instanceof Cons) {
                  $tco_var_v = new Cons(v1.value0, v2);
                  $copy_v1 = v1.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v2.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(Nil.value);
        }();
        var $284 = foldl(foldableList)(flip(f))(b2);
        return function($285) {
          return $284(rev3($285));
        };
      };
    },
    foldl: function(f) {
      var go2 = function($copy_b) {
        return function($copy_v) {
          var $tco_var_b = $copy_b;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(b2, v2) {
            if (v2 instanceof Nil) {
              $tco_done1 = true;
              return b2;
            }
            ;
            if (v2 instanceof Cons) {
              $tco_var_b = f(b2)(v2.value0);
              $copy_v = v2.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v2.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_b, $copy_v);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append23 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $286 = append23(acc);
          return function($287) {
            return $286(f($287));
          };
        })(mempty4);
      };
    }
  };
  var foldl2 = /* @__PURE__ */ foldl(foldableList);
  var foldr2 = /* @__PURE__ */ foldr(foldableList);
  var semigroupList = {
    append: function(xs) {
      return function(ys) {
        return foldr2(Cons.create)(ys)(xs);
      };
    }
  };
  var append1 = /* @__PURE__ */ append(semigroupList);
  var monoidList = /* @__PURE__ */ function() {
    return {
      mempty: Nil.value,
      Semigroup0: function() {
        return semigroupList;
      }
    };
  }();
  var unfoldable1List = {
    unfoldr1: function(f) {
      return function(b2) {
        var go2 = function($copy_source) {
          return function($copy_memo) {
            var $tco_var_source = $copy_source;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(source2, memo) {
              var v2 = f(source2);
              if (v2.value1 instanceof Just) {
                $tco_var_source = v2.value1.value0;
                $copy_memo = new Cons(v2.value0, memo);
                return;
              }
              ;
              if (v2.value1 instanceof Nothing) {
                $tco_done = true;
                return foldl2(flip(Cons.create))(Nil.value)(new Cons(v2.value0, memo));
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 135, column 22 - line 137, column 61): " + [v2.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_source, $copy_memo);
            }
            ;
            return $tco_result;
          };
        };
        return go2(b2)(Nil.value);
      };
    }
  };
  var unfoldableList = {
    unfoldr: function(f) {
      return function(b2) {
        var go2 = function($copy_source) {
          return function($copy_memo) {
            var $tco_var_source = $copy_source;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(source2, memo) {
              var v2 = f(source2);
              if (v2 instanceof Nothing) {
                $tco_done = true;
                return foldl2(flip(Cons.create))(Nil.value)(memo);
              }
              ;
              if (v2 instanceof Just) {
                $tco_var_source = v2.value0.value1;
                $copy_memo = new Cons(v2.value0.value0, memo);
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 142, column 22 - line 144, column 52): " + [v2.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_source, $copy_memo);
            }
            ;
            return $tco_result;
          };
        };
        return go2(b2)(Nil.value);
      };
    },
    Unfoldable10: function() {
      return unfoldable1List;
    }
  };
  var eq1List = {
    eq1: function(dictEq) {
      var eq26 = eq(dictEq);
      return function(xs) {
        return function(ys) {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              return function($copy_v2) {
                var $tco_var_v = $copy_v;
                var $tco_var_v1 = $copy_v1;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(v2, v1, v22) {
                  if (!v22) {
                    $tco_done = true;
                    return false;
                  }
                  ;
                  if (v2 instanceof Nil && v1 instanceof Nil) {
                    $tco_done = true;
                    return v22;
                  }
                  ;
                  if (v2 instanceof Cons && v1 instanceof Cons) {
                    $tco_var_v = v2.value1;
                    $tco_var_v1 = v1.value1;
                    $copy_v2 = v22 && eq26(v1.value0)(v2.value0);
                    return;
                  }
                  ;
                  $tco_done = true;
                  return false;
                }
                ;
                while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
                }
                ;
                return $tco_result;
              };
            };
          };
          return go2(xs)(ys)(true);
        };
      };
    }
  };
  var eq12 = /* @__PURE__ */ eq1(eq1List);
  var eqList = function(dictEq) {
    return {
      eq: eq12(dictEq)
    };
  };
  var ord1List = {
    compare1: function(dictOrd) {
      var compare10 = compare(dictOrd);
      return function(xs) {
        return function(ys) {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v2, v1) {
                if (v2 instanceof Nil && v1 instanceof Nil) {
                  $tco_done = true;
                  return EQ.value;
                }
                ;
                if (v2 instanceof Nil) {
                  $tco_done = true;
                  return LT.value;
                }
                ;
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return GT.value;
                }
                ;
                if (v2 instanceof Cons && v1 instanceof Cons) {
                  var v22 = compare10(v2.value0)(v1.value0);
                  if (v22 instanceof EQ) {
                    $tco_var_v = v2.value1;
                    $copy_v1 = v1.value1;
                    return;
                  }
                  ;
                  $tco_done = true;
                  return v22;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 60, column 5 - line 60, column 20): " + [v2.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(xs)(ys);
        };
      };
    },
    Eq10: function() {
      return eq1List;
    }
  };
  var compare12 = /* @__PURE__ */ compare1(ord1List);
  var ordList = function(dictOrd) {
    var eqList1 = eqList(dictOrd.Eq0());
    return {
      compare: compare12(dictOrd),
      Eq0: function() {
        return eqList1;
      }
    };
  };
  var altList = {
    alt: append1,
    Functor0: function() {
      return functorList;
    }
  };
  var plusList = /* @__PURE__ */ function() {
    return {
      empty: Nil.value,
      Alt0: function() {
        return altList;
      }
    };
  }();

  // output/Data.List/index.js
  var singleton4 = function(a3) {
    return new Cons(a3, Nil.value);
  };
  var reverse2 = /* @__PURE__ */ function() {
    var go2 = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v2, v1) {
          if (v1 instanceof Nil) {
            $tco_done = true;
            return v2;
          }
          ;
          if (v1 instanceof Cons) {
            $tco_var_v = new Cons(v1.value0, v2);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v2.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return go2(Nil.value);
  }();
  var $$null2 = function(v2) {
    if (v2 instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var head2 = function(v2) {
    if (v2 instanceof Nil) {
      return Nothing.value;
    }
    ;
    if (v2 instanceof Cons) {
      return new Just(v2.value0);
    }
    ;
    throw new Error("Failed pattern match at Data.List (line 230, column 1 - line 230, column 22): " + [v2.constructor.name]);
  };
  var fromFoldable2 = function(dictFoldable) {
    return foldr(dictFoldable)(Cons.create)(Nil.value);
  };
  var deleteBy2 = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v22 instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v22 instanceof Cons && v2(v1)(v22.value0)) {
          return v22.value1;
        }
        ;
        if (v22 instanceof Cons) {
          return new Cons(v22.value0, deleteBy2(v2)(v1)(v22.value1));
        }
        ;
        throw new Error("Failed pattern match at Data.List (line 732, column 1 - line 732, column 67): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
      };
    };
  };
  var $$delete = function(dictEq) {
    return deleteBy2(eq(dictEq));
  };

  // output/Data.List.Lazy.Types/index.js
  var unwrap2 = /* @__PURE__ */ unwrap();
  var List = function(x2) {
    return x2;
  };
  var Nil2 = /* @__PURE__ */ function() {
    function Nil3() {
    }
    ;
    Nil3.value = new Nil3();
    return Nil3;
  }();
  var Cons2 = /* @__PURE__ */ function() {
    function Cons3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons3.create = function(value0) {
      return function(value1) {
        return new Cons3(value0, value1);
      };
    };
    return Cons3;
  }();
  var nil = /* @__PURE__ */ defer2(function(v2) {
    return Nil2.value;
  });
  var step2 = function($319) {
    return force(unwrap2($319));
  };
  var lazyList = {
    defer: function(f) {
      return defer2(function($320) {
        return step2(f($320));
      });
    }
  };
  var defer4 = /* @__PURE__ */ defer(lazyList);
  var cons2 = function(x2) {
    return function(xs) {
      return defer2(function(v2) {
        return new Cons2(x2, xs);
      });
    };
  };
  var foldableList2 = {
    foldr: function(op) {
      return function(z2) {
        return function(xs) {
          var rev3 = foldl(foldableList2)(flip(cons2))(nil);
          return foldl(foldableList2)(flip(op))(z2)(rev3(xs));
        };
      };
    },
    foldl: function(op) {
      var go2 = function($copy_b) {
        return function($copy_xs) {
          var $tco_var_b = $copy_b;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(b2, xs) {
            var v2 = step2(xs);
            if (v2 instanceof Nil2) {
              $tco_done = true;
              return b2;
            }
            ;
            if (v2 instanceof Cons2) {
              $tco_var_b = op(b2)(v2.value0);
              $copy_xs = v2.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 127, column 7 - line 129, column 40): " + [v2.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_b, $copy_xs);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append23 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList2)(function(b2) {
          return function(a3) {
            return append23(b2)(f(a3));
          };
        })(mempty4);
      };
    }
  };
  var unfoldable1List2 = {
    unfoldr1: /* @__PURE__ */ function() {
      var go2 = function(f) {
        return function(b2) {
          return defer4(function(v2) {
            var v1 = f(b2);
            if (v1.value1 instanceof Just) {
              return cons2(v1.value0)(go2(f)(v1.value1.value0));
            }
            ;
            if (v1.value1 instanceof Nothing) {
              return cons2(v1.value0)(nil);
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 151, column 28 - line 153, column 33): " + [v1.constructor.name]);
          });
        };
      };
      return go2;
    }()
  };
  var unfoldableList2 = {
    unfoldr: /* @__PURE__ */ function() {
      var go2 = function(f) {
        return function(b2) {
          return defer4(function(v2) {
            var v1 = f(b2);
            if (v1 instanceof Nothing) {
              return nil;
            }
            ;
            if (v1 instanceof Just) {
              return cons2(v1.value0.value0)(go2(f)(v1.value0.value1));
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 157, column 28 - line 159, column 39): " + [v1.constructor.name]);
          });
        };
      };
      return go2;
    }(),
    Unfoldable10: function() {
      return unfoldable1List2;
    }
  };

  // output/Data.List.Lazy/index.js
  var map14 = /* @__PURE__ */ map(functorLazy);
  var unwrap3 = /* @__PURE__ */ unwrap();
  var filter2 = function(p2) {
    var go2 = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v2) {
        if (v2 instanceof Nil2) {
          $tco_done = true;
          return Nil2.value;
        }
        ;
        if (v2 instanceof Cons2) {
          if (p2(v2.value0)) {
            $tco_done = true;
            return new Cons2(v2.value0, filter2(p2)(v2.value1));
          }
          ;
          if (otherwise) {
            $copy_v = step2(v2.value1);
            return;
          }
          ;
        }
        ;
        throw new Error("Failed pattern match at Data.List.Lazy (line 416, column 3 - line 416, column 15): " + [v2.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    var $344 = map14(go2);
    return function($345) {
      return List($344(unwrap3($345)));
    };
  };

  // output/Data.Map.Internal/index.js
  var identity10 = /* @__PURE__ */ identity(categoryFn);
  var Leaf = /* @__PURE__ */ function() {
    function Leaf2() {
    }
    ;
    Leaf2.value = new Leaf2();
    return Leaf2;
  }();
  var Two = /* @__PURE__ */ function() {
    function Two2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Two2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Two2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Two2;
  }();
  var Three = /* @__PURE__ */ function() {
    function Three2(value0, value1, value22, value32, value42, value52, value62) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
      this.value6 = value62;
    }
    ;
    Three2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return function(value62) {
                  return new Three2(value0, value1, value22, value32, value42, value52, value62);
                };
              };
            };
          };
        };
      };
    };
    return Three2;
  }();
  var TwoLeft = /* @__PURE__ */ function() {
    function TwoLeft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoLeft2(value0, value1, value22);
        };
      };
    };
    return TwoLeft2;
  }();
  var TwoRight = /* @__PURE__ */ function() {
    function TwoRight2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoRight2(value0, value1, value22);
        };
      };
    };
    return TwoRight2;
  }();
  var ThreeLeft = /* @__PURE__ */ function() {
    function ThreeLeft2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeLeft2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeLeft2;
  }();
  var ThreeMiddle = /* @__PURE__ */ function() {
    function ThreeMiddle2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeMiddle2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeMiddle2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeMiddle2;
  }();
  var ThreeRight = /* @__PURE__ */ function() {
    function ThreeRight2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeRight2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeRight2;
  }();
  var KickUp = /* @__PURE__ */ function() {
    function KickUp2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    KickUp2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new KickUp2(value0, value1, value22, value32);
          };
        };
      };
    };
    return KickUp2;
  }();
  var singleton5 = function(k) {
    return function(v2) {
      return new Two(Leaf.value, k, v2, Leaf.value);
    };
  };
  var toUnfoldable2 = function(dictUnfoldable) {
    var unfoldr4 = unfoldr(dictUnfoldable);
    return function(m2) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v2) {
          if (v2 instanceof Nil) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v2 instanceof Cons) {
            if (v2.value0 instanceof Leaf) {
              $copy_v = v2.value1;
              return;
            }
            ;
            if (v2.value0 instanceof Two && (v2.value0.value0 instanceof Leaf && v2.value0.value3 instanceof Leaf)) {
              $tco_done = true;
              return new Just(new Tuple(new Tuple(v2.value0.value1, v2.value0.value2), v2.value1));
            }
            ;
            if (v2.value0 instanceof Two && v2.value0.value0 instanceof Leaf) {
              $tco_done = true;
              return new Just(new Tuple(new Tuple(v2.value0.value1, v2.value0.value2), new Cons(v2.value0.value3, v2.value1)));
            }
            ;
            if (v2.value0 instanceof Two) {
              $copy_v = new Cons(v2.value0.value0, new Cons(singleton5(v2.value0.value1)(v2.value0.value2), new Cons(v2.value0.value3, v2.value1)));
              return;
            }
            ;
            if (v2.value0 instanceof Three) {
              $copy_v = new Cons(v2.value0.value0, new Cons(singleton5(v2.value0.value1)(v2.value0.value2), new Cons(v2.value0.value3, new Cons(singleton5(v2.value0.value4)(v2.value0.value5), new Cons(v2.value0.value6, v2.value1)))));
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 624, column 18 - line 633, column 71): " + [v2.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 623, column 3 - line 623, column 19): " + [v2.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return unfoldr4(go2)(new Cons(m2, Nil.value));
    };
  };
  var toUnfoldable1 = /* @__PURE__ */ toUnfoldable2(unfoldableList2);
  var toAscArray = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var showMap = function(dictShow) {
    var showTuple2 = showTuple(dictShow);
    return function(dictShow1) {
      var show29 = show(showArray(showTuple2(dictShow1)));
      return {
        show: function(m2) {
          return "(fromFoldable " + (show29(toAscArray(m2)) + ")");
        }
      };
    };
  };
  var lookup = function(dictOrd) {
    var compare10 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v2) {
          if (v2 instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v2 instanceof Two) {
            var v22 = compare10(k)(v2.value1);
            if (v22 instanceof EQ) {
              $tco_done = true;
              return new Just(v2.value2);
            }
            ;
            if (v22 instanceof LT) {
              $copy_v = v2.value0;
              return;
            }
            ;
            $copy_v = v2.value3;
            return;
          }
          ;
          if (v2 instanceof Three) {
            var v3 = compare10(k)(v2.value1);
            if (v3 instanceof EQ) {
              $tco_done = true;
              return new Just(v2.value2);
            }
            ;
            var v4 = compare10(k)(v2.value4);
            if (v4 instanceof EQ) {
              $tco_done = true;
              return new Just(v2.value5);
            }
            ;
            if (v3 instanceof LT) {
              $copy_v = v2.value0;
              return;
            }
            ;
            if (v4 instanceof GT) {
              $copy_v = v2.value6;
              return;
            }
            ;
            $copy_v = v2.value3;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v2.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go2;
    };
  };
  var member = function(dictOrd) {
    var lookup111 = lookup(dictOrd);
    return function(k) {
      return function(m2) {
        return isJust(lookup111(k)(m2));
      };
    };
  };
  var isEmpty = function(v2) {
    if (v2 instanceof Leaf) {
      return true;
    }
    ;
    return false;
  };
  var functorMap = {
    map: function(v2) {
      return function(v1) {
        if (v1 instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v1 instanceof Two) {
          return new Two(map(functorMap)(v2)(v1.value0), v1.value1, v2(v1.value2), map(functorMap)(v2)(v1.value3));
        }
        ;
        if (v1 instanceof Three) {
          return new Three(map(functorMap)(v2)(v1.value0), v1.value1, v2(v1.value2), map(functorMap)(v2)(v1.value3), v1.value4, v2(v1.value5), map(functorMap)(v2)(v1.value6));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 116, column 1 - line 119, column 110): " + [v2.constructor.name, v1.constructor.name]);
      };
    }
  };
  var functorWithIndexMap = {
    mapWithIndex: function(v2) {
      return function(v1) {
        if (v1 instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v1 instanceof Two) {
          return new Two(mapWithIndex(functorWithIndexMap)(v2)(v1.value0), v1.value1, v2(v1.value1)(v1.value2), mapWithIndex(functorWithIndexMap)(v2)(v1.value3));
        }
        ;
        if (v1 instanceof Three) {
          return new Three(mapWithIndex(functorWithIndexMap)(v2)(v1.value0), v1.value1, v2(v1.value1)(v1.value2), mapWithIndex(functorWithIndexMap)(v2)(v1.value3), v1.value4, v2(v1.value4)(v1.value5), mapWithIndex(functorWithIndexMap)(v2)(v1.value6));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 121, column 1 - line 124, column 152): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMap;
    }
  };
  var fromZipper = function($copy_dictOrd) {
    return function($copy_v) {
      return function($copy_v1) {
        var $tco_var_dictOrd = $copy_dictOrd;
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(dictOrd, v2, v1) {
          if (v2 instanceof Nil) {
            $tco_done = true;
            return v1;
          }
          ;
          if (v2 instanceof Cons) {
            if (v2.value0 instanceof TwoLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v2.value1;
              $copy_v1 = new Two(v1, v2.value0.value0, v2.value0.value1, v2.value0.value2);
              return;
            }
            ;
            if (v2.value0 instanceof TwoRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v2.value1;
              $copy_v1 = new Two(v2.value0.value0, v2.value0.value1, v2.value0.value2, v1);
              return;
            }
            ;
            if (v2.value0 instanceof ThreeLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v2.value1;
              $copy_v1 = new Three(v1, v2.value0.value0, v2.value0.value1, v2.value0.value2, v2.value0.value3, v2.value0.value4, v2.value0.value5);
              return;
            }
            ;
            if (v2.value0 instanceof ThreeMiddle) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v2.value1;
              $copy_v1 = new Three(v2.value0.value0, v2.value0.value1, v2.value0.value2, v1, v2.value0.value3, v2.value0.value4, v2.value0.value5);
              return;
            }
            ;
            if (v2.value0 instanceof ThreeRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v2.value1;
              $copy_v1 = new Three(v2.value0.value0, v2.value0.value1, v2.value0.value2, v2.value0.value3, v2.value0.value4, v2.value0.value5, v1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v2.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v2.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
  };
  var insert = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare10 = compare(dictOrd);
    return function(k) {
      return function(v2) {
        var up = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v1, v22) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return new Two(v22.value0, v22.value1, v22.value2, v22.value3);
              }
              ;
              if (v1 instanceof Cons) {
                if (v1.value0 instanceof TwoLeft) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v22.value0, v22.value1, v22.value2, v22.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                }
                ;
                if (v1.value0 instanceof TwoRight) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v22.value0, v22.value1, v22.value2, v22.value3));
                }
                ;
                if (v1.value0 instanceof ThreeLeft) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v22.value0, v22.value1, v22.value2, v22.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeMiddle) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v22.value0), v22.value1, v22.value2, new Two(v22.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeRight) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v22.value0, v22.value1, v22.value2, v22.value3));
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v22.constructor.name]);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v22.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        var down = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(v1, v22) {
              if (v22 instanceof Leaf) {
                $tco_done1 = true;
                return up(v1)(new KickUp(Leaf.value, k, v2, Leaf.value));
              }
              ;
              if (v22 instanceof Two) {
                var v3 = compare10(k)(v22.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Two(v22.value0, k, v2, v22.value3));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new TwoLeft(v22.value1, v22.value2, v22.value3), v1);
                  $copy_v2 = v22.value0;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new TwoRight(v22.value0, v22.value1, v22.value2), v1);
                $copy_v2 = v22.value3;
                return;
              }
              ;
              if (v22 instanceof Three) {
                var v3 = compare10(k)(v22.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v22.value0, k, v2, v22.value3, v22.value4, v22.value5, v22.value6));
                }
                ;
                var v4 = compare10(k)(v22.value4);
                if (v4 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v22.value0, v22.value1, v22.value2, v22.value3, k, v2, v22.value6));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeLeft(v22.value1, v22.value2, v22.value3, v22.value4, v22.value5, v22.value6), v1);
                  $copy_v2 = v22.value0;
                  return;
                }
                ;
                if (v3 instanceof GT && v4 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeMiddle(v22.value0, v22.value1, v22.value2, v22.value4, v22.value5, v22.value6), v1);
                  $copy_v2 = v22.value3;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new ThreeRight(v22.value0, v22.value1, v22.value2, v22.value3, v22.value4, v22.value5), v1);
                $copy_v2 = v22.value6;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v22.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        return down(Nil.value);
      };
    };
  };
  var pop = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare10 = compare(dictOrd);
    return function(k) {
      var up = function($copy_ctxs) {
        return function($copy_tree) {
          var $tco_var_ctxs = $copy_ctxs;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(ctxs, tree) {
            if (ctxs instanceof Nil) {
              $tco_done = true;
              return tree;
            }
            ;
            if (ctxs instanceof Cons) {
              if (ctxs.value0 instanceof TwoLeft && (ctxs.value0.value2 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && (ctxs.value0.value0 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && (ctxs.value0.value2 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value3 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value4, ctxs.value0.value5, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              $tco_done = true;
              return unsafeCrashWith("The impossible happened in partial function `up`.");
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 552, column 5 - line 573, column 86): " + [ctxs.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_ctxs, $copy_tree);
          }
          ;
          return $tco_result;
        };
      };
      var removeMaxNode = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(ctx, m2) {
            if (m2 instanceof Two && (m2.value0 instanceof Leaf && m2.value3 instanceof Leaf)) {
              $tco_done1 = true;
              return up(ctx)(Leaf.value);
            }
            ;
            if (m2 instanceof Two) {
              $tco_var_ctx = new Cons(new TwoRight(m2.value0, m2.value1, m2.value2), ctx);
              $copy_m = m2.value3;
              return;
            }
            ;
            if (m2 instanceof Three && (m2.value0 instanceof Leaf && (m2.value3 instanceof Leaf && m2.value6 instanceof Leaf))) {
              $tco_done1 = true;
              return up(new Cons(new TwoRight(Leaf.value, m2.value1, m2.value2), ctx))(Leaf.value);
            }
            ;
            if (m2 instanceof Three) {
              $tco_var_ctx = new Cons(new ThreeRight(m2.value0, m2.value1, m2.value2, m2.value3, m2.value4, m2.value5), ctx);
              $copy_m = m2.value6;
              return;
            }
            ;
            $tco_done1 = true;
            return unsafeCrashWith("The impossible happened in partial function `removeMaxNode`.");
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      var maxNode = function($copy_m) {
        var $tco_done2 = false;
        var $tco_result;
        function $tco_loop(m2) {
          if (m2 instanceof Two && m2.value3 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m2.value1,
              value: m2.value2
            };
          }
          ;
          if (m2 instanceof Two) {
            $copy_m = m2.value3;
            return;
          }
          ;
          if (m2 instanceof Three && m2.value6 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m2.value4,
              value: m2.value5
            };
          }
          ;
          if (m2 instanceof Three) {
            $copy_m = m2.value6;
            return;
          }
          ;
          $tco_done2 = true;
          return unsafeCrashWith("The impossible happened in partial function `maxNode`.");
        }
        ;
        while (!$tco_done2) {
          $tco_result = $tco_loop($copy_m);
        }
        ;
        return $tco_result;
      };
      var down = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done3 = false;
          var $tco_result;
          function $tco_loop(ctx, m2) {
            if (m2 instanceof Leaf) {
              $tco_done3 = true;
              return Nothing.value;
            }
            ;
            if (m2 instanceof Two) {
              var v2 = compare10(k)(m2.value1);
              if (m2.value3 instanceof Leaf && v2 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m2.value2, up(ctx)(Leaf.value)));
              }
              ;
              if (v2 instanceof EQ) {
                var max6 = maxNode(m2.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m2.value2, removeMaxNode(new Cons(new TwoLeft(max6.key, max6.value, m2.value3), ctx))(m2.value0)));
              }
              ;
              if (v2 instanceof LT) {
                $tco_var_ctx = new Cons(new TwoLeft(m2.value1, m2.value2, m2.value3), ctx);
                $copy_m = m2.value0;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new TwoRight(m2.value0, m2.value1, m2.value2), ctx);
              $copy_m = m2.value3;
              return;
            }
            ;
            if (m2 instanceof Three) {
              var leaves = function() {
                if (m2.value0 instanceof Leaf && (m2.value3 instanceof Leaf && m2.value6 instanceof Leaf)) {
                  return true;
                }
                ;
                return false;
              }();
              var v2 = compare10(k)(m2.value4);
              var v3 = compare10(k)(m2.value1);
              if (leaves && v3 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m2.value2, fromZipper1(ctx)(new Two(Leaf.value, m2.value4, m2.value5, Leaf.value))));
              }
              ;
              if (leaves && v2 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m2.value5, fromZipper1(ctx)(new Two(Leaf.value, m2.value1, m2.value2, Leaf.value))));
              }
              ;
              if (v3 instanceof EQ) {
                var max6 = maxNode(m2.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m2.value2, removeMaxNode(new Cons(new ThreeLeft(max6.key, max6.value, m2.value3, m2.value4, m2.value5, m2.value6), ctx))(m2.value0)));
              }
              ;
              if (v2 instanceof EQ) {
                var max6 = maxNode(m2.value3);
                $tco_done3 = true;
                return new Just(new Tuple(m2.value5, removeMaxNode(new Cons(new ThreeMiddle(m2.value0, m2.value1, m2.value2, max6.key, max6.value, m2.value6), ctx))(m2.value3)));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeLeft(m2.value1, m2.value2, m2.value3, m2.value4, m2.value5, m2.value6), ctx);
                $copy_m = m2.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v2 instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeMiddle(m2.value0, m2.value1, m2.value2, m2.value4, m2.value5, m2.value6), ctx);
                $copy_m = m2.value3;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new ThreeRight(m2.value0, m2.value1, m2.value2, m2.value3, m2.value4, m2.value5), ctx);
              $copy_m = m2.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 525, column 16 - line 548, column 80): " + [m2.constructor.name]);
          }
          ;
          while (!$tco_done3) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value);
    };
  };
  var foldableMap = {
    foldr: function(f) {
      return function(z2) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return z2;
          }
          ;
          if (m2 instanceof Two) {
            return foldr(foldableMap)(f)(f(m2.value2)(foldr(foldableMap)(f)(z2)(m2.value3)))(m2.value0);
          }
          ;
          if (m2 instanceof Three) {
            return foldr(foldableMap)(f)(f(m2.value2)(foldr(foldableMap)(f)(f(m2.value5)(foldr(foldableMap)(f)(z2)(m2.value6)))(m2.value3)))(m2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 133, column 17 - line 136, column 85): " + [m2.constructor.name]);
        };
      };
    },
    foldl: function(f) {
      return function(z2) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return z2;
          }
          ;
          if (m2 instanceof Two) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z2)(m2.value0))(m2.value2))(m2.value3);
          }
          ;
          if (m2 instanceof Three) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z2)(m2.value0))(m2.value2))(m2.value3))(m2.value5))(m2.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 137, column 17 - line 140, column 85): " + [m2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      var append23 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return mempty4;
          }
          ;
          if (m2 instanceof Two) {
            return append23(foldMap(foldableMap)(dictMonoid)(f)(m2.value0))(append23(f(m2.value2))(foldMap(foldableMap)(dictMonoid)(f)(m2.value3)));
          }
          ;
          if (m2 instanceof Three) {
            return append23(foldMap(foldableMap)(dictMonoid)(f)(m2.value0))(append23(f(m2.value2))(append23(foldMap(foldableMap)(dictMonoid)(f)(m2.value3))(append23(f(m2.value5))(foldMap(foldableMap)(dictMonoid)(f)(m2.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 141, column 17 - line 144, column 93): " + [m2.constructor.name]);
        };
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: function(f) {
      return function(z2) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return z2;
          }
          ;
          if (m2 instanceof Two) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m2.value1)(m2.value2)(foldrWithIndex(foldableWithIndexMap)(f)(z2)(m2.value3)))(m2.value0);
          }
          ;
          if (m2 instanceof Three) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m2.value1)(m2.value2)(foldrWithIndex(foldableWithIndexMap)(f)(f(m2.value4)(m2.value5)(foldrWithIndex(foldableWithIndexMap)(f)(z2)(m2.value6)))(m2.value3)))(m2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 147, column 26 - line 150, column 120): " + [m2.constructor.name]);
        };
      };
    },
    foldlWithIndex: function(f) {
      return function(z2) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return z2;
          }
          ;
          if (m2 instanceof Two) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m2.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z2)(m2.value0))(m2.value2))(m2.value3);
          }
          ;
          if (m2 instanceof Three) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m2.value4)(foldlWithIndex(foldableWithIndexMap)(f)(f(m2.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z2)(m2.value0))(m2.value2))(m2.value3))(m2.value5))(m2.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 151, column 26 - line 154, column 120): " + [m2.constructor.name]);
        };
      };
    },
    foldMapWithIndex: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      var append23 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m2) {
          if (m2 instanceof Leaf) {
            return mempty4;
          }
          ;
          if (m2 instanceof Two) {
            return append23(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m2.value0))(append23(f(m2.value1)(m2.value2))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m2.value3)));
          }
          ;
          if (m2 instanceof Three) {
            return append23(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m2.value0))(append23(f(m2.value1)(m2.value2))(append23(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m2.value3))(append23(f(m2.value4)(m2.value5))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m2.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 155, column 26 - line 158, column 128): " + [m2.constructor.name]);
        };
      };
    },
    Foldable0: function() {
      return foldableMap;
    }
  };
  var foldrWithIndex2 = /* @__PURE__ */ foldrWithIndex(foldableWithIndexMap);
  var foldlWithIndex2 = /* @__PURE__ */ foldlWithIndex(foldableWithIndexMap);
  var keys = /* @__PURE__ */ function() {
    return foldrWithIndex2(function(k) {
      return function(v2) {
        return function(acc) {
          return new Cons(k, acc);
        };
      };
    })(Nil.value);
  }();
  var traversableMap = {
    traverse: function(dictApplicative) {
      var pure114 = pure(dictApplicative);
      var Apply0 = dictApplicative.Apply0();
      var apply7 = apply(Apply0);
      var map126 = map(Apply0.Functor0());
      return function(v2) {
        return function(v1) {
          if (v1 instanceof Leaf) {
            return pure114(Leaf.value);
          }
          ;
          if (v1 instanceof Two) {
            return apply7(apply7(apply7(map126(Two.create)(traverse(traversableMap)(dictApplicative)(v2)(v1.value0)))(pure114(v1.value1)))(v2(v1.value2)))(traverse(traversableMap)(dictApplicative)(v2)(v1.value3));
          }
          ;
          if (v1 instanceof Three) {
            return apply7(apply7(apply7(apply7(apply7(apply7(map126(Three.create)(traverse(traversableMap)(dictApplicative)(v2)(v1.value0)))(pure114(v1.value1)))(v2(v1.value2)))(traverse(traversableMap)(dictApplicative)(v2)(v1.value3)))(pure114(v1.value4)))(v2(v1.value5)))(traverse(traversableMap)(dictApplicative)(v2)(v1.value6));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 160, column 1 - line 175, column 31): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    },
    sequence: function(dictApplicative) {
      return traverse(traversableMap)(dictApplicative)(identity10);
    },
    Functor0: function() {
      return functorMap;
    },
    Foldable1: function() {
      return foldableMap;
    }
  };
  var traversableWithIndexMap = {
    traverseWithIndex: function(dictApplicative) {
      var pure114 = pure(dictApplicative);
      var Apply0 = dictApplicative.Apply0();
      var apply7 = apply(Apply0);
      var map126 = map(Apply0.Functor0());
      return function(v2) {
        return function(v1) {
          if (v1 instanceof Leaf) {
            return pure114(Leaf.value);
          }
          ;
          if (v1 instanceof Two) {
            return apply7(apply7(apply7(map126(Two.create)(traverseWithIndex(traversableWithIndexMap)(dictApplicative)(v2)(v1.value0)))(pure114(v1.value1)))(v2(v1.value1)(v1.value2)))(traverseWithIndex(traversableWithIndexMap)(dictApplicative)(v2)(v1.value3));
          }
          ;
          if (v1 instanceof Three) {
            return apply7(apply7(apply7(apply7(apply7(apply7(map126(Three.create)(traverseWithIndex(traversableWithIndexMap)(dictApplicative)(v2)(v1.value0)))(pure114(v1.value1)))(v2(v1.value1)(v1.value2)))(traverseWithIndex(traversableWithIndexMap)(dictApplicative)(v2)(v1.value3)))(pure114(v1.value4)))(v2(v1.value4)(v1.value5)))(traverseWithIndex(traversableWithIndexMap)(dictApplicative)(v2)(v1.value6));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 177, column 1 - line 191, column 40): " + [v2.constructor.name, v1.constructor.name]);
        };
      };
    },
    FunctorWithIndex0: function() {
      return functorWithIndexMap;
    },
    FoldableWithIndex1: function() {
      return foldableWithIndexMap;
    },
    Traversable2: function() {
      return traversableMap;
    }
  };
  var foldSubmapBy = function(dictOrd) {
    var lessThan2 = lessThan(dictOrd);
    var greaterThan2 = greaterThan(dictOrd);
    var lessThanOrEq2 = lessThanOrEq(dictOrd);
    return function(appendFn) {
      return function(memptyValue) {
        return function(kmin) {
          return function(kmax) {
            return function(f) {
              var tooSmall = function() {
                if (kmin instanceof Just) {
                  return function(k) {
                    return lessThan2(k)(kmin.value0);
                  };
                }
                ;
                if (kmin instanceof Nothing) {
                  return $$const(false);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 363, column 7 - line 367, column 22): " + [kmin.constructor.name]);
              }();
              var tooLarge = function() {
                if (kmax instanceof Just) {
                  return function(k) {
                    return greaterThan2(k)(kmax.value0);
                  };
                }
                ;
                if (kmax instanceof Nothing) {
                  return $$const(false);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 370, column 7 - line 374, column 22): " + [kmax.constructor.name]);
              }();
              var inBounds = function() {
                if (kmin instanceof Just && kmax instanceof Just) {
                  return function(k) {
                    return lessThanOrEq2(kmin.value0)(k) && lessThanOrEq2(k)(kmax.value0);
                  };
                }
                ;
                if (kmin instanceof Just && kmax instanceof Nothing) {
                  return function(k) {
                    return lessThanOrEq2(kmin.value0)(k);
                  };
                }
                ;
                if (kmin instanceof Nothing && kmax instanceof Just) {
                  return function(k) {
                    return lessThanOrEq2(k)(kmax.value0);
                  };
                }
                ;
                if (kmin instanceof Nothing && kmax instanceof Nothing) {
                  return $$const(true);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 377, column 7 - line 385, column 21): " + [kmin.constructor.name, kmax.constructor.name]);
              }();
              var go2 = function(v2) {
                if (v2 instanceof Leaf) {
                  return memptyValue;
                }
                ;
                if (v2 instanceof Two) {
                  return appendFn(appendFn(function() {
                    var $819 = tooSmall(v2.value1);
                    if ($819) {
                      return memptyValue;
                    }
                    ;
                    return go2(v2.value0);
                  }())(function() {
                    var $820 = inBounds(v2.value1);
                    if ($820) {
                      return f(v2.value1)(v2.value2);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $821 = tooLarge(v2.value1);
                    if ($821) {
                      return memptyValue;
                    }
                    ;
                    return go2(v2.value3);
                  }());
                }
                ;
                if (v2 instanceof Three) {
                  return appendFn(appendFn(appendFn(appendFn(function() {
                    var $826 = tooSmall(v2.value1);
                    if ($826) {
                      return memptyValue;
                    }
                    ;
                    return go2(v2.value0);
                  }())(function() {
                    var $827 = inBounds(v2.value1);
                    if ($827) {
                      return f(v2.value1)(v2.value2);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $828 = tooSmall(v2.value4) || tooLarge(v2.value1);
                    if ($828) {
                      return memptyValue;
                    }
                    ;
                    return go2(v2.value3);
                  }()))(function() {
                    var $829 = inBounds(v2.value4);
                    if ($829) {
                      return f(v2.value4)(v2.value5);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $830 = tooLarge(v2.value4);
                    if ($830) {
                      return memptyValue;
                    }
                    ;
                    return go2(v2.value6);
                  }());
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 403, column 10 - line 415, column 67): " + [v2.constructor.name]);
              };
              return go2;
            };
          };
        };
      };
    };
  };
  var eqMap = function(dictEq) {
    var eqTuple2 = eqTuple(dictEq);
    return function(dictEq1) {
      var eq110 = eq(eqArray(eqTuple2(dictEq1)));
      return {
        eq: function(m1) {
          return function(m2) {
            return eq110(toAscArray(m1))(toAscArray(m2));
          };
        }
      };
    };
  };
  var ordMap = function(dictOrd) {
    var ordTuple3 = ordTuple(dictOrd);
    var eqMap1 = eqMap(dictOrd.Eq0());
    return function(dictOrd1) {
      var compare10 = compare(ordArray(ordTuple3(dictOrd1)));
      var eqMap2 = eqMap1(dictOrd1.Eq0());
      return {
        compare: function(m1) {
          return function(m2) {
            return compare10(toAscArray(m1))(toAscArray(m2));
          };
        },
        Eq0: function() {
          return eqMap2;
        }
      };
    };
  };
  var empty2 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var fromFoldable3 = function(dictOrd) {
    var insert14 = insert(dictOrd);
    return function(dictFoldable) {
      return foldl(dictFoldable)(function(m2) {
        return function(v2) {
          return insert14(v2.value0)(v2.value1)(m2);
        };
      })(empty2);
    };
  };
  var filterWithKey = function(dictOrd) {
    var fromFoldable18 = fromFoldable3(dictOrd)(foldableList2);
    return function(predicate) {
      var $927 = filter2(uncurry(predicate));
      return function($928) {
        return fromFoldable18($927(toUnfoldable1($928)));
      };
    };
  };
  var filter3 = function(dictOrd) {
    var filterWithKey1 = filterWithKey(dictOrd);
    return function(predicate) {
      return filterWithKey1($$const(predicate));
    };
  };
  var filterKeys = function(dictOrd) {
    var filterWithKey1 = filterWithKey(dictOrd);
    return function(predicate) {
      return filterWithKey1(function($929) {
        return $$const(predicate($929));
      });
    };
  };
  var mapMaybeWithKey = function(dictOrd) {
    var insert14 = insert(dictOrd);
    return function(f) {
      return foldrWithIndex2(function(k) {
        return function(a3) {
          return function(acc) {
            return maybe(acc)(function(b2) {
              return insert14(k)(b2)(acc);
            })(f(k)(a3));
          };
        };
      })(empty2);
    };
  };
  var mapMaybe2 = function(dictOrd) {
    var $930 = mapMaybeWithKey(dictOrd);
    return function($931) {
      return $930($$const($931));
    };
  };
  var $$delete2 = function(dictOrd) {
    var pop12 = pop(dictOrd);
    return function(k) {
      return function(m2) {
        return maybe(m2)(snd)(pop12(k)(m2));
      };
    };
  };
  var catMaybes = function(dictOrd) {
    return mapMaybe2(dictOrd)(identity10);
  };
  var alter = function(dictOrd) {
    var lookup111 = lookup(dictOrd);
    var delete1 = $$delete2(dictOrd);
    var insert14 = insert(dictOrd);
    return function(f) {
      return function(k) {
        return function(m2) {
          var v2 = f(lookup111(k)(m2));
          if (v2 instanceof Nothing) {
            return delete1(k)(m2);
          }
          ;
          if (v2 instanceof Just) {
            return insert14(k)(v2.value0)(m2);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 596, column 15 - line 598, column 25): " + [v2.constructor.name]);
        };
      };
    };
  };
  var insertWith = function(dictOrd) {
    var alter1 = alter(dictOrd);
    return function(f) {
      return function(k) {
        return function(v2) {
          return alter1(function() {
            var $934 = maybe(v2)(flip(f)(v2));
            return function($935) {
              return Just.create($934($935));
            };
          }())(k);
        };
      };
    };
  };
  var unionWith = function(dictOrd) {
    var alter1 = alter(dictOrd);
    return function(f) {
      return function(m1) {
        return function(m2) {
          var go2 = function(k) {
            return function(m3) {
              return function(v2) {
                return alter1(function() {
                  var $936 = maybe(v2)(f(v2));
                  return function($937) {
                    return Just.create($936($937));
                  };
                }())(k)(m3);
              };
            };
          };
          return foldlWithIndex2(go2)(m2)(m1);
        };
      };
    };
  };
  var union = function(dictOrd) {
    return unionWith(dictOrd)($$const);
  };
  var submap = function(dictOrd) {
    var foldSubmapBy1 = foldSubmapBy(dictOrd);
    var union1 = union(dictOrd);
    return function(kmin) {
      return function(kmax) {
        return foldSubmapBy1(union1)(empty2)(kmin)(kmax)(singleton5);
      };
    };
  };
  var update = function(dictOrd) {
    var alter1 = alter(dictOrd);
    return function(f) {
      return function(k) {
        return function(m2) {
          return alter1(maybe(Nothing.value)(f))(k)(m2);
        };
      };
    };
  };

  // output/Data.Predicate/index.js
  var heytingAlgebraPredicate = /* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean);

  // output/Game.Rotation/index.js
  var show2 = /* @__PURE__ */ show(showInt);
  var compare3 = /* @__PURE__ */ compare(ordInt);
  var mod3 = /* @__PURE__ */ mod(euclideanRingInt);
  var Rotation = function(x2) {
    return x2;
  };
  var showRotation = {
    show: function(v2) {
      return "Rotation " + (show2(v2 * 90 | 0) + "\xB0");
    }
  };
  var eqRotation = {
    eq: function(x2) {
      return function(y2) {
        return x2 === y2;
      };
    }
  };
  var ordRotation = {
    compare: function(x2) {
      return function(y2) {
        return compare3(x2)(y2);
      };
    },
    Eq0: function() {
      return eqRotation;
    }
  };
  var rotation = function(n) {
    return mod3(n)(4);
  };
  var boundedRotation = {
    bottom: /* @__PURE__ */ rotation(0),
    top: /* @__PURE__ */ rotation(3),
    Ord0: function() {
      return ordRotation;
    }
  };
  var enumRotation = {
    succ: function(v2) {
      if (v2 === 3) {
        return Nothing.value;
      }
      ;
      return new Just(rotation(v2 + 1 | 0));
    },
    pred: function(v2) {
      if (v2 === 0) {
        return Nothing.value;
      }
      ;
      return new Just(rotation(v2 - 1 | 0));
    },
    Ord0: function() {
      return ordRotation;
    }
  };
  var boundedEnumRotation = {
    cardinality: 4,
    fromEnum: function(v2) {
      return v2;
    },
    toEnum: function($46) {
      return Just.create(Rotation($46));
    },
    Bounded0: function() {
      return boundedRotation;
    },
    Enum1: function() {
      return enumRotation;
    }
  };
  var semigroupRotation = {
    append: function(v2) {
      return function(v1) {
        return rotation(v2 + v1 | 0);
      };
    }
  };
  var monoidRotation = {
    mempty: /* @__PURE__ */ rotation(0),
    Semigroup0: function() {
      return semigroupRotation;
    }
  };
  var groupRotation = {
    ginverse: function(v2) {
      return rotation(-v2 | 0);
    },
    Monoid0: function() {
      return monoidRotation;
    }
  };

  // output/Game.Direction/index.js
  var mod4 = /* @__PURE__ */ mod(euclideanRingInt);
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumRotation);
  var Up = /* @__PURE__ */ function() {
    function Up2() {
    }
    ;
    Up2.value = new Up2();
    return Up2;
  }();
  var Right2 = /* @__PURE__ */ function() {
    function Right3() {
    }
    ;
    Right3.value = new Right3();
    return Right3;
  }();
  var Down = /* @__PURE__ */ function() {
    function Down2() {
    }
    ;
    Down2.value = new Down2();
    return Down2;
  }();
  var Left2 = /* @__PURE__ */ function() {
    function Left3() {
    }
    ;
    Left3.value = new Left3();
    return Left3;
  }();
  var showCardinalDirection = {
    show: function(v2) {
      if (v2 instanceof Up) {
        return "Up";
      }
      ;
      if (v2 instanceof Right2) {
        return "Right";
      }
      ;
      if (v2 instanceof Down) {
        return "Down";
      }
      ;
      if (v2 instanceof Left2) {
        return "Left";
      }
      ;
      throw new Error("Failed pattern match at Game.Direction (line 14, column 10 - line 18, column 20): " + [v2.constructor.name]);
    }
  };
  var eqCardinalDirection = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof Up && y2 instanceof Up) {
          return true;
        }
        ;
        if (x2 instanceof Right2 && y2 instanceof Right2) {
          return true;
        }
        ;
        if (x2 instanceof Down && y2 instanceof Down) {
          return true;
        }
        ;
        if (x2 instanceof Left2 && y2 instanceof Left2) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var ordCardinalDirection = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof Up && y2 instanceof Up) {
          return EQ.value;
        }
        ;
        if (x2 instanceof Up) {
          return LT.value;
        }
        ;
        if (y2 instanceof Up) {
          return GT.value;
        }
        ;
        if (x2 instanceof Right2 && y2 instanceof Right2) {
          return EQ.value;
        }
        ;
        if (x2 instanceof Right2) {
          return LT.value;
        }
        ;
        if (y2 instanceof Right2) {
          return GT.value;
        }
        ;
        if (x2 instanceof Down && y2 instanceof Down) {
          return EQ.value;
        }
        ;
        if (x2 instanceof Down) {
          return LT.value;
        }
        ;
        if (y2 instanceof Down) {
          return GT.value;
        }
        ;
        if (x2 instanceof Left2 && y2 instanceof Left2) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Game.Direction (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqCardinalDirection;
    }
  };
  var enumCardinalDirection = {
    succ: function(v2) {
      if (v2 instanceof Up) {
        return new Just(Right2.value);
      }
      ;
      if (v2 instanceof Right2) {
        return new Just(Down.value);
      }
      ;
      if (v2 instanceof Down) {
        return new Just(Left2.value);
      }
      ;
      if (v2 instanceof Left2) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Game.Direction (line 21, column 10 - line 25, column 20): " + [v2.constructor.name]);
    },
    pred: function(v2) {
      if (v2 instanceof Up) {
        return Nothing.value;
      }
      ;
      if (v2 instanceof Right2) {
        return new Just(Up.value);
      }
      ;
      if (v2 instanceof Down) {
        return new Just(Right2.value);
      }
      ;
      if (v2 instanceof Left2) {
        return new Just(Down.value);
      }
      ;
      throw new Error("Failed pattern match at Game.Direction (line 26, column 10 - line 30, column 22): " + [v2.constructor.name]);
    },
    Ord0: function() {
      return ordCardinalDirection;
    }
  };
  var boundedCardinalDirection = /* @__PURE__ */ function() {
    return {
      bottom: Up.value,
      top: Left2.value,
      Ord0: function() {
        return ordCardinalDirection;
      }
    };
  }();
  var boundedEnumCardinalDirect = {
    cardinality: 4,
    fromEnum: function(v2) {
      if (v2 instanceof Up) {
        return 0;
      }
      ;
      if (v2 instanceof Right2) {
        return 1;
      }
      ;
      if (v2 instanceof Down) {
        return 2;
      }
      ;
      if (v2 instanceof Left2) {
        return 3;
      }
      ;
      throw new Error("Failed pattern match at Game.Direction (line 38, column 14 - line 42, column 14): " + [v2.constructor.name]);
    },
    toEnum: function(v2) {
      if (v2 === 0) {
        return new Just(Up.value);
      }
      ;
      if (v2 === 1) {
        return new Just(Right2.value);
      }
      ;
      if (v2 === 2) {
        return new Just(Down.value);
      }
      ;
      if (v2 === 3) {
        return new Just(Left2.value);
      }
      ;
      return Nothing.value;
    },
    Bounded0: function() {
      return boundedCardinalDirection;
    },
    Enum1: function() {
      return enumCardinalDirection;
    }
  };
  var toEnum2 = /* @__PURE__ */ toEnum(boundedEnumCardinalDirect);
  var fromEnum1 = /* @__PURE__ */ fromEnum(boundedEnumCardinalDirect);
  var rotateDirection = function(dir2) {
    return function(rot) {
      return fromMaybe(Up.value)(toEnum2(mod4(fromEnum1(dir2) + fromEnum2(rot) | 0)(4)));
    };
  };
  var oppositeDirection = function(v2) {
    if (v2 instanceof Up) {
      return Down.value;
    }
    ;
    if (v2 instanceof Right2) {
      return Left2.value;
    }
    ;
    if (v2 instanceof Down) {
      return Up.value;
    }
    ;
    if (v2 instanceof Left2) {
      return Right2.value;
    }
    ;
    throw new Error("Failed pattern match at Game.Direction (line 54, column 21 - line 58, column 17): " + [v2.constructor.name]);
  };
  var clockwiseRotation = function(d1) {
    return function(d2) {
      return rotation(fromEnum1(d2) - fromEnum1(d1) | 0);
    };
  };
  var allDirections = /* @__PURE__ */ function() {
    return enumFromTo(enumCardinalDirection)(unfoldable1Array)(Up.value)(Left2.value);
  }();

  // output/Game.Location/index.js
  var show3 = /* @__PURE__ */ show(showInt);
  var compare4 = /* @__PURE__ */ compare(ordInt);
  var showLocation = {
    show: function(v2) {
      return "(" + (show3(v2.x) + ("," + (show3(v2.y) + ")")));
    }
  };
  var eqLocation = {
    eq: function(x2) {
      return function(y2) {
        return x2.x === y2.x && x2.y === y2.y;
      };
    }
  };
  var eq13 = /* @__PURE__ */ eq(eqLocation);
  var ordLocation = {
    compare: function(x2) {
      return function(y2) {
        var v2 = compare4(x2.x)(y2.x);
        if (v2 instanceof LT) {
          return LT.value;
        }
        ;
        if (v2 instanceof GT) {
          return GT.value;
        }
        ;
        return compare4(x2.y)(y2.y);
      };
    },
    Eq0: function() {
      return eqLocation;
    }
  };
  var location2 = function(x2) {
    return function(y2) {
      return {
        x: x2,
        y: y2
      };
    };
  };
  var followDirection = function(v2) {
    return function(v1) {
      if (v1 instanceof Up) {
        return location2(v2.x)(v2.y - 1 | 0);
      }
      ;
      if (v1 instanceof Right2) {
        return location2(v2.x + 1 | 0)(v2.y);
      }
      ;
      if (v1 instanceof Down) {
        return location2(v2.x)(v2.y + 1 | 0);
      }
      ;
      if (v1 instanceof Left2) {
        return location2(v2.x - 1 | 0)(v2.y);
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 33, column 37 - line 37, column 38): " + [v1.constructor.name]);
    };
  };
  var directionTo = function(l1) {
    return function(l2) {
      return find2(function(d2) {
        return eq13(followDirection(l1)(d2))(l2);
      })(allDirections);
    };
  };

  // output/Data.Set/index.js
  var foldMap2 = /* @__PURE__ */ foldMap(foldableList);
  var foldl3 = /* @__PURE__ */ foldl(foldableList);
  var foldr3 = /* @__PURE__ */ foldr(foldableList);
  var $$Set = function(x2) {
    return x2;
  };
  var toMap = function(v2) {
    return v2;
  };
  var toList = function(v2) {
    return keys(v2);
  };
  var singleton6 = function(a3) {
    return singleton5(a3)(unit);
  };
  var member2 = function(dictOrd) {
    var member1 = member(dictOrd);
    return function(a3) {
      return function(v2) {
        return member1(a3)(v2);
      };
    };
  };
  var isEmpty2 = function(v2) {
    return isEmpty(v2);
  };
  var insert2 = function(dictOrd) {
    var insert14 = insert(dictOrd);
    return function(a3) {
      return function(v2) {
        return insert14(a3)(unit)(v2);
      };
    };
  };
  var fromMap = $$Set;
  var foldableSet = {
    foldMap: function(dictMonoid) {
      var foldMap12 = foldMap2(dictMonoid);
      return function(f) {
        var $129 = foldMap12(f);
        return function($130) {
          return $129(toList($130));
        };
      };
    },
    foldl: function(f) {
      return function(x2) {
        var $131 = foldl3(f)(x2);
        return function($132) {
          return $131(toList($132));
        };
      };
    },
    foldr: function(f) {
      return function(x2) {
        var $133 = foldr3(f)(x2);
        return function($134) {
          return $133(toList($134));
        };
      };
    }
  };
  var eqSet = function(dictEq) {
    var eq26 = eq(eqMap(dictEq)(eqUnit));
    return {
      eq: function(v2) {
        return function(v1) {
          return eq26(v2)(v1);
        };
      }
    };
  };
  var empty3 = empty2;
  var fromFoldable4 = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictOrd) {
      var insert14 = insert2(dictOrd);
      return foldl22(function(m2) {
        return function(a3) {
          return insert14(a3)(m2);
        };
      })(empty3);
    };
  };
  var $$delete3 = function(dictOrd) {
    var delete1 = $$delete2(dictOrd);
    return function(a3) {
      return function(v2) {
        return delete1(a3)(v2);
      };
    };
  };

  // output/Data.Map/index.js
  var keys2 = /* @__PURE__ */ function() {
    var $38 = $$void(functorMap);
    return function($39) {
      return fromMap($38($39));
    };
  }();

  // output/Data.Lens.Internal.Forget/index.js
  var Forget = function(x2) {
    return x2;
  };
  var profunctorForget = {
    dimap: function(f) {
      return function(v2) {
        return function(v1) {
          return function($36) {
            return v1(f($36));
          };
        };
      };
    }
  };
  var strongForget = {
    first: function(v2) {
      return function($37) {
        return v2(fst($37));
      };
    },
    second: function(v2) {
      return function($38) {
        return v2(snd($38));
      };
    },
    Profunctor0: function() {
      return profunctorForget;
    }
  };
  var choiceForget = function(dictMonoid) {
    var mempty4 = mempty(monoidFn(dictMonoid));
    return {
      left: function(v2) {
        return either(v2)(mempty4);
      },
      right: function(v2) {
        return either(mempty4)(v2);
      },
      Profunctor0: function() {
        return profunctorForget;
      }
    };
  };

  // output/Data.Profunctor.Choice/index.js
  var right = function(dict) {
    return dict.right;
  };
  var choiceFn = {
    left: function(v2) {
      return function(v1) {
        if (v1 instanceof Left) {
          return new Left(v2(v1.value0));
        }
        ;
        if (v1 instanceof Right) {
          return new Right(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Profunctor.Choice (line 32, column 1 - line 35, column 16): " + [v2.constructor.name, v1.constructor.name]);
      };
    },
    right: /* @__PURE__ */ map(functorEither),
    Profunctor0: function() {
      return profunctorFn;
    }
  };

  // output/Data.Profunctor.Strong/index.js
  var identity11 = /* @__PURE__ */ identity(categoryFn);
  var strongFn = {
    first: function(a2b) {
      return function(v2) {
        return new Tuple(a2b(v2.value0), v2.value1);
      };
    },
    second: /* @__PURE__ */ map(functorTuple),
    Profunctor0: function() {
      return profunctorFn;
    }
  };
  var second = function(dict) {
    return dict.second;
  };
  var first = function(dict) {
    return dict.first;
  };
  var splitStrong = function(dictCategory) {
    var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
    return function(dictStrong) {
      var first1 = first(dictStrong);
      var second1 = second(dictStrong);
      return function(l2) {
        return function(r2) {
          return composeFlipped2(first1(l2))(second1(r2));
        };
      };
    };
  };
  var fanout = function(dictCategory) {
    var identity1 = identity(dictCategory);
    var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
    var splitStrong1 = splitStrong(dictCategory);
    return function(dictStrong) {
      var dimap3 = dimap(dictStrong.Profunctor0());
      var splitStrong2 = splitStrong1(dictStrong);
      return function(l2) {
        return function(r2) {
          var split2 = dimap3(identity11)(function(a3) {
            return new Tuple(a3, a3);
          })(identity1);
          return composeFlipped2(split2)(splitStrong2(l2)(r2));
        };
      };
    };
  };

  // output/Data.Lens.Internal.Wander/index.js
  var alaF3 = /* @__PURE__ */ alaF()()()();
  var wanderFunction = {
    wander: function(t2) {
      return alaF3(Identity)(t2(applicativeIdentity));
    },
    Strong0: function() {
      return strongFn;
    },
    Choice1: function() {
      return choiceFn;
    }
  };

  // output/Data.Lens.Internal.Tagged/index.js
  var Tagged = function(x2) {
    return x2;
  };
  var taggedProfunctor = {
    dimap: function(v2) {
      return function(g2) {
        return function(v1) {
          return g2(v1);
        };
      };
    }
  };
  var taggedChoice = {
    left: function(v2) {
      return new Left(v2);
    },
    right: function(v2) {
      return new Right(v2);
    },
    Profunctor0: function() {
      return taggedProfunctor;
    }
  };

  // output/Data.Lens.Fold/index.js
  var unwrap4 = /* @__PURE__ */ unwrap();
  var foldMapOf = /* @__PURE__ */ under()()(Forget);
  var has = function(dictHeytingAlgebra) {
    var tt4 = tt(dictHeytingAlgebra);
    return function(p2) {
      var $126 = foldMapOf(p2)($$const(tt4));
      return function($127) {
        return unwrap4($126($127));
      };
    };
  };
  var preview = function(p2) {
    var $135 = foldMapOf(p2)(function($137) {
      return First(Just.create($137));
    });
    return function($136) {
      return unwrap4($135($136));
    };
  };

  // output/Data.Lens.Getter/index.js
  var unwrap5 = /* @__PURE__ */ unwrap();
  var identity12 = /* @__PURE__ */ identity(categoryFn);
  var view = function(l2) {
    return unwrap5(l2(identity12));
  };
  var viewOn = function(s2) {
    return function(l2) {
      return view(l2)(s2);
    };
  };
  var use = function(dictMonadState) {
    var gets7 = gets(dictMonadState);
    return function(p2) {
      return gets7(function(v2) {
        return viewOn(v2)(p2);
      });
    };
  };
  var to2 = function(f) {
    return function(p2) {
      var $10 = unwrap5(p2);
      return function($11) {
        return $10(f($11));
      };
    };
  };

  // output/Data.Lens.Iso/index.js
  var coerce4 = /* @__PURE__ */ coerce();
  var iso = function(f) {
    return function(g2) {
      return function(dictProfunctor) {
        var dimap3 = dimap(dictProfunctor);
        return function(pab) {
          return dimap3(f)(g2)(pab);
        };
      };
    };
  };
  var coerced = function() {
    return function() {
      return function(dictProfunctor) {
        return iso(coerce4)(coerce4)(dictProfunctor);
      };
    };
  };

  // output/Data.Lens.Iso.Newtype/index.js
  var coerced2 = /* @__PURE__ */ coerced()();
  var _Newtype = function() {
    return function() {
      return function(dictProfunctor) {
        return coerced2(dictProfunctor);
      };
    };
  };

  // output/Data.Lens.Prism/index.js
  var identity13 = /* @__PURE__ */ identity(categoryFn);
  var guard3 = /* @__PURE__ */ guard(alternativeMaybe);
  var review = /* @__PURE__ */ under()()(Tagged);
  var prism = function(to3) {
    return function(fro) {
      return function(dictChoice) {
        var Profunctor0 = dictChoice.Profunctor0();
        var dimap3 = dimap(Profunctor0);
        var right2 = right(dictChoice);
        var rmap3 = rmap(Profunctor0);
        return function(pab) {
          return dimap3(fro)(either(identity13)(identity13))(right2(rmap3(to3)(pab)));
        };
      };
    };
  };
  var prism$prime = function(to3) {
    return function(fro) {
      return function(dictChoice) {
        return prism(to3)(function(s2) {
          return maybe(new Left(s2))(Right.create)(fro(s2));
        })(dictChoice);
      };
    };
  };
  var nearly = function(x2) {
    return function(f) {
      return function(dictChoice) {
        return prism$prime($$const(x2))(function($38) {
          return guard3(f($38));
        })(dictChoice);
      };
    };
  };
  var only = function(dictEq) {
    var eq26 = eq(dictEq);
    return function(x2) {
      return function(dictChoice) {
        return nearly(x2)(function(v2) {
          return eq26(v2)(x2);
        })(dictChoice);
      };
    };
  };

  // output/Data.Lens.Lens/index.js
  var lens$prime = function(to3) {
    return function(dictStrong) {
      var dimap3 = dimap(dictStrong.Profunctor0());
      var first2 = first(dictStrong);
      return function(pab) {
        return dimap3(to3)(function(v2) {
          return v2.value1(v2.value0);
        })(first2(pab));
      };
    };
  };
  var lens = function(get5) {
    return function(set3) {
      return function(dictStrong) {
        return lens$prime(function(s2) {
          return new Tuple(get5(s2), function(b2) {
            return set3(s2)(b2);
          });
        })(dictStrong);
      };
    };
  };

  // output/Record/index.js
  var set = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function() {
        return function(l2) {
          return function(b2) {
            return function(r2) {
              return unsafeSet(reflectSymbol2(l2))(b2)(r2);
            };
          };
        };
      };
    };
  };
  var get2 = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(l2) {
        return function(r2) {
          return unsafeGet(reflectSymbol2(l2))(r2);
        };
      };
    };
  };

  // output/Data.Lens.Record/index.js
  var prop = function(dictIsSymbol) {
    var get5 = get2(dictIsSymbol)();
    var set3 = set(dictIsSymbol)()();
    return function() {
      return function() {
        return function(l2) {
          return function(dictStrong) {
            return lens(get5(l2))(flip(set3(l2)))(dictStrong);
          };
        };
      };
    };
  };

  // output/Data.Lens.Setter/index.js
  var over3 = function(l2) {
    return l2;
  };
  var set2 = function(l2) {
    return function(b2) {
      return over3(l2)($$const(b2));
    };
  };
  var modifying = function(dictMonadState) {
    var $$void17 = $$void(dictMonadState.Monad0().Bind1().Apply0().Functor0());
    var modify5 = modify3(dictMonadState);
    return function(p2) {
      return function(f) {
        return $$void17(modify5(over3(p2)(f)));
      };
    };
  };
  var assign2 = function(dictMonadState) {
    var $$void17 = $$void(dictMonadState.Monad0().Bind1().Apply0().Functor0());
    var modify5 = modify3(dictMonadState);
    return function(p2) {
      return function(b2) {
        return $$void17(modify5(set2(p2)(b2)));
      };
    };
  };
  var appendModifying = function(dictMonadState) {
    var modifying1 = modifying(dictMonadState);
    return function(dictSemigroup) {
      var append21 = append(dictSemigroup);
      return function(p2) {
        var $96 = modifying1(p2);
        var $97 = flip(append21);
        return function($98) {
          return $96($97($98));
        };
      };
    };
  };

  // output/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n) {
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };
  var toNumber = function(n) {
    return n;
  };
  var toStringAs = function(radix) {
    return function(i2) {
      return i2.toString(radix);
    };
  };

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y2) {
    return function(x2) {
      return Math.atan2(y2, x2);
    };
  };
  var round = Math.round;

  // output/Data.Number/index.js
  var pi = 3.141592653589793;

  // output/Data.Int/index.js
  var top2 = /* @__PURE__ */ top(boundedInt);
  var bottom2 = /* @__PURE__ */ bottom(boundedInt);
  var odd = function(x2) {
    return (x2 & 1) !== 0;
  };
  var hexadecimal = 16;
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();
  var unsafeClamp = function(x2) {
    if (!isFiniteImpl(x2)) {
      return 0;
    }
    ;
    if (x2 >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x2 <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x2));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x2.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
  };
  var even = function(x2) {
    return (x2 & 1) === 0;
  };

  // output/Data.String.Common/foreign.js
  var split = function(sep) {
    return function(s2) {
      return s2.split(sep);
    };
  };
  var toLower = function(s2) {
    return s2.toLowerCase();
  };
  var toUpper = function(s2) {
    return s2.toUpperCase();
  };
  var joinWith = function(s2) {
    return function(xs) {
      return xs.join(s2);
    };
  };

  // output/Game.Signal/index.js
  var fold3 = /* @__PURE__ */ fold2(monoidString);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorArray);
  var showSignal = {
    show: function(v2) {
      return toUpper(fold3(mapFlipped2([12, 8, 4, 0])(function(shift) {
        return toStringAs(hexadecimal)(v2 >> shift & 15);
      })));
    }
  };
  var semiringSignal = {
    zero: 0,
    add: function(v2) {
      return function(v1) {
        return v2 + v1 | 0;
      };
    },
    one: 1,
    mul: function(v2) {
      return function(v1) {
        return v2 * v1 | 0;
      };
    }
  };
  var semigroupSignal = {
    append: /* @__PURE__ */ add(semiringSignal)
  };
  var monoidSignal = {
    mempty: /* @__PURE__ */ zero(semiringSignal),
    Semigroup0: function() {
      return semigroupSignal;
    }
  };
  var heytingAlgebraSignal = /* @__PURE__ */ function() {
    return {
      ff: 0,
      tt: -1 | 0,
      not: function(v2) {
        return ~v2;
      },
      implies: function(v2) {
        return function(v1) {
          return ~v2 | v1;
        };
      },
      disj: function(v2) {
        return function(v1) {
          return v2 | v1;
        };
      },
      conj: function(v2) {
        return function(v1) {
          return v2 & v1;
        };
      }
    };
  }();
  var eqSignal = {
    eq: function(x2) {
      return function(y2) {
        return x2 === y2;
      };
    }
  };
  var nthBit = function(v2) {
    return function(n) {
      return odd(v2 >> n);
    };
  };

  // output/Game.Piece.Port/index.js
  var show4 = /* @__PURE__ */ show(showInt);
  var map15 = /* @__PURE__ */ map(functorArray);
  var _Newtype2 = /* @__PURE__ */ _Newtype()();
  var prop2 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "portType";
    }
  })()();
  var prop1 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "capacity";
    }
  })()();
  var Input = /* @__PURE__ */ function() {
    function Input2() {
    }
    ;
    Input2.value = new Input2();
    return Input2;
  }();
  var Output = /* @__PURE__ */ function() {
    function Output2() {
    }
    ;
    Output2.value = new Output2();
    return Output2;
  }();
  var OneBit = /* @__PURE__ */ function() {
    function OneBit2() {
    }
    ;
    OneBit2.value = new OneBit2();
    return OneBit2;
  }();
  var TwoBit = /* @__PURE__ */ function() {
    function TwoBit2() {
    }
    ;
    TwoBit2.value = new TwoBit2();
    return TwoBit2;
  }();
  var FourBit = /* @__PURE__ */ function() {
    function FourBit2() {
    }
    ;
    FourBit2.value = new FourBit2();
    return FourBit2;
  }();
  var EightBit = /* @__PURE__ */ function() {
    function EightBit2() {
    }
    ;
    EightBit2.value = new EightBit2();
    return EightBit2;
  }();
  var showPortType = {
    show: function(v2) {
      if (v2 instanceof Input) {
        return "Input";
      }
      ;
      if (v2 instanceof Output) {
        return "Output";
      }
      ;
      throw new Error("Failed pattern match at Game.Piece.Port (line 66, column 10 - line 68, column 23): " + [v2.constructor.name]);
    }
  };
  var show1 = /* @__PURE__ */ show(showPortType);
  var eqPortType = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof Input && y2 instanceof Input) {
          return true;
        }
        ;
        if (x2 instanceof Output && y2 instanceof Output) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var eq3 = /* @__PURE__ */ eq(eqPortType);
  var ordPortType = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof Input && y2 instanceof Input) {
          return EQ.value;
        }
        ;
        if (x2 instanceof Input) {
          return LT.value;
        }
        ;
        if (y2 instanceof Input) {
          return GT.value;
        }
        ;
        if (x2 instanceof Output && y2 instanceof Output) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Game.Piece.Port (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqPortType;
    }
  };
  var compare5 = /* @__PURE__ */ compare(ordPortType);
  var eqCapacity = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof OneBit && y2 instanceof OneBit) {
          return true;
        }
        ;
        if (x2 instanceof TwoBit && y2 instanceof TwoBit) {
          return true;
        }
        ;
        if (x2 instanceof FourBit && y2 instanceof FourBit) {
          return true;
        }
        ;
        if (x2 instanceof EightBit && y2 instanceof EightBit) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var eq14 = /* @__PURE__ */ eq(eqCapacity);
  var eqPort = {
    eq: function(x2) {
      return function(y2) {
        return eq14(x2.capacity)(y2.capacity) && eq3(x2.portType)(y2.portType);
      };
    }
  };
  var eq22 = /* @__PURE__ */ eq(eqPort);
  var ordCapacity = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof OneBit && y2 instanceof OneBit) {
          return EQ.value;
        }
        ;
        if (x2 instanceof OneBit) {
          return LT.value;
        }
        ;
        if (y2 instanceof OneBit) {
          return GT.value;
        }
        ;
        if (x2 instanceof TwoBit && y2 instanceof TwoBit) {
          return EQ.value;
        }
        ;
        if (x2 instanceof TwoBit) {
          return LT.value;
        }
        ;
        if (y2 instanceof TwoBit) {
          return GT.value;
        }
        ;
        if (x2 instanceof FourBit && y2 instanceof FourBit) {
          return EQ.value;
        }
        ;
        if (x2 instanceof FourBit) {
          return LT.value;
        }
        ;
        if (y2 instanceof FourBit) {
          return GT.value;
        }
        ;
        if (x2 instanceof EightBit && y2 instanceof EightBit) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Game.Piece.Port (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqCapacity;
    }
  };
  var compare13 = /* @__PURE__ */ compare(ordCapacity);
  var ordPort = {
    compare: function(x2) {
      return function(y2) {
        var v2 = compare13(x2.capacity)(y2.capacity);
        if (v2 instanceof LT) {
          return LT.value;
        }
        ;
        if (v2 instanceof GT) {
          return GT.value;
        }
        ;
        return compare5(x2.portType)(y2.portType);
      };
    },
    Eq0: function() {
      return eqPort;
    }
  };
  var toInt = function(v2) {
    if (v2 instanceof OneBit) {
      return 1;
    }
    ;
    if (v2 instanceof TwoBit) {
      return 2;
    }
    ;
    if (v2 instanceof FourBit) {
      return 4;
    }
    ;
    if (v2 instanceof EightBit) {
      return 8;
    }
    ;
    throw new Error("Failed pattern match at Game.Piece.Port (line 23, column 9 - line 27, column 16): " + [v2.constructor.name]);
  };
  var showCapacity = {
    show: function(capacity) {
      return "Capacity " + show4(toInt(capacity));
    }
  };
  var show22 = /* @__PURE__ */ show(showCapacity);
  var showPort = {
    show: function(v2) {
      return show1(v2.portType) + (" " + show22(v2.capacity));
    }
  };
  var outputPort = function(capacity) {
    return {
      portType: Output.value,
      capacity
    };
  };
  var maxValue = function(v2) {
    if (v2 instanceof OneBit) {
      return 1;
    }
    ;
    if (v2 instanceof TwoBit) {
      return 3;
    }
    ;
    if (v2 instanceof FourBit) {
      return 15;
    }
    ;
    if (v2 instanceof EightBit) {
      return 255;
    }
    ;
    throw new Error("Failed pattern match at Game.Piece.Port (line 45, column 12 - line 49, column 25): " + [v2.constructor.name]);
  };
  var matchingPortType = function(v2) {
    if (v2 instanceof Input) {
      return Output.value;
    }
    ;
    if (v2 instanceof Output) {
      return Input.value;
    }
    ;
    throw new Error("Failed pattern match at Game.Piece.Port (line 71, column 20 - line 73, column 18): " + [v2.constructor.name]);
  };
  var inputPort = function(capacity) {
    return {
      portType: Input.value,
      capacity
    };
  };
  var halveCapacity = function(v2) {
    if (v2 instanceof OneBit) {
      return Nothing.value;
    }
    ;
    if (v2 instanceof TwoBit) {
      return new Just(OneBit.value);
    }
    ;
    if (v2 instanceof FourBit) {
      return new Just(TwoBit.value);
    }
    ;
    if (v2 instanceof EightBit) {
      return new Just(FourBit.value);
    }
    ;
    throw new Error("Failed pattern match at Game.Piece.Port (line 38, column 17 - line 42, column 27): " + [v2.constructor.name]);
  };
  var doubleCapacity = function(v2) {
    if (v2 instanceof OneBit) {
      return new Just(TwoBit.value);
    }
    ;
    if (v2 instanceof TwoBit) {
      return new Just(FourBit.value);
    }
    ;
    if (v2 instanceof FourBit) {
      return new Just(EightBit.value);
    }
    ;
    if (v2 instanceof EightBit) {
      return Nothing.value;
    }
    ;
    throw new Error("Failed pattern match at Game.Piece.Port (line 30, column 18 - line 34, column 22): " + [v2.constructor.name]);
  };
  var clampedBits = function(capacity) {
    return function(signal) {
      return map15(nthBit(signal))(range2(0)(toInt(capacity) - 1 | 0));
    };
  };
  var clampSignal = function(capacity) {
    return function(v2) {
      return v2 & ((1 << toInt(capacity)) - 1 | 0);
    };
  };
  var _portType = function(dictStrong) {
    var $96 = _Newtype2(dictStrong.Profunctor0());
    var $97 = prop2($$Proxy.value)(dictStrong);
    return function($98) {
      return $96($97($98));
    };
  };
  var _portType1 = /* @__PURE__ */ _portType(strongForget);
  var isInput = /* @__PURE__ */ has(heytingAlgebraBoolean)(/* @__PURE__ */ function() {
    var $99 = only(eqPortType)(Input.value)(choiceForget(monoidDisj(heytingAlgebraBoolean)));
    return function($100) {
      return _portType1($99($100));
    };
  }());
  var isOutput = /* @__PURE__ */ function() {
    var $101 = not(heytingAlgebraBoolean);
    return function($102) {
      return $101(isInput($102));
    };
  }();
  var matchingPort = /* @__PURE__ */ over3(/* @__PURE__ */ _portType(strongFn))(matchingPortType);
  var portMatches = function(port2) {
    return function(otherPort) {
      return eq22(port2)(matchingPort(otherPort));
    };
  };
  var portType = /* @__PURE__ */ view(_portType1);
  var _portCapacity = function(dictStrong) {
    var $103 = _Newtype2(dictStrong.Profunctor0());
    var $104 = prop1($$Proxy.value)(dictStrong);
    return function($105) {
      return $103($104($105));
    };
  };
  var portCapacity = /* @__PURE__ */ view(/* @__PURE__ */ _portCapacity(strongForget));

  // output/Game.Piece.Types/index.js
  var compare6 = /* @__PURE__ */ compare(ordString);
  var and2 = /* @__PURE__ */ and(foldableArray)(heytingAlgebraBoolean);
  var eq15 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMap(eqCardinalDirection)(eqPort));
  var fold4 = /* @__PURE__ */ fold(foldableArray)(monoidOrdering);
  var compare14 = /* @__PURE__ */ compare(/* @__PURE__ */ ordMap(ordCardinalDirection)(ordPort));
  var lookup2 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var showPieceId = {
    show: function(v2) {
      return v2;
    }
  };
  var eqPieceId = {
    eq: function(x2) {
      return function(y2) {
        return x2 === y2;
      };
    }
  };
  var eq23 = /* @__PURE__ */ eq(eqPieceId);
  var ordPieceId = {
    compare: function(x2) {
      return function(y2) {
        return compare6(x2)(y2);
      };
    },
    Eq0: function() {
      return eqPieceId;
    }
  };
  var compare22 = /* @__PURE__ */ compare(ordPieceId);
  var eqPiece = {
    eq: function(v2) {
      return function(v1) {
        return and2([eq23(v2.name)(v1.name), eq15(v2.ports)(v1.ports)]);
      };
    }
  };
  var ordPiece = {
    compare: function(v2) {
      return function(v1) {
        return fold4([compare22(v2.name)(v1.name), compare14(v2.ports)(v1.ports)]);
      };
    },
    Eq0: function() {
      return eqPiece;
    }
  };
  var updatePort = function(dir2) {
    return function(port2) {
      return function(v2) {
        return v2.updatePort(dir2)(port2);
      };
    };
  };
  var name15 = function(v2) {
    return v2.name;
  };
  var getPort = function(v2) {
    return function(dir2) {
      return lookup2(dir2)(v2.ports);
    };
  };
  var $$eval = function(v2) {
    return v2["eval"];
  };

  // output/Game.GameEvent/index.js
  var eq4 = /* @__PURE__ */ eq(eqLocation);
  var eq16 = /* @__PURE__ */ eq(eqPieceId);
  var eq24 = /* @__PURE__ */ eq(eqRotation);
  var compare7 = /* @__PURE__ */ compare(ordLocation);
  var compare15 = /* @__PURE__ */ compare(ordPieceId);
  var compare23 = /* @__PURE__ */ compare(ordRotation);
  var sum2 = /* @__PURE__ */ sum(foldableMap)(semiringInt);
  var conj1 = /* @__PURE__ */ conj(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraPredicate));
  var eq32 = /* @__PURE__ */ eq(eqInt);
  var add3 = /* @__PURE__ */ add(semiringInt);
  var BoardSizeIncrementClicked = /* @__PURE__ */ function() {
    function BoardSizeIncrementClicked2() {
    }
    ;
    BoardSizeIncrementClicked2.value = new BoardSizeIncrementClicked2();
    return BoardSizeIncrementClicked2;
  }();
  var BoardSizeDecrementClicked = /* @__PURE__ */ function() {
    function BoardSizeDecrementClicked2() {
    }
    ;
    BoardSizeDecrementClicked2.value = new BoardSizeDecrementClicked2();
    return BoardSizeDecrementClicked2;
  }();
  var AddedPiece = /* @__PURE__ */ function() {
    function AddedPiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    AddedPiece2.create = function(value0) {
      return function(value1) {
        return new AddedPiece2(value0, value1);
      };
    };
    return AddedPiece2;
  }();
  var RemovedPiece = /* @__PURE__ */ function() {
    function RemovedPiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RemovedPiece2.create = function(value0) {
      return function(value1) {
        return new RemovedPiece2(value0, value1);
      };
    };
    return RemovedPiece2;
  }();
  var MovedPiece = /* @__PURE__ */ function() {
    function MovedPiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    MovedPiece2.create = function(value0) {
      return function(value1) {
        return new MovedPiece2(value0, value1);
      };
    };
    return MovedPiece2;
  }();
  var RotatedPiece = /* @__PURE__ */ function() {
    function RotatedPiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RotatedPiece2.create = function(value0) {
      return function(value1) {
        return new RotatedPiece2(value0, value1);
      };
    };
    return RotatedPiece2;
  }();
  var UndoBoardEvent = /* @__PURE__ */ function() {
    function UndoBoardEvent2() {
    }
    ;
    UndoBoardEvent2.value = new UndoBoardEvent2();
    return UndoBoardEvent2;
  }();
  var IncrementSize = /* @__PURE__ */ function() {
    function IncrementSize2() {
    }
    ;
    IncrementSize2.value = new IncrementSize2();
    return IncrementSize2;
  }();
  var DecrementSize = /* @__PURE__ */ function() {
    function DecrementSize2() {
    }
    ;
    DecrementSize2.value = new DecrementSize2();
    return DecrementSize2;
  }();
  var Multiple = /* @__PURE__ */ function() {
    function Multiple2(value0) {
      this.value0 = value0;
    }
    ;
    Multiple2.create = function(value0) {
      return new Multiple2(value0);
    };
    return Multiple2;
  }();
  var BoardEvent = /* @__PURE__ */ function() {
    function BoardEvent2(value0) {
      this.value0 = value0;
    }
    ;
    BoardEvent2.create = function(value0) {
      return new BoardEvent2(value0);
    };
    return BoardEvent2;
  }();
  var SidebarEvent = /* @__PURE__ */ function() {
    function SidebarEvent2(value0) {
      this.value0 = value0;
    }
    ;
    SidebarEvent2.create = function(value0) {
      return new SidebarEvent2(value0);
    };
    return SidebarEvent2;
  }();
  var eqSidebarEvent = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof BoardSizeIncrementClicked && y2 instanceof BoardSizeIncrementClicked) {
          return true;
        }
        ;
        if (x2 instanceof BoardSizeDecrementClicked && y2 instanceof BoardSizeDecrementClicked) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var eq42 = /* @__PURE__ */ eq(eqSidebarEvent);
  var ordSidebarEvent = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof BoardSizeIncrementClicked && y2 instanceof BoardSizeIncrementClicked) {
          return EQ.value;
        }
        ;
        if (x2 instanceof BoardSizeIncrementClicked) {
          return LT.value;
        }
        ;
        if (y2 instanceof BoardSizeIncrementClicked) {
          return GT.value;
        }
        ;
        if (x2 instanceof BoardSizeDecrementClicked && y2 instanceof BoardSizeDecrementClicked) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Game.GameEvent (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqSidebarEvent;
    }
  };
  var compare32 = /* @__PURE__ */ compare(ordSidebarEvent);
  var eqBoardEvent = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof AddedPiece && y2 instanceof AddedPiece) {
          return eq4(x2.value0)(y2.value0) && eq16(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof RemovedPiece && y2 instanceof RemovedPiece) {
          return eq4(x2.value0)(y2.value0) && eq16(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof MovedPiece && y2 instanceof MovedPiece) {
          return eq4(x2.value0)(y2.value0) && eq4(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof RotatedPiece && y2 instanceof RotatedPiece) {
          return eq4(x2.value0)(y2.value0) && eq24(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof UndoBoardEvent && y2 instanceof UndoBoardEvent) {
          return true;
        }
        ;
        if (x2 instanceof IncrementSize && y2 instanceof IncrementSize) {
          return true;
        }
        ;
        if (x2 instanceof DecrementSize && y2 instanceof DecrementSize) {
          return true;
        }
        ;
        if (x2 instanceof Multiple && y2 instanceof Multiple) {
          return eq(eqList(eqBoardEvent))(x2.value0)(y2.value0);
        }
        ;
        return false;
      };
    }
  };
  var eq5 = /* @__PURE__ */ eq(eqBoardEvent);
  var eqGameEvent = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof BoardEvent && y2 instanceof BoardEvent) {
          return eq5(x2.value0)(y2.value0);
        }
        ;
        if (x2 instanceof SidebarEvent && y2 instanceof SidebarEvent) {
          return eq42(x2.value0)(y2.value0);
        }
        ;
        return false;
      };
    }
  };
  var ordBoardEvent = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof AddedPiece && y2 instanceof AddedPiece) {
          var v2 = compare7(x2.value0)(y2.value0);
          if (v2 instanceof LT) {
            return LT.value;
          }
          ;
          if (v2 instanceof GT) {
            return GT.value;
          }
          ;
          return compare15(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof AddedPiece) {
          return LT.value;
        }
        ;
        if (y2 instanceof AddedPiece) {
          return GT.value;
        }
        ;
        if (x2 instanceof RemovedPiece && y2 instanceof RemovedPiece) {
          var v2 = compare7(x2.value0)(y2.value0);
          if (v2 instanceof LT) {
            return LT.value;
          }
          ;
          if (v2 instanceof GT) {
            return GT.value;
          }
          ;
          return compare15(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof RemovedPiece) {
          return LT.value;
        }
        ;
        if (y2 instanceof RemovedPiece) {
          return GT.value;
        }
        ;
        if (x2 instanceof MovedPiece && y2 instanceof MovedPiece) {
          var v2 = compare7(x2.value0)(y2.value0);
          if (v2 instanceof LT) {
            return LT.value;
          }
          ;
          if (v2 instanceof GT) {
            return GT.value;
          }
          ;
          return compare7(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof MovedPiece) {
          return LT.value;
        }
        ;
        if (y2 instanceof MovedPiece) {
          return GT.value;
        }
        ;
        if (x2 instanceof RotatedPiece && y2 instanceof RotatedPiece) {
          var v2 = compare7(x2.value0)(y2.value0);
          if (v2 instanceof LT) {
            return LT.value;
          }
          ;
          if (v2 instanceof GT) {
            return GT.value;
          }
          ;
          return compare23(x2.value1)(y2.value1);
        }
        ;
        if (x2 instanceof RotatedPiece) {
          return LT.value;
        }
        ;
        if (y2 instanceof RotatedPiece) {
          return GT.value;
        }
        ;
        if (x2 instanceof UndoBoardEvent && y2 instanceof UndoBoardEvent) {
          return EQ.value;
        }
        ;
        if (x2 instanceof UndoBoardEvent) {
          return LT.value;
        }
        ;
        if (y2 instanceof UndoBoardEvent) {
          return GT.value;
        }
        ;
        if (x2 instanceof IncrementSize && y2 instanceof IncrementSize) {
          return EQ.value;
        }
        ;
        if (x2 instanceof IncrementSize) {
          return LT.value;
        }
        ;
        if (y2 instanceof IncrementSize) {
          return GT.value;
        }
        ;
        if (x2 instanceof DecrementSize && y2 instanceof DecrementSize) {
          return EQ.value;
        }
        ;
        if (x2 instanceof DecrementSize) {
          return LT.value;
        }
        ;
        if (y2 instanceof DecrementSize) {
          return GT.value;
        }
        ;
        if (x2 instanceof Multiple && y2 instanceof Multiple) {
          return compare(ordList(ordBoardEvent))(x2.value0)(y2.value0);
        }
        ;
        throw new Error("Failed pattern match at Game.GameEvent (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqBoardEvent;
    }
  };
  var compare42 = /* @__PURE__ */ compare(ordBoardEvent);
  var ordGameEvent = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof BoardEvent && y2 instanceof BoardEvent) {
          return compare42(x2.value0)(y2.value0);
        }
        ;
        if (x2 instanceof BoardEvent) {
          return LT.value;
        }
        ;
        if (y2 instanceof BoardEvent) {
          return GT.value;
        }
        ;
        if (x2 instanceof SidebarEvent && y2 instanceof SidebarEvent) {
          return compare32(x2.value0)(y2.value0);
        }
        ;
        throw new Error("Failed pattern match at Game.GameEvent (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqGameEvent;
    }
  };
  var filterKeys2 = /* @__PURE__ */ filterKeys(ordGameEvent);
  var insertWith2 = /* @__PURE__ */ insertWith(ordGameEvent);
  var pieceMovedTo = function(loc) {
    return function(v2) {
      if (v2 instanceof BoardEvent && v2.value0 instanceof MovedPiece) {
        return eq4(loc)(v2.value0.value1);
      }
      ;
      return false;
    };
  };
  var pieceAdded = function(v2) {
    if (v2 instanceof BoardEvent && v2.value0 instanceof AddedPiece) {
      return true;
    }
    ;
    return false;
  };
  var latest = function(v2) {
    return function(store) {
      return maybe(false)(v2)(head2(store.gameEventHistory));
    };
  };
  var empty4 = /* @__PURE__ */ function() {
    return {
      gameEventHistory: Nil.value,
      allGameEvents: empty2
    };
  }();
  var count = function(cmp) {
    return function(n) {
      return function(v2) {
        return function(store) {
          return cmp(sum2(filterKeys2(v2)(store.allGameEvents)))(n);
        };
      };
    };
  };
  var firstTime = /* @__PURE__ */ conj1(latest)(/* @__PURE__ */ count(eq32)(1));
  var cons3 = function(gameEvent) {
    return function(store) {
      return {
        gameEventHistory: new Cons(gameEvent, store.gameEventHistory),
        allGameEvents: insertWith2(add3)(gameEvent)(1)(store.allGameEvents)
      };
    };
  };

  // output/Data.Exists/index.js
  var runExists = unsafeCoerce2;
  var mkExists = unsafeCoerce2;

  // output/Data.Coyoneda/index.js
  var CoyonedaF = /* @__PURE__ */ function() {
    function CoyonedaF2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CoyonedaF2.create = function(value0) {
      return function(value1) {
        return new CoyonedaF2(value0, value1);
      };
    };
    return CoyonedaF2;
  }();
  var unCoyoneda = function(f) {
    return function(v2) {
      return runExists(function(v1) {
        return f(v1.value0)(v1.value1);
      })(v2);
    };
  };
  var coyoneda = function(k) {
    return function(fi) {
      return mkExists(new CoyonedaF(k, fi));
    };
  };
  var functorCoyoneda = {
    map: function(f) {
      return function(v2) {
        return runExists(function(v1) {
          return coyoneda(function($180) {
            return f(v1.value0($180));
          })(v1.value1);
        })(v2);
      };
    }
  };
  var liftCoyoneda = /* @__PURE__ */ coyoneda(/* @__PURE__ */ identity(categoryFn));

  // output/Halogen.Data.OrdBox/index.js
  var OrdBox = /* @__PURE__ */ function() {
    function OrdBox2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    OrdBox2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new OrdBox2(value0, value1, value22);
        };
      };
    };
    return OrdBox2;
  }();
  var mkOrdBox = function(dictOrd) {
    return OrdBox.create(eq(dictOrd.Eq0()))(compare(dictOrd));
  };
  var eqOrdBox = {
    eq: function(v2) {
      return function(v1) {
        return v2.value0(v2.value2)(v1.value2);
      };
    }
  };
  var ordOrdBox = {
    compare: function(v2) {
      return function(v1) {
        return v2.value1(v2.value2)(v1.value2);
      };
    },
    Eq0: function() {
      return eqOrdBox;
    }
  };

  // output/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop1 = /* @__PURE__ */ pop(ordTuple2);
  var lookup1 = /* @__PURE__ */ lookup(ordTuple2);
  var insert1 = /* @__PURE__ */ insert(ordTuple2);
  var pop2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(v2) {
              return pop1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v2);
            };
          };
        };
      };
    };
  };
  var lookup3 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(v2) {
              return lookup1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v2);
            };
          };
        };
      };
    };
  };
  var insert3 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(val) {
              return function(v2) {
                return insert1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(val)(v2);
              };
            };
          };
        };
      };
    };
  };
  var foreachSlot = function(dictApplicative) {
    var traverse_17 = traverse_(dictApplicative)(foldableMap);
    return function(v2) {
      return function(k) {
        return traverse_17(function($54) {
          return k($54);
        })(v2);
      };
    };
  };
  var empty5 = empty2;

  // output/Halogen.Query.Input/index.js
  var RefUpdate = /* @__PURE__ */ function() {
    function RefUpdate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RefUpdate2.create = function(value0) {
      return function(value1) {
        return new RefUpdate2(value0, value1);
      };
    };
    return RefUpdate2;
  }();
  var Action = /* @__PURE__ */ function() {
    function Action3(value0) {
      this.value0 = value0;
    }
    ;
    Action3.create = function(value0) {
      return new Action3(value0);
    };
    return Action3;
  }();
  var functorInput = {
    map: function(f) {
      return function(m2) {
        if (m2 instanceof RefUpdate) {
          return new RefUpdate(m2.value0, m2.value1);
        }
        ;
        if (m2 instanceof Action) {
          return new Action(f(m2.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Query.Input (line 0, column 0 - line 0, column 0): " + [m2.constructor.name]);
      };
    }
  };

  // output/Halogen.VDom.Machine/index.js
  var Step = /* @__PURE__ */ function() {
    function Step3(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Step3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Step3(value0, value1, value22, value32);
          };
        };
      };
    };
    return Step3;
  }();
  var unStep = unsafeCoerce2;
  var step3 = function(v2, a3) {
    return v2.value2(v2.value1, a3);
  };
  var mkStep = unsafeCoerce2;
  var halt = function(v2) {
    return v2.value3(v2.value1);
  };
  var extract2 = /* @__PURE__ */ unStep(function(v2) {
    return v2.value0;
  });

  // output/Halogen.VDom.Types/index.js
  var map16 = /* @__PURE__ */ map(functorArray);
  var map17 = /* @__PURE__ */ map(functorTuple);
  var Text = /* @__PURE__ */ function() {
    function Text2(value0) {
      this.value0 = value0;
    }
    ;
    Text2.create = function(value0) {
      return new Text2(value0);
    };
    return Text2;
  }();
  var Elem = /* @__PURE__ */ function() {
    function Elem2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Elem2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Elem2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Elem2;
  }();
  var Keyed = /* @__PURE__ */ function() {
    function Keyed2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Keyed2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Keyed2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Keyed2;
  }();
  var Widget = /* @__PURE__ */ function() {
    function Widget2(value0) {
      this.value0 = value0;
    }
    ;
    Widget2.create = function(value0) {
      return new Widget2(value0);
    };
    return Widget2;
  }();
  var Grafted = /* @__PURE__ */ function() {
    function Grafted2(value0) {
      this.value0 = value0;
    }
    ;
    Grafted2.create = function(value0) {
      return new Grafted2(value0);
    };
    return Grafted2;
  }();
  var Graft = /* @__PURE__ */ function() {
    function Graft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Graft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Graft2(value0, value1, value22);
        };
      };
    };
    return Graft2;
  }();
  var unGraft = function(f) {
    return function($61) {
      return f($61);
    };
  };
  var graft = unsafeCoerce2;
  var bifunctorGraft = {
    bimap: function(f) {
      return function(g2) {
        return unGraft(function(v2) {
          return graft(new Graft(function($63) {
            return f(v2.value0($63));
          }, function($64) {
            return g2(v2.value1($64));
          }, v2.value2));
        });
      };
    }
  };
  var bimap2 = /* @__PURE__ */ bimap(bifunctorGraft);
  var bifunctorVDom = {
    bimap: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22 instanceof Text) {
            return new Text(v22.value0);
          }
          ;
          if (v22 instanceof Grafted) {
            return new Grafted(bimap2(v2)(v1)(v22.value0));
          }
          ;
          return new Grafted(graft(new Graft(v2, v1, v22)));
        };
      };
    }
  };
  var runGraft = /* @__PURE__ */ unGraft(function(v2) {
    var go2 = function(v22) {
      if (v22 instanceof Text) {
        return new Text(v22.value0);
      }
      ;
      if (v22 instanceof Elem) {
        return new Elem(v22.value0, v22.value1, v2.value0(v22.value2), map16(go2)(v22.value3));
      }
      ;
      if (v22 instanceof Keyed) {
        return new Keyed(v22.value0, v22.value1, v2.value0(v22.value2), map16(map17(go2))(v22.value3));
      }
      ;
      if (v22 instanceof Widget) {
        return new Widget(v2.value1(v22.value0));
      }
      ;
      if (v22 instanceof Grafted) {
        return new Grafted(bimap2(v2.value0)(v2.value1)(v22.value0));
      }
      ;
      throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v22.constructor.name]);
    };
    return go2(v2.value2);
  });

  // output/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key2, obj) {
    return obj[key2];
  }
  function unsafeHasAny(key2, obj) {
    return obj.hasOwnProperty(key2);
  }
  function unsafeSetAny(key2, val, obj) {
    obj[key2] = val;
  }
  function forE2(a3, f) {
    var b2 = [];
    for (var i2 = 0; i2 < a3.length; i2++) {
      b2.push(f(i2, a3[i2]));
    }
    return b2;
  }
  function forEachE(a3, f) {
    for (var i2 = 0; i2 < a3.length; i2++) {
      f(a3[i2]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i2 = 0; i2 < ks.length; i2++) {
      var k = ks[i2];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a22, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a22.length;
    var i2 = 0;
    while (1) {
      if (i2 < l1) {
        if (i2 < l2) {
          a3.push(f1(i2, a1[i2], a22[i2]));
        } else {
          f2(i2, a1[i2]);
        }
      } else if (i2 < l2) {
        a3.push(f3(i2, a22[i2]));
      } else {
        break;
      }
      i2++;
    }
    return a3;
  }
  function strMapWithIxE(as2, fk, f) {
    var o = {};
    for (var i2 = 0; i2 < as2.length; i2++) {
      var a3 = as2[i2];
      var k = fk(a3);
      o[k] = f(k, i2, a3);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as2, fk, f1, f2, f3) {
    var o2 = {};
    for (var i2 = 0; i2 < as2.length; i2++) {
      var a3 = as2[i2];
      var k = fk(a3);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i2, o1[k], a3);
      } else {
        o2[k] = f3(k, i2, a3);
      }
    }
    for (var k in o1) {
      if (k in o2) {
        continue;
      }
      f2(k, o1[k]);
    }
    return o2;
  }
  function refEq2(a3, b2) {
    return a3 === b2;
  }
  function createTextNode(s2, doc) {
    return doc.createTextNode(s2);
  }
  function setTextContent2(s2, n) {
    n.textContent = s2;
  }
  function createElement(ns, name16, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name16);
    } else {
      return doc.createElement(name16);
    }
  }
  function insertChildIx(i2, a3, b2) {
    var n = b2.childNodes.item(i2) || null;
    if (n !== a3) {
      b2.insertBefore(a3, n);
    }
  }
  function removeChild2(a3, b2) {
    if (b2 && a3.parentNode === b2) {
      b2.removeChild(a3);
    }
  }
  function parentNode2(a3) {
    return a3.parentNode;
  }
  function setAttribute2(ns, attr4, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr4, val);
    } else {
      el.setAttribute(attr4, val);
    }
  }
  function removeAttribute2(ns, attr4, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr4);
    } else {
      el.removeAttribute(attr4);
    }
  }
  function hasAttribute2(ns, attr4, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr4);
    } else {
      return el.hasAttribute(attr4);
    }
  }
  function addEventListener(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output/Foreign.Object.ST/foreign.js
  var newImpl = function() {
    return {};
  };

  // output/Halogen.VDom.Util/index.js
  var unsafeLookup = unsafeGetAny;
  var unsafeFreeze2 = unsafeCoerce2;
  var pokeMutMap = unsafeSetAny;
  var newMutMap = newImpl;

  // output/Halogen.VDom.DOM/index.js
  var $runtime_lazy4 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var haltWidget = function(v2) {
    return halt(v2.widget);
  };
  var $lazy_patchWidget = /* @__PURE__ */ $runtime_lazy4("patchWidget", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchWidget(291)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Widget) {
        var res = step3(state3.widget, vdom.value0);
        var res$prime = unStep(function(v2) {
          return mkStep(new Step(v2.value0, {
            build: state3.build,
            widget: res
          }, $lazy_patchWidget(296), haltWidget));
        })(res);
        return res$prime;
      }
      ;
      haltWidget(state3);
      return state3.build(vdom);
    };
  });
  var patchWidget = /* @__PURE__ */ $lazy_patchWidget(286);
  var haltText = function(v2) {
    var parent2 = parentNode2(v2.node);
    return removeChild2(v2.node, parent2);
  };
  var $lazy_patchText = /* @__PURE__ */ $runtime_lazy4("patchText", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchText(82)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Text) {
        if (state3.value === vdom.value0) {
          return mkStep(new Step(state3.node, state3, $lazy_patchText(85), haltText));
        }
        ;
        if (otherwise) {
          var nextState = {
            build: state3.build,
            node: state3.node,
            value: vdom.value0
          };
          setTextContent2(vdom.value0, state3.node);
          return mkStep(new Step(state3.node, nextState, $lazy_patchText(89), haltText));
        }
        ;
      }
      ;
      haltText(state3);
      return state3.build(vdom);
    };
  });
  var patchText = /* @__PURE__ */ $lazy_patchText(77);
  var haltKeyed = function(v2) {
    var parent2 = parentNode2(v2.node);
    removeChild2(v2.node, parent2);
    forInE(v2.children, function(v1, s2) {
      return halt(s2);
    });
    return halt(v2.attrs);
  };
  var haltElem = function(v2) {
    var parent2 = parentNode2(v2.node);
    removeChild2(v2.node, parent2);
    forEachE(v2.children, halt);
    return halt(v2.attrs);
  };
  var eqElemSpec = function(ns1, v2, ns2, v1) {
    var $63 = v2 === v1;
    if ($63) {
      if (ns1 instanceof Just && (ns2 instanceof Just && ns1.value0 === ns2.value0)) {
        return true;
      }
      ;
      if (ns1 instanceof Nothing && ns2 instanceof Nothing) {
        return true;
      }
      ;
      return false;
    }
    ;
    return false;
  };
  var $lazy_patchElem = /* @__PURE__ */ $runtime_lazy4("patchElem", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchElem(135)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Elem && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v2 = length5(vdom.value3);
        var v1 = length5(state3.children);
        if (v1 === 0 && v2 === 0) {
          var attrs2 = step3(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchElem(149), haltElem));
        }
        ;
        var onThis = function(v22, s2) {
          return halt(s2);
        };
        var onThese = function(ix5, s2, v22) {
          var res = step3(s2, v22);
          insertChildIx(ix5, extract2(res), state3.node);
          return res;
        };
        var onThat = function(ix5, v22) {
          var res = state3.build(v22);
          insertChildIx(ix5, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithIxE(state3.children, vdom.value3, onThese, onThis, onThat);
        var attrs2 = step3(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2
        };
        return mkStep(new Step(state3.node, nextState, $lazy_patchElem(172), haltElem));
      }
      ;
      haltElem(state3);
      return state3.build(vdom);
    };
  });
  var patchElem = /* @__PURE__ */ $lazy_patchElem(130);
  var $lazy_patchKeyed = /* @__PURE__ */ $runtime_lazy4("patchKeyed", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchKeyed(222)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Keyed && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v2 = length5(vdom.value3);
        if (state3.length === 0 && v2 === 0) {
          var attrs2 = step3(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children,
            length: 0
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(237), haltKeyed));
        }
        ;
        var onThis = function(v22, s2) {
          return halt(s2);
        };
        var onThese = function(v22, ix$prime, s2, v3) {
          var res = step3(s2, v3.value1);
          insertChildIx(ix$prime, extract2(res), state3.node);
          return res;
        };
        var onThat = function(v22, ix5, v3) {
          var res = state3.build(v3.value1);
          insertChildIx(ix5, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithKeyAndIxE(state3.children, vdom.value3, fst, onThese, onThis, onThat);
        var attrs2 = step3(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2,
          length: v2
        };
        return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(261), haltKeyed));
      }
      ;
      haltKeyed(state3);
      return state3.build(vdom);
    };
  });
  var patchKeyed = /* @__PURE__ */ $lazy_patchKeyed(217);
  var buildWidget = function(v2, build, w) {
    var res = v2.buildWidget(v2)(w);
    var res$prime = unStep(function(v1) {
      return mkStep(new Step(v1.value0, {
        build,
        widget: res
      }, patchWidget, haltWidget));
    })(res);
    return res$prime;
  };
  var buildText = function(v2, build, s2) {
    var node = createTextNode(s2, v2.document);
    var state3 = {
      build,
      node,
      value: s2
    };
    return mkStep(new Step(node, state3, patchText, haltText));
  };
  var buildKeyed = function(v2, build, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v2.document);
    var node = toNode(el);
    var onChild = function(v1, ix5, v22) {
      var res = build(v22.value1);
      insertChildIx(ix5, extract2(res), node);
      return res;
    };
    var children2 = strMapWithIxE(ch1, fst, onChild);
    var attrs = v2.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2,
      length: length5(ch1)
    };
    return mkStep(new Step(node, state3, patchKeyed, haltKeyed));
  };
  var buildElem = function(v2, build, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v2.document);
    var node = toNode(el);
    var onChild = function(ix5, child) {
      var res = build(child);
      insertChildIx(ix5, extract2(res), node);
      return res;
    };
    var children2 = forE2(ch1, onChild);
    var attrs = v2.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2
    };
    return mkStep(new Step(node, state3, patchElem, haltElem));
  };
  var buildVDom = function(spec) {
    var $lazy_build = $runtime_lazy4("build", "Halogen.VDom.DOM", function() {
      return function(v2) {
        if (v2 instanceof Text) {
          return buildText(spec, $lazy_build(59), v2.value0);
        }
        ;
        if (v2 instanceof Elem) {
          return buildElem(spec, $lazy_build(60), v2.value0, v2.value1, v2.value2, v2.value3);
        }
        ;
        if (v2 instanceof Keyed) {
          return buildKeyed(spec, $lazy_build(61), v2.value0, v2.value1, v2.value2, v2.value3);
        }
        ;
        if (v2 instanceof Widget) {
          return buildWidget(spec, $lazy_build(62), v2.value0);
        }
        ;
        if (v2 instanceof Grafted) {
          return $lazy_build(63)(runGraft(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.VDom.DOM (line 58, column 27 - line 63, column 52): " + [v2.constructor.name]);
      };
    });
    var build = $lazy_build(58);
    return build;
  };

  // output/Foreign/foreign.js
  function typeOf(value14) {
    return typeof value14;
  }
  var isArray = Array.isArray || function(value14) {
    return Object.prototype.toString.call(value14) === "[object Array]";
  };

  // output/Data.List.NonEmpty/index.js
  var singleton7 = /* @__PURE__ */ function() {
    var $200 = singleton3(plusList);
    return function($201) {
      return NonEmptyList($200($201));
    };
  }();
  var cons4 = function(y2) {
    return function(v2) {
      return new NonEmpty(y2, new Cons(v2.value0, v2.value1));
    };
  };

  // output/Data.String.CodeUnits/foreign.js
  var toCharArray = function(s2) {
    return s2.split("");
  };
  var singleton8 = function(c2) {
    return c2;
  };
  var length7 = function(s2) {
    return s2.length;
  };
  var _indexOf = function(just) {
    return function(nothing) {
      return function(x2) {
        return function(s2) {
          var i2 = s2.indexOf(x2);
          return i2 === -1 ? nothing : just(i2);
        };
      };
    };
  };
  var take2 = function(n) {
    return function(s2) {
      return s2.substr(0, n);
    };
  };
  var drop3 = function(n) {
    return function(s2) {
      return s2.substring(n);
    };
  };
  var splitAt = function(i2) {
    return function(s2) {
      return { before: s2.substring(0, i2), after: s2.substring(i2) };
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function(i2) {
    return function(s2) {
      if (i2 >= 0 && i2 < s2.length)
        return s2.charAt(i2);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output/Data.String.CodeUnits/index.js
  var stripPrefix = function(v2) {
    return function(str2) {
      var v1 = splitAt(length7(v2))(str2);
      var $20 = v1.before === v2;
      if ($20) {
        return new Just(v1.after);
      }
      ;
      return Nothing.value;
    };
  };
  var indexOf = /* @__PURE__ */ function() {
    return _indexOf(Just.create)(Nothing.value);
  }();

  // output/Foreign.Object/foreign.js
  function _lookup(no, yes, k, m2) {
    return k in m2 ? yes(m2[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m2) {
      var r2 = [];
      for (var k in m2) {
        if (hasOwnProperty.call(m2, k)) {
          r2.push(f(k)(m2[k]));
        }
      }
      return r2;
    };
  }
  var keys3 = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Foreign.Object/index.js
  var toUnfoldable4 = function(dictUnfoldable) {
    var $89 = toUnfoldable(dictUnfoldable);
    var $90 = toArrayWithKey(Tuple.create);
    return function($91) {
      return $89($90($91));
    };
  };
  var lookup4 = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();
  var fromHomogeneous = function() {
    return unsafeCoerce2;
  };

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Halogen.VDom.DOM.Prop/index.js
  var $runtime_lazy5 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var map18 = /* @__PURE__ */ map(functorFn);
  var map19 = /* @__PURE__ */ map(functorMaybe);
  var Created = /* @__PURE__ */ function() {
    function Created2(value0) {
      this.value0 = value0;
    }
    ;
    Created2.create = function(value0) {
      return new Created2(value0);
    };
    return Created2;
  }();
  var Removed = /* @__PURE__ */ function() {
    function Removed2(value0) {
      this.value0 = value0;
    }
    ;
    Removed2.create = function(value0) {
      return new Removed2(value0);
    };
    return Removed2;
  }();
  var Attribute = /* @__PURE__ */ function() {
    function Attribute2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Attribute2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Attribute2(value0, value1, value22);
        };
      };
    };
    return Attribute2;
  }();
  var Property = /* @__PURE__ */ function() {
    function Property2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Property2.create = function(value0) {
      return function(value1) {
        return new Property2(value0, value1);
      };
    };
    return Property2;
  }();
  var Handler = /* @__PURE__ */ function() {
    function Handler2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Handler2.create = function(value0) {
      return function(value1) {
        return new Handler2(value0, value1);
      };
    };
    return Handler2;
  }();
  var Ref = /* @__PURE__ */ function() {
    function Ref3(value0) {
      this.value0 = value0;
    }
    ;
    Ref3.create = function(value0) {
      return new Ref3(value0);
    };
    return Ref3;
  }();
  var unsafeGetProperty = unsafeGetAny;
  var setProperty = unsafeSetAny;
  var removeProperty = function(key2, el) {
    var v2 = hasAttribute2(nullImpl, key2, el);
    if (v2) {
      return removeAttribute2(nullImpl, key2, el);
    }
    ;
    var v1 = typeOf(unsafeGetAny(key2, el));
    if (v1 === "string") {
      return unsafeSetAny(key2, "", el);
    }
    ;
    if (key2 === "rowSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    ;
    if (key2 === "colSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    ;
    return unsafeSetAny(key2, jsUndefined, el);
  };
  var propToStrKey = function(v2) {
    if (v2 instanceof Attribute && v2.value0 instanceof Just) {
      return "attr/" + (v2.value0.value0 + (":" + v2.value1));
    }
    ;
    if (v2 instanceof Attribute) {
      return "attr/:" + v2.value1;
    }
    ;
    if (v2 instanceof Property) {
      return "prop/" + v2.value0;
    }
    ;
    if (v2 instanceof Handler) {
      return "handler/" + v2.value0;
    }
    ;
    if (v2 instanceof Ref) {
      return "ref";
    }
    ;
    throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 182, column 16 - line 187, column 16): " + [v2.constructor.name]);
  };
  var propFromString = unsafeCoerce2;
  var propFromInt = unsafeCoerce2;
  var propFromBoolean = unsafeCoerce2;
  var functorProp = {
    map: function(v2) {
      return function(v1) {
        if (v1 instanceof Handler) {
          return new Handler(v1.value0, map18(map19(v2))(v1.value1));
        }
        ;
        if (v1 instanceof Ref) {
          return new Ref(map18(map19(v2))(v1.value0));
        }
        ;
        return v1;
      };
    }
  };
  var buildProp = function(emit) {
    return function(el) {
      var removeProp = function(prevEvents) {
        return function(v2, v1) {
          if (v1 instanceof Attribute) {
            return removeAttribute2(toNullable(v1.value0), v1.value1, el);
          }
          ;
          if (v1 instanceof Property) {
            return removeProperty(v1.value0, el);
          }
          ;
          if (v1 instanceof Handler) {
            var handler3 = unsafeLookup(v1.value0, prevEvents);
            return removeEventListener(v1.value0, fst(handler3), el);
          }
          ;
          if (v1 instanceof Ref) {
            return unit;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 169, column 5 - line 179, column 18): " + [v1.constructor.name]);
        };
      };
      var mbEmit = function(v2) {
        if (v2 instanceof Just) {
          return emit(v2.value0)();
        }
        ;
        return unit;
      };
      var haltProp = function(state3) {
        var v2 = lookup4("ref")(state3.props);
        if (v2 instanceof Just && v2.value0 instanceof Ref) {
          return mbEmit(v2.value0.value0(new Removed(el)));
        }
        ;
        return unit;
      };
      var diffProp = function(prevEvents, events) {
        return function(v2, v1, v11, v22) {
          if (v11 instanceof Attribute && v22 instanceof Attribute) {
            var $66 = v11.value2 === v22.value2;
            if ($66) {
              return v22;
            }
            ;
            setAttribute2(toNullable(v22.value0), v22.value1, v22.value2, el);
            return v22;
          }
          ;
          if (v11 instanceof Property && v22 instanceof Property) {
            var v4 = refEq2(v11.value1, v22.value1);
            if (v4) {
              return v22;
            }
            ;
            if (v22.value0 === "value") {
              var elVal = unsafeGetProperty("value", el);
              var $75 = refEq2(elVal, v22.value1);
              if ($75) {
                return v22;
              }
              ;
              setProperty(v22.value0, v22.value1, el);
              return v22;
            }
            ;
            setProperty(v22.value0, v22.value1, el);
            return v22;
          }
          ;
          if (v11 instanceof Handler && v22 instanceof Handler) {
            var handler3 = unsafeLookup(v22.value0, prevEvents);
            write(v22.value1)(snd(handler3))();
            pokeMutMap(v22.value0, handler3, events);
            return v22;
          }
          ;
          return v22;
        };
      };
      var applyProp = function(events) {
        return function(v2, v1, v22) {
          if (v22 instanceof Attribute) {
            setAttribute2(toNullable(v22.value0), v22.value1, v22.value2, el);
            return v22;
          }
          ;
          if (v22 instanceof Property) {
            setProperty(v22.value0, v22.value1, el);
            return v22;
          }
          ;
          if (v22 instanceof Handler) {
            var v3 = unsafeGetAny(v22.value0, events);
            if (unsafeHasAny(v22.value0, events)) {
              write(v22.value1)(snd(v3))();
              return v22;
            }
            ;
            var ref4 = $$new(v22.value1)();
            var listener = eventListener(function(ev) {
              return function __do5() {
                var f$prime = read(ref4)();
                return mbEmit(f$prime(ev));
              };
            })();
            pokeMutMap(v22.value0, new Tuple(listener, ref4), events);
            addEventListener(v22.value0, listener, el);
            return v22;
          }
          ;
          if (v22 instanceof Ref) {
            mbEmit(v22.value0(new Created(el)));
            return v22;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 113, column 5 - line 135, column 15): " + [v22.constructor.name]);
        };
      };
      var $lazy_patchProp = $runtime_lazy5("patchProp", "Halogen.VDom.DOM.Prop", function() {
        return function(state3, ps2) {
          var events = newMutMap();
          var onThis = removeProp(state3.events);
          var onThese = diffProp(state3.events, events);
          var onThat = applyProp(events);
          var props = diffWithKeyAndIxE(state3.props, ps2, propToStrKey, onThese, onThis, onThat);
          var nextState = {
            events: unsafeFreeze2(events),
            props
          };
          return mkStep(new Step(unit, nextState, $lazy_patchProp(100), haltProp));
        };
      });
      var patchProp = $lazy_patchProp(87);
      var renderProp = function(ps1) {
        var events = newMutMap();
        var ps1$prime = strMapWithIxE(ps1, propToStrKey, applyProp(events));
        var state3 = {
          events: unsafeFreeze2(events),
          props: ps1$prime
        };
        return mkStep(new Step(unit, state3, patchProp, haltProp));
      };
      return renderProp;
    };
  };

  // output/Halogen.HTML.Core/index.js
  var map20 = /* @__PURE__ */ map(functorArray);
  var map110 = /* @__PURE__ */ map(functorProp);
  var map23 = /* @__PURE__ */ map(functorInput);
  var bimap3 = /* @__PURE__ */ bimap(bifunctorVDom);
  var HTML = function(x2) {
    return x2;
  };
  var widget = function($28) {
    return HTML(Widget.create($28));
  };
  var toPropValue = function(dict) {
    return dict.toPropValue;
  };
  var text5 = function($29) {
    return HTML(Text.create($29));
  };
  var ref = function(f) {
    return new Ref(function($30) {
      return f(function(v2) {
        if (v2 instanceof Created) {
          return new Just(v2.value0);
        }
        ;
        if (v2 instanceof Removed) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Halogen.HTML.Core (line 109, column 21 - line 111, column 23): " + [v2.constructor.name]);
      }($30));
    });
  };
  var prop3 = function(dictIsProp) {
    var toPropValue1 = toPropValue(dictIsProp);
    return function(v2) {
      var $31 = Property.create(v2);
      return function($32) {
        return $31(toPropValue1($32));
      };
    };
  };
  var isPropString = {
    toPropValue: propFromString
  };
  var isPropInt = {
    toPropValue: propFromInt
  };
  var isPropBoolean = {
    toPropValue: propFromBoolean
  };
  var handler = /* @__PURE__ */ function() {
    return Handler.create;
  }();
  var element = function(ns) {
    return function(name16) {
      return function(props) {
        return function(children2) {
          return new Elem(ns, name16, props, children2);
        };
      };
    };
  };
  var bifunctorHTML = {
    bimap: function(f) {
      return function(g2) {
        return function(v2) {
          return bimap3(map20(map110(map23(g2))))(f)(v2);
        };
      };
    }
  };
  var attr = function(ns) {
    return function(v2) {
      return Attribute.create(ns)(v2);
    };
  };

  // output/Control.Applicative.Free/index.js
  var identity14 = /* @__PURE__ */ identity(categoryFn);
  var Pure = /* @__PURE__ */ function() {
    function Pure2(value0) {
      this.value0 = value0;
    }
    ;
    Pure2.create = function(value0) {
      return new Pure2(value0);
    };
    return Pure2;
  }();
  var Lift = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var Ap = /* @__PURE__ */ function() {
    function Ap2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Ap2.create = function(value0) {
      return function(value1) {
        return new Ap2(value0, value1);
      };
    };
    return Ap2;
  }();
  var mkAp = function(fba) {
    return function(fb) {
      return new Ap(fba, fb);
    };
  };
  var liftFreeAp = /* @__PURE__ */ function() {
    return Lift.create;
  }();
  var goLeft = function(dictApplicative) {
    var pure34 = pure(dictApplicative);
    return function(fStack) {
      return function(valStack) {
        return function(nat) {
          return function(func) {
            return function(count2) {
              if (func instanceof Pure) {
                return new Tuple(new Cons({
                  func: pure34(func.value0),
                  count: count2
                }, fStack), valStack);
              }
              ;
              if (func instanceof Lift) {
                return new Tuple(new Cons({
                  func: nat(func.value0),
                  count: count2
                }, fStack), valStack);
              }
              ;
              if (func instanceof Ap) {
                return goLeft(dictApplicative)(fStack)(cons4(func.value1)(valStack))(nat)(func.value0)(count2 + 1 | 0);
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 102, column 41 - line 105, column 81): " + [func.constructor.name]);
            };
          };
        };
      };
    };
  };
  var goApply = function(dictApplicative) {
    var apply7 = apply(dictApplicative.Apply0());
    return function(fStack) {
      return function(vals) {
        return function(gVal) {
          if (fStack instanceof Nil) {
            return new Left(gVal);
          }
          ;
          if (fStack instanceof Cons) {
            var gRes = apply7(fStack.value0.func)(gVal);
            var $31 = fStack.value0.count === 1;
            if ($31) {
              if (fStack.value1 instanceof Nil) {
                return new Left(gRes);
              }
              ;
              return goApply(dictApplicative)(fStack.value1)(vals)(gRes);
            }
            ;
            if (vals instanceof Nil) {
              return new Left(gRes);
            }
            ;
            if (vals instanceof Cons) {
              return new Right(new Tuple(new Cons({
                func: gRes,
                count: fStack.value0.count - 1 | 0
              }, fStack.value1), new NonEmpty(vals.value0, vals.value1)));
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 83, column 11 - line 88, column 50): " + [vals.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Control.Applicative.Free (line 72, column 3 - line 88, column 50): " + [fStack.constructor.name]);
        };
      };
    };
  };
  var functorFreeAp = {
    map: function(f) {
      return function(x2) {
        return mkAp(new Pure(f))(x2);
      };
    }
  };
  var foldFreeAp = function(dictApplicative) {
    var goApply1 = goApply(dictApplicative);
    var pure34 = pure(dictApplicative);
    var goLeft1 = goLeft(dictApplicative);
    return function(nat) {
      return function(z2) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v2) {
            if (v2.value1.value0 instanceof Pure) {
              var v1 = goApply1(v2.value0)(v2.value1.value1)(pure34(v2.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 54, column 17 - line 56, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v2.value1.value0 instanceof Lift) {
              var v1 = goApply1(v2.value0)(v2.value1.value1)(nat(v2.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 57, column 17 - line 59, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v2.value1.value0 instanceof Ap) {
              var nextVals = new NonEmpty(v2.value1.value0.value1, v2.value1.value1);
              $copy_v = goLeft1(v2.value0)(nextVals)(nat)(v2.value1.value0.value0)(1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 53, column 5 - line 62, column 47): " + [v2.value1.value0.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2(new Tuple(Nil.value, singleton7(z2)));
      };
    };
  };
  var retractFreeAp = function(dictApplicative) {
    return foldFreeAp(dictApplicative)(identity14);
  };
  var applyFreeAp = {
    apply: function(fba) {
      return function(fb) {
        return mkAp(fba)(fb);
      };
    },
    Functor0: function() {
      return functorFreeAp;
    }
  };
  var applicativeFreeAp = /* @__PURE__ */ function() {
    return {
      pure: Pure.create,
      Apply0: function() {
        return applyFreeAp;
      }
    };
  }();
  var foldFreeAp1 = /* @__PURE__ */ foldFreeAp(applicativeFreeAp);
  var hoistFreeAp = function(f) {
    return foldFreeAp1(function($54) {
      return liftFreeAp(f($54));
    });
  };

  // output/Data.CatQueue/index.js
  var CatQueue = /* @__PURE__ */ function() {
    function CatQueue2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatQueue2.create = function(value0) {
      return function(value1) {
        return new CatQueue2(value0, value1);
      };
    };
    return CatQueue2;
  }();
  var uncons3 = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v2) {
      if (v2.value0 instanceof Nil && v2.value1 instanceof Nil) {
        $tco_done = true;
        return Nothing.value;
      }
      ;
      if (v2.value0 instanceof Nil) {
        $copy_v = new CatQueue(reverse2(v2.value1), Nil.value);
        return;
      }
      ;
      if (v2.value0 instanceof Cons) {
        $tco_done = true;
        return new Just(new Tuple(v2.value0.value0, new CatQueue(v2.value0.value1, v2.value1)));
      }
      ;
      throw new Error("Failed pattern match at Data.CatQueue (line 82, column 1 - line 82, column 63): " + [v2.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var snoc3 = function(v2) {
    return function(a3) {
      return new CatQueue(v2.value0, new Cons(a3, v2.value1));
    };
  };
  var $$null3 = function(v2) {
    if (v2.value0 instanceof Nil && v2.value1 instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var empty7 = /* @__PURE__ */ function() {
    return new CatQueue(Nil.value, Nil.value);
  }();

  // output/Data.CatList/index.js
  var CatNil = /* @__PURE__ */ function() {
    function CatNil2() {
    }
    ;
    CatNil2.value = new CatNil2();
    return CatNil2;
  }();
  var CatCons = /* @__PURE__ */ function() {
    function CatCons2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatCons2.create = function(value0) {
      return function(value1) {
        return new CatCons2(value0, value1);
      };
    };
    return CatCons2;
  }();
  var link = function(v2) {
    return function(v1) {
      if (v2 instanceof CatNil) {
        return v1;
      }
      ;
      if (v1 instanceof CatNil) {
        return v2;
      }
      ;
      if (v2 instanceof CatCons) {
        return new CatCons(v2.value0, snoc3(v2.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.CatList (line 108, column 1 - line 108, column 54): " + [v2.constructor.name, v1.constructor.name]);
    };
  };
  var foldr4 = function(k) {
    return function(b2) {
      return function(q3) {
        var foldl6 = function($copy_v) {
          return function($copy_v1) {
            return function($copy_v2) {
              var $tco_var_v = $copy_v;
              var $tco_var_v1 = $copy_v1;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v2, v1, v22) {
                if (v22 instanceof Nil) {
                  $tco_done = true;
                  return v1;
                }
                ;
                if (v22 instanceof Cons) {
                  $tco_var_v = v2;
                  $tco_var_v1 = v2(v1)(v22.value0);
                  $copy_v2 = v22.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.CatList (line 124, column 3 - line 124, column 59): " + [v2.constructor.name, v1.constructor.name, v22.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
              }
              ;
              return $tco_result;
            };
          };
        };
        var go2 = function($copy_xs) {
          return function($copy_ys) {
            var $tco_var_xs = $copy_xs;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(xs, ys) {
              var v2 = uncons3(xs);
              if (v2 instanceof Nothing) {
                $tco_done1 = true;
                return foldl6(function(x2) {
                  return function(i2) {
                    return i2(x2);
                  };
                })(b2)(ys);
              }
              ;
              if (v2 instanceof Just) {
                $tco_var_xs = v2.value0.value1;
                $copy_ys = new Cons(k(v2.value0.value0), ys);
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CatList (line 120, column 14 - line 122, column 67): " + [v2.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_xs, $copy_ys);
            }
            ;
            return $tco_result;
          };
        };
        return go2(q3)(Nil.value);
      };
    };
  };
  var uncons4 = function(v2) {
    if (v2 instanceof CatNil) {
      return Nothing.value;
    }
    ;
    if (v2 instanceof CatCons) {
      return new Just(new Tuple(v2.value0, function() {
        var $66 = $$null3(v2.value1);
        if ($66) {
          return CatNil.value;
        }
        ;
        return foldr4(link)(CatNil.value)(v2.value1);
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.CatList (line 99, column 1 - line 99, column 61): " + [v2.constructor.name]);
  };
  var empty8 = /* @__PURE__ */ function() {
    return CatNil.value;
  }();
  var append4 = link;
  var semigroupCatList = {
    append: append4
  };
  var snoc4 = function(cat) {
    return function(a3) {
      return append4(cat)(new CatCons(a3, empty7));
    };
  };

  // output/Control.Monad.Free/index.js
  var $runtime_lazy6 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var append5 = /* @__PURE__ */ append(semigroupCatList);
  var map21 = /* @__PURE__ */ map(functorFn);
  var Free = /* @__PURE__ */ function() {
    function Free2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Free2.create = function(value0) {
      return function(value1) {
        return new Free2(value0, value1);
      };
    };
    return Free2;
  }();
  var Return = /* @__PURE__ */ function() {
    function Return2(value0) {
      this.value0 = value0;
    }
    ;
    Return2.create = function(value0) {
      return new Return2(value0);
    };
    return Return2;
  }();
  var Bind = /* @__PURE__ */ function() {
    function Bind2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Bind2.create = function(value0) {
      return function(value1) {
        return new Bind2(value0, value1);
      };
    };
    return Bind2;
  }();
  var toView = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v2) {
      var runExpF = function(v23) {
        return v23;
      };
      var concatF = function(v23) {
        return function(r2) {
          return new Free(v23.value0, append5(v23.value1)(r2));
        };
      };
      if (v2.value0 instanceof Return) {
        var v22 = uncons4(v2.value1);
        if (v22 instanceof Nothing) {
          $tco_done = true;
          return new Return(v2.value0.value0);
        }
        ;
        if (v22 instanceof Just) {
          $copy_v = concatF(runExpF(v22.value0.value0)(v2.value0.value0))(v22.value0.value1);
          return;
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 227, column 7 - line 231, column 64): " + [v22.constructor.name]);
      }
      ;
      if (v2.value0 instanceof Bind) {
        $tco_done = true;
        return new Bind(v2.value0.value0, function(a3) {
          return concatF(v2.value0.value1(a3))(v2.value1);
        });
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 225, column 3 - line 233, column 56): " + [v2.value0.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var fromView = function(f) {
    return new Free(f, empty8);
  };
  var freeMonad = {
    Applicative0: function() {
      return freeApplicative;
    },
    Bind1: function() {
      return freeBind;
    }
  };
  var freeFunctor = {
    map: function(k) {
      return function(f) {
        return bindFlipped(freeBind)(function() {
          var $189 = pure(freeApplicative);
          return function($190) {
            return $189(k($190));
          };
        }())(f);
      };
    }
  };
  var freeBind = {
    bind: function(v2) {
      return function(k) {
        return new Free(v2.value0, snoc4(v2.value1)(k));
      };
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var freeApplicative = {
    pure: function($191) {
      return fromView(Return.create($191));
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var $lazy_freeApply = /* @__PURE__ */ $runtime_lazy6("freeApply", "Control.Monad.Free", function() {
    return {
      apply: ap(freeMonad),
      Functor0: function() {
        return freeFunctor;
      }
    };
  });
  var bind7 = /* @__PURE__ */ bind(freeBind);
  var pure3 = /* @__PURE__ */ pure(freeApplicative);
  var liftF = function(f) {
    return fromView(new Bind(f, function($192) {
      return pure3($192);
    }));
  };
  var substFree = function(k) {
    var go2 = function(f) {
      var v2 = toView(f);
      if (v2 instanceof Return) {
        return pure3(v2.value0);
      }
      ;
      if (v2 instanceof Bind) {
        return bind7(k(v2.value0))(map21(go2)(v2.value1));
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 168, column 10 - line 170, column 33): " + [v2.constructor.name]);
    };
    return go2;
  };
  var hoistFree = function(k) {
    return substFree(function($193) {
      return liftF(k($193));
    });
  };
  var foldFree = function(dictMonadRec) {
    var Monad0 = dictMonadRec.Monad0();
    var map126 = map(Monad0.Bind1().Apply0().Functor0());
    var pure114 = pure(Monad0.Applicative0());
    var tailRecM4 = tailRecM(dictMonadRec);
    return function(k) {
      var go2 = function(f) {
        var v2 = toView(f);
        if (v2 instanceof Return) {
          return map126(Done.create)(pure114(v2.value0));
        }
        ;
        if (v2 instanceof Bind) {
          return map126(function($199) {
            return Loop.create(v2.value1($199));
          })(k(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 158, column 10 - line 160, column 37): " + [v2.constructor.name]);
      };
      return tailRecM4(go2);
    };
  };

  // output/Halogen.Query.ChildQuery/index.js
  var ChildQuery = /* @__PURE__ */ function() {
    function ChildQuery3(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    ChildQuery3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new ChildQuery3(value0, value1, value22);
        };
      };
    };
    return ChildQuery3;
  }();
  var unChildQueryBox = unsafeCoerce2;
  var mkChildQueryBox = unsafeCoerce2;

  // output/Halogen.Query.HalogenM/index.js
  var identity15 = /* @__PURE__ */ identity(categoryFn);
  var lookup5 = /* @__PURE__ */ lookup3();
  var over4 = /* @__PURE__ */ over()();
  var SubscriptionId = function(x2) {
    return x2;
  };
  var ForkId = function(x2) {
    return x2;
  };
  var State = /* @__PURE__ */ function() {
    function State2(value0) {
      this.value0 = value0;
    }
    ;
    State2.create = function(value0) {
      return new State2(value0);
    };
    return State2;
  }();
  var Subscribe = /* @__PURE__ */ function() {
    function Subscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Subscribe2.create = function(value0) {
      return function(value1) {
        return new Subscribe2(value0, value1);
      };
    };
    return Subscribe2;
  }();
  var Unsubscribe = /* @__PURE__ */ function() {
    function Unsubscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Unsubscribe2.create = function(value0) {
      return function(value1) {
        return new Unsubscribe2(value0, value1);
      };
    };
    return Unsubscribe2;
  }();
  var Lift2 = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var ChildQuery2 = /* @__PURE__ */ function() {
    function ChildQuery3(value0) {
      this.value0 = value0;
    }
    ;
    ChildQuery3.create = function(value0) {
      return new ChildQuery3(value0);
    };
    return ChildQuery3;
  }();
  var Raise = /* @__PURE__ */ function() {
    function Raise2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Raise2.create = function(value0) {
      return function(value1) {
        return new Raise2(value0, value1);
      };
    };
    return Raise2;
  }();
  var Par = /* @__PURE__ */ function() {
    function Par2(value0) {
      this.value0 = value0;
    }
    ;
    Par2.create = function(value0) {
      return new Par2(value0);
    };
    return Par2;
  }();
  var Fork = /* @__PURE__ */ function() {
    function Fork2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Fork2.create = function(value0) {
      return function(value1) {
        return new Fork2(value0, value1);
      };
    };
    return Fork2;
  }();
  var Join = /* @__PURE__ */ function() {
    function Join2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Join2.create = function(value0) {
      return function(value1) {
        return new Join2(value0, value1);
      };
    };
    return Join2;
  }();
  var Kill = /* @__PURE__ */ function() {
    function Kill2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Kill2.create = function(value0) {
      return function(value1) {
        return new Kill2(value0, value1);
      };
    };
    return Kill2;
  }();
  var GetRef = /* @__PURE__ */ function() {
    function GetRef2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    GetRef2.create = function(value0) {
      return function(value1) {
        return new GetRef2(value0, value1);
      };
    };
    return GetRef2;
  }();
  var HalogenAp = function(x2) {
    return x2;
  };
  var HalogenM = function(x2) {
    return x2;
  };
  var subscribe2 = function(es) {
    return liftF(new Subscribe(function(v2) {
      return es;
    }, identity15));
  };
  var raise = function(o) {
    return liftF(new Raise(o, unit));
  };
  var query = function() {
    return function(dictIsSymbol) {
      var lookup111 = lookup5(dictIsSymbol);
      return function(dictOrd) {
        var lookup26 = lookup111(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(q3) {
              return liftF(new ChildQuery2(mkChildQueryBox(new ChildQuery(function(dictApplicative) {
                var pure114 = pure(dictApplicative);
                return function(k) {
                  var $177 = maybe(pure114(Nothing.value))(k);
                  var $178 = lookup26(label5)(p2);
                  return function($179) {
                    return $177($178($179));
                  };
                };
              }, q3, identity15))));
            };
          };
        };
      };
    };
  };
  var ordSubscriptionId = ordInt;
  var ordForkId = ordInt;
  var monadTransHalogenM = {
    lift: function(dictMonad) {
      return function($180) {
        return HalogenM(liftF(Lift2.create($180)));
      };
    }
  };
  var monadHalogenM = freeMonad;
  var monadStateHalogenM = {
    state: function($181) {
      return HalogenM(liftF(State.create($181)));
    },
    Monad0: function() {
      return monadHalogenM;
    }
  };
  var monadEffectHalogenM = function(dictMonadEffect) {
    return {
      liftEffect: function() {
        var $186 = liftEffect(dictMonadEffect);
        return function($187) {
          return HalogenM(liftF(Lift2.create($186($187))));
        };
      }(),
      Monad0: function() {
        return monadHalogenM;
      }
    };
  };
  var monadAskHalogenM = function(dictMonadAsk) {
    return {
      ask: liftF(new Lift2(ask(dictMonadAsk))),
      Monad0: function() {
        return monadHalogenM;
      }
    };
  };
  var monadAffHalogenM = function(dictMonadAff) {
    var monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      liftAff: function() {
        var $188 = liftAff(dictMonadAff);
        return function($189) {
          return HalogenM(liftF(Lift2.create($188($189))));
        };
      }(),
      MonadEffect0: function() {
        return monadEffectHalogenM1;
      }
    };
  };
  var hoist = function(dictFunctor) {
    return function(nat) {
      return function(v2) {
        var go2 = function(v1) {
          if (v1 instanceof State) {
            return new State(v1.value0);
          }
          ;
          if (v1 instanceof Subscribe) {
            return new Subscribe(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Unsubscribe) {
            return new Unsubscribe(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Lift2) {
            return new Lift2(nat(v1.value0));
          }
          ;
          if (v1 instanceof ChildQuery2) {
            return new ChildQuery2(v1.value0);
          }
          ;
          if (v1 instanceof Raise) {
            return new Raise(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Par) {
            return new Par(over4(HalogenAp)(hoistFreeAp(hoist(dictFunctor)(nat)))(v1.value0));
          }
          ;
          if (v1 instanceof Fork) {
            return new Fork(hoist(dictFunctor)(nat)(v1.value0), v1.value1);
          }
          ;
          if (v1 instanceof Join) {
            return new Join(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof Kill) {
            return new Kill(v1.value0, v1.value1);
          }
          ;
          if (v1 instanceof GetRef) {
            return new GetRef(v1.value0, v1.value1);
          }
          ;
          throw new Error("Failed pattern match at Halogen.Query.HalogenM (line 312, column 8 - line 323, column 29): " + [v1.constructor.name]);
        };
        return hoistFree(go2)(v2);
      };
    };
  };
  var getRef = function(p2) {
    return liftF(new GetRef(p2, identity15));
  };
  var functorHalogenM = freeFunctor;
  var bindHalogenM = freeBind;
  var applicativeHalogenM = freeApplicative;

  // output/Halogen.Query.HalogenQ/index.js
  var Initialize = /* @__PURE__ */ function() {
    function Initialize2(value0) {
      this.value0 = value0;
    }
    ;
    Initialize2.create = function(value0) {
      return new Initialize2(value0);
    };
    return Initialize2;
  }();
  var Finalize = /* @__PURE__ */ function() {
    function Finalize2(value0) {
      this.value0 = value0;
    }
    ;
    Finalize2.create = function(value0) {
      return new Finalize2(value0);
    };
    return Finalize2;
  }();
  var Receive = /* @__PURE__ */ function() {
    function Receive2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Receive2.create = function(value0) {
      return function(value1) {
        return new Receive2(value0, value1);
      };
    };
    return Receive2;
  }();
  var Action2 = /* @__PURE__ */ function() {
    function Action3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Action3.create = function(value0) {
      return function(value1) {
        return new Action3(value0, value1);
      };
    };
    return Action3;
  }();
  var Query = /* @__PURE__ */ function() {
    function Query3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Query3.create = function(value0) {
      return function(value1) {
        return new Query3(value0, value1);
      };
    };
    return Query3;
  }();

  // output/Halogen.VDom.Thunk/index.js
  var $runtime_lazy7 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var Thunk = /* @__PURE__ */ function() {
    function Thunk2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Thunk2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Thunk2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Thunk2;
  }();
  var unsafeEqThunk = function(v2, v1) {
    return refEq2(v2.value0, v1.value0) && (refEq2(v2.value1, v1.value1) && v2.value1(v2.value3, v1.value3));
  };
  var runThunk = function(v2) {
    return v2.value2(v2.value3);
  };
  var mapThunk = function(k) {
    return function(v2) {
      return new Thunk(v2.value0, v2.value1, function($51) {
        return k(v2.value2($51));
      }, v2.value3);
    };
  };
  var hoist2 = mapThunk;
  var buildThunk = function(toVDom) {
    var haltThunk = function(state3) {
      return halt(state3.vdom);
    };
    var $lazy_patchThunk = $runtime_lazy7("patchThunk", "Halogen.VDom.Thunk", function() {
      return function(state3, t2) {
        var $48 = unsafeEqThunk(state3.thunk, t2);
        if ($48) {
          return mkStep(new Step(extract2(state3.vdom), state3, $lazy_patchThunk(112), haltThunk));
        }
        ;
        var vdom = step3(state3.vdom, toVDom(runThunk(t2)));
        return mkStep(new Step(extract2(vdom), {
          vdom,
          thunk: t2
        }, $lazy_patchThunk(115), haltThunk));
      };
    });
    var patchThunk = $lazy_patchThunk(108);
    var renderThunk = function(spec) {
      return function(t2) {
        var vdom = buildVDom(spec)(toVDom(runThunk(t2)));
        return mkStep(new Step(extract2(vdom), {
          thunk: t2,
          vdom
        }, patchThunk, haltThunk));
      };
    };
    return renderThunk;
  };

  // output/Halogen.Component/index.js
  var voidLeft3 = /* @__PURE__ */ voidLeft(functorHalogenM);
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var map24 = /* @__PURE__ */ map(functorHalogenM);
  var lmap2 = /* @__PURE__ */ lmap(bifunctorHTML);
  var map111 = /* @__PURE__ */ map(functorFn);
  var map25 = /* @__PURE__ */ map(functorMaybe);
  var bimap4 = /* @__PURE__ */ bimap(bifunctorHTML);
  var pure4 = /* @__PURE__ */ pure(applicativeHalogenM);
  var lookup6 = /* @__PURE__ */ lookup3();
  var pop3 = /* @__PURE__ */ pop2();
  var insert4 = /* @__PURE__ */ insert3();
  var ComponentSlot = /* @__PURE__ */ function() {
    function ComponentSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ComponentSlot2.create = function(value0) {
      return new ComponentSlot2(value0);
    };
    return ComponentSlot2;
  }();
  var ThunkSlot = /* @__PURE__ */ function() {
    function ThunkSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ThunkSlot2.create = function(value0) {
      return new ThunkSlot2(value0);
    };
    return ThunkSlot2;
  }();
  var unComponentSlot = unsafeCoerce2;
  var unComponent = unsafeCoerce2;
  var mkEval = function(args) {
    return function(v2) {
      if (v2 instanceof Initialize) {
        return voidLeft3(traverse_4(args.handleAction)(args.initialize))(v2.value0);
      }
      ;
      if (v2 instanceof Finalize) {
        return voidLeft3(traverse_4(args.handleAction)(args.finalize))(v2.value0);
      }
      ;
      if (v2 instanceof Receive) {
        return voidLeft3(traverse_4(args.handleAction)(args.receive(v2.value0)))(v2.value1);
      }
      ;
      if (v2 instanceof Action2) {
        return voidLeft3(args.handleAction(v2.value0))(v2.value1);
      }
      ;
      if (v2 instanceof Query) {
        return unCoyoneda(function(g2) {
          var $45 = map24(maybe(v2.value1(unit))(g2));
          return function($46) {
            return $45(args.handleQuery($46));
          };
        })(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Halogen.Component (line 182, column 15 - line 192, column 71): " + [v2.constructor.name]);
    };
  };
  var mkComponentSlot = unsafeCoerce2;
  var mkComponent = unsafeCoerce2;
  var hoistSlot = function(dictFunctor) {
    return function(nat) {
      return function(v2) {
        if (v2 instanceof ComponentSlot) {
          return unComponentSlot(function(slot4) {
            return new ComponentSlot(mkComponentSlot({
              get: slot4.get,
              pop: slot4.pop,
              set: slot4.set,
              component: hoist3(dictFunctor)(nat)(slot4.component),
              input: slot4.input,
              output: slot4.output
            }));
          })(v2.value0);
        }
        ;
        if (v2 instanceof ThunkSlot) {
          return new ThunkSlot(hoist2(lmap2(hoistSlot(dictFunctor)(nat)))(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Component (line 279, column 17 - line 284, column 53): " + [v2.constructor.name]);
      };
    };
  };
  var hoist3 = function(dictFunctor) {
    var hoist1 = hoist(dictFunctor);
    return function(nat) {
      return unComponent(function(c2) {
        return mkComponent({
          initialState: c2.initialState,
          render: function() {
            var $47 = lmap2(hoistSlot(dictFunctor)(nat));
            return function($48) {
              return $47(c2.render($48));
            };
          }(),
          "eval": function() {
            var $49 = hoist1(nat);
            return function($50) {
              return $49(c2["eval"]($50));
            };
          }()
        });
      });
    };
  };
  var functorComponentSlotBox = {
    map: function(f) {
      return unComponentSlot(function(slot4) {
        return mkComponentSlot({
          get: slot4.get,
          pop: slot4.pop,
          set: slot4.set,
          component: slot4.component,
          input: slot4.input,
          output: map111(map25(f))(slot4.output)
        });
      });
    }
  };
  var map32 = /* @__PURE__ */ map(functorComponentSlotBox);
  var functorComponentSlot = {
    map: function(f) {
      return function(v2) {
        if (v2 instanceof ComponentSlot) {
          return new ComponentSlot(map32(f)(v2.value0));
        }
        ;
        if (v2 instanceof ThunkSlot) {
          return new ThunkSlot(mapThunk(bimap4(map(functorComponentSlot)(f))(f))(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Component (line 209, column 11 - line 211, column 74): " + [v2.constructor.name]);
      };
    }
  };
  var defaultEval = /* @__PURE__ */ function() {
    return {
      handleAction: $$const(pure4(unit)),
      handleQuery: $$const(pure4(Nothing.value)),
      receive: $$const(Nothing.value),
      initialize: Nothing.value,
      finalize: Nothing.value
    };
  }();
  var componentSlot = function() {
    return function(dictIsSymbol) {
      var lookup111 = lookup6(dictIsSymbol);
      var pop12 = pop3(dictIsSymbol);
      var insert14 = insert4(dictIsSymbol);
      return function(dictOrd) {
        var lookup26 = lookup111(dictOrd);
        var pop22 = pop12(dictOrd);
        var insert22 = insert14(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(comp) {
              return function(input3) {
                return function(output2) {
                  return mkComponentSlot({
                    get: lookup26(label5)(p2),
                    pop: pop22(label5)(p2),
                    set: insert22(label5)(p2),
                    component: comp,
                    input: input3,
                    output: output2
                  });
                };
              };
            };
          };
        };
      };
    };
  };

  // output/Control.Monad.Fork.Class/index.js
  var monadForkAff = {
    suspend: suspendAff,
    fork: forkAff,
    join: joinFiber,
    Monad0: function() {
      return monadAff;
    },
    Functor1: function() {
      return functorFiber;
    }
  };
  var fork = function(dict) {
    return dict.fork;
  };

  // output/Halogen.Query/index.js
  var $$void8 = /* @__PURE__ */ $$void(functorHalogenM);
  var query2 = /* @__PURE__ */ query();
  var identity16 = /* @__PURE__ */ identity(categoryFn);
  var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var tell2 = function() {
    return function(dictIsSymbol) {
      var query1 = query2(dictIsSymbol);
      return function(dictOrd) {
        var query22 = query1(dictOrd);
        return function(slot4) {
          return function(label5) {
            return function(req2) {
              return $$void8(query22(slot4)(label5)(req2(unit)));
            };
          };
        };
      };
    };
  };
  var request = function() {
    return function(dictIsSymbol) {
      var query1 = query2(dictIsSymbol);
      return function(dictOrd) {
        var query22 = query1(dictOrd);
        return function(slot4) {
          return function(label5) {
            return function(req2) {
              return query22(slot4)(label5)(req2(identity16));
            };
          };
        };
      };
    };
  };
  var getHTMLElementRef = /* @__PURE__ */ function() {
    var $24 = map(functorHalogenM)(function(v2) {
      return bindFlipped4(fromElement)(v2);
    });
    return function($25) {
      return $24(getRef($25));
    };
  }();

  // output/Halogen.Store.Select/index.js
  var unless2 = /* @__PURE__ */ unless(applicativeEffect);
  var selectEmitter = function(v2) {
    return function(emitter) {
      return makeEmitter(function(push2) {
        return function __do5() {
          var previousDerivedRef = $$new(Nothing.value)();
          var subscription = subscribe(emitter)(function(store) {
            return function __do6() {
              var previousDerived = read(previousDerivedRef)();
              var newDerived = v2.select(store);
              var isUnchanged = maybe(false)(v2.eq(newDerived))(previousDerived);
              return unless2(isUnchanged)(function __do7() {
                write(new Just(newDerived))(previousDerivedRef)();
                return push2(newDerived)();
              })();
            };
          })();
          return unsubscribe(subscription);
        };
      });
    };
  };

  // output/Halogen.Store.Monad/index.js
  var bind12 = /* @__PURE__ */ bind(bindAff);
  var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure1 = /* @__PURE__ */ pure(applicativeAff);
  var map26 = /* @__PURE__ */ map(functorAff);
  var lift7 = /* @__PURE__ */ lift(monadTransHalogenM);
  var lift62 = /* @__PURE__ */ lift(monadTransReaderT);
  var monadStoreT = function(dictMonad) {
    return monadReaderT(dictMonad);
  };
  var monadEffectStoreT = function(dictMonadEffect) {
    return monadEffectReader(dictMonadEffect);
  };
  var monadStoreStoreT = function(dictMonadEffect) {
    var Monad0 = dictMonadEffect.Monad0();
    var bind210 = bind(bindReaderT(Monad0.Bind1()));
    var ask2 = ask(monadAskReaderT(Monad0));
    var liftEffect13 = liftEffect(monadEffectReader(dictMonadEffect));
    var pure210 = pure(Monad0.Applicative0());
    var monadEffectStoreT1 = monadEffectStoreT(dictMonadEffect);
    return {
      getStore: bind210(ask2)(function(store) {
        return liftEffect13(read(store.value));
      }),
      updateStore: function(action2) {
        return bind210(ask2)(function(store) {
          return liftEffect13(function __do5() {
            var current = read(store.value)();
            var newStore = store.reducer(current)(action2);
            write(newStore)(store.value)();
            return notify(store.listener)(newStore)();
          });
        });
      },
      emitSelected: function(selector2) {
        var $247 = selectEmitter(selector2);
        return function($248) {
          return pure210($247(function(v2) {
            return v2.emitter;
          }($248)));
        };
      },
      MonadEffect0: function() {
        return monadEffectStoreT1;
      }
    };
  };
  var monadAffStoreT = function(dictMonadAff) {
    return monadAffReader(dictMonadAff);
  };
  var functorStoreT = function(dictFunctor) {
    return functorReaderT(dictFunctor);
  };
  var updateStore = function(dict) {
    return dict.updateStore;
  };
  var runAndEmitStoreT = function(dictMonad) {
    var hoist5 = hoist3(dictMonad.Bind1().Apply0().Functor0());
    return function(initialStore) {
      return function(reducer) {
        return function(component14) {
          return bind12(liftEffect4(function __do5() {
            var value14 = $$new(initialStore)();
            var v2 = create3();
            return {
              value: value14,
              emitter: v2.emitter,
              listener: v2.listener,
              reducer
            };
          }))(function(hs) {
            return pure1({
              emitter: hs.emitter,
              component: hoist5(function(v2) {
                return runReaderT(v2)(hs);
              })(component14)
            });
          });
        };
      };
    };
  };
  var runStoreT = function(dictMonad) {
    var runAndEmitStoreT1 = runAndEmitStoreT(dictMonad);
    return function(initialStore) {
      return function(reducer) {
        return function(component14) {
          return map26(function(v2) {
            return v2.component;
          })(runAndEmitStoreT1(initialStore)(reducer)(component14));
        };
      };
    };
  };
  var getStore = function(dict) {
    return dict.getStore;
  };
  var emitSelected = function(dict) {
    return dict.emitSelected;
  };
  var monadStoreHalogenM = function(dictMonadStore) {
    var MonadEffect0 = dictMonadStore.MonadEffect0();
    var lift9 = lift7(MonadEffect0.Monad0());
    var monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    return {
      getStore: lift9(getStore(dictMonadStore)),
      updateStore: function() {
        var $251 = updateStore(dictMonadStore);
        return function($252) {
          return lift9($251($252));
        };
      }(),
      emitSelected: function() {
        var $253 = emitSelected(dictMonadStore);
        return function($254) {
          return lift9($253($254));
        };
      }(),
      MonadEffect0: function() {
        return monadEffectHalogenM2;
      }
    };
  };
  var monadStoreReaderT = function(dictMonadStore) {
    var MonadEffect0 = dictMonadStore.MonadEffect0();
    var lift9 = lift62(MonadEffect0.Monad0());
    var monadEffectReader2 = monadEffectReader(MonadEffect0);
    return {
      getStore: lift9(getStore(dictMonadStore)),
      updateStore: function() {
        var $277 = updateStore(dictMonadStore);
        return function($278) {
          return lift9($277($278));
        };
      }(),
      emitSelected: function() {
        var $279 = emitSelected(dictMonadStore);
        return function($280) {
          return lift9($279($280));
        };
      }(),
      MonadEffect0: function() {
        return monadEffectReader2;
      }
    };
  };

  // output/AppM/index.js
  var monadStoreT2 = /* @__PURE__ */ monadStoreT(monadAff);
  var functorStoreT2 = /* @__PURE__ */ functorStoreT(functorAff);
  var bind8 = /* @__PURE__ */ bind(bindAff);
  var discard4 = /* @__PURE__ */ discard(discardUnit)(bindAff);
  var pure5 = /* @__PURE__ */ pure(applicativeAff);
  var hoist4 = /* @__PURE__ */ hoist3(functorStoreT2);
  var runStoreT2 = /* @__PURE__ */ runStoreT(monadAff);
  var monadStoreGameEventGameEv = /* @__PURE__ */ monadStoreReaderT(/* @__PURE__ */ monadStoreStoreT(monadEffectAff));
  var monadAskGlobalStateAppM = /* @__PURE__ */ monadAskReaderT(monadStoreT2);
  var monadAffAppM = /* @__PURE__ */ monadAffReader(/* @__PURE__ */ monadAffStoreT(monadAffAff));
  var initialGlobalState = /* @__PURE__ */ bind8(/* @__PURE__ */ liftEffect(monadEffectAff)(newChatServer))(function(chatServer) {
    return discard4(runChatServer(chatServer))(function() {
      return pure5({
        chatServer
      });
    });
  });
  var runAppM = function(component14) {
    return bind8(initialGlobalState)(function(store) {
      var storeComponent = hoist4(function(v2) {
        return runReaderT(v2)(store);
      })(component14);
      return runStoreT2(empty4)(flip(cons3))(storeComponent);
    });
  };

  // output/Data.Array.NonEmpty.Internal/foreign.js
  var traverse1Impl = function() {
    function Cont(fn) {
      this.fn = fn;
    }
    var emptyList = {};
    var ConsCell = function(head7, tail3) {
      this.head = head7;
      this.tail = tail3;
    };
    function finalCell(head7) {
      return new ConsCell(head7, emptyList);
    }
    function consList(x2) {
      return function(xs) {
        return new ConsCell(x2, xs);
      };
    }
    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }
    return function(apply7, map60, f) {
      var buildFrom = function(x2, ys) {
        return apply7(map60(consList)(f(x2)))(ys);
      };
      var go2 = function(acc, currentLen, xs) {
        if (currentLen === 0) {
          return acc;
        } else {
          var last4 = xs[currentLen - 1];
          return new Cont(function() {
            var built = go2(buildFrom(last4, acc), currentLen - 1, xs);
            return built;
          });
        }
      };
      return function(array) {
        var acc = map60(finalCell)(f(array[array.length - 1]));
        var result = go2(acc, array.length - 1, array);
        while (result instanceof Cont) {
          result = result.fn();
        }
        return map60(listToArray)(result);
      };
    };
  }();

  // output/Data.Array.NonEmpty.Internal/index.js
  var NonEmptyArray = function(x2) {
    return x2;
  };
  var semigroupNonEmptyArray = semigroupArray;
  var functorNonEmptyArray = functorArray;
  var foldableNonEmptyArray = foldableArray;

  // output/Data.Array.NonEmpty/index.js
  var fromJust5 = /* @__PURE__ */ fromJust();
  var unsafeFromArray = NonEmptyArray;
  var toArray2 = function(v2) {
    return v2;
  };
  var snoc$prime = function(xs) {
    return function(x2) {
      return unsafeFromArray(snoc(xs)(x2));
    };
  };
  var snoc5 = function(xs) {
    return function(x2) {
      return unsafeFromArray(snoc(toArray2(xs))(x2));
    };
  };
  var singleton9 = function($110) {
    return unsafeFromArray(singleton2($110));
  };
  var fromArray = function(xs) {
    if (length5(xs) > 0) {
      return new Just(unsafeFromArray(xs));
    }
    ;
    if (otherwise) {
      return Nothing.value;
    }
    ;
    throw new Error("Failed pattern match at Data.Array.NonEmpty (line 161, column 1 - line 161, column 58): " + [xs.constructor.name]);
  };
  var cons$prime = function(x2) {
    return function(xs) {
      return unsafeFromArray(cons(x2)(xs));
    };
  };
  var adaptMaybe = function(f) {
    return function($126) {
      return fromJust5(f(toArray2($126)));
    };
  };
  var head4 = /* @__PURE__ */ adaptMaybe(head);
  var init3 = /* @__PURE__ */ adaptMaybe(init);
  var last3 = /* @__PURE__ */ adaptMaybe(last);
  var tail2 = /* @__PURE__ */ adaptMaybe(tail);
  var adaptAny = function(f) {
    return function($128) {
      return f(toArray2($128));
    };
  };
  var unsafeAdapt = function(f) {
    var $129 = adaptAny(f);
    return function($130) {
      return unsafeFromArray($129($130));
    };
  };
  var cons5 = function(x2) {
    return unsafeAdapt(cons(x2));
  };

  // output/Data.Bifoldable/index.js
  var bifoldableTuple = {
    bifoldMap: function(dictMonoid) {
      var append21 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(g2) {
          return function(v2) {
            return append21(f(v2.value0))(g2(v2.value1));
          };
        };
      };
    },
    bifoldr: function(f) {
      return function(g2) {
        return function(z2) {
          return function(v2) {
            return f(v2.value0)(g2(v2.value1)(z2));
          };
        };
      };
    },
    bifoldl: function(f) {
      return function(g2) {
        return function(z2) {
          return function(v2) {
            return g2(f(z2)(v2.value0))(v2.value1);
          };
        };
      };
    }
  };

  // output/Data.Bitraversable/index.js
  var bitraverse = function(dict) {
    return dict.bitraverse;
  };
  var ltraverse = function(dictBitraversable) {
    var bitraverse1 = bitraverse(dictBitraversable);
    return function(dictApplicative) {
      var bitraverse22 = bitraverse1(dictApplicative);
      var pure34 = pure(dictApplicative);
      return function(f) {
        return bitraverse22(f)(pure34);
      };
    };
  };
  var bitraversableTuple = {
    bitraverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply7 = apply(Apply0);
      var map60 = map(Apply0.Functor0());
      return function(f) {
        return function(g2) {
          return function(v2) {
            return apply7(map60(Tuple.create)(f(v2.value0)))(g2(v2.value1));
          };
        };
      };
    },
    bisequence: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply7 = apply(Apply0);
      var map60 = map(Apply0.Functor0());
      return function(v2) {
        return apply7(map60(Tuple.create)(v2.value0))(v2.value1);
      };
    },
    Bifunctor0: function() {
      return bifunctorTuple;
    },
    Bifoldable1: function() {
      return bifoldableTuple;
    }
  };

  // output/JSURI/foreign.js
  function encodeURIComponent_to_RFC3986(input3) {
    return input3.replace(/[!'()*]/g, function(c2) {
      return "%" + c2.charCodeAt(0).toString(16);
    });
  }
  function _encodeURIComponent(fail2, succeed, input3) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input3)));
    } catch (err) {
      return fail2(err);
    }
  }
  function _decodeURIComponent(fail2, succeed, input3) {
    try {
      return succeed(decodeURIComponent(input3));
    } catch (err) {
      return fail2(err);
    }
  }

  // output/JSURI/index.js
  var $$encodeURIComponent = /* @__PURE__ */ function() {
    return runFn3(_encodeURIComponent)($$const(Nothing.value))(Just.create);
  }();
  var $$decodeURIComponent = /* @__PURE__ */ function() {
    return runFn3(_decodeURIComponent)($$const(Nothing.value))(Just.create);
  }();

  // output/Routing.Duplex.Types/index.js
  var emptyRouteState = {
    segments: [],
    params: [],
    hash: ""
  };

  // output/Routing.Duplex.Parser/index.js
  var $runtime_lazy8 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var bitraverse2 = /* @__PURE__ */ bitraverse(bitraversableTuple)(applicativeEither);
  var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeEither);
  var map27 = /* @__PURE__ */ map(functorNonEmptyArray);
  var map112 = /* @__PURE__ */ map(functorFn);
  var foldl4 = /* @__PURE__ */ foldl(foldableNonEmptyArray);
  var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindEither);
  var append6 = /* @__PURE__ */ append(semigroupNonEmptyArray);
  var Expected = /* @__PURE__ */ function() {
    function Expected2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Expected2.create = function(value0) {
      return function(value1) {
        return new Expected2(value0, value1);
      };
    };
    return Expected2;
  }();
  var ExpectedEndOfPath = /* @__PURE__ */ function() {
    function ExpectedEndOfPath2(value0) {
      this.value0 = value0;
    }
    ;
    ExpectedEndOfPath2.create = function(value0) {
      return new ExpectedEndOfPath2(value0);
    };
    return ExpectedEndOfPath2;
  }();
  var MalformedURIComponent = /* @__PURE__ */ function() {
    function MalformedURIComponent2(value0) {
      this.value0 = value0;
    }
    ;
    MalformedURIComponent2.create = function(value0) {
      return new MalformedURIComponent2(value0);
    };
    return MalformedURIComponent2;
  }();
  var EndOfPath = /* @__PURE__ */ function() {
    function EndOfPath2() {
    }
    ;
    EndOfPath2.value = new EndOfPath2();
    return EndOfPath2;
  }();
  var Fail = /* @__PURE__ */ function() {
    function Fail3(value0) {
      this.value0 = value0;
    }
    ;
    Fail3.create = function(value0) {
      return new Fail3(value0);
    };
    return Fail3;
  }();
  var Success = /* @__PURE__ */ function() {
    function Success2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Success2.create = function(value0) {
      return function(value1) {
        return new Success2(value0, value1);
      };
    };
    return Success2;
  }();
  var Alt = /* @__PURE__ */ function() {
    function Alt2(value0) {
      this.value0 = value0;
    }
    ;
    Alt2.create = function(value0) {
      return new Alt2(value0);
    };
    return Alt2;
  }();
  var Chomp = /* @__PURE__ */ function() {
    function Chomp2(value0) {
      this.value0 = value0;
    }
    ;
    Chomp2.create = function(value0) {
      return new Chomp2(value0);
    };
    return Chomp2;
  }();
  var Prefix = /* @__PURE__ */ function() {
    function Prefix2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Prefix2.create = function(value0) {
      return function(value1) {
        return new Prefix2(value0, value1);
      };
    };
    return Prefix2;
  }();
  var take4 = /* @__PURE__ */ function() {
    return new Chomp(function(state3) {
      var v2 = uncons(state3.segments);
      if (v2 instanceof Just) {
        return new Success({
          segments: v2.value0.tail,
          params: state3.params,
          hash: state3.hash
        }, v2.value0.head);
      }
      ;
      return new Fail(EndOfPath.value);
    });
  }();
  var prefix = /* @__PURE__ */ function() {
    return Prefix.create;
  }();
  var parsePath = /* @__PURE__ */ function() {
    var toRouteState = function(v2) {
      return {
        segments: v2.value0.value0,
        params: v2.value0.value1,
        hash: v2.value1
      };
    };
    var splitNonEmpty = function(v2) {
      return function(v1) {
        if (v1 === "") {
          return [];
        }
        ;
        return split(v2)(v1);
      };
    };
    var splitAt4 = function(k) {
      return function(p2) {
        return function(str2) {
          var v2 = indexOf(p2)(str2);
          if (v2 instanceof Just) {
            return new Tuple(take2(v2.value0)(str2), drop3(v2.value0 + length7(p2) | 0)(str2));
          }
          ;
          if (v2 instanceof Nothing) {
            return k(str2);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 191, column 5 - line 193, column 23): " + [v2.constructor.name]);
        };
      };
    };
    var decodeURIComponent$prime = function(str2) {
      var v2 = $$decodeURIComponent(str2);
      if (v2 instanceof Nothing) {
        return new Left(new MalformedURIComponent(str2));
      }
      ;
      if (v2 instanceof Just) {
        return new Right(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Routing.Duplex.Parser (line 195, column 29 - line 197, column 22): " + [v2.constructor.name]);
    };
    var splitKeyValue = function() {
      var $349 = bitraverse2(decodeURIComponent$prime)(decodeURIComponent$prime);
      var $350 = splitAt4(flip(Tuple.create)(""))("=");
      return function($351) {
        return $349($350($351));
      };
    }();
    var splitParams = function() {
      var $352 = traverse2(splitKeyValue);
      var $353 = splitNonEmpty("&");
      return function($354) {
        return $352($353($354));
      };
    }();
    var splitSegments = function() {
      var $355 = splitNonEmpty("/");
      return function($356) {
        return function(v2) {
          if (v2.length === 2 && (v2[0] === "" && v2[1] === "")) {
            return new Right([""]);
          }
          ;
          return traverse2(decodeURIComponent$prime)(v2);
        }($355($356));
      };
    }();
    var splitPath = function() {
      var $357 = bitraverse2(splitSegments)(splitParams);
      var $358 = splitAt4(flip(Tuple.create)(""))("?");
      return function($359) {
        return $357($358($359));
      };
    }();
    var $360 = map(functorEither)(toRouteState);
    var $361 = ltraverse(bitraversableTuple)(applicativeEither)(splitPath);
    var $362 = splitAt4(flip(Tuple.create)(""))("#");
    return function($363) {
      return $360($361($362($363)));
    };
  }();
  var functorRouteResult = {
    map: function(f) {
      return function(m2) {
        if (m2 instanceof Fail) {
          return new Fail(m2.value0);
        }
        ;
        if (m2 instanceof Success) {
          return new Success(m2.value0, f(m2.value1));
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m2.constructor.name]);
      };
    }
  };
  var map28 = /* @__PURE__ */ map(functorRouteResult);
  var functorRouteParser = {
    map: function(f) {
      return function(m2) {
        if (m2 instanceof Alt) {
          return new Alt(map27(map(functorRouteParser)(f))(m2.value0));
        }
        ;
        if (m2 instanceof Chomp) {
          return new Chomp(map112(map28(f))(m2.value0));
        }
        ;
        if (m2 instanceof Prefix) {
          return new Prefix(m2.value0, map(functorRouteParser)(f)(m2.value1));
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m2.constructor.name]);
      };
    }
  };
  var end = /* @__PURE__ */ function() {
    return new Chomp(function(state3) {
      var v2 = head(state3.segments);
      if (v2 instanceof Nothing) {
        return new Success(state3, unit);
      }
      ;
      if (v2 instanceof Just) {
        return new Fail(new ExpectedEndOfPath(v2.value0));
      }
      ;
      throw new Error("Failed pattern match at Routing.Duplex.Parser (line 266, column 3 - line 268, column 45): " + [v2.constructor.name]);
    });
  }();
  var chompPrefix = function(pre2) {
    return function(state3) {
      var v2 = head(state3.segments);
      if (v2 instanceof Just && pre2 === v2.value0) {
        return new Success({
          segments: drop(1)(state3.segments),
          params: state3.params,
          hash: state3.hash
        }, unit);
      }
      ;
      if (v2 instanceof Just) {
        return new Fail(new Expected(pre2, v2.value0));
      }
      ;
      return new Fail(EndOfPath.value);
    };
  };
  var $lazy_runRouteParser = /* @__PURE__ */ $runtime_lazy8("runRouteParser", "Routing.Duplex.Parser", function() {
    var goAlt = function(v2) {
      return function(v1) {
        return function(v22) {
          if (v1 instanceof Fail) {
            return $lazy_runRouteParser(161)(v2)(v22);
          }
          ;
          return v1;
        };
      };
    };
    var go2 = function($copy_state) {
      return function($copy_v) {
        var $tco_var_state = $copy_state;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(state3, v2) {
          if (v2 instanceof Alt) {
            $tco_done = true;
            return foldl4(goAlt(state3))(new Fail(EndOfPath.value))(v2.value0);
          }
          ;
          if (v2 instanceof Chomp) {
            $tco_done = true;
            return v2.value0(state3);
          }
          ;
          if (v2 instanceof Prefix) {
            var v1 = chompPrefix(v2.value0)(state3);
            if (v1 instanceof Fail) {
              $tco_done = true;
              return new Fail(v1.value0);
            }
            ;
            if (v1 instanceof Success) {
              $tco_var_state = v1.value0;
              $copy_v = v2.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Routing.Duplex.Parser (line 157, column 7 - line 159, column 40): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 153, column 14 - line 159, column 40): " + [v2.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_state, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go2;
  });
  var runRouteParser = /* @__PURE__ */ $lazy_runRouteParser(150);
  var run3 = function(p2) {
    return composeKleisli2(parsePath)(function() {
      var $366 = flip(runRouteParser)(p2);
      return function($367) {
        return function(v2) {
          if (v2 instanceof Fail) {
            return new Left(v2.value0);
          }
          ;
          if (v2 instanceof Success) {
            return new Right(v2.value1);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 200, column 49 - line 202, column 29): " + [v2.constructor.name]);
        }($366($367));
      };
    }());
  };
  var applyRouteParser = {
    apply: function(fx) {
      return function(x2) {
        return new Chomp(function(state3) {
          var v2 = runRouteParser(state3)(fx);
          if (v2 instanceof Fail) {
            return new Fail(v2.value0);
          }
          ;
          if (v2 instanceof Success) {
            return map28(v2.value1)(runRouteParser(v2.value0)(x2));
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 81, column 5 - line 83, column 56): " + [v2.constructor.name]);
        });
      };
    },
    Functor0: function() {
      return functorRouteParser;
    }
  };
  var applicativeRouteParser = {
    pure: /* @__PURE__ */ function() {
      var $368 = flip(Success.create);
      return function($369) {
        return Chomp.create($368($369));
      };
    }(),
    Apply0: function() {
      return applyRouteParser;
    }
  };
  var altSnoc = function(v2) {
    return function(v1) {
      var v22 = function(v3) {
        return snoc5(v2)(v1);
      };
      if (v1 instanceof Prefix) {
        var $310 = last3(v2);
        if ($310 instanceof Prefix) {
          var $311 = v1.value0 === $310.value0;
          if ($311) {
            return snoc$prime(init3(v2))(new Prefix(v1.value0, alt(altRouteParser)($310.value1)(v1.value1)));
          }
          ;
          return v22(true);
        }
        ;
        return v22(true);
      }
      ;
      return v22(true);
    };
  };
  var altRouteParser = {
    alt: function(v2) {
      return function(v1) {
        if (v2 instanceof Alt && v1 instanceof Alt) {
          return new Alt(altAppend(v2.value0)(v1.value0));
        }
        ;
        if (v2 instanceof Alt) {
          return new Alt(altSnoc(v2.value0)(v1));
        }
        ;
        if (v1 instanceof Alt) {
          return new Alt(altCons(v2)(v1.value0));
        }
        ;
        if (v2 instanceof Prefix && (v1 instanceof Prefix && v2.value0 === v1.value0)) {
          return new Prefix(v2.value0, alt(altRouteParser)(v2.value1)(v1.value1));
        }
        ;
        return new Alt(cons5(v2)(singleton9(v1)));
      };
    },
    Functor0: function() {
      return functorRouteParser;
    }
  };
  var altCons = function(v2) {
    return function(v1) {
      var v22 = function(v3) {
        return cons5(v2)(v1);
      };
      if (v2 instanceof Prefix) {
        var $330 = head4(v1);
        if ($330 instanceof Prefix) {
          var $331 = v2.value0 === $330.value0;
          if ($331) {
            return cons$prime(new Prefix(v2.value0, alt(altRouteParser)(v2.value1)($330.value1)))(tail2(v1));
          }
          ;
          return v22(true);
        }
        ;
        return v22(true);
      }
      ;
      return v22(true);
    };
  };
  var altAppend = function($copy_ls) {
    return function($copy_rs) {
      var $tco_var_ls = $copy_ls;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(ls, rs) {
        var v2 = function(v12) {
          if (otherwise) {
            return append6(ls)(rs);
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 103, column 1 - line 107, column 35): " + [ls.constructor.name, rs.constructor.name]);
        };
        var $340 = last3(ls);
        if ($340 instanceof Prefix) {
          var $341 = head4(rs);
          if ($341 instanceof Prefix) {
            var $342 = $340.value0 === $341.value0;
            if ($342) {
              var rs$prime = cons$prime(new Prefix($340.value0, alt(altRouteParser)($340.value1)($341.value1)))(tail2(rs));
              var v1 = fromArray(init3(ls));
              if (v1 instanceof Just) {
                $tco_var_ls = v1.value0;
                $copy_rs = rs$prime;
                return;
              }
              ;
              if (v1 instanceof Nothing) {
                $tco_done = true;
                return rs$prime;
              }
              ;
              throw new Error("Failed pattern match at Routing.Duplex.Parser (line 116, column 9 - line 118, column 25): " + [v1.constructor.name]);
            }
            ;
            $tco_done = true;
            return v2(true);
          }
          ;
          $tco_done = true;
          return v2(true);
        }
        ;
        $tco_done = true;
        return v2(true);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_ls, $copy_rs);
      }
      ;
      return $tco_result;
    };
  };

  // output/Routing.Duplex.Printer/index.js
  var append7 = /* @__PURE__ */ append(/* @__PURE__ */ semigroupMaybe(semigroupString));
  var semigroupRoutePrinter = {
    append: function(v2) {
      return function(v1) {
        return function($33) {
          return v1(v2($33));
        };
      };
    }
  };
  var put2 = function(str2) {
    return function(state3) {
      return {
        segments: snoc(state3.segments)(str2),
        params: state3.params,
        hash: state3.hash
      };
    };
  };
  var printPath = function(v2) {
    var printSegments = function(v1) {
      if (v1.length === 1 && v1[0] === "") {
        return "/";
      }
      ;
      return joinWith("/")(mapMaybe($$encodeURIComponent)(v1));
    };
    var printParam = function(v1) {
      return function(v22) {
        if (v22 === "") {
          return $$encodeURIComponent(v1);
        }
        ;
        return append7($$encodeURIComponent(v1))(append7(new Just("="))($$encodeURIComponent(v22)));
      };
    };
    var printParams = function(v1) {
      if (v1.length === 0) {
        return "";
      }
      ;
      return "?" + joinWith("&")(mapMaybe(uncurry(printParam))(v1));
    };
    var printHash = function(v1) {
      if (v1 === "") {
        return "";
      }
      ;
      return "#" + v1;
    };
    return printSegments(v2.segments) + (printParams(v2.params) + printHash(v2.hash));
  };
  var run4 = /* @__PURE__ */ function() {
    var $34 = applyFlipped(emptyRouteState);
    var $35 = unwrap();
    return function($36) {
      return printPath($34($35($36)));
    };
  }();
  var monoidRoutePRinter = {
    mempty: /* @__PURE__ */ identity(categoryFn),
    Semigroup0: function() {
      return semigroupRoutePrinter;
    }
  };

  // output/Routing.Duplex/index.js
  var append8 = /* @__PURE__ */ append(semigroupRoutePrinter);
  var applyFirst2 = /* @__PURE__ */ applyFirst(applyRouteParser);
  var pure6 = /* @__PURE__ */ pure(applicativeRouteParser);
  var apply2 = /* @__PURE__ */ apply(applyRouteParser);
  var map29 = /* @__PURE__ */ map(functorRouteParser);
  var mempty2 = /* @__PURE__ */ mempty(monoidRoutePRinter);
  var apply1 = /* @__PURE__ */ apply(applyFn);
  var map113 = /* @__PURE__ */ map(functorFn);
  var RouteDuplex = /* @__PURE__ */ function() {
    function RouteDuplex2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RouteDuplex2.create = function(value0) {
      return function(value1) {
        return new RouteDuplex2(value0, value1);
      };
    };
    return RouteDuplex2;
  }();
  var segment = /* @__PURE__ */ function() {
    return new RouteDuplex(put2, take4);
  }();
  var profunctorRouteDuplex = {
    dimap: function(f) {
      return function(g2) {
        return function(v2) {
          return new RouteDuplex(function($137) {
            return v2.value0(f($137));
          }, map29(g2)(v2.value1));
        };
      };
    }
  };
  var print6 = function(v2) {
    return function($138) {
      return run4(v2.value0($138));
    };
  };
  var prefix2 = function(s2) {
    return function(v2) {
      return new RouteDuplex(function(a3) {
        return append8(put2(s2))(v2.value0(a3));
      }, prefix(s2)(v2.value1));
    };
  };
  var path = /* @__PURE__ */ function() {
    var $139 = flip(foldr(foldableArray)(prefix2));
    var $140 = split("/");
    return function($141) {
      return $139($140($141));
    };
  }();
  var root = /* @__PURE__ */ path("");
  var parse7 = function(v2) {
    return run3(v2.value1);
  };
  var functorRouteDuplex = {
    map: function(f) {
      return function(m2) {
        return new RouteDuplex(m2.value0, map29(f)(m2.value1));
      };
    }
  };
  var end2 = function(v2) {
    return new RouteDuplex(v2.value0, applyFirst2(v2.value1)(end));
  };
  var applyRouteDuplex = {
    apply: function(v2) {
      return function(v1) {
        return new RouteDuplex(apply1(map113(append8)(v2.value0))(v1.value0), apply2(v2.value1)(v1.value1));
      };
    },
    Functor0: function() {
      return functorRouteDuplex;
    }
  };
  var applicativeRouteDuplex = {
    pure: /* @__PURE__ */ function() {
      var $143 = RouteDuplex.create($$const(mempty2));
      return function($144) {
        return $143(pure6($144));
      };
    }(),
    Apply0: function() {
      return applyRouteDuplex;
    }
  };

  // output/Routing.Duplex.Generic/index.js
  var identity17 = /* @__PURE__ */ identity(categoryFn);
  var append9 = /* @__PURE__ */ append(semigroupRoutePrinter);
  var apply3 = /* @__PURE__ */ apply(applyRouteParser);
  var map30 = /* @__PURE__ */ map(functorRouteParser);
  var alt5 = /* @__PURE__ */ alt(altRouteParser);
  var dimap2 = /* @__PURE__ */ dimap(profunctorRouteDuplex);
  var noArgs = /* @__PURE__ */ function() {
    return pure(applicativeRouteDuplex)(NoArguments.value);
  }();
  var gRouteProduct = {
    gRouteDuplexCtr: identity17
  };
  var gRouteNoArguments = {
    gRouteDuplexCtr: identity17
  };
  var gRouteDuplexCtr = function(dict) {
    return dict.gRouteDuplexCtr;
  };
  var product2 = function(dictGRouteDuplexCtr) {
    var gRouteDuplexCtr1 = gRouteDuplexCtr(dictGRouteDuplexCtr);
    return function(v2) {
      return function(l2) {
        var v1 = gRouteDuplexCtr1(l2);
        var enc = function(v22) {
          return append9(v2.value0(v22.value0))(v1.value0(v22.value1));
        };
        var dec = apply3(map30(Product.create)(map30(Argument)(v2.value1)))(v1.value1);
        return new RouteDuplex(enc, dec);
      };
    };
  };
  var gRouteDuplex = function(dict) {
    return dict.gRouteDuplex;
  };
  var gRouteSum = function(dictGRouteDuplex) {
    var gRouteDuplex1 = gRouteDuplex(dictGRouteDuplex);
    return function(dictGRouteDuplex1) {
      var gRouteDuplex2 = gRouteDuplex(dictGRouteDuplex1);
      return {
        gRouteDuplex: function(end$prime) {
          return function(r2) {
            var v2 = gRouteDuplex1(end$prime)(r2);
            var v1 = gRouteDuplex2(end$prime)(r2);
            var enc = function(v22) {
              if (v22 instanceof Inl) {
                return v2.value0(v22.value0);
              }
              ;
              if (v22 instanceof Inr) {
                return v1.value0(v22.value0);
              }
              ;
              throw new Error("Failed pattern match at Routing.Duplex.Generic (line 51, column 11 - line 53, column 22): " + [v22.constructor.name]);
            };
            var dec = alt5(map30(Inl.create)(v2.value1))(map30(Inr.create)(v1.value1));
            return new RouteDuplex(enc, dec);
          };
        }
      };
    };
  };
  var sum3 = function(dictGeneric) {
    var from3 = from(dictGeneric);
    var to3 = to(dictGeneric);
    return function(dictGRouteDuplex) {
      var $71 = dimap2(from3)(to3);
      var $72 = gRouteDuplex(dictGRouteDuplex)(end2);
      return function($73) {
        return $71($72($73));
      };
    };
  };
  var gRouteConstructor = function(dictIsSymbol) {
    var get5 = get2(dictIsSymbol)();
    return function() {
      return function(dictGRouteDuplexCtr) {
        var gRouteDuplexCtr1 = gRouteDuplexCtr(dictGRouteDuplexCtr);
        return {
          gRouteDuplex: function(end$prime) {
            return function(r2) {
              var v2 = end$prime(gRouteDuplexCtr1(get5($$Proxy.value)(r2)));
              var enc = function(v1) {
                return v2.value0(v1);
              };
              var dec = map30(Constructor)(v2.value1);
              return new RouteDuplex(enc, dec);
            };
          }
        };
      };
    };
  };
  var gRouteAll = {
    gRouteDuplexCtr: function(v2) {
      return new RouteDuplex(function(v1) {
        return v2.value0(v1);
      }, map30(Argument)(v2.value1));
    }
  };

  // output/Routing.Duplex.Generic.Syntax/index.js
  var gsepStringRoute = function(dictGRouteDuplexCtr) {
    var gRouteDuplexCtr2 = gRouteDuplexCtr(dictGRouteDuplexCtr);
    return {
      gsep: function(a3) {
        var $15 = prefix2(a3);
        return function($16) {
          return $15(gRouteDuplexCtr2($16));
        };
      }
    };
  };
  var gsepProduct = function(dictGRouteDuplexCtr) {
    return {
      gsep: product2(dictGRouteDuplexCtr)
    };
  };
  var gsep = function(dict) {
    return dict.gsep;
  };

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str2) {
      return str2.codePointAt(0);
    } : fallback;
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str2) {
          return Array.from(str2, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output/Data.String.CodePoints/index.js
  var fromEnum3 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map31 = /* @__PURE__ */ map(functorMaybe);
  var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
  var unsurrogate = function(lead) {
    return function(trail) {
      return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
    };
  };
  var isTrail = function(cu) {
    return 56320 <= cu && cu <= 57343;
  };
  var isLead = function(cu) {
    return 55296 <= cu && cu <= 56319;
  };
  var uncons5 = function(s2) {
    var v2 = length7(s2);
    if (v2 === 0) {
      return Nothing.value;
    }
    ;
    if (v2 === 1) {
      return new Just({
        head: fromEnum3(charAt(0)(s2)),
        tail: ""
      });
    }
    ;
    var cu1 = fromEnum3(charAt(1)(s2));
    var cu0 = fromEnum3(charAt(0)(s2));
    var $43 = isLead(cu0) && isTrail(cu1);
    if ($43) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop3(2)(s2)
      });
    }
    ;
    return new Just({
      head: cu0,
      tail: drop3(1)(s2)
    });
  };
  var unconsButWithTuple = function(s2) {
    return map31(function(v2) {
      return new Tuple(v2.head, v2.tail);
    })(uncons5(s2));
  };
  var toCodePointArrayFallback = function(s2) {
    return unfoldr2(unconsButWithTuple)(s2);
  };
  var unsafeCodePointAt0Fallback = function(s2) {
    var cu0 = fromEnum3(charAt(0)(s2));
    var $47 = isLead(cu0) && length7(s2) > 1;
    if ($47) {
      var cu1 = fromEnum3(charAt(1)(s2));
      var $48 = isTrail(cu1);
      if ($48) {
        return unsurrogate(cu0)(cu1);
      }
      ;
      return cu0;
    }
    ;
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length8 = function($74) {
    return length5(toCodePointArray($74));
  };

  // output/Web.HTML.Event.HashChangeEvent.EventTypes/index.js
  var hashchange = "hashchange";

  // output/Routing.Hash/index.js
  var bind9 = /* @__PURE__ */ bind(bindEffect);
  var map33 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindEffect);
  var join3 = /* @__PURE__ */ join(bindEffect);
  var apply4 = /* @__PURE__ */ apply(applyEffect);
  var pure7 = /* @__PURE__ */ pure(applicativeEffect);
  var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
  var setHash2 = function(h7) {
    return bind9(bind9(windowImpl)(location))(setHash(h7));
  };
  var getHash = /* @__PURE__ */ bind9(/* @__PURE__ */ bind9(windowImpl)(location))(/* @__PURE__ */ function() {
    var $16 = map33(function() {
      var $18 = fromMaybe("");
      var $19 = stripPrefix("#");
      return function($20) {
        return $18($19($20));
      };
    }());
    return function($17) {
      return $16(hash($17));
    };
  }());
  var foldHashes = function(cb) {
    return function(init4) {
      return function __do5() {
        var ref4 = bindFlipped5($$new)(bindFlipped5(init4)(getHash))();
        var win = map33(toEventTarget2)(windowImpl)();
        var listener = eventListener(function(v2) {
          return bindFlipped5(flip(write)(ref4))(join3(apply4(map33(cb)(read(ref4)))(getHash)));
        })();
        addEventListener2(hashchange)(listener)(false)(win)();
        return removeEventListener2(hashchange)(listener)(false)(win);
      };
    };
  };
  var matchesWith = function(dictFoldable) {
    var indexl2 = indexl(dictFoldable);
    return function(parser) {
      return function(cb) {
        var go2 = function(a3) {
          var $21 = maybe(pure7(a3))(function(b2) {
            return voidRight2(new Just(b2))(cb(a3)(b2));
          });
          var $22 = indexl2(0);
          return function($23) {
            return $21($22(parser($23)));
          };
        };
        return foldHashes(go2)(go2(Nothing.value));
      };
    };
  };

  // output/Capability.Navigate/index.js
  var gsep2 = /* @__PURE__ */ gsep(/* @__PURE__ */ gsepStringRoute(gRouteNoArguments));
  var Home = /* @__PURE__ */ function() {
    function Home2() {
    }
    ;
    Home2.value = new Home2();
    return Home2;
  }();
  var About = /* @__PURE__ */ function() {
    function About2() {
    }
    ;
    About2.value = new About2();
    return About2;
  }();
  var Instructions = /* @__PURE__ */ function() {
    function Instructions2() {
    }
    ;
    Instructions2.value = new Instructions2();
    return Instructions2;
  }();
  var LevelSelect = /* @__PURE__ */ function() {
    function LevelSelect2() {
    }
    ;
    LevelSelect2.value = new LevelSelect2();
    return LevelSelect2;
  }();
  var Level = /* @__PURE__ */ function() {
    function Level2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Level2.create = function(value0) {
      return function(value1) {
        return new Level2(value0, value1);
      };
    };
    return Level2;
  }();
  var genericRoute_ = {
    to: function(x2) {
      if (x2 instanceof Inl) {
        return Home.value;
      }
      ;
      if (x2 instanceof Inr && x2.value0 instanceof Inl) {
        return About.value;
      }
      ;
      if (x2 instanceof Inr && (x2.value0 instanceof Inr && x2.value0.value0 instanceof Inl)) {
        return Instructions.value;
      }
      ;
      if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && x2.value0.value0.value0 instanceof Inl))) {
        return LevelSelect.value;
      }
      ;
      if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && x2.value0.value0.value0 instanceof Inr))) {
        return new Level(x2.value0.value0.value0.value0.value0, x2.value0.value0.value0.value0.value1);
      }
      ;
      throw new Error("Failed pattern match at Capability.Navigate (line 18, column 1 - line 18, column 32): " + [x2.constructor.name]);
    },
    from: function(x2) {
      if (x2 instanceof Home) {
        return new Inl(NoArguments.value);
      }
      ;
      if (x2 instanceof About) {
        return new Inr(new Inl(NoArguments.value));
      }
      ;
      if (x2 instanceof Instructions) {
        return new Inr(new Inr(new Inl(NoArguments.value)));
      }
      ;
      if (x2 instanceof LevelSelect) {
        return new Inr(new Inr(new Inr(new Inl(NoArguments.value))));
      }
      ;
      if (x2 instanceof Level) {
        return new Inr(new Inr(new Inr(new Inr(new Product(x2.value0, x2.value1)))));
      }
      ;
      throw new Error("Failed pattern match at Capability.Navigate (line 18, column 1 - line 18, column 32): " + [x2.constructor.name]);
    }
  };
  var eqRoute = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof Home && y2 instanceof Home) {
          return true;
        }
        ;
        if (x2 instanceof About && y2 instanceof About) {
          return true;
        }
        ;
        if (x2 instanceof Instructions && y2 instanceof Instructions) {
          return true;
        }
        ;
        if (x2 instanceof LevelSelect && y2 instanceof LevelSelect) {
          return true;
        }
        ;
        if (x2 instanceof Level && y2 instanceof Level) {
          return x2.value0 === y2.value0 && x2.value1 === y2.value1;
        }
        ;
        return false;
      };
    }
  };
  var routeCodec = /* @__PURE__ */ root(/* @__PURE__ */ sum3(genericRoute_)(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: function() {
      return "Home";
    }
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: function() {
      return "About";
    }
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: function() {
      return "Instructions";
    }
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: function() {
      return "LevelSelect";
    }
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: function() {
      return "Level";
    }
  })()(gRouteProduct))))))({
    Home: noArgs,
    About: /* @__PURE__ */ gsep2("about")(noArgs),
    Instructions: /* @__PURE__ */ gsep2("how-to-play")(noArgs),
    LevelSelect: /* @__PURE__ */ gsep2("level-select")(noArgs),
    Level: /* @__PURE__ */ gsep(/* @__PURE__ */ gsepStringRoute(gRouteProduct))("level")(/* @__PURE__ */ gsep(/* @__PURE__ */ gsepProduct(gRouteAll))(segment)(segment))
  }));
  var navigateTo = function(dictMonadEffect) {
    var liftEffect11 = liftEffect(dictMonadEffect);
    return function(route) {
      return liftEffect11(setHash2(print6(routeCodec)(route)));
    };
  };

  // output/Web.Storage.Storage/foreign.js
  function _getItem(key2) {
    return function(storage) {
      return function() {
        return storage.getItem(key2);
      };
    };
  }
  function setItem(key2) {
    return function(value14) {
      return function(storage) {
        return function() {
          storage.setItem(key2, value14);
        };
      };
    };
  }
  function clear2(storage) {
    return function() {
      storage.clear();
    };
  }

  // output/Web.Storage.Storage/index.js
  var map34 = /* @__PURE__ */ map(functorEffect);
  var getItem = function(s2) {
    var $5 = map34(toMaybe);
    var $6 = _getItem(s2);
    return function($7) {
      return $5($6($7));
    };
  };

  // output/Capability.Progress/index.js
  var bind10 = /* @__PURE__ */ bind(bindEffect);
  var show5 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord()()(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "levelName";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "suiteName";
    }
  })(showString))(showString)));
  var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorEffect);
  var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var Incomplete = /* @__PURE__ */ function() {
    function Incomplete2() {
    }
    ;
    Incomplete2.value = new Incomplete2();
    return Incomplete2;
  }();
  var Completed = /* @__PURE__ */ function() {
    function Completed3() {
    }
    ;
    Completed3.value = new Completed3();
    return Completed3;
  }();
  var showLevelProgress = {
    show: function(v2) {
      if (v2 instanceof Incomplete) {
        return "Incomplete";
      }
      ;
      if (v2 instanceof Completed) {
        return "Completed";
      }
      ;
      throw new Error("Failed pattern match at Capability.Progress (line 38, column 10 - line 40, column 31): " + [v2.constructor.name]);
    }
  };
  var levelProgress = function(dictChoice) {
    var toStr = function(v2) {
      if (v2 instanceof Incomplete) {
        return "Incomplete";
      }
      ;
      if (v2 instanceof Completed) {
        return "Completed";
      }
      ;
      throw new Error("Failed pattern match at Capability.Progress (line 29, column 13 - line 31, column 31): " + [v2.constructor.name]);
    };
    var fromStr = function(v2) {
      if (v2 === "Incomplete") {
        return new Just(Incomplete.value);
      }
      ;
      if (v2 === "Completed") {
        return new Just(Completed.value);
      }
      ;
      return Nothing.value;
    };
    return prism$prime(toStr)(fromStr)(dictChoice);
  };
  var levelProgress1 = /* @__PURE__ */ levelProgress(taggedChoice);
  var levelProgress2 = /* @__PURE__ */ levelProgress(/* @__PURE__ */ choiceForget(monoidFirst));
  var saveLevelProgress = function(dictMonadEffect) {
    var liftEffect11 = liftEffect(dictMonadEffect);
    return function(id4) {
      return function(progress3) {
        return liftEffect11(bind10(bind10(windowImpl)(localStorage))(setItem(show5(id4))(review(levelProgress1)(progress3))));
      };
    };
  };
  var getLevelProgress = function(dictMonadEffect) {
    var liftEffect11 = liftEffect(dictMonadEffect);
    return function(id4) {
      return liftEffect11(mapFlipped3(bind10(bind10(windowImpl)(localStorage))(getItem(show5(id4))))(bindFlipped6(preview(levelProgress2))));
    };
  };
  var deleteProgress = function(dictMonadEffect) {
    return liftEffect(dictMonadEffect)(bind10(bind10(windowImpl)(localStorage))(clear2));
  };

  // output/Halogen.HTML.Elements/index.js
  var pure8 = /* @__PURE__ */ pure(applicativeMaybe);
  var elementNS = function($15) {
    return element(pure8($15));
  };
  var element2 = /* @__PURE__ */ function() {
    return element(Nothing.value);
  }();
  var h1 = /* @__PURE__ */ element2("h1");
  var h1_ = /* @__PURE__ */ h1([]);
  var h2 = /* @__PURE__ */ element2("h2");
  var h2_ = /* @__PURE__ */ h2([]);
  var h3 = /* @__PURE__ */ element2("h3");
  var h3_ = /* @__PURE__ */ h3([]);
  var li = /* @__PURE__ */ element2("li");
  var li_ = /* @__PURE__ */ li([]);
  var span4 = /* @__PURE__ */ element2("span");
  var span_ = /* @__PURE__ */ span4([]);
  var table = /* @__PURE__ */ element2("table");
  var table_ = /* @__PURE__ */ table([]);
  var td = /* @__PURE__ */ element2("td");
  var textarea = function(es) {
    return element2("textarea")(es)([]);
  };
  var tr = /* @__PURE__ */ element2("tr");
  var tr_ = /* @__PURE__ */ tr([]);
  var ul = /* @__PURE__ */ element2("ul");
  var ul_ = /* @__PURE__ */ ul([]);
  var div3 = /* @__PURE__ */ element2("div");
  var div_ = /* @__PURE__ */ div3([]);
  var button = /* @__PURE__ */ element2("button");
  var br = function(props) {
    return element2("br")(props)([]);
  };
  var br_ = /* @__PURE__ */ br([]);
  var b = /* @__PURE__ */ element2("b");
  var b_ = /* @__PURE__ */ b([]);
  var a = /* @__PURE__ */ element2("a");

  // output/Halogen.HTML.Properties/index.js
  var unwrap6 = /* @__PURE__ */ unwrap();
  var ref2 = /* @__PURE__ */ function() {
    var go2 = function(p2) {
      return function(mel) {
        return new Just(new RefUpdate(p2, mel));
      };
    };
    return function($29) {
      return ref(go2($29));
    };
  }();
  var prop4 = function(dictIsProp) {
    return prop3(dictIsProp);
  };
  var prop12 = /* @__PURE__ */ prop4(isPropBoolean);
  var prop22 = /* @__PURE__ */ prop4(isPropString);
  var prop32 = /* @__PURE__ */ prop4(isPropInt);
  var readOnly3 = /* @__PURE__ */ prop12("readOnly");
  var rows4 = /* @__PURE__ */ prop32("rows");
  var value12 = function(dictIsProp) {
    return prop4(dictIsProp)("value");
  };
  var id2 = /* @__PURE__ */ prop22("id");
  var href4 = /* @__PURE__ */ prop22("href");
  var draggable2 = /* @__PURE__ */ prop12("draggable");
  var cols2 = /* @__PURE__ */ prop32("cols");
  var classes = /* @__PURE__ */ function() {
    var $32 = prop22("className");
    var $33 = joinWith(" ");
    var $34 = map(functorArray)(unwrap6);
    return function($35) {
      return $32($33($34($35)));
    };
  }();
  var class_ = /* @__PURE__ */ function() {
    var $36 = prop22("className");
    return function($37) {
      return $36(unwrap6($37));
    };
  }();
  var attr2 = /* @__PURE__ */ function() {
    return attr(Nothing.value);
  }();
  var style = /* @__PURE__ */ attr2("style");

  // output/Component.Title/index.js
  var value13 = /* @__PURE__ */ value12(isPropString);
  var map35 = /* @__PURE__ */ map(functorMaybe);
  var intercalate5 = /* @__PURE__ */ intercalate2(monoidString);
  var bind11 = /* @__PURE__ */ bind(bindAff);
  var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var for_3 = /* @__PURE__ */ for_(applicativeAff)(foldableArray);
  var discard5 = /* @__PURE__ */ discard(discardUnit)(bindAff);
  var pure9 = /* @__PURE__ */ pure(applicativeAff);
  var whenM2 = /* @__PURE__ */ whenM(monadHalogenM);
  var gets2 = /* @__PURE__ */ gets(monadStateHalogenM);
  var bind13 = /* @__PURE__ */ bind(bindHalogenM);
  var map114 = /* @__PURE__ */ map(functorEmitter);
  var pure12 = /* @__PURE__ */ pure(applicativeHalogenM);
  var modify_3 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var Initialise = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var AppendCharToTitle = /* @__PURE__ */ function() {
    function AppendCharToTitle2(value0) {
      this.value0 = value0;
    }
    ;
    AppendCharToTitle2.create = function(value0) {
      return new AppendCharToTitle2(value0);
    };
    return AppendCharToTitle2;
  }();
  var abedTitleText = ["    :::     :::::::::  :::::::::: ::::::::: ", "  :+: :+:   :+:    :+: :+:        :+:    :+:", " +:+   +:+  +:+    +:+ +:+        +:+    +:+", "+#++:++#++: +#++:++#+  +#++:++#   +#+    +:+", "+#+     +#+ +#+    +#+ +#+        +#+    +#+", "#+#     #+# #+#    #+# #+#        #+#    #+#", "###     ### #########  ########## ######### "];
  var makeTitle = function(titleText) {
    return textarea([id2("title"), value13(titleText), readOnly3(true), cols2(fromMaybe(100)(map35(length8)(head(abedTitleText))) - 4 | 0), rows4(length5(abedTitleText))]);
  };
  var html = /* @__PURE__ */ makeTitle(/* @__PURE__ */ intercalate5("\n")(abedTitleText));
  var titleCharEmitter = /* @__PURE__ */ bind11(/* @__PURE__ */ liftEffect5(create3))(function(v2) {
    return bind11(forkAff(for_3(toCharArray(intercalate5("\n")(abedTitleText)))(function(c2) {
      return discard5(liftEffect5(notify(v2.listener)(c2)))(function() {
        return delay(1);
      });
    })))(function() {
      return pure9(v2.emitter);
    });
  });
  var component = function(dictMonadAff) {
    var liftAff3 = liftAff(monadAffHalogenM(dictMonadAff));
    var render = function(state3) {
      return makeTitle(state3.text);
    };
    var initialState = function(v2) {
      return {
        typeTitle: v2.typeTitle,
        text: ""
      };
    };
    var $$eval2 = mkEval({
      handleAction: function(v1) {
        if (v1 instanceof Initialise) {
          return whenM2(gets2(function(v2) {
            return v2.typeTitle;
          }))(bind13(liftAff3(titleCharEmitter))(function(emitter) {
            return bind13(subscribe2(map114(AppendCharToTitle.create)(emitter)))(function() {
              return pure12(unit);
            });
          }));
        }
        ;
        if (v1 instanceof AppendCharToTitle) {
          return modify_3(function(s2) {
            var $33 = {};
            for (var $34 in s2) {
              if ({}.hasOwnProperty.call(s2, $34)) {
                $33[$34] = s2[$34];
              }
              ;
            }
            ;
            $33.text = s2.text + singleton8(v1.value0);
            return $33;
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Title (line 40, column 24 - line 47, column 63): " + [v1.constructor.name]);
      },
      handleQuery: defaultEval.handleQuery,
      receive: defaultEval.receive,
      initialize: new Just(Initialise.value),
      finalize: defaultEval.finalize
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Component.Layout.DefaultLayout/index.js
  var defaultLayout = function(inner) {
    return div3([id2("default-layout")])([html, br_, a([href4("")])([text5("<< Back to home")]), br_, div_([inner])]);
  };

  // output/Control.Monad.Except/index.js
  var unwrap7 = /* @__PURE__ */ unwrap();
  var runExcept = function($3) {
    return unwrap7(runExceptT($3));
  };

  // output/Web.Event.Event/foreign.js
  function _target(e) {
    return e.target;
  }
  function preventDefault(e) {
    return function() {
      return e.preventDefault();
    };
  }

  // output/Web.Event.Event/index.js
  var target5 = function($3) {
    return toMaybe(_target($3));
  };

  // output/Web.HTML.Event.DragEvent.EventTypes/index.js
  var drop5 = "drop";
  var dragover = "dragover";
  var dragleave = "dragleave";
  var dragexit = "dragexit";
  var dragenter = "dragenter";
  var dragend = "dragend";
  var drag = "drag";

  // output/Web.HTML.Event.EventTypes/index.js
  var domcontentloaded = "DOMContentLoaded";

  // output/Web.UIEvent.KeyboardEvent.EventTypes/index.js
  var keydown = "keydown";

  // output/Web.UIEvent.MouseEvent.EventTypes/index.js
  var mouseup = "mouseup";
  var mouseover = "mouseover";
  var mousemove = "mousemove";
  var mouseleave = "mouseleave";
  var mouseenter = "mouseenter";
  var mousedown = "mousedown";
  var click2 = "click";

  // output/Halogen.HTML.Events/index.js
  var mouseHandler = unsafeCoerce2;
  var handler2 = function(et) {
    return function(f) {
      return handler(et)(function(ev) {
        return new Just(new Action(f(ev)));
      });
    };
  };
  var onClick = /* @__PURE__ */ function() {
    var $15 = handler2(click2);
    return function($16) {
      return $15(mouseHandler($16));
    };
  }();
  var onMouseDown = /* @__PURE__ */ function() {
    var $27 = handler2(mousedown);
    return function($28) {
      return $27(mouseHandler($28));
    };
  }();
  var onMouseEnter = /* @__PURE__ */ function() {
    var $29 = handler2(mouseenter);
    return function($30) {
      return $29(mouseHandler($30));
    };
  }();
  var onMouseLeave = /* @__PURE__ */ function() {
    var $31 = handler2(mouseleave);
    return function($32) {
      return $31(mouseHandler($32));
    };
  }();
  var onMouseMove = /* @__PURE__ */ function() {
    var $33 = handler2(mousemove);
    return function($34) {
      return $33(mouseHandler($34));
    };
  }();
  var onMouseOver = /* @__PURE__ */ function() {
    var $37 = handler2(mouseover);
    return function($38) {
      return $37(mouseHandler($38));
    };
  }();
  var onMouseUp = /* @__PURE__ */ function() {
    var $39 = handler2(mouseup);
    return function($40) {
      return $39(mouseHandler($40));
    };
  }();
  var onScroll = /* @__PURE__ */ handler2("scroll");
  var dragHandler = unsafeCoerce2;
  var onDrag = /* @__PURE__ */ function() {
    var $63 = handler2(drag);
    return function($64) {
      return $63(dragHandler($64));
    };
  }();
  var onDragEnd = /* @__PURE__ */ function() {
    var $65 = handler2(dragend);
    return function($66) {
      return $65(dragHandler($66));
    };
  }();
  var onDragEnter = /* @__PURE__ */ function() {
    var $67 = handler2(dragenter);
    return function($68) {
      return $67(dragHandler($68));
    };
  }();
  var onDragExit = /* @__PURE__ */ function() {
    var $69 = handler2(dragexit);
    return function($70) {
      return $69(dragHandler($70));
    };
  }();
  var onDragLeave = /* @__PURE__ */ function() {
    var $71 = handler2(dragleave);
    return function($72) {
      return $71(dragHandler($72));
    };
  }();
  var onDragOver = /* @__PURE__ */ function() {
    var $73 = handler2(dragover);
    return function($74) {
      return $73(dragHandler($74));
    };
  }();
  var onDrop = /* @__PURE__ */ function() {
    var $77 = handler2(drop5);
    return function($78) {
      return $77(dragHandler($78));
    };
  }();

  // output/Component.About/index.js
  var bind14 = /* @__PURE__ */ bind(bindEffect);
  var when3 = /* @__PURE__ */ when(applicativeEffect);
  var deleteProgress2 = /* @__PURE__ */ deleteProgress(monadEffectEffect);
  var DeleteProgress = /* @__PURE__ */ function() {
    function DeleteProgress2() {
    }
    ;
    DeleteProgress2.value = new DeleteProgress2();
    return DeleteProgress2;
  }();
  var component2 = function(dictMonadAff) {
    var liftEffect11 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var render = function(state3) {
      return defaultLayout(div3([class_("about-component")])([h1_([text5("about page")]), h2_([text5("This game created by Mitch Stevens")]), br_, text5("email here"), br_, text5("Source Code: "), a([href4("https://github.com/MitchStevens/abed-ps")])([text5("https://github.com/MitchStevens/abed-ps")]), br_, button([onClick(function(v2) {
        return DeleteProgress.value;
      })])([text5("Delete all progress")])]));
    };
    var initialState = function(v2) {
      return {};
    };
    var $$eval2 = mkEval({
      handleAction: function(v1) {
        return liftEffect11(function __do5() {
          var confirmDelete = bind14(windowImpl)(confirm("Really delete all progress?"))();
          return when3(confirmDelete)(deleteProgress2)();
        });
      },
      handleQuery: defaultEval.handleQuery,
      receive: defaultEval.receive,
      initialize: defaultEval.initialize,
      finalize: defaultEval.finalize
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Halogen.HTML/index.js
  var componentSlot2 = /* @__PURE__ */ componentSlot();
  var slot_ = function() {
    return function(dictIsSymbol) {
      var componentSlot1 = componentSlot2(dictIsSymbol);
      return function(dictOrd) {
        var componentSlot22 = componentSlot1(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(component14) {
              return function(input3) {
                return widget(new ComponentSlot(componentSlot22(label5)(p2)(component14)(input3)($$const(Nothing.value))));
              };
            };
          };
        };
      };
    };
  };
  var slot = function() {
    return function(dictIsSymbol) {
      var componentSlot1 = componentSlot2(dictIsSymbol);
      return function(dictOrd) {
        var componentSlot22 = componentSlot1(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(component14) {
              return function(input3) {
                return function(outputQuery) {
                  return widget(new ComponentSlot(componentSlot22(label5)(p2)(component14)(input3)(function($11) {
                    return Just.create(outputQuery($11));
                  })));
                };
              };
            };
          };
        };
      };
    };
  };
  var fromPlainHTML = unsafeCoerce2;

  // output/Component.Home/index.js
  var slot_2 = /* @__PURE__ */ slot_()({
    reflectSymbol: function() {
      return "title";
    }
  })(ordUnit);
  var NavigateTo = /* @__PURE__ */ function() {
    function NavigateTo3(value0) {
      this.value0 = value0;
    }
    ;
    NavigateTo3.create = function(value0) {
      return new NavigateTo3(value0);
    };
    return NavigateTo3;
  }();
  var component3 = function(dictMonadAff) {
    var component1 = component(dictMonadAff);
    var navigateTo2 = navigateTo(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var render = function(state3) {
      return div3([id2("home-component")])([slot_2($$Proxy.value)(unit)(component1)({
        typeTitle: true
      }), br_, a([onClick(function(v2) {
        return new NavigateTo(LevelSelect.value);
      }), class_("link")])([text5("Choose a level")]), br_, a([onClick(function(v2) {
        return new NavigateTo(Instructions.value);
      }), class_("link")])([text5("How to play")]), br_, a([onClick(function(v2) {
        return new NavigateTo(About.value);
      }), class_("link")])([text5("About")])]);
    };
    var initialState = function(v2) {
      return {
        titleText: ""
      };
    };
    var $$eval2 = mkEval({
      handleAction: function(v1) {
        return navigateTo2(v1.value0);
      },
      handleQuery: defaultEval.handleQuery,
      receive: defaultEval.receive,
      initialize: Nothing.value,
      finalize: defaultEval.finalize
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Component.Instructions/index.js
  var component4 = function(dictMonadAff) {
    var render = function(state3) {
      return defaultLayout(div_([h1_([text5("How to play")]), h2_([text5("Pieces")]), h2_([text5("Board")]), h2_([text5("Specification")])]));
    };
    var initialState = function(v2) {
      return {};
    };
    var $$eval2 = mkEval(defaultEval);
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Halogen.Query.Event/index.js
  var traverse_5 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var eventListener2 = function(eventType) {
    return function(target6) {
      return function(f) {
        return makeEmitter(function(push2) {
          return function __do5() {
            var listener = eventListener(function(ev) {
              return traverse_5(push2)(f(ev));
            })();
            addEventListener2(eventType)(listener)(false)(target6)();
            return removeEventListener2(eventType)(listener)(false)(target6);
          };
        });
      };
    };
  };

  // output/Web.UIEvent.KeyboardEvent/foreign.js
  function key(e) {
    return e.key;
  }
  function ctrlKey(e) {
    return e.ctrlKey;
  }

  // output/Web.UIEvent.KeyboardEvent/index.js
  var fromEvent = /* @__PURE__ */ unsafeReadProtoTagged("KeyboardEvent");

  // output/Web.UIEvent.MouseEvent/foreign.js
  function clientX(e) {
    return e.clientX;
  }
  function clientY(e) {
    return e.clientY;
  }
  function pageX(e) {
    return e.pageX;
  }
  function pageY(e) {
    return e.pageY;
  }

  // output/Web.UIEvent.MouseEvent/index.js
  var toEvent = unsafeCoerce2;
  var fromEvent2 = /* @__PURE__ */ unsafeReadProtoTagged("MouseEvent");

  // output/Capability.GlobalEventEmmiters/index.js
  var bind15 = /* @__PURE__ */ bind(bindEffect);
  var globalMouseMoveEventEmitter = function __do3() {
    var htmlDocument = bind15(windowImpl)(document)();
    var target6 = toEventTarget(htmlDocument);
    return eventListener2(mousemove)(target6)(fromEvent2);
  };
  var globalKeyDownEventEmitter = function __do4() {
    var htmlDocument = bind15(windowImpl)(document)();
    var target6 = toEventTarget(htmlDocument);
    return eventListener2(keydown)(target6)(fromEvent);
  };

  // output/Control.Monad.State/index.js
  var unwrap8 = /* @__PURE__ */ unwrap();
  var runState = function(v2) {
    return function($18) {
      return unwrap8(v2($18));
    };
  };
  var execState = function(v2) {
    return function(s2) {
      var v1 = v2(s2);
      return v1.value1;
    };
  };
  var evalState = function(v2) {
    return function(s2) {
      var v1 = v2(s2);
      return v1.value0;
    };
  };

  // output/Data.Lens.Prism.Maybe/index.js
  var _Just = function(dictChoice) {
    return prism(Just.create)(maybe(new Left(Nothing.value))(Right.create))(dictChoice);
  };

  // output/Data.Zipper/index.js
  var map37 = /* @__PURE__ */ map(functorList);
  var unfoldr3 = /* @__PURE__ */ unfoldr(unfoldableList);
  var map115 = /* @__PURE__ */ map(functorMaybe);
  var Zipper = /* @__PURE__ */ function() {
    function Zipper2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Zipper2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Zipper2(value0, value1, value22);
        };
      };
    };
    return Zipper2;
  }();
  var functorZipper = {
    map: function(f) {
      return function(v2) {
        return new Zipper(map37(f)(v2.value0), f(v2.value1), map37(f)(v2.value2));
      };
    }
  };
  var singleton10 = function(v2) {
    return new Zipper(Nil.value, v2, Nil.value);
  };
  var moveRight = function(v2) {
    if (v2.value2 instanceof Nil) {
      return Nothing.value;
    }
    ;
    if (v2.value2 instanceof Cons) {
      return new Just(new Zipper(new Cons(v2.value1, v2.value0), v2.value2.value0, v2.value2.value1));
    }
    ;
    throw new Error("Failed pattern match at Data.Zipper (line 68, column 30 - line 70, column 50): " + [v2.value2.constructor.name]);
  };
  var moveLeft = function(v2) {
    if (v2.value0 instanceof Nil) {
      return Nothing.value;
    }
    ;
    if (v2.value0 instanceof Cons) {
      return new Just(new Zipper(v2.value0.value1, v2.value0.value0, new Cons(v2.value1, v2.value2)));
    }
    ;
    throw new Error("Failed pattern match at Data.Zipper (line 63, column 29 - line 65, column 50): " + [v2.value0.constructor.name]);
  };
  var extendZipper = {
    extend: function(f) {
      return function(zipper) {
        var dup = function(x2) {
          return new Tuple(x2, x2);
        };
        var lefts = unfoldr3(function(z2) {
          return map115(dup)(moveLeft(z2));
        })(zipper);
        var rights = unfoldr3(function(z2) {
          return map115(dup)(moveRight(z2));
        })(zipper);
        return new Zipper(map37(f)(lefts), f(zipper), map37(f)(rights));
      };
    },
    Functor0: function() {
      return functorZipper;
    }
  };
  var comonadZipper = {
    extract: function(v2) {
      return v2.value1;
    },
    Extend0: function() {
      return extendZipper;
    }
  };
  var head6 = /* @__PURE__ */ extract(comonadZipper);
  var append10 = function(v$prime) {
    return function(v2) {
      return new Zipper(new Cons(v2.value1, v2.value0), v$prime, Nil.value);
    };
  };
  var _head2 = function(dictStrong) {
    return lens(head6)(function(v2) {
      return function(x2) {
        return new Zipper(v2.value0, x2, v2.value2);
      };
    })(dictStrong);
  };

  // output/Data.Group/index.js
  var ginverse = function(dict) {
    return dict.ginverse;
  };

  // output/Data.Map.Unsafe/index.js
  var unsafeMapKey = function(f) {
    var go2 = function(v2) {
      if (v2 instanceof Leaf) {
        return Leaf.value;
      }
      ;
      if (v2 instanceof Two) {
        return new Two(go2(v2.value0), f(v2.value1), v2.value2, go2(v2.value3));
      }
      ;
      if (v2 instanceof Three) {
        return new Three(go2(v2.value0), f(v2.value1), v2.value2, go2(v2.value3), f(v2.value4), v2.value5, go2(v2.value6));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Unsafe (line 12, column 10 - line 15, column 88): " + [v2.constructor.name]);
    };
    return go2;
  };

  // output/Game.Edge/index.js
  var eq6 = /* @__PURE__ */ eq(eqCardinalDirection);
  var eq17 = /* @__PURE__ */ eq(eqLocation);
  var append12 = /* @__PURE__ */ append(semigroupOrdering);
  var compare8 = /* @__PURE__ */ compare(ordLocation);
  var compare16 = /* @__PURE__ */ compare(ordCardinalDirection);
  var eqEdge = {
    eq: function(x2) {
      return function(y2) {
        return eq6(x2.dir)(y2.dir) && eq17(x2.loc)(y2.loc);
      };
    }
  };
  var ordEdge = {
    compare: function(v2) {
      return function(v1) {
        return append12(compare8(v2.loc)(v1.loc))(compare16(v2.dir)(v1.dir));
      };
    },
    Eq0: function() {
      return eqEdge;
    }
  };
  var edge = function(loc) {
    return function(dir2) {
      return {
        loc,
        dir: dir2
      };
    };
  };
  var matchEdge = function(v2) {
    return edge(followDirection(v2.loc)(v2.dir))(oppositeDirection(v2.dir));
  };

  // output/Game.Board/index.js
  var show6 = /* @__PURE__ */ show(showLocation);
  var show12 = /* @__PURE__ */ show(showCardinalDirection);
  var eq7 = /* @__PURE__ */ eq(eqEdge);
  var compare9 = /* @__PURE__ */ compare(ordEdge);
  var rotationIsSymbol = {
    reflectSymbol: function() {
      return "rotation";
    }
  };
  var _Newtype3 = /* @__PURE__ */ _Newtype()();
  var prop5 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "size";
    }
  })()();
  var prop13 = /* @__PURE__ */ prop(rotationIsSymbol)()();
  var prop23 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "pieces";
    }
  })()();
  var bind16 = /* @__PURE__ */ bind(bindArray);
  var pure10 = /* @__PURE__ */ pure(applicativeArray);
  var member3 = /* @__PURE__ */ member2(ordLocation);
  var showRelativeEdge = {
    show: function(v2) {
      return "(RelEdge " + (show6(v2.loc) + (" " + (show12(v2.dir) + ")")));
    }
  };
  var eqRelativeEdge = {
    eq: function(x2) {
      return function(y2) {
        return eq7(x2)(y2);
      };
    }
  };
  var ordRelativeEdge = {
    compare: function(x2) {
      return function(y2) {
        return compare9(x2)(y2);
      };
    },
    Eq0: function() {
      return eqRelativeEdge;
    }
  };
  var submap2 = /* @__PURE__ */ submap(ordRelativeEdge);
  var standardBoard = {
    size: 3,
    pieces: empty2
  };
  var relativeEdgeLocation = function(v2) {
    return v2.loc;
  };
  var relativeEdgeDirection = function(v2) {
    return v2.dir;
  };
  var relative = function(loc) {
    return function(dir2) {
      return {
        loc,
        dir: dir2
      };
    };
  };
  var toLocalInputs = function(loc) {
    var $134 = unsafeMapKey(relativeEdgeDirection);
    var $135 = submap2(new Just(relative(loc)(Up.value)))(new Just(relative(loc)(Left2.value)));
    return function($136) {
      return $134($135($136));
    };
  };
  var absolute = edge;
  var _size = function(dictStrong) {
    var $137 = _Newtype3(dictStrong.Profunctor0());
    var $138 = prop5($$Proxy.value)(dictStrong);
    return function($139) {
      return $137($138($139));
    };
  };
  var _size1 = /* @__PURE__ */ _size(strongForget);
  var _rotation = function(dictStrong) {
    return prop13($$Proxy.value)(dictStrong);
  };
  var _pieces = function(dictStrong) {
    var $140 = _Newtype3(dictStrong.Profunctor0());
    var $141 = prop23($$Proxy.value)(dictStrong);
    return function($142) {
      return $140($141($142));
    };
  };
  var allOccupiedLocations = /* @__PURE__ */ view(/* @__PURE__ */ function() {
    var $143 = _pieces(strongForget);
    var $144 = to2(keys2);
    return function($145) {
      return $143($144($145));
    };
  }());
  var firstEmptyLocation = function(board) {
    var n = view(_size1)(board);
    var allLocations = bind16(range2(0)(n - 1 | 0))(function(j) {
      return bind16(range2(0)(n - 1 | 0))(function(i2) {
        return pure10(location2(i2)(j));
      });
    });
    var occupied = allOccupiedLocations(board);
    return find2(function(loc) {
      return member3(loc)(occupied);
    })(allLocations);
  };

  // output/Data.Compactable/index.js
  var $$void9 = /* @__PURE__ */ $$void(functorST);
  var pure13 = /* @__PURE__ */ pure(applicativeST);
  var apply5 = /* @__PURE__ */ apply(applyST);
  var map38 = /* @__PURE__ */ map(functorST);
  var separate = function(dict) {
    return dict.separate;
  };
  var compactableArray = {
    compact: function(xs) {
      return function __do5() {
        var result = newSTArray();
        var iter = iterator(function(v2) {
          return index2(xs)(v2);
        })();
        iterate(iter)(function($108) {
          return $$void9(function(v2) {
            if (v2 instanceof Nothing) {
              return pure13(0);
            }
            ;
            if (v2 instanceof Just) {
              return push(v2.value0)(result);
            }
            ;
            throw new Error("Failed pattern match at Data.Compactable (line 111, column 34 - line 113, column 35): " + [v2.constructor.name]);
          }($108));
        })();
        return unsafeFreeze(result)();
      }();
    },
    separate: function(xs) {
      return function __do5() {
        var ls = newSTArray();
        var rs = newSTArray();
        var iter = iterator(function(v2) {
          return index2(xs)(v2);
        })();
        iterate(iter)(function($109) {
          return $$void9(function(v2) {
            if (v2 instanceof Left) {
              return push(v2.value0)(ls);
            }
            ;
            if (v2 instanceof Right) {
              return push(v2.value0)(rs);
            }
            ;
            throw new Error("Failed pattern match at Data.Compactable (line 122, column 34 - line 124, column 31): " + [v2.constructor.name]);
          }($109));
        })();
        return apply5(map38(function(v2) {
          return function(v1) {
            return {
              left: v2,
              right: v1
            };
          };
        })(unsafeFreeze(ls)))(unsafeFreeze(rs))();
      }();
    }
  };
  var compact = function(dict) {
    return dict.compact;
  };

  // output/Data.Filterable/index.js
  var append11 = /* @__PURE__ */ append(semigroupArray);
  var foldl5 = /* @__PURE__ */ foldl(foldableArray);
  var filterableArray = {
    partitionMap: function(p2) {
      var go2 = function(acc) {
        return function(x2) {
          var v2 = p2(x2);
          if (v2 instanceof Left) {
            return {
              left: append11(acc.left)([v2.value0]),
              right: acc.right
            };
          }
          ;
          if (v2 instanceof Right) {
            return {
              right: append11(acc.right)([v2.value0]),
              left: acc.left
            };
          }
          ;
          throw new Error("Failed pattern match at Data.Filterable (line 149, column 16 - line 151, column 50): " + [v2.constructor.name]);
        };
      };
      return foldl5(go2)({
        left: [],
        right: []
      });
    },
    partition,
    filterMap: mapMaybe,
    filter,
    Compactable0: function() {
      return compactableArray;
    },
    Functor1: function() {
      return functorArray;
    }
  };
  var filter5 = function(dict) {
    return dict.filter;
  };
  var eitherBool = function(p2) {
    return function(x2) {
      var $84 = p2(x2);
      if ($84) {
        return new Right(x2);
      }
      ;
      return new Left(x2);
    };
  };

  // output/Data.Lens.AffineTraversal/index.js
  var identity18 = /* @__PURE__ */ identity(categoryFn);
  var fanout2 = /* @__PURE__ */ fanout(categoryFn)(strongFn);
  var affineTraversal$prime = function(to3) {
    return function(dictStrong) {
      var second3 = second(dictStrong);
      return function(dictChoice) {
        var dimap3 = dimap(dictChoice.Profunctor0());
        var right2 = right(dictChoice);
        return function(pab) {
          return dimap3(to3)(function(v2) {
            return either(identity18)(v2.value0)(v2.value1);
          })(second3(right2(pab)));
        };
      };
    };
  };
  var affineTraversal = function(set3) {
    return function(pre2) {
      return function(dictStrong) {
        return function(dictChoice) {
          return affineTraversal$prime(fanout2(set3)(pre2))(dictStrong)(dictChoice);
        };
      };
    };
  };

  // output/Data.Lens.Index/index.js
  var ix = function(dict) {
    return dict.ix;
  };
  var indexMap = function(dictOrd) {
    var update3 = update(dictOrd);
    var lookup26 = lookup(dictOrd);
    return {
      ix: function(k) {
        return function(dictStrong) {
          return function(dictChoice) {
            var set3 = function(s2) {
              return function(b2) {
                return update3(function(v2) {
                  return new Just(b2);
                })(k)(s2);
              };
            };
            var pre2 = function(s2) {
              return maybe(new Left(s2))(Right.create)(lookup26(k)(s2));
            };
            return affineTraversal(set3)(pre2)(dictStrong)(dictChoice);
          };
        };
      }
    };
  };

  // output/Data.Lens.At/index.js
  var atMap = function(dictOrd) {
    var lookup26 = lookup(dictOrd);
    var $$delete9 = $$delete2(dictOrd);
    var insert14 = insert(dictOrd);
    var indexMap2 = indexMap(dictOrd);
    return {
      at: function(k) {
        return function(dictStrong) {
          return lens(lookup26(k))(function(m2) {
            return maybe$prime(function(v2) {
              return $$delete9(k)(m2);
            })(function(v2) {
              return insert14(k)(v2)(m2);
            });
          })(dictStrong);
        };
      },
      Index0: function() {
        return indexMap2;
      }
    };
  };
  var at = function(dict) {
    return dict.at;
  };

  // output/Data.Witherable/index.js
  var witherDefault = function(dictWitherable) {
    var compact2 = compact(dictWitherable.Filterable0().Compactable0());
    var traverse5 = traverse(dictWitherable.Traversable1());
    return function(dictApplicative) {
      var map60 = map(dictApplicative.Apply0().Functor0());
      var traverse12 = traverse5(dictApplicative);
      return function(p2) {
        var $184 = map60(compact2);
        var $185 = traverse12(p2);
        return function($186) {
          return $184($185($186));
        };
      };
    };
  };
  var wither = function(dict) {
    return dict.wither;
  };
  var wiltDefault = function(dictWitherable) {
    var separate2 = separate(dictWitherable.Filterable0().Compactable0());
    var traverse5 = traverse(dictWitherable.Traversable1());
    return function(dictApplicative) {
      var map60 = map(dictApplicative.Apply0().Functor0());
      var traverse12 = traverse5(dictApplicative);
      return function(p2) {
        var $187 = map60(separate2);
        var $188 = traverse12(p2);
        return function($189) {
          return $187($188($189));
        };
      };
    };
  };
  var witherableArray = {
    wilt: function(dictApplicative) {
      return wiltDefault(witherableArray)(dictApplicative);
    },
    wither: function(dictApplicative) {
      return witherDefault(witherableArray)(dictApplicative);
    },
    Filterable0: function() {
      return filterableArray;
    },
    Traversable1: function() {
      return traversableArray;
    }
  };

  // output/Game.Board.Query/index.js
  var _pieces2 = /* @__PURE__ */ _pieces(strongForget);
  var ix2 = /* @__PURE__ */ ix(/* @__PURE__ */ indexMap(ordLocation));
  var choiceForget2 = /* @__PURE__ */ choiceForget(monoidRotation);
  var _rotation2 = /* @__PURE__ */ _rotation(strongForget);
  var ginverse2 = /* @__PURE__ */ ginverse(groupRotation);
  var _size2 = /* @__PURE__ */ _size(strongForget);
  var at2 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordLocation));
  var bind17 = /* @__PURE__ */ bind(bindMaybe);
  var div4 = /* @__PURE__ */ div(euclideanRingInt);
  var eq8 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMaybe(eqBoolean));
  var apply6 = /* @__PURE__ */ apply(applyMaybe);
  var map39 = /* @__PURE__ */ map(functorMaybe);
  var wither2 = /* @__PURE__ */ wither(witherableArray);
  var map116 = /* @__PURE__ */ map(functorArray);
  var insert8 = /* @__PURE__ */ insert2(ordLocation);
  var discard6 = /* @__PURE__ */ discard(discardUnit);
  var _pieces1 = /* @__PURE__ */ _pieces(strongFn);
  var member4 = /* @__PURE__ */ member2(ordLocation);
  var append13 = /* @__PURE__ */ append(semigroupList);
  var fromFoldable5 = /* @__PURE__ */ fromFoldable2(foldableArray);
  var filter6 = /* @__PURE__ */ filter5(filterableArray);
  var applicativeWriterT2 = /* @__PURE__ */ applicativeWriterT(monoidList);
  var bindWriterT2 = /* @__PURE__ */ bindWriterT(semigroupList);
  var monadStateWriterT2 = /* @__PURE__ */ monadStateWriterT(monoidList);
  var monadTellWriterT2 = /* @__PURE__ */ monadTellWriterT(monoidList);
  var map210 = /* @__PURE__ */ map(functorFn);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable3(ordRelativeEdge)(foldableList);
  var fromFoldable22 = /* @__PURE__ */ fromFoldable2(foldableSet);
  var toRelativeEdge = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var gets7 = gets(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(v2) {
      return bind118(gets7(view(function() {
        var $190 = ix2(v2.loc)(strongForget)(choiceForget2);
        return function($191) {
          return _pieces2($190(_rotation2($191)));
        };
      }())))(function(v1) {
        return pure34(relative(v2.loc)(rotateDirection(v2.dir)(ginverse2(v1))));
      });
    };
  };
  var toAbsoluteEdge = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var gets7 = gets(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(v2) {
      return bind118(gets7(view(function() {
        var $192 = ix2(v2.loc)(strongForget)(choiceForget2);
        return function($193) {
          return _pieces2($192(_rotation2($193)));
        };
      }())))(function(v1) {
        return pure34(absolute(v2.loc)(rotateDirection(v2.dir)(v1)));
      });
    };
  };
  var isInsideBoard = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var use4 = use(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(v2) {
      return bind118(use4(_size2))(function(n) {
        return pure34(0 <= v2.x && (v2.x < n && (0 <= v2.y && v2.y < n)));
      });
    };
  };
  var getPortOnEdge = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var use4 = use(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(v2) {
      return bind118(use4(function() {
        var $194 = at2(v2.loc)(strongForget);
        return function($195) {
          return _pieces2($194($195));
        };
      }()))(function(maybePieceInfo) {
        return pure34(bind17(maybePieceInfo)(function(info2) {
          return getPort(info2.piece)(v2.dir);
        }));
      });
    };
  };
  var getBoardEdgePseudoLocation = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var use4 = use(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(dir2) {
      return bind118(use4(_size2))(function(n) {
        return pure34(function() {
          if (dir2 instanceof Up) {
            return location2(div4(n)(2))(-1 | 0);
          }
          ;
          if (dir2 instanceof Right2) {
            return location2(n)(div4(n)(2));
          }
          ;
          if (dir2 instanceof Down) {
            return location2(div4(n)(2))(n);
          }
          ;
          if (dir2 instanceof Left2) {
            return location2(-1 | 0)(div4(n)(2));
          }
          ;
          throw new Error("Failed pattern match at Game.Board.Query (line 137, column 10 - line 141, column 52): " + [dir2.constructor.name]);
        }());
      });
    };
  };
  var getBoardPort = function(dictMonadState) {
    var bind118 = bind(dictMonadState.Monad0().Bind1());
    var getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    var toRelativeEdge1 = toRelativeEdge(dictMonadState);
    return function(dir2) {
      return bind118(getBoardEdgePseudoLocation1(dir2))(function(loc) {
        return toRelativeEdge1(absolute(loc)(dir2));
      });
    };
  };
  var getBoardRelEdge = function(dictMonadState) {
    var bind118 = bind(dictMonadState.Monad0().Bind1());
    var getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    var toRelativeEdge1 = toRelativeEdge(dictMonadState);
    return function(dir2) {
      return bind118(getBoardEdgePseudoLocation1(dir2))(function(loc) {
        return toRelativeEdge1(absolute(loc)(oppositeDirection(dir2)));
      });
    };
  };
  var adjacentRelativeEdge = function(dictMonadState) {
    var bind118 = bind(dictMonadState.Monad0().Bind1());
    var toAbsoluteEdge1 = toAbsoluteEdge(dictMonadState);
    var toRelativeEdge1 = toRelativeEdge(dictMonadState);
    return function(relEdge) {
      return bind118(toAbsoluteEdge1(relEdge))(function(absEdge) {
        return toRelativeEdge1(matchEdge(absEdge));
      });
    };
  };
  var connectedRelativeEdge = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(Monad0.Bind1());
    var getPortOnEdge1 = getPortOnEdge(dictMonadState);
    var adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    var pure34 = pure(Monad0.Applicative0());
    return function(relEdge) {
      return bind118(getPortOnEdge1(relEdge))(function(port2) {
        return bind118(adjacentRelativeEdge1(relEdge))(function(adjRelEdge) {
          return bind118(getPortOnEdge1(adjRelEdge))(function(adjPort) {
            var $176 = eq8(apply6(map39(portMatches)(port2))(adjPort))(new Just(true));
            if ($176) {
              return pure34(new Just(adjRelEdge));
            }
            ;
            return pure34(Nothing.value);
          });
        });
      });
    };
  };
  var allConnectedRelativeEdges = function(dictMonadState) {
    var wither1 = wither2(dictMonadState.Monad0().Applicative0());
    var connectedRelativeEdge1 = connectedRelativeEdge(dictMonadState);
    return function(loc) {
      return wither1(connectedRelativeEdge1)(map116(relative(loc))(allDirections));
    };
  };
  var capacityRippleAcc = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var pure34 = pure(Monad0.Applicative0());
    var Bind1 = Monad0.Bind1();
    var bind118 = bind(Bind1);
    var map311 = map(Bind1.Apply0().Functor0());
    var use4 = use(dictMonadState);
    var allConnectedRelativeEdges1 = allConnectedRelativeEdges(dictMonadState);
    var discard112 = discard6(Bind1);
    var modifying3 = modifying(dictMonadState);
    return function(capacity) {
      return function(vars) {
        if (vars.openSet instanceof Nil) {
          return pure34(unit);
        }
        ;
        if (vars.openSet instanceof Cons) {
          var loc = relativeEdgeLocation(vars.openSet.value0);
          var closedSet = insert8(loc)(vars.closedSet);
          return bind118(map311(map39(function(v2) {
            return v2.piece;
          }))(use4(function() {
            var $196 = at2(loc)(strongForget);
            return function($197) {
              return _pieces2($196($197));
            };
          }())))(function(maybePiece) {
            var v2 = bind17(maybePiece)(function(v1) {
              return v1.updateCapacity(relativeEdgeDirection(vars.openSet.value0))(capacity);
            });
            if (v2 instanceof Just) {
              return bind118(allConnectedRelativeEdges1(loc))(function(connected2) {
                return discard112(modifying3(function() {
                  var $198 = ix2(loc)(strongFn)(choiceFn);
                  return function($199) {
                    return _pieces1($198($199));
                  };
                }())(function(v1) {
                  var $180 = {};
                  for (var $181 in v1) {
                    if ({}.hasOwnProperty.call(v1, $181)) {
                      $180[$181] = v1[$181];
                    }
                    ;
                  }
                  ;
                  $180.piece = v2.value0;
                  return $180;
                }))(function() {
                  if (v2.value0.shouldRipple) {
                    var notInClosedSet = function(r2) {
                      return !member4(relativeEdgeLocation(r2))(vars.closedSet);
                    };
                    var openSet = append13(fromFoldable5(filter6(notInClosedSet)(connected2)))(vars.openSet.value1);
                    return capacityRippleAcc(dictMonadState)(capacity)({
                      openSet,
                      closedSet
                    });
                  }
                  ;
                  return capacityRippleAcc(dictMonadState)(capacity)({
                    openSet: vars.openSet.value1,
                    closedSet
                  });
                });
              });
            }
            ;
            if (v2 instanceof Nothing) {
              return capacityRippleAcc(dictMonadState)(capacity)({
                openSet: vars.openSet.value1,
                closedSet
              });
            }
            ;
            throw new Error("Failed pattern match at Game.Board.Query (line 186, column 5 - line 198, column 70): " + [v2.constructor.name]);
          });
        }
        ;
        throw new Error("Failed pattern match at Game.Board.Query (line 179, column 35 - line 198, column 70): " + [vars.openSet.constructor.name]);
      };
    };
  };
  var capacityRipple = function(dictMonadState) {
    var capacityRippleAcc1 = capacityRippleAcc(dictMonadState);
    return function(relEdge) {
      return function(capacity) {
        return capacityRippleAcc1(capacity)({
          openSet: singleton4(relEdge),
          closedSet: empty3
        });
      };
    };
  };
  var buildConnectionMapAt = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var applicativeWriterT1 = applicativeWriterT2(Monad0.Applicative0());
    var for_10 = for_(applicativeWriterT1)(foldableArray);
    var bind118 = bind(bindWriterT2(Monad0.Bind1()));
    var monadStateWriterT1 = monadStateWriterT2(dictMonadState);
    var connectedRelativeEdge1 = connectedRelativeEdge(monadStateWriterT1);
    var traverse_17 = traverse_(applicativeWriterT1)(foldableMaybe);
    var getPortOnEdge1 = getPortOnEdge(monadStateWriterT1);
    var tell6 = tell(monadTellWriterT2(Monad0));
    var pure34 = pure(applicativeWriterT1);
    return function(loc) {
      return for_10(allDirections)(function(dir2) {
        var relEdge = relative(loc)(dir2);
        return bind118(connectedRelativeEdge1(relEdge))(traverse_17(function(adjRelEdge) {
          return bind118(getPortOnEdge1(relEdge))(function(port2) {
            var v2 = map39(portType)(port2);
            if (v2 instanceof Just && v2.value0 instanceof Input) {
              return tell6(singleton4(new Tuple(relEdge, adjRelEdge)));
            }
            ;
            if (v2 instanceof Just && v2.value0 instanceof Output) {
              return tell6(singleton4(new Tuple(adjRelEdge, relEdge)));
            }
            ;
            if (v2 instanceof Nothing) {
              return pure34(unit);
            }
            ;
            throw new Error("Failed pattern match at Game.Board.Query (line 163, column 7 - line 168, column 29): " + [v2.constructor.name]);
          });
        }));
      });
    };
  };
  var buildConnectionMap = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var Bind1 = Monad0.Bind1();
    var Functor0 = Bind1.Apply0().Functor0();
    var map311 = map(Functor0);
    var execWriterT2 = execWriterT(Functor0);
    var traverse_17 = traverse_(applicativeWriterT2(Monad0.Applicative0()))(foldableList);
    var buildConnectionMapAt1 = buildConnectionMapAt(dictMonadState);
    return bind(Bind1)(use(dictMonadState)(_pieces2))(function(pieceInfos) {
      return map210(map311(fromFoldable1))(execWriterT2)(traverse_17(buildConnectionMapAt1)(fromFoldable22(keys2(pieceInfos))));
    });
  };

  // output/Component.Board.Types/index.js
  var prop6 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "isCreatingWire";
    }
  })()();
  var prop14 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "locations";
    }
  })()();
  var prop33 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "inputs";
    }
  })()();
  var getBoardPort2 = /* @__PURE__ */ getBoardPort(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var alter2 = /* @__PURE__ */ alter(ordRelativeEdge);
  var lookup8 = /* @__PURE__ */ lookup(ordRelativeEdge);
  var prop42 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "boardHistory";
    }
  })()();
  var GetBoard = /* @__PURE__ */ function() {
    function GetBoard2(value0) {
      this.value0 = value0;
    }
    ;
    GetBoard2.create = function(value0) {
      return new GetBoard2(value0);
    };
    return GetBoard2;
  }();
  var AddPiece = /* @__PURE__ */ function() {
    function AddPiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    AddPiece2.create = function(value0) {
      return function(value1) {
        return new AddPiece2(value0, value1);
      };
    };
    return AddPiece2;
  }();
  var RemovePiece = /* @__PURE__ */ function() {
    function RemovePiece2(value0) {
      this.value0 = value0;
    }
    ;
    RemovePiece2.create = function(value0) {
      return new RemovePiece2(value0);
    };
    return RemovePiece2;
  }();
  var GetMouseOverLocation = /* @__PURE__ */ function() {
    function GetMouseOverLocation2(value0) {
      this.value0 = value0;
    }
    ;
    GetMouseOverLocation2.create = function(value0) {
      return new GetMouseOverLocation2(value0);
    };
    return GetMouseOverLocation2;
  }();
  var SetInputs = /* @__PURE__ */ function() {
    function SetInputs2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetInputs2.create = function(value0) {
      return function(value1) {
        return new SetInputs2(value0, value1);
      };
    };
    return SetInputs2;
  }();
  var SetGoalPorts = /* @__PURE__ */ function() {
    function SetGoalPorts2(value0) {
      this.value0 = value0;
    }
    ;
    SetGoalPorts2.create = function(value0) {
      return new SetGoalPorts2(value0);
    };
    return SetGoalPorts2;
  }();
  var IncrementBoardSize = /* @__PURE__ */ function() {
    function IncrementBoardSize3(value0) {
      this.value0 = value0;
    }
    ;
    IncrementBoardSize3.create = function(value0) {
      return new IncrementBoardSize3(value0);
    };
    return IncrementBoardSize3;
  }();
  var DecrementBoardSize = /* @__PURE__ */ function() {
    function DecrementBoardSize3(value0) {
      this.value0 = value0;
    }
    ;
    DecrementBoardSize3.create = function(value0) {
      return new DecrementBoardSize3(value0);
    };
    return DecrementBoardSize3;
  }();
  var NewBoardState = /* @__PURE__ */ function() {
    function NewBoardState2(value0) {
      this.value0 = value0;
    }
    ;
    NewBoardState2.create = function(value0) {
      return new NewBoardState2(value0);
    };
    return NewBoardState2;
  }();
  var Initialise2 = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var PieceOutput = /* @__PURE__ */ function() {
    function PieceOutput2(value0) {
      this.value0 = value0;
    }
    ;
    PieceOutput2.create = function(value0) {
      return new PieceOutput2(value0);
    };
    return PieceOutput2;
  }();
  var MultimeterOutput = /* @__PURE__ */ function() {
    function MultimeterOutput2(value0) {
      this.value0 = value0;
    }
    ;
    MultimeterOutput2.create = function(value0) {
      return new MultimeterOutput2(value0);
    };
    return MultimeterOutput2;
  }();
  var Undo = /* @__PURE__ */ function() {
    function Undo2() {
    }
    ;
    Undo2.value = new Undo2();
    return Undo2;
  }();
  var Redo = /* @__PURE__ */ function() {
    function Redo2() {
    }
    ;
    Redo2.value = new Redo2();
    return Redo2;
  }();
  var ToggleInput = /* @__PURE__ */ function() {
    function ToggleInput2(value0) {
      this.value0 = value0;
    }
    ;
    ToggleInput2.create = function(value0) {
      return new ToggleInput2(value0);
    };
    return ToggleInput2;
  }();
  var GlobalOnKeyDown = /* @__PURE__ */ function() {
    function GlobalOnKeyDown2(value0) {
      this.value0 = value0;
    }
    ;
    GlobalOnKeyDown2.create = function(value0) {
      return new GlobalOnKeyDown2(value0);
    };
    return GlobalOnKeyDown2;
  }();
  var BoardOnDragExit = /* @__PURE__ */ function() {
    function BoardOnDragExit2(value0) {
      this.value0 = value0;
    }
    ;
    BoardOnDragExit2.create = function(value0) {
      return new BoardOnDragExit2(value0);
    };
    return BoardOnDragExit2;
  }();
  var LocationOnMouseDown = /* @__PURE__ */ function() {
    function LocationOnMouseDown2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnMouseDown2.create = function(value0) {
      return function(value1) {
        return new LocationOnMouseDown2(value0, value1);
      };
    };
    return LocationOnMouseDown2;
  }();
  var LocationOnMouseOver = /* @__PURE__ */ function() {
    function LocationOnMouseOver2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnMouseOver2.create = function(value0) {
      return function(value1) {
        return new LocationOnMouseOver2(value0, value1);
      };
    };
    return LocationOnMouseOver2;
  }();
  var LocationOnMouseUp = /* @__PURE__ */ function() {
    function LocationOnMouseUp2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnMouseUp2.create = function(value0) {
      return function(value1) {
        return new LocationOnMouseUp2(value0, value1);
      };
    };
    return LocationOnMouseUp2;
  }();
  var LocationOnDragEnter = /* @__PURE__ */ function() {
    function LocationOnDragEnter2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnDragEnter2.create = function(value0) {
      return function(value1) {
        return new LocationOnDragEnter2(value0, value1);
      };
    };
    return LocationOnDragEnter2;
  }();
  var LocationOnDragOver = /* @__PURE__ */ function() {
    function LocationOnDragOver2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnDragOver2.create = function(value0) {
      return function(value1) {
        return new LocationOnDragOver2(value0, value1);
      };
    };
    return LocationOnDragOver2;
  }();
  var LocationOnDragLeave = /* @__PURE__ */ function() {
    function LocationOnDragLeave2(value0) {
      this.value0 = value0;
    }
    ;
    LocationOnDragLeave2.create = function(value0) {
      return new LocationOnDragLeave2(value0);
    };
    return LocationOnDragLeave2;
  }();
  var LocationOnDrop = /* @__PURE__ */ function() {
    function LocationOnDrop2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationOnDrop2.create = function(value0) {
      return function(value1) {
        return new LocationOnDrop2(value0, value1);
      };
    };
    return LocationOnDrop2;
  }();
  var BoardPortOnMouseEnter = /* @__PURE__ */ function() {
    function BoardPortOnMouseEnter2(value0) {
      this.value0 = value0;
    }
    ;
    BoardPortOnMouseEnter2.create = function(value0) {
      return new BoardPortOnMouseEnter2(value0);
    };
    return BoardPortOnMouseEnter2;
  }();
  var BoardPortOnMouseLeave = /* @__PURE__ */ function() {
    function BoardPortOnMouseLeave2() {
    }
    ;
    BoardPortOnMouseLeave2.value = new BoardPortOnMouseLeave2();
    return BoardPortOnMouseLeave2;
  }();
  var _wireLocations = function(dictWander) {
    var Strong0 = dictWander.Strong0();
    var $36 = prop6($$Proxy.value)(Strong0);
    var $37 = _Just(dictWander.Choice1());
    var $38 = prop14($$Proxy.value)(Strong0);
    return function($39) {
      return $36($37($38($39)));
    };
  };
  var _piece = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _multimeter = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _inputs = function(dictStrong) {
    return prop33($$Proxy.value)(dictStrong);
  };
  var _boardPort = function(dir2) {
    return function(dictStrong) {
      var setPort2 = function(state3) {
        return function(maybePortInfo) {
          var board = head6(state3.boardHistory);
          var relEdge = evalState(getBoardPort2(dir2))(board);
          return {
            boardHistory: state3.boardHistory,
            mouseOverLocation: state3.mouseOverLocation,
            inputs: state3.inputs,
            outputs: state3.outputs,
            lastEvalWithPortInfo: alter2(function(v1) {
              return maybePortInfo;
            })(relEdge)(state3.lastEvalWithPortInfo),
            goalPorts: state3.goalPorts,
            isCreatingWire: state3.isCreatingWire
          };
        };
      };
      var getPort2 = function(state3) {
        var board = head6(state3.boardHistory);
        var relEdge = evalState(getBoardPort2(dir2))(board);
        return lookup8(relEdge)(state3.lastEvalWithPortInfo);
      };
      return lens(getPort2)(setPort2)(dictStrong);
    };
  };
  var _board = function(dictStrong) {
    var $40 = prop42($$Proxy.value)(dictStrong);
    var $41 = _head2(dictStrong);
    return function($42) {
      return $40($41($42));
    };
  };

  // output/Debug/foreign.js
  var req = typeof module === "undefined" ? void 0 : module.require;
  var util = function() {
    try {
      return req === void 0 ? void 0 : req("util");
    } catch (e) {
      return void 0;
    }
  }();
  var now = function() {
    var perf;
    if (typeof performance !== "undefined") {
      perf = performance;
    } else if (req) {
      try {
        perf = req("perf_hooks").performance;
      } catch (e) {
      }
    }
    return function() {
      return (perf || Date).now();
    };
  }();

  // output/Game.Piece.Complexity/index.js
  var mempty3 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidAdditive(semiringNumber));
  var space = function($6) {
    return function(v2) {
      return {
        space: v2,
        time: mempty3
      };
    }(Additive($6));
  };

  // output/Game.Piece.ArithmeticPiece/index.js
  var fold5 = /* @__PURE__ */ fold(foldableMaybe)(monoidSignal);
  var lookup9 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var eq9 = /* @__PURE__ */ eq(eqSignal);
  var zero2 = /* @__PURE__ */ zero(semiringSignal);
  var add4 = /* @__PURE__ */ add(semiringSignal);
  var one2 = /* @__PURE__ */ one(semiringSignal);
  var fromFoldable6 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
  var mkSuccPiece = function(capacity) {
    return {
      name: "succ",
      "eval": function(m2) {
        var s2 = fold5(lookup9(Left2.value)(m2));
        return singleton5(Right2.value)(function() {
          var $12 = eq9(s2)(maxValue(capacity));
          if ($12) {
            return zero2;
          }
          ;
          return add4(s2)(one2);
        }());
      },
      complexity: space(10),
      shouldRipple: false,
      updateCapacity: function(v2) {
        return function(capacity$prime) {
          return new Just(mkSuccPiece(capacity$prime));
        };
      },
      ports: fromFoldable6([new Tuple(Left2.value, inputPort(capacity)), new Tuple(Right2.value, outputPort(capacity))]),
      updatePort: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      }
    };
  };
  var succPiece = /* @__PURE__ */ function() {
    return mkSuccPiece(TwoBit.value);
  }();

  // output/Game.Expression/index.js
  var ff2 = /* @__PURE__ */ ff(heytingAlgebraSignal);
  var tt2 = /* @__PURE__ */ tt(heytingAlgebraSignal);
  var not3 = /* @__PURE__ */ not(heytingAlgebraSignal);
  var disj2 = /* @__PURE__ */ disj(heytingAlgebraSignal);
  var conj12 = /* @__PURE__ */ conj(heytingAlgebraSignal);
  var lookup10 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var Raw = /* @__PURE__ */ function() {
    function Raw2(value0) {
      this.value0 = value0;
    }
    ;
    Raw2.create = function(value0) {
      return new Raw2(value0);
    };
    return Raw2;
  }();
  var Ref2 = /* @__PURE__ */ function() {
    function Ref3(value0) {
      this.value0 = value0;
    }
    ;
    Ref3.create = function(value0) {
      return new Ref3(value0);
    };
    return Ref3;
  }();
  var Not = /* @__PURE__ */ function() {
    function Not2(value0) {
      this.value0 = value0;
    }
    ;
    Not2.create = function(value0) {
      return new Not2(value0);
    };
    return Not2;
  }();
  var Or = /* @__PURE__ */ function() {
    function Or2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Or2.create = function(value0) {
      return function(value1) {
        return new Or2(value0, value1);
      };
    };
    return Or2;
  }();
  var And = /* @__PURE__ */ function() {
    function And2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    And2.create = function(value0) {
      return function(value1) {
        return new And2(value0, value1);
      };
    };
    return And2;
  }();
  var Xor = /* @__PURE__ */ function() {
    function Xor2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Xor2.create = function(value0) {
      return function(value1) {
        return new Xor2(value0, value1);
      };
    };
    return Xor2;
  }();
  var heytingAlgebraExpression = /* @__PURE__ */ function() {
    return {
      ff: new Raw(ff2),
      tt: new Raw(tt2),
      not: Not.create,
      implies: function(a3) {
        return function(b2) {
          return new Or(new Not(a3), b2);
        };
      },
      disj: Or.create,
      conj: And.create
    };
  }();
  var ref3 = /* @__PURE__ */ function() {
    return Ref2.create;
  }();
  var evaluate = function(m2) {
    var go2 = function(v2) {
      if (v2 instanceof Raw) {
        return v2.value0;
      }
      ;
      if (v2 instanceof Ref2) {
        return fromMaybe(ff2)(lookup10(v2.value0)(m2));
      }
      ;
      if (v2 instanceof Not) {
        return not3(go2(v2.value0));
      }
      ;
      if (v2 instanceof Or) {
        return disj2(go2(v2.value0))(go2(v2.value1));
      }
      ;
      if (v2 instanceof And) {
        return conj12(go2(v2.value0))(go2(v2.value1));
      }
      ;
      if (v2 instanceof Xor) {
        var v1 = go2(v2.value1);
        var v22 = go2(v2.value0);
        return v22 ^ v1;
      }
      ;
      throw new Error("Failed pattern match at Game.Expression (line 80, column 8 - line 87, column 45): " + [v2.constructor.name]);
    };
    return go2;
  };

  // output/Game.Piece.BasicPiece/index.js
  var mapMaybe4 = /* @__PURE__ */ mapMaybe2(ordCardinalDirection);
  var mapFlipped4 = /* @__PURE__ */ mapFlipped(functorMap);
  var fromFoldable7 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
  var BasicInput = /* @__PURE__ */ function() {
    function BasicInput2() {
    }
    ;
    BasicInput2.value = new BasicInput2();
    return BasicInput2;
  }();
  var BasicOutput = /* @__PURE__ */ function() {
    function BasicOutput2(value0) {
      this.value0 = value0;
    }
    ;
    BasicOutput2.create = function(value0) {
      return new BasicOutput2(value0);
    };
    return BasicOutput2;
  }();
  var basicPiece = function(basic) {
    return {
      name: basic.name,
      "eval": function(inputs) {
        return flip(mapMaybe4)(basic.ports)(function(v2) {
          if (v2 instanceof BasicInput) {
            return Nothing.value;
          }
          ;
          if (v2 instanceof BasicOutput) {
            return new Just(evaluate(inputs)(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Game.Piece.BasicPiece (line 36, column 52 - line 38, column 66): " + [v2.constructor.name]);
        });
      },
      complexity: basic.complexity,
      shouldRipple: true,
      updateCapacity: function(v2) {
        return function(capacity) {
          return new Just(basicPiece({
            name: basic.name,
            capacity,
            complexity: basic.complexity,
            ports: basic.ports
          }));
        };
      },
      ports: mapFlipped4(basic.ports)(function(v2) {
        if (v2 instanceof BasicInput) {
          return inputPort(basic.capacity);
        }
        ;
        if (v2 instanceof BasicOutput) {
          return outputPort(basic.capacity);
        }
        ;
        throw new Error("Failed pattern match at Game.Piece.BasicPiece (line 44, column 28 - line 46, column 49): " + [v2.constructor.name]);
      }),
      updatePort: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      }
    };
  };
  var chickenPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "chicken-piece",
      capacity: OneBit.value,
      complexity: space(2),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Right2.value, BasicInput.value), new Tuple(Up.value, new BasicOutput(ref3(Right2.value))), new Tuple(Down.value, new BasicOutput(ref3(Left2.value)))])
    });
  }();
  var cornerCutPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "corner-cut-piece",
      capacity: OneBit.value,
      complexity: space(2),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Up.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(ref3(Up.value))), new Tuple(Down.value, new BasicOutput(ref3(Left2.value)))])
    });
  }();
  var crossPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "cross-piece",
      capacity: OneBit.value,
      complexity: space(2),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Up.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(ref3(Left2.value))), new Tuple(Down.value, new BasicOutput(ref3(Up.value)))])
    });
  }();
  var notPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "not-piece",
      capacity: OneBit.value,
      complexity: space(2),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(not(heytingAlgebraExpression)(ref3(Left2.value))))])
    });
  }();
  var orPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "or-piece",
      capacity: OneBit.value,
      complexity: space(3),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Up.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(disj(heytingAlgebraExpression)(ref3(Left2.value))(ref3(Up.value))))])
    });
  }();
  var xorPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "xor-piece",
      capacity: OneBit.value,
      complexity: space(5),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Up.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(new Xor(ref3(Left2.value), ref3(Up.value))))])
    });
  }();
  var andPiece = /* @__PURE__ */ function() {
    return basicPiece({
      name: "and-piece",
      capacity: OneBit.value,
      complexity: space(3),
      ports: fromFoldable7([new Tuple(Left2.value, BasicInput.value), new Tuple(Up.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(conj(heytingAlgebraExpression)(ref3(Left2.value))(ref3(Up.value))))])
    });
  }();
  var allBasicPieces = [notPiece, orPiece, andPiece, crossPiece, cornerCutPiece, chickenPiece, xorPiece];

  // output/Game.Piece.CommutativePiece/index.js
  var allCommutativePieces = [];

  // output/Game.Piece.FusePiece/index.js
  var foldMap3 = /* @__PURE__ */ foldMap(foldableMaybe)(/* @__PURE__ */ monoidTuple(monoidSignal)(monoidSignal));
  var lookup11 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var fromFoldable8 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
  var bind18 = /* @__PURE__ */ bind(bindMaybe);
  var discard7 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
  var guard4 = /* @__PURE__ */ guard(alternativeMaybe);
  var notEq4 = /* @__PURE__ */ notEq(eqCapacity);
  var pure11 = /* @__PURE__ */ pure(applicativeMaybe);
  var fold6 = /* @__PURE__ */ fold(foldableMaybe)(monoidSignal);
  var severSignal = function(outputCapacity) {
    return function(v2) {
      var n = toInt(outputCapacity);
      var low2 = v2 & ((1 << n) - 1 | 0);
      var high2 = v2 >> n;
      return new Tuple(high2, low2);
    };
  };
  var mkSeverPiece = function(v2) {
    return {
      name: "sever-piece",
      "eval": function(inputs) {
        var v1 = foldMap3(severSignal(v2.outputCapacity))(lookup11(Left2.value)(inputs));
        return fromFoldable8([new Tuple(Up.value, v1.value0), new Tuple(Down.value, v1.value1)]);
      },
      complexity: space(1),
      shouldRipple: false,
      updateCapacity: function(dir2) {
        return function(capacity) {
          if (dir2 instanceof Right2) {
            return Nothing.value;
          }
          ;
          if (dir2 instanceof Left2) {
            return bind18(halveCapacity(capacity))(function(outputCapacity$prime) {
              return discard7(guard4(notEq4(v2.outputCapacity)(outputCapacity$prime)))(function() {
                return pure11(mkSeverPiece({
                  outputCapacity: outputCapacity$prime
                }));
              });
            });
          }
          ;
          return discard7(guard4(notEq4(capacity)(v2.outputCapacity)))(function() {
            return pure11(mkSeverPiece({
              outputCapacity: capacity
            }));
          });
        };
      },
      ports: fromMaybe(empty2)(bind18(doubleCapacity(v2.outputCapacity))(function(inputCapacity) {
        return pure11(fromFoldable8([new Tuple(Left2.value, inputPort(inputCapacity)), new Tuple(Up.value, outputPort(v2.outputCapacity)), new Tuple(Down.value, outputPort(v2.outputCapacity))]));
      })),
      updatePort: function(v1) {
        return function(v22) {
          return Nothing.value;
        };
      }
    };
  };
  var severPiece = /* @__PURE__ */ function() {
    return mkSeverPiece({
      outputCapacity: OneBit.value
    });
  }();
  var fuseSignals = function(inputCapacity) {
    return function(v2) {
      return function(v1) {
        var n = toInt(inputCapacity);
        return v2 << n | v1 & ((1 << n) - 1 | 0);
      };
    };
  };
  var mkFusePiece = function(v2) {
    return {
      name: "fuse-piece",
      "eval": function(inputs) {
        var low2 = fold6(lookup11(Down.value)(inputs));
        var high2 = fold6(lookup11(Up.value)(inputs));
        return singleton5(Right2.value)(fuseSignals(v2.inputCapacity)(high2)(low2));
      },
      complexity: space(1),
      shouldRipple: false,
      updateCapacity: function(dir2) {
        return function(capacity) {
          if (dir2 instanceof Left2) {
            return Nothing.value;
          }
          ;
          if (dir2 instanceof Right2) {
            return bind18(halveCapacity(capacity))(function(inputCapacity$prime) {
              return discard7(guard4(notEq4(inputCapacity$prime)(v2.inputCapacity)))(function() {
                return pure11(mkFusePiece({
                  inputCapacity: inputCapacity$prime
                }));
              });
            });
          }
          ;
          return discard7(guard4(notEq4(capacity)(v2.inputCapacity)))(function() {
            return bind18(doubleCapacity(capacity))(function() {
              return pure11(mkFusePiece({
                inputCapacity: capacity
              }));
            });
          });
        };
      },
      ports: fromMaybe(empty2)(bind18(doubleCapacity(v2.inputCapacity))(function(outputCapacity) {
        return pure11(fromFoldable8([new Tuple(Up.value, inputPort(v2.inputCapacity)), new Tuple(Down.value, inputPort(v2.inputCapacity)), new Tuple(Right2.value, outputPort(outputCapacity))]));
      })),
      updatePort: function(v1) {
        return function(v22) {
          return Nothing.value;
        };
      }
    };
  };
  var fusePiece = /* @__PURE__ */ function() {
    return mkFusePiece({
      inputCapacity: OneBit.value
    });
  }();
  var allFusePieces = [fusePiece, severPiece];

  // output/Game.Piece.TwoBitSuite/index.js
  var fold7 = /* @__PURE__ */ fold(foldableMaybe)(monoidSignal);
  var lookup12 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var twoBitCrossOver = /* @__PURE__ */ function() {
    return {
      name: "two-bit-cross-over",
      "eval": function(m2) {
        var s2 = fold7(lookup12(Left2.value)(m2));
        var output2 = function() {
          var $10 = nthBit(s2)(0);
          if ($10) {
            return 2;
          }
          ;
          return 0;
        }() + function() {
          var $11 = nthBit(s2)(1);
          if ($11) {
            return 1;
          }
          ;
          return 0;
        }() | 0;
        return singleton5(Right2.value)(output2);
      },
      complexity: space(20),
      shouldRipple: false,
      updateCapacity: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      },
      ports: fromFoldable3(ordCardinalDirection)(foldableArray)([new Tuple(Left2.value, inputPort(TwoBit.value)), new Tuple(Right2.value, outputPort(TwoBit.value))]),
      updatePort: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      }
    };
  }();

  // output/Game.Piece.WirePiece/index.js
  var lookup13 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var voidLeft4 = /* @__PURE__ */ voidLeft(functorMap);
  var length11 = /* @__PURE__ */ length(foldableSet)(semiringInt);
  var insert9 = /* @__PURE__ */ insert(ordCardinalDirection);
  var insert12 = /* @__PURE__ */ insert2(ordCardinalDirection);
  var discard8 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
  var guard5 = /* @__PURE__ */ guard(alternativeMaybe);
  var notEq5 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqSet(eqCardinalDirection));
  var pure14 = /* @__PURE__ */ pure(applicativeMaybe);
  var $$delete6 = /* @__PURE__ */ $$delete3(ordCardinalDirection);
  var fromFoldable9 = /* @__PURE__ */ fromFoldable4(foldableArray)(ordCardinalDirection);
  var wirePiece = function(wire) {
    return {
      name: wire.name,
      "eval": function(inputs) {
        var signal = fromMaybe(0)(lookup13(Left2.value)(inputs));
        return voidLeft4(toMap(wire.outputs))(signal);
      },
      complexity: space(toNumber(length11(wire.outputs))),
      shouldRipple: true,
      updateCapacity: function(v2) {
        return function(capacity) {
          return new Just(wirePiece({
            name: wire.name,
            capacity,
            outputs: wire.outputs
          }));
        };
      },
      ports: insert9(Left2.value)(inputPort(wire.capacity))(voidLeft4(toMap(wire.outputs))(outputPort(wire.capacity))),
      updatePort: function(dir2) {
        return function(portType2) {
          if (dir2 instanceof Left2) {
            return Nothing.value;
          }
          ;
          if (portType2 instanceof Just && portType2.value0 instanceof Input) {
            var newOutputs = insert12(dir2)(wire.outputs);
            return discard8(guard5(notEq5(wire.outputs)(newOutputs)))(function() {
              return pure14(wirePiece({
                name: wire.name,
                capacity: wire.capacity,
                outputs: newOutputs
              }));
            });
          }
          ;
          if (portType2 instanceof Just && portType2.value0 instanceof Output) {
            return Nothing.value;
          }
          ;
          if (portType2 instanceof Nothing) {
            var newOutputs = $$delete6(dir2)(wire.outputs);
            return discard8(guard5(notEq5(wire.outputs)(newOutputs)))(function() {
              var $24 = isEmpty2(newOutputs);
              if ($24) {
                return pure14(wirePiece({
                  name: wire.name,
                  capacity: wire.capacity,
                  outputs: singleton6(Right2.value)
                }));
              }
              ;
              return pure14(wirePiece({
                name: wire.name,
                capacity: wire.capacity,
                outputs: newOutputs
              }));
            });
          }
          ;
          throw new Error("Failed pattern match at Game.Piece.WirePiece (line 52, column 34 - line 64, column 66): " + [dir2.constructor.name, portType2.constructor.name]);
        };
      }
    };
  };
  var superPiece = /* @__PURE__ */ function() {
    return wirePiece({
      name: "super-piece",
      capacity: OneBit.value,
      outputs: fromFoldable9([Up.value, Right2.value, Down.value])
    });
  }();
  var rightPiece = /* @__PURE__ */ function() {
    return wirePiece({
      name: "right-piece",
      capacity: OneBit.value,
      outputs: fromFoldable9([Down.value])
    });
  }();
  var leftPiece = /* @__PURE__ */ function() {
    return wirePiece({
      name: "left-piece",
      capacity: OneBit.value,
      outputs: fromFoldable9([Up.value])
    });
  }();
  var idPiece = /* @__PURE__ */ function() {
    return wirePiece({
      name: "id-piece",
      capacity: OneBit.value,
      outputs: fromFoldable9([Right2.value])
    });
  }();
  var allWirePieces = [idPiece, leftPiece, rightPiece, superPiece];

  // output/Game.Piece/index.js
  var append14 = /* @__PURE__ */ append(semigroupArray);
  var show7 = /* @__PURE__ */ show(showPieceId);
  var lookup14 = /* @__PURE__ */ lookup(ordPieceId);
  var allPieces = /* @__PURE__ */ append14(allBasicPieces)(/* @__PURE__ */ append14(allCommutativePieces)(/* @__PURE__ */ append14(allWirePieces)(allFusePieces)));
  var pieceVault = /* @__PURE__ */ fromFoldable3(ordPieceId)(foldableArray)(/* @__PURE__ */ map(functorArray)(function(v2) {
    return new Tuple(v2.name, v2);
  })(allPieces));
  var pieceLookup = function(pieceId) {
    var message3 = "piece lookup crash on " + (show7(pieceId) + "... WITH NO SURVIVORS");
    return fromMaybe$prime(function(v2) {
      return unsafeCrashWith(message3);
    })(lookup14(pieceId)(pieceVault));
  };

  // output/Game.Board.Operation/index.js
  var show8 = /* @__PURE__ */ show(showLocation);
  var show13 = /* @__PURE__ */ show(showInt);
  var _pieces3 = /* @__PURE__ */ _pieces(strongForget);
  var at3 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordLocation));
  var _pieces12 = /* @__PURE__ */ _pieces(strongFn);
  var ix3 = /* @__PURE__ */ ix(/* @__PURE__ */ indexMap(ordLocation));
  var prop7 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "piece";
    }
  })()();
  var map40 = /* @__PURE__ */ map(functorMaybe);
  var unwrap9 = /* @__PURE__ */ unwrap();
  var discard9 = /* @__PURE__ */ discard(discardUnit);
  var map117 = /* @__PURE__ */ map(functorEither);
  var all4 = /* @__PURE__ */ all(foldableArray)(heytingAlgebraBoolean);
  var between2 = /* @__PURE__ */ between(ordInt);
  var find3 = /* @__PURE__ */ find(foldableSet);
  var not4 = /* @__PURE__ */ not(heytingAlgebraBoolean);
  var _rotation3 = /* @__PURE__ */ _rotation(strongFn);
  var LocationOccupied = /* @__PURE__ */ function() {
    function LocationOccupied2(value0) {
      this.value0 = value0;
    }
    ;
    LocationOccupied2.create = function(value0) {
      return new LocationOccupied2(value0);
    };
    return LocationOccupied2;
  }();
  var LocationNotOccupied = /* @__PURE__ */ function() {
    function LocationNotOccupied2(value0) {
      this.value0 = value0;
    }
    ;
    LocationNotOccupied2.create = function(value0) {
      return new LocationNotOccupied2(value0);
    };
    return LocationNotOccupied2;
  }();
  var InvalidLocation = /* @__PURE__ */ function() {
    function InvalidLocation2(value0) {
      this.value0 = value0;
    }
    ;
    InvalidLocation2.create = function(value0) {
      return new InvalidLocation2(value0);
    };
    return InvalidLocation2;
  }();
  var InvalidBoardInitialisation = /* @__PURE__ */ function() {
    function InvalidBoardInitialisation2(value0) {
      this.value0 = value0;
    }
    ;
    InvalidBoardInitialisation2.create = function(value0) {
      return new InvalidBoardInitialisation2(value0);
    };
    return InvalidBoardInitialisation2;
  }();
  var BadBoardSize = /* @__PURE__ */ function() {
    function BadBoardSize2(value0) {
      this.value0 = value0;
    }
    ;
    BadBoardSize2.create = function(value0) {
      return new BadBoardSize2(value0);
    };
    return BadBoardSize2;
  }();
  var Cyclic = /* @__PURE__ */ function() {
    function Cyclic2() {
    }
    ;
    Cyclic2.value = new Cyclic2();
    return Cyclic2;
  }();
  var showBoardError = {
    show: function(v2) {
      if (v2 instanceof LocationOccupied) {
        return "Location Occupied: " + show8(v2.value0);
      }
      ;
      if (v2 instanceof LocationNotOccupied) {
        return "Location Not Occupied: " + show8(v2.value0);
      }
      ;
      if (v2 instanceof InvalidLocation) {
        return "Location " + (show8(v2.value0) + " is outside range of the board");
      }
      ;
      if (v2 instanceof InvalidBoardInitialisation) {
        return "Invalid Board Initialisation: " + (show13(v2.value0) + " is not a valid board size");
      }
      ;
      if (v2 instanceof BadBoardSize) {
        return "Boards of size " + (show13(v2.value0) + " are not valid");
      }
      ;
      if (v2 instanceof Cyclic) {
        return "ABED does not admit cyclic boards";
      }
      ;
      throw new Error("Failed pattern match at Game.Board.Operation (line 51, column 10 - line 57, column 50): " + [v2.constructor.name]);
    }
  };
  var monadStateBoardBoardT = function(dictMonad) {
    return monadStateStateT(monadExceptT(dictMonad));
  };
  var monadErrorBoardErrorBoard = function(dictMonad) {
    return monadErrorStateT(monadErrorExceptT(dictMonad));
  };
  var validBoardSize = function(dictMonadThrow) {
    var throwError3 = throwError(dictMonadThrow);
    var pure34 = pure(dictMonadThrow.Monad0().Applicative0());
    return function(n) {
      var $335 = even(n) || (n < 3 || n > 9);
      if ($335) {
        return throwError3(new BadBoardSize(n));
      }
      ;
      return pure34(n);
    };
  };
  var updateRelEdge = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind36 = bind(Monad0.Bind1());
    var use4 = use(dictMonadState);
    var Applicative0 = Monad0.Applicative0();
    var traverse_17 = traverse_(Applicative0)(foldableMaybe);
    var for_10 = for_(Applicative0)(foldableMaybe);
    var assign4 = assign2(dictMonadState);
    return function(v2) {
      return function(portType2) {
        return bind36(use4(function() {
          var $374 = at3(v2.loc)(strongForget);
          return function($375) {
            return _pieces3($374($375));
          };
        }()))(traverse_17(function(info2) {
          return for_10(updatePort(v2.dir)(portType2)(info2.piece))(function(piece) {
            return assign4(function() {
              var $376 = ix3(v2.loc)(strongFn)(choiceFn);
              var $377 = prop7($$Proxy.value)(strongFn);
              return function($378) {
                return _pieces12($376($377($378)));
              };
            }())(piece);
          });
        }));
      };
    };
  };
  var updatePortsAround = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var for_10 = for_(Monad0.Applicative0())(foldableArray);
    var bind36 = bind(Monad0.Bind1());
    var getPortOnEdge3 = getPortOnEdge(dictMonadState);
    var adjacentRelativeEdge3 = adjacentRelativeEdge(dictMonadState);
    var updateRelEdge1 = updateRelEdge(dictMonadState);
    return function(loc) {
      return for_10(allDirections)(function(dir2) {
        var relEdge = relative(loc)(dir2);
        return bind36(getPortOnEdge3(relEdge))(function(maybePort) {
          return bind36(adjacentRelativeEdge3(relEdge))(function(relEdge$prime) {
            return updateRelEdge1(relEdge$prime)(map40(portType)(maybePort));
          });
        });
      });
    };
  };
  var runBoardT = function(dictMonad) {
    return function(boardM) {
      return function(b2) {
        return runExceptT(runStateT(unwrap9(boardM))(b2));
      };
    };
  };
  var runBoardT1 = /* @__PURE__ */ runBoardT(monadIdentity);
  var runBoardM = function(boardM) {
    return function(b2) {
      return unwrap9(runBoardT1(boardM)(b2));
    };
  };
  var movePiece = function(dictMonadError) {
    var MonadThrow0 = dictMonadError.MonadThrow0();
    var Monad0 = MonadThrow0.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind36 = bind(Bind1);
    var discard112 = discard9(Bind1);
    var whenM3 = whenM(Monad0);
    var map215 = map(Bind1.Apply0().Functor0());
    var throwError3 = throwError(MonadThrow0);
    var pure34 = pure(Monad0.Applicative0());
    return function(dictMonadState) {
      var use4 = use(dictMonadState);
      var assign4 = assign2(dictMonadState);
      var updatePortsAround1 = updatePortsAround(dictMonadState);
      return function(src9) {
        return function(dst) {
          return bind36(use4(function() {
            var $379 = at3(src9)(strongForget);
            return function($380) {
              return _pieces3($379($380));
            };
          }()))(function(v2) {
            if (v2 instanceof Just) {
              return discard112(whenM3(map215(isJust)(use4(function() {
                var $381 = at3(dst)(strongForget);
                return function($382) {
                  return _pieces3($381($382));
                };
              }())))(throwError3(new LocationOccupied(dst))))(function() {
                return discard112(assign4(function() {
                  var $383 = at3(src9)(strongFn);
                  return function($384) {
                    return _pieces12($383($384));
                  };
                }())(Nothing.value))(function() {
                  return discard112(assign4(function() {
                    var $385 = at3(dst)(strongFn);
                    return function($386) {
                      return _pieces12($385($386));
                    };
                  }())(new Just(v2.value0)))(function() {
                    return discard112(updatePortsAround1(src9))(function() {
                      return discard112(updatePortsAround1(dst))(function() {
                        return pure34(v2.value0.piece);
                      });
                    });
                  });
                });
              });
            }
            ;
            if (v2 instanceof Nothing) {
              return throwError3(new LocationNotOccupied(src9));
            }
            ;
            throw new Error("Failed pattern match at Game.Board.Operation (line 178, column 32 - line 189, column 43): " + [v2.constructor.name]);
          });
        };
      };
    };
  };
  var increaseSize = function(dictMonadState) {
    var get5 = get(dictMonadState);
    var put3 = put(dictMonadState);
    return function(dictMonadError) {
      var MonadThrow0 = dictMonadError.MonadThrow0();
      var bind36 = bind(MonadThrow0.Monad0().Bind1());
      var validBoardSize1 = validBoardSize(MonadThrow0);
      return bind36(get5)(function(v2) {
        return bind36(validBoardSize1(v2.size + 2 | 0))(function(newSize) {
          return put3({
            size: newSize,
            pieces: unsafeMapKey(function(v1) {
              return location2(v1.x + 1 | 0)(v1.y + 1 | 0);
            })(v2.pieces)
          });
        });
      });
    };
  };
  var getPieceInfo = function(dictMonadState) {
    var use4 = use(dictMonadState);
    return function(dictMonadError) {
      var MonadThrow0 = dictMonadError.MonadThrow0();
      var Monad0 = MonadThrow0.Monad0();
      var bind36 = bind(Monad0.Bind1());
      var throwError3 = throwError(MonadThrow0);
      var pure34 = pure(Monad0.Applicative0());
      return function(loc) {
        return bind36(use4(function() {
          var $387 = at3(loc)(strongForget);
          return function($388) {
            return _pieces3($387($388));
          };
        }()))(maybe(throwError3(new LocationNotOccupied(loc)))(pure34));
      };
    };
  };
  var getPiece = function(dictMonadState) {
    var getPieceInfo1 = getPieceInfo(dictMonadState);
    return function(dictMonadError) {
      var map215 = map(dictMonadError.MonadThrow0().Monad0().Bind1().Apply0().Functor0());
      var getPieceInfo22 = getPieceInfo1(dictMonadError);
      return function(loc) {
        return map215(function(v2) {
          return v2.piece;
        })(getPieceInfo22(loc));
      };
    };
  };
  var evalBoardT = function(dictMonad) {
    var map215 = map(dictMonad.Bind1().Apply0().Functor0());
    var runBoardT2 = runBoardT(dictMonad);
    return function(boardM) {
      return function(b2) {
        return map215(map117(fst))(runBoardT2(boardM)(b2));
      };
    };
  };
  var evalBoardT1 = /* @__PURE__ */ evalBoardT(monadIdentity);
  var evalBoardM = function(boardM) {
    return function(b2) {
      return unwrap9(evalBoardT1(boardM)(b2));
    };
  };
  var decreaseSize = function(dictMonadState) {
    var get5 = get(dictMonadState);
    var put3 = put(dictMonadState);
    return function(dictMonadError) {
      var MonadThrow0 = dictMonadError.MonadThrow0();
      var bind36 = bind(MonadThrow0.Monad0().Bind1());
      var validBoardSize1 = validBoardSize(MonadThrow0);
      var throwError3 = throwError(MonadThrow0);
      return bind36(get5)(function(v2) {
        return bind36(validBoardSize1(v2.size - 2 | 0))(function(newSize) {
          var insideSquare = function(v1) {
            return all4(between2(1)(v2.size))([v1.x, v1.y]);
          };
          var firstPieceOusideSquare = find3(function($389) {
            return !insideSquare($389);
          })(keys2(v2.pieces));
          if (firstPieceOusideSquare instanceof Just) {
            return throwError3(new LocationOccupied(firstPieceOusideSquare.value0));
          }
          ;
          if (firstPieceOusideSquare instanceof Nothing) {
            return put3({
              size: newSize,
              pieces: unsafeMapKey(function(v1) {
                return location2(v1.x - 1 | 0)(v1.y - 1 | 0);
              })(v2.pieces)
            });
          }
          ;
          throw new Error("Failed pattern match at Game.Board.Operation (line 216, column 3 - line 220, column 83): " + [firstPieceOusideSquare.constructor.name]);
        });
      });
    };
  };
  var checkInsideBoard = function(dictMonadError) {
    var MonadThrow0 = dictMonadError.MonadThrow0();
    var Monad0 = MonadThrow0.Monad0();
    var whenM3 = whenM(Monad0);
    var map215 = map(Monad0.Bind1().Apply0().Functor0());
    var throwError3 = throwError(MonadThrow0);
    return function(dictMonadState) {
      var isInsideBoard2 = isInsideBoard(dictMonadState);
      return function(loc) {
        return whenM3(map215(not4)(isInsideBoard2(loc)))(throwError3(new InvalidLocation(loc)));
      };
    };
  };
  var removePieceNoUpdate = function(dictMonadError) {
    var MonadThrow0 = dictMonadError.MonadThrow0();
    var Monad0 = MonadThrow0.Monad0();
    var Bind1 = Monad0.Bind1();
    var discard112 = discard9(Bind1);
    var checkInsideBoard1 = checkInsideBoard(dictMonadError);
    var bind36 = bind(Bind1);
    var throwError3 = throwError(MonadThrow0);
    var pure34 = pure(Monad0.Applicative0());
    return function(dictMonadState) {
      var checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      var use4 = use(dictMonadState);
      var assign4 = assign2(dictMonadState);
      return function(loc) {
        return discard112(checkInsideBoard2(loc))(function() {
          return bind36(use4(function() {
            var $390 = at3(loc)(strongForget);
            return function($391) {
              return _pieces3($390($391));
            };
          }()))(function(maybePieceInfo) {
            if (maybePieceInfo instanceof Nothing) {
              return throwError3(new LocationNotOccupied(loc));
            }
            ;
            if (maybePieceInfo instanceof Just) {
              return discard112(assign4(function() {
                var $392 = at3(loc)(strongFn);
                return function($393) {
                  return _pieces12($392($393));
                };
              }())(Nothing.value))(function() {
                return pure34(maybePieceInfo.value0.piece);
              });
            }
            ;
            throw new Error("Failed pattern match at Game.Board.Operation (line 162, column 3 - line 166, column 27): " + [maybePieceInfo.constructor.name]);
          });
        });
      };
    };
  };
  var removePiece = function(dictMonadError) {
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var Bind1 = Monad0.Bind1();
    var bind36 = bind(Bind1);
    var removePieceNoUpdate1 = removePieceNoUpdate(dictMonadError);
    var discard112 = discard9(Bind1);
    var pure34 = pure(Monad0.Applicative0());
    return function(dictMonadState) {
      var removePieceNoUpdate2 = removePieceNoUpdate1(dictMonadState);
      var updatePortsAround1 = updatePortsAround(dictMonadState);
      return function(loc) {
        return bind36(removePieceNoUpdate2(loc))(function(piece) {
          return discard112(updatePortsAround1(loc))(function() {
            return pure34(piece);
          });
        });
      };
    };
  };
  var rotatePieceBy = function(dictMonadError) {
    var Bind1 = dictMonadError.MonadThrow0().Monad0().Bind1();
    var discard112 = discard9(Bind1);
    var checkInsideBoard1 = checkInsideBoard(dictMonadError);
    var bind36 = bind(Bind1);
    return function(dictMonadState) {
      var checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      var getPiece1 = getPiece(dictMonadState)(dictMonadError);
      var appendModifying4 = appendModifying(dictMonadState)(semigroupRotation);
      var updatePortsAround1 = updatePortsAround(dictMonadState);
      return function(loc) {
        return function(rot) {
          return discard112(checkInsideBoard2(loc))(function() {
            return bind36(getPiece1(loc))(function() {
              return discard112(appendModifying4(function() {
                var $394 = ix3(loc)(strongFn)(choiceFn);
                return function($395) {
                  return _pieces12($394(_rotation3($395)));
                };
              }())(rot))(function() {
                return updatePortsAround1(loc);
              });
            });
          });
        };
      };
    };
  };
  var addPieceNoUpdate = function(dictMonadError) {
    var MonadThrow0 = dictMonadError.MonadThrow0();
    var Bind1 = MonadThrow0.Monad0().Bind1();
    var discard112 = discard9(Bind1);
    var checkInsideBoard1 = checkInsideBoard(dictMonadError);
    var bind36 = bind(Bind1);
    var throwError3 = throwError(MonadThrow0);
    return function(dictMonadState) {
      var checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      var use4 = use(dictMonadState);
      var assign4 = assign2(dictMonadState);
      return function(loc) {
        return function(piece) {
          return function(rotation2) {
            return discard112(checkInsideBoard2(loc))(function() {
              return bind36(use4(function() {
                var $396 = at3(loc)(strongForget);
                return function($397) {
                  return _pieces3($396($397));
                };
              }()))(function(pieceInfo) {
                if (pieceInfo instanceof Nothing) {
                  return assign4(function() {
                    var $398 = at3(loc)(strongFn);
                    return function($399) {
                      return _pieces12($398($399));
                    };
                  }())(new Just({
                    piece,
                    rotation: rotation2
                  }));
                }
                ;
                if (pieceInfo instanceof Just) {
                  return throwError3(new LocationOccupied(loc));
                }
                ;
                throw new Error("Failed pattern match at Game.Board.Operation (line 149, column 3 - line 151, column 48): " + [pieceInfo.constructor.name]);
              });
            });
          };
        };
      };
    };
  };
  var addPiece = function(dictMonadError) {
    var discard112 = discard9(dictMonadError.MonadThrow0().Monad0().Bind1());
    var addPieceNoUpdate1 = addPieceNoUpdate(dictMonadError);
    return function(dictMonadState) {
      var addPieceNoUpdate2 = addPieceNoUpdate1(dictMonadState);
      var updatePortsAround1 = updatePortsAround(dictMonadState);
      return function(loc) {
        return function(piece) {
          return discard112(addPieceNoUpdate2(loc)(piece)(rotation(0)))(function() {
            return updatePortsAround1(loc);
          });
        };
      };
    };
  };

  // output/Component.Board.Action/index.js
  var map41 = /* @__PURE__ */ map(functorHalogenM);
  var use2 = /* @__PURE__ */ use(monadStateHalogenM);
  var _board2 = /* @__PURE__ */ _board(strongForget);
  var pieceDropped = function(dictMonadState) {
    return function(dictMonadError) {
      var movePiece2 = movePiece(dictMonadError)(dictMonadState);
      var removePiece3 = removePiece(dictMonadError)(dictMonadState);
      return function(src9) {
        return function(maybeDst) {
          if (maybeDst instanceof Just) {
            return movePiece2(src9)(maybeDst.value0);
          }
          ;
          if (maybeDst instanceof Nothing) {
            return removePiece3(src9);
          }
          ;
          throw new Error("Failed pattern match at Component.Board.Action (line 37, column 3 - line 41, column 31): " + [maybeDst.constructor.name]);
        };
      };
    };
  };
  var liftBoardM = function(boardT) {
    return map41(runBoardM(boardT))(use2(_board2));
  };

  // output/Component.DataAttribute/index.js
  var unwrap10 = /* @__PURE__ */ unwrap();
  var Attr = /* @__PURE__ */ function() {
    function Attr2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Attr2.create = function(value0) {
      return function(value1) {
        return new Attr2(value0, value1);
      };
    };
    return Attr2;
  }();
  var selector = function(v2) {
    return function(a3) {
      return "[" + (v2.value0 + ("='" + (v2.value1(a3) + "']")));
    };
  };
  var progress2 = /* @__PURE__ */ function() {
    return new Attr("data-puzzle-progress", function(v2) {
      if (v2 instanceof Completed) {
        return "completed";
      }
      ;
      if (v2 instanceof Incomplete) {
        return "incomplete";
      }
      ;
      throw new Error("Failed pattern match at Component.DataAttribute (line 41, column 51 - line 43, column 29): " + [v2.constructor.name]);
    });
  }();
  var location3 = /* @__PURE__ */ function() {
    return new Attr("data-location", show(showLocation));
  }();
  var direction = /* @__PURE__ */ function() {
    return new Attr("data-direction", function() {
      var $22 = show(showCardinalDirection);
      return function($23) {
        return toLower($22($23));
      };
    }());
  }();
  var connected = /* @__PURE__ */ function() {
    return new Attr("data-connected", function(v2) {
      if (v2) {
        return "connected";
      }
      ;
      return "not-connected";
    });
  }();
  var chatUsername = /* @__PURE__ */ function() {
    return new Attr("data-username", identity(categoryFn));
  }();
  var availablePiece = /* @__PURE__ */ function() {
    return new Attr("data-available-piece", function(v2) {
      return unwrap10(v2.name);
    });
  }();
  var attr3 = function(v2) {
    return function(a3) {
      return attr2(v2.value0)(v2.value1(a3));
    };
  };

  // output/Data.These/index.js
  var This = /* @__PURE__ */ function() {
    function This2(value0) {
      this.value0 = value0;
    }
    ;
    This2.create = function(value0) {
      return new This2(value0);
    };
    return This2;
  }();
  var That = /* @__PURE__ */ function() {
    function That2(value0) {
      this.value0 = value0;
    }
    ;
    That2.create = function(value0) {
      return new That2(value0);
    };
    return That2;
  }();
  var Both = /* @__PURE__ */ function() {
    function Both2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Both2.create = function(value0) {
      return function(value1) {
        return new Both2(value0, value1);
      };
    };
    return Both2;
  }();

  // output/Data.Align/index.js
  var map118 = /* @__PURE__ */ map(functorArray);
  var append15 = /* @__PURE__ */ append(semigroupArray);
  var identity19 = /* @__PURE__ */ identity(categoryFn);
  var align = function(dict) {
    return dict.align;
  };
  var alignArray = {
    align: function(v2) {
      return function(v1) {
        return function(v22) {
          if (v22.length === 0) {
            return map118(function($104) {
              return v2(This.create($104));
            })(v1);
          }
          ;
          if (v1.length === 0) {
            return map118(function($105) {
              return v2(That.create($105));
            })(v22);
          }
          ;
          var ys$prime = drop(length5(v1))(v22);
          var xs$prime = drop(length5(v22))(v1);
          var f$prime = function(x2) {
            return function(y2) {
              return v2(new Both(x2, y2));
            };
          };
          return append15(zipWith(f$prime)(v1)(v22))(align(alignArray)(v2)(xs$prime)(ys$prime));
        };
      };
    },
    Functor0: function() {
      return functorArray;
    }
  };
  var aligned = function(dictAlign) {
    return align(dictAlign)(identity19);
  };

  // output/Game.Board.PortInfo/index.js
  var getClampedSignal = function(v2) {
    return clampSignal(portCapacity(v2.port))(v2.signal);
  };

  // output/Halogen.Svg.Attributes.Color/index.js
  var show9 = /* @__PURE__ */ show(showInt);
  var show14 = /* @__PURE__ */ show(showNumber);
  var RGB = /* @__PURE__ */ function() {
    function RGB2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    RGB2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new RGB2(value0, value1, value22);
        };
      };
    };
    return RGB2;
  }();
  var RGBA = /* @__PURE__ */ function() {
    function RGBA2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    RGBA2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new RGBA2(value0, value1, value22, value32);
          };
        };
      };
    };
    return RGBA2;
  }();
  var Named = /* @__PURE__ */ function() {
    function Named2(value0) {
      this.value0 = value0;
    }
    ;
    Named2.create = function(value0) {
      return new Named2(value0);
    };
    return Named2;
  }();
  var NoColor = /* @__PURE__ */ function() {
    function NoColor2() {
    }
    ;
    NoColor2.value = new NoColor2();
    return NoColor2;
  }();
  var printColor = function(v2) {
    if (v2 instanceof RGB) {
      return "rgb(" + (show9(v2.value0) + ("," + (show9(v2.value1) + ("," + (show9(v2.value2) + ")")))));
    }
    ;
    if (v2 instanceof RGBA) {
      return "rgba(" + (show9(v2.value0) + ("," + (show9(v2.value1) + ("," + (show9(v2.value2) + ("," + (show14(v2.value3) + ")")))))));
    }
    ;
    if (v2 instanceof Named) {
      return v2.value0;
    }
    ;
    if (v2 instanceof NoColor) {
      return "None";
    }
    ;
    throw new Error("Failed pattern match at Halogen.Svg.Attributes.Color (line 24, column 14 - line 28, column 20): " + [v2.constructor.name]);
  };

  // output/Halogen.Svg.Attributes.Path/index.js
  var show10 = /* @__PURE__ */ show(showNumber);
  var Rel = /* @__PURE__ */ function() {
    function Rel2() {
    }
    ;
    Rel2.value = new Rel2();
    return Rel2;
  }();
  var Abs = /* @__PURE__ */ function() {
    function Abs2() {
    }
    ;
    Abs2.value = new Abs2();
    return Abs2;
  }();
  var toArrayString = /* @__PURE__ */ coerce();
  var renderCommand = function(cmd) {
    return function(s_) {
      if (cmd instanceof Rel) {
        return s_;
      }
      ;
      if (cmd instanceof Abs) {
        return toUpper(s_);
      }
      ;
      throw new Error("Failed pattern match at Halogen.Svg.Attributes.Path (line 81, column 24 - line 83, column 20): " + [cmd.constructor.name]);
    };
  };
  var renderCommand2Args = function(s_) {
    return function(ref4) {
      return function(a_2) {
        return function(b2) {
          return renderCommand(ref4)(s_) + (show10(a_2) + (", " + show10(b2)));
        };
      };
    };
  };
  var renderCommand4Args = function(s_) {
    return function(ref4) {
      return function(a_2) {
        return function(b2) {
          return function(c_) {
            return function(d_) {
              return renderCommand(ref4)(s_) + (show10(a_2) + (", " + (show10(b2) + (", " + (show10(c_) + (", " + show10(d_)))))));
            };
          };
        };
      };
    };
  };
  var q2 = /* @__PURE__ */ renderCommand4Args("q");
  var m = /* @__PURE__ */ renderCommand2Args("m");
  var l = /* @__PURE__ */ renderCommand2Args("l");

  // output/Halogen.Svg.Attributes.TextAnchor/index.js
  var AnchorStart = /* @__PURE__ */ function() {
    function AnchorStart2() {
    }
    ;
    AnchorStart2.value = new AnchorStart2();
    return AnchorStart2;
  }();
  var AnchorMiddle = /* @__PURE__ */ function() {
    function AnchorMiddle2() {
    }
    ;
    AnchorMiddle2.value = new AnchorMiddle2();
    return AnchorMiddle2;
  }();
  var AnchorEnd = /* @__PURE__ */ function() {
    function AnchorEnd2() {
    }
    ;
    AnchorEnd2.value = new AnchorEnd2();
    return AnchorEnd2;
  }();
  var printTextAnchor = function(v2) {
    if (v2 instanceof AnchorStart) {
      return "start";
    }
    ;
    if (v2 instanceof AnchorMiddle) {
      return "middle";
    }
    ;
    if (v2 instanceof AnchorEnd) {
      return "end";
    }
    ;
    throw new Error("Failed pattern match at Halogen.Svg.Attributes.TextAnchor (line 22, column 19 - line 25, column 21): " + [v2.constructor.name]);
  };

  // output/Halogen.Svg.Attributes.Transform/index.js
  var show11 = /* @__PURE__ */ show(showNumber);
  var Matrix = /* @__PURE__ */ function() {
    function Matrix2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    Matrix2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new Matrix2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return Matrix2;
  }();
  var Translate = /* @__PURE__ */ function() {
    function Translate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Translate2.create = function(value0) {
      return function(value1) {
        return new Translate2(value0, value1);
      };
    };
    return Translate2;
  }();
  var Scale = /* @__PURE__ */ function() {
    function Scale2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Scale2.create = function(value0) {
      return function(value1) {
        return new Scale2(value0, value1);
      };
    };
    return Scale2;
  }();
  var Rotate = /* @__PURE__ */ function() {
    function Rotate2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Rotate2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Rotate2(value0, value1, value22);
        };
      };
    };
    return Rotate2;
  }();
  var SkewX = /* @__PURE__ */ function() {
    function SkewX2(value0) {
      this.value0 = value0;
    }
    ;
    SkewX2.create = function(value0) {
      return new SkewX2(value0);
    };
    return SkewX2;
  }();
  var SkewY = /* @__PURE__ */ function() {
    function SkewY2(value0) {
      this.value0 = value0;
    }
    ;
    SkewY2.create = function(value0) {
      return new SkewY2(value0);
    };
    return SkewY2;
  }();
  var printTransform = function(v2) {
    if (v2 instanceof Matrix) {
      return "matrix(" + (show11(v2.value0) + ("," + (show11(v2.value1) + ("," + (show11(v2.value2) + ("," + (show11(v2.value3) + ("," + (show11(v2.value4) + ("," + (show11(v2.value5) + ")")))))))))));
    }
    ;
    if (v2 instanceof Translate) {
      return "translate(" + (show11(v2.value0) + ("," + (show11(v2.value1) + ")")));
    }
    ;
    if (v2 instanceof Scale) {
      return "scale(" + (show11(v2.value0) + ("," + (show11(v2.value1) + ")")));
    }
    ;
    if (v2 instanceof Rotate) {
      return "rotate(" + (show11(v2.value0) + ("," + (show11(v2.value1) + ("," + (show11(v2.value2) + ")")))));
    }
    ;
    if (v2 instanceof SkewX) {
      return "skewX(" + (show11(v2.value0) + ")");
    }
    ;
    if (v2 instanceof SkewY) {
      return "skewY(" + (show11(v2.value0) + ")");
    }
    ;
    throw new Error("Failed pattern match at Halogen.Svg.Attributes.Transform (line 28, column 18 - line 34, column 39): " + [v2.constructor.name]);
  };

  // output/Halogen.Svg.Attributes/index.js
  var show15 = /* @__PURE__ */ show(showNumber);
  var map42 = /* @__PURE__ */ map(functorArray);
  var y = /* @__PURE__ */ function() {
    var $28 = attr2("y");
    return function($29) {
      return $28(show15($29));
    };
  }();
  var x = /* @__PURE__ */ function() {
    var $34 = attr2("x");
    return function($35) {
      return $34(show15($35));
    };
  }();
  var width8 = /* @__PURE__ */ function() {
    var $36 = attr2("width");
    return function($37) {
      return $36(show15($37));
    };
  }();
  var viewBox = function(x_) {
    return function(y_) {
      return function(w) {
        return function(h_) {
          return attr2("viewBox")(joinWith(" ")(map42(show15)([x_, y_, w, h_])));
        };
      };
    };
  };
  var transform = /* @__PURE__ */ function() {
    var $38 = attr2("transform");
    var $39 = joinWith(" ");
    var $40 = map42(printTransform);
    return function($41) {
      return $38($39($40($41)));
    };
  }();
  var textAnchor = /* @__PURE__ */ function() {
    var $42 = attr2("text-anchor");
    return function($43) {
      return $42(printTextAnchor($43));
    };
  }();
  var stopOpacity = /* @__PURE__ */ function() {
    var $59 = attr2("stop-opacity");
    return function($60) {
      return $59(show15($60));
    };
  }();
  var stopColor = /* @__PURE__ */ function() {
    var $61 = attr2("stop-color");
    return function($62) {
      return $61(printColor($62));
    };
  }();
  var r = /* @__PURE__ */ function() {
    var $74 = attr2("r");
    return function($75) {
      return $74(show15($75));
    };
  }();
  var offset = /* @__PURE__ */ attr2("offset");
  var id3 = /* @__PURE__ */ attr2("id");
  var href5 = /* @__PURE__ */ attr2("href");
  var height8 = /* @__PURE__ */ function() {
    var $101 = attr2("height");
    return function($102) {
      return $101(show15($102));
    };
  }();
  var gradientTransform = /* @__PURE__ */ function() {
    var $106 = attr2("gradientTransform");
    var $107 = joinWith(" ");
    var $108 = map42(printTransform);
    return function($109) {
      return $106($107($108($109)));
    };
  }();
  var fillGradient = function(url) {
    return attr2("fill")("url('" + (url + "')"));
  };
  var fill = /* @__PURE__ */ function() {
    var $130 = attr2("fill");
    return function($131) {
      return $130(printColor($131));
    };
  }();
  var d = /* @__PURE__ */ function() {
    var $136 = attr2("d");
    var $137 = joinWith(" ");
    return function($138) {
      return $136($137(toArrayString($138)));
    };
  }();
  var cy = /* @__PURE__ */ function() {
    var $139 = attr2("cy");
    return function($140) {
      return $139(show15($140));
    };
  }();
  var cx = /* @__PURE__ */ function() {
    var $141 = attr2("cx");
    return function($142) {
      return $141(show15($142));
    };
  }();

  // output/Halogen.Svg.Elements/index.js
  var element3 = /* @__PURE__ */ elementNS("http://www.w3.org/2000/svg");
  var g = /* @__PURE__ */ element3("g");
  var image = function(props) {
    return element3("image")(props)([]);
  };
  var linearGradient = /* @__PURE__ */ element3("linearGradient");
  var path2 = function(props) {
    return element3("path")(props)([]);
  };
  var stop = function(props) {
    return element3("stop")(props)([]);
  };
  var svg = /* @__PURE__ */ element3("svg");
  var text6 = /* @__PURE__ */ element3("text");
  var defs = /* @__PURE__ */ element3("defs");
  var circle = function(props) {
    return element3("circle")(props)([]);
  };

  // output/Component.MultimeterComponent/index.js
  var show16 = /* @__PURE__ */ show(showInt);
  var map43 = /* @__PURE__ */ map(functorArray);
  var aligned2 = /* @__PURE__ */ aligned(alignArray);
  var pure15 = /* @__PURE__ */ pure(applicativeArray);
  var show17 = /* @__PURE__ */ show(showSignal);
  var append16 = /* @__PURE__ */ append(semigroupArray);
  var map119 = /* @__PURE__ */ map(functorMaybe);
  var foldMap4 = /* @__PURE__ */ foldMap(foldableMaybe)(monoidArray);
  var zero3 = /* @__PURE__ */ zero(/* @__PURE__ */ semiringRecord()(/* @__PURE__ */ semiringRecordCons({
    reflectSymbol: function() {
      return "x";
    }
  })()(/* @__PURE__ */ semiringRecordCons({
    reflectSymbol: function() {
      return "y";
    }
  })()(semiringRecordNil)(semiringInt))(semiringInt)));
  var bind19 = /* @__PURE__ */ bind(bindHalogenM);
  var discard10 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var $$void10 = /* @__PURE__ */ $$void(functorHalogenM);
  var map211 = /* @__PURE__ */ map(functorEmitter);
  var modify_4 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var when4 = /* @__PURE__ */ when(applicativeHalogenM);
  var elem3 = /* @__PURE__ */ elem2(eqString);
  var gets3 = /* @__PURE__ */ gets(monadStateHalogenM);
  var for_4 = /* @__PURE__ */ for_(applicativeHalogenM)(foldableMaybe);
  var pure16 = /* @__PURE__ */ pure(applicativeHalogenM);
  var showRecord2 = /* @__PURE__ */ showRecord()();
  var show23 = /* @__PURE__ */ show(/* @__PURE__ */ showMaybe(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "info";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "relativeEdge";
    }
  })(showRelativeEdge))(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "connected";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "port";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "signal";
    }
  })(showSignal))(showPort))(showBoolean))))));
  var NewFocus = /* @__PURE__ */ function() {
    function NewFocus2(value0) {
      this.value0 = value0;
    }
    ;
    NewFocus2.create = function(value0) {
      return new NewFocus2(value0);
    };
    return NewFocus2;
  }();
  var SetCapacity = /* @__PURE__ */ function() {
    function SetCapacity2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetCapacity2.create = function(value0) {
      return function(value1) {
        return new SetCapacity2(value0, value1);
      };
    };
    return SetCapacity2;
  }();
  var Initialise3 = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var GlobalMouseMove = /* @__PURE__ */ function() {
    function GlobalMouseMove2(value0) {
      this.value0 = value0;
    }
    ;
    GlobalMouseMove2.create = function(value0) {
      return new GlobalMouseMove2(value0);
    };
    return GlobalMouseMove2;
  }();
  var GlobalKeyDown = /* @__PURE__ */ function() {
    function GlobalKeyDown2(value0) {
      this.value0 = value0;
    }
    ;
    GlobalKeyDown2.create = function(value0) {
      return new GlobalKeyDown2(value0);
    };
    return GlobalKeyDown2;
  }();
  var width9 = 52.916666;
  var radialDial = {
    cx: 15.749074,
    cy: 44.965733,
    r: 15.025925
  };
  var renderRotarySwitch = function(capacity) {
    return g([])([circle([cx(radialDial.cx), cy(radialDial.cy), r(radialDial.r)]), text6([x(radialDial.cx), y(radialDial.cy), textAnchor(AnchorMiddle.value), fill(new Named("lightgrey"))])([text5(maybe("X")(function($112) {
      return show16(toInt($112));
    })(capacity))])]);
  };
  var leds = [{
    cx: 44.928719,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 39.807083,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 34.685444,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 29.563808,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 24.442171,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 19.320534,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 14.198897,
    cy: 23.000546,
    r: 1.9862779
  }, {
    cx: 9.077261,
    cy: 23.000546,
    r: 1.9862779
  }];
  var renderBits = function(info2) {
    return flip(map43)(aligned2(leds)(clampedBits(portCapacity(info2.port))(info2.signal)))(function(v2) {
      if (v2 instanceof This) {
        return circle([cx(v2.value0.cx), cy(v2.value0.cy), r(v2.value0.r), fill(new Named("black"))]);
      }
      ;
      if (v2 instanceof That) {
        return circle([]);
      }
      ;
      if (v2 instanceof Both) {
        var color = function() {
          if (v2.value1) {
            return new Named("red");
          }
          ;
          return new Named("white");
        }();
        return circle([cx(v2.value0.cx), cy(v2.value0.cy), r(v2.value0.r), fill(color)]);
      }
      ;
      throw new Error("Failed pattern match at Component.MultimeterComponent (line 144, column 5 - line 150, column 68): " + [v2.constructor.name]);
    });
  };
  var height9 = 66.675018;
  var renderMultimeterImage = /* @__PURE__ */ image([/* @__PURE__ */ href5("./images/multimeter.png"), /* @__PURE__ */ width8(width9), /* @__PURE__ */ height8(height9)]);
  var display = {
    w: 39.88829,
    h: 13.022614,
    x: 7.0013809,
    y: 6.4740133
  };
  var renderDisplay = function(info2) {
    return pure15(text6([x(display.w + display.x), y(display.h + display.y), textAnchor(AnchorEnd.value)])([text5(show17(getClampedSignal(info2)))]));
  };
  var component5 = function(dictMonadEffect) {
    var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
    var liftEffect11 = liftEffect(monadEffectHalogenM2);
    var log5 = log2(monadEffectHalogenM2);
    var render = function(state3) {
      return div3([id2("multimeter"), classes(function() {
        if (state3.display) {
          return ["display"];
        }
        ;
        return ["hide"];
      }()), style("left: " + (show16(state3.currentPosition.x) + ("px; top: " + (show16(state3.currentPosition.y) + "px;"))))])([svg([viewBox(0)(0)(width9)(height9)])(map43(fromPlainHTML)(append16([renderMultimeterImage, renderRotarySwitch(map119(function($113) {
        return portCapacity(function(v2) {
          return v2.info.port;
        }($113));
      })(state3.focus))])(append16(foldMap4(renderDisplay)(map119(function(v2) {
        return v2.info;
      })(state3.focus)))(foldMap4(renderBits)(map119(function(v2) {
        return v2.info;
      })(state3.focus))))))]);
    };
    var initialState = function(v2) {
      return {
        focus: Nothing.value,
        display: false,
        currentPosition: zero3
      };
    };
    var $$eval2 = mkEval({
      handleAction: function(v1) {
        if (v1 instanceof Initialise3) {
          return bind19(liftEffect11(globalMouseMoveEventEmitter))(function(mouseMoveEmitter) {
            return discard10($$void10(subscribe2(map211(GlobalMouseMove.create)(mouseMoveEmitter))))(function() {
              return bind19(liftEffect11(globalKeyDownEventEmitter))(function(keyDownEmitter) {
                return $$void10(subscribe2(map211(GlobalKeyDown.create)(keyDownEmitter)));
              });
            });
          });
        }
        ;
        if (v1 instanceof GlobalMouseMove) {
          return modify_4(function(v2) {
            var $96 = {};
            for (var $97 in v2) {
              if ({}.hasOwnProperty.call(v2, $97)) {
                $96[$97] = v2[$97];
              }
              ;
            }
            ;
            $96.currentPosition = {
              x: pageX(v1.value0),
              y: pageY(v1.value0)
            };
            return $96;
          });
        }
        ;
        if (v1 instanceof GlobalKeyDown) {
          return discard10(when4(key(v1.value0) === "s")(modify_4(function(s2) {
            var $100 = {};
            for (var $101 in s2) {
              if ({}.hasOwnProperty.call(s2, $101)) {
                $100[$101] = s2[$101];
              }
              ;
            }
            ;
            $100.display = !s2.display;
            return $100;
          })))(function() {
            return discard10(when4(key(v1.value0) === "=")(log5("increment")))(function() {
              return discard10(when4(key(v1.value0) === "-")(log5("dec")))(function() {
                return when4(elem3(key(v1.value0))(["1", "2", "3", "4"]))(bind19(gets3(function(v2) {
                  return v2.focus;
                }))(function(maybeFocus) {
                  return for_4(maybeFocus)(function(v2) {
                    var v3 = key(v1.value0);
                    if (v3 === "1") {
                      return raise(new SetCapacity(v2.relativeEdge, OneBit.value));
                    }
                    ;
                    if (v3 === "2") {
                      return raise(new SetCapacity(v2.relativeEdge, TwoBit.value));
                    }
                    ;
                    if (v3 === "3") {
                      return raise(new SetCapacity(v2.relativeEdge, FourBit.value));
                    }
                    ;
                    if (v3 === "4") {
                      return raise(new SetCapacity(v2.relativeEdge, EightBit.value));
                    }
                    ;
                    return pure16(unit);
                  });
                }));
              });
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Component.MultimeterComponent (line 100, column 26 - line 125, column 35): " + [v1.constructor.name]);
      },
      handleQuery: function(v1) {
        return discard10(modify_4(function(v2) {
          var $108 = {};
          for (var $109 in v2) {
            if ({}.hasOwnProperty.call(v2, $109)) {
              $108[$109] = v2[$109];
            }
            ;
          }
          ;
          $108.focus = v1.value0;
          return $108;
        }))(function() {
          return discard10(log5(show23(v1.value0)))(function() {
            return pure16(Nothing.value);
          });
        });
      },
      receive: defaultEval.receive,
      initialize: new Just(Initialise3.value),
      finalize: defaultEval.finalize
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Component.Piece.Types/index.js
  var SetPortStates = /* @__PURE__ */ function() {
    function SetPortStates2(value0) {
      this.value0 = value0;
    }
    ;
    SetPortStates2.create = function(value0) {
      return new SetPortStates2(value0);
    };
    return SetPortStates2;
  }();
  var SetPiece = /* @__PURE__ */ function() {
    function SetPiece2(value0) {
      this.value0 = value0;
    }
    ;
    SetPiece2.create = function(value0) {
      return new SetPiece2(value0);
    };
    return SetPiece2;
  }();
  var Rotated = /* @__PURE__ */ function() {
    function Rotated2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Rotated2.create = function(value0) {
      return function(value1) {
        return new Rotated2(value0, value1);
      };
    };
    return Rotated2;
  }();
  var Dropped = /* @__PURE__ */ function() {
    function Dropped2(value0) {
      this.value0 = value0;
    }
    ;
    Dropped2.create = function(value0) {
      return new Dropped2(value0);
    };
    return Dropped2;
  }();
  var NewMultimeterFocus = /* @__PURE__ */ function() {
    function NewMultimeterFocus2(value0) {
      this.value0 = value0;
    }
    ;
    NewMultimeterFocus2.create = function(value0) {
      return new NewMultimeterFocus2(value0);
    };
    return NewMultimeterFocus2;
  }();
  var Initialise4 = /* @__PURE__ */ function() {
    function Initialise8(value0) {
      this.value0 = value0;
    }
    ;
    Initialise8.create = function(value0) {
      return new Initialise8(value0);
    };
    return Initialise8;
  }();
  var OnDrop = /* @__PURE__ */ function() {
    function OnDrop2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    OnDrop2.create = function(value0) {
      return function(value1) {
        return new OnDrop2(value0, value1);
      };
    };
    return OnDrop2;
  }();
  var OnDrag = /* @__PURE__ */ function() {
    function OnDrag2(value0) {
      this.value0 = value0;
    }
    ;
    OnDrag2.create = function(value0) {
      return new OnDrag2(value0);
    };
    return OnDrag2;
  }();
  var OnMouseDown = /* @__PURE__ */ function() {
    function OnMouseDown2(value0) {
      this.value0 = value0;
    }
    ;
    OnMouseDown2.create = function(value0) {
      return new OnMouseDown2(value0);
    };
    return OnMouseDown2;
  }();
  var OnMouseMove = /* @__PURE__ */ function() {
    function OnMouseMove2(value0) {
      this.value0 = value0;
    }
    ;
    OnMouseMove2.create = function(value0) {
      return new OnMouseMove2(value0);
    };
    return OnMouseMove2;
  }();
  var OnMouseUp = /* @__PURE__ */ function() {
    function OnMouseUp2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    OnMouseUp2.create = function(value0) {
      return function(value1) {
        return new OnMouseUp2(value0, value1);
      };
    };
    return OnMouseUp2;
  }();
  var PortOnMouseEnter = /* @__PURE__ */ function() {
    function PortOnMouseEnter2(value0) {
      this.value0 = value0;
    }
    ;
    PortOnMouseEnter2.create = function(value0) {
      return new PortOnMouseEnter2(value0);
    };
    return PortOnMouseEnter2;
  }();
  var PortOnMouseLeave = /* @__PURE__ */ function() {
    function PortOnMouseLeave2() {
    }
    ;
    PortOnMouseLeave2.value = new PortOnMouseLeave2();
    return PortOnMouseLeave2;
  }();
  var defaultState = function(piece) {
    return {
      piece,
      location: location2(0)(0),
      rotation: rotation(0),
      isRotating: Nothing.value,
      portStates: empty2
    };
  };

  // output/Component.Rendering.Path/index.js
  var renderPathWithEvents = function(v2) {
    return function(onMouseEnter2) {
      return function(onMouseLeave2) {
        return g([])([defs([])([fromPlainHTML(v2.gradient.def)]), path2([d(v2.path), v2.attrs, fillGradient("#" + v2.gradient.id), onMouseEnter(function(v1) {
          return onMouseEnter2;
        }), onMouseLeave(function(v1) {
          return onMouseLeave2;
        })])]);
      };
    };
  };

  // output/Component.Rendering.Gradient/index.js
  var clamp2 = /* @__PURE__ */ clamp(ordInt);
  var div5 = /* @__PURE__ */ div(euclideanRingInt);
  var eq10 = /* @__PURE__ */ eq(eqSignal);
  var identity20 = /* @__PURE__ */ identity(categoryFn);
  var show18 = /* @__PURE__ */ show(showInt);
  var intercalate6 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var shadeColor = function(percentage) {
    var f = function(x2) {
      return clamp2(0)(255)(div5(x2 * (100 + percentage | 0) | 0)(100));
    };
    return function(v2) {
      if (v2 instanceof RGB) {
        return new RGB(f(v2.value0), f(v2.value1), f(v2.value2));
      }
      ;
      if (v2 instanceof RGBA) {
        return new RGBA(f(v2.value0), f(v2.value1), f(v2.value2), v2.value3);
      }
      ;
      return v2;
    };
  };
  var portColor = function(port2) {
    return function(signal) {
      var purple = new RGB(208, 135, 221);
      var pink = new RGB(228, 100, 156);
      var green2 = new RGB(117, 208, 191);
      var blue = new RGB(120, 204, 250);
      return function() {
        var $33 = eq10(signal)(0);
        if ($33) {
          return shadeColor(-30 | 0);
        }
        ;
        return identity20;
      }()(function() {
        var v2 = portCapacity(port2);
        if (v2 instanceof OneBit) {
          return green2;
        }
        ;
        if (v2 instanceof TwoBit) {
          return blue;
        }
        ;
        if (v2 instanceof FourBit) {
          return purple;
        }
        ;
        if (v2 instanceof EightBit) {
          return pink;
        }
        ;
        throw new Error("Failed pattern match at Component.Rendering.Gradient (line 46, column 3 - line 50, column 22): " + [v2.constructor.name]);
      }());
    };
  };
  var createPortGradient = function(v2) {
    var signalId = function() {
      var $35 = eq10(v2.signal)(0);
      if ($35) {
        return "off";
      }
      ;
      return "on";
    }();
    var portId = function() {
      var $36 = isInput(v2.port);
      if ($36) {
        return "in";
      }
      ;
      return "out";
    }();
    var color = portColor(v2.port)(v2.signal);
    var capacityId = show18(toInt(portCapacity(v2.port))) + "bit";
    var id4 = intercalate6("-")(["port-gradient", portId, signalId, capacityId]);
    var def = linearGradient([id3(id4), gradientTransform([new Rotate(90, 0, 0)])])(function() {
      var v1 = portType(v2.port);
      if (v1 instanceof Input) {
        return [stop([offset("5%"), stopColor(color), stopOpacity(0.5)]), stop([offset("95%"), stopColor(color)])];
      }
      ;
      if (v1 instanceof Output) {
        return [stop([offset("5%"), stopColor(color), stopOpacity(0.5)]), stop([offset("95%"), stopColor(color), stopOpacity(0)])];
      }
      ;
      throw new Error("Failed pattern match at Component.Rendering.Gradient (line 21, column 9 - line 29, column 12): " + [v1.constructor.name]);
    }());
    return {
      id: id4,
      def
    };
  };

  // output/Control.Monad.Writer/index.js
  var unwrap11 = /* @__PURE__ */ unwrap();
  var runWriter = function($5) {
    return unwrap11(runWriterT($5));
  };
  var execWriter = function(m2) {
    return snd(runWriter(m2));
  };

  // output/Component.Rendering.Wire/index.js
  var sub1 = /* @__PURE__ */ sub(/* @__PURE__ */ ringTuple(ringNumber)(ringNumber));
  var tell3 = /* @__PURE__ */ tell(/* @__PURE__ */ monadTellWriterT(monoidArray)(monadIdentity));
  var append17 = /* @__PURE__ */ append(semigroupArray);
  var applicativeWriterT3 = /* @__PURE__ */ applicativeWriterT(monoidArray)(applicativeIdentity);
  var for_5 = /* @__PURE__ */ for_(applicativeWriterT3)(foldableMaybe);
  var toUnfoldable5 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var discard11 = /* @__PURE__ */ discard(discardUnit)(/* @__PURE__ */ bindWriterT(semigroupArray)(bindIdentity));
  var map44 = /* @__PURE__ */ map(functorArray);
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeWriterT3)(foldableArray);
  var find4 = /* @__PURE__ */ find(foldableMap);
  var terminalLocation = function(v2) {
    if (v2 instanceof Up) {
      return new Tuple(65, 25);
    }
    ;
    if (v2 instanceof Right2) {
      return new Tuple(75, 65);
    }
    ;
    if (v2 instanceof Down) {
      return new Tuple(35, 75);
    }
    ;
    if (v2 instanceof Left2) {
      return new Tuple(25, 35);
    }
    ;
    throw new Error("Failed pattern match at Component.Rendering.Wire (line 41, column 20 - line 45, column 37): " + [v2.constructor.name]);
  };
  var stubPath = function(v2) {
    if (v2 instanceof Up) {
      return [l(Rel.value)(0)(-25), l(Rel.value)(30)(0), l(Rel.value)(0)(25)];
    }
    ;
    if (v2 instanceof Right2) {
      return [l(Rel.value)(25)(0), l(Rel.value)(0)(30), l(Rel.value)(-25)(0)];
    }
    ;
    if (v2 instanceof Down) {
      return [l(Rel.value)(0)(25), l(Rel.value)(-30)(0), l(Rel.value)(0)(-25)];
    }
    ;
    if (v2 instanceof Left2) {
      return [l(Rel.value)(-25)(0), l(Rel.value)(0)(-30), l(Rel.value)(25)(0)];
    }
    ;
    throw new Error("Failed pattern match at Component.Rendering.Wire (line 68, column 12 - line 72, column 77): " + [v2.constructor.name]);
  };
  var initialLocation = function(v2) {
    if (v2 instanceof Up) {
      return new Tuple(35, 25);
    }
    ;
    if (v2 instanceof Right2) {
      return new Tuple(75, 35);
    }
    ;
    if (v2 instanceof Down) {
      return new Tuple(65, 75);
    }
    ;
    if (v2 instanceof Left2) {
      return new Tuple(25, 65);
    }
    ;
    throw new Error("Failed pattern match at Component.Rendering.Wire (line 34, column 19 - line 38, column 37): " + [v2.constructor.name]);
  };
  var betweenPath = function(to3) {
    return function(from3) {
      var v2 = sub1(initialLocation(from3))(terminalLocation(to3));
      var v1 = function() {
        if (from3 instanceof Up) {
          return new Tuple(v2.value0, 0);
        }
        ;
        if (from3 instanceof Right2) {
          return new Tuple(0, v2.value1);
        }
        ;
        if (from3 instanceof Down) {
          return new Tuple(v2.value0, 0);
        }
        ;
        if (from3 instanceof Left2) {
          return new Tuple(0, v2.value1);
        }
        ;
        throw new Error("Failed pattern match at Component.Rendering.Wire (line 82, column 19 - line 86, column 37): " + [from3.constructor.name]);
      }();
      return [q2(Rel.value)(v1.value0)(v1.value1)(v2.value0)(v2.value1)];
    };
  };
  var arrowPath = function(v2) {
    if (v2 instanceof Up) {
      return [l(Rel.value)(0)(-13), l(Rel.value)(-10)(0), l(Rel.value)(25)(-12), l(Rel.value)(25)(12), l(Rel.value)(-10)(0), l(Rel.value)(0)(13)];
    }
    ;
    if (v2 instanceof Right2) {
      return [l(Rel.value)(13)(0), l(Rel.value)(0)(-10), l(Rel.value)(12)(25), l(Rel.value)(-12)(25), l(Rel.value)(0)(-10), l(Rel.value)(-13)(0)];
    }
    ;
    if (v2 instanceof Down) {
      return [l(Rel.value)(0)(13), l(Rel.value)(10)(0), l(Rel.value)(-25)(12), l(Rel.value)(-25)(-12), l(Rel.value)(10)(0), l(Rel.value)(0)(-13)];
    }
    ;
    if (v2 instanceof Left2) {
      return [l(Rel.value)(-13)(0), l(Rel.value)(0)(10), l(Rel.value)(-12)(-25), l(Rel.value)(12)(-25), l(Rel.value)(0)(10), l(Rel.value)(13)(0)];
    }
    ;
    throw new Error("Failed pattern match at Component.Rendering.Wire (line 57, column 13 - line 65, column 119): " + [v2.constructor.name]);
  };
  var outputPath = function(connected2) {
    if (connected2) {
      return stubPath;
    }
    ;
    return arrowPath;
  };
  var wirePath = function(ports) {
    var renderSide = function(v2) {
      return function(to3) {
        return tell3(append17(function() {
          var $57 = isInput(v2.value1.port);
          if ($57) {
            return stubPath(v2.value0);
          }
          ;
          return outputPath(v2.value1.connected)(v2.value0);
        }())(betweenPath(v2.value0)(to3)));
      };
    };
    var path3 = execWriter(for_5(uncons(toUnfoldable5(ports)))(function(v2) {
      var v1 = initialLocation(fst(v2.head));
      return discard11(tell3([m(Rel.value)(v1.value0)(v1.value1)]))(function() {
        var sides = zip(toUnfoldable5(ports))(map44(fst)(append17(v2.tail)([v2.head])));
        return traverse_6(uncurry(renderSide))(sides);
      });
    }));
    var info2 = fromMaybe(unsafeCrashWith("assertion failed: wire path created with no inputs"))(find4(function(portInfo) {
      return isInput(portInfo.port);
    })(ports));
    var gradient = createPortGradient(info2);
    var attrs = attr3(connected)(info2.connected);
    return {
      path: path3,
      gradient,
      attrs
    };
  };
  var renderWire = function(portStates) {
    return renderPathWithEvents(wirePath(portStates))(new PortOnMouseEnter(Left2.value))(PortOnMouseLeave.value);
  };

  // output/Component.Rendering.Port/index.js
  var eq11 = /* @__PURE__ */ eq(eqPortType);
  var append18 = /* @__PURE__ */ append(semigroupArray);
  var portPath = function(info2) {
    var v2 = function() {
      var $5 = eq11(portType(info2.port))(Input.value);
      if ($5) {
        return new Tuple(40, 0);
      }
      ;
      return new Tuple(10, 25);
    }();
    var headPath = function() {
      var v22 = portType(info2.port);
      if (v22 instanceof Input) {
        return arrowPath(Down.value);
      }
      ;
      if (v22 instanceof Output) {
        return arrowPath(Up.value);
      }
      ;
      throw new Error("Failed pattern match at Component.Rendering.Port (line 37, column 16 - line 41, column 49): " + [v22.constructor.name, info2.connected.constructor.name]);
    }();
    var path3 = append18([m(Rel.value)(v2.value0)(v2.value1)])(append18(headPath)(betweenPath(Up.value)(Up.value)));
    return {
      path: path3,
      gradient: createPortGradient(info2),
      attrs: attr3(connected)(info2.connected)
    };
  };

  // output/Component.Rendering.Piece/index.js
  var bind20 = /* @__PURE__ */ bind(bindArray);
  var pure17 = /* @__PURE__ */ pure(applicativeArray);
  var fromFoldable10 = /* @__PURE__ */ fromFoldable(foldableMaybe);
  var lookup15 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var append19 = /* @__PURE__ */ append(semigroupArray);
  var elem4 = /* @__PURE__ */ elem2(eqPiece);
  var renderDefaultPiece = function(state3) {
    var renderPieceCenter = function(v2) {
      return image([href5("./images/" + (v2 + ".png")), width8(40), height8(40)]);
    };
    var center = g([transform([new Translate(30, 30)])])([svg([width8(50), height8(50)])([renderPieceCenter(name15(state3.piece))])]);
    var allPorts = bind20(allDirections)(function(dir2) {
      var v2 = clockwiseRotation(Up.value)(dir2);
      return pure17(g([transform([new Rotate(toNumber(v2) * 90, 50, 50), new Translate(25, 0)])])(bind20(fromFoldable10(lookup15(dir2)(state3.portStates)))(function(portInfo) {
        var path3 = portPath(portInfo);
        return pure17(renderPathWithEvents(path3)(new PortOnMouseEnter(dir2))(PortOnMouseLeave.value));
      })));
    });
    return g([])(append19(allPorts)([center]));
  };
  var renderPiece = function(state3) {
    var render = function() {
      if (elem4(state3.piece)(allWirePieces)) {
        return renderWire(state3.portStates);
      }
      ;
      if (otherwise) {
        return renderDefaultPiece(state3);
      }
      ;
      throw new Error("Failed pattern match at Component.Rendering.Piece (line 30, column 5 - line 33, column 45): " + []);
    }();
    return svg([viewBox(0)(0)(100)(100)])([render]);
  };

  // output/Component.Piece/index.js
  var show19 = /* @__PURE__ */ show(showNumber);
  var discard12 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_5 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var pure18 = /* @__PURE__ */ pure(applicativeHalogenM);
  var bind110 = /* @__PURE__ */ bind(bindHalogenM);
  var traverse_7 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var map45 = /* @__PURE__ */ map(functorEffect);
  var mul2 = /* @__PURE__ */ mul(semiringNumber);
  var sub3 = /* @__PURE__ */ sub(/* @__PURE__ */ ringTuple(ringNumber)(ringNumber));
  var gets4 = /* @__PURE__ */ gets(monadStateHalogenM);
  var bind22 = /* @__PURE__ */ bind(bindMaybe);
  var lookup16 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var pure23 = /* @__PURE__ */ pure(applicativeMaybe);
  var component6 = function(dictMonadEffect) {
    var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
    var liftEffect11 = liftEffect(monadEffectHalogenM2);
    var log5 = log2(monadEffectHalogenM2);
    var render = function(state3) {
      var isDraggable = isNothing(state3.isRotating);
      var currentRotation = maybe(0)(function(v2) {
        return v2.currentRotation;
      })(state3.isRotating);
      return div3([classes(["piece-component"]), draggable2(isDraggable), style("transform: rotate(" + (show19(currentRotation) + "rad);")), ref2("piece"), onDragEnd(OnDrop.create(state3.location)), onDrag(OnDrag.create), onMouseDown(OnMouseDown.create), onMouseMove(OnMouseMove.create), onMouseUp(OnMouseUp.create(state3.location))])([renderPiece(state3)]);
    };
    var initialState = function(v2) {
      return {
        piece: v2.piece,
        location: v2.location,
        rotation: rotation(0),
        isRotating: Nothing.value,
        portStates: v2.portStates
      };
    };
    var getPosition = function(e) {
      return new Tuple(toNumber(clientX(e)), toNumber(clientY(e)));
    };
    var elementCenterClient = function(e) {
      return function __do5() {
        var bb = getBoundingClientRect(e)();
        var cx2 = (bb.right + bb.left) / 2;
        var cy2 = (bb.bottom + bb.top) / 2;
        return new Tuple(cx2, cy2);
      };
    };
    var $$eval2 = mkEval({
      finalize: Nothing.value,
      handleAction: function(v2) {
        if (v2 instanceof Initialise4) {
          return discard12(modify_5(function(v1) {
            var $68 = {};
            for (var $69 in v1) {
              if ({}.hasOwnProperty.call(v1, $69)) {
                $68[$69] = v1[$69];
              }
              ;
            }
            ;
            $68.piece = v2.value0.piece;
            $68.location = v2.value0.location;
            $68.portStates = v2.value0.portStates;
            return $68;
          }))(function() {
            return pure18(unit);
          });
        }
        ;
        if (v2 instanceof OnDrop) {
          return raise(new Dropped(v2.value0));
        }
        ;
        if (v2 instanceof OnDrag) {
          return pure18(unit);
        }
        ;
        if (v2 instanceof OnMouseDown) {
          return bind110(getHTMLElementRef("piece"))(traverse_7(function(he) {
            return bind110(liftEffect11(map45(mul2(0.5))(clientWidth(toElement(he)))))(function(r2) {
              return bind110(liftEffect11(elementCenterClient(toElement(he))))(function(c2) {
                var v1 = sub3(getPosition(v2.value0))(c2);
                var $79 = r2 * r2 > v1.value0 * v1.value0 + v1.value1 * v1.value1;
                if ($79) {
                  return modify_5(function(v22) {
                    var $80 = {};
                    for (var $81 in v22) {
                      if ({}.hasOwnProperty.call(v22, $81)) {
                        $80[$81] = v22[$81];
                      }
                      ;
                    }
                    ;
                    $80.isRotating = Nothing.value;
                    return $80;
                  });
                }
                ;
                return discard12(liftEffect11(setDraggable(false)(he)))(function() {
                  return modify_5(function(v22) {
                    var $83 = {};
                    for (var $84 in v22) {
                      if ({}.hasOwnProperty.call(v22, $84)) {
                        $83[$84] = v22[$84];
                      }
                      ;
                    }
                    ;
                    $83.isRotating = new Just({
                      initialClickPosition: getPosition(v2.value0),
                      currentRotation: 0
                    });
                    return $83;
                  });
                });
              });
            });
          }));
        }
        ;
        if (v2 instanceof OnMouseMove) {
          return bind110(getRef("piece"))(traverse_7(function(e) {
            return bind110(gets4(function(v1) {
              return v1.isRotating;
            }))(traverse_7(function(v1) {
              var p2 = getPosition(v2.value0);
              return bind110(liftEffect11(elementCenterClient(e)))(function(c2) {
                var v11 = sub3(v1.initialClickPosition)(c2);
                var v22 = sub3(p2)(c2);
                var dot = function(v3) {
                  return function(v4) {
                    return v3.value0 * v4.value0 + v3.value1 * v4.value1;
                  };
                };
                var det = function(v3) {
                  return function(v4) {
                    return v3.value0 * v4.value1 - v4.value0 * v3.value1;
                  };
                };
                var angle = atan2(det(v11)(v22))(dot(v11)(v22));
                return modify_5(function(v3) {
                  var $102 = {};
                  for (var $103 in v3) {
                    if ({}.hasOwnProperty.call(v3, $103)) {
                      $102[$103] = v3[$103];
                    }
                    ;
                  }
                  ;
                  $102.isRotating = new Just({
                    initialClickPosition: v1.initialClickPosition,
                    currentRotation: angle
                  });
                  return $102;
                });
              });
            }));
          }));
        }
        ;
        if (v2 instanceof OnMouseUp) {
          return discard12(bind110(gets4(function(v1) {
            return v1.isRotating;
          }))(traverse_7(function(v1) {
            var rot = rotation(round2(4 * v1.currentRotation / (2 * pi)));
            return raise(new Rotated(v2.value0, rot));
          })))(function() {
            return discard12(modify_5(function(v1) {
              var $111 = {};
              for (var $112 in v1) {
                if ({}.hasOwnProperty.call(v1, $112)) {
                  $111[$112] = v1[$112];
                }
                ;
              }
              ;
              $111.isRotating = Nothing.value;
              return $111;
            }))(function() {
              return log5("mouse UP???");
            });
          });
        }
        ;
        if (v2 instanceof PortOnMouseEnter) {
          return bind110(gets4(function(v1) {
            return v1.portStates;
          }))(function(portStates) {
            return bind110(gets4(function(v1) {
              return v1.location;
            }))(function(loc) {
              return discard12(pure18(unit))(function() {
                return raise(new NewMultimeterFocus(function() {
                  var relativeEdge = relative(loc)(v2.value0);
                  return bind22(lookup16(v2.value0)(portStates))(function(info2) {
                    return pure23({
                      relativeEdge,
                      info: info2
                    });
                  });
                }()));
              });
            });
          });
        }
        ;
        if (v2 instanceof PortOnMouseLeave) {
          return raise(new NewMultimeterFocus(Nothing.value));
        }
        ;
        throw new Error("Failed pattern match at Component.Piece (line 98, column 21 - line 154, column 47): " + [v2.constructor.name]);
      },
      handleQuery: function(v2) {
        if (v2 instanceof SetPortStates) {
          return discard12(modify_5(function(v1) {
            var $118 = {};
            for (var $119 in v1) {
              if ({}.hasOwnProperty.call(v1, $119)) {
                $118[$119] = v1[$119];
              }
              ;
            }
            ;
            $118.portStates = v2.value0;
            return $118;
          }))(function() {
            return pure18(Nothing.value);
          });
        }
        ;
        if (v2 instanceof SetPiece) {
          return discard12(modify_5(function(v1) {
            var $122 = {};
            for (var $123 in v1) {
              if ({}.hasOwnProperty.call(v1, $123)) {
                $122[$123] = v1[$123];
              }
              ;
            }
            ;
            $122.piece = v2.value0;
            return $122;
          }))(function() {
            return pure18(Nothing.value);
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Piece (line 156, column 20 - line 162, column 23): " + [v2.constructor.name]);
      },
      initialize: Nothing.value,
      receive: function(v2) {
        return Nothing.value;
      }
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Game.Board.PseudoPiece/index.js
  var elem5 = /* @__PURE__ */ elem2(eqPieceId);
  var eq18 = /* @__PURE__ */ eq(eqPieceId);
  var discard13 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
  var guard6 = /* @__PURE__ */ guard(alternativeMaybe);
  var lookup17 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var psuedoPiece = function(port2) {
    return {
      name: function() {
        var v2 = portType(port2);
        if (v2 instanceof Input) {
          return "psuedo-input";
        }
        ;
        if (v2 instanceof Output) {
          return "psuedo-output";
        }
        ;
        throw new Error("Failed pattern match at Game.Board.PseudoPiece (line 33, column 21 - line 35, column 37): " + [v2.constructor.name]);
      }(),
      "eval": function(v2) {
        return empty2;
      },
      complexity: space(0),
      shouldRipple: false,
      updateCapacity: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      },
      ports: singleton5(Right2.value)(matchingPort(port2)),
      updatePort: function(v2) {
        return function(v1) {
          return Nothing.value;
        };
      }
    };
  };
  var isPseudoPiece = function(v2) {
    return elem5(v2.name)(["psuedo-input", "psuedo-output"]);
  };
  var isPseudoInput = function(v2) {
    return eq18(v2.name)("psuedo-input");
  };
  var getPsuedoPiecePort = function(v2) {
    return discard13(guard6(isPseudoPiece(v2)))(function() {
      return lookup17(Right2.value)(v2.ports);
    });
  };

  // output/Game.Board.EvaluableBoard/index.js
  var submap3 = /* @__PURE__ */ submap(ordRelativeEdge);
  var bind21 = /* @__PURE__ */ bind(bindMaybe);
  var find5 = /* @__PURE__ */ find(foldableList);
  var $$delete7 = /* @__PURE__ */ $$delete(eqLocation);
  var filterWithKey2 = /* @__PURE__ */ filterWithKey(ordRelativeEdge);
  var notEq6 = /* @__PURE__ */ notEq(eqLocation);
  var map46 = /* @__PURE__ */ map(functorMaybe);
  var unwrap12 = /* @__PURE__ */ unwrap();
  var lookup18 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var lookup19 = /* @__PURE__ */ lookup(ordLocation);
  var insert10 = /* @__PURE__ */ insert(ordRelativeEdge);
  var mapMaybe5 = /* @__PURE__ */ mapMaybe2(ordCardinalDirection);
  var lookup22 = /* @__PURE__ */ lookup(ordRelativeEdge);
  var at4 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordRelativeEdge));
  var traverse3 = /* @__PURE__ */ traverse(traversableMaybe);
  var discard14 = /* @__PURE__ */ discard(discardUnit);
  var catMaybes4 = /* @__PURE__ */ catMaybes(ordCardinalDirection);
  var filter7 = /* @__PURE__ */ filter3(ordCardinalDirection);
  var fromFoldable11 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection);
  var fromFoldable12 = /* @__PURE__ */ fromFoldable11(foldableMap);
  var foldMap5 = /* @__PURE__ */ foldMap(foldableMaybe)(monoidSignal);
  var _pieces4 = /* @__PURE__ */ _pieces(strongFn);
  var at1 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordLocation));
  var map120 = /* @__PURE__ */ map(functorMap);
  var _pieces13 = /* @__PURE__ */ _pieces(strongForget);
  var fromFoldable23 = /* @__PURE__ */ fromFoldable2(foldableSet);
  var functorExceptT2 = /* @__PURE__ */ functorExceptT(functorIdentity);
  var evalStateT2 = /* @__PURE__ */ evalStateT(functorExceptT2);
  var monadExceptT2 = /* @__PURE__ */ monadExceptT(monadIdentity);
  var bind111 = /* @__PURE__ */ bind(/* @__PURE__ */ bindStateT(monadExceptT2));
  var map212 = /* @__PURE__ */ map(/* @__PURE__ */ functorStateT(functorExceptT2));
  var fromFoldable32 = /* @__PURE__ */ fromFoldable11(foldableArray);
  var applicativeStateT2 = /* @__PURE__ */ applicativeStateT(monadExceptT2);
  var $$for2 = /* @__PURE__ */ $$for(applicativeStateT2)(traversableArray);
  var monadStateStateT2 = /* @__PURE__ */ monadStateStateT(monadExceptT2);
  var getBoardEdgePseudoLocation2 = /* @__PURE__ */ getBoardEdgePseudoLocation(monadStateStateT2);
  var toRelativeEdge2 = /* @__PURE__ */ toRelativeEdge(monadStateStateT2);
  var adjacentRelativeEdge2 = /* @__PURE__ */ adjacentRelativeEdge(monadStateStateT2);
  var getPortOnEdge2 = /* @__PURE__ */ getPortOnEdge(monadStateStateT2);
  var pure19 = /* @__PURE__ */ pure(applicativeStateT2);
  var get3 = /* @__PURE__ */ get(monadStateStateT2);
  var topologicalSort = function(v2) {
    return function(v1) {
      if (v2 instanceof Nil) {
        return new Just(Nil.value);
      }
      ;
      var doesntAcceptOutput = function(loc) {
        return isEmpty(submap3(new Just(relative(loc)(Up.value)))(new Just(relative(loc)(Left2.value)))(v1));
      };
      return bind21(find5(doesntAcceptOutput)(v2))(function(r2) {
        var nodes$prime = $$delete7(r2)(v2);
        var edges$prime = filterWithKey2(function(k) {
          return function(v22) {
            return notEq6(relativeEdgeLocation(v22))(r2);
          };
        })(v1);
        return map46(Cons.create(r2))(topologicalSort(nodes$prime)(edges$prime));
      });
    };
  };
  var setOuterPort = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var $$void17 = $$void(Monad0.Bind1().Apply0().Functor0());
    var bind210 = bind(bindMaybeT(Monad0));
    var asks2 = asks(MonadAsk0);
    var when13 = when(applicativeMaybeT(Monad0));
    var pure114 = pure(Monad0.Applicative0());
    return function(dictMonadState) {
      var modify_10 = modify_2(monadStateMaybeT(dictMonadState));
      return function(dir2) {
        return function(signal) {
          return $$void17(runMaybeT(bind210(asks2(function() {
            var $300 = lookup18(dir2);
            return function($301) {
              return $300(function(v2) {
                return v2.psuedoPieceLocations;
              }(unwrap12($301)));
            };
          }()))(function(loc) {
            return bind210(asks2(function() {
              var $302 = lookup19(loc);
              return function($303) {
                return $302(function(v2) {
                  return v2.pieces;
                }(unwrap12($303)));
              };
            }()))(function(v2) {
              return when13(isPseudoInput(v2))(bind210(pure114(getPsuedoPiecePort(v2)))(function(port2) {
                var relEdge = relative(loc)(Right2.value);
                var portInfo = {
                  connected: false,
                  port: port2,
                  signal: clampSignal(portCapacity(port2))(signal)
                };
                return modify_10(insert10(relEdge)(portInfo));
              }));
            });
          })));
        };
      };
    };
  };
  var runEvaluableM = function(evaluable) {
    return function(evalM2) {
      return runState(runReaderT(evalM2)(evaluable))(empty2);
    };
  };
  var injectInputs = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var bind210 = bind(Monad0.Bind1());
    var asks2 = asks(MonadAsk0);
    var Applicative0 = Monad0.Applicative0();
    var forWithIndex_2 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    var for_10 = for_(Applicative0)(foldableMaybe);
    var setOuterPort1 = setOuterPort(dictMonadReader);
    return function(dictMonadState) {
      var setOuterPort2 = setOuterPort1(dictMonadState);
      return function(inputs) {
        return bind210(asks2(function($304) {
          return function(v2) {
            return v2.psuedoPieceLocations;
          }(unwrap12($304));
        }))(function(psuedoPieceLocations) {
          return forWithIndex_2(psuedoPieceLocations)(function(dir2) {
            return function(loc) {
              return for_10(lookup18(dir2)(inputs))(function(signal) {
                return setOuterPort2(dir2)(signal);
              });
            };
          });
        });
      };
    };
  };
  var getPorts2 = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var bind210 = bind(Monad0.Bind1());
    var asks2 = asks(MonadAsk0);
    var pure114 = pure(Monad0.Applicative0());
    return bind210(asks2(function($305) {
      return function(v2) {
        return v2.pieces;
      }(unwrap12($305));
    }))(function(pieces) {
      return bind210(asks2(function($306) {
        return function(v2) {
          return v2.psuedoPieceLocations;
        }(unwrap12($306));
      }))(function(psuedoPieceLocations) {
        return pure114(mapMaybe5(function(loc) {
          return map46(matchingPort)(bind21(lookup19(loc)(pieces))(function(v2) {
            return lookup18(Right2.value)(v2.ports);
          }));
        })(psuedoPieceLocations));
      });
    });
  };
  var getPorts1 = /* @__PURE__ */ getPorts2(monadReaderFun);
  var getOuterPort = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var bind210 = bind(bindMaybeT(Monad0));
    var asks2 = asks(MonadAsk0);
    var pure114 = pure(applicativeMaybeT(Monad0));
    return function(dictMonadState) {
      var gets7 = gets(dictMonadState);
      return function(dir2) {
        return runMaybeT(bind210(asks2(function() {
          var $309 = lookup18(dir2);
          return function($310) {
            return $309(function(v2) {
              return v2.psuedoPieceLocations;
            }(unwrap12($310)));
          };
        }()))(function(loc) {
          return bind210(gets7(lookup22(relative(loc)(dir2))))(function(v2) {
            return pure114(v2.signal);
          });
        }));
      };
    };
  };
  var getInputOnEdge = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind210 = bind(Bind1);
    var asks2 = asks(MonadAsk0);
    var Applicative0 = Monad0.Applicative0();
    var traverse12 = traverse3(Applicative0);
    var discard112 = discard14(Bind1);
    var pure114 = pure(Applicative0);
    var map311 = map(Bind1.Apply0().Functor0());
    return function(dictMonadState) {
      var use4 = use(dictMonadState);
      var assign4 = assign2(dictMonadState);
      return function(inRelEdge) {
        return function(capacity) {
          return bind210(asks2(function($311) {
            return function(v2) {
              return v2.connections;
            }(unwrap12($311));
          }))(function(connections) {
            var v2 = lookup22(inRelEdge)(connections);
            if (v2 instanceof Just) {
              return bind210(bind210(use4(at4(v2.value0)(strongForget)))(traverse12(function(info2) {
                var signal = getClampedSignal(info2);
                return discard112(assign4(at4(inRelEdge)(strongFn))(new Just({
                  connected: true,
                  signal,
                  port: inputPort(capacity)
                })))(function() {
                  return discard112(assign4(at4(v2.value0)(strongFn))(new Just({
                    connected: true,
                    signal,
                    port: outputPort(capacity)
                  })))(function() {
                    return pure114(signal);
                  });
                });
              })))(function(maybeSignal) {
                return pure114(fromMaybe(0)(maybeSignal));
              });
            }
            ;
            if (v2 instanceof Nothing) {
              return bind210(map311(maybe(0)(function(v1) {
                return v1.signal;
              }))(use4(at4(inRelEdge)(strongForget))))(function(signal) {
                return discard112(assign4(at4(inRelEdge)(strongFn))(new Just({
                  connected: false,
                  signal,
                  port: inputPort(capacity)
                })))(function() {
                  return pure114(signal);
                });
              });
            }
            ;
            throw new Error("Failed pattern match at Game.Board.EvaluableBoard (line 188, column 3 - line 199, column 18): " + [v2.constructor.name]);
          });
        };
      };
    };
  };
  var extractOutputs = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var Bind1 = Monad0.Bind1();
    var map311 = map(Bind1.Apply0().Functor0());
    var bind210 = bind(Bind1);
    var getPorts22 = getPorts2(dictMonadReader);
    var forWithIndex2 = forWithIndex(Monad0.Applicative0())(traversableWithIndexMap);
    var getOuterPort1 = getOuterPort(dictMonadReader);
    return function(dictMonadState) {
      var getOuterPort2 = getOuterPort1(dictMonadState);
      return map311(catMaybes4)(bind210(map311(filter7(isOutput))(getPorts22))(function(outputPorts) {
        return forWithIndex2(outputPorts)(function(dir2) {
          return function(port2) {
            return getOuterPort2(dir2);
          };
        });
      }));
    };
  };
  var evalWithPortInfoAt = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind210 = bind(Bind1);
    var asks2 = asks(MonadAsk0);
    var Applicative0 = Monad0.Applicative0();
    var for_10 = for_(Applicative0)(foldableMaybe);
    var map311 = map(Bind1.Apply0().Functor0());
    var forWithIndex2 = forWithIndex(Applicative0)(traversableWithIndexMap);
    var getInputOnEdge1 = getInputOnEdge(dictMonadReader);
    var unless4 = unless(Applicative0);
    var forWithIndex_2 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    return function(dictMonadState) {
      var getInputOnEdge2 = getInputOnEdge1(dictMonadState);
      var assign4 = assign2(dictMonadState);
      return function(loc) {
        return bind210(asks2(function($312) {
          return function(v2) {
            return v2.pieces;
          }(unwrap12($312));
        }))(function(pieces) {
          return for_10(lookup19(loc)(pieces))(function(v2) {
            var inputPorts = filter7(isInput)(v2.ports);
            return bind210(map311(fromFoldable12)(forWithIndex2(inputPorts)(function(dir2) {
              return function(port2) {
                return map311(Tuple.create(dir2))(getInputOnEdge2(relative(loc)(dir2))(portCapacity(port2)));
              };
            })))(function(inputs) {
              return unless4(isPseudoPiece(v2))(function() {
                var outputs = v2["eval"](inputs);
                var outputPorts = filter7(isOutput)(v2.ports);
                return forWithIndex_2(outputPorts)(function(dir2) {
                  return function(port2) {
                    var signal = foldMap5(clampSignal(portCapacity(port2)))(lookup18(dir2)(outputs));
                    return assign4(at4(relative(loc)(dir2))(strongFn))(new Just({
                      connected: false,
                      signal,
                      port: port2
                    }));
                  };
                });
              }());
            });
          });
        });
      };
    };
  };
  var evalWithPortInfo = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind210 = bind(Bind1);
    var asks2 = asks(MonadAsk0);
    var discard112 = discard14(Bind1);
    var injectInputs1 = injectInputs(dictMonadReader);
    var traverse_17 = traverse_(Monad0.Applicative0())(foldableList);
    var evalWithPortInfoAt1 = evalWithPortInfoAt(dictMonadReader);
    var extractOutputs1 = extractOutputs(dictMonadReader);
    return function(dictMonadState) {
      var injectInputs2 = injectInputs1(dictMonadState);
      var evalWithPortInfoAt2 = evalWithPortInfoAt1(dictMonadState);
      var extractOutputs2 = extractOutputs1(dictMonadState);
      return function(inputs) {
        return bind210(asks2(function($313) {
          return function(v2) {
            return v2.evalOrder;
          }(unwrap12($313));
        }))(function(evalOrder) {
          return discard112(injectInputs2(inputs))(function() {
            return discard112(traverse_17(evalWithPortInfoAt2)(evalOrder))(function() {
              return extractOutputs2;
            });
          });
        });
      };
    };
  };
  var evalWithPortInfo1 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT(/* @__PURE__ */ monadStateT(monadIdentity)))(/* @__PURE__ */ monadStateReaderT(/* @__PURE__ */ monadStateStateT(monadIdentity)));
  var evaluableBoardPiece = function(v2) {
    return {
      name: "evaluable",
      "eval": function(inputs) {
        return evalState(runReaderT(evalWithPortInfo1(inputs))(v2))(empty2);
      },
      complexity: space(0),
      shouldRipple: false,
      updateCapacity: function(v1) {
        return function(v22) {
          return Nothing.value;
        };
      },
      ports: getPorts1(v2),
      updatePort: function(v1) {
        return function(v22) {
          return Nothing.value;
        };
      }
    };
  };
  var buildEvaluableBoard = function(dictMonadError) {
    var MonadThrow0 = dictMonadError.MonadThrow0();
    var Monad0 = MonadThrow0.Monad0();
    var Functor0 = Monad0.Bind1().Apply0().Functor0();
    var evalStateT1 = evalStateT(Functor0);
    var bindStateT2 = bindStateT(Monad0);
    var discard112 = discard14(bindStateT2);
    var applicativeStateT1 = applicativeStateT(Monad0);
    var forWithIndex_2 = forWithIndex_(applicativeStateT1)(foldableWithIndexMap);
    var bind210 = bind(bindStateT2);
    var monadStateStateT1 = monadStateStateT(Monad0);
    var getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(monadStateStateT1);
    var assign4 = assign2(monadStateStateT1);
    var map311 = map(functorStateT(Functor0));
    var use4 = use(monadStateStateT1);
    var buildConnectionMap2 = buildConnectionMap(monadStateStateT1);
    var forWithIndex2 = forWithIndex(applicativeStateT1)(traversableWithIndexMap);
    var throwError3 = throwError(monadThrowStateT(MonadThrow0));
    var pure114 = pure(applicativeStateT1);
    return function(psuedoPiecePorts) {
      return evalStateT1(discard112(forWithIndex_2(psuedoPiecePorts)(function(dir2) {
        return function(port2) {
          return bind210(getBoardEdgePseudoLocation1(dir2))(function(loc) {
            var rotation2 = clockwiseRotation(Left2.value)(dir2);
            return assign4(function() {
              var $314 = at1(loc)(strongFn);
              return function($315) {
                return _pieces4($314($315));
              };
            }())(new Just({
              piece: psuedoPiece(port2),
              rotation: rotation2
            }));
          });
        };
      }))(function() {
        return bind210(map311(map120(function(v2) {
          return v2.piece;
        }))(use4(_pieces13)))(function(pieces) {
          return bind210(buildConnectionMap2)(function(connections) {
            return bind210(forWithIndex2(psuedoPiecePorts)(function(dir2) {
              return function(v2) {
                return getBoardEdgePseudoLocation1(dir2);
              };
            }))(function(psuedoPieceLocations) {
              var locations = fromFoldable23(keys2(pieces));
              return bind210(maybe(throwError3(Cyclic.value))(pure114)(topologicalSort(locations)(connections)))(function(evalOrder) {
                return pure114({
                  pieces,
                  connections,
                  evalOrder,
                  psuedoPieceLocations
                });
              });
            });
          });
        });
      }));
    };
  };
  var buildEvaluableBoard1 = /* @__PURE__ */ buildEvaluableBoard(/* @__PURE__ */ monadErrorStateT(/* @__PURE__ */ monadErrorExceptT(monadIdentity)));
  var toEvaluableBoard = function(board) {
    return runExcept(flip(evalStateT2)(board)(bind111(map212(function($316) {
      return catMaybes4(fromFoldable32($316));
    })($$for2(allDirections)(function(dir2) {
      return bind111(getBoardEdgePseudoLocation2(dir2))(function(loc) {
        return bind111(bind111(toRelativeEdge2(absolute(loc)(oppositeDirection(dir2))))(adjacentRelativeEdge2))(function(relEdge) {
          return bind111(getPortOnEdge2(relEdge))(function(maybePort) {
            return pure19(new Tuple(dir2, maybePort));
          });
        });
      });
    })))(function(psuedoPiecePorts) {
      return bind111(get3)(buildEvaluableBoard1(psuedoPiecePorts));
    })));
  };

  // output/Data.Tuple.Nested/index.js
  var uncurry3 = function(f) {
    return function(v2) {
      return f(v2.value0)(v2.value1.value0)(v2.value1.value1.value0);
    };
  };
  var tuple3 = function(a3) {
    return function(b2) {
      return function(c2) {
        return new Tuple(a3, new Tuple(b2, new Tuple(c2, unit)));
      };
    };
  };

  // output/Game.Board.Path/index.js
  var eq19 = /* @__PURE__ */ eq(eqCardinalDirection);
  var discard15 = /* @__PURE__ */ discard(discardUnit);
  var eq43 = /* @__PURE__ */ eq(eqRotation);
  var append110 = /* @__PURE__ */ append(semigroupRotation);
  var show32 = /* @__PURE__ */ show(showRotation);
  var eq52 = /* @__PURE__ */ eq(/* @__PURE__ */ eqSet(eqCardinalDirection));
  var fromFoldable13 = /* @__PURE__ */ fromFoldable4(foldableArray)(ordCardinalDirection);
  var _pieces5 = /* @__PURE__ */ _pieces(strongForget);
  var at5 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordLocation));
  var eq62 = /* @__PURE__ */ eq(eqPiece);
  var bind23 = /* @__PURE__ */ bind(bindEither);
  var discard16 = /* @__PURE__ */ discard15(bindEither);
  var when5 = /* @__PURE__ */ when(applicativeEither);
  var pure20 = /* @__PURE__ */ pure(applicativeEither);
  var fromFoldable14 = /* @__PURE__ */ fromFoldable2(foldableArray);
  var append22 = /* @__PURE__ */ append(semigroupArray);
  var foldr5 = /* @__PURE__ */ foldr(foldableList);
  var map47 = /* @__PURE__ */ map(functorList);
  var ObstructedByAnotherPiece = /* @__PURE__ */ function() {
    function ObstructedByAnotherPiece2(value0) {
      this.value0 = value0;
    }
    ;
    ObstructedByAnotherPiece2.create = function(value0) {
      return new ObstructedByAnotherPiece2(value0);
    };
    return ObstructedByAnotherPiece2;
  }();
  var LocationsAreNotAdjacent = /* @__PURE__ */ function() {
    function LocationsAreNotAdjacent2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LocationsAreNotAdjacent2.create = function(value0) {
      return function(value1) {
        return new LocationsAreNotAdjacent2(value0, value1);
      };
    };
    return LocationsAreNotAdjacent2;
  }();
  var PathIsEmpty = /* @__PURE__ */ function() {
    function PathIsEmpty2() {
    }
    ;
    PathIsEmpty2.value = new PathIsEmpty2();
    return PathIsEmpty2;
  }();
  var WireInputEqualsOutput = /* @__PURE__ */ function() {
    function WireInputEqualsOutput2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    WireInputEqualsOutput2.create = function(value0) {
      return function(value1) {
        return new WireInputEqualsOutput2(value0, value1);
      };
    };
    return WireInputEqualsOutput2;
  }();
  var NoOverlay = /* @__PURE__ */ function() {
    function NoOverlay2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NoOverlay2.create = function(value0) {
      return function(value1) {
        return new NoOverlay2(value0, value1);
      };
    };
    return NoOverlay2;
  }();
  var BoardError = /* @__PURE__ */ function() {
    function BoardError2(value0) {
      this.value0 = value0;
    }
    ;
    BoardError2.create = function(value0) {
      return new BoardError2(value0);
    };
    return BoardError2;
  }();
  var Other = /* @__PURE__ */ function() {
    function Other2(value0) {
      this.value0 = value0;
    }
    ;
    Other2.create = function(value0) {
      return new Other2(value0);
    };
    return Other2;
  }();
  var semigroupPathError = {
    append: function(a3) {
      return function(v2) {
        return a3;
      };
    }
  };
  var altExceptT2 = /* @__PURE__ */ altExceptT(semigroupPathError);
  var triples = function(v2) {
    if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Cons)) {
      return new Cons(tuple3(v2.value0)(v2.value1.value0)(v2.value1.value1.value0), triples(new Cons(v2.value1.value0, new Cons(v2.value1.value1.value0, v2.value1.value1.value1))));
    }
    ;
    return Nil.value;
  };
  var overlayWires = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bindExceptT2 = bindExceptT(Monad0);
    var bind118 = bind(bindExceptT2);
    var applicativeExceptT2 = applicativeExceptT(Monad0);
    var pure114 = pure(applicativeExceptT2);
    var throwError3 = throwError(monadThrowExceptT(Monad0));
    var withExceptT2 = withExceptT(Monad0.Bind1().Apply0().Functor0());
    var monadErrorExceptT2 = monadErrorExceptT(Monad0);
    var monadStateExceptT2 = monadStateExceptT(dictMonadState);
    var addPieceNoUpdate2 = addPieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    var discard27 = discard15(bindExceptT2);
    var unless4 = unless(applicativeExceptT2);
    var removePieceNoUpdate2 = removePieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    var alt6 = alt(altExceptT2(Monad0));
    return function(v2) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return bind118(function() {
            var v22 = clockwiseRotation(v2.inputDirection)(v2.outputDirection);
            if (v22 === 1) {
              return pure114(leftPiece);
            }
            ;
            if (v22 === 2) {
              return pure114(idPiece);
            }
            ;
            if (v22 === 3) {
              return pure114(rightPiece);
            }
            ;
            return throwError3(new WireInputEqualsOutput(v2.inputDirection, v2.outputDirection));
          }())(function(piece) {
            return withExceptT2(BoardError.create)(addPieceNoUpdate2(v2.location)(piece)(clockwiseRotation(Left2.value)(v2.inputDirection)));
          });
        }
        ;
        if (v1 instanceof Just) {
          var wireRotation = clockwiseRotation(v2.inputDirection)(v2.outputDirection);
          var noOverlay = new NoOverlay(v2, v1.value0);
          var extantRotation = clockwiseRotation(v1.value0.inputDirection)(v1.value0.outputDirection);
          var isChicken = discard27(unless4(eq43(wireRotation)(extantRotation))(throwError3(new Other("not a chicken"))))(function() {
            var rot = clockwiseRotation(v2.inputDirection)(Left2.value);
            return withExceptT2(BoardError.create)(bind118(removePieceNoUpdate2(v1.value0.location))(function() {
              return addPieceNoUpdate2(v1.value0.location)(chickenPiece)(rot);
            }));
          });
          var isCornerCut = discard27(unless4(eq43(append110(wireRotation)(extantRotation))(rotation(0)))(throwError3(new Other("not a cornercut" + show32(append110(wireRotation)(extantRotation))))))(function() {
            return bind118(function() {
              var v22 = clockwiseRotation(v2.inputDirection)(v1.value0.inputDirection);
              if (v22 === 1) {
                return pure114(clockwiseRotation(Left2.value)(v2.inputDirection));
              }
              ;
              if (v22 === 3) {
                return pure114(clockwiseRotation(Left2.value)(v1.value0.inputDirection));
              }
              ;
              return throwError3(noOverlay);
            }())(function(rot) {
              return withExceptT2(BoardError.create)(bind118(removePieceNoUpdate2(v1.value0.location))(function() {
                return addPieceNoUpdate2(v1.value0.location)(cornerCutPiece)(rot);
              }));
            });
          });
          var isCrossOver = discard27(unless4(eq43(wireRotation)(rotation(2)) && eq43(extantRotation)(rotation(2)))(throwError3(new Other("not a cross over"))))(function() {
            return bind118(function() {
              var v22 = clockwiseRotation(v2.inputDirection)(v1.value0.inputDirection);
              if (v22 === 1) {
                return pure114(clockwiseRotation(Left2.value)(v2.inputDirection));
              }
              ;
              if (v22 === 3) {
                return pure114(clockwiseRotation(Left2.value)(v1.value0.inputDirection));
              }
              ;
              return throwError3(noOverlay);
            }())(function(rot) {
              return withExceptT2(BoardError.create)(bind118(removePieceNoUpdate2(v1.value0.location))(function() {
                return addPieceNoUpdate2(v1.value0.location)(crossPiece)(rot);
              }));
            });
          });
          var ensureAllPortsFilled = unless4(eq52(fromFoldable13([v2.inputDirection, v2.outputDirection, v1.value0.inputDirection, v1.value0.outputDirection]))(fromFoldable13(allDirections)))(throwError3(new Other("all ports not filled")));
          return discard27(ensureAllPortsFilled)(function() {
            return alt6(isCrossOver)(alt6(isCornerCut)(isChicken));
          });
        }
        ;
        throw new Error("Failed pattern match at Game.Board.Path (line 87, column 1 - line 88, column 52): " + [v2.constructor.name, v1.constructor.name]);
      };
    };
  };
  var getWireAt = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(bindExceptT(Monad0));
    var use4 = use(monadStateExceptT(dictMonadState));
    var applicativeExceptT2 = applicativeExceptT(Monad0);
    var $$for3 = $$for(applicativeExceptT2)(traversableMaybe);
    var pure114 = pure(applicativeExceptT2);
    var throwError3 = throwError(monadThrowExceptT(Monad0));
    return function(location4) {
      return bind118(use4(function() {
        var $195 = at5(location4)(strongForget);
        return function($196) {
          return _pieces5($195($196));
        };
      }()))(function(v2) {
        return $$for3(v2)(function(info2) {
          var inputDirection = rotateDirection(Left2.value)(info2.rotation);
          var $192 = eq62(info2.piece)(idPiece);
          if ($192) {
            return pure114({
              inputDirection,
              outputDirection: rotateDirection(Right2.value)(info2.rotation),
              location: location4
            });
          }
          ;
          var $193 = eq62(info2.piece)(leftPiece);
          if ($193) {
            return pure114({
              inputDirection,
              outputDirection: rotateDirection(Up.value)(info2.rotation),
              location: location4
            });
          }
          ;
          var $194 = eq62(info2.piece)(rightPiece);
          if ($194) {
            return pure114({
              inputDirection,
              outputDirection: rotateDirection(Down.value)(info2.rotation),
              location: location4
            });
          }
          ;
          return throwError3(new ObstructedByAnotherPiece(location4));
        });
      });
    };
  };
  var createWire = function(dictMonad) {
    var liftEither2 = liftEither(monadThrowExceptT(dictMonad));
    return function(l2) {
      return function(v2) {
        return function(r2) {
          return liftEither2(bind23(note(new LocationsAreNotAdjacent(v2, l2))(directionTo(v2)(l2)))(function(inputDirection) {
            return bind23(note(new LocationsAreNotAdjacent(v2, r2))(directionTo(v2)(r2)))(function(outputDirection) {
              return discard16(when5(eq19(inputDirection)(outputDirection))(new Left(new WireInputEqualsOutput(inputDirection, outputDirection))))(function() {
                return pure20({
                  inputDirection,
                  outputDirection,
                  location: v2
                });
              });
            });
          }));
        };
      };
    };
  };
  var singleWirePiece = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(bindExceptT(Monad0));
    var createWire1 = createWire(Monad0);
    var getWireAt1 = getWireAt(dictMonadState);
    var overlayWires1 = overlayWires(dictMonadState);
    return function(l2) {
      return function(v2) {
        return function(r2) {
          return bind118(createWire1(l2)(v2)(r2))(function(wire) {
            return bind118(getWireAt1(v2))(function(maybeExtant) {
              return overlayWires1(wire)(maybeExtant);
            });
          });
        };
      };
    };
  };
  var boardPathWithError = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var bind118 = bind(bindExceptT(Monad0));
    var liftEither2 = liftEither(monadThrowExceptT(Monad0));
    var applySecond2 = applySecond(applyExceptT(Monad0));
    var pure114 = pure(applicativeExceptT(Monad0));
    var singleWirePiece1 = singleWirePiece(dictMonadState);
    return function(initialDir) {
      return function(path3) {
        return function(terminalDir) {
          return runExceptT(bind118(liftEither2(note(PathIsEmpty.value)(head(path3))))(function(h7) {
            return bind118(liftEither2(note(PathIsEmpty.value)(last(path3))))(function(l2) {
              var initial = followDirection(h7)(initialDir);
              var terminal = followDirection(l2)(terminalDir);
              var locations = fromFoldable14(append22([initial])(append22(path3)([terminal])));
              return foldr5(applySecond2)(pure114(unit))(map47(uncurry3(singleWirePiece1))(triples(locations)));
            });
          }));
        };
      };
    };
  };
  var addBoardPath = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind118 = bind(Bind1);
    var map126 = map(Bind1.Apply0().Functor0());
    var boardPathWithError1 = boardPathWithError(dictMonadState);
    var discard27 = discard15(Bind1);
    var Applicative0 = Monad0.Applicative0();
    var when1 = when(Applicative0);
    var for_10 = for_(Applicative0)(foldableMaybe);
    var updatePortsAround2 = updatePortsAround(dictMonadState);
    var pure114 = pure(Applicative0);
    return function(initialDir) {
      return function(path3) {
        return function(terminalDir) {
          return bind118(map126(blush)(boardPathWithError1(initialDir)(path3)(terminalDir)))(function(maybePathError) {
            return discard27(when1(isNothing(maybePathError))(discard27(for_10(head(path3))(updatePortsAround2))(function() {
              return for_10(last(path3))(updatePortsAround2);
            })))(function() {
              return pure114(isNothing(maybePathError));
            });
          });
        };
      };
    };
  };

  // output/Web.HTML.Event.DragEvent/index.js
  var toEvent2 = unsafeCoerce2;

  // output/Component.Board/index.js
  var bind24 = /* @__PURE__ */ bind(bindHalogenM);
  var gets5 = /* @__PURE__ */ gets(monadStateHalogenM);
  var use3 = /* @__PURE__ */ use(monadStateHalogenM);
  var _board3 = /* @__PURE__ */ _board(strongForget);
  var _pieces6 = /* @__PURE__ */ _pieces(strongForget);
  var traverseWithIndex_2 = /* @__PURE__ */ traverseWithIndex_(applicativeHalogenM)(foldableWithIndexMap);
  var discard17 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var tell4 = /* @__PURE__ */ tell2();
  var pieceIsSymbol = {
    reflectSymbol: function() {
      return "piece";
    }
  };
  var tell1 = /* @__PURE__ */ tell4(pieceIsSymbol)(ordLocation);
  var map48 = /* @__PURE__ */ map(functorHalogenM);
  var buildEvaluableBoard2 = /* @__PURE__ */ buildEvaluableBoard(monadErrorEither);
  var pure21 = /* @__PURE__ */ pure(applicativeHalogenM);
  var monadStateStateT3 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var evalWithPortInfo2 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT(/* @__PURE__ */ monadStateT(monadIdentity)))(/* @__PURE__ */ monadStateReaderT(monadStateStateT3));
  var modify_6 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var slot2 = /* @__PURE__ */ slot();
  var slot1 = /* @__PURE__ */ slot2(pieceIsSymbol)(ordLocation);
  var multimeterIsSymbol = {
    reflectSymbol: function() {
      return "multimeter";
    }
  };
  var slot22 = /* @__PURE__ */ slot2(multimeterIsSymbol)(ordUnit);
  var show20 = /* @__PURE__ */ show(showLocation);
  var _size3 = /* @__PURE__ */ _size(strongForget);
  var show110 = /* @__PURE__ */ show(showInt);
  var div6 = /* @__PURE__ */ div(euclideanRingInt);
  var elem6 = /* @__PURE__ */ elem2(eqCardinalDirection);
  var intercalate7 = /* @__PURE__ */ intercalate2(monoidString);
  var fromEnum4 = /* @__PURE__ */ fromEnum(boundedEnumCardinalDirect);
  var bind112 = /* @__PURE__ */ bind(bindArray);
  var monadStateBoardBoardT2 = /* @__PURE__ */ monadStateBoardBoardT(monadIdentity);
  var monadErrorBoardErrorBoard2 = /* @__PURE__ */ monadErrorBoardErrorBoard(monadIdentity);
  var getPieceInfo2 = /* @__PURE__ */ getPieceInfo(monadStateBoardBoardT2)(monadErrorBoardErrorBoard2);
  var map121 = /* @__PURE__ */ map(functorMaybe);
  var foldMap6 = /* @__PURE__ */ foldMap(foldableEither)(monoidRotation);
  var pure110 = /* @__PURE__ */ pure(applicativeArray);
  var append111 = /* @__PURE__ */ append(semigroupArray);
  var addPiece2 = /* @__PURE__ */ addPiece(monadErrorBoardErrorBoard2)(monadStateBoardBoardT2);
  var traverse_8 = /* @__PURE__ */ traverse_(applicativeHalogenM);
  var traverse_12 = /* @__PURE__ */ traverse_8(foldableEither);
  var removePiece2 = /* @__PURE__ */ removePiece(monadErrorBoardErrorBoard2)(monadStateBoardBoardT2);
  var assign3 = /* @__PURE__ */ assign2(monadStateHalogenM);
  var _inputs2 = /* @__PURE__ */ _inputs(strongFn);
  var map213 = /* @__PURE__ */ map(functorFn);
  var increaseSize2 = /* @__PURE__ */ increaseSize(monadStateBoardBoardT2)(monadErrorBoardErrorBoard2);
  var decreaseSize2 = /* @__PURE__ */ decreaseSize(monadStateBoardBoardT2)(monadErrorBoardErrorBoard2);
  var $$void11 = /* @__PURE__ */ $$void(functorHalogenM);
  var map310 = /* @__PURE__ */ map(functorEmitter);
  var bindFlipped7 = /* @__PURE__ */ bindFlipped(bindHalogenM);
  var rotatePieceBy2 = /* @__PURE__ */ rotatePieceBy(monadErrorBoardErrorBoard2)(monadStateBoardBoardT2);
  var pieceDropped2 = /* @__PURE__ */ pieceDropped(monadStateBoardBoardT2)(monadErrorBoardErrorBoard2);
  var tell22 = /* @__PURE__ */ tell4(multimeterIsSymbol)(ordUnit);
  var capacityRipple2 = /* @__PURE__ */ capacityRipple(monadStateStateT3);
  var bind25 = /* @__PURE__ */ bind(bindMaybe);
  var lookup20 = /* @__PURE__ */ lookup(ordRelativeEdge);
  var pure24 = /* @__PURE__ */ pure(applicativeMaybe);
  var for_6 = /* @__PURE__ */ for_(applicativeHalogenM)(foldableMaybe);
  var modifying2 = /* @__PURE__ */ modifying(monadStateHalogenM);
  var ix4 = /* @__PURE__ */ ix(/* @__PURE__ */ indexMap(ordCardinalDirection));
  var eq20 = /* @__PURE__ */ eq(eqSignal);
  var ff3 = /* @__PURE__ */ ff(heytingAlgebraSignal);
  var tt3 = /* @__PURE__ */ tt(heytingAlgebraSignal);
  var bind32 = /* @__PURE__ */ bind(/* @__PURE__ */ bindMaybeT(monadHalogenM));
  var monadStateMaybeT2 = /* @__PURE__ */ monadStateMaybeT(monadStateHalogenM);
  var modify_1 = /* @__PURE__ */ modify_2(monadStateMaybeT2);
  var traverse_22 = /* @__PURE__ */ traverse_8(foldableMaybe);
  var when6 = /* @__PURE__ */ when(applicativeHalogenM);
  var notEq7 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqLocation));
  var appendModifying2 = /* @__PURE__ */ appendModifying(monadStateHalogenM)(semigroupArray);
  var _wireLocations2 = /* @__PURE__ */ _wireLocations(wanderFunction);
  var map49 = /* @__PURE__ */ map(/* @__PURE__ */ functorMaybeT(functorHalogenM));
  var addBoardPath2 = /* @__PURE__ */ addBoardPath(monadStateStateT3);
  var use1 = /* @__PURE__ */ use(monadStateMaybeT2);
  var getBoardRelEdge2 = /* @__PURE__ */ getBoardRelEdge(monadStateStateT3);
  var updatePieceComponents = /* @__PURE__ */ bind24(/* @__PURE__ */ gets5(function(v2) {
    return v2.lastEvalWithPortInfo;
  }))(function(signals) {
    return bind24(use3(function($281) {
      return _board3(_pieces6($281));
    }))(traverseWithIndex_2(function(loc) {
      return function(info2) {
        return discard17(tell1(_piece)(loc)(function(v2) {
          return new SetPiece(info2.piece);
        }))(function() {
          var portStates = toLocalInputs(loc)(signals);
          return tell1(_piece)(loc)(function(v2) {
            return new SetPortStates(portStates);
          });
        });
      };
    }));
  });
  var getDirectionClicked = function(me) {
    return function(bb) {
      var v2 = new Tuple(toNumber(clientX(me)) - bb.left, toNumber(clientY(me)) - bb.top);
      var isTopOrRight = v2.value0 > v2.value1;
      var isTopOrLeft = v2.value0 + v2.value1 < bb.width;
      if (!isTopOrRight && !isTopOrLeft) {
        return Down.value;
      }
      ;
      if (!isTopOrRight && isTopOrLeft) {
        return Left2.value;
      }
      ;
      if (isTopOrRight && !isTopOrLeft) {
        return Right2.value;
      }
      ;
      if (isTopOrRight && isTopOrLeft) {
        return Up.value;
      }
      ;
      throw new Error("Failed pattern match at Component.Board (line 357, column 29 - line 361, column 31): " + [isTopOrRight.constructor.name, isTopOrLeft.constructor.name]);
    };
  };
  var evaluateBoard = /* @__PURE__ */ bind24(/* @__PURE__ */ gets5(function(v2) {
    return v2.goalPorts;
  }))(function(goalPorts) {
    return bind24(gets5(function(v2) {
      return v2.inputs;
    }))(function(inputs) {
      return bind24(map48(buildEvaluableBoard2(goalPorts))(use3(_board3)))(function(eitherEvaluable) {
        if (eitherEvaluable instanceof Left) {
          return pure21(unit);
        }
        ;
        if (eitherEvaluable instanceof Right) {
          var v2 = runEvaluableM(eitherEvaluable.value0)(evalWithPortInfo2(inputs));
          return discard17(modify_6(function(v1) {
            var $176 = {};
            for (var $177 in v1) {
              if ({}.hasOwnProperty.call(v1, $177)) {
                $176[$177] = v1[$177];
              }
              ;
            }
            ;
            $176.lastEvalWithPortInfo = v2.value1;
            $176.outputs = v2.value0;
            return $176;
          }))(function() {
            return updatePieceComponents;
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Board (line 389, column 3 - line 403, column 28): " + [eitherEvaluable.constructor.name]);
      });
    });
  });
  var updateBoard = function(board) {
    return discard17(modify_6(function(s2) {
      var $182 = {};
      for (var $183 in s2) {
        if ({}.hasOwnProperty.call(s2, $183)) {
          $182[$183] = s2[$183];
        }
        ;
      }
      ;
      $182.boardHistory = append10(board)(s2.boardHistory);
      return $182;
    }))(function() {
      return bind24(use3(function($282) {
        return _board3(_pieces6($282));
      }))(function(pieces) {
        return discard17(evaluateBoard)(function() {
          return raise(new NewBoardState(board));
        });
      });
    });
  };
  var component7 = function(dictMonadStore) {
    var updateStore2 = updateStore(monadStoreHalogenM(dictMonadStore));
    return function(dictMonadEffect) {
      var component1 = component6(dictMonadEffect);
      var component22 = component5(dictMonadEffect);
      var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
      var liftEffect11 = liftEffect(monadEffectHalogenM2);
      var log5 = log2(monadEffectHalogenM2);
      var liftEffect13 = liftEffect(monadEffectMaybe(monadEffectHalogenM2));
      var render = function(state3) {
        var pieceHTML = function(piece) {
          return function(location4) {
            var portStates = toLocalInputs(location4)(state3.lastEvalWithPortInfo);
            return slot1(_piece)(location4)(component1)({
              piece,
              location: location4,
              portStates
            })(PieceOutput.create);
          };
        };
        var multimeter = slot22(_multimeter)(unit)(component22)({})(MultimeterOutput.create);
        var emptyPieceHTML = function(location4) {
          return text5(show20(location4));
        };
        var board = head6(state3.boardHistory);
        var n = viewOn(board)(_size3);
        var gridTemplate = "25fr repeat(" + (show110(n) + ", 100fr) 25fr");
        var renderBoardPort = function(dir2) {
          return function(portInfo) {
            var path3 = portPath({
              port: matchingPort(portInfo.port),
              connected: portInfo.connected,
              signal: portInfo.signal
            });
            var m2 = n + 2 | 0;
            var v2 = function() {
              if (dir2 instanceof Up) {
                return new Tuple(1, div6(m2)(2) + 1 | 0);
              }
              ;
              if (dir2 instanceof Down) {
                return new Tuple(m2, div6(m2)(2) + 1 | 0);
              }
              ;
              if (dir2 instanceof Left2) {
                return new Tuple(div6(m2)(2) + 1 | 0, 1);
              }
              ;
              if (dir2 instanceof Right2) {
                return new Tuple(div6(m2)(2) + 1 | 0, m2);
              }
              ;
              throw new Error("Failed pattern match at Component.Board (line 178, column 23 - line 182, column 55): " + [dir2.constructor.name]);
            }();
            var viewBox2 = function() {
              var $187 = elem6(dir2)([Up.value, Down.value]);
              if ($187) {
                return viewBox(0)(0)(50)(25);
              }
              ;
              return viewBox(12.5)(-12.5)(25)(50);
            }();
            return div3([class_("board-port"), onClick(function(v1) {
              return new ToggleInput(dir2);
            }), attr3(direction)(dir2), style(intercalate7("; ")(["grid-area: " + (show110(v2.value0) + (" / " + show110(v2.value1)))]))])([svg([viewBox2])([g([transform([new Rotate(toNumber(fromEnum4(dir2) + 2 | 0) * 90, 25, 12.5)])])([renderPathWithEvents(path3)(new BoardPortOnMouseEnter(dir2))(BoardPortOnMouseLeave.value)])])]);
          };
        };
        var boardPorts = bind112(allDirections)(function(dir2) {
          var v2 = view(_boardPort(dir2)(strongForget))(state3);
          if (v2 instanceof Just) {
            return [renderBoardPort(dir2)(v2.value0)];
          }
          ;
          if (v2 instanceof Nothing) {
            return [];
          }
          ;
          throw new Error("Failed pattern match at Component.Board (line 154, column 11 - line 156, column 26): " + [v2.constructor.name]);
        });
        var renderPieceSlot = function(i2) {
          return function(j) {
            var loc = location2(i2)(j);
            var eitherPieceInfo = evalBoardM(getPieceInfo2(loc))(board);
            var maybePiece = map121(function(v3) {
              return v3.piece;
            })(hush(eitherPieceInfo));
            var v2 = foldMap6(function(v1) {
              return v1.rotation;
            })(eitherPieceInfo);
            return div3([attr3(location3)(loc), class_("piece"), style(intercalate7("; ")(["transform: rotate(" + (show110(v2 * 90 | 0) + "deg)"), "grid-area: " + (show110(j + 2 | 0) + (" / " + show110(i2 + 2 | 0)))])), onMouseDown(LocationOnMouseDown.create(loc)), onMouseOver(LocationOnMouseOver.create(loc)), onMouseUp(LocationOnMouseUp.create(loc)), onDragEnter(LocationOnDragEnter.create(loc)), onDragOver(LocationOnDragOver.create(loc)), onDragLeave(LocationOnDragLeave.create), onDrop(LocationOnDrop.create(loc))])([maybe(emptyPieceHTML)(pieceHTML)(maybePiece)(loc)]);
          };
        };
        var pieces = bind112(range2(0)(n - 1 | 0))(function(i2) {
          return bind112(range2(0)(n - 1 | 0))(function(j) {
            return pure110(renderPieceSlot(i2)(j));
          });
        });
        return div3([id2("board-component"), onDragExit(BoardOnDragExit.create), style(intercalate7("; ")(["grid-template-columns: " + gridTemplate, "grid-template-rows:    " + gridTemplate]))])(append111(pieces)(append111(boardPorts)([multimeter])));
      };
      var initialState = function(maybeBoard) {
        var board = fromMaybe(standardBoard)(maybeBoard);
        return {
          boardHistory: singleton10(board),
          mouseOverLocation: Nothing.value,
          goalPorts: empty2,
          inputs: empty2,
          outputs: empty2,
          lastEvalWithPortInfo: empty2,
          isCreatingWire: Nothing.value
        };
      };
      var handleQuery = function(v2) {
        if (v2 instanceof GetBoard) {
          return bind24(use3(_board3))(function(board) {
            return pure21(new Just(v2.value0(board)));
          });
        }
        ;
        if (v2 instanceof AddPiece) {
          return discard17(bind24(liftBoardM(addPiece2(v2.value0)(v2.value1)))(traverse_12(function(v1) {
            return updateBoard(v1.value1);
          })))(function() {
            return pure21(Nothing.value);
          });
        }
        ;
        if (v2 instanceof RemovePiece) {
          return discard17(bind24(liftBoardM(removePiece2(v2.value0)))(traverse_12(function(v1) {
            return bind24(updateBoard(v1.value1))(function() {
              return updateStore2(new BoardEvent(new RemovedPiece(v2.value0, name15(v1.value0))));
            });
          })))(function() {
            return pure21(Nothing.value);
          });
        }
        ;
        if (v2 instanceof GetMouseOverLocation) {
          return bind24(gets5(function(v1) {
            return v1.mouseOverLocation;
          }))(function(maybeDst) {
            return pure21(map121(v2.value0)(maybeDst));
          });
        }
        ;
        if (v2 instanceof SetGoalPorts) {
          return discard17(modify_6(function(v1) {
            var $205 = {};
            for (var $206 in v1) {
              if ({}.hasOwnProperty.call(v1, $206)) {
                $205[$206] = v1[$206];
              }
              ;
            }
            ;
            $205.goalPorts = v2.value0;
            return $205;
          }))(function() {
            return discard17(evaluateBoard)(function() {
              return pure21(Nothing.value);
            });
          });
        }
        ;
        if (v2 instanceof SetInputs) {
          return discard17(assign3(_inputs2)(v2.value0))(function() {
            return discard17(evaluateBoard)(function() {
              return map48(map213(Just.create)(v2.value1))(gets5(function(v1) {
                return v1.outputs;
              }));
            });
          });
        }
        ;
        if (v2 instanceof IncrementBoardSize) {
          return discard17(bind24(liftBoardM(increaseSize2))(traverse_12(function(v1) {
            return updateBoard(v1.value1);
          })))(function() {
            return pure21(Nothing.value);
          });
        }
        ;
        if (v2 instanceof DecrementBoardSize) {
          return discard17(bind24(liftBoardM(decreaseSize2))(traverse_12(function(v1) {
            return updateBoard(v1.value1);
          })))(function() {
            return pure21(Nothing.value);
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Board (line 208, column 17 - line 244, column 19): " + [v2.constructor.name]);
      };
      var handleAction = function(v2) {
        if (v2 instanceof Initialise2) {
          return bind24(liftEffect11(globalKeyDownEventEmitter))(function(emitter) {
            return discard17($$void11(subscribe2(map310(GlobalOnKeyDown.create)(emitter))))(function() {
              return bindFlipped7(raise)(map48(NewBoardState.create)(use3(_board3)));
            });
          });
        }
        ;
        if (v2 instanceof PieceOutput && v2.value0 instanceof Rotated) {
          return bind24(liftBoardM(rotatePieceBy2(v2.value0.value0)(v2.value0.value1)))(traverse_12(function(v1) {
            return discard17(updateStore2(new BoardEvent(new RotatedPiece(v2.value0.value0, v2.value0.value1))))(function() {
              return updateBoard(v1.value1);
            });
          }));
        }
        ;
        if (v2 instanceof PieceOutput && v2.value0 instanceof Dropped) {
          return bind24(gets5(function(v1) {
            return v1.mouseOverLocation;
          }))(function(maybeDst) {
            return bind24(liftBoardM(pieceDropped2(v2.value0.value0)(maybeDst)))(function(eitherPiece) {
              if (eitherPiece instanceof Left) {
                return pure21(unit);
              }
              ;
              if (eitherPiece instanceof Right) {
                return bind24(use3(_board3))(updateBoard);
              }
              ;
              throw new Error("Failed pattern match at Component.Board (line 260, column 7 - line 262, column 50): " + [eitherPiece.constructor.name]);
            });
          });
        }
        ;
        if (v2 instanceof PieceOutput && v2.value0 instanceof NewMultimeterFocus) {
          return tell22(_multimeter)(unit)(function(v1) {
            return new NewFocus(v2.value0.value0);
          });
        }
        ;
        if (v2 instanceof MultimeterOutput) {
          return bind24(map48(execState(capacityRipple2(v2.value0.value0)(v2.value0.value1)))(use3(_board3)))(function(board$prime) {
            return discard17(updateBoard(board$prime))(function() {
              return bind24(gets5(function(v1) {
                return v1.lastEvalWithPortInfo;
              }))(function(signals) {
                var focus3 = bind25(lookup20(v2.value0.value0)(signals))(function(info2) {
                  return pure24({
                    info: info2,
                    relativeEdge: v2.value0.value0
                  });
                });
                return tell22(_multimeter)(unit)(function(v1) {
                  return new NewFocus(focus3);
                });
              });
            });
          });
        }
        ;
        if (v2 instanceof Undo) {
          return bind24(map48(moveLeft)(gets5(function(v1) {
            return v1.boardHistory;
          })))(function(maybeZipper) {
            return for_6(maybeZipper)(function(t2) {
              return discard17(modify_6(function(v1) {
                var $236 = {};
                for (var $237 in v1) {
                  if ({}.hasOwnProperty.call(v1, $237)) {
                    $236[$237] = v1[$237];
                  }
                  ;
                }
                ;
                $236.boardHistory = t2;
                return $236;
              }))(function() {
                return evaluateBoard;
              });
            });
          });
        }
        ;
        if (v2 instanceof Redo) {
          return bind24(map48(moveRight)(gets5(function(v1) {
            return v1.boardHistory;
          })))(function(maybeZipper) {
            return for_6(maybeZipper)(function(t2) {
              return discard17(modify_6(function(v1) {
                var $239 = {};
                for (var $240 in v1) {
                  if ({}.hasOwnProperty.call(v1, $240)) {
                    $239[$240] = v1[$240];
                  }
                  ;
                }
                ;
                $239.boardHistory = t2;
                return $239;
              }))(function() {
                return evaluateBoard;
              });
            });
          });
        }
        ;
        if (v2 instanceof ToggleInput) {
          return discard17(modifying2(function() {
            var $283 = ix4(v2.value0)(strongFn)(choiceFn);
            return function($284) {
              return _inputs2($283($284));
            };
          }())(function(signal) {
            var $242 = eq20(signal)(ff3);
            if ($242) {
              return tt3;
            }
            ;
            return ff3;
          }))(function() {
            return evaluateBoard;
          });
        }
        ;
        if (v2 instanceof BoardOnDragExit) {
          return discard17(modify_6(function(v1) {
            var $244 = {};
            for (var $245 in v1) {
              if ({}.hasOwnProperty.call(v1, $245)) {
                $244[$245] = v1[$245];
              }
              ;
            }
            ;
            $244.isCreatingWire = Nothing.value;
            return $244;
          }))(function() {
            return log5("cancel wire creation");
          });
        }
        ;
        if (v2 instanceof LocationOnMouseDown) {
          return $$void11(runMaybeT(bind32(pure21(target5(toEvent(v2.value1))))(function(eventTarget) {
            return bind32(pure21(fromEventTarget(eventTarget)))(function(element4) {
              return bind32(liftEffect13(getBoundingClientRect(element4)))(function(bb) {
                var initialDirection = getDirectionClicked(v2.value1)(bb);
                return modify_1(function(v1) {
                  var $248 = {};
                  for (var $249 in v1) {
                    if ({}.hasOwnProperty.call(v1, $249)) {
                      $248[$249] = v1[$249];
                    }
                    ;
                  }
                  ;
                  $248.isCreatingWire = new Just({
                    initialDirection,
                    locations: [v2.value0]
                  });
                  return $248;
                });
              });
            });
          })));
        }
        ;
        if (v2 instanceof LocationOnMouseOver) {
          return bind24(gets5(function(v1) {
            return v1.isCreatingWire;
          }))(traverse_22(function(creatingWire) {
            return when6(notEq7(last(creatingWire.locations))(new Just(v2.value0)))(discard17(log5("modifying state of board"))(function() {
              return appendModifying2(_wireLocations2)([v2.value0]);
            }));
          }));
        }
        ;
        if (v2 instanceof LocationOnMouseUp) {
          return $$void11(runMaybeT(bind32(gets5(function(v1) {
            return v1.isCreatingWire;
          }))(function(creatingWire) {
            return bind32(pure21(target5(toEvent(v2.value1))))(function(eventTarget) {
              return bind32(pure21(fromEventTarget(eventTarget)))(function(element4) {
                return bind32(liftEffect13(getBoundingClientRect(element4)))(function(bb) {
                  var terminalDirection = getDirectionClicked(v2.value1)(bb);
                  return bind32(map49(runState(addBoardPath2(creatingWire.initialDirection)(creatingWire.locations)(terminalDirection)))(use1(_board3)))(function(v1) {
                    return modify_1(function(v22) {
                      var $256 = {};
                      for (var $257 in v22) {
                        if ({}.hasOwnProperty.call(v22, $257)) {
                          $256[$257] = v22[$257];
                        }
                        ;
                      }
                      ;
                      $256.isCreatingWire = Nothing.value;
                      return $256;
                    });
                  });
                });
              });
            });
          })));
        }
        ;
        if (v2 instanceof LocationOnDragEnter) {
          return discard17(liftEffect11(preventDefault(toEvent2(v2.value1))))(function() {
            return modify_6(function(v1) {
              var $263 = {};
              for (var $264 in v1) {
                if ({}.hasOwnProperty.call(v1, $264)) {
                  $263[$264] = v1[$264];
                }
                ;
              }
              ;
              $263.mouseOverLocation = new Just(v2.value0);
              return $263;
            });
          });
        }
        ;
        if (v2 instanceof LocationOnDragOver) {
          return liftEffect11(preventDefault(toEvent2(v2.value1)));
        }
        ;
        if (v2 instanceof LocationOnDrop) {
          return discard17(modify_6(function(v1) {
            var $270 = {};
            for (var $271 in v1) {
              if ({}.hasOwnProperty.call(v1, $271)) {
                $270[$271] = v1[$271];
              }
              ;
            }
            ;
            $270.mouseOverLocation = new Just(v2.value0);
            return $270;
          }))(function() {
            return liftEffect11(preventDefault(toEvent2(v2.value1)));
          });
        }
        ;
        if (v2 instanceof LocationOnDragLeave) {
          return modify_6(function(v1) {
            var $275 = {};
            for (var $276 in v1) {
              if ({}.hasOwnProperty.call(v1, $276)) {
                $275[$276] = v1[$276];
              }
              ;
            }
            ;
            $275.mouseOverLocation = Nothing.value;
            return $275;
          });
        }
        ;
        if (v2 instanceof GlobalOnKeyDown) {
          return discard17(when6(key(v2.value0) === "z" && ctrlKey(v2.value0))(handleAction(Undo.value)))(function() {
            return when6(key(v2.value0) === "y" && ctrlKey(v2.value0))(handleAction(Redo.value));
          });
        }
        ;
        if (v2 instanceof BoardPortOnMouseEnter) {
          return bind24(map48(evalState(getBoardRelEdge2(v2.value0)))(use3(_board3)))(function(relativeEdge) {
            return bind24(gets5(function(v1) {
              return v1.lastEvalWithPortInfo;
            }))(function(signals) {
              var focus3 = map121(function(v1) {
                return {
                  info: v1,
                  relativeEdge
                };
              })(lookup20(relativeEdge)(signals));
              return tell22(_multimeter)(unit)(function(v1) {
                return new NewFocus(focus3);
              });
            });
          });
        }
        ;
        if (v2 instanceof BoardPortOnMouseLeave) {
          return tell22(_multimeter)(unit)(function(v1) {
            return new NewFocus(Nothing.value);
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Board (line 247, column 18 - line 352, column 66): " + [v2.constructor.name]);
      };
      var $$eval2 = mkEval({
        finalize: Nothing.value,
        handleAction,
        handleQuery,
        initialize: new Just(Initialise2.value),
        receive: function(v2) {
          return Nothing.value;
        }
      });
      return mkComponent({
        "eval": $$eval2,
        initialState,
        render
      });
    };
  };

  // output/Data.Time.Component/index.js
  var $runtime_lazy9 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var ordSecond = ordInt;
  var ordMinute = ordInt;
  var ordHour = ordInt;
  var boundedSecond = {
    bottom: 0,
    top: 59,
    Ord0: function() {
      return ordSecond;
    }
  };
  var boundedMinute = {
    bottom: 0,
    top: 59,
    Ord0: function() {
      return ordMinute;
    }
  };
  var boundedHour = {
    bottom: 0,
    top: 23,
    Ord0: function() {
      return ordHour;
    }
  };
  var boundedEnumSecond = {
    cardinality: 60,
    toEnum: function(n) {
      if (n >= 0 && n <= 59) {
        return new Just(n);
      }
      ;
      if (otherwise) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Time.Component (line 90, column 1 - line 95, column 26): " + [n.constructor.name]);
    },
    fromEnum: function(v2) {
      return v2;
    },
    Bounded0: function() {
      return boundedSecond;
    },
    Enum1: function() {
      return $lazy_enumSecond(0);
    }
  };
  var $lazy_enumSecond = /* @__PURE__ */ $runtime_lazy9("enumSecond", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $36 = toEnum(boundedEnumSecond);
        var $37 = fromEnum(boundedEnumSecond);
        return function($38) {
          return $36(function(v2) {
            return v2 + 1 | 0;
          }($37($38)));
        };
      }(),
      pred: function() {
        var $39 = toEnum(boundedEnumSecond);
        var $40 = fromEnum(boundedEnumSecond);
        return function($41) {
          return $39(function(v2) {
            return v2 - 1 | 0;
          }($40($41)));
        };
      }(),
      Ord0: function() {
        return ordSecond;
      }
    };
  });
  var boundedEnumMinute = {
    cardinality: 60,
    toEnum: function(n) {
      if (n >= 0 && n <= 59) {
        return new Just(n);
      }
      ;
      if (otherwise) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Time.Component (line 61, column 1 - line 66, column 26): " + [n.constructor.name]);
    },
    fromEnum: function(v2) {
      return v2;
    },
    Bounded0: function() {
      return boundedMinute;
    },
    Enum1: function() {
      return $lazy_enumMinute(0);
    }
  };
  var $lazy_enumMinute = /* @__PURE__ */ $runtime_lazy9("enumMinute", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $42 = toEnum(boundedEnumMinute);
        var $43 = fromEnum(boundedEnumMinute);
        return function($44) {
          return $42(function(v2) {
            return v2 + 1 | 0;
          }($43($44)));
        };
      }(),
      pred: function() {
        var $45 = toEnum(boundedEnumMinute);
        var $46 = fromEnum(boundedEnumMinute);
        return function($47) {
          return $45(function(v2) {
            return v2 - 1 | 0;
          }($46($47)));
        };
      }(),
      Ord0: function() {
        return ordMinute;
      }
    };
  });
  var boundedEnumHour = {
    cardinality: 24,
    toEnum: function(n) {
      if (n >= 0 && n <= 23) {
        return new Just(n);
      }
      ;
      if (otherwise) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Time.Component (line 32, column 1 - line 37, column 24): " + [n.constructor.name]);
    },
    fromEnum: function(v2) {
      return v2;
    },
    Bounded0: function() {
      return boundedHour;
    },
    Enum1: function() {
      return $lazy_enumHour(0);
    }
  };
  var $lazy_enumHour = /* @__PURE__ */ $runtime_lazy9("enumHour", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $54 = toEnum(boundedEnumHour);
        var $55 = fromEnum(boundedEnumHour);
        return function($56) {
          return $54(function(v2) {
            return v2 + 1 | 0;
          }($55($56)));
        };
      }(),
      pred: function() {
        var $57 = toEnum(boundedEnumHour);
        var $58 = fromEnum(boundedEnumHour);
        return function($59) {
          return $57(function(v2) {
            return v2 - 1 | 0;
          }($58($59)));
        };
      }(),
      Ord0: function() {
        return ordHour;
      }
    };
  });

  // output/Data.Time/index.js
  var Time = /* @__PURE__ */ function() {
    function Time2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Time2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Time2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Time2;
  }();
  var second2 = function(v2) {
    return v2.value2;
  };
  var minute = function(v2) {
    return v2.value1;
  };
  var hour = function(v2) {
    return v2.value0;
  };

  // output/Effect.Now/foreign.js
  function now2() {
    return Date.now();
  }

  // output/Data.Date/foreign.js
  var createDate = function(y2, m2, d2) {
    var date2 = new Date(Date.UTC(y2, m2, d2));
    if (y2 >= 0 && y2 < 100) {
      date2.setUTCFullYear(y2);
    }
    return date2;
  };
  function canonicalDateImpl(ctor, y2, m2, d2) {
    var date2 = createDate(y2, m2 - 1, d2);
    return ctor(date2.getUTCFullYear())(date2.getUTCMonth() + 1)(date2.getUTCDate());
  }

  // output/Data.Date.Component/index.js
  var $runtime_lazy10 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var January = /* @__PURE__ */ function() {
    function January2() {
    }
    ;
    January2.value = new January2();
    return January2;
  }();
  var February = /* @__PURE__ */ function() {
    function February2() {
    }
    ;
    February2.value = new February2();
    return February2;
  }();
  var March = /* @__PURE__ */ function() {
    function March2() {
    }
    ;
    March2.value = new March2();
    return March2;
  }();
  var April = /* @__PURE__ */ function() {
    function April2() {
    }
    ;
    April2.value = new April2();
    return April2;
  }();
  var May = /* @__PURE__ */ function() {
    function May2() {
    }
    ;
    May2.value = new May2();
    return May2;
  }();
  var June = /* @__PURE__ */ function() {
    function June2() {
    }
    ;
    June2.value = new June2();
    return June2;
  }();
  var July = /* @__PURE__ */ function() {
    function July2() {
    }
    ;
    July2.value = new July2();
    return July2;
  }();
  var August = /* @__PURE__ */ function() {
    function August2() {
    }
    ;
    August2.value = new August2();
    return August2;
  }();
  var September = /* @__PURE__ */ function() {
    function September2() {
    }
    ;
    September2.value = new September2();
    return September2;
  }();
  var October = /* @__PURE__ */ function() {
    function October2() {
    }
    ;
    October2.value = new October2();
    return October2;
  }();
  var November = /* @__PURE__ */ function() {
    function November2() {
    }
    ;
    November2.value = new November2();
    return November2;
  }();
  var December = /* @__PURE__ */ function() {
    function December2() {
    }
    ;
    December2.value = new December2();
    return December2;
  }();
  var eqMonth = {
    eq: function(x2) {
      return function(y2) {
        if (x2 instanceof January && y2 instanceof January) {
          return true;
        }
        ;
        if (x2 instanceof February && y2 instanceof February) {
          return true;
        }
        ;
        if (x2 instanceof March && y2 instanceof March) {
          return true;
        }
        ;
        if (x2 instanceof April && y2 instanceof April) {
          return true;
        }
        ;
        if (x2 instanceof May && y2 instanceof May) {
          return true;
        }
        ;
        if (x2 instanceof June && y2 instanceof June) {
          return true;
        }
        ;
        if (x2 instanceof July && y2 instanceof July) {
          return true;
        }
        ;
        if (x2 instanceof August && y2 instanceof August) {
          return true;
        }
        ;
        if (x2 instanceof September && y2 instanceof September) {
          return true;
        }
        ;
        if (x2 instanceof October && y2 instanceof October) {
          return true;
        }
        ;
        if (x2 instanceof November && y2 instanceof November) {
          return true;
        }
        ;
        if (x2 instanceof December && y2 instanceof December) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var ordMonth = {
    compare: function(x2) {
      return function(y2) {
        if (x2 instanceof January && y2 instanceof January) {
          return EQ.value;
        }
        ;
        if (x2 instanceof January) {
          return LT.value;
        }
        ;
        if (y2 instanceof January) {
          return GT.value;
        }
        ;
        if (x2 instanceof February && y2 instanceof February) {
          return EQ.value;
        }
        ;
        if (x2 instanceof February) {
          return LT.value;
        }
        ;
        if (y2 instanceof February) {
          return GT.value;
        }
        ;
        if (x2 instanceof March && y2 instanceof March) {
          return EQ.value;
        }
        ;
        if (x2 instanceof March) {
          return LT.value;
        }
        ;
        if (y2 instanceof March) {
          return GT.value;
        }
        ;
        if (x2 instanceof April && y2 instanceof April) {
          return EQ.value;
        }
        ;
        if (x2 instanceof April) {
          return LT.value;
        }
        ;
        if (y2 instanceof April) {
          return GT.value;
        }
        ;
        if (x2 instanceof May && y2 instanceof May) {
          return EQ.value;
        }
        ;
        if (x2 instanceof May) {
          return LT.value;
        }
        ;
        if (y2 instanceof May) {
          return GT.value;
        }
        ;
        if (x2 instanceof June && y2 instanceof June) {
          return EQ.value;
        }
        ;
        if (x2 instanceof June) {
          return LT.value;
        }
        ;
        if (y2 instanceof June) {
          return GT.value;
        }
        ;
        if (x2 instanceof July && y2 instanceof July) {
          return EQ.value;
        }
        ;
        if (x2 instanceof July) {
          return LT.value;
        }
        ;
        if (y2 instanceof July) {
          return GT.value;
        }
        ;
        if (x2 instanceof August && y2 instanceof August) {
          return EQ.value;
        }
        ;
        if (x2 instanceof August) {
          return LT.value;
        }
        ;
        if (y2 instanceof August) {
          return GT.value;
        }
        ;
        if (x2 instanceof September && y2 instanceof September) {
          return EQ.value;
        }
        ;
        if (x2 instanceof September) {
          return LT.value;
        }
        ;
        if (y2 instanceof September) {
          return GT.value;
        }
        ;
        if (x2 instanceof October && y2 instanceof October) {
          return EQ.value;
        }
        ;
        if (x2 instanceof October) {
          return LT.value;
        }
        ;
        if (y2 instanceof October) {
          return GT.value;
        }
        ;
        if (x2 instanceof November && y2 instanceof November) {
          return EQ.value;
        }
        ;
        if (x2 instanceof November) {
          return LT.value;
        }
        ;
        if (y2 instanceof November) {
          return GT.value;
        }
        ;
        if (x2 instanceof December && y2 instanceof December) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Date.Component (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y2.constructor.name]);
      };
    },
    Eq0: function() {
      return eqMonth;
    }
  };
  var boundedMonth = /* @__PURE__ */ function() {
    return {
      bottom: January.value,
      top: December.value,
      Ord0: function() {
        return ordMonth;
      }
    };
  }();
  var boundedEnumMonth = {
    cardinality: 12,
    toEnum: function(v2) {
      if (v2 === 1) {
        return new Just(January.value);
      }
      ;
      if (v2 === 2) {
        return new Just(February.value);
      }
      ;
      if (v2 === 3) {
        return new Just(March.value);
      }
      ;
      if (v2 === 4) {
        return new Just(April.value);
      }
      ;
      if (v2 === 5) {
        return new Just(May.value);
      }
      ;
      if (v2 === 6) {
        return new Just(June.value);
      }
      ;
      if (v2 === 7) {
        return new Just(July.value);
      }
      ;
      if (v2 === 8) {
        return new Just(August.value);
      }
      ;
      if (v2 === 9) {
        return new Just(September.value);
      }
      ;
      if (v2 === 10) {
        return new Just(October.value);
      }
      ;
      if (v2 === 11) {
        return new Just(November.value);
      }
      ;
      if (v2 === 12) {
        return new Just(December.value);
      }
      ;
      return Nothing.value;
    },
    fromEnum: function(v2) {
      if (v2 instanceof January) {
        return 1;
      }
      ;
      if (v2 instanceof February) {
        return 2;
      }
      ;
      if (v2 instanceof March) {
        return 3;
      }
      ;
      if (v2 instanceof April) {
        return 4;
      }
      ;
      if (v2 instanceof May) {
        return 5;
      }
      ;
      if (v2 instanceof June) {
        return 6;
      }
      ;
      if (v2 instanceof July) {
        return 7;
      }
      ;
      if (v2 instanceof August) {
        return 8;
      }
      ;
      if (v2 instanceof September) {
        return 9;
      }
      ;
      if (v2 instanceof October) {
        return 10;
      }
      ;
      if (v2 instanceof November) {
        return 11;
      }
      ;
      if (v2 instanceof December) {
        return 12;
      }
      ;
      throw new Error("Failed pattern match at Data.Date.Component (line 87, column 14 - line 99, column 19): " + [v2.constructor.name]);
    },
    Bounded0: function() {
      return boundedMonth;
    },
    Enum1: function() {
      return $lazy_enumMonth(0);
    }
  };
  var $lazy_enumMonth = /* @__PURE__ */ $runtime_lazy10("enumMonth", "Data.Date.Component", function() {
    return {
      succ: function() {
        var $67 = toEnum(boundedEnumMonth);
        var $68 = fromEnum(boundedEnumMonth);
        return function($69) {
          return $67(function(v2) {
            return v2 + 1 | 0;
          }($68($69)));
        };
      }(),
      pred: function() {
        var $70 = toEnum(boundedEnumMonth);
        var $71 = fromEnum(boundedEnumMonth);
        return function($72) {
          return $70(function(v2) {
            return v2 - 1 | 0;
          }($71($72)));
        };
      }(),
      Ord0: function() {
        return ordMonth;
      }
    };
  });

  // output/Data.Date/index.js
  var fromEnum5 = /* @__PURE__ */ fromEnum(boundedEnumMonth);
  var fromJust6 = /* @__PURE__ */ fromJust();
  var toEnum22 = /* @__PURE__ */ toEnum(boundedEnumMonth);
  var $$Date = /* @__PURE__ */ function() {
    function $$Date2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    $$Date2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new $$Date2(value0, value1, value22);
        };
      };
    };
    return $$Date2;
  }();
  var canonicalDate = function(y2) {
    return function(m2) {
      return function(d2) {
        var mkDate = function(y$prime) {
          return function(m$prime) {
            return function(d$prime) {
              return new $$Date(y$prime, fromJust6(toEnum22(m$prime)), d$prime);
            };
          };
        };
        return canonicalDateImpl(mkDate, y2, fromEnum5(m2), d2);
      };
    };
  };

  // output/Data.DateTime/index.js
  var DateTime = /* @__PURE__ */ function() {
    function DateTime2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    DateTime2.create = function(value0) {
      return function(value1) {
        return new DateTime2(value0, value1);
      };
    };
    return DateTime2;
  }();
  var time3 = function(v2) {
    return v2.value1;
  };

  // output/Data.DateTime.Instant/foreign.js
  function toDateTimeImpl(ctor) {
    return function(instant) {
      var dt2 = new Date(instant);
      return ctor(dt2.getUTCFullYear())(dt2.getUTCMonth() + 1)(dt2.getUTCDate())(dt2.getUTCHours())(dt2.getUTCMinutes())(dt2.getUTCSeconds())(dt2.getUTCMilliseconds());
    };
  }

  // output/Data.DateTime.Instant/index.js
  var fromJust7 = /* @__PURE__ */ fromJust();
  var toEnum3 = /* @__PURE__ */ toEnum(boundedEnumMonth);
  var toDateTime = /* @__PURE__ */ function() {
    var mkDateTime = function(y2) {
      return function(mo) {
        return function(d2) {
          return function(h7) {
            return function(mi) {
              return function(s2) {
                return function(ms) {
                  return new DateTime(canonicalDate(y2)(fromJust7(toEnum3(mo)))(d2), new Time(h7, mi, s2, ms));
                };
              };
            };
          };
        };
      };
    };
    return toDateTimeImpl(mkDateTime);
  }();

  // output/Effect.Now/index.js
  var map50 = /* @__PURE__ */ map(functorEffect);
  var nowTime = /* @__PURE__ */ map50(function($2) {
    return time3(toDateTime($2));
  })(now2);

  // output/Component.Chat/index.js
  var show21 = /* @__PURE__ */ show(showInt);
  var power2 = /* @__PURE__ */ power(monoidString);
  var intercalate8 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map51 = /* @__PURE__ */ map(functorArray);
  var show111 = /* @__PURE__ */ show(showBoolean);
  var bind26 = /* @__PURE__ */ bind(bindHalogenM);
  var discard18 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var $$void12 = /* @__PURE__ */ $$void(functorHalogenM);
  var map122 = /* @__PURE__ */ map(functorEmitter);
  var traverse_9 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var appendModifying3 = /* @__PURE__ */ appendModifying(monadStateHalogenM)(semigroupArray);
  var pure25 = /* @__PURE__ */ pure(applicativeHalogenM);
  var Initialise5 = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var NewMessage = /* @__PURE__ */ function() {
    function NewMessage2(value0) {
      this.value0 = value0;
    }
    ;
    NewMessage2.create = function(value0) {
      return new NewMessage2(value0);
    };
    return NewMessage2;
  }();
  var OnScroll = /* @__PURE__ */ function() {
    function OnScroll2(value0) {
      this.value0 = value0;
    }
    ;
    OnScroll2.create = function(value0) {
      return new OnScroll2(value0);
    };
    return OnScroll2;
  }();
  var _messages = /* @__PURE__ */ function() {
    return prop({
      reflectSymbol: function() {
        return "messages";
      }
    })()()($$Proxy.value);
  }();
  var _messages1 = /* @__PURE__ */ _messages(strongFn);
  var component8 = function(dictMonadAsk) {
    var asks2 = asks(monadAskHalogenM(dictMonadAsk));
    return function(dictMonadAff) {
      var liftEffect11 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
      var showTime2 = function(time4) {
        var pad2 = function(dictBoundedEnum) {
          var fromEnum6 = fromEnum(dictBoundedEnum);
          return function(n) {
            var s2 = show21(fromEnum6(n));
            return power2("0")(2 - length8(s2) | 0) + s2;
          };
        };
        return intercalate8(":")([pad2(boundedEnumHour)(hour(time4)), pad2(boundedEnumMinute)(minute(time4)), pad2(boundedEnumSecond)(second2(time4))]);
      };
      var renderMessage = function(v2) {
        return tr_([td([class_("timestamp")])([text5(showTime2(v2.timestamp))]), td([attr3(chatUsername)(v2.message.user), class_("username")])([div_([text5(v2.message.user)])]), td([class_("message")])([fromPlainHTML(v2.message.message)])]);
      };
      var render = function(state3) {
        return div3([id2("chat-component"), ref2("chat-component"), onScroll(OnScroll.create)])([table_(map51(renderMessage)(state3.messages)), div3([id2("anchor")])([text5(show111(state3.scrollToBottom))])]);
      };
      var initialState = function(v2) {
        return {
          messages: [],
          scrollToBottom: true
        };
      };
      var handleAction = function(v2) {
        if (v2 instanceof Initialise5) {
          return bind26(asks2(function(v1) {
            return v1.chatServer.emitter;
          }))(function(messageEmitter) {
            return discard18($$void12(subscribe2(map122(NewMessage.create)(messageEmitter))))(function() {
              return bind26(getHTMLElementRef("chat-component"))(traverse_9(function(element4) {
                return liftEffect11(setScrollTop(0.1)(toElement(element4)));
              }));
            });
          });
        }
        ;
        if (v2 instanceof NewMessage) {
          return bind26(liftEffect11(nowTime))(function(timestamp) {
            return appendModifying3(_messages1)([{
              timestamp,
              message: v2.value0
            }]);
          });
        }
        ;
        if (v2 instanceof OnScroll) {
          return pure25(unit);
        }
        ;
        throw new Error("Failed pattern match at Component.Chat (line 108, column 18 - line 127, column 16): " + [v2.constructor.name]);
      };
      var $$eval2 = mkEval({
        handleQuery: function(v2) {
          return pure25(Nothing.value);
        },
        handleAction,
        initialize: new Just(Initialise5.value),
        finalize: Nothing.value,
        receive: function(v2) {
          return Nothing.value;
        }
      });
      return mkComponent({
        "eval": $$eval2,
        initialState,
        render
      });
    };
  };

  // output/Game.Level.Completion/index.js
  var eqMaybe2 = /* @__PURE__ */ eqMaybe(eqPort);
  var eq44 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMap(eqCardinalDirection)(eqSignal));
  var for_7 = /* @__PURE__ */ for_(applicativeEither)(foldableArray);
  var when7 = /* @__PURE__ */ when(applicativeEither);
  var notEq8 = /* @__PURE__ */ notEq(eqMaybe2);
  var throwError2 = /* @__PURE__ */ throwError(monadThrowEither);
  var unless3 = /* @__PURE__ */ unless(applicativeEither);
  var lmap3 = /* @__PURE__ */ lmap(bifunctorEither);
  var bind27 = /* @__PURE__ */ bind(bindEither);
  var discard19 = /* @__PURE__ */ discard(discardUnit)(bindEither);
  var NotStarted = /* @__PURE__ */ function() {
    function NotStarted2() {
    }
    ;
    NotStarted2.value = new NotStarted2();
    return NotStarted2;
  }();
  var FailedRestriction = /* @__PURE__ */ function() {
    function FailedRestriction2(value0) {
      this.value0 = value0;
    }
    ;
    FailedRestriction2.create = function(value0) {
      return new FailedRestriction2(value0);
    };
    return FailedRestriction2;
  }();
  var NotEvaluable = /* @__PURE__ */ function() {
    function NotEvaluable2(value0) {
      this.value0 = value0;
    }
    ;
    NotEvaluable2.create = function(value0) {
      return new NotEvaluable2(value0);
    };
    return NotEvaluable2;
  }();
  var PortMismatch = /* @__PURE__ */ function() {
    function PortMismatch2(value0) {
      this.value0 = value0;
    }
    ;
    PortMismatch2.create = function(value0) {
      return new PortMismatch2(value0);
    };
    return PortMismatch2;
  }();
  var ReadyForTesting = /* @__PURE__ */ function() {
    function ReadyForTesting2() {
    }
    ;
    ReadyForTesting2.value = new ReadyForTesting2();
    return ReadyForTesting2;
  }();
  var FailedTestCase = /* @__PURE__ */ function() {
    function FailedTestCase2(value0) {
      this.value0 = value0;
    }
    ;
    FailedTestCase2.create = function(value0) {
      return new FailedTestCase2(value0);
    };
    return FailedTestCase2;
  }();
  var Completed2 = /* @__PURE__ */ function() {
    function Completed3() {
    }
    ;
    Completed3.value = new Completed3();
    return Completed3;
  }();
  var runSingleTest = function(dictMonad) {
    var bind118 = bind(dictMonad.Bind1());
    var pure34 = pure(dictMonad.Applicative0());
    return function(piece) {
      return function(inputs) {
        return function(testEval) {
          var expected = $$eval(piece)(inputs);
          return bind118(testEval(inputs))(function(recieved) {
            var $45 = eq44(expected)(recieved);
            if ($45) {
              return pure34(new Right(unit));
            }
            ;
            return pure34(new Left({
              inputs,
              expected,
              recieved
            }));
          });
        };
      };
    };
  };
  var checkPortMismatch = function(problem) {
    return function(evaluable) {
      return for_7(allDirections)(function(dir2) {
        var expected = getPort(problem.goal)(dir2);
        var received = getPort(evaluable)(dir2);
        return when7(notEq8(expected)(received))(throwError2({
          dir: dir2,
          expected,
          received
        }));
      });
    };
  };
  var checkOtherRestrictions = function(problem) {
    return function(board) {
      return for_7(problem.otherRestrictions)(function(r2) {
        return unless3(r2.restriction(board))(throwError2({
          name: r2.name,
          description: r2.description
        }));
      });
    };
  };
  var checkEvaluable = function(board) {
    return lmap3(NotEvaluable.create)(toEvaluableBoard(board));
  };
  var isReadyForTesting = function(problem) {
    return function(board) {
      return fromLeft(ReadyForTesting.value)(bind27(checkEvaluable(board))(function(evaluable) {
        return discard19(lmap3(PortMismatch.create)(checkPortMismatch(problem)(evaluableBoardPiece(evaluable))))(function() {
          return lmap3(FailedRestriction.create)(checkOtherRestrictions(problem)(board));
        });
      }));
    };
  };

  // output/Halogen.HTML.Extras/index.js
  var bimap5 = /* @__PURE__ */ bimap(bifunctorHTML);
  var map52 = /* @__PURE__ */ map(functorComponentSlot);
  var mapActionOverHTML = function(f) {
    return bimap5(map52(f))(f);
  };

  // output/Component.Sidebar/index.js
  var member5 = /* @__PURE__ */ member(ordPieceId);
  var map53 = /* @__PURE__ */ map(functorList);
  var eq21 = /* @__PURE__ */ eq(eqPortType);
  var show24 = /* @__PURE__ */ show(showInt);
  var show112 = /* @__PURE__ */ show(showBoardError);
  var show25 = /* @__PURE__ */ show(showCardinalDirection);
  var show33 = /* @__PURE__ */ show(showPieceId);
  var map123 = /* @__PURE__ */ map(functorArray);
  var nub3 = /* @__PURE__ */ nub(ordPiece);
  var discard20 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var pure26 = /* @__PURE__ */ pure(applicativeHalogenM);
  var modify_7 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var SetCompletionStatus = /* @__PURE__ */ function() {
    function SetCompletionStatus2(value0) {
      this.value0 = value0;
    }
    ;
    SetCompletionStatus2.create = function(value0) {
      return new SetCompletionStatus2(value0);
    };
    return SetCompletionStatus2;
  }();
  var SetBoardSize = /* @__PURE__ */ function() {
    function SetBoardSize2(value0) {
      this.value0 = value0;
    }
    ;
    SetBoardSize2.create = function(value0) {
      return new SetBoardSize2(value0);
    };
    return SetBoardSize2;
  }();
  var PieceDropped = /* @__PURE__ */ function() {
    function PieceDropped2(value0) {
      this.value0 = value0;
    }
    ;
    PieceDropped2.create = function(value0) {
      return new PieceDropped2(value0);
    };
    return PieceDropped2;
  }();
  var PieceAdded = /* @__PURE__ */ function() {
    function PieceAdded2(value0) {
      this.value0 = value0;
    }
    ;
    PieceAdded2.create = function(value0) {
      return new PieceAdded2(value0);
    };
    return PieceAdded2;
  }();
  var BoardSizeIncremented = /* @__PURE__ */ function() {
    function BoardSizeIncremented2() {
    }
    ;
    BoardSizeIncremented2.value = new BoardSizeIncremented2();
    return BoardSizeIncremented2;
  }();
  var BoardSizeDecremented = /* @__PURE__ */ function() {
    function BoardSizeDecremented2() {
    }
    ;
    BoardSizeDecremented2.value = new BoardSizeDecremented2();
    return BoardSizeDecremented2;
  }();
  var TestsTriggered = /* @__PURE__ */ function() {
    function TestsTriggered2() {
    }
    ;
    TestsTriggered2.value = new TestsTriggered2();
    return TestsTriggered2;
  }();
  var PieceOnDrop = /* @__PURE__ */ function() {
    function PieceOnDrop2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    PieceOnDrop2.create = function(value0) {
      return function(value1) {
        return new PieceOnDrop2(value0, value1);
      };
    };
    return PieceOnDrop2;
  }();
  var PieceOnClick = /* @__PURE__ */ function() {
    function PieceOnClick2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    PieceOnClick2.create = function(value0) {
      return function(value1) {
        return new PieceOnClick2(value0, value1);
      };
    };
    return PieceOnClick2;
  }();
  var BackToLevelSelect = /* @__PURE__ */ function() {
    function BackToLevelSelect2() {
    }
    ;
    BackToLevelSelect2.value = new BackToLevelSelect2();
    return BackToLevelSelect2;
  }();
  var IncrementBoardSize2 = /* @__PURE__ */ function() {
    function IncrementBoardSize3() {
    }
    ;
    IncrementBoardSize3.value = new IncrementBoardSize3();
    return IncrementBoardSize3;
  }();
  var DecrementBoardSize2 = /* @__PURE__ */ function() {
    function DecrementBoardSize3() {
    }
    ;
    DecrementBoardSize3.value = new DecrementBoardSize3();
    return DecrementBoardSize3;
  }();
  var RunTestsClicked = /* @__PURE__ */ function() {
    function RunTestsClicked2() {
    }
    ;
    RunTestsClicked2.value = new RunTestsClicked2();
    return RunTestsClicked2;
  }();
  var DoNothing = /* @__PURE__ */ function() {
    function DoNothing2() {
    }
    ;
    DoNothing2.value = new DoNothing2();
    return DoNothing2;
  }();
  var renderDescription = /* @__PURE__ */ function() {
    var reduceStrings = function(v2) {
      if (v2 instanceof Cons && (v2.value0 instanceof Right && (v2.value1 instanceof Cons && v2.value1.value0 instanceof Right))) {
        return reduceStrings(new Cons(new Right(v2.value0.value0 + (" " + v2.value1.value0.value0)), v2.value1.value1));
      }
      ;
      if (v2 instanceof Cons && (v2.value0 instanceof Left && (v2.value1 instanceof Cons && v2.value1.value0 instanceof Right))) {
        return new Cons(new Left(v2.value0.value0), reduceStrings(new Cons(new Right(" " + v2.value1.value0.value0), v2.value1.value1)));
      }
      ;
      if (v2 instanceof Cons && (v2.value0 instanceof Right && (v2.value1 instanceof Cons && v2.value1.value0 instanceof Left))) {
        return new Cons(new Right(v2.value0.value0 + " "), new Cons(new Left(v2.value1.value0.value0), reduceStrings(v2.value1.value1)));
      }
      ;
      if (v2 instanceof Cons) {
        return new Cons(v2.value0, reduceStrings(v2.value1));
      }
      ;
      if (v2 instanceof Nil) {
        return Nil.value;
      }
      ;
      throw new Error("Failed pattern match at Component.Sidebar (line 194, column 5 - line 194, column 80): " + [v2.constructor.name]);
    };
    var filterPieceNames = eitherBool(function(s2) {
      return !member5(s2)(pieceVault);
    });
    var asHTML = function(v2) {
      if (v2 instanceof Left) {
        return span4([class_("piece-name")])([text5(v2.value0)]);
      }
      ;
      if (v2 instanceof Right) {
        return text5(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Component.Sidebar (line 201, column 5 - line 201, column 47): " + [v2.constructor.name]);
    };
    var $90 = fromFoldable(foldableList);
    var $91 = map53(asHTML);
    var $92 = map53(filterPieceNames);
    var $93 = fromFoldable2(foldableArray);
    var $94 = split(" ");
    return function($95) {
      return div_($90($91(reduceStrings($92($93($94($95)))))));
    };
  }();
  var renderCompletionStatus = /* @__PURE__ */ function() {
    var renderMaybePort = function(v2) {
      if (v2 instanceof Nothing) {
        return "no port";
      }
      ;
      if (v2 instanceof Just) {
        return "an " + function() {
          var $64 = eq21(v2.value0.portType)(Input.value);
          if ($64) {
            return "input";
          }
          ;
          return "output" + (" of capacity " + show24(toInt(v2.value0.capacity)));
        }();
      }
      ;
      throw new Error("Failed pattern match at Component.Sidebar (line 245, column 23 - line 248, column 114): " + [v2.constructor.name]);
    };
    var renderFailedTestCase = function(v2) {
      return text5("failed test case, render later");
    };
    return function(v2) {
      if (v2 instanceof NotStarted) {
        return div_([]);
      }
      ;
      if (v2 instanceof FailedRestriction) {
        return span_([text5("This level has a special restriction: "), b_([text5(v2.value0.name)]), br_, text5(v2.value0.description)]);
      }
      ;
      if (v2 instanceof NotEvaluable) {
        return text5("not evaluable due to: " + show112(v2.value0));
      }
      ;
      if (v2 instanceof PortMismatch) {
        return div_([b_([text5("Port mismatch:")]), text5("Expected " + (renderMaybePort(v2.value0.expected) + (" on the " + (show25(v2.value0.dir) + (", but found " + renderMaybePort(v2.value0.received))))))]);
      }
      ;
      if (v2 instanceof ReadyForTesting) {
        return span_([text5("Ready for testing: "), button([onClick(function(v1) {
          return RunTestsClicked.value;
        })])([text5("Run Tests")])]);
      }
      ;
      if (v2 instanceof FailedTestCase) {
        return renderFailedTestCase(v2.value0);
      }
      ;
      if (v2 instanceof Completed2) {
        return div_([text5("Level Complete!"), button([onClick(function(v1) {
          return RunTestsClicked.value;
        })])([text5("Run Tests again")]), button([onClick(function(v1) {
          return BackToLevelSelect.value;
        })])([text5("Back to Level Select ")])]);
      }
      ;
      throw new Error("Failed pattern match at Component.Sidebar (line 207, column 26 - line 242, column 8): " + [v2.constructor.name]);
    };
  }();
  var component9 = function(dictMonadAff) {
    var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    var log5 = log2(monadEffectHalogenM2);
    var navigateTo2 = navigateTo(monadEffectHalogenM2);
    var render = function(state3) {
      var renderAvailablePiece = function(piece) {
        var pieceId = name15(piece);
        var input3 = {
          piece,
          location: location2(0)(0),
          portStates: empty2
        };
        return div3([attr3(availablePiece)(piece), draggable2(true), classes(["available-piece"]), onDragEnd(PieceOnDrop.create(pieceId)), onClick(PieceOnClick.create(pieceId))])([mapActionOverHTML(function(v2) {
          return DoNothing.value;
        })(renderPiece(defaultState(piece))), text5(show33(pieceId))]);
      };
      return div3([id2("sidebar-component")])([h2_([text5(state3.problem.title)]), span_([renderDescription(state3.problem.description)]), br_, renderCompletionStatus(state3.completionStatus), h3_([text5("Available pieces:")]), span4([class_("pieces")])(map123(renderAvailablePiece)(nub3(state3.problem.availablePieces))), h3_([text5("Board size")]), span_([button([onClick(function(v2) {
        return DecrementBoardSize2.value;
      })])([text5("-")]), text5(show24(state3.boardSize)), button([onClick(function(v2) {
        return IncrementBoardSize2.value;
      })])([text5("+")])])]);
    };
    var initialState = function(v2) {
      return {
        problem: v2.problem,
        completionStatus: NotStarted.value,
        boardSize: v2.boardSize
      };
    };
    var $$eval2 = mkEval({
      finalize: Nothing.value,
      handleAction: function(v2) {
        if (v2 instanceof PieceOnDrop) {
          return discard20(log5("piece dropped!"))(function() {
            return raise(new PieceDropped(v2.value0));
          });
        }
        ;
        if (v2 instanceof PieceOnClick) {
          return raise(new PieceAdded(v2.value0));
        }
        ;
        if (v2 instanceof BackToLevelSelect) {
          return navigateTo2(LevelSelect.value);
        }
        ;
        if (v2 instanceof IncrementBoardSize2) {
          return raise(BoardSizeIncremented.value);
        }
        ;
        if (v2 instanceof DecrementBoardSize2) {
          return raise(BoardSizeDecremented.value);
        }
        ;
        if (v2 instanceof RunTestsClicked) {
          return raise(TestsTriggered.value);
        }
        ;
        if (v2 instanceof DoNothing) {
          return pure26(unit);
        }
        ;
        throw new Error("Failed pattern match at Component.Sidebar (line 142, column 21 - line 153, column 31): " + [v2.constructor.name]);
      },
      handleQuery: function(v2) {
        if (v2 instanceof SetCompletionStatus) {
          return discard20(modify_7(function(v1) {
            var $82 = {};
            for (var $83 in v1) {
              if ({}.hasOwnProperty.call(v1, $83)) {
                $82[$83] = v1[$83];
              }
              ;
            }
            ;
            $82.completionStatus = v2.value0;
            return $82;
          }))(function() {
            return pure26(Nothing.value);
          });
        }
        ;
        if (v2 instanceof SetBoardSize) {
          return discard20(modify_7(function(v1) {
            var $86 = {};
            for (var $87 in v1) {
              if ({}.hasOwnProperty.call(v1, $87)) {
                $86[$87] = v1[$87];
              }
              ;
            }
            ;
            $86.boardSize = v2.value0;
            return $86;
          }))(function() {
            return pure26(Nothing.value);
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Sidebar (line 154, column 20 - line 165, column 23): " + [v2.constructor.name]);
      },
      initialize: Nothing.value,
      receive: $$const(Nothing.value)
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Game.Message/index.js
  var append20 = /* @__PURE__ */ append(semigroupSeconds);
  var intercalate9 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map54 = /* @__PURE__ */ map(functorArray);
  var unwrap13 = /* @__PURE__ */ unwrap();
  var _Newtype4 = /* @__PURE__ */ _Newtype()();
  var prop8 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "selector";
    }
  })()();
  var prop24 = /* @__PURE__ */ prop({
    reflectSymbol: function() {
      return "delayBy";
    }
  })()();
  var timeToRead = function(str2) {
    return append20(1.5)(toNumber(length8(str2)) * 0.065);
  };
  var showPlainHTML = /* @__PURE__ */ function() {
    var showVDom = function(v2) {
      if (v2 instanceof Text) {
        return v2.value0;
      }
      ;
      if (v2 instanceof Elem) {
        return intercalate9(" ")(map54(showVDom)(v2.value3));
      }
      ;
      if (v2 instanceof Keyed) {
        return intercalate9(" ")(map54(function($55) {
          return showVDom(snd($55));
        })(v2.value3));
      }
      ;
      if (v2 instanceof Widget) {
        return absurd(v2.value0);
      }
      ;
      if (v2 instanceof Grafted) {
        return showVDom(runGraft(v2.value0));
      }
      ;
      throw new Error("Failed pattern match at Game.Message (line 47, column 16 - line 52, column 53): " + [v2.constructor.name]);
    };
    return function($56) {
      return showVDom(unwrap13($56));
    };
  }();
  var red = function(text7) {
    return span4([class_("red")])([text5(text7)]);
  };
  var htmlMessage = function(user) {
    return function(message1) {
      return {
        user,
        message: message1,
        selector: Nothing.value,
        delayBy: Nothing.value
      };
    };
  };
  var message2 = function(user) {
    return function(text7) {
      return htmlMessage(user)(text5(text7));
    };
  };
  var green = function(text7) {
    return span4([class_("green")])([text5(text7)]);
  };
  var fromGuide = /* @__PURE__ */ message2("guide");
  var _selector = function(dictStrong) {
    var $57 = _Newtype4(dictStrong.Profunctor0());
    var $58 = prop8($$Proxy.value)(dictStrong);
    return function($59) {
      return $57($58($59));
    };
  };
  var _delayBy = function(dictStrong) {
    var $63 = _Newtype4(dictStrong.Profunctor0());
    var $64 = prop24($$Proxy.value)(dictStrong);
    return function($65) {
      return $63($64($65));
    };
  };
  var _delayBy1 = /* @__PURE__ */ _delayBy(strongFn);
  var addDelay = function(v2) {
    return set2(_delayBy1)(new Just(timeToRead(showPlainHTML(v2.message))))(v2);
  };

  // output/Component.Level/index.js
  var show26 = /* @__PURE__ */ show(showInt);
  var show113 = /* @__PURE__ */ show(showCardinalDirection);
  var show27 = /* @__PURE__ */ show(showSignal);
  var mapFlipped5 = /* @__PURE__ */ mapFlipped(functorArray);
  var toUnfoldable6 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var eq25 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMaybe(eqSignal));
  var lookup21 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var intercalate10 = /* @__PURE__ */ intercalate2(monoidString);
  var map55 = /* @__PURE__ */ map(functorArray);
  var length12 = /* @__PURE__ */ length(foldableList)(semiringInt);
  var div7 = /* @__PURE__ */ div(euclideanRingInt);
  var discard21 = /* @__PURE__ */ discard(discardUnit);
  var show34 = /* @__PURE__ */ show(/* @__PURE__ */ showMap(showCardinalDirection)(showSignal));
  var slot3 = /* @__PURE__ */ slot();
  var boardIsSymbol = {
    reflectSymbol: function() {
      return "board";
    }
  };
  var slot12 = /* @__PURE__ */ slot3(boardIsSymbol)(ordUnit);
  var slot_3 = /* @__PURE__ */ slot_()({
    reflectSymbol: function() {
      return "chat";
    }
  })(ordUnit);
  var sidebarIsSymbol = {
    reflectSymbol: function() {
      return "sidebar";
    }
  };
  var slot23 = /* @__PURE__ */ slot3(sidebarIsSymbol)(ordUnit);
  var tell5 = /* @__PURE__ */ tell2();
  var tell12 = /* @__PURE__ */ tell5(boardIsSymbol)(ordUnit);
  var bind28 = /* @__PURE__ */ bind(bindHalogenM);
  var gets6 = /* @__PURE__ */ gets(monadStateHalogenM);
  var discard110 = /* @__PURE__ */ discard21(bindHalogenM);
  var tell23 = /* @__PURE__ */ tell5(sidebarIsSymbol)(ordUnit);
  var saveLevelProgress2 = /* @__PURE__ */ saveLevelProgress(monadEffectEffect);
  var _size4 = /* @__PURE__ */ _size(strongForget);
  var request2 = /* @__PURE__ */ request()(boardIsSymbol)(ordUnit);
  var for_8 = /* @__PURE__ */ for_(applicativeHalogenM)(foldableMaybe);
  var traverse_10 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var $$void13 = /* @__PURE__ */ $$void(functorHalogenM);
  var map124 = /* @__PURE__ */ map(functorHalogenM);
  var fromFoldable15 = /* @__PURE__ */ fromFoldable2(foldableArray);
  var when8 = /* @__PURE__ */ when(applicativeHalogenM);
  var pure27 = /* @__PURE__ */ pure(applicativeHalogenM);
  var Initialise6 = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var LevelComplete = /* @__PURE__ */ function() {
    function LevelComplete2() {
    }
    ;
    LevelComplete2.value = new LevelComplete2();
    return LevelComplete2;
  }();
  var BoardOutput = /* @__PURE__ */ function() {
    function BoardOutput2(value0) {
      this.value0 = value0;
    }
    ;
    BoardOutput2.create = function(value0) {
      return new BoardOutput2(value0);
    };
    return BoardOutput2;
  }();
  var SidebarOutput = /* @__PURE__ */ function() {
    function SidebarOutput2(value0) {
      this.value0 = value0;
    }
    ;
    SidebarOutput2.create = function(value0) {
      return new SidebarOutput2(value0);
    };
    return SidebarOutput2;
  }();
  var renderTestSuccess = function(i2) {
    return function(n) {
      return span_([green(show26(i2) + ("/" + show26(n))), text5(" Sucessful")]);
    };
  };
  var renderTestError = function(v2) {
    return function(i2) {
      return function(n) {
        var showTuple2 = function(v1) {
          return show113(v1.value0) + (": " + show27(v1.value1));
        };
        var printReceivedOutputs = span_(intersperse(text5(", "))(mapFlipped5(toUnfoldable6(v2.recieved))(function(tuple) {
          var $109 = eq25(lookup21(fst(tuple))(v2.expected))(new Just(snd(tuple)));
          if ($109) {
            return green(showTuple2(tuple));
          }
          ;
          return red(showTuple2(tuple));
        })));
        var printPorts = function(m2) {
          return text5(intercalate10(", ")(map55(showTuple2)(toUnfoldable6(m2))));
        };
        return div_([div_([red(show26(i2) + ("/" + show26(n))), text5(" Failed:")]), div_([text5("  - inputs: "), printPorts(v2.inputs)]), div_([text5("  - expected outputs: "), printPorts(v2.expected)]), div_([text5("  - recieved outputs: "), printReceivedOutputs])]);
      };
    };
  };
  var runAllTests = function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var Monad0 = MonadEffect0.Monad0();
    var pure114 = pure(Monad0.Applicative0());
    var Bind1 = Monad0.Bind1();
    var discard27 = discard21(Bind1);
    var log5 = log2(MonadEffect0);
    var bind118 = bind(Bind1);
    var runSingleTest2 = runSingleTest(Monad0);
    var liftAff3 = liftAff(dictMonadAff);
    return function(dictMonadAsk) {
      var sendMessage2 = sendMessage(dictMonadAsk)(MonadEffect0);
      return function(piece) {
        return function(inputs) {
          return function(testEval) {
            var n = length12(inputs);
            var delayDuration = toNumber(div7(2e3)(length12(inputs)));
            var runTestsAcc = function(i2) {
              return function(v2) {
                if (v2 instanceof Nil) {
                  return pure114(new Right(unit));
                }
                ;
                if (v2 instanceof Cons) {
                  return discard27(log5(show34(v2.value0)))(function() {
                    return bind118(runSingleTest2(piece)(v2.value0)(testEval))(function(result) {
                      return discard27(liftAff3(delay(delayDuration)))(function() {
                        if (result instanceof Left) {
                          return discard27(sendMessage2(htmlMessage("/test")(renderTestError(result.value0)(i2)(n))))(function() {
                            return pure114(new Left(result.value0));
                          });
                        }
                        ;
                        if (result instanceof Right) {
                          return discard27(sendMessage2(htmlMessage("/test")(renderTestSuccess(i2)(n))))(function() {
                            return runTestsAcc(i2 + 1 | 0)(v2.value1);
                          });
                        }
                        ;
                        throw new Error("Failed pattern match at Component.Level (line 173, column 9 - line 179, column 35): " + [result.constructor.name]);
                      });
                    });
                  });
                }
                ;
                throw new Error("Failed pattern match at Component.Level (line 166, column 21 - line 179, column 35): " + [v2.constructor.name]);
              };
            };
            return runTestsAcc(1)(inputs);
          };
        };
      };
    };
  };
  var _sidebar = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _chat = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _board4 = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component10 = function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var component1 = component9(dictMonadAff);
    var monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    var liftEffect11 = liftEffect(monadEffectHalogenM2);
    var runAllTests1 = runAllTests(monadAffHalogenM(dictMonadAff));
    return function(dictMonadAsk) {
      var component22 = component8(dictMonadAsk)(dictMonadAff);
      var monadAskHalogenM2 = monadAskHalogenM(dictMonadAsk);
      var putQueuedMessages2 = putQueuedMessages(monadAskHalogenM2)(monadEffectHalogenM2);
      var sendMessage2 = sendMessage(monadAskHalogenM2)(monadEffectHalogenM2);
      var runAllTests2 = runAllTests1(monadAskHalogenM2);
      return function(dictMonadStore) {
        var component32 = component7(dictMonadStore)(MonadEffect0);
        var render = function(v2) {
          return div3([id2("puzzle-component")])([slot12(_board4)(unit)(component32)(Nothing.value)(BoardOutput.create), slot_3(_chat)(unit)(component22)(unit), slot23(_sidebar)(unit)(component1)({
            problem: v2.level.problem,
            boardSize: 3
          })(SidebarOutput.create)]);
        };
        var addPieceToComponent = function(pieceId) {
          return function(loc) {
            return tell12(_board4)(unit)(function(v2) {
              return new AddPiece(loc, pieceLookup(pieceId));
            });
          };
        };
        var handleAction = function(v2) {
          if (v2 instanceof Initialise6) {
            return bind28(gets6(function(v1) {
              return v1.level.conversation;
            }))(function(initialConversation) {
              return discard110(putQueuedMessages2(initialConversation))(function() {
                return bind28(gets6(function(v1) {
                  return v1.level.problem.goal;
                }))(function(v1) {
                  return tell12(_board4)(unit)(function(v22) {
                    return new SetGoalPorts(v1.ports);
                  });
                });
              });
            });
          }
          ;
          if (v2 instanceof LevelComplete) {
            return discard110(tell23(_sidebar)(unit)(function(v1) {
              return new SetCompletionStatus(Completed2.value);
            }))(function() {
              return bind28(gets6(function(v1) {
                return v1.levelId;
              }))(function(levelId) {
                return liftEffect11(saveLevelProgress2(levelId)(Completed.value));
              });
            });
          }
          ;
          if (v2 instanceof BoardOutput) {
            return discard110(tell23(_sidebar)(unit)(function(v1) {
              return new SetBoardSize(viewOn(v2.value0.value0)(_size4));
            }))(function() {
              return bind28(gets6(function(v1) {
                return v1.level.problem;
              }))(function(problem) {
                var status = isReadyForTesting(problem)(v2.value0.value0);
                return tell23(_sidebar)(unit)(function(v1) {
                  return new SetCompletionStatus(status);
                });
              });
            });
          }
          ;
          if (v2 instanceof SidebarOutput && v2.value0 instanceof PieceDropped) {
            return bind28(request2(_board4)(unit)(GetMouseOverLocation.create))(function(maybeLocation) {
              return for_8(maybeLocation)(addPieceToComponent(v2.value0.value0));
            });
          }
          ;
          if (v2 instanceof SidebarOutput && v2.value0 instanceof PieceAdded) {
            return bind28(request2(_board4)(unit)(GetBoard.create))(traverse_10(function(board) {
              return for_8(firstEmptyLocation(board))(addPieceToComponent(v2.value0.value0));
            }));
          }
          ;
          if (v2 instanceof SidebarOutput && v2.value0 instanceof BoardSizeIncremented) {
            return $$void13(request2(_board4)(unit)(IncrementBoardSize.create));
          }
          ;
          if (v2 instanceof SidebarOutput && v2.value0 instanceof BoardSizeDecremented) {
            return $$void13(request2(_board4)(unit)(DecrementBoardSize.create));
          }
          ;
          if (v2 instanceof SidebarOutput && v2.value0 instanceof TestsTriggered) {
            return discard110(sendMessage2(htmlMessage("/test")(b_([text5("Verifying board: running tests...")]))))(function() {
              var eval1 = function(inputs) {
                return map124(fromMaybe(empty2))(request2(_board4)(unit)(SetInputs.create(inputs)));
              };
              return bind28(gets6(function(v1) {
                return v1.level.problem;
              }))(function(problem) {
                return bind28(runAllTests2(problem.goal)(fromFoldable15(problem.testCases))(eval1))(function(res) {
                  return when8(isRight(res))(discard110(sendMessage2(htmlMessage("/test")(b_([text5("Tests completed successfully!")]))))(function() {
                    return handleAction(LevelComplete.value);
                  }));
                });
              });
            });
          }
          ;
          throw new Error("Failed pattern match at Component.Level (line 107, column 18 - line 151, column 35): " + [v2.constructor.name]);
        };
        var $$eval2 = mkEval({
          finalize: Nothing.value,
          handleAction,
          handleQuery: function(v2) {
            return pure27(Nothing.value);
          },
          initialize: new Just(Initialise6.value),
          receive: $$const(Nothing.value)
        });
        return mkComponent({
          "eval": $$eval2,
          initialState: identity(categoryFn),
          render
        });
      };
    };
  };

  // output/Game.Level.Problem/index.js
  var defaultProblem = {
    goal: idPiece,
    title: "default title",
    description: "default description",
    testCases: [],
    requiresAutomaticTesting: false,
    availablePieces: [],
    otherRestrictions: []
  };

  // output/Game.Level/index.js
  var bind29 = /* @__PURE__ */ bind(bindArray);
  var traverse4 = /* @__PURE__ */ traverse(traversableArray)(applicativeArray);
  var pure28 = /* @__PURE__ */ pure(applicativeArray);
  var fromFoldable16 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
  var defaultSettings = {
    enableBoardSizeChange: true
  };
  var defaultLevel = {
    problem: defaultProblem,
    boardDeltaRulesEngine: [],
    conversation: [],
    settings: defaultSettings
  };
  var binaryTestInputs = function(directions) {
    return bind29(traverse4(function(v2) {
      return [0, 1];
    })(directions))(function(inputs) {
      return pure28(fromFoldable16(zip(directions)(inputs)));
    });
  };

  // output/IO.Levels.IntermediateSuite/index.js
  var intermediateSuite = /* @__PURE__ */ function() {
    return fromHomogeneous()({
      "Criss(t) cross": {
        problem: {
          goal: crossPiece,
          title: "Cross over",
          description: "Propogate the signal on the left to the right, and the top to the bottom",
          testCases: binaryTestInputs([Left2.value, Up.value]),
          requiresAutomaticTesting: false,
          availablePieces: [idPiece, superPiece, leftPiece, rightPiece, xorPiece],
          otherRestrictions: []
        },
        boardDeltaRulesEngine: [],
        conversation: map(functorArray)(addDelay)([message2("mitch")("criss cross")]),
        settings: defaultLevel.settings
      }
    });
  }();

  // output/Game.Level.RulesEngine/index.js
  var Rule = /* @__PURE__ */ function() {
    function Rule2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Rule2.create = function(value0) {
      return function(value1) {
        return new Rule2(value0, value1);
      };
    };
    return Rule2;
  }();

  // output/IO.Levels.TutorialSuite/index.js
  var _selector2 = /* @__PURE__ */ _selector(strongFn);
  var tutorialSuite = /* @__PURE__ */ function() {
    return fromHomogeneous()({
      "From A to B": {
        problem: {
          goal: idPiece,
          title: "From A to B",
          description: "Propagate the signal inputed on the Left to the Right",
          testCases: binaryTestInputs([Left2.value]),
          requiresAutomaticTesting: false,
          availablePieces: [idPiece],
          otherRestrictions: []
        },
        boardDeltaRulesEngine: function() {
          var l3 = location2(1)(1);
          var l2 = location2(0)(1);
          var l1 = location2(2)(1);
          return [new Rule(firstTime(pieceAdded), set2(_selector2)(new Just(selector(location3)(l1)))(fromGuide("move this piece to location (2,1)"))), new Rule(firstTime(pieceMovedTo(l1)), set2(_selector2)(new Just(selector(availablePiece)(idPiece)))(fromGuide("add another piece")))];
        }(),
        conversation: mapWithIndex(functorWithIndexArray)(function(i2) {
          return function(m2) {
            var $5 = i2 === 0;
            if ($5) {
              return m2;
            }
            ;
            return addDelay(m2);
          };
        })([]),
        settings: defaultLevel.settings
      }
    });
  }();

  // output/IO.Levels.TwoBitSuite/index.js
  var twoBitSuite = /* @__PURE__ */ function() {
    return fromHomogeneous()({
      "Lovers Lake": {
        problem: {
          goal: fusePiece,
          title: "Lovers Lake",
          description: "Use a fuse-piece to combine the inputs from the top and left, output the result to the right",
          availablePieces: [fusePiece, idPiece],
          testCases: [singleton5(Left2.value)(0), singleton5(Left2.value)(1), singleton5(Left2.value)(2), singleton5(Left2.value)(3)],
          otherRestrictions: defaultProblem.otherRestrictions,
          requiresAutomaticTesting: defaultProblem.requiresAutomaticTesting
        },
        boardDeltaRulesEngine: defaultLevel.boardDeltaRulesEngine,
        conversation: defaultLevel.conversation,
        settings: defaultLevel.settings
      },
      "Two bit criss cross": {
        problem: {
          goal: twoBitCrossOver,
          title: "Two bit criss cross",
          description: "Sever the input on the left with a sever-piece, cross over the signals, fuse them back together",
          availablePieces: [severPiece, fusePiece, idPiece],
          testCases: [singleton5(Left2.value)(0), singleton5(Left2.value)(1), singleton5(Left2.value)(2), singleton5(Left2.value)(3)],
          otherRestrictions: defaultProblem.otherRestrictions,
          requiresAutomaticTesting: defaultProblem.requiresAutomaticTesting
        },
        boardDeltaRulesEngine: defaultLevel.boardDeltaRulesEngine,
        conversation: defaultLevel.conversation,
        settings: defaultLevel.settings
      },
      Increment: {
        problem: {
          goal: succPiece,
          title: "Increment",
          description: "Add one to the two bit input signal. if the input is 3 (which has no successor), output signal 0",
          availablePieces: [xorPiece, notPiece, fusePiece, severPiece],
          testCases: [singleton5(Left2.value)(0), singleton5(Left2.value)(1), singleton5(Left2.value)(2), singleton5(Left2.value)(3)],
          otherRestrictions: defaultProblem.otherRestrictions,
          requiresAutomaticTesting: defaultProblem.requiresAutomaticTesting
        },
        boardDeltaRulesEngine: defaultLevel.boardDeltaRulesEngine,
        conversation: defaultLevel.conversation,
        settings: defaultLevel.settings
      }
    });
  }();

  // output/IO.Levels/index.js
  var fromHomogeneous2 = /* @__PURE__ */ fromHomogeneous();
  var join4 = /* @__PURE__ */ join(bindArray);
  var ordRecord2 = /* @__PURE__ */ ordRecord()(/* @__PURE__ */ ordRecordCons(/* @__PURE__ */ ordRecordCons(ordRecordNil)()({
    reflectSymbol: function() {
      return "suiteName";
    }
  })(ordString))()({
    reflectSymbol: function() {
      return "levelName";
    }
  })(ordString));
  var fromFoldable17 = /* @__PURE__ */ fromFoldable3(ordRecord2)(foldableArray);
  var catMaybes5 = /* @__PURE__ */ catMaybes(ordRecord2);
  var toUnfoldable7 = /* @__PURE__ */ toUnfoldable4(unfoldableArray);
  var identitySuite = /* @__PURE__ */ fromHomogeneous2({});
  var allLevels = /* @__PURE__ */ fromHomogeneous2({
    "Tutorial Suite": tutorialSuite,
    "Identity Suite": identitySuite,
    "Intermediate Suite": intermediateSuite,
    "Two Bit Suite": twoBitSuite
  });
  var getAllLevelProgress = function(dictMonadEffect) {
    var Monad0 = dictMonadEffect.Monad0();
    var map60 = map(Monad0.Bind1().Apply0().Functor0());
    var $$for3 = $$for(Monad0.Applicative0())(traversableArray);
    var getLevelProgress2 = getLevelProgress(dictMonadEffect);
    return map60(function($37) {
      return catMaybes5(fromFoldable17(join4($37)));
    })($$for3(toUnfoldable7(allLevels))(function(v2) {
      return $$for3(toUnfoldable7(v2.value1))(function(v1) {
        return map60(Tuple.create({
          suiteName: v2.value0,
          levelName: v1.value0
        }))(getLevelProgress2({
          suiteName: v2.value0,
          levelName: v1.value0
        }));
      });
    }));
  };

  // output/Component.LevelSelect/index.js
  var suiteNameIsSymbol = {
    reflectSymbol: function() {
      return "suiteName";
    }
  };
  var levelNameIsSymbol = {
    reflectSymbol: function() {
      return "levelName";
    }
  };
  var lookup23 = /* @__PURE__ */ lookup(/* @__PURE__ */ ordRecord()(/* @__PURE__ */ ordRecordCons(/* @__PURE__ */ ordRecordCons(ordRecordNil)()(suiteNameIsSymbol)(ordString))()(levelNameIsSymbol)(ordString)));
  var bind30 = /* @__PURE__ */ bind(bindArray);
  var toUnfoldable8 = /* @__PURE__ */ toUnfoldable4(unfoldableArray);
  var bind113 = /* @__PURE__ */ bind(bindHalogenM);
  var getAllLevelProgress2 = /* @__PURE__ */ getAllLevelProgress(monadEffectEffect);
  var discard22 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var show28 = /* @__PURE__ */ show(/* @__PURE__ */ showMap(/* @__PURE__ */ showRecord()()(/* @__PURE__ */ showRecordFieldsCons(levelNameIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(suiteNameIsSymbol)(showString))(showString)))(showLevelProgress));
  var modify_8 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var Initialise7 = /* @__PURE__ */ function() {
    function Initialise8() {
    }
    ;
    Initialise8.value = new Initialise8();
    return Initialise8;
  }();
  var NavigateTo2 = /* @__PURE__ */ function() {
    function NavigateTo3(value0) {
      this.value0 = value0;
    }
    ;
    NavigateTo3.create = function(value0) {
      return new NavigateTo3(value0);
    };
    return NavigateTo3;
  }();
  var component11 = function(dictMonadAff) {
    var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    var liftEffect11 = liftEffect(monadEffectHalogenM2);
    var log5 = log2(monadEffectHalogenM2);
    var saveLevelProgress3 = saveLevelProgress(monadEffectHalogenM2);
    var navigateTo2 = navigateTo(monadEffectHalogenM2);
    var render = function(state3) {
      var renderPuzzle = function(suiteName) {
        return function(levelName) {
          return a([onClick(function(v2) {
            return new NavigateTo2({
              suiteName,
              levelName
            });
          })])([text5(levelName), function() {
            var v2 = lookup23({
              suiteName,
              levelName
            })(state3.levelProgress);
            if (v2 instanceof Just && v2.value0 instanceof Completed) {
              return span4([attr3(progress2)(Completed.value)])([text5("  \u2714")]);
            }
            ;
            if (v2 instanceof Just && v2.value0 instanceof Incomplete) {
              return span4([attr3(progress2)(Incomplete.value)])([text5(" \u2736")]);
            }
            ;
            if (v2 instanceof Nothing) {
              return text5("");
            }
            ;
            throw new Error("Failed pattern match at Component.LevelSelect (line 60, column 11 - line 63, column 34): " + [v2.constructor.name]);
          }()]);
        };
      };
      return defaultLayout(div3([id2("puzzle-select-component")])([h1_([text5("Level Select")]), div_(bind30(toUnfoldable8(allLevels))(function(v2) {
        return [h2_([text5(v2.value0)]), ul_(bind30(toUnfoldable8(v2.value1))(function(v1) {
          return [li_([renderPuzzle(v2.value0)(v1.value0)])];
        }))];
      }))]));
    };
    var initialState = function(v2) {
      return {
        levelProgress: empty2
      };
    };
    var $$eval2 = mkEval({
      handleAction: function(v1) {
        if (v1 instanceof Initialise7) {
          return bind113(liftEffect11(getAllLevelProgress2))(function(progress3) {
            return discard22(log5(show28(progress3)))(function() {
              return modify_8(function(v2) {
                var $56 = {};
                for (var $57 in v2) {
                  if ({}.hasOwnProperty.call(v2, $57)) {
                    $56[$57] = v2[$57];
                  }
                  ;
                }
                ;
                $56.levelProgress = progress3;
                return $56;
              });
            });
          });
        }
        ;
        if (v1 instanceof NavigateTo2) {
          return discard22(saveLevelProgress3(v1.value0)(Incomplete.value))(function() {
            return navigateTo2(new Level(v1.value0.suiteName, v1.value0.levelName));
          });
        }
        ;
        throw new Error("Failed pattern match at Component.LevelSelect (line 68, column 22 - line 75, column 65): " + [v1.constructor.name]);
      },
      handleQuery: defaultEval.handleQuery,
      receive: defaultEval.receive,
      initialize: new Just(Initialise7.value),
      finalize: defaultEval.finalize
    });
    return mkComponent({
      "eval": $$eval2,
      initialState,
      render
    });
  };

  // output/Component.Routes/index.js
  var slot_4 = /* @__PURE__ */ slot_();
  var slot_1 = /* @__PURE__ */ slot_4({
    reflectSymbol: function() {
      return "home";
    }
  })(ordUnit);
  var slot_22 = /* @__PURE__ */ slot_4({
    reflectSymbol: function() {
      return "about";
    }
  })(ordUnit);
  var slot_32 = /* @__PURE__ */ slot_4({
    reflectSymbol: function() {
      return "instructions";
    }
  })(ordUnit);
  var slot_42 = /* @__PURE__ */ slot_4({
    reflectSymbol: function() {
      return "levelSelect";
    }
  })(ordUnit);
  var bind31 = /* @__PURE__ */ bind(bindMaybe);
  var pure29 = /* @__PURE__ */ pure(applicativeMaybe);
  var slot_5 = /* @__PURE__ */ slot_4({
    reflectSymbol: function() {
      return "level";
    }
  })(ordUnit);
  var pure111 = /* @__PURE__ */ pure(applicativeHalogenM);
  var bind114 = /* @__PURE__ */ bind(bindHalogenM);
  var get4 = /* @__PURE__ */ get(monadStateHalogenM);
  var discard23 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var when9 = /* @__PURE__ */ when(applicativeHalogenM);
  var notEq9 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqRoute));
  var modify_9 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var Navigate = /* @__PURE__ */ function() {
    function Navigate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Navigate2.create = function(value0) {
      return function(value1) {
        return new Navigate2(value0, value1);
      };
    };
    return Navigate2;
  }();
  var component12 = function(dictMonadAff) {
    var component1 = component3(dictMonadAff);
    var component22 = component2(dictMonadAff);
    var component32 = component4(dictMonadAff);
    var component42 = component11(dictMonadAff);
    var component52 = component10(dictMonadAff);
    var log5 = log2(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return function(dictMonadAsk) {
      var component62 = component52(dictMonadAsk);
      return function(dictMonadStore) {
        var component72 = component62(dictMonadStore);
        var render = function(v2) {
          if (v2.route instanceof Just) {
            if (v2.route.value0 instanceof Home) {
              return slot_1($$Proxy.value)(unit)(component1)(unit);
            }
            ;
            if (v2.route.value0 instanceof About) {
              return slot_22($$Proxy.value)(unit)(component22)(unit);
            }
            ;
            if (v2.route.value0 instanceof Instructions) {
              return slot_32($$Proxy.value)(unit)(component32)(unit);
            }
            ;
            if (v2.route.value0 instanceof LevelSelect) {
              return slot_42($$Proxy.value)(unit)(component42)(unit);
            }
            ;
            if (v2.route.value0 instanceof Level) {
              return fromMaybe(text5("coublent find tht roblem"))(bind31(lookup4(v2.route.value0.value0)(allLevels))(function(levelSuite) {
                return bind31(lookup4(v2.route.value0.value1)(levelSuite))(function(level) {
                  return pure29(slot_5($$Proxy.value)(unit)(component72)({
                    levelId: {
                      suiteName: v2.route.value0.value0,
                      levelName: v2.route.value0.value1
                    },
                    level
                  }));
                });
              }));
            }
            ;
            throw new Error("Failed pattern match at Component.Routes (line 71, column 15 - line 84, column 56): " + [v2.route.value0.constructor.name]);
          }
          ;
          if (v2.route instanceof Nothing) {
            return div_([text5("Oh no! That page wasn't found.")]);
          }
          ;
          throw new Error("Failed pattern match at Component.Routes (line 70, column 22 - line 86, column 59): " + [v2.route.constructor.name]);
        };
        var initialState = function(v2) {
          return {
            route: new Just(Home.value)
          };
        };
        var $$eval2 = mkEval({
          finalize: Nothing.value,
          handleAction: function(v2) {
            return pure111(unit);
          },
          handleQuery: function(v2) {
            return bind114(get4)(function(v1) {
              return discard23(when9(notEq9(v1.route)(new Just(v2.value0)))(discard23(log5("navigate"))(function() {
                return modify_9(function(v22) {
                  var $62 = {};
                  for (var $63 in v22) {
                    if ({}.hasOwnProperty.call(v22, $63)) {
                      $62[$63] = v22[$63];
                    }
                    ;
                  }
                  ;
                  $62.route = new Just(v2.value0);
                  return $62;
                });
              })))(function() {
                return pure111(new Just(v2.value1));
              });
            });
          },
          initialize: Nothing.value,
          receive: function(v2) {
            return Nothing.value;
          }
        });
        return mkComponent({
          "eval": $$eval2,
          initialState,
          render
        });
      };
    };
  };

  // output/Halogen.Aff.Util/index.js
  var bind33 = /* @__PURE__ */ bind(bindAff);
  var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var bindFlipped8 = /* @__PURE__ */ bindFlipped(bindEffect);
  var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
  var pure30 = /* @__PURE__ */ pure(applicativeAff);
  var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var pure112 = /* @__PURE__ */ pure(applicativeEffect);
  var map56 = /* @__PURE__ */ map(functorEffect);
  var selectElement = function(query3) {
    return bind33(liftEffect6(bindFlipped8(composeKleisliFlipped2(function() {
      var $16 = querySelector(query3);
      return function($17) {
        return $16(toParentNode($17));
      };
    }())(document))(windowImpl)))(function(mel) {
      return pure30(bindFlipped1(fromElement)(mel));
    });
  };
  var runHalogenAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure112(unit))));
  var awaitLoad = /* @__PURE__ */ makeAff(function(callback) {
    return function __do5() {
      var rs = bindFlipped8(readyState)(bindFlipped8(document)(windowImpl))();
      if (rs instanceof Loading) {
        var et = map56(toEventTarget2)(windowImpl)();
        var listener = eventListener(function(v2) {
          return callback(new Right(unit));
        })();
        addEventListener2(domcontentloaded)(listener)(false)(et)();
        return effectCanceler(removeEventListener2(domcontentloaded)(listener)(false)(et));
      }
      ;
      callback(new Right(unit))();
      return nonCanceler;
    };
  });

  // output/Halogen.Aff.Driver.State/index.js
  var unRenderStateX = unsafeCoerce2;
  var unDriverStateX = unsafeCoerce2;
  var renderStateX_ = function(dictApplicative) {
    var traverse_17 = traverse_(dictApplicative)(foldableMaybe);
    return function(f) {
      return unDriverStateX(function(st) {
        return traverse_17(f)(st.rendering);
      });
    };
  };
  var mkRenderStateX = unsafeCoerce2;
  var renderStateX = function(dictFunctor) {
    return function(f) {
      return unDriverStateX(function(st) {
        return mkRenderStateX(f(st.rendering));
      });
    };
  };
  var mkDriverStateXRef = unsafeCoerce2;
  var mapDriverState = function(f) {
    return function(v2) {
      return f(v2);
    };
  };
  var initDriverState = function(component14) {
    return function(input3) {
      return function(handler3) {
        return function(lchs) {
          return function __do5() {
            var selfRef = $$new({})();
            var childrenIn = $$new(empty5)();
            var childrenOut = $$new(empty5)();
            var handlerRef = $$new(handler3)();
            var pendingQueries = $$new(new Just(Nil.value))();
            var pendingOuts = $$new(new Just(Nil.value))();
            var pendingHandlers = $$new(Nothing.value)();
            var fresh2 = $$new(1)();
            var subscriptions = $$new(new Just(empty2))();
            var forks = $$new(empty2)();
            var ds = {
              component: component14,
              state: component14.initialState(input3),
              refs: empty2,
              children: empty5,
              childrenIn,
              childrenOut,
              selfRef,
              handlerRef,
              pendingQueries,
              pendingOuts,
              pendingHandlers,
              rendering: Nothing.value,
              fresh: fresh2,
              subscriptions,
              forks,
              lifecycleHandlers: lchs
            };
            write(ds)(selfRef)();
            return mkDriverStateXRef(selfRef);
          };
        };
      };
    };
  };

  // output/Halogen.Aff.Driver.Eval/index.js
  var traverse_11 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var bindFlipped9 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var lookup24 = /* @__PURE__ */ lookup(ordSubscriptionId);
  var bind115 = /* @__PURE__ */ bind(bindAff);
  var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var discard24 = /* @__PURE__ */ discard(discardUnit);
  var discard111 = /* @__PURE__ */ discard24(bindAff);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableList);
  var fork3 = /* @__PURE__ */ fork(monadForkAff);
  var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var pure31 = /* @__PURE__ */ pure(applicativeAff);
  var map57 = /* @__PURE__ */ map(functorCoyoneda);
  var parallel2 = /* @__PURE__ */ parallel(parallelAff);
  var map125 = /* @__PURE__ */ map(functorAff);
  var sequential2 = /* @__PURE__ */ sequential(parallelAff);
  var map214 = /* @__PURE__ */ map(functorMaybe);
  var insert11 = /* @__PURE__ */ insert(ordSubscriptionId);
  var retractFreeAp2 = /* @__PURE__ */ retractFreeAp(applicativeParAff);
  var $$delete8 = /* @__PURE__ */ $$delete2(ordForkId);
  var unlessM2 = /* @__PURE__ */ unlessM(monadEffect);
  var insert13 = /* @__PURE__ */ insert(ordForkId);
  var traverse_32 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var lookup110 = /* @__PURE__ */ lookup(ordForkId);
  var lookup25 = /* @__PURE__ */ lookup(ordString);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter3 = /* @__PURE__ */ alter(ordString);
  var unsubscribe3 = function(sid) {
    return function(ref4) {
      return function __do5() {
        var v2 = read(ref4)();
        var subs = read(v2.subscriptions)();
        return traverse_11(unsubscribe)(bindFlipped9(lookup24(sid))(subs))();
      };
    };
  };
  var queueOrRun = function(ref4) {
    return function(au) {
      return bind115(liftEffect7(read(ref4)))(function(v2) {
        if (v2 instanceof Nothing) {
          return au;
        }
        ;
        if (v2 instanceof Just) {
          return liftEffect7(write(new Just(new Cons(au, v2.value0)))(ref4));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 188, column 33 - line 190, column 57): " + [v2.constructor.name]);
      });
    };
  };
  var handleLifecycle = function(lchs) {
    return function(f) {
      return discard111(liftEffect7(write({
        initializers: Nil.value,
        finalizers: Nil.value
      })(lchs)))(function() {
        return bind115(liftEffect7(f))(function(result) {
          return bind115(liftEffect7(read(lchs)))(function(v2) {
            return discard111(traverse_23(fork3)(v2.finalizers))(function() {
              return discard111(parSequence_2(v2.initializers))(function() {
                return pure31(result);
              });
            });
          });
        });
      });
    };
  };
  var handleAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure(applicativeEffect)(unit))));
  var fresh = function(f) {
    return function(ref4) {
      return bind115(liftEffect7(read(ref4)))(function(v2) {
        return liftEffect7(modify$prime(function(i2) {
          return {
            state: i2 + 1 | 0,
            value: f(i2)
          };
        })(v2.fresh));
      });
    };
  };
  var evalQ = function(render) {
    return function(ref4) {
      return function(q3) {
        return bind115(liftEffect7(read(ref4)))(function(v2) {
          return evalM(render)(ref4)(v2["component"]["eval"](new Query(map57(Just.create)(liftCoyoneda(q3)), $$const(Nothing.value))));
        });
      };
    };
  };
  var evalM = function(render) {
    return function(initRef) {
      return function(v2) {
        var evalChildQuery = function(ref4) {
          return function(cqb) {
            return bind115(liftEffect7(read(ref4)))(function(v1) {
              return unChildQueryBox(function(v22) {
                var evalChild = function(v3) {
                  return parallel2(bind115(liftEffect7(read(v3)))(function(dsx) {
                    return unDriverStateX(function(ds) {
                      return evalQ(render)(ds.selfRef)(v22.value1);
                    })(dsx);
                  }));
                };
                return map125(v22.value2)(sequential2(v22.value0(applicativeParAff)(evalChild)(v1.children)));
              })(cqb);
            });
          };
        };
        var go2 = function(ref4) {
          return function(v1) {
            if (v1 instanceof State) {
              return bind115(liftEffect7(read(ref4)))(function(v22) {
                var v3 = v1.value0(v22.state);
                if (unsafeRefEq(v22.state)(v3.value1)) {
                  return pure31(v3.value0);
                }
                ;
                if (otherwise) {
                  return discard111(liftEffect7(write({
                    component: v22.component,
                    state: v3.value1,
                    refs: v22.refs,
                    children: v22.children,
                    childrenIn: v22.childrenIn,
                    childrenOut: v22.childrenOut,
                    selfRef: v22.selfRef,
                    handlerRef: v22.handlerRef,
                    pendingQueries: v22.pendingQueries,
                    pendingOuts: v22.pendingOuts,
                    pendingHandlers: v22.pendingHandlers,
                    rendering: v22.rendering,
                    fresh: v22.fresh,
                    subscriptions: v22.subscriptions,
                    forks: v22.forks,
                    lifecycleHandlers: v22.lifecycleHandlers
                  })(ref4)))(function() {
                    return discard111(handleLifecycle(v22.lifecycleHandlers)(render(v22.lifecycleHandlers)(ref4)))(function() {
                      return pure31(v3.value0);
                    });
                  });
                }
                ;
                throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 86, column 7 - line 92, column 21): " + [v3.constructor.name]);
              });
            }
            ;
            if (v1 instanceof Subscribe) {
              return bind115(fresh(SubscriptionId)(ref4))(function(sid) {
                return bind115(liftEffect7(subscribe(v1.value0(sid))(function(act) {
                  return handleAff(evalF(render)(ref4)(new Action(act)));
                })))(function(finalize) {
                  return bind115(liftEffect7(read(ref4)))(function(v22) {
                    return discard111(liftEffect7(modify_(map214(insert11(sid)(finalize)))(v22.subscriptions)))(function() {
                      return pure31(v1.value1(sid));
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Unsubscribe) {
              return discard111(liftEffect7(unsubscribe3(v1.value0)(ref4)))(function() {
                return pure31(v1.value1);
              });
            }
            ;
            if (v1 instanceof Lift2) {
              return v1.value0;
            }
            ;
            if (v1 instanceof ChildQuery2) {
              return evalChildQuery(ref4)(v1.value0);
            }
            ;
            if (v1 instanceof Raise) {
              return bind115(liftEffect7(read(ref4)))(function(v22) {
                return bind115(liftEffect7(read(v22.handlerRef)))(function(handler3) {
                  return discard111(queueOrRun(v22.pendingOuts)(handler3(v1.value0)))(function() {
                    return pure31(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Par) {
              return sequential2(retractFreeAp2(hoistFreeAp(function() {
                var $118 = evalM(render)(ref4);
                return function($119) {
                  return parallel2($118($119));
                };
              }())(v1.value0)));
            }
            ;
            if (v1 instanceof Fork) {
              return bind115(fresh(ForkId)(ref4))(function(fid) {
                return bind115(liftEffect7(read(ref4)))(function(v22) {
                  return bind115(liftEffect7($$new(false)))(function(doneRef) {
                    return bind115(fork3($$finally(liftEffect7(function __do5() {
                      modify_($$delete8(fid))(v22.forks)();
                      return write(true)(doneRef)();
                    }))(evalM(render)(ref4)(v1.value0))))(function(fiber) {
                      return discard111(liftEffect7(unlessM2(read(doneRef))(modify_(insert13(fid)(fiber))(v22.forks))))(function() {
                        return pure31(v1.value1(fid));
                      });
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Join) {
              return bind115(liftEffect7(read(ref4)))(function(v22) {
                return bind115(liftEffect7(read(v22.forks)))(function(forkMap) {
                  return discard111(traverse_32(joinFiber)(lookup110(v1.value0)(forkMap)))(function() {
                    return pure31(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Kill) {
              return bind115(liftEffect7(read(ref4)))(function(v22) {
                return bind115(liftEffect7(read(v22.forks)))(function(forkMap) {
                  return discard111(traverse_32(killFiber(error("Cancelled")))(lookup110(v1.value0)(forkMap)))(function() {
                    return pure31(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof GetRef) {
              return bind115(liftEffect7(read(ref4)))(function(v22) {
                return pure31(v1.value1(lookup25(v1.value0)(v22.refs)));
              });
            }
            ;
            throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 83, column 12 - line 139, column 33): " + [v1.constructor.name]);
          };
        };
        return foldFree2(go2(initRef))(v2);
      };
    };
  };
  var evalF = function(render) {
    return function(ref4) {
      return function(v2) {
        if (v2 instanceof RefUpdate) {
          return liftEffect7(flip(modify_)(ref4)(mapDriverState(function(st) {
            return {
              component: st.component,
              state: st.state,
              refs: alter3($$const(v2.value1))(v2.value0)(st.refs),
              children: st.children,
              childrenIn: st.childrenIn,
              childrenOut: st.childrenOut,
              selfRef: st.selfRef,
              handlerRef: st.handlerRef,
              pendingQueries: st.pendingQueries,
              pendingOuts: st.pendingOuts,
              pendingHandlers: st.pendingHandlers,
              rendering: st.rendering,
              fresh: st.fresh,
              subscriptions: st.subscriptions,
              forks: st.forks,
              lifecycleHandlers: st.lifecycleHandlers
            };
          })));
        }
        ;
        if (v2 instanceof Action) {
          return bind115(liftEffect7(read(ref4)))(function(v1) {
            return evalM(render)(ref4)(v1["component"]["eval"](new Action2(v2.value0, unit)));
          });
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 52, column 20 - line 58, column 62): " + [v2.constructor.name]);
      };
    };
  };

  // output/Halogen.Aff.Driver/index.js
  var bind34 = /* @__PURE__ */ bind(bindEffect);
  var discard25 = /* @__PURE__ */ discard(discardUnit);
  var for_9 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_14 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var fork4 = /* @__PURE__ */ fork(monadForkAff);
  var bindFlipped10 = /* @__PURE__ */ bindFlipped(bindEffect);
  var traverse_15 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_24 = /* @__PURE__ */ traverse_15(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_15(foldableMap);
  var discard26 = /* @__PURE__ */ discard25(bindAff);
  var parSequence_3 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var liftEffect8 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure32 = /* @__PURE__ */ pure(applicativeEffect);
  var map58 = /* @__PURE__ */ map(functorEffect);
  var pure113 = /* @__PURE__ */ pure(applicativeAff);
  var when10 = /* @__PURE__ */ when(applicativeEffect);
  var renderStateX2 = /* @__PURE__ */ renderStateX(functorEffect);
  var $$void14 = /* @__PURE__ */ $$void(functorAff);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_2 = /* @__PURE__ */ renderStateX_(applicativeEffect);
  var tailRecM3 = /* @__PURE__ */ tailRecM(monadRecEffect);
  var voidLeft5 = /* @__PURE__ */ voidLeft(functorEffect);
  var bind116 = /* @__PURE__ */ bind(bindAff);
  var liftEffect12 = /* @__PURE__ */ liftEffect(monadEffectEffect);
  var newLifecycleHandlers = /* @__PURE__ */ function() {
    return $$new({
      initializers: Nil.value,
      finalizers: Nil.value
    });
  }();
  var handlePending = function(ref4) {
    return function __do5() {
      var queue = read(ref4)();
      write(Nothing.value)(ref4)();
      return for_9(queue)(function() {
        var $58 = traverse_14(fork4);
        return function($59) {
          return handleAff($58(reverse2($59)));
        };
      }())();
    };
  };
  var cleanupSubscriptionsAndForks = function(v2) {
    return function __do5() {
      bindFlipped10(traverse_24(traverse_33(unsubscribe)))(read(v2.subscriptions))();
      write(Nothing.value)(v2.subscriptions)();
      bindFlipped10(traverse_33(function() {
        var $60 = killFiber(error("finalized"));
        return function($61) {
          return handleAff($60($61));
        };
      }()))(read(v2.forks))();
      return write(empty2)(v2.forks)();
    };
  };
  var runUI = function(renderSpec2) {
    return function(component14) {
      return function(i2) {
        var squashChildInitializers = function(lchs) {
          return function(preInits) {
            return unDriverStateX(function(st) {
              var parentInitializer = evalM(render)(st.selfRef)(st["component"]["eval"](new Initialize(unit)));
              return modify_(function(handlers) {
                return {
                  initializers: new Cons(discard26(parSequence_3(reverse2(handlers.initializers)))(function() {
                    return discard26(parentInitializer)(function() {
                      return liftEffect8(function __do5() {
                        handlePending(st.pendingQueries)();
                        return handlePending(st.pendingOuts)();
                      });
                    });
                  }), preInits),
                  finalizers: handlers.finalizers
                };
              })(lchs);
            });
          };
        };
        var runComponent = function(lchs) {
          return function(handler3) {
            return function(j) {
              return unComponent(function(c2) {
                return function __do5() {
                  var lchs$prime = newLifecycleHandlers();
                  var $$var2 = initDriverState(c2)(j)(handler3)(lchs$prime)();
                  var pre2 = read(lchs)();
                  write({
                    initializers: Nil.value,
                    finalizers: pre2.finalizers
                  })(lchs)();
                  bindFlipped10(unDriverStateX(function() {
                    var $62 = render(lchs);
                    return function($63) {
                      return $62(function(v2) {
                        return v2.selfRef;
                      }($63));
                    };
                  }()))(read($$var2))();
                  bindFlipped10(squashChildInitializers(lchs)(pre2.initializers))(read($$var2))();
                  return $$var2;
                };
              });
            };
          };
        };
        var renderChild = function(lchs) {
          return function(handler3) {
            return function(childrenInRef) {
              return function(childrenOutRef) {
                return unComponentSlot(function(slot4) {
                  return function __do5() {
                    var childrenIn = map58(slot4.pop)(read(childrenInRef))();
                    var $$var2 = function() {
                      if (childrenIn instanceof Just) {
                        write(childrenIn.value0.value1)(childrenInRef)();
                        var dsx = read(childrenIn.value0.value0)();
                        unDriverStateX(function(st) {
                          return function __do6() {
                            flip(write)(st.handlerRef)(function() {
                              var $64 = maybe(pure113(unit))(handler3);
                              return function($65) {
                                return $64(slot4.output($65));
                              };
                            }())();
                            return handleAff(evalM(render)(st.selfRef)(st["component"]["eval"](new Receive(slot4.input, unit))))();
                          };
                        })(dsx)();
                        return childrenIn.value0.value0;
                      }
                      ;
                      if (childrenIn instanceof Nothing) {
                        return runComponent(lchs)(function() {
                          var $66 = maybe(pure113(unit))(handler3);
                          return function($67) {
                            return $66(slot4.output($67));
                          };
                        }())(slot4.input)(slot4.component)();
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 213, column 14 - line 222, column 98): " + [childrenIn.constructor.name]);
                    }();
                    var isDuplicate = map58(function($68) {
                      return isJust(slot4.get($68));
                    })(read(childrenOutRef))();
                    when10(isDuplicate)(warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur"))();
                    modify_(slot4.set($$var2))(childrenOutRef)();
                    return bind34(read($$var2))(renderStateX2(function(v2) {
                      if (v2 instanceof Nothing) {
                        return $$throw("Halogen internal error: child was not initialized in renderChild");
                      }
                      ;
                      if (v2 instanceof Just) {
                        return pure32(renderSpec2.renderChild(v2.value0));
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 227, column 37 - line 229, column 50): " + [v2.constructor.name]);
                    }))();
                  };
                });
              };
            };
          };
        };
        var render = function(lchs) {
          return function($$var2) {
            return function __do5() {
              var v2 = read($$var2)();
              var shouldProcessHandlers = map58(isNothing)(read(v2.pendingHandlers))();
              when10(shouldProcessHandlers)(write(new Just(Nil.value))(v2.pendingHandlers))();
              write(empty5)(v2.childrenOut)();
              write(v2.children)(v2.childrenIn)();
              var handler3 = function() {
                var $69 = queueOrRun(v2.pendingHandlers);
                var $70 = evalF(render)(v2.selfRef);
                return function($71) {
                  return $69($$void14($70($71)));
                };
              }();
              var childHandler = function() {
                var $72 = queueOrRun(v2.pendingQueries);
                return function($73) {
                  return $72(handler3(Action.create($73)));
                };
              }();
              var rendering = renderSpec2.render(function($74) {
                return handleAff(handler3($74));
              })(renderChild(lchs)(childHandler)(v2.childrenIn)(v2.childrenOut))(v2.component.render(v2.state))(v2.rendering)();
              var children2 = read(v2.childrenOut)();
              var childrenIn = read(v2.childrenIn)();
              foreachSlot2(childrenIn)(function(v1) {
                return function __do6() {
                  var childDS = read(v1)();
                  renderStateX_2(renderSpec2.removeChild)(childDS)();
                  return finalize(lchs)(childDS)();
                };
              })();
              flip(modify_)(v2.selfRef)(mapDriverState(function(ds$prime) {
                return {
                  component: ds$prime.component,
                  state: ds$prime.state,
                  refs: ds$prime.refs,
                  children: children2,
                  childrenIn: ds$prime.childrenIn,
                  childrenOut: ds$prime.childrenOut,
                  selfRef: ds$prime.selfRef,
                  handlerRef: ds$prime.handlerRef,
                  pendingQueries: ds$prime.pendingQueries,
                  pendingOuts: ds$prime.pendingOuts,
                  pendingHandlers: ds$prime.pendingHandlers,
                  rendering: new Just(rendering),
                  fresh: ds$prime.fresh,
                  subscriptions: ds$prime.subscriptions,
                  forks: ds$prime.forks,
                  lifecycleHandlers: ds$prime.lifecycleHandlers
                };
              }))();
              return when10(shouldProcessHandlers)(flip(tailRecM3)(unit)(function(v1) {
                return function __do6() {
                  var handlers = read(v2.pendingHandlers)();
                  write(new Just(Nil.value))(v2.pendingHandlers)();
                  traverse_24(function() {
                    var $75 = traverse_14(fork4);
                    return function($76) {
                      return handleAff($75(reverse2($76)));
                    };
                  }())(handlers)();
                  var mmore = read(v2.pendingHandlers)();
                  var $51 = maybe(false)($$null2)(mmore);
                  if ($51) {
                    return voidLeft5(write(Nothing.value)(v2.pendingHandlers))(new Done(unit))();
                  }
                  ;
                  return new Loop(unit);
                };
              }))();
            };
          };
        };
        var finalize = function(lchs) {
          return unDriverStateX(function(st) {
            return function __do5() {
              cleanupSubscriptionsAndForks(st)();
              var f = evalM(render)(st.selfRef)(st["component"]["eval"](new Finalize(unit)));
              modify_(function(handlers) {
                return {
                  initializers: handlers.initializers,
                  finalizers: new Cons(f, handlers.finalizers)
                };
              })(lchs)();
              return foreachSlot2(st.children)(function(v2) {
                return function __do6() {
                  var dsx = read(v2)();
                  return finalize(lchs)(dsx)();
                };
              })();
            };
          });
        };
        var evalDriver = function(disposed) {
          return function(ref4) {
            return function(q3) {
              return bind116(liftEffect8(read(disposed)))(function(v2) {
                if (v2) {
                  return pure113(Nothing.value);
                }
                ;
                return evalQ(render)(ref4)(q3);
              });
            };
          };
        };
        var dispose = function(disposed) {
          return function(lchs) {
            return function(dsx) {
              return handleLifecycle(lchs)(function __do5() {
                var v2 = read(disposed)();
                if (v2) {
                  return unit;
                }
                ;
                write(true)(disposed)();
                finalize(lchs)(dsx)();
                return unDriverStateX(function(v1) {
                  return function __do6() {
                    var v22 = liftEffect12(read(v1.selfRef))();
                    return for_9(v22.rendering)(renderSpec2.dispose)();
                  };
                })(dsx)();
              });
            };
          };
        };
        return bind116(liftEffect8(newLifecycleHandlers))(function(lchs) {
          return bind116(liftEffect8($$new(false)))(function(disposed) {
            return handleLifecycle(lchs)(function __do5() {
              var sio = create3();
              var dsx = bindFlipped10(read)(runComponent(lchs)(function() {
                var $77 = notify(sio.listener);
                return function($78) {
                  return liftEffect8($77($78));
                };
              }())(i2)(component14))();
              return unDriverStateX(function(st) {
                return pure32({
                  query: evalDriver(disposed)(st.selfRef),
                  messages: sio.emitter,
                  dispose: dispose(disposed)(lchs)(dsx)
                });
              })(dsx)();
            });
          });
        });
      };
    };
  };

  // output/Halogen.VDom.Driver/index.js
  var $runtime_lazy11 = function(name16, moduleName, init4) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init4();
      state3 = 2;
      return val;
    };
  };
  var $$void15 = /* @__PURE__ */ $$void(functorEffect);
  var pure33 = /* @__PURE__ */ pure(applicativeEffect);
  var traverse_16 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var unwrap14 = /* @__PURE__ */ unwrap();
  var when11 = /* @__PURE__ */ when(applicativeEffect);
  var not5 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean)));
  var identity21 = /* @__PURE__ */ identity(categoryFn);
  var bind117 = /* @__PURE__ */ bind(bindAff);
  var liftEffect9 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var map59 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped11 = /* @__PURE__ */ bindFlipped(bindEffect);
  var substInParent = function(v2) {
    return function(v1) {
      return function(v22) {
        if (v1 instanceof Just && v22 instanceof Just) {
          return $$void15(insertBefore(v2)(v1.value0)(v22.value0));
        }
        ;
        if (v1 instanceof Nothing && v22 instanceof Just) {
          return $$void15(appendChild(v2)(v22.value0));
        }
        ;
        return pure33(unit);
      };
    };
  };
  var removeChild3 = function(v2) {
    return function __do5() {
      var npn = parentNode(v2.node)();
      return traverse_16(function(pn) {
        return removeChild(v2.node)(pn);
      })(npn)();
    };
  };
  var mkSpec = function(handler3) {
    return function(renderChildRef) {
      return function(document2) {
        var getNode = unRenderStateX(function(v2) {
          return v2.node;
        });
        var done = function(st) {
          if (st instanceof Just) {
            return halt(st.value0);
          }
          ;
          return unit;
        };
        var buildWidget2 = function(spec) {
          var buildThunk2 = buildThunk(unwrap14)(spec);
          var $lazy_patch = $runtime_lazy11("patch", "Halogen.VDom.Driver", function() {
            return function(st, slot4) {
              if (st instanceof Just) {
                if (slot4 instanceof ComponentSlot) {
                  halt(st.value0);
                  return $lazy_renderComponentSlot(100)(slot4.value0);
                }
                ;
                if (slot4 instanceof ThunkSlot) {
                  var step$prime = step3(st.value0, slot4.value0);
                  return mkStep(new Step(extract2(step$prime), new Just(step$prime), $lazy_patch(103), done));
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 97, column 22 - line 103, column 79): " + [slot4.constructor.name]);
              }
              ;
              return $lazy_render(104)(slot4);
            };
          });
          var $lazy_render = $runtime_lazy11("render", "Halogen.VDom.Driver", function() {
            return function(slot4) {
              if (slot4 instanceof ComponentSlot) {
                return $lazy_renderComponentSlot(86)(slot4.value0);
              }
              ;
              if (slot4 instanceof ThunkSlot) {
                var step4 = buildThunk2(slot4.value0);
                return mkStep(new Step(extract2(step4), new Just(step4), $lazy_patch(89), done));
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 84, column 7 - line 89, column 75): " + [slot4.constructor.name]);
            };
          });
          var $lazy_renderComponentSlot = $runtime_lazy11("renderComponentSlot", "Halogen.VDom.Driver", function() {
            return function(cs) {
              var renderChild = read(renderChildRef)();
              var rsx = renderChild(cs)();
              var node = getNode(rsx);
              return mkStep(new Step(node, Nothing.value, $lazy_patch(117), done));
            };
          });
          var patch = $lazy_patch(91);
          var render = $lazy_render(82);
          var renderComponentSlot = $lazy_renderComponentSlot(109);
          return render;
        };
        var buildAttributes = buildProp(handler3);
        return {
          buildWidget: buildWidget2,
          buildAttributes,
          document: document2
        };
      };
    };
  };
  var renderSpec = function(document2) {
    return function(container) {
      var render = function(handler3) {
        return function(child) {
          return function(v2) {
            return function(v1) {
              if (v1 instanceof Nothing) {
                return function __do5() {
                  var renderChildRef = $$new(child)();
                  var spec = mkSpec(handler3)(renderChildRef)(document2);
                  var machine = buildVDom(spec)(v2);
                  var node = extract2(machine);
                  $$void15(appendChild(node)(toNode2(container)))();
                  return {
                    machine,
                    node,
                    renderChildRef
                  };
                };
              }
              ;
              if (v1 instanceof Just) {
                return function __do5() {
                  write(child)(v1.value0.renderChildRef)();
                  var parent2 = parentNode(v1.value0.node)();
                  var nextSib = nextSibling(v1.value0.node)();
                  var machine$prime = step3(v1.value0.machine, v2);
                  var newNode = extract2(machine$prime);
                  when11(not5(unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(nextSib)(parent2))();
                  return {
                    machine: machine$prime,
                    node: newNode,
                    renderChildRef: v1.value0.renderChildRef
                  };
                };
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 157, column 5 - line 173, column 80): " + [v1.constructor.name]);
            };
          };
        };
      };
      return {
        render,
        renderChild: identity21,
        removeChild: removeChild3,
        dispose: removeChild3
      };
    };
  };
  var runUI2 = function(component14) {
    return function(i2) {
      return function(element4) {
        return bind117(liftEffect9(map59(toDocument)(bindFlipped11(document)(windowImpl))))(function(document2) {
          return runUI(renderSpec(document2)(element4))(component14)(i2);
        });
      };
    };
  };

  // output/Main/index.js
  var bind35 = /* @__PURE__ */ bind(bindAff);
  var $$void16 = /* @__PURE__ */ $$void(functorEffect);
  var matchesWith2 = /* @__PURE__ */ matchesWith(foldableEither);
  var when12 = /* @__PURE__ */ when(applicativeEffect);
  var notEq10 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqRoute));
  var component13 = /* @__PURE__ */ component12(monadAffAppM)(monadAskGlobalStateAppM)(monadStoreGameEventGameEv);
  var bindFlipped12 = /* @__PURE__ */ bindFlipped(bindAff);
  var liftEffect10 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var rootElement = /* @__PURE__ */ bind35(/* @__PURE__ */ selectElement("#abed"))(/* @__PURE__ */ maybe(/* @__PURE__ */ throwError(monadThrowAff)(/* @__PURE__ */ error("Could not find element #abed")))(/* @__PURE__ */ pure(applicativeAff)));
  var initialiseRouting = function(onNewRoute) {
    return $$void16(matchesWith2(parse7(routeCodec))(function(old) {
      return function($$new2) {
        return when12(notEq10(old)(new Just($$new2)))(onNewRoute($$new2));
      };
    }));
  };
  var main2 = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ discard(discardUnit)(bindAff)(awaitLoad)(function() {
    return bind35(runAppM(component13))(function(rootComponent) {
      return bind35(bindFlipped12(runUI2(rootComponent)(unit))(rootElement))(function(v2) {
        return liftEffect10(initialiseRouting(function(route) {
          return runHalogenAff(v2.query(new Navigate(route, unit)));
        }));
      });
    });
  }));

  // <stdin>
  main2();
})();
