(() => {
  // output-es/runtime.js
  function binding(init) {
    let state = 0;
    let value2;
    return () => {
      if (state === 2) {
        return value2;
      }
      if (state === 1) {
        throw new Error("Binding demanded before initialized");
      }
      state = 1;
      value2 = init();
      state = 2;
      return value2;
    };
  }
  function* range(lo, hi) {
    for (let i = lo; i < hi; i++) {
      yield i;
    }
  }
  function fail() {
    throw new Error("Failed pattern match");
  }
  function intDiv(x3, y3) {
    if (y3 > 0)
      return Math.floor(x3 / y3);
    if (y3 < 0)
      return -Math.floor(x3 / -y3);
    return 0;
  }

  // output-es/Control.Monad.Logger.Trans/index.js
  var bindLoggerT = (dictMonad) => ({ bind: (v) => (f) => (l) => dictMonad.Bind1().bind(v(l))((x3) => f(x3)(l)), Apply0: () => applyLoggerT(dictMonad) });
  var applyLoggerT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorLoggerT1 = {
      map: (x3) => {
        const $1 = $0.map(x3);
        return (v) => (x$1) => $1(v(x$1));
      }
    };
    return {
      apply: (() => {
        const $1 = bindLoggerT(dictMonad);
        return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeLoggerT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorLoggerT1
    };
  };
  var applicativeLoggerT = (dictMonad) => ({
    pure: (x3) => {
      const $0 = dictMonad.Applicative0().pure(x3);
      return (v) => $0;
    },
    Apply0: () => applyLoggerT(dictMonad)
  });
  var monadAskLoggerT = (dictMonadAsk) => {
    const Monad0 = dictMonadAsk.Monad0();
    const monadLoggerT1 = { Applicative0: () => applicativeLoggerT(Monad0), Bind1: () => bindLoggerT(Monad0) };
    return {
      ask: (() => {
        const $0 = dictMonadAsk.ask;
        return (v) => $0;
      })(),
      Monad0: () => monadLoggerT1
    };
  };
  var monadEffectLoggerT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadLoggerT1 = { Applicative0: () => applicativeLoggerT(Monad0), Bind1: () => bindLoggerT(Monad0) };
    return {
      liftEffect: (x3) => {
        const $0 = dictMonadEffect.liftEffect(x3);
        return (v) => $0;
      },
      Monad0: () => monadLoggerT1
    };
  };
  var monadAffLoggerT = (dictMonadAff) => {
    const monadEffectLoggerT1 = monadEffectLoggerT(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x3) => {
        const $0 = dictMonadAff.liftAff(x3);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectLoggerT1
    };
  };

  // output-es/Control.Monad.Reader.Trans/index.js
  var withReaderT = (f) => (v) => (x3) => v(f(x3));
  var bindReaderT = (dictBind) => {
    const $0 = dictBind.Apply0();
    const $1 = $0.Functor0();
    const applyReaderT1 = (() => {
      const functorReaderT1 = {
        map: (x3) => {
          const $2 = $1.map(x3);
          return (v) => (x$1) => $2(v(x$1));
        }
      };
      return { apply: (v) => (v1) => (r) => $0.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
    })();
    return { bind: (v) => (k) => (r) => dictBind.bind(v(r))((a) => k(a)(r)), Apply0: () => applyReaderT1 };
  };
  var monadReaderT = (dictMonad) => {
    const $0 = dictMonad.Applicative0();
    const $1 = $0.Apply0();
    const applicativeReaderT1 = (() => {
      const $2 = $1.Functor0();
      const functorReaderT1 = {
        map: (x3) => {
          const $3 = $2.map(x3);
          return (v) => (x$1) => $3(v(x$1));
        }
      };
      const applyReaderT1 = { apply: (v) => (v1) => (r) => $1.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
      return {
        pure: (x3) => {
          const $3 = $0.pure(x3);
          return (v) => $3;
        },
        Apply0: () => applyReaderT1
      };
    })();
    const bindReaderT1 = bindReaderT(dictMonad.Bind1());
    return { Applicative0: () => applicativeReaderT1, Bind1: () => bindReaderT1 };
  };
  var monadReaderReaderT = (dictMonad) => {
    const monadReaderT1 = monadReaderT(dictMonad);
    const monadAskReaderT1 = { ask: dictMonad.Applicative0().pure, Monad0: () => monadReaderT1 };
    return { local: withReaderT, MonadAsk0: () => monadAskReaderT1 };
  };
  var monadEffectReader = (dictMonadEffect) => {
    const monadReaderT1 = monadReaderT(dictMonadEffect.Monad0());
    return {
      liftEffect: (x3) => {
        const $0 = dictMonadEffect.liftEffect(x3);
        return (v) => $0;
      },
      Monad0: () => monadReaderT1
    };
  };
  var monadStateReaderT = (dictMonadState) => {
    const monadReaderT1 = monadReaderT(dictMonadState.Monad0());
    return {
      state: (x3) => {
        const $0 = dictMonadState.state(x3);
        return (v) => $0;
      },
      Monad0: () => monadReaderT1
    };
  };

  // output-es/Data.Ordering/index.js
  var $Ordering = (tag) => tag;
  var LT = /* @__PURE__ */ $Ordering("LT");
  var GT = /* @__PURE__ */ $Ordering("GT");
  var EQ = /* @__PURE__ */ $Ordering("EQ");
  var semigroupOrdering = {
    append: (v) => (v1) => {
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      if (v === "EQ") {
        return v1;
      }
      fail();
    }
  };

  // output-es/Data.Log.Level/index.js
  var $LogLevel = (tag) => tag;
  var Debug = /* @__PURE__ */ $LogLevel("Debug");
  var Info = /* @__PURE__ */ $LogLevel("Info");
  var Warn = /* @__PURE__ */ $LogLevel("Warn");
  var eqLogLevel = {
    eq: (x3) => (y3) => {
      if (x3 === "Trace") {
        return y3 === "Trace";
      }
      if (x3 === "Debug") {
        return y3 === "Debug";
      }
      if (x3 === "Info") {
        return y3 === "Info";
      }
      if (x3 === "Warn") {
        return y3 === "Warn";
      }
      return x3 === "Error" && y3 === "Error";
    }
  };
  var ordLogLevel = {
    compare: (x3) => (y3) => {
      if (x3 === "Trace") {
        if (y3 === "Trace") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Trace") {
        return GT;
      }
      if (x3 === "Debug") {
        if (y3 === "Debug") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Debug") {
        return GT;
      }
      if (x3 === "Info") {
        if (y3 === "Info") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Info") {
        return GT;
      }
      if (x3 === "Warn") {
        if (y3 === "Warn") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Warn") {
        return GT;
      }
      if (x3 === "Error" && y3 === "Error") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqLogLevel
  };

  // output-es/Record.Unsafe/foreign.js
  var unsafeGet = function(label) {
    return function(rec) {
      return rec[label];
    };
  };
  var unsafeSet = function(label) {
    return function(value2) {
      return function(rec) {
        var copy = {};
        for (var key2 in rec) {
          if ({}.hasOwnProperty.call(rec, key2)) {
            copy[key2] = rec[key2];
          }
        }
        copy[label] = value2;
        return copy;
      };
    };
  };

  // output-es/Type.Proxy/index.js
  var $$$Proxy = () => ({ tag: "Proxy" });
  var $$Proxy = /* @__PURE__ */ $$$Proxy();

  // output-es/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showNumberImpl = function(n) {
    var str2 = n.toString();
    return isNaN(str2 + ".0") ? str2 : str2 + ".0";
  };
  var showStringImpl = function(s) {
    var l = s.length;
    return '"' + s.replace(
      /[\0-\x1F\x7F"\\]/g,
      // eslint-disable-line no-control-regex
      function(c, i) {
        switch (c) {
          case '"':
          case "\\":
            return "\\" + c;
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
        var k = i + 1;
        var empty2 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty2;
      }
    ) + '"';
  };
  var showArrayImpl = function(f) {
    return function(xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output-es/Data.Generic.Rep/index.js
  var $NoArguments = () => ({ tag: "NoArguments" });
  var $Product = (_1, _2) => ({ tag: "Product", _1, _2 });
  var $Sum = (tag, _1) => ({ tag, _1 });
  var Inl = (value0) => $Sum("Inl", value0);
  var Inr = (value0) => $Sum("Inr", value0);
  var Product = (value0) => (value1) => $Product(value0, value1);
  var NoArguments = /* @__PURE__ */ $NoArguments();
  var Constructor = (x3) => x3;
  var Argument = (x3) => x3;

  // output-es/Data.Maybe/index.js
  var $Maybe = (tag, _1) => ({ tag, _1 });
  var Nothing = /* @__PURE__ */ $Maybe("Nothing");
  var Just = (value0) => $Maybe("Just", value0);
  var monoidMaybe = (dictSemigroup) => {
    const semigroupMaybe1 = {
      append: (v) => (v1) => {
        if (v.tag === "Nothing") {
          return v1;
        }
        if (v1.tag === "Nothing") {
          return v;
        }
        if (v.tag === "Just" && v1.tag === "Just") {
          return $Maybe("Just", dictSemigroup.append(v._1)(v1._1));
        }
        fail();
      }
    };
    return { mempty: Nothing, Semigroup0: () => semigroupMaybe1 };
  };
  var isNothing = (v2) => {
    if (v2.tag === "Nothing") {
      return true;
    }
    if (v2.tag === "Just") {
      return false;
    }
    fail();
  };
  var isJust = (v2) => {
    if (v2.tag === "Nothing") {
      return false;
    }
    if (v2.tag === "Just") {
      return true;
    }
    fail();
  };
  var functorMaybe = {
    map: (v) => (v1) => {
      if (v1.tag === "Just") {
        return $Maybe("Just", v(v1._1));
      }
      return Nothing;
    }
  };
  var applyMaybe = {
    apply: (v) => (v1) => {
      if (v.tag === "Just") {
        if (v1.tag === "Just") {
          return $Maybe("Just", v._1(v1._1));
        }
        return Nothing;
      }
      if (v.tag === "Nothing") {
        return Nothing;
      }
      fail();
    },
    Functor0: () => functorMaybe
  };

  // output-es/Data.Either/index.js
  var $Either = (tag, _1) => ({ tag, _1 });
  var Left = (value0) => $Either("Left", value0);
  var Right = (value0) => $Either("Right", value0);
  var functorEither = {
    map: (f) => (m) => {
      if (m.tag === "Left") {
        return $Either("Left", m._1);
      }
      if (m.tag === "Right") {
        return $Either("Right", f(m._1));
      }
      fail();
    }
  };
  var blush = (v2) => {
    if (v2.tag === "Left") {
      return $Maybe("Just", v2._1);
    }
    if (v2.tag === "Right") {
      return Nothing;
    }
    fail();
  };
  var applyEither = {
    apply: (v) => (v1) => {
      if (v.tag === "Left") {
        return $Either("Left", v._1);
      }
      if (v.tag === "Right") {
        if (v1.tag === "Left") {
          return $Either("Left", v1._1);
        }
        if (v1.tag === "Right") {
          return $Either("Right", v._1(v1._1));
        }
      }
      fail();
    },
    Functor0: () => functorEither
  };
  var bindEither = {
    bind: (v2) => {
      if (v2.tag === "Left") {
        const $0 = v2._1;
        return (v) => $Either("Left", $0);
      }
      if (v2.tag === "Right") {
        const $0 = v2._1;
        return (f) => f($0);
      }
      fail();
    },
    Apply0: () => applyEither
  };
  var applicativeEither = { pure: Right, Apply0: () => applyEither };
  var monadEither = { Applicative0: () => applicativeEither, Bind1: () => bindEither };

  // output-es/Effect/foreign.js
  var pureE = function(a) {
    return function() {
      return a;
    };
  };
  var bindE = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };
  var untilE = function(f) {
    return function() {
      while (!f())
        ;
    };
  };

  // output-es/Effect/index.js
  var monadEffect = { Applicative0: () => applicativeEffect, Bind1: () => bindEffect };
  var bindEffect = { bind: bindE, Apply0: () => applyEffect };
  var applyEffect = {
    apply: (f) => (a) => () => {
      const f$p = f();
      const a$p = a();
      return applicativeEffect.pure(f$p(a$p))();
    },
    Functor0: () => functorEffect
  };
  var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
  var functorEffect = {
    map: (f) => (a) => () => {
      const a$p = a();
      return f(a$p);
    }
  };

  // output-es/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }

  // output-es/Control.Monad.Error.Class/index.js
  var monadThrowEither = { throwError: Left, Monad0: () => monadEither };
  var monadErrorEither = {
    catchError: (v) => (v1) => {
      if (v.tag === "Left") {
        return v1(v._1);
      }
      if (v.tag === "Right") {
        return $Either("Right", v._1);
      }
      fail();
    },
    MonadThrow0: () => monadThrowEither
  };
  var $$try = (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    return (a) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a))((x3) => Monad0.Applicative0().pure($Either("Left", x3)));
  };

  // output-es/Data.Function/index.js
  var $$const = (a) => (v) => a;
  var apply = (f) => (x3) => f(x3);

  // output-es/Control.Semigroupoid/index.js
  var semigroupoidFn = { compose: (f) => (g) => (x3) => f(g(x3)) };

  // output-es/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  // output-es/Data.Functor/index.js
  var functorFn = /* @__PURE__ */ (() => ({ map: semigroupoidFn.compose }))();
  var functorArray = { map: arrayMap };

  // output-es/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i = 0; i < l; i++) {
        var f = fs[i];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output-es/Control.Apply/index.js
  var identity = (x3) => x3;
  var applyFn = { apply: (f) => (g) => (x3) => f(x3)(g(x3)), Functor0: () => functorFn };
  var applyArray = { apply: arrayApply, Functor0: () => functorArray };

  // output-es/Data.Maybe.First/index.js
  var semigroupFirst = {
    append: (v) => (v1) => {
      if (v.tag === "Just") {
        return v;
      }
      return v1;
    }
  };
  var monoidFirst = { mempty: Nothing, Semigroup0: () => semigroupFirst };

  // output-es/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };

  // output-es/Data.Foldable/index.js
  var identity2 = (x3) => x3;
  var traverse_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldable) => (f) => dictFoldable.foldr((x3) => {
      const $1 = f(x3);
      return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
    })(dictApplicative.pure());
  };
  var for_ = (dictApplicative) => {
    const traverse_17 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const $0 = traverse_17(dictFoldable);
      return (b) => (a) => $0(a)(b);
    };
  };
  var indexl = (dictFoldable) => (idx) => {
    const $0 = dictFoldable.foldl((cursor) => (a) => {
      if (cursor.elem.tag === "Just") {
        return cursor;
      }
      if (cursor.pos === idx) {
        return { elem: $Maybe("Just", a), pos: cursor.pos };
      }
      return { pos: cursor.pos + 1 | 0, elem: cursor.elem };
    })({ elem: Nothing, pos: 0 });
    return (x3) => $0(x3).elem;
  };
  var foldableMaybe = {
    foldr: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v2._1)(v1);
      }
      fail();
    },
    foldl: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v1)(v2._1);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (v) => (v1) => {
        if (v1.tag === "Nothing") {
          return mempty;
        }
        if (v1.tag === "Just") {
          return v(v1._1);
        }
        fail();
      };
    }
  };
  var foldableEither = {
    foldr: (v) => (v1) => (v2) => {
      if (v2.tag === "Left") {
        return v1;
      }
      if (v2.tag === "Right") {
        return v(v2._1)(v1);
      }
      fail();
    },
    foldl: (v) => (v1) => (v2) => {
      if (v2.tag === "Left") {
        return v1;
      }
      if (v2.tag === "Right") {
        return v(v1)(v2._1);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (v) => (v1) => {
        if (v1.tag === "Left") {
          return mempty;
        }
        if (v1.tag === "Right") {
          return v(v1._1);
        }
        fail();
      };
    }
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableArray.foldr((x3) => (acc) => dictMonoid.Semigroup0().append(f(x3))(acc))(mempty);
    }
  };
  var find = (dictFoldable) => (p) => dictFoldable.foldl((v) => (v1) => {
    if (v.tag === "Nothing" && p(v1)) {
      return $Maybe("Just", v1);
    }
    return v;
  })(Nothing);
  var and = (dictFoldable) => (dictHeytingAlgebra) => dictFoldable.foldMap((() => {
    const semigroupConj1 = { append: (v) => (v1) => dictHeytingAlgebra.conj(v)(v1) };
    return { mempty: dictHeytingAlgebra.tt, Semigroup0: () => semigroupConj1 };
  })())(identity2);

  // output-es/Control.Parallel/index.js
  var identity3 = (x3) => x3;
  var parTraverse_ = (dictParallel) => {
    const traverse_17 = traverse_(dictParallel.Applicative1());
    return (dictFoldable) => {
      const traverse_18 = traverse_17(dictFoldable);
      return (f) => {
        const $0 = traverse_18((x3) => dictParallel.parallel(f(x3)));
        return (x3) => dictParallel.sequential($0(x3));
      };
    };
  };

  // output-es/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output-es/Unsafe.Coerce/foreign.js
  var unsafeCoerce = function(x3) {
    return x3;
  };

  // output-es/Effect.Aff/foreign.js
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
    function nonCanceler2(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function() {
          throw error3;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left(error3);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left(error3))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size3 = 0;
      var ix4 = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk4;
        draining = true;
        while (size3 !== 0) {
          size3--;
          thunk4 = queue[ix4];
          queue[ix4] = void 0;
          ix4 = (ix4 + 1) % limit;
          thunk4();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i, tmp;
          if (size3 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix4 + size3) % limit] = cb;
          size3++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util2) {
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
            function kill(fid) {
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
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error3) {
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
      var step2 = aff;
      var fail3 = null;
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
                step2 = bhead(step2);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail3 = util2.left(e);
                step2 = null;
              }
              break;
            case STEP_RESULT:
              if (util2.isLeft(step2)) {
                status = RETURN;
                fail3 = step2;
                step2 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step2 = util2.fromRight(step2);
              }
              break;
            case CONTINUE:
              switch (step2.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step2._2;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step2 = util2.right(step2._1);
                  } else {
                    status = STEP_BIND;
                    step2 = step2._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step2 = runSync(util2.left, util2.right, step2._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step2 = runAsync(util2.left, step2._1, function(result2) {
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
                        step2 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail3 = util2.left(step2._1);
                  step2 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util2, supervisor, step2._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step2._1) {
                    tmp.run();
                  }
                  step2 = util2.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step2 = sequential(util2, supervisor, step2._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step2 = interrupt || fail3 || step2;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail3) {
                      status = CONTINUE;
                      step2 = attempt._2(util2.fromLeft(fail3));
                      fail3 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step2 = util2.fromRight(step2);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail3 === null) {
                      result = util2.fromRight(step2);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step2 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail3), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step2 = attempt._1.killed(util2.fromLeft(interrupt))(attempt._2);
                    } else if (fail3) {
                      step2 = attempt._1.failed(util2.fromLeft(fail3))(attempt._2);
                    } else {
                      step2 = attempt._1.completed(util2.fromRight(step2))(attempt._2);
                    }
                    fail3 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail3), attempts, interrupt);
                    status = CONTINUE;
                    step2 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step2 = attempt._1;
                    fail3 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step2));
                }
              }
              joins = null;
              if (interrupt && fail3) {
                setTimeout(function() {
                  throw util2.fromLeft(fail3);
                }, 0);
              } else if (util2.isLeft(step2) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util2.fromLeft(step2);
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
      function onComplete(join2) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join2.rethrow;
            join2.handler(step2)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join2;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb) {
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
              interrupt = util2.left(error3);
              status = COMPLETED;
              step2 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util2.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error3)), attempts, interrupt);
                }
                status = RETURN;
                step2 = null;
                fail3 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util2.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step2 = null;
                fail3 = null;
              }
          }
          return canceler;
        };
      }
      function join(cb) {
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
        kill,
        join,
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
    function runPar(util2, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root2 = EMPTY;
      function kill(error3, par2, cb2) {
        var step2 = par2;
        var head = null;
        var tail = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step2.tag) {
              case FORKED:
                if (step2._3 === EMPTY) {
                  tmp = fibers[step2._1];
                  kills2[count++] = tmp.kill(error3, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head === null) {
                  break loop;
                }
                step2 = head._2;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
                break;
              case MAP:
                step2 = step2._2;
                break;
              case APPLY:
              case ALT:
                if (head) {
                  tail = new Aff2(CONS, head, tail);
                }
                head = step2;
                step2 = step2._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util2.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join(result, head, tail) {
        var fail3, step2, lhs, rhs, tmp, kid;
        if (util2.isLeft(result)) {
          fail3 = result;
          step2 = null;
        } else {
          step2 = result;
          fail3 = null;
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
            if (head === null) {
              cb(fail3 || step2)();
              return;
            }
            if (head._3 !== EMPTY) {
              return;
            }
            switch (head.tag) {
              case MAP:
                if (fail3 === null) {
                  head._3 = util2.right(head._1(util2.fromRight(step2)));
                  step2 = head._3;
                } else {
                  head._3 = fail3;
                }
                break;
              case APPLY:
                lhs = head._1._3;
                rhs = head._2._3;
                if (fail3) {
                  head._3 = fail3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, fail3 === lhs ? head._2 : head._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join(fail3, null, null);
                      } else {
                        join(fail3, tail._1, tail._2);
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
                  step2 = util2.right(util2.fromRight(lhs)(util2.fromRight(rhs)));
                  head._3 = step2;
                }
                break;
              case ALT:
                lhs = head._1._3;
                rhs = head._2._3;
                if (lhs === EMPTY && util2.isLeft(rhs) || rhs === EMPTY && util2.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util2.isLeft(lhs) && rhs !== EMPTY && util2.isLeft(rhs)) {
                  fail3 = step2 === lhs ? rhs : lhs;
                  step2 = null;
                  head._3 = fail3;
                } else {
                  head._3 = step2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, step2 === lhs ? head._2 : head._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join(step2, null, null);
                      } else {
                        join(step2, tail._1, tail._2);
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
            if (tail === null) {
              head = null;
            } else {
              head = tail._1;
              tail = tail._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step2 = par;
        var head = null;
        var tail = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step2.tag) {
                  case MAP:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                    step2 = step2._2;
                    break;
                  case APPLY:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  case ALT:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step2;
                    step2 = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                    tmp = Fiber(util2, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step2)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head === null) {
                  break loop;
                }
                if (head._1 === EMPTY) {
                  head._1 = step2;
                  status = CONTINUE;
                  step2 = head._2;
                  head._2 = EMPTY;
                } else {
                  head._2 = step2;
                  step2 = head;
                  if (tail === null) {
                    head = null;
                  } else {
                    head = tail._1;
                    tail = tail._2;
                  }
                }
            }
          }
        root2 = step2;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel2(error3, cb2) {
        interrupt = util2.left(error3);
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
        var newKills = kill(error3, root2, cb2);
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
            return cancel2(killError, killCb);
          };
        });
      };
    }
    function sequential(util2, supervisor, par) {
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
        return Aff.Bind(aff, function(value2) {
          return Aff.Pure(f(value2));
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
  function _parAffAlt(aff1) {
    return function(aff2) {
      return Aff.ParAlt(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options) {
      return function(k) {
        return Aff.Bracket(acquire, options, k);
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
    function clearDelay(n, t) {
      if (n === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t);
      } else {
        return clearTimeout(t);
      }
    }
    return function(right, ms) {
      return Aff.Async(function(cb) {
        return function() {
          var timer = setDelay(ms, cb(right()));
          return function() {
            return Aff.Sync(function() {
              return right(clearDelay(ms, timer));
            });
          };
        };
      });
    };
  }();
  var _sequential = Aff.Seq;

  // output-es/Effect.Aff/index.js
  var functorParAff = { map: _parAffMap };
  var functorAff = { map: _map };
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = {
    isLeft: (v) => {
      if (v.tag === "Left") {
        return true;
      }
      if (v.tag === "Right") {
        return false;
      }
      fail();
    },
    fromLeft: (v) => {
      if (v.tag === "Left") {
        return v._1;
      }
      if (v.tag === "Right") {
        return _crashWith("unsafeFromLeft: Right");
      }
      fail();
    },
    fromRight: (v) => {
      if (v.tag === "Right") {
        return v._1;
      }
      if (v.tag === "Left") {
        return _crashWith("unsafeFromRight: Left");
      }
      fail();
    },
    left: Left,
    right: Right
  };
  var applyParAff = { apply: _parAffApply, Functor0: () => functorParAff };
  var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
  var bindAff = { bind: _bind, Apply0: () => applyAff };
  var applyAff = { apply: (f) => (a) => _bind(f)((f$p) => _bind(a)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
  var applicativeAff = { pure: _pure, Apply0: () => applyAff };
  var $$finally = (fin) => (a) => generalBracket(_pure())({ killed: (v) => (v$1) => fin, failed: (v) => (v$1) => fin, completed: (v) => (v$1) => fin })((v) => a);
  var monadEffectAff = { liftEffect: _liftEffect, Monad0: () => monadAff };
  var joinFiber = (v) => makeAff((k) => {
    const $0 = v.join(k);
    return () => {
      const a$p = $0();
      const $1 = _liftEffect(a$p);
      return (v$1) => $1;
    };
  });
  var killFiber = (e) => (v) => _bind(_liftEffect(v.isSuspended))((suspended) => {
    if (suspended) {
      return _liftEffect((() => {
        const $0 = v.kill(e, (v$1) => () => {
        });
        return () => {
          $0();
        };
      })());
    }
    return makeAff((k) => {
      const $0 = v.kill(e, k);
      return () => {
        const a$p = $0();
        const $1 = _liftEffect(a$p);
        return (v$1) => $1;
      };
    });
  });
  var monadThrowAff = { throwError: _throwError, Monad0: () => monadAff };
  var monadErrorAff = { catchError: _catchError, MonadThrow0: () => monadThrowAff };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = (k) => (aff) => {
    const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x3) => _liftEffect(k(x3))));
    return () => {
      const fiber = $0();
      fiber.run();
      return fiber;
    };
  };
  var runAff_ = (k) => (aff) => {
    const $0 = runAff(k)(aff);
    return () => {
      $0();
    };
  };
  var parallelAff = { parallel: unsafeCoerce, sequential: _sequential, Monad0: () => monadAff, Applicative1: () => applicativeParAff };
  var applicativeParAff = { pure: (x3) => _pure(x3), Apply0: () => applyParAff };
  var monadRecAff = {
    tailRecM: (k) => {
      const go = (a) => _bind(k(a))((res) => {
        if (res.tag === "Done") {
          return _pure(res._1);
        }
        if (res.tag === "Loop") {
          return go(res._1);
        }
        fail();
      });
      return go;
    },
    Monad0: () => monadAff
  };
  var nonCanceler = /* @__PURE__ */ (() => {
    const $0 = _pure();
    return (v) => $0;
  })();

  // output-es/Control.Applicative/index.js
  var applicativeFn = { pure: (x3) => (v) => x3, Apply0: () => applyFn };
  var applicativeArray = { pure: (x3) => [x3], Apply0: () => applyArray };

  // output-es/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        Array.prototype.push.apply(result, f(arr[i]));
      }
      return result;
    };
  };

  // output-es/Control.Bind/index.js
  var identity4 = (x3) => x3;
  var bindFn = { bind: (m) => (f) => (x3) => f(m(x3))(x3), Apply0: () => applyFn };

  // output-es/Control.Monad/index.js
  var monadFn = { Applicative0: () => applicativeFn, Bind1: () => bindFn };

  // output-es/Data.Identity/index.js
  var Identity = (x3) => x3;
  var functorIdentity = { map: (f) => (m) => f(m) };
  var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
  var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
  var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
  var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

  // output-es/Control.Monad.Rec.Class/index.js
  var $Step = (tag, _1) => ({ tag, _1 });
  var Done = (value0) => $Step("Done", value0);
  var monadRecEffect = {
    tailRecM: (f) => (a) => {
      const $0 = f(a);
      return () => {
        const $1 = $0();
        let r = $1;
        untilE(() => {
          const v = r;
          if (v.tag === "Loop") {
            const e = f(v._1)();
            r = e;
            return false;
          }
          if (v.tag === "Done") {
            return true;
          }
          fail();
        })();
        const a$p = r;
        if (a$p.tag === "Done") {
          return a$p._1;
        }
        fail();
      };
    },
    Monad0: () => monadEffect
  };

  // output-es/Data.Tuple/index.js
  var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
  var Tuple = (value0) => (value1) => $Tuple(value0, value1);
  var snd = (v) => v._2;
  var ringTuple = (dictRing) => {
    const $0 = dictRing.Semiring0();
    const one = $0.one;
    const semiringTuple1 = (() => {
      const zero = $0.zero;
      return (dictSemiring1) => ({
        add: (v) => (v1) => $Tuple($0.add(v._1)(v1._1), dictSemiring1.add(v._2)(v1._2)),
        one: $Tuple(one, dictSemiring1.one),
        mul: (v) => (v1) => $Tuple($0.mul(v._1)(v1._1), dictSemiring1.mul(v._2)(v1._2)),
        zero: $Tuple(zero, dictSemiring1.zero)
      });
    })();
    return (dictRing1) => {
      const semiringTuple2 = semiringTuple1(dictRing1.Semiring0());
      return { sub: (v) => (v1) => $Tuple(dictRing.sub(v._1)(v1._1), dictRing1.sub(v._2)(v1._2)), Semiring0: () => semiringTuple2 };
    };
  };
  var functorTuple = { map: (f) => (m) => $Tuple(m._1, f(m._2)) };
  var fst = (v) => v._1;
  var ordTuple = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    return (dictOrd1) => {
      const $1 = dictOrd1.Eq0();
      const eqTuple2 = { eq: (x3) => (y3) => $0.eq(x3._1)(y3._1) && $1.eq(x3._2)(y3._2) };
      return {
        compare: (x3) => (y3) => {
          const v = dictOrd.compare(x3._1)(y3._1);
          if (v === "LT") {
            return LT;
          }
          if (v === "GT") {
            return GT;
          }
          return dictOrd1.compare(x3._2)(y3._2);
        },
        Eq0: () => eqTuple2
      };
    };
  };

  // output-es/Control.Monad.Except.Trans/index.js
  var bindExceptT = (dictMonad) => ({
    bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
      if (v2.tag === "Left") {
        return dictMonad.Applicative0().pure($Either("Left", v2._1));
      }
      if (v2.tag === "Right") {
        return k(v2._1);
      }
      fail();
    }),
    Apply0: () => applyExceptT(dictMonad)
  });
  var applyExceptT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorExceptT1 = {
      map: (f) => $0.map((m) => {
        if (m.tag === "Left") {
          return $Either("Left", m._1);
        }
        if (m.tag === "Right") {
          return $Either("Right", f(m._1));
        }
        fail();
      })
    };
    return {
      apply: (() => {
        const $1 = bindExceptT(dictMonad);
        return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorExceptT1
    };
  };
  var applicativeExceptT = (dictMonad) => ({ pure: (x3) => dictMonad.Applicative0().pure($Either("Right", x3)), Apply0: () => applyExceptT(dictMonad) });
  var monadEffectExceptT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(Monad0), Bind1: () => bindExceptT(Monad0) };
    return { liftEffect: (x3) => Monad0.Bind1().bind(dictMonadEffect.liftEffect(x3))((a) => Monad0.Applicative0().pure($Either("Right", a))), Monad0: () => monadExceptT1 };
  };
  var monadStateExceptT = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(Monad0), Bind1: () => bindExceptT(Monad0) };
    return { state: (f) => Monad0.Bind1().bind(dictMonadState.state(f))((a) => Monad0.Applicative0().pure($Either("Right", a))), Monad0: () => monadExceptT1 };
  };
  var monadThrowExceptT = (dictMonad) => {
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
    return { throwError: (x3) => dictMonad.Applicative0().pure($Either("Left", x3)), Monad0: () => monadExceptT1 };
  };
  var monadErrorExceptT = (dictMonad) => {
    const monadThrowExceptT1 = monadThrowExceptT(dictMonad);
    return {
      catchError: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
        if (v2.tag === "Left") {
          return k(v2._1);
        }
        if (v2.tag === "Right") {
          return dictMonad.Applicative0().pure($Either("Right", v2._1));
        }
        fail();
      }),
      MonadThrow0: () => monadThrowExceptT1
    };
  };
  var altExceptT = (dictSemigroup) => (dictMonad) => {
    const Bind1 = dictMonad.Bind1();
    const $0 = dictMonad.Applicative0();
    const $1 = Bind1.Apply0().Functor0();
    const functorExceptT1 = {
      map: (f) => $1.map((m) => {
        if (m.tag === "Left") {
          return $Either("Left", m._1);
        }
        if (m.tag === "Right") {
          return $Either("Right", f(m._1));
        }
        fail();
      })
    };
    return {
      alt: (v) => (v1) => Bind1.bind(v)((rm) => {
        if (rm.tag === "Right") {
          return $0.pure($Either("Right", rm._1));
        }
        if (rm.tag === "Left") {
          const $2 = rm._1;
          return Bind1.bind(v1)((rn) => {
            if (rn.tag === "Right") {
              return $0.pure($Either("Right", rn._1));
            }
            if (rn.tag === "Left") {
              return $0.pure($Either("Left", dictSemigroup.append($2)(rn._1)));
            }
            fail();
          });
        }
        fail();
      }),
      Functor0: () => functorExceptT1
    };
  };

  // output-es/Data.Lazy/foreign.js
  var defer = function(thunk4) {
    var v = null;
    return function() {
      if (thunk4 === void 0)
        return v;
      v = thunk4();
      thunk4 = void 0;
      return v;
    };
  };
  var force = function(l) {
    return l();
  };

  // output-es/Control.Monad.Maybe.Trans/index.js
  var bindMaybeT = (dictMonad) => ({
    bind: (v) => (f) => dictMonad.Bind1().bind(v)((v1) => {
      if (v1.tag === "Nothing") {
        return dictMonad.Applicative0().pure(Nothing);
      }
      if (v1.tag === "Just") {
        return f(v1._1);
      }
      fail();
    }),
    Apply0: () => applyMaybeT(dictMonad)
  });
  var applyMaybeT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorMaybeT1 = { map: (f) => (v) => $0.map(functorMaybe.map(f))(v) };
    return {
      apply: (() => {
        const $1 = bindMaybeT(dictMonad);
        return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeMaybeT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorMaybeT1
    };
  };
  var applicativeMaybeT = (dictMonad) => ({ pure: (x3) => dictMonad.Applicative0().pure($Maybe("Just", x3)), Apply0: () => applyMaybeT(dictMonad) });
  var monadEffectMaybe = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadMaybeT1 = { Applicative0: () => applicativeMaybeT(Monad0), Bind1: () => bindMaybeT(Monad0) };
    return { liftEffect: (x3) => Monad0.Bind1().bind(dictMonadEffect.liftEffect(x3))((a$p) => Monad0.Applicative0().pure($Maybe("Just", a$p))), Monad0: () => monadMaybeT1 };
  };
  var monadStateMaybeT = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const monadMaybeT1 = { Applicative0: () => applicativeMaybeT(Monad0), Bind1: () => bindMaybeT(Monad0) };
    return { state: (f) => Monad0.Bind1().bind(dictMonadState.state(f))((a$p) => Monad0.Applicative0().pure($Maybe("Just", a$p))), Monad0: () => monadMaybeT1 };
  };

  // output-es/Control.Monad.State.Trans/index.js
  var evalStateT = (dictFunctor) => (v) => (s) => dictFunctor.map(fst)(v(s));
  var bindStateT = (dictMonad) => ({ bind: (v) => (f) => (s) => dictMonad.Bind1().bind(v(s))((v1) => f(v1._1)(v1._2)), Apply0: () => applyStateT(dictMonad) });
  var applyStateT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorStateT1 = { map: (f) => (v) => (s) => $0.map((v1) => $Tuple(f(v1._1), v1._2))(v(s)) };
    return {
      apply: (() => {
        const $1 = bindStateT(dictMonad);
        return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeStateT(dictMonad).pure(f$p(a$p))));
      })(),
      Functor0: () => functorStateT1
    };
  };
  var applicativeStateT = (dictMonad) => ({ pure: (a) => (s) => dictMonad.Applicative0().pure($Tuple(a, s)), Apply0: () => applyStateT(dictMonad) });
  var monadStateStateT = (dictMonad) => {
    const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
    return { state: (f) => (x3) => dictMonad.Applicative0().pure(f(x3)), Monad0: () => monadStateT1 };
  };
  var monadThrowStateT = (dictMonadThrow) => {
    const Monad0 = dictMonadThrow.Monad0();
    const monadStateT1 = { Applicative0: () => applicativeStateT(Monad0), Bind1: () => bindStateT(Monad0) };
    return {
      throwError: (e) => {
        const $0 = dictMonadThrow.throwError(e);
        return (s) => Monad0.Bind1().bind($0)((x3) => Monad0.Applicative0().pure($Tuple(x3, s)));
      },
      Monad0: () => monadStateT1
    };
  };
  var monadErrorStateT = (dictMonadError) => {
    const monadThrowStateT1 = monadThrowStateT(dictMonadError.MonadThrow0());
    return { catchError: (v) => (h) => (s) => dictMonadError.catchError(v(s))((e) => h(e)(s)), MonadThrow0: () => monadThrowStateT1 };
  };

  // output-es/Control.Monad.Writer.Trans/index.js
  var bindWriterT = (dictSemigroup) => (dictBind) => {
    const Apply0 = dictBind.Apply0();
    const Functor0 = Apply0.Functor0();
    const functorWriterT1 = { map: (f) => Functor0.map((v) => $Tuple(f(v._1), v._2)) };
    const applyWriterT2 = {
      apply: (v) => (v1) => Apply0.apply(Functor0.map((v3) => (v4) => $Tuple(v3._1(v4._1), dictSemigroup.append(v3._2)(v4._2)))(v))(v1),
      Functor0: () => functorWriterT1
    };
    return {
      bind: (v) => (k) => dictBind.bind(v)((v1) => {
        const $0 = v1._2;
        return Apply0.Functor0().map((v3) => $Tuple(v3._1, dictSemigroup.append($0)(v3._2)))(k(v1._1));
      }),
      Apply0: () => applyWriterT2
    };
  };
  var applicativeWriterT = (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (dictApplicative) => {
      const $1 = dictApplicative.Apply0();
      const Functor0 = $1.Functor0();
      const applyWriterT2 = (() => {
        const functorWriterT1 = { map: (f) => Functor0.map((v) => $Tuple(f(v._1), v._2)) };
        return { apply: (v) => (v1) => $1.apply(Functor0.map((v3) => (v4) => $Tuple(v3._1(v4._1), $0.append(v3._2)(v4._2)))(v))(v1), Functor0: () => functorWriterT1 };
      })();
      return { pure: (a) => dictApplicative.pure($Tuple(a, mempty)), Apply0: () => applyWriterT2 };
    };
  };
  var monadWriterT = (dictMonoid) => {
    const applicativeWriterT1 = applicativeWriterT(dictMonoid);
    const bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return (dictMonad) => {
      const applicativeWriterT22 = applicativeWriterT1(dictMonad.Applicative0());
      const bindWriterT2 = bindWriterT1(dictMonad.Bind1());
      return { Applicative0: () => applicativeWriterT22, Bind1: () => bindWriterT2 };
    };
  };
  var monadStateWriterT = (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    const monadWriterT1 = monadWriterT(dictMonoid);
    return (dictMonadState) => {
      const Monad0 = dictMonadState.Monad0();
      const monadWriterT2 = monadWriterT1(Monad0);
      return { state: (f) => Monad0.Bind1().bind(dictMonadState.state(f))((a) => Monad0.Applicative0().pure($Tuple(a, mempty))), Monad0: () => monadWriterT2 };
    };
  };
  var monadTellWriterT = (dictMonoid) => {
    const Semigroup0 = dictMonoid.Semigroup0();
    const monadWriterT1 = monadWriterT(dictMonoid);
    return (dictMonad) => {
      const monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: (() => {
          const $0 = Tuple();
          return (x3) => dictMonad.Applicative0().pure($0(x3));
        })(),
        Semigroup0: () => Semigroup0,
        Monad1: () => monadWriterT2
      };
    };
  };

  // output-es/Effect.Aff.Class/index.js
  var monadAffAff = { liftAff: (x3) => x3, MonadEffect0: () => monadEffectAff };
  var monadAffExceptT = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const monadEffectExceptT2 = monadEffectExceptT(MonadEffect0);
    return {
      liftAff: (() => {
        const $0 = MonadEffect0.Monad0();
        return (x3) => $0.Bind1().bind(dictMonadAff.liftAff(x3))((a) => $0.Applicative0().pure($Either("Right", a)));
      })(),
      MonadEffect0: () => monadEffectExceptT2
    };
  };
  var monadAffReader = (dictMonadAff) => {
    const monadEffectReader3 = monadEffectReader(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x3) => {
        const $0 = dictMonadAff.liftAff(x3);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectReader3
    };
  };

  // output-es/Data.NonEmpty/index.js
  var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });

  // output-es/Data.List.Types/index.js
  var $List = (tag, _1, _2) => ({ tag, _1, _2 });
  var Nil = /* @__PURE__ */ $List("Nil");
  var Cons = (value0) => (value1) => $List("Cons", value0, value1);
  var listMap = (f) => {
    const chunkedRevMap = (chunkedRevMap$a0$copy) => (chunkedRevMap$a1$copy) => {
      let chunkedRevMap$a0 = chunkedRevMap$a0$copy, chunkedRevMap$a1 = chunkedRevMap$a1$copy, chunkedRevMap$c = true, chunkedRevMap$r;
      while (chunkedRevMap$c) {
        const v = chunkedRevMap$a0, v1 = chunkedRevMap$a1;
        if (v1.tag === "Cons" && v1._2.tag === "Cons" && v1._2._2.tag === "Cons") {
          chunkedRevMap$a0 = $List("Cons", v1, v);
          chunkedRevMap$a1 = v1._2._2._2;
          continue;
        }
        const reverseUnrolledMap = (reverseUnrolledMap$a0$copy) => (reverseUnrolledMap$a1$copy) => {
          let reverseUnrolledMap$a0 = reverseUnrolledMap$a0$copy, reverseUnrolledMap$a1 = reverseUnrolledMap$a1$copy, reverseUnrolledMap$c = true, reverseUnrolledMap$r;
          while (reverseUnrolledMap$c) {
            const v2 = reverseUnrolledMap$a0, v3 = reverseUnrolledMap$a1;
            if (v2.tag === "Cons" && v2._1.tag === "Cons" && v2._1._2.tag === "Cons" && v2._1._2._2.tag === "Cons") {
              reverseUnrolledMap$a0 = v2._2;
              reverseUnrolledMap$a1 = $List("Cons", f(v2._1._1), $List("Cons", f(v2._1._2._1), $List("Cons", f(v2._1._2._2._1), v3)));
              continue;
            }
            reverseUnrolledMap$c = false;
            reverseUnrolledMap$r = v3;
          }
          return reverseUnrolledMap$r;
        };
        chunkedRevMap$c = false;
        chunkedRevMap$r = reverseUnrolledMap(v)((() => {
          if (v1.tag === "Cons") {
            if (v1._2.tag === "Cons") {
              if (v1._2._2.tag === "Nil") {
                return $List("Cons", f(v1._1), $List("Cons", f(v1._2._1), Nil));
              }
              return Nil;
            }
            if (v1._2.tag === "Nil") {
              return $List("Cons", f(v1._1), Nil);
            }
          }
          return Nil;
        })());
      }
      return chunkedRevMap$r;
    };
    return chunkedRevMap(Nil);
  };
  var foldableList = {
    foldr: (f) => (b) => {
      const $0 = foldableList.foldl((b$1) => (a) => f(a)(b$1))(b);
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const v = go$a0, v1 = go$a1;
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = v;
            continue;
          }
          if (v1.tag === "Cons") {
            go$a0 = $List("Cons", v1._1, v);
            go$a1 = v1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      const $1 = go(Nil);
      return (x3) => $0($1(x3));
    },
    foldl: (f) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = f(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go;
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableList.foldl((acc) => {
        const $0 = dictMonoid.Semigroup0().append(acc);
        return (x3) => $0(f(x3));
      })(mempty);
    }
  };
  var semigroupList = { append: (xs) => (ys) => foldableList.foldr(Cons)(ys)(xs) };
  var monoidList = { mempty: Nil, Semigroup0: () => semigroupList };
  var eq1List = {
    eq1: (dictEq) => (xs) => (ys) => {
      const go = (v) => (v1) => (v2) => {
        if (!v2) {
          return false;
        }
        if (v.tag === "Nil") {
          return v1.tag === "Nil" && v2;
        }
        return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && dictEq.eq(v1._1)(v._1));
      };
      return go(xs)(ys)(true);
    }
  };
  var ord1List = {
    compare1: (dictOrd) => (xs) => (ys) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const v = go$a0, v1 = go$a1;
          if (v.tag === "Nil") {
            if (v1.tag === "Nil") {
              go$c = false;
              go$r = EQ;
              continue;
            }
            go$c = false;
            go$r = LT;
            continue;
          }
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = GT;
            continue;
          }
          if (v.tag === "Cons" && v1.tag === "Cons") {
            const v2 = dictOrd.compare(v._1)(v1._1);
            if (v2 === "EQ") {
              go$a0 = v._2;
              go$a1 = v1._2;
              continue;
            }
            go$c = false;
            go$r = v2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(xs)(ys);
    },
    Eq10: () => eq1List
  };
  var ordList = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqList1 = {
      eq: (xs) => (ys) => {
        const go = (v) => (v1) => (v2) => {
          if (!v2) {
            return false;
          }
          if (v.tag === "Nil") {
            return v1.tag === "Nil" && v2;
          }
          return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && $0.eq(v1._1)(v._1));
        };
        return go(xs)(ys)(true);
      }
    };
    return { compare: ord1List.compare1(dictOrd), Eq0: () => eqList1 };
  };

  // output-es/Data.List/index.js
  var reverse = /* @__PURE__ */ (() => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = v;
          continue;
        }
        if (v1.tag === "Cons") {
          go$a0 = $List("Cons", v1._1, v);
          go$a1 = v1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(Nil);
  })();
  var deleteBy = (v) => (v1) => (v2) => {
    if (v2.tag === "Nil") {
      return Nil;
    }
    if (v2.tag === "Cons") {
      if (v(v1)(v2._1)) {
        return v2._2;
      }
      return $List("Cons", v2._1, deleteBy(v)(v1)(v2._2));
    }
    fail();
  };

  // output-es/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a) {
      return [a];
    }
    function array2(a) {
      return function(b) {
        return [a, b];
      };
    }
    function array3(a) {
      return function(b) {
        return function(c) {
          return [a, b, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply2) {
      return function(map) {
        return function(pure) {
          return function(f) {
            return function(array) {
              function go(bot, top) {
                switch (top - bot) {
                  case 0:
                    return pure([]);
                  case 1:
                    return map(array1)(f(array[bot]));
                  case 2:
                    return apply2(map(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top - bot) / 4) * 2;
                    return apply2(map(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output-es/Data.Traversable/index.js
  var identity6 = (x3) => x3;
  var traversableMaybe = {
    traverse: (dictApplicative) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return dictApplicative.pure(Nothing);
      }
      if (v1.tag === "Just") {
        return dictApplicative.Apply0().Functor0().map(Just)(v(v1._1));
      }
      fail();
    },
    sequence: (dictApplicative) => (v) => {
      if (v.tag === "Nothing") {
        return dictApplicative.pure(Nothing);
      }
      if (v.tag === "Just") {
        return dictApplicative.Apply0().Functor0().map(Just)(v._1);
      }
      fail();
    },
    Functor0: () => functorMaybe,
    Foldable1: () => foldableMaybe
  };
  var traversableArray = {
    traverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(Apply0.apply)(Apply0.Functor0().map)(dictApplicative.pure);
    },
    sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity6),
    Functor0: () => functorArray,
    Foldable1: () => foldableArray
  };

  // output-es/Data.CatQueue/index.js
  var $CatQueue = (_1, _2) => ({ tag: "CatQueue", _1, _2 });
  var uncons = (uncons$a0$copy) => {
    let uncons$a0 = uncons$a0$copy, uncons$c = true, uncons$r;
    while (uncons$c) {
      const v = uncons$a0;
      if (v._1.tag === "Nil") {
        if (v._2.tag === "Nil") {
          uncons$c = false;
          uncons$r = Nothing;
          continue;
        }
        uncons$a0 = $CatQueue(reverse(v._2), Nil);
        continue;
      }
      if (v._1.tag === "Cons") {
        uncons$c = false;
        uncons$r = $Maybe("Just", $Tuple(v._1._1, $CatQueue(v._1._2, v._2)));
        continue;
      }
      fail();
    }
    return uncons$r;
  };

  // output-es/Data.CatList/index.js
  var $CatList = (tag, _1, _2) => ({ tag, _1, _2 });
  var CatNil = /* @__PURE__ */ $CatList("CatNil");
  var link = (v) => (v1) => {
    if (v.tag === "CatNil") {
      return v1;
    }
    if (v1.tag === "CatNil") {
      return v;
    }
    if (v.tag === "CatCons") {
      return $CatList("CatCons", v._1, $CatQueue(v._2._1, $List("Cons", v1, v._2._2)));
    }
    fail();
  };
  var foldr = (k) => (b) => (q) => {
    const foldl = (foldl$a0$copy) => (foldl$a1$copy) => (foldl$a2$copy) => {
      let foldl$a0 = foldl$a0$copy, foldl$a1 = foldl$a1$copy, foldl$a2 = foldl$a2$copy, foldl$c = true, foldl$r;
      while (foldl$c) {
        const v = foldl$a0, v1 = foldl$a1, v2 = foldl$a2;
        if (v2.tag === "Nil") {
          foldl$c = false;
          foldl$r = v1;
          continue;
        }
        if (v2.tag === "Cons") {
          foldl$a0 = v;
          foldl$a1 = v(v1)(v2._1);
          foldl$a2 = v2._2;
          continue;
        }
        fail();
      }
      return foldl$r;
    };
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const xs = go$a0, ys = go$a1;
        const v = uncons(xs);
        if (v.tag === "Nothing") {
          go$c = false;
          go$r = foldl((x3) => (i) => i(x3))(b)(ys);
          continue;
        }
        if (v.tag === "Just") {
          go$a0 = v._1._2;
          go$a1 = $List("Cons", k(v._1._1), ys);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(q)(Nil);
  };
  var uncons2 = (v) => {
    if (v.tag === "CatNil") {
      return Nothing;
    }
    if (v.tag === "CatCons") {
      return $Maybe("Just", $Tuple(v._1, v._2._1.tag === "Nil" && v._2._2.tag === "Nil" ? CatNil : foldr(link)(CatNil)(v._2)));
    }
    fail();
  };
  var snoc = (cat) => (a) => {
    if (cat.tag === "CatNil") {
      return $CatList("CatCons", a, $CatQueue(Nil, Nil));
    }
    if (cat.tag === "CatCons") {
      return $CatList(
        "CatCons",
        cat._1,
        $CatQueue(
          cat._2._1,
          $List("Cons", $CatList("CatCons", a, $CatQueue(Nil, Nil)), cat._2._2)
        )
      );
    }
    fail();
  };

  // output-es/Control.Monad.Free/index.js
  var $Free = (_1, _2) => ({ tag: "Free", _1, _2 });
  var $FreeView = (tag, _1, _2) => ({ tag, _1, _2 });
  var toView = (toView$a0$copy) => {
    let toView$a0 = toView$a0$copy, toView$c = true, toView$r;
    while (toView$c) {
      const v = toView$a0;
      if (v._1.tag === "Return") {
        const v2 = uncons2(v._2);
        if (v2.tag === "Nothing") {
          toView$c = false;
          toView$r = $FreeView("Return", v._1._1);
          continue;
        }
        if (v2.tag === "Just") {
          toView$a0 = (() => {
            const $0 = v2._1._1(v._1._1);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v2._1._2;
                }
                if (v2._1._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v2._1._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          })();
          continue;
        }
        fail();
      }
      if (v._1.tag === "Bind") {
        toView$c = false;
        toView$r = $FreeView(
          "Bind",
          v._1._1,
          (a) => {
            const $0 = v._1._2(a);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v._2;
                }
                if (v._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          }
        );
        continue;
      }
      fail();
    }
    return toView$r;
  };
  var freeMonad = { Applicative0: () => freeApplicative, Bind1: () => freeBind };
  var freeFunctor = { map: (k) => (f) => freeBind.bind(f)((x3) => freeApplicative.pure(k(x3))) };
  var freeBind = { bind: (v) => (k) => $Free(v._1, snoc(v._2)(k)), Apply0: () => freeApply };
  var freeApply = {
    apply: (f) => (a) => $Free(f._1, snoc(f._2)((f$p) => $Free(a._1, snoc(a._2)((a$p) => freeApplicative.pure(f$p(a$p)))))),
    Functor0: () => freeFunctor
  };
  var freeApplicative = { pure: (x3) => $Free($FreeView("Return", x3), CatNil), Apply0: () => freeApply };
  var substFree = (k) => {
    const go = (f) => {
      const v = toView(f);
      if (v.tag === "Return") {
        return $Free($FreeView("Return", v._1), CatNil);
      }
      if (v.tag === "Bind") {
        const $0 = k(v._1);
        return $Free($0._1, snoc($0._2)((x3) => go(v._2(x3))));
      }
      fail();
    };
    return go;
  };
  var hoistFree = (k) => substFree((x3) => $Free($FreeView("Bind", k(x3), (x$1) => $Free($FreeView("Return", x$1), CatNil)), CatNil));
  var foldFree = (dictMonadRec) => {
    const Monad0 = dictMonadRec.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (k) => dictMonadRec.tailRecM((f) => {
      const v = toView(f);
      if (v.tag === "Return") {
        return $0.map(Done)(Monad0.Applicative0().pure(v._1));
      }
      if (v.tag === "Bind") {
        return $0.map((x3) => $Step("Loop", v._2(x3)))(k(v._1));
      }
      fail();
    });
  };

  // output-es/Data.Bifunctor/index.js
  var identity7 = (x3) => x3;
  var bifunctorTuple = { bimap: (f) => (g) => (v) => $Tuple(f(v._1), g(v._2)) };

  // output-es/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;
  var eqArrayImpl = function(f) {
    return function(xs) {
      return function(ys) {
        if (xs.length !== ys.length)
          return false;
        for (var i = 0; i < xs.length; i++) {
          if (!f(xs[i])(ys[i]))
            return false;
        }
        return true;
      };
    };
  };

  // output-es/Data.Eq/index.js
  var eqUnit = { eq: (v) => (v1) => true };
  var eqString = { eq: eqStringImpl };
  var eqInt = { eq: eqIntImpl };

  // output-es/Data.List.Lazy.Types/index.js
  var $Step2 = (tag, _1, _2) => ({ tag, _1, _2 });
  var Nil2 = /* @__PURE__ */ $Step2("Nil");
  var nil = /* @__PURE__ */ defer((v) => Nil2);
  var foldableList2 = {
    foldr: (op) => (z) => (xs) => foldableList2.foldl((b) => (a) => op(a)(b))(z)(foldableList2.foldl((b) => (a) => defer((v) => $Step2("Cons", a, b)))(nil)(xs)),
    foldl: (op) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, xs = go$a1;
          const v = force(xs);
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = op(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go;
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableList2.foldl((b) => (a) => dictMonoid.Semigroup0().append(b)(f(a)))(mempty);
    }
  };
  var unfoldable1List = {
    unfoldr1: /* @__PURE__ */ (() => {
      const go = (f) => (b) => defer((x3) => force((() => {
        const v1 = f(b);
        if (v1._2.tag === "Just") {
          const $0 = v1._1;
          const $1 = go(f)(v1._2._1);
          return defer((v) => $Step2("Cons", $0, $1));
        }
        if (v1._2.tag === "Nothing") {
          const $0 = v1._1;
          return defer((v) => $Step2("Cons", $0, nil));
        }
        fail();
      })()));
      return go;
    })()
  };
  var unfoldableList = {
    unfoldr: /* @__PURE__ */ (() => {
      const go = (f) => (b) => defer((x3) => force((() => {
        const v1 = f(b);
        if (v1.tag === "Nothing") {
          return nil;
        }
        if (v1.tag === "Just") {
          const $0 = v1._1._1;
          const $1 = go(f)(v1._1._2);
          return defer((v) => $Step2("Cons", $0, $1));
        }
        fail();
      })()));
      return go;
    })(),
    Unfoldable10: () => unfoldable1List
  };

  // output-es/Data.List.Lazy/index.js
  var filter = (p) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = Nil2;
          continue;
        }
        if (v.tag === "Cons") {
          if (p(v._1)) {
            go$c = false;
            go$r = $Step2("Cons", v._1, filter(p)(v._2));
            continue;
          }
          go$a0 = force(v._2);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return (x3) => defer((v) => go(force(x3)));
  };

  // output-es/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq) {
      return function(gt) {
        return function(x3) {
          return function(y3) {
            return x3 < y3 ? lt : x3 === y3 ? eq : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;
  var ordArrayImpl = function(f) {
    return function(xs) {
      return function(ys) {
        var i = 0;
        var xlen = xs.length;
        var ylen = ys.length;
        while (i < xlen && i < ylen) {
          var x3 = xs[i];
          var y3 = ys[i];
          var o = f(x3)(y3);
          if (o !== 0) {
            return o;
          }
          i++;
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

  // output-es/Data.Ord/index.js
  var ordUnit = { compare: (v) => (v1) => EQ, Eq0: () => eqUnit };
  var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
  var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };
  var ordRecord = () => (dictOrdRecord) => {
    const eqRec1 = { eq: dictOrdRecord.EqRecord0().eqRecord($$Proxy) };
    return { compare: dictOrdRecord.compareRecord($$Proxy), Eq0: () => eqRec1 };
  };
  var ordArray = (dictOrd) => {
    const eqArray = { eq: eqArrayImpl(dictOrd.Eq0().eq) };
    return {
      compare: (xs) => (ys) => ordInt.compare(0)(ordArrayImpl((x3) => (y3) => {
        const v = dictOrd.compare(x3)(y3);
        if (v === "EQ") {
          return 0;
        }
        if (v === "LT") {
          return 1;
        }
        if (v === "GT") {
          return -1;
        }
        fail();
      })(xs)(ys)),
      Eq0: () => eqArray
    };
  };

  // output-es/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value2 = b;
              while (true) {
                var tuple = f(value2);
                result.push(fst2(tuple));
                var maybe = snd2(tuple);
                if (isNothing2(maybe))
                  return result;
                value2 = fromJust3(maybe);
              }
            };
          };
        };
      };
    };
  };

  // output-es/Data.Unfoldable1/index.js
  var fromJust = (v) => {
    if (v.tag === "Just") {
      return v._1;
    }
    fail();
  };
  var unfoldable1Array = { unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust)(fst)(snd) };
  var replicate1 = (dictUnfoldable1) => (n) => (v) => dictUnfoldable1.unfoldr1((i) => {
    if (i <= 0) {
      return $Tuple(v, Nothing);
    }
    return $Tuple(v, $Maybe("Just", i - 1 | 0));
  })(n - 1 | 0);

  // output-es/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value2 = b;
              while (true) {
                var maybe = f(value2);
                if (isNothing2(maybe))
                  return result;
                var tuple = fromJust3(maybe);
                result.push(fst2(tuple));
                value2 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output-es/Data.Unfoldable/index.js
  var fromJust2 = (v) => {
    if (v.tag === "Just") {
      return v._1;
    }
    fail();
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust2)(fst)(snd),
    Unfoldable10: () => unfoldable1Array
  };

  // output-es/Data.Map.Internal/index.js
  var $KickUp = (_1, _2, _3, _4) => ({ tag: "KickUp", _1, _2, _3, _4 });
  var $$$Map = (tag, _1, _2, _3, _4, _5, _6, _7) => ({ tag, _1, _2, _3, _4, _5, _6, _7 });
  var $TreeContext = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var identity9 = (x3) => x3;
  var Leaf2 = /* @__PURE__ */ $$$Map("Leaf");
  var Two = (value0) => (value1) => (value2) => (value3) => $$$Map("Two", value0, value1, value2, value3);
  var Three = (value0) => (value1) => (value2) => (value3) => (value4) => (value5) => (value6) => $$$Map("Three", value0, value1, value2, value3, value4, value5, value6);
  var singleton = (k) => (v) => $$$Map("Two", Leaf2, k, v, Leaf2);
  var toUnfoldable = (dictUnfoldable) => (m) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Cons") {
          if (v._1.tag === "Leaf") {
            go$a0 = v._2;
            continue;
          }
          if (v._1.tag === "Two") {
            if (v._1._1.tag === "Leaf") {
              if (v._1._4.tag === "Leaf") {
                go$c = false;
                go$r = $Maybe("Just", $Tuple($Tuple(v._1._2, v._1._3), v._2));
                continue;
              }
              go$c = false;
              go$r = $Maybe("Just", $Tuple($Tuple(v._1._2, v._1._3), $List("Cons", v._1._4, v._2)));
              continue;
            }
            go$a0 = $List(
              "Cons",
              v._1._1,
              $List("Cons", $$$Map("Two", Leaf2, v._1._2, v._1._3, Leaf2), $List("Cons", v._1._4, v._2))
            );
            continue;
          }
          if (v._1.tag === "Three") {
            go$a0 = $List(
              "Cons",
              v._1._1,
              $List(
                "Cons",
                $$$Map("Two", Leaf2, v._1._2, v._1._3, Leaf2),
                $List("Cons", v._1._4, $List("Cons", $$$Map("Two", Leaf2, v._1._5, v._1._6, Leaf2), $List("Cons", v._1._7, v._2)))
              )
            );
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return dictUnfoldable.unfoldr(go)($List("Cons", m, Nil));
  };
  var showMap = (dictShow) => (dictShow1) => {
    const show8 = showArrayImpl((v) => "(Tuple " + dictShow.show(v._1) + " " + dictShow1.show(v._2) + ")");
    return { show: (m) => "(fromFoldable " + show8(toUnfoldable(unfoldableArray)(m)) + ")" };
  };
  var lookup = (dictOrd) => (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Two") {
          const v2 = dictOrd.compare(k)(v._2);
          if (v2 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._3);
            continue;
          }
          if (v2 === "LT") {
            go$a0 = v._1;
            continue;
          }
          go$a0 = v._4;
          continue;
        }
        if (v.tag === "Three") {
          const v3 = dictOrd.compare(k)(v._2);
          if (v3 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._3);
            continue;
          }
          const v4 = dictOrd.compare(k)(v._5);
          if (v4 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._6);
            continue;
          }
          if (v3 === "LT") {
            go$a0 = v._1;
            continue;
          }
          if (v4 === "GT") {
            go$a0 = v._7;
            continue;
          }
          go$a0 = v._4;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var functorMap = {
    map: (v) => (v1) => {
      if (v1.tag === "Leaf") {
        return Leaf2;
      }
      if (v1.tag === "Two") {
        return $$$Map("Two", functorMap.map(v)(v1._1), v1._2, v(v1._3), functorMap.map(v)(v1._4));
      }
      if (v1.tag === "Three") {
        return $$$Map("Three", functorMap.map(v)(v1._1), v1._2, v(v1._3), functorMap.map(v)(v1._4), v1._5, v(v1._6), functorMap.map(v)(v1._7));
      }
      fail();
    }
  };
  var functorWithIndexMap = {
    mapWithIndex: (v) => (v1) => {
      if (v1.tag === "Leaf") {
        return Leaf2;
      }
      if (v1.tag === "Two") {
        return $$$Map("Two", functorWithIndexMap.mapWithIndex(v)(v1._1), v1._2, v(v1._2)(v1._3), functorWithIndexMap.mapWithIndex(v)(v1._4));
      }
      if (v1.tag === "Three") {
        return $$$Map(
          "Three",
          functorWithIndexMap.mapWithIndex(v)(v1._1),
          v1._2,
          v(v1._2)(v1._3),
          functorWithIndexMap.mapWithIndex(v)(v1._4),
          v1._5,
          v(v1._5)(v1._6),
          functorWithIndexMap.mapWithIndex(v)(v1._7)
        );
      }
      fail();
    },
    Functor0: () => functorMap
  };
  var fromZipper = (fromZipper$a0$copy) => (fromZipper$a1$copy) => (fromZipper$a2$copy) => {
    let fromZipper$a0 = fromZipper$a0$copy, fromZipper$a1 = fromZipper$a1$copy, fromZipper$a2 = fromZipper$a2$copy, fromZipper$c = true, fromZipper$r;
    while (fromZipper$c) {
      const dictOrd = fromZipper$a0, v = fromZipper$a1, v1 = fromZipper$a2;
      if (v.tag === "Nil") {
        fromZipper$c = false;
        fromZipper$r = v1;
        continue;
      }
      if (v.tag === "Cons") {
        if (v._1.tag === "TwoLeft") {
          fromZipper$a0 = dictOrd;
          fromZipper$a1 = v._2;
          fromZipper$a2 = $$$Map("Two", v1, v._1._1, v._1._2, v._1._3);
          continue;
        }
        if (v._1.tag === "TwoRight") {
          fromZipper$a0 = dictOrd;
          fromZipper$a1 = v._2;
          fromZipper$a2 = $$$Map("Two", v._1._1, v._1._2, v._1._3, v1);
          continue;
        }
        if (v._1.tag === "ThreeLeft") {
          fromZipper$a0 = dictOrd;
          fromZipper$a1 = v._2;
          fromZipper$a2 = $$$Map("Three", v1, v._1._1, v._1._2, v._1._3, v._1._4, v._1._5, v._1._6);
          continue;
        }
        if (v._1.tag === "ThreeMiddle") {
          fromZipper$a0 = dictOrd;
          fromZipper$a1 = v._2;
          fromZipper$a2 = $$$Map("Three", v._1._1, v._1._2, v._1._3, v1, v._1._4, v._1._5, v._1._6);
          continue;
        }
        if (v._1.tag === "ThreeRight") {
          fromZipper$a0 = dictOrd;
          fromZipper$a1 = v._2;
          fromZipper$a2 = $$$Map("Three", v._1._1, v._1._2, v._1._3, v._1._4, v._1._5, v._1._6, v1);
          continue;
        }
      }
      fail();
    }
    return fromZipper$r;
  };
  var insert = (dictOrd) => (k) => (v) => {
    const up = (up$a0$copy) => (up$a1$copy) => {
      let up$a0 = up$a0$copy, up$a1 = up$a1$copy, up$c = true, up$r;
      while (up$c) {
        const v1 = up$a0, v2 = up$a1;
        if (v1.tag === "Nil") {
          up$c = false;
          up$r = $$$Map("Two", v2._1, v2._2, v2._3, v2._4);
          continue;
        }
        if (v1.tag === "Cons") {
          if (v1._1.tag === "TwoLeft") {
            up$c = false;
            up$r = fromZipper(dictOrd)(v1._2)($$$Map("Three", v2._1, v2._2, v2._3, v2._4, v1._1._1, v1._1._2, v1._1._3));
            continue;
          }
          if (v1._1.tag === "TwoRight") {
            up$c = false;
            up$r = fromZipper(dictOrd)(v1._2)($$$Map("Three", v1._1._1, v1._1._2, v1._1._3, v2._1, v2._2, v2._3, v2._4));
            continue;
          }
          if (v1._1.tag === "ThreeLeft") {
            up$a0 = v1._2;
            up$a1 = $KickUp($$$Map("Two", v2._1, v2._2, v2._3, v2._4), v1._1._1, v1._1._2, $$$Map("Two", v1._1._3, v1._1._4, v1._1._5, v1._1._6));
            continue;
          }
          if (v1._1.tag === "ThreeMiddle") {
            up$a0 = v1._2;
            up$a1 = $KickUp($$$Map("Two", v1._1._1, v1._1._2, v1._1._3, v2._1), v2._2, v2._3, $$$Map("Two", v2._4, v1._1._4, v1._1._5, v1._1._6));
            continue;
          }
          if (v1._1.tag === "ThreeRight") {
            up$a0 = v1._2;
            up$a1 = $KickUp($$$Map("Two", v1._1._1, v1._1._2, v1._1._3, v1._1._4), v1._1._5, v1._1._6, $$$Map("Two", v2._1, v2._2, v2._3, v2._4));
            continue;
          }
        }
        fail();
      }
      return up$r;
    };
    const down = (down$a0$copy) => (down$a1$copy) => {
      let down$a0 = down$a0$copy, down$a1 = down$a1$copy, down$c = true, down$r;
      while (down$c) {
        const v1 = down$a0, v2 = down$a1;
        if (v2.tag === "Leaf") {
          down$c = false;
          down$r = up(v1)($KickUp(Leaf2, k, v, Leaf2));
          continue;
        }
        if (v2.tag === "Two") {
          const v3 = dictOrd.compare(k)(v2._2);
          if (v3 === "EQ") {
            down$c = false;
            down$r = fromZipper(dictOrd)(v1)($$$Map("Two", v2._1, k, v, v2._4));
            continue;
          }
          if (v3 === "LT") {
            down$a0 = $List("Cons", $TreeContext("TwoLeft", v2._2, v2._3, v2._4), v1);
            down$a1 = v2._1;
            continue;
          }
          down$a0 = $List("Cons", $TreeContext("TwoRight", v2._1, v2._2, v2._3), v1);
          down$a1 = v2._4;
          continue;
        }
        if (v2.tag === "Three") {
          const v3 = dictOrd.compare(k)(v2._2);
          if (v3 === "EQ") {
            down$c = false;
            down$r = fromZipper(dictOrd)(v1)($$$Map("Three", v2._1, k, v, v2._4, v2._5, v2._6, v2._7));
            continue;
          }
          const v4 = dictOrd.compare(k)(v2._5);
          if (v4 === "EQ") {
            down$c = false;
            down$r = fromZipper(dictOrd)(v1)($$$Map("Three", v2._1, v2._2, v2._3, v2._4, k, v, v2._7));
            continue;
          }
          if (v3 === "LT") {
            down$a0 = $List("Cons", $TreeContext("ThreeLeft", v2._2, v2._3, v2._4, v2._5, v2._6, v2._7), v1);
            down$a1 = v2._1;
            continue;
          }
          if (v3 === "GT" && v4 === "LT") {
            down$a0 = $List("Cons", $TreeContext("ThreeMiddle", v2._1, v2._2, v2._3, v2._5, v2._6, v2._7), v1);
            down$a1 = v2._4;
            continue;
          }
          down$a0 = $List("Cons", $TreeContext("ThreeRight", v2._1, v2._2, v2._3, v2._4, v2._5, v2._6), v1);
          down$a1 = v2._7;
          continue;
        }
        fail();
      }
      return down$r;
    };
    return down(Nil);
  };
  var pop = (dictOrd) => (k) => {
    const up = (up$a0$copy) => (up$a1$copy) => {
      let up$a0 = up$a0$copy, up$a1 = up$a1$copy, up$c = true, up$r;
      while (up$c) {
        const ctxs = up$a0, tree = up$a1;
        if (ctxs.tag === "Nil") {
          up$c = false;
          up$r = tree;
          continue;
        }
        if (ctxs.tag === "Cons") {
          const $0 = ctxs._2;
          const $1 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", $$$Map("Two", a, k1, v1, b), k2, v2, $$$Map("Two", c, k3, v3, d2)));
          const $2 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", $$$Map("Two", a, k1, v1, b), k2, v2, $$$Map("Two", c, k3, v3, d2)));
          const $3 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", $$$Map("Three", a, k1, v1, b, k2, v2, c), k3, v3, d2));
          const $4 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", $$$Map("Three", a, k1, v1, b, k2, v2, c), k3, v3, d2));
          const $5 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", a, k1, v1, $$$Map("Three", b, k2, v2, c, k3, v3, d2)));
          const $6 = (a, b, c, d2, k1, k2, k3, v1, v2, v3) => fromZipper(dictOrd)($0)($$$Map("Two", a, k1, v1, $$$Map("Three", b, k2, v2, c, k3, v3, d2)));
          const $7 = (a, b, c, d2, e, k1, k2, k3, k4, v1, v2, v3, v4) => fromZipper(dictOrd)($0)($$$Map(
            "Three",
            $$$Map("Two", a, k1, v1, b),
            k2,
            v2,
            $$$Map("Two", c, k3, v3, d2),
            k4,
            v4,
            e
          ));
          const $8 = (a, b, c, d2, e, k1, k2, k3, k4, v1, v2, v3, v4) => fromZipper(dictOrd)($0)($$$Map(
            "Three",
            $$$Map("Two", a, k1, v1, b),
            k2,
            v2,
            $$$Map("Two", c, k3, v3, d2),
            k4,
            v4,
            e
          ));
          const $9 = (a, b, c, d2, e, k1, k2, k3, k4, v1, v2, v3, v4) => fromZipper(dictOrd)($0)($$$Map(
            "Three",
            a,
            k1,
            v1,
            $$$Map("Two", b, k2, v2, c),
            k3,
            v3,
            $$$Map("Two", d2, k4, v4, e)
          ));
          const $10 = (a, b, c, d2, e, k1, k2, k3, k4, v1, v2, v3, v4) => fromZipper(dictOrd)($0)($$$Map(
            "Three",
            a,
            k1,
            v1,
            $$$Map("Two", b, k2, v2, c),
            k3,
            v3,
            $$$Map("Two", d2, k4, v4, e)
          ));
          if (tree.tag === "Leaf") {
            if (ctxs._1.tag === "TwoLeft") {
              if (ctxs._1._3.tag === "Leaf") {
                up$c = false;
                up$r = fromZipper(dictOrd)($0)($$$Map("Two", Leaf2, ctxs._1._1, ctxs._1._2, Leaf2));
                continue;
              }
              if (ctxs._1._3.tag === "Two") {
                up$a0 = $0;
                up$a1 = $$$Map("Three", tree, ctxs._1._1, ctxs._1._2, ctxs._1._3._1, ctxs._1._3._2, ctxs._1._3._3, ctxs._1._3._4);
                continue;
              }
              if (ctxs._1._3.tag === "Three") {
                up$c = false;
                up$r = $1(tree, ctxs._1._3._1, ctxs._1._3._4, ctxs._1._3._7, ctxs._1._1, ctxs._1._3._2, ctxs._1._3._5, ctxs._1._2, ctxs._1._3._3, ctxs._1._3._6);
                continue;
              }
              up$c = false;
              up$r = _crashWith("The impossible happened in partial function `up`.");
              continue;
            }
            if (ctxs._1.tag === "TwoRight") {
              if (ctxs._1._1.tag === "Leaf") {
                up$c = false;
                up$r = fromZipper(dictOrd)($0)($$$Map("Two", Leaf2, ctxs._1._2, ctxs._1._3, Leaf2));
                continue;
              }
              if (ctxs._1._1.tag === "Two") {
                up$a0 = $0;
                up$a1 = $$$Map("Three", ctxs._1._1._1, ctxs._1._1._2, ctxs._1._1._3, ctxs._1._1._4, ctxs._1._2, ctxs._1._3, tree);
                continue;
              }
              if (ctxs._1._1.tag === "Three") {
                up$c = false;
                up$r = $2(ctxs._1._1._1, ctxs._1._1._4, ctxs._1._1._7, tree, ctxs._1._1._2, ctxs._1._1._5, ctxs._1._2, ctxs._1._1._3, ctxs._1._1._6, ctxs._1._3);
                continue;
              }
              up$c = false;
              up$r = _crashWith("The impossible happened in partial function `up`.");
              continue;
            }
            if (ctxs._1.tag === "ThreeLeft") {
              if (ctxs._1._6.tag === "Leaf" && ctxs._1._3.tag === "Leaf") {
                up$c = false;
                up$r = fromZipper(dictOrd)($0)($$$Map("Three", Leaf2, ctxs._1._1, ctxs._1._2, Leaf2, ctxs._1._4, ctxs._1._5, Leaf2));
                continue;
              }
              if (ctxs._1._3.tag === "Two") {
                up$c = false;
                up$r = $3(tree, ctxs._1._3._1, ctxs._1._3._4, ctxs._1._6, ctxs._1._1, ctxs._1._3._2, ctxs._1._4, ctxs._1._2, ctxs._1._3._3, ctxs._1._5);
                continue;
              }
              if (ctxs._1._3.tag === "Three") {
                up$c = false;
                up$r = $7(
                  tree,
                  ctxs._1._3._1,
                  ctxs._1._3._4,
                  ctxs._1._3._7,
                  ctxs._1._6,
                  ctxs._1._1,
                  ctxs._1._3._2,
                  ctxs._1._3._5,
                  ctxs._1._4,
                  ctxs._1._2,
                  ctxs._1._3._3,
                  ctxs._1._3._6,
                  ctxs._1._5
                );
                continue;
              }
              up$c = false;
              up$r = _crashWith("The impossible happened in partial function `up`.");
              continue;
            }
            if (ctxs._1.tag === "ThreeMiddle") {
              if (ctxs._1._1.tag === "Leaf") {
                if (ctxs._1._6.tag === "Leaf") {
                  up$c = false;
                  up$r = fromZipper(dictOrd)($0)($$$Map("Three", Leaf2, ctxs._1._2, ctxs._1._3, Leaf2, ctxs._1._4, ctxs._1._5, Leaf2));
                  continue;
                }
                if (ctxs._1._6.tag === "Two") {
                  up$c = false;
                  up$r = $5(ctxs._1._1, tree, ctxs._1._6._1, ctxs._1._6._4, ctxs._1._2, ctxs._1._4, ctxs._1._6._2, ctxs._1._3, ctxs._1._5, ctxs._1._6._3);
                  continue;
                }
                if (ctxs._1._6.tag === "Three") {
                  up$c = false;
                  up$r = $9(
                    ctxs._1._1,
                    tree,
                    ctxs._1._6._1,
                    ctxs._1._6._4,
                    ctxs._1._6._7,
                    ctxs._1._2,
                    ctxs._1._4,
                    ctxs._1._6._2,
                    ctxs._1._6._5,
                    ctxs._1._3,
                    ctxs._1._5,
                    ctxs._1._6._3,
                    ctxs._1._6._6
                  );
                  continue;
                }
                up$c = false;
                up$r = _crashWith("The impossible happened in partial function `up`.");
                continue;
              }
              if (ctxs._1._1.tag === "Two") {
                up$c = false;
                up$r = $4(ctxs._1._1._1, ctxs._1._1._4, tree, ctxs._1._6, ctxs._1._1._2, ctxs._1._2, ctxs._1._4, ctxs._1._1._3, ctxs._1._3, ctxs._1._5);
                continue;
              }
              if (ctxs._1._6.tag === "Two") {
                up$c = false;
                up$r = $5(ctxs._1._1, tree, ctxs._1._6._1, ctxs._1._6._4, ctxs._1._2, ctxs._1._4, ctxs._1._6._2, ctxs._1._3, ctxs._1._5, ctxs._1._6._3);
                continue;
              }
              if (ctxs._1._1.tag === "Three") {
                up$c = false;
                up$r = $8(
                  ctxs._1._1._1,
                  ctxs._1._1._4,
                  ctxs._1._1._7,
                  tree,
                  ctxs._1._6,
                  ctxs._1._1._2,
                  ctxs._1._1._5,
                  ctxs._1._2,
                  ctxs._1._4,
                  ctxs._1._1._3,
                  ctxs._1._1._6,
                  ctxs._1._3,
                  ctxs._1._5
                );
                continue;
              }
              if (ctxs._1._6.tag === "Three") {
                up$c = false;
                up$r = $9(
                  ctxs._1._1,
                  tree,
                  ctxs._1._6._1,
                  ctxs._1._6._4,
                  ctxs._1._6._7,
                  ctxs._1._2,
                  ctxs._1._4,
                  ctxs._1._6._2,
                  ctxs._1._6._5,
                  ctxs._1._3,
                  ctxs._1._5,
                  ctxs._1._6._3,
                  ctxs._1._6._6
                );
                continue;
              }
              up$c = false;
              up$r = _crashWith("The impossible happened in partial function `up`.");
              continue;
            }
            if (ctxs._1.tag === "ThreeRight") {
              if (ctxs._1._1.tag === "Leaf" && ctxs._1._4.tag === "Leaf") {
                up$c = false;
                up$r = fromZipper(dictOrd)($0)($$$Map("Three", Leaf2, ctxs._1._2, ctxs._1._3, Leaf2, ctxs._1._5, ctxs._1._6, Leaf2));
                continue;
              }
              if (ctxs._1._4.tag === "Two") {
                up$c = false;
                up$r = $6(ctxs._1._1, ctxs._1._4._1, ctxs._1._4._4, tree, ctxs._1._2, ctxs._1._4._2, ctxs._1._5, ctxs._1._3, ctxs._1._4._3, ctxs._1._6);
                continue;
              }
              if (ctxs._1._4.tag === "Three") {
                up$c = false;
                up$r = $10(
                  ctxs._1._1,
                  ctxs._1._4._1,
                  ctxs._1._4._4,
                  ctxs._1._4._7,
                  tree,
                  ctxs._1._2,
                  ctxs._1._4._2,
                  ctxs._1._4._5,
                  ctxs._1._5,
                  ctxs._1._3,
                  ctxs._1._4._3,
                  ctxs._1._4._6,
                  ctxs._1._6
                );
                continue;
              }
            }
            up$c = false;
            up$r = _crashWith("The impossible happened in partial function `up`.");
            continue;
          }
          if (ctxs._1.tag === "TwoLeft") {
            if (ctxs._1._3.tag === "Two") {
              up$a0 = $0;
              up$a1 = $$$Map("Three", tree, ctxs._1._1, ctxs._1._2, ctxs._1._3._1, ctxs._1._3._2, ctxs._1._3._3, ctxs._1._3._4);
              continue;
            }
            if (ctxs._1._3.tag === "Three") {
              up$c = false;
              up$r = $1(tree, ctxs._1._3._1, ctxs._1._3._4, ctxs._1._3._7, ctxs._1._1, ctxs._1._3._2, ctxs._1._3._5, ctxs._1._2, ctxs._1._3._3, ctxs._1._3._6);
              continue;
            }
            up$c = false;
            up$r = _crashWith("The impossible happened in partial function `up`.");
            continue;
          }
          if (ctxs._1.tag === "TwoRight") {
            if (ctxs._1._1.tag === "Two") {
              up$a0 = $0;
              up$a1 = $$$Map("Three", ctxs._1._1._1, ctxs._1._1._2, ctxs._1._1._3, ctxs._1._1._4, ctxs._1._2, ctxs._1._3, tree);
              continue;
            }
            if (ctxs._1._1.tag === "Three") {
              up$c = false;
              up$r = $2(ctxs._1._1._1, ctxs._1._1._4, ctxs._1._1._7, tree, ctxs._1._1._2, ctxs._1._1._5, ctxs._1._2, ctxs._1._1._3, ctxs._1._1._6, ctxs._1._3);
              continue;
            }
            up$c = false;
            up$r = _crashWith("The impossible happened in partial function `up`.");
            continue;
          }
          if (ctxs._1.tag === "ThreeLeft") {
            if (ctxs._1._3.tag === "Two") {
              up$c = false;
              up$r = $3(tree, ctxs._1._3._1, ctxs._1._3._4, ctxs._1._6, ctxs._1._1, ctxs._1._3._2, ctxs._1._4, ctxs._1._2, ctxs._1._3._3, ctxs._1._5);
              continue;
            }
            if (ctxs._1._3.tag === "Three") {
              up$c = false;
              up$r = $7(
                tree,
                ctxs._1._3._1,
                ctxs._1._3._4,
                ctxs._1._3._7,
                ctxs._1._6,
                ctxs._1._1,
                ctxs._1._3._2,
                ctxs._1._3._5,
                ctxs._1._4,
                ctxs._1._2,
                ctxs._1._3._3,
                ctxs._1._3._6,
                ctxs._1._5
              );
              continue;
            }
            up$c = false;
            up$r = _crashWith("The impossible happened in partial function `up`.");
            continue;
          }
          if (ctxs._1.tag === "ThreeMiddle") {
            if (ctxs._1._1.tag === "Two") {
              up$c = false;
              up$r = $4(ctxs._1._1._1, ctxs._1._1._4, tree, ctxs._1._6, ctxs._1._1._2, ctxs._1._2, ctxs._1._4, ctxs._1._1._3, ctxs._1._3, ctxs._1._5);
              continue;
            }
            if (ctxs._1._6.tag === "Two") {
              up$c = false;
              up$r = $5(ctxs._1._1, tree, ctxs._1._6._1, ctxs._1._6._4, ctxs._1._2, ctxs._1._4, ctxs._1._6._2, ctxs._1._3, ctxs._1._5, ctxs._1._6._3);
              continue;
            }
            if (ctxs._1._1.tag === "Three") {
              up$c = false;
              up$r = $8(
                ctxs._1._1._1,
                ctxs._1._1._4,
                ctxs._1._1._7,
                tree,
                ctxs._1._6,
                ctxs._1._1._2,
                ctxs._1._1._5,
                ctxs._1._2,
                ctxs._1._4,
                ctxs._1._1._3,
                ctxs._1._1._6,
                ctxs._1._3,
                ctxs._1._5
              );
              continue;
            }
            if (ctxs._1._6.tag === "Three") {
              up$c = false;
              up$r = $9(
                ctxs._1._1,
                tree,
                ctxs._1._6._1,
                ctxs._1._6._4,
                ctxs._1._6._7,
                ctxs._1._2,
                ctxs._1._4,
                ctxs._1._6._2,
                ctxs._1._6._5,
                ctxs._1._3,
                ctxs._1._5,
                ctxs._1._6._3,
                ctxs._1._6._6
              );
              continue;
            }
            up$c = false;
            up$r = _crashWith("The impossible happened in partial function `up`.");
            continue;
          }
          if (ctxs._1.tag === "ThreeRight") {
            if (ctxs._1._4.tag === "Two") {
              up$c = false;
              up$r = $6(ctxs._1._1, ctxs._1._4._1, ctxs._1._4._4, tree, ctxs._1._2, ctxs._1._4._2, ctxs._1._5, ctxs._1._3, ctxs._1._4._3, ctxs._1._6);
              continue;
            }
            if (ctxs._1._4.tag === "Three") {
              up$c = false;
              up$r = $10(
                ctxs._1._1,
                ctxs._1._4._1,
                ctxs._1._4._4,
                ctxs._1._4._7,
                tree,
                ctxs._1._2,
                ctxs._1._4._2,
                ctxs._1._4._5,
                ctxs._1._5,
                ctxs._1._3,
                ctxs._1._4._3,
                ctxs._1._4._6,
                ctxs._1._6
              );
              continue;
            }
          }
          up$c = false;
          up$r = _crashWith("The impossible happened in partial function `up`.");
          continue;
        }
        fail();
      }
      return up$r;
    };
    const removeMaxNode = (removeMaxNode$a0$copy) => (removeMaxNode$a1$copy) => {
      let removeMaxNode$a0 = removeMaxNode$a0$copy, removeMaxNode$a1 = removeMaxNode$a1$copy, removeMaxNode$c = true, removeMaxNode$r;
      while (removeMaxNode$c) {
        const ctx = removeMaxNode$a0, m = removeMaxNode$a1;
        if (m.tag === "Two") {
          if (m._1.tag === "Leaf" && m._4.tag === "Leaf") {
            removeMaxNode$c = false;
            removeMaxNode$r = up(ctx)(Leaf2);
            continue;
          }
          removeMaxNode$a0 = $List("Cons", $TreeContext("TwoRight", m._1, m._2, m._3), ctx);
          removeMaxNode$a1 = m._4;
          continue;
        }
        if (m.tag === "Three") {
          if (m._1.tag === "Leaf" && m._4.tag === "Leaf" && m._7.tag === "Leaf") {
            removeMaxNode$c = false;
            removeMaxNode$r = up($List("Cons", $TreeContext("TwoRight", Leaf2, m._2, m._3), ctx))(Leaf2);
            continue;
          }
          removeMaxNode$a0 = $List("Cons", $TreeContext("ThreeRight", m._1, m._2, m._3, m._4, m._5, m._6), ctx);
          removeMaxNode$a1 = m._7;
          continue;
        }
        removeMaxNode$c = false;
        removeMaxNode$r = _crashWith("The impossible happened in partial function `removeMaxNode`.");
      }
      return removeMaxNode$r;
    };
    const maxNode = (maxNode$a0$copy) => {
      let maxNode$a0 = maxNode$a0$copy, maxNode$c = true, maxNode$r;
      while (maxNode$c) {
        const m = maxNode$a0;
        if (m.tag === "Two") {
          if (m._4.tag === "Leaf") {
            maxNode$c = false;
            maxNode$r = { key: m._2, value: m._3 };
            continue;
          }
          maxNode$a0 = m._4;
          continue;
        }
        if (m.tag === "Three") {
          if (m._7.tag === "Leaf") {
            maxNode$c = false;
            maxNode$r = { key: m._5, value: m._6 };
            continue;
          }
          maxNode$a0 = m._7;
          continue;
        }
        maxNode$c = false;
        maxNode$r = _crashWith("The impossible happened in partial function `maxNode`.");
      }
      return maxNode$r;
    };
    const down = (down$a0$copy) => (down$a1$copy) => {
      let down$a0 = down$a0$copy, down$a1 = down$a1$copy, down$c = true, down$r;
      while (down$c) {
        const ctx = down$a0, m = down$a1;
        if (m.tag === "Leaf") {
          down$c = false;
          down$r = Nothing;
          continue;
        }
        if (m.tag === "Two") {
          const v = dictOrd.compare(k)(m._2);
          if (v === "EQ") {
            if (m._4.tag === "Leaf") {
              down$c = false;
              down$r = $Maybe("Just", $Tuple(m._3, up(ctx)(Leaf2)));
              continue;
            }
            const max2 = maxNode(m._1);
            down$c = false;
            down$r = $Maybe(
              "Just",
              $Tuple(m._3, removeMaxNode($List("Cons", $TreeContext("TwoLeft", max2.key, max2.value, m._4), ctx))(m._1))
            );
            continue;
          }
          if (v === "LT") {
            down$a0 = $List("Cons", $TreeContext("TwoLeft", m._2, m._3, m._4), ctx);
            down$a1 = m._1;
            continue;
          }
          down$a0 = $List("Cons", $TreeContext("TwoRight", m._1, m._2, m._3), ctx);
          down$a1 = m._4;
          continue;
        }
        if (m.tag === "Three") {
          const v = dictOrd.compare(k)(m._5);
          const v3 = dictOrd.compare(k)(m._2);
          if (m._1.tag === "Leaf" && m._4.tag === "Leaf" && m._7.tag === "Leaf") {
            if (v3 === "EQ") {
              down$c = false;
              down$r = $Maybe("Just", $Tuple(m._3, fromZipper(dictOrd)(ctx)($$$Map("Two", Leaf2, m._5, m._6, Leaf2))));
              continue;
            }
            if (v === "EQ") {
              down$c = false;
              down$r = $Maybe("Just", $Tuple(m._6, fromZipper(dictOrd)(ctx)($$$Map("Two", Leaf2, m._2, m._3, Leaf2))));
              continue;
            }
            if (v3 === "LT") {
              down$a0 = $List("Cons", $TreeContext("ThreeLeft", m._2, m._3, m._4, m._5, m._6, m._7), ctx);
              down$a1 = m._1;
              continue;
            }
            if (v3 === "GT" && v === "LT") {
              down$a0 = $List("Cons", $TreeContext("ThreeMiddle", m._1, m._2, m._3, m._5, m._6, m._7), ctx);
              down$a1 = m._4;
              continue;
            }
            down$a0 = $List("Cons", $TreeContext("ThreeRight", m._1, m._2, m._3, m._4, m._5, m._6), ctx);
            down$a1 = m._7;
            continue;
          }
          if (v3 === "EQ") {
            const max2 = maxNode(m._1);
            down$c = false;
            down$r = $Maybe(
              "Just",
              $Tuple(m._3, removeMaxNode($List("Cons", $TreeContext("ThreeLeft", max2.key, max2.value, m._4, m._5, m._6, m._7), ctx))(m._1))
            );
            continue;
          }
          if (v === "EQ") {
            const max2 = maxNode(m._4);
            down$c = false;
            down$r = $Maybe(
              "Just",
              $Tuple(m._6, removeMaxNode($List("Cons", $TreeContext("ThreeMiddle", m._1, m._2, m._3, max2.key, max2.value, m._7), ctx))(m._4))
            );
            continue;
          }
          if (v3 === "LT") {
            down$a0 = $List("Cons", $TreeContext("ThreeLeft", m._2, m._3, m._4, m._5, m._6, m._7), ctx);
            down$a1 = m._1;
            continue;
          }
          if (v3 === "GT" && v === "LT") {
            down$a0 = $List("Cons", $TreeContext("ThreeMiddle", m._1, m._2, m._3, m._5, m._6, m._7), ctx);
            down$a1 = m._4;
            continue;
          }
          down$a0 = $List("Cons", $TreeContext("ThreeRight", m._1, m._2, m._3, m._4, m._5, m._6), ctx);
          down$a1 = m._7;
          continue;
        }
        fail();
      }
      return down$r;
    };
    return down(Nil);
  };
  var foldableMap = {
    foldr: (f) => (z) => (m) => {
      if (m.tag === "Leaf") {
        return z;
      }
      if (m.tag === "Two") {
        return foldableMap.foldr(f)(f(m._3)(foldableMap.foldr(f)(z)(m._4)))(m._1);
      }
      if (m.tag === "Three") {
        return foldableMap.foldr(f)(f(m._3)(foldableMap.foldr(f)(f(m._6)(foldableMap.foldr(f)(z)(m._7)))(m._4)))(m._1);
      }
      fail();
    },
    foldl: (f) => (z) => (m) => {
      if (m.tag === "Leaf") {
        return z;
      }
      if (m.tag === "Two") {
        return foldableMap.foldl(f)(f(foldableMap.foldl(f)(z)(m._1))(m._3))(m._4);
      }
      if (m.tag === "Three") {
        return foldableMap.foldl(f)(f(foldableMap.foldl(f)(f(foldableMap.foldl(f)(z)(m._1))(m._3))(m._4))(m._6))(m._7);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f) => (m) => {
        if (m.tag === "Leaf") {
          return mempty;
        }
        if (m.tag === "Two") {
          return $0.append(foldableMap.foldMap(dictMonoid)(f)(m._1))($0.append(f(m._3))(foldableMap.foldMap(dictMonoid)(f)(m._4)));
        }
        if (m.tag === "Three") {
          return $0.append(foldableMap.foldMap(dictMonoid)(f)(m._1))($0.append(f(m._3))($0.append(foldableMap.foldMap(dictMonoid)(f)(m._4))($0.append(f(m._6))(foldableMap.foldMap(dictMonoid)(f)(m._7)))));
        }
        fail();
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: (f) => (z) => (m) => {
      if (m.tag === "Leaf") {
        return z;
      }
      if (m.tag === "Two") {
        return foldableWithIndexMap.foldrWithIndex(f)(f(m._2)(m._3)(foldableWithIndexMap.foldrWithIndex(f)(z)(m._4)))(m._1);
      }
      if (m.tag === "Three") {
        return foldableWithIndexMap.foldrWithIndex(f)(f(m._2)(m._3)(foldableWithIndexMap.foldrWithIndex(f)(f(m._5)(m._6)(foldableWithIndexMap.foldrWithIndex(f)(z)(m._7)))(m._4)))(m._1);
      }
      fail();
    },
    foldlWithIndex: (f) => (z) => (m) => {
      if (m.tag === "Leaf") {
        return z;
      }
      if (m.tag === "Two") {
        return foldableWithIndexMap.foldlWithIndex(f)(f(m._2)(foldableWithIndexMap.foldlWithIndex(f)(z)(m._1))(m._3))(m._4);
      }
      if (m.tag === "Three") {
        return foldableWithIndexMap.foldlWithIndex(f)(f(m._5)(foldableWithIndexMap.foldlWithIndex(f)(f(m._2)(foldableWithIndexMap.foldlWithIndex(f)(z)(m._1))(m._3))(m._4))(m._6))(m._7);
      }
      fail();
    },
    foldMapWithIndex: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f) => (m) => {
        if (m.tag === "Leaf") {
          return mempty;
        }
        if (m.tag === "Two") {
          return $0.append(foldableWithIndexMap.foldMapWithIndex(dictMonoid)(f)(m._1))($0.append(f(m._2)(m._3))(foldableWithIndexMap.foldMapWithIndex(dictMonoid)(f)(m._4)));
        }
        if (m.tag === "Three") {
          return $0.append(foldableWithIndexMap.foldMapWithIndex(dictMonoid)(f)(m._1))($0.append(f(m._2)(m._3))($0.append(foldableWithIndexMap.foldMapWithIndex(dictMonoid)(f)(m._4))($0.append(f(m._5)(m._6))(foldableWithIndexMap.foldMapWithIndex(dictMonoid)(f)(m._7)))));
        }
        fail();
      };
    },
    Foldable0: () => foldableMap
  };
  var traversableMap = {
    traverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      const $0 = Apply0.Functor0();
      return (v) => (v1) => {
        if (v1.tag === "Leaf") {
          return dictApplicative.pure(Leaf2);
        }
        if (v1.tag === "Two") {
          return Apply0.apply(Apply0.apply(Apply0.apply($0.map(Two)(traversableMap.traverse(dictApplicative)(v)(v1._1)))(dictApplicative.pure(v1._2)))(v(v1._3)))(traversableMap.traverse(dictApplicative)(v)(v1._4));
        }
        if (v1.tag === "Three") {
          return Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply($0.map(Three)(traversableMap.traverse(dictApplicative)(v)(v1._1)))(dictApplicative.pure(v1._2)))(v(v1._3)))(traversableMap.traverse(dictApplicative)(v)(v1._4)))(dictApplicative.pure(v1._5)))(v(v1._6)))(traversableMap.traverse(dictApplicative)(v)(v1._7));
        }
        fail();
      };
    },
    sequence: (dictApplicative) => traversableMap.traverse(dictApplicative)(identity9),
    Functor0: () => functorMap,
    Foldable1: () => foldableMap
  };
  var traversableWithIndexMap = {
    traverseWithIndex: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      const $0 = Apply0.Functor0();
      return (v) => (v1) => {
        if (v1.tag === "Leaf") {
          return dictApplicative.pure(Leaf2);
        }
        if (v1.tag === "Two") {
          return Apply0.apply(Apply0.apply(Apply0.apply($0.map(Two)(traversableWithIndexMap.traverseWithIndex(dictApplicative)(v)(v1._1)))(dictApplicative.pure(v1._2)))(v(v1._2)(v1._3)))(traversableWithIndexMap.traverseWithIndex(dictApplicative)(v)(v1._4));
        }
        if (v1.tag === "Three") {
          return Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply(Apply0.apply($0.map(Three)(traversableWithIndexMap.traverseWithIndex(dictApplicative)(v)(v1._1)))(dictApplicative.pure(v1._2)))(v(v1._2)(v1._3)))(traversableWithIndexMap.traverseWithIndex(dictApplicative)(v)(v1._4)))(dictApplicative.pure(v1._5)))(v(v1._5)(v1._6)))(traversableWithIndexMap.traverseWithIndex(dictApplicative)(v)(v1._7));
        }
        fail();
      };
    },
    FunctorWithIndex0: () => functorWithIndexMap,
    FoldableWithIndex1: () => foldableWithIndexMap,
    Traversable2: () => traversableMap
  };
  var foldSubmapBy = (dictOrd) => (appendFn) => (memptyValue) => (kmin) => (kmax) => (f) => {
    const tooSmall = (() => {
      if (kmin.tag === "Just") {
        const $0 = kmin._1;
        return (k) => dictOrd.compare(k)($0) === "LT";
      }
      if (kmin.tag === "Nothing") {
        return (v) => false;
      }
      fail();
    })();
    const tooLarge = (() => {
      if (kmax.tag === "Just") {
        const $0 = kmax._1;
        return (k) => dictOrd.compare(k)($0) === "GT";
      }
      if (kmax.tag === "Nothing") {
        return (v) => false;
      }
      fail();
    })();
    const inBounds = (() => {
      if (kmin.tag === "Just") {
        if (kmax.tag === "Just") {
          const $0 = kmax._1;
          const $1 = kmin._1;
          return (k) => dictOrd.compare($1)(k) !== "GT" && dictOrd.compare(k)($0) !== "GT";
        }
        if (kmax.tag === "Nothing") {
          const $0 = kmin._1;
          return (k) => dictOrd.compare($0)(k) !== "GT";
        }
        fail();
      }
      if (kmin.tag === "Nothing") {
        if (kmax.tag === "Just") {
          const $0 = kmax._1;
          return (k) => dictOrd.compare(k)($0) !== "GT";
        }
        if (kmax.tag === "Nothing") {
          return (v) => true;
        }
      }
      fail();
    })();
    const go = (v) => {
      if (v.tag === "Leaf") {
        return memptyValue;
      }
      if (v.tag === "Two") {
        return appendFn(appendFn(tooSmall(v._2) ? memptyValue : go(v._1))(inBounds(v._2) ? f(v._2)(v._3) : memptyValue))(tooLarge(v._2) ? memptyValue : go(v._4));
      }
      if (v.tag === "Three") {
        return appendFn(appendFn(appendFn(appendFn(tooSmall(v._2) ? memptyValue : go(v._1))(inBounds(v._2) ? f(v._2)(v._3) : memptyValue))(tooSmall(v._5) || tooLarge(v._2) ? memptyValue : go(v._4)))(inBounds(v._5) ? f(v._5)(v._6) : memptyValue))(tooLarge(v._5) ? memptyValue : go(v._7));
      }
      fail();
    };
    return go;
  };
  var eqMap = (dictEq) => (dictEq1) => {
    const eq12 = eqArrayImpl((x3) => (y3) => dictEq.eq(x3._1)(y3._1) && dictEq1.eq(x3._2)(y3._2));
    return { eq: (m1) => (m2) => eq12(toUnfoldable(unfoldableArray)(m1))(toUnfoldable(unfoldableArray)(m2)) };
  };
  var ordMap = (dictOrd) => {
    const ordTuple3 = ordTuple(dictOrd);
    const eqMap1 = eqMap(dictOrd.Eq0());
    return (dictOrd1) => {
      const eqMap2 = eqMap1(dictOrd1.Eq0());
      return {
        compare: (m1) => (m2) => ordArray(ordTuple3(dictOrd1)).compare(toUnfoldable(unfoldableArray)(m1))(toUnfoldable(unfoldableArray)(m2)),
        Eq0: () => eqMap2
      };
    };
  };
  var fromFoldable = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m) => (v) => insert(dictOrd)(v._1)(v._2)(m))(Leaf2);
  var filterWithKey = (dictOrd) => {
    const fromFoldable15 = fromFoldable(dictOrd)(foldableList2);
    return (predicate) => {
      const $0 = filter((v) => predicate(v._1)(v._2));
      return (x3) => fromFoldable15($0(toUnfoldable(unfoldableList)(x3)));
    };
  };
  var filterKeys = (dictOrd) => {
    const filterWithKey1 = filterWithKey(dictOrd);
    return (predicate) => filterWithKey1((x3) => {
      const $0 = predicate(x3);
      return (v) => $0;
    });
  };
  var mapMaybeWithKey = (dictOrd) => (f) => foldableWithIndexMap.foldrWithIndex((k) => (a) => (acc) => {
    const $0 = f(k)(a);
    if ($0.tag === "Nothing") {
      return acc;
    }
    if ($0.tag === "Just") {
      return insert(dictOrd)(k)($0._1)(acc);
    }
    fail();
  })(Leaf2);
  var mapMaybe = (dictOrd) => (x3) => mapMaybeWithKey(dictOrd)((v) => x3);
  var $$delete = (dictOrd) => (k) => (m) => {
    const $0 = pop(dictOrd)(k)(m);
    if ($0.tag === "Nothing") {
      return m;
    }
    if ($0.tag === "Just") {
      return $0._1._2;
    }
    fail();
  };
  var catMaybes = (dictOrd) => mapMaybe(dictOrd)(identity9);
  var alter = (dictOrd) => (f) => (k) => (m) => {
    const v = f(lookup(dictOrd)(k)(m));
    if (v.tag === "Nothing") {
      return $$delete(dictOrd)(k)(m);
    }
    if (v.tag === "Just") {
      return insert(dictOrd)(k)(v._1)(m);
    }
    fail();
  };
  var unionWith = (dictOrd) => (f) => (m1) => (m2) => foldableWithIndexMap.foldlWithIndex((k) => (m) => (v) => alter(dictOrd)((() => {
    const $0 = f(v);
    return (x3) => $Maybe(
      "Just",
      (() => {
        if (x3.tag === "Nothing") {
          return v;
        }
        if (x3.tag === "Just") {
          return $0(x3._1);
        }
        fail();
      })()
    );
  })())(k)(m))(m2)(m1);
  var union = (dictOrd) => unionWith(dictOrd)($$const);
  var update = (dictOrd) => (f) => (k) => (m) => alter(dictOrd)((v2) => {
    if (v2.tag === "Nothing") {
      return Nothing;
    }
    if (v2.tag === "Just") {
      return f(v2._1);
    }
    fail();
  })(k)(m);

  // output-es/Halogen.Data.OrdBox/index.js
  var $OrdBox = (_1, _2, _3) => ({ tag: "OrdBox", _1, _2, _3 });
  var OrdBox = (value0) => (value1) => (value2) => $OrdBox(value0, value1, value2);
  var eqOrdBox = { eq: (v) => (v1) => v._1(v._3)(v1._3) };
  var ordOrdBox = { compare: (v) => (v1) => v._2(v._3)(v1._3), Eq0: () => eqOrdBox };

  // output-es/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => pop(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var lookup2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => lookup(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var insert2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (val) => (v) => insert(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(val)(v);
  };
  var foreachSlot = (dictApplicative) => {
    const traverse_17 = traverse_(dictApplicative)(foldableMap);
    return (v) => (k) => traverse_17((x3) => k(x3))(v);
  };

  // output-es/Data.String.Common/foreign.js
  var replaceAll = function(s1) {
    return function(s2) {
      return function(s3) {
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
      };
    };
  };
  var split = function(sep) {
    return function(s) {
      return s.split(sep);
    };
  };
  var toLower = function(s) {
    return s.toLowerCase();
  };
  var toUpper = function(s) {
    return s.toUpperCase();
  };
  var joinWith = function(s) {
    return function(xs) {
      return xs.join(s);
    };
  };

  // output-es/Halogen.Query.Input/index.js
  var $Input = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }
  function notNull(x3) {
    return x3;
  }

  // output-es/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y3) {
    return function(x3) {
      return Math.atan2(y3, x3);
    };
  };
  var round = Math.round;

  // output-es/Data.Int/foreign.js
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
  var fromStringAsImpl = function(just) {
    return function(nothing) {
      return function(radix) {
        var digits;
        if (radix < 11) {
          digits = "[0-" + (radix - 1).toString() + "]";
        } else if (radix === 11) {
          digits = "[0-9a]";
        } else {
          digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
        }
        var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
        return function(s) {
          if (pattern.test(s)) {
            var i = parseInt(s, radix);
            return (i | 0) === i ? just(i) : nothing;
          } else {
            return nothing;
          }
        };
      };
    };
  };
  var toStringAs = function(radix) {
    return function(i) {
      return i.toString(radix);
    };
  };

  // output-es/Data.Int/index.js
  var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
  var fromString = /* @__PURE__ */ fromStringAs(10);
  var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
  var unsafeClamp = (x3) => {
    if (!isFiniteImpl(x3)) {
      return 0;
    }
    if (x3 >= toNumber(2147483647)) {
      return 2147483647;
    }
    if (x3 <= toNumber(-2147483648)) {
      return -2147483648;
    }
    const $0 = fromNumber(x3);
    if ($0.tag === "Nothing") {
      return 0;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Data.String.Unsafe/foreign.js
  var charAt = function(i) {
    return function(s) {
      if (i >= 0 && i < s.length)
        return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output-es/Data.String.CodeUnits/foreign.js
  var fromCharArray = function(a) {
    return a.join("");
  };
  var length = function(s) {
    return s.length;
  };
  var _indexOf = function(just) {
    return function(nothing) {
      return function(x3) {
        return function(s) {
          var i = s.indexOf(x3);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
  var take = function(n) {
    return function(s) {
      return s.substr(0, n);
    };
  };
  var drop = function(n) {
    return function(s) {
      return s.substring(n);
    };
  };
  var splitAt = function(i) {
    return function(s) {
      return { before: s.substring(0, i), after: s.substring(i) };
    };
  };

  // output-es/Data.String.CodeUnits/index.js
  var stripPrefix = (v) => (str2) => {
    const v1 = splitAt(length(v))(str2);
    if (v1.before === v) {
      return $Maybe("Just", v1.after);
    }
    return Nothing;
  };
  var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);

  // output-es/Foreign/foreign.js
  function typeOf(value2) {
    return typeof value2;
  }
  var isArray = Array.isArray || function(value2) {
    return Object.prototype.toString.call(value2) === "[object Array]";
  };

  // output-es/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn2 = function runSTFn22(fn) {
    return function(a) {
      return function(b) {
        return function() {
          return fn(a, b);
        };
      };
    };
  };

  // output-es/Data.Array.ST/foreign.js
  var pushAllImpl = function(as2, xs) {
    return xs.push.apply(xs, as2);
  };
  var sortByImpl = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x3;
      var y3;
      var c;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x3 = xs2[i];
        y3 = xs2[j];
        c = fromOrdering(compare(x3)(y3));
        if (c > 0) {
          xs1[k++] = y3;
          ++j;
        } else {
          xs1[k++] = x3;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare, fromOrdering, xs) {
      if (xs.length < 2)
        return xs;
      mergeFromTo(compare, fromOrdering, xs, xs.slice(0), 0, xs.length);
      return xs;
    };
  }();

  // output-es/Data.Array.ST/index.js
  var push = (a) => runSTFn2(pushAllImpl)([a]);

  // output-es/Data.Array.ST.Iterator/index.js
  var $Iterator = (_1, _2) => ({ tag: "Iterator", _1, _2 });
  var iterate = (iter) => (f) => () => {
    let $$break = false;
    const $0 = iter._2;
    while ((() => {
      const $1 = $$break;
      return !$1;
    })()) {
      const i = $0.value;
      const $1 = $0.value;
      $0.value = $1 + 1 | 0;
      const mx = iter._1(i);
      if (mx.tag === "Just") {
        f(mx._1)();
        continue;
      }
      if (mx.tag === "Nothing") {
        $$break = true;
        continue;
      }
      fail();
    }
  };

  // output-es/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // output-es/Data.FunctorWithIndex/index.js
  var functorWithIndexArray = { mapWithIndex: mapWithIndexArray, Functor0: () => functorArray };

  // output-es/Data.Array/foreign.js
  var rangeImpl = function(start, end3) {
    var step2 = start > end3 ? -1 : 1;
    var result = new Array(step2 * (end3 - start) + 1);
    var i = start, n = 0;
    while (i !== end3) {
      result[n++] = i;
      i += step2;
    }
    result[n] = i;
    return result;
  };
  var replicateFill = function(count, value2) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value2);
  };
  var replicatePolyfill = function(count, value2) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value2;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons2(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};
    function curryCons(head) {
      return function(tail) {
        return new Cons2(head, tail);
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
    return function(foldr2, xs) {
      return listToArray(foldr2(curryCons)(emptyList)(xs));
    };
  }();
  var unconsImpl = function(empty2, next, xs) {
    return xs.length === 0 ? empty2({}) : next(xs[0])(xs.slice(1));
  };
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (f(xs[i]))
        return just(i);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i, l) {
    if (i < 0 || i >= l.length)
      return nothing;
    var l1 = l.slice();
    l1.splice(i, 1);
    return just(l1);
  };
  var reverse2 = function(l) {
    return l.slice().reverse();
  };
  var concat = function(xss) {
    if (xss.length <= 1e4) {
      return Array.prototype.concat.apply([], xss);
    }
    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
  var filterImpl = function(f, xs) {
    return xs.filter(f);
  };
  var partitionImpl = function(f, xs) {
    var yes = [];
    var no = [];
    for (var i = 0; i < xs.length; i++) {
      var x3 = xs[i];
      if (f(x3))
        yes.push(x3);
      else
        no.push(x3);
    }
    return { yes, no };
  };
  var sortByImpl2 = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x3;
      var y3;
      var c;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x3 = xs2[i];
        y3 = xs2[j];
        c = fromOrdering(compare(x3)(y3));
        if (c > 0) {
          xs1[k++] = y3;
          ++j;
        } else {
          xs1[k++] = x3;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare, fromOrdering, xs) {
      var out;
      if (xs.length < 2)
        return xs;
      out = xs.slice(0);
      mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
      return out;
    };
  }();
  var sliceImpl = function(s, e, l) {
    return l.slice(s, e);
  };
  var zipWithImpl = function(f, xs, ys) {
    var l = xs.length < ys.length ? xs.length : ys.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(xs[i])(ys[i]);
    }
    return result;
  };

  // output-es/Data.Array/index.js
  var intercalate1 = (dictMonoid) => {
    const $0 = dictMonoid.Semigroup0();
    const mempty = dictMonoid.mempty;
    return (sep) => (xs) => foldlArray((v) => (v1) => {
      if (v.init) {
        return { init: false, acc: v1 };
      }
      return { init: false, acc: $0.append(v.acc)($0.append(sep)(v1)) };
    })({ init: true, acc: mempty })(xs).acc;
  };
  var zipWith = ($0) => ($1) => ($2) => zipWithImpl($0, $1, $2);
  var toUnfoldable2 = (dictUnfoldable) => (xs) => {
    const len = xs.length;
    return dictUnfoldable.unfoldr((i) => {
      if (i < len) {
        return $Maybe("Just", $Tuple(xs[i], i + 1 | 0));
      }
      return Nothing;
    })(0);
  };
  var sortBy = (comp) => ($0) => sortByImpl2(
    comp,
    (v) => {
      if (v === "GT") {
        return 1;
      }
      if (v === "EQ") {
        return 0;
      }
      if (v === "LT") {
        return -1;
      }
      fail();
    },
    $0
  );
  var sortWith = (dictOrd) => (f) => sortBy((x3) => (y3) => dictOrd.compare(f(x3))(f(y3)));
  var snoc2 = (xs) => (x3) => (() => {
    const $0 = push(x3);
    return () => {
      const result = [...xs];
      $0(result)();
      return result;
    };
  })()();
  var partition = ($0) => ($1) => partitionImpl($0, $1);
  var intersperse = (a) => (arr) => {
    const v = arr.length;
    if (v < 2) {
      return arr;
    }
    const out = [];
    out.push(arr[0]);
    for (const idx of range(1, v)) {
      out.push(a);
      out.push(arr[idx]);
    }
    return out;
  };
  var last = (xs) => {
    const $0 = xs.length - 1 | 0;
    if ($0 >= 0 && $0 < xs.length) {
      return $Maybe("Just", xs[$0]);
    }
    return Nothing;
  };
  var nubBy2 = (comp) => (xs) => {
    const indexedAndSorted = sortBy((x3) => (y3) => comp(x3._2)(y3._2))(mapWithIndexArray(Tuple)(xs));
    if (0 < indexedAndSorted.length) {
      return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
        const result = [indexedAndSorted[0]];
        for (const v1 of indexedAndSorted) {
          const $0 = comp((() => {
            const $02 = last(result);
            if ($02.tag === "Just") {
              return $02._1._2;
            }
            fail();
          })())(v1._2);
          if ($0 === "LT" || $0 === "GT" || $0 !== "EQ") {
            result.push(v1);
          }
        }
        return result;
      })()));
    }
    return [];
  };
  var find2 = (f) => (xs) => {
    const $0 = findIndexImpl(Just, Nothing, f, xs);
    if ($0.tag === "Just") {
      return $Maybe("Just", xs[$0._1]);
    }
    return Nothing;
  };
  var filter2 = ($0) => ($1) => filterImpl($0, $1);
  var elem = (dictEq) => (a) => (arr) => {
    const $0 = findIndexImpl(Just, Nothing, (v) => dictEq.eq(v)(a), arr);
    if ($0.tag === "Nothing") {
      return false;
    }
    if ($0.tag === "Just") {
      return true;
    }
    fail();
  };
  var deleteBy2 = (v) => (v1) => (v2) => {
    if (v2.length === 0) {
      return [];
    }
    const $0 = findIndexImpl(Just, Nothing, v(v1), v2);
    if ($0.tag === "Nothing") {
      return v2;
    }
    if ($0.tag === "Just") {
      const $1 = _deleteAt(Just, Nothing, $0._1, v2);
      if ($1.tag === "Just") {
        return $1._1;
      }
    }
    fail();
  };
  var cons2 = (x3) => (xs) => [x3, ...xs];
  var concatMap = (b) => (a) => arrayBind(a)(b);
  var mapMaybe2 = (f) => concatMap((x3) => {
    const $0 = f(x3);
    if ($0.tag === "Nothing") {
      return [];
    }
    if ($0.tag === "Just") {
      return [$0._1];
    }
    fail();
  });

  // output-es/Data.FoldableWithIndex/index.js
  var traverseWithIndex_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldableWithIndex) => (f) => dictFoldableWithIndex.foldrWithIndex((i) => {
      const $1 = f(i);
      return (x3) => {
        const $2 = $1(x3);
        return (b) => $0.apply($0.Functor0().map((v) => identity)($2))(b);
      };
    })(dictApplicative.pure());
  };
  var forWithIndex_ = (dictApplicative) => {
    const traverseWithIndex_1 = traverseWithIndex_(dictApplicative);
    return (dictFoldableWithIndex) => {
      const $0 = traverseWithIndex_1(dictFoldableWithIndex);
      return (b) => (a) => $0(a)(b);
    };
  };
  var foldableWithIndexArray = {
    foldrWithIndex: (f) => (z) => {
      const $0 = foldrArray((v) => {
        const $02 = v._1;
        const $12 = v._2;
        return (y3) => f($02)($12)(y3);
      })(z);
      const $1 = mapWithIndexArray(Tuple);
      return (x3) => $0($1(x3));
    },
    foldlWithIndex: (f) => (z) => {
      const $0 = foldlArray((y3) => (v) => f(v._1)(y3)(v._2))(z);
      const $1 = mapWithIndexArray(Tuple);
      return (x3) => $0($1(x3));
    },
    foldMapWithIndex: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableWithIndexArray.foldrWithIndex((i) => (x3) => (acc) => dictMonoid.Semigroup0().append(f(i)(x3))(acc))(mempty);
    },
    Foldable0: () => foldableArray
  };
  var findWithIndex = (dictFoldableWithIndex) => (p) => dictFoldableWithIndex.foldlWithIndex((v) => (v1) => (v2) => {
    if (v1.tag === "Nothing" && p(v)(v2)) {
      return $Maybe("Just", { index: v, value: v2 });
    }
    return v1;
  })(Nothing);

  // output-es/Foreign.Object/foreign.js
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
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output-es/Halogen.VDom.Machine/index.js
  var $Step$p = (_1, _2, _3, _4) => ({ tag: "Step", _1, _2, _3, _4 });
  var step = (v, $0) => {
    const $1 = v._2;
    return v._3($1, $0);
  };
  var halt = (v) => {
    const $0 = v._2;
    return v._4($0);
  };

  // output-es/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key2, obj) {
    return obj[key2];
  }
  function unsafeHasAny(key2, obj) {
    return obj.hasOwnProperty(key2);
  }
  function unsafeSetAny(key2, val, obj) {
    obj[key2] = val;
  }
  function forE2(a, f) {
    var b = [];
    for (var i = 0; i < a.length; i++) {
      b.push(f(i, a[i]));
    }
    return b;
  }
  function forEachE(a, f) {
    for (var i = 0; i < a.length; i++) {
      f(a[i]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i = 0;
    while (1) {
      if (i < l1) {
        if (i < l2) {
          a3.push(f1(i, a1[i], a2[i]));
        } else {
          f2(i, a1[i]);
        }
      } else if (i < l2) {
        a3.push(f3(i, a2[i]));
      } else {
        break;
      }
      i++;
    }
    return a3;
  }
  function strMapWithIxE(as2, fk, f) {
    var o = {};
    for (var i = 0; i < as2.length; i++) {
      var a = as2[i];
      var k = fk(a);
      o[k] = f(k, i, a);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as2, fk, f1, f2, f3) {
    var o2 = {};
    for (var i = 0; i < as2.length; i++) {
      var a = as2[i];
      var k = fk(a);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i, o1[k], a);
      } else {
        o2[k] = f3(k, i, a);
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
  function refEq2(a, b) {
    return a === b;
  }
  function createTextNode(s, doc) {
    return doc.createTextNode(s);
  }
  function setTextContent(s, n) {
    n.textContent = s;
  }
  function createElement(ns, name2, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name2);
    } else {
      return doc.createElement(name2);
    }
  }
  function insertChildIx(i, a, b) {
    var n = b.childNodes.item(i) || null;
    if (n !== a) {
      b.insertBefore(a, n);
    }
  }
  function removeChild(a, b) {
    if (b && a.parentNode === b) {
      b.removeChild(a);
    }
  }
  function parentNode(a) {
    return a.parentNode;
  }
  function setAttribute(ns, attr2, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr2, val);
    } else {
      el.setAttribute(attr2, val);
    }
  }
  function removeAttribute(ns, attr2, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr2);
    } else {
      el.removeAttribute(attr2);
    }
  }
  function hasAttribute(ns, attr2, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr2);
    } else {
      return el.hasAttribute(attr2);
    }
  }
  function addEventListener(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output-es/Web.Event.EventTarget/foreign.js
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
        return function(target) {
          return function() {
            return target.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target) {
          return function() {
            return target.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output-es/Halogen.VDom.DOM.Prop/index.js
  var $ElemRef = (tag, _1) => ({ tag, _1 });
  var $Prop = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var Attribute = (value0) => (value1) => (value2) => $Prop("Attribute", value0, value1, value2);
  var Property = (value0) => (value1) => $Prop("Property", value0, value1);
  var removeProperty = (key2, el) => {
    const v = hasAttribute(nullImpl, key2, el);
    if (v) {
      return removeAttribute(nullImpl, key2, el);
    }
    if (typeOf(unsafeGetAny(key2, el)) === "string") {
      return unsafeSetAny(key2, "", el);
    }
    if (key2 === "rowSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    if (key2 === "colSpan") {
      return unsafeSetAny(key2, 1, el);
    }
    return unsafeSetAny(key2, jsUndefined, el);
  };
  var propToStrKey = (v) => {
    if (v.tag === "Attribute") {
      if (v._1.tag === "Just") {
        return "attr/" + v._1._1 + ":" + v._2;
      }
      return "attr/:" + v._2;
    }
    if (v.tag === "Property") {
      return "prop/" + v._1;
    }
    if (v.tag === "Handler") {
      return "handler/" + v._1;
    }
    if (v.tag === "Ref") {
      return "ref";
    }
    fail();
  };
  var functorProp = {
    map: (v) => (v1) => {
      if (v1.tag === "Handler") {
        return $Prop(
          "Handler",
          v1._1,
          (x3) => {
            const $0 = v1._2(x3);
            if ($0.tag === "Just") {
              return $Maybe("Just", v($0._1));
            }
            return Nothing;
          }
        );
      }
      if (v1.tag === "Ref") {
        return $Prop(
          "Ref",
          (x3) => {
            const $0 = v1._1(x3);
            if ($0.tag === "Just") {
              return $Maybe("Just", v($0._1));
            }
            return Nothing;
          }
        );
      }
      return v1;
    }
  };
  var buildProp = (emit) => (el) => {
    const haltProp = (state) => {
      const v = _lookup(Nothing, Just, "ref", state.props);
      if (v.tag === "Just" && v._1.tag === "Ref") {
        const $0 = v._1._1($ElemRef("Removed", el));
        if ($0.tag === "Just") {
          return emit($0._1)();
        }
      }
    };
    const applyProp = (events) => (v, v1, v2) => {
      if (v2.tag === "Attribute") {
        const $0 = v2._2;
        const $1 = v2._3;
        const $2 = (() => {
          if (v2._1.tag === "Nothing") {
            return nullImpl;
          }
          if (v2._1.tag === "Just") {
            return notNull(v2._1._1);
          }
          fail();
        })();
        setAttribute($2, $0, $1, el);
        return v2;
      }
      if (v2.tag === "Property") {
        const $0 = v2._1;
        const $1 = v2._2;
        unsafeSetAny($0, $1, el);
        return v2;
      }
      if (v2.tag === "Handler") {
        if (unsafeHasAny(v2._1, events)) {
          const $0 = unsafeGetAny(v2._1, events)._2;
          $0.value = v2._2;
          return v2;
        }
        const ref = { value: v2._2 };
        const listener = eventListener((ev) => () => {
          const f$p = ref.value;
          const $0 = f$p(ev);
          if ($0.tag === "Just") {
            return emit($0._1)();
          }
        })();
        unsafeSetAny(v2._1, $Tuple(listener, ref), events);
        addEventListener(v2._1, listener, el);
        return v2;
      }
      if (v2.tag === "Ref") {
        const $0 = v2._1($ElemRef("Created", el));
        if ($0.tag === "Just") {
          emit($0._1)();
        }
        return v2;
      }
      fail();
    };
    const patchProp = (state, ps2) => {
      const events = {};
      const $0 = state.events;
      const props = diffWithKeyAndIxE(
        state.props,
        ps2,
        propToStrKey,
        (v, v1, v11, v2) => {
          if (v11.tag === "Attribute") {
            if (v2.tag === "Attribute") {
              if (v11._3 === v2._3) {
                return v2;
              }
              const $1 = (() => {
                if (v2._1.tag === "Nothing") {
                  return nullImpl;
                }
                if (v2._1.tag === "Just") {
                  return notNull(v2._1._1);
                }
                fail();
              })();
              setAttribute($1, v2._2, v2._3, el);
            }
            return v2;
          }
          if (v11.tag === "Property") {
            if (v2.tag === "Property") {
              if (refEq2(v11._2, v2._2)) {
                return v2;
              }
              if (v2._1 === "value" && refEq2(unsafeGetAny("value", el), v2._2)) {
                return v2;
              }
              unsafeSetAny(v2._1, v2._2, el);
            }
            return v2;
          }
          if (v11.tag === "Handler" && v2.tag === "Handler") {
            const $1 = v2._2;
            const $2 = v2._1;
            const handler = unsafeGetAny($2, $0);
            const $3 = handler._2;
            $3.value = $1;
            unsafeSetAny($2, handler, events);
          }
          return v2;
        },
        (v, v1) => {
          if (v1.tag === "Attribute") {
            const $1 = v1._2;
            const $2 = (() => {
              if (v1._1.tag === "Nothing") {
                return nullImpl;
              }
              if (v1._1.tag === "Just") {
                return notNull(v1._1._1);
              }
              fail();
            })();
            return removeAttribute($2, $1, el);
          }
          if (v1.tag === "Property") {
            const $1 = v1._1;
            return removeProperty($1, el);
          }
          if (v1.tag === "Handler") {
            const $1 = v1._1;
            const $2 = unsafeGetAny($1, $0)._1;
            return removeEventListener($1, $2, el);
          }
          if (v1.tag === "Ref") {
            return;
          }
          fail();
        },
        applyProp(events)
      );
      return $Step$p(void 0, { events, props }, patchProp, haltProp);
    };
    return (ps1) => {
      const events = {};
      const ps1$p = strMapWithIxE(ps1, propToStrKey, applyProp(events));
      return $Step$p(void 0, { events, props: ps1$p }, patchProp, haltProp);
    };
  };

  // output-es/Halogen.VDom.Types/index.js
  var $GraftX = (_1, _2, _3) => ({ tag: "Graft", _1, _2, _3 });
  var $VDom = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var runGraft = (x3) => {
    const go = (v2) => {
      if (v2.tag === "Text") {
        return $VDom("Text", v2._1);
      }
      if (v2.tag === "Elem") {
        return $VDom("Elem", v2._1, v2._2, x3._1(v2._3), arrayMap(go)(v2._4));
      }
      if (v2.tag === "Keyed") {
        return $VDom("Keyed", v2._1, v2._2, x3._1(v2._3), arrayMap((m) => $Tuple(m._1, go(m._2)))(v2._4));
      }
      if (v2.tag === "Widget") {
        return $VDom("Widget", x3._2(v2._1));
      }
      if (v2.tag === "Grafted") {
        const $0 = v2._1;
        return $VDom("Grafted", $GraftX((x$1) => x3._1($0._1(x$1)), (x$1) => x3._2($0._2(x$1)), $0._3));
      }
      fail();
    };
    return go(x3._3);
  };

  // output-es/Halogen.HTML.Core/index.js
  var bifunctorHTML = {
    bimap: (f) => (g) => (v) => {
      const $0 = arrayMap(functorProp.map((m) => {
        if (m.tag === "RefUpdate") {
          return $Input("RefUpdate", m._1, m._2);
        }
        if (m.tag === "Action") {
          return $Input("Action", g(m._1));
        }
        fail();
      }));
      if (v.tag === "Text") {
        return $VDom("Text", v._1);
      }
      if (v.tag === "Grafted") {
        const $1 = v._1;
        return $VDom("Grafted", $GraftX((x3) => $0($1._1(x3)), (x3) => f($1._2(x3)), $1._3));
      }
      return $VDom("Grafted", $GraftX($0, f, v));
    }
  };

  // output-es/Control.Applicative.Free/index.js
  var $FreeAp = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity10 = (x3) => x3;
  var Pure = (value0) => $FreeAp("Pure", value0);
  var goLeft = (goLeft$a0$copy) => (goLeft$a1$copy) => (goLeft$a2$copy) => (goLeft$a3$copy) => (goLeft$a4$copy) => (goLeft$a5$copy) => {
    let goLeft$a0 = goLeft$a0$copy;
    let goLeft$a1 = goLeft$a1$copy;
    let goLeft$a2 = goLeft$a2$copy;
    let goLeft$a3 = goLeft$a3$copy;
    let goLeft$a4 = goLeft$a4$copy;
    let goLeft$a5 = goLeft$a5$copy;
    let goLeft$c = true;
    let goLeft$r;
    while (goLeft$c) {
      const dictApplicative = goLeft$a0, fStack = goLeft$a1, valStack = goLeft$a2, nat = goLeft$a3, func = goLeft$a4, count = goLeft$a5;
      if (func.tag === "Pure") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: dictApplicative.pure(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Lift") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: nat(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Ap") {
        goLeft$a0 = dictApplicative;
        goLeft$a1 = fStack;
        goLeft$a2 = $NonEmpty(func._2, $List("Cons", valStack._1, valStack._2));
        goLeft$a3 = nat;
        goLeft$a4 = func._1;
        goLeft$a5 = count + 1 | 0;
        continue;
      }
      fail();
    }
    return goLeft$r;
  };
  var goApply = (goApply$a0$copy) => (goApply$a1$copy) => (goApply$a2$copy) => (goApply$a3$copy) => {
    let goApply$a0 = goApply$a0$copy, goApply$a1 = goApply$a1$copy, goApply$a2 = goApply$a2$copy, goApply$a3 = goApply$a3$copy, goApply$c = true, goApply$r;
    while (goApply$c) {
      const dictApplicative = goApply$a0, fStack = goApply$a1, vals = goApply$a2, gVal = goApply$a3;
      if (fStack.tag === "Nil") {
        goApply$c = false;
        goApply$r = $Either("Left", gVal);
        continue;
      }
      if (fStack.tag === "Cons") {
        const gRes = dictApplicative.Apply0().apply(fStack._1.func)(gVal);
        if (fStack._1.count === 1) {
          if (fStack._2.tag === "Nil") {
            goApply$c = false;
            goApply$r = $Either("Left", gRes);
            continue;
          }
          goApply$a0 = dictApplicative;
          goApply$a1 = fStack._2;
          goApply$a2 = vals;
          goApply$a3 = gRes;
          continue;
        }
        if (vals.tag === "Nil") {
          goApply$c = false;
          goApply$r = $Either("Left", gRes);
          continue;
        }
        if (vals.tag === "Cons") {
          goApply$c = false;
          goApply$r = $Either(
            "Right",
            $Tuple($List("Cons", { func: gRes, count: fStack._1.count - 1 | 0 }, fStack._2), $NonEmpty(vals._1, vals._2))
          );
          continue;
        }
      }
      fail();
    }
    return goApply$r;
  };
  var functorFreeAp = { map: (f) => (x3) => $FreeAp("Ap", $FreeAp("Pure", f), x3) };
  var foldFreeAp = (dictApplicative) => (nat) => (z) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v._2._1.tag === "Pure") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(dictApplicative.pure(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Lift") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(nat(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Ap") {
          go$a0 = goLeft(dictApplicative)(v._1)($NonEmpty(v._2._1._2, v._2._2))(nat)(v._2._1._1)(1);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go($Tuple(Nil, $NonEmpty(z, Nil)));
  };
  var applyFreeAp = { apply: (fba) => (fb) => $FreeAp("Ap", fba, fb), Functor0: () => functorFreeAp };
  var applicativeFreeAp = { pure: Pure, Apply0: () => applyFreeAp };

  // output-es/Halogen.Query.ChildQuery/index.js
  var $ChildQuery = (_1, _2, _3) => ({ tag: "ChildQuery", _1, _2, _3 });

  // output-es/Halogen.Query.HalogenM/index.js
  var $HalogenF = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity11 = (x3) => x3;
  var SubscriptionId = (x3) => x3;
  var ForkId = (x3) => x3;
  var raise = (o) => $Free(
    $FreeView("Bind", $HalogenF("Raise", o, void 0), (x3) => $Free($FreeView("Return", x3), CatNil)),
    CatNil
  );
  var query = () => (dictIsSymbol) => (dictOrd) => {
    const lookup22 = lookup2()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (q) => $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "ChildQuery",
          $ChildQuery(
            (dictApplicative) => (k) => {
              const $0 = dictApplicative.pure(Nothing);
              const $1 = lookup22(label)(p);
              return (x3) => {
                const $2 = $1(x3);
                if ($2.tag === "Nothing") {
                  return $0;
                }
                if ($2.tag === "Just") {
                  return k($2._1);
                }
                fail();
              };
            },
            q,
            identity11
          )
        ),
        (x3) => $Free($FreeView("Return", x3), CatNil)
      ),
      CatNil
    );
  };
  var monadTransHalogenM = {
    lift: (dictMonad) => (x3) => $Free(
      $FreeView("Bind", $HalogenF("Lift", x3), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    )
  };
  var monadStateHalogenM = {
    state: (x3) => $Free(
      $FreeView("Bind", $HalogenF("State", x3), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    ),
    Monad0: () => freeMonad
  };
  var monadEffectHalogenM = (dictMonadEffect) => ({
    liftEffect: (x3) => $Free(
      $FreeView(
        "Bind",
        $HalogenF("Lift", dictMonadEffect.liftEffect(x3)),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ),
    Monad0: () => freeMonad
  });
  var monadAffHalogenM = (dictMonadAff) => {
    const monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x3) => $Free(
        $FreeView(
          "Bind",
          $HalogenF("Lift", dictMonadAff.liftAff(x3)),
          (x$1) => $Free($FreeView("Return", x$1), CatNil)
        ),
        CatNil
      ),
      MonadEffect0: () => monadEffectHalogenM1
    };
  };
  var hoist = (dictFunctor) => (nat) => (v) => hoistFree((v1) => {
    if (v1.tag === "State") {
      return $HalogenF("State", v1._1);
    }
    if (v1.tag === "Subscribe") {
      return $HalogenF("Subscribe", v1._1, v1._2);
    }
    if (v1.tag === "Unsubscribe") {
      return $HalogenF("Unsubscribe", v1._1, v1._2);
    }
    if (v1.tag === "Lift") {
      return $HalogenF("Lift", nat(v1._1));
    }
    if (v1.tag === "ChildQuery") {
      return $HalogenF("ChildQuery", v1._1);
    }
    if (v1.tag === "Raise") {
      return $HalogenF("Raise", v1._1, v1._2);
    }
    if (v1.tag === "Par") {
      return $HalogenF(
        "Par",
        (() => {
          const $0 = hoist(dictFunctor)(nat);
          return foldFreeAp(applicativeFreeAp)((x3) => $FreeAp("Lift", $0(x3)))(v1._1);
        })()
      );
    }
    if (v1.tag === "Fork") {
      return $HalogenF("Fork", hoist(dictFunctor)(nat)(v1._1), v1._2);
    }
    if (v1.tag === "Join") {
      return $HalogenF("Join", v1._1, v1._2);
    }
    if (v1.tag === "Kill") {
      return $HalogenF("Kill", v1._1, v1._2);
    }
    if (v1.tag === "GetRef") {
      return $HalogenF("GetRef", v1._1, v1._2);
    }
    fail();
  })(v);

  // output-es/Halogen.VDom.DOM/index.js
  var haltWidget = (v) => {
    const $0 = v.widget;
    return halt($0);
  };
  var patchWidget = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchWidget(state, $0);
    }
    if (vdom.tag === "Widget") {
      const $0 = vdom._1;
      const res = step(state.widget, $0);
      return $Step$p(res._1, { build: state.build, widget: res }, patchWidget, haltWidget);
    }
    haltWidget(state);
    return state.build(vdom);
  };
  var haltText = (v) => {
    const $0 = v.node;
    const parent2 = parentNode($0);
    return removeChild($0, parent2);
  };
  var patchText = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchText(state, $0);
    }
    if (vdom.tag === "Text") {
      if (state.value === vdom._1) {
        return $Step$p(state.node, state, patchText, haltText);
      }
      const $0 = vdom._1;
      setTextContent($0, state.node);
      return $Step$p(state.node, { build: state.build, node: state.node, value: $0 }, patchText, haltText);
    }
    haltText(state);
    return state.build(vdom);
  };
  var haltKeyed = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forInE($1, (v1, s) => halt(s));
    return halt($0);
  };
  var haltElem = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forEachE($1, halt);
    return halt($0);
  };
  var eqElemSpec = (ns1, v, ns2, v1) => v === v1 && (ns1.tag === "Just" ? ns2.tag === "Just" && ns1._1 === ns2._1 : ns1.tag === "Nothing" && ns2.tag === "Nothing");
  var patchElem = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchElem(state, $0);
    }
    if (vdom.tag === "Elem" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      if (state.children.length === 0 && vdom._4.length === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children },
          patchElem,
          haltElem
        );
      }
      const children2 = diffWithIxE(
        state.children,
        vdom._4,
        (ix4, s, v2) => {
          const res = step(s, v2);
          insertChildIx(ix4, res._1, state.node);
          return res;
        },
        (v2, s) => halt(s),
        (ix4, v2) => {
          const res = state.build(v2);
          insertChildIx(ix4, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(state.node, { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2 }, patchElem, haltElem);
    }
    haltElem(state);
    return state.build(vdom);
  };
  var patchKeyed = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchKeyed(state, $0);
    }
    if (vdom.tag === "Keyed" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      const v = vdom._4.length;
      if (state.length === 0 && v === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children, length: 0 },
          patchKeyed,
          haltKeyed
        );
      }
      const children2 = diffWithKeyAndIxE(
        state.children,
        vdom._4,
        fst,
        (v2, ix$p, s, v3) => {
          const $0 = v3._2;
          const res = step(s, $0);
          insertChildIx(ix$p, res._1, state.node);
          return res;
        },
        (v2, s) => halt(s),
        (v2, ix4, v3) => {
          const $0 = v3._2;
          const res = state.build($0);
          insertChildIx(ix4, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(
        state.node,
        { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2, length: v },
        patchKeyed,
        haltKeyed
      );
    }
    haltKeyed(state);
    return state.build(vdom);
  };
  var buildWidget = (v, build, w) => {
    const res = v.buildWidget(v)(w);
    return $Step$p(res._1, { build, widget: res }, patchWidget, haltWidget);
  };
  var buildText = (v, build, s) => {
    const $0 = v.document;
    const node = createTextNode(s, $0);
    return $Step$p(node, { build, node, value: s }, patchText, haltText);
  };
  var buildKeyed = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = strMapWithIxE(
      ch1,
      fst,
      (v1, ix4, v2) => {
        const $2 = v2._2;
        const res = build($2);
        insertChildIx(ix4, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2, length: ch1.length }, patchKeyed, haltKeyed);
  };
  var buildElem = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = forE2(
      ch1,
      (ix4, child) => {
        const res = build(child);
        insertChildIx(ix4, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2 }, patchElem, haltElem);
  };
  var buildVDom = (spec) => {
    const build = (v) => {
      if (v.tag === "Text") {
        const $0 = v._1;
        return buildText(spec, build, $0);
      }
      if (v.tag === "Elem") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildElem(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Keyed") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildKeyed(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Widget") {
        const $0 = v._1;
        return buildWidget(spec, build, $0);
      }
      if (v.tag === "Grafted") {
        const $0 = runGraft(v._1);
        return build($0);
      }
      fail();
    };
    return build;
  };

  // output-es/Halogen.VDom.Thunk/index.js
  var $Thunk = (_1, _2, _3, _4) => ({ tag: "Thunk", _1, _2, _3, _4 });
  var unsafeEqThunk = (v, $0) => refEq2(v._1, $0._1) && refEq2(v._2, $0._2) && v._2(v._4, $0._4);
  var buildThunk = (toVDom) => {
    const patchThunk = (state, t2) => {
      if (unsafeEqThunk(state.thunk, t2)) {
        const $02 = $Step$p(
          state.vdom._1,
          state,
          patchThunk,
          (state$1) => {
            const $03 = state$1.vdom;
            return halt($03);
          }
        );
        return $02;
      }
      const $0 = toVDom(t2._3(t2._4));
      const vdom = step(state.vdom, $0);
      return $Step$p(
        vdom._1,
        { vdom, thunk: t2 },
        patchThunk,
        (state$1) => {
          const $1 = state$1.vdom;
          return halt($1);
        }
      );
    };
    return (spec) => (t) => {
      const $0 = toVDom(t._3(t._4));
      const vdom = buildVDom(spec)($0);
      return $Step$p(
        vdom._1,
        { thunk: t, vdom },
        patchThunk,
        (state) => {
          const $1 = state.vdom;
          return halt($1);
        }
      );
    };
  };

  // output-es/Halogen.Component/index.js
  var $ComponentSlot = (tag, _1) => ({ tag, _1 });
  var traverse_2 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var mkEval = (args) => (v) => {
    if (v.tag === "Initialize") {
      const $0 = v._1;
      const $1 = traverse_2(args.handleAction)(args.initialize);
      return $Free($1._1, snoc($1._2)((x3) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Finalize") {
      const $0 = v._1;
      const $1 = traverse_2(args.handleAction)(args.finalize);
      return $Free($1._1, snoc($1._2)((x3) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Receive") {
      const $0 = v._2;
      const $1 = traverse_2(args.handleAction)(args.receive(v._1));
      return $Free($1._1, snoc($1._2)((x3) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Action") {
      const $0 = v._2;
      const $1 = args.handleAction(v._1);
      return $Free($1._1, snoc($1._2)((x3) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Query") {
      const $0 = v._2();
      const $1 = args.handleQuery(v._1._2);
      return $Free(
        $1._1,
        snoc($1._2)((x3) => $Free(
          $FreeView(
            "Return",
            (() => {
              if (x3.tag === "Nothing") {
                return $0;
              }
              if (x3.tag === "Just") {
                return v._1._1(x3._1);
              }
              fail();
            })()
          ),
          CatNil
        ))
      );
    }
    fail();
  };
  var hoistSlot = (dictFunctor) => (nat) => (v) => {
    if (v.tag === "ComponentSlot") {
      return $ComponentSlot("ComponentSlot", { ...v._1, component: hoist2(dictFunctor)(nat)(v._1.component) });
    }
    if (v.tag === "ThunkSlot") {
      return $ComponentSlot(
        "ThunkSlot",
        (() => {
          const $0 = v._1;
          return $Thunk($0._1, $0._2, (x3) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity7)($0._3(x3)), $0._4);
        })()
      );
    }
    fail();
  };
  var hoist2 = (dictFunctor) => (nat) => (c) => ({
    initialState: c.initialState,
    render: (x3) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity7)(c.render(x3)),
    eval: (x3) => hoist(dictFunctor)(nat)(c.eval(x3))
  });
  var functorComponentSlotBox = {
    map: (f) => (slot3) => ({
      ...slot3,
      output: (x3) => {
        const $0 = slot3.output(x3);
        if ($0.tag === "Just") {
          return $Maybe("Just", f($0._1));
        }
        return Nothing;
      }
    })
  };
  var functorComponentSlot = {
    map: (f) => (v) => {
      if (v.tag === "ComponentSlot") {
        return $ComponentSlot("ComponentSlot", functorComponentSlotBox.map(f)(v._1));
      }
      if (v.tag === "ThunkSlot") {
        return $ComponentSlot(
          "ThunkSlot",
          (() => {
            const $0 = bifunctorHTML.bimap(functorComponentSlot.map(f))(f);
            const $1 = v._1;
            return $Thunk($1._1, $1._2, (x3) => $0($1._3(x3)), $1._4);
          })()
        );
      }
      fail();
    }
  };
  var defaultEval = {
    handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
    handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
    receive: (v) => Nothing,
    initialize: Nothing,
    finalize: Nothing
  };
  var componentSlot = () => (dictIsSymbol) => (dictOrd) => {
    const lookup22 = lookup2()(dictIsSymbol)(dictOrd);
    const pop22 = pop2()(dictIsSymbol)(dictOrd);
    const insert22 = insert2()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (comp) => (input) => (output) => ({ get: lookup22(label)(p), pop: pop22(label)(p), set: insert22(label)(p), component: comp, input, output });
  };

  // output-es/Data.Date.Component/index.js
  var $Month = (tag) => tag;
  var January = /* @__PURE__ */ $Month("January");
  var February = /* @__PURE__ */ $Month("February");
  var March = /* @__PURE__ */ $Month("March");
  var April = /* @__PURE__ */ $Month("April");
  var May = /* @__PURE__ */ $Month("May");
  var June = /* @__PURE__ */ $Month("June");
  var July = /* @__PURE__ */ $Month("July");
  var August = /* @__PURE__ */ $Month("August");
  var September = /* @__PURE__ */ $Month("September");
  var October = /* @__PURE__ */ $Month("October");
  var November = /* @__PURE__ */ $Month("November");
  var December = /* @__PURE__ */ $Month("December");
  var eqMonth = {
    eq: (x3) => (y3) => {
      if (x3 === "January") {
        return y3 === "January";
      }
      if (x3 === "February") {
        return y3 === "February";
      }
      if (x3 === "March") {
        return y3 === "March";
      }
      if (x3 === "April") {
        return y3 === "April";
      }
      if (x3 === "May") {
        return y3 === "May";
      }
      if (x3 === "June") {
        return y3 === "June";
      }
      if (x3 === "July") {
        return y3 === "July";
      }
      if (x3 === "August") {
        return y3 === "August";
      }
      if (x3 === "September") {
        return y3 === "September";
      }
      if (x3 === "October") {
        return y3 === "October";
      }
      if (x3 === "November") {
        return y3 === "November";
      }
      return x3 === "December" && y3 === "December";
    }
  };
  var ordMonth = {
    compare: (x3) => (y3) => {
      if (x3 === "January") {
        if (y3 === "January") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "January") {
        return GT;
      }
      if (x3 === "February") {
        if (y3 === "February") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "February") {
        return GT;
      }
      if (x3 === "March") {
        if (y3 === "March") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "March") {
        return GT;
      }
      if (x3 === "April") {
        if (y3 === "April") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "April") {
        return GT;
      }
      if (x3 === "May") {
        if (y3 === "May") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "May") {
        return GT;
      }
      if (x3 === "June") {
        if (y3 === "June") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "June") {
        return GT;
      }
      if (x3 === "July") {
        if (y3 === "July") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "July") {
        return GT;
      }
      if (x3 === "August") {
        if (y3 === "August") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "August") {
        return GT;
      }
      if (x3 === "September") {
        if (y3 === "September") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "September") {
        return GT;
      }
      if (x3 === "October") {
        if (y3 === "October") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "October") {
        return GT;
      }
      if (x3 === "November") {
        if (y3 === "November") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "November") {
        return GT;
      }
      if (x3 === "December" && y3 === "December") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqMonth
  };
  var boundedMonth = { bottom: January, top: December, Ord0: () => ordMonth };
  var boundedEnumMonth = {
    cardinality: 12,
    toEnum: (v) => {
      if (v === 1) {
        return $Maybe("Just", January);
      }
      if (v === 2) {
        return $Maybe("Just", February);
      }
      if (v === 3) {
        return $Maybe("Just", March);
      }
      if (v === 4) {
        return $Maybe("Just", April);
      }
      if (v === 5) {
        return $Maybe("Just", May);
      }
      if (v === 6) {
        return $Maybe("Just", June);
      }
      if (v === 7) {
        return $Maybe("Just", July);
      }
      if (v === 8) {
        return $Maybe("Just", August);
      }
      if (v === 9) {
        return $Maybe("Just", September);
      }
      if (v === 10) {
        return $Maybe("Just", October);
      }
      if (v === 11) {
        return $Maybe("Just", November);
      }
      if (v === 12) {
        return $Maybe("Just", December);
      }
      return Nothing;
    },
    fromEnum: (v) => {
      if (v === "January") {
        return 1;
      }
      if (v === "February") {
        return 2;
      }
      if (v === "March") {
        return 3;
      }
      if (v === "April") {
        return 4;
      }
      if (v === "May") {
        return 5;
      }
      if (v === "June") {
        return 6;
      }
      if (v === "July") {
        return 7;
      }
      if (v === "August") {
        return 8;
      }
      if (v === "September") {
        return 9;
      }
      if (v === "October") {
        return 10;
      }
      if (v === "November") {
        return 11;
      }
      if (v === "December") {
        return 12;
      }
      fail();
    },
    Bounded0: () => boundedMonth,
    Enum1: () => enumMonth
  };
  var enumMonth = {
    succ: (x3) => boundedEnumMonth.toEnum((() => {
      if (x3 === "January") {
        return 2;
      }
      if (x3 === "February") {
        return 3;
      }
      if (x3 === "March") {
        return 4;
      }
      if (x3 === "April") {
        return 5;
      }
      if (x3 === "May") {
        return 6;
      }
      if (x3 === "June") {
        return 7;
      }
      if (x3 === "July") {
        return 8;
      }
      if (x3 === "August") {
        return 9;
      }
      if (x3 === "September") {
        return 10;
      }
      if (x3 === "October") {
        return 11;
      }
      if (x3 === "November") {
        return 12;
      }
      if (x3 === "December") {
        return 13;
      }
      fail();
    })()),
    pred: (x3) => boundedEnumMonth.toEnum((() => {
      if (x3 === "January") {
        return 0;
      }
      if (x3 === "February") {
        return 1;
      }
      if (x3 === "March") {
        return 2;
      }
      if (x3 === "April") {
        return 3;
      }
      if (x3 === "May") {
        return 4;
      }
      if (x3 === "June") {
        return 5;
      }
      if (x3 === "July") {
        return 6;
      }
      if (x3 === "August") {
        return 7;
      }
      if (x3 === "September") {
        return 8;
      }
      if (x3 === "October") {
        return 9;
      }
      if (x3 === "November") {
        return 10;
      }
      if (x3 === "December") {
        return 11;
      }
      fail();
    })()),
    Ord0: () => ordMonth
  };

  // output-es/Data.Semiring/foreign.js
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

  // output-es/Data.Semiring/index.js
  var semiringNumber = { add: numAdd, zero: 0, mul: numMul, one: 1 };

  // output-es/Data.Ring/foreign.js
  var numSub = function(n1) {
    return function(n2) {
      return n1 - n2;
    };
  };

  // output-es/Data.Ring/index.js
  var ringNumber = { sub: numSub, Semiring0: () => semiringNumber };

  // output-es/Data.EuclideanRing/foreign.js
  var intMod = function(x3) {
    return function(y3) {
      if (y3 === 0)
        return 0;
      var yy = Math.abs(y3);
      return (x3 % yy + yy) % yy;
    };
  };

  // output-es/Data.Date/foreign.js
  var createDate = function(y3, m, d2) {
    var date = new Date(Date.UTC(y3, m, d2));
    if (y3 >= 0 && y3 < 100) {
      date.setUTCFullYear(y3);
    }
    return date;
  };
  function canonicalDateImpl(ctor, y3, m, d2) {
    var date = createDate(y3, m - 1, d2);
    return ctor(date.getUTCFullYear())(date.getUTCMonth() + 1)(date.getUTCDate());
  }

  // output-es/Data.Date/index.js
  var $$$Date = (_1, _2, _3) => ({ tag: "Date", _1, _2, _3 });
  var canonicalDate = (y3) => (m) => (d2) => canonicalDateImpl(
    (y$p) => (m$p) => (d$p) => $$$Date(
      y$p,
      (() => {
        const $0 = boundedEnumMonth.toEnum(m$p);
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })(),
      d$p
    ),
    y3,
    (() => {
      if (m === "January") {
        return 1;
      }
      if (m === "February") {
        return 2;
      }
      if (m === "March") {
        return 3;
      }
      if (m === "April") {
        return 4;
      }
      if (m === "May") {
        return 5;
      }
      if (m === "June") {
        return 6;
      }
      if (m === "July") {
        return 7;
      }
      if (m === "August") {
        return 8;
      }
      if (m === "September") {
        return 9;
      }
      if (m === "October") {
        return 10;
      }
      if (m === "November") {
        return 11;
      }
      if (m === "December") {
        return 12;
      }
      fail();
    })(),
    d2
  );

  // output-es/Data.Time/index.js
  var $Time = (_1, _2, _3, _4) => ({ tag: "Time", _1, _2, _3, _4 });

  // output-es/Data.DateTime/index.js
  var $DateTime = (_1, _2) => ({ tag: "DateTime", _1, _2 });

  // output-es/Data.DateTime.Instant/foreign.js
  function toDateTimeImpl(ctor) {
    return function(instant) {
      var dt = new Date(instant);
      return ctor(dt.getUTCFullYear())(dt.getUTCMonth() + 1)(dt.getUTCDate())(dt.getUTCHours())(dt.getUTCMinutes())(dt.getUTCSeconds())(dt.getUTCMilliseconds());
    };
  }

  // output-es/Data.DateTime.Instant/index.js
  var toDateTime = /* @__PURE__ */ toDateTimeImpl((y3) => (mo) => (d2) => (h) => (mi) => (s) => (ms) => $DateTime(
    canonicalDate(y3)((() => {
      const $0 = boundedEnumMonth.toEnum(mo);
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })())(d2),
    $Time(h, mi, s, ms)
  ));

  // output-es/Data.JSDate/foreign.js
  function now() {
    return /* @__PURE__ */ new Date();
  }
  function dateMethodEff(method, date) {
    return function() {
      return date[method]();
    };
  }

  // output-es/Control.Monad.Logger.Class/index.js
  var log$p = (dictMonadLogger) => {
    const MonadEffect0 = dictMonadLogger.MonadEffect0();
    return (level) => (tags) => (message2) => MonadEffect0.Monad0().Bind1().bind(MonadEffect0.liftEffect(now))((x3) => dictMonadLogger.log({ level, message: message2, tags, timestamp: x3 }));
  };

  // output-es/Data.Log.Filter/index.js
  var minimumLevel = (dictMonadEffect) => (level) => (logger) => (message2) => {
    if (ordLogLevel.compare(message2.level)(level) !== "LT") {
      return logger(message2);
    }
    return dictMonadEffect.Monad0().Applicative0().pure();
  };

  // output-es/Ansi.Codes/index.js
  var $Color = (tag) => tag;
  var $EscapeCode = (tag, _1, _2) => ({ tag, _1, _2 });
  var $GraphicsParam = (tag, _1) => ({ tag, _1 });
  var $RenderingMode = (tag) => tag;
  var Bold = /* @__PURE__ */ $RenderingMode("Bold");
  var Red = /* @__PURE__ */ $Color("Red");
  var Yellow = /* @__PURE__ */ $Color("Yellow");
  var Blue = /* @__PURE__ */ $Color("Blue");
  var Cyan = /* @__PURE__ */ $Color("Cyan");
  var White = /* @__PURE__ */ $Color("White");
  var BrightBlack = /* @__PURE__ */ $Color("BrightBlack");
  var Reset = /* @__PURE__ */ $GraphicsParam("Reset");
  var graphicsParamToString = (gp) => {
    if (gp.tag === "Reset") {
      return "0";
    }
    if (gp.tag === "PMode") {
      return showIntImpl((() => {
        if (gp._1 === "Bold") {
          return 1;
        }
        if (gp._1 === "Dim") {
          return 2;
        }
        if (gp._1 === "Italic") {
          return 3;
        }
        if (gp._1 === "Underline") {
          return 4;
        }
        if (gp._1 === "Inverse") {
          return 7;
        }
        if (gp._1 === "Strikethrough") {
          return 9;
        }
        fail();
      })());
    }
    if (gp.tag === "PForeground") {
      return showIntImpl((() => {
        if (gp._1 === "Black") {
          return 30;
        }
        if (gp._1 === "Red") {
          return 31;
        }
        if (gp._1 === "Green") {
          return 32;
        }
        if (gp._1 === "Yellow") {
          return 33;
        }
        if (gp._1 === "Blue") {
          return 34;
        }
        if (gp._1 === "Magenta") {
          return 35;
        }
        if (gp._1 === "Cyan") {
          return 36;
        }
        if (gp._1 === "White") {
          return 37;
        }
        if (gp._1 === "BrightBlack") {
          return 90;
        }
        if (gp._1 === "BrightRed") {
          return 91;
        }
        if (gp._1 === "BrightGreen") {
          return 92;
        }
        if (gp._1 === "BrightYellow") {
          return 93;
        }
        if (gp._1 === "BrightBlue") {
          return 94;
        }
        if (gp._1 === "BrightMagenta") {
          return 95;
        }
        if (gp._1 === "BrightCyan") {
          return 96;
        }
        if (gp._1 === "BrightWhite") {
          return 97;
        }
        fail();
      })());
    }
    if (gp.tag === "PBackground") {
      return showIntImpl((() => {
        if (gp._1 === "Black") {
          return 40;
        }
        if (gp._1 === "Red") {
          return 41;
        }
        if (gp._1 === "Green") {
          return 42;
        }
        if (gp._1 === "Yellow") {
          return 43;
        }
        if (gp._1 === "Blue") {
          return 44;
        }
        if (gp._1 === "Magenta") {
          return 45;
        }
        if (gp._1 === "Cyan") {
          return 46;
        }
        if (gp._1 === "White") {
          return 47;
        }
        if (gp._1 === "BrightBlack") {
          return 100;
        }
        if (gp._1 === "BrightRed") {
          return 101;
        }
        if (gp._1 === "BrightGreen") {
          return 102;
        }
        if (gp._1 === "BrightYellow") {
          return 103;
        }
        if (gp._1 === "BrightBlue") {
          return 104;
        }
        if (gp._1 === "BrightMagenta") {
          return 105;
        }
        if (gp._1 === "BrightCyan") {
          return 106;
        }
        if (gp._1 === "BrightWhite") {
          return 107;
        }
        fail();
      })());
    }
    fail();
  };
  var escapeCodeToString = (x3) => {
    if (x3.tag === "Up") {
      return "\x1B[" + showIntImpl(x3._1) + "A";
    }
    if (x3.tag === "Down") {
      return "\x1B[" + showIntImpl(x3._1) + "B";
    }
    if (x3.tag === "Forward") {
      return "\x1B[" + showIntImpl(x3._1) + "C";
    }
    if (x3.tag === "Back") {
      return "\x1B[" + showIntImpl(x3._1) + "D";
    }
    if (x3.tag === "NextLine") {
      return "\x1B[" + showIntImpl(x3._1) + "E";
    }
    if (x3.tag === "PreviousLine") {
      return "\x1B[" + showIntImpl(x3._1) + "F";
    }
    if (x3.tag === "HorizontalAbsolute") {
      return "\x1B[" + showIntImpl(x3._1) + "G";
    }
    if (x3.tag === "Position") {
      return "\x1B[" + showIntImpl(x3._1) + ";" + showIntImpl(x3._2) + "H";
    }
    if (x3.tag === "EraseData") {
      if (x3._1 === "ToEnd") {
        return "\x1B[0J";
      }
      if (x3._1 === "FromBeginning") {
        return "\x1B[1J";
      }
      if (x3._1 === "Entire") {
        return "\x1B[2J";
      }
      fail();
    }
    if (x3.tag === "EraseLine") {
      if (x3._1 === "ToEnd") {
        return "\x1B[0K";
      }
      if (x3._1 === "FromBeginning") {
        return "\x1B[1K";
      }
      if (x3._1 === "Entire") {
        return "\x1B[2K";
      }
      fail();
    }
    if (x3.tag === "ScrollUp") {
      return "\x1B[" + showIntImpl(x3._1) + "S";
    }
    if (x3.tag === "ScrollDown") {
      return "\x1B[" + showIntImpl(x3._1) + "T";
    }
    if (x3.tag === "Graphics") {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = b.init ? { init: false, acc: v._1 } : { init: false, acc: b.acc + ";" + v._1 };
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return "\x1B[" + go({ init: false, acc: graphicsParamToString(x3._1._1) })(listMap(graphicsParamToString)(x3._1._2)).acc + "m";
    }
    if (x3.tag === "SavePosition") {
      return "\x1B[s";
    }
    if (x3.tag === "RestorePosition") {
      return "\x1B[u";
    }
    if (x3.tag === "QueryPosition") {
      return "\x1B[6n";
    }
    if (x3.tag === "HideCursor") {
      return "\x1B[?25l";
    }
    if (x3.tag === "ShowCursor") {
      return "\x1B[?25h";
    }
    fail();
  };

  // output-es/Ansi.Output/index.js
  var withGraphics = (params) => (text) => escapeCodeToString($EscapeCode("Graphics", params)) + text + escapeCodeToString($EscapeCode(
    "Graphics",
    $NonEmpty(Reset, Nil)
  ));

  // output-es/Data.Semigroup/foreign.js
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

  // output-es/Data.Semigroup/index.js
  var semigroupString = { append: concatString };
  var semigroupArray = { append: concatArray };

  // output-es/Data.Log.Formatter.Pretty/index.js
  var indentEachLine1 = /* @__PURE__ */ arrayMap(($0) => "   " + $0);
  var showLevel = (v) => {
    if (v === "Trace") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Cyan), Nil))("[TRACE]");
    }
    if (v === "Debug") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Blue), Nil))("[DEBUG]");
    }
    if (v === "Info") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", White), Nil))("[INFO]");
    }
    if (v === "Warn") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Yellow), Nil))("[WARN]");
    }
    if (v === "Error") {
      return withGraphics($NonEmpty($GraphicsParam("PForeground", Red), Nil))("[ERROR]");
    }
    fail();
  };
  var showMainLine = (dictMonadEffect) => (v) => {
    const $0 = v.level;
    const $1 = v.message;
    return dictMonadEffect.liftEffect((() => {
      const $2 = dateMethodEff("toISOString", v.timestamp);
      return () => {
        const a$p = $2();
        return joinWith(" ")([
          showLevel($0),
          withGraphics($NonEmpty($GraphicsParam("PForeground", BrightBlack), Nil))(a$p),
          withGraphics($NonEmpty($GraphicsParam("PForeground", Cyan), Nil))($1)
        ]);
      };
    })());
  };
  var showSpecial = (dictApplicative) => (x3) => {
    const $0 = withGraphics($NonEmpty($GraphicsParam("PForeground", Yellow), Nil))(x3);
    return (label) => dictApplicative.pure([label + $0]);
  };
  var showJsDate = (dictMonadEffect) => (value2) => (label) => dictMonadEffect.liftEffect((() => {
    const $0 = dateMethodEff("toISOString", value2);
    return () => {
      const $1 = $0();
      return showSpecial(applicativeEffect)($1)(label)();
    };
  })());
  var tagLines = (dictMonadEffect) => (tags) => {
    if (tags.tag === "Leaf") {
      return Nothing;
    }
    return $Maybe("Just", dictMonadEffect.Monad0().Bind1().Apply0().Functor0().map((x3) => indentEachLine1(concat(x3)))(lineify(dictMonadEffect)(tags)));
  };
  var showTag = (dictMonadEffect) => {
    const Applicative0 = dictMonadEffect.Monad0().Applicative0();
    return (v) => {
      if (v.tag === "StringTag") {
        const $0 = v._1;
        return (label) => Applicative0.pure([label + $0]);
      }
      if (v.tag === "IntTag") {
        return showSpecial(Applicative0)(showIntImpl(v._1));
      }
      if (v.tag === "NumberTag") {
        return showSpecial(Applicative0)(showNumberImpl(v._1));
      }
      if (v.tag === "BooleanTag") {
        return showSpecial(Applicative0)(v._1 ? "true" : "false");
      }
      if (v.tag === "TagSetTag") {
        return showSubTags(dictMonadEffect)(v._1);
      }
      if (v.tag === "JSDateTag") {
        return showJsDate(dictMonadEffect)(v._1);
      }
      fail();
    };
  };
  var showSubTags = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    return (value2) => (label) => Monad0.Bind1().Apply0().Functor0().map(cons2(label))((() => {
      const $0 = Monad0.Applicative0().pure([]);
      const $1 = tagLines(dictMonadEffect)(value2);
      if ($1.tag === "Nothing") {
        return $0;
      }
      if ($1.tag === "Just") {
        return $1._1;
      }
      fail();
    })());
  };
  var showField = (dictMonadEffect) => (v) => showTag(dictMonadEffect)(v._2)(withGraphics($NonEmpty(
    $GraphicsParam("PMode", Bold),
    Nil
  ))(v._1) + withGraphics($NonEmpty($GraphicsParam("PMode", Bold), Nil))(": "));
  var lineify = (dictMonadEffect) => {
    const sequence1 = traversableArray.traverse(dictMonadEffect.Monad0().Applicative0())(identity6);
    return (tags) => sequence1(arrayMap(showField(dictMonadEffect))(toUnfoldable(unfoldableArray)(tags)));
  };
  var showTags = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (x3) => {
      const $1 = tagLines(dictMonadEffect)(x3);
      if ($1.tag === "Nothing") {
        return Monad0.Applicative0().pure("");
      }
      if ($1.tag === "Just") {
        const $2 = joinWith("\n");
        return $0.map((x$1) => "\n" + $2(x$1))($1._1);
      }
      fail();
    };
  };
  var prettyFormatter = (dictMonadEffect) => {
    const Apply0 = dictMonadEffect.Monad0().Bind1().Apply0();
    const showTags1 = showTags(dictMonadEffect);
    return (message2) => Apply0.apply(Apply0.Functor0().map(concatString)(showMainLine(dictMonadEffect)(message2)))(showTags1(message2.tags));
  };

  // output-es/Data.Log.Tag/index.js
  var $Tag = (tag, _1) => ({ tag, _1 });

  // output-es/Effect.Console/foreign.js
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

  // output-es/Effect.Class.Console/index.js
  var log3 = (dictMonadEffect) => (x3) => dictMonadEffect.liftEffect(log2(x3));

  // output-es/Logging/index.js
  var logMessage = (dictMonadEffect) => {
    const $0 = dictMonadEffect.Monad0().Bind1();
    const prettyFormatter2 = prettyFormatter(dictMonadEffect);
    return (logLevel) => minimumLevel(dictMonadEffect)(logLevel)((a) => $0.bind(prettyFormatter2(a))(log3(dictMonadEffect)));
  };

  // output-es/AppM/index.js
  var monadEffectReader2 = /* @__PURE__ */ monadEffectReader(monadEffectAff);
  var logMessage2 = /* @__PURE__ */ logMessage(monadEffectReader2);
  var monadLoggerAppM = /* @__PURE__ */ (() => {
    const monadEffectLoggerT1 = monadEffectLoggerT(monadEffectReader2);
    return { log: (message2) => (v) => v(message2), MonadEffect0: () => monadEffectLoggerT1 };
  })();
  var monadAskGlobalStateAppM = /* @__PURE__ */ monadAskLoggerT(/* @__PURE__ */ (() => {
    const monadReaderT1 = monadReaderT(monadAff);
    return { ask: _pure, Monad0: () => monadReaderT1 };
  })());
  var monadAffAppM = /* @__PURE__ */ monadAffLoggerT(/* @__PURE__ */ monadAffReader(monadAffAff));
  var initialGlobalState = /* @__PURE__ */ _pure({});
  var runAppM = (component13) => _bind(initialGlobalState)((store) => _pure(hoist2(functorAff)((v) => v(logMessage2(Debug))(store))(component13)));

  // output-es/Data.Bifoldable/index.js
  var bifoldableTuple = {
    bifoldMap: (dictMonoid) => (f) => (g) => (v) => dictMonoid.Semigroup0().append(f(v._1))(g(v._2)),
    bifoldr: (f) => (g) => (z) => (v) => f(v._1)(g(v._2)(z)),
    bifoldl: (f) => (g) => (z) => (v) => g(f(z)(v._1))(v._2)
  };

  // output-es/Data.Profunctor/index.js
  var identity12 = (x3) => x3;
  var profunctorFn = { dimap: (a2b) => (c2d) => (b2c) => (x3) => c2d(b2c(a2b(x3))) };

  // output-es/Data.Bitraversable/index.js
  var bitraversableTuple = {
    bitraverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f) => (g) => (v) => Apply0.apply(Apply0.Functor0().map(Tuple)(f(v._1)))(g(v._2));
    },
    bisequence: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (v) => Apply0.apply(Apply0.Functor0().map(Tuple)(v._1))(v._2);
    },
    Bifunctor0: () => bifunctorTuple,
    Bifoldable1: () => bifoldableTuple
  };

  // output-es/JSURI/foreign.js
  function encodeURIComponent_to_RFC3986(input) {
    return input.replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
  function _encodeURIComponent(fail3, succeed, input) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input)));
    } catch (err) {
      return fail3(err);
    }
  }
  function _decodeURIComponent(fail3, succeed, input) {
    try {
      return succeed(decodeURIComponent(input));
    } catch (err) {
      return fail3(err);
    }
  }

  // output-es/JSURI/index.js
  var encodeURIComponent2 = ($0) => _encodeURIComponent((v) => Nothing, Just, $0);

  // output-es/Routing.Duplex.Parser/index.js
  var $RouteError = (tag, _1, _2) => ({ tag, _1, _2 });
  var $RouteParser = (tag, _1, _2) => ({ tag, _1, _2 });
  var $RouteResult = (tag, _1, _2) => ({ tag, _1, _2 });
  var bitraverse = /* @__PURE__ */ (() => bitraversableTuple.bitraverse(applicativeEither))();
  var traverse = /* @__PURE__ */ (() => traversableArray.traverse(applicativeEither))();
  var EndOfPath = /* @__PURE__ */ $RouteError("EndOfPath");
  var take2 = /* @__PURE__ */ $RouteParser(
    "Chomp",
    (state) => {
      const v = unconsImpl((v2) => Nothing, (x3) => (xs) => $Maybe("Just", { head: x3, tail: xs }), state.segments);
      if (v.tag === "Just") {
        return $RouteResult("Success", { ...state, segments: v._1.tail }, v._1.head);
      }
      return $RouteResult("Fail", EndOfPath);
    }
  );
  var parsePath = /* @__PURE__ */ (() => {
    const $0 = bitraversableTuple.bitraverse(applicativeEither)((() => {
      const $02 = bitraverse((x3) => {
        const $03 = x3 === "" ? [] : split("/")(x3);
        if ($03.length === 2 && $03[0] === "" && $03[1] === "") {
          return $Either("Right", [""]);
        }
        return traverse((str2) => {
          const v = _decodeURIComponent((v2) => Nothing, Just, str2);
          if (v.tag === "Nothing") {
            return $Either("Left", $RouteError("MalformedURIComponent", str2));
          }
          if (v.tag === "Just") {
            return $Either("Right", v._1);
          }
          fail();
        })($03);
      })((() => {
        const $03 = traverse((() => {
          const $04 = bitraverse((str2) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str2);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str2));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          })((str2) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str2);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str2));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          });
          return (x3) => $04((() => {
            const v = indexOf("=")(x3);
            if (v.tag === "Just") {
              return $Tuple(take(v._1)(x3), drop(v._1 + length("=") | 0)(x3));
            }
            if (v.tag === "Nothing") {
              return $Tuple(x3, "");
            }
            fail();
          })());
        })());
        return (x3) => $03(x3 === "" ? [] : split("&")(x3));
      })());
      return (x3) => $02((() => {
        const v = indexOf("?")(x3);
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x3), drop(v._1 + length("?") | 0)(x3));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x3, "");
        }
        fail();
      })());
    })())(Right);
    return (x3) => {
      const v = indexOf("#")(x3);
      const $1 = $0((() => {
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x3), drop(v._1 + length("#") | 0)(x3));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x3, "");
        }
        fail();
      })());
      if ($1.tag === "Left") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Right") {
        return $Either("Right", { segments: $1._1._1._1, params: $1._1._1._2, hash: $1._1._2 });
      }
      fail();
    };
  })();
  var functorRouteParser = {
    map: (f) => (m) => {
      if (m.tag === "Alt") {
        return $RouteParser("Alt", arrayMap(functorRouteParser.map(f))(m._1));
      }
      if (m.tag === "Chomp") {
        return $RouteParser(
          "Chomp",
          (x3) => {
            const $0 = m._1(x3);
            if ($0.tag === "Fail") {
              return $RouteResult("Fail", $0._1);
            }
            if ($0.tag === "Success") {
              return $RouteResult("Success", $0._1, f($0._2));
            }
            fail();
          }
        );
      }
      if (m.tag === "Prefix") {
        return $RouteParser("Prefix", m._1, functorRouteParser.map(f)(m._2));
      }
      fail();
    }
  };
  var end = /* @__PURE__ */ $RouteParser(
    "Chomp",
    (state) => {
      if (0 < state.segments.length) {
        return $RouteResult("Fail", $RouteError("ExpectedEndOfPath", state.segments[0]));
      }
      return $RouteResult("Success", state, void 0);
    }
  );
  var chompPrefix = (pre) => (state) => {
    if (0 < state.segments.length) {
      if (pre === state.segments[0]) {
        return $RouteResult("Success", { ...state, segments: sliceImpl(1, state.segments.length, state.segments) }, void 0);
      }
      return $RouteResult("Fail", $RouteError("Expected", pre, state.segments[0]));
    }
    return $RouteResult("Fail", EndOfPath);
  };
  var runRouteParser$lazy = /* @__PURE__ */ binding(() => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const state = go$a0, v = go$a1;
        if (v.tag === "Alt") {
          go$c = false;
          go$r = foldlArray((v1) => (v2) => {
            if (v1.tag === "Fail") {
              return runRouteParser$lazy()(state)(v2);
            }
            return v1;
          })($RouteResult("Fail", EndOfPath))(v._1);
          continue;
        }
        if (v.tag === "Chomp") {
          go$c = false;
          go$r = v._1(state);
          continue;
        }
        if (v.tag === "Prefix") {
          const v1 = chompPrefix(v._1)(state);
          if (v1.tag === "Fail") {
            go$c = false;
            go$r = $RouteResult("Fail", v1._1);
            continue;
          }
          if (v1.tag === "Success") {
            go$a0 = v1._1;
            go$a1 = v._2;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  });
  var runRouteParser = /* @__PURE__ */ runRouteParser$lazy();
  var run2 = (p) => (a) => {
    const $0 = parsePath(a);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      const $1 = runRouteParser($0._1)(p);
      if ($1.tag === "Fail") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Success") {
        return $Either("Right", $1._2);
      }
    }
    fail();
  };
  var applyRouteParser = {
    apply: (fx) => (x3) => $RouteParser(
      "Chomp",
      (state) => {
        const v = runRouteParser(state)(fx);
        if (v.tag === "Fail") {
          return $RouteResult("Fail", v._1);
        }
        if (v.tag === "Success") {
          const $0 = runRouteParser(v._1)(x3);
          if ($0.tag === "Fail") {
            return $RouteResult("Fail", $0._1);
          }
          if ($0.tag === "Success") {
            return $RouteResult("Success", $0._1, v._2($0._2));
          }
        }
        fail();
      }
    ),
    Functor0: () => functorRouteParser
  };
  var altSnoc = (v) => (v1) => {
    if (v1.tag === "Prefix") {
      const $0 = last(v);
      const $1 = (() => {
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      if ($1.tag === "Prefix" && v1._1 === $1._1) {
        return snoc2((() => {
          if (v.length === 0) {
            fail();
          }
          return sliceImpl(0, v.length - 1 | 0, v);
        })())($RouteParser("Prefix", v1._1, altRouteParser.alt($1._2)(v1._2)));
      }
    }
    return snoc2(v)(v1);
  };
  var altRouteParser = {
    alt: (v) => (v1) => {
      if (v.tag === "Alt") {
        if (v1.tag === "Alt") {
          return $RouteParser("Alt", altAppend(v._1)(v1._1));
        }
        return $RouteParser("Alt", altSnoc(v._1)(v1));
      }
      if (v1.tag === "Alt") {
        return $RouteParser("Alt", altCons(v)(v1._1));
      }
      if (v.tag === "Prefix" && v1.tag === "Prefix" && v._1 === v1._1) {
        return $RouteParser("Prefix", v._1, altRouteParser.alt(v._2)(v1._2));
      }
      return $RouteParser("Alt", [v, v1]);
    },
    Functor0: () => functorRouteParser
  };
  var altCons = (v) => (v1) => {
    if (v.tag === "Prefix") {
      const $0 = (() => {
        if (0 < v1.length) {
          return v1[0];
        }
        fail();
      })();
      if ($0.tag === "Prefix" && v._1 === $0._1) {
        const $1 = unconsImpl((v$1) => Nothing, (v$1) => (xs) => $Maybe("Just", xs), v1);
        return [
          $RouteParser("Prefix", v._1, altRouteParser.alt(v._2)($0._2)),
          ...(() => {
            if ($1.tag === "Just") {
              return $1._1;
            }
            fail();
          })()
        ];
      }
    }
    return [v, ...v1];
  };
  var altAppend = (ls) => (rs) => {
    const $0 = last(ls);
    const $1 = (() => {
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    if ($1.tag === "Prefix") {
      const $2 = (() => {
        if (0 < rs.length) {
          return rs[0];
        }
        fail();
      })();
      if ($2.tag === "Prefix" && $1._1 === $2._1) {
        const $3 = unconsImpl((v) => Nothing, (v) => (xs) => $Maybe("Just", xs), rs);
        const rs$p = [
          $RouteParser("Prefix", $1._1, altRouteParser.alt($1._2)($2._2)),
          ...(() => {
            if ($3.tag === "Just") {
              return $3._1;
            }
            fail();
          })()
        ];
        const $4 = (() => {
          if (ls.length === 0) {
            fail();
          }
          return sliceImpl(0, ls.length - 1 | 0, ls);
        })();
        if ($4.length > 0) {
          return altAppend($4)(rs$p);
        }
        return rs$p;
      }
    }
    return [...ls, ...rs];
  };

  // output-es/Routing.Duplex.Types/index.js
  var emptyRouteState = { segments: [], params: [], hash: "" };

  // output-es/Routing.Duplex.Printer/index.js
  var semigroupRoutePrinter = { append: (v) => (v1) => (x3) => v1(v(x3)) };
  var put = (str2) => (state) => ({ ...state, segments: snoc2(state.segments)(str2) });
  var printPath = (v) => (v.segments.length === 1 && v.segments[0] === "" ? "/" : joinWith("/")(mapMaybe2(encodeURIComponent2)(v.segments))) + (v.params.length === 0 ? "" : "?" + joinWith("&")(mapMaybe2((v$1) => {
    if (v$1._2 === "") {
      return _encodeURIComponent((v$2) => Nothing, Just, v$1._1);
    }
    const $0 = _encodeURIComponent((v$2) => Nothing, Just, v$1._1);
    const $1 = _encodeURIComponent((v$2) => Nothing, Just, v$1._2);
    const $2 = (() => {
      if ($1.tag === "Nothing") {
        return $Maybe("Just", "=");
      }
      if ($1.tag === "Just") {
        return $Maybe("Just", "=" + $1._1);
      }
      fail();
    })();
    if ($0.tag === "Nothing") {
      return $2;
    }
    if ($2.tag === "Nothing") {
      return $0;
    }
    if ($0.tag === "Just" && $2.tag === "Just") {
      return $Maybe("Just", $0._1 + $2._1);
    }
    fail();
  })(v.params))) + (v.hash === "" ? "" : "#" + v.hash);
  var monoidRoutePRinter = { mempty: (x3) => x3, Semigroup0: () => semigroupRoutePrinter };

  // output-es/Routing.Duplex/index.js
  var $RouteDuplex = (_1, _2) => ({ tag: "RouteDuplex", _1, _2 });
  var RouteDuplex = (value0) => (value1) => $RouteDuplex(value0, value1);
  var profunctorRouteDuplex = { dimap: (f) => (g) => (v) => $RouteDuplex((x3) => v._1(f(x3)), functorRouteParser.map(g)(v._2)) };
  var prefix = (s) => (v) => $RouteDuplex(
    (a) => {
      const $0 = v._1(a);
      return (x3) => $0({ ...x3, segments: snoc2(x3.segments)(s) });
    },
    $RouteParser("Prefix", s, v._2)
  );
  var path = /* @__PURE__ */ (() => {
    const $0 = foldrArray(prefix);
    const $1 = split("/");
    return (x3) => {
      const $2 = $1(x3);
      return (a) => $0(a)($2);
    };
  })();
  var root = /* @__PURE__ */ path("");
  var parse2 = (v) => run2(v._2);
  var functorRouteDuplex = { map: (f) => (m) => $RouteDuplex(m._1, functorRouteParser.map(f)(m._2)) };
  var end2 = (v) => $RouteDuplex(
    v._1,
    applyRouteParser.apply(functorRouteParser.map($$const)(v._2))(end)
  );
  var applyRouteDuplex = {
    apply: (v) => (v1) => $RouteDuplex(
      (x3) => {
        const $0 = v._1(x3);
        const $1 = v1._1(x3);
        return (x$1) => $1($0(x$1));
      },
      applyRouteParser.apply(v._2)(v1._2)
    ),
    Functor0: () => functorRouteDuplex
  };
  var applicativeRouteDuplex = {
    pure: /* @__PURE__ */ (() => {
      const $0 = RouteDuplex((v) => monoidRoutePRinter.mempty);
      return (x3) => $0($RouteParser("Chomp", (a) => $RouteResult("Success", a, x3)));
    })(),
    Apply0: () => applyRouteDuplex
  };

  // output-es/Routing.Duplex.Generic/index.js
  var identity13 = (x3) => x3;
  var noArgs = /* @__PURE__ */ (() => applicativeRouteDuplex.pure(NoArguments))();
  var gRouteProduct = { gRouteDuplexCtr: identity13 };
  var gRouteNoArguments = { gRouteDuplexCtr: identity13 };
  var product2 = (dictGRouteDuplexCtr) => (v) => (l) => {
    const v1 = dictGRouteDuplexCtr.gRouteDuplexCtr(l);
    return $RouteDuplex(
      (v2) => {
        const $0 = v._1(v2._1);
        const $1 = v1._1(v2._2);
        return (x3) => $1($0(x3));
      },
      applyRouteParser.apply(functorRouteParser.map(Product)(functorRouteParser.map(Argument)(v._2)))(v1._2)
    );
  };
  var gRouteSum = (dictGRouteDuplex) => (dictGRouteDuplex1) => ({
    gRouteDuplex: (end$p) => (r) => {
      const v = dictGRouteDuplex.gRouteDuplex(end$p)(r);
      const v1 = dictGRouteDuplex1.gRouteDuplex(end$p)(r);
      return $RouteDuplex(
        (v2) => {
          if (v2.tag === "Inl") {
            return v._1(v2._1);
          }
          if (v2.tag === "Inr") {
            return v1._1(v2._1);
          }
          fail();
        },
        altRouteParser.alt(functorRouteParser.map(Inl)(v._2))(functorRouteParser.map(Inr)(v1._2))
      );
    }
  });
  var sum = (dictGeneric) => {
    const from = dictGeneric.from;
    const to = dictGeneric.to;
    return (dictGRouteDuplex) => {
      const $0 = dictGRouteDuplex.gRouteDuplex(end2);
      return (x3) => profunctorRouteDuplex.dimap(from)(to)($0(x3));
    };
  };
  var gRouteConstructor = (dictIsSymbol) => () => (dictGRouteDuplexCtr) => ({
    gRouteDuplex: (end$p) => (r) => {
      const v = end$p(dictGRouteDuplexCtr.gRouteDuplexCtr(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(r)));
      return $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Constructor)(v._2));
    }
  });
  var gRouteAll = { gRouteDuplexCtr: (v) => $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Argument)(v._2)) };

  // output-es/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output-es/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output-es/Data.Enum/index.js
  var enumInt = {
    succ: (n) => {
      if (n < 2147483647) {
        return $Maybe("Just", n + 1 | 0);
      }
      return Nothing;
    },
    pred: (n) => {
      if (n > -2147483648) {
        return $Maybe("Just", n - 1 | 0);
      }
      return Nothing;
    },
    Ord0: () => ordInt
  };
  var enumFromTo = (dictEnum) => {
    const Ord0 = dictEnum.Ord0();
    return (dictUnfoldable1) => (v) => (v1) => {
      if (Ord0.Eq0().eq(v)(v1)) {
        return replicate1(dictUnfoldable1)(1)(v);
      }
      if (Ord0.compare(v)(v1) === "LT") {
        return dictUnfoldable1.unfoldr1((a) => $Tuple(
          a,
          (() => {
            const $0 = dictEnum.succ(a);
            if ($0.tag === "Just") {
              if (Ord0.compare($0._1)(v1) !== "GT") {
                return $Maybe("Just", $0._1);
              }
              return Nothing;
            }
            if ($0.tag === "Nothing") {
              return Nothing;
            }
            fail();
          })()
        ))(v);
      }
      return dictUnfoldable1.unfoldr1((a) => $Tuple(
        a,
        (() => {
          const $0 = dictEnum.pred(a);
          if ($0.tag === "Just") {
            if (Ord0.compare($0._1)(v1) !== "LT") {
              return $Maybe("Just", $0._1);
            }
            return Nothing;
          }
          if ($0.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()
      ))(v);
    };
  };

  // output-es/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str2) {
      return str2.codePointAt(0);
    } : fallback;
  };
  var _codePointAt = function(fallback) {
    return function(Just2) {
      return function(Nothing2) {
        return function(unsafeCodePointAt02) {
          return function(index2) {
            return function(str2) {
              var length5 = str2.length;
              if (index2 < 0 || index2 >= length5)
                return Nothing2;
              if (hasStringIterator) {
                var iter = str2[Symbol.iterator]();
                for (var i = index2; ; --i) {
                  var o = iter.next();
                  if (o.done)
                    return Nothing2;
                  if (i === 0)
                    return Just2(unsafeCodePointAt02(o.value));
                }
              }
              return fallback(index2)(str2);
            };
          };
        };
      };
    };
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

  // output-es/Data.String.CodePoints/index.js
  var uncons3 = (s) => {
    const v = length(s);
    if (v === 0) {
      return Nothing;
    }
    if (v === 1) {
      return $Maybe("Just", { head: toCharCode(charAt(0)(s)), tail: "" });
    }
    const cu1 = toCharCode(charAt(1)(s));
    const cu0 = toCharCode(charAt(0)(s));
    if (55296 <= cu0 && cu0 <= 56319 && 56320 <= cu1 && cu1 <= 57343) {
      return $Maybe("Just", { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop(2)(s) });
    }
    return $Maybe("Just", { head: cu0, tail: drop(1)(s) });
  };
  var unconsButWithTuple = (s) => {
    const $0 = uncons3(s);
    if ($0.tag === "Just") {
      return $Maybe("Just", $Tuple($0._1.head, $0._1.tail));
    }
    return Nothing;
  };
  var toCodePointArrayFallback = (s) => unfoldableArray.unfoldr(unconsButWithTuple)(s);
  var unsafeCodePointAt0Fallback = (s) => {
    const cu0 = toCharCode(charAt(0)(s));
    if (55296 <= cu0 && cu0 <= 56319 && length(s) > 1) {
      const cu1 = toCharCode(charAt(1)(s));
      if (56320 <= cu1 && cu1 <= 57343) {
        return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
      }
    }
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var codePointAtFallback = (codePointAtFallback$a0$copy) => (codePointAtFallback$a1$copy) => {
    let codePointAtFallback$a0 = codePointAtFallback$a0$copy, codePointAtFallback$a1 = codePointAtFallback$a1$copy, codePointAtFallback$c = true, codePointAtFallback$r;
    while (codePointAtFallback$c) {
      const n = codePointAtFallback$a0, s = codePointAtFallback$a1;
      const v = uncons3(s);
      if (v.tag === "Just") {
        if (n === 0) {
          codePointAtFallback$c = false;
          codePointAtFallback$r = $Maybe("Just", v._1.head);
          continue;
        }
        codePointAtFallback$a0 = n - 1 | 0;
        codePointAtFallback$a1 = v._1.tail;
        continue;
      }
      codePointAtFallback$c = false;
      codePointAtFallback$r = Nothing;
    }
    return codePointAtFallback$r;
  };
  var codePointAt = (v) => (v1) => {
    if (v < 0) {
      return Nothing;
    }
    if (v === 0) {
      if (v1 === "") {
        return Nothing;
      }
      return $Maybe("Just", unsafeCodePointAt0(v1));
    }
    return _codePointAt(codePointAtFallback)(Just)(Nothing)(unsafeCodePointAt0)(v)(v1);
  };

  // output-es/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output-es/Web.HTML.Location/foreign.js
  function hash3(location3) {
    return function() {
      return location3.hash;
    };
  }
  function setHash(hash4) {
    return function(location3) {
      return function() {
        location3.hash = hash4;
      };
    };
  }

  // output-es/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name2, value2) {
    if (typeof window !== "undefined") {
      var ty = window[name2];
      if (ty != null && value2 instanceof ty) {
        return just(value2);
      }
    }
    var obj = value2;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name2) {
        return just(value2);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output-es/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = (name2) => (value2) => _unsafeReadProtoTagged(Nothing, Just, name2, value2);

  // output-es/Web.HTML.Window/foreign.js
  function document2(window2) {
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

  // output-es/Routing.Hash/index.js
  var setHash2 = (h) => {
    const $0 = setHash(h);
    return () => {
      const $1 = windowImpl();
      const $2 = location($1)();
      return $0($2)();
    };
  };
  var getHash = () => {
    const $0 = windowImpl();
    const $1 = location($0)();
    const a$p = hash3($1)();
    const $2 = stripPrefix("#")(a$p);
    if ($2.tag === "Nothing") {
      return "";
    }
    if ($2.tag === "Just") {
      return $2._1;
    }
    fail();
  };
  var foldHashes = (cb) => (init) => () => {
    const $0 = getHash();
    const $1 = init($0)();
    let ref = $1;
    const win = windowImpl();
    const listener = eventListener((v) => () => {
      const a$p = ref;
      const a$p$1 = getHash();
      const $2 = cb(a$p)(a$p$1)();
      return ref = $2;
    })();
    addEventListener2("hashchange")(listener)(false)(win)();
    return removeEventListener2("hashchange")(listener)(false)(win);
  };
  var matchesWith = (dictFoldable) => (parser) => (cb) => {
    const go = (a) => {
      const $0 = indexl(dictFoldable)(0);
      return (x3) => {
        const $1 = $0(parser(x3));
        if ($1.tag === "Nothing") {
          return () => a;
        }
        if ($1.tag === "Just") {
          const $2 = $1._1;
          const $3 = cb(a)($2);
          return () => {
            $3();
            return $Maybe("Just", $2);
          };
        }
        fail();
      };
    };
    return foldHashes(($0) => go($0))(go(Nothing));
  };

  // output-es/Capability.Navigate/index.js
  var $Route = (tag, _1, _2) => ({ tag, _1, _2 });
  var Home = /* @__PURE__ */ $Route("Home");
  var About = /* @__PURE__ */ $Route("About");
  var Instructions = /* @__PURE__ */ $Route("Instructions");
  var LevelSelect = /* @__PURE__ */ $Route("LevelSelect");
  var genericRoute_ = {
    to: (x3) => {
      if (x3.tag === "Inl") {
        return Home;
      }
      if (x3.tag === "Inr") {
        if (x3._1.tag === "Inl") {
          return About;
        }
        if (x3._1.tag === "Inr") {
          if (x3._1._1.tag === "Inl") {
            return Instructions;
          }
          if (x3._1._1.tag === "Inr") {
            if (x3._1._1._1.tag === "Inl") {
              return LevelSelect;
            }
            if (x3._1._1._1.tag === "Inr") {
              return $Route("Level", x3._1._1._1._1._1, x3._1._1._1._1._2);
            }
          }
        }
      }
      fail();
    },
    from: (x3) => {
      if (x3.tag === "Home") {
        return $Sum("Inl", NoArguments);
      }
      if (x3.tag === "About") {
        return $Sum("Inr", $Sum("Inl", NoArguments));
      }
      if (x3.tag === "Instructions") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
      }
      if (x3.tag === "LevelSelect") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
      }
      if (x3.tag === "Level") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", $Product(x3._1, x3._2)))));
      }
      fail();
    }
  };
  var underscoreSegment = /* @__PURE__ */ (() => profunctorRouteDuplex.dimap(replaceAll(" ")("_"))(replaceAll("_")(" "))($RouteDuplex(
    put,
    take2
  )))();
  var routeCodec = /* @__PURE__ */ root(/* @__PURE__ */ sum(genericRoute_)(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "Home"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "About"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "Instructions"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteSum(/* @__PURE__ */ gRouteConstructor({
    reflectSymbol: () => "LevelSelect"
  })()(gRouteNoArguments))(/* @__PURE__ */ gRouteConstructor({ reflectSymbol: () => "Level" })()(gRouteProduct))))))({
    Home: noArgs,
    About: /* @__PURE__ */ prefix("about")(noArgs),
    Instructions: /* @__PURE__ */ prefix("how-to-play")(noArgs),
    LevelSelect: /* @__PURE__ */ prefix("level-select")(noArgs),
    Level: /* @__PURE__ */ prefix("level")(/* @__PURE__ */ product2(gRouteAll)(underscoreSegment)(underscoreSegment))
  }));
  var navigateTo = (dictMonadEffect) => (route) => dictMonadEffect.liftEffect(setHash2(printPath(routeCodec._1(route)(emptyRouteState))));

  // output-es/Data.Lens.Internal.Forget/index.js
  var profunctorForget = { dimap: (f) => (v) => (v1) => (x3) => v1(f(x3)) };
  var strongForget = { first: (v) => (x3) => v(x3._1), second: (v) => (x3) => v(x3._2), Profunctor0: () => profunctorForget };
  var choiceForget = (dictMonoid) => {
    const mempty1 = dictMonoid.mempty;
    return {
      left: (v) => (v2) => {
        if (v2.tag === "Left") {
          return v(v2._1);
        }
        if (v2.tag === "Right") {
          return mempty1;
        }
        fail();
      },
      right: (v) => (v2) => {
        if (v2.tag === "Left") {
          return mempty1;
        }
        if (v2.tag === "Right") {
          return v(v2._1);
        }
        fail();
      },
      Profunctor0: () => profunctorForget
    };
  };

  // output-es/Data.Lens.Internal.Tagged/index.js
  var taggedProfunctor = { dimap: (v) => (g) => (v1) => g(v1) };
  var taggedChoice = { left: (v) => $Either("Left", v), right: (v) => $Either("Right", v), Profunctor0: () => taggedProfunctor };

  // output-es/Data.Lens.Prism/index.js
  var prism = (to) => (fro) => (dictChoice) => {
    const Profunctor0 = dictChoice.Profunctor0();
    return (pab) => Profunctor0.dimap(fro)((v2) => {
      if (v2.tag === "Left") {
        return v2._1;
      }
      if (v2.tag === "Right") {
        return v2._1;
      }
      fail();
    })(dictChoice.right(Profunctor0.dimap(identity12)(to)(pab)));
  };
  var prism$p = (to) => (fro) => (dictChoice) => prism(to)((s) => {
    const $0 = fro(s);
    if ($0.tag === "Nothing") {
      return $Either("Left", s);
    }
    if ($0.tag === "Just") {
      return $Either("Right", $0._1);
    }
    fail();
  })(dictChoice);
  var only = (dictEq) => (x3) => (dictChoice) => prism$p((v) => x3)((x$1) => {
    if (dictEq.eq(x$1)(x3)) {
      return $Maybe("Just", void 0);
    }
    return Nothing;
  })(dictChoice);

  // output-es/Web.Storage.Storage/foreign.js
  function _getItem(key2) {
    return function(storage) {
      return function() {
        return storage.getItem(key2);
      };
    };
  }
  function setItem(key2) {
    return function(value2) {
      return function(storage) {
        return function() {
          storage.setItem(key2, value2);
        };
      };
    };
  }
  function clear2(storage) {
    return function() {
      storage.clear();
    };
  }

  // output-es/Web.Storage.Storage/index.js
  var getItem = (s) => {
    const $0 = _getItem(s);
    return (x3) => {
      const $1 = $0(x3);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Capability.Progress/index.js
  var $LevelProgress = (tag) => tag;
  var show = (record) => "{ levelName: " + showStringImpl(record.levelName) + ", suiteName: " + showStringImpl(record.suiteName) + " }";
  var Incomplete = /* @__PURE__ */ $LevelProgress("Incomplete");
  var Completed = /* @__PURE__ */ $LevelProgress("Completed");
  var showLevelProgress = {
    show: (v) => {
      if (v === "Incomplete") {
        return "Incomplete";
      }
      if (v === "Completed") {
        return "Completed";
      }
      fail();
    }
  };
  var semigroupLevelProgress = {
    append: (v) => (v1) => {
      if (v === "Completed" && v1 === "Completed") {
        return Completed;
      }
      return Incomplete;
    }
  };
  var levelProgress = (dictChoice) => prism$p((v) => {
    if (v === "Incomplete") {
      return "Incomplete";
    }
    if (v === "Completed") {
      return "Completed";
    }
    fail();
  })((v) => {
    if (v === "Incomplete") {
      return $Maybe("Just", Incomplete);
    }
    if (v === "Completed") {
      return $Maybe("Just", Completed);
    }
    return Nothing;
  })(dictChoice);
  var levelProgress1 = /* @__PURE__ */ levelProgress(taggedChoice);
  var levelProgress2 = /* @__PURE__ */ levelProgress(/* @__PURE__ */ choiceForget(monoidFirst));
  var saveLevelProgress = (dictMonadEffect) => (id4) => (progress) => dictMonadEffect.liftEffect((() => {
    const $0 = setItem(show(id4))(levelProgress1(progress));
    return () => {
      const $1 = windowImpl();
      const $2 = localStorage($1)();
      return $0($2)();
    };
  })());
  var getLevelProgress = (dictMonadEffect) => (id4) => dictMonadEffect.liftEffect((() => {
    const $0 = getItem(show(id4));
    const $1 = levelProgress2((x3) => $Maybe("Just", x3));
    return () => {
      const $2 = windowImpl();
      const $3 = localStorage($2)();
      const a$p = $0($3)();
      if (a$p.tag === "Just") {
        return $1(a$p._1);
      }
      if (a$p.tag === "Nothing") {
        return Nothing;
      }
      fail();
    };
  })());
  var deleteProgress = (dictMonadEffect) => dictMonadEffect.liftEffect(() => {
    const $0 = windowImpl();
    const $1 = localStorage($0)();
    return clear2($1)();
  });

  // output-es/Data.Monoid/index.js
  var monoidString = { mempty: "", Semigroup0: () => semigroupString };
  var monoidOrdering = { mempty: EQ, Semigroup0: () => semigroupOrdering };
  var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };
  var power = (dictMonoid) => {
    const mempty1 = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (x3) => {
      const go = (p) => {
        if (p <= 0) {
          return mempty1;
        }
        if (p === 1) {
          return x3;
        }
        if (intMod(p)(2) === 0) {
          const x$p2 = go(intDiv(p, 2));
          return $0.append(x$p2)(x$p2);
        }
        const x$p = go(intDiv(p, 2));
        return $0.append(x$p)($0.append(x$p)(x3));
      };
      return go;
    };
  };

  // output-es/Halogen.HTML.Properties/index.js
  var readOnly = /* @__PURE__ */ Property("readOnly");
  var rows = /* @__PURE__ */ Property("rows");
  var id = /* @__PURE__ */ Property("id");
  var href2 = /* @__PURE__ */ Property("href");
  var draggable = /* @__PURE__ */ Property("draggable");
  var cols = /* @__PURE__ */ Property("cols");
  var classes = /* @__PURE__ */ (() => {
    const $0 = Property("className");
    const $1 = joinWith(" ");
    const $2 = arrayMap(unsafeCoerce);
    return (x3) => $0($1($2(x3)));
  })();
  var class_ = /* @__PURE__ */ Property("className");
  var style = /* @__PURE__ */ Attribute(Nothing)("style");

  // output-es/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a) {
    return function(b) {
      return a === b;
    };
  }

  // output-es/Halogen.Subscription/index.js
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_3(foldableArray);
  var unsubscribe = (v) => v;
  var create = () => {
    let subscribers = [];
    return {
      emitter: (k) => () => {
        const $0 = subscribers;
        subscribers = [...$0, k];
        return () => {
          const $1 = subscribers;
          subscribers = deleteBy2(reallyUnsafeRefEq)(k)($1);
        };
      },
      listener: (a) => {
        const $0 = traverse_1((k) => k(a));
        return () => {
          const $1 = subscribers;
          return $0($1)();
        };
      }
    };
  };

  // output-es/Component.Title/index.js
  var value = /* @__PURE__ */ Property("value");
  var intercalate2 = /* @__PURE__ */ intercalate1(monoidString);
  var abedTitleText = [
    "    :::     :::::::::  :::::::::: ::::::::: ",
    "  :+: :+:   :+:    :+: :+:        :+:    :+:",
    " +:+   +:+  +:+    +:+ +:+        +:+    +:+",
    "+#++:++#++: +#++:++#+  +#++:++#   +#+    +:+",
    "+#+     +#+ +#+    +#+ +#+        +#+    +#+",
    "#+#     #+# #+#    #+# #+#        #+#    #+#",
    "###     ### #########  ########## ######### "
  ];
  var makeTitle = (titleText) => $VDom(
    "Elem",
    Nothing,
    "textarea",
    [
      id("title"),
      value(titleText),
      readOnly(true),
      cols(toCodePointArray(abedTitleText[0]).length - 4 | 0),
      rows(7)
    ],
    []
  );
  var html = /* @__PURE__ */ makeTitle(/* @__PURE__ */ intercalate2("\n")(abedTitleText));

  // output-es/Component.Layout.DefaultLayout/index.js
  var defaultLayout = (inner) => $VDom(
    "Elem",
    Nothing,
    "div",
    [id("default-layout")],
    [html, $VDom("Elem", Nothing, "br", [], []), $VDom("Elem", Nothing, "div", [], [inner])]
  );

  // output-es/Effect.Class/index.js
  var monadEffectEffect = { liftEffect: (x3) => x3, Monad0: () => monadEffect };

  // output-es/Component.About/index.js
  var $Action = () => ({ tag: "DeleteProgress" });
  var deleteProgress2 = /* @__PURE__ */ deleteProgress(monadEffectEffect);
  var DeleteProgress = /* @__PURE__ */ $Action();
  var component = (dictMonadAff) => ({
    eval: mkEval({
      ...defaultEval,
      handleAction: (v1) => monadEffectHalogenM(dictMonadAff.MonadEffect0()).liftEffect((() => {
        const $0 = confirm("Really delete all progress?");
        return () => {
          const $1 = windowImpl();
          const confirmDelete = $0($1)();
          if (confirmDelete) {
            return deleteProgress2();
          }
        };
      })())
    }),
    initialState: (v) => ({}),
    render: (state) => defaultLayout($VDom(
      "Elem",
      Nothing,
      "div",
      [class_("about-component")],
      [
        $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "about page")]),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "This game created by Mitch Stevens")]),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "email here"),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "Source Code: "),
        $VDom(
          "Elem",
          Nothing,
          "a",
          [href2("https://github.com/MitchStevens/abed-ps")],
          [$VDom("Text", "https://github.com/MitchStevens/abed-ps")]
        ),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom(
          "Elem",
          Nothing,
          "button",
          [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", DeleteProgress)))],
          [$VDom("Text", "Delete all progress")]
        )
      ]
    ))
  });

  // output-es/Component.Home/index.js
  var $Action2 = (_1) => ({ tag: "NavigateTo", _1 });
  var component2 = (dictMonadAff) => {
    const navigateTo2 = navigateTo(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return {
      eval: mkEval({ ...defaultEval, handleAction: (v1) => navigateTo2(v1._1), initialize: Nothing }),
      initialState: (v) => ({ titleText: "" }),
      render: (state) => defaultLayout($VDom(
        "Elem",
        Nothing,
        "div",
        [id("home-component")],
        [
          $VDom(
            "Elem",
            Nothing,
            "a",
            [
              $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action2(LevelSelect)))),
              class_("link")
            ],
            [$VDom("Text", "Choose a level")]
          ),
          $VDom("Elem", Nothing, "br", [], []),
          $VDom(
            "Elem",
            Nothing,
            "a",
            [
              $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action2(Instructions)))),
              class_("link")
            ],
            [$VDom("Text", "How to play")]
          ),
          $VDom("Elem", Nothing, "br", [], []),
          $VDom(
            "Elem",
            Nothing,
            "a",
            [
              $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action2(About)))),
              class_("link")
            ],
            [$VDom("Text", "About")]
          )
        ]
      ))
    };
  };

  // output-es/Component.Instructions/index.js
  var component3 = (dictMonadAff) => ({
    eval: mkEval(defaultEval),
    initialState: (v) => ({}),
    render: (state) => defaultLayout($VDom(
      "Elem",
      Nothing,
      "div",
      [],
      [
        $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "How to play")]),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "Pieces")]),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "Board")]),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "Specification")])
      ]
    ))
  });

  // output-es/Web.DOM.DOMTokenList/foreign.js
  function add(list) {
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

  // output-es/Web.DOM.Element/foreign.js
  var getProp = function(name2) {
    return function(doctype) {
      return doctype[name2];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");
  function classList(element) {
    return function() {
      return element.classList;
    };
  }
  function scrollTop(node) {
    return function() {
      return node.scrollTop;
    };
  }
  function setScrollTop(scrollTop2) {
    return function(node) {
      return function() {
        node.scrollTop = scrollTop2;
      };
    };
  }
  function scrollHeight(el) {
    return function() {
      return el.scrollHeight;
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

  // output-es/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
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

  // output-es/Web.DOM.ParentNode/index.js
  var querySelector = (qs) => {
    const $0 = _querySelector(qs);
    return (x3) => {
      const $1 = $0(x3);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Capability.Animate/index.js
  var headShake = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const Monad0 = MonadEffect0.Monad0();
    const Bind1 = Monad0.Bind1();
    const for_8 = for_(Monad0.Applicative0())(foldableMaybe);
    return (selector) => Bind1.bind(MonadEffect0.liftEffect(() => {
      const $0 = windowImpl();
      return document2($0)();
    }))((htmlDocument) => Bind1.bind(MonadEffect0.liftEffect(querySelector(selector)(htmlDocument)))((maybeElement) => for_8(maybeElement)((element) => Bind1.bind(MonadEffect0.liftEffect(classList(element)))((tokenList) => Bind1.bind(MonadEffect0.liftEffect(add(tokenList)("head-shake")))(() => Bind1.bind(dictMonadAff.liftAff(_delay(
      Right,
      1e3
    )))(() => MonadEffect0.liftEffect(remove(tokenList)("head-shake"))))))));
  };

  // output-es/Halogen.Query.Event/index.js
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var eventListener2 = (eventType) => (target) => (f) => (push2) => {
    const $0 = eventListener((ev) => traverse_4(push2)(f(ev)));
    return () => {
      const listener = $0();
      addEventListener2(eventType)(listener)(false)(target)();
      return removeEventListener2(eventType)(listener)(false)(target);
    };
  };

  // output-es/Capability.GlobalEventEmmiters/index.js
  var globalMouseMoveEventEmitter = () => {
    const $0 = windowImpl();
    const htmlDocument = document2($0)();
    return eventListener2("mousemove")(htmlDocument)(unsafeReadProtoTagged("MouseEvent"));
  };
  var globalKeyDownEventEmitter = () => {
    const $0 = windowImpl();
    const htmlDocument = document2($0)();
    return eventListener2("keydown")(htmlDocument)(unsafeReadProtoTagged("KeyboardEvent"));
  };

  // output-es/Control.Category/index.js
  var categoryFn = { identity: (x3) => x3, Semigroupoid0: () => semigroupoidFn };

  // output-es/Data.Profunctor.Strong/index.js
  var identity14 = (x3) => x3;
  var strongFn = /* @__PURE__ */ (() => ({ first: (a2b) => (v) => $Tuple(a2b(v._1), v._2), second: functorTuple.map, Profunctor0: () => profunctorFn }))();
  var fanout = (dictCategory) => {
    const identity1 = dictCategory.identity;
    const $0 = dictCategory.Semigroupoid0();
    const $1 = dictCategory.Semigroupoid0();
    return (dictStrong) => (l) => (r) => $0.compose($1.compose(dictStrong.second(r))(dictStrong.first(l)))(dictStrong.Profunctor0().dimap(identity14)((a) => $Tuple(a, a))(identity1));
  };

  // output-es/Data.Lens.Getter/index.js
  var identity15 = (x3) => x3;
  var use = (dictMonadState) => (p) => dictMonadState.state((s) => $Tuple(p(identity15)(s), s));

  // output-es/Data.Lens.Prism.Maybe/index.js
  var _Just = (dictChoice) => prism(Just)((v2) => {
    if (v2.tag === "Nothing") {
      return $Either("Left", Nothing);
    }
    if (v2.tag === "Just") {
      return $Either("Right", v2._1);
    }
    fail();
  })(dictChoice);

  // output-es/Data.Lens.Record/index.js
  var prop2 = (dictIsSymbol) => () => () => (l) => (dictStrong) => (pab) => dictStrong.Profunctor0().dimap((s) => $Tuple(
    unsafeGet(dictIsSymbol.reflectSymbol(l))(s),
    (b) => unsafeSet(dictIsSymbol.reflectSymbol(l))(b)(s)
  ))((v) => v._2(v._1))(dictStrong.first(pab));

  // output-es/Data.Zipper/index.js
  var $Zipper = (_1, _2, _3) => ({ tag: "Zipper", _1, _2, _3 });
  var moveRight = (v) => {
    if (v._3.tag === "Nil") {
      return Nothing;
    }
    if (v._3.tag === "Cons") {
      return $Maybe("Just", $Zipper($List("Cons", v._2, v._1), v._3._1, v._3._2));
    }
    fail();
  };
  var moveLeft = (v) => {
    if (v._1.tag === "Nil") {
      return Nothing;
    }
    if (v._1.tag === "Cons") {
      return $Maybe("Just", $Zipper(v._1._2, v._1._1, $List("Cons", v._2, v._3)));
    }
    fail();
  };

  // output-es/Data.Lens.AffineTraversal/index.js
  var fanout2 = /* @__PURE__ */ fanout(categoryFn)(strongFn);
  var affineTraversal = ($$set) => (pre) => (dictStrong) => (dictChoice) => {
    const $0 = fanout2($$set)(pre);
    return (pab) => dictChoice.Profunctor0().dimap($0)((v) => {
      if (v._2.tag === "Left") {
        return v._2._1;
      }
      if (v._2.tag === "Right") {
        return v._1(v._2._1);
      }
      fail();
    })(dictStrong.second(dictChoice.right(pab)));
  };

  // output-es/Data.Lens.Iso/index.js
  var coerced = () => () => (dictProfunctor) => (pab) => dictProfunctor.dimap(unsafeCoerce)(unsafeCoerce)(pab);

  // output-es/Data.Lens.Iso.Newtype/index.js
  var _Newtype = () => () => (dictProfunctor) => coerced()()(dictProfunctor);

  // output-es/Data.Lens.Index/index.js
  var indexMap = (dictOrd) => ({
    ix: (k) => (dictStrong) => (dictChoice) => affineTraversal((s) => (b) => update(dictOrd)((v) => $Maybe("Just", b))(k)(s))((s) => {
      const $0 = lookup(dictOrd)(k)(s);
      if ($0.tag === "Nothing") {
        return $Either("Left", s);
      }
      if ($0.tag === "Just") {
        return $Either("Right", $0._1);
      }
      fail();
    })(dictStrong)(dictChoice)
  });

  // output-es/Data.Lens.At/index.js
  var atMap = (dictOrd) => {
    const indexMap2 = indexMap(dictOrd);
    return {
      at: (k) => (dictStrong) => {
        const $0 = lookup(dictOrd)(k);
        return (pab) => dictStrong.Profunctor0().dimap((s) => $Tuple(
          $0(s),
          (b) => {
            if (b.tag === "Nothing") {
              return $$delete(dictOrd)(k)(s);
            }
            if (b.tag === "Just") {
              return insert(dictOrd)(k)(b._1)(s);
            }
            fail();
          }
        ))((v) => v._2(v._1))(dictStrong.first(pab));
      },
      Index0: () => indexMap2
    };
  };

  // output-es/Data.Profunctor.Choice/index.js
  var choiceFn = /* @__PURE__ */ (() => ({
    left: (v) => (v1) => {
      if (v1.tag === "Left") {
        return $Either("Left", v(v1._1));
      }
      if (v1.tag === "Right") {
        return $Either("Right", v1._1);
      }
      fail();
    },
    right: functorEither.map,
    Profunctor0: () => profunctorFn
  }))();

  // output-es/Data.Set/index.js
  var foldableSet = {
    foldMap: (dictMonoid) => {
      const foldMap1 = foldableList.foldMap(dictMonoid);
      return (f) => {
        const $0 = foldMap1(f);
        return (x3) => $0(foldableWithIndexMap.foldrWithIndex((k) => (v) => (acc) => $List("Cons", k, acc))(Nil)(x3));
      };
    },
    foldl: (f) => (x3) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = f(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      const $0 = go(x3);
      return (x$1) => $0(foldableWithIndexMap.foldrWithIndex((k) => (v) => (acc) => $List("Cons", k, acc))(Nil)(x$1));
    },
    foldr: (f) => (x3) => {
      const $0 = foldableList.foldr(f)(x3);
      return (x$1) => $0(foldableWithIndexMap.foldrWithIndex((k) => (v) => (acc) => $List("Cons", k, acc))(Nil)(x$1));
    }
  };
  var ordSet = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqSet1 = { eq: (v) => (v1) => eqMap($0)(eqUnit).eq(v)(v1) };
    return {
      compare: (s1) => (s2) => ordList(dictOrd).compare(foldableWithIndexMap.foldrWithIndex((k) => (v) => (acc) => $List("Cons", k, acc))(Nil)(s1))(foldableWithIndexMap.foldrWithIndex((k) => (v) => (acc) => $List(
        "Cons",
        k,
        acc
      ))(Nil)(s2)),
      Eq0: () => eqSet1
    };
  };

  // output-es/Data.Compactable/index.js
  var compactableArray = {
    compact: (xs) => {
      const result = [];
      const $0 = { value: 0 };
      iterate($Iterator(
        (v) => {
          if (v >= 0 && v < xs.length) {
            return $Maybe("Just", xs[v]);
          }
          return Nothing;
        },
        $0
      ))((x3) => {
        const $1 = (() => {
          if (x3.tag === "Nothing") {
            return () => 0;
          }
          if (x3.tag === "Just") {
            return () => result.push(x3._1);
          }
          fail();
        })();
        return () => {
          $1();
        };
      })();
      return result;
    },
    separate: (xs) => {
      const ls = [];
      const rs = [];
      const $0 = { value: 0 };
      iterate($Iterator(
        (v) => {
          if (v >= 0 && v < xs.length) {
            return $Maybe("Just", xs[v]);
          }
          return Nothing;
        },
        $0
      ))((x3) => {
        const $1 = (() => {
          if (x3.tag === "Left") {
            return () => ls.push(x3._1);
          }
          if (x3.tag === "Right") {
            return () => rs.push(x3._1);
          }
          fail();
        })();
        return () => {
          $1();
        };
      })();
      return { left: ls, right: rs };
    }
  };

  // output-es/Data.Filterable/index.js
  var filterableArray = {
    partitionMap: (p) => foldlArray((acc) => (x3) => {
      const v = p(x3);
      if (v.tag === "Left") {
        return { ...acc, left: [...acc.left, v._1] };
      }
      if (v.tag === "Right") {
        return { ...acc, right: [...acc.right, v._1] };
      }
      fail();
    })({ left: [], right: [] }),
    partition,
    filterMap: mapMaybe2,
    filter: filter2,
    Compactable0: () => compactableArray,
    Functor1: () => functorArray
  };

  // output-es/Data.Witherable/index.js
  var witherableArray = {
    wilt: (dictApplicative) => {
      const separate = witherableArray.Filterable0().Compactable0().separate;
      const traverse1 = witherableArray.Traversable1().traverse(dictApplicative);
      return (p) => {
        const $0 = dictApplicative.Apply0().Functor0().map(separate);
        const $1 = traverse1(p);
        return (x3) => $0($1(x3));
      };
    },
    wither: (dictApplicative) => {
      const compact = witherableArray.Filterable0().Compactable0().compact;
      const traverse1 = witherableArray.Traversable1().traverse(dictApplicative);
      return (p) => {
        const $0 = dictApplicative.Apply0().Functor0().map(compact);
        const $1 = traverse1(p);
        return (x3) => $0($1(x3));
      };
    },
    Filterable0: () => filterableArray,
    Traversable1: () => traversableArray
  };

  // output-es/Game.Direction/index.js
  var $CardinalDirection = (tag) => tag;
  var Up = /* @__PURE__ */ $CardinalDirection("Up");
  var Right2 = /* @__PURE__ */ $CardinalDirection("Right");
  var Down = /* @__PURE__ */ $CardinalDirection("Down");
  var Left2 = /* @__PURE__ */ $CardinalDirection("Left");
  var showCardinalDirection = {
    show: (v) => {
      if (v === "Up") {
        return "Up";
      }
      if (v === "Right") {
        return "Right";
      }
      if (v === "Down") {
        return "Down";
      }
      if (v === "Left") {
        return "Left";
      }
      fail();
    }
  };
  var eqCardinalDirection = {
    eq: (x3) => (y3) => {
      if (x3 === "Up") {
        return y3 === "Up";
      }
      if (x3 === "Right") {
        return y3 === "Right";
      }
      if (x3 === "Down") {
        return y3 === "Down";
      }
      return x3 === "Left" && y3 === "Left";
    }
  };
  var ordCardinalDirection = {
    compare: (x3) => (y3) => {
      if (x3 === "Up") {
        if (y3 === "Up") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Up") {
        return GT;
      }
      if (x3 === "Right") {
        if (y3 === "Right") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Right") {
        return GT;
      }
      if (x3 === "Down") {
        if (y3 === "Down") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Down") {
        return GT;
      }
      if (x3 === "Left" && y3 === "Left") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqCardinalDirection
  };
  var enumCardinalDirection = {
    succ: (v) => {
      if (v === "Up") {
        return $Maybe("Just", Right2);
      }
      if (v === "Right") {
        return $Maybe("Just", Down);
      }
      if (v === "Down") {
        return $Maybe("Just", Left2);
      }
      if (v === "Left") {
        return Nothing;
      }
      fail();
    },
    pred: (v) => {
      if (v === "Up") {
        return Nothing;
      }
      if (v === "Right") {
        return $Maybe("Just", Up);
      }
      if (v === "Down") {
        return $Maybe("Just", Right2);
      }
      if (v === "Left") {
        return $Maybe("Just", Down);
      }
      fail();
    },
    Ord0: () => ordCardinalDirection
  };
  var boundedCardinalDirection = { bottom: Up, top: Left2, Ord0: () => ordCardinalDirection };
  var boundedEnumCardinalDirect = {
    cardinality: 4,
    fromEnum: (v) => {
      if (v === "Up") {
        return 0;
      }
      if (v === "Right") {
        return 1;
      }
      if (v === "Down") {
        return 2;
      }
      if (v === "Left") {
        return 3;
      }
      fail();
    },
    toEnum: (v) => {
      if (v === 0) {
        return $Maybe("Just", Up);
      }
      if (v === 1) {
        return $Maybe("Just", Right2);
      }
      if (v === 2) {
        return $Maybe("Just", Down);
      }
      if (v === 3) {
        return $Maybe("Just", Left2);
      }
      return Nothing;
    },
    Bounded0: () => boundedCardinalDirection,
    Enum1: () => enumCardinalDirection
  };
  var rotateDirection = (dir2) => (rot) => {
    const $0 = boundedEnumCardinalDirect.toEnum(intMod((() => {
      if (dir2 === "Up") {
        return 0 + rot | 0;
      }
      if (dir2 === "Right") {
        return 1 + rot | 0;
      }
      if (dir2 === "Down") {
        return 2 + rot | 0;
      }
      if (dir2 === "Left") {
        return 3 + rot | 0;
      }
      fail();
    })())(4));
    if ($0.tag === "Nothing") {
      return Up;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };
  var clockwiseRotation = (d1) => (d2) => intMod((() => {
    if (d2 === "Up") {
      return 0;
    }
    if (d2 === "Right") {
      return 1;
    }
    if (d2 === "Down") {
      return 2;
    }
    if (d2 === "Left") {
      return 3;
    }
    fail();
  })() - (() => {
    if (d1 === "Up") {
      return 0;
    }
    if (d1 === "Right") {
      return 1;
    }
    if (d1 === "Down") {
      return 2;
    }
    if (d1 === "Left") {
      return 3;
    }
    fail();
  })() | 0)(4);
  var allDirections = /* @__PURE__ */ enumFromTo(enumCardinalDirection)(unfoldable1Array)(Up)(Left2);

  // output-es/Game.Location/index.js
  var showLocation = { show: (v) => "(" + showIntImpl(v.x) + "," + showIntImpl(v.y) + ")" };
  var eqLocation = { eq: (x3) => (y3) => x3.x === y3.x && x3.y === y3.y };
  var ordLocation = {
    compare: (x3) => (y3) => {
      const v = ordInt.compare(x3.x)(y3.x);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordInt.compare(x3.y)(y3.y);
    },
    Eq0: () => eqLocation
  };
  var directionTo = (l1) => (l2) => find2((d2) => {
    if (d2 === "Up") {
      return l1.x === l2.x && (l1.y - 1 | 0) === l2.y;
    }
    if (d2 === "Right") {
      return (l1.x + 1 | 0) === l2.x && l1.y === l2.y;
    }
    if (d2 === "Down") {
      return l1.x === l2.x && (l1.y + 1 | 0) === l2.y;
    }
    if (d2 === "Left") {
      return (l1.x - 1 | 0) === l2.x && l1.y === l2.y;
    }
    fail();
  })(allDirections);

  // output-es/Game.Edge/index.js
  var eqEdge = {
    eq: (x3) => (y3) => (() => {
      if (x3.dir === "Up") {
        return y3.dir === "Up";
      }
      if (x3.dir === "Right") {
        return y3.dir === "Right";
      }
      if (x3.dir === "Down") {
        return y3.dir === "Down";
      }
      return x3.dir === "Left" && y3.dir === "Left";
    })() && x3.loc.x === y3.loc.x && x3.loc.y === y3.loc.y
  };
  var ordEdge = {
    compare: (v) => (v1) => {
      const $0 = ordLocation.compare(v.loc)(v1.loc);
      const $1 = ordCardinalDirection.compare(v.dir)(v1.dir);
      if ($0 === "LT") {
        return LT;
      }
      if ($0 === "GT") {
        return GT;
      }
      if ($0 === "EQ") {
        return $1;
      }
      fail();
    },
    Eq0: () => eqEdge
  };
  var matchEdge = (v) => ({
    loc: (() => {
      if (v.dir === "Up") {
        return { x: v.loc.x, y: v.loc.y - 1 | 0 };
      }
      if (v.dir === "Right") {
        return { x: v.loc.x + 1 | 0, y: v.loc.y };
      }
      if (v.dir === "Down") {
        return { x: v.loc.x, y: v.loc.y + 1 | 0 };
      }
      if (v.dir === "Left") {
        return { x: v.loc.x - 1 | 0, y: v.loc.y };
      }
      fail();
    })(),
    dir: (() => {
      if (v.dir === "Up") {
        return Down;
      }
      if (v.dir === "Right") {
        return Left2;
      }
      if (v.dir === "Down") {
        return Up;
      }
      if (v.dir === "Left") {
        return Right2;
      }
      fail();
    })()
  });

  // output-es/Game.Board.RelativeEdge/index.js
  var showRelativeEdge = {
    show: (v) => "(RelEdge " + showLocation.show(v.loc) + " " + (() => {
      if (v.dir === "Up") {
        return "Up";
      }
      if (v.dir === "Right") {
        return "Right";
      }
      if (v.dir === "Down") {
        return "Down";
      }
      if (v.dir === "Left") {
        return "Left";
      }
      fail();
    })() + ")"
  };
  var eqRelativeEdge = {
    eq: (x3) => (y3) => (() => {
      if (x3.dir === "Up") {
        return y3.dir === "Up";
      }
      if (x3.dir === "Right") {
        return y3.dir === "Right";
      }
      if (x3.dir === "Down") {
        return y3.dir === "Down";
      }
      return x3.dir === "Left" && y3.dir === "Left";
    })() && x3.loc.x === y3.loc.x && x3.loc.y === y3.loc.y
  };
  var ordRelativeEdge = { compare: (x3) => (y3) => ordEdge.compare(x3)(y3), Eq0: () => eqRelativeEdge };
  var relativeEdgeDirection = (v) => v.dir;

  // output-es/Data.Map.Unsafe/index.js
  var unsafeMapKey = (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Two") {
        return $$$Map("Two", go(v._1), f(v._2), v._3, go(v._4));
      }
      if (v.tag === "Three") {
        return $$$Map("Three", go(v._1), f(v._2), v._3, go(v._4), f(v._5), v._6, go(v._7));
      }
      fail();
    };
    return go;
  };

  // output-es/Data.HeytingAlgebra/foreign.js
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
  var boolNot = function(b) {
    return !b;
  };

  // output-es/Data.HeytingAlgebra/index.js
  var heytingAlgebraBoolean = { ff: false, tt: true, implies: (a) => (b) => heytingAlgebraBoolean.disj(heytingAlgebraBoolean.not(a))(b), conj: boolConj, disj: boolDisj, not: boolNot };

  // output-es/Game.Capacity/index.js
  var $Capacity = (tag) => tag;
  var OneBit = /* @__PURE__ */ $Capacity("OneBit");
  var TwoBit = /* @__PURE__ */ $Capacity("TwoBit");
  var FourBit = /* @__PURE__ */ $Capacity("FourBit");
  var EightBit = /* @__PURE__ */ $Capacity("EightBit");
  var eqCapacity = {
    eq: (x3) => (y3) => {
      if (x3 === "OneBit") {
        return y3 === "OneBit";
      }
      if (x3 === "TwoBit") {
        return y3 === "TwoBit";
      }
      if (x3 === "FourBit") {
        return y3 === "FourBit";
      }
      return x3 === "EightBit" && y3 === "EightBit";
    }
  };
  var ordCapacity = {
    compare: (x3) => (y3) => {
      if (x3 === "OneBit") {
        if (y3 === "OneBit") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "OneBit") {
        return GT;
      }
      if (x3 === "TwoBit") {
        if (y3 === "TwoBit") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "TwoBit") {
        return GT;
      }
      if (x3 === "FourBit") {
        if (y3 === "FourBit") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "FourBit") {
        return GT;
      }
      if (x3 === "EightBit" && y3 === "EightBit") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqCapacity
  };
  var showCapacity = {
    show: (capacity2) => "Capacity " + showIntImpl((() => {
      if (capacity2 === "OneBit") {
        return 1;
      }
      if (capacity2 === "TwoBit") {
        return 2;
      }
      if (capacity2 === "FourBit") {
        return 4;
      }
      if (capacity2 === "EightBit") {
        return 8;
      }
      fail();
    })())
  };
  var halveCapacity = (v) => {
    if (v === "OneBit") {
      return Nothing;
    }
    if (v === "TwoBit") {
      return $Maybe("Just", OneBit);
    }
    if (v === "FourBit") {
      return $Maybe("Just", TwoBit);
    }
    if (v === "EightBit") {
      return $Maybe("Just", FourBit);
    }
    fail();
  };
  var doubleCapacity = (v) => {
    if (v === "OneBit") {
      return $Maybe("Just", TwoBit);
    }
    if (v === "TwoBit") {
      return $Maybe("Just", FourBit);
    }
    if (v === "FourBit") {
      return $Maybe("Just", EightBit);
    }
    if (v === "EightBit") {
      return Nothing;
    }
    fail();
  };

  // output-es/Game.Port/index.js
  var $PortType = (tag) => tag;
  var Input = /* @__PURE__ */ $PortType("Input");
  var Output = /* @__PURE__ */ $PortType("Output");
  var showPort = {
    show: (v) => (() => {
      if (v.portType === "Input") {
        return "Input ";
      }
      if (v.portType === "Output") {
        return "Output ";
      }
      fail();
    })() + showCapacity.show(v.capacity)
  };
  var eqPortType = {
    eq: (x3) => (y3) => {
      if (x3 === "Input") {
        return y3 === "Input";
      }
      return x3 === "Output" && y3 === "Output";
    }
  };
  var ordPortType = {
    compare: (x3) => (y3) => {
      if (x3 === "Input") {
        if (y3 === "Input") {
          return EQ;
        }
        return LT;
      }
      if (y3 === "Input") {
        return GT;
      }
      if (x3 === "Output" && y3 === "Output") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqPortType
  };
  var eqPort = {
    eq: (x3) => (y3) => (() => {
      if (x3.capacity === "OneBit") {
        return y3.capacity === "OneBit";
      }
      if (x3.capacity === "TwoBit") {
        return y3.capacity === "TwoBit";
      }
      if (x3.capacity === "FourBit") {
        return y3.capacity === "FourBit";
      }
      return x3.capacity === "EightBit" && y3.capacity === "EightBit";
    })() && (x3.portType === "Input" ? y3.portType === "Input" : x3.portType === "Output" && y3.portType === "Output")
  };
  var ordPort = {
    compare: (x3) => (y3) => {
      const v = ordCapacity.compare(x3.capacity)(y3.capacity);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordPortType.compare(x3.portType)(y3.portType);
    },
    Eq0: () => eqPort
  };
  var matchingPortType = (v) => {
    if (v === "Input") {
      return Output;
    }
    if (v === "Output") {
      return Input;
    }
    fail();
  };
  var _portType = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x3) => $0(prop2({ reflectSymbol: () => "portType" })()()($$Proxy)(dictStrong)(x3));
  };
  var _portType1 = /* @__PURE__ */ _portType(strongForget);
  var isInput = /* @__PURE__ */ _portType1(/* @__PURE__ */ only(eqPortType)(Input)(/* @__PURE__ */ choiceForget(/* @__PURE__ */ (() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })()))((v) => true));
  var isOutput = (x3) => !isInput(x3);
  var matchingPort = /* @__PURE__ */ _portType(strongFn)(matchingPortType);
  var portMatches = (port3) => (otherPort) => {
    const $0 = matchingPort(otherPort);
    return (() => {
      if (port3.capacity === "OneBit") {
        return $0.capacity === "OneBit";
      }
      if (port3.capacity === "TwoBit") {
        return $0.capacity === "TwoBit";
      }
      if (port3.capacity === "FourBit") {
        return $0.capacity === "FourBit";
      }
      return port3.capacity === "EightBit" && $0.capacity === "EightBit";
    })() && (port3.portType === "Input" ? $0.portType === "Input" : port3.portType === "Output" && $0.portType === "Output");
  };
  var portType = /* @__PURE__ */ _portType1(identity15);
  var _portCapacity = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x3) => $0(prop2({ reflectSymbol: () => "capacity" })()()($$Proxy)(dictStrong)(x3));
  };
  var portCapacity = /* @__PURE__ */ _portCapacity(strongForget)(identity15);

  // output-es/Game.Piece.Types/index.js
  var and2 = /* @__PURE__ */ and(foldableArray)(heytingAlgebraBoolean);
  var eq1 = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqPort).eq)();
  var fold = /* @__PURE__ */ (() => foldableArray.foldMap(monoidOrdering)(identity2))();
  var compare1 = /* @__PURE__ */ (() => ordMap(ordCardinalDirection)(ordPort).compare)();
  var eqPieceId = { eq: (x3) => (y3) => x3 === y3 };
  var ordPieceId = { compare: (x3) => (y3) => ordString.compare(x3)(y3), Eq0: () => eqPieceId };
  var eqPiece = { eq: (v) => (v1) => and2([v.name === v1.name, eq1(v.ports)(v1.ports)]) };
  var ordPiece = { compare: (v) => (v1) => fold([ordString.compare(v.name)(v1.name), compare1(v.ports)(v1.ports)]), Eq0: () => eqPiece };

  // output-es/Game.Board.Types/index.js
  var $BoardError = (tag, _1) => ({ tag, _1 });
  var Cyclic = /* @__PURE__ */ $BoardError("Cyclic");
  var showBoardError = {
    show: (v) => {
      if (v.tag === "LocationOccupied") {
        return "Location Occupied: " + showLocation.show(v._1);
      }
      if (v.tag === "LocationNotOccupied") {
        return "Location Not Occupied: " + showLocation.show(v._1);
      }
      if (v.tag === "InvalidLocation") {
        return "Location " + showLocation.show(v._1) + " is outside range of the board";
      }
      if (v.tag === "InvalidBoardInitialisation") {
        return "Invalid Board Initialisation: " + showIntImpl(v._1) + " is not a valid board size";
      }
      if (v.tag === "BadBoardSize") {
        return "Boards of size " + showIntImpl(v._1) + " are not valid";
      }
      if (v.tag === "Cyclic") {
        return "ABED does not admit cyclic boards";
      }
      fail();
    }
  };
  var toLocalInputs = (loc) => {
    const $0 = foldSubmapBy(ordRelativeEdge)(union(ordRelativeEdge))(Leaf2)($Maybe(
      "Just",
      { loc, dir: Up }
    ))($Maybe("Just", { loc, dir: Left2 }))(singleton);
    const $1 = unsafeMapKey(relativeEdgeDirection);
    return (x3) => $1($0(x3));
  };
  var standardBoard = { size: 3, pieces: Leaf2 };
  var _size = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x3) => $0(prop2({ reflectSymbol: () => "size" })()()($$Proxy)(dictStrong)(x3));
  };
  var _size1 = /* @__PURE__ */ _size(strongForget);
  var _pieces = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x3) => $0(prop2({ reflectSymbol: () => "pieces" })()()($$Proxy)(dictStrong)(x3));
  };
  var allOccupiedLocations = /* @__PURE__ */ _pieces(strongForget)((x3) => functorMap.map((v) => {
  })(x3));
  var firstEmptyLocation = (board) => {
    const n = _size1(identity15)(board);
    const occupied = allOccupiedLocations(board);
    return find2((loc) => {
      const $0 = lookup(ordLocation)(loc)(occupied);
      if ($0.tag === "Nothing") {
        return true;
      }
      if ($0.tag === "Just") {
        return false;
      }
      fail();
    })(arrayBind(rangeImpl(0, n - 1 | 0))((j) => arrayBind(rangeImpl(0, n - 1 | 0))((i) => [{ x: i, y: j }])));
  };

  // output-es/Game.Rotation/index.js
  var semigroupRotation = { append: (v) => (v1) => intMod(v + v1 | 0)(4) };
  var monoidRotation = { mempty: /* @__PURE__ */ intMod(0)(4), Semigroup0: () => semigroupRotation };

  // output-es/Game.Board.Query/index.js
  var _pieces2 = /* @__PURE__ */ _pieces(strongForget);
  var ix = /* @__PURE__ */ (() => indexMap(ordLocation).ix)();
  var choiceForget2 = /* @__PURE__ */ choiceForget(monoidRotation);
  var _size2 = /* @__PURE__ */ _size(strongForget);
  var at = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces1 = /* @__PURE__ */ _pieces(strongFn);
  var fromFoldable2 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var applicativeWriterT2 = /* @__PURE__ */ applicativeWriterT(monoidList);
  var monadStateWriterT2 = /* @__PURE__ */ monadStateWriterT(monoidList);
  var monadTellWriterT2 = /* @__PURE__ */ monadTellWriterT(monoidList);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable(ordRelativeEdge)(foldableList);
  var fromFoldable22 = /* @__PURE__ */ (() => foldableSet.foldr(Cons)(Nil))();
  var fromFoldable3 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var toRelativeEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop2({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity15)));
        return dictMonadState.state((s) => $Tuple($2(s), s));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(intMod(-rot)(4)) }));
    };
  };
  var toAbsoluteEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop2({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity15)));
        return dictMonadState.state((s) => $Tuple($2(s), s));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(rot) }));
    };
  };
  var isInsideBoard = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.x;
      const $1 = v.y;
      return Monad0.Bind1().bind(dictMonadState.state((s) => $Tuple(_size2(identity15)(s), s)))((n) => Monad0.Applicative0().pure(0 <= $0 && $0 < n && 0 <= $1 && $1 < n));
    };
  };
  var getPortOnEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      return Monad0.Bind1().bind((() => {
        const $1 = at(v.loc)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces2($1(identity15))(s), s));
      })())((maybePieceInfo) => Monad0.Applicative0().pure((() => {
        if (maybePieceInfo.tag === "Just") {
          return lookup(ordCardinalDirection)($0)(maybePieceInfo._1.piece.ports);
        }
        if (maybePieceInfo.tag === "Nothing") {
          return Nothing;
        }
        fail();
      })()));
    };
  };
  var getBoardEdgePseudoLocation = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (dir2) => Monad0.Bind1().bind(dictMonadState.state((s) => $Tuple(_size2(identity15)(s), s)))((n) => Monad0.Applicative0().pure((() => {
      if (dir2 === "Up") {
        return { x: intDiv(n, 2), y: -1 };
      }
      if (dir2 === "Right") {
        return { x: n, y: intDiv(n, 2) };
      }
      if (dir2 === "Down") {
        return { x: intDiv(n, 2), y: n };
      }
      if (dir2 === "Left") {
        return { x: -1, y: intDiv(n, 2) };
      }
      fail();
    })()));
  };
  var getBoardPortEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    return (dir2) => Monad0.Bind1().bind(getBoardEdgePseudoLocation1(dir2))((loc) => Monad0.Applicative0().pure({ loc, dir: Right2 }));
  };
  var adjacentRelativeEdge = (dictMonadState) => {
    const toAbsoluteEdge1 = toAbsoluteEdge(dictMonadState);
    const toRelativeEdge1 = toRelativeEdge(dictMonadState);
    return (relEdge) => dictMonadState.Monad0().Bind1().bind(toAbsoluteEdge1(relEdge))((absEdge) => toRelativeEdge1(matchEdge(absEdge)));
  };
  var connectedRelativeEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = Monad0.Bind1();
    const getPortOnEdge1 = getPortOnEdge(dictMonadState);
    const adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    const $1 = Monad0.Applicative0();
    return (relEdge) => $0.bind(getPortOnEdge1(relEdge))((port3) => $0.bind(adjacentRelativeEdge1(relEdge))((adjRelEdge) => $0.bind(getPortOnEdge1(adjRelEdge))((adjPort) => {
      if ((() => {
        const $2 = applyMaybe.apply(port3.tag === "Just" ? $Maybe("Just", portMatches(port3._1)) : Nothing)(adjPort);
        if ($2.tag === "Nothing") {
          return false;
        }
        return $2.tag === "Just" && $2._1;
      })()) {
        return $1.pure($Maybe("Just", adjRelEdge));
      }
      return $1.pure(Nothing);
    })));
  };
  var allConnectedRelativeEdges = (dictMonadState) => {
    const wither1 = witherableArray.wither(dictMonadState.Monad0().Applicative0());
    const connectedRelativeEdge1 = connectedRelativeEdge(dictMonadState);
    return (loc) => wither1(connectedRelativeEdge1)(arrayMap((dir2) => ({ loc, dir: dir2 }))(allDirections));
  };
  var capacityRippleAcc = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const allConnectedRelativeEdges1 = allConnectedRelativeEdges(dictMonadState);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (capacity2) => (vars) => {
      if (vars.openSet.tag === "Nil") {
        return Monad0.Applicative0().pure();
      }
      if (vars.openSet.tag === "Cons") {
        const $0 = vars.openSet._2;
        const $1 = vars.openSet._1;
        const loc = $1.loc;
        const closedSet = insert(ordLocation)(loc)()(vars.closedSet);
        return Bind1.bind(Bind1.Apply0().Functor0().map((v1) => {
          if (v1.tag === "Just") {
            return $Maybe("Just", v1._1.piece);
          }
          return Nothing;
        })((() => {
          const $2 = at(loc)(strongForget);
          return dictMonadState.state((s) => $Tuple(_pieces2($2(identity15))(s), s));
        })()))((maybePiece) => {
          const v = (() => {
            if (maybePiece.tag === "Just") {
              return maybePiece._1.updateCapacity($1.dir)(capacity2);
            }
            if (maybePiece.tag === "Nothing") {
              return Nothing;
            }
            fail();
          })();
          if (v.tag === "Just") {
            const $2 = v._1;
            return Bind1.bind(allConnectedRelativeEdges1(loc))((connected) => Bind1.bind($$void((() => {
              const $3 = _pieces1(ix(loc)(strongFn)(choiceFn)((v1) => ({ ...v1, piece: $2 })));
              return dictMonadState.state((s) => {
                const s$p = $3(s);
                return $Tuple(s$p, s$p);
              });
            })()))(() => {
              if ($2.shouldRipple) {
                return capacityRippleAcc(dictMonadState)(capacity2)({
                  openSet: foldableList.foldr(Cons)($0)(fromFoldable2(filterImpl(
                    (r) => {
                      const $3 = lookup(ordLocation)(r.loc)(vars.closedSet);
                      if ($3.tag === "Nothing") {
                        return true;
                      }
                      if ($3.tag === "Just") {
                        return false;
                      }
                      fail();
                    },
                    connected
                  ))),
                  closedSet
                });
              }
              return capacityRippleAcc(dictMonadState)(capacity2)({ openSet: $0, closedSet });
            }));
          }
          if (v.tag === "Nothing") {
            return capacityRippleAcc(dictMonadState)(capacity2)({ openSet: $0, closedSet });
          }
          fail();
        });
      }
      fail();
    };
  };
  var capacityRipple = (dictMonadState) => {
    const capacityRippleAcc1 = capacityRippleAcc(dictMonadState);
    return (relEdge) => (capacity2) => capacityRippleAcc1(capacity2)({ openSet: $List("Cons", relEdge, Nil), closedSet: Leaf2 });
  };
  var buildConnectionMapAt = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const applicativeWriterT1 = applicativeWriterT2(Monad0.Applicative0());
    const for_8 = for_(applicativeWriterT1)(foldableArray);
    const $0 = bindWriterT(semigroupList)(Monad0.Bind1());
    const monadStateWriterT1 = monadStateWriterT2(dictMonadState);
    const connectedRelativeEdge1 = connectedRelativeEdge(monadStateWriterT1);
    const traverse_17 = traverse_(applicativeWriterT1)(foldableMaybe);
    const getPortOnEdge1 = getPortOnEdge(monadStateWriterT1);
    const $1 = monadTellWriterT2(Monad0);
    return (loc) => for_8(allDirections)((dir2) => {
      const relEdge = { loc, dir: dir2 };
      return $0.bind(connectedRelativeEdge1(relEdge))(traverse_17((adjRelEdge) => $0.bind(getPortOnEdge1(relEdge))((port3) => {
        if (port3.tag === "Just") {
          if (portType(port3._1) === "Input") {
            return $1.tell($List("Cons", $Tuple(relEdge, adjRelEdge), Nil));
          }
          if (portType(port3._1) === "Output") {
            return $1.tell($List("Cons", $Tuple(adjRelEdge, relEdge), Nil));
          }
          fail();
        }
        return applicativeWriterT1.pure();
      })));
    });
  };
  var buildConnectionMap = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Functor0 = Bind1.Apply0().Functor0();
    const traverse_17 = traverse_(applicativeWriterT2(Monad0.Applicative0()))(foldableList);
    const buildConnectionMapAt1 = buildConnectionMapAt(dictMonadState);
    return Bind1.bind(dictMonadState.state((s) => $Tuple(_pieces2(identity15)(s), s)))((pieceInfos) => Functor0.map(fromFoldable1)(Functor0.map(snd)(traverse_17(buildConnectionMapAt1)(fromFoldable22(functorMap.map((v) => {
    })(pieceInfos))))));
  };
  var getBoardPorts = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Applicative0 = Monad0.Applicative0();
    const getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    const toRelativeEdge1 = toRelativeEdge(dictMonadState);
    const adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    const getPortOnEdge1 = getPortOnEdge(dictMonadState);
    return Bind1.Apply0().Functor0().map((x3) => mapMaybeWithKey(ordCardinalDirection)((v) => identity9)(fromFoldable3(x3)))(traversableArray.traverse(Applicative0)((dir2) => Bind1.bind(getBoardEdgePseudoLocation1(dir2))((loc) => Bind1.bind(Bind1.bind(toRelativeEdge1({
      loc,
      dir: (() => {
        if (dir2 === "Up") {
          return Down;
        }
        if (dir2 === "Right") {
          return Left2;
        }
        if (dir2 === "Down") {
          return Up;
        }
        if (dir2 === "Left") {
          return Right2;
        }
        fail();
      })()
    }))(adjacentRelativeEdge1))((relEdge) => Bind1.bind(getPortOnEdge1(relEdge))((maybePort) => Applicative0.pure($Tuple(dir2, maybePort))))))(allDirections));
  };

  // output-es/Component.Board.Types/index.js
  var $Action3 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output = (_1) => ({ tag: "NewBoardState", _1 });
  var $Query = (tag, _1, _2) => ({ tag, _1, _2 });
  var prop3 = /* @__PURE__ */ prop2({ reflectSymbol: () => "inputs" })()();
  var getBoardPortEdge2 = /* @__PURE__ */ getBoardPortEdge(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var GetBoard = (value0) => $Query("GetBoard", value0);
  var GetMouseOverLocation = (value0) => $Query("GetMouseOverLocation", value0);
  var SetInputs = (value0) => (value1) => $Query("SetInputs", value0, value1);
  var IncrementBoardSize = (value0) => $Query("IncrementBoardSize", value0);
  var DecrementBoardSize = (value0) => $Query("DecrementBoardSize", value0);
  var Initialise = /* @__PURE__ */ $Action3("Initialise");
  var PieceOutput = (value0) => $Action3("PieceOutput", value0);
  var MultimeterOutput = (value0) => $Action3("MultimeterOutput", value0);
  var Undo = /* @__PURE__ */ $Action3("Undo");
  var Redo = /* @__PURE__ */ $Action3("Redo");
  var EvaluateBoard = /* @__PURE__ */ $Action3("EvaluateBoard");
  var UpdatePieceComponents = /* @__PURE__ */ $Action3("UpdatePieceComponents");
  var LocationOnMouseDown = (value0) => (value1) => $Action3("LocationOnMouseDown", value0, value1);
  var LocationOnMouseOver = (value0) => (value1) => $Action3("LocationOnMouseOver", value0, value1);
  var LocationOnMouseUp = (value0) => (value1) => $Action3("LocationOnMouseUp", value0, value1);
  var LocationOnDragEnter = (value0) => (value1) => $Action3("LocationOnDragEnter", value0, value1);
  var LocationOnDragOver = (value0) => (value1) => $Action3("LocationOnDragOver", value0, value1);
  var LocationOnDrop = (value0) => (value1) => $Action3("LocationOnDrop", value0, value1);
  var BoardPortOnMouseLeave = /* @__PURE__ */ $Action3("BoardPortOnMouseLeave");
  var initialState = (v) => ({
    boardHistory: $Zipper(Nil, v.board, Nil),
    boardPorts: Leaf2,
    inputs: Leaf2,
    outputs: Leaf2,
    lastEvalWithPortInfo: Leaf2,
    isCreatingWire: Nothing,
    isMouseOverLocation: Nothing,
    isMouseOverBoardPort: Nothing
  });
  var _wireLocations = (dictWander) => {
    const Strong0 = dictWander.Strong0();
    const $0 = _Just(dictWander.Choice1());
    return (x3) => prop2({ reflectSymbol: () => "isCreatingWire" })()()($$Proxy)(Strong0)($0(prop2({ reflectSymbol: () => "locations" })()()($$Proxy)(Strong0)(x3)));
  };
  var _inputs = (dictStrong) => prop3($$Proxy)(dictStrong);
  var _board = (dictStrong) => (x3) => prop2({ reflectSymbol: () => "boardHistory" })()()($$Proxy)(dictStrong)(dictStrong.Profunctor0().dimap((s) => $Tuple(
    s._2,
    (b) => $Zipper(s._1, b, s._3)
  ))((v) => v._2(v._1))(dictStrong.first(x3)));
  var boardPortInfo = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = Monad0.Bind1();
    const $1 = traversableWithIndexMap.traverseWithIndex(Monad0.Applicative0());
    return $0.bind(dictMonadState.state((s) => $Tuple(s.boardPorts, s)))((boardPorts) => $0.bind(dictMonadState.state((s) => $Tuple(
      _board(strongForget)(identity15)(s),
      s
    )))((board) => $1((dir2) => (port3) => {
      const $2 = lookup(ordRelativeEdge)(getBoardPortEdge2(dir2)(board)._1);
      return dictMonadState.state((s) => $Tuple(
        (() => {
          const $3 = $2(s.lastEvalWithPortInfo);
          if ($3.tag === "Nothing") {
            return { connected: false, port: port3, signal: 0 };
          }
          if ($3.tag === "Just") {
            return $3._1;
          }
          fail();
        })(),
        s
      ));
    })(boardPorts)));
  };
  var liftBoardM = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Applicative0 = Monad0.Applicative0();
    const for_8 = for_(Applicative0)(foldableEither);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (boardM) => Bind1.bind(Bind1.Apply0().Functor0().map((b) => boardM(b))(dictMonadState.state((s) => $Tuple(
      _board(strongForget)(identity15)(s),
      s
    ))))((eitherBoard) => Bind1.bind(for_8(eitherBoard)((v) => {
      const $0 = v._2;
      return $$void((() => {
        const $1 = _board(strongFn)((v$1) => $0);
        return dictMonadState.state((s) => {
          const s$p = $1(s);
          return $Tuple(s$p, s$p);
        });
      })());
    }))(() => Applicative0.pure(eitherBoard)));
  };

  // output-es/Control.Monad.Reader.Class/index.js
  var monadAskFun = { ask: (x3) => x3, Monad0: () => monadFn };
  var monadReaderFun = { local: (f) => (g) => (x3) => g(f(x3)), MonadAsk0: () => monadAskFun };

  // output-es/Game.Board.PseudoPiece/index.js
  var psuedoPiece = (port3) => ({
    name: (() => {
      const v = portType(port3);
      if (v === "Input") {
        return "psuedo-input";
      }
      if (v === "Output") {
        return "psuedo-output";
      }
      fail();
    })(),
    eval: (v) => Leaf2,
    complexity: { space: 0, time: 0 },
    shouldRipple: false,
    updateCapacity: (v) => (v1) => Nothing,
    ports: $$$Map("Two", Leaf2, Right2, matchingPort(port3), Leaf2),
    updatePort: (v) => (v1) => Nothing
  });
  var getPsuedoPiecePort = (v) => {
    if (elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"])) {
      return lookup(ordCardinalDirection)(Right2)(v.ports);
    }
    return Nothing;
  };

  // output-es/Game.PortInfo/index.js
  var getClampedSignal = (v) => {
    const $0 = portCapacity(v.port);
    if ($0 === "OneBit") {
      return 1 & v.signal;
    }
    if ($0 === "TwoBit") {
      return 3 & v.signal;
    }
    if ($0 === "FourBit") {
      return 15 & v.signal;
    }
    if ($0 === "EightBit") {
      return 255 & v.signal;
    }
    fail();
  };

  // output-es/Game.Board.EvaluableBoard/index.js
  var filterWithKey2 = /* @__PURE__ */ filterWithKey(ordRelativeEdge);
  var at2 = /* @__PURE__ */ (() => atMap(ordRelativeEdge).at)();
  var filter4 = /* @__PURE__ */ (() => {
    const filterWithKey1 = filterWithKey(ordCardinalDirection);
    return (predicate) => filterWithKey1((v) => predicate);
  })();
  var fromFoldable4 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableMap);
  var monadStateStateT2 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var _pieces3 = /* @__PURE__ */ _pieces(strongFn);
  var at1 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces12 = /* @__PURE__ */ _pieces(strongForget);
  var fromFoldable12 = /* @__PURE__ */ (() => foldableSet.foldr(Cons)(Nil))();
  var getBoardPorts2 = /* @__PURE__ */ getBoardPorts(monadStateStateT2);
  var topologicalSort = (v) => (v1) => {
    if (v.tag === "Nil") {
      return $Maybe("Just", Nil);
    }
    const $0 = find(foldableList)((loc) => foldSubmapBy(ordRelativeEdge)(union(ordRelativeEdge))(Leaf2)($Maybe(
      "Just",
      { loc, dir: Up }
    ))($Maybe("Just", { loc, dir: Left2 }))(singleton)(v1).tag === "Leaf")(v);
    if ($0.tag === "Just") {
      const $1 = $0._1;
      const $2 = Cons($1);
      const $3 = topologicalSort(deleteBy(eqLocation.eq)($1)(v))(filterWithKey2((k) => (v2) => !(v2.loc.x === $1.x && v2.loc.y === $1.y))(v1));
      if ($3.tag === "Just") {
        return $Maybe("Just", $2($3._1));
      }
      return Nothing;
    }
    if ($0.tag === "Nothing") {
      return Nothing;
    }
    fail();
  };
  var setOuterPort = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const $$void = Monad0.Bind1().Apply0().Functor0().map((v) => {
    });
    const $0 = bindMaybeT(Monad0);
    const ask1 = MonadAsk0.ask;
    const asks = (f) => MonadAsk0.Monad0().Bind1().Apply0().Functor0().map(f)(ask1);
    const $1 = applicativeMaybeT(Monad0);
    return (dictMonadState) => {
      const $2 = monadStateMaybeT(dictMonadState);
      return (dir2) => (signal) => $$void($0.bind((() => {
        const $3 = lookup(ordCardinalDirection)(dir2);
        return asks((x3) => $3(x3.psuedoPieceLocations));
      })())((loc) => $0.bind((() => {
        const $3 = lookup(ordLocation)(loc);
        return asks((x3) => $3(x3.pieces));
      })())((v) => {
        const $3 = $0.bind(Monad0.Applicative0().pure(getPsuedoPiecePort(v)))((port3) => {
          const $32 = insert(ordRelativeEdge)({ loc, dir: Right2 })({
            connected: false,
            port: port3,
            signal: (() => {
              const $33 = portCapacity(port3);
              if ($33 === "OneBit") {
                return 1 & signal;
              }
              if ($33 === "TwoBit") {
                return 3 & signal;
              }
              if ($33 === "FourBit") {
                return 15 & signal;
              }
              if ($33 === "EightBit") {
                return 255 & signal;
              }
              fail();
            })()
          });
          return $2.state((s) => $Tuple(void 0, $32(s)));
        });
        if (v.name === "psuedo-input") {
          return $3;
        }
        return $1.pure();
      })));
    };
  };
  var injectInputs = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    const forWithIndex_3 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    const for_8 = for_(Applicative0)(foldableMaybe);
    const setOuterPort1 = setOuterPort(dictMonadReader);
    return (dictMonadState) => {
      const setOuterPort2 = setOuterPort1(dictMonadState);
      return (inputs) => Monad0.Bind1().bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x3) => x3.psuedoPieceLocations)(ask1))((psuedoPieceLocations) => forWithIndex_3(psuedoPieceLocations)((dir2) => (loc) => for_8(lookup(ordCardinalDirection)(dir2)(inputs))((signal) => setOuterPort2(dir2)(signal))));
    };
  };
  var getPorts = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const $0 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const asks = (f) => MonadAsk0.Monad0().Bind1().Apply0().Functor0().map(f)(ask1);
    return $0.bind(asks((x3) => x3.pieces))((pieces) => $0.bind(asks((x3) => x3.psuedoPieceLocations))((psuedoPieceLocations) => Monad0.Applicative0().pure(mapMaybeWithKey(ordCardinalDirection)((v) => (loc) => {
      const $1 = lookup(ordLocation)(loc)(pieces);
      const $2 = (() => {
        if ($1.tag === "Just") {
          return lookup(ordCardinalDirection)(Right2)($1._1.ports);
        }
        if ($1.tag === "Nothing") {
          return Nothing;
        }
        fail();
      })();
      if ($2.tag === "Just") {
        return $Maybe("Just", matchingPort($2._1));
      }
      return Nothing;
    })(psuedoPieceLocations))));
  };
  var getPorts1 = /* @__PURE__ */ getPorts(monadReaderFun);
  var getOuterPort = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    return (dictMonadState) => (dir2) => Bind1.bind((() => {
      const $0 = lookup(ordCardinalDirection)(dir2);
      return MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x3) => $0(x3.psuedoPieceLocations))(ask1);
    })())((maybeLoc) => traversableMaybe.traverse(Monad0.Applicative0())((loc) => Bind1.Apply0().Functor0().map((v2) => {
      if (v2.tag === "Nothing") {
        return 0;
      }
      if (v2.tag === "Just") {
        return v2._1.signal;
      }
      fail();
    })((() => {
      const $0 = lookup(ordRelativeEdge)({ loc, dir: Right2 });
      return dictMonadState.state((s) => $Tuple($0(s), s));
    })()))(maybeLoc));
  };
  var getInputOnEdge = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const assign3 = (p, b) => $$void((() => {
        const $0 = p((v) => b);
        return dictMonadState.state((s) => {
          const s$p = $0(s);
          return $Tuple(s$p, s$p);
        });
      })());
      return (inRelEdge) => (capacity2) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x3) => x3.connections)(ask1))((connections) => {
        const v = lookup(ordRelativeEdge)(inRelEdge)(connections);
        if (v.tag === "Just") {
          const $0 = v._1;
          return Bind1.bind(Bind1.bind((() => {
            const $1 = at2($0)(strongForget);
            return dictMonadState.state((s) => $Tuple($1(identity15)(s), s));
          })())(traversableMaybe.traverse(Applicative0)((info2) => {
            const signal = getClampedSignal(info2);
            return Bind1.bind(assign3(
              at2(inRelEdge)(strongFn),
              $Maybe("Just", { connected: true, signal, port: { portType: Input, capacity: capacity2 } })
            ))(() => Bind1.bind(assign3(
              at2($0)(strongFn),
              $Maybe("Just", { connected: true, signal, port: { portType: Output, capacity: capacity2 } })
            ))(() => Applicative0.pure(signal)));
          })))((maybeSignal) => Applicative0.pure((() => {
            if (maybeSignal.tag === "Nothing") {
              return 0;
            }
            if (maybeSignal.tag === "Just") {
              return maybeSignal._1;
            }
            fail();
          })()));
        }
        if (v.tag === "Nothing") {
          return Bind1.bind(Bind1.Apply0().Functor0().map((v2) => {
            if (v2.tag === "Nothing") {
              return 0;
            }
            if (v2.tag === "Just") {
              return v2._1.signal;
            }
            fail();
          })((() => {
            const $0 = at2(inRelEdge)(strongForget);
            return dictMonadState.state((s) => $Tuple($0(identity15)(s), s));
          })()))((signal) => Bind1.bind(assign3(
            at2(inRelEdge)(strongFn),
            $Maybe("Just", { connected: false, signal, port: { portType: Input, capacity: capacity2 } })
          ))(() => Applicative0.pure(signal)));
        }
        fail();
      });
    };
  };
  var extractOutputs = (dictMonadReader) => {
    const Monad0 = dictMonadReader.MonadAsk0().Monad0();
    const Bind1 = Monad0.Bind1();
    const $0 = Bind1.Apply0().Functor0();
    const getPorts2 = getPorts(dictMonadReader);
    const $1 = traversableWithIndexMap.traverseWithIndex(Monad0.Applicative0());
    const getOuterPort1 = getOuterPort(dictMonadReader);
    return (dictMonadState) => {
      const getOuterPort2 = getOuterPort1(dictMonadState);
      return $0.map(catMaybes(ordCardinalDirection))(Bind1.bind($0.map(filter4(isOutput))(getPorts2))((outputPorts) => $1((dir2) => (port3) => getOuterPort2(dir2))(outputPorts)));
    };
  };
  var evalWithPortInfoAt = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const Applicative0 = Monad0.Applicative0();
    const for_8 = for_(Applicative0)(foldableMaybe);
    const $0 = Bind1.Apply0().Functor0();
    const $1 = traversableWithIndexMap.traverseWithIndex(Applicative0);
    const getInputOnEdge1 = getInputOnEdge(dictMonadReader);
    const forWithIndex_3 = forWithIndex_(Applicative0)(foldableWithIndexMap);
    return (dictMonadState) => {
      const getInputOnEdge2 = getInputOnEdge1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x3) => x3.pieces)(ask1))((pieces) => for_8(lookup(ordLocation)(loc)(pieces))((v) => Bind1.bind($0.map(fromFoldable4)($1((dir2) => (port3) => $0.map(Tuple(dir2))(getInputOnEdge2({
        loc,
        dir: dir2
      })(portCapacity(port3))))(filter4(isInput)(v.ports))))((inputs) => {
        const $2 = elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"]);
        const outputs = v.eval(inputs);
        const $3 = forWithIndex_3(filter4(isOutput)(v.ports))((dir2) => (port3) => {
          const $32 = $Maybe(
            "Just",
            {
              connected: false,
              signal: (() => {
                const $33 = portCapacity(port3);
                const $4 = (() => {
                  if ($33 === "OneBit") {
                    return 1;
                  }
                  if ($33 === "TwoBit") {
                    return 3;
                  }
                  if ($33 === "FourBit") {
                    return 15;
                  }
                  if ($33 === "EightBit") {
                    return 255;
                  }
                  fail();
                })();
                const $5 = lookup(ordCardinalDirection)(dir2)(outputs);
                if ($5.tag === "Nothing") {
                  return 0;
                }
                if ($5.tag === "Just") {
                  return $4 & $5._1;
                }
                fail();
              })(),
              port: port3
            }
          );
          return $$void((() => {
            const $4 = at2({ loc, dir: dir2 })(strongFn)((v$1) => $32);
            return dictMonadState.state((s) => {
              const s$p = $4(s);
              return $Tuple(s$p, s$p);
            });
          })());
        });
        if (!$2) {
          return $3;
        }
        if ($2) {
          return Applicative0.pure();
        }
        fail();
      })));
    };
  };
  var evalWithPortInfo = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const Bind1 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const injectInputs1 = injectInputs(dictMonadReader);
    const traverse_17 = traverse_(Monad0.Applicative0())(foldableList);
    const evalWithPortInfoAt1 = evalWithPortInfoAt(dictMonadReader);
    const extractOutputs1 = extractOutputs(dictMonadReader);
    return (dictMonadState) => {
      const injectInputs2 = injectInputs1(dictMonadState);
      const evalWithPortInfoAt2 = evalWithPortInfoAt1(dictMonadState);
      const extractOutputs2 = extractOutputs1(dictMonadState);
      return (inputs) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x3) => x3.evalOrder)(ask1))((evalOrder) => Bind1.bind(injectInputs2(inputs))(() => Bind1.bind(traverse_17(evalWithPortInfoAt2)(evalOrder))(() => extractOutputs2)));
    };
  };
  var evalWithPortInfo1 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT2));
  var evaluableBoardPiece = (v) => ({
    name: "evaluable",
    eval: (inputs) => evalWithPortInfo1(inputs)(v)(Leaf2)._1,
    complexity: { space: 0, time: 0 },
    shouldRipple: false,
    updateCapacity: (v1) => (v2) => Nothing,
    ports: getPorts1(v),
    updatePort: (v1) => (v2) => Nothing
  });
  var buildEvaluableBoard = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Functor0 = Monad0.Bind1().Apply0().Functor0();
    const bindStateT2 = bindStateT(Monad0);
    const applicativeStateT2 = applicativeStateT(Monad0);
    const forWithIndex_3 = forWithIndex_(applicativeStateT2)(foldableWithIndexMap);
    const monadStateStateT12 = monadStateStateT(Monad0);
    const getBoardEdgePseudoLocation2 = getBoardEdgePseudoLocation(monadStateStateT12);
    const $$void = monadStateStateT12.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    const buildConnectionMap2 = buildConnectionMap(monadStateStateT12);
    const $0 = traversableWithIndexMap.traverseWithIndex(applicativeStateT2);
    return (psuedoPiecePorts) => evalStateT(Functor0)(bindStateT2.bind(forWithIndex_3(psuedoPiecePorts)((dir2) => (port3) => bindStateT2.bind(getBoardEdgePseudoLocation2(dir2))((loc) => {
      const $1 = $Maybe("Just", { piece: psuedoPiece(port3), rotation: clockwiseRotation(Left2)(dir2) });
      return $$void((() => {
        const $2 = _pieces3(at1(loc)(strongFn)((v) => $1));
        return monadStateStateT12.state((s) => {
          const s$p = $2(s);
          return $Tuple(s$p, s$p);
        });
      })());
    })))(() => bindStateT2.bind((() => {
      const $1 = monadStateStateT12.state((s) => $Tuple(_pieces12(identity15)(s), s));
      return (s) => Functor0.map((v1) => $Tuple(functorMap.map((v) => v.piece)(v1._1), v1._2))($1(s));
    })())((pieces) => bindStateT2.bind(buildConnectionMap2)((connections) => bindStateT2.bind($0((dir2) => (v) => getBoardEdgePseudoLocation2(dir2))(psuedoPiecePorts))((psuedoPieceLocations) => bindStateT2.bind((() => {
      const $1 = monadThrowStateT(MonadThrow0).throwError(Cyclic);
      const $2 = topologicalSort(fromFoldable12(functorMap.map((v) => {
      })(pieces)))(connections);
      if ($2.tag === "Nothing") {
        return $1;
      }
      if ($2.tag === "Just") {
        return applicativeStateT2.pure($2._1);
      }
      fail();
    })())((evalOrder) => applicativeStateT2.pure({ pieces, connections, evalOrder, psuedoPieceLocations })))))));
  };
  var buildEvaluableBoard1 = /* @__PURE__ */ buildEvaluableBoard(/* @__PURE__ */ monadErrorExceptT(monadIdentity));

  // output-es/Game.Signal/index.js
  var fold2 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidString)(identity2))();
  var showSignal = { show: (v) => toUpper(fold2(arrayMap((shift) => toStringAs(16)(v >> shift & 15))([12, 8, 4, 0]))) };
  var eqSignal = { eq: (x3) => (y3) => x3 === y3 };

  // output-es/Game.Level.Completion/index.js
  var $CompletionStatus = (tag, _1) => ({ tag, _1 });
  var $PortMismatch = (tag, _1) => ({ tag, _1 });
  var eq7 = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqSignal).eq)();
  var for_2 = /* @__PURE__ */ for_(applicativeEither)(foldableArray);
  var NotStarted = /* @__PURE__ */ $CompletionStatus("NotStarted");
  var ReadyForTesting = /* @__PURE__ */ $CompletionStatus("ReadyForTesting");
  var Completed2 = /* @__PURE__ */ $CompletionStatus("Completed");
  var runSingleTest = (dictMonad) => {
    const $0 = dictMonad.Applicative0();
    return (piece) => (testIndex) => (inputs) => (testEval) => {
      const expected = piece.eval(inputs);
      return dictMonad.Bind1().bind(testEval(inputs))((recieved) => {
        if (eq7(expected)(recieved)) {
          return $0.pure($Either("Right", void 0));
        }
        return $0.pure($Either("Left", { testIndex, inputs, expected, recieved }));
      });
    };
  };
  var isPortMismatch = (direction2) => (maybeExpected) => (maybeRecieved) => {
    if (maybeRecieved.tag === "Nothing") {
      if (maybeExpected.tag === "Nothing") {
        return Nothing;
      }
      if (maybeExpected.tag === "Just") {
        return $Maybe("Just", $PortMismatch("PortExpected", { direction: direction2, expected: maybeExpected._1 }));
      }
      fail();
    }
    if (maybeRecieved.tag === "Just") {
      if (maybeExpected.tag === "Nothing") {
        return $Maybe("Just", $PortMismatch("NoPortExpected", { direction: direction2, received: maybeRecieved._1 }));
      }
      if (maybeExpected.tag === "Just") {
        if (maybeExpected._1.portType === "Input" ? maybeRecieved._1.portType !== "Input" : !(maybeExpected._1.portType === "Output" && maybeRecieved._1.portType === "Output")) {
          return $Maybe(
            "Just",
            $PortMismatch("IncorrectPortType", { direction: direction2, capacity: maybeRecieved._1.capacity, expected: maybeExpected._1.portType, received: maybeRecieved._1.portType })
          );
        }
        if ((() => {
          if (maybeExpected._1.capacity === "OneBit") {
            return maybeRecieved._1.capacity !== "OneBit";
          }
          if (maybeExpected._1.capacity === "TwoBit") {
            return maybeRecieved._1.capacity !== "TwoBit";
          }
          if (maybeExpected._1.capacity === "FourBit") {
            return maybeRecieved._1.capacity !== "FourBit";
          }
          return !(maybeExpected._1.capacity === "EightBit" && maybeRecieved._1.capacity === "EightBit");
        })()) {
          return $Maybe(
            "Just",
            $PortMismatch("IncorrectCapacity", { direction: direction2, portType: maybeRecieved._1.portType, expected: maybeExpected._1.capacity, received: maybeRecieved._1.capacity })
          );
        }
        return Nothing;
      }
    }
    fail();
  };
  var checkPortMismatch = (problem) => (evaluable) => for_2(allDirections)((dir2) => {
    const $0 = isPortMismatch(dir2)(lookup(ordCardinalDirection)(dir2)(problem.goal.ports))(lookup(ordCardinalDirection)(dir2)(evaluable.ports));
    if ($0.tag === "Nothing") {
      return $Either("Right", void 0);
    }
    if ($0.tag === "Just") {
      return $Either("Left", $0._1);
    }
    fail();
  });
  var checkOtherRestrictions = (problem) => (board) => for_2(problem.otherRestrictions)((r) => {
    const $0 = r.restriction(board);
    if (!$0) {
      return $Either("Left", { name: r.name, description: r.description });
    }
    if ($0) {
      return $Either("Right", void 0);
    }
    fail();
  });
  var checkEvaluable = (board) => {
    const $0 = buildEvaluableBoard1(getBoardPorts2(board)._1)(board);
    if ($0.tag === "Left") {
      return $Either("Left", $CompletionStatus("NotEvaluable", $0._1));
    }
    if ($0.tag === "Right") {
      return $Either("Right", $0._1);
    }
    fail();
  };
  var isReadyForTesting = (problem) => (board) => {
    const $0 = checkEvaluable(board);
    const $1 = (() => {
      if ($0.tag === "Left") {
        const $12 = $0._1;
        return (v) => $Either("Left", $12);
      }
      if ($0.tag === "Right") {
        const $12 = $0._1;
        return (f) => f($12);
      }
      fail();
    })()((evaluable) => {
      const $12 = checkPortMismatch(problem)(evaluableBoardPiece(evaluable));
      if ($12.tag === "Left") {
        return $Either("Left", $CompletionStatus("PortMismatch", $12._1));
      }
      if ($12.tag === "Right") {
        const $2 = checkOtherRestrictions(problem)(board);
        if ($2.tag === "Left") {
          return $Either("Left", $CompletionStatus("FailedRestriction", $2._1));
        }
        if ($2.tag === "Right") {
          return $Either("Right", $2._1);
        }
      }
      fail();
    });
    if ($1.tag === "Left") {
      return $1._1;
    }
    return ReadyForTesting;
  };

  // output-es/Parsing/index.js
  var $ParseError = (_1, _2) => ({ tag: "ParseError", _1, _2 });
  var $ParseState = (_1, _2, _3) => ({ tag: "ParseState", _1, _2, _3 });
  var position = (state1, v, v1, v2, done) => done(state1, state1._2);
  var fail2 = (message2) => (state1, more, lift1, $$throw, done) => more((v1) => position(
    state1,
    more,
    lift1,
    $$throw,
    (state2, a) => more((v2) => $$throw(state2, $ParseError(message2, a)))
  ));

  // output-es/Parsing.Combinators/index.js
  var withErrorMessage = (p) => (msg) => {
    const $0 = fail2("Expected " + msg);
    return (v2, $1, $2, $3, $4) => {
      const $5 = v2._1;
      const $6 = v2._2;
      return $1((v3) => p(
        $ParseState($5, $6, false),
        $1,
        $2,
        (v4, $7) => {
          const $8 = v4._3;
          return $1((v5) => {
            if ($8) {
              return $3(v4, $7);
            }
            return $0(v2, $1, $2, $3, $4);
          });
        },
        $4
      ));
    };
  };
  var $$try3 = (v) => (v1, $0, $1, $2, $3) => {
    const $4 = v1._3;
    return v(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
  };
  var choice = (dictFoldable) => {
    const $0 = dictFoldable.foldr((p1) => (v) => {
      if (v.tag === "Nothing") {
        return $Maybe("Just", p1);
      }
      if (v.tag === "Just") {
        return $Maybe(
          "Just",
          (v2, $02, $1, $2, $3) => {
            const $4 = v2._1;
            const $5 = v2._2;
            return $02((v3) => p1(
              $ParseState($4, $5, false),
              $02,
              $1,
              (v4, $6) => {
                const $7 = v4._3;
                return $02((v5) => {
                  if ($7) {
                    return $2(v4, $6);
                  }
                  return v._1(v2, $02, $1, $2, $3);
                });
              },
              $3
            ));
          }
        );
      }
      fail();
    })(Nothing);
    return (x3) => {
      const $1 = $0(x3);
      if ($1.tag === "Nothing") {
        return fail2("No alternative");
      }
      if ($1.tag === "Just") {
        return $1._1;
      }
      fail();
    };
  };

  // output-es/Parsing.Combinators.Array/index.js
  var many2 = (p) => (state1, more, lift1, $$throw, done) => more((v1) => {
    const loop = (state2, arg, gas) => {
      const $0 = (state3, step2) => {
        if (step2.tag === "Loop") {
          if (gas === 0) {
            return more((v1$1) => loop(state3, step2._1, 30));
          }
          return loop(state3, step2._1, gas - 1 | 0);
        }
        if (step2.tag === "Done") {
          const $02 = step2._1;
          return more((v2) => done(state3, reverse2(fromFoldableImpl(foldableList.foldr, $02))));
        }
        fail();
      };
      const $1 = state2._1;
      const $2 = state2._2;
      return more((v3) => more((v1$1) => p(
        $ParseState($1, $2, false),
        more,
        lift1,
        (v2, $3) => more((v5) => $0(state2, $Step("Done", arg))),
        (state2$1, a) => more((v2) => $0(state2$1, $Step("Loop", $List("Cons", a, arg))))
      )));
    };
    return loop(state1, Nil, 30);
  });
  var many12 = (p) => (state1, more, lift1, $$throw, done) => more((v1) => many2(p)(
    state1,
    more,
    lift1,
    $$throw,
    (state2, a) => more((v2) => {
      if (a.length > 0) {
        return done(state2, a);
      }
      return fail2("Expected at least 1")(state2, more, lift1, $$throw, done);
    })
  ));

  // output-es/Parsing.String/index.js
  var updatePosSingle = (v) => (cp) => (after) => {
    if (cp === 10) {
      return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
    }
    if (cp === 13) {
      const v2 = codePointAt(0)(after);
      if (v2.tag === "Just" && v2._1 === 10) {
        return { index: v.index + 1 | 0, line: v.line, column: v.column };
      }
      return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
    }
    if (cp === 9) {
      return { index: v.index + 1 | 0, line: v.line, column: (v.column + 8 | 0) - intMod(v.column - 1 | 0)(8) | 0 };
    }
    return { index: v.index + 1 | 0, line: v.line, column: v.column + 1 | 0 };
  };
  var updatePosString = (updatePosString$a0$copy) => (updatePosString$a1$copy) => (updatePosString$a2$copy) => {
    let updatePosString$a0 = updatePosString$a0$copy;
    let updatePosString$a1 = updatePosString$a1$copy;
    let updatePosString$a2 = updatePosString$a2$copy;
    let updatePosString$c = true;
    let updatePosString$r;
    while (updatePosString$c) {
      const pos = updatePosString$a0, before = updatePosString$a1, after = updatePosString$a2;
      const v = uncons3(before);
      if (v.tag === "Nothing") {
        updatePosString$c = false;
        updatePosString$r = pos;
        continue;
      }
      if (v.tag === "Just") {
        updatePosString$a0 = v._1.tail === "" ? updatePosSingle(pos)(v._1.head)(after) : updatePosSingle(pos)(v._1.head)(v._1.tail);
        updatePosString$a1 = v._1.tail;
        updatePosString$a2 = after;
        continue;
      }
      fail();
    }
    return updatePosString$r;
  };
  var satisfy = (f) => (v, $0, $1, $2, $3) => {
    const v3 = uncons3(v._1);
    if (v3.tag === "Nothing") {
      return $2(v, $ParseError("Unexpected EOF", v._2));
    }
    if (v3.tag === "Just") {
      if (v3._1.head < 0 || v3._1.head > 65535) {
        return $2(v, $ParseError("Expected Char", v._2));
      }
      if (v3._1.head >= 0 && v3._1.head <= 65535) {
        const ch = fromCharCode(v3._1.head);
        if (f(ch)) {
          return $3($ParseState(v3._1.tail, updatePosSingle(v._2)(v3._1.head)(v3._1.tail), true), ch);
        }
        return $2(v, $ParseError("Predicate unsatisfied", v._2));
      }
    }
    fail();
  };
  var consumeWith = (f) => (v, $0, $1, $2, $3) => {
    const v3 = f(v._1);
    if (v3.tag === "Left") {
      return $2(v, $ParseError(v3._1, v._2));
    }
    if (v3.tag === "Right") {
      return $3($ParseState(v3._1.remainder, updatePosString(v._2)(v3._1.consumed)(v3._1.remainder), v3._1.consumed !== ""), v3._1.value);
    }
    fail();
  };
  var string = (str2) => consumeWith((input) => {
    const v = stripPrefix(str2)(input);
    if (v.tag === "Just") {
      return $Either("Right", { value: str2, consumed: str2, remainder: v._1 });
    }
    return $Either("Left", "Expected " + showStringImpl(str2));
  });

  // output-es/Data.CodePoint.Unicode/index.js
  var isDecDigit = (c) => {
    const diff = c - 48 | 0;
    return diff <= 9 && diff >= 0;
  };

  // output-es/Parsing.String.Basic/index.js
  var satisfyCP = (p) => satisfy((x3) => p(toCharCode(x3)));
  var digit = /* @__PURE__ */ withErrorMessage(/* @__PURE__ */ satisfyCP(isDecDigit))("digit");

  // output-es/Component.DataAttribute/index.js
  var choice2 = /* @__PURE__ */ choice(foldableArray);
  var intercalate3 = /* @__PURE__ */ intercalate1(monoidString);
  var direction = {
    attrName: "data-direction",
    attrPrint: (x3) => toLower((() => {
      if (x3 === "Up") {
        return "Up";
      }
      if (x3 === "Right") {
        return "Right";
      }
      if (x3 === "Down") {
        return "Down";
      }
      if (x3 === "Left") {
        return "Left";
      }
      fail();
    })()),
    attrParse: /* @__PURE__ */ choice2([
      (state1, more, lift1, $$throw, done) => more((v1) => string("up")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Up)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("right")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Right2)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("down")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Down)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("left")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Left2))))
    ])
  };
  var $$int2 = {
    attrName: "int",
    attrPrint: showIntImpl,
    attrParse: (state1, more, lift1, $$throw, done) => more((v1) => more((v1$1) => many12(digit)(
      state1,
      more,
      lift1,
      $$throw,
      (state2, a) => more((v2) => {
        const $0 = fromCharArray(fromFoldableImpl(foldrArray, a));
        return more((v2$1) => {
          const $1 = fromString($0);
          if ($1.tag === "Nothing") {
            return fail2($0)(state2, more, lift1, $$throw, done);
          }
          if ($1.tag === "Just") {
            return done(state2, $1._1);
          }
          fail();
        });
      })
    )))
  };
  var location2 = {
    attrName: "data-location",
    attrPrint: (v) => "(" + showIntImpl(v.x) + "," + showIntImpl(v.y) + ")",
    attrParse: /* @__PURE__ */ (() => {
      const $0 = withErrorMessage(satisfy((v) => v === "("))("'('");
      const $1 = withErrorMessage(satisfy((v) => v === ","))("','");
      return (state1, more, lift1, $$throw, done) => more((v1) => more((v2) => more((v1$1) => more((v2$1) => more((v1$2) => $0(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2$2) => more((v3) => $$int2.attrParse(
          state2,
          more,
          lift1,
          $$throw,
          (state3, a$1) => more((v4) => more((v2$3) => more((v3$1) => $1(
            state3,
            more,
            lift1,
            $$throw,
            (state3$1, a$2) => more((v4$1) => more((v2$4) => {
              const $2 = withErrorMessage(satisfy((v) => v === ")"))("')'");
              return more((v1$3) => more((v2$5) => more((v1$4) => $$int2.attrParse(
                state3$1,
                more,
                lift1,
                $$throw,
                (state2$1, a$3) => more((v2$6) => more((v3$2) => $2(state2$1, more, lift1, $$throw, (state3$2, a$4) => more((v4$2) => more((v2$7) => done(state3$2, { x: a$1, y: a$3 }))))))
              ))));
            }))
          ))))
        )))
      ))))));
    })()
  };
  var portType2 = {
    attrName: "data-port-type",
    attrPrint: (v) => {
      if (v === "Input") {
        return "input";
      }
      if (v === "Output") {
        return "output";
      }
      fail();
    },
    attrParse: /* @__PURE__ */ choice2([
      (state1, more, lift1, $$throw, done) => more((v1) => string("input")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Input)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("output")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, Output))))
    ])
  };
  var capacity = {
    attrName: "data-capacity",
    attrPrint: (v) => {
      if (v === "OneBit") {
        return "1";
      }
      if (v === "TwoBit") {
        return "2";
      }
      if (v === "FourBit") {
        return "4";
      }
      if (v === "EightBit") {
        return "8";
      }
      fail();
    },
    attrParse: /* @__PURE__ */ choice2([
      /* @__PURE__ */ (() => {
        const $0 = withErrorMessage(satisfy((v) => v === "1"))("'1'");
        return (state1, more, lift1, $$throw, done) => more((v1) => $0(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, OneBit))));
      })(),
      /* @__PURE__ */ (() => {
        const $0 = withErrorMessage(satisfy((v) => v === "2"))("'2'");
        return (state1, more, lift1, $$throw, done) => more((v1) => $0(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, TwoBit))));
      })(),
      /* @__PURE__ */ (() => {
        const $0 = withErrorMessage(satisfy((v) => v === "4"))("'4'");
        return (state1, more, lift1, $$throw, done) => more((v1) => $0(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, FourBit))));
      })(),
      /* @__PURE__ */ (() => {
        const $0 = withErrorMessage(satisfy((v) => v === "8"))("'8'");
        return (state1, more, lift1, $$throw, done) => more((v1) => $0(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, EightBit))));
      })()
    ])
  };
  var port2 = /* @__PURE__ */ (() => {
    const $0 = withErrorMessage(satisfy((v) => v === "-"))("'-'");
    return {
      attrName: "data-port",
      attrPrint: (v) => (() => {
        if (v.portType === "Input") {
          return "input-";
        }
        if (v.portType === "Output") {
          return "output-";
        }
        fail();
      })() + (() => {
        if (v.capacity === "OneBit") {
          return "1";
        }
        if (v.capacity === "TwoBit") {
          return "2";
        }
        if (v.capacity === "FourBit") {
          return "4";
        }
        if (v.capacity === "EightBit") {
          return "8";
        }
        fail();
      })(),
      attrParse: (state1, more, lift1, $$throw, done) => more((v1) => more((v2) => more((v1$1) => portType2.attrParse(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2$1) => more((v3) => $0(
          state2,
          more,
          lift1,
          $$throw,
          (state3, a$1) => more((v4) => more((v2$2) => more((v1$2) => capacity.attrParse(
            state3,
            more,
            lift1,
            $$throw,
            (state2$1, a$2) => more((v2$3) => done(state2$1, { portType: a, capacity: a$2 }))
          ))))
        )))
      ))))
    };
  })();
  var portMismatch = {
    attrName: "data-port-mismatch",
    attrPrint: (v) => {
      if (v.tag === "PortExpected") {
        return intercalate3("-")([port2.attrPrint(v._1.expected), "port-expected-at", direction.attrPrint(v._1.direction)]);
      }
      if (v.tag === "NoPortExpected") {
        return intercalate3("-")(["no", port2.attrPrint(v._1.received), "port-expected-at", direction.attrPrint(v._1.direction)]);
      }
      if (v.tag === "IncorrectPortType") {
        return intercalate3("-")([
          "expected",
          port2.attrPrint({ portType: v._1.expected, capacity: v._1.capacity }),
          "at",
          direction.attrPrint(v._1.direction),
          "but-port-type-was",
          (() => {
            if (v._1.received === "Input") {
              return "input";
            }
            if (v._1.received === "Output") {
              return "output";
            }
            fail();
          })()
        ]);
      }
      if (v.tag === "IncorrectCapacity") {
        return intercalate3("-")([
          "expected",
          port2.attrPrint({ portType: v._1.portType, capacity: v._1.expected }),
          "at",
          direction.attrPrint(v._1.direction),
          "but-capacity-was",
          (() => {
            if (v._1.received === "OneBit") {
              return "1";
            }
            if (v._1.received === "TwoBit") {
              return "2";
            }
            if (v._1.received === "FourBit") {
              return "4";
            }
            if (v._1.received === "EightBit") {
              return "8";
            }
            fail();
          })()
        ]);
      }
      fail();
    },
    attrParse: /* @__PURE__ */ choice2(/* @__PURE__ */ arrayMap($$try3)([
      (state1, more, lift1, $$throw, done) => more((v1) => port2.attrParse(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2) => more((v1$1) => string("-port-expected-at-")(
          state2,
          more,
          lift1,
          $$throw,
          (state2$1, a$1) => more((v2$1) => more((v1$2) => direction.attrParse(
            state2$1,
            more,
            lift1,
            $$throw,
            (state2$2, a$2) => more((v2$2) => done(state2$2, $PortMismatch("PortExpected", { direction: a$2, expected: a })))
          )))
        )))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("no-")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2) => more((v1$1) => port2.attrParse(
          state2,
          more,
          lift1,
          $$throw,
          (state2$1, a$1) => more((v2$1) => more((v1$2) => string("-port-expected-at-")(
            state2$1,
            more,
            lift1,
            $$throw,
            (state2$2, a$2) => more((v2$2) => more((v1$3) => direction.attrParse(
              state2$2,
              more,
              lift1,
              $$throw,
              (state2$3, a$3) => more((v2$3) => done(state2$3, $PortMismatch("NoPortExpected", { received: a$1, direction: a$3 })))
            )))
          )))
        )))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("expected-")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2) => more((v1$1) => port2.attrParse(
          state2,
          more,
          lift1,
          $$throw,
          (state2$1, a$1) => more((v2$1) => more((v1$2) => string("-at-")(
            state2$1,
            more,
            lift1,
            $$throw,
            (state2$2, a$2) => more((v2$2) => more((v1$3) => direction.attrParse(
              state2$2,
              more,
              lift1,
              $$throw,
              (state2$3, a$3) => more((v2$3) => more((v1$4) => string("-but-port-type-was-")(
                state2$3,
                more,
                lift1,
                $$throw,
                (state2$4, a$4) => more((v2$4) => more((v1$5) => portType2.attrParse(
                  state2$4,
                  more,
                  lift1,
                  $$throw,
                  (state2$5, a$5) => more((v2$5) => done(
                    state2$5,
                    $PortMismatch("IncorrectPortType", { direction: a$3, capacity: a$1.capacity, received: a$5, expected: a$1.portType })
                  ))
                )))
              )))
            )))
          )))
        )))
      )),
      (state1, more, lift1, $$throw, done) => more((v1) => string("expected-")(
        state1,
        more,
        lift1,
        $$throw,
        (state2, a) => more((v2) => more((v1$1) => port2.attrParse(
          state2,
          more,
          lift1,
          $$throw,
          (state2$1, a$1) => more((v2$1) => more((v1$2) => string("-at-")(
            state2$1,
            more,
            lift1,
            $$throw,
            (state2$2, a$2) => more((v2$2) => more((v1$3) => direction.attrParse(
              state2$2,
              more,
              lift1,
              $$throw,
              (state2$3, a$3) => more((v2$3) => more((v1$4) => string("-but-capacity-was-")(
                state2$3,
                more,
                lift1,
                $$throw,
                (state2$4, a$4) => more((v2$4) => more((v1$5) => capacity.attrParse(
                  state2$4,
                  more,
                  lift1,
                  $$throw,
                  (state2$5, a$5) => more((v2$5) => done(
                    state2$5,
                    $PortMismatch("IncorrectCapacity", { direction: a$3, portType: a$1.portType, received: a$5, expected: a$1.capacity })
                  ))
                )))
              )))
            )))
          )))
        )))
      ))
    ]))
  };
  var $$boolean2 = {
    attrName: "boolean",
    attrPrint: (v) => {
      if (v) {
        return "true";
      }
      return "false";
    },
    attrParse: /* @__PURE__ */ choice2([
      (state1, more, lift1, $$throw, done) => more((v1) => string("true")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, true)))),
      (state1, more, lift1, $$throw, done) => more((v1) => string("false")(state1, more, lift1, $$throw, (state2, a) => more((v2) => done(state2, false))))
    ])
  };
  var isConnected = { ...$$boolean2, attrName: "data-is-connected" };
  var isDragging = { ...$$boolean2, attrName: "data-is-dragging" };

  // output-es/Halogen.Svg.Attributes.Color/index.js
  var $Color2 = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var printColor = (v) => {
    if (v.tag === "RGB") {
      return "rgb(" + showIntImpl(v._1) + "," + showIntImpl(v._2) + "," + showIntImpl(v._3) + ")";
    }
    if (v.tag === "RGBA") {
      return "rgba(" + showIntImpl(v._1) + "," + showIntImpl(v._2) + "," + showIntImpl(v._3) + "," + showNumberImpl(v._4) + ")";
    }
    if (v.tag === "Named") {
      return v._1;
    }
    if (v.tag === "NoColor") {
      return "None";
    }
    fail();
  };

  // output-es/Halogen.Svg.Attributes.Transform/index.js
  var $Transform = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var printTransform = (v) => {
    if (v.tag === "Matrix") {
      return "matrix(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + "," + showNumberImpl(v._3) + "," + showNumberImpl(v._4) + "," + showNumberImpl(v._5) + "," + showNumberImpl(v._6) + ")";
    }
    if (v.tag === "Translate") {
      return "translate(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + ")";
    }
    if (v.tag === "Scale") {
      return "scale(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + ")";
    }
    if (v.tag === "Rotate") {
      return "rotate(" + showNumberImpl(v._1) + "," + showNumberImpl(v._2) + "," + showNumberImpl(v._3) + ")";
    }
    if (v.tag === "SkewX") {
      return "skewX(" + showNumberImpl(v._1) + ")";
    }
    if (v.tag === "SkewY") {
      return "skewY(" + showNumberImpl(v._1) + ")";
    }
    fail();
  };

  // output-es/Halogen.Svg.Attributes/index.js
  var y2 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("y2");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var y1 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("y1");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var y = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("y");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var x2 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("x2");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var x1 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("x1");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var x = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("x");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var width = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("width");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var viewBox = (x_) => (y_) => (w) => (h_) => $Prop(
    "Attribute",
    Nothing,
    "viewBox",
    joinWith(" ")(arrayMap(showNumberImpl)([x_, y_, w, h_]))
  );
  var transform = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("transform");
    const $1 = joinWith(" ");
    const $2 = arrayMap(printTransform);
    return (x$1) => $0($1($2(x$1)));
  })();
  var textAnchor = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("text-anchor");
    return (x$1) => $0((() => {
      if (x$1 === "AnchorStart") {
        return "start";
      }
      if (x$1 === "AnchorMiddle") {
        return "middle";
      }
      if (x$1 === "AnchorEnd") {
        return "end";
      }
      fail();
    })());
  })();
  var strokeWidth = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stroke-width");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var stroke = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stroke");
    return (x$1) => $0(printColor(x$1));
  })();
  var stopOpacity = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stop-opacity");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var stopColor = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("stop-color");
    return (x$1) => $0(printColor(x$1));
  })();
  var refY = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("refY");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var refX = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("refX");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var orient = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("orient");
    return (x$1) => $0((() => {
      if (x$1 === "AutoOrient") {
        return "auto";
      }
      if (x$1 === "AutoStartReverse") {
        return "auto-start-reverse";
      }
      fail();
    })());
  })();
  var offset = /* @__PURE__ */ Attribute(Nothing)("offset");
  var markerWidth = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("markerWidth");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var markerStart = /* @__PURE__ */ Attribute(Nothing)("marker-start");
  var markerHeight = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("markerHeight");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var markerEnd = /* @__PURE__ */ Attribute(Nothing)("marker-end");
  var id3 = /* @__PURE__ */ Attribute(Nothing)("id");
  var href3 = /* @__PURE__ */ Attribute(Nothing)("href");
  var height = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("height");
    return (x$1) => $0(showNumberImpl(x$1));
  })();
  var gradientTransform = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("gradientTransform");
    const $1 = joinWith(" ");
    const $2 = arrayMap(printTransform);
    return (x$1) => $0($1($2(x$1)));
  })();
  var fill = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("fill");
    return (x$1) => $0(printColor(x$1));
  })();
  var dominantBaseline = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("dominant-baseline");
    return (x$1) => $0((() => {
      if (x$1 === "Auto") {
        return "auto";
      }
      if (x$1 === "UseScript") {
        return "use-script";
      }
      if (x$1 === "NoChange") {
        return "no-change";
      }
      if (x$1 === "ResetSize") {
        return "reset-size";
      }
      if (x$1 === "Ideographic") {
        return "ideographic";
      }
      if (x$1 === "Alphabetic") {
        return "alphabetic";
      }
      if (x$1 === "Hanging") {
        return "hanging";
      }
      if (x$1 === "Mathematical") {
        return "mathematical";
      }
      if (x$1 === "Central") {
        return "central";
      }
      if (x$1 === "BaselineMiddle") {
        return "middle";
      }
      if (x$1 === "TextAfterEdge") {
        return "text-after-edge";
      }
      if (x$1 === "TextBeforeEdge") {
        return "text-before-edge";
      }
      fail();
    })());
  })();
  var d = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("d");
    const $1 = joinWith(" ");
    return (x$1) => $0($1(x$1));
  })();
  var classes2 = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("class");
    const $1 = joinWith(" ");
    return (x$1) => $0($1(x$1));
  })();
  var class_2 = /* @__PURE__ */ Attribute(Nothing)("class");

  // output-es/Halogen.Svg.Attributes.Baseline/index.js
  var $Baseline = (tag) => tag;
  var Auto = /* @__PURE__ */ $Baseline("Auto");
  var Hanging = /* @__PURE__ */ $Baseline("Hanging");

  // output-es/Web.UIEvent.KeyboardEvent/foreign.js
  function key(e) {
    return e.key;
  }
  function ctrlKey(e) {
    return e.ctrlKey;
  }

  // output-es/Web.UIEvent.MouseEvent/foreign.js
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

  // output-es/Component.Multimeter/index.js
  var $Action4 = (tag, _1) => ({ tag, _1 });
  var $Output2 = (_1, _2) => ({ tag: "SetCapacity", _1, _2 });
  var $Query2 = (tag, _1) => ({ tag, _1 });
  var power2 = /* @__PURE__ */ power(monoidString);
  var foldMap = /* @__PURE__ */ (() => foldableArray.foldMap(monoidString))();
  var enumFromTo2 = /* @__PURE__ */ enumFromTo(enumInt)(unfoldable1Array);
  var modify_ = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var gets = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var for_3 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var show1 = (v) => {
    if (v.tag === "Just") {
      return (v._1.info.connected ? "(Just { info: { connected: true, port: " : "(Just { info: { connected: false, port: ") + showPort.show(v._1.info.port) + ", signal: " + showSignal.show(v._1.info.signal) + " }, relativeEdge: " + showRelativeEdge.show(v._1.relativeEdge) + " })";
    }
    if (v.tag === "Nothing") {
      return "Nothing";
    }
    fail();
  };
  var traverse_5 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var Initialise2 = /* @__PURE__ */ $Action4("Initialise");
  var multimeterTextValues = (info2) => [
    (() => {
      const $0 = foldMap((b) => {
        if (b) {
          return "1";
        }
        return "0";
      })((() => {
        const $02 = info2.signal;
        return arrayMap((n) => ($02 >> n & 1) !== 0)(enumFromTo2((() => {
          const $1 = portCapacity(info2.port);
          if ($1 === "OneBit") {
            return 0;
          }
          if ($1 === "TwoBit") {
            return 1;
          }
          if ($1 === "FourBit") {
            return 3;
          }
          if ($1 === "EightBit") {
            return 7;
          }
          fail();
        })())(0));
      })());
      return power2(" ")(8 - toCodePointArray($0).length | 0) + $0;
    })(),
    (() => {
      const $0 = showIntImpl(info2.signal);
      return power2("0")(3 - toCodePointArray($0).length | 0) + $0;
    })(),
    showIntImpl((() => {
      const $0 = portCapacity(info2.port);
      if ($0 === "OneBit") {
        return 1;
      }
      if ($0 === "TwoBit") {
        return 2;
      }
      if ($0 === "FourBit") {
        return 4;
      }
      if ($0 === "EightBit") {
        return 8;
      }
      fail();
    })()) + "bit",
    info2.connected ? "true" : "fals"
  ];
  var defaultValues = ["--------", "---", "----", "----"];
  var multimeterText = /* @__PURE__ */ (() => {
    const $0 = zipWith(apply)([
      (() => {
        const $02 = "BIN" + power2(" ")(5);
        return ($1) => $02 + $1;
      })(),
      (() => {
        const $02 = "DEC" + power2(" ")(10);
        return ($1) => $02 + $1;
      })(),
      ($02) => "Capacity:   " + $02,
      ($02) => "Connected:  " + $02
    ]);
    return (x3) => $0((() => {
      if (x3.tag === "Nothing") {
        return defaultValues;
      }
      if (x3.tag === "Just") {
        return multimeterTextValues(x3._1);
      }
      fail();
    })());
  })();
  var component4 = (dictMonadEffect) => {
    const monadEffectHalogenM2 = monadEffectHalogenM(dictMonadEffect);
    return {
      eval: mkEval({
        ...defaultEval,
        initialize: $Maybe("Just", Initialise2),
        handleAction: (v1) => {
          if (v1.tag === "Initialise") {
            const $0 = monadEffectHalogenM2.liftEffect(globalMouseMoveEventEmitter);
            return $Free(
              $0._1,
              snoc($0._2)((mouseMoveEmitter) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Subscribe", (v) => (k) => mouseMoveEmitter((x3) => k($Action4("GlobalMouseMove", x3))), identity11),
                  (x3) => $Free($FreeView("Return", x3), CatNil)
                ),
                snoc(snoc(CatNil)((x3) => $Free($FreeView("Return", void 0), CatNil)))(() => {
                  const $1 = monadEffectHalogenM2.liftEffect(globalKeyDownEventEmitter);
                  return $Free(
                    $1._1,
                    snoc($1._2)((keyDownEmitter) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Subscribe", (v) => (k) => keyDownEmitter((x3) => k($Action4("GlobalKeyDown", x3))), identity11),
                        (x3) => $Free($FreeView("Return", x3), CatNil)
                      ),
                      snoc(CatNil)((x3) => $Free($FreeView("Return", void 0), CatNil))
                    ))
                  );
                })
              ))
            );
          }
          if (v1.tag === "GlobalMouseMove") {
            const $0 = v1._1;
            const $1 = modify_((v2) => ({ ...v2, currentPosition: { x: pageX($0), y: pageY($0) } }));
            return $Free(
              $1._1,
              snoc($1._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v1.tag === "GlobalKeyDown") {
            const $0 = modify_((s) => ({ ...s, display: !s.display }));
            if (key(v1._1) === "s") {
              return $Free(
                $0._1,
                snoc($0._2)(() => {
                  const $1 = gets((v2) => v2.focus);
                  const $2 = $Free(
                    $1._1,
                    snoc($1._2)((maybeFocus) => for_3(maybeFocus)((v2) => {
                      const v3 = key(v1._1);
                      if (v3 === "1") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                            (x3) => $Free($FreeView("Return", x3), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "2") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                            (x3) => $Free($FreeView("Return", x3), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "3") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                            (x3) => $Free($FreeView("Return", x3), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "4") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                            (x3) => $Free($FreeView("Return", x3), CatNil)
                          ),
                          CatNil
                        );
                      }
                      return $Free($FreeView("Return", void 0), CatNil);
                    }))
                  );
                  if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                    return $2;
                  }
                  return $Free($FreeView("Return", void 0), CatNil);
                })
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc(CatNil)(() => {
                const $1 = gets((v2) => v2.focus);
                const $2 = $Free(
                  $1._1,
                  snoc($1._2)((maybeFocus) => for_3(maybeFocus)((v2) => {
                    const v3 = key(v1._1);
                    if (v3 === "1") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                          (x3) => $Free($FreeView("Return", x3), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "2") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                          (x3) => $Free($FreeView("Return", x3), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "3") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                          (x3) => $Free($FreeView("Return", x3), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "4") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                          (x3) => $Free($FreeView("Return", x3), CatNil)
                        ),
                        CatNil
                      );
                    }
                    return $Free($FreeView("Return", void 0), CatNil);
                  }))
                );
                if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                  return $2;
                }
                return $Free($FreeView("Return", void 0), CatNil);
              })
            );
          }
          fail();
        },
        handleQuery: (v1) => {
          if (v1.tag === "NewFocus") {
            const $0 = v1._1;
            const $1 = modify_((v2) => ({ ...v2, focus: $0 }));
            return $Free(
              $1._1,
              snoc($1._2)(() => {
                const $2 = monadEffectHalogenM2.liftEffect(log2(show1($0)));
                return $Free(
                  $2._1,
                  snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
                );
              })
            );
          }
          if (v1.tag === "SetSignal") {
            const $0 = v1._1;
            const $1 = gets((v2) => v2.focus);
            return $Free(
              $1._1,
              snoc(snoc($1._2)(traverse_5((focus2) => modify_((v2) => ({ ...v2, focus: $Maybe("Just", { ...focus2, info: { ...focus2.info, signal: $0 } }) })))))(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          fail();
        }
      }),
      initialState: (v) => ({ focus: Nothing, display: false, currentPosition: { x: 0, y: 0 } }),
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          id("multimeter"),
          classes(state.display ? ["display"] : ["hide"]),
          style("left: " + showIntImpl(state.currentPosition.x) + "px; top: " + showIntImpl(state.currentPosition.y) + "px;")
        ],
        [
          $VDom(
            "Elem",
            $Maybe("Just", "http://www.w3.org/2000/svg"),
            "svg",
            [viewBox(0)(0)(400)(400)],
            [
              $VDom(
                "Elem",
                $Maybe("Just", "http://www.w3.org/2000/svg"),
                "g",
                [],
                [
                  $VDom(
                    "Elem",
                    $Maybe("Just", "http://www.w3.org/2000/svg"),
                    "g",
                    [],
                    [
                      $VDom(
                        "Elem",
                        $Maybe("Just", "http://www.w3.org/2000/svg"),
                        "rect",
                        [id3("screen-border"), height(190), width(340)],
                        []
                      ),
                      $VDom(
                        "Elem",
                        $Maybe("Just", "http://www.w3.org/2000/svg"),
                        "g",
                        [transform([$Transform("Translate", 35, 12.5)])],
                        [
                          $VDom(
                            "Elem",
                            $Maybe("Just", "http://www.w3.org/2000/svg"),
                            "rect",
                            [
                              id3("screen-background"),
                              fill($Color2("RGB", 138, 248, 91)),
                              height(165),
                              width(270)
                            ],
                            []
                          ),
                          $VDom(
                            "Elem",
                            $Maybe("Just", "http://www.w3.org/2000/svg"),
                            "g",
                            [],
                            zipWithImpl(
                              (textYPosition) => (line) => $VDom(
                                "Elem",
                                $Maybe("Just", "http://www.w3.org/2000/svg"),
                                "text",
                                [
                                  stroke($Color2("Named", "black")),
                                  x(10),
                                  y(textYPosition),
                                  dominantBaseline(Hanging)
                                ],
                                [$VDom("Text", line)]
                              ),
                              arrayMap((i) => 10 + i * 40)([0, 1, 2, 3]),
                              multimeterText(state.focus.tag === "Just" ? $Maybe("Just", state.focus._1.info) : Nothing)
                            )
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      )
    };
  };

  // output-es/Component.Piece.Types/index.js
  var $Action5 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output3 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Query3 = (tag, _1) => ({ tag, _1 });
  var OnDrop = (value0) => (value1) => $Action5("OnDrop", value0, value1);
  var OnMouseUp = (value0) => (value1) => $Action5("OnMouseUp", value0, value1);
  var PortOnMouseLeave = /* @__PURE__ */ $Action5("PortOnMouseLeave");
  var initialState2 = (v) => ({
    piece: v.piece,
    location: v.location,
    rotation: intMod(0)(4),
    isRotating: Nothing,
    isDragging: false,
    portStates: functorMap.map((port3) => ({ port: port3, signal: 0, connected: false }))(v.piece.ports)
  });

  // output-es/Component.Rendering.Path/index.js
  var renderPathWithEvents = (v) => (onMouseEnter) => (onMouseLeave) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "g",
    [],
    [
      $VDom("Elem", $Maybe("Just", "http://www.w3.org/2000/svg"), "defs", [], [v.gradient.def]),
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "path",
        [
          d(v.path),
          v.attrs,
          $Prop("Attribute", Nothing, "fill", "url('#" + v.gradient.id + "')"),
          $Prop("Handler", "mouseenter", (ev) => $Maybe("Just", $Input("Action", onMouseEnter))),
          $Prop("Handler", "mouseleave", (ev) => $Maybe("Just", $Input("Action", onMouseLeave)))
        ],
        []
      )
    ]
  );

  // output-es/Component.Rendering.Gradient/index.js
  var clamp = (low) => (hi) => (x3) => {
    const v = ordInt.compare(low)(x3);
    const $0 = (() => {
      if (v === "LT") {
        return x3;
      }
      if (v === "EQ") {
        return low;
      }
      if (v === "GT") {
        return low;
      }
      fail();
    })();
    const v$1 = ordInt.compare(hi)($0);
    if (v$1 === "LT") {
      return hi;
    }
    if (v$1 === "EQ") {
      return hi;
    }
    if (v$1 === "GT") {
      return $0;
    }
    fail();
  };
  var identity16 = (x3) => x3;
  var intercalate4 = (sep) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: v.acc + sep + v1 };
  })({ init: true, acc: "" })(xs).acc;
  var shadeColor = (percentage) => (v) => {
    if (v.tag === "RGB") {
      return $Color2(
        "RGB",
        clamp(0)(255)(intDiv(v._1 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._2 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._3 * (100 + percentage | 0) | 0, 100))
      );
    }
    if (v.tag === "RGBA") {
      return $Color2(
        "RGBA",
        clamp(0)(255)(intDiv(v._1 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._2 * (100 + percentage | 0) | 0, 100)),
        clamp(0)(255)(intDiv(v._3 * (100 + percentage | 0) | 0, 100)),
        v._4
      );
    }
    return v;
  };
  var portColor = (port3) => (signal) => (signal === 0 ? shadeColor(-30) : identity16)((() => {
    const v = portCapacity(port3);
    if (v === "OneBit") {
      return $Color2("RGB", 117, 242, 191);
    }
    if (v === "TwoBit") {
      return $Color2("RGB", 120, 204, 250);
    }
    if (v === "FourBit") {
      return $Color2("RGB", 208, 135, 221);
    }
    if (v === "EightBit") {
      return $Color2("RGB", 228, 100, 156);
    }
    fail();
  })());
  var createPortGradient = (v) => {
    const color = portColor(v.port)(v.signal);
    const id4 = intercalate4("-")([
      "port-gradient",
      isInput(v.port) ? "in" : "out",
      v.signal === 0 ? "off" : "on",
      showIntImpl((() => {
        const $0 = portCapacity(v.port);
        if ($0 === "OneBit") {
          return 1;
        }
        if ($0 === "TwoBit") {
          return 2;
        }
        if ($0 === "FourBit") {
          return 4;
        }
        if ($0 === "EightBit") {
          return 8;
        }
        fail();
      })()) + "bit"
    ]);
    return {
      id: id4,
      def: (() => {
        const v1 = portType(v.port);
        return $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "linearGradient",
          [id3(id4), gradientTransform([$Transform("Rotate", 90, 0, 0)])],
          (() => {
            if (v1 === "Input") {
              return [
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("5%"), stopColor(color), stopOpacity(0.5)],
                  []
                ),
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("95%"), stopColor(color)],
                  []
                )
              ];
            }
            if (v1 === "Output") {
              return [
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("5%"), stopColor(color), stopOpacity(0.5)],
                  []
                ),
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "stop",
                  [offset("95%"), stopColor(color), stopOpacity(0)],
                  []
                )
              ];
            }
            fail();
          })()
        );
      })()
    };
  };

  // output-es/Halogen.Svg.Attributes.Path/index.js
  var $CommandPositionReference = (tag) => tag;
  var Rel = /* @__PURE__ */ $CommandPositionReference("Rel");
  var Abs = /* @__PURE__ */ $CommandPositionReference("Abs");
  var renderCommand2Args = (s_) => (ref) => (a_) => (b) => (() => {
    if (ref === "Rel") {
      return s_;
    }
    if (ref === "Abs") {
      return toUpper(s_);
    }
    fail();
  })() + showNumberImpl(a_) + ", " + showNumberImpl(b);
  var renderCommand4Args = (s_) => (ref) => (a_) => (b) => (c_) => (d_) => (() => {
    if (ref === "Rel") {
      return s_;
    }
    if (ref === "Abs") {
      return toUpper(s_);
    }
    fail();
  })() + showNumberImpl(a_) + ", " + showNumberImpl(b) + ", " + showNumberImpl(c_) + ", " + showNumberImpl(d_);

  // output-es/Component.Rendering.Wire/index.js
  var sub1 = /* @__PURE__ */ (() => ringTuple(ringNumber)(ringNumber).sub)();
  var tell = /* @__PURE__ */ (() => monadTellWriterT(monoidArray)(monadIdentity).tell)();
  var applicativeWriterT3 = /* @__PURE__ */ applicativeWriterT(monoidArray)(applicativeIdentity);
  var for_4 = /* @__PURE__ */ for_(applicativeWriterT3)(foldableMaybe);
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeWriterT3)(foldableArray);
  var show2 = /* @__PURE__ */ (() => showMap(showCardinalDirection)({
    show: (record) => (record.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record.port) + ", signal: " + showSignal.show(record.signal) + " }"
  }).show)();
  var stubPath = (v) => {
    if (v === "Up") {
      return [
        renderCommand2Args("l")(Rel)(0)(-25),
        renderCommand2Args("l")(Rel)(30)(0),
        renderCommand2Args("l")(Rel)(0)(25)
      ];
    }
    if (v === "Right") {
      return [
        renderCommand2Args("l")(Rel)(25)(0),
        renderCommand2Args("l")(Rel)(0)(30),
        renderCommand2Args("l")(Rel)(-25)(0)
      ];
    }
    if (v === "Down") {
      return [
        renderCommand2Args("l")(Rel)(0)(25),
        renderCommand2Args("l")(Rel)(-30)(0),
        renderCommand2Args("l")(Rel)(0)(-25)
      ];
    }
    if (v === "Left") {
      return [
        renderCommand2Args("l")(Rel)(-25)(0),
        renderCommand2Args("l")(Rel)(0)(-30),
        renderCommand2Args("l")(Rel)(25)(0)
      ];
    }
    fail();
  };
  var betweenPath = (to) => (from) => {
    const v = sub1((() => {
      if (from === "Up") {
        return $Tuple(35, 25);
      }
      if (from === "Right") {
        return $Tuple(75, 35);
      }
      if (from === "Down") {
        return $Tuple(65, 75);
      }
      if (from === "Left") {
        return $Tuple(25, 65);
      }
      fail();
    })())((() => {
      if (to === "Up") {
        return $Tuple(65, 25);
      }
      if (to === "Right") {
        return $Tuple(75, 65);
      }
      if (to === "Down") {
        return $Tuple(35, 75);
      }
      if (to === "Left") {
        return $Tuple(25, 35);
      }
      fail();
    })());
    if (from === "Up") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from === "Right") {
      return [renderCommand4Args("q")(Rel)(0)(v._2)(v._1)(v._2)];
    }
    if (from === "Down") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from === "Left") {
      return [renderCommand4Args("q")(Rel)(0)(v._2)(v._1)(v._2)];
    }
    fail();
  };
  var arrowPath = (v) => {
    if (v === "Up") {
      return [
        renderCommand2Args("l")(Rel)(0)(-13),
        renderCommand2Args("l")(Rel)(-10)(0),
        renderCommand2Args("l")(Rel)(25)(-12),
        renderCommand2Args("l")(Rel)(25)(12),
        renderCommand2Args("l")(Rel)(-10)(0),
        renderCommand2Args("l")(Rel)(0)(13)
      ];
    }
    if (v === "Right") {
      return [
        renderCommand2Args("l")(Rel)(13)(0),
        renderCommand2Args("l")(Rel)(0)(-10),
        renderCommand2Args("l")(Rel)(12)(25),
        renderCommand2Args("l")(Rel)(-12)(25),
        renderCommand2Args("l")(Rel)(0)(-10),
        renderCommand2Args("l")(Rel)(-13)(0)
      ];
    }
    if (v === "Down") {
      return [
        renderCommand2Args("l")(Rel)(0)(13),
        renderCommand2Args("l")(Rel)(10)(0),
        renderCommand2Args("l")(Rel)(-25)(12),
        renderCommand2Args("l")(Rel)(-25)(-12),
        renderCommand2Args("l")(Rel)(10)(0),
        renderCommand2Args("l")(Rel)(0)(-13)
      ];
    }
    if (v === "Left") {
      return [
        renderCommand2Args("l")(Rel)(-13)(0),
        renderCommand2Args("l")(Rel)(0)(10),
        renderCommand2Args("l")(Rel)(-12)(-25),
        renderCommand2Args("l")(Rel)(12)(-25),
        renderCommand2Args("l")(Rel)(0)(10),
        renderCommand2Args("l")(Rel)(13)(0)
      ];
    }
    fail();
  };
  var wirePath = (ports) => {
    const $0 = find(foldableMap)((portInfo) => isInput(portInfo.port))(ports);
    const info2 = (() => {
      if ($0.tag === "Nothing") {
        return _crashWith("assertion failed: wire path created with no inputs. ports: " + show2(ports));
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    return {
      path: for_4(unconsImpl(
        (v) => Nothing,
        (x3) => (xs) => $Maybe("Just", { head: x3, tail: xs }),
        toUnfoldable(unfoldableArray)(ports)
      ))((v) => {
        if (v.head._1 === "Up") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(35)(25)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(
            Tuple,
            toUnfoldable(unfoldableArray)(ports),
            arrayMap(fst)([...v.tail, v.head])
          )));
        }
        if (v.head._1 === "Right") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(75)(35)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(
            Tuple,
            toUnfoldable(unfoldableArray)(ports),
            arrayMap(fst)([...v.tail, v.head])
          )));
        }
        if (v.head._1 === "Down") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(65)(75)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(
            Tuple,
            toUnfoldable(unfoldableArray)(ports),
            arrayMap(fst)([...v.tail, v.head])
          )));
        }
        if (v.head._1 === "Left") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell([
            renderCommand2Args("m")(Rel)(25)(65)
          ]))(() => traverse_6((v$1) => tell([
            ...(() => {
              if (isInput(v$1._1._2.port)) {
                return stubPath(v$1._1._1);
              }
              if (v$1._1._2.connected) {
                return stubPath(v$1._1._1);
              }
              return arrowPath(v$1._1._1);
            })(),
            ...betweenPath(v$1._1._1)(v$1._2)
          ]))(zipWithImpl(
            Tuple,
            toUnfoldable(unfoldableArray)(ports),
            arrayMap(fst)([...v.tail, v.head])
          )));
        }
        fail();
      })._2,
      gradient: createPortGradient(info2),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info2.connected)
      )
    };
  };
  var renderWire = (portStates) => renderPathWithEvents(wirePath(portStates))($Action5(
    "PortOnMouseEnter",
    (() => {
      const $0 = findWithIndex(foldableWithIndexMap)((v) => (info2) => isInput(info2.port))(portStates);
      if ($0.tag === "Nothing") {
        return _crashWith("assertion failed: wire path created with no inputs. ports: " + show2(portStates));
      }
      if ($0.tag === "Just") {
        return $0._1.index;
      }
      fail();
    })()
  ))(PortOnMouseLeave);

  // output-es/Component.Rendering.CrossOver/index.js
  var filterKeys2 = /* @__PURE__ */ filterKeys(ordCardinalDirection);
  var elem2 = /* @__PURE__ */ (() => {
    const any1 = foldableArray.foldMap((() => {
      const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
      return { mempty: false, Semigroup0: () => semigroupDisj1 };
    })());
    return (x3) => any1((y3) => {
      if (x3 === "Up") {
        return y3 === "Up";
      }
      if (x3 === "Right") {
        return y3 === "Right";
      }
      if (x3 === "Down") {
        return y3 === "Down";
      }
      return x3 === "Left" && y3 === "Left";
    });
  })();
  var renderDualInputDualOutputPiece = (v) => (v1) => (portStates) => {
    const $0 = v._2;
    const $1 = v1._2;
    const $2 = v._1;
    const $3 = v1._1;
    return $VDom(
      "Elem",
      $Maybe("Just", "http://www.w3.org/2000/svg"),
      "g",
      [],
      [
        renderPathWithEvents(wirePath(filterKeys2((v2) => elem2(v2)([$2, $0]))(portStates)))($Action5(
          "PortOnMouseEnter",
          $0
        ))(PortOnMouseLeave),
        renderPathWithEvents(wirePath(filterKeys2((v2) => elem2(v2)([$3, $1]))(portStates)))($Action5(
          "PortOnMouseEnter",
          $1
        ))(PortOnMouseLeave)
      ]
    );
  };

  // output-es/Component.Rendering.Port/index.js
  var portPath = (info2) => {
    if (portType(info2.port) === "Input") {
      return {
        path: [
          renderCommand2Args("m")(Rel)(40)(0),
          ...(() => {
            const v2 = portType(info2.port);
            if (v2 === "Input") {
              return arrowPath(Down);
            }
            if (v2 === "Output") {
              if (info2.connected) {
                return stubPath(Up);
              }
              return arrowPath(Up);
            }
            fail();
          })(),
          ...betweenPath(Up)(Up)
        ],
        gradient: createPortGradient(info2),
        attrs: $Prop(
          "Attribute",
          Nothing,
          isConnected.attrName,
          isConnected.attrPrint(info2.connected)
        )
      };
    }
    return {
      path: [
        renderCommand2Args("m")(Rel)(10)(25),
        ...(() => {
          const v2 = portType(info2.port);
          if (v2 === "Input") {
            return arrowPath(Down);
          }
          if (v2 === "Output") {
            if (info2.connected) {
              return stubPath(Up);
            }
            return arrowPath(Up);
          }
          fail();
        })(),
        ...betweenPath(Up)(Up)
      ],
      gradient: createPortGradient(info2),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info2.connected)
      )
    };
  };

  // output-es/Game.Expression/index.js
  var $Expression = (tag, _1, _2) => ({ tag, _1, _2 });
  var evaluate = (m) => {
    const go = (v) => {
      if (v.tag === "Raw") {
        return v._1;
      }
      if (v.tag === "Ref") {
        const $0 = lookup(ordCardinalDirection)(v._1)(m);
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      }
      if (v.tag === "Not") {
        return ~go(v._1);
      }
      if (v.tag === "Or") {
        return go(v._1) | go(v._2);
      }
      if (v.tag === "And") {
        return go(v._1) & go(v._2);
      }
      if (v.tag === "Xor") {
        return go(v._1) ^ go(v._2);
      }
      fail();
    };
    return go;
  };

  // output-es/Game.Piece.BasicPiece/index.js
  var $BasicPort = (tag, _1) => ({ tag, _1 });
  var fromFoldable5 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var BasicInput = /* @__PURE__ */ $BasicPort("BasicInput");
  var basicPiece = (basic) => ({
    name: basic.name,
    eval: (inputs) => mapMaybeWithKey(ordCardinalDirection)((v) => (v$1) => {
      if (v$1.tag === "BasicInput") {
        return Nothing;
      }
      if (v$1.tag === "BasicOutput") {
        return $Maybe(
          "Just",
          (() => {
            if (basic.capacity === "OneBit") {
              return 1;
            }
            if (basic.capacity === "TwoBit") {
              return 3;
            }
            if (basic.capacity === "FourBit") {
              return 15;
            }
            if (basic.capacity === "EightBit") {
              return 255;
            }
            fail();
          })() & evaluate(inputs)(v$1._1)
        );
      }
      fail();
    })(basic.ports),
    complexity: basic.complexity,
    shouldRipple: true,
    updateCapacity: (v) => (capacity2) => $Maybe("Just", basicPiece({ ...basic, capacity: capacity2 })),
    ports: functorMap.map((v) => {
      if (v.tag === "BasicInput") {
        return { portType: Input, capacity: basic.capacity };
      }
      if (v.tag === "BasicOutput") {
        return { portType: Output, capacity: basic.capacity };
      }
      fail();
    })(basic.ports),
    updatePort: (v) => (v1) => Nothing
  });
  var chickenPiece = /* @__PURE__ */ basicPiece({
    name: "chicken-piece",
    capacity: OneBit,
    complexity: { space: 2, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Right2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Right2))),
      /* @__PURE__ */ $Tuple(Down, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Left2)))
    ])
  });
  var cornerCutPiece = /* @__PURE__ */ basicPiece({
    name: "corner-cut-piece",
    capacity: OneBit,
    complexity: { space: 2, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, BasicInput),
      /* @__PURE__ */ $Tuple(Right2, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Up))),
      /* @__PURE__ */ $Tuple(Down, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Left2)))
    ])
  });
  var crossPiece = /* @__PURE__ */ basicPiece({
    name: "cross-piece",
    capacity: OneBit,
    complexity: { space: 2, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, BasicInput),
      /* @__PURE__ */ $Tuple(Right2, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Left2))),
      /* @__PURE__ */ $Tuple(Down, /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Ref", Up)))
    ])
  });
  var notPiece = /* @__PURE__ */ basicPiece({
    name: "not-piece",
    capacity: OneBit,
    complexity: { space: 2, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(
        Right2,
        /* @__PURE__ */ $BasicPort("BasicOutput", /* @__PURE__ */ $Expression("Not", /* @__PURE__ */ $Expression("Ref", Left2)))
      )
    ])
  });
  var orPiece = /* @__PURE__ */ basicPiece({
    name: "or-piece",
    capacity: OneBit,
    complexity: { space: 3, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, BasicInput),
      /* @__PURE__ */ $Tuple(
        Right2,
        /* @__PURE__ */ $BasicPort(
          "BasicOutput",
          /* @__PURE__ */ $Expression(
            "Or",
            /* @__PURE__ */ $Expression("Ref", Left2),
            /* @__PURE__ */ $Expression("Ref", Up)
          )
        )
      )
    ])
  });
  var xorPiece = /* @__PURE__ */ basicPiece({
    name: "xor-piece",
    capacity: OneBit,
    complexity: { space: 5, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, BasicInput),
      /* @__PURE__ */ $Tuple(
        Right2,
        /* @__PURE__ */ $BasicPort(
          "BasicOutput",
          /* @__PURE__ */ $Expression(
            "Xor",
            /* @__PURE__ */ $Expression("Ref", Left2),
            /* @__PURE__ */ $Expression("Ref", Up)
          )
        )
      )
    ])
  });
  var andPiece = /* @__PURE__ */ basicPiece({
    name: "and-piece",
    capacity: OneBit,
    complexity: { space: 3, time: 0 },
    ports: /* @__PURE__ */ fromFoldable5([
      /* @__PURE__ */ $Tuple(Left2, BasicInput),
      /* @__PURE__ */ $Tuple(Up, BasicInput),
      /* @__PURE__ */ $Tuple(
        Right2,
        /* @__PURE__ */ $BasicPort(
          "BasicOutput",
          /* @__PURE__ */ $Expression(
            "And",
            /* @__PURE__ */ $Expression("Ref", Left2),
            /* @__PURE__ */ $Expression("Ref", Up)
          )
        )
      )
    ])
  });
  var allBasicPieces = [notPiece, orPiece, andPiece, crossPiece, cornerCutPiece, chickenPiece, xorPiece];

  // output-es/Game.Piece.WirePiece/index.js
  var ordSet2 = /* @__PURE__ */ ordSet(ordCardinalDirection);
  var length4 = /* @__PURE__ */ (() => foldableSet.foldl((c) => (v) => 1 + c | 0)(0))();
  var fromFoldable6 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordCardinalDirection)(a)()(m))(Leaf2);
  var elem3 = /* @__PURE__ */ (() => {
    const any1 = foldableMap.foldMap((() => {
      const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
      return { mempty: false, Semigroup0: () => semigroupDisj1 };
    })());
    return (x3) => any1((y3) => x3 === y3);
  })();
  var wirePieceNames = /* @__PURE__ */ fromFoldable(ordSet2)(foldableArray)([
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ $$$Map("Two", Leaf2, Up, void 0, Leaf2),
      "left-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ $$$Map("Two", Leaf2, Right2, void 0, Leaf2),
      "id-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ $$$Map("Two", Leaf2, Down, void 0, Leaf2),
      "right-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ unionWith(ordCardinalDirection)($$const)(/* @__PURE__ */ $$$Map(
        "Two",
        Leaf2,
        Up,
        void 0,
        Leaf2
      ))(/* @__PURE__ */ $$$Map("Two", Leaf2, Right2, void 0, Leaf2)),
      "intersection-left-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ unionWith(ordCardinalDirection)($$const)(/* @__PURE__ */ $$$Map(
        "Two",
        Leaf2,
        Up,
        void 0,
        Leaf2
      ))(/* @__PURE__ */ $$$Map("Two", Leaf2, Down, void 0, Leaf2)),
      "intersection-junction-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ unionWith(ordCardinalDirection)($$const)(/* @__PURE__ */ $$$Map(
        "Two",
        Leaf2,
        Right2,
        void 0,
        Leaf2
      ))(/* @__PURE__ */ $$$Map("Two", Leaf2, Down, void 0, Leaf2)),
      "intersection-right-piece"
    ),
    /* @__PURE__ */ $Tuple(
      /* @__PURE__ */ unionWith(ordCardinalDirection)($$const)(/* @__PURE__ */ $$$Map(
        "Two",
        Leaf2,
        Up,
        void 0,
        Leaf2
      ))(/* @__PURE__ */ unionWith(ordCardinalDirection)($$const)(/* @__PURE__ */ $$$Map(
        "Two",
        Leaf2,
        Right2,
        void 0,
        Leaf2
      ))(/* @__PURE__ */ $$$Map("Two", Leaf2, Down, void 0, Leaf2))),
      "super-piece"
    )
  ]);
  var mkWirePiece = (wire) => ({
    name: (() => {
      const $0 = lookup(ordSet2)(wire.outputs)(wirePieceNames);
      if ($0.tag === "Nothing") {
        return _crashWith("impossible to create wirePiece with no outputs");
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    eval: (inputs) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(inputs);
      const $1 = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return functorMap.map((v) => $1)(wire.outputs);
    },
    complexity: { space: toNumber(length4(wire.outputs)), time: 0 },
    shouldRipple: true,
    updateCapacity: (v) => (capacity2) => $Maybe("Just", mkWirePiece({ ...wire, capacity: capacity2 })),
    ports: insert(ordCardinalDirection)(Left2)({ portType: Input, capacity: wire.capacity })(functorMap.map((v) => ({ portType: Output, capacity: wire.capacity }))(wire.outputs)),
    updatePort: (dir2) => (portType3) => {
      if (dir2 === "Left") {
        return Nothing;
      }
      if (portType3.tag === "Just") {
        if (portType3._1 === "Input") {
          const newOutputs = insert(ordCardinalDirection)(dir2)()(wire.outputs);
          if (!eqMap(eqCardinalDirection)(eqUnit).eq(wire.outputs)(newOutputs)) {
            return $Maybe("Just", mkWirePiece({ ...wire, outputs: newOutputs }));
          }
          return Nothing;
        }
        if (portType3._1 === "Output") {
          return Nothing;
        }
        fail();
      }
      if (portType3.tag === "Nothing") {
        const newOutputs = $$delete(ordCardinalDirection)(dir2)(wire.outputs);
        if (!eqMap(eqCardinalDirection)(eqUnit).eq(wire.outputs)(newOutputs)) {
          if (newOutputs.tag === "Leaf") {
            return $Maybe(
              "Just",
              mkWirePiece({ ...wire, outputs: $$$Map("Two", Leaf2, Right2, void 0, Leaf2) })
            );
          }
          return $Maybe("Just", mkWirePiece({ ...wire, outputs: newOutputs }));
        }
        return Nothing;
      }
      fail();
    }
  });
  var rightPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable6([Down]) });
  var superPiece = /* @__PURE__ */ mkWirePiece({
    capacity: OneBit,
    outputs: /* @__PURE__ */ fromFoldable6([Up, Right2, Down])
  });
  var leftPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable6([Up]) });
  var idPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable6([Right2]) });
  var allWirePieces = [idPiece, leftPiece, rightPiece, superPiece];

  // output-es/Component.Rendering.Piece/index.js
  var renderDefaultPiece = (state) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "g",
    [],
    [
      ...arrayBind(allDirections)((dir2) => [
        $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "g",
          [
            transform([
              $Transform("Rotate", toNumber(clockwiseRotation(Up)(dir2)) * 90, 50, 50),
              $Transform("Translate", 25, 0)
            ])
          ],
          arrayBind(fromFoldableImpl(
            foldableMaybe.foldr,
            lookup(ordCardinalDirection)(dir2)(state.portStates)
          ))((portInfo) => [
            renderPathWithEvents(portPath(portInfo))($Action5("PortOnMouseEnter", dir2))(PortOnMouseLeave)
          ])
        )
      ]),
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "g",
        [transform([$Transform("Translate", 30, 30)])],
        [
          $VDom(
            "Elem",
            $Maybe("Just", "http://www.w3.org/2000/svg"),
            "svg",
            [width(50), height(50)],
            [
              $VDom(
                "Elem",
                $Maybe("Just", "http://www.w3.org/2000/svg"),
                "image",
                [href3("./images/" + state.piece.name + ".png"), width(40), height(40)],
                []
              )
            ]
          )
        ]
      )
    ]
  );
  var renderPiece = (state) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "svg",
    [viewBox(0)(0)(100)(100)],
    [
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "g",
        [
          transform([
            $Transform(
              "Rotate",
              (() => {
                const $0 = toNumber(state.rotation) * 90;
                if (state.isRotating.tag === "Nothing") {
                  return $0;
                }
                if (state.isRotating.tag === "Just") {
                  return 57.29577951308232 * state.isRotating._1.currentRotation;
                }
                fail();
              })(),
              50,
              50
            )
          ])
        ],
        [
          (() => {
            if (elem3(state.piece.name)(wirePieceNames)) {
              return renderWire(state.portStates);
            }
            if (state.piece.name === crossPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Right2))($Tuple(
                Up,
                Down
              ))(state.portStates);
            }
            if (state.piece.name === cornerCutPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Down))($Tuple(
                Up,
                Right2
              ))(state.portStates);
            }
            if (state.piece.name === chickenPiece.name) {
              return renderDualInputDualOutputPiece($Tuple(Left2, Down))($Tuple(
                Right2,
                Up
              ))(state.portStates);
            }
            return renderDefaultPiece(state);
          })()
        ]
      )
    ]
  );

  // output-es/Halogen.Properties.Extras/index.js
  var contentEditable = /* @__PURE__ */ Property("contentEditable");

  // output-es/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value2) {
    var tag = Object.prototype.toString.call(value2);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value2);
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

  // output-es/Halogen.Query/index.js
  var identity17 = (x3) => x3;
  var tell2 = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot3) => (label) => (req2) => {
      const $0 = query2(slot3)(label)(req2());
      return $Free($0._1, snoc($0._2)((x3) => $Free($FreeView("Return", void 0), CatNil)));
    };
  };
  var request = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot3) => (label) => (req2) => query2(slot3)(label)(req2(identity17));
  };
  var getHTMLElementRef = /* @__PURE__ */ (() => {
    const $0 = freeFunctor.map((v) => {
      if (v.tag === "Just") {
        return _read(Nothing, Just, v._1);
      }
      if (v.tag === "Nothing") {
        return Nothing;
      }
      fail();
    });
    return (x3) => $0($Free(
      $FreeView(
        "Bind",
        $HalogenF("GetRef", x3, identity11),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ));
  })();

  // output-es/Component.Piece/index.js
  var modify_2 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var traverse_7 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var sub12 = /* @__PURE__ */ (() => ringTuple(ringNumber)(ringNumber).sub)();
  var gets2 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var angleBetween = (v1) => (v2) => atan2(v1._1 * v2._2 - v2._1 * v1._2)(v1._1 * v2._1 + v1._2 * v2._2);
  var component5 = (dictMonadEffect) => {
    const $0 = monadEffectHalogenM(dictMonadEffect);
    return {
      eval: mkEval({
        finalize: Nothing,
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v.tag === "OnDrop") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, isDragging: false }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output3("Dropped", $1), void 0),
                  (x3) => $Free($FreeView("Return", x3), CatNil)
                ),
                CatNil
              ))
            );
          }
          if (v.tag === "OnDrag") {
            const $1 = modify_2((v1) => ({ ...v1, isDragging: true }));
            return $Free(
              $1._1,
              snoc($1._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v.tag === "OnMouseDown") {
            const $1 = v._1;
            const $2 = getHTMLElementRef("piece");
            return $Free(
              $2._1,
              snoc($2._2)(traverse_7((he) => {
                const $3 = $0.liftEffect((() => {
                  const $32 = clientWidth(he);
                  return () => {
                    const a$p = $32();
                    return 0.5 * a$p;
                  };
                })());
                return $Free(
                  $3._1,
                  snoc($3._2)((r) => {
                    const $4 = $0.liftEffect((() => {
                      const $42 = getBoundingClientRect(he);
                      return () => {
                        const bb = $42();
                        return $Tuple((bb.right + bb.left) / 2, (bb.bottom + bb.top) / 2);
                      };
                    })());
                    return $Free(
                      $4._1,
                      snoc($4._2)((c) => {
                        const v1 = sub12($Tuple(toNumber(clientX($1)), toNumber(clientY($1))))(c);
                        if (r * r > v1._1 * v1._1 + v1._2 * v1._2) {
                          return modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                        }
                        const $5 = $0.liftEffect(setDraggable(false)(he));
                        return $Free(
                          $5._1,
                          snoc($5._2)(() => {
                            const $6 = gets2((v2) => v2.rotation);
                            return $Free(
                              $6._1,
                              snoc($6._2)((rotation) => modify_2((v2) => ({
                                ...v2,
                                isRotating: $Maybe(
                                  "Just",
                                  {
                                    initialClickPosition: $Tuple(
                                      toNumber(clientX($1)),
                                      toNumber(clientY($1))
                                    ),
                                    currentRotation: toNumber(rotation) * 1.5707963267948966
                                  }
                                ),
                                isDragging: false
                              })))
                            );
                          })
                        );
                      })
                    );
                  })
                );
              }))
            );
          }
          if (v.tag === "OnMouseMove") {
            const $1 = v._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("GetRef", "piece", identity11),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              snoc(CatNil)(traverse_7((e) => {
                const $2 = gets2((v1) => v1.isRotating);
                return $Free(
                  $2._1,
                  snoc($2._2)(traverse_7((v1) => {
                    const $3 = v1.initialClickPosition;
                    const $4 = gets2((v2) => v2.rotation);
                    return $Free(
                      $4._1,
                      snoc($4._2)((rotation) => {
                        const p2 = $Tuple(toNumber(clientX($1)), toNumber(clientY($1)));
                        const $5 = $0.liftEffect((() => {
                          const $52 = getBoundingClientRect(e);
                          return () => {
                            const bb = $52();
                            return $Tuple((bb.right + bb.left) / 2, (bb.bottom + bb.top) / 2);
                          };
                        })());
                        return $Free(
                          $5._1,
                          snoc($5._2)((c) => {
                            const angle = toNumber(rotation) * 1.5707963267948966 + angleBetween(sub12($3)(c))(sub12(p2)(c));
                            return modify_2((v2) => ({ ...v2, isRotating: $Maybe("Just", { initialClickPosition: $3, currentRotation: angle }) }));
                          })
                        );
                      })
                    );
                  }))
                );
              }))
            );
          }
          if (v.tag === "OnMouseUp") {
            const $1 = v._1;
            const $2 = gets2((v1) => v1.isRotating);
            return $Free(
              $2._1,
              snoc($2._2)(traverse_7((v1) => {
                const closestSnapPoint = intMod(unsafeClamp(round(4 * v1.currentRotation / 6.283185307179586)))(4);
                const $3 = gets2((v2) => v2.rotation);
                return $Free(
                  $3._1,
                  snoc($3._2)((rotation) => {
                    const $4 = modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                    return $Free(
                      $4._1,
                      snoc($4._2)(() => $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF(
                            "Raise",
                            $Output3("Rotated", $1, intMod(closestSnapPoint + intMod(-rotation)(4) | 0)(4)),
                            void 0
                          ),
                          (x3) => $Free($FreeView("Return", x3), CatNil)
                        ),
                        CatNil
                      ))
                    );
                  })
                );
              }))
            );
          }
          if (v.tag === "OnKeyDown") {
            const $1 = gets2((v1) => v1.location);
            const $2 = snoc($1._2)((loc) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output3("Rotated", loc, intMod(1)(4)), void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            ));
            if (key(v._1) === "r") {
              return $Free(
                $1._1,
                snoc($2)(() => {
                  const $3 = gets2((v1) => v1.location);
                  const $4 = $Free(
                    $3._1,
                    snoc($3._2)((loc) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Raise", $Output3("Rotated", loc, intMod(3)(4)), void 0),
                        (x3) => $Free($FreeView("Return", x3), CatNil)
                      ),
                      CatNil
                    ))
                  );
                  if (key(v._1) === "R") {
                    return $4;
                  }
                  return $Free($FreeView("Return", void 0), CatNil);
                })
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc(CatNil)(() => {
                const $3 = gets2((v1) => v1.location);
                const $4 = $Free(
                  $3._1,
                  snoc($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("Raise", $Output3("Rotated", loc, intMod(3)(4)), void 0),
                      (x3) => $Free($FreeView("Return", x3), CatNil)
                    ),
                    CatNil
                  ))
                );
                if (key(v._1) === "R") {
                  return $4;
                }
                return $Free($FreeView("Return", void 0), CatNil);
              })
            );
          }
          if (v.tag === "PortOnMouseEnter") {
            const $1 = v._1;
            const $2 = gets2((v1) => v1.portStates);
            return $Free(
              $2._1,
              snoc($2._2)((portStates) => {
                const $3 = gets2((v1) => v1.location);
                return $Free(
                  $3._1,
                  snoc($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "Raise",
                        $Output3(
                          "NewMultimeterFocus",
                          (() => {
                            const $4 = lookup(ordCardinalDirection)($1)(portStates);
                            if ($4.tag === "Just") {
                              return $Maybe("Just", { relativeEdge: { loc, dir: $1 }, info: $4._1 });
                            }
                            if ($4.tag === "Nothing") {
                              return Nothing;
                            }
                            fail();
                          })()
                        ),
                        void 0
                      ),
                      (x3) => $Free($FreeView("Return", x3), CatNil)
                    ),
                    CatNil
                  ))
                );
              })
            );
          }
          if (v.tag === "PortOnMouseLeave") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output3("NewMultimeterFocus", Nothing), void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          fail();
        },
        handleQuery: (v) => {
          if (v.tag === "SetPortStates") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, portStates: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          if (v.tag === "SetPiece") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, piece: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          if (v.tag === "SetRotation") {
            const $1 = v._1;
            const $2 = modify_2((v1) => ({ ...v1, rotation: $1 }));
            return $Free(
              $2._1,
              snoc($2._2)(() => $Free($FreeView("Return", Nothing), CatNil))
            );
          }
          fail();
        },
        initialize: Nothing,
        receive: (v) => Nothing
      }),
      initialState: initialState2,
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          classes(["piece-component"]),
          $Prop(
            "Attribute",
            Nothing,
            isDragging.attrName,
            isDragging.attrPrint(state.isDragging)
          ),
          $Prop("Attribute", Nothing, "data-rotation", showIntImpl(state.rotation)),
          $Prop("Attribute", Nothing, "data-piece-id", state.piece.name),
          draggable((() => {
            if (state.isRotating.tag === "Nothing") {
              return true;
            }
            if (state.isRotating.tag === "Just") {
              return false;
            }
            fail();
          })()),
          $Prop(
            "Ref",
            (x3) => $Maybe(
              "Just",
              $Input(
                "RefUpdate",
                "piece",
                (() => {
                  if (x3.tag === "Created") {
                    return $Maybe("Just", x3._1);
                  }
                  if (x3.tag === "Removed") {
                    return Nothing;
                  }
                  fail();
                })()
              )
            )
          ),
          contentEditable(true),
          (() => {
            const $1 = OnDrop(state.location);
            return $Prop("Handler", "dragend", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
          })(),
          $Prop("Handler", "drag", (ev) => $Maybe("Just", $Input("Action", $Action5("OnDrag", ev)))),
          $Prop(
            "Handler",
            "mousedown",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnMouseDown", ev)))
          ),
          $Prop(
            "Handler",
            "mousemove",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnMouseMove", ev)))
          ),
          (() => {
            const $1 = OnMouseUp(state.location);
            return $Prop("Handler", "mouseup", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
          })(),
          $Prop(
            "Handler",
            "keydown",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnKeyDown", ev)))
          )
        ],
        [renderPiece(state)]
      )
    };
  };

  // output-es/Data.Lens.Internal.Wander/index.js
  var wanderFunction = { wander: (t) => t(applicativeIdentity), Strong0: () => strongFn, Choice1: () => choiceFn };

  // output-es/Debug/foreign.js
  var req = typeof module === "undefined" ? void 0 : module.require;
  var util = function() {
    try {
      return req === void 0 ? void 0 : req("util");
    } catch (e) {
      return void 0;
    }
  }();
  var now2 = function() {
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

  // output-es/Game.Piece.FusePiece/index.js
  var fromFoldable7 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkSeverPiece = (v) => {
    const $0 = v.outputCapacity;
    return {
      name: "sever-piece",
      eval: (inputs) => {
        const $1 = lookup(ordCardinalDirection)(Left2)(inputs);
        if ($1.tag === "Nothing") {
          return fromFoldable7([$Tuple(Up, 0), $Tuple(Down, 0)]);
        }
        if ($1.tag === "Just") {
          const n = (() => {
            if ($0 === "OneBit") {
              return 1;
            }
            if ($0 === "TwoBit") {
              return 2;
            }
            if ($0 === "FourBit") {
              return 4;
            }
            if ($0 === "EightBit") {
              return 8;
            }
            fail();
          })();
          return fromFoldable7([$Tuple(Up, $1._1 >> n), $Tuple(Down, $1._1 & ((1 << n) - 1 | 0))]);
        }
        fail();
      },
      complexity: { space: 1, time: 0 },
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity2) => {
        if (dir2 === "Right") {
          return Nothing;
        }
        if (dir2 === "Left") {
          const $1 = halveCapacity(capacity2);
          if ($1.tag === "Just") {
            if ((() => {
              if ($0 === "OneBit") {
                return $1._1 !== "OneBit";
              }
              if ($0 === "TwoBit") {
                return $1._1 !== "TwoBit";
              }
              if ($0 === "FourBit") {
                return $1._1 !== "FourBit";
              }
              return !($0 === "EightBit" && $1._1 === "EightBit");
            })()) {
              return $Maybe("Just", mkSeverPiece({ outputCapacity: $1._1 }));
            }
            return Nothing;
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        if ((() => {
          if (capacity2 === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity2 === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity2 === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity2 === "EightBit" && $0 === "EightBit");
        })()) {
          return $Maybe("Just", mkSeverPiece({ outputCapacity: capacity2 }));
        }
        return Nothing;
      },
      ports: (() => {
        const $1 = doubleCapacity($0);
        if ($1.tag === "Just") {
          return fromFoldable7([
            $Tuple(Left2, { portType: Input, capacity: $1._1 }),
            $Tuple(Up, { portType: Output, capacity: $0 }),
            $Tuple(Down, { portType: Output, capacity: $0 })
          ]);
        }
        if ($1.tag === "Nothing") {
          return Leaf2;
        }
        fail();
      })(),
      updatePort: (v1) => (v2) => Nothing
    };
  };
  var severPiece = /* @__PURE__ */ mkSeverPiece({ outputCapacity: OneBit });
  var mkFusePiece = (v) => {
    const $0 = v.inputCapacity;
    return {
      name: "fuse-piece",
      eval: (inputs) => {
        const $1 = lookup(ordCardinalDirection)(Up)(inputs);
        return $$$Map(
          "Two",
          Leaf2,
          Right2,
          (() => {
            const $2 = lookup(ordCardinalDirection)(Down)(inputs);
            const n = (() => {
              if ($0 === "OneBit") {
                return 1;
              }
              if ($0 === "TwoBit") {
                return 2;
              }
              if ($0 === "FourBit") {
                return 4;
              }
              if ($0 === "EightBit") {
                return 8;
              }
              fail();
            })();
            return (() => {
              if ($1.tag === "Nothing") {
                return 0 << n;
              }
              if ($1.tag === "Just") {
                return $1._1 << n;
              }
              fail();
            })() | (() => {
              if ($2.tag === "Nothing") {
                return 0;
              }
              if ($2.tag === "Just") {
                return $2._1;
              }
              fail();
            })() & ((1 << n) - 1 | 0);
          })(),
          Leaf2
        );
      },
      complexity: { space: 1, time: 0 },
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity2) => {
        if (dir2 === "Left") {
          return Nothing;
        }
        if (dir2 === "Right") {
          const $1 = halveCapacity(capacity2);
          if ($1.tag === "Just") {
            if ((() => {
              if ($1._1 === "OneBit") {
                return $0 !== "OneBit";
              }
              if ($1._1 === "TwoBit") {
                return $0 !== "TwoBit";
              }
              if ($1._1 === "FourBit") {
                return $0 !== "FourBit";
              }
              return !($1._1 === "EightBit" && $0 === "EightBit");
            })()) {
              return $Maybe("Just", mkFusePiece({ inputCapacity: $1._1 }));
            }
            return Nothing;
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        if ((() => {
          if (capacity2 === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity2 === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity2 === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity2 === "EightBit" && $0 === "EightBit");
        })()) {
          const $1 = doubleCapacity(capacity2);
          if ($1.tag === "Just") {
            return $Maybe("Just", mkFusePiece({ inputCapacity: capacity2 }));
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        return Nothing;
      },
      ports: (() => {
        const $1 = doubleCapacity($0);
        if ($1.tag === "Just") {
          return fromFoldable7([
            $Tuple(Up, { portType: Input, capacity: $0 }),
            $Tuple(Down, { portType: Input, capacity: $0 }),
            $Tuple(Right2, { portType: Output, capacity: $1._1 })
          ]);
        }
        if ($1.tag === "Nothing") {
          return Leaf2;
        }
        fail();
      })(),
      updatePort: (v1) => (v2) => Nothing
    };
  };
  var fusePiece = /* @__PURE__ */ mkFusePiece({ inputCapacity: OneBit });
  var allFusePieces = [fusePiece, severPiece];

  // output-es/Game.Piece/index.js
  var allPieces = [...allBasicPieces, ...allWirePieces, ...allFusePieces];
  var pieceVault = /* @__PURE__ */ fromFoldable(ordPieceId)(foldableArray)(/* @__PURE__ */ arrayMap((v) => $Tuple(
    v.name,
    v
  ))(allPieces));
  var pieceLookup = (pieceId) => {
    const message2 = "piece lookup crash on " + pieceId + "... WITH NO SURVIVORS";
    const $0 = lookup(ordPieceId)(pieceId)(pieceVault);
    if ($0.tag === "Nothing") {
      return _crashWith(message2);
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Game.Board.Operation/index.js
  var _pieces4 = /* @__PURE__ */ _pieces(strongForget);
  var at3 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces13 = /* @__PURE__ */ _pieces(strongFn);
  var ix2 = /* @__PURE__ */ (() => indexMap(ordLocation).ix)();
  var all2 = /* @__PURE__ */ (() => foldableArray.foldMap((() => {
    const semigroupConj1 = { append: (v) => (v1) => v && v1 };
    return { mempty: true, Semigroup0: () => semigroupConj1 };
  })()))();
  var updateRelEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Applicative0 = Monad0.Applicative0();
    const traverse_17 = traverse_(Applicative0)(foldableMaybe);
    const for_8 = for_(Applicative0)(foldableMaybe);
    const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
    });
    return (v) => (portType3) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = at3($1)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($2(identity15))(s), s));
      })())(traverse_17((info2) => for_8(info2.piece.updatePort($0)(portType3))((piece) => $$void((() => {
        const $2 = _pieces13(ix2($1)(strongFn)(choiceFn)(prop2({ reflectSymbol: () => "piece" })()()($$Proxy)(strongFn)((v$1) => piece)));
        return dictMonadState.state((s) => {
          const s$p = $2(s);
          return $Tuple(s$p, s$p);
        });
      })()))));
    };
  };
  var updatePortsAround = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const for_8 = for_(Monad0.Applicative0())(foldableArray);
    const $0 = Monad0.Bind1();
    const getPortOnEdge2 = getPortOnEdge(dictMonadState);
    const adjacentRelativeEdge2 = adjacentRelativeEdge(dictMonadState);
    const updateRelEdge1 = updateRelEdge(dictMonadState);
    return (loc) => for_8(allDirections)((dir2) => {
      const relEdge = { loc, dir: dir2 };
      return $0.bind(getPortOnEdge2(relEdge))((maybePort) => $0.bind(adjacentRelativeEdge2(relEdge))((relEdge$p) => updateRelEdge1(relEdge$p)(maybePort.tag === "Just" ? $Maybe("Just", portType(maybePort._1)) : Nothing)));
    });
  };
  var movePiece = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Bind1 = Monad0.Bind1();
    const $0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const assign3 = (p, b) => $$void((() => {
        const $1 = p((v) => b);
        return dictMonadState.state((s) => {
          const s$p = $1(s);
          return $Tuple(s$p, s$p);
        });
      })());
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (src) => (dst) => Bind1.bind((() => {
        const $1 = at3(src)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($1(identity15))(s), s));
      })())((v) => {
        if (v.tag === "Just") {
          const $1 = v._1;
          return Bind1.bind((() => {
            const $2 = MonadThrow0.throwError($BoardError("LocationOccupied", dst));
            return Monad0.Bind1().bind(Bind1.Apply0().Functor0().map(isJust)((() => {
              const $3 = at3(dst)(strongForget);
              return dictMonadState.state((s) => $Tuple(_pieces4($3(identity15))(s), s));
            })()))((b) => {
              if (b) {
                return $2;
              }
              return $0.pure();
            });
          })())(() => Bind1.bind((() => {
            const $2 = at3(src)(strongFn);
            return assign3((x3) => _pieces13($2(x3)), Nothing);
          })())(() => Bind1.bind((() => {
            const $2 = at3(dst)(strongFn);
            return assign3((x3) => _pieces13($2(x3)), $Maybe("Just", $1));
          })())(() => Bind1.bind(updatePortsAround1(src))(() => Bind1.bind(updatePortsAround1(dst))(() => Monad0.Applicative0().pure($1.piece))))));
        }
        if (v.tag === "Nothing") {
          return MonadThrow0.throwError($BoardError("LocationNotOccupied", src));
        }
        fail();
      });
    };
  };
  var increaseSize = (dictMonadState) => {
    const $$get2 = dictMonadState.state((s) => $Tuple(s, s));
    return (dictMonadError) => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1();
      return $0.bind($$get2)((v) => {
        const $1 = v.pieces;
        return $0.bind((() => {
          const $2 = v.size + 2 | 0;
          if (($2 & 1) === 0 || $2 < 3 || $2 > 9) {
            return MonadThrow0.throwError($BoardError("BadBoardSize", $2));
          }
          return MonadThrow0.Monad0().Applicative0().pure($2);
        })())((newSize) => {
          const $2 = { size: newSize, pieces: unsafeMapKey((v1) => ({ x: v1.x + 1 | 0, y: v1.y + 1 | 0 }))($1) };
          return dictMonadState.state((v$1) => $Tuple(void 0, $2));
        });
      });
    };
  };
  var getPieceInfo = (dictMonadState) => (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const pure = Monad0.Applicative0().pure;
    return (loc) => Monad0.Bind1().bind((() => {
      const $0 = at3(loc)(strongForget);
      return dictMonadState.state((s) => $Tuple(_pieces4($0(identity15))(s), s));
    })())((() => {
      const $0 = MonadThrow0.throwError($BoardError("LocationNotOccupied", loc));
      return (v2) => {
        if (v2.tag === "Nothing") {
          return $0;
        }
        if (v2.tag === "Just") {
          return pure(v2._1);
        }
        fail();
      };
    })());
  };
  var getPiece = (dictMonadState) => (dictMonadError) => {
    const getPieceInfo22 = getPieceInfo(dictMonadState)(dictMonadError);
    return (loc) => dictMonadError.MonadThrow0().Monad0().Bind1().Apply0().Functor0().map((v) => v.piece)(getPieceInfo22(loc));
  };
  var decreaseSize = (dictMonadState) => {
    const $$get2 = dictMonadState.state((s) => $Tuple(s, s));
    return (dictMonadError) => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1();
      return $0.bind($$get2)((v) => {
        const $1 = v.size;
        const $2 = v.pieces;
        return $0.bind((() => {
          const $3 = $1 - 2 | 0;
          if (($3 & 1) === 0 || $3 < 3 || $3 > 9) {
            return MonadThrow0.throwError($BoardError("BadBoardSize", $3));
          }
          return MonadThrow0.Monad0().Applicative0().pure($3);
        })())((newSize) => {
          const firstPieceOusideSquare = find(foldableSet)((x3) => !all2((x$1) => {
            if (x$1 < 1) {
              return false;
            }
            return x$1 <= $1;
          })([x3.x, x3.y]))(functorMap.map((v$1) => {
          })($2));
          if (firstPieceOusideSquare.tag === "Just") {
            return MonadThrow0.throwError($BoardError("LocationOccupied", firstPieceOusideSquare._1));
          }
          if (firstPieceOusideSquare.tag === "Nothing") {
            const $3 = { size: newSize, pieces: unsafeMapKey((v1) => ({ x: v1.x - 1 | 0, y: v1.y - 1 | 0 }))($2) };
            return dictMonadState.state((v$1) => $Tuple(void 0, $3));
          }
          fail();
        });
      });
    };
  };
  var checkInsideBoard = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const $0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const isInsideBoard2 = isInsideBoard(dictMonadState);
      return (loc) => {
        const $1 = MonadThrow0.throwError($BoardError("InvalidLocation", loc));
        return Monad0.Bind1().bind(Monad0.Bind1().Apply0().Functor0().map(boolNot)(isInsideBoard2(loc)))((b) => {
          if (b) {
            return $1;
          }
          return $0.pure();
        });
      };
    };
  };
  var removePieceNoUpdate = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Bind1 = Monad0.Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind((() => {
        const $0 = at3(loc)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($0(identity15))(s), s));
      })())((maybePieceInfo) => {
        if (maybePieceInfo.tag === "Nothing") {
          return MonadThrow0.throwError($BoardError("LocationNotOccupied", loc));
        }
        if (maybePieceInfo.tag === "Just") {
          const $0 = maybePieceInfo._1;
          return Bind1.bind($$void((() => {
            const $1 = _pieces13(at3(loc)(strongFn)((v) => Nothing));
            return dictMonadState.state((s) => {
              const s$p = $1(s);
              return $Tuple(s$p, s$p);
            });
          })()))(() => Monad0.Applicative0().pure($0.piece));
        }
        fail();
      }));
    };
  };
  var removePiece = (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    const Bind1 = Monad0.Bind1();
    const removePieceNoUpdate1 = removePieceNoUpdate(dictMonadError);
    return (dictMonadState) => {
      const removePieceNoUpdate2 = removePieceNoUpdate1(dictMonadState);
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => Bind1.bind(removePieceNoUpdate2(loc))((piece) => Bind1.bind(updatePortsAround1(loc))(() => Monad0.Applicative0().pure(piece)));
    };
  };
  var pieceDropped = (dictMonadState) => (dictMonadError) => {
    const movePiece1 = movePiece(dictMonadError)(dictMonadState);
    const removePiece1 = removePiece(dictMonadError)(dictMonadState);
    return (src) => (maybeDst) => {
      if (maybeDst.tag === "Just") {
        return movePiece1(src)(maybeDst._1);
      }
      if (maybeDst.tag === "Nothing") {
        return removePiece1(src);
      }
      fail();
    };
  };
  var rotatePieceBy = (dictMonadError) => {
    const Bind1 = dictMonadError.MonadThrow0().Monad0().Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const getPiece1 = getPiece(dictMonadState)(dictMonadError);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => (rot) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind(getPiece1(loc))(() => Bind1.bind($$void((() => {
        const $0 = _pieces13(ix2(loc)(strongFn)(choiceFn)(prop2({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongFn)((a) => intMod(a + rot | 0)(4))));
        return dictMonadState.state((s) => {
          const s$p = $0(s);
          return $Tuple(s$p, s$p);
        });
      })()))(() => updatePortsAround1(loc))));
    };
  };
  var addPieceNoUpdate = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Bind1 = MonadThrow0.Monad0().Bind1();
    const checkInsideBoard1 = checkInsideBoard(dictMonadError);
    return (dictMonadState) => {
      const checkInsideBoard2 = checkInsideBoard1(dictMonadState);
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      return (loc) => (piece) => (rotation) => Bind1.bind(checkInsideBoard2(loc))(() => Bind1.bind((() => {
        const $0 = at3(loc)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($0(identity15))(s), s));
      })())((pieceInfo) => {
        if (pieceInfo.tag === "Nothing") {
          return $$void((() => {
            const $0 = _pieces13(at3(loc)(strongFn)((v) => $Maybe("Just", { piece, rotation })));
            return dictMonadState.state((s) => {
              const s$p = $0(s);
              return $Tuple(s$p, s$p);
            });
          })());
        }
        if (pieceInfo.tag === "Just") {
          return MonadThrow0.throwError($BoardError("LocationOccupied", loc));
        }
        fail();
      }));
    };
  };
  var addPiece = (dictMonadError) => {
    const addPieceNoUpdate1 = addPieceNoUpdate(dictMonadError);
    return (dictMonadState) => {
      const addPieceNoUpdate2 = addPieceNoUpdate1(dictMonadState);
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (loc) => (piece) => dictMonadError.MonadThrow0().Monad0().Bind1().bind(addPieceNoUpdate2(loc)(piece)(intMod(0)(4)))(() => updatePortsAround1(loc));
    };
  };

  // output-es/Game.Board.Path/index.js
  var $PathError = (tag, _1, _2) => ({ tag, _1, _2 });
  var fromFoldable8 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordCardinalDirection)(a)()(m))(Leaf2);
  var _pieces5 = /* @__PURE__ */ _pieces(strongForget);
  var at4 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var fromFoldable13 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var PathIsEmpty = /* @__PURE__ */ $PathError("PathIsEmpty");
  var BoardError = (value0) => $PathError("BoardError", value0);
  var semigroupPathError = { append: (a) => (v) => a };
  var triples = (v) => {
    if (v.tag === "Cons" && v._2.tag === "Cons" && v._2._2.tag === "Cons") {
      return $List(
        "Cons",
        $Tuple(v._1, $Tuple(v._2._1, $Tuple(v._2._2._1, void 0))),
        triples($List("Cons", v._2._1, $List("Cons", v._2._2._1, v._2._2._2)))
      );
    }
    return Nil;
  };
  var overlayWires = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const bindExceptT3 = bindExceptT(Monad0);
    const applicativeExceptT3 = applicativeExceptT(Monad0);
    const $0 = monadThrowExceptT(Monad0);
    const $1 = Monad0.Bind1().Apply0().Functor0();
    const withExceptT = (f, v) => $1.map((v2) => {
      if (v2.tag === "Right") {
        return $Either("Right", v2._1);
      }
      if (v2.tag === "Left") {
        return $Either("Left", f(v2._1));
      }
      fail();
    })(v);
    const monadErrorExceptT2 = monadErrorExceptT(Monad0);
    const monadStateExceptT2 = monadStateExceptT(dictMonadState);
    const addPieceNoUpdate2 = addPieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    const removePieceNoUpdate2 = removePieceNoUpdate(monadErrorExceptT2)(monadStateExceptT2);
    const $2 = altExceptT(semigroupPathError)(Monad0);
    return (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)(v.outputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(leftPiece);
          }
          if (v2 === 2) {
            return applicativeExceptT3.pure(idPiece);
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(rightPiece);
          }
          return $0.throwError($PathError("WireInputEqualsOutput", v.inputDirection, v.outputDirection));
        })())((piece) => withExceptT(BoardError, addPieceNoUpdate2(v.location)(piece)(clockwiseRotation(Left2)(v.inputDirection))));
      }
      if (v1.tag === "Just") {
        const $3 = v1._1;
        const wireRotation = clockwiseRotation(v.inputDirection)(v.outputDirection);
        const extantRotation = clockwiseRotation($3.inputDirection)($3.outputDirection);
        const isChicken = bindExceptT3.bind((() => {
          const $4 = wireRotation === extantRotation;
          const $5 = $0.throwError($PathError("Other", "not a chicken"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => {
          const rot = clockwiseRotation(v.inputDirection)(Left2);
          return withExceptT(BoardError, bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(chickenPiece)(rot)));
        });
        const isCornerCut = bindExceptT3.bind((() => {
          const $4 = intMod(wireRotation + extantRotation | 0)(4) === intMod(0)(4);
          const $5 = $0.throwError($PathError(
            "Other",
            "not a cornercutRotation " + showIntImpl(intMod(wireRotation + extantRotation | 0)(4) * 90 | 0) + "\xB0"
          ));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)($3.inputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)(v.inputDirection));
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)($3.inputDirection));
          }
          return $0.throwError($PathError("NoOverlay", v, $3));
        })())((rot) => withExceptT(BoardError, bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(cornerCutPiece)(rot)))));
        const isCrossOver = bindExceptT3.bind((() => {
          const $4 = wireRotation === intMod(2)(4) && extantRotation === intMod(2)(4);
          const $5 = $0.throwError($PathError("Other", "not a cross over"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => bindExceptT3.bind((() => {
          const v2 = clockwiseRotation(v.inputDirection)($3.inputDirection);
          if (v2 === 1) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)(v.inputDirection));
          }
          if (v2 === 3) {
            return applicativeExceptT3.pure(clockwiseRotation(Left2)($3.inputDirection));
          }
          return $0.throwError($PathError("NoOverlay", v, $3));
        })())((rot) => withExceptT(BoardError, bindExceptT3.bind(removePieceNoUpdate2($3.location))(() => addPieceNoUpdate2($3.location)(crossPiece)(rot)))));
        return bindExceptT3.bind((() => {
          const $4 = eqMap(eqCardinalDirection)(eqUnit).eq(fromFoldable8([
            v.inputDirection,
            v.outputDirection,
            $3.inputDirection,
            $3.outputDirection
          ]))(fromFoldable8(allDirections));
          const $5 = $0.throwError($PathError("Other", "all ports not filled"));
          if (!$4) {
            return $5;
          }
          if ($4) {
            return applicativeExceptT3.pure();
          }
          fail();
        })())(() => $2.alt(isCrossOver)($2.alt(isCornerCut)(isChicken)));
      }
      fail();
    };
  };
  var getWireAt = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const use2 = use(monadStateExceptT(dictMonadState));
    const applicativeExceptT3 = applicativeExceptT(Monad0);
    return (location3) => bindExceptT(Monad0).bind(use2((() => {
      const $0 = at4(location3)(strongForget);
      return (x3) => _pieces5($0(x3));
    })()))((v) => traversableMaybe.traverse(applicativeExceptT3)((info2) => {
      const inputDirection = rotateDirection(Left2)(info2.rotation);
      if (eqPiece.eq(info2.piece)(idPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Right2)(info2.rotation), location: location3 });
      }
      if (eqPiece.eq(info2.piece)(leftPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Up)(info2.rotation), location: location3 });
      }
      if (eqPiece.eq(info2.piece)(rightPiece)) {
        return applicativeExceptT3.pure({ inputDirection, outputDirection: rotateDirection(Down)(info2.rotation), location: location3 });
      }
      return monadThrowExceptT(Monad0).throwError($PathError("ObstructedByAnotherPiece", location3));
    })(v));
  };
  var createWire = (dictMonad) => {
    const $0 = monadThrowExceptT(dictMonad);
    const $1 = $0.Monad0().Applicative0().pure;
    return (l) => (v) => (r) => {
      const $2 = directionTo(v)(l);
      if ($2.tag === "Nothing") {
        return $0.throwError($PathError("LocationsAreNotAdjacent", v, l));
      }
      if ($2.tag === "Just") {
        const $3 = directionTo(v)(r);
        if ($3.tag === "Nothing") {
          return $0.throwError($PathError("LocationsAreNotAdjacent", v, r));
        }
        if ($3.tag === "Just") {
          if ((() => {
            if ($2._1 === "Up") {
              return $3._1 === "Up";
            }
            if ($2._1 === "Right") {
              return $3._1 === "Right";
            }
            if ($2._1 === "Down") {
              return $3._1 === "Down";
            }
            return $2._1 === "Left" && $3._1 === "Left";
          })()) {
            return $0.throwError($PathError("WireInputEqualsOutput", $2._1, $3._1));
          }
          return $1({ inputDirection: $2._1, outputDirection: $3._1, location: v });
        }
      }
      fail();
    };
  };
  var singleWirePiece = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = bindExceptT(Monad0);
    const createWire1 = createWire(Monad0);
    const getWireAt1 = getWireAt(dictMonadState);
    const overlayWires1 = overlayWires(dictMonadState);
    return (l) => (v) => (r) => $0.bind(createWire1(l)(v)(r))((wire) => $0.bind(getWireAt1(v))((maybeExtant) => overlayWires1(wire)(maybeExtant)));
  };
  var boardPathWithError = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = bindExceptT(Monad0);
    const $1 = monadThrowExceptT(Monad0);
    const $2 = $1.Monad0().Applicative0().pure;
    const liftEither = (v2) => {
      if (v2.tag === "Left") {
        return $1.throwError(v2._1);
      }
      if (v2.tag === "Right") {
        return $2(v2._1);
      }
      fail();
    };
    const $3 = applyExceptT(Monad0);
    const singleWirePiece1 = singleWirePiece(dictMonadState);
    return (initialDir) => (path2) => (terminalDir) => $0.bind(liftEither(0 < path2.length ? $Either("Right", path2[0]) : $Either("Left", PathIsEmpty)))((h) => $0.bind((() => {
      const $4 = last(path2);
      return liftEither((() => {
        if ($4.tag === "Nothing") {
          return $Either("Left", PathIsEmpty);
        }
        if ($4.tag === "Just") {
          return $Either("Right", $4._1);
        }
        fail();
      })());
    })())((l) => foldableList.foldr((a) => (b) => $3.apply($3.Functor0().map((v) => identity)(a))(b))(applicativeExceptT(Monad0).pure())(listMap((v) => singleWirePiece1(v._1)(v._2._1)(v._2._2._1))(triples(fromFoldable13([
      (() => {
        if (initialDir === "Up") {
          return { x: h.x, y: h.y - 1 | 0 };
        }
        if (initialDir === "Right") {
          return { x: h.x + 1 | 0, y: h.y };
        }
        if (initialDir === "Down") {
          return { x: h.x, y: h.y + 1 | 0 };
        }
        if (initialDir === "Left") {
          return { x: h.x - 1 | 0, y: h.y };
        }
        fail();
      })(),
      ...path2,
      (() => {
        if (terminalDir === "Up") {
          return { x: l.x, y: l.y - 1 | 0 };
        }
        if (terminalDir === "Right") {
          return { x: l.x + 1 | 0, y: l.y };
        }
        if (terminalDir === "Down") {
          return { x: l.x, y: l.y + 1 | 0 };
        }
        if (terminalDir === "Left") {
          return { x: l.x - 1 | 0, y: l.y };
        }
        fail();
      })()
    ]))))));
  };
  var addBoardPath = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const boardPathWithError1 = boardPathWithError(dictMonadState);
    const Applicative0 = Monad0.Applicative0();
    const for_8 = for_(Applicative0)(foldableMaybe);
    const updatePortsAround2 = updatePortsAround(dictMonadState);
    return (initialDir) => (path2) => (terminalDir) => Bind1.bind(Bind1.Apply0().Functor0().map(blush)(boardPathWithError1(initialDir)(path2)(terminalDir)))((maybePathError) => Bind1.bind((() => {
      const $0 = Bind1.bind(for_8(0 < path2.length ? $Maybe("Just", path2[0]) : Nothing)(updatePortsAround2))(() => for_8(last(path2))(updatePortsAround2));
      if ((() => {
        if (maybePathError.tag === "Nothing") {
          return true;
        }
        if (maybePathError.tag === "Just") {
          return false;
        }
        fail();
      })()) {
        return $0;
      }
      return Applicative0.pure();
    })())(() => Applicative0.pure((() => {
      if (maybePathError.tag === "Nothing") {
        return true;
      }
      if (maybePathError.tag === "Just") {
        return false;
      }
      fail();
    })())));
  };

  // output-es/Halogen.HTML/index.js
  var slot_ = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (component13) => (input) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p)(component13)(input)((v) => Nothing))
    );
  };
  var slot = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (component13) => (input) => (outputQuery) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p)(component13)(input)((x3) => $Maybe("Just", outputQuery(x3))))
    );
  };

  // output-es/Web.Event.Event/foreign.js
  function _target(e) {
    return e.target;
  }
  function preventDefault(e) {
    return function() {
      return e.preventDefault();
    };
  }

  // output-es/Component.Board/index.js
  var liftBoardM2 = /* @__PURE__ */ liftBoardM(monadStateHalogenM);
  var monadErrorStateT2 = /* @__PURE__ */ monadErrorStateT(/* @__PURE__ */ monadErrorExceptT(monadIdentity));
  var monadStateStateT3 = /* @__PURE__ */ monadStateStateT({
    Applicative0: () => applicativeExceptT(monadIdentity),
    Bind1: () => bindExceptT(monadIdentity)
  });
  var rotatePieceBy2 = /* @__PURE__ */ rotatePieceBy(monadErrorStateT2)(monadStateStateT3);
  var traverse_8 = /* @__PURE__ */ traverse_(freeApplicative);
  var traverse_12 = /* @__PURE__ */ traverse_8(foldableEither);
  var gets3 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var pieceDropped2 = /* @__PURE__ */ pieceDropped(monadStateStateT3)(monadErrorStateT2);
  var multimeterIsSymbol = { reflectSymbol: () => "multimeter" };
  var tell1 = /* @__PURE__ */ tell2()(multimeterIsSymbol)(ordUnit);
  var monadStateStateT1 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var capacityRipple2 = /* @__PURE__ */ capacityRipple(monadStateStateT1);
  var for_5 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var modify_3 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var modifying = (p) => (f) => {
    const $0 = p(f);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s) => {
            const s$p = $0(s);
            return $Tuple(s$p, s$p);
          }
        ),
        (x3) => $Free($FreeView("Return", x3), CatNil)
      ),
      snoc(CatNil)((x3) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var ix3 = /* @__PURE__ */ (() => indexMap(ordCardinalDirection).ix)();
  var traverse_22 = /* @__PURE__ */ traverse_8(foldableMaybe);
  var bindMaybeT2 = /* @__PURE__ */ bindMaybeT(freeMonad);
  var monadStateMaybeT2 = /* @__PURE__ */ monadStateMaybeT(monadStateHalogenM);
  var appendModifying = (p) => (x3) => {
    const $0 = p((a) => [...a, ...x3]);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s) => {
            const s$p = $0(s);
            return $Tuple(s$p, s$p);
          }
        ),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      snoc(CatNil)((x$1) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var _wireLocations2 = /* @__PURE__ */ _wireLocations(wanderFunction);
  var map2 = (f) => (v) => $Free(
    v._1,
    snoc(v._2)((x3) => $Free(
      $FreeView("Return", x3.tag === "Just" ? $Maybe("Just", f(x3._1)) : Nothing),
      CatNil
    ))
  );
  var addBoardPath2 = /* @__PURE__ */ addBoardPath(monadStateStateT1);
  var buildEvaluableBoard2 = /* @__PURE__ */ buildEvaluableBoard(monadErrorEither);
  var evalWithPortInfo2 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT1));
  var show3 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showSignal).show)();
  var show5 = (record) => (record.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record.port) + ", signal: " + showSignal.show(record.signal) + " }";
  var _pieces6 = /* @__PURE__ */ _pieces(strongForget);
  var traverseWithIndex_2 = /* @__PURE__ */ traverseWithIndex_(freeApplicative)(foldableWithIndexMap);
  var pieceIsSymbol = { reflectSymbol: () => "piece" };
  var tell22 = /* @__PURE__ */ tell2()(pieceIsSymbol)(ordLocation);
  var getBoardPortEdge3 = /* @__PURE__ */ getBoardPortEdge(monadStateStateT1);
  var slot1 = /* @__PURE__ */ slot()(pieceIsSymbol)(ordLocation);
  var slot2 = /* @__PURE__ */ slot()(multimeterIsSymbol)(ordUnit);
  var _size3 = /* @__PURE__ */ _size(strongForget);
  var intercalate5 = /* @__PURE__ */ intercalate1(monoidString);
  var boardPortInfo2 = /* @__PURE__ */ boardPortInfo(monadStateStateT1);
  var getPieceInfo2 = /* @__PURE__ */ getPieceInfo(monadStateStateT3)(monadErrorStateT2);
  var addPiece2 = /* @__PURE__ */ addPiece(monadErrorStateT2)(monadStateStateT3);
  var removePiece2 = /* @__PURE__ */ removePiece(monadErrorStateT2)(monadStateStateT3);
  var show7 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showPort).show)();
  var forWithIndex_2 = /* @__PURE__ */ forWithIndex_(freeApplicative)(foldableWithIndexMap);
  var assign2 = (p) => (b) => {
    const $0 = p((v) => b);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s) => {
            const s$p = $0(s);
            return $Tuple(s$p, s$p);
          }
        ),
        (x3) => $Free($FreeView("Return", x3), CatNil)
      ),
      snoc(CatNil)((x3) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var at5 = /* @__PURE__ */ (() => atMap(ordCardinalDirection).at)();
  var increaseSize2 = /* @__PURE__ */ increaseSize(monadStateStateT3)(monadErrorStateT2);
  var decreaseSize2 = /* @__PURE__ */ decreaseSize(monadStateStateT3)(monadErrorStateT2);
  var getDirectionClicked = (me) => (bb) => {
    const $0 = toNumber(clientX(me)) - bb.left;
    const $1 = toNumber(clientY(me)) - bb.top;
    const isTopOrRight = $0 > $1;
    const isTopOrLeft = $0 + $1 < bb.width;
    if (!isTopOrRight) {
      if (!isTopOrLeft) {
        return Down;
      }
      if (isTopOrLeft) {
        return Left2;
      }
      fail();
    }
    if (isTopOrRight) {
      if (!isTopOrLeft) {
        return Right2;
      }
      if (isTopOrLeft) {
        return Up;
      }
    }
    fail();
  };
  var handleAction = (dictMonadAff) => {
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    const lift2 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    const headShake2 = headShake(monadAffHalogenM(dictMonadAff));
    const $0 = monadEffectMaybe(monadEffectHalogenM2);
    return (dictMonadLogger) => {
      const debug2 = log$p(dictMonadLogger)(Debug);
      const warn2 = log$p(dictMonadLogger)(Warn);
      return (v) => {
        if (v.tag === "Initialise") {
          const $1 = monadEffectHalogenM2.liftEffect(globalKeyDownEventEmitter);
          return $Free(
            $1._1,
            snoc($1._2)((emitter) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Subscribe", (v$1) => (k) => emitter((x3) => k($Action3("GlobalOnKeyDown", x3))), identity11),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              snoc(snoc(CatNil)((x3) => $Free($FreeView("Return", void 0), CatNil)))(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s) => $Tuple(_board(strongForget)(identity15)(s), s)
                  ),
                  (x3) => $Free($FreeView("Return", x3), CatNil)
                ),
                snoc(snoc(CatNil)((x3) => $Free(
                  $FreeView("Return", $Output(x3)),
                  CatNil
                )))(raise)
              ))
            ))
          );
        }
        if (v.tag === "PieceOutput") {
          if (v._1.tag === "Rotated") {
            const $1 = v._1._1;
            const $2 = v._1._2;
            const $3 = liftBoardM2(rotatePieceBy2($1)($2));
            return $Free(
              $3._1,
              snoc($3._2)(traverse_12((v1) => {
                const $4 = v1._2;
                const $5 = lift2(debug2($$$Map(
                  "Two",
                  Leaf2,
                  "rotation",
                  $Tag("StringTag", "Rotation " + showIntImpl($2 * 90 | 0) + "\xB0"),
                  Leaf2
                ))("Piece rotated at " + showLocation.show($1)));
                return $Free(
                  $5._1,
                  snoc($5._2)(() => handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", $4)))
                );
              }))
            );
          }
          if (v._1.tag === "Dropped") {
            const $1 = v._1._1;
            const $2 = lift2(debug2(Leaf2)("Piece dropped at " + showLocation.show($1)));
            return $Free(
              $2._1,
              snoc($2._2)(() => {
                const $3 = gets3((v1) => v1.isMouseOverLocation);
                return $Free(
                  $3._1,
                  snoc($3._2)((maybeDst) => {
                    const $4 = liftBoardM2(pieceDropped2($1)(maybeDst));
                    return $Free(
                      $4._1,
                      snoc($4._2)((eitherPiece) => {
                        if (eitherPiece.tag === "Left") {
                          const $5 = lift2(warn2(Leaf2)(showBoardError.show(eitherPiece._1)));
                          return $Free(
                            $5._1,
                            snoc($5._2)(() => headShake2("[data-location='" + location2.attrPrint($1) + "']"))
                          );
                        }
                        if (eitherPiece.tag === "Right") {
                          return $Free(
                            $FreeView(
                              "Bind",
                              $HalogenF(
                                "State",
                                (s) => $Tuple(_board(strongForget)(identity15)(s), s)
                              ),
                              (x3) => $Free($FreeView("Return", x3), CatNil)
                            ),
                            snoc(CatNil)((board) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", board)))
                          );
                        }
                        fail();
                      })
                    );
                  })
                );
              })
            );
          }
          if (v._1.tag === "NewMultimeterFocus") {
            const $1 = v._1._1;
            return tell1($$Proxy)()((v1) => $Query2("NewFocus", $1));
          }
          fail();
        }
        if (v.tag === "MultimeterOutput") {
          const $1 = v._1._1;
          const $2 = capacityRipple2($1)(v._1._2);
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF(
                "State",
                (s) => $Tuple(_board(strongForget)(identity15)(s), s)
              ),
              (x3) => $Free($FreeView("Return", x3), CatNil)
            ),
            snoc(snoc(CatNil)((x3) => $Free($FreeView("Return", $2(x3)._2), CatNil)))((board$p) => {
              const $3 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", board$p));
              return $Free(
                $3._1,
                snoc($3._2)(() => {
                  const $4 = gets3((v1) => v1.lastEvalWithPortInfo);
                  return $Free(
                    $4._1,
                    snoc($4._2)((signals) => {
                      const $5 = lookup(ordRelativeEdge)($1)(signals);
                      const focus2 = (() => {
                        if ($5.tag === "Just") {
                          return $Maybe("Just", { info: $5._1, relativeEdge: $1 });
                        }
                        if ($5.tag === "Nothing") {
                          return Nothing;
                        }
                        fail();
                      })();
                      return tell1($$Proxy)()((v1) => $Query2("NewFocus", focus2));
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "Undo") {
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc(snoc($1._2)((x3) => $Free($FreeView("Return", moveLeft(x3)), CatNil)))((maybeZipper) => for_5(maybeZipper)((t) => {
              const $2 = modify_3((v1) => ({ ...v1, boardHistory: t }));
              return $Free($2._1, snoc($2._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
            }))
          );
        }
        if (v.tag === "Redo") {
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc(snoc($1._2)((x3) => $Free($FreeView("Return", moveRight(x3)), CatNil)))((maybeZipper) => for_5(maybeZipper)((t) => {
              const $2 = modify_3((v1) => ({ ...v1, boardHistory: t }));
              return $Free($2._1, snoc($2._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
            }))
          );
        }
        if (v.tag === "ToggleInput") {
          const $1 = modifying((() => {
            const $12 = ix3(v._1)(strongFn)(choiceFn);
            return (x3) => prop2({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($12(x3));
          })())((signal) => {
            if (signal === 0) {
              return -1;
            }
            return 0;
          });
          return $Free($1._1, snoc($1._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard)));
        }
        if (v.tag === "IncrementInput") {
          const $1 = v._1;
          const $2 = gets3((() => {
            const $22 = lookup(ordCardinalDirection)($1);
            return (x3) => $22(x3.boardPorts);
          })());
          return $Free(
            $2._1,
            snoc(snoc($2._2)(traverse_22((port3) => modifying((() => {
              const $3 = ix3($1)(strongFn)(choiceFn);
              return (x3) => prop2({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($3(x3));
            })())((signal) => {
              if ((() => {
                const $3 = portCapacity(port3);
                if ($3 === "OneBit") {
                  return signal === 1;
                }
                if ($3 === "TwoBit") {
                  return signal === 3;
                }
                if ($3 === "FourBit") {
                  return signal === 15;
                }
                if ($3 === "EightBit") {
                  return signal === 255;
                }
                fail();
              })()) {
                return 0;
              }
              return signal + 1 | 0;
            }))))(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard))
          );
        }
        if (v.tag === "DecrementInput") {
          const $1 = v._1;
          const $2 = gets3((() => {
            const $22 = lookup(ordCardinalDirection)($1);
            return (x3) => $22(x3.boardPorts);
          })());
          return $Free(
            $2._1,
            snoc(snoc($2._2)(traverse_22((port3) => modifying((() => {
              const $3 = ix3($1)(strongFn)(choiceFn);
              return (x3) => prop2({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($3(x3));
            })())((v1) => {
              if (v1 === 0) {
                const $3 = portCapacity(port3);
                if ($3 === "OneBit") {
                  return 1;
                }
                if ($3 === "TwoBit") {
                  return 3;
                }
                if ($3 === "FourBit") {
                  return 15;
                }
                if ($3 === "EightBit") {
                  return 255;
                }
                fail();
              }
              return v1 - 1 | 0;
            }))))(() => handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard))
          );
        }
        if (v.tag === "SetOutputs") {
          const $1 = v._1;
          const $2 = modify_3((v1) => ({ ...v1, outputs: $1 }));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = gets3((v1) => v1.isMouseOverBoardPort);
              return $Free(
                $3._1,
                snoc($3._2)(traverse_22((dir2) => tell1($$Proxy)()((v1) => $Query2(
                  "SetSignal",
                  (() => {
                    const $4 = lookup(ordCardinalDirection)(dir2)($1);
                    if ($4.tag === "Nothing") {
                      return 0;
                    }
                    if ($4.tag === "Just") {
                      return $4._1;
                    }
                    fail();
                  })()
                ))))
              );
            })
          );
        }
        if (v.tag === "BoardOnDragExit") {
          const $1 = modify_3((v1) => ({ ...v1, isCreatingWire: Nothing }));
          return $Free($1._1, snoc($1._2)(() => lift2(debug2(Leaf2)("Cancelled wire creation"))));
        }
        if (v.tag === "LocationOnMouseDown") {
          const $1 = v._1;
          const $2 = v._2;
          const $3 = bindMaybeT2.bind($Free(
            $FreeView("Return", nullable(_target($2), Nothing, Just)),
            CatNil
          ))((eventTarget) => bindMaybeT2.bind($Free(
            $FreeView("Return", _unsafeReadProtoTagged(Nothing, Just, "Element", eventTarget)),
            CatNil
          ))((element) => bindMaybeT2.bind($0.liftEffect(getBoundingClientRect(element)))((bb) => {
            const initialDirection = getDirectionClicked($2)(bb);
            return monadStateMaybeT2.state((s) => $Tuple(void 0, { ...s, isCreatingWire: $Maybe("Just", { initialDirection, locations: [$1] }) }));
          })));
          return $Free(
            $3._1,
            snoc($3._2)((x3) => $Free($FreeView("Return", void 0), CatNil))
          );
        }
        if (v.tag === "LocationOnMouseOver") {
          const $1 = v._1;
          const $2 = gets3((v1) => v1.isCreatingWire);
          return $Free(
            $2._1,
            snoc($2._2)(traverse_22((creatingWire) => {
              const $3 = last(creatingWire.locations);
              const $4 = appendModifying(_wireLocations2)([$1]);
              if ($3.tag === "Nothing" || !($3.tag === "Just" && $3._1.x === $1.x && $3._1.y === $1.y)) {
                return $4;
              }
              return $Free($FreeView("Return", void 0), CatNil);
            }))
          );
        }
        if (v.tag === "LocationOnMouseUp") {
          const $1 = v._2;
          const $2 = bindMaybeT2.bind(gets3((v1) => v1.isCreatingWire))((creatingWire) => bindMaybeT2.bind($Free(
            $FreeView("Return", nullable(_target($1), Nothing, Just)),
            CatNil
          ))((eventTarget) => bindMaybeT2.bind($Free(
            $FreeView("Return", _unsafeReadProtoTagged(Nothing, Just, "Element", eventTarget)),
            CatNil
          ))((element) => bindMaybeT2.bind($0.liftEffect(getBoundingClientRect(element)))((bb) => bindMaybeT2.bind(map2(addBoardPath2(creatingWire.initialDirection)(creatingWire.locations)(getDirectionClicked($1)(bb)))(monadStateMaybeT2.state((s) => $Tuple(
            _board(strongForget)(identity15)(s),
            s
          ))))((v1) => bindMaybeT2.bind((() => {
            const $22 = applicativeMaybeT(freeMonad);
            const $3 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetBoard", v1._2));
            const $4 = $Free(
              $3._1,
              snoc($3._2)((a$p) => $Free($FreeView("Return", $Maybe("Just", a$p)), CatNil))
            );
            if (v1._1) {
              return $4;
            }
            return $22.pure();
          })())(() => monadStateMaybeT2.state((s) => $Tuple(void 0, { ...s, isCreatingWire: Nothing }))))))));
          return $Free(
            $2._1,
            snoc($2._2)((x3) => $Free($FreeView("Return", void 0), CatNil))
          );
        }
        if (v.tag === "SetBoard") {
          const $1 = v._1;
          const $2 = lift2(debug2(Leaf2)("Updating board"));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = modify_3((s) => ({ ...s, boardHistory: $Zipper($List("Cons", s.boardHistory._2, s.boardHistory._1), $1, Nil) }));
              return $Free(
                $3._1,
                snoc($3._2)(() => {
                  const $4 = handleAction(dictMonadAff)(dictMonadLogger)(EvaluateBoard);
                  return $Free(
                    $4._1,
                    snoc($4._2)(() => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Raise", $Output($1), void 0),
                        (x3) => $Free($FreeView("Return", x3), CatNil)
                      ),
                      CatNil
                    ))
                  );
                })
              );
            })
          );
        }
        if (v.tag === "EvaluateBoard") {
          const $1 = gets3((v1) => v1.boardPorts);
          return $Free(
            $1._1,
            snoc($1._2)((boardPorts) => {
              const $2 = gets3((v1) => v1.inputs);
              return $Free(
                $2._1,
                snoc($2._2)((inputs) => {
                  const $3 = buildEvaluableBoard2(boardPorts);
                  return $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "State",
                        (s) => $Tuple(_board(strongForget)(identity15)(s), s)
                      ),
                      (x3) => $Free($FreeView("Return", x3), CatNil)
                    ),
                    snoc(snoc(CatNil)((x3) => $Free($FreeView("Return", $3(x3)), CatNil)))((eitherEvaluable) => {
                      if (eitherEvaluable.tag === "Left") {
                        return lift2(warn2(Leaf2)("Unable to build EvaluableBoard, BoardError: " + showBoardError.show(eitherEvaluable._1)));
                      }
                      if (eitherEvaluable.tag === "Right") {
                        const v1 = evalWithPortInfo2(inputs)(eitherEvaluable._1)(Leaf2);
                        const $4 = v1._1;
                        const $5 = v1._2;
                        const $6 = lift2(debug2(unionWith(ordString)($$const)($$$Map(
                          "Two",
                          Leaf2,
                          "inputs",
                          $Tag("StringTag", show3(inputs)),
                          Leaf2
                        ))($$$Map("Two", Leaf2, "outputs", $Tag("StringTag", show3($4)), Leaf2)))("Evaluating board"));
                        return $Free(
                          $6._1,
                          snoc($6._2)(() => {
                            const $7 = lift2(debug2(foldableWithIndexMap.foldrWithIndex((relEdge) => (info2) => insert(ordString)(showRelativeEdge.show(relEdge))($Tag(
                              "StringTag",
                              show5(info2)
                            )))(Leaf2)($5))("Signals from board eval"));
                            return $Free(
                              $7._1,
                              snoc($7._2)(() => {
                                const $8 = modify_3((v2) => ({ ...v2, lastEvalWithPortInfo: $5 }));
                                return $Free(
                                  $8._1,
                                  snoc($8._2)(() => {
                                    const $9 = handleAction(dictMonadAff)(dictMonadLogger)($Action3("SetOutputs", $4));
                                    return $Free(
                                      $9._1,
                                      snoc($9._2)(() => handleAction(dictMonadAff)(dictMonadLogger)(UpdatePieceComponents))
                                    );
                                  })
                                );
                              })
                            );
                          })
                        );
                      }
                      fail();
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "UpdatePieceComponents") {
          const $1 = lift2(debug2(Leaf2)("Updating piece components"));
          return $Free(
            $1._1,
            snoc($1._2)(() => {
              const $2 = gets3((v1) => v1.lastEvalWithPortInfo);
              return $Free(
                $2._1,
                snoc($2._2)((signals) => $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF(
                      "State",
                      (s) => $Tuple(_board(strongForget)(_pieces6(identity15))(s), s)
                    ),
                    (x3) => $Free($FreeView("Return", x3), CatNil)
                  ),
                  snoc(CatNil)(traverseWithIndex_2((loc) => (info2) => {
                    const portStates = toLocalInputs(loc)(signals);
                    const $3 = tell22($$Proxy)(loc)((v1) => $Query3("SetPortStates", portStates));
                    return $Free(
                      $3._1,
                      snoc($3._2)(() => {
                        const $4 = tell22($$Proxy)(loc)((v1) => $Query3("SetPiece", info2.piece));
                        return $Free(
                          $4._1,
                          snoc($4._2)(() => tell22($$Proxy)(loc)((v1) => $Query3("SetRotation", info2.rotation)))
                        );
                      })
                    );
                  }))
                ))
              );
            })
          );
        }
        if (v.tag === "LocationOnDragEnter") {
          const $1 = v._1;
          const $2 = monadEffectHalogenM2.liftEffect(preventDefault(v._2));
          return $Free($2._1, snoc($2._2)(() => modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $1) }))));
        }
        if (v.tag === "LocationOnDragOver") {
          return monadEffectHalogenM2.liftEffect(preventDefault(v._2));
        }
        if (v.tag === "LocationOnDrop") {
          const $1 = v._2;
          const $2 = v._1;
          const $3 = modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $2) }));
          return $Free($3._1, snoc($3._2)(() => monadEffectHalogenM2.liftEffect(preventDefault($1))));
        }
        if (v.tag === "LocationOnDragLeave") {
          return modify_3((v1) => ({ ...v1, isMouseOverLocation: Nothing }));
        }
        if (v.tag === "GlobalOnKeyDown") {
          const v1 = key(v._1);
          if (v1 === "z") {
            const $1 = handleAction(dictMonadAff)(dictMonadLogger)(Undo);
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "y") {
            const $1 = handleAction(dictMonadAff)(dictMonadLogger)(Redo);
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "e") {
            const $1 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free(
              $1._1,
              snoc($1._2)(traverse_22((dir2) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("IncrementInput", dir2))))
            );
          }
          if (v1 === "E") {
            const $1 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free(
              $1._1,
              snoc($1._2)(traverse_22((dir2) => handleAction(dictMonadAff)(dictMonadLogger)($Action3("DecrementInput", dir2))))
            );
          }
          return $Free($FreeView("Return", void 0), CatNil);
        }
        if (v.tag === "BoardPortOnMouseEnter") {
          const $1 = v._1;
          const $2 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: $Maybe("Just", $1) }));
          return $Free(
            $2._1,
            snoc($2._2)(() => {
              const $3 = getBoardPortEdge3($1);
              return $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s) => $Tuple(_board(strongForget)(identity15)(s), s)
                  ),
                  (x3) => $Free($FreeView("Return", x3), CatNil)
                ),
                snoc(snoc(CatNil)((x3) => $Free($FreeView("Return", $3(x3)._1), CatNil)))((relativeEdge) => {
                  const $4 = gets3((v1) => v1.lastEvalWithPortInfo);
                  return $Free(
                    $4._1,
                    snoc($4._2)((signals) => {
                      const $5 = lookup(ordRelativeEdge)(relativeEdge)(signals);
                      const focus2 = $5.tag === "Just" ? $Maybe("Just", { info: $5._1, relativeEdge }) : Nothing;
                      return tell1($$Proxy)()((v1) => $Query2("NewFocus", focus2));
                    })
                  );
                })
              );
            })
          );
        }
        if (v.tag === "BoardPortOnMouseLeave") {
          const $1 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: Nothing }));
          return $Free($1._1, snoc($1._2)(() => tell1($$Proxy)()((v1) => $Query2("NewFocus", Nothing))));
        }
        fail();
      };
    };
  };
  var component6 = (dictMonadLogger) => {
    const debug2 = log$p(dictMonadLogger)(Debug);
    return (dictMonadAff) => {
      const MonadEffect0 = dictMonadAff.MonadEffect0();
      const component1 = component5(MonadEffect0);
      const component22 = component4(MonadEffect0);
      const headShake2 = headShake(monadAffHalogenM(dictMonadAff));
      const handleAction1 = handleAction(dictMonadAff)(dictMonadLogger);
      const lift2 = monadTransHalogenM.lift(MonadEffect0.Monad0());
      return {
        eval: mkEval({
          finalize: Nothing,
          handleAction: handleAction1,
          handleQuery: (v) => {
            if (v.tag === "GetBoard") {
              return $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s) => $Tuple(_board(strongForget)(identity15)(s), s)
                  ),
                  (x3) => $Free($FreeView("Return", x3), CatNil)
                ),
                snoc(CatNil)((x3) => $Free(
                  $FreeView("Return", $Maybe("Just", v._1(x3))),
                  CatNil
                ))
              );
            }
            if (v.tag === "AddPiece") {
              const $0 = v._1;
              const $1 = liftBoardM2(addPiece2($0)(v._2));
              return $Free(
                $1._1,
                snoc(snoc($1._2)((v1) => {
                  if (v1.tag === "Left") {
                    return headShake2("[data-location='" + location2.attrPrint($0) + "']");
                  }
                  if (v1.tag === "Right") {
                    return handleAction1($Action3("SetBoard", v1._1._2));
                  }
                  fail();
                }))(() => $Free($FreeView("Return", Nothing), CatNil))
              );
            }
            if (v.tag === "RemovePiece") {
              const $0 = liftBoardM2(removePiece2(v._1));
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "GetMouseOverLocation") {
              const $0 = gets3((v1) => v1.isMouseOverLocation);
              return $Free(
                $0._1,
                snoc($0._2)((maybeDst) => $Free(
                  $FreeView("Return", maybeDst.tag === "Just" ? $Maybe("Just", v._1(maybeDst._1)) : Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "SetGoalPorts") {
              const $0 = v._1;
              const $1 = lift2(debug2($$$Map("Two", Leaf2, "boardPorts", $Tag("StringTag", show7($0)), Leaf2))("Set goal ports on board"));
              return $Free(
                $1._1,
                snoc($1._2)(() => {
                  const $2 = modify_3((v1) => ({ ...v1, boardPorts: $0 }));
                  return $Free(
                    $2._1,
                    snoc($2._2)(() => {
                      const $3 = forWithIndex_2($0)((dir2) => (port3) => {
                        const $32 = assign2((() => {
                          const $33 = at5(dir2)(strongFn);
                          return (x3) => prop2({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($33(x3));
                        })())($Maybe("Just", 0));
                        if (isInput(port3)) {
                          return $32;
                        }
                        return $Free($FreeView("Return", void 0), CatNil);
                      });
                      return $Free(
                        $3._1,
                        snoc($3._2)(() => {
                          const $4 = handleAction1(EvaluateBoard);
                          return $Free(
                            $4._1,
                            snoc($4._2)(() => $Free($FreeView("Return", Nothing), CatNil))
                          );
                        })
                      );
                    })
                  );
                })
              );
            }
            if (v.tag === "SetInputs") {
              const $0 = assign2(_inputs(strongFn))(v._1);
              return $Free(
                $0._1,
                snoc($0._2)(() => {
                  const $1 = handleAction1(EvaluateBoard);
                  return $Free(
                    $1._1,
                    snoc($1._2)(() => {
                      const $2 = gets3((v1) => v1.outputs);
                      return $Free(
                        $2._1,
                        snoc($2._2)((x3) => $Free($FreeView("Return", $Maybe("Just", v._2(x3))), CatNil))
                      );
                    })
                  );
                })
              );
            }
            if (v.tag === "IncrementBoardSize") {
              const $0 = liftBoardM2(increaseSize2);
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            if (v.tag === "DecrementBoardSize") {
              const $0 = liftBoardM2(decreaseSize2);
              return $Free(
                $0._1,
                snoc(snoc($0._2)(traverse_12((v1) => handleAction1($Action3("SetBoard", v1._2)))))(() => $Free(
                  $FreeView("Return", Nothing),
                  CatNil
                ))
              );
            }
            fail();
          },
          initialize: $Maybe("Just", Initialise),
          receive: (v) => Nothing
        }),
        initialState,
        render: (state) => {
          const board = state.boardHistory._2;
          const n = _size3(identity15)(board);
          const gridTemplate = "25fr repeat(" + showIntImpl(n) + ", 100fr) 25fr";
          return $VDom(
            "Elem",
            Nothing,
            "div",
            [
              id("board-component"),
              $Prop(
                "Handler",
                "dragexit",
                (ev) => $Maybe("Just", $Input("Action", $Action3("BoardOnDragExit", ev)))
              ),
              style(intercalate5("; ")(["grid-template-columns: " + gridTemplate, "grid-template-rows:    " + gridTemplate]))
            ],
            [
              ...arrayBind(rangeImpl(0, n - 1 | 0))((i) => arrayBind(rangeImpl(0, n - 1 | 0))((j) => {
                const loc = { x: i, y: j };
                const $0 = getPieceInfo2(loc)(board);
                const eitherPieceInfo = (() => {
                  if ($0.tag === "Left") {
                    return $Either("Left", $0._1);
                  }
                  if ($0.tag === "Right") {
                    return $Either("Right", $0._1._1);
                  }
                  fail();
                })();
                return [
                  $VDom(
                    "Elem",
                    Nothing,
                    "div",
                    [
                      $Prop("Attribute", Nothing, "data-location", location2.attrPrint({ x: i, y: j })),
                      class_("piece"),
                      style(intercalate5("; ")(["grid-area: " + showIntImpl(j + 2 | 0) + " / " + showIntImpl(i + 2 | 0)])),
                      (() => {
                        const $1 = LocationOnMouseDown(loc);
                        return $Prop("Handler", "mousedown", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnMouseOver(loc);
                        return $Prop("Handler", "mouseover", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnMouseUp(loc);
                        return $Prop("Handler", "mouseup", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnDragEnter(loc);
                        return $Prop("Handler", "dragenter", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      (() => {
                        const $1 = LocationOnDragOver(loc);
                        return $Prop("Handler", "dragover", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })(),
                      $Prop(
                        "Handler",
                        "dragleave",
                        (ev) => $Maybe("Just", $Input("Action", $Action3("LocationOnDragLeave", ev)))
                      ),
                      (() => {
                        const $1 = LocationOnDrop(loc);
                        return $Prop("Handler", "drop", (ev) => $Maybe("Just", $Input("Action", $1(ev))));
                      })()
                    ],
                    [
                      (() => {
                        if (eitherPieceInfo.tag === "Left") {
                          return $VDom("Text", showLocation.show(loc));
                        }
                        if (eitherPieceInfo.tag === "Right") {
                          return slot1($$Proxy)(loc)(component1)({ piece: eitherPieceInfo._1.piece, location: loc })(PieceOutput);
                        }
                        fail();
                      })()
                    ]
                  )
                ];
              })),
              ...fromFoldableImpl(
                foldableMap.foldr,
                functorWithIndexMap.mapWithIndex((dir2) => (portInfo) => $VDom(
                  "Elem",
                  Nothing,
                  "div",
                  [
                    class_("board-port"),
                    $Prop(
                      "Handler",
                      "click",
                      (ev) => $Maybe("Just", $Input("Action", $Action3("ToggleInput", dir2)))
                    ),
                    $Prop("Attribute", Nothing, "data-direction", direction.attrPrint(dir2)),
                    style(intercalate5("; ")([
                      (() => {
                        if (dir2 === "Left") {
                          return "grid-area: " + showIntImpl(intDiv(n, 2) + 2 | 0) + " / 1";
                        }
                        if (dir2 === "Right") {
                          return "grid-area: " + showIntImpl(intDiv(n, 2) + 2 | 0) + " / " + showIntImpl(n + 2 | 0);
                        }
                        if (dir2 === "Up") {
                          return "grid-area: 1 / " + showIntImpl(intDiv(n, 2) + 2 | 0);
                        }
                        if (dir2 === "Down") {
                          return "grid-area: " + showIntImpl(n + 2 | 0) + " / " + showIntImpl(intDiv(n, 2) + 2 | 0);
                        }
                        fail();
                      })()
                    ]))
                  ],
                  [
                    $VDom(
                      "Elem",
                      $Maybe("Just", "http://www.w3.org/2000/svg"),
                      "svg",
                      [
                        elem(eqCardinalDirection)(dir2)([Up, Down]) ? viewBox(0)(0)(50)(25) : viewBox(12.5)(-12.5)(25)(50)
                      ],
                      [
                        $VDom(
                          "Elem",
                          $Maybe("Just", "http://www.w3.org/2000/svg"),
                          "g",
                          [
                            transform([
                              $Transform(
                                "Rotate",
                                90 * toNumber((() => {
                                  if (dir2 === "Up") {
                                    return 2;
                                  }
                                  if (dir2 === "Right") {
                                    return 3;
                                  }
                                  if (dir2 === "Down") {
                                    return 4;
                                  }
                                  if (dir2 === "Left") {
                                    return 5;
                                  }
                                  fail();
                                })()),
                                25,
                                12.5
                              )
                            ])
                          ],
                          [
                            renderPathWithEvents(portPath(portInfo))($Action3(
                              "BoardPortOnMouseEnter",
                              dir2
                            ))(BoardPortOnMouseLeave)
                          ]
                        )
                      ]
                    )
                  ]
                ))(boardPortInfo2(state)._1)
              ),
              slot2($$Proxy)()(component22)({})(MultimeterOutput)
            ]
          );
        }
      };
    };
  };

  // output-es/Effect.Now/foreign.js
  function now3() {
    return Date.now();
  }

  // output-es/Effect.Now/index.js
  var nowTime = () => {
    const a$p = now3();
    return toDateTime(a$p)._2;
  };

  // output-es/Component.Chat/foreign.js
  var toLocaleString = (hours) => (minutes) => (seconds) => new Date(2e3, 1, 1, hours - 1, minutes, seconds).toLocaleTimeString();

  // output-es/Component.Chat/index.js
  var $Action6 = (tag, _1) => ({ tag, _1 });
  var gets4 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var appendModifying2 = (p) => (x3) => {
    const $0 = p((a) => [...a, ...x3]);
    return $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "State",
          (s) => {
            const s$p = $0(s);
            return $Tuple(s$p, s$p);
          }
        ),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      snoc(CatNil)((x$1) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var traverse_9 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var modify_4 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var Initialise3 = /* @__PURE__ */ $Action6("Initialise");
  var _messages = /* @__PURE__ */ prop2({ reflectSymbol: () => "messages" })()()($$Proxy);
  var component7 = (dictMonadAsk) => (dictMonadAff) => {
    const $0 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      eval: mkEval({
        handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            const $1 = $0.liftEffect(create);
            return $Free(
              $1._1,
              snoc($1._2)((v1) => {
                const $2 = v1.listener;
                return $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("Subscribe", (v$1) => (k) => v1.emitter((x3) => k($Action6("NewMessage", x3))), identity11),
                    (x3) => $Free($FreeView("Return", x3), CatNil)
                  ),
                  snoc(CatNil)(() => {
                    const $3 = gets4((v2) => v2.conversation);
                    return $Free(
                      $3._1,
                      snoc($3._2)((conversation) => {
                        const $4 = monadAffHalogenM(dictMonadAff).liftAff(forkAff(conversation($2)));
                        return $Free(
                          $4._1,
                          snoc($4._2)(() => $Free($FreeView("Return", void 0), CatNil))
                        );
                      })
                    );
                  })
                );
              })
            );
          }
          if (v.tag === "NewMessage") {
            const $1 = v._1.html;
            const $2 = v._1.user;
            const $3 = $0.liftEffect(nowTime);
            return $Free(
              $3._1,
              snoc($3._2)((timestamp) => {
                const $4 = appendModifying2(_messages(strongFn))([
                  {
                    timestamp,
                    user: (() => {
                      if ($2.tag === "Nothing") {
                        return "********";
                      }
                      if ($2.tag === "Just") {
                        return $2._1;
                      }
                      fail();
                    })(),
                    html: $VDom("Elem", Nothing, "div", [], $1)
                  }
                ]);
                return $Free(
                  $4._1,
                  snoc($4._2)(() => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("GetRef", "chat-component", identity11),
                      (x3) => $Free($FreeView("Return", x3), CatNil)
                    ),
                    snoc(CatNil)(traverse_9((element) => {
                      const $5 = $0.liftEffect(scrollHeight(element));
                      return $Free($5._1, snoc($5._2)((height2) => $0.liftEffect(setScrollTop(height2)(element))));
                    }))
                  ))
                );
              })
            );
          }
          if (v.tag === "OnScroll") {
            const $1 = getHTMLElementRef("chat-component");
            return $Free(
              $1._1,
              snoc($1._2)(traverse_9((element) => {
                const $2 = $0.liftEffect(scrollHeight(element));
                return $Free(
                  $2._1,
                  snoc($2._2)((height2) => {
                    const $3 = $0.liftEffect(scrollTop(element));
                    return $Free($3._1, snoc($3._2)((top) => modify_4((v1) => ({ ...v1, scrollToBottom: height2 === top }))));
                  })
                );
              }))
            );
          }
          fail();
        },
        initialize: $Maybe("Just", Initialise3),
        finalize: Nothing,
        receive: (v) => Nothing
      }),
      initialState: (v) => ({ conversation: v.conversation, messages: [], scrollToBottom: true }),
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [
          id("chat-component"),
          $Prop(
            "Ref",
            (x3) => $Maybe(
              "Just",
              $Input(
                "RefUpdate",
                "chat-component",
                (() => {
                  if (x3.tag === "Created") {
                    return $Maybe("Just", x3._1);
                  }
                  if (x3.tag === "Removed") {
                    return Nothing;
                  }
                  fail();
                })()
              )
            )
          ),
          $Prop("Handler", "scroll", (ev) => $Maybe("Just", $Input("Action", $Action6("OnScroll", ev))))
        ],
        [
          $VDom(
            "Elem",
            Nothing,
            "table",
            [],
            arrayMap((v) => $VDom(
              "Elem",
              Nothing,
              "tr",
              [],
              [
                $VDom(
                  "Elem",
                  Nothing,
                  "td",
                  [class_("timestamp")],
                  [$VDom("Text", toLocaleString(v.timestamp._1)(v.timestamp._2)(v.timestamp._3))]
                ),
                $VDom(
                  "Elem",
                  Nothing,
                  "td",
                  [$Prop("Attribute", Nothing, "data-username", v.user), class_("username")],
                  [$VDom("Elem", Nothing, "div", [], [$VDom("Text", v.user)])]
                ),
                $VDom("Elem", Nothing, "td", [class_("message")], [v.html])
              ]
            ))(state.messages)
          )
        ]
      )
    };
  };

  // output-es/Halogen.Svg.Attributes.Orient/index.js
  var $Orient = (tag) => tag;
  var AutoStartReverse = /* @__PURE__ */ $Orient("AutoStartReverse");

  // output-es/Halogen.Svg.Attributes.TextAnchor/index.js
  var $TextAnchor = (tag) => tag;
  var AnchorStart = /* @__PURE__ */ $TextAnchor("AnchorStart");
  var AnchorEnd = /* @__PURE__ */ $TextAnchor("AnchorEnd");

  // output-es/Component.Rendering.BoardPortDiagram/index.js
  var renderBoardPortDiagram = (goal) => (boardPorts) => $VDom(
    "Elem",
    $Maybe("Just", "http://www.w3.org/2000/svg"),
    "svg",
    [viewBox(0)(0)(100)(100), class_2("board-port-diagram")],
    [
      $VDom(
        "Elem",
        $Maybe("Just", "http://www.w3.org/2000/svg"),
        "rect",
        [width(30), height(30), x(35), y(35)],
        []
      ),
      ...arrayMap((dir2) => {
        const portMismatch2 = isPortMismatch(dir2)(lookup(ordCardinalDirection)(dir2)(goal.ports))(lookup(ordCardinalDirection)(dir2)(boardPorts));
        const label = (capacity2) => {
          if (dir2 === "Up") {
            return $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "text",
              [
                x(55),
                y(25),
                textAnchor(dir2 === "Left" ? AnchorEnd : AnchorStart),
                dominantBaseline(dir2 === "Down" ? Hanging : Auto)
              ],
              [
                $VDom(
                  "Text",
                  showIntImpl((() => {
                    if (capacity2 === "OneBit") {
                      return 1;
                    }
                    if (capacity2 === "TwoBit") {
                      return 2;
                    }
                    if (capacity2 === "FourBit") {
                      return 4;
                    }
                    if (capacity2 === "EightBit") {
                      return 8;
                    }
                    fail();
                  })())
                )
              ]
            );
          }
          if (dir2 === "Right") {
            return $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "text",
              [
                x(75),
                y(45),
                textAnchor(dir2 === "Left" ? AnchorEnd : AnchorStart),
                dominantBaseline(dir2 === "Down" ? Hanging : Auto)
              ],
              [
                $VDom(
                  "Text",
                  showIntImpl((() => {
                    if (capacity2 === "OneBit") {
                      return 1;
                    }
                    if (capacity2 === "TwoBit") {
                      return 2;
                    }
                    if (capacity2 === "FourBit") {
                      return 4;
                    }
                    if (capacity2 === "EightBit") {
                      return 8;
                    }
                    fail();
                  })())
                )
              ]
            );
          }
          if (dir2 === "Down") {
            return $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "text",
              [
                x(55),
                y(73),
                textAnchor(dir2 === "Left" ? AnchorEnd : AnchorStart),
                dominantBaseline(dir2 === "Down" ? Hanging : Auto)
              ],
              [
                $VDom(
                  "Text",
                  showIntImpl((() => {
                    if (capacity2 === "OneBit") {
                      return 1;
                    }
                    if (capacity2 === "TwoBit") {
                      return 2;
                    }
                    if (capacity2 === "FourBit") {
                      return 4;
                    }
                    if (capacity2 === "EightBit") {
                      return 8;
                    }
                    fail();
                  })())
                )
              ]
            );
          }
          if (dir2 === "Left") {
            return $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "text",
              [
                x(25),
                y(45),
                textAnchor(dir2 === "Left" ? AnchorEnd : AnchorStart),
                dominantBaseline(dir2 === "Down" ? Hanging : Auto)
              ],
              [
                $VDom(
                  "Text",
                  showIntImpl((() => {
                    if (capacity2 === "OneBit") {
                      return 1;
                    }
                    if (capacity2 === "TwoBit") {
                      return 2;
                    }
                    if (capacity2 === "FourBit") {
                      return 4;
                    }
                    if (capacity2 === "EightBit") {
                      return 8;
                    }
                    fail();
                  })())
                )
              ]
            );
          }
          fail();
        };
        const arrow = (portType3) => $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "g",
          [
            transform([
              $Transform("Rotate", toNumber(clockwiseRotation(Up)(dir2)) * 90, 50, 50)
            ])
          ],
          [
            $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "line",
              [
                x1(50),
                y1(5),
                x2(50),
                y2(30),
                strokeWidth(2),
                portType3 === "Input" ? markerEnd((() => {
                  if (dir2 === "Up") {
                    return "url(#arrowUp)";
                  }
                  if (dir2 === "Right") {
                    return "url(#arrowRight)";
                  }
                  if (dir2 === "Down") {
                    return "url(#arrowDown)";
                  }
                  if (dir2 === "Left") {
                    return "url(#arrowLeft)";
                  }
                  fail();
                })()) : markerStart((() => {
                  if (dir2 === "Up") {
                    return "url(#arrowUp)";
                  }
                  if (dir2 === "Right") {
                    return "url(#arrowRight)";
                  }
                  if (dir2 === "Down") {
                    return "url(#arrowDown)";
                  }
                  if (dir2 === "Left") {
                    return "url(#arrowLeft)";
                  }
                  fail();
                })())
              ],
              []
            )
          ]
        );
        return $VDom(
          "Elem",
          $Maybe("Just", "http://www.w3.org/2000/svg"),
          "g",
          [
            classes2(["port"]),
            $Prop("Attribute", Nothing, "data-direction", direction.attrPrint(dir2)),
            ...(() => {
              if (portMismatch2.tag === "Nothing") {
                return [];
              }
              if (portMismatch2.tag === "Just") {
                return [$Prop("Attribute", Nothing, "data-port-mismatch", portMismatch.attrPrint(portMismatch2._1))];
              }
              fail();
            })()
          ],
          [
            $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "defs",
              [],
              [
                $VDom(
                  "Elem",
                  $Maybe("Just", "http://www.w3.org/2000/svg"),
                  "marker",
                  [
                    id3((() => {
                      if (dir2 === "Up") {
                        return "arrowUp";
                      }
                      if (dir2 === "Right") {
                        return "arrowRight";
                      }
                      if (dir2 === "Down") {
                        return "arrowDown";
                      }
                      if (dir2 === "Left") {
                        return "arrowLeft";
                      }
                      fail();
                    })()),
                    refX(5),
                    refY(5),
                    markerWidth(5),
                    markerHeight(5),
                    orient(AutoStartReverse),
                    viewBox(0)(0)(10)(10)
                  ],
                  [
                    $VDom(
                      "Elem",
                      $Maybe("Just", "http://www.w3.org/2000/svg"),
                      "path",
                      [
                        d([
                          renderCommand2Args("m")(Abs)(0)(0),
                          renderCommand2Args("l")(Abs)(10)(5),
                          renderCommand2Args("l")(Abs)(0)(10),
                          "z"
                        ])
                      ],
                      []
                    )
                  ]
                )
              ]
            ),
            $VDom(
              "Elem",
              $Maybe("Just", "http://www.w3.org/2000/svg"),
              "g",
              [],
              (() => {
                if (portMismatch2.tag === "Just") {
                  if (portMismatch2._1.tag === "PortExpected") {
                    return [arrow(portType(portMismatch2._1._1.expected)), label(portCapacity(portMismatch2._1._1.expected))];
                  }
                  if (portMismatch2._1.tag === "NoPortExpected") {
                    return [arrow(portType(portMismatch2._1._1.received))];
                  }
                  if (portMismatch2._1.tag === "IncorrectPortType") {
                    return [arrow(portMismatch2._1._1.received), label(portMismatch2._1._1.capacity)];
                  }
                  if (portMismatch2._1.tag === "IncorrectCapacity") {
                    return [arrow(portMismatch2._1._1.portType), label(portMismatch2._1._1.expected)];
                  }
                  fail();
                }
                if (portMismatch2.tag === "Nothing") {
                  const $0 = lookup(ordCardinalDirection)(dir2)(boardPorts);
                  if ($0.tag === "Nothing") {
                    return [];
                  }
                  if ($0.tag === "Just") {
                    return [arrow($0._1.portType), label($0._1.capacity)];
                  }
                }
                fail();
              })()
            )
          ]
        );
      })(allDirections)
    ]
  );

  // output-es/Component.Sidebar/index.js
  var $Action7 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Output4 = (tag, _1) => ({ tag, _1 });
  var intercalate6 = (sep) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: v.acc + sep + v1 };
  })({ init: true, acc: "" })(xs).acc;
  var BoardSizeIncremented = /* @__PURE__ */ $Output4("BoardSizeIncremented");
  var BoardSizeDecremented = /* @__PURE__ */ $Output4("BoardSizeDecremented");
  var TestsTriggered = /* @__PURE__ */ $Output4("TestsTriggered");
  var PieceOnDrop = (value0) => (value1) => $Action7("PieceOnDrop", value0, value1);
  var PieceOnClick = (value0) => (value1) => $Action7("PieceOnClick", value0, value1);
  var BackToLevelSelect = /* @__PURE__ */ $Action7("BackToLevelSelect");
  var IncrementBoardSize2 = /* @__PURE__ */ $Action7("IncrementBoardSize");
  var DecrementBoardSize2 = /* @__PURE__ */ $Action7("DecrementBoardSize");
  var RunTestsClicked = /* @__PURE__ */ $Action7("RunTestsClicked");
  var DoNothing = /* @__PURE__ */ $Action7("DoNothing");
  var renderDescription = /* @__PURE__ */ (() => {
    const reduceStrings = (v) => {
      if (v.tag === "Cons") {
        if (v._2.tag === "Cons") {
          if (v._2._1.tag === "Right") {
            if (v._1.tag === "Right") {
              return reduceStrings($List("Cons", $Either("Right", v._1._1 + " " + v._2._1._1), v._2._2));
            }
            if (v._1.tag === "Left") {
              return $List(
                "Cons",
                $Either("Left", v._1._1),
                reduceStrings($List("Cons", $Either("Right", " " + v._2._1._1), v._2._2))
              );
            }
            return $List("Cons", v._1, reduceStrings(v._2));
          }
          if (v._1.tag === "Right" && v._2._1.tag === "Left") {
            return $List(
              "Cons",
              $Either("Right", v._1._1 + " "),
              $List("Cons", $Either("Left", v._2._1._1), reduceStrings(v._2._2))
            );
          }
        }
        return $List("Cons", v._1, reduceStrings(v._2));
      }
      if (v.tag === "Nil") {
        return Nil;
      }
      fail();
    };
    const $0 = listMap((v) => {
      if (v.tag === "Left") {
        return $VDom("Elem", Nothing, "span", [class_("piece-name")], [$VDom("Text", v._1)]);
      }
      if (v.tag === "Right") {
        return $VDom("Text", v._1);
      }
      fail();
    });
    const $1 = listMap((x3) => {
      if ((() => {
        const $12 = lookup(ordPieceId)(x3)(pieceVault);
        if ($12.tag === "Nothing") {
          return true;
        }
        if ($12.tag === "Just") {
          return false;
        }
        fail();
      })()) {
        return $Either("Right", x3);
      }
      return $Either("Left", x3);
    });
    const $2 = foldrArray(Cons)(Nil);
    const $3 = split(" ");
    return (x3) => $VDom(
      "Elem",
      Nothing,
      "div",
      [],
      fromFoldableImpl(foldableList.foldr, $0(reduceStrings($1($2($3(x3))))))
    );
  })();
  var component8 = (dictMonadAff) => {
    const navigateTo2 = navigateTo(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
    return {
      eval: mkEval({
        finalize: Nothing,
        handleAction: (v) => {
          if (v.tag === "Initialise") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF(
                  "State",
                  (v$1) => $Tuple(void 0, { problem: v._1.problem, completionStatus: v._1.completionStatus, boardSize: v._1.boardSize, boardPorts: v._1.boardPorts })
                ),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "PieceOnDrop") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output4("PieceDropped", v._1), void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "PieceOnClick") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output4("PieceAdded", v._1), void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "BackToLevelSelect") {
            return navigateTo2(LevelSelect);
          }
          if (v.tag === "IncrementBoardSize") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", BoardSizeIncremented, void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "DecrementBoardSize") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", BoardSizeDecremented, void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "RunTestsClicked") {
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", TestsTriggered, void 0),
                (x3) => $Free($FreeView("Return", x3), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "DoNothing") {
            return $Free($FreeView("Return", void 0), CatNil);
          }
          fail();
        },
        handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
        initialize: Nothing,
        receive: (x3) => $Maybe("Just", $Action7("Initialise", x3))
      }),
      initialState: (v) => ({ problem: v.problem, completionStatus: v.completionStatus, boardSize: v.boardSize, boardPorts: v.boardPorts }),
      render: (state) => $VDom(
        "Elem",
        Nothing,
        "div",
        [id("sidebar-component")],
        [
          $VDom("Elem", Nothing, "h2", [], [$VDom("Text", state.problem.title)]),
          $VDom("Elem", Nothing, "div", [], [renderDescription(state.problem.description)]),
          $VDom("Elem", Nothing, "hr", [], []),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [
              classes(["completion-status"]),
              $Prop(
                "Attribute",
                Nothing,
                "data-completion-status",
                (() => {
                  if (state.completionStatus.tag === "NotStarted") {
                    return "not-started";
                  }
                  if (state.completionStatus.tag === "FailedRestriction") {
                    return "failed-restriction";
                  }
                  if (state.completionStatus.tag === "NotEvaluable") {
                    return "not-evaluable";
                  }
                  if (state.completionStatus.tag === "PortMismatch") {
                    return "port-mismatch";
                  }
                  if (state.completionStatus.tag === "ReadyForTesting") {
                    return "ready-for-testing";
                  }
                  if (state.completionStatus.tag === "RunningTest") {
                    return "running-test";
                  }
                  if (state.completionStatus.tag === "FailedTestCase") {
                    return "failed-test-case";
                  }
                  if (state.completionStatus.tag === "Completed") {
                    return "completed";
                  }
                  fail();
                })()
              )
            ],
            [
              $VDom(
                "Elem",
                Nothing,
                "div",
                [],
                (() => {
                  if (state.completionStatus.tag === "NotStarted") {
                    return [];
                  }
                  if (state.completionStatus.tag === "FailedRestriction") {
                    return [
                      $VDom("Text", "This level has a special restriction: "),
                      $VDom("Elem", Nothing, "b", [], [$VDom("Text", state.completionStatus._1.name)]),
                      $VDom("Elem", Nothing, "br", [], []),
                      $VDom("Text", state.completionStatus._1.description)
                    ];
                  }
                  if (state.completionStatus.tag === "NotEvaluable") {
                    return [$VDom("Text", "not evaluable due to: " + showBoardError.show(state.completionStatus._1))];
                  }
                  if (state.completionStatus.tag === "PortMismatch") {
                    return [
                      $VDom(
                        "Elem",
                        Nothing,
                        "div",
                        [],
                        [
                          $VDom("Elem", Nothing, "b", [], [$VDom("Text", "Port mismatch:")]),
                          (() => {
                            if (state.completionStatus._1.tag === "PortExpected") {
                              return $VDom(
                                "Text",
                                (state.completionStatus._1._1.expected.portType === "Input" ? "You need an input in the " : "You need an output of capacity " + showIntImpl((() => {
                                  if (state.completionStatus._1._1.expected.capacity === "OneBit") {
                                    return 1;
                                  }
                                  if (state.completionStatus._1._1.expected.capacity === "TwoBit") {
                                    return 2;
                                  }
                                  if (state.completionStatus._1._1.expected.capacity === "FourBit") {
                                    return 4;
                                  }
                                  if (state.completionStatus._1._1.expected.capacity === "EightBit") {
                                    return 8;
                                  }
                                  fail();
                                })()) + " in the ") + (() => {
                                  if (state.completionStatus._1._1.direction === "Up") {
                                    return "Up";
                                  }
                                  if (state.completionStatus._1._1.direction === "Right") {
                                    return "Right";
                                  }
                                  if (state.completionStatus._1._1.direction === "Down") {
                                    return "Down";
                                  }
                                  if (state.completionStatus._1._1.direction === "Left") {
                                    return "Left";
                                  }
                                  fail();
                                })() + " direction"
                              );
                            }
                            if (state.completionStatus._1.tag === "NoPortExpected") {
                              return $VDom(
                                "Text",
                                (() => {
                                  if (state.completionStatus._1._1.direction === "Up") {
                                    return "Remove the port in the Updirection";
                                  }
                                  if (state.completionStatus._1._1.direction === "Right") {
                                    return "Remove the port in the Rightdirection";
                                  }
                                  if (state.completionStatus._1._1.direction === "Down") {
                                    return "Remove the port in the Downdirection";
                                  }
                                  if (state.completionStatus._1._1.direction === "Left") {
                                    return "Remove the port in the Leftdirection";
                                  }
                                  fail();
                                })()
                              );
                            }
                            if (state.completionStatus._1.tag === "IncorrectPortType") {
                              return $VDom(
                                "Text",
                                (() => {
                                  if (state.completionStatus._1._1.direction === "Up") {
                                    return "Port in the Up direction should be an ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Right") {
                                    return "Port in the Right direction should be an ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Down") {
                                    return "Port in the Down direction should be an ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Left") {
                                    return "Port in the Left direction should be an ";
                                  }
                                  fail();
                                })() + (() => {
                                  if (state.completionStatus._1._1.expected === "Input") {
                                    return "Input";
                                  }
                                  if (state.completionStatus._1._1.expected === "Output") {
                                    return "Output";
                                  }
                                  fail();
                                })()
                              );
                            }
                            if (state.completionStatus._1.tag === "IncorrectCapacity") {
                              return $VDom(
                                "Text",
                                (() => {
                                  if (state.completionStatus._1._1.direction === "Up") {
                                    return "Port in the Up direction should have capacity ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Right") {
                                    return "Port in the Right direction should have capacity ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Down") {
                                    return "Port in the Down direction should have capacity ";
                                  }
                                  if (state.completionStatus._1._1.direction === "Left") {
                                    return "Port in the Left direction should have capacity ";
                                  }
                                  fail();
                                })() + showIntImpl((() => {
                                  if (state.completionStatus._1._1.expected === "OneBit") {
                                    return 1;
                                  }
                                  if (state.completionStatus._1._1.expected === "TwoBit") {
                                    return 2;
                                  }
                                  if (state.completionStatus._1._1.expected === "FourBit") {
                                    return 4;
                                  }
                                  if (state.completionStatus._1._1.expected === "EightBit") {
                                    return 8;
                                  }
                                  fail();
                                })())
                              );
                            }
                            fail();
                          })()
                        ]
                      )
                    ];
                  }
                  if (state.completionStatus.tag === "ReadyForTesting") {
                    return [
                      $VDom("Text", "Ready for testing: "),
                      $VDom(
                        "Elem",
                        Nothing,
                        "button",
                        [
                          class_("ready-for-testing"),
                          $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", RunTestsClicked)))
                        ],
                        [$VDom("Text", "Run Tests")]
                      )
                    ];
                  }
                  if (state.completionStatus.tag === "RunningTest") {
                    return [
                      $VDom("Elem", Nothing, "b", [], [$VDom("Text", "Running tests")]),
                      $VDom("Elem", Nothing, "br", [], []),
                      $VDom(
                        "Text",
                        "Running " + showIntImpl(state.completionStatus._1.testIndex + 1 | 0) + "/" + showIntImpl(state.completionStatus._1.numTests)
                      )
                    ];
                  }
                  if (state.completionStatus.tag === "FailedTestCase") {
                    return [
                      (() => {
                        const $0 = state.completionStatus._1.expected;
                        return $VDom(
                          "Elem",
                          Nothing,
                          "div",
                          [],
                          [
                            $VDom(
                              "Elem",
                              Nothing,
                              "b",
                              [],
                              [$VDom("Text", "Test " + showIntImpl(state.completionStatus._1.testIndex + 1 | 0) + " Failed:")]
                            ),
                            $VDom("Elem", Nothing, "br", [], []),
                            $VDom("Text", "inputs: "),
                            $VDom(
                              "Text",
                              intercalate6(", ")(arrayMap((v1) => (() => {
                                if (v1._1 === "Up") {
                                  return "Up: ";
                                }
                                if (v1._1 === "Right") {
                                  return "Right: ";
                                }
                                if (v1._1 === "Down") {
                                  return "Down: ";
                                }
                                if (v1._1 === "Left") {
                                  return "Left: ";
                                }
                                fail();
                              })() + showSignal.show(v1._2))(toUnfoldable(unfoldableArray)(state.completionStatus._1.inputs)))
                            ),
                            $VDom("Elem", Nothing, "br", [], []),
                            $VDom("Text", "expected: "),
                            $VDom(
                              "Text",
                              intercalate6(", ")(arrayMap((v1) => (() => {
                                if (v1._1 === "Up") {
                                  return "Up: ";
                                }
                                if (v1._1 === "Right") {
                                  return "Right: ";
                                }
                                if (v1._1 === "Down") {
                                  return "Down: ";
                                }
                                if (v1._1 === "Left") {
                                  return "Left: ";
                                }
                                fail();
                              })() + showSignal.show(v1._2))(toUnfoldable(unfoldableArray)($0)))
                            ),
                            $VDom("Elem", Nothing, "br", [], []),
                            $VDom("Text", "recieved: "),
                            $VDom(
                              "Elem",
                              Nothing,
                              "span",
                              [],
                              intersperse($VDom("Text", ", "))(arrayMap((tuple) => {
                                if ((() => {
                                  const $1 = lookup(ordCardinalDirection)(tuple._1)($0);
                                  if ($1.tag === "Nothing") {
                                    return false;
                                  }
                                  return $1.tag === "Just" && $1._1 === tuple._2;
                                })()) {
                                  return $VDom(
                                    "Elem",
                                    Nothing,
                                    "span",
                                    [class_("green")],
                                    [
                                      $VDom(
                                        "Text",
                                        (() => {
                                          if (tuple._1 === "Up") {
                                            return "Up: ";
                                          }
                                          if (tuple._1 === "Right") {
                                            return "Right: ";
                                          }
                                          if (tuple._1 === "Down") {
                                            return "Down: ";
                                          }
                                          if (tuple._1 === "Left") {
                                            return "Left: ";
                                          }
                                          fail();
                                        })() + showSignal.show(tuple._2)
                                      )
                                    ]
                                  );
                                }
                                return $VDom(
                                  "Elem",
                                  Nothing,
                                  "span",
                                  [class_("red")],
                                  [
                                    $VDom(
                                      "Text",
                                      (() => {
                                        if (tuple._1 === "Up") {
                                          return "Up: ";
                                        }
                                        if (tuple._1 === "Right") {
                                          return "Right: ";
                                        }
                                        if (tuple._1 === "Down") {
                                          return "Down: ";
                                        }
                                        if (tuple._1 === "Left") {
                                          return "Left: ";
                                        }
                                        fail();
                                      })() + showSignal.show(tuple._2)
                                    )
                                  ]
                                );
                              })(toUnfoldable(unfoldableArray)(state.completionStatus._1.recieved)))
                            )
                          ]
                        );
                      })()
                    ];
                  }
                  if (state.completionStatus.tag === "Completed") {
                    return [
                      $VDom("Text", "Level Complete!"),
                      $VDom(
                        "Elem",
                        Nothing,
                        "button",
                        [
                          class_("run-tests-again"),
                          $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", RunTestsClicked)))
                        ],
                        [$VDom("Text", "Run Tests again")]
                      ),
                      $VDom(
                        "Elem",
                        Nothing,
                        "button",
                        [
                          class_("back-to-level-select"),
                          $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", BackToLevelSelect)))
                        ],
                        [$VDom("Text", "Back to Level Select ")]
                      )
                    ];
                  }
                  fail();
                })()
              ),
              renderBoardPortDiagram(state.problem.goal)(state.boardPorts)
            ]
          ),
          $VDom("Elem", Nothing, "h3", [], [$VDom("Text", "Available pieces:")]),
          $VDom(
            "Elem",
            Nothing,
            "span",
            [class_("pieces")],
            arrayMap((piece) => $VDom(
              "Elem",
              Nothing,
              "div",
              [
                $Prop("Attribute", Nothing, "data-available-piece", piece.name),
                draggable(true),
                classes(["available-piece"]),
                (() => {
                  const $0 = PieceOnDrop(piece.name);
                  return $Prop("Handler", "dragend", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })(),
                (() => {
                  const $0 = PieceOnClick(piece.name);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [
                bifunctorHTML.bimap(functorComponentSlot.map((v) => DoNothing))((v) => DoNothing)(renderPiece(initialState2({
                  piece,
                  location: { x: 0, y: 0 }
                }))),
                $VDom("Text", piece.name)
              ]
            ))(nubBy2(ordPiece.compare)(state.problem.availablePieces))
          ),
          $VDom("Elem", Nothing, "br", [], []),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [classes(["board-size"])],
            [
              $VDom("Elem", Nothing, "b", [], [$VDom("Text", "Board size")]),
              $VDom(
                "Elem",
                Nothing,
                "div",
                [classes(["buttons"])],
                [
                  $VDom(
                    "Elem",
                    Nothing,
                    "button",
                    [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", DecrementBoardSize2)))],
                    [$VDom("Text", "-")]
                  ),
                  $VDom("Text", " " + showIntImpl(state.boardSize) + " "),
                  $VDom(
                    "Elem",
                    Nothing,
                    "button",
                    [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", IncrementBoardSize2)))],
                    [$VDom("Text", "+")]
                  )
                ]
              )
            ]
          ),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [classes(["give-up"])],
            [
              $VDom("Elem", Nothing, "b", [], [$VDom("Text", "I give up")]),
              $VDom(
                "Elem",
                Nothing,
                "button",
                [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", BackToLevelSelect)))],
                [$VDom("Text", "Choose another level")]
              )
            ]
          )
        ]
      )
    };
  };

  // output-es/Data.TraversableWithIndex/index.js
  var traversableWithIndexArray = {
    traverseWithIndex: (dictApplicative) => {
      const sequence1 = traversableWithIndexArray.Traversable2().sequence(dictApplicative);
      return (f) => {
        const $0 = traversableWithIndexArray.FunctorWithIndex0().mapWithIndex(f);
        return (x3) => sequence1($0(x3));
      };
    },
    FunctorWithIndex0: () => functorWithIndexArray,
    FoldableWithIndex1: () => foldableWithIndexArray,
    Traversable2: () => traversableArray
  };

  // output-es/Component.Level/index.js
  var $Action8 = (tag, _1) => ({ tag, _1 });
  var boardIsSymbol = { reflectSymbol: () => "board" };
  var request2 = /* @__PURE__ */ request()(boardIsSymbol)(ordUnit);
  var slot12 = /* @__PURE__ */ slot()(boardIsSymbol)(ordUnit);
  var slot_2 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "chat" })(ordUnit);
  var slot22 = /* @__PURE__ */ slot()({ reflectSymbol: () => "sidebar" })(ordUnit);
  var getBoardPorts3 = /* @__PURE__ */ getBoardPorts(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var gets5 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var show4 = (record) => "{ levelName: " + showStringImpl(record.levelName) + ", suiteName: " + showStringImpl(record.suiteName) + " }";
  var tell3 = /* @__PURE__ */ tell2()(boardIsSymbol)(ordUnit);
  var modify_5 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var _size4 = /* @__PURE__ */ _size(strongForget);
  var for_6 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var traverse_10 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var show12 = (v) => {
    if (v.tag === "Just") {
      return "(Just " + showLocation.show(v._1) + ")";
    }
    if (v.tag === "Nothing") {
      return "Nothing";
    }
    fail();
  };
  var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(freeMonad);
  var forWithIndex = /* @__PURE__ */ (() => {
    const $0 = traversableWithIndexArray.traverseWithIndex(applicativeExceptT2);
    return (b) => (a) => $0(a)(b);
  })();
  var bindExceptT2 = /* @__PURE__ */ bindExceptT(freeMonad);
  var modify_1 = /* @__PURE__ */ (() => {
    const $0 = monadStateExceptT(monadStateHalogenM);
    return (f) => $0.state((s) => $Tuple(void 0, f(s)));
  })();
  var runSingleTest2 = /* @__PURE__ */ runSingleTest(freeMonad);
  var Initialise4 = /* @__PURE__ */ $Action8("Initialise");
  var BoardOutput = (value0) => $Action8("BoardOutput", value0);
  var SidebarOutput = (value0) => $Action8("SidebarOutput", value0);
  var component9 = (dictMonadAff) => {
    const component1 = component8(dictMonadAff);
    const MonadEffect0 = dictMonadAff.MonadEffect0();
    const lift1 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    const monadEffectHalogenM2 = monadEffectHalogenM(MonadEffect0);
    return (dictMonadAsk) => {
      const component22 = component7(dictMonadAsk)(dictMonadAff);
      return (dictMonadLogger) => {
        const component32 = component6(dictMonadLogger)(dictMonadAff);
        const debug2 = log$p(dictMonadLogger)(Debug);
        return {
          eval: mkEval({
            finalize: Nothing,
            handleAction: (v) => {
              if (v.tag === "Initialise") {
                const $0 = gets5((v1) => v1.levelId);
                return $Free(
                  $0._1,
                  snoc($0._2)((levelId) => {
                    const $1 = lift1(debug2(Leaf2)("initialised level " + show4(levelId)));
                    return $Free(
                      $1._1,
                      snoc($1._2)(() => {
                        const $2 = gets5((v1) => v1.level.problem.goal);
                        return $Free(
                          $2._1,
                          snoc($2._2)((v1) => tell3($$Proxy)()((v2) => $Query("SetGoalPorts", v1.ports)))
                        );
                      })
                    );
                  })
                );
              }
              if (v.tag === "BoardOutput") {
                const $0 = v._1._1;
                const $1 = gets5((v1) => v1.level.problem);
                return $Free(
                  $1._1,
                  snoc($1._2)((problem) => modify_5((v1) => ({
                    ...v1,
                    completionStatus: isReadyForTesting(problem)($0),
                    boardSize: _size4(identity15)($0),
                    boardPorts: getBoardPorts3($0)._1
                  })))
                );
              }
              if (v.tag === "SidebarOutput") {
                if (v._1.tag === "PieceDropped") {
                  const $0 = v._1._1;
                  const $1 = request2($$Proxy)()(GetMouseOverLocation);
                  return $Free(
                    $1._1,
                    snoc($1._2)((maybeLocation) => for_6(maybeLocation)((loc) => tell3($$Proxy)()((v1) => $Query(
                      "AddPiece",
                      loc,
                      pieceLookup($0)
                    ))))
                  );
                }
                if (v._1.tag === "PieceAdded") {
                  const $0 = v._1._1;
                  const $1 = request2($$Proxy)()(GetBoard);
                  return $Free(
                    $1._1,
                    snoc($1._2)(traverse_10((board) => {
                      const $2 = monadEffectHalogenM2.liftEffect(log2(show12(firstEmptyLocation(board))));
                      return $Free(
                        $2._1,
                        snoc($2._2)(() => for_6(firstEmptyLocation(board))((loc) => tell3($$Proxy)()((v1) => $Query(
                          "AddPiece",
                          loc,
                          pieceLookup($0)
                        ))))
                      );
                    }))
                  );
                }
                if (v._1.tag === "BoardSizeIncremented") {
                  const $0 = request2($$Proxy)()(IncrementBoardSize);
                  return $Free(
                    $0._1,
                    snoc($0._2)((x3) => $Free($FreeView("Return", void 0), CatNil))
                  );
                }
                if (v._1.tag === "BoardSizeDecremented") {
                  const $0 = request2($$Proxy)()(DecrementBoardSize);
                  return $Free(
                    $0._1,
                    snoc($0._2)((x3) => $Free($FreeView("Return", void 0), CatNil))
                  );
                }
                if (v._1.tag === "TestsTriggered") {
                  const $0 = gets5((v1) => v1.level.problem);
                  return $Free(
                    $0._1,
                    snoc($0._2)((problem) => {
                      const numTests = problem.testCases.length;
                      const delayDuration = toNumber(intDiv(2e3, numTests));
                      const $1 = forWithIndex(problem.testCases)((testIndex) => (testCase) => bindExceptT2.bind(modify_1((v1) => ({ ...v1, completionStatus: $CompletionStatus("RunningTest", { testIndex, numTests }) })))(() => bindExceptT2.bind(runSingleTest2(problem.goal)(testIndex)(testCase)((inputs) => {
                        const $12 = request2($$Proxy)()(SetInputs(inputs));
                        return $Free(
                          $12._1,
                          snoc($12._2)((x3) => $Free(
                            $FreeView(
                              "Return",
                              (() => {
                                if (x3.tag === "Nothing") {
                                  return Leaf2;
                                }
                                if (x3.tag === "Just") {
                                  return x3._1;
                                }
                                fail();
                              })()
                            ),
                            CatNil
                          ))
                        );
                      }))((res) => bindExceptT2.bind(monadAffExceptT(monadAffHalogenM(dictMonadAff)).liftAff(_delay(
                        Right,
                        delayDuration
                      )))(() => applicativeExceptT2.pure(res)))));
                      return $Free(
                        $1._1,
                        snoc($1._2)((testResult) => {
                          if (testResult.tag === "Left") {
                            const $2 = testResult._1;
                            return modify_5((v1) => ({ ...v1, completionStatus: $CompletionStatus("FailedTestCase", $2) }));
                          }
                          if (testResult.tag === "Right") {
                            const $2 = gets5((v1) => v1.levelId);
                            return $Free(
                              $2._1,
                              snoc($2._2)((levelId) => {
                                const $3 = monadEffectHalogenM2.liftEffect(saveLevelProgress(monadEffectEffect)(levelId)(Completed));
                                return $Free(
                                  $3._1,
                                  snoc($3._2)(() => modify_5((v1) => ({ ...v1, completionStatus: Completed2 })))
                                );
                              })
                            );
                          }
                          fail();
                        })
                      );
                    })
                  );
                }
              }
              fail();
            },
            handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
            initialize: $Maybe("Just", Initialise4),
            receive: (v) => Nothing
          }),
          initialState: (v) => ({ levelId: v.levelId, level: v.level, completionStatus: NotStarted, boardSize: 3, boardPorts: getBoardPorts3(standardBoard)._1 }),
          render: (v) => $VDom(
            "Elem",
            Nothing,
            "div",
            [id("puzzle-component")],
            [
              slot12($$Proxy)()(component32)({ board: standardBoard })(BoardOutput),
              slot_2($$Proxy)()(component22)({ conversation: v.level.conversation }),
              slot22($$Proxy)()(component1)({ problem: v.level.problem, completionStatus: v.completionStatus, boardSize: v.boardSize, boardPorts: v.boardPorts })(SidebarOutput)
            ]
          )
        };
      };
    };
  };

  // output-es/Game.Level.Problem/index.js
  var defaultProblem = {
    goal: idPiece,
    title: "default title",
    description: "default description",
    testCases: [],
    requiresAutomaticTesting: false,
    availablePieces: [],
    otherRestrictions: []
  };

  // output-es/Game.Level/index.js
  var traverse2 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeArray))();
  var fromFoldable9 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var defaultLevelOptions = { enableBoardSizeChange: true, compulsory: false, tutorial: Nothing };
  var defaultLevel = {
    problem: defaultProblem,
    conversation: /* @__PURE__ */ (() => {
      const $0 = _pure();
      return (v) => $0;
    })(),
    options: defaultLevelOptions
  };
  var binaryTestInputs = (directions) => arrayBind(traverse2((v) => [0, 1])(directions))((inputs) => [
    fromFoldable9(zipWithImpl(Tuple, directions, inputs))
  ]);

  // output-es/Resources.LevelSuites.IntermediateSuite/index.js
  var intermediateSuite = {
    "Criss cross": {
      ...defaultLevel,
      problem: {
        goal: crossPiece,
        title: "Cross over",
        description: "Propogate the signal on the left to the right, and the top to the bottom",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        requiresAutomaticTesting: false,
        availablePieces: [
          idPiece,
          superPiece,
          leftPiece,
          rightPiece,
          xorPiece
        ],
        otherRestrictions: []
      }
    },
    "From Or, birthed And": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: andPiece,
        title: "From Or, birthed And",
        description: "Create an and-piece using only or-piece and not-piece",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        availablePieces: [orPiece, notPiece]
      }
    },
    "Exclusive Or: Pick One": {
      ...defaultLevel,
      problem: {
        goal: xorPiece,
        title: "Exclusive Or: Pick One",
        description: "Output true when EXACTLY one input is true. If both inputs are true, output false",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        requiresAutomaticTesting: false,
        availablePieces: [
          idPiece,
          notPiece,
          orPiece,
          andPiece,
          crossPiece
        ],
        otherRestrictions: []
      }
    }
  };

  // output-es/Game.Piece.UnaryOperationPiece/index.js
  var fromFoldable10 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkUnaryOperation = (v) => {
    const $0 = v.capacity;
    return {
      complexity: { space: 1, time: 0 },
      name: v.name,
      eval: (inputs) => $$$Map(
        "Two",
        Leaf2,
        Right2,
        (() => {
          if ($0 === "OneBit") {
            return 1;
          }
          if ($0 === "TwoBit") {
            return 3;
          }
          if ($0 === "FourBit") {
            return 15;
          }
          if ($0 === "EightBit") {
            return 255;
          }
          fail();
        })() & v.operation((() => {
          const $1 = lookup(ordCardinalDirection)(Left2)(inputs);
          return (() => {
            if ($0 === "OneBit") {
              return 1;
            }
            if ($0 === "TwoBit") {
              return 3;
            }
            if ($0 === "FourBit") {
              return 15;
            }
            if ($0 === "EightBit") {
              return 255;
            }
            fail();
          })() & (() => {
            if ($1.tag === "Nothing") {
              return 0;
            }
            if ($1.tag === "Just") {
              return $1._1;
            }
            fail();
          })();
        })()),
        Leaf2
      ),
      shouldRipple: false,
      updateCapacity: (v1) => (v2) => Nothing,
      ports: fromFoldable10([
        $Tuple(Left2, { portType: Input, capacity: $0 }),
        $Tuple(Right2, { portType: Output, capacity: $0 })
      ]),
      updatePort: (v1) => (v2) => Nothing
    };
  };

  // output-es/Resources.LevelSuites.ShiftingSuite/index.js
  var shiftingSuite = {
    "4 bit left shift": {
      ...defaultLevel,
      problem: {
        goal: /* @__PURE__ */ mkUnaryOperation({ name: "shift-left-piece", capacity: FourBit, operation: (n) => n << 1 }),
        title: "4 bit left shift",
        description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl",
        testCases: /* @__PURE__ */ arrayMap(/* @__PURE__ */ singleton(Left2))([0, 1, 2, 3, 8, 9, 15]),
        requiresAutomaticTesting: false,
        availablePieces: [
          severPiece,
          fusePiece,
          idPiece,
          leftPiece,
          rightPiece
        ],
        otherRestrictions: []
      }
    }
  };

  // output-es/Effect.Aff.Compat/index.js
  var fromEffectFnAff = (v) => makeAff((k) => () => {
    const v1 = v((x3) => k($Either("Left", x3))(), (x3) => k($Either("Right", x3))());
    return (e) => makeAff((k2) => () => {
      v1(e, (x3) => k2($Either("Left", x3))(), (x3) => k2($Either("Right", x3))());
      return nonCanceler;
    });
  });

  // output-es/Game.Message/foreign.js
  var addOnClickEventListenerUnsafe = (id4) => (value2) => (onError, onSuccess) => {
    button = document.getElementById(id4);
    if (button == null) {
      onError("can't find element with id " + id4);
    } else {
      button.addEventListener("click", () => {
        onSuccess(value2);
      });
    }
    return function(cancelError, onCancelerError, onCancelerSuccess) {
      cancel();
      onCancelerSuccess();
    };
  };

  // output-es/Game.Message/index.js
  var bindReaderT2 = /* @__PURE__ */ bindReaderT(bindAff);
  var liftEffect = /* @__PURE__ */ (() => monadEffectReader(monadEffectAff).liftEffect)();
  var liftAff = /* @__PURE__ */ (() => monadAffReader(monadAffAff).liftAff)();
  var functorMessage = { map: (f) => (v) => ({ ...v, action: _map(f)(v.action) }) };
  var applyMessage = {
    apply: (v) => (v1) => ({
      user: (() => {
        if (v.user.tag === "Nothing") {
          return v1.user;
        }
        if (v.user.tag === "Just") {
          return $Maybe("Just", v.user._1);
        }
        fail();
      })(),
      html: [...v.html, ...v1.html],
      action: applyAff.apply(v.action)(v1.action)
    }),
    Functor0: () => functorMessage
  };
  var altMessage = {
    alt: (v) => (v1) => ({
      user: (() => {
        if (v.user.tag === "Nothing") {
          return v1.user;
        }
        if (v.user.tag === "Just") {
          return $Maybe("Just", v.user._1);
        }
        fail();
      })(),
      html: [...v.html, ...v1.html],
      action: _sequential(_parAffAlt(v.action)(v1.action))
    }),
    Functor0: () => functorMessage
  };
  var sendMessage = (v) => bindReaderT2.bind(_pure)((listener) => bindReaderT2.bind(liftEffect(listener({ user: v.user, html: v.html })))(() => liftAff(v.action)));
  var button3 = (id4) => (text) => (value2) => ({
    user: Nothing,
    html: [$VDom("Elem", Nothing, "button", [id(id4)], [$VDom("Text", text)])],
    action: fromEffectFnAff(addOnClickEventListenerUnsafe(id4)(value2))
  });

  // output-es/Resources.LevelSuites.TutorialSuite.Suite/index.js
  var bindReaderT3 = /* @__PURE__ */ bindReaderT(bindAff);
  var tutorialSuite = /* @__PURE__ */ (() => ({
    "From A to B": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: idPiece,
        title: "From A to B",
        description: "Propagate the signal inputed on the Left to the Right",
        testCases: binaryTestInputs([Left2]),
        availablePieces: [idPiece]
      },
      conversation: bindReaderT3.bind(sendMessage(altMessage.alt(button3("yes")("Y")(true))(applyMessage.apply({
        action: _map((v) => identity)(_pure()),
        html: [$VDom("Text", "/")],
        user: Nothing
      })(button3("no")("N")(false)))))((playedBefore) => bindReaderT3.bind(_pure)((listener) => {
        const $0 = _pure();
        return (v) => $0;
      }))
    },
    Negation: {
      ...defaultLevel,
      problem: {
        goal: notPiece,
        title: "Negation",
        description: "Negate the signal inputed on the Left and output it on the Right",
        testCases: binaryTestInputs([Left2]),
        requiresAutomaticTesting: false,
        availablePieces: [idPiece, notPiece],
        otherRestrictions: []
      },
      conversation: bindReaderT3.bind(sendMessage({
        user: $Maybe("Just", "mitch"),
        html: [$VDom("Text", "hello world")],
        action: _pure()
      }))(() => bindReaderT3.bind(sendMessage(button3("")("click me")(47)))((n) => monadEffectReader(monadEffectAff).liftEffect(log2("got: " + showIntImpl(n)))))
    },
    "Two enter, one leaves": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: orPiece,
        title: "Two enter, one leaves",
        description: "",
        testCases: binaryTestInputs([Left2, Up]),
        availablePieces: [idPiece, orPiece]
      }
    },
    "Take a Left": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: leftPiece,
        title: "Take a Left",
        description: "",
        testCases: binaryTestInputs([Left2]),
        availablePieces: [idPiece, orPiece]
      }
    }
  }))();

  // output-es/Game.Piece.ArithmeticPiece/index.js
  var fromFoldable11 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkSuccPiece = (capacity2) => ({
    name: "succ",
    eval: (m) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(m);
      const s = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return $$$Map(
        "Two",
        Leaf2,
        Right2,
        (() => {
          if (capacity2 === "OneBit") {
            return s === 1;
          }
          if (capacity2 === "TwoBit") {
            return s === 3;
          }
          if (capacity2 === "FourBit") {
            return s === 15;
          }
          if (capacity2 === "EightBit") {
            return s === 255;
          }
          fail();
        })() ? 0 : s + 1 | 0,
        Leaf2
      );
    },
    complexity: { space: 10, time: 0 },
    shouldRipple: false,
    updateCapacity: (v) => (capacity$p) => $Maybe("Just", mkSuccPiece(capacity$p)),
    ports: fromFoldable11([
      $Tuple(Left2, { portType: Input, capacity: capacity2 }),
      $Tuple(Right2, { portType: Output, capacity: capacity2 })
    ]),
    updatePort: (v) => (v1) => Nothing
  });
  var succPiece = /* @__PURE__ */ mkSuccPiece(TwoBit);

  // output-es/Game.Piece.TwoBitSuite/index.js
  var twoBitCrossOver = {
    name: "two-bit-cross-over",
    eval: (m) => {
      const $0 = lookup(ordCardinalDirection)(Left2)(m);
      const s = (() => {
        if ($0.tag === "Nothing") {
          return 0;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return $$$Map(
        "Two",
        Leaf2,
        Right2,
        ((s >> 0 & 1) !== 0 ? 2 : 0) + ((s >> 1 & 1) !== 0 ? 1 : 0) | 0,
        Leaf2
      );
    },
    complexity: { space: 20, time: 0 },
    shouldRipple: false,
    updateCapacity: (v) => (v1) => Nothing,
    ports: /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray)([
      /* @__PURE__ */ $Tuple(Left2, { portType: Input, capacity: TwoBit }),
      /* @__PURE__ */ $Tuple(Right2, { portType: Output, capacity: TwoBit })
    ]),
    updatePort: (v) => (v1) => Nothing
  };

  // output-es/Resources.LevelSuites.TwoBitSuite/index.js
  var twoBitSuite = {
    "From 2A to 2B": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: /* @__PURE__ */ mkWirePiece({
          capacity: TwoBit,
          outputs: /* @__PURE__ */ $$$Map("Two", Leaf2, Right2, void 0, Leaf2)
        }),
        title: "From 2A to 2B",
        description: "This looks familiar, but the input and output ports have a capacity of 2 bits! Build a path between the left and the right, then use the '2' key to increase the capacity of the path. The capacity of each port is colour coded, only ports with the same capacity can connect!",
        availablePieces: [idPiece],
        testCases: [
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 0, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 1, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 2, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 3, Leaf2)
        ]
      }
    },
    "Lovers Lake": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: fusePiece,
        title: "Lovers Lake",
        description: "Use a fuse-piece to combine the inputs from the top and left, output the result to the right",
        availablePieces: [fusePiece, idPiece],
        testCases: [
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 0, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 1, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 2, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 3, Leaf2)
        ]
      }
    },
    "Two bit criss cross": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: twoBitCrossOver,
        title: "Two bit criss cross",
        description: "Sever the input on the left with a sever-piece, cross over the signals, fuse them back together",
        availablePieces: [severPiece, fusePiece, idPiece],
        testCases: [
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 0, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 1, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 2, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 3, Leaf2)
        ]
      }
    },
    Increment: {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: succPiece,
        title: "Increment",
        description: "Add one to the two bit input signal. if the input is 3 (which has no successor), output signal 0",
        availablePieces: [xorPiece, notPiece, fusePiece, severPiece],
        testCases: [
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 0, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 1, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 2, Leaf2),
          /* @__PURE__ */ $$$Map("Two", Leaf2, Left2, 3, Leaf2)
        ]
      }
    }
  };

  // output-es/Resources.LevelSuites/index.js
  var ordRecord2 = /* @__PURE__ */ ordRecord()(/* @__PURE__ */ (() => {
    const eqRowCons2 = { eqRecord: (v) => (ra) => (rb) => ra.levelName === rb.levelName && ra.suiteName === rb.suiteName };
    return {
      compareRecord: (v) => (ra) => (rb) => {
        const left = ordString.compare(ra.levelName)(rb.levelName);
        if (left === "LT" || left === "GT" || left !== "EQ") {
          return left;
        }
        const left$1 = ordString.compare(ra.suiteName)(rb.suiteName);
        if (left$1 === "LT" || left$1 === "GT" || left$1 !== "EQ") {
          return left$1;
        }
        return EQ;
      },
      EqRecord0: () => eqRowCons2
    };
  })());
  var fromFoldable14 = /* @__PURE__ */ fromFoldable(ordRecord2)(foldableArray);
  var toUnfoldable4 = /* @__PURE__ */ (() => {
    const $0 = toArrayWithKey(Tuple);
    return (x3) => toUnfoldable2(unfoldableArray)($0(x3));
  })();
  var allLevelSuites = {
    "Tutorial Suite": tutorialSuite,
    "Intermediate Suite": intermediateSuite,
    "Two Bit Suite": twoBitSuite,
    "Shifting Suite": shiftingSuite
  };
  var getAllLevelProgress = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    const traverse22 = traversableArray.traverse(Monad0.Applicative0());
    return $0.map((x3) => mapMaybeWithKey(ordRecord2)((v) => identity9)(fromFoldable14(arrayBind(x3)(identity4))))(traverse22((v) => {
      const $1 = v._1;
      return traverse22((v1) => $0.map(Tuple({ suiteName: $1, levelName: v1._1 }))(getLevelProgress(dictMonadEffect)({ suiteName: $1, levelName: v1._1 })))(toUnfoldable4(v._2));
    })(toUnfoldable4(allLevelSuites)));
  };

  // output-es/Component.LevelSelect/index.js
  var $Action9 = (tag, _1) => ({ tag, _1 });
  var lookup4 = /* @__PURE__ */ lookup(/* @__PURE__ */ ordRecord()(/* @__PURE__ */ (() => {
    const eqRowCons2 = { eqRecord: (v) => (ra) => (rb) => ra.levelName === rb.levelName && ra.suiteName === rb.suiteName };
    return {
      compareRecord: (v) => (ra) => (rb) => {
        const left = ordString.compare(ra.levelName)(rb.levelName);
        if (left === "LT" || left === "GT" || left !== "EQ") {
          return left;
        }
        const left$1 = ordString.compare(ra.suiteName)(rb.suiteName);
        if (left$1 === "LT" || left$1 === "GT" || left$1 !== "EQ") {
          return left$1;
        }
        return EQ;
      },
      EqRecord0: () => eqRowCons2
    };
  })()));
  var toUnfoldable5 = /* @__PURE__ */ (() => {
    const $0 = toArrayWithKey(Tuple);
    return (x3) => toUnfoldable2(unfoldableArray)($0(x3));
  })();
  var foldMap2 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidMaybe(semigroupLevelProgress)))();
  var getAllLevelProgress2 = /* @__PURE__ */ getAllLevelProgress(monadEffectEffect);
  var show6 = /* @__PURE__ */ (() => showMap({
    show: (record) => "{ levelName: " + showStringImpl(record.levelName) + ", suiteName: " + showStringImpl(record.suiteName) + " }"
  })(showLevelProgress).show)();
  var modify_6 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var Initialise5 = /* @__PURE__ */ $Action9("Initialise");
  var component10 = (dictMonadAff) => {
    const monadEffectHalogenM2 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      eval: mkEval({
        ...defaultEval,
        handleAction: (v1) => {
          if (v1.tag === "Initialise") {
            const $0 = monadEffectHalogenM2.liftEffect(getAllLevelProgress2);
            return $Free(
              $0._1,
              snoc($0._2)((progress) => {
                const $1 = monadEffectHalogenM2.liftEffect(log2(show6(progress)));
                return $Free($1._1, snoc($1._2)(() => modify_6((v2) => ({ ...v2, levelProgress: progress }))));
              })
            );
          }
          if (v1.tag === "NavigateTo") {
            const $0 = v1._1;
            const $1 = saveLevelProgress(monadEffectHalogenM2)($0)(Incomplete);
            return $Free(
              $1._1,
              snoc($1._2)(() => navigateTo(monadEffectHalogenM2)($Route("Level", $0.suiteName, $0.levelName)))
            );
          }
          fail();
        },
        initialize: $Maybe("Just", Initialise5)
      }),
      initialState: (v) => ({ levelProgress: Leaf2 }),
      render: (state) => defaultLayout($VDom(
        "Elem",
        Nothing,
        "div",
        [id("puzzle-select-component")],
        [
          $VDom("Elem", Nothing, "h1", [], [$VDom("Text", "Level Select")]),
          $VDom(
            "Elem",
            Nothing,
            "div",
            [],
            arrayBind(toUnfoldable5(allLevelSuites))((v) => {
              const $0 = v._1;
              return [
                $VDom(
                  "Elem",
                  Nothing,
                  "h2",
                  [],
                  [
                    $VDom("Text", $0),
                    (() => {
                      const $1 = foldMap2((levelName) => lookup4({ suiteName: $0, levelName })(state.levelProgress))(Object.keys(v._2));
                      if ($1.tag === "Just") {
                        if ($1._1 === "Completed") {
                          return $VDom(
                            "Elem",
                            Nothing,
                            "span",
                            [$Prop("Attribute", Nothing, "data-puzzle-progress", "completed")],
                            [$VDom("Text", "  \u2714")]
                          );
                        }
                        if ($1._1 === "Incomplete") {
                          return $VDom(
                            "Elem",
                            Nothing,
                            "span",
                            [$Prop("Attribute", Nothing, "data-puzzle-progress", "incomplete")],
                            [$VDom("Text", " \u2736")]
                          );
                        }
                        fail();
                      }
                      if ($1.tag === "Nothing") {
                        return $VDom("Text", "");
                      }
                      fail();
                    })()
                  ]
                ),
                $VDom(
                  "Elem",
                  Nothing,
                  "ul",
                  [],
                  arrayBind(toUnfoldable5(v._2))((v1) => {
                    const $1 = v1._1;
                    return [
                      $VDom(
                        "Elem",
                        Nothing,
                        "li",
                        [],
                        [
                          $VDom(
                            "Elem",
                            Nothing,
                            "a",
                            [
                              $Prop(
                                "Handler",
                                "click",
                                (ev) => $Maybe("Just", $Input("Action", $Action9("NavigateTo", { suiteName: $0, levelName: $1 })))
                              )
                            ],
                            [
                              $VDom("Text", $1),
                              (() => {
                                const $2 = lookup4({ suiteName: $0, levelName: $1 })(state.levelProgress);
                                if ($2.tag === "Just") {
                                  if ($2._1 === "Completed") {
                                    return $VDom(
                                      "Elem",
                                      Nothing,
                                      "span",
                                      [$Prop("Attribute", Nothing, "data-puzzle-progress", "completed")],
                                      [$VDom("Text", "  \u2714")]
                                    );
                                  }
                                  if ($2._1 === "Incomplete") {
                                    return $VDom(
                                      "Elem",
                                      Nothing,
                                      "span",
                                      [$Prop("Attribute", Nothing, "data-puzzle-progress", "incomplete")],
                                      [$VDom("Text", " \u2736")]
                                    );
                                  }
                                  fail();
                                }
                                if ($2.tag === "Nothing") {
                                  return $VDom("Text", "");
                                }
                                fail();
                              })()
                            ]
                          )
                        ]
                      )
                    ];
                  })
                )
              ];
            })
          )
        ]
      ))
    };
  };

  // output-es/Component.Routes/index.js
  var $Query4 = (_1, _2) => ({ tag: "Navigate", _1, _2 });
  var slot_1 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "home" })(ordUnit);
  var slot_22 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "about" })(ordUnit);
  var slot_3 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "instructions" })(ordUnit);
  var slot_4 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "levelSelect" })(ordUnit);
  var slot_5 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "level" })(ordUnit);
  var $$get = /* @__PURE__ */ $Free(
    /* @__PURE__ */ $FreeView(
      "Bind",
      /* @__PURE__ */ $HalogenF("State", (s) => $Tuple(s, s)),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var modify_7 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x3) => $Free($FreeView("Return", x3), CatNil)
    ),
    CatNil
  );
  var component11 = (dictMonadAff) => {
    const component1 = component2(dictMonadAff);
    const component22 = component(dictMonadAff);
    const component32 = component3(dictMonadAff);
    const component42 = component10(dictMonadAff);
    const component52 = component9(dictMonadAff);
    const lift1 = monadTransHalogenM.lift(dictMonadAff.MonadEffect0().Monad0());
    return (dictMonadAsk) => {
      const component62 = component52(dictMonadAsk);
      return (dictMonadLogger) => {
        const component72 = component62(dictMonadLogger);
        const debug2 = log$p(dictMonadLogger)(Debug);
        return {
          eval: mkEval({
            finalize: Nothing,
            handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
            handleQuery: (v) => {
              const $0 = v._2;
              const $1 = v._1;
              return $Free(
                $$get._1,
                snoc($$get._2)((v1) => {
                  const $2 = lift1(debug2(Leaf2)("Navigated to " + printPath(routeCodec._1($1)(emptyRouteState))));
                  const $3 = snoc($2._2)(() => modify_7((v2) => ({ ...v2, route: $1 })));
                  if ((() => {
                    if (v1.route.tag === "Home") {
                      return $1.tag !== "Home";
                    }
                    if (v1.route.tag === "About") {
                      return $1.tag !== "About";
                    }
                    if (v1.route.tag === "Instructions") {
                      return $1.tag !== "Instructions";
                    }
                    if (v1.route.tag === "LevelSelect") {
                      return $1.tag !== "LevelSelect";
                    }
                    return !(v1.route.tag === "Level" && $1.tag === "Level" && v1.route._1 === $1._1 && v1.route._2 === $1._2);
                  })()) {
                    return $Free(
                      $2._1,
                      snoc($3)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
                    );
                  }
                  return $Free(
                    $FreeView("Return", void 0),
                    snoc(CatNil)(() => $Free(
                      $FreeView("Return", $Maybe("Just", $0)),
                      CatNil
                    ))
                  );
                })
              );
            },
            initialize: Nothing,
            receive: (v) => Nothing
          }),
          initialState: (v) => ({ route: Home }),
          render: (v) => {
            if (v.route.tag === "Home") {
              return slot_1($$Proxy)()(component1)();
            }
            if (v.route.tag === "About") {
              return slot_22($$Proxy)()(component22)();
            }
            if (v.route.tag === "Instructions") {
              return slot_3($$Proxy)()(component32)();
            }
            if (v.route.tag === "LevelSelect") {
              return slot_4($$Proxy)()(component42)();
            }
            if (v.route.tag === "Level") {
              const $0 = _lookup(Nothing, Just, v.route._1, allLevelSuites);
              if ($0.tag === "Just") {
                const $1 = _lookup(Nothing, Just, v.route._2, $0._1);
                if ($1.tag === "Just") {
                  return slot_5($$Proxy)()(component72)({ levelId: { suiteName: v.route._1, levelName: v.route._2 }, level: $1._1 });
                }
                if ($1.tag === "Nothing") {
                  return $VDom("Text", "coublent find tht roblem");
                }
                fail();
              }
              if ($0.tag === "Nothing") {
                return $VDom("Text", "coublent find tht roblem");
              }
            }
            fail();
          }
        };
      };
    };
  };

  // output-es/Web.HTML.HTMLDocument.ReadyState/index.js
  var $ReadyState = (tag) => tag;
  var Loading = /* @__PURE__ */ $ReadyState("Loading");
  var Interactive = /* @__PURE__ */ $ReadyState("Interactive");
  var Complete = /* @__PURE__ */ $ReadyState("Complete");
  var parse4 = (v) => {
    if (v === "loading") {
      return $Maybe("Just", Loading);
    }
    if (v === "interactive") {
      return $Maybe("Just", Interactive);
    }
    if (v === "complete") {
      return $Maybe("Just", Complete);
    }
    return Nothing;
  };

  // output-es/Web.HTML.HTMLDocument/foreign.js
  function _readyState(doc) {
    return doc.readyState;
  }

  // output-es/Web.HTML.HTMLDocument/index.js
  var readyState = (doc) => () => {
    const a$p = _readyState(doc);
    const $0 = parse4(a$p);
    if ($0.tag === "Nothing") {
      return Loading;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Halogen.Aff.Util/index.js
  var selectElement = (query2) => _bind(_liftEffect((() => {
    const $0 = querySelector(query2);
    return () => {
      const $1 = windowImpl();
      const $2 = document2($1)();
      return $0($2)();
    };
  })()))((mel) => _pure((() => {
    if (mel.tag === "Just") {
      return _read(Nothing, Just, mel._1);
    }
    if (mel.tag === "Nothing") {
      return Nothing;
    }
    fail();
  })()));
  var runHalogenAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var awaitLoad = /* @__PURE__ */ makeAff((callback) => () => {
    const $0 = windowImpl();
    const $1 = document2($0)();
    const rs = readyState($1)();
    if (rs === "Loading") {
      const et = windowImpl();
      const listener = eventListener((v) => callback($Either("Right", void 0)))();
      addEventListener2("DOMContentLoaded")(listener)(false)(et)();
      const $2 = _liftEffect(removeEventListener2("DOMContentLoaded")(listener)(false)(et));
      return (v) => $2;
    }
    callback($Either("Right", void 0))();
    return nonCanceler;
  });

  // output-es/Data.Coyoneda/index.js
  var $CoyonedaF = (_1, _2) => ({ tag: "CoyonedaF", _1, _2 });

  // output-es/Effect.Ref/foreign.js
  var modifyImpl2 = function(f) {
    return function(ref) {
      return function() {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  // output-es/Halogen.Query.HalogenQ/index.js
  var $HalogenQ = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Halogen.Aff.Driver.Eval/index.js
  var traverse_11 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableList);
  var parSequence_ = /* @__PURE__ */ parTraverse_(parallelAff)(foldableList)(identity3);
  var traverse_32 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var unsubscribe2 = (sid) => (ref) => () => {
    const v = ref.value;
    const subs = v.subscriptions.value;
    return traverse_11(unsubscribe)((() => {
      const $0 = lookup(ordInt)(sid);
      if (subs.tag === "Just") {
        return $0(subs._1);
      }
      if (subs.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })())();
  };
  var queueOrRun = (ref) => (au) => _bind(_liftEffect(() => ref.value))((v) => {
    if (v.tag === "Nothing") {
      return au;
    }
    if (v.tag === "Just") {
      return _liftEffect(() => ref.value = $Maybe("Just", $List("Cons", au, v._1)));
    }
    fail();
  });
  var handleLifecycle = (lchs) => (f) => _bind(_liftEffect(() => lchs.value = { initializers: Nil, finalizers: Nil }))(() => _bind(_liftEffect(f))((result) => _bind(_liftEffect(() => lchs.value))((v) => {
    const $0 = v.initializers;
    return _bind(traverse_23(forkAff)(v.finalizers))(() => _bind(parSequence_($0))(() => _pure(result)));
  })));
  var handleAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var fresh = (f) => (ref) => _bind(_liftEffect(() => ref.value))((v) => _liftEffect(modifyImpl2((i) => ({ state: i + 1 | 0, value: f(i) }))(v.fresh)));
  var evalQ = (render) => (ref) => (q) => _bind(_liftEffect(() => ref.value))((v) => evalM(render)(ref)(v.component.eval($HalogenQ(
    "Query",
    $CoyonedaF((x3) => $Maybe("Just", x3), q),
    (v$1) => Nothing
  ))));
  var evalM = (render) => (initRef) => (v) => foldFree2((v1) => {
    if (v1.tag === "State") {
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const v3 = v1._1(v2.state);
        if (reallyUnsafeRefEq(v2.state)(v3._2)) {
          return _pure(v3._1);
        }
        const $0 = v3._1;
        return _bind(_liftEffect((() => {
          const $1 = { ...v2, state: v3._2 };
          return () => initRef.value = $1;
        })()))(() => _bind(handleLifecycle(v2.lifecycleHandlers)(render(v2.lifecycleHandlers)(initRef)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Subscribe") {
      return _bind(fresh(SubscriptionId)(initRef))((sid) => _bind(_liftEffect(v1._1(sid)((x3) => {
        const $0 = handleAff(evalF(render)(initRef)($Input("Action", x3)));
        return () => {
          $0();
        };
      })))((finalize) => _bind(_liftEffect(() => initRef.value))((v2) => _bind(_liftEffect((() => {
        const $0 = functorMaybe.map(insert(ordInt)(sid)(finalize));
        const $1 = v2.subscriptions;
        return () => {
          const $2 = $1.value;
          $1.value = $0($2);
        };
      })()))(() => _pure(v1._2(sid))))));
    }
    if (v1.tag === "Unsubscribe") {
      const $0 = v1._2;
      return _bind(_liftEffect(unsubscribe2(v1._1)(initRef)))(() => _pure($0));
    }
    if (v1.tag === "Lift") {
      return v1._1;
    }
    if (v1.tag === "ChildQuery") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v1$1) => {
        const $1 = $0._2;
        return _map($0._3)(_sequential($0._1(applicativeParAff)((v3) => _bind(_liftEffect(() => v3.value))((dsx) => evalQ(render)(dsx.selfRef)($1)))(v1$1.children)));
      });
    }
    if (v1.tag === "Raise") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.handlerRef;
        const $3 = v2.pendingOuts;
        return _bind(_liftEffect(() => $2.value))((handler) => _bind(queueOrRun($3)(handler($1)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Par") {
      return _sequential(foldFreeAp(applicativeParAff)(identity10)((() => {
        const $0 = evalM(render)(initRef);
        return foldFreeAp(applicativeFreeAp)((x3) => $FreeAp("Lift", $0(x3)))(v1._1);
      })()));
    }
    if (v1.tag === "Fork") {
      const $0 = v1._1;
      return _bind(fresh(ForkId)(initRef))((fid) => _bind(_liftEffect(() => initRef.value))((v2) => {
        const $1 = v2.forks;
        return _bind(_liftEffect(() => ({ value: false })))((doneRef) => _bind(forkAff($$finally(_liftEffect(() => {
          const $2 = $1.value;
          $1.value = $$delete(ordInt)(fid)($2);
          return doneRef.value = true;
        }))(evalM(render)(initRef)($0))))((fiber) => _bind(_liftEffect((() => {
          const $2 = insert(ordInt)(fid)(fiber);
          return () => {
            const b = doneRef.value;
            if (!b) {
              const $3 = $1.value;
              $1.value = $2($3);
              return;
            }
            if (b) {
              return;
            }
            fail();
          };
        })()))(() => _pure(v1._2(fid)))));
      }));
    }
    if (v1.tag === "Join") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(joinFiber)(lookup(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Kill") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(killFiber(error("Cancelled")))(lookup(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "GetRef") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => _pure(v1._2(lookup(ordString)($0)(v2.refs))));
    }
    fail();
  })(v);
  var evalF = (render) => (ref) => (v) => {
    if (v.tag === "RefUpdate") {
      const $0 = v._2;
      const $1 = v._1;
      return _liftEffect(() => {
        const $2 = ref.value;
        ref.value = { ...$2, refs: alter(ordString)((v$1) => $0)($1)($2.refs) };
      });
    }
    if (v.tag === "Action") {
      const $0 = v._1;
      return _bind(_liftEffect(() => ref.value))((v1) => evalM(render)(ref)(v1.component.eval($HalogenQ("Action", $0, void 0))));
    }
    fail();
  };

  // output-es/Halogen.Aff.Driver.State/index.js
  var initDriverState = (component13) => (input) => (handler) => (lchs) => () => {
    const selfRef = { value: {} };
    const childrenIn = { value: Leaf2 };
    const childrenOut = { value: Leaf2 };
    const handlerRef = { value: handler };
    const pendingQueries = { value: $Maybe("Just", Nil) };
    const pendingOuts = { value: $Maybe("Just", Nil) };
    const pendingHandlers = { value: Nothing };
    const fresh2 = { value: 1 };
    const subscriptions = { value: $Maybe("Just", Leaf2) };
    const forks = { value: Leaf2 };
    selfRef.value = {
      component: component13,
      state: component13.initialState(input),
      refs: Leaf2,
      children: Leaf2,
      childrenIn,
      childrenOut,
      selfRef,
      handlerRef,
      pendingQueries,
      pendingOuts,
      pendingHandlers,
      rendering: Nothing,
      fresh: fresh2,
      subscriptions,
      forks,
      lifecycleHandlers: lchs
    };
    return selfRef;
  };

  // output-es/Halogen.Aff.Driver/index.js
  var for_7 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_14 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var traverse_15 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_24 = /* @__PURE__ */ traverse_15(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_15(foldableMap);
  var parSequence_2 = /* @__PURE__ */ parTraverse_(parallelAff)(foldableList)(identity3);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_ = /* @__PURE__ */ (() => {
    const traverse_$1 = traverse_(applicativeEffect)(foldableMaybe);
    return (f) => (st) => traverse_$1(f)(st.rendering);
  })();
  var newLifecycleHandlers = () => ({ value: { initializers: Nil, finalizers: Nil } });
  var handlePending = (ref) => () => {
    const queue = ref.value;
    ref.value = Nothing;
    return for_7(queue)((() => {
      const $0 = traverse_14(forkAff);
      return (x3) => handleAff($0(reverse(x3)));
    })())();
  };
  var cleanupSubscriptionsAndForks = (v) => {
    const $0 = traverse_24(traverse_33(unsubscribe));
    const $1 = v.subscriptions;
    return () => {
      const $2 = $1.value;
      $0($2)();
      v.subscriptions.value = Nothing;
      const $3 = v.forks.value;
      traverse_33((() => {
        const $4 = killFiber(error("finalized"));
        return (x3) => handleAff($4(x3));
      })())($3)();
      return v.forks.value = Leaf2;
    };
  };
  var runUI = (renderSpec2) => (component13) => (i) => {
    const squashChildInitializers = (lchs) => (preInits) => (st) => {
      const parentInitializer = evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Initialize", void 0)));
      return () => {
        const $0 = lchs.value;
        lchs.value = {
          initializers: $List(
            "Cons",
            _bind(parSequence_2(reverse($0.initializers)))(() => _bind(parentInitializer)(() => _liftEffect((() => {
              const $1 = handlePending(st.pendingQueries);
              return () => {
                $1();
                return handlePending(st.pendingOuts)();
              };
            })()))),
            preInits
          ),
          finalizers: $0.finalizers
        };
      };
    };
    const runComponent = (lchs) => (handler) => (j) => (c) => () => {
      const lchs$p = newLifecycleHandlers();
      const $$var = initDriverState(c)(j)(handler)(lchs$p)();
      const pre = lchs.value;
      lchs.value = { initializers: Nil, finalizers: pre.finalizers };
      const $0 = $$var.value;
      render(lchs)($0.selfRef)();
      const $1 = $$var.value;
      squashChildInitializers(lchs)(pre.initializers)($1)();
      return $$var;
    };
    const renderChild = (lchs) => (handler) => (childrenInRef) => (childrenOutRef) => (slot3) => () => {
      const a$p = childrenInRef.value;
      const childrenIn = slot3.pop(a$p);
      const $$var = (() => {
        if (childrenIn.tag === "Just") {
          childrenInRef.value = childrenIn._1._2;
          const dsx = childrenIn._1._1.value;
          const $02 = _pure();
          dsx.handlerRef.value = (x3) => {
            const $12 = slot3.output(x3);
            if ($12.tag === "Nothing") {
              return $02;
            }
            if ($12.tag === "Just") {
              return handler($12._1);
            }
            fail();
          };
          handleAff(evalM(render)(dsx.selfRef)(dsx.component.eval($HalogenQ(
            "Receive",
            slot3.input,
            void 0
          ))))();
          return childrenIn._1._1;
        }
        if (childrenIn.tag === "Nothing") {
          return runComponent(lchs)((() => {
            const $02 = _pure();
            return (x3) => {
              const $12 = slot3.output(x3);
              if ($12.tag === "Nothing") {
                return $02;
              }
              if ($12.tag === "Just") {
                return handler($12._1);
              }
              fail();
            };
          })())(slot3.input)(slot3.component)();
        }
        fail();
      })();
      const a$p$1 = childrenOutRef.value;
      const $0 = warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur");
      if ((() => {
        const $12 = slot3.get(a$p$1);
        if ($12.tag === "Nothing") {
          return false;
        }
        if ($12.tag === "Just") {
          return true;
        }
        fail();
      })()) {
        $0();
      }
      const $1 = childrenOutRef.value;
      childrenOutRef.value = slot3.set($$var)($1);
      const $2 = $$var.value;
      if ($2.rendering.tag === "Nothing") {
        return throwException(error("Halogen internal error: child was not initialized in renderChild"))();
      }
      if ($2.rendering.tag === "Just") {
        return renderSpec2.renderChild($2.rendering._1);
      }
      fail();
    };
    const render = (lchs) => ($$var) => () => {
      const v = $$var.value;
      const a$p = v.pendingHandlers.value;
      const shouldProcessHandlers = (() => {
        if (a$p.tag === "Nothing") {
          return true;
        }
        if (a$p.tag === "Just") {
          return false;
        }
        fail();
      })();
      if (shouldProcessHandlers) {
        v.pendingHandlers.value = $Maybe("Just", Nil);
      }
      v.childrenOut.value = Leaf2;
      v.childrenIn.value = v.children;
      const $0 = v.pendingHandlers;
      const rendering = renderSpec2.render((() => {
        const $12 = _map((v$1) => {
        });
        return (x3) => handleAff(queueOrRun($0)($12(evalF(render)(v.selfRef)(x3))));
      })())(renderChild(lchs)((() => {
        const $12 = _map((v$1) => {
        });
        return (x3) => queueOrRun(v.pendingQueries)(queueOrRun($0)($12(evalF(render)(v.selfRef)($Input(
          "Action",
          x3
        )))));
      })())(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
      const children2 = v.childrenOut.value;
      const childrenIn = v.childrenIn.value;
      foreachSlot2(childrenIn)((v1) => () => {
        const childDS = v1.value;
        renderStateX_(renderSpec2.removeChild)(childDS)();
        return finalize(lchs)(childDS)();
      })();
      const $1 = v.selfRef.value;
      v.selfRef.value = { ...$1, rendering: $Maybe("Just", rendering), children: children2 };
      const $2 = monadRecEffect.tailRecM((v1) => () => {
        const handlers = $0.value;
        $0.value = $Maybe("Just", Nil);
        traverse_24((() => {
          const $22 = traverse_14(forkAff);
          return (x3) => handleAff($22(reverse(x3)));
        })())(handlers)();
        const mmore = $0.value;
        if ((() => {
          if (mmore.tag === "Nothing") {
            return false;
          }
          if (mmore.tag === "Just") {
            return mmore._1.tag === "Nil";
          }
          fail();
        })()) {
          $0.value = Nothing;
          return $Step("Done", void 0);
        }
        return $Step("Loop", void 0);
      })();
      if (shouldProcessHandlers) {
        return $2();
      }
    };
    const finalize = (lchs) => (st) => {
      const $0 = cleanupSubscriptionsAndForks(st);
      return () => {
        $0();
        const $1 = lchs.value;
        lchs.value = {
          initializers: $1.initializers,
          finalizers: $List(
            "Cons",
            evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Finalize", void 0))),
            $1.finalizers
          )
        };
        return foreachSlot2(st.children)((v) => () => {
          const dsx = v.value;
          return finalize(lchs)(dsx)();
        })();
      };
    };
    return _bind(_liftEffect(newLifecycleHandlers))((lchs) => _bind(_liftEffect(() => ({ value: false })))((disposed) => handleLifecycle(lchs)(() => {
      const sio = create();
      const $0 = runComponent(lchs)((x3) => _liftEffect(sio.listener(x3)))(i)(component13)();
      const dsx = $0.value;
      return {
        query: (() => {
          const $1 = dsx.selfRef;
          return (q) => _bind(_liftEffect(() => disposed.value))((v) => {
            if (v) {
              return _pure(Nothing);
            }
            return evalQ(render)($1)(q);
          });
        })(),
        messages: sio.emitter,
        dispose: handleLifecycle(lchs)(() => {
          const v = disposed.value;
          if (v) {
            return;
          }
          disposed.value = true;
          finalize(lchs)(dsx)();
          const v2 = dsx.selfRef.value;
          return for_7(v2.rendering)(renderSpec2.dispose)();
        })
      };
    })));
  };

  // output-es/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
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

  // output-es/Halogen.VDom.Driver/index.js
  var traverse_16 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var identity18 = (x3) => x3;
  var substInParent = (v) => (v1) => (v2) => {
    if (v2.tag === "Just") {
      if (v1.tag === "Just") {
        const $0 = insertBefore(v)(v1._1)(v2._1);
        return () => {
          $0();
        };
      }
      if (v1.tag === "Nothing") {
        const $0 = appendChild(v)(v2._1);
        return () => {
          $0();
        };
      }
    }
    return () => {
    };
  };
  var removeChild3 = (v) => {
    const $0 = v.node;
    const $1 = _parentNode($0);
    return () => {
      const a$p = $1();
      return traverse_16((pn) => removeChild2($0)(pn))(nullable(a$p, Nothing, Just))();
    };
  };
  var mkSpec = (handler) => (renderChildRef) => (document3) => ({
    buildWidget: (spec) => {
      const buildThunk2 = buildThunk(unsafeCoerce)(spec);
      const renderComponentSlot = (cs) => {
        const renderChild = renderChildRef.value;
        const rsx = renderChild(cs)();
        return $Step$p(
          rsx.node,
          Nothing,
          patch,
          (st) => {
            if (st.tag === "Just") {
              const $0 = st._1;
              return halt($0);
            }
          }
        );
      };
      const render = (slot3) => {
        if (slot3.tag === "ComponentSlot") {
          const $0 = slot3._1;
          return renderComponentSlot($0);
        }
        if (slot3.tag === "ThunkSlot") {
          const $0 = slot3._1;
          const step2 = buildThunk2($0);
          return $Step$p(
            step2._1,
            $Maybe("Just", step2),
            patch,
            (st) => {
              if (st.tag === "Just") {
                const $1 = st._1;
                return halt($1);
              }
            }
          );
        }
        fail();
      };
      const patch = (st, slot3) => {
        if (st.tag === "Just") {
          if (slot3.tag === "ComponentSlot") {
            const $0 = slot3._1;
            halt(st._1);
            return renderComponentSlot($0);
          }
          if (slot3.tag === "ThunkSlot") {
            const $0 = slot3._1;
            const step$p = step(st._1, $0);
            return $Step$p(
              step$p._1,
              $Maybe("Just", step$p),
              patch,
              (st$1) => {
                if (st$1.tag === "Just") {
                  const $1 = st$1._1;
                  return halt($1);
                }
              }
            );
          }
          fail();
        }
        return render(slot3);
      };
      return render;
    },
    buildAttributes: buildProp(handler),
    document: document3
  });
  var renderSpec = (document3) => (container) => ({
    render: (handler) => (child) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return () => {
          const renderChildRef = { value: child };
          const machine = buildVDom(mkSpec(handler)(renderChildRef)(document3))(v);
          appendChild(machine._1)(container)();
          return { machine, node: machine._1, renderChildRef };
        };
      }
      if (v1.tag === "Just") {
        const $0 = v1._1.machine;
        const $1 = v1._1.node;
        const $2 = v1._1.renderChildRef;
        return () => {
          $2.value = child;
          const a$p = _parentNode($1)();
          const a$p$1 = _nextSibling($1)();
          const machine$p = step($0, v);
          const $3 = substInParent(machine$p._1)(nullable(a$p$1, Nothing, Just))(nullable(
            a$p,
            Nothing,
            Just
          ));
          if (!reallyUnsafeRefEq($1)(machine$p._1)) {
            $3();
          }
          return { machine: machine$p, node: machine$p._1, renderChildRef: $2 };
        };
      }
      fail();
    },
    renderChild: identity18,
    removeChild: removeChild3,
    dispose: removeChild3
  });
  var runUI2 = (component13) => (i) => (element) => _bind(_liftEffect(() => {
    const $0 = windowImpl();
    return document2($0)();
  }))((document3) => runUI(renderSpec(document3)(element))(component13)(i));

  // output-es/Main/index.js
  var component12 = /* @__PURE__ */ component11(monadAffAppM)(monadAskGlobalStateAppM)(monadLoggerAppM);
  var rootElement = /* @__PURE__ */ _bind(/* @__PURE__ */ selectElement("#abed"))(/* @__PURE__ */ (() => {
    const $0 = _throwError(error("Could not find element #abed"));
    return (v2) => {
      if (v2.tag === "Nothing") {
        return $0;
      }
      if (v2.tag === "Just") {
        return _pure(v2._1);
      }
      fail();
    };
  })());
  var initialiseRouting = (onNewRoute) => {
    const $0 = matchesWith(foldableEither)(parse2(routeCodec))((old) => ($$new) => {
      const $02 = onNewRoute($$new);
      if (old.tag === "Nothing" || !(old.tag === "Just" && (() => {
        if (old._1.tag === "Home") {
          return $$new.tag === "Home";
        }
        if (old._1.tag === "About") {
          return $$new.tag === "About";
        }
        if (old._1.tag === "Instructions") {
          return $$new.tag === "Instructions";
        }
        if (old._1.tag === "LevelSelect") {
          return $$new.tag === "LevelSelect";
        }
        return old._1.tag === "Level" && $$new.tag === "Level" && old._1._1 === $$new._1 && old._1._2 === $$new._2;
      })())) {
        return $02;
      }
      return () => {
      };
    });
    return () => {
      $0();
    };
  };
  var main = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ _bind(/* @__PURE__ */ (() => {
    const monadEffectLoggerT1 = monadEffectLoggerT(monadEffectAff);
    return log$p({ log: (message2) => (v) => v(message2), MonadEffect0: () => monadEffectLoggerT1 })(Info)(Leaf2)("Starting ABED")(logMessage(monadEffectAff)(Info));
  })())(() => _bind(awaitLoad)(() => _bind(runAppM(component12))((rootComponent) => _bind(_bind(rootElement)(runUI2(rootComponent)()))((v) => _liftEffect(initialiseRouting((route) => runHalogenAff(v.query($Query4(
    route,
    void 0
  ))))))))));

  // <stdin>
  main();
})();
