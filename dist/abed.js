(() => {
  // output/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i2 = 0; i2 < l; i2++) {
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
      return function(g) {
        return function(x) {
          return f(g(x));
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
      return function(g) {
        return compose1(g)(f);
      };
    };
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var on = function(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          return f(g(x))(g(y));
        };
      };
    };
  };
  var flip = function(f) {
    return function(b2) {
      return function(a2) {
        return f(a2)(b2);
      };
    };
  };
  var $$const = function(a2) {
    return function(v) {
      return a2;
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i2 = 0; i2 < l; i2++) {
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
    var map112 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map112(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var voidLeft = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return function(f) {
      return function(x) {
        return map112($$const(x))(f);
      };
    };
  };
  var voidRight = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return function(x) {
      return map112($$const(x));
    };
  };
  var functorArray = {
    map: arrayMap
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyArray = {
    apply: arrayApply,
    Functor0: function() {
      return functorArray;
    }
  };
  var apply = function(dict) {
    return dict.apply;
  };
  var applySecond = function(dictApply) {
    var apply1 = apply(dictApply);
    var map28 = map(dictApply.Functor0());
    return function(a2) {
      return function(b2) {
        return apply1(map28($$const(identity2))(a2))(b2);
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var unless = function(dictApplicative) {
    var pure111 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (!v) {
          return v1;
        }
        ;
        if (v) {
          return pure111(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var when = function(dictApplicative) {
    var pure111 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure111(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    var pure111 = pure(dictApplicative);
    return function(f) {
      return function(a2) {
        return apply2(pure111(f))(a2);
      };
    };
  };
  var applicativeArray = {
    pure: function(x) {
      return [x];
    },
    Apply0: function() {
      return applyArray;
    }
  };

  // output/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f) {
      var result = [];
      for (var i2 = 0, l = arr.length; i2 < l; i2++) {
        Array.prototype.push.apply(result, f(arr[i2]));
      }
      return result;
    };
  };

  // output/Control.Bind/index.js
  var discard = function(dict) {
    return dict.discard;
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
    var bindFlipped12 = bindFlipped(dictBind);
    return function(f) {
      return function(g) {
        return function(a2) {
          return bindFlipped12(f)(g(a2));
        };
      };
    };
  };
  var discardUnit = {
    discard: function(dictBind) {
      return bind(dictBind);
    }
  };

  // output/Control.Monad/index.js
  var unlessM = function(dictMonad) {
    var bind19 = bind(dictMonad.Bind1());
    var unless2 = unless(dictMonad.Applicative0());
    return function(mb) {
      return function(m) {
        return bind19(mb)(function(b2) {
          return unless2(b2)(m);
        });
      };
    };
  };
  var ap = function(dictMonad) {
    var bind19 = bind(dictMonad.Bind1());
    var pure20 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a2) {
        return bind19(f)(function(f$prime) {
          return bind19(a2)(function(a$prime) {
            return pure20(f$prime(a$prime));
          });
        });
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

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label5) {
    return function(rec) {
      return rec[label5];
    };
  };
  var unsafeSet = function(label5) {
    return function(value12) {
      return function(rec) {
        var copy2 = {};
        for (var key2 in rec) {
          if ({}.hasOwnProperty.call(rec, key2)) {
            copy2[key2] = rec[key2];
          }
        }
        copy2[label5] = value12;
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
    var append14 = append(dictSemigroup);
    return {
      append: function(f) {
        return function(g) {
          return function(x) {
            return append14(f(x))(g(x));
          };
        };
      }
    };
  };

  // output/Control.Alt/index.js
  var altArray = {
    alt: /* @__PURE__ */ append(semigroupArray),
    Functor0: function() {
      return functorArray;
    }
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
    return function(eq4) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq4 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordNumberImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqBooleanImpl = refEq;
  var eqIntImpl = refEq;
  var eqNumberImpl = refEq;
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
    eq: function(v) {
      return function(v1) {
        return true;
      };
    }
  };
  var eqString = {
    eq: eqStringImpl
  };
  var eqNumber = {
    eq: eqNumberImpl
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
  var eq = function(dict) {
    return dict.eq;
  };
  var eq2 = /* @__PURE__ */ eq(eqBoolean);
  var eqArray = function(dictEq) {
    return {
      eq: eqArrayImpl(eq(dictEq))
    };
  };
  var notEq = function(dictEq) {
    var eq32 = eq(dictEq);
    return function(x) {
      return function(y) {
        return eq2(eq32(x)(y))(false);
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
    append: function(v) {
      return function(v1) {
        if (v instanceof LT) {
          return LT.value;
        }
        ;
        if (v instanceof GT) {
          return GT.value;
        }
        ;
        if (v instanceof EQ) {
          return v1;
        }
        ;
        throw new Error("Failed pattern match at Data.Ordering (line 21, column 1 - line 24, column 18): " + [v.constructor.name, v1.constructor.name]);
      };
    }
  };

  // output/Data.Ring/foreign.js
  var intSub = function(x) {
    return function(y) {
      return x - y | 0;
    };
  };

  // output/Data.Semiring/foreign.js
  var intAdd = function(x) {
    return function(y) {
      return x + y | 0;
    };
  };
  var intMul = function(x) {
    return function(y) {
      return x * y | 0;
    };
  };

  // output/Data.Semiring/index.js
  var zero = function(dict) {
    return dict.zero;
  };
  var semiringInt = {
    add: intAdd,
    zero: 0,
    mul: intMul,
    one: 1
  };
  var one = function(dict) {
    return dict.one;
  };
  var add = function(dict) {
    return dict.add;
  };

  // output/Data.Ring/index.js
  var ringInt = {
    sub: intSub,
    Semiring0: function() {
      return semiringInt;
    }
  };

  // output/Data.Ord/index.js
  var ordUnit = {
    compare: function(v) {
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
  var ordNumber = /* @__PURE__ */ function() {
    return {
      compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqNumber;
      }
    };
  }();
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
  var compare = function(dict) {
    return dict.compare;
  };
  var greaterThan = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare32(a1)(a2);
        if (v instanceof GT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var greaterThanOrEq = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare32(a1)(a2);
        if (v instanceof LT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var lessThan = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare32(a1)(a2);
        if (v instanceof LT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var lessThanOrEq = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare32(a1)(a2);
        if (v instanceof GT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var max = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare32(x)(y);
        if (v instanceof LT) {
          return y;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return x;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
      };
    };
  };
  var min = function(dictOrd) {
    var compare32 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare32(x)(y);
        if (v instanceof LT) {
          return x;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return y;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v.constructor.name]);
      };
    };
  };
  var clamp = function(dictOrd) {
    var min1 = min(dictOrd);
    var max1 = max(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x) {
          return min1(hi)(max1(low2)(x));
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
  var showArrayImpl = function(f) {
    return function(xs) {
      var ss = [];
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        ss[i2] = f(xs[i2]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output/Data.Show/index.js
  var showInt = {
    show: showIntImpl
  };
  var show = function(dict) {
    return dict.show;
  };
  var showArray = function(dictShow) {
    return {
      show: showArrayImpl(show(dictShow))
    };
  };

  // output/Data.Maybe/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
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
    var show8 = show(dictShow);
    return {
      show: function(v) {
        if (v instanceof Just) {
          return "(Just " + (show8(v.value0) + ")");
        }
        ;
        if (v instanceof Nothing) {
          return "Nothing";
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [v.constructor.name]);
      }
    };
  };
  var maybe$prime = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v(unit);
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a2) {
    return maybe(a2)(identity3);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
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
    alt: function(v) {
      return function(v1) {
        if (v instanceof Nothing) {
          return v1;
        }
        ;
        return v;
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
  var showEither = function(dictShow) {
    var show8 = show(dictShow);
    return function(dictShow1) {
      var show14 = show(dictShow1);
      return {
        show: function(v) {
          if (v instanceof Left) {
            return "(Left " + (show8(v.value0) + ")");
          }
          ;
          if (v instanceof Right) {
            return "(Right " + (show14(v.value0) + ")");
          }
          ;
          throw new Error("Failed pattern match at Data.Either (line 173, column 1 - line 175, column 46): " + [v.constructor.name]);
        }
      };
    };
  };
  var note = function(a2) {
    return maybe(new Left(a2))(Right.create);
  };
  var functorEither = {
    map: function(f) {
      return function(m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        ;
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var map3 = /* @__PURE__ */ map(functorEither);
  var either = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isLeft = /* @__PURE__ */ either(/* @__PURE__ */ $$const(true))(/* @__PURE__ */ $$const(false));
  var blush = /* @__PURE__ */ function() {
    return either(Just.create)($$const(Nothing.value));
  }();
  var applyEither = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Left) {
          return new Left(v.value0);
        }
        ;
        if (v instanceof Right) {
          return map3(v.value0)(v1);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorEither;
    }
  };
  var bindEither = {
    bind: /* @__PURE__ */ either(function(e) {
      return function(v) {
        return new Left(e);
      };
    })(function(a2) {
      return function(f) {
        return f(a2);
      };
    }),
    Apply0: function() {
      return applyEither;
    }
  };

  // output/Data.EuclideanRing/foreign.js
  var intDegree = function(x) {
    return Math.min(Math.abs(x), 2147483647);
  };
  var intDiv = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
    };
  };
  var intMod = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      var yy = Math.abs(y);
      return (x % yy + yy) % yy;
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
  var mempty = function(dict) {
    return dict.mempty;
  };
  var monoidFn = function(dictMonoid) {
    var mempty1 = mempty(dictMonoid);
    var semigroupFn2 = semigroupFn(dictMonoid.Semigroup0());
    return {
      mempty: function(v) {
        return mempty1;
      },
      Semigroup0: function() {
        return semigroupFn2;
      }
    };
  };
  var power = function(dictMonoid) {
    var mempty1 = mempty(dictMonoid);
    var append7 = append(dictMonoid.Semigroup0());
    return function(x) {
      var go2 = function(p2) {
        if (p2 <= 0) {
          return mempty1;
        }
        ;
        if (p2 === 1) {
          return x;
        }
        ;
        if (mod2(p2)(2) === 0) {
          var x$prime = go2(div2(p2)(2));
          return append7(x$prime)(x$prime);
        }
        ;
        if (otherwise) {
          var x$prime = go2(div2(p2)(2));
          return append7(x$prime)(append7(x$prime)(x));
        }
        ;
        throw new Error("Failed pattern match at Data.Monoid (line 88, column 3 - line 88, column 17): " + [p2.constructor.name]);
      };
      return go2;
    };
  };

  // output/Effect/foreign.js
  var pureE = function(a2) {
    return function() {
      return a2;
    };
  };
  var bindE = function(a2) {
    return function(f) {
      return function() {
        return f(a2())();
      };
    };
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
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

  // output/Effect.Ref/foreign.js
  var _new = function(val) {
    return function() {
      return { value: val };
    };
  };
  var read = function(ref3) {
    return function() {
      return ref3.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref3) {
      return function() {
        var t = f(ref3.value);
        ref3.value = t.state;
        return t.value;
      };
    };
  };
  var write = function(val) {
    return function(ref3) {
      return function() {
        ref3.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var modify_ = function(f) {
    return function(s) {
      return $$void2(modify(f)(s));
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
      return function(a2) {
        var fromDone = function(v) {
          if (v instanceof Done) {
            return v.value0;
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [v.constructor.name]);
        };
        return function __do2() {
          var r = bindFlipped2($$new)(f(a2))();
          (function() {
            while (!function __do3() {
              var v = read(r)();
              if (v instanceof Loop) {
                var e = f(v.value0)();
                write(e)(r)();
                return false;
              }
              ;
              if (v instanceof Done) {
                return true;
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [v.constructor.name]);
            }()) {
            }
            ;
            return {};
          })();
          return map4(fromDone)(read(r))();
        };
      };
    },
    Monad0: function() {
      return monadEffect;
    }
  };
  var forever = function(dictMonadRec) {
    var tailRecM1 = tailRecM(dictMonadRec);
    var voidRight2 = voidRight(dictMonadRec.Monad0().Bind1().Apply0().Functor0());
    return function(ma) {
      return tailRecM1(function(u2) {
        return voidRight2(new Loop(u2))(ma);
      })(unit);
    };
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
    implies: function(a2) {
      return function(b2) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a2))(b2);
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
    var conj12 = conj(dictHeytingAlgebra);
    var disj1 = disj(dictHeytingAlgebra);
    var not1 = not(dictHeytingAlgebra);
    return {
      ff: function(v) {
        return ff1;
      },
      tt: function(v) {
        return tt1;
      },
      implies: function(f) {
        return function(g) {
          return function(a2) {
            return implies1(f(a2))(g(a2));
          };
        };
      },
      conj: function(f) {
        return function(g) {
          return function(a2) {
            return conj12(f(a2))(g(a2));
          };
        };
      },
      disj: function(f) {
        return function(g) {
          return function(a2) {
            return disj1(f(a2))(g(a2));
          };
        };
      },
      not: function(f) {
        return function(a2) {
          return not1(f(a2));
        };
      }
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
    return function(v) {
      return f(v.value0)(v.value1);
    };
  };
  var snd = function(v) {
    return v.value1;
  };
  var showTuple = function(dictShow) {
    var show8 = show(dictShow);
    return function(dictShow1) {
      var show14 = show(dictShow1);
      return {
        show: function(v) {
          return "(Tuple " + (show8(v.value0) + (" " + (show14(v.value1) + ")")));
        }
      };
    };
  };
  var functorTuple = {
    map: function(f) {
      return function(m) {
        return new Tuple(m.value0, f(m.value1));
      };
    }
  };
  var fst = function(v) {
    return v.value0;
  };
  var eqTuple = function(dictEq) {
    var eq4 = eq(dictEq);
    return function(dictEq1) {
      var eq14 = eq(dictEq1);
      return {
        eq: function(x) {
          return function(y) {
            return eq4(x.value0)(y.value0) && eq14(x.value1)(y.value1);
          };
        }
      };
    };
  };
  var ordTuple = function(dictOrd) {
    var compare4 = compare(dictOrd);
    var eqTuple1 = eqTuple(dictOrd.Eq0());
    return function(dictOrd1) {
      var compare13 = compare(dictOrd1);
      var eqTuple2 = eqTuple1(dictOrd1.Eq0());
      return {
        compare: function(x) {
          return function(y) {
            var v = compare4(x.value0)(y.value0);
            if (v instanceof LT) {
              return LT.value;
            }
            ;
            if (v instanceof GT) {
              return GT.value;
            }
            ;
            return compare13(x.value1)(y.value1);
          };
        },
        Eq0: function() {
          return eqTuple2;
        }
      };
    };
  };

  // output/Control.Monad.State.Class/index.js
  var state = function(dict) {
    return dict.state;
  };
  var put = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(s) {
      return state1(function(v) {
        return new Tuple(unit, s);
      });
    };
  };
  var modify_2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        return new Tuple(unit, f(s));
      });
    };
  };
  var modify2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        var s$prime = f(s);
        return new Tuple(s$prime, s$prime);
      });
    };
  };
  var gets = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        return new Tuple(f(s), s);
      });
    };
  };

  // output/Data.Array/foreign.js
  var rangeImpl = function(start2, end) {
    var step4 = start2 > end ? -1 : 1;
    var result = new Array(step4 * (end - start2) + 1);
    var i2 = start2, n = 0;
    while (i2 !== end) {
      result[n++] = i2;
      i2 += step4;
    }
    result[n] = i2;
    return result;
  };
  var replicateFill = function(count, value12) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value12);
  };
  var replicatePolyfill = function(count, value12) {
    var result = [];
    var n = 0;
    for (var i2 = 0; i2 < count; i2++) {
      result[n++] = value12;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons3(head4, tail2) {
      this.head = head4;
      this.tail = tail2;
    }
    var emptyList = {};
    function curryCons(head4) {
      return function(tail2) {
        return new Cons3(head4, tail2);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr5, xs) {
      return listToArray(foldr5(curryCons)(emptyList)(xs));
    };
  }();
  var length = function(xs) {
    return xs.length;
  };
  var unconsImpl = function(empty8, next, xs) {
    return xs.length === 0 ? empty8({}) : next(xs[0])(xs.slice(1));
  };
  var indexImpl = function(just, nothing, xs, i2) {
    return i2 < 0 || i2 >= xs.length ? nothing : just(xs[i2]);
  };
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i2 = 0, l = xs.length; i2 < l; i2++) {
      if (f(xs[i2]))
        return just(i2);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i2, l) {
    if (i2 < 0 || i2 >= l.length)
      return nothing;
    var l1 = l.slice();
    l1.splice(i2, 1);
    return just(l1);
  };
  var sortByImpl = function() {
    function mergeFromTo(compare4, fromOrdering, xs1, xs2, from2, to2) {
      var mid;
      var i2;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from2 + (to2 - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare4, fromOrdering, xs2, xs1, from2, mid);
      if (to2 - mid > 1)
        mergeFromTo(compare4, fromOrdering, xs2, xs1, mid, to2);
      i2 = from2;
      j = mid;
      k = from2;
      while (i2 < mid && j < to2) {
        x = xs2[i2];
        y = xs2[j];
        c = fromOrdering(compare4(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to2) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare4, fromOrdering, xs) {
      var out;
      if (xs.length < 2)
        return xs;
      out = xs.slice(0);
      mergeFromTo(compare4, fromOrdering, out, xs.slice(0), 0, xs.length);
      return out;
    };
  }();

  // output/Data.Array.ST/foreign.js
  var sortByImpl2 = function() {
    function mergeFromTo(compare4, fromOrdering, xs1, xs2, from2, to2) {
      var mid;
      var i2;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from2 + (to2 - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare4, fromOrdering, xs2, xs1, from2, mid);
      if (to2 - mid > 1)
        mergeFromTo(compare4, fromOrdering, xs2, xs1, mid, to2);
      i2 = from2;
      j = mid;
      k = from2;
      while (i2 < mid && j < to2) {
        x = xs2[i2];
        y = xs2[j];
        c = fromOrdering(compare4(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i2;
        }
      }
      while (i2 < mid) {
        xs1[k++] = xs2[i2++];
      }
      while (j < to2) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare4, fromOrdering, xs) {
      if (xs.length < 2)
        return xs;
      mergeFromTo(compare4, fromOrdering, xs, xs.slice(0), 0, xs.length);
      return xs;
    };
  }();

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i2 = len - 1; i2 >= 0; i2--) {
          acc = f(xs[i2])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i2 = 0; i2 < len; i2++) {
          acc = f(acc)(xs[i2]);
        }
        return acc;
      };
    };
  };

  // output/Control.Plus/index.js
  var plusArray = {
    empty: [],
    Alt0: function() {
      return altArray;
    }
  };
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Data.Bifunctor/index.js
  var bimap = function(dict) {
    return dict.bimap;
  };

  // output/Data.Maybe.First/index.js
  var First = function(x) {
    return x;
  };
  var semigroupFirst = {
    append: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v;
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

  // output/Data.Monoid.Disj/index.js
  var semigroupDisj = function(dictHeytingAlgebra) {
    var disj3 = disj(dictHeytingAlgebra);
    return {
      append: function(v) {
        return function(v1) {
          return disj3(v)(v1);
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

  // output/Data.Monoid.Endo/index.js
  var Endo = function(x) {
    return x;
  };
  var semigroupEndo = function(dictSemigroupoid) {
    var compose2 = compose(dictSemigroupoid);
    return {
      append: function(v) {
        return function(v1) {
          return compose2(v)(v1);
        };
      }
    };
  };
  var monoidEndo = function(dictCategory) {
    var semigroupEndo1 = semigroupEndo(dictCategory.Semigroupoid0());
    return {
      mempty: identity(dictCategory),
      Semigroup0: function() {
        return semigroupEndo1;
      }
    };
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x) {
    return x;
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
      return function(v) {
        return coerce2;
      };
    };
  };
  var over = function() {
    return function() {
      return function(v) {
        return coerce2;
      };
    };
  };

  // output/Data.Foldable/index.js
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var foldr = function(dict) {
    return dict.foldr;
  };
  var traverse_ = function(dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure20 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(f) {
        return foldr22(function($454) {
          return applySecond2(f($454));
        })(pure20(unit));
      };
    };
  };
  var for_ = function(dictApplicative) {
    var traverse_14 = traverse_(dictApplicative);
    return function(dictFoldable) {
      return flip(traverse_14(dictFoldable));
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var intercalate = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictMonoid) {
      var append7 = append(dictMonoid.Semigroup0());
      var mempty3 = mempty(dictMonoid);
      return function(sep) {
        return function(xs) {
          var go2 = function(v) {
            return function(v1) {
              if (v.init) {
                return {
                  init: false,
                  acc: v1
                };
              }
              ;
              return {
                init: false,
                acc: append7(v.acc)(append7(sep)(v1))
              };
            };
          };
          return foldl22(go2)({
            init: true,
            acc: mempty3
          })(xs).acc;
        };
      };
    };
  };
  var length2 = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictSemiring) {
      var add1 = add(dictSemiring);
      var one2 = one(dictSemiring);
      return foldl22(function(c) {
        return function(v) {
          return add1(one2)(c);
        };
      })(zero(dictSemiring));
    };
  };
  var foldableMaybe = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return mempty3;
          }
          ;
          if (v1 instanceof Just) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldableEither = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v1;
          }
          ;
          if (v2 instanceof Right) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v1;
          }
          ;
          if (v2 instanceof Right) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Left) {
            return mempty3;
          }
          ;
          if (v1 instanceof Right) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append7 = append(dictMonoid.Semigroup0());
      var mempty3 = mempty(dictMonoid);
      return function(f) {
        return foldr22(function(x) {
          return function(acc) {
            return append7(f(x))(acc);
          };
        })(mempty3);
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
      return foldMap22(dictMonoid)(identity4);
    };
  };

  // output/Data.Function.Uncurried/foreign.js
  var runFn2 = function(fn) {
    return function(a2) {
      return function(b2) {
        return fn(a2, b2);
      };
    };
  };
  var runFn3 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return fn(a2, b2, c);
        };
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return function(d) {
            return fn(a2, b2, c, d);
          };
        };
      };
    };
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a2) {
      return [a2];
    }
    function array2(a2) {
      return function(b2) {
        return [a2, b2];
      };
    }
    function array3(a2) {
      return function(b2) {
        return function(c) {
          return [a2, b2, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply2) {
      return function(map28) {
        return function(pure20) {
          return function(f) {
            return function(array) {
              function go2(bot, top3) {
                switch (top3 - bot) {
                  case 0:
                    return pure20([]);
                  case 1:
                    return map28(array1)(f(array[bot]));
                  case 2:
                    return apply2(map28(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map28(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                    return apply2(map28(concat2)(go2(bot, pivot)))(go2(pivot, top3));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust7) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value12 = b2;
              while (true) {
                var maybe2 = f(value12);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust7(maybe2);
                result.push(fst2(tuple));
                value12 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust7) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value12 = b2;
              while (true) {
                var tuple = f(value12);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value12 = fromJust7(maybe2);
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
      return function(v) {
        var step4 = function(i2) {
          if (i2 <= 0) {
            return new Tuple(v, Nothing.value);
          }
          ;
          if (otherwise) {
            return new Tuple(v, new Just(i2 - 1 | 0));
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

  // output/Data.Array/index.js
  var intercalate1 = /* @__PURE__ */ intercalate(foldableArray);
  var fromJust4 = /* @__PURE__ */ fromJust();
  var fold1 = /* @__PURE__ */ fold(foldableArray);
  var uncons = /* @__PURE__ */ function() {
    return runFn3(unconsImpl)($$const(Nothing.value))(function(x) {
      return function(xs) {
        return new Just({
          head: x,
          tail: xs
        });
      };
    });
  }();
  var singleton2 = function(a2) {
    return [a2];
  };
  var range2 = /* @__PURE__ */ runFn2(rangeImpl);
  var intercalate2 = function(dictMonoid) {
    return intercalate1(dictMonoid);
  };
  var index = /* @__PURE__ */ function() {
    return runFn4(indexImpl)(Just.create)(Nothing.value);
  }();
  var head = function(xs) {
    return index(xs)(0);
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
  var deleteAt = /* @__PURE__ */ function() {
    return runFn4(_deleteAt)(Just.create)(Nothing.value);
  }();
  var deleteBy = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2.length === 0) {
          return [];
        }
        ;
        return maybe(v2)(function(i2) {
          return fromJust4(deleteAt(i2)(v2));
        })(findIndex(v(v1))(v2));
      };
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
  var catMaybes = /* @__PURE__ */ mapMaybe(/* @__PURE__ */ identity(categoryFn));

  // output/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output/Control.Alternative/index.js
  var guard = function(dictAlternative) {
    var pure20 = pure(dictAlternative.Applicative0());
    var empty8 = empty(dictAlternative.Plus1());
    return function(v) {
      if (v) {
        return pure20(unit);
      }
      ;
      if (!v) {
        return empty8;
      }
      ;
      throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [v.constructor.name]);
    };
  };
  var alternativeArray = {
    Applicative0: function() {
      return applicativeArray;
    },
    Plus1: function() {
      return plusArray;
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
    var eq14 = eq(Ord0.Eq0());
    var lessThan1 = lessThan(Ord0);
    var succ1 = succ(dictEnum);
    var lessThanOrEq1 = lessThanOrEq(Ord0);
    var pred1 = pred(dictEnum);
    var greaterThanOrEq1 = greaterThanOrEq(Ord0);
    return function(dictUnfoldable1) {
      var singleton8 = singleton(dictUnfoldable1);
      var unfoldr12 = unfoldr1(dictUnfoldable1);
      var go2 = function(step4) {
        return function(op) {
          return function(to2) {
            return function(a2) {
              return new Tuple(a2, bind2(step4(a2))(function(a$prime) {
                return voidLeft2(guard2(op(a$prime)(to2)))(a$prime);
              }));
            };
          };
        };
      };
      return function(v) {
        return function(v1) {
          if (eq14(v)(v1)) {
            return singleton8(v);
          }
          ;
          if (lessThan1(v)(v1)) {
            return unfoldr12(go2(succ1)(lessThanOrEq1)(v1))(v);
          }
          ;
          if (otherwise) {
            return unfoldr12(go2(pred1)(greaterThanOrEq1)(v1))(v);
          }
          ;
          throw new Error("Failed pattern match at Data.Enum (line 186, column 14 - line 190, column 51): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    };
  };
  var defaultSucc = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a2) {
        return toEnum$prime(fromEnum$prime(a2) + 1 | 0);
      };
    };
  };
  var defaultPred = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a2) {
        return toEnum$prime(fromEnum$prime(a2) - 1 | 0);
      };
    };
  };
  var charToEnum = function(v) {
    if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
      return new Just(fromCharCode(v));
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

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str) {
      return str.codePointAt(0);
    } : fallback;
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str) {
          return Array.from(str, unsafeCodePointAt02);
        };
      }
      return fallback;
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
  var round = Math.round;

  // output/Data.Int/index.js
  var top2 = /* @__PURE__ */ top(boundedInt);
  var bottom2 = /* @__PURE__ */ bottom(boundedInt);
  var hexadecimal = 16;
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();
  var unsafeClamp = function(x) {
    if (!isFiniteImpl(x)) {
      return 0;
    }
    ;
    if (x >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
  };

  // output/Data.String.CodeUnits/foreign.js
  var length3 = function(s) {
    return s.length;
  };
  var drop = function(n) {
    return function(s) {
      return s.substring(n);
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function(i2) {
    return function(s) {
      if (i2 >= 0 && i2 < s.length)
        return s.charAt(i2);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output/Data.String.Common/foreign.js
  var joinWith = function(s) {
    return function(xs) {
      return xs.join(s);
    };
  };

  // output/Data.String.CodePoints/index.js
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map5 = /* @__PURE__ */ map(functorMaybe);
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
  var uncons2 = function(s) {
    var v = length3(s);
    if (v === 0) {
      return Nothing.value;
    }
    ;
    if (v === 1) {
      return new Just({
        head: fromEnum2(charAt(0)(s)),
        tail: ""
      });
    }
    ;
    var cu1 = fromEnum2(charAt(1)(s));
    var cu0 = fromEnum2(charAt(0)(s));
    var $43 = isLead(cu0) && isTrail(cu1);
    if ($43) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop(2)(s)
      });
    }
    ;
    return new Just({
      head: cu0,
      tail: drop(1)(s)
    });
  };
  var unconsButWithTuple = function(s) {
    return map5(function(v) {
      return new Tuple(v.head, v.tail);
    })(uncons2(s));
  };
  var toCodePointArrayFallback = function(s) {
    return unfoldr2(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function(s) {
    var cu0 = fromEnum2(charAt(0)(s));
    var $47 = isLead(cu0) && length3(s) > 1;
    if ($47) {
      var cu1 = fromEnum2(charAt(1)(s));
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
  var length4 = function($74) {
    return length(toCodePointArray($74));
  };

  // output/Data.Time.Component/index.js
  var $runtime_lazy2 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
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
    fromEnum: function(v) {
      return v;
    },
    Bounded0: function() {
      return boundedSecond;
    },
    Enum1: function() {
      return $lazy_enumSecond(0);
    }
  };
  var $lazy_enumSecond = /* @__PURE__ */ $runtime_lazy2("enumSecond", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $36 = toEnum(boundedEnumSecond);
        var $37 = fromEnum(boundedEnumSecond);
        return function($38) {
          return $36(function(v) {
            return v + 1 | 0;
          }($37($38)));
        };
      }(),
      pred: function() {
        var $39 = toEnum(boundedEnumSecond);
        var $40 = fromEnum(boundedEnumSecond);
        return function($41) {
          return $39(function(v) {
            return v - 1 | 0;
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
    fromEnum: function(v) {
      return v;
    },
    Bounded0: function() {
      return boundedMinute;
    },
    Enum1: function() {
      return $lazy_enumMinute(0);
    }
  };
  var $lazy_enumMinute = /* @__PURE__ */ $runtime_lazy2("enumMinute", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $42 = toEnum(boundedEnumMinute);
        var $43 = fromEnum(boundedEnumMinute);
        return function($44) {
          return $42(function(v) {
            return v + 1 | 0;
          }($43($44)));
        };
      }(),
      pred: function() {
        var $45 = toEnum(boundedEnumMinute);
        var $46 = fromEnum(boundedEnumMinute);
        return function($47) {
          return $45(function(v) {
            return v - 1 | 0;
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
    fromEnum: function(v) {
      return v;
    },
    Bounded0: function() {
      return boundedHour;
    },
    Enum1: function() {
      return $lazy_enumHour(0);
    }
  };
  var $lazy_enumHour = /* @__PURE__ */ $runtime_lazy2("enumHour", "Data.Time.Component", function() {
    return {
      succ: function() {
        var $54 = toEnum(boundedEnumHour);
        var $55 = fromEnum(boundedEnumHour);
        return function($56) {
          return $54(function(v) {
            return v + 1 | 0;
          }($55($56)));
        };
      }(),
      pred: function() {
        var $57 = toEnum(boundedEnumHour);
        var $58 = fromEnum(boundedEnumHour);
        return function($59) {
          return $57(function(v) {
            return v - 1 | 0;
          }($58($59)));
        };
      }(),
      Ord0: function() {
        return ordHour;
      }
    };
  });

  // output/Data.Time.Duration/index.js
  var over2 = /* @__PURE__ */ over()();
  var Seconds = function(x) {
    return x;
  };
  var Milliseconds = function(x) {
    return x;
  };
  var fromDuration = function(dict) {
    return dict.fromDuration;
  };
  var durationSeconds = {
    fromDuration: /* @__PURE__ */ over2(Seconds)(function(v) {
      return v * 1e3;
    }),
    toDuration: /* @__PURE__ */ over2(Milliseconds)(function(v) {
      return v / 1e3;
    })
  };

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
  var second = function(v) {
    return v.value2;
  };
  var minute = function(v) {
    return v.value1;
  };
  var hour = function(v) {
    return v.value0;
  };

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
      var ix4 = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size5 !== 0) {
          size5--;
          thunk = queue[ix4];
          queue[ix4] = void 0;
          ix4 = (ix4 + 1) % limit;
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
          queue[(ix4 + size5) % limit] = cb;
          size5++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill2(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function() {
                      throw util.fromLeft(result);
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
                kill2(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
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
    function Fiber(util, supervisor, aff) {
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
      function run3(localRunTick) {
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
                fail2 = util.left(e);
                step4 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step4)) {
                status = RETURN;
                fail2 = step4;
                step4 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step4 = util.fromRight(step4);
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
                    step4 = util.right(step4._1);
                  } else {
                    status = STEP_BIND;
                    step4 = step4._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step4 = runSync(util.left, util.right, step4._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step4 = runAsync(util.left, step4._1, function(result2) {
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
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail2 = util.left(step4._1);
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
                  tmp = Fiber(util, supervisor, step4._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step4._1) {
                    tmp.run();
                  }
                  step4 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step4 = sequential3(util, supervisor, step4._1);
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
                      step4 = attempt._2(util.fromLeft(fail2));
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
                      step4 = util.fromRight(step4);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail2 === null) {
                      result = util.fromRight(step4);
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
                      step4 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                    } else if (fail2) {
                      step4 = attempt._1.failed(util.fromLeft(fail2))(attempt._2);
                    } else {
                      step4 = attempt._1.completed(util.fromRight(step4))(attempt._2);
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
                  throw util.fromLeft(fail2);
                }, 0);
              } else if (util.isLeft(step4) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util.fromLeft(step4);
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
      function onComplete(join4) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join4.rethrow;
            join4.handler(step4)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join4;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill2(error4, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error4);
              status = COMPLETED;
              step4 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error4);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step4(error4)), attempts, interrupt);
                }
                status = RETURN;
                step4 = null;
                fail2 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error4);
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
      function join3(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill: kill2,
        join: join3,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        }
      };
    }
    function runPar(util, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root = EMPTY;
      function kill2(error4, par2, cb2) {
        var step4 = par2;
        var head4 = null;
        var tail2 = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step4.tag) {
              case FORKED:
                if (step4._3 === EMPTY) {
                  tmp = fibers[step4._1];
                  kills2[count++] = tmp.kill(error4, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head4 === null) {
                  break loop;
                }
                step4 = head4._2;
                if (tail2 === null) {
                  head4 = null;
                } else {
                  head4 = tail2._1;
                  tail2 = tail2._2;
                }
                break;
              case MAP:
                step4 = step4._2;
                break;
              case APPLY:
              case ALT:
                if (head4) {
                  tail2 = new Aff2(CONS, head4, tail2);
                }
                head4 = step4;
                step4 = step4._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join3(result, head4, tail2) {
        var fail2, step4, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
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
            if (head4 === null) {
              cb(fail2 || step4)();
              return;
            }
            if (head4._3 !== EMPTY) {
              return;
            }
            switch (head4.tag) {
              case MAP:
                if (fail2 === null) {
                  head4._3 = util.right(head4._1(util.fromRight(step4)));
                  step4 = head4._3;
                } else {
                  head4._3 = fail2;
                }
                break;
              case APPLY:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (fail2) {
                  head4._3 = fail2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, fail2 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join3(fail2, null, null);
                      } else {
                        join3(fail2, tail2._1, tail2._2);
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
                  step4 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                  head4._3 = step4;
                }
                break;
              case ALT:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                  fail2 = step4 === lhs ? rhs : lhs;
                  step4 = null;
                  head4._3 = fail2;
                } else {
                  head4._3 = step4;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, step4 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join3(step4, null, null);
                      } else {
                        join3(step4, tail2._1, tail2._2);
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
            if (tail2 === null) {
              head4 = null;
            } else {
              head4 = tail2._1;
              tail2 = tail2._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join3(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step4 = par;
        var head4 = null;
        var tail2 = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step4.tag) {
                  case MAP:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(MAP, step4._1, EMPTY, EMPTY);
                    step4 = step4._2;
                    break;
                  case APPLY:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(APPLY, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  case ALT:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(ALT, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step4;
                    step4 = new Aff2(FORKED, fid, new Aff2(CONS, head4, tail2), EMPTY);
                    tmp = Fiber(util, supervisor, tmp);
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
                if (head4 === null) {
                  break loop;
                }
                if (head4._1 === EMPTY) {
                  head4._1 = step4;
                  status = CONTINUE;
                  step4 = head4._2;
                  head4._2 = EMPTY;
                } else {
                  head4._2 = step4;
                  step4 = head4;
                  if (tail2 === null) {
                    head4 = null;
                  } else {
                    head4 = tail2._1;
                    tail2 = tail2._2;
                  }
                }
            }
          }
        root = step4;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error4, cb2) {
        interrupt = util.left(error4);
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
        var newKills = kill2(error4, root, cb2);
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
      run3();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential3(util, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util, supervisor, par, cb);
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
        return Aff.Bind(aff, function(value12) {
          return Aff.Pure(f(value12));
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
  function _makeFiber(util, aff) {
    return function() {
      return Aff.Fiber(util, null, aff);
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
    function clearDelay(n, t) {
      if (n === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t);
      } else {
        return clearTimeout(t);
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
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map28 = map(Monad0.Bind1().Apply0().Functor0());
    var pure20 = pure(Monad0.Applicative0());
    return function(a2) {
      return catchError1(map28(Right.create)(a2))(function($52) {
        return pure20(Left.create($52));
      });
    };
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

  // output/Control.Monad.Except.Trans/index.js
  var map6 = /* @__PURE__ */ map(functorEither);
  var ExceptT = function(x) {
    return x;
  };
  var runExceptT = function(v) {
    return v;
  };
  var mapExceptT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map112(map6(f)));
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
    var bind19 = bind(dictMonad.Bind1());
    var pure20 = pure(dictMonad.Applicative0());
    return {
      bind: function(v) {
        return function(k) {
          return bind19(v)(either(function($187) {
            return pure20(Left.create($187));
          })(function(a2) {
            var v1 = k(a2);
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

  // output/Data.Profunctor/index.js
  var identity5 = /* @__PURE__ */ identity(categoryFn);
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
      return dimap1(identity5)(b2c);
    };
  };

  // output/Control.Parallel.Class/index.js
  var sequential = function(dict) {
    return dict.sequential;
  };
  var parallel = function(dict) {
    return dict.parallel;
  };

  // output/Control.Parallel/index.js
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var parTraverse_ = function(dictParallel) {
    var sequential3 = sequential(dictParallel);
    var traverse_7 = traverse_(dictParallel.Applicative1());
    var parallel3 = parallel(dictParallel);
    return function(dictFoldable) {
      var traverse_14 = traverse_7(dictFoldable);
      return function(f) {
        var $48 = traverse_14(function($50) {
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
      return parTraverse_1(dictFoldable)(identity6);
    };
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
  var $runtime_lazy3 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var pure2 = /* @__PURE__ */ pure(applicativeEffect);
  var $$void3 = /* @__PURE__ */ $$void(functorEffect);
  var map7 = /* @__PURE__ */ map(functorEffect);
  var Canceler = function(x) {
    return x;
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
    var unsafeFromRight = function(v) {
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      if (v instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
    };
    var unsafeFromLeft = function(v) {
      if (v instanceof Left) {
        return v.value0;
      }
      ;
      if (v instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
    };
    var isLeft2 = function(v) {
      if (v instanceof Left) {
        return true;
      }
      ;
      if (v instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
    };
    return {
      isLeft: isLeft2,
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
    return function __do2() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var delay = function(v) {
    return _delay(Right.create, v);
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
    return function(a2) {
      return bracket(pure22(unit))($$const(fin))($$const(a2));
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
  var joinFiber = function(v) {
    return makeAff(function(k) {
      return map7(effectCanceler)(v.join(k));
    });
  };
  var functorFiber = {
    map: function(f) {
      return function(t) {
        return unsafePerformEffect(makeFiber(map1(f)(joinFiber(t))));
      };
    }
  };
  var killFiber = function(e) {
    return function(v) {
      return bind1(liftEffect2(v.isSuspended))(function(suspended) {
        if (suspended) {
          return liftEffect2($$void3(v.kill(e, $$const(pure2(unit)))));
        }
        ;
        return makeAff(function(k) {
          return map7(effectCanceler)(v.kill(e, k));
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
      var go2 = function(a2) {
        return bind1(k(a2))(function(res) {
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
    var v = null;
    return function() {
      if (thunk === void 0)
        return v;
      v = thunk();
      thunk = void 0;
      return v;
    };
  };
  var force = function(l) {
    return l();
  };

  // output/Data.Lazy/index.js
  var functorLazy = {
    map: function(f) {
      return function(l) {
        return defer2(function(v) {
          return f(force(l));
        });
      };
    }
  };

  // output/Effect.Aff.Class/index.js
  var monadAffAff = {
    liftAff: /* @__PURE__ */ identity(categoryFn),
    MonadEffect0: function() {
      return monadEffectAff;
    }
  };
  var liftAff = function(dict) {
    return dict.liftAff;
  };

  // output/Effect.Now/foreign.js
  function now() {
    return Date.now();
  }

  // output/Data.Date/foreign.js
  var createDate = function(y, m, d) {
    var date2 = new Date(Date.UTC(y, m, d));
    if (y >= 0 && y < 100) {
      date2.setUTCFullYear(y);
    }
    return date2;
  };
  function canonicalDateImpl(ctor, y, m, d) {
    var date2 = createDate(y, m - 1, d);
    return ctor(date2.getUTCFullYear())(date2.getUTCMonth() + 1)(date2.getUTCDate());
  }

  // output/Data.Date.Component/index.js
  var $runtime_lazy4 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
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
    eq: function(x) {
      return function(y) {
        if (x instanceof January && y instanceof January) {
          return true;
        }
        ;
        if (x instanceof February && y instanceof February) {
          return true;
        }
        ;
        if (x instanceof March && y instanceof March) {
          return true;
        }
        ;
        if (x instanceof April && y instanceof April) {
          return true;
        }
        ;
        if (x instanceof May && y instanceof May) {
          return true;
        }
        ;
        if (x instanceof June && y instanceof June) {
          return true;
        }
        ;
        if (x instanceof July && y instanceof July) {
          return true;
        }
        ;
        if (x instanceof August && y instanceof August) {
          return true;
        }
        ;
        if (x instanceof September && y instanceof September) {
          return true;
        }
        ;
        if (x instanceof October && y instanceof October) {
          return true;
        }
        ;
        if (x instanceof November && y instanceof November) {
          return true;
        }
        ;
        if (x instanceof December && y instanceof December) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var ordMonth = {
    compare: function(x) {
      return function(y) {
        if (x instanceof January && y instanceof January) {
          return EQ.value;
        }
        ;
        if (x instanceof January) {
          return LT.value;
        }
        ;
        if (y instanceof January) {
          return GT.value;
        }
        ;
        if (x instanceof February && y instanceof February) {
          return EQ.value;
        }
        ;
        if (x instanceof February) {
          return LT.value;
        }
        ;
        if (y instanceof February) {
          return GT.value;
        }
        ;
        if (x instanceof March && y instanceof March) {
          return EQ.value;
        }
        ;
        if (x instanceof March) {
          return LT.value;
        }
        ;
        if (y instanceof March) {
          return GT.value;
        }
        ;
        if (x instanceof April && y instanceof April) {
          return EQ.value;
        }
        ;
        if (x instanceof April) {
          return LT.value;
        }
        ;
        if (y instanceof April) {
          return GT.value;
        }
        ;
        if (x instanceof May && y instanceof May) {
          return EQ.value;
        }
        ;
        if (x instanceof May) {
          return LT.value;
        }
        ;
        if (y instanceof May) {
          return GT.value;
        }
        ;
        if (x instanceof June && y instanceof June) {
          return EQ.value;
        }
        ;
        if (x instanceof June) {
          return LT.value;
        }
        ;
        if (y instanceof June) {
          return GT.value;
        }
        ;
        if (x instanceof July && y instanceof July) {
          return EQ.value;
        }
        ;
        if (x instanceof July) {
          return LT.value;
        }
        ;
        if (y instanceof July) {
          return GT.value;
        }
        ;
        if (x instanceof August && y instanceof August) {
          return EQ.value;
        }
        ;
        if (x instanceof August) {
          return LT.value;
        }
        ;
        if (y instanceof August) {
          return GT.value;
        }
        ;
        if (x instanceof September && y instanceof September) {
          return EQ.value;
        }
        ;
        if (x instanceof September) {
          return LT.value;
        }
        ;
        if (y instanceof September) {
          return GT.value;
        }
        ;
        if (x instanceof October && y instanceof October) {
          return EQ.value;
        }
        ;
        if (x instanceof October) {
          return LT.value;
        }
        ;
        if (y instanceof October) {
          return GT.value;
        }
        ;
        if (x instanceof November && y instanceof November) {
          return EQ.value;
        }
        ;
        if (x instanceof November) {
          return LT.value;
        }
        ;
        if (y instanceof November) {
          return GT.value;
        }
        ;
        if (x instanceof December && y instanceof December) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Date.Component (line 0, column 0 - line 0, column 0): " + [x.constructor.name, y.constructor.name]);
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
    toEnum: function(v) {
      if (v === 1) {
        return new Just(January.value);
      }
      ;
      if (v === 2) {
        return new Just(February.value);
      }
      ;
      if (v === 3) {
        return new Just(March.value);
      }
      ;
      if (v === 4) {
        return new Just(April.value);
      }
      ;
      if (v === 5) {
        return new Just(May.value);
      }
      ;
      if (v === 6) {
        return new Just(June.value);
      }
      ;
      if (v === 7) {
        return new Just(July.value);
      }
      ;
      if (v === 8) {
        return new Just(August.value);
      }
      ;
      if (v === 9) {
        return new Just(September.value);
      }
      ;
      if (v === 10) {
        return new Just(October.value);
      }
      ;
      if (v === 11) {
        return new Just(November.value);
      }
      ;
      if (v === 12) {
        return new Just(December.value);
      }
      ;
      return Nothing.value;
    },
    fromEnum: function(v) {
      if (v instanceof January) {
        return 1;
      }
      ;
      if (v instanceof February) {
        return 2;
      }
      ;
      if (v instanceof March) {
        return 3;
      }
      ;
      if (v instanceof April) {
        return 4;
      }
      ;
      if (v instanceof May) {
        return 5;
      }
      ;
      if (v instanceof June) {
        return 6;
      }
      ;
      if (v instanceof July) {
        return 7;
      }
      ;
      if (v instanceof August) {
        return 8;
      }
      ;
      if (v instanceof September) {
        return 9;
      }
      ;
      if (v instanceof October) {
        return 10;
      }
      ;
      if (v instanceof November) {
        return 11;
      }
      ;
      if (v instanceof December) {
        return 12;
      }
      ;
      throw new Error("Failed pattern match at Data.Date.Component (line 87, column 14 - line 99, column 19): " + [v.constructor.name]);
    },
    Bounded0: function() {
      return boundedMonth;
    },
    Enum1: function() {
      return $lazy_enumMonth(0);
    }
  };
  var $lazy_enumMonth = /* @__PURE__ */ $runtime_lazy4("enumMonth", "Data.Date.Component", function() {
    return {
      succ: function() {
        var $67 = toEnum(boundedEnumMonth);
        var $68 = fromEnum(boundedEnumMonth);
        return function($69) {
          return $67(function(v) {
            return v + 1 | 0;
          }($68($69)));
        };
      }(),
      pred: function() {
        var $70 = toEnum(boundedEnumMonth);
        var $71 = fromEnum(boundedEnumMonth);
        return function($72) {
          return $70(function(v) {
            return v - 1 | 0;
          }($71($72)));
        };
      }(),
      Ord0: function() {
        return ordMonth;
      }
    };
  });

  // output/Data.Date/index.js
  var fromEnum3 = /* @__PURE__ */ fromEnum(boundedEnumMonth);
  var fromJust5 = /* @__PURE__ */ fromJust();
  var toEnum2 = /* @__PURE__ */ toEnum(boundedEnumMonth);
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
  var canonicalDate = function(y) {
    return function(m) {
      return function(d) {
        var mkDate = function(y$prime) {
          return function(m$prime) {
            return function(d$prime) {
              return new $$Date(y$prime, fromJust5(toEnum2(m$prime)), d$prime);
            };
          };
        };
        return canonicalDateImpl(mkDate, y, fromEnum3(m), d);
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
  var time = function(v) {
    return v.value1;
  };

  // output/Data.DateTime.Instant/foreign.js
  function toDateTimeImpl(ctor) {
    return function(instant) {
      var dt2 = new Date(instant);
      return ctor(dt2.getUTCFullYear())(dt2.getUTCMonth() + 1)(dt2.getUTCDate())(dt2.getUTCHours())(dt2.getUTCMinutes())(dt2.getUTCSeconds())(dt2.getUTCMilliseconds());
    };
  }

  // output/Data.DateTime.Instant/index.js
  var fromJust6 = /* @__PURE__ */ fromJust();
  var toEnum3 = /* @__PURE__ */ toEnum(boundedEnumMonth);
  var toDateTime = /* @__PURE__ */ function() {
    var mkDateTime = function(y) {
      return function(mo) {
        return function(d) {
          return function(h) {
            return function(mi) {
              return function(s) {
                return function(ms) {
                  return new DateTime(canonicalDate(y)(fromJust6(toEnum3(mo)))(d), new Time(h, mi, s, ms));
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
  var map8 = /* @__PURE__ */ map(functorEffect);
  var nowTime = /* @__PURE__ */ map8(function($2) {
    return time(toDateTime($2));
  })(now);

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
    return function(v) {
      return runExists(function(v1) {
        return f(v1.value0)(v1.value1);
      })(v);
    };
  };
  var coyoneda = function(k) {
    return function(fi) {
      return mkExists(new CoyonedaF(k, fi));
    };
  };
  var functorCoyoneda = {
    map: function(f) {
      return function(v) {
        return runExists(function(v1) {
          return coyoneda(function($180) {
            return f(v1.value0($180));
          })(v1.value1);
        })(v);
      };
    }
  };
  var liftCoyoneda = /* @__PURE__ */ coyoneda(/* @__PURE__ */ identity(categoryFn));

  // output/Data.FoldableWithIndex/index.js
  var foldrWithIndex = function(dict) {
    return dict.foldrWithIndex;
  };
  var foldlWithIndex = function(dict) {
    return dict.foldlWithIndex;
  };
  var foldMapWithIndex = function(dict) {
    return dict.foldMapWithIndex;
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
  var singleton4 = function(dictPlus) {
    var empty8 = empty(dictPlus);
    return function(a2) {
      return new NonEmpty(a2, empty8);
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
  var NonEmptyList = function(x) {
    return x;
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
            $tco_var_v = new Cons(v1, v);
            $copy_v1 = v1.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v2) {
            if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
              return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
            }
            ;
            if (v2 instanceof Cons && v2.value1 instanceof Nil) {
              return new Cons(f(v2.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v2) {
            return function($copy_v3) {
              var $tco_var_v2 = $copy_v2;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v2, v3) {
                if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v2 = v2.value1;
                  $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
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
          return reverseUnrolledMap(v)(unrolledMap(v1));
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
  var map9 = /* @__PURE__ */ map(functorList);
  var foldableList = {
    foldr: function(f) {
      return function(b2) {
        var rev3 = function() {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1) {
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return v;
                }
                ;
                if (v1 instanceof Cons) {
                  $tco_var_v = new Cons(v1.value0, v);
                  $copy_v1 = v1.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
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
          function $tco_loop(b2, v) {
            if (v instanceof Nil) {
              $tco_done1 = true;
              return b2;
            }
            ;
            if (v instanceof Cons) {
              $tco_var_b = f(b2)(v.value0);
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
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
      var append22 = append(dictMonoid.Semigroup0());
      var mempty3 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $286 = append22(acc);
          return function($287) {
            return $286(f($287));
          };
        })(mempty3);
      };
    }
  };
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
  var applyList = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v instanceof Cons) {
          return append1(map9(v.value0)(v1))(apply(applyList)(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorList;
    }
  };
  var bindList = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v instanceof Cons) {
          return append1(v1(v.value0))(bind(bindList)(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.List.Types (line 164, column 1 - line 166, column 37): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyList;
    }
  };
  var applicativeList = {
    pure: function(a2) {
      return new Cons(a2, Nil.value);
    },
    Apply0: function() {
      return applyList;
    }
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
  var map10 = /* @__PURE__ */ map(functorMaybe);
  var uncons3 = function(v) {
    if (v instanceof Nil) {
      return Nothing.value;
    }
    ;
    if (v instanceof Cons) {
      return new Just({
        head: v.value0,
        tail: v.value1
      });
    }
    ;
    throw new Error("Failed pattern match at Data.List (line 259, column 1 - line 259, column 66): " + [v.constructor.name]);
  };
  var toUnfoldable = function(dictUnfoldable) {
    return unfoldr(dictUnfoldable)(function(xs) {
      return map10(function(rec) {
        return new Tuple(rec.head, rec.tail);
      })(uncons3(xs));
    });
  };
  var reverse2 = /* @__PURE__ */ function() {
    var go2 = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Nil) {
            $tco_done = true;
            return v;
          }
          ;
          if (v1 instanceof Cons) {
            $tco_var_v = new Cons(v1.value0, v);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v.constructor.name, v1.constructor.name]);
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
  var $$null = function(v) {
    if (v instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var fromFoldable2 = function(dictFoldable) {
    return foldr(dictFoldable)(Cons.create)(Nil.value);
  };

  // output/Data.List.Lazy.Types/index.js
  var unwrap2 = /* @__PURE__ */ unwrap();
  var List = function(x) {
    return x;
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
  var nil = /* @__PURE__ */ defer2(function(v) {
    return Nil2.value;
  });
  var step = function($319) {
    return force(unwrap2($319));
  };
  var lazyList = {
    defer: function(f) {
      return defer2(function($320) {
        return step(f($320));
      });
    }
  };
  var defer3 = /* @__PURE__ */ defer(lazyList);
  var cons = function(x) {
    return function(xs) {
      return defer2(function(v) {
        return new Cons2(x, xs);
      });
    };
  };
  var foldableList2 = {
    foldr: function(op) {
      return function(z) {
        return function(xs) {
          var rev3 = foldl(foldableList2)(flip(cons))(nil);
          return foldl(foldableList2)(flip(op))(z)(rev3(xs));
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
            var v = step(xs);
            if (v instanceof Nil2) {
              $tco_done = true;
              return b2;
            }
            ;
            if (v instanceof Cons2) {
              $tco_var_b = op(b2)(v.value0);
              $copy_xs = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 127, column 7 - line 129, column 40): " + [v.constructor.name]);
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
      var append22 = append(dictMonoid.Semigroup0());
      var mempty3 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList2)(function(b2) {
          return function(a2) {
            return append22(b2)(f(a2));
          };
        })(mempty3);
      };
    }
  };
  var unfoldable1List = {
    unfoldr1: /* @__PURE__ */ function() {
      var go2 = function(f) {
        return function(b2) {
          return defer3(function(v) {
            var v1 = f(b2);
            if (v1.value1 instanceof Just) {
              return cons(v1.value0)(go2(f)(v1.value1.value0));
            }
            ;
            if (v1.value1 instanceof Nothing) {
              return cons(v1.value0)(nil);
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 151, column 28 - line 153, column 33): " + [v1.constructor.name]);
          });
        };
      };
      return go2;
    }()
  };
  var unfoldableList = {
    unfoldr: /* @__PURE__ */ function() {
      var go2 = function(f) {
        return function(b2) {
          return defer3(function(v) {
            var v1 = f(b2);
            if (v1 instanceof Nothing) {
              return nil;
            }
            ;
            if (v1 instanceof Just) {
              return cons(v1.value0.value0)(go2(f)(v1.value0.value1));
            }
            ;
            throw new Error("Failed pattern match at Data.List.Lazy.Types (line 157, column 28 - line 159, column 39): " + [v1.constructor.name]);
          });
        };
      };
      return go2;
    }(),
    Unfoldable10: function() {
      return unfoldable1List;
    }
  };

  // output/Data.List.Lazy/index.js
  var map11 = /* @__PURE__ */ map(functorLazy);
  var unwrap3 = /* @__PURE__ */ unwrap();
  var filter = function(p2) {
    var go2 = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v) {
        if (v instanceof Nil2) {
          $tco_done = true;
          return Nil2.value;
        }
        ;
        if (v instanceof Cons2) {
          if (p2(v.value0)) {
            $tco_done = true;
            return new Cons2(v.value0, filter(p2)(v.value1));
          }
          ;
          if (otherwise) {
            $copy_v = step(v.value1);
            return;
          }
          ;
        }
        ;
        throw new Error("Failed pattern match at Data.List.Lazy (line 416, column 3 - line 416, column 15): " + [v.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    var $344 = map11(go2);
    return function($345) {
      return List($344(unwrap3($345)));
    };
  };

  // output/Data.Map.Internal/index.js
  var identity7 = /* @__PURE__ */ identity(categoryFn);
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
    return function(v) {
      return new Two(Leaf.value, k, v, Leaf.value);
    };
  };
  var toUnfoldable2 = function(dictUnfoldable) {
    var unfoldr3 = unfoldr(dictUnfoldable);
    return function(m) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Nil) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Cons) {
            if (v.value0 instanceof Leaf) {
              $copy_v = v.value1;
              return;
            }
            ;
            if (v.value0 instanceof Two && (v.value0.value0 instanceof Leaf && v.value0.value3 instanceof Leaf)) {
              $tco_done = true;
              return new Just(new Tuple(new Tuple(v.value0.value1, v.value0.value2), v.value1));
            }
            ;
            if (v.value0 instanceof Two && v.value0.value0 instanceof Leaf) {
              $tco_done = true;
              return new Just(new Tuple(new Tuple(v.value0.value1, v.value0.value2), new Cons(v.value0.value3, v.value1)));
            }
            ;
            if (v.value0 instanceof Two) {
              $copy_v = new Cons(v.value0.value0, new Cons(singleton5(v.value0.value1)(v.value0.value2), new Cons(v.value0.value3, v.value1)));
              return;
            }
            ;
            if (v.value0 instanceof Three) {
              $copy_v = new Cons(v.value0.value0, new Cons(singleton5(v.value0.value1)(v.value0.value2), new Cons(v.value0.value3, new Cons(singleton5(v.value0.value4)(v.value0.value5), new Cons(v.value0.value6, v.value1)))));
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 624, column 18 - line 633, column 71): " + [v.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 623, column 3 - line 623, column 19): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return unfoldr3(go2)(new Cons(m, Nil.value));
    };
  };
  var toUnfoldable1 = /* @__PURE__ */ toUnfoldable2(unfoldableList);
  var toAscArray = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var showMap = function(dictShow) {
    var showTuple2 = showTuple(dictShow);
    return function(dictShow1) {
      var show8 = show(showArray(showTuple2(dictShow1)));
      return {
        show: function(m) {
          return "(fromFoldable " + (show8(toAscArray(m)) + ")");
        }
      };
    };
  };
  var lookup = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Two) {
            var v2 = compare4(k)(v.value1);
            if (v2 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            if (v2 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          if (v instanceof Three) {
            var v3 = compare4(k)(v.value1);
            if (v3 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            var v4 = compare4(k)(v.value4);
            if (v4 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value5);
            }
            ;
            if (v3 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            if (v4 instanceof GT) {
              $copy_v = v.value6;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v.constructor.name]);
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
    var lookup14 = lookup(dictOrd);
    return function(k) {
      return function(m) {
        return isJust(lookup14(k)(m));
      };
    };
  };
  var functorMap = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v1 instanceof Two) {
          return new Two(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3));
        }
        ;
        if (v1 instanceof Three) {
          return new Three(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3), v1.value4, v(v1.value5), map(functorMap)(v)(v1.value6));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 116, column 1 - line 119, column 110): " + [v.constructor.name, v1.constructor.name]);
      };
    }
  };
  var fromZipper = function($copy_dictOrd) {
    return function($copy_v) {
      return function($copy_v1) {
        var $tco_var_dictOrd = $copy_dictOrd;
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(dictOrd, v, v1) {
          if (v instanceof Nil) {
            $tco_done = true;
            return v1;
          }
          ;
          if (v instanceof Cons) {
            if (v.value0 instanceof TwoLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v1, v.value0.value0, v.value0.value1, v.value0.value2);
              return;
            }
            ;
            if (v.value0 instanceof TwoRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v.value0.value0, v.value0.value1, v.value0.value2, v1);
              return;
            }
            ;
            if (v.value0 instanceof ThreeLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeMiddle) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v1, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, v1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v.constructor.name, v1.constructor.name]);
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
    var compare4 = compare(dictOrd);
    return function(k) {
      return function(v) {
        var up = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v1, v2) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
              }
              ;
              if (v1 instanceof Cons) {
                if (v1.value0 instanceof TwoLeft) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                }
                ;
                if (v1.value0 instanceof TwoRight) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
                }
                ;
                if (v1.value0 instanceof ThreeLeft) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeMiddle) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeRight) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v2.constructor.name]);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v2.constructor.name]);
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
            function $tco_loop(v1, v2) {
              if (v2 instanceof Leaf) {
                $tco_done1 = true;
                return up(v1)(new KickUp(Leaf.value, k, v, Leaf.value));
              }
              ;
              if (v2 instanceof Two) {
                var v3 = compare4(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Two(v2.value0, k, v, v2.value3));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new TwoLeft(v2.value1, v2.value2, v2.value3), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new TwoRight(v2.value0, v2.value1, v2.value2), v1);
                $copy_v2 = v2.value3;
                return;
              }
              ;
              if (v2 instanceof Three) {
                var v3 = compare4(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, k, v, v2.value3, v2.value4, v2.value5, v2.value6));
                }
                ;
                var v4 = compare4(k)(v2.value4);
                if (v4 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, k, v, v2.value6));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeLeft(v2.value1, v2.value2, v2.value3, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                if (v3 instanceof GT && v4 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeMiddle(v2.value0, v2.value1, v2.value2, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value3;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new ThreeRight(v2.value0, v2.value1, v2.value2, v2.value3, v2.value4, v2.value5), v1);
                $copy_v2 = v2.value6;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v2.constructor.name]);
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
    var compare4 = compare(dictOrd);
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
          function $tco_loop(ctx, m) {
            if (m instanceof Two && (m.value0 instanceof Leaf && m.value3 instanceof Leaf)) {
              $tco_done1 = true;
              return up(ctx)(Leaf.value);
            }
            ;
            if (m instanceof Two) {
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three && (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf))) {
              $tco_done1 = true;
              return up(new Cons(new TwoRight(Leaf.value, m.value1, m.value2), ctx))(Leaf.value);
            }
            ;
            if (m instanceof Three) {
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
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
        function $tco_loop(m) {
          if (m instanceof Two && m.value3 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value1,
              value: m.value2
            };
          }
          ;
          if (m instanceof Two) {
            $copy_m = m.value3;
            return;
          }
          ;
          if (m instanceof Three && m.value6 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value4,
              value: m.value5
            };
          }
          ;
          if (m instanceof Three) {
            $copy_m = m.value6;
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
          function $tco_loop(ctx, m) {
            if (m instanceof Leaf) {
              $tco_done3 = true;
              return Nothing.value;
            }
            ;
            if (m instanceof Two) {
              var v = compare4(k)(m.value1);
              if (m.value3 instanceof Leaf && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, up(ctx)(Leaf.value)));
              }
              ;
              if (v instanceof EQ) {
                var max6 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new TwoLeft(max6.key, max6.value, m.value3), ctx))(m.value0)));
              }
              ;
              if (v instanceof LT) {
                $tco_var_ctx = new Cons(new TwoLeft(m.value1, m.value2, m.value3), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three) {
              var leaves = function() {
                if (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf)) {
                  return true;
                }
                ;
                return false;
              }();
              var v = compare4(k)(m.value4);
              var v3 = compare4(k)(m.value1);
              if (leaves && v3 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, fromZipper1(ctx)(new Two(Leaf.value, m.value4, m.value5, Leaf.value))));
              }
              ;
              if (leaves && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, fromZipper1(ctx)(new Two(Leaf.value, m.value1, m.value2, Leaf.value))));
              }
              ;
              if (v3 instanceof EQ) {
                var max6 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new ThreeLeft(max6.key, max6.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
              }
              ;
              if (v instanceof EQ) {
                var max6 = maxNode(m.value3);
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, removeMaxNode(new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, max6.key, max6.value, m.value6), ctx))(m.value3)));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeLeft(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value3;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 525, column 16 - line 548, column 80): " + [m.constructor.name]);
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
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(z)(m.value3)))(m.value0);
          }
          ;
          if (m instanceof Three) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(f(m.value5)(foldr(foldableMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 133, column 17 - line 136, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldl: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3);
          }
          ;
          if (m instanceof Three) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 137, column 17 - line 140, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      var append22 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m) {
          if (m instanceof Leaf) {
            return mempty3;
          }
          ;
          if (m instanceof Two) {
            return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(foldMap(foldableMap)(dictMonoid)(f)(m.value3)));
          }
          ;
          if (m instanceof Three) {
            return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(append22(foldMap(foldableMap)(dictMonoid)(f)(m.value3))(append22(f(m.value5))(foldMap(foldableMap)(dictMonoid)(f)(m.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 141, column 17 - line 144, column 93): " + [m.constructor.name]);
        };
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value3)))(m.value0);
          }
          ;
          if (m instanceof Three) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(f(m.value4)(m.value5)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 147, column 26 - line 150, column 120): " + [m.constructor.name]);
        };
      };
    },
    foldlWithIndex: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3);
          }
          ;
          if (m instanceof Three) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value4)(foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 151, column 26 - line 154, column 120): " + [m.constructor.name]);
        };
      };
    },
    foldMapWithIndex: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      var append22 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m) {
          if (m instanceof Leaf) {
            return mempty3;
          }
          ;
          if (m instanceof Two) {
            return append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append22(f(m.value1)(m.value2))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3)));
          }
          ;
          if (m instanceof Three) {
            return append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append22(f(m.value1)(m.value2))(append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3))(append22(f(m.value4)(m.value5))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 155, column 26 - line 158, column 128): " + [m.constructor.name]);
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
      return function(v) {
        return function(acc) {
          return new Cons(k, acc);
        };
      };
    })(Nil.value);
  }();
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
              var go2 = function(v) {
                if (v instanceof Leaf) {
                  return memptyValue;
                }
                ;
                if (v instanceof Two) {
                  return appendFn(appendFn(function() {
                    var $819 = tooSmall(v.value1);
                    if ($819) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value0);
                  }())(function() {
                    var $820 = inBounds(v.value1);
                    if ($820) {
                      return f(v.value1)(v.value2);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $821 = tooLarge(v.value1);
                    if ($821) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value3);
                  }());
                }
                ;
                if (v instanceof Three) {
                  return appendFn(appendFn(appendFn(appendFn(function() {
                    var $826 = tooSmall(v.value1);
                    if ($826) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value0);
                  }())(function() {
                    var $827 = inBounds(v.value1);
                    if ($827) {
                      return f(v.value1)(v.value2);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $828 = tooSmall(v.value4) || tooLarge(v.value1);
                    if ($828) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value3);
                  }()))(function() {
                    var $829 = inBounds(v.value4);
                    if ($829) {
                      return f(v.value4)(v.value5);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $830 = tooLarge(v.value4);
                    if ($830) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value6);
                  }());
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 403, column 10 - line 415, column 67): " + [v.constructor.name]);
              };
              return go2;
            };
          };
        };
      };
    };
  };
  var findMin = /* @__PURE__ */ function() {
    var go2 = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Leaf) {
            $tco_done = true;
            return v;
          }
          ;
          if (v1 instanceof Two) {
            $tco_var_v = new Just({
              key: v1.value1,
              value: v1.value2
            });
            $copy_v1 = v1.value0;
            return;
          }
          ;
          if (v1 instanceof Three) {
            $tco_var_v = new Just({
              key: v1.value1,
              value: v1.value2
            });
            $copy_v1 = v1.value0;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 338, column 5 - line 338, column 22): " + [v.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return go2(Nothing.value);
  }();
  var eqMap = function(dictEq) {
    var eqTuple2 = eqTuple(dictEq);
    return function(dictEq1) {
      var eq14 = eq(eqArray(eqTuple2(dictEq1)));
      return {
        eq: function(m1) {
          return function(m2) {
            return eq14(toAscArray(m1))(toAscArray(m2));
          };
        }
      };
    };
  };
  var empty2 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var fromFoldable3 = function(dictOrd) {
    var insert13 = insert(dictOrd);
    return function(dictFoldable) {
      return foldl(dictFoldable)(function(m) {
        return function(v) {
          return insert13(v.value0)(v.value1)(m);
        };
      })(empty2);
    };
  };
  var filterWithKey = function(dictOrd) {
    var fromFoldable13 = fromFoldable3(dictOrd)(foldableList2);
    return function(predicate) {
      var $927 = filter(uncurry(predicate));
      return function($928) {
        return fromFoldable13($927(toUnfoldable1($928)));
      };
    };
  };
  var filter2 = function(dictOrd) {
    var filterWithKey1 = filterWithKey(dictOrd);
    return function(predicate) {
      return filterWithKey1($$const(predicate));
    };
  };
  var mapMaybeWithKey = function(dictOrd) {
    var insert13 = insert(dictOrd);
    return function(f) {
      return foldrWithIndex2(function(k) {
        return function(a2) {
          return function(acc) {
            return maybe(acc)(function(b2) {
              return insert13(k)(b2)(acc);
            })(f(k)(a2));
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
  var $$delete = function(dictOrd) {
    var pop12 = pop(dictOrd);
    return function(k) {
      return function(m) {
        return maybe(m)(snd)(pop12(k)(m));
      };
    };
  };
  var catMaybes2 = function(dictOrd) {
    return mapMaybe2(dictOrd)(identity7);
  };
  var alter = function(dictOrd) {
    var lookup14 = lookup(dictOrd);
    var delete1 = $$delete(dictOrd);
    var insert13 = insert(dictOrd);
    return function(f) {
      return function(k) {
        return function(m) {
          var v = f(lookup14(k)(m));
          if (v instanceof Nothing) {
            return delete1(k)(m);
          }
          ;
          if (v instanceof Just) {
            return insert13(k)(v.value0)(m);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 596, column 15 - line 598, column 25): " + [v.constructor.name]);
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
            return function(m) {
              return function(v) {
                return alter1(function() {
                  var $936 = maybe(v)(f(v));
                  return function($937) {
                    return Just.create($936($937));
                  };
                }())(k)(m);
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
        return function(m) {
          return alter1(maybe(Nothing.value)(f))(k)(m);
        };
      };
    };
  };

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
    eq: function(v) {
      return function(v1) {
        return v.value0(v.value2)(v1.value2);
      };
    }
  };
  var ordOrdBox = {
    compare: function(v) {
      return function(v1) {
        return v.value1(v.value2)(v1.value2);
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
            return function(v) {
              return pop1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v);
            };
          };
        };
      };
    };
  };
  var lookup2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(v) {
              return lookup1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(v);
            };
          };
        };
      };
    };
  };
  var insert2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key2) {
            return function(val) {
              return function(v) {
                return insert1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key2)))(val)(v);
              };
            };
          };
        };
      };
    };
  };
  var foreachSlot = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMap);
    return function(v) {
      return function(k) {
        return traverse_7(function($54) {
          return k($54);
        })(v);
      };
    };
  };
  var empty3 = empty2;

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

  // output/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a2, r, f) {
    return a2 == null ? r : f(a2);
  }
  function notNull(x) {
    return x;
  }

  // output/Data.Nullable/index.js
  var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
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
  var step2 = function(v, a2) {
    return v.value2(v.value1, a2);
  };
  var mkStep = unsafeCoerce2;
  var halt = function(v) {
    return v.value3(v.value1);
  };
  var extract2 = /* @__PURE__ */ unStep(function(v) {
    return v.value0;
  });

  // output/Halogen.VDom.Types/index.js
  var map12 = /* @__PURE__ */ map(functorArray);
  var map13 = /* @__PURE__ */ map(functorTuple);
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
      return function(g) {
        return unGraft(function(v) {
          return graft(new Graft(function($63) {
            return f(v.value0($63));
          }, function($64) {
            return g(v.value1($64));
          }, v.value2));
        });
      };
    }
  };
  var bimap2 = /* @__PURE__ */ bimap(bifunctorGraft);
  var runGraft = /* @__PURE__ */ unGraft(function(v) {
    var go2 = function(v2) {
      if (v2 instanceof Text) {
        return new Text(v2.value0);
      }
      ;
      if (v2 instanceof Elem) {
        return new Elem(v2.value0, v2.value1, v.value0(v2.value2), map12(go2)(v2.value3));
      }
      ;
      if (v2 instanceof Keyed) {
        return new Keyed(v2.value0, v2.value1, v.value0(v2.value2), map12(map13(go2))(v2.value3));
      }
      ;
      if (v2 instanceof Widget) {
        return new Widget(v.value1(v2.value0));
      }
      ;
      if (v2 instanceof Grafted) {
        return new Grafted(bimap2(v.value0)(v.value1)(v2.value0));
      }
      ;
      throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v2.constructor.name]);
    };
    return go2(v.value2);
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
  function forE2(a2, f) {
    var b2 = [];
    for (var i2 = 0; i2 < a2.length; i2++) {
      b2.push(f(i2, a2[i2]));
    }
    return b2;
  }
  function forEachE(a2, f) {
    for (var i2 = 0; i2 < a2.length; i2++) {
      f(a2[i2]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i2 = 0; i2 < ks.length; i2++) {
      var k = ks[i2];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i2 = 0;
    while (1) {
      if (i2 < l1) {
        if (i2 < l2) {
          a3.push(f1(i2, a1[i2], a2[i2]));
        } else {
          f2(i2, a1[i2]);
        }
      } else if (i2 < l2) {
        a3.push(f3(i2, a2[i2]));
      } else {
        break;
      }
      i2++;
    }
    return a3;
  }
  function strMapWithIxE(as, fk, f) {
    var o = {};
    for (var i2 = 0; i2 < as.length; i2++) {
      var a2 = as[i2];
      var k = fk(a2);
      o[k] = f(k, i2, a2);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as, fk, f1, f2, f3) {
    var o2 = {};
    for (var i2 = 0; i2 < as.length; i2++) {
      var a2 = as[i2];
      var k = fk(a2);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i2, o1[k], a2);
      } else {
        o2[k] = f3(k, i2, a2);
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
  function refEq2(a2, b2) {
    return a2 === b2;
  }
  function createTextNode(s, doc) {
    return doc.createTextNode(s);
  }
  function setTextContent(s, n) {
    n.textContent = s;
  }
  function createElement(ns, name18, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name18);
    } else {
      return doc.createElement(name18);
    }
  }
  function insertChildIx(i2, a2, b2) {
    var n = b2.childNodes.item(i2) || null;
    if (n !== a2) {
      b2.insertBefore(a2, n);
    }
  }
  function removeChild(a2, b2) {
    if (b2 && a2.parentNode === b2) {
      b2.removeChild(a2);
    }
  }
  function parentNode(a2) {
    return a2.parentNode;
  }
  function setAttribute(ns, attr3, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr3, val);
    } else {
      el.setAttribute(attr3, val);
    }
  }
  function removeAttribute(ns, attr3, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr3);
    } else {
      el.removeAttribute(attr3);
    }
  }
  function hasAttribute(ns, attr3, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr3);
    } else {
      return el.hasAttribute(attr3);
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

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name18) {
    return function(doctype) {
      return doctype[name18];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name18) {
    return function(node) {
      return function() {
        return node[name18];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output/Web.DOM.ParentNode/index.js
  var map14 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map14(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.DOM.Element/index.js
  var toNode = unsafeCoerce2;

  // output/Halogen.VDom.DOM/index.js
  var $runtime_lazy5 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var haltWidget = function(v) {
    return halt(v.widget);
  };
  var $lazy_patchWidget = /* @__PURE__ */ $runtime_lazy5("patchWidget", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchWidget(291)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Widget) {
        var res = step2(state3.widget, vdom.value0);
        var res$prime = unStep(function(v) {
          return mkStep(new Step(v.value0, {
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
  var haltText = function(v) {
    var parent2 = parentNode(v.node);
    return removeChild(v.node, parent2);
  };
  var $lazy_patchText = /* @__PURE__ */ $runtime_lazy5("patchText", "Halogen.VDom.DOM", function() {
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
          setTextContent(vdom.value0, state3.node);
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
  var haltKeyed = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forInE(v.children, function(v1, s) {
      return halt(s);
    });
    return halt(v.attrs);
  };
  var haltElem = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forEachE(v.children, halt);
    return halt(v.attrs);
  };
  var eqElemSpec = function(ns1, v, ns2, v1) {
    var $63 = v === v1;
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
  var $lazy_patchElem = /* @__PURE__ */ $runtime_lazy5("patchElem", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchElem(135)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Elem && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        var v1 = length(state3.children);
        if (v1 === 0 && v === 0) {
          var attrs2 = step2(state3.attrs, vdom.value2);
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
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(ix4, s, v2) {
          var res = step2(s, v2);
          insertChildIx(ix4, extract2(res), state3.node);
          return res;
        };
        var onThat = function(ix4, v2) {
          var res = state3.build(v2);
          insertChildIx(ix4, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithIxE(state3.children, vdom.value3, onThese, onThis, onThat);
        var attrs2 = step2(state3.attrs, vdom.value2);
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
  var $lazy_patchKeyed = /* @__PURE__ */ $runtime_lazy5("patchKeyed", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchKeyed(222)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Keyed && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        if (state3.length === 0 && v === 0) {
          var attrs2 = step2(state3.attrs, vdom.value2);
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
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(v2, ix$prime, s, v3) {
          var res = step2(s, v3.value1);
          insertChildIx(ix$prime, extract2(res), state3.node);
          return res;
        };
        var onThat = function(v2, ix4, v3) {
          var res = state3.build(v3.value1);
          insertChildIx(ix4, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithKeyAndIxE(state3.children, vdom.value3, fst, onThese, onThis, onThat);
        var attrs2 = step2(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2,
          length: v
        };
        return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(261), haltKeyed));
      }
      ;
      haltKeyed(state3);
      return state3.build(vdom);
    };
  });
  var patchKeyed = /* @__PURE__ */ $lazy_patchKeyed(217);
  var buildWidget = function(v, build, w) {
    var res = v.buildWidget(v)(w);
    var res$prime = unStep(function(v1) {
      return mkStep(new Step(v1.value0, {
        build,
        widget: res
      }, patchWidget, haltWidget));
    })(res);
    return res$prime;
  };
  var buildText = function(v, build, s) {
    var node = createTextNode(s, v.document);
    var state3 = {
      build,
      node,
      value: s
    };
    return mkStep(new Step(node, state3, patchText, haltText));
  };
  var buildKeyed = function(v, build, ns1, name18, as1, ch1) {
    var el = createElement(toNullable(ns1), name18, v.document);
    var node = toNode(el);
    var onChild = function(v1, ix4, v2) {
      var res = build(v2.value1);
      insertChildIx(ix4, extract2(res), node);
      return res;
    };
    var children2 = strMapWithIxE(ch1, fst, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name18,
      children: children2,
      length: length(ch1)
    };
    return mkStep(new Step(node, state3, patchKeyed, haltKeyed));
  };
  var buildElem = function(v, build, ns1, name18, as1, ch1) {
    var el = createElement(toNullable(ns1), name18, v.document);
    var node = toNode(el);
    var onChild = function(ix4, child) {
      var res = build(child);
      insertChildIx(ix4, extract2(res), node);
      return res;
    };
    var children2 = forE2(ch1, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name18,
      children: children2
    };
    return mkStep(new Step(node, state3, patchElem, haltElem));
  };
  var buildVDom = function(spec) {
    var $lazy_build = $runtime_lazy5("build", "Halogen.VDom.DOM", function() {
      return function(v) {
        if (v instanceof Text) {
          return buildText(spec, $lazy_build(59), v.value0);
        }
        ;
        if (v instanceof Elem) {
          return buildElem(spec, $lazy_build(60), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Keyed) {
          return buildKeyed(spec, $lazy_build(61), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Widget) {
          return buildWidget(spec, $lazy_build(62), v.value0);
        }
        ;
        if (v instanceof Grafted) {
          return $lazy_build(63)(runGraft(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.VDom.DOM (line 58, column 27 - line 63, column 52): " + [v.constructor.name]);
      };
    });
    var build = $lazy_build(58);
    return build;
  };

  // output/Foreign/foreign.js
  function typeOf(value12) {
    return typeof value12;
  }
  var isArray = Array.isArray || function(value12) {
    return Object.prototype.toString.call(value12) === "[object Array]";
  };

  // output/Data.List.NonEmpty/index.js
  var singleton6 = /* @__PURE__ */ function() {
    var $200 = singleton4(plusList);
    return function($201) {
      return NonEmptyList($200($201));
    };
  }();
  var cons2 = function(y) {
    return function(v) {
      return new NonEmpty(y, new Cons(v.value0, v.value1));
    };
  };

  // output/Foreign.Object/foreign.js
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys2 = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Foreign.Object/index.js
  var lookup3 = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();

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
  var $runtime_lazy6 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
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
    var v = hasAttribute(nullImpl, key2, el);
    if (v) {
      return removeAttribute(nullImpl, key2, el);
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
  var propToStrKey = function(v) {
    if (v instanceof Attribute && v.value0 instanceof Just) {
      return "attr/" + (v.value0.value0 + (":" + v.value1));
    }
    ;
    if (v instanceof Attribute) {
      return "attr/:" + v.value1;
    }
    ;
    if (v instanceof Property) {
      return "prop/" + v.value0;
    }
    ;
    if (v instanceof Handler) {
      return "handler/" + v.value0;
    }
    ;
    if (v instanceof Ref) {
      return "ref";
    }
    ;
    throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 182, column 16 - line 187, column 16): " + [v.constructor.name]);
  };
  var propFromString = unsafeCoerce2;
  var propFromBoolean = unsafeCoerce2;
  var buildProp = function(emit) {
    return function(el) {
      var removeProp = function(prevEvents) {
        return function(v, v1) {
          if (v1 instanceof Attribute) {
            return removeAttribute(toNullable(v1.value0), v1.value1, el);
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
      var mbEmit = function(v) {
        if (v instanceof Just) {
          return emit(v.value0)();
        }
        ;
        return unit;
      };
      var haltProp = function(state3) {
        var v = lookup3("ref")(state3.props);
        if (v instanceof Just && v.value0 instanceof Ref) {
          return mbEmit(v.value0.value0(new Removed(el)));
        }
        ;
        return unit;
      };
      var diffProp = function(prevEvents, events) {
        return function(v, v1, v11, v2) {
          if (v11 instanceof Attribute && v2 instanceof Attribute) {
            var $66 = v11.value2 === v2.value2;
            if ($66) {
              return v2;
            }
            ;
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v11 instanceof Property && v2 instanceof Property) {
            var v4 = refEq2(v11.value1, v2.value1);
            if (v4) {
              return v2;
            }
            ;
            if (v2.value0 === "value") {
              var elVal = unsafeGetProperty("value", el);
              var $75 = refEq2(elVal, v2.value1);
              if ($75) {
                return v2;
              }
              ;
              setProperty(v2.value0, v2.value1, el);
              return v2;
            }
            ;
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v11 instanceof Handler && v2 instanceof Handler) {
            var handler3 = unsafeLookup(v2.value0, prevEvents);
            write(v2.value1)(snd(handler3))();
            pokeMutMap(v2.value0, handler3, events);
            return v2;
          }
          ;
          return v2;
        };
      };
      var applyProp = function(events) {
        return function(v, v1, v2) {
          if (v2 instanceof Attribute) {
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v2 instanceof Property) {
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v2 instanceof Handler) {
            var v3 = unsafeGetAny(v2.value0, events);
            if (unsafeHasAny(v2.value0, events)) {
              write(v2.value1)(snd(v3))();
              return v2;
            }
            ;
            var ref3 = $$new(v2.value1)();
            var listener = eventListener(function(ev) {
              return function __do2() {
                var f$prime = read(ref3)();
                return mbEmit(f$prime(ev));
              };
            })();
            pokeMutMap(v2.value0, new Tuple(listener, ref3), events);
            addEventListener(v2.value0, listener, el);
            return v2;
          }
          ;
          if (v2 instanceof Ref) {
            mbEmit(v2.value0(new Created(el)));
            return v2;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 113, column 5 - line 135, column 15): " + [v2.constructor.name]);
        };
      };
      var $lazy_patchProp = $runtime_lazy6("patchProp", "Halogen.VDom.DOM.Prop", function() {
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
  var HTML = function(x) {
    return x;
  };
  var widget = function($28) {
    return HTML(Widget.create($28));
  };
  var toPropValue = function(dict) {
    return dict.toPropValue;
  };
  var text = function($29) {
    return HTML(Text.create($29));
  };
  var prop = function(dictIsProp) {
    var toPropValue1 = toPropValue(dictIsProp);
    return function(v) {
      var $31 = Property.create(v);
      return function($32) {
        return $31(toPropValue1($32));
      };
    };
  };
  var isPropString = {
    toPropValue: propFromString
  };
  var isPropBoolean = {
    toPropValue: propFromBoolean
  };
  var handler = /* @__PURE__ */ function() {
    return Handler.create;
  }();
  var element = function(ns) {
    return function(name18) {
      return function(props) {
        return function(children2) {
          return new Elem(ns, name18, props, children2);
        };
      };
    };
  };
  var attr = function(ns) {
    return function(v) {
      return Attribute.create(ns)(v);
    };
  };

  // output/Control.Applicative.Free/index.js
  var identity8 = /* @__PURE__ */ identity(categoryFn);
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
    var pure20 = pure(dictApplicative);
    return function(fStack) {
      return function(valStack) {
        return function(nat) {
          return function(func) {
            return function(count) {
              if (func instanceof Pure) {
                return new Tuple(new Cons({
                  func: pure20(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Lift) {
                return new Tuple(new Cons({
                  func: nat(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Ap) {
                return goLeft(dictApplicative)(fStack)(cons2(func.value1)(valStack))(nat)(func.value0)(count + 1 | 0);
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
    var apply2 = apply(dictApplicative.Apply0());
    return function(fStack) {
      return function(vals) {
        return function(gVal) {
          if (fStack instanceof Nil) {
            return new Left(gVal);
          }
          ;
          if (fStack instanceof Cons) {
            var gRes = apply2(fStack.value0.func)(gVal);
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
      return function(x) {
        return mkAp(new Pure(f))(x);
      };
    }
  };
  var foldFreeAp = function(dictApplicative) {
    var goApply1 = goApply(dictApplicative);
    var pure20 = pure(dictApplicative);
    var goLeft1 = goLeft(dictApplicative);
    return function(nat) {
      return function(z) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
            if (v.value1.value0 instanceof Pure) {
              var v1 = goApply1(v.value0)(v.value1.value1)(pure20(v.value1.value0.value0));
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
            if (v.value1.value0 instanceof Lift) {
              var v1 = goApply1(v.value0)(v.value1.value1)(nat(v.value1.value0.value0));
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
            if (v.value1.value0 instanceof Ap) {
              var nextVals = new NonEmpty(v.value1.value0.value1, v.value1.value1);
              $copy_v = goLeft1(v.value0)(nextVals)(nat)(v.value1.value0.value0)(1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 53, column 5 - line 62, column 47): " + [v.value1.value0.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2(new Tuple(Nil.value, singleton6(z)));
      };
    };
  };
  var retractFreeAp = function(dictApplicative) {
    return foldFreeAp(dictApplicative)(identity8);
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
  var uncons4 = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
        $tco_done = true;
        return Nothing.value;
      }
      ;
      if (v.value0 instanceof Nil) {
        $copy_v = new CatQueue(reverse2(v.value1), Nil.value);
        return;
      }
      ;
      if (v.value0 instanceof Cons) {
        $tco_done = true;
        return new Just(new Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
      }
      ;
      throw new Error("Failed pattern match at Data.CatQueue (line 82, column 1 - line 82, column 63): " + [v.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var snoc2 = function(v) {
    return function(a2) {
      return new CatQueue(v.value0, new Cons(a2, v.value1));
    };
  };
  var $$null2 = function(v) {
    if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var empty5 = /* @__PURE__ */ function() {
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
  var link = function(v) {
    return function(v1) {
      if (v instanceof CatNil) {
        return v1;
      }
      ;
      if (v1 instanceof CatNil) {
        return v;
      }
      ;
      if (v instanceof CatCons) {
        return new CatCons(v.value0, snoc2(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.CatList (line 108, column 1 - line 108, column 54): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var foldr3 = function(k) {
    return function(b2) {
      return function(q2) {
        var foldl4 = function($copy_v) {
          return function($copy_v1) {
            return function($copy_v2) {
              var $tco_var_v = $copy_v;
              var $tco_var_v1 = $copy_v1;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1, v2) {
                if (v2 instanceof Nil) {
                  $tco_done = true;
                  return v1;
                }
                ;
                if (v2 instanceof Cons) {
                  $tco_var_v = v;
                  $tco_var_v1 = v(v1)(v2.value0);
                  $copy_v2 = v2.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.CatList (line 124, column 3 - line 124, column 59): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
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
              var v = uncons4(xs);
              if (v instanceof Nothing) {
                $tco_done1 = true;
                return foldl4(function(x) {
                  return function(i2) {
                    return i2(x);
                  };
                })(b2)(ys);
              }
              ;
              if (v instanceof Just) {
                $tco_var_xs = v.value0.value1;
                $copy_ys = new Cons(k(v.value0.value0), ys);
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CatList (line 120, column 14 - line 122, column 67): " + [v.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_xs, $copy_ys);
            }
            ;
            return $tco_result;
          };
        };
        return go2(q2)(Nil.value);
      };
    };
  };
  var uncons5 = function(v) {
    if (v instanceof CatNil) {
      return Nothing.value;
    }
    ;
    if (v instanceof CatCons) {
      return new Just(new Tuple(v.value0, function() {
        var $66 = $$null2(v.value1);
        if ($66) {
          return CatNil.value;
        }
        ;
        return foldr3(link)(CatNil.value)(v.value1);
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.CatList (line 99, column 1 - line 99, column 61): " + [v.constructor.name]);
  };
  var empty6 = /* @__PURE__ */ function() {
    return CatNil.value;
  }();
  var append2 = link;
  var cons3 = function(a2) {
    return function(cat) {
      return append2(new CatCons(a2, empty5))(cat);
    };
  };
  var singleton7 = function(a2) {
    return cons3(a2)(CatNil.value);
  };
  var semigroupCatList = {
    append: append2
  };
  var monoidCatList = /* @__PURE__ */ function() {
    return {
      mempty: CatNil.value,
      Semigroup0: function() {
        return semigroupCatList;
      }
    };
  }();
  var fromFoldable4 = function(dictFoldable) {
    var foldMap12 = foldMap(dictFoldable)(monoidCatList);
    return function(f) {
      return foldMap12(singleton7)(f);
    };
  };
  var snoc3 = function(cat) {
    return function(a2) {
      return append2(cat)(new CatCons(a2, empty5));
    };
  };

  // output/Control.Monad.Free/index.js
  var $runtime_lazy7 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var append3 = /* @__PURE__ */ append(semigroupCatList);
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
    function $tco_loop(v) {
      var runExpF = function(v22) {
        return v22;
      };
      var concatF = function(v22) {
        return function(r) {
          return new Free(v22.value0, append3(v22.value1)(r));
        };
      };
      if (v.value0 instanceof Return) {
        var v2 = uncons5(v.value1);
        if (v2 instanceof Nothing) {
          $tco_done = true;
          return new Return(v.value0.value0);
        }
        ;
        if (v2 instanceof Just) {
          $copy_v = concatF(runExpF(v2.value0.value0)(v.value0.value0))(v2.value0.value1);
          return;
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 227, column 7 - line 231, column 64): " + [v2.constructor.name]);
      }
      ;
      if (v.value0 instanceof Bind) {
        $tco_done = true;
        return new Bind(v.value0.value0, function(a2) {
          return concatF(v.value0.value1(a2))(v.value1);
        });
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 225, column 3 - line 233, column 56): " + [v.value0.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var fromView = function(f) {
    return new Free(f, empty6);
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
    bind: function(v) {
      return function(k) {
        return new Free(v.value0, snoc3(v.value1)(k));
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
  var $lazy_freeApply = /* @__PURE__ */ $runtime_lazy7("freeApply", "Control.Monad.Free", function() {
    return {
      apply: ap(freeMonad),
      Functor0: function() {
        return freeFunctor;
      }
    };
  });
  var pure3 = /* @__PURE__ */ pure(freeApplicative);
  var liftF = function(f) {
    return fromView(new Bind(f, function($192) {
      return pure3($192);
    }));
  };
  var foldFree = function(dictMonadRec) {
    var Monad0 = dictMonadRec.Monad0();
    var map112 = map(Monad0.Bind1().Apply0().Functor0());
    var pure111 = pure(Monad0.Applicative0());
    var tailRecM4 = tailRecM(dictMonadRec);
    return function(k) {
      var go2 = function(f) {
        var v = toView(f);
        if (v instanceof Return) {
          return map112(Done.create)(pure111(v.value0));
        }
        ;
        if (v instanceof Bind) {
          return map112(function($199) {
            return Loop.create(v.value1($199));
          })(k(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 158, column 10 - line 160, column 37): " + [v.constructor.name]);
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

  // output/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a2) {
    return function(b2) {
      return a2 === b2;
    };
  }

  // output/Unsafe.Reference/index.js
  var unsafeRefEq = reallyUnsafeRefEq;

  // output/Halogen.Subscription/index.js
  var $$void4 = /* @__PURE__ */ $$void(functorEffect);
  var bind3 = /* @__PURE__ */ bind(bindEffect);
  var append4 = /* @__PURE__ */ append(semigroupArray);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
  var unsubscribe = function(v) {
    return v;
  };
  var subscribe = function(v) {
    return function(k) {
      return v(function($76) {
        return $$void4(k($76));
      });
    };
  };
  var notify = function(v) {
    return function(a2) {
      return v(a2);
    };
  };
  var create = function __do() {
    var subscribers = $$new([])();
    return {
      emitter: function(k) {
        return function __do2() {
          modify_(function(v) {
            return append4(v)([k]);
          })(subscribers)();
          return modify_(deleteBy(unsafeRefEq)(k))(subscribers);
        };
      },
      listener: function(a2) {
        return bind3(read(subscribers))(traverse_1(function(k) {
          return k(a2);
        }));
      }
    };
  };

  // output/Halogen.Query.HalogenM/index.js
  var identity9 = /* @__PURE__ */ identity(categoryFn);
  var lookup4 = /* @__PURE__ */ lookup2();
  var SubscriptionId = function(x) {
    return x;
  };
  var ForkId = function(x) {
    return x;
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
  var HalogenM = function(x) {
    return x;
  };
  var subscribe2 = function(es) {
    return liftF(new Subscribe(function(v) {
      return es;
    }, identity9));
  };
  var raise = function(o) {
    return liftF(new Raise(o, unit));
  };
  var query = function() {
    return function(dictIsSymbol) {
      var lookup14 = lookup4(dictIsSymbol);
      return function(dictOrd) {
        var lookup23 = lookup14(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(q2) {
              return liftF(new ChildQuery2(mkChildQueryBox(new ChildQuery(function(dictApplicative) {
                var pure111 = pure(dictApplicative);
                return function(k) {
                  var $177 = maybe(pure111(Nothing.value))(k);
                  var $178 = lookup23(label5)(p2);
                  return function($179) {
                    return $177($178($179));
                  };
                };
              }, q2, identity9))));
            };
          };
        };
      };
    };
  };
  var ordSubscriptionId = ordInt;
  var ordForkId = ordInt;
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
  var functorHalogenM = freeFunctor;
  var fork = function(hmu) {
    return liftF(new Fork(hmu, identity9));
  };
  var bindHalogenM = freeBind;
  var bind4 = /* @__PURE__ */ bind(bindHalogenM);
  var applicativeHalogenM = freeApplicative;
  var pure4 = /* @__PURE__ */ pure(applicativeHalogenM);
  var monadRecHalogenM = {
    tailRecM: function(k) {
      return function(a2) {
        return bind4(k(a2))(function(v) {
          if (v instanceof Loop) {
            return tailRecM(monadRecHalogenM)(k)(v.value0);
          }
          ;
          if (v instanceof Done) {
            return pure4(v.value0);
          }
          ;
          throw new Error("Failed pattern match at Halogen.Query.HalogenM (line 105, column 26 - line 107, column 21): " + [v.constructor.name]);
        });
      };
    },
    Monad0: function() {
      return monadHalogenM;
    }
  };

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
    function Query2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Query2.create = function(value0) {
      return function(value1) {
        return new Query2(value0, value1);
      };
    };
    return Query2;
  }();

  // output/Halogen.VDom.Thunk/index.js
  var $runtime_lazy8 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var unsafeEqThunk = function(v, v1) {
    return refEq2(v.value0, v1.value0) && (refEq2(v.value1, v1.value1) && v.value1(v.value3, v1.value3));
  };
  var runThunk = function(v) {
    return v.value2(v.value3);
  };
  var buildThunk = function(toVDom) {
    var haltThunk = function(state3) {
      return halt(state3.vdom);
    };
    var $lazy_patchThunk = $runtime_lazy8("patchThunk", "Halogen.VDom.Thunk", function() {
      return function(state3, t2) {
        var $48 = unsafeEqThunk(state3.thunk, t2);
        if ($48) {
          return mkStep(new Step(extract2(state3.vdom), state3, $lazy_patchThunk(112), haltThunk));
        }
        ;
        var vdom = step2(state3.vdom, toVDom(runThunk(t2)));
        return mkStep(new Step(extract2(vdom), {
          vdom,
          thunk: t2
        }, $lazy_patchThunk(115), haltThunk));
      };
    });
    var patchThunk = $lazy_patchThunk(108);
    var renderThunk = function(spec) {
      return function(t) {
        var vdom = buildVDom(spec)(toVDom(runThunk(t)));
        return mkStep(new Step(extract2(vdom), {
          thunk: t,
          vdom
        }, patchThunk, haltThunk));
      };
    };
    return renderThunk;
  };

  // output/Halogen.Component/index.js
  var voidLeft3 = /* @__PURE__ */ voidLeft(functorHalogenM);
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var map15 = /* @__PURE__ */ map(functorHalogenM);
  var lookup5 = /* @__PURE__ */ lookup2();
  var pop3 = /* @__PURE__ */ pop2();
  var insert3 = /* @__PURE__ */ insert2();
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
    return function(v) {
      if (v instanceof Initialize) {
        return voidLeft3(traverse_3(args.handleAction)(args.initialize))(v.value0);
      }
      ;
      if (v instanceof Finalize) {
        return voidLeft3(traverse_3(args.handleAction)(args.finalize))(v.value0);
      }
      ;
      if (v instanceof Receive) {
        return voidLeft3(traverse_3(args.handleAction)(args.receive(v.value0)))(v.value1);
      }
      ;
      if (v instanceof Action2) {
        return voidLeft3(args.handleAction(v.value0))(v.value1);
      }
      ;
      if (v instanceof Query) {
        return unCoyoneda(function(g) {
          var $45 = map15(maybe(v.value1(unit))(g));
          return function($46) {
            return $45(args.handleQuery($46));
          };
        })(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Halogen.Component (line 182, column 15 - line 192, column 71): " + [v.constructor.name]);
    };
  };
  var mkComponentSlot = unsafeCoerce2;
  var mkComponent = unsafeCoerce2;
  var componentSlot = function() {
    return function(dictIsSymbol) {
      var lookup14 = lookup5(dictIsSymbol);
      var pop12 = pop3(dictIsSymbol);
      var insert13 = insert3(dictIsSymbol);
      return function(dictOrd) {
        var lookup23 = lookup14(dictOrd);
        var pop22 = pop12(dictOrd);
        var insert22 = insert13(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(comp) {
              return function(input3) {
                return function(output2) {
                  return mkComponentSlot({
                    get: lookup23(label5)(p2),
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

  // output/Halogen.HTML.Elements/index.js
  var element2 = /* @__PURE__ */ function() {
    return element(Nothing.value);
  }();
  var h2 = /* @__PURE__ */ element2("h2");
  var h2_ = /* @__PURE__ */ h2([]);
  var h3 = /* @__PURE__ */ element2("h3");
  var h3_ = /* @__PURE__ */ h3([]);
  var img = function(props) {
    return element2("img")(props)([]);
  };
  var span2 = /* @__PURE__ */ element2("span");
  var table = /* @__PURE__ */ element2("table");
  var table_ = /* @__PURE__ */ table([]);
  var td = /* @__PURE__ */ element2("td");
  var tr = /* @__PURE__ */ element2("tr");
  var tr_ = /* @__PURE__ */ tr([]);
  var div3 = /* @__PURE__ */ element2("div");
  var div_ = /* @__PURE__ */ div3([]);

  // output/Halogen.HTML.Properties/index.js
  var unwrap4 = /* @__PURE__ */ unwrap();
  var prop2 = function(dictIsProp) {
    return prop(dictIsProp);
  };
  var prop1 = /* @__PURE__ */ prop2(isPropBoolean);
  var prop22 = /* @__PURE__ */ prop2(isPropString);
  var src = /* @__PURE__ */ prop22("src");
  var id2 = /* @__PURE__ */ prop22("id");
  var draggable = /* @__PURE__ */ prop1("draggable");
  var classes = /* @__PURE__ */ function() {
    var $32 = prop22("className");
    var $33 = joinWith(" ");
    var $34 = map(functorArray)(unwrap4);
    return function($35) {
      return $32($33($34($35)));
    };
  }();
  var class_ = /* @__PURE__ */ function() {
    var $36 = prop22("className");
    return function($37) {
      return $36(unwrap4($37));
    };
  }();
  var attr2 = /* @__PURE__ */ function() {
    return attr(Nothing.value);
  }();
  var style = /* @__PURE__ */ attr2("style");

  // output/Component.Chat/index.js
  var show2 = /* @__PURE__ */ show(showInt);
  var power2 = /* @__PURE__ */ power(monoidString);
  var intercalate3 = /* @__PURE__ */ intercalate(foldableArray)(monoidString);
  var map16 = /* @__PURE__ */ map(functorArray);
  var bind5 = /* @__PURE__ */ bind(bindHalogenM);
  var forever2 = /* @__PURE__ */ forever(monadRecHalogenM);
  var gets2 = /* @__PURE__ */ gets(monadStateHalogenM);
  var discard2 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_3 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var fromDuration2 = /* @__PURE__ */ fromDuration(durationSeconds);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure5 = /* @__PURE__ */ pure(applicativeHalogenM);
  var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindHalogenM);
  var append12 = /* @__PURE__ */ append(semigroupArray);
  var voidLeft4 = /* @__PURE__ */ voidLeft(functorHalogenM);
  var put2 = /* @__PURE__ */ put(monadStateHalogenM);
  var InterruptingMessage = /* @__PURE__ */ function() {
    function InterruptingMessage2(value0) {
      this.value0 = value0;
    }
    ;
    InterruptingMessage2.create = function(value0) {
      return new InterruptingMessage2(value0);
    };
    return InterruptingMessage2;
  }();
  var QueuedMessages = /* @__PURE__ */ function() {
    function QueuedMessages2(value0) {
      this.value0 = value0;
    }
    ;
    QueuedMessages2.create = function(value0) {
      return new QueuedMessages2(value0);
    };
    return QueuedMessages2;
  }();
  var ClearMessages = /* @__PURE__ */ function() {
    function ClearMessages2() {
    }
    ;
    ClearMessages2.value = new ClearMessages2();
    return ClearMessages2;
  }();
  var Initialise = /* @__PURE__ */ function() {
    function Initialise4() {
    }
    ;
    Initialise4.value = new Initialise4();
    return Initialise4;
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
  var component = function(dictMonadAff) {
    var liftEffect12 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var pad2 = function(dictBoundedEnum) {
      var fromEnum5 = fromEnum(dictBoundedEnum);
      return function(n) {
        var s = show2(fromEnum5(n));
        return power2("0")(2 - length4(s) | 0) + s;
      };
    };
    var pad21 = pad2(boundedEnumHour);
    var pad22 = pad2(boundedEnumMinute);
    var pad23 = pad2(boundedEnumSecond);
    var renderMessage = function(v) {
      return tr_([td([class_("timestamp")])([text(intercalate3(":")([pad21(hour(v.time)), pad22(minute(v.time)), pad23(second(v.time))]))]), td([classes(["username", "user-" + v.user])])([text(v.user)]), td([class_("message")])([text(v.text)])]);
    };
    var render = function(state3) {
      return div3([class_("chat-component")])([table_(map16(renderMessage)(state3.messages)), div3([id2("anchor")])([])]);
    };
    var messageServer = bind5(liftEffect12(create))(function(v) {
      return bind5(fork(forever2(bind5(gets2(function(v1) {
        return v1.queuedMessages;
      }))(function(queued) {
        var v1 = uncons(queued);
        if (v1 instanceof Just) {
          return discard2(modify_3(function(s) {
            var $48 = {};
            for (var $49 in s) {
              if ({}.hasOwnProperty.call(s, $49)) {
                $48[$49] = s[$49];
              }
              ;
            }
            ;
            $48.queuedMessages = v1.value0.tail;
            return $48;
          }))(function() {
            return discard2(liftAff2(delay(fromDuration2(v1.value0.head.delayBy))))(function() {
              return liftAff2(liftEffect3(notify(v.listener)(new NewMessage({
                user: v1.value0.head.user,
                text: v1.value0.head.text
              }))));
            });
          });
        }
        ;
        if (v1 instanceof Nothing) {
          return liftAff2(delay(200));
        }
        ;
        throw new Error("Failed pattern match at Component.Chat (line 107, column 7 - line 112, column 62): " + [v1.constructor.name]);
      }))))(function() {
        return pure5(v.emitter);
      });
    });
    var initialState = function(v) {
      return {
        messages: [],
        queuedMessages: []
      };
    };
    var handleAction = function(v) {
      if (v instanceof Initialise) {
        return bind5(bindFlipped4(subscribe2)(messageServer))(function() {
          return pure5(unit);
        });
      }
      ;
      if (v instanceof NewMessage) {
        return bind5(liftEffect12(nowTime))(function(time4) {
          return modify_3(function(s) {
            var $60 = {};
            for (var $61 in s) {
              if ({}.hasOwnProperty.call(s, $61)) {
                $60[$61] = s[$61];
              }
              ;
            }
            ;
            $60.messages = append12(s.messages)([{
              user: v.value0.user,
              text: v.value0.text,
              time: time4
            }]);
            return $60;
          });
        });
      }
      ;
      throw new Error("Failed pattern match at Component.Chat (line 90, column 18 - line 96, column 73): " + [v.constructor.name]);
    };
    var $$eval4 = mkEval({
      handleQuery: function(v) {
        if (v instanceof InterruptingMessage) {
          return discard2(handleAction(new NewMessage(v.value0)))(function() {
            return pure5(Nothing.value);
          });
        }
        ;
        if (v instanceof QueuedMessages) {
          return discard2(modify_3(function(s) {
            var $68 = {};
            for (var $69 in s) {
              if ({}.hasOwnProperty.call(s, $69)) {
                $68[$69] = s[$69];
              }
              ;
            }
            ;
            $68.queuedMessages = append12(s.queuedMessages)(v.value0);
            return $68;
          }))(function() {
            return pure5(Nothing.value);
          });
        }
        ;
        if (v instanceof ClearMessages) {
          return voidLeft4(put2(initialState(unit)))(Nothing.value);
        }
        ;
        throw new Error("Failed pattern match at Component.Chat (line 75, column 20 - line 82, column 60): " + [v.constructor.name]);
      },
      handleAction,
      initialize: new Just(Initialise.value),
      finalize: Nothing.value,
      receive: function(v) {
        return Nothing.value;
      }
    });
    return mkComponent({
      "eval": $$eval4,
      initialState,
      render
    });
  };

  // output/Effect.Console/foreign.js
  var log2 = function(s) {
    return function() {
      console.log(s);
    };
  };
  var warn = function(s) {
    return function() {
      console.warn(s);
    };
  };

  // output/Effect.Class.Console/index.js
  var log3 = function(dictMonadEffect) {
    var $51 = liftEffect(dictMonadEffect);
    return function($52) {
      return $51(log2($52));
    };
  };

  // output/Game.Location/index.js
  var show3 = /* @__PURE__ */ show(showInt);
  var compare2 = /* @__PURE__ */ compare(ordInt);
  var append13 = /* @__PURE__ */ append(semigroupOrdering);
  var mod3 = /* @__PURE__ */ mod(euclideanRingInt);
  var Rotation = function(x) {
    return x;
  };
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
  var showLocation = {
    show: function(v) {
      return "(" + (show3(v.x) + ("," + (show3(v.y) + ")")));
    }
  };
  var showCardinalDirection = {
    show: function(v) {
      if (v instanceof Up) {
        return "Up";
      }
      ;
      if (v instanceof Right2) {
        return "Right";
      }
      ;
      if (v instanceof Down) {
        return "Down";
      }
      ;
      if (v instanceof Left2) {
        return "Left";
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 16, column 10 - line 20, column 20): " + [v.constructor.name]);
    }
  };
  var eqRotation = {
    eq: function(x) {
      return function(y) {
        return x === y;
      };
    }
  };
  var ordRotation = {
    compare: function(x) {
      return function(y) {
        return compare2(x)(y);
      };
    },
    Eq0: function() {
      return eqRotation;
    }
  };
  var eqLocation = {
    eq: function(x) {
      return function(y) {
        return x.x === y.x && x.y === y.y;
      };
    }
  };
  var eq12 = /* @__PURE__ */ eq(eqLocation);
  var ordLocation = {
    compare: function(x) {
      return function(y) {
        var v = compare2(x.x)(y.x);
        if (v instanceof LT) {
          return LT.value;
        }
        ;
        if (v instanceof GT) {
          return GT.value;
        }
        ;
        return compare2(x.y)(y.y);
      };
    },
    Eq0: function() {
      return eqLocation;
    }
  };
  var compare12 = /* @__PURE__ */ compare(ordLocation);
  var eqCardinalDirection = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Up && y instanceof Up) {
          return true;
        }
        ;
        if (x instanceof Right2 && y instanceof Right2) {
          return true;
        }
        ;
        if (x instanceof Down && y instanceof Down) {
          return true;
        }
        ;
        if (x instanceof Left2 && y instanceof Left2) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var eq22 = /* @__PURE__ */ eq(eqCardinalDirection);
  var eqEdge = {
    eq: function(x) {
      return function(y) {
        return eq22(x.dir)(y.dir) && eq12(x.loc)(y.loc);
      };
    }
  };
  var ordCardinalDirection = {
    compare: function(x) {
      return function(y) {
        if (x instanceof Up && y instanceof Up) {
          return EQ.value;
        }
        ;
        if (x instanceof Up) {
          return LT.value;
        }
        ;
        if (y instanceof Up) {
          return GT.value;
        }
        ;
        if (x instanceof Right2 && y instanceof Right2) {
          return EQ.value;
        }
        ;
        if (x instanceof Right2) {
          return LT.value;
        }
        ;
        if (y instanceof Right2) {
          return GT.value;
        }
        ;
        if (x instanceof Down && y instanceof Down) {
          return EQ.value;
        }
        ;
        if (x instanceof Down) {
          return LT.value;
        }
        ;
        if (y instanceof Down) {
          return GT.value;
        }
        ;
        if (x instanceof Left2 && y instanceof Left2) {
          return EQ.value;
        }
        ;
        throw new Error("Failed pattern match at Game.Location (line 0, column 0 - line 0, column 0): " + [x.constructor.name, y.constructor.name]);
      };
    },
    Eq0: function() {
      return eqCardinalDirection;
    }
  };
  var compare22 = /* @__PURE__ */ compare(ordCardinalDirection);
  var ordEdge = {
    compare: function(v) {
      return function(v1) {
        return append13(compare12(v.loc)(v1.loc))(compare22(v.dir)(v1.dir));
      };
    },
    Eq0: function() {
      return eqEdge;
    }
  };
  var enumCardinalDirection = {
    succ: function(v) {
      if (v instanceof Up) {
        return new Just(Right2.value);
      }
      ;
      if (v instanceof Right2) {
        return new Just(Down.value);
      }
      ;
      if (v instanceof Down) {
        return new Just(Left2.value);
      }
      ;
      if (v instanceof Left2) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 23, column 10 - line 27, column 20): " + [v.constructor.name]);
    },
    pred: function(v) {
      if (v instanceof Up) {
        return Nothing.value;
      }
      ;
      if (v instanceof Right2) {
        return new Just(Up.value);
      }
      ;
      if (v instanceof Down) {
        return new Just(Right2.value);
      }
      ;
      if (v instanceof Left2) {
        return new Just(Down.value);
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 28, column 10 - line 32, column 22): " + [v.constructor.name]);
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
    fromEnum: function(v) {
      if (v instanceof Up) {
        return 0;
      }
      ;
      if (v instanceof Right2) {
        return 1;
      }
      ;
      if (v instanceof Down) {
        return 2;
      }
      ;
      if (v instanceof Left2) {
        return 3;
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 40, column 14 - line 44, column 14): " + [v.constructor.name]);
    },
    toEnum: function(v) {
      if (v === 0) {
        return new Just(Up.value);
      }
      ;
      if (v === 1) {
        return new Just(Right2.value);
      }
      ;
      if (v === 2) {
        return new Just(Down.value);
      }
      ;
      if (v === 3) {
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
  var toEnum4 = /* @__PURE__ */ toEnum(boundedEnumCardinalDirect);
  var fromEnum4 = /* @__PURE__ */ fromEnum(boundedEnumCardinalDirect);
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
    succ: function(v) {
      if (v === 3) {
        return Nothing.value;
      }
      ;
      return new Just(rotation(v + 1 | 0));
    },
    pred: function(v) {
      if (v === 0) {
        return Nothing.value;
      }
      ;
      return new Just(rotation(v - 1 | 0));
    },
    Ord0: function() {
      return ordRotation;
    }
  };
  var boundedEnumRotation = {
    cardinality: 4,
    fromEnum: function(v) {
      return v;
    },
    toEnum: function($141) {
      return Just.create(Rotation($141));
    },
    Bounded0: function() {
      return boundedRotation;
    },
    Enum1: function() {
      return enumRotation;
    }
  };
  var fromEnum1 = /* @__PURE__ */ fromEnum(boundedEnumRotation);
  var semigroupRotation = {
    append: function(v) {
      return function(v1) {
        return rotation(v + v1 | 0);
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
    ginverse: function(v) {
      return rotation(-v | 0);
    },
    Monoid0: function() {
      return monoidRotation;
    }
  };
  var rotateDirection = function(dir2) {
    return function(rot) {
      return fromMaybe(Up.value)(toEnum4(mod3(fromEnum4(dir2) + fromEnum1(rot) | 0)(4)));
    };
  };
  var oppositeDirection = function(v) {
    if (v instanceof Up) {
      return Down.value;
    }
    ;
    if (v instanceof Right2) {
      return Left2.value;
    }
    ;
    if (v instanceof Down) {
      return Up.value;
    }
    ;
    if (v instanceof Left2) {
      return Right2.value;
    }
    ;
    throw new Error("Failed pattern match at Game.Location (line 131, column 21 - line 135, column 17): " + [v.constructor.name]);
  };
  var location = function(x) {
    return function(y) {
      return {
        x,
        y
      };
    };
  };
  var followDirection = function(v) {
    return function(v1) {
      if (v1 instanceof Up) {
        return location(v.x)(v.y - 1 | 0);
      }
      ;
      if (v1 instanceof Right2) {
        return location(v.x + 1 | 0)(v.y);
      }
      ;
      if (v1 instanceof Down) {
        return location(v.x)(v.y + 1 | 0);
      }
      ;
      if (v1 instanceof Left2) {
        return location(v.x - 1 | 0)(v.y);
      }
      ;
      throw new Error("Failed pattern match at Game.Location (line 121, column 37 - line 125, column 28): " + [v1.constructor.name]);
    };
  };
  var edgeDirection = function(v) {
    return v.dir;
  };
  var edge = function(loc) {
    return function(dir2) {
      return {
        loc,
        dir: dir2
      };
    };
  };
  var matchEdge = function(v) {
    return edge(followDirection(v.loc)(v.dir))(oppositeDirection(v.dir));
  };
  var allDirections = /* @__PURE__ */ function() {
    return enumFromTo(enumCardinalDirection)(unfoldable1Array)(Up.value)(Left2.value);
  }();

  // output/Data.Set/index.js
  var foldMap2 = /* @__PURE__ */ foldMap(foldableList);
  var foldl2 = /* @__PURE__ */ foldl(foldableList);
  var foldr4 = /* @__PURE__ */ foldr(foldableList);
  var $$Set = function(x) {
    return x;
  };
  var toList = function(v) {
    return keys(v);
  };
  var toUnfoldable4 = function(dictUnfoldable) {
    var $127 = toUnfoldable(dictUnfoldable);
    return function($128) {
      return $127(toList($128));
    };
  };
  var insert4 = function(dictOrd) {
    var insert13 = insert(dictOrd);
    return function(a2) {
      return function(v) {
        return insert13(a2)(unit)(v);
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
      return function(x) {
        var $131 = foldl2(f)(x);
        return function($132) {
          return $131(toList($132));
        };
      };
    },
    foldr: function(f) {
      return function(x) {
        var $133 = foldr4(f)(x);
        return function($134) {
          return $133(toList($134));
        };
      };
    }
  };
  var empty7 = empty2;
  var fromFoldable5 = function(dictFoldable) {
    var foldl22 = foldl(dictFoldable);
    return function(dictOrd) {
      var insert13 = insert4(dictOrd);
      return foldl22(function(m) {
        return function(a2) {
          return insert13(a2)(m);
        };
      })(empty7);
    };
  };

  // output/Data.Map/index.js
  var keys3 = /* @__PURE__ */ function() {
    var $38 = $$void(functorMap);
    return function($39) {
      return fromMap($38($39));
    };
  }();

  // output/Game.Piece/index.js
  var lookup6 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var filter4 = /* @__PURE__ */ filter2(ordCardinalDirection);
  var Input = /* @__PURE__ */ function() {
    function Input2(value0) {
      this.value0 = value0;
    }
    ;
    Input2.create = function(value0) {
      return new Input2(value0);
    };
    return Input2;
  }();
  var Output = /* @__PURE__ */ function() {
    function Output2(value0) {
      this.value0 = value0;
    }
    ;
    Output2.create = function(value0) {
      return new Output2(value0);
    };
    return Output2;
  }();
  var eqCapacity = {
    eq: function(x) {
      return function(y) {
        return x === y;
      };
    }
  };
  var eq13 = /* @__PURE__ */ eq(eqCapacity);
  var eqPort = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Input && y instanceof Input) {
          return eq13(x.value0)(y.value0);
        }
        ;
        if (x instanceof Output && y instanceof Output) {
          return eq13(x.value0)(y.value0);
        }
        ;
        return false;
      };
    }
  };
  var unPiece = function(f) {
    return function(v) {
      return v(function(dictPiece) {
        return f(dictPiece);
      });
    };
  };
  var ports = function(dict) {
    return dict.ports;
  };
  var name2 = function(dict) {
    return dict.name;
  };
  var mkPiece = function(dictPiece) {
    return function(piece) {
      return function(v) {
        return v(dictPiece)(piece);
      };
    };
  };
  var isInput = function(v) {
    if (v instanceof Input) {
      return true;
    }
    ;
    return false;
  };
  var getPort = function(dictPiece) {
    var ports1 = ports(dictPiece);
    return function(p2) {
      return function(dir2) {
        return lookup6(dir2)(ports1(p2));
      };
    };
  };
  var getOutputDirs = function(dictPiece) {
    var ports1 = ports(dictPiece);
    return function(p2) {
      return keys3(filter4(function($88) {
        return !isInput($88);
      })(ports1(p2)));
    };
  };
  var $$eval = function(dict) {
    return dict["eval"];
  };
  var pieceAPiece = {
    name: /* @__PURE__ */ unPiece(function(dictPiece) {
      return name2(dictPiece);
    }),
    "eval": /* @__PURE__ */ unPiece(function(dictPiece) {
      return $$eval(dictPiece);
    }),
    ports: /* @__PURE__ */ unPiece(function(dictPiece) {
      return ports(dictPiece);
    })
  };
  var name1 = /* @__PURE__ */ name2(pieceAPiece);
  var eqAPiece = {
    eq: /* @__PURE__ */ on(/* @__PURE__ */ eq(eqString))(name1)
  };
  var ordAPiece = {
    compare: /* @__PURE__ */ on(/* @__PURE__ */ compare(ordString))(name1),
    Eq0: function() {
      return eqAPiece;
    }
  };

  // output/Web.Event.Event/foreign.js
  function preventDefault(e) {
    return function() {
      return e.preventDefault();
    };
  }

  // output/Web.HTML.Event.DragEvent.EventTypes/index.js
  var drop3 = "drop";
  var dragover = "dragover";
  var dragleave = "dragleave";
  var dragenter = "dragenter";
  var dragend = "dragend";

  // output/Web.HTML.Event.EventTypes/index.js
  var domcontentloaded = "DOMContentLoaded";

  // output/Web.UIEvent.KeyboardEvent.EventTypes/index.js
  var keydown = "keydown";

  // output/Web.UIEvent.MouseEvent.EventTypes/index.js
  var dblclick = "dblclick";

  // output/Web.UIEvent.WheelEvent.EventTypes/index.js
  var wheel = "wheel";

  // output/Halogen.HTML.Events/index.js
  var wheelHandler = unsafeCoerce2;
  var mouseHandler = unsafeCoerce2;
  var keyHandler = unsafeCoerce2;
  var handler2 = function(et) {
    return function(f) {
      return handler(et)(function(ev) {
        return new Just(new Action(f(ev)));
      });
    };
  };
  var onDoubleClick = /* @__PURE__ */ function() {
    var $17 = handler2(dblclick);
    return function($18) {
      return $17(mouseHandler($18));
    };
  }();
  var onKeyDown = /* @__PURE__ */ function() {
    var $23 = handler2(keydown);
    return function($24) {
      return $23(keyHandler($24));
    };
  }();
  var onWheel = /* @__PURE__ */ function() {
    var $53 = handler2(wheel);
    return function($54) {
      return $53(wheelHandler($54));
    };
  }();
  var dragHandler = unsafeCoerce2;
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
    var $77 = handler2(drop3);
    return function($78) {
      return $77(dragHandler($78));
    };
  }();

  // output/Web.UIEvent.WheelEvent/foreign.js
  function deltaY(e) {
    return e.deltaY;
  }

  // output/Component.Piece/index.js
  var getPort2 = /* @__PURE__ */ getPort(pieceAPiece);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorArray);
  var enumFromTo2 = /* @__PURE__ */ enumFromTo(enumCardinalDirection)(unfoldable1Array);
  var show4 = /* @__PURE__ */ show(showCardinalDirection);
  var name4 = /* @__PURE__ */ name2(pieceAPiece);
  var append5 = /* @__PURE__ */ append(semigroupArray);
  var pure6 = /* @__PURE__ */ pure(applicativeHalogenM);
  var clamp2 = /* @__PURE__ */ clamp(ordNumber);
  var bind6 = /* @__PURE__ */ bind(bindHalogenM);
  var gets3 = /* @__PURE__ */ gets(monadStateHalogenM);
  var discard3 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
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
  var Initialise2 = /* @__PURE__ */ function() {
    function Initialise4() {
    }
    ;
    Initialise4.value = new Initialise4();
    return Initialise4;
  }();
  var OnWheel = /* @__PURE__ */ function() {
    function OnWheel2(value0) {
      this.value0 = value0;
    }
    ;
    OnWheel2.create = function(value0) {
      return new OnWheel2(value0);
    };
    return OnWheel2;
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
  var OnDragLeave = /* @__PURE__ */ function() {
    function OnDragLeave2(value0) {
      this.value0 = value0;
    }
    ;
    OnDragLeave2.create = function(value0) {
      return new OnDragLeave2(value0);
    };
    return OnDragLeave2;
  }();
  var component2 = function(dictMonadEffect) {
    var log4 = log3(monadEffectHalogenM(dictMonadEffect));
    var render = function(state3) {
      var portIconSrc = function(dir2) {
        var v = getPort2(state3.piece)(dir2);
        if (v instanceof Just && v.value0 instanceof Input) {
          return "./input-port.svg";
        }
        ;
        if (v instanceof Just && v.value0 instanceof Output) {
          return "./output-port.svg";
        }
        ;
        if (v instanceof Nothing) {
          return "./no-port.svg";
        }
        ;
        throw new Error("Failed pattern match at Component.Piece (line 69, column 25 - line 72, column 35): " + [v.constructor.name]);
      };
      var ports2 = mapFlipped2(enumFromTo2(Up.value)(Left2.value))(function(dir2) {
        return div3([class_(show4(dir2))])([img([src(portIconSrc(dir2)), classes(["port-icon"])])]);
      });
      var pieceTitle = [div3([class_("piece-name")])([div_([text(name4(state3.piece))])])];
      return div3([class_("piece-component"), draggable(true), onWheel(OnWheel.create), onDragEnd(OnDrop.create(state3.location))])(append5(pieceTitle)(ports2));
    };
    var initialState = function(input3) {
      return input3;
    };
    var $$eval4 = mkEval({
      finalize: Nothing.value,
      handleAction: function(v) {
        if (v instanceof Initialise2) {
          return pure6(unit);
        }
        ;
        if (v instanceof OnWheel) {
          var rot = rotation(round2(clamp2(-1)(1)(deltaY(v.value0))));
          return bind6(gets3(function(v1) {
            return v1.location;
          }))(function(loc) {
            return raise(new Rotated(loc, rot));
          });
        }
        ;
        if (v instanceof OnDrop) {
          return discard3(log4("PIECE: dropped piece, raised to board"))(function() {
            return raise(new Dropped(v.value0));
          });
        }
        ;
        if (v instanceof OnDragLeave) {
          return log4("piece left target");
        }
        ;
        throw new Error("Failed pattern match at Component.Piece (line 79, column 21 - line 88, column 34): " + [v.constructor.name]);
      },
      handleQuery: function(v) {
        return pure6(Nothing.value);
      },
      initialize: new Just(Initialise2.value),
      receive: $$const(Nothing.value)
    });
    return mkComponent({
      "eval": $$eval4,
      initialState,
      render
    });
  };

  // output/Data.Lens.Internal.Forget/index.js
  var Forget = function(x) {
    return x;
  };
  var profunctorForget = {
    dimap: function(f) {
      return function(v) {
        return function(v1) {
          return function($36) {
            return v1(f($36));
          };
        };
      };
    }
  };
  var strongForget = {
    first: function(v) {
      return function($37) {
        return v(fst($37));
      };
    },
    second: function(v) {
      return function($38) {
        return v(snd($38));
      };
    },
    Profunctor0: function() {
      return profunctorForget;
    }
  };
  var choiceForget = function(dictMonoid) {
    var mempty3 = mempty(monoidFn(dictMonoid));
    return {
      left: function(v) {
        return either(v)(mempty3);
      },
      right: function(v) {
        return either(mempty3)(v);
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
    left: function(v) {
      return function(v1) {
        if (v1 instanceof Left) {
          return new Left(v(v1.value0));
        }
        ;
        if (v1 instanceof Right) {
          return new Right(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Profunctor.Choice (line 32, column 1 - line 35, column 16): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    right: /* @__PURE__ */ map(functorEither),
    Profunctor0: function() {
      return profunctorFn;
    }
  };

  // output/Data.Profunctor.Strong/index.js
  var identity10 = /* @__PURE__ */ identity(categoryFn);
  var strongFn = {
    first: function(a2b) {
      return function(v) {
        return new Tuple(a2b(v.value0), v.value1);
      };
    },
    second: /* @__PURE__ */ map(functorTuple),
    Profunctor0: function() {
      return profunctorFn;
    }
  };
  var second2 = function(dict) {
    return dict.second;
  };
  var first = function(dict) {
    return dict.first;
  };
  var splitStrong = function(dictCategory) {
    var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
    return function(dictStrong) {
      var first1 = first(dictStrong);
      var second1 = second2(dictStrong);
      return function(l) {
        return function(r) {
          return composeFlipped2(first1(l))(second1(r));
        };
      };
    };
  };
  var fanout = function(dictCategory) {
    var identity1 = identity(dictCategory);
    var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
    var splitStrong1 = splitStrong(dictCategory);
    return function(dictStrong) {
      var dimap2 = dimap(dictStrong.Profunctor0());
      var splitStrong2 = splitStrong1(dictStrong);
      return function(l) {
        return function(r) {
          var split2 = dimap2(identity10)(function(a2) {
            return new Tuple(a2, a2);
          })(identity1);
          return composeFlipped2(split2)(splitStrong2(l)(r));
        };
      };
    };
  };

  // output/Data.Lens.Getter/index.js
  var unwrap5 = /* @__PURE__ */ unwrap();
  var identity11 = /* @__PURE__ */ identity(categoryFn);
  var view = function(l) {
    return unwrap5(l(identity11));
  };
  var viewOn = function(s) {
    return function(l) {
      return view(l)(s);
    };
  };
  var to = function(f) {
    return function(p2) {
      var $10 = unwrap5(p2);
      return function($11) {
        return $10(f($11));
      };
    };
  };

  // output/Data.Array.NonEmpty.Internal/foreign.js
  var traverse1Impl = function() {
    function Cont(fn) {
      this.fn = fn;
    }
    var emptyList = {};
    var ConsCell = function(head4, tail2) {
      this.head = head4;
      this.tail = tail2;
    };
    function finalCell(head4) {
      return new ConsCell(head4, emptyList);
    }
    function consList(x) {
      return function(xs) {
        return new ConsCell(x, xs);
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
    return function(apply2, map28, f) {
      var buildFrom = function(x, ys) {
        return apply2(map28(consList)(f(x)))(ys);
      };
      var go2 = function(acc, currentLen, xs) {
        if (currentLen === 0) {
          return acc;
        } else {
          var last3 = xs[currentLen - 1];
          return new Cont(function() {
            var built = go2(buildFrom(last3, acc), currentLen - 1, xs);
            return built;
          });
        }
      };
      return function(array) {
        var acc = map28(finalCell)(f(array[array.length - 1]));
        var result = go2(acc, array.length - 1, array);
        while (result instanceof Cont) {
          result = result.fn();
        }
        return map28(listToArray)(result);
      };
    };
  }();

  // output/Data.Lens.AffineTraversal/index.js
  var identity12 = /* @__PURE__ */ identity(categoryFn);
  var fanout2 = /* @__PURE__ */ fanout(categoryFn)(strongFn);
  var affineTraversal$prime = function(to2) {
    return function(dictStrong) {
      var second3 = second2(dictStrong);
      return function(dictChoice) {
        var dimap2 = dimap(dictChoice.Profunctor0());
        var right2 = right(dictChoice);
        return function(pab) {
          return dimap2(to2)(function(v) {
            return either(identity12)(v.value0)(v.value1);
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

  // output/Data.Lens.Iso/index.js
  var coerce3 = /* @__PURE__ */ coerce();
  var iso = function(f) {
    return function(g) {
      return function(dictProfunctor) {
        var dimap2 = dimap(dictProfunctor);
        return function(pab) {
          return dimap2(f)(g)(pab);
        };
      };
    };
  };
  var coerced = function() {
    return function() {
      return function(dictProfunctor) {
        return iso(coerce3)(coerce3)(dictProfunctor);
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

  // output/Data.Lens.Lens/index.js
  var lens$prime = function(to2) {
    return function(dictStrong) {
      var dimap2 = dimap(dictStrong.Profunctor0());
      var first2 = first(dictStrong);
      return function(pab) {
        return dimap2(to2)(function(v) {
          return v.value1(v.value0);
        })(first2(pab));
      };
    };
  };
  var lens = function(get3) {
    return function(set3) {
      return function(dictStrong) {
        return lens$prime(function(s) {
          return new Tuple(get3(s), function(b2) {
            return set3(s)(b2);
          });
        })(dictStrong);
      };
    };
  };

  // output/Data.Lens.Prism/index.js
  var identity13 = /* @__PURE__ */ identity(categoryFn);
  var prism = function(to2) {
    return function(fro) {
      return function(dictChoice) {
        var Profunctor0 = dictChoice.Profunctor0();
        var dimap2 = dimap(Profunctor0);
        var right2 = right(dictChoice);
        var rmap3 = rmap(Profunctor0);
        return function(pab) {
          return dimap2(fro)(either(identity13)(identity13))(right2(rmap3(to2)(pab)));
        };
      };
    };
  };

  // output/Data.Lens.Prism.Maybe/index.js
  var _Just = function(dictChoice) {
    return prism(Just.create)(maybe(new Left(Nothing.value))(Right.create))(dictChoice);
  };

  // output/Data.Lens.Index/index.js
  var ix = function(dict) {
    return dict.ix;
  };
  var indexMap = function(dictOrd) {
    var update3 = update(dictOrd);
    var lookup10 = lookup(dictOrd);
    return {
      ix: function(k) {
        return function(dictStrong) {
          return function(dictChoice) {
            var set3 = function(s) {
              return function(b2) {
                return update3(function(v) {
                  return new Just(b2);
                })(k)(s);
              };
            };
            var pre2 = function(s) {
              return maybe(new Left(s))(Right.create)(lookup10(k)(s));
            };
            return affineTraversal(set3)(pre2)(dictStrong)(dictChoice);
          };
        };
      }
    };
  };

  // output/Record/index.js
  var set = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function() {
        return function(l) {
          return function(b2) {
            return function(r) {
              return unsafeSet(reflectSymbol2(l))(b2)(r);
            };
          };
        };
      };
    };
  };
  var get2 = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(l) {
        return function(r) {
          return unsafeGet(reflectSymbol2(l))(r);
        };
      };
    };
  };

  // output/Data.Lens.Record/index.js
  var prop3 = function(dictIsSymbol) {
    var get3 = get2(dictIsSymbol)();
    var set3 = set(dictIsSymbol)()();
    return function() {
      return function() {
        return function(l) {
          return function(dictStrong) {
            return lens(get3(l))(flip(set3(l)))(dictStrong);
          };
        };
      };
    };
  };

  // output/Data.Lens.Setter/index.js
  var over3 = function(l) {
    return l;
  };
  var set2 = function(l) {
    return function(b2) {
      return over3(l)($$const(b2));
    };
  };
  var modifying = function(dictMonadState) {
    var $$void8 = $$void(dictMonadState.Monad0().Bind1().Apply0().Functor0());
    var modify5 = modify2(dictMonadState);
    return function(p2) {
      return function(f) {
        return $$void8(modify5(over3(p2)(f)));
      };
    };
  };
  var appendOver = function(dictSemigroup) {
    var append7 = append(dictSemigroup);
    return function(p2) {
      var $93 = over3(p2);
      var $94 = flip(append7);
      return function($95) {
        return $93($94($95));
      };
    };
  };
  var appendModifying = function(dictMonadState) {
    var modifying1 = modifying(dictMonadState);
    return function(dictSemigroup) {
      var append7 = append(dictSemigroup);
      return function(p2) {
        var $96 = modifying1(p2);
        var $97 = flip(append7);
        return function($98) {
          return $96($97($98));
        };
      };
    };
  };

  // output/Data.Graph/index.js
  var map17 = /* @__PURE__ */ map(functorList);
  var mempty2 = /* @__PURE__ */ mempty(monoidList);
  var append6 = /* @__PURE__ */ append(semigroupCatList);
  var fromFoldable6 = /* @__PURE__ */ fromFoldable4(foldableList);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable4(foldableArray);
  var Emit = /* @__PURE__ */ function() {
    function Emit2(value0) {
      this.value0 = value0;
    }
    ;
    Emit2.create = function(value0) {
      return new Emit2(value0);
    };
    return Emit2;
  }();
  var Visit = /* @__PURE__ */ function() {
    function Visit2(value0) {
      this.value0 = value0;
    }
    ;
    Visit2.create = function(value0) {
      return new Visit2(value0);
    };
    return Visit2;
  }();
  var unfoldGraph = function(dictOrd) {
    var fromFoldable23 = fromFoldable3(dictOrd);
    return function(dictFunctor) {
      var map32 = map(dictFunctor);
      return function(dictFoldable) {
        var fromFoldable33 = fromFoldable23(dictFoldable);
        return function(dictFoldable1) {
          var fromFoldable43 = fromFoldable2(dictFoldable1);
          return function(ks) {
            return function(label5) {
              return function(theEdges) {
                return fromFoldable33(map32(function(k) {
                  return new Tuple(k, new Tuple(label5(k), fromFoldable43(theEdges(k))));
                })(ks));
              };
            };
          };
        };
      };
    };
  };
  var topologicalSort = function(dictOrd) {
    var member3 = member(dictOrd);
    var $$delete6 = $$delete(dictOrd);
    var lookup14 = lookup(dictOrd);
    return function(v) {
      var visit = function($copy_state) {
        return function($copy_stack) {
          var $tco_var_state = $copy_state;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(state3, stack) {
            var v1 = uncons5(stack);
            if (v1 instanceof Nothing) {
              $tco_done = true;
              return state3;
            }
            ;
            if (v1 instanceof Just && v1.value0.value0 instanceof Emit) {
              var state$prime = {
                result: new Cons(v1.value0.value0.value0, state3.result),
                unvisited: state3.unvisited
              };
              $tco_var_state = state$prime;
              $copy_stack = v1.value0.value1;
              return;
            }
            ;
            if (v1 instanceof Just && v1.value0.value0 instanceof Visit) {
              if (member3(v1.value0.value0.value0)(state3.unvisited)) {
                var start2 = {
                  result: state3.result,
                  unvisited: $$delete6(v1.value0.value0.value0)(state3.unvisited)
                };
                var next = maybe(mempty2)(snd)(lookup14(v1.value0.value0.value0)(v));
                $tco_var_state = start2;
                $copy_stack = append6(fromFoldable6(map17(Visit.create)(next)))(cons3(new Emit(v1.value0.value0.value0))(v1.value0.value1));
                return;
              }
              ;
              if (otherwise) {
                $tco_var_state = state3;
                $copy_stack = v1.value0.value1;
                return;
              }
              ;
            }
            ;
            throw new Error("Failed pattern match at Data.Graph (line 126, column 7 - line 144, column 40): " + [v1.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_state, $copy_stack);
          }
          ;
          return $tco_result;
        };
      };
      var initialState = {
        unvisited: v,
        result: Nil.value
      };
      var go2 = function($copy_v1) {
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(v1) {
          var v2 = findMin(v1.unvisited);
          if (v2 instanceof Just) {
            $copy_v1 = visit(v1)(fromFoldable1([new Visit(v2.value0.key)]));
            return;
          }
          ;
          if (v2 instanceof Nothing) {
            $tco_done1 = true;
            return v1.result;
          }
          ;
          throw new Error("Failed pattern match at Data.Graph (line 120, column 7 - line 122, column 26): " + [v2.constructor.name]);
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($copy_v1);
        }
        ;
        return $tco_result;
      };
      return go2(initialState);
    };
  };

  // output/Data.Group/index.js
  var ginverse = function(dict) {
    return dict.ginverse;
  };

  // output/Data.Lens.At/index.js
  var atMap = function(dictOrd) {
    var lookup10 = lookup(dictOrd);
    var $$delete6 = $$delete(dictOrd);
    var insert8 = insert(dictOrd);
    var indexMap2 = indexMap(dictOrd);
    return {
      at: function(k) {
        return function(dictStrong) {
          return lens(lookup10(k))(function(m) {
            return maybe$prime(function(v) {
              return $$delete6(k)(m);
            })(function(v) {
              return insert8(k)(v)(m);
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

  // output/Data.Lens.Fold/index.js
  var unwrap6 = /* @__PURE__ */ unwrap();
  var foldMapOf = /* @__PURE__ */ under()()(Forget);
  var foldrOf = function(p2) {
    return function(f) {
      return function(r) {
        var $116 = flip(unwrap6)(r);
        var $117 = foldMapOf(p2)(function($119) {
          return Endo(f($119));
        });
        return function($118) {
          return $116($117($118));
        };
      };
    };
  };
  var toListOf = function(p2) {
    return foldrOf(p2)(Cons.create)(Nil.value);
  };
  var has = function(dictHeytingAlgebra) {
    var tt3 = tt(dictHeytingAlgebra);
    return function(p2) {
      var $126 = foldMapOf(p2)($$const(tt3));
      return function($127) {
        return unwrap6($126($127));
      };
    };
  };
  var preview = function(p2) {
    var $135 = foldMapOf(p2)(function($137) {
      return First(Just.create($137));
    });
    return function($136) {
      return unwrap6($135($136));
    };
  };
  var previewOn = function(s) {
    return function(p2) {
      return preview(p2)(s);
    };
  };

  // output/Game.Board/index.js
  var show5 = /* @__PURE__ */ show(showLocation);
  var show22 = /* @__PURE__ */ show(showInt);
  var eq3 = /* @__PURE__ */ eq(eqEdge);
  var compare3 = /* @__PURE__ */ compare(ordEdge);
  var div4 = /* @__PURE__ */ div(euclideanRingInt);
  var _Newtype2 = /* @__PURE__ */ _Newtype()();
  var prop4 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "size";
    }
  })()();
  var prop12 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "rotation";
    }
  })()();
  var prop23 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "pieces";
    }
  })()();
  var has2 = /* @__PURE__ */ has(heytingAlgebraBoolean);
  var ix2 = /* @__PURE__ */ ix(/* @__PURE__ */ indexMap(ordLocation));
  var choiceForget2 = /* @__PURE__ */ choiceForget(/* @__PURE__ */ monoidDisj(heytingAlgebraBoolean));
  var at2 = /* @__PURE__ */ at(/* @__PURE__ */ atMap(ordLocation));
  var choiceForget1 = /* @__PURE__ */ choiceForget(monoidFirst);
  var bind7 = /* @__PURE__ */ bind(bindArray);
  var voidLeft5 = /* @__PURE__ */ voidLeft(functorArray);
  var guard3 = /* @__PURE__ */ guard(alternativeArray);
  var ginverse2 = /* @__PURE__ */ ginverse(groupRotation);
  var unfoldGraph2 = /* @__PURE__ */ unfoldGraph(ordLocation)(functorArray)(foldableArray)(foldableList);
  var toUnfoldable5 = /* @__PURE__ */ toUnfoldable4(unfoldableArray);
  var bind12 = /* @__PURE__ */ bind(bindList);
  var choiceForget22 = /* @__PURE__ */ choiceForget(/* @__PURE__ */ monoidEndo(categoryFn));
  var fromFoldable7 = /* @__PURE__ */ fromFoldable2(foldableSet);
  var getOutputDirs2 = /* @__PURE__ */ getOutputDirs(pieceAPiece);
  var pure7 = /* @__PURE__ */ pure(applicativeList);
  var fromFoldable12 = /* @__PURE__ */ fromFoldable(foldableEither);
  var toUnfoldable12 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var $$eval2 = /* @__PURE__ */ $$eval(pieceAPiece);
  var getPort3 = /* @__PURE__ */ getPort(pieceAPiece);
  var _Just2 = /* @__PURE__ */ _Just(choiceForget1);
  var lookup7 = /* @__PURE__ */ lookup(ordCardinalDirection);
  var fromFoldable22 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
  var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorArray);
  var bind22 = /* @__PURE__ */ bind(bindMaybe);
  var discard4 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
  var guard1 = /* @__PURE__ */ guard(alternativeMaybe);
  var map18 = /* @__PURE__ */ map(functorMaybe);
  var foldl3 = /* @__PURE__ */ foldl(foldableList);
  var topologicalSort2 = /* @__PURE__ */ topologicalSort(ordLocation);
  var fromFoldable32 = /* @__PURE__ */ fromFoldable(foldableMaybe);
  var pure1 = /* @__PURE__ */ pure(applicativeArray);
  var appendOver2 = /* @__PURE__ */ appendOver(semigroupRotation);
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
  var showBoardError = {
    show: function(v) {
      if (v instanceof LocationOccupied) {
        return "Location Occupied: " + show5(v.value0);
      }
      ;
      if (v instanceof LocationNotOccupied) {
        return "Location Not Occupied: " + show5(v.value0);
      }
      ;
      if (v instanceof InvalidBoardInitialisation) {
        return "Invalid Board Initialisation: " + (show22(v.value0) + " is not a valid board size");
      }
      ;
      throw new Error("Failed pattern match at Game.Board (line 50, column 10 - line 53, column 111): " + [v.constructor.name]);
    }
  };
  var showBoard = {
    show: function(v) {
      return "Board";
    }
  };
  var eqRelativeEdge = {
    eq: function(x) {
      return function(y) {
        return eq3(x)(y);
      };
    }
  };
  var ordRelativeEdge = {
    compare: function(x) {
      return function(y) {
        return compare3(x)(y);
      };
    },
    Eq0: function() {
      return eqRelativeEdge;
    }
  };
  var submap2 = /* @__PURE__ */ submap(ordRelativeEdge);
  var fromFoldable42 = /* @__PURE__ */ fromFoldable3(ordRelativeEdge)(foldableArray);
  var union3 = /* @__PURE__ */ union(ordRelativeEdge);
  var catMaybes4 = /* @__PURE__ */ catMaybes2(ordRelativeEdge);
  var lookup12 = /* @__PURE__ */ lookup(ordRelativeEdge);
  var unsafeMapKey = function(f) {
    var go2 = function(v) {
      if (v instanceof Leaf) {
        return Leaf.value;
      }
      ;
      if (v instanceof Two) {
        return new Two(go2(v.value0), f(v.value1), v.value2, go2(v.value3));
      }
      ;
      if (v instanceof Three) {
        return new Three(go2(v.value0), f(v.value1), v.value2, go2(v.value3), f(v.value4), v.value5, go2(v.value6));
      }
      ;
      throw new Error("Failed pattern match at Game.Board (line 196, column 10 - line 199, column 88): " + [v.constructor.name]);
    };
    return go2;
  };
  var standardBoard = {
    size: 3,
    pieces: empty2
  };
  var relativeEdgeLocation = function(v) {
    return v.loc;
  };
  var relativeEdgeDirection = function(v) {
    return v.dir;
  };
  var relative = function(loc) {
    return function(dir2) {
      return edge(loc)(dir2);
    };
  };
  var toGlobalInputs = function(loc) {
    return unsafeMapKey(relative(loc));
  };
  var toLocalInputs = function(loc) {
    var $185 = unsafeMapKey(relativeEdgeDirection);
    var $186 = submap2(new Just(relative(loc)(Up.value)))(new Just(relative(loc)(Left2.value)));
    return function($187) {
      return $185($186($187));
    };
  };
  var absolute = edge;
  var portEdges = function(v) {
    return function(dir2) {
      if (dir2 instanceof Up) {
        return absolute(location(div4(v.size)(2))(0))(dir2);
      }
      ;
      if (dir2 instanceof Right2) {
        return absolute(location(v.size - 1 | 0)(div4(v.size)(2)))(dir2);
      }
      ;
      if (dir2 instanceof Down) {
        return absolute(location(div4(v.size)(2))(v.size - 1 | 0))(dir2);
      }
      ;
      if (dir2 instanceof Left2) {
        return absolute(location(0)(div4(v.size)(2)))(dir2);
      }
      ;
      throw new Error("Failed pattern match at Game.Board (line 144, column 6 - line 148, column 67): " + [dir2.constructor.name]);
    };
  };
  var _size = function(dictStrong) {
    var $188 = _Newtype2(dictStrong.Profunctor0());
    var $189 = prop4($$Proxy.value)(dictStrong);
    return function($190) {
      return $188($189($190));
    };
  };
  var _size1 = /* @__PURE__ */ _size(strongForget);
  var _rotation = function(dictStrong) {
    return prop12($$Proxy.value)(dictStrong);
  };
  var _rotation1 = /* @__PURE__ */ _rotation(strongFn);
  var _pieces = function(dictStrong) {
    var $191 = _Newtype2(dictStrong.Profunctor0());
    var $192 = prop23($$Proxy.value)(dictStrong);
    return function($193) {
      return $191($192($193));
    };
  };
  var _pieces1 = /* @__PURE__ */ _pieces(strongForget);
  var _pieces2 = /* @__PURE__ */ _pieces(strongFn);
  var addPiece = function(dictPiece) {
    var mkPiece3 = mkPiece(dictPiece);
    return function(loc) {
      return function(piece) {
        return function(board) {
          var $159 = has2(function() {
            var $194 = ix2(loc)(strongForget)(choiceForget2);
            return function($195) {
              return _pieces1($194($195));
            };
          }())(board);
          if ($159) {
            return new Left(new LocationOccupied(loc));
          }
          ;
          return new Right(set2(function() {
            var $196 = at2(loc)(strongFn);
            return function($197) {
              return _pieces2($196($197));
            };
          }())(new Just({
            piece: mkPiece3(piece),
            rotation: rotation(0)
          }))(board));
        };
      };
    };
  };
  var getPieceInfo = function(board) {
    return function(loc) {
      return note(new LocationNotOccupied(loc))(preview(function() {
        var $198 = ix2(loc)(strongForget)(choiceForget1);
        return function($199) {
          return _pieces1($198($199));
        };
      }())(board));
    };
  };
  var firstEmptyLocation = function(board) {
    return head(function() {
      var n = viewOn(board)(_size1);
      return bind7(range2(0)(n - 1 | 0))(function(j) {
        return bind7(range2(0)(n - 1 | 0))(function(i2) {
          var loc = location(i2)(j);
          return voidLeft5(guard3(isLeft(getPieceInfo(board)(loc))))(loc);
        });
      });
    }());
  };
  var toAbsoluteEdge = function(board) {
    return function(v) {
      var v1 = getPieceInfo(board)(v.loc);
      if (v1 instanceof Right) {
        return absolute(v.loc)(rotateDirection(v.dir)(v1.value0.rotation));
      }
      ;
      if (v1 instanceof Left) {
        return absolute(v.loc)(v.dir);
      }
      ;
      throw new Error("Failed pattern match at Game.Board (line 131, column 55 - line 133, column 29): " + [v1.constructor.name]);
    };
  };
  var toRelativeEdge = function(board) {
    return function(v) {
      var v1 = getPieceInfo(board)(v.loc);
      if (v1 instanceof Right) {
        return relative(v.loc)(rotateDirection(v.dir)(ginverse2(v1.value0.rotation)));
      }
      ;
      if (v1 instanceof Left) {
        return relative(v.loc)(v.dir);
      }
      ;
      throw new Error("Failed pattern match at Game.Board (line 137, column 44 - line 139, column 29): " + [v1.constructor.name]);
    };
  };
  var matchingRelativeEdge = function(board) {
    return function(edge1) {
      var absEdge = toAbsoluteEdge(board)(edge1);
      return toRelativeEdge(board)(matchEdge(absEdge));
    };
  };
  var buildBoardGraph = function(v) {
    return unfoldGraph2(toUnfoldable5(keys3(v.pieces)))(function(v1) {
      return unit;
    })(function(loc) {
      return bind12(toListOf(function() {
        var $200 = ix2(loc)(strongForget)(choiceForget22);
        return function($201) {
          return _pieces1($200($201));
        };
      }())(v))(function(p2) {
        return bind12(fromFoldable7(getOutputDirs2(p2.piece)))(function(dir2) {
          return pure7(relativeEdgeLocation(matchingRelativeEdge(v)(relative(loc)(dir2))));
        });
      });
    });
  };
  var evalLocation = function(board) {
    return function(acc) {
      return function(loc) {
        var outputs = fromFoldable42(bind7(fromFoldable12(getPieceInfo(board)(loc)))(function(p2) {
          return bind7(toUnfoldable12(toGlobalInputs(loc)($$eval2(p2.piece)(toLocalInputs(loc)(acc)))))(function(v) {
            return [new Tuple(v.value0, v.value1), new Tuple(matchingRelativeEdge(board)(v.value0), v.value1)];
          });
        }));
        return union3(acc)(outputs);
      };
    };
  };
  var getPortOnEdge = function(board) {
    return function(v) {
      return previewOn(board)(function() {
        var $202 = ix2(v.loc)(strongForget)(choiceForget1);
        var $203 = to(function(p2) {
          return getPort3(p2.piece)(v.dir);
        });
        return function($204) {
          return _pieces1($202($203(_Just2($204))));
        };
      }());
    };
  };
  var evalBoard = function(v) {
    return function(m) {
      var initial = catMaybes4(fromFoldable42([new Tuple(toRelativeEdge(v)(absolute(location(div4(v.size)(2))(0))(Up.value)), lookup7(Up.value)(m)), new Tuple(toRelativeEdge(v)(absolute(location(v.size - 1 | 0)(div4(v.size)(2)))(Right2.value)), lookup7(Right2.value)(m)), new Tuple(toRelativeEdge(v)(absolute(location(div4(v.size)(2))(v.size - 1 | 0))(Down.value)), lookup7(Down.value)(m)), new Tuple(toRelativeEdge(v)(absolute(location(0)(div4(v.size)(2)))(Left2.value)), lookup7(Left2.value)(m))]));
      var extractOutputs = function(signals) {
        var absEdgePorts = [absolute(location(div4(v.size)(2))(0))(Up.value), absolute(location(v.size - 1 | 0)(div4(v.size)(2)))(Right2.value), absolute(location(div4(v.size)(2))(v.size - 1 | 0))(Down.value), absolute(location(0)(div4(v.size)(2)))(Left2.value)];
        return fromFoldable22(catMaybes(mapFlipped3(absEdgePorts)(function(absEdge) {
          var relEdge = toRelativeEdge(v)(absEdge);
          return bind22(getPortOnEdge(v)(relEdge))(function(port2) {
            return discard4(guard1(!isInput(port2)))(function() {
              return map18(Tuple.create(edgeDirection(absEdge)))(lookup12(relEdge)(signals));
            });
          });
        })));
      };
      var boardGraph = buildBoardGraph(v);
      return extractOutputs(foldl3(evalLocation(v))(initial)(topologicalSort2(boardGraph)));
    };
  };
  var portsBoard = function(board) {
    return fromFoldable22(bind7(allDirections)(function(dir2) {
      return bind7(fromFoldable32(getPortOnEdge(board)(toRelativeEdge(board)(portEdges(board)(dir2)))))(function(port2) {
        return pure1(new Tuple(dir2, port2));
      });
    }));
  };
  var pieceBoard = {
    name: function(v) {
      return "BOARD";
    },
    "eval": evalBoard,
    ports: portsBoard
  };
  var removePiece = function(loc) {
    return function(board) {
      var $184 = has2(function() {
        var $205 = ix2(loc)(strongForget)(choiceForget2);
        return function($206) {
          return _pieces1($205($206));
        };
      }())(board);
      if ($184) {
        return new Right(set2(function() {
          var $207 = at2(loc)(strongFn);
          return function($208) {
            return _pieces2($207($208));
          };
        }())(Nothing.value)(board));
      }
      ;
      return new Left(new LocationNotOccupied(loc));
    };
  };
  var rotatePieceBy = function(loc) {
    return function(rot) {
      return function(board) {
        return new Right(appendOver2(function() {
          var $209 = ix2(loc)(strongFn)(choiceFn);
          return function($210) {
            return _pieces2($209(_rotation1($210)));
          };
        }())(rot)(board));
      };
    };
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
            return function(component6) {
              return function(input3) {
                return widget(new ComponentSlot(componentSlot22(label5)(p2)(component6)(input3)($$const(Nothing.value))));
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
            return function(component6) {
              return function(input3) {
                return function(outputQuery) {
                  return widget(new ComponentSlot(componentSlot22(label5)(p2)(component6)(input3)(function($11) {
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

  // output/Web.HTML.Event.DragEvent/index.js
  var toEvent = unsafeCoerce2;

  // output/Web.UIEvent.KeyboardEvent/foreign.js
  function code2(e) {
    return e.code;
  }
  function ctrlKey(e) {
    return e.ctrlKey;
  }

  // output/Component.Board/index.js
  var slot2 = /* @__PURE__ */ slot()({
    reflectSymbol: function() {
      return "piece";
    }
  })(ordLocation);
  var _size2 = /* @__PURE__ */ _size(strongForget);
  var show6 = /* @__PURE__ */ show(showLocation);
  var intercalate5 = /* @__PURE__ */ intercalate2(monoidString);
  var power3 = /* @__PURE__ */ power(monoidString);
  var bind8 = /* @__PURE__ */ bind(bindArray);
  var pure8 = /* @__PURE__ */ pure(applicativeArray);
  var show1 = /* @__PURE__ */ show(showInt);
  var appendModifying2 = /* @__PURE__ */ appendModifying(monadStateHalogenM)(semigroupRotation);
  var prop5 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "board";
    }
  })()();
  var _pieces3 = /* @__PURE__ */ _pieces(strongFn);
  var ix3 = /* @__PURE__ */ ix(/* @__PURE__ */ indexMap(ordLocation));
  var prop13 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "rotation";
    }
  })()();
  var discard5 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var bind13 = /* @__PURE__ */ bind(bindHalogenM);
  var gets4 = /* @__PURE__ */ gets(monadStateHalogenM);
  var bind23 = /* @__PURE__ */ bind(bindEither);
  var addPiece2 = /* @__PURE__ */ addPiece(pieceAPiece);
  var show23 = /* @__PURE__ */ show(/* @__PURE__ */ showMaybe(showLocation));
  var show32 = /* @__PURE__ */ show(/* @__PURE__ */ showEither(showBoardError)(showBoard));
  var for_2 = /* @__PURE__ */ for_(applicativeHalogenM);
  var for_1 = /* @__PURE__ */ for_2(foldableEither);
  var modify_4 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var map20 = /* @__PURE__ */ map(functorHalogenM);
  var for_22 = /* @__PURE__ */ for_2(foldableMaybe);
  var pure12 = /* @__PURE__ */ pure(applicativeHalogenM);
  var map110 = /* @__PURE__ */ map(functorMaybe);
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
    function AddPiece2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    AddPiece2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new AddPiece2(value0, value1, value22);
        };
      };
    };
    return AddPiece2;
  }();
  var RemovePiece = /* @__PURE__ */ function() {
    function RemovePiece2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RemovePiece2.create = function(value0) {
      return function(value1) {
        return new RemovePiece2(value0, value1);
      };
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
  var SetBoard = /* @__PURE__ */ function() {
    function SetBoard2(value0) {
      this.value0 = value0;
    }
    ;
    SetBoard2.create = function(value0) {
      return new SetBoard2(value0);
    };
    return SetBoard2;
  }();
  var OnKeyDown = /* @__PURE__ */ function() {
    function OnKeyDown2(value0) {
      this.value0 = value0;
    }
    ;
    OnKeyDown2.create = function(value0) {
      return new OnKeyDown2(value0);
    };
    return OnKeyDown2;
  }();
  var Undo = /* @__PURE__ */ function() {
    function Undo2() {
    }
    ;
    Undo2.value = new Undo2();
    return Undo2;
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
  var _piece = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component3 = function(dictMonadEffect) {
    var component1 = component2(dictMonadEffect);
    var monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
    var log4 = log3(monadEffectHalogenM2);
    var liftEffect9 = liftEffect(monadEffectHalogenM2);
    var render = function(state3) {
      var pieceHTML = function(location3) {
        return function(piece) {
          return slot2(_piece)(location3)(component1)({
            piece,
            location: location3
          })(PieceOutput.create);
        };
      };
      var n = viewOn(state3.board)(_size2);
      var emptyPieceHTML = function(loc) {
        return text(show6(loc));
      };
      return div3([id2("board-component"), style(intercalate5(";")(["grid-template-columns: " + power3("1fr ")(n), "grid-template-rows: " + power3("1fr ")(n)])), onKeyDown(OnKeyDown.create)])(bind8(range2(0)(n - 1 | 0))(function(j) {
        return bind8(range2(0)(n - 1 | 0))(function(i2) {
          var loc = location(i2)(j);
          var eitherPieceInfo = getPieceInfo(state3.board)(loc);
          var v = either(function(v1) {
            return rotation(0);
          })(function(v1) {
            return v1.rotation;
          })(eitherPieceInfo);
          return pure8(div3([class_("piece"), style("transform: rotate(" + (show1(v * 90 | 0) + "deg)")), onDragEnter(LocationOnDragEnter.create(loc)), onDragOver(LocationOnDragOver.create(loc)), onDragLeave(LocationOnDragLeave.create), onDrop(LocationOnDrop.create(loc))])(either(function(v1) {
            return [emptyPieceHTML(loc)];
          })(function() {
            var $120 = pieceHTML(loc);
            return function($121) {
              return pure8($120(function(v1) {
                return v1.piece;
              }($121)));
            };
          }())(eitherPieceInfo)));
        });
      }));
    };
    var initialState = function(v) {
      return {
        board: fromMaybe(standardBoard)(v.board),
        previousBoards: Nil.value,
        mouseOverLocation: Nothing.value
      };
    };
    var handleAction = function(v) {
      if (v instanceof PieceOutput && v.value0 instanceof Rotated) {
        return appendModifying2(function() {
          var $122 = prop5($$Proxy.value)(strongFn);
          var $123 = ix3(v.value0.value0)(strongFn)(choiceFn);
          var $124 = prop13($$Proxy.value)(strongFn);
          return function($125) {
            return $122(_pieces3($123($124($125))));
          };
        }())(v.value0.value1);
      }
      ;
      if (v instanceof PieceOutput && v.value0 instanceof Dropped) {
        return discard5(log4("BOARD: received drop"))(function() {
          return bind13(gets4(function(v1) {
            return v1.board;
          }))(function(board) {
            return bind13(gets4(function(v1) {
              return v1.mouseOverLocation;
            }))(function(maybeDestination) {
              var remove = removePiece(v.value0.value0)(board);
              var move = function(dst) {
                return bind23(getPieceInfo(board)(v.value0.value0))(function(p2) {
                  return bind23(bind23(remove)(addPiece2(dst)(p2.piece)))(rotatePieceBy(dst)(p2.rotation));
                });
              };
              var board$prime = maybe(remove)(move)(maybeDestination);
              return discard5(log4("BOARD: loction " + show23(maybeDestination)))(function() {
                return discard5(log4("BOARD: board " + show32(board$prime)))(function() {
                  return for_1(board$prime)(function(b2) {
                    return discard5(log4("BOARD: setting new board"))(function() {
                      return handleAction(new SetBoard(b2));
                    });
                  });
                });
              });
            });
          });
        });
      }
      ;
      if (v instanceof SetBoard) {
        return discard5(log4("set ne board"))(function() {
          return discard5(modify_4(function(s) {
            var $84 = {};
            for (var $85 in s) {
              if ({}.hasOwnProperty.call(s, $85)) {
                $84[$85] = s[$85];
              }
              ;
            }
            ;
            $84.board = v.value0;
            $84.previousBoards = new Cons(v.value0, s.previousBoards);
            return $84;
          }))(function() {
            return raise(new NewBoardState(v.value0));
          });
        });
      }
      ;
      if (v instanceof Undo) {
        return bind13(map20(uncons3)(gets4(function(v1) {
          return v1.previousBoards;
        })))(function(previousBoards) {
          return for_22(previousBoards)(function(v1) {
            return modify_4(function(s) {
              var $89 = {};
              for (var $90 in s) {
                if ({}.hasOwnProperty.call(s, $90)) {
                  $89[$90] = s[$90];
                }
                ;
              }
              ;
              $89.board = v1.head;
              $89.previousBoards = v1.tail;
              return $89;
            });
          });
        });
      }
      ;
      if (v instanceof OnKeyDown) {
        var $94 = code2(v.value0) === "90" && ctrlKey(v.value0);
        if ($94) {
          return log4("undo");
        }
        ;
        return pure12(unit);
      }
      ;
      if (v instanceof LocationOnDragEnter) {
        return discard5(liftEffect9(preventDefault(toEvent(v.value1))))(function() {
          return log4("dragenter");
        });
      }
      ;
      if (v instanceof LocationOnDragOver) {
        return discard5(liftEffect9(preventDefault(toEvent(v.value1))))(function() {
          return modify_4(function(v1) {
            var $98 = {};
            for (var $99 in v1) {
              if ({}.hasOwnProperty.call(v1, $99)) {
                $98[$99] = v1[$99];
              }
              ;
            }
            ;
            $98.mouseOverLocation = new Just(v.value0);
            return $98;
          });
        });
      }
      ;
      if (v instanceof LocationOnDrop) {
        return discard5(log4("on drop"))(function() {
          return discard5(modify_4(function(v1) {
            var $103 = {};
            for (var $104 in v1) {
              if ({}.hasOwnProperty.call(v1, $104)) {
                $103[$104] = v1[$104];
              }
              ;
            }
            ;
            $103.mouseOverLocation = new Just(v.value0);
            return $103;
          }))(function() {
            return liftEffect9(preventDefault(toEvent(v.value1)));
          });
        });
      }
      ;
      if (v instanceof LocationOnDragLeave) {
        return discard5(log4("drag leave"))(function() {
          return modify_4(function(v1) {
            var $108 = {};
            for (var $109 in v1) {
              if ({}.hasOwnProperty.call(v1, $109)) {
                $108[$109] = v1[$109];
              }
              ;
            }
            ;
            $108.mouseOverLocation = Nothing.value;
            return $108;
          });
        });
      }
      ;
      throw new Error("Failed pattern match at Component.Board (line 134, column 18 - line 184, column 53): " + [v.constructor.name]);
    };
    var $$eval4 = mkEval({
      finalize: Nothing.value,
      handleAction,
      handleQuery: function(v) {
        if (v instanceof GetBoard) {
          return bind13(gets4(function(v1) {
            return v1.board;
          }))(function(board) {
            return pure12(new Just(v.value0(board)));
          });
        }
        ;
        if (v instanceof AddPiece) {
          return bind13(gets4(function(v1) {
            return v1.board;
          }))(function(board) {
            var eitherBoard = addPiece2(v.value0)(v.value1)(board);
            return discard5(for_1(eitherBoard)(function(b2) {
              return handleAction(new SetBoard(b2));
            }))(function() {
              return pure12(map110(v.value2)(blush(eitherBoard)));
            });
          });
        }
        ;
        if (v instanceof RemovePiece) {
          return bind13(gets4(function(v1) {
            return v1.board;
          }))(function(board) {
            var eitherBoard = removePiece(v.value0)(board);
            return discard5(for_1(eitherBoard)(function(b2) {
              return handleAction(new SetBoard(b2));
            }))(function() {
              return pure12(map110(v.value1)(blush(eitherBoard)));
            });
          });
        }
        ;
        if (v instanceof GetMouseOverLocation) {
          return bind13(gets4(function(v1) {
            return v1.mouseOverLocation;
          }))(function(maybeLoc) {
            return pure12(map110(v.value0)(maybeLoc));
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Board (line 112, column 20 - line 128, column 32): " + [v.constructor.name]);
      },
      initialize: Nothing.value,
      receive: $$const(Nothing.value)
    });
    return mkComponent({
      "eval": $$eval4,
      initialState,
      render
    });
  };

  // output/Game.Expression/index.js
  var fold3 = /* @__PURE__ */ fold2(monoidString);
  var mapFlipped4 = /* @__PURE__ */ mapFlipped(functorArray);
  var show12 = /* @__PURE__ */ show(showInt);
  var lookup8 = /* @__PURE__ */ lookup(ordCardinalDirection);
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
  var showSignal = {
    show: function(v) {
      return fold3(mapFlipped4([12, 8, 4, 0])(function(shift) {
        return toStringAs(hexadecimal)(v >> shift & 15);
      }));
    }
  };
  var heytingAlgebraSignal = /* @__PURE__ */ function() {
    return {
      ff: 0,
      tt: -1 | 0,
      not: function(v) {
        return ~v;
      },
      implies: function(v) {
        return function(v1) {
          return ~v | v1;
        };
      },
      disj: function(v) {
        return function(v1) {
          return v | v1;
        };
      },
      conj: function(v) {
        return function(v1) {
          return v & v1;
        };
      }
    };
  }();
  var ff2 = /* @__PURE__ */ ff(heytingAlgebraSignal);
  var tt2 = /* @__PURE__ */ tt(heytingAlgebraSignal);
  var not2 = /* @__PURE__ */ not(heytingAlgebraSignal);
  var disj2 = /* @__PURE__ */ disj(heytingAlgebraSignal);
  var conj1 = /* @__PURE__ */ conj(heytingAlgebraSignal);
  var heytingAlgebraExpression = /* @__PURE__ */ function() {
    return {
      ff: new Raw(ff2),
      tt: new Raw(tt2),
      not: Not.create,
      implies: function(a2) {
        return function(b2) {
          return new Or(new Not(a2), b2);
        };
      },
      disj: Or.create,
      conj: And.create
    };
  }();
  var eqSignal = {
    eq: function(v) {
      return function(v1) {
        return show12(v) === show12(v1);
      };
    }
  };
  var ref2 = /* @__PURE__ */ function() {
    return Ref2.create;
  }();
  var evaluate = function(m) {
    var go2 = function(v) {
      if (v instanceof Raw) {
        return v.value0;
      }
      ;
      if (v instanceof Ref2) {
        return fromMaybe(ff2)(lookup8(v.value0)(m));
      }
      ;
      if (v instanceof Not) {
        return not2(go2(v.value0));
      }
      ;
      if (v instanceof Or) {
        return disj2(go2(v.value0))(go2(v.value1));
      }
      ;
      if (v instanceof And) {
        return conj1(go2(v.value0))(go2(v.value1));
      }
      ;
      if (v instanceof Xor) {
        var v1 = go2(v.value1);
        var v2 = go2(v.value0);
        return v2 ^ v1;
      }
      ;
      throw new Error("Failed pattern match at Game.Expression (line 99, column 8 - line 106, column 45): " + [v.constructor.name]);
    };
    return go2;
  };

  // output/Game.ProblemDescription/index.js
  var eqMap2 = /* @__PURE__ */ eqMap(eqCardinalDirection)(eqSignal);
  var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadAff);
  var for_3 = /* @__PURE__ */ for_(applicativeExceptT2)(foldableArray);
  var $$eval3 = /* @__PURE__ */ $$eval(pieceBoard);
  var eval1 = /* @__PURE__ */ $$eval(pieceAPiece);
  var notEq2 = /* @__PURE__ */ notEq(eqMap2);
  var throwError2 = /* @__PURE__ */ throwError(/* @__PURE__ */ monadThrowExceptT(monadAff));
  var pure9 = /* @__PURE__ */ pure(applicativeExceptT2);
  var getPort4 = /* @__PURE__ */ getPort(pieceAPiece);
  var getPort1 = /* @__PURE__ */ getPort(pieceBoard);
  var notEq1 = /* @__PURE__ */ notEq(eqPort);
  var discard6 = /* @__PURE__ */ discard(discardUnit)(/* @__PURE__ */ bindExceptT(monadAff));
  var length7 = /* @__PURE__ */ length2(foldableMap)(semiringInt);
  var filter6 = /* @__PURE__ */ filter2(ordLocation);
  var eq5 = /* @__PURE__ */ eq(eqAPiece);
  var DifferentPortConfiguration = /* @__PURE__ */ function() {
    function DifferentPortConfiguration2(value0) {
      this.value0 = value0;
    }
    ;
    DifferentPortConfiguration2.create = function(value0) {
      return new DifferentPortConfiguration2(value0);
    };
    return DifferentPortConfiguration2;
  }();
  var DifferentPort = /* @__PURE__ */ function() {
    function DifferentPort2(value0) {
      this.value0 = value0;
    }
    ;
    DifferentPort2.create = function(value0) {
      return new DifferentPort2(value0);
    };
    return DifferentPort2;
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
  var solvedBy = function(problem) {
    return function(board) {
      var checkTestCases = for_3(problem.testCases)(function(inputs) {
        var received = $$eval3(board)(inputs);
        var expected = eval1(problem.goal)(inputs);
        var $69 = notEq2(received)(expected);
        if ($69) {
          return throwError2(new FailedTestCase({
            inputs,
            received,
            expected
          }));
        }
        ;
        return pure9(unit);
      });
      var checkSamePorts = for_3(allDirections)(function(dir2) {
        var v = getPort4(problem.goal)(dir2);
        var v1 = getPort1(board)(dir2);
        if (v1 instanceof Nothing && v instanceof Nothing) {
          return pure9(unit);
        }
        ;
        if (v1 instanceof Nothing && v instanceof Just) {
          return throwError2(new DifferentPortConfiguration({
            dir: dir2,
            received: Nothing.value,
            expected: new Just(v.value0)
          }));
        }
        ;
        if (v1 instanceof Just && v instanceof Nothing) {
          return throwError2(new DifferentPortConfiguration({
            dir: dir2,
            received: new Just(v1.value0),
            expected: Nothing.value
          }));
        }
        ;
        if (v1 instanceof Just && v instanceof Just) {
          var $74 = notEq1(v1.value0)(v.value0);
          if ($74) {
            return throwError2(new DifferentPort({
              dir: dir2,
              received: v1.value0,
              expected: v.value0
            }));
          }
          ;
          return pure9(unit);
        }
        ;
        throw new Error("Failed pattern match at Game.ProblemDescription (line 86, column 7 - line 93, column 27): " + [v1.constructor.name, v.constructor.name]);
      });
      var checkOtherRestrictions = for_3(problem.otherRestrictions)(function(r) {
        var $77 = r.restriction(board);
        if ($77) {
          return pure9(unit);
        }
        ;
        return throwError2(new FailedRestriction({
          name: r.name,
          description: r.description
        }));
      });
      return discard6(checkSamePorts)(function() {
        return discard6(checkTestCases)(function() {
          return discard6(checkOtherRestrictions)(function() {
            return pure9(true);
          });
        });
      });
    };
  };
  var restrictionPieceCount = function(dictPiece) {
    var mkPiece3 = mkPiece(dictPiece);
    return function(v) {
      return function(piece) {
        return function(v1) {
          var n = length7(filter6(function(p2) {
            return eq5(mkPiece3(piece))(p2.piece);
          })(v1.pieces));
          return v.value0 <= n && n <= v.value1;
        };
      };
    };
  };

  // output/Component.Sidebar/index.js
  var show7 = /* @__PURE__ */ show(/* @__PURE__ */ showMap(showCardinalDirection)(showSignal));
  var show13 = /* @__PURE__ */ show(showCardinalDirection);
  var mapFlipped5 = /* @__PURE__ */ mapFlipped(functorArray);
  var fromFoldable8 = /* @__PURE__ */ fromFoldable(foldableSet);
  var name5 = /* @__PURE__ */ name2(pieceAPiece);
  var bind9 = /* @__PURE__ */ bind(bindHalogenM);
  var gets5 = /* @__PURE__ */ gets(monadStateHalogenM);
  var discard7 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_5 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var pure10 = /* @__PURE__ */ pure(applicativeHalogenM);
  var IsProblemSolved = /* @__PURE__ */ function() {
    function IsProblemSolved2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    IsProblemSolved2.create = function(value0) {
      return function(value1) {
        return new IsProblemSolved2(value0, value1);
      };
    };
    return IsProblemSolved2;
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
  var component4 = function(dictMonadAff) {
    var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
    var renderSignals = function(signals) {
      return text(show7(signals));
    };
    var renderPort = function(port2) {
      return span2([class_("port")])([text(function() {
        var $22 = isInput(port2);
        if ($22) {
          return "Input";
        }
        ;
        return "Output";
      }())]);
    };
    var renderDirection = function(dir2) {
      return span2([class_("direction")])([text(show13(dir2))]);
    };
    var renderError = function(err) {
      return div_(function() {
        if (err instanceof DifferentPortConfiguration) {
          if (err.value0.received instanceof Just && err.value0.expected instanceof Nothing) {
            return [text("Remove the "), renderPort(err.value0.received.value0), text(" in the "), renderDirection(err.value0.dir), text(" direction.")];
          }
          ;
          if (err.value0.received instanceof Nothing && err.value0.expected instanceof Just) {
            return [text("You need an "), renderPort(err.value0.expected.value0), text(" in the "), renderDirection(err.value0.dir), text(" direction")];
          }
          ;
          return [text("ERROR")];
        }
        ;
        if (err instanceof DifferentPort) {
          return [text("You need an "), renderPort(err.value0.expected), text(" in the "), renderDirection(err.value0.dir), text(" direction.")];
        }
        ;
        if (err instanceof FailedTestCase) {
          return [text("For the inputs "), renderSignals(err.value0.inputs), text(" your solution should output "), renderSignals(err.value0.expected), text(", not "), renderSignals(err.value0.received), text(".")];
        }
        ;
        if (err instanceof FailedRestriction) {
          return [text("Failed predicate " + (err.value0.name + (" with description " + err.value0.description)))];
        }
        ;
        throw new Error("Failed pattern match at Component.Sidebar (line 78, column 31 - line 89, column 91): " + [err.constructor.name]);
      }());
    };
    var render = function(v) {
      return div3([class_("sidebar-component")])([h2_([text(v.problem.title)]), h3_([text(v.problem.description)]), maybe(text("problem complete"))(renderError)(v.error), h3_([text("Available pieces:")]), div3([class_("pieces")])(mapFlipped5(fromFoldable8(v.problem.pieceSet))(function(piece) {
        return div3([draggable(true), onDragEnd(PieceOnDrop.create(piece)), onDoubleClick(PieceOnClick.create(piece))])([text(name5(piece))]);
      }))]);
    };
    var initialState = function(problem) {
      return {
        problem,
        error: Nothing.value
      };
    };
    var $$eval4 = mkEval({
      finalize: Nothing.value,
      handleAction: function(v) {
        if (v instanceof PieceOnDrop) {
          return raise(new PieceDropped(v.value0));
        }
        ;
        if (v instanceof PieceOnClick) {
          return raise(new PieceAdded(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Component.Sidebar (line 104, column 21 - line 108, column 37): " + [v.constructor.name]);
      },
      handleQuery: function(v) {
        return bind9(gets5(function(v1) {
          return v1.problem;
        }))(function(problemDescription) {
          return bind9(liftAff2(runExceptT(solvedBy(problemDescription)(v.value0))))(function(isSolved) {
            return discard7(modify_5(function(v1) {
              var $41 = {};
              for (var $42 in v1) {
                if ({}.hasOwnProperty.call(v1, $42)) {
                  $41[$42] = v1[$42];
                }
                ;
              }
              ;
              $41.error = blush(isSolved);
              return $41;
            }))(function() {
              return pure10(new Just(v.value1(isSolved)));
            });
          });
        });
      },
      initialize: Nothing.value,
      receive: $$const(Nothing.value)
    });
    return mkComponent({
      "eval": $$eval4,
      initialState,
      render
    });
  };

  // output/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value12) {
    var tag = Object.prototype.toString.call(value12);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value12);
    } else {
      return nothing;
    }
  }

  // output/Web.HTML.HTMLElement/index.js
  var toNode2 = unsafeCoerce2;
  var fromElement = function(x) {
    return _read(Nothing.value, Just.create, x);
  };

  // output/Halogen.Query/index.js
  var $$void5 = /* @__PURE__ */ $$void(functorHalogenM);
  var query2 = /* @__PURE__ */ query();
  var identity14 = /* @__PURE__ */ identity(categoryFn);
  var tell2 = function() {
    return function(dictIsSymbol) {
      var query1 = query2(dictIsSymbol);
      return function(dictOrd) {
        var query22 = query1(dictOrd);
        return function(slot4) {
          return function(label5) {
            return function(req) {
              return $$void5(query22(slot4)(label5)(req(unit)));
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
            return function(req) {
              return query22(slot4)(label5)(req(identity14));
            };
          };
        };
      };
    };
  };

  // output/Component.Puzzle/index.js
  var slot3 = /* @__PURE__ */ slot();
  var boardIsSymbol = {
    reflectSymbol: function() {
      return "board";
    }
  };
  var slot1 = /* @__PURE__ */ slot3(boardIsSymbol)(ordUnit);
  var chatIsSymbol = {
    reflectSymbol: function() {
      return "chat";
    }
  };
  var slot_2 = /* @__PURE__ */ slot_()(chatIsSymbol)(ordUnit);
  var sidebarIsSymbol = {
    reflectSymbol: function() {
      return "sidebar";
    }
  };
  var slot22 = /* @__PURE__ */ slot3(sidebarIsSymbol)(ordUnit);
  var bind10 = /* @__PURE__ */ bind(bindHalogenM);
  var gets6 = /* @__PURE__ */ gets(monadStateHalogenM);
  var discard8 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var tell3 = /* @__PURE__ */ tell2();
  var tell1 = /* @__PURE__ */ tell3(chatIsSymbol)(ordUnit);
  var request2 = /* @__PURE__ */ request();
  var request1 = /* @__PURE__ */ request2(boardIsSymbol)(ordUnit);
  var for_4 = /* @__PURE__ */ for_(applicativeHalogenM)(foldableMaybe);
  var request22 = /* @__PURE__ */ request2(sidebarIsSymbol)(ordUnit);
  var tell22 = /* @__PURE__ */ tell3(sidebarIsSymbol)(ordUnit);
  var pure11 = /* @__PURE__ */ pure(applicativeHalogenM);
  var Initialise3 = /* @__PURE__ */ function() {
    function Initialise4() {
    }
    ;
    Initialise4.value = new Initialise4();
    return Initialise4;
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
  var _sidebar = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _chat = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _board = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component5 = function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var component1 = component3(MonadEffect0);
    var component22 = component(dictMonadAff);
    var component32 = component4(dictMonadAff);
    var log4 = log3(monadEffectHalogenM(MonadEffect0));
    var render = function(state3) {
      return div3([class_("puzzle")])([slot1(_board)(unit)(component1)({
        board: Nothing.value
      })(BoardOutput.create), slot_2(_chat)(unit)(component22)(unit), slot22(_sidebar)(unit)(component32)(state3.problemDescription)(SidebarOutput.create)]);
    };
    var $$eval4 = mkEval({
      finalize: Nothing.value,
      handleAction: function(v) {
        if (v instanceof Initialise3) {
          return bind10(gets6(function(v1) {
            return v1.conversation;
          }))(function(initialConversation) {
            return discard8(tell1(_chat)(unit)(function(v1) {
              return new QueuedMessages(initialConversation);
            }))(function() {
              return bind10(request1(_board)(unit)(GetBoard.create))(function(maybeBoard) {
                return for_4(maybeBoard)(function(board) {
                  return request22(_sidebar)(unit)(IsProblemSolved.create(board));
                });
              });
            });
          });
        }
        ;
        if (v instanceof BoardOutput) {
          return tell22(_sidebar)(unit)(function(v1) {
            return new IsProblemSolved(v.value0.value0, function(v2) {
              return unit;
            });
          });
        }
        ;
        if (v instanceof SidebarOutput && v.value0 instanceof PieceDropped) {
          return discard8(log4("SIDEBAR: drop"))(function() {
            return bind10(request1(_board)(unit)(GetMouseOverLocation.create))(function(maybeLocation) {
              return for_4(maybeLocation)(function(loc) {
                return request1(_board)(unit)(AddPiece.create(loc)(v.value0.value0));
              });
            });
          });
        }
        ;
        if (v instanceof SidebarOutput && v.value0 instanceof PieceAdded) {
          return bind10(request1(_board)(unit)(GetBoard.create))(function(maybeBoard) {
            return for_4(maybeBoard)(function(board) {
              return for_4(firstEmptyLocation(board))(function(loc) {
                return request1(_board)(unit)(AddPiece.create(loc)(v.value0.value0));
              });
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Component.Puzzle (line 62, column 21 - line 80, column 61): " + [v.constructor.name]);
      },
      handleQuery: function(v) {
        return pure11(Nothing.value);
      },
      initialize: new Just(Initialise3.value),
      receive: $$const(Nothing.value)
    });
    return mkComponent({
      "eval": $$eval4,
      initialState: identity(categoryFn),
      render
    });
  };

  // output/Game.Piece.BasicPiece/index.js
  var mapMaybe4 = /* @__PURE__ */ mapMaybe2(ordCardinalDirection);
  var mapFlipped6 = /* @__PURE__ */ mapFlipped(functorMap);
  var fromFoldable9 = /* @__PURE__ */ fromFoldable3(ordCardinalDirection)(foldableArray);
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
  var pieceBasicPiece = {
    name: function(v) {
      return v.name;
    },
    "eval": function(v) {
      return function(f) {
        return flip(mapMaybe4)(v.ports)(function(v1) {
          if (v1 instanceof BasicInput) {
            return Nothing.value;
          }
          ;
          if (v1 instanceof BasicOutput) {
            return new Just(evaluate(f)(v1.value0));
          }
          ;
          throw new Error("Failed pattern match at Game.Piece.BasicPiece (line 30, column 56 - line 32, column 59): " + [v1.constructor.name]);
        });
      };
    },
    ports: function(v) {
      return mapFlipped6(v.ports)(function(v1) {
        if (v1 instanceof BasicInput) {
          return new Input(v.capacity);
        }
        ;
        if (v1 instanceof BasicOutput) {
          return new Output(v.capacity);
        }
        ;
        throw new Error("Failed pattern match at Game.Piece.BasicPiece (line 33, column 41 - line 35, column 43): " + [v1.constructor.name]);
      });
    }
  };
  var notPiece = /* @__PURE__ */ function() {
    return {
      name: "not",
      capacity: 1,
      ports: fromFoldable9([new Tuple(Left2.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(not(heytingAlgebraExpression)(ref2(Left2.value))))])
    };
  }();
  var idPiece = /* @__PURE__ */ function() {
    return {
      name: "id",
      capacity: 1,
      ports: fromFoldable9([new Tuple(Left2.value, BasicInput.value), new Tuple(Right2.value, new BasicOutput(ref2(Left2.value)))])
    };
  }();

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
  var parse = function(v) {
    if (v === "loading") {
      return new Just(Loading.value);
    }
    ;
    if (v === "interactive") {
      return new Just(Interactive.value);
    }
    ;
    if (v === "complete") {
      return new Just(Complete.value);
    }
    ;
    return Nothing.value;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var map21 = /* @__PURE__ */ map(functorEffect);
  var toParentNode = unsafeCoerce2;
  var toDocument = unsafeCoerce2;
  var readyState = function(doc) {
    return map21(function() {
      var $4 = fromMaybe(Loading.value);
      return function($5) {
        return $4(parse($5));
      };
    }())(function() {
      return _readyState(doc);
    });
  };

  // output/Web.HTML.Window/foreign.js
  function document(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/Web.HTML.Window/index.js
  var toEventTarget = unsafeCoerce2;

  // output/Halogen.Aff.Util/index.js
  var bind11 = /* @__PURE__ */ bind(bindAff);
  var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindEffect);
  var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
  var pure13 = /* @__PURE__ */ pure(applicativeAff);
  var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var pure14 = /* @__PURE__ */ pure(applicativeEffect);
  var map22 = /* @__PURE__ */ map(functorEffect);
  var selectElement = function(query3) {
    return bind11(liftEffect4(bindFlipped5(composeKleisliFlipped2(function() {
      var $16 = querySelector(query3);
      return function($17) {
        return $16(toParentNode($17));
      };
    }())(document))(windowImpl)))(function(mel) {
      return pure13(bindFlipped1(fromElement)(mel));
    });
  };
  var runHalogenAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure14(unit))));
  var awaitLoad = /* @__PURE__ */ makeAff(function(callback) {
    return function __do2() {
      var rs = bindFlipped5(readyState)(bindFlipped5(document)(windowImpl))();
      if (rs instanceof Loading) {
        var et = map22(toEventTarget)(windowImpl)();
        var listener = eventListener(function(v) {
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
  var fork2 = function(dict) {
    return dict.fork;
  };

  // output/Halogen.Aff.Driver.State/index.js
  var unRenderStateX = unsafeCoerce2;
  var unDriverStateX = unsafeCoerce2;
  var renderStateX_ = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMaybe);
    return function(f) {
      return unDriverStateX(function(st) {
        return traverse_7(f)(st.rendering);
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
    return function(v) {
      return f(v);
    };
  };
  var initDriverState = function(component6) {
    return function(input3) {
      return function(handler3) {
        return function(lchs) {
          return function __do2() {
            var selfRef = $$new({})();
            var childrenIn = $$new(empty3)();
            var childrenOut = $$new(empty3)();
            var handlerRef = $$new(handler3)();
            var pendingQueries = $$new(new Just(Nil.value))();
            var pendingOuts = $$new(new Just(Nil.value))();
            var pendingHandlers = $$new(Nothing.value)();
            var fresh2 = $$new(1)();
            var subscriptions = $$new(new Just(empty2))();
            var forks = $$new(empty2)();
            var ds = {
              component: component6,
              state: component6.initialState(input3),
              refs: empty2,
              children: empty3,
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
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var lookup9 = /* @__PURE__ */ lookup(ordSubscriptionId);
  var bind14 = /* @__PURE__ */ bind(bindAff);
  var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var discard9 = /* @__PURE__ */ discard(discardUnit);
  var discard1 = /* @__PURE__ */ discard9(bindAff);
  var traverse_12 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_22 = /* @__PURE__ */ traverse_12(foldableList);
  var fork3 = /* @__PURE__ */ fork2(monadForkAff);
  var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var pure15 = /* @__PURE__ */ pure(applicativeAff);
  var map23 = /* @__PURE__ */ map(functorCoyoneda);
  var parallel2 = /* @__PURE__ */ parallel(parallelAff);
  var map111 = /* @__PURE__ */ map(functorAff);
  var sequential2 = /* @__PURE__ */ sequential(parallelAff);
  var map24 = /* @__PURE__ */ map(functorMaybe);
  var insert7 = /* @__PURE__ */ insert(ordSubscriptionId);
  var retractFreeAp2 = /* @__PURE__ */ retractFreeAp(applicativeParAff);
  var $$delete5 = /* @__PURE__ */ $$delete(ordForkId);
  var unlessM2 = /* @__PURE__ */ unlessM(monadEffect);
  var insert12 = /* @__PURE__ */ insert(ordForkId);
  var traverse_32 = /* @__PURE__ */ traverse_12(foldableMaybe);
  var lookup13 = /* @__PURE__ */ lookup(ordForkId);
  var lookup22 = /* @__PURE__ */ lookup(ordString);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe3 = function(sid) {
    return function(ref3) {
      return function __do2() {
        var v = read(ref3)();
        var subs = read(v.subscriptions)();
        return traverse_4(unsubscribe)(bindFlipped6(lookup9(sid))(subs))();
      };
    };
  };
  var queueOrRun = function(ref3) {
    return function(au) {
      return bind14(liftEffect5(read(ref3)))(function(v) {
        if (v instanceof Nothing) {
          return au;
        }
        ;
        if (v instanceof Just) {
          return liftEffect5(write(new Just(new Cons(au, v.value0)))(ref3));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 188, column 33 - line 190, column 57): " + [v.constructor.name]);
      });
    };
  };
  var handleLifecycle = function(lchs) {
    return function(f) {
      return discard1(liftEffect5(write({
        initializers: Nil.value,
        finalizers: Nil.value
      })(lchs)))(function() {
        return bind14(liftEffect5(f))(function(result) {
          return bind14(liftEffect5(read(lchs)))(function(v) {
            return discard1(traverse_22(fork3)(v.finalizers))(function() {
              return discard1(parSequence_2(v.initializers))(function() {
                return pure15(result);
              });
            });
          });
        });
      });
    };
  };
  var handleAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure(applicativeEffect)(unit))));
  var fresh = function(f) {
    return function(ref3) {
      return bind14(liftEffect5(read(ref3)))(function(v) {
        return liftEffect5(modify$prime(function(i2) {
          return {
            state: i2 + 1 | 0,
            value: f(i2)
          };
        })(v.fresh));
      });
    };
  };
  var evalQ = function(render) {
    return function(ref3) {
      return function(q2) {
        return bind14(liftEffect5(read(ref3)))(function(v) {
          return evalM(render)(ref3)(v["component"]["eval"](new Query(map23(Just.create)(liftCoyoneda(q2)), $$const(Nothing.value))));
        });
      };
    };
  };
  var evalM = function(render) {
    return function(initRef) {
      return function(v) {
        var evalChildQuery = function(ref3) {
          return function(cqb) {
            return bind14(liftEffect5(read(ref3)))(function(v1) {
              return unChildQueryBox(function(v2) {
                var evalChild = function(v3) {
                  return parallel2(bind14(liftEffect5(read(v3)))(function(dsx) {
                    return unDriverStateX(function(ds) {
                      return evalQ(render)(ds.selfRef)(v2.value1);
                    })(dsx);
                  }));
                };
                return map111(v2.value2)(sequential2(v2.value0(applicativeParAff)(evalChild)(v1.children)));
              })(cqb);
            });
          };
        };
        var go2 = function(ref3) {
          return function(v1) {
            if (v1 instanceof State) {
              return bind14(liftEffect5(read(ref3)))(function(v2) {
                var v3 = v1.value0(v2.state);
                if (unsafeRefEq(v2.state)(v3.value1)) {
                  return pure15(v3.value0);
                }
                ;
                if (otherwise) {
                  return discard1(liftEffect5(write({
                    component: v2.component,
                    state: v3.value1,
                    refs: v2.refs,
                    children: v2.children,
                    childrenIn: v2.childrenIn,
                    childrenOut: v2.childrenOut,
                    selfRef: v2.selfRef,
                    handlerRef: v2.handlerRef,
                    pendingQueries: v2.pendingQueries,
                    pendingOuts: v2.pendingOuts,
                    pendingHandlers: v2.pendingHandlers,
                    rendering: v2.rendering,
                    fresh: v2.fresh,
                    subscriptions: v2.subscriptions,
                    forks: v2.forks,
                    lifecycleHandlers: v2.lifecycleHandlers
                  })(ref3)))(function() {
                    return discard1(handleLifecycle(v2.lifecycleHandlers)(render(v2.lifecycleHandlers)(ref3)))(function() {
                      return pure15(v3.value0);
                    });
                  });
                }
                ;
                throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 86, column 7 - line 92, column 21): " + [v3.constructor.name]);
              });
            }
            ;
            if (v1 instanceof Subscribe) {
              return bind14(fresh(SubscriptionId)(ref3))(function(sid) {
                return bind14(liftEffect5(subscribe(v1.value0(sid))(function(act) {
                  return handleAff(evalF(render)(ref3)(new Action(act)));
                })))(function(finalize) {
                  return bind14(liftEffect5(read(ref3)))(function(v2) {
                    return discard1(liftEffect5(modify_(map24(insert7(sid)(finalize)))(v2.subscriptions)))(function() {
                      return pure15(v1.value1(sid));
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Unsubscribe) {
              return discard1(liftEffect5(unsubscribe3(v1.value0)(ref3)))(function() {
                return pure15(v1.value1);
              });
            }
            ;
            if (v1 instanceof Lift2) {
              return v1.value0;
            }
            ;
            if (v1 instanceof ChildQuery2) {
              return evalChildQuery(ref3)(v1.value0);
            }
            ;
            if (v1 instanceof Raise) {
              return bind14(liftEffect5(read(ref3)))(function(v2) {
                return bind14(liftEffect5(read(v2.handlerRef)))(function(handler3) {
                  return discard1(queueOrRun(v2.pendingOuts)(handler3(v1.value0)))(function() {
                    return pure15(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Par) {
              return sequential2(retractFreeAp2(hoistFreeAp(function() {
                var $118 = evalM(render)(ref3);
                return function($119) {
                  return parallel2($118($119));
                };
              }())(v1.value0)));
            }
            ;
            if (v1 instanceof Fork) {
              return bind14(fresh(ForkId)(ref3))(function(fid) {
                return bind14(liftEffect5(read(ref3)))(function(v2) {
                  return bind14(liftEffect5($$new(false)))(function(doneRef) {
                    return bind14(fork3($$finally(liftEffect5(function __do2() {
                      modify_($$delete5(fid))(v2.forks)();
                      return write(true)(doneRef)();
                    }))(evalM(render)(ref3)(v1.value0))))(function(fiber) {
                      return discard1(liftEffect5(unlessM2(read(doneRef))(modify_(insert12(fid)(fiber))(v2.forks))))(function() {
                        return pure15(v1.value1(fid));
                      });
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Join) {
              return bind14(liftEffect5(read(ref3)))(function(v2) {
                return bind14(liftEffect5(read(v2.forks)))(function(forkMap) {
                  return discard1(traverse_32(joinFiber)(lookup13(v1.value0)(forkMap)))(function() {
                    return pure15(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Kill) {
              return bind14(liftEffect5(read(ref3)))(function(v2) {
                return bind14(liftEffect5(read(v2.forks)))(function(forkMap) {
                  return discard1(traverse_32(killFiber(error("Cancelled")))(lookup13(v1.value0)(forkMap)))(function() {
                    return pure15(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof GetRef) {
              return bind14(liftEffect5(read(ref3)))(function(v2) {
                return pure15(v1.value1(lookup22(v1.value0)(v2.refs)));
              });
            }
            ;
            throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 83, column 12 - line 139, column 33): " + [v1.constructor.name]);
          };
        };
        return foldFree2(go2(initRef))(v);
      };
    };
  };
  var evalF = function(render) {
    return function(ref3) {
      return function(v) {
        if (v instanceof RefUpdate) {
          return liftEffect5(flip(modify_)(ref3)(mapDriverState(function(st) {
            return {
              component: st.component,
              state: st.state,
              refs: alter2($$const(v.value1))(v.value0)(st.refs),
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
        if (v instanceof Action) {
          return bind14(liftEffect5(read(ref3)))(function(v1) {
            return evalM(render)(ref3)(v1["component"]["eval"](new Action2(v.value0, unit)));
          });
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 52, column 20 - line 58, column 62): " + [v.constructor.name]);
      };
    };
  };

  // output/Halogen.Aff.Driver/index.js
  var bind15 = /* @__PURE__ */ bind(bindEffect);
  var discard10 = /* @__PURE__ */ discard(discardUnit);
  var for_5 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_5 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var fork4 = /* @__PURE__ */ fork2(monadForkAff);
  var bindFlipped7 = /* @__PURE__ */ bindFlipped(bindEffect);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_13(foldableMap);
  var discard22 = /* @__PURE__ */ discard10(bindAff);
  var parSequence_3 = /* @__PURE__ */ parSequence_(parallelAff)(foldableList);
  var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure16 = /* @__PURE__ */ pure(applicativeEffect);
  var map25 = /* @__PURE__ */ map(functorEffect);
  var pure17 = /* @__PURE__ */ pure(applicativeAff);
  var when2 = /* @__PURE__ */ when(applicativeEffect);
  var renderStateX2 = /* @__PURE__ */ renderStateX(functorEffect);
  var $$void6 = /* @__PURE__ */ $$void(functorAff);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_2 = /* @__PURE__ */ renderStateX_(applicativeEffect);
  var tailRecM3 = /* @__PURE__ */ tailRecM(monadRecEffect);
  var voidLeft6 = /* @__PURE__ */ voidLeft(functorEffect);
  var bind16 = /* @__PURE__ */ bind(bindAff);
  var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
  var newLifecycleHandlers = /* @__PURE__ */ function() {
    return $$new({
      initializers: Nil.value,
      finalizers: Nil.value
    });
  }();
  var handlePending = function(ref3) {
    return function __do2() {
      var queue = read(ref3)();
      write(Nothing.value)(ref3)();
      return for_5(queue)(function() {
        var $58 = traverse_5(fork4);
        return function($59) {
          return handleAff($58(reverse2($59)));
        };
      }())();
    };
  };
  var cleanupSubscriptionsAndForks = function(v) {
    return function __do2() {
      bindFlipped7(traverse_23(traverse_33(unsubscribe)))(read(v.subscriptions))();
      write(Nothing.value)(v.subscriptions)();
      bindFlipped7(traverse_33(function() {
        var $60 = killFiber(error("finalized"));
        return function($61) {
          return handleAff($60($61));
        };
      }()))(read(v.forks))();
      return write(empty2)(v.forks)();
    };
  };
  var runUI = function(renderSpec2) {
    return function(component6) {
      return function(i2) {
        var squashChildInitializers = function(lchs) {
          return function(preInits) {
            return unDriverStateX(function(st) {
              var parentInitializer = evalM(render)(st.selfRef)(st["component"]["eval"](new Initialize(unit)));
              return modify_(function(handlers) {
                return {
                  initializers: new Cons(discard22(parSequence_3(reverse2(handlers.initializers)))(function() {
                    return discard22(parentInitializer)(function() {
                      return liftEffect6(function __do2() {
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
        var runComponent2 = function(lchs) {
          return function(handler3) {
            return function(j) {
              return unComponent(function(c) {
                return function __do2() {
                  var lchs$prime = newLifecycleHandlers();
                  var $$var2 = initDriverState(c)(j)(handler3)(lchs$prime)();
                  var pre2 = read(lchs)();
                  write({
                    initializers: Nil.value,
                    finalizers: pre2.finalizers
                  })(lchs)();
                  bindFlipped7(unDriverStateX(function() {
                    var $62 = render(lchs);
                    return function($63) {
                      return $62(function(v) {
                        return v.selfRef;
                      }($63));
                    };
                  }()))(read($$var2))();
                  bindFlipped7(squashChildInitializers(lchs)(pre2.initializers))(read($$var2))();
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
                  return function __do2() {
                    var childrenIn = map25(slot4.pop)(read(childrenInRef))();
                    var $$var2 = function() {
                      if (childrenIn instanceof Just) {
                        write(childrenIn.value0.value1)(childrenInRef)();
                        var dsx = read(childrenIn.value0.value0)();
                        unDriverStateX(function(st) {
                          return function __do3() {
                            flip(write)(st.handlerRef)(function() {
                              var $64 = maybe(pure17(unit))(handler3);
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
                        return runComponent2(lchs)(function() {
                          var $66 = maybe(pure17(unit))(handler3);
                          return function($67) {
                            return $66(slot4.output($67));
                          };
                        }())(slot4.input)(slot4.component)();
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 213, column 14 - line 222, column 98): " + [childrenIn.constructor.name]);
                    }();
                    var isDuplicate = map25(function($68) {
                      return isJust(slot4.get($68));
                    })(read(childrenOutRef))();
                    when2(isDuplicate)(warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur"))();
                    modify_(slot4.set($$var2))(childrenOutRef)();
                    return bind15(read($$var2))(renderStateX2(function(v) {
                      if (v instanceof Nothing) {
                        return $$throw("Halogen internal error: child was not initialized in renderChild");
                      }
                      ;
                      if (v instanceof Just) {
                        return pure16(renderSpec2.renderChild(v.value0));
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 227, column 37 - line 229, column 50): " + [v.constructor.name]);
                    }))();
                  };
                });
              };
            };
          };
        };
        var render = function(lchs) {
          return function($$var2) {
            return function __do2() {
              var v = read($$var2)();
              var shouldProcessHandlers = map25(isNothing)(read(v.pendingHandlers))();
              when2(shouldProcessHandlers)(write(new Just(Nil.value))(v.pendingHandlers))();
              write(empty3)(v.childrenOut)();
              write(v.children)(v.childrenIn)();
              var handler3 = function() {
                var $69 = queueOrRun(v.pendingHandlers);
                var $70 = evalF(render)(v.selfRef);
                return function($71) {
                  return $69($$void6($70($71)));
                };
              }();
              var childHandler = function() {
                var $72 = queueOrRun(v.pendingQueries);
                return function($73) {
                  return $72(handler3(Action.create($73)));
                };
              }();
              var rendering = renderSpec2.render(function($74) {
                return handleAff(handler3($74));
              })(renderChild(lchs)(childHandler)(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
              var children2 = read(v.childrenOut)();
              var childrenIn = read(v.childrenIn)();
              foreachSlot2(childrenIn)(function(v1) {
                return function __do3() {
                  var childDS = read(v1)();
                  renderStateX_2(renderSpec2.removeChild)(childDS)();
                  return finalize(lchs)(childDS)();
                };
              })();
              flip(modify_)(v.selfRef)(mapDriverState(function(ds$prime) {
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
              return when2(shouldProcessHandlers)(flip(tailRecM3)(unit)(function(v1) {
                return function __do3() {
                  var handlers = read(v.pendingHandlers)();
                  write(new Just(Nil.value))(v.pendingHandlers)();
                  traverse_23(function() {
                    var $75 = traverse_5(fork4);
                    return function($76) {
                      return handleAff($75(reverse2($76)));
                    };
                  }())(handlers)();
                  var mmore = read(v.pendingHandlers)();
                  var $51 = maybe(false)($$null)(mmore);
                  if ($51) {
                    return voidLeft6(write(Nothing.value)(v.pendingHandlers))(new Done(unit))();
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
            return function __do2() {
              cleanupSubscriptionsAndForks(st)();
              var f = evalM(render)(st.selfRef)(st["component"]["eval"](new Finalize(unit)));
              modify_(function(handlers) {
                return {
                  initializers: handlers.initializers,
                  finalizers: new Cons(f, handlers.finalizers)
                };
              })(lchs)();
              return foreachSlot2(st.children)(function(v) {
                return function __do3() {
                  var dsx = read(v)();
                  return finalize(lchs)(dsx)();
                };
              })();
            };
          });
        };
        var evalDriver = function(disposed) {
          return function(ref3) {
            return function(q2) {
              return bind16(liftEffect6(read(disposed)))(function(v) {
                if (v) {
                  return pure17(Nothing.value);
                }
                ;
                return evalQ(render)(ref3)(q2);
              });
            };
          };
        };
        var dispose = function(disposed) {
          return function(lchs) {
            return function(dsx) {
              return handleLifecycle(lchs)(function __do2() {
                var v = read(disposed)();
                if (v) {
                  return unit;
                }
                ;
                write(true)(disposed)();
                finalize(lchs)(dsx)();
                return unDriverStateX(function(v1) {
                  return function __do3() {
                    var v2 = liftEffect1(read(v1.selfRef))();
                    return for_5(v2.rendering)(renderSpec2.dispose)();
                  };
                })(dsx)();
              });
            };
          };
        };
        return bind16(liftEffect6(newLifecycleHandlers))(function(lchs) {
          return bind16(liftEffect6($$new(false)))(function(disposed) {
            return handleLifecycle(lchs)(function __do2() {
              var sio = create();
              var dsx = bindFlipped7(read)(runComponent2(lchs)(function() {
                var $77 = notify(sio.listener);
                return function($78) {
                  return liftEffect6($77($78));
                };
              }())(i2)(component6))();
              return unDriverStateX(function(st) {
                return pure16({
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

  // output/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name18) {
    return function(node) {
      return function() {
        return node[name18];
      };
    };
  };
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
  function removeChild2(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output/Web.DOM.Node/index.js
  var map26 = /* @__PURE__ */ map(functorEffect);
  var parentNode2 = /* @__PURE__ */ function() {
    var $6 = map26(toMaybe);
    return function($7) {
      return $6(_parentNode($7));
    };
  }();
  var nextSibling = /* @__PURE__ */ function() {
    var $15 = map26(toMaybe);
    return function($16) {
      return $15(_nextSibling($16));
    };
  }();

  // output/Halogen.VDom.Driver/index.js
  var $runtime_lazy9 = function(name18, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name18 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var $$void7 = /* @__PURE__ */ $$void(functorEffect);
  var pure18 = /* @__PURE__ */ pure(applicativeEffect);
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var unwrap7 = /* @__PURE__ */ unwrap();
  var when3 = /* @__PURE__ */ when(applicativeEffect);
  var not3 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean)));
  var identity15 = /* @__PURE__ */ identity(categoryFn);
  var bind17 = /* @__PURE__ */ bind(bindAff);
  var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var map27 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped8 = /* @__PURE__ */ bindFlipped(bindEffect);
  var substInParent = function(v) {
    return function(v1) {
      return function(v2) {
        if (v1 instanceof Just && v2 instanceof Just) {
          return $$void7(insertBefore(v)(v1.value0)(v2.value0));
        }
        ;
        if (v1 instanceof Nothing && v2 instanceof Just) {
          return $$void7(appendChild(v)(v2.value0));
        }
        ;
        return pure18(unit);
      };
    };
  };
  var removeChild3 = function(v) {
    return function __do2() {
      var npn = parentNode2(v.node)();
      return traverse_6(function(pn) {
        return removeChild2(v.node)(pn);
      })(npn)();
    };
  };
  var mkSpec = function(handler3) {
    return function(renderChildRef) {
      return function(document2) {
        var getNode = unRenderStateX(function(v) {
          return v.node;
        });
        var done = function(st) {
          if (st instanceof Just) {
            return halt(st.value0);
          }
          ;
          return unit;
        };
        var buildWidget2 = function(spec) {
          var buildThunk2 = buildThunk(unwrap7)(spec);
          var $lazy_patch = $runtime_lazy9("patch", "Halogen.VDom.Driver", function() {
            return function(st, slot4) {
              if (st instanceof Just) {
                if (slot4 instanceof ComponentSlot) {
                  halt(st.value0);
                  return $lazy_renderComponentSlot(100)(slot4.value0);
                }
                ;
                if (slot4 instanceof ThunkSlot) {
                  var step$prime = step2(st.value0, slot4.value0);
                  return mkStep(new Step(extract2(step$prime), new Just(step$prime), $lazy_patch(103), done));
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 97, column 22 - line 103, column 79): " + [slot4.constructor.name]);
              }
              ;
              return $lazy_render(104)(slot4);
            };
          });
          var $lazy_render = $runtime_lazy9("render", "Halogen.VDom.Driver", function() {
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
          var $lazy_renderComponentSlot = $runtime_lazy9("renderComponentSlot", "Halogen.VDom.Driver", function() {
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
          return function(v) {
            return function(v1) {
              if (v1 instanceof Nothing) {
                return function __do2() {
                  var renderChildRef = $$new(child)();
                  var spec = mkSpec(handler3)(renderChildRef)(document2);
                  var machine = buildVDom(spec)(v);
                  var node = extract2(machine);
                  $$void7(appendChild(node)(toNode2(container)))();
                  return {
                    machine,
                    node,
                    renderChildRef
                  };
                };
              }
              ;
              if (v1 instanceof Just) {
                return function __do2() {
                  write(child)(v1.value0.renderChildRef)();
                  var parent2 = parentNode2(v1.value0.node)();
                  var nextSib = nextSibling(v1.value0.node)();
                  var machine$prime = step2(v1.value0.machine, v);
                  var newNode = extract2(machine$prime);
                  when3(not3(unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(nextSib)(parent2))();
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
        renderChild: identity15,
        removeChild: removeChild3,
        dispose: removeChild3
      };
    };
  };
  var runUI2 = function(component6) {
    return function(i2) {
      return function(element3) {
        return bind17(liftEffect7(map27(toDocument)(bindFlipped8(document)(windowImpl))))(function(document2) {
          return runUI(renderSpec(document2)(element3))(component6)(i2);
        });
      };
    };
  };

  // output/IO.Conversations/index.js
  var timeToRead = function(str) {
    return 0.5;
  };
  var conversation2 = /* @__PURE__ */ map(functorArray)(function(text6) {
    return {
      user: "big_dnnr",
      text: text6,
      delayBy: timeToRead(text6)
    };
  })(["", "hey big d here with a quick demo/tutoral", "so you've got these things called 'pieces' which take input from the left side and output to the right", "(pieces can take input/output on any of the cardinal directions but these pieces are simple)", "the first piece 'id' (short for IDENTITY) takes a signal from the left and outputs the same signal to the right", "the second piece 'not' takes a signal from the left and negates it", "true become false, false becomes true", "double click 'id' to add an 'id' piece to the board", "... i assume you added the piece? i haven't integrated the chat feature with th board yet so i'm pretty blind lmao", "the empty circles represent input ports and the black circles are output ports", "click and the drag the piece to the locatin (2, 1). note that when you do this the message in the sidebar changes", "note that the sidebar message changes from 'You need an Input in the Left direction' after you move the piece", "So now the sidebar says 'You need an Input in the Left direction'", "lets add another 'id' piece and move it to the left, remember double click!", "you should see some weird output in the sidebar, i haven't fixed this part yet", "i'll cut to the soluion; the puzzle is complete when you connect the left side to the right side with two 'not' pieces and an 'id' piece", "if you get 'failed predicate it's because you used too many 'id' pieces. you only need one!", "once you've completed the level, sidebar says 'problem complete'", "it's a little underwhelming for now", "ok that's the whole demo, big d out :)"]);

  // output/Main/index.js
  var discard11 = /* @__PURE__ */ discard(discardUnit)(bindAff);
  var bind18 = /* @__PURE__ */ bind(bindAff);
  var pure19 = /* @__PURE__ */ pure(applicativeEffect);
  var liftEffect8 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure110 = /* @__PURE__ */ pure(applicativeAff);
  var mkPiece2 = /* @__PURE__ */ mkPiece(pieceBasicPiece);
  var runComponent = function(input3) {
    return function(component6) {
      return discard11(awaitLoad)(function() {
        return bind18(bind18(selectElement("#abed"))(function() {
          var $27 = maybe($$throw("Could not find element #abed"))(pure19);
          return function($28) {
            return liftEffect8($27($28));
          };
        }()))(function(v) {
          return runUI2(component6)(input3)(v);
        });
      });
    };
  };
  var testPuzzleComponent = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ function() {
    var problemDescription = {
      goal: mkPiece2(idPiece),
      title: "Double negation",
      description: "create an idenity from not gate",
      testCases: [singleton5(Left2.value)(ff(heytingAlgebraSignal)), singleton5(Left2.value)(tt(heytingAlgebraSignal))],
      requiresAutomaticTesting: false,
      pieceSet: fromFoldable5(foldableArray)(ordAPiece)([mkPiece2(idPiece), mkPiece2(notPiece)]),
      otherRestrictions: [{
        name: "only one id",
        description: "only one id in t board is allowed",
        restriction: restrictionPieceCount(pieceBasicPiece)(new Tuple(0, 1))(idPiece)
      }]
    };
    return bind18(runComponent({
      problemDescription,
      conversation: conversation2
    })(component5(monadAffAff)))(function(v) {
      return pure110(unit);
    });
  }());
  var main2 = testPuzzleComponent;

  // <stdin>
  main2();
})();
