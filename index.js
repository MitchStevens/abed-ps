(() => {
  // output-es/runtime.js
  function binding(init) {
    let state = 0;
    let value3;
    return () => {
      if (state === 2) {
        return value3;
      }
      if (state === 1) {
        throw new Error("Binding demanded before initialized");
      }
      state = 1;
      value3 = init();
      state = 2;
      return value3;
    };
  }
  function fail() {
    throw new Error("Failed pattern match");
  }
  function intDiv(x2, y2) {
    if (y2 > 0)
      return Math.floor(x2 / y2);
    if (y2 < 0)
      return -Math.floor(x2 / -y2);
    return 0;
  }

  // output-es/Control.Monad.Logger.Trans/index.js
  var bindLoggerT = (dictMonad) => ({ bind: (v) => (f) => (l) => dictMonad.Bind1().bind(v(l))((x2) => f(x2)(l)), Apply0: () => applyLoggerT(dictMonad) });
  var applyLoggerT = (dictMonad) => {
    const $0 = dictMonad.Bind1().Apply0().Functor0();
    const functorLoggerT1 = {
      map: (x2) => {
        const $1 = $0.map(x2);
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
    pure: (x2) => {
      const $0 = dictMonad.Applicative0().pure(x2);
      return (v) => $0;
    },
    Apply0: () => applyLoggerT(dictMonad)
  });
  var monadEffectLoggerT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadLoggerT1 = { Applicative0: () => applicativeLoggerT(Monad0), Bind1: () => bindLoggerT(Monad0) };
    return {
      liftEffect: (x2) => {
        const $0 = dictMonadEffect.liftEffect(x2);
        return (v) => $0;
      },
      Monad0: () => monadLoggerT1
    };
  };
  var monadAffLoggerT = (dictMonadAff) => {
    const monadEffectLoggerT1 = monadEffectLoggerT(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => {
        const $0 = dictMonadAff.liftAff(x2);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectLoggerT1
    };
  };

  // output-es/Control.Monad.Reader.Trans/index.js
  var withReaderT = (f) => (v) => (x2) => v(f(x2));
  var bindReaderT = (dictBind) => {
    const $0 = dictBind.Apply0();
    const $1 = $0.Functor0();
    const applyReaderT1 = (() => {
      const functorReaderT1 = {
        map: (x2) => {
          const $2 = $1.map(x2);
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
        map: (x2) => {
          const $3 = $2.map(x2);
          return (v) => (x$1) => $3(v(x$1));
        }
      };
      const applyReaderT1 = { apply: (v) => (v1) => (r) => $1.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
      return {
        pure: (x2) => {
          const $3 = $0.pure(x2);
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
      liftEffect: (x2) => {
        const $0 = dictMonadEffect.liftEffect(x2);
        return (v) => $0;
      },
      Monad0: () => monadReaderT1
    };
  };
  var monadStateReaderT = (dictMonadState) => {
    const monadReaderT1 = monadReaderT(dictMonadState.Monad0());
    return {
      state: (x2) => {
        const $0 = dictMonadState.state(x2);
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
    eq: (x2) => (y2) => {
      if (x2 === "Trace") {
        return y2 === "Trace";
      }
      if (x2 === "Debug") {
        return y2 === "Debug";
      }
      if (x2 === "Info") {
        return y2 === "Info";
      }
      if (x2 === "Warn") {
        return y2 === "Warn";
      }
      return x2 === "Error" && y2 === "Error";
    }
  };
  var ordLogLevel = {
    compare: (x2) => (y2) => {
      if (x2 === "Trace") {
        if (y2 === "Trace") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Trace") {
        return GT;
      }
      if (x2 === "Debug") {
        if (y2 === "Debug") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Debug") {
        return GT;
      }
      if (x2 === "Info") {
        if (y2 === "Info") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Info") {
        return GT;
      }
      if (x2 === "Warn") {
        if (y2 === "Warn") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Warn") {
        return GT;
      }
      if (x2 === "Error" && y2 === "Error") {
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
    return function(value3) {
      return function(rec) {
        var copy = {};
        for (var key2 in rec) {
          if ({}.hasOwnProperty.call(rec, key2)) {
            copy[key2] = rec[key2];
          }
        }
        copy[label] = value3;
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
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
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
  var $Sum = (tag, _1) => ({ tag, _1 });
  var Inl = (value0) => $Sum("Inl", value0);
  var Inr = (value0) => $Sum("Inr", value0);
  var NoArguments = /* @__PURE__ */ $NoArguments();
  var Constructor = (x2) => x2;
  var Argument = (x2) => x2;

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
    return (a) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a))((x2) => Monad0.Applicative0().pure($Either("Left", x2)));
  };

  // output-es/Data.Function/index.js
  var $$const = (a) => (v) => a;
  var applyFlipped = (x2) => (f) => f(x2);
  var apply = (f) => (x2) => f(x2);

  // output-es/Control.Semigroupoid/index.js
  var semigroupoidFn = { compose: (f) => (g) => (x2) => f(g(x2)) };

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
  var identity = (x2) => x2;
  var applyFn = { apply: (f) => (g) => (x2) => f(x2)(g(x2)), Functor0: () => functorFn };
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
  var identity2 = (x2) => x2;
  var traverse_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldable) => (f) => dictFoldable.foldr((x2) => {
      const $1 = f(x2);
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
    return (x2) => $0(x2).elem;
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
      return (f) => foldableArray.foldr((x2) => (acc) => dictMonoid.Semigroup0().append(f(x2))(acc))(mempty);
    }
  };
  var lookup = (dictFoldable) => {
    const foldMap22 = dictFoldable.foldMap(monoidFirst);
    return (dictEq) => (a) => foldMap22((v) => {
      if (dictEq.eq(a)(v._1)) {
        return $Maybe("Just", v._2);
      }
      return Nothing;
    });
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
  var identity3 = (x2) => x2;
  var parTraverse_ = (dictParallel) => (dictApplicative) => {
    const traverse_17 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const traverse_18 = traverse_17(dictFoldable);
      return (f) => {
        const $0 = traverse_18((x2) => dictParallel.parallel(f(x2)));
        return (x2) => dictParallel.sequential($0(x2));
      };
    };
  };

  // output-es/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output-es/Unsafe.Coerce/foreign.js
  var unsafeCoerce = function(x2) {
    return x2;
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
      var size4 = 0;
      var ix4 = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk4;
        draining = true;
        while (size4 !== 0) {
          size4--;
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
          if (size4 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix4 + size4) % limit] = cb;
          size4++;
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
      var step4 = aff;
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
                step4 = bhead(step4);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail3 = util2.left(e);
                step4 = null;
              }
              break;
            case STEP_RESULT:
              if (util2.isLeft(step4)) {
                status = RETURN;
                fail3 = step4;
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
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail3 = util2.left(step4._1);
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
                  step4 = sequential(util2, supervisor, step4._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step4 = interrupt || fail3 || step4;
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
                      step4 = attempt._2(util2.fromLeft(fail3));
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
                      step4 = util2.fromRight(step4);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail3 === null) {
                      result = util2.fromRight(step4);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step4 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step4, fail3), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step4 = attempt._1.killed(util2.fromLeft(interrupt))(attempt._2);
                    } else if (fail3) {
                      step4 = attempt._1.failed(util2.fromLeft(fail3))(attempt._2);
                    } else {
                      step4 = attempt._1.completed(util2.fromRight(step4))(attempt._2);
                    }
                    fail3 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step4, fail3), attempts, interrupt);
                    status = CONTINUE;
                    step4 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step4 = attempt._1;
                    fail3 = attempt._2;
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
              if (interrupt && fail3) {
                setTimeout(function() {
                  throw util2.fromLeft(fail3);
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
      function onComplete(join2) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join2.rethrow;
            join2.handler(step4)();
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
              step4 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util2.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step4(error3)), attempts, interrupt);
                }
                status = RETURN;
                step4 = null;
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
                step4 = null;
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
        var step4 = par2;
        var head = null;
        var tail = null;
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
                step4 = head._2;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
                break;
              case MAP:
                step4 = step4._2;
                break;
              case APPLY:
              case ALT:
                if (head) {
                  tail = new Aff2(CONS, head, tail);
                }
                head = step4;
                step4 = step4._1;
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
        var fail3, step4, lhs, rhs, tmp, kid;
        if (util2.isLeft(result)) {
          fail3 = result;
          step4 = null;
        } else {
          step4 = result;
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
              cb(fail3 || step4)();
              return;
            }
            if (head._3 !== EMPTY) {
              return;
            }
            switch (head.tag) {
              case MAP:
                if (fail3 === null) {
                  head._3 = util2.right(head._1(util2.fromRight(step4)));
                  step4 = head._3;
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
                  step4 = util2.right(util2.fromRight(lhs)(util2.fromRight(rhs)));
                  head._3 = step4;
                }
                break;
              case ALT:
                lhs = head._1._3;
                rhs = head._2._3;
                if (lhs === EMPTY && util2.isLeft(rhs) || rhs === EMPTY && util2.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util2.isLeft(lhs) && rhs !== EMPTY && util2.isLeft(rhs)) {
                  fail3 = step4 === lhs ? rhs : lhs;
                  step4 = null;
                  head._3 = fail3;
                } else {
                  head._3 = step4;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, step4 === lhs ? head._2 : head._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join(step4, null, null);
                      } else {
                        join(step4, tail._1, tail._2);
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
        var step4 = par;
        var head = null;
        var tail = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step4.tag) {
                  case MAP:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(MAP, step4._1, EMPTY, EMPTY);
                    step4 = step4._2;
                    break;
                  case APPLY:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(APPLY, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  case ALT:
                    if (head) {
                      tail = new Aff2(CONS, head, tail);
                    }
                    head = new Aff2(ALT, EMPTY, step4._2, EMPTY);
                    step4 = step4._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step4;
                    step4 = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
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
                if (head === null) {
                  break loop;
                }
                if (head._1 === EMPTY) {
                  head._1 = step4;
                  status = CONTINUE;
                  step4 = head._2;
                  head._2 = EMPTY;
                } else {
                  head._2 = step4;
                  step4 = head;
                  if (tail === null) {
                    head = null;
                  } else {
                    head = tail._1;
                    tail = tail._2;
                  }
                }
            }
          }
        root2 = step4;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error3, cb2) {
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
            return cancel(killError, killCb);
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
        return Aff.Bind(aff, function(value3) {
          return Aff.Pure(f(value3));
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
  var parallelAff = { parallel: unsafeCoerce, sequential: _sequential, Apply0: () => applyAff, Apply1: () => applyParAff };
  var applicativeParAff = { pure: (x2) => _pure(x2), Apply0: () => applyParAff };
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
    const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x2) => _liftEffect(k(x2))));
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
  var applicativeFn = { pure: (x2) => (v) => x2, Apply0: () => applyFn };
  var applicativeArray = { pure: (x2) => [x2], Apply0: () => applyArray };

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
  var identity4 = (x2) => x2;
  var bindFn = { bind: (m) => (f) => (x2) => f(m(x2))(x2), Apply0: () => applyFn };

  // output-es/Control.Monad/index.js
  var monadFn = { Applicative0: () => applicativeFn, Bind1: () => bindFn };

  // output-es/Data.Identity/index.js
  var Identity = (x2) => x2;
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
      const eqTuple2 = { eq: (x2) => (y2) => $0.eq(x2._1)(y2._1) && $1.eq(x2._2)(y2._2) };
      return {
        compare: (x2) => (y2) => {
          const v = dictOrd.compare(x2._1)(y2._1);
          if (v === "LT") {
            return LT;
          }
          if (v === "GT") {
            return GT;
          }
          return dictOrd1.compare(x2._2)(y2._2);
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
  var applicativeExceptT = (dictMonad) => ({ pure: (x2) => dictMonad.Applicative0().pure($Either("Right", x2)), Apply0: () => applyExceptT(dictMonad) });
  var monadThrowExceptT = (dictMonad) => {
    const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
    return { throwError: (x2) => dictMonad.Applicative0().pure($Either("Left", x2)), Monad0: () => monadExceptT1 };
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
  var applicativeMaybeT = (dictMonad) => ({ pure: (x2) => dictMonad.Applicative0().pure($Maybe("Just", x2)), Apply0: () => applyMaybeT(dictMonad) });
  var monadEffectMaybe = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const monadMaybeT1 = { Applicative0: () => applicativeMaybeT(Monad0), Bind1: () => bindMaybeT(Monad0) };
    return { liftEffect: (x2) => Monad0.Bind1().bind(dictMonadEffect.liftEffect(x2))((a$p) => Monad0.Applicative0().pure($Maybe("Just", a$p))), Monad0: () => monadMaybeT1 };
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
    return { state: (f) => (x2) => dictMonad.Applicative0().pure(f(x2)), Monad0: () => monadStateT1 };
  };
  var monadThrowStateT = (dictMonadThrow) => {
    const Monad0 = dictMonadThrow.Monad0();
    const monadStateT1 = { Applicative0: () => applicativeStateT(Monad0), Bind1: () => bindStateT(Monad0) };
    return {
      throwError: (e) => {
        const $0 = dictMonadThrow.throwError(e);
        return (s) => Monad0.Bind1().bind($0)((x2) => Monad0.Applicative0().pure($Tuple(x2, s)));
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
          return (x2) => dictMonad.Applicative0().pure($0(x2));
        })(),
        Semigroup0: () => Semigroup0,
        Monad1: () => monadWriterT2
      };
    };
  };

  // output-es/Effect.Aff.Class/index.js
  var monadAffAff = { liftAff: (x2) => x2, MonadEffect0: () => monadEffectAff };
  var monadAffReader = (dictMonadAff) => {
    const monadEffectReader2 = monadEffectReader(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => {
        const $0 = dictMonadAff.liftAff(x2);
        return (v) => $0;
      },
      MonadEffect0: () => monadEffectReader2
    };
  };

  // output-es/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;

  // output-es/Data.Eq/index.js
  var eqUnit = { eq: (v) => (v1) => true };
  var eqString = { eq: eqStringImpl };
  var eqInt = { eq: eqIntImpl };

  // output-es/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq2) {
      return function(gt) {
        return function(x2) {
          return function(y2) {
            return x2 < y2 ? lt : x2 === y2 ? eq2 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;

  // output-es/Data.Ord/index.js
  var ordUnit = { compare: (v) => (v1) => EQ, Eq0: () => eqUnit };
  var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
  var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };
  var ordRecord = () => (dictOrdRecord) => {
    const eqRec1 = { eq: dictOrdRecord.EqRecord0().eqRecord($$Proxy) };
    return { compare: dictOrdRecord.compareRecord($$Proxy), Eq0: () => eqRec1 };
  };

  // output-es/Data.Show.Generic/foreign.js
  var intercalate = function(separator) {
    return function(xs) {
      return xs.join(separator);
    };
  };

  // output-es/Data.Show.Generic/index.js
  var genericShowArgsNoArguments = { genericShowArgs: (v) => [] };
  var genericShowConstructor = (dictGenericShowArgs) => (dictIsSymbol) => ({
    "genericShow'": (v) => {
      const ctor = dictIsSymbol.reflectSymbol($$Proxy);
      const v1 = dictGenericShowArgs.genericShowArgs(v);
      if (v1.length === 0) {
        return ctor;
      }
      return "(" + intercalate(" ")([ctor, ...v1]) + ")";
    }
  });

  // output-es/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output-es/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value3 = b;
              while (true) {
                var tuple = f(value3);
                result.push(fst2(tuple));
                var maybe = snd2(tuple);
                if (isNothing2(maybe))
                  return result;
                value3 = fromJust3(maybe);
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

  // output-es/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output-es/Data.Enum/index.js
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
  var intMod = function(x2) {
    return function(y2) {
      if (y2 === 0)
        return 0;
      var yy = Math.abs(y2);
      return (x2 % yy + yy) % yy;
    };
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
    eq: (x2) => (y2) => {
      if (x2 === "Up") {
        return y2 === "Up";
      }
      if (x2 === "Right") {
        return y2 === "Right";
      }
      if (x2 === "Down") {
        return y2 === "Down";
      }
      return x2 === "Left" && y2 === "Left";
    }
  };
  var ordCardinalDirection = {
    compare: (x2) => (y2) => {
      if (x2 === "Up") {
        if (y2 === "Up") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Up") {
        return GT;
      }
      if (x2 === "Right") {
        if (y2 === "Right") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Right") {
        return GT;
      }
      if (x2 === "Down") {
        if (y2 === "Down") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Down") {
        return GT;
      }
      if (x2 === "Left" && y2 === "Left") {
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
  var allDirections = /* @__PURE__ */ enumFromTo(enumCardinalDirection)(unfoldable1Array)(Up)(Left2);

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
  var sortByImpl = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from2, to) {
      var mid;
      var i;
      var j;
      var k;
      var x2;
      var y2;
      var c;
      mid = from2 + (to - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from2, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i = from2;
      j = mid;
      k = from2;
      while (i < mid && j < to) {
        x2 = xs2[i];
        y2 = xs2[j];
        c = fromOrdering(compare(x2)(y2));
        if (c > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
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
  var pushImpl = function(a, xs) {
    return xs.push(a);
  };

  // output-es/Data.Array.ST/index.js
  var push = /* @__PURE__ */ runSTFn2(pushImpl);

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
      return function(map2) {
        return function(pure) {
          return function(f) {
            return function(array) {
              function go(bot, top) {
                switch (top - bot) {
                  case 0:
                    return pure([]);
                  case 1:
                    return map2(array1)(f(array[bot]));
                  case 2:
                    return apply2(map2(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map2(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top - bot) / 4) * 2;
                    return apply2(map2(concat2)(go(bot, pivot)))(go(pivot, top));
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
  var identity5 = (x2) => x2;
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
    sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity5),
    Functor0: () => functorArray,
    Foldable1: () => foldableArray
  };

  // output-es/Data.Array/foreign.js
  var rangeImpl = function(start, end3) {
    var step4 = start > end3 ? -1 : 1;
    var result = new Array(step4 * (end3 - start) + 1);
    var i = start, n = 0;
    while (i !== end3) {
      result[n++] = i;
      i += step4;
    }
    result[n] = i;
    return result;
  };
  var replicateFill = function(count, value3) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value3);
  };
  var replicatePolyfill = function(count, value3) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value3;
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
    function listToArray(list2) {
      var result = [];
      var count = 0;
      var xs = list2;
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
  var reverse = function(l) {
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
      var x2 = xs[i];
      if (f(x2))
        yes.push(x2);
      else
        no.push(x2);
    }
    return { yes, no };
  };
  var sortByImpl2 = function() {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from2, to) {
      var mid;
      var i;
      var j;
      var k;
      var x2;
      var y2;
      var c;
      mid = from2 + (to - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, from2, mid);
      if (to - mid > 1)
        mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
      i = from2;
      j = mid;
      k = from2;
      while (i < mid && j < to) {
        x2 = xs2[i];
        y2 = xs2[j];
        c = fromOrdering(compare(x2)(y2));
        if (c > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
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
  var zipWith = ($0) => ($1) => ($2) => zipWithImpl($0, $1, $2);
  var zipWithA = (dictApplicative) => {
    const sequence1 = traversableArray.traverse(dictApplicative)(identity5);
    return (f) => (xs) => (ys) => sequence1(zipWithImpl(f, xs, ys));
  };
  var toUnfoldable = (dictUnfoldable) => (xs) => {
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
  var snoc = (xs) => (x2) => (() => {
    const $0 = push(x2);
    return () => {
      const result = [...xs];
      $0(result)();
      return result;
    };
  })()();
  var partition = ($0) => ($1) => partitionImpl($0, $1);
  var last = (xs) => {
    const $0 = xs.length - 1 | 0;
    if ($0 >= 0 && $0 < xs.length) {
      return $Maybe("Just", xs[$0]);
    }
    return Nothing;
  };
  var find2 = (f) => (xs) => {
    const $0 = findIndexImpl(Just, Nothing, f, xs);
    if ($0.tag === "Just") {
      return $Maybe("Just", xs[$0._1]);
    }
    return Nothing;
  };
  var filter = ($0) => ($1) => filterImpl($0, $1);
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
  var deleteBy = (v) => (v1) => (v2) => {
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
  var cons = (x2) => (xs) => [x2, ...xs];
  var concatMap = (b) => (a) => arrayBind(a)(b);
  var mapMaybe = (f) => concatMap((x2) => {
    const $0 = f(x2);
    if ($0.tag === "Nothing") {
      return [];
    }
    if ($0.tag === "Just") {
      return [$0._1];
    }
    fail();
  });

  // output-es/Game.Location/index.js
  var showLocation = { show: (v) => "(" + showIntImpl(v.x) + "," + showIntImpl(v.y) + ")" };
  var eqLocation = { eq: (x2) => (y2) => x2.x === y2.x && x2.y === y2.y };
  var ordLocation = {
    compare: (x2) => (y2) => {
      const v = ordInt.compare(x2.x)(y2.x);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordInt.compare(x2.y)(y2.y);
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
      return (x2) => $0($1(x2));
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
        return (x2) => $0(f(x2));
      })(mempty);
    }
  };
  var semigroupList = { append: (xs) => (ys) => foldableList.foldr(Cons)(ys)(xs) };
  var monoidList = { mempty: Nil, Semigroup0: () => semigroupList };
  var unfoldable1List = {
    unfoldr1: (f) => (b) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const source2 = go$a0, memo = go$a1;
          const v = f(source2);
          if (v._2.tag === "Just") {
            go$a0 = v._2._1;
            go$a1 = $List("Cons", v._1, memo);
            continue;
          }
          if (v._2.tag === "Nothing") {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const b$1 = go$1$a0, v$1 = go$1$a1;
                if (v$1.tag === "Nil") {
                  go$1$c = false;
                  go$1$r = b$1;
                  continue;
                }
                if (v$1.tag === "Cons") {
                  go$1$a0 = $List("Cons", v$1._1, b$1);
                  go$1$a1 = v$1._2;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            go$c = false;
            go$r = go$1(Nil)($List("Cons", v._1, memo));
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(b)(Nil);
    }
  };
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

  // output-es/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust3) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value3 = b;
              while (true) {
                var maybe = f(value3);
                if (isNothing2(maybe))
                  return result;
                var tuple = fromJust3(maybe);
                result.push(fst2(tuple));
                value3 = snd2(tuple);
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
  var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var $MapIter = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var $MapIterStep = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var $Split = (_1, _2, _3) => ({ tag: "Split", _1, _2, _3 });
  var $SplitLast = (_1, _2, _3) => ({ tag: "SplitLast", _1, _2, _3 });
  var identity6 = (x2) => x2;
  var Leaf = /* @__PURE__ */ $$$Map("Leaf");
  var IterLeaf = /* @__PURE__ */ $MapIter("IterLeaf");
  var IterDone = /* @__PURE__ */ $MapIterStep("IterDone");
  var unsafeNode = (k, v, l, r) => {
    if (l.tag === "Leaf") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, l, r);
      }
      if (r.tag === "Node") {
        return $$$Map("Node", 1 + r._1 | 0, 1 + r._2 | 0, k, v, l, r);
      }
      fail();
    }
    if (l.tag === "Node") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1 + l._1 | 0, 1 + l._2 | 0, k, v, l, r);
      }
      if (r.tag === "Node") {
        return $$$Map("Node", l._1 > r._1 ? 1 + l._1 | 0 : 1 + r._1 | 0, (1 + l._2 | 0) + r._2 | 0, k, v, l, r);
      }
    }
    fail();
  };
  var singleton = (k) => (v) => $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
  var unsafeBalancedNode = (k, v, l, r) => {
    if (l.tag === "Leaf") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
      }
      if (r.tag === "Node" && r._1 > 1) {
        if (r._5.tag === "Node" && (() => {
          if (r._6.tag === "Leaf") {
            return r._5._1 > 0;
          }
          if (r._6.tag === "Node") {
            return r._5._1 > r._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
        }
        return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
      }
      return unsafeNode(k, v, l, r);
    }
    if (l.tag === "Node") {
      if (r.tag === "Node") {
        if (r._1 > (l._1 + 1 | 0)) {
          if (r._5.tag === "Node" && (() => {
            if (r._6.tag === "Leaf") {
              return r._5._1 > 0;
            }
            if (r._6.tag === "Node") {
              return r._5._1 > r._6._1;
            }
            fail();
          })()) {
            return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
          }
          return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
        }
        if (l._1 > (r._1 + 1 | 0)) {
          if (l._6.tag === "Node" && (() => {
            if (l._5.tag === "Leaf") {
              return 0 <= l._6._1;
            }
            if (l._5.tag === "Node") {
              return l._5._1 <= l._6._1;
            }
            fail();
          })()) {
            return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
          }
          return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
        }
        return unsafeNode(k, v, l, r);
      }
      if (r.tag === "Leaf" && l._1 > 1) {
        if (l._6.tag === "Node" && (() => {
          if (l._5.tag === "Leaf") {
            return 0 <= l._6._1;
          }
          if (l._5.tag === "Node") {
            return l._5._1 <= l._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
        }
        return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
      }
      return unsafeNode(k, v, l, r);
    }
    fail();
  };
  var unsafeSplit = (comp, k, m) => {
    if (m.tag === "Leaf") {
      return $Split(Nothing, Leaf, Leaf);
    }
    if (m.tag === "Node") {
      const v = comp(k)(m._3);
      if (v === "LT") {
        const v1 = unsafeSplit(comp, k, m._5);
        return $Split(v1._1, v1._2, unsafeBalancedNode(m._3, m._4, v1._3, m._6));
      }
      if (v === "GT") {
        const v1 = unsafeSplit(comp, k, m._6);
        return $Split(v1._1, unsafeBalancedNode(m._3, m._4, m._5, v1._2), v1._3);
      }
      if (v === "EQ") {
        return $Split($Maybe("Just", m._4), m._5, m._6);
      }
    }
    fail();
  };
  var unsafeSplitLast = (k, v, l, r) => {
    if (r.tag === "Leaf") {
      return $SplitLast(k, v, l);
    }
    if (r.tag === "Node") {
      const v1 = unsafeSplitLast(r._3, r._4, r._5, r._6);
      return $SplitLast(v1._1, v1._2, unsafeBalancedNode(k, v, l, v1._3));
    }
    fail();
  };
  var unsafeJoinNodes = (v, v1) => {
    if (v.tag === "Leaf") {
      return v1;
    }
    if (v.tag === "Node") {
      const v2 = unsafeSplitLast(v._3, v._4, v._5, v._6);
      return unsafeBalancedNode(v2._1, v2._2, v2._3, v1);
    }
    fail();
  };
  var unsafeUnionWith = (comp, app, l, r) => {
    if (l.tag === "Leaf") {
      return r;
    }
    if (r.tag === "Leaf") {
      return l;
    }
    if (r.tag === "Node") {
      const v = unsafeSplit(comp, r._3, l);
      const l$p = unsafeUnionWith(comp, app, v._2, r._5);
      const r$p = unsafeUnionWith(comp, app, v._3, r._6);
      if (v._1.tag === "Just") {
        return unsafeBalancedNode(r._3, app(v._1._1)(r._4), l$p, r$p);
      }
      if (v._1.tag === "Nothing") {
        return unsafeBalancedNode(r._3, r._4, l$p, r$p);
      }
    }
    fail();
  };
  var update = (dictOrd) => (f) => (k) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
        }
        if (v1 === "GT") {
          return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
        }
        if (v1 === "EQ") {
          const v2 = f(v._4);
          if (v2.tag === "Nothing") {
            return unsafeJoinNodes(v._5, v._6);
          }
          if (v2.tag === "Just") {
            return $$$Map("Node", v._1, v._2, v._3, v2._1, v._5, v._6);
          }
        }
      }
      fail();
    };
    return go;
  };
  var pop = (dictOrd) => {
    const compare = dictOrd.compare;
    return (k) => (m) => {
      const v = unsafeSplit(compare, k, m);
      if (v._1.tag === "Just") {
        return $Maybe("Just", $Tuple(v._1._1, unsafeJoinNodes(v._2, v._3)));
      }
      return Nothing;
    };
  };
  var mapMaybeWithKey = (dictOrd) => (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        const v2 = f(v._3)(v._4);
        if (v2.tag === "Just") {
          return unsafeBalancedNode(v._3, v2._1, go(v._5), go(v._6));
        }
        if (v2.tag === "Nothing") {
          return unsafeJoinNodes(go(v._5), go(v._6));
        }
      }
      fail();
    };
    return go;
  };
  var lookup2 = (dictOrd) => (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = dictOrd.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._4);
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var stepAscCps = (next) => (done) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "IterLeaf") {
          go$c = false;
          go$r = done();
          continue;
        }
        if (v.tag === "IterEmit") {
          go$c = false;
          go$r = next(v._1, v._2, v._3);
          continue;
        }
        if (v.tag === "IterNode") {
          go$a0 = (() => {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const iter = go$1$a0, v$1 = go$1$a1;
                if (v$1.tag === "Leaf") {
                  go$1$c = false;
                  go$1$r = iter;
                  continue;
                }
                if (v$1.tag === "Node") {
                  if (v$1._6.tag === "Leaf") {
                    go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, iter);
                    go$1$a1 = v$1._5;
                    continue;
                  }
                  go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, $MapIter("IterNode", v$1._6, iter));
                  go$1$a1 = v$1._5;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            return go$1(v._2)(v._1);
          })();
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var stepAsc = /* @__PURE__ */ stepAscCps((k, v, next) => $MapIterStep("IterNext", k, v, next))((v) => IterDone);
  var eqMapIter = (dictEq) => (dictEq1) => ({
    eq: (() => {
      const go = (a) => (b) => {
        const v = stepAsc(a);
        if (v.tag === "IterNext") {
          const v2 = stepAsc(b);
          return v2.tag === "IterNext" && dictEq.eq(v._1)(v2._1) && dictEq1.eq(v._2)(v2._2) && go(v._3)(v2._3);
        }
        if (v.tag === "IterDone") {
          return true;
        }
        fail();
      };
      return go;
    })()
  });
  var ordMapIter = (dictOrd) => {
    const eqMapIter1 = eqMapIter(dictOrd.Eq0());
    return (dictOrd1) => {
      const eqMapIter2 = eqMapIter1(dictOrd1.Eq0());
      return {
        compare: (() => {
          const go = (go$a0$copy) => (go$a1$copy) => {
            let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
            while (go$c) {
              const a = go$a0, b = go$a1;
              const v = stepAsc(b);
              const v1 = stepAsc(a);
              if (v1.tag === "IterNext") {
                if (v.tag === "IterNext") {
                  const v3 = dictOrd.compare(v1._1)(v._1);
                  if (v3 === "EQ") {
                    const v4 = dictOrd1.compare(v1._2)(v._2);
                    if (v4 === "EQ") {
                      go$a0 = v1._3;
                      go$a1 = v._3;
                      continue;
                    }
                    go$c = false;
                    go$r = v4;
                    continue;
                  }
                  go$c = false;
                  go$r = v3;
                  continue;
                }
                if (v.tag === "IterDone") {
                  go$c = false;
                  go$r = GT;
                  continue;
                }
                fail();
              }
              if (v1.tag === "IterDone") {
                if (v.tag === "IterDone") {
                  go$c = false;
                  go$r = EQ;
                  continue;
                }
                go$c = false;
                go$r = LT;
                continue;
              }
              if (v.tag === "IterDone") {
                go$c = false;
                go$r = GT;
                continue;
              }
              fail();
            }
            return go$r;
          };
          return go;
        })(),
        Eq0: () => eqMapIter2
      };
    };
  };
  var stepUnfoldr = /* @__PURE__ */ stepAscCps((k, v, next) => $Maybe("Just", $Tuple($Tuple(k, v), next)))((v) => Nothing);
  var toUnfoldable1 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var showMap = (dictShow) => (dictShow1) => {
    const show1 = showArrayImpl((v) => "(Tuple " + dictShow.show(v._1) + " " + dictShow1.show(v._2) + ")");
    return { show: (as3) => "(fromFoldable " + show1(toUnfoldable1(as3)) + ")" };
  };
  var isSubmap = (dictOrd) => (dictEq) => {
    const go = (m1) => (m2) => {
      if (m1.tag === "Leaf") {
        return true;
      }
      if (m1.tag === "Node") {
        const v1 = lookup2(dictOrd)(m1._3)(m2);
        if (v1.tag === "Nothing") {
          return false;
        }
        if (v1.tag === "Just") {
          return dictEq.eq(m1._4)(v1._1) && go(m1._5)(m2) && go(m1._6)(m2);
        }
      }
      fail();
    };
    return go;
  };
  var insert = (dictOrd) => (k) => (v) => {
    const go = (v1) => {
      if (v1.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
      }
      if (v1.tag === "Node") {
        const v2 = dictOrd.compare(k)(v1._3);
        if (v2 === "LT") {
          return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
        }
        if (v2 === "GT") {
          return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
        }
        if (v2 === "EQ") {
          return $$$Map("Node", v1._1, v1._2, k, v, v1._5, v1._6);
        }
      }
      fail();
    };
    return go;
  };
  var functorMap = {
    map: (f) => {
      const go = (v) => {
        if (v.tag === "Leaf") {
          return Leaf;
        }
        if (v.tag === "Node") {
          return $$$Map("Node", v._1, v._2, v._3, f(v._4), go(v._5), go(v._6));
        }
        fail();
      };
      return go;
    }
  };
  var functorWithIndexMap = {
    mapWithIndex: (f) => {
      const go = (v) => {
        if (v.tag === "Leaf") {
          return Leaf;
        }
        if (v.tag === "Node") {
          return $$$Map("Node", v._1, v._2, v._3, f(v._3)(v._4), go(v._5), go(v._6));
        }
        fail();
      };
      return go;
    },
    Functor0: () => functorMap
  };
  var foldableMap = {
    foldr: (f) => (z) => {
      const go = (m$p, z$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(m$p._5, f(m$p._4)(go(m$p._6, z$p)));
        }
        fail();
      };
      return (m) => go(m, z);
    },
    foldl: (f) => (z) => {
      const go = (z$p, m$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(f(go(z$p, m$p._5))(m$p._4), m$p._6);
        }
        fail();
      };
      return (m) => go(z, m);
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return mempty;
          }
          if (v.tag === "Node") {
            return $0.append(go(v._5))($0.append(f(v._4))(go(v._6)));
          }
          fail();
        };
        return go;
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: (f) => (z) => {
      const go = (m$p, z$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(m$p._5, f(m$p._3)(m$p._4)(go(m$p._6, z$p)));
        }
        fail();
      };
      return (m) => go(m, z);
    },
    foldlWithIndex: (f) => (z) => {
      const go = (z$p, m$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(f(m$p._3)(go(z$p, m$p._5))(m$p._4), m$p._6);
        }
        fail();
      };
      return (m) => go(z, m);
    },
    foldMapWithIndex: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return mempty;
          }
          if (v.tag === "Node") {
            return $0.append(go(v._5))($0.append(f(v._3)(v._4))(go(v._6)));
          }
          fail();
        };
        return go;
      };
    },
    Foldable0: () => foldableMap
  };
  var keys = /* @__PURE__ */ (() => {
    const go = (m$p, z$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(m$p._5, $List("Cons", m$p._3, go(m$p._6, z$p)));
      }
      fail();
    };
    return (m) => go(m, Nil);
  })();
  var traversableMap = {
    traverse: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return dictApplicative.pure(Leaf);
          }
          if (v.tag === "Node") {
            const $0 = v._1;
            const $1 = v._3;
            const $2 = v._2;
            return Apply0.apply(Apply0.apply(Apply0.Functor0().map((l$p) => (v$p) => (r$p) => $$$Map("Node", $0, $2, $1, v$p, l$p, r$p))(go(v._5)))(f(v._4)))(go(v._6));
          }
          fail();
        };
        return go;
      };
    },
    sequence: (dictApplicative) => traversableMap.traverse(dictApplicative)(identity6),
    Functor0: () => functorMap,
    Foldable1: () => foldableMap
  };
  var traversableWithIndexMap = {
    traverseWithIndex: (dictApplicative) => {
      const Apply0 = dictApplicative.Apply0();
      return (f) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return dictApplicative.pure(Leaf);
          }
          if (v.tag === "Node") {
            const $0 = v._1;
            const $1 = v._3;
            const $2 = v._2;
            return Apply0.apply(Apply0.apply(Apply0.Functor0().map((l$p) => (v$p) => (r$p) => $$$Map("Node", $0, $2, $1, v$p, l$p, r$p))(go(v._5)))(f($1)(v._4)))(go(v._6));
          }
          fail();
        };
        return go;
      };
    },
    FunctorWithIndex0: () => functorWithIndexMap,
    FoldableWithIndex1: () => foldableWithIndexMap,
    Traversable2: () => traversableMap
  };
  var values = /* @__PURE__ */ (() => {
    const go = (m$p, z$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(m$p._5, $List("Cons", m$p._4, go(m$p._6, z$p)));
      }
      fail();
    };
    return (m) => go(m, Nil);
  })();
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
      if (v.tag === "Node") {
        return appendFn(appendFn(tooSmall(v._3) ? memptyValue : go(v._5))(inBounds(v._3) ? f(v._3)(v._4) : memptyValue))(tooLarge(v._3) ? memptyValue : go(v._6));
      }
      fail();
    };
    return go;
  };
  var filterWithKey = (dictOrd) => (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        if (f(v._3)(v._4)) {
          return unsafeBalancedNode(v._3, v._4, go(v._5), go(v._6));
        }
        return unsafeJoinNodes(go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };
  var filterKeys = (dictOrd) => (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        if (f(v._3)) {
          return unsafeBalancedNode(v._3, v._4, go(v._5), go(v._6));
        }
        return unsafeJoinNodes(go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };
  var eqMap = (dictEq) => (dictEq1) => ({
    eq: (xs) => (ys) => {
      if (xs.tag === "Leaf") {
        return ys.tag === "Leaf";
      }
      if (xs.tag === "Node") {
        return ys.tag === "Node" && xs._2 === ys._2 && eqMapIter(dictEq)(dictEq1).eq($MapIter("IterNode", xs, IterLeaf))($MapIter("IterNode", ys, IterLeaf));
      }
      fail();
    }
  });
  var ordMap = (dictOrd) => {
    const ordMapIter1 = ordMapIter(dictOrd);
    const eqMap1 = eqMap(dictOrd.Eq0());
    return (dictOrd1) => {
      const eqMap2 = eqMap1(dictOrd1.Eq0());
      return {
        compare: (xs) => (ys) => {
          if (xs.tag === "Leaf") {
            if (ys.tag === "Leaf") {
              return EQ;
            }
            return LT;
          }
          if (ys.tag === "Leaf") {
            return GT;
          }
          return ordMapIter1(dictOrd1).compare($MapIter("IterNode", xs, IterLeaf))($MapIter("IterNode", ys, IterLeaf));
        },
        Eq0: () => eqMap2
      };
    };
  };
  var fromFoldable = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m) => (v) => insert(dictOrd)(v._1)(v._2)(m))(Leaf);
  var submap = (dictOrd) => {
    const compare = dictOrd.compare;
    return (kmin) => (kmax) => foldSubmapBy(dictOrd)((m1) => (m2) => unsafeUnionWith(compare, $$const, m1, m2))(Leaf)(kmin)(kmax)(singleton);
  };
  var $$delete = (dictOrd) => (k) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
        }
        if (v1 === "GT") {
          return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
        }
        if (v1 === "EQ") {
          return unsafeJoinNodes(v._5, v._6);
        }
      }
      fail();
    };
    return go;
  };
  var alter = (dictOrd) => {
    const compare = dictOrd.compare;
    return (f) => (k) => (m) => {
      const v = unsafeSplit(compare, k, m);
      const v2 = f(v._1);
      if (v2.tag === "Nothing") {
        return unsafeJoinNodes(v._2, v._3);
      }
      if (v2.tag === "Just") {
        return unsafeBalancedNode(k, v2._1, v._2, v._3);
      }
      fail();
    };
  };

  // output-es/Data.Map/index.js
  var keys2 = /* @__PURE__ */ (() => functorMap.map((v) => {
  }))();

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

  // output-es/Data.Monoid/index.js
  var monoidString = { mempty: "", Semigroup0: () => semigroupString };
  var monoidOrdering = { mempty: EQ, Semigroup0: () => semigroupOrdering };
  var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };
  var power = (dictMonoid) => {
    const mempty1 = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (x2) => {
      const go = (p) => {
        if (p <= 0) {
          return mempty1;
        }
        if (p === 1) {
          return x2;
        }
        if (intMod(p)(2) === 0) {
          const x$p2 = go(intDiv(p, 2));
          return $0.append(x$p2)(x$p2);
        }
        const x$p = go(intDiv(p, 2));
        return $0.append(x$p)($0.append(x$p)(x2));
      };
      return go;
    };
  };

  // output-es/Data.Profunctor/index.js
  var identity7 = (x2) => x2;
  var profunctorFn = { dimap: (a2b) => (c2d) => (b2c) => (x2) => c2d(b2c(a2b(x2))) };
  var lcmap = (dictProfunctor) => (a2b) => dictProfunctor.dimap(a2b)(identity7);

  // output-es/Data.Profunctor.Strong/index.js
  var strongFn = /* @__PURE__ */ (() => ({ first: (a2b) => (v) => $Tuple(a2b(v._1), v._2), second: functorTuple.map, Profunctor0: () => profunctorFn }))();
  var fanout = (dictSemigroupoid) => (dictStrong) => {
    const lcmap2 = lcmap(dictStrong.Profunctor0());
    return (l) => (r) => lcmap2((a) => $Tuple(a, a))(dictSemigroupoid.compose(dictStrong.second(r))(dictStrong.first(l)));
  };

  // output-es/Data.Lens.Getter/index.js
  var identity8 = (x2) => x2;

  // output-es/Data.Lens.Internal.Forget/index.js
  var profunctorForget = { dimap: (f) => (v) => (v1) => (x2) => v1(f(x2)) };
  var strongForget = { first: (v) => (x2) => v(x2._1), second: (v) => (x2) => v(x2._2), Profunctor0: () => profunctorForget };
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

  // output-es/Data.Lens.Iso/index.js
  var coerced = () => () => (dictProfunctor) => (pab) => dictProfunctor.dimap(unsafeCoerce)(unsafeCoerce)(pab);

  // output-es/Data.Lens.Iso.Newtype/index.js
  var _Newtype = () => () => (dictProfunctor) => coerced()()(dictProfunctor);

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
    })(dictChoice.right(Profunctor0.dimap(identity7)(to)(pab)));
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
  var only = (dictEq) => (x2) => (dictChoice) => prism$p((v) => x2)((x$1) => {
    if (dictEq.eq(x$1)(x2)) {
      return $Maybe("Just", void 0);
    }
    return Nothing;
  })(dictChoice);

  // output-es/Data.Lens.Record/index.js
  var prop = (dictIsSymbol) => () => () => (l) => (dictStrong) => (pab) => dictStrong.Profunctor0().dimap((s) => $Tuple(
    unsafeGet(dictIsSymbol.reflectSymbol(l))(s),
    (b) => unsafeSet(dictIsSymbol.reflectSymbol(l))(b)(s)
  ))((v) => v._2(v._1))(dictStrong.first(pab));

  // output-es/Game.Capacity/index.js
  var $Capacity = (tag) => tag;
  var OneBit = /* @__PURE__ */ $Capacity("OneBit");
  var TwoBit = /* @__PURE__ */ $Capacity("TwoBit");
  var FourBit = /* @__PURE__ */ $Capacity("FourBit");
  var EightBit = /* @__PURE__ */ $Capacity("EightBit");
  var eqCapacity = {
    eq: (x2) => (y2) => {
      if (x2 === "OneBit") {
        return y2 === "OneBit";
      }
      if (x2 === "TwoBit") {
        return y2 === "TwoBit";
      }
      if (x2 === "FourBit") {
        return y2 === "FourBit";
      }
      return x2 === "EightBit" && y2 === "EightBit";
    }
  };
  var ordCapacity = {
    compare: (x2) => (y2) => {
      if (x2 === "OneBit") {
        if (y2 === "OneBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "OneBit") {
        return GT;
      }
      if (x2 === "TwoBit") {
        if (y2 === "TwoBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "TwoBit") {
        return GT;
      }
      if (x2 === "FourBit") {
        if (y2 === "FourBit") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "FourBit") {
        return GT;
      }
      if (x2 === "EightBit" && y2 === "EightBit") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqCapacity
  };
  var showCapacity = {
    show: (capacity) => "Capacity " + showIntImpl((() => {
      if (capacity === "OneBit") {
        return 1;
      }
      if (capacity === "TwoBit") {
        return 2;
      }
      if (capacity === "FourBit") {
        return 4;
      }
      if (capacity === "EightBit") {
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
    eq: (x2) => (y2) => {
      if (x2 === "Input") {
        return y2 === "Input";
      }
      return x2 === "Output" && y2 === "Output";
    }
  };
  var ordPortType = {
    compare: (x2) => (y2) => {
      if (x2 === "Input") {
        if (y2 === "Input") {
          return EQ;
        }
        return LT;
      }
      if (y2 === "Input") {
        return GT;
      }
      if (x2 === "Output" && y2 === "Output") {
        return EQ;
      }
      fail();
    },
    Eq0: () => eqPortType
  };
  var eqPort = {
    eq: (x2) => (y2) => (() => {
      if (x2.capacity === "OneBit") {
        return y2.capacity === "OneBit";
      }
      if (x2.capacity === "TwoBit") {
        return y2.capacity === "TwoBit";
      }
      if (x2.capacity === "FourBit") {
        return y2.capacity === "FourBit";
      }
      return x2.capacity === "EightBit" && y2.capacity === "EightBit";
    })() && (x2.portType === "Input" ? y2.portType === "Input" : x2.portType === "Output" && y2.portType === "Output")
  };
  var ordPort = {
    compare: (x2) => (y2) => {
      const v = ordCapacity.compare(x2.capacity)(y2.capacity);
      if (v === "LT") {
        return LT;
      }
      if (v === "GT") {
        return GT;
      }
      return ordPortType.compare(x2.portType)(y2.portType);
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
    return (x2) => $0(prop({ reflectSymbol: () => "portType" })()()($$Proxy)(dictStrong)(x2));
  };
  var _portType1 = /* @__PURE__ */ _portType(strongForget);
  var isInput = /* @__PURE__ */ _portType1(/* @__PURE__ */ only(eqPortType)(Input)(/* @__PURE__ */ choiceForget(/* @__PURE__ */ (() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })()))((v) => true));
  var isOutput = (x2) => !isInput(x2);
  var matchingPort = /* @__PURE__ */ _portType(strongFn)(matchingPortType);
  var portMatches = (port2) => (otherPort) => {
    const $0 = matchingPort(otherPort);
    return (() => {
      if (port2.capacity === "OneBit") {
        return $0.capacity === "OneBit";
      }
      if (port2.capacity === "TwoBit") {
        return $0.capacity === "TwoBit";
      }
      if (port2.capacity === "FourBit") {
        return $0.capacity === "FourBit";
      }
      return port2.capacity === "EightBit" && $0.capacity === "EightBit";
    })() && (port2.portType === "Input" ? $0.portType === "Input" : port2.portType === "Output" && $0.portType === "Output");
  };
  var portType = /* @__PURE__ */ _portType1(identity8);
  var _portCapacity = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "capacity" })()()($$Proxy)(dictStrong)(x2));
  };
  var portCapacity = /* @__PURE__ */ _portCapacity(strongForget)(identity8);

  // output-es/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y2) {
    return function(x2) {
      return Math.atan2(y2, x2);
    };
  };
  var floor = Math.floor;
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
        var pattern2 = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
        return function(s) {
          if (pattern2.test(s)) {
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
  var unsafeClamp = (x2) => {
    if (!isFiniteImpl(x2)) {
      return 0;
    }
    if (x2 >= toNumber(2147483647)) {
      return 2147483647;
    }
    if (x2 <= toNumber(-2147483648)) {
      return -2147483648;
    }
    const $0 = fromNumber(x2);
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
  var singleton2 = function(c) {
    return c;
  };
  var length2 = function(s) {
    return s.length;
  };
  var _indexOf = function(just) {
    return function(nothing) {
      return function(x2) {
        return function(s) {
          var i = s.indexOf(x2);
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
  var stripPrefix = (v) => (str) => {
    const v1 = splitAt(length2(v))(str);
    if (v1.before === v) {
      return $Maybe("Just", v1.after);
    }
    return Nothing;
  };
  var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);
  var contains = (pat) => {
    const $0 = indexOf(pat);
    return (x2) => {
      const $1 = $0(x2);
      if ($1.tag === "Nothing") {
        return false;
      }
      if ($1.tag === "Just") {
        return true;
      }
      fail();
    };
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

  // output-es/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str) {
      return str.codePointAt(0);
    } : fallback;
  };
  var _codePointAt = function(fallback) {
    return function(Just2) {
      return function(Nothing2) {
        return function(unsafeCodePointAt02) {
          return function(index3) {
            return function(str) {
              var length5 = str.length;
              if (index3 < 0 || index3 >= length5)
                return Nothing2;
              if (hasStringIterator) {
                var iter = str[Symbol.iterator]();
                for (var i = index3; ; --i) {
                  var o = iter.next();
                  if (o.done)
                    return Nothing2;
                  if (i === 0)
                    return Just2(unsafeCodePointAt02(o.value));
                }
              }
              return fallback(index3)(str);
            };
          };
        };
      };
    };
  };
  var _singleton = function(fallback) {
    return hasFromCodePoint ? String.fromCodePoint : fallback;
  };
  var _take = function(fallback) {
    return function(n) {
      if (hasStringIterator) {
        return function(str) {
          var accum = "";
          var iter = str[Symbol.iterator]();
          for (var i = 0; i < n; ++i) {
            var o = iter.next();
            if (o.done)
              return accum;
            accum += o.value;
          }
          return accum;
        };
      }
      return fallback(n);
    };
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

  // output-es/Data.String.CodePoints/index.js
  var uncons = (s) => {
    const v = length2(s);
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
    const $0 = uncons(s);
    if ($0.tag === "Just") {
      return $Maybe("Just", $Tuple($0._1.head, $0._1.tail));
    }
    return Nothing;
  };
  var toCodePointArrayFallback = (s) => unfoldableArray.unfoldr(unconsButWithTuple)(s);
  var unsafeCodePointAt0Fallback = (s) => {
    const cu0 = toCharCode(charAt(0)(s));
    if (55296 <= cu0 && cu0 <= 56319 && length2(s) > 1) {
      const cu1 = toCharCode(charAt(1)(s));
      if (56320 <= cu1 && cu1 <= 57343) {
        return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
      }
    }
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var fromCharCode2 = (x2) => singleton2((() => {
    if (x2 >= 0 && x2 <= 65535) {
      return fromCharCode(x2);
    }
    if (x2 < 0) {
      return "\0";
    }
    return "\uFFFF";
  })());
  var singletonFallback = (v) => {
    if (v <= 65535) {
      return fromCharCode2(v);
    }
    return fromCharCode2(intDiv(v - 65536 | 0, 1024) + 55296 | 0) + fromCharCode2(intMod(v - 65536 | 0)(1024) + 56320 | 0);
  };
  var singleton3 = /* @__PURE__ */ _singleton(singletonFallback);
  var takeFallback = (v) => (v1) => {
    if (v < 1) {
      return "";
    }
    const v2 = uncons(v1);
    if (v2.tag === "Just") {
      return singleton3(v2._1.head) + takeFallback(v - 1 | 0)(v2._1.tail);
    }
    return v1;
  };
  var take2 = /* @__PURE__ */ _take(takeFallback);
  var codePointAtFallback = (codePointAtFallback$a0$copy) => (codePointAtFallback$a1$copy) => {
    let codePointAtFallback$a0 = codePointAtFallback$a0$copy, codePointAtFallback$a1 = codePointAtFallback$a1$copy, codePointAtFallback$c = true, codePointAtFallback$r;
    while (codePointAtFallback$c) {
      const n = codePointAtFallback$a0, s = codePointAtFallback$a1;
      const v = uncons(s);
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

  // output-es/Data.UInt/foreign.js
  function from(val) {
    return val >>> 0;
  }
  function toInt(uval) {
    return uval | 0;
  }
  function uintAdd(x2) {
    return function(y2) {
      return x2 + y2 >>> 0;
    };
  }
  function uintMul(x2) {
    return function(y2) {
      return Math.imul(x2, y2) >>> 0;
    };
  }
  function uintSub(x2) {
    return function(y2) {
      return x2 - y2 >>> 0;
    };
  }
  function uintEq(x2) {
    return function(y2) {
      return x2 == y2;
    };
  }
  function uintCmp(lt) {
    return function(eq2) {
      return function(gt) {
        return function(x2) {
          return function(y2) {
            if (x2 < y2)
              return lt;
            if (x2 === y2)
              return eq2;
            return gt;
          };
        };
      };
    };
  }
  function and2(n1) {
    return function(n2) {
      return (n1 & n2) >>> 0;
    };
  }
  function or(n1) {
    return function(n2) {
      return (n1 | n2) >>> 0;
    };
  }
  function xor(n1) {
    return function(n2) {
      return (n1 ^ n2) >>> 0;
    };
  }
  function shl(n1) {
    return function(n2) {
      return n1 << n2 >>> 0;
    };
  }
  function shr(n1) {
    return function(n2) {
      return n1 >> n2 >>> 0;
    };
  }
  function complement(n) {
    return ~n >>> 0;
  }

  // output-es/Data.UInt/index.js
  var uintEqInstance = { eq: uintEq };
  var uintOrd = { compare: /* @__PURE__ */ uintCmp(LT)(EQ)(GT), Eq0: () => uintEqInstance };
  var uintSemiring = { zero: /* @__PURE__ */ from(0), add: uintAdd, one: /* @__PURE__ */ from(1), mul: uintMul };

  // output-es/Game.Signal/index.js
  var $Base = (tag) => tag;
  var $SignalRepresentation = (_1, _2) => ({ tag: "SignalRepresentation", _1, _2 });
  var power2 = /* @__PURE__ */ power(monoidString);
  var Binary = /* @__PURE__ */ $Base("Binary");
  var Hexadecimal = /* @__PURE__ */ $Base("Hexadecimal");
  var heytingAlgebraSignal = /* @__PURE__ */ (() => ({
    ff: uintSemiring.zero,
    tt: complement(uintSemiring.zero),
    not: (v) => complement(v),
    implies: (v) => (v1) => or(complement(v))(v1),
    disj: (v) => (v1) => or(v)(v1),
    conj: (v) => (v1) => and2(v)(v1)
  }))();
  var eqSignal = { eq: (x2) => (y2) => uintEq(x2)(y2) };
  var mkSignal = (x2) => from(x2);
  var maxValue = (v) => {
    if (v === "OneBit") {
      return from(1);
    }
    if (v === "TwoBit") {
      return from(3);
    }
    if (v === "FourBit") {
      return from(15);
    }
    if (v === "EightBit") {
      return from(255);
    }
    fail();
  };
  var printSignal = (v) => {
    const $0 = toStringAs((() => {
      if (v._1 === "Binary") {
        return 2;
      }
      if (v._1 === "Decimal") {
        return 10;
      }
      if (v._1 === "Hexadecimal") {
        return 16;
      }
      fail();
    })());
    const $1 = (() => {
      if (v._1 === "Binary") {
        if (v._2 === "OneBit") {
          return 1;
        }
        if (v._2 === "TwoBit") {
          return 2;
        }
        if (v._2 === "FourBit") {
          return 4;
        }
        if (v._2 === "EightBit") {
          return 8;
        }
        fail();
      }
      if (v._1 === "Decimal") {
        if (v._2 === "EightBit") {
          return 3;
        }
        if (v._2 === "FourBit") {
          return 2;
        }
        return 1;
      }
      if (v._1 === "Hexadecimal") {
        if (v._2 === "OneBit") {
          return 0;
        }
        if (v._2 === "TwoBit") {
          return 0;
        }
        if (v._2 === "FourBit") {
          return 1;
        }
        if (v._2 === "EightBit") {
          return 2;
        }
      }
      fail();
    })();
    return (x2) => {
      const $2 = $0(toInt(and2(x2)(maxValue(v._2))));
      return power2("0")($1 - toCodePointArray($2).length | 0) + $2;
    };
  };
  var showSignal = { show: /* @__PURE__ */ printSignal(/* @__PURE__ */ $SignalRepresentation(Hexadecimal, EightBit)) };

  // output-es/Game.Piece.Types/index.js
  var $Simplification = (tag, _1) => ({ tag, _1 });
  var and3 = /* @__PURE__ */ and(foldableArray)(heytingAlgebraBoolean);
  var eq3 = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqPort).eq)();
  var fold = /* @__PURE__ */ (() => foldableArray.foldMap(monoidOrdering)(identity2))();
  var compare1 = /* @__PURE__ */ (() => ordMap(ordCardinalDirection)(ordPort).compare)();
  var eqPieceId = { eq: (x2) => (y2) => x2 === y2 };
  var ordPieceId = { compare: (x2) => (y2) => ordString.compare(x2)(y2), Eq0: () => eqPieceId };
  var eqPiece = { eq: (v) => (v1) => and3([v.name === v1.name, eq3(v.ports)(v1.ports)]) };
  var ordPiece = { compare: (v) => (v1) => fold([ordString.compare(v.name)(v1.name), compare1(v.ports)(v1.ports)]), Eq0: () => eqPiece };

  // output-es/Game.GameEvent/index.js
  var $BoardEvent = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var $GameEvent = (tag, _1) => ({ tag, _1 });
  var GameStarted = /* @__PURE__ */ $GameEvent("GameStarted");

  // output-es/GlobalState/index.js
  var $GlobalStateAction = (_1) => ({ tag: "NewGameEvent", _1 });
  var reduce = (state) => (v) => ({ ...state, lastGameEvent: v._1 });
  var initialGlobalState = { lastGameEvent: GameStarted };

  // output-es/Data.List/index.js
  var toUnfoldable2 = (dictUnfoldable) => dictUnfoldable.unfoldr((xs) => {
    if (xs.tag === "Nil") {
      return Nothing;
    }
    if (xs.tag === "Cons") {
      return $Maybe("Just", $Tuple(xs._1, xs._2));
    }
    fail();
  });
  var reverse2 = /* @__PURE__ */ (() => {
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
  var deleteBy2 = (v) => (v1) => (v2) => {
    if (v2.tag === "Nil") {
      return Nil;
    }
    if (v2.tag === "Cons") {
      if (v(v1)(v2._1)) {
        return v2._2;
      }
      return $List("Cons", v2._1, deleteBy2(v)(v1)(v2._2));
    }
    fail();
  };

  // output-es/Data.CatQueue/index.js
  var $CatQueue = (_1, _2) => ({ tag: "CatQueue", _1, _2 });
  var uncons2 = (uncons$a0$copy) => {
    let uncons$a0 = uncons$a0$copy, uncons$c = true, uncons$r;
    while (uncons$c) {
      const v = uncons$a0;
      if (v._1.tag === "Nil") {
        if (v._2.tag === "Nil") {
          uncons$c = false;
          uncons$r = Nothing;
          continue;
        }
        uncons$a0 = $CatQueue(reverse2(v._2), Nil);
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
        const v = uncons2(xs);
        if (v.tag === "Nothing") {
          go$c = false;
          go$r = foldl((x2) => (i) => i(x2))(b)(ys);
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
  var uncons3 = (v) => {
    if (v.tag === "CatNil") {
      return Nothing;
    }
    if (v.tag === "CatCons") {
      return $Maybe("Just", $Tuple(v._1, v._2._1.tag === "Nil" && v._2._2.tag === "Nil" ? CatNil : foldr(link)(CatNil)(v._2)));
    }
    fail();
  };
  var snoc2 = (cat) => (a) => {
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
        const v2 = uncons3(v._2);
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
  var freeFunctor = { map: (k) => (f) => freeBind.bind(f)((x2) => freeApplicative.pure(k(x2))) };
  var freeBind = { bind: (v) => (k) => $Free(v._1, snoc2(v._2)(k)), Apply0: () => freeApply };
  var freeApply = {
    apply: (f) => (a) => $Free(f._1, snoc2(f._2)((f$p) => $Free(a._1, snoc2(a._2)((a$p) => freeApplicative.pure(f$p(a$p)))))),
    Functor0: () => freeFunctor
  };
  var freeApplicative = { pure: (x2) => $Free($FreeView("Return", x2), CatNil), Apply0: () => freeApply };
  var substFree = (k) => {
    const go = (f) => {
      const v = toView(f);
      if (v.tag === "Return") {
        return $Free($FreeView("Return", v._1), CatNil);
      }
      if (v.tag === "Bind") {
        const $0 = k(v._1);
        return $Free($0._1, snoc2($0._2)((x2) => go(v._2(x2))));
      }
      fail();
    };
    return go;
  };
  var hoistFree = (k) => substFree((x2) => $Free($FreeView("Bind", k(x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)), CatNil));
  var foldFree = (dictMonadRec) => {
    const Monad0 = dictMonadRec.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (k) => dictMonadRec.tailRecM((f) => {
      const v = toView(f);
      if (v.tag === "Return") {
        return $0.map(Done)(Monad0.Applicative0().pure(v._1));
      }
      if (v.tag === "Bind") {
        return $0.map((x2) => $Step("Loop", v._2(x2)))(k(v._1));
      }
      fail();
    });
  };

  // output-es/Data.Bifunctor/index.js
  var identity10 = (x2) => x2;
  var bifunctorTuple = { bimap: (f) => (g) => (v) => $Tuple(f(v._1), g(v._2)) };

  // output-es/Halogen.Data.OrdBox/index.js
  var $OrdBox = (_1, _2, _3) => ({ tag: "OrdBox", _1, _2, _3 });
  var OrdBox = (value0) => (value1) => (value22) => $OrdBox(value0, value1, value22);
  var eqOrdBox = { eq: (v) => (v1) => v._1(v._3)(v1._3) };
  var ordOrdBox = { compare: (v) => (v1) => v._2(v._3)(v1._3), Eq0: () => eqOrdBox };

  // output-es/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop1 = /* @__PURE__ */ pop(ordTuple2);
  var pop2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => pop1($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var lookup3 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (v) => lookup2(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(v);
  };
  var insert2 = () => (dictIsSymbol) => (dictOrd) => {
    const mkOrdBox = OrdBox(dictOrd.Eq0().eq)(dictOrd.compare);
    return (sym) => (key2) => (val) => (v) => insert(ordTuple2)($Tuple(dictIsSymbol.reflectSymbol(sym), mkOrdBox(key2)))(val)(v);
  };
  var foreachSlot = (dictApplicative) => {
    const traverse_17 = traverse_(dictApplicative)(foldableMap);
    return (v) => (k) => traverse_17((x2) => k(x2))(v);
  };

  // output-es/DOM.HTML.Indexed.InputType/index.js
  var $InputType = (tag) => tag;
  var InputRange = /* @__PURE__ */ $InputType("InputRange");
  var renderInputType = (v) => {
    if (v === "InputButton") {
      return "button";
    }
    if (v === "InputCheckbox") {
      return "checkbox";
    }
    if (v === "InputColor") {
      return "color";
    }
    if (v === "InputDate") {
      return "date";
    }
    if (v === "InputDatetimeLocal") {
      return "datetime-local";
    }
    if (v === "InputEmail") {
      return "email";
    }
    if (v === "InputFile") {
      return "file";
    }
    if (v === "InputHidden") {
      return "hidden";
    }
    if (v === "InputImage") {
      return "image";
    }
    if (v === "InputMonth") {
      return "month";
    }
    if (v === "InputNumber") {
      return "number";
    }
    if (v === "InputPassword") {
      return "password";
    }
    if (v === "InputRadio") {
      return "radio";
    }
    if (v === "InputRange") {
      return "range";
    }
    if (v === "InputReset") {
      return "reset";
    }
    if (v === "InputSearch") {
      return "search";
    }
    if (v === "InputSubmit") {
      return "submit";
    }
    if (v === "InputTel") {
      return "tel";
    }
    if (v === "InputText") {
      return "text";
    }
    if (v === "InputTime") {
      return "time";
    }
    if (v === "InputUrl") {
      return "url";
    }
    if (v === "InputWeek") {
      return "week";
    }
    fail();
  };

  // output-es/Halogen.Query.Input/index.js
  var $Input = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }
  function notNull(x2) {
    return x2;
  }

  // output-es/Foreign/foreign.js
  function typeOf(value3) {
    return typeof value3;
  }
  var isArray = Array.isArray || function(value3) {
    return Object.prototype.toString.call(value3) === "[object Array]";
  };

  // output-es/Data.FoldableWithIndex/index.js
  var traverseWithIndex_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldableWithIndex) => (f) => dictFoldableWithIndex.foldrWithIndex((i) => {
      const $1 = f(i);
      return (x2) => {
        const $2 = $1(x2);
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
  var findWithIndex = (dictFoldableWithIndex) => (p) => dictFoldableWithIndex.foldlWithIndex((v) => (v1) => (v2) => {
    if (v1.tag === "Nothing" && p(v)(v2)) {
      return $Maybe("Just", { index: v, value: v2 });
    }
    return v1;
  })(Nothing);

  // output-es/Foreign.Object/foreign.js
  function _mapWithKey(m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(k)(m0[k]);
      }
    }
    return m;
  }
  function _foldM(bind) {
    return function(f) {
      return function(mz) {
        return function(m) {
          var acc = mz;
          function g(k2) {
            return function(z) {
              return f(z)(k2)(m[k2]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  }
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
  var keys3 = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output-es/Foreign.Object/index.js
  var values2 = /* @__PURE__ */ toArrayWithKey((v) => (v1) => v1);
  var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
  var foldMap = (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => fold2((acc) => (k) => (v) => dictMonoid.Semigroup0().append(acc)(f(k)(v)))(mempty);
  };
  var foldableObject = {
    foldl: (f) => fold2((z) => (v) => f(z)),
    foldr: (f) => (z) => (m) => foldrArray(f)(z)(values2(m)),
    foldMap: (dictMonoid) => {
      const foldMap1 = foldMap(dictMonoid);
      return (f) => foldMap1((v) => f);
    }
  };

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
  function strMapWithIxE(as3, fk, f) {
    var o = {};
    for (var i = 0; i < as3.length; i++) {
      var a = as3[i];
      var k = fk(a);
      o[k] = f(k, i, a);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as3, fk, f1, f2, f3) {
    var o2 = {};
    for (var i = 0; i < as3.length; i++) {
      var a = as3[i];
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
  function createElement(ns, name3, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name3);
    } else {
      return doc.createElement(name3);
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
  var Attribute = (value0) => (value1) => (value22) => $Prop("Attribute", value0, value1, value22);
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
          (x2) => {
            const $0 = v1._2(x2);
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
          (x2) => {
            const $0 = v1._1(x2);
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
  var runGraft = (x2) => {
    const go = (v2) => {
      if (v2.tag === "Text") {
        return $VDom("Text", v2._1);
      }
      if (v2.tag === "Elem") {
        return $VDom("Elem", v2._1, v2._2, x2._1(v2._3), arrayMap(go)(v2._4));
      }
      if (v2.tag === "Keyed") {
        return $VDom("Keyed", v2._1, v2._2, x2._1(v2._3), arrayMap((m) => $Tuple(m._1, go(m._2)))(v2._4));
      }
      if (v2.tag === "Widget") {
        return $VDom("Widget", x2._2(v2._1));
      }
      if (v2.tag === "Grafted") {
        const $0 = v2._1;
        return $VDom("Grafted", $GraftX((x$1) => x2._1($0._1(x$1)), (x$1) => x2._2($0._2(x$1)), $0._3));
      }
      fail();
    };
    return go(x2._3);
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
        return $VDom("Grafted", $GraftX((x2) => $0($1._1(x2)), (x2) => f($1._2(x2)), $1._3));
      }
      return $VDom("Grafted", $GraftX($0, f, v));
    }
  };

  // output-es/Control.Applicative.Free/index.js
  var $FreeAp = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity11 = (x2) => x2;
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
  var functorFreeAp = { map: (f) => (x2) => $FreeAp("Ap", $FreeAp("Pure", f), x2) };
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
  var identity12 = (x2) => x2;
  var SubscriptionId = (x2) => x2;
  var ForkId = (x2) => x2;
  var raise = (o) => $Free(
    $FreeView("Bind", $HalogenF("Raise", o, void 0), (x2) => $Free($FreeView("Return", x2), CatNil)),
    CatNil
  );
  var query = () => (dictIsSymbol) => (dictOrd) => {
    const lookup22 = lookup3()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (q) => $Free(
      $FreeView(
        "Bind",
        $HalogenF(
          "ChildQuery",
          $ChildQuery(
            (dictApplicative) => (k) => {
              const $0 = dictApplicative.pure(Nothing);
              const $1 = lookup22(label)(p);
              return (x2) => {
                const $2 = $1(x2);
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
            identity12
          )
        ),
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      CatNil
    );
  };
  var monadTransHalogenM = {
    lift: (dictMonad) => (x2) => $Free(
      $FreeView("Bind", $HalogenF("Lift", x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    )
  };
  var monadStateHalogenM = {
    state: (x2) => $Free(
      $FreeView("Bind", $HalogenF("State", x2), (x$1) => $Free($FreeView("Return", x$1), CatNil)),
      CatNil
    ),
    Monad0: () => freeMonad
  };
  var monadEffectHalogenM = (dictMonadEffect) => ({
    liftEffect: (x2) => $Free(
      $FreeView(
        "Bind",
        $HalogenF("Lift", dictMonadEffect.liftEffect(x2)),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ),
    Monad0: () => freeMonad
  });
  var monadAffHalogenM = (dictMonadAff) => {
    const monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      liftAff: (x2) => $Free(
        $FreeView(
          "Bind",
          $HalogenF("Lift", dictMonadAff.liftAff(x2)),
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
          return foldFreeAp(applicativeFreeAp)((x2) => $FreeAp("Lift", $0(x2)))(v1._1);
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
  var thunk = (tid, eqFn, f, a) => $Thunk(tid, eqFn, f, a);
  var thunk1 = (f, a) => thunk(f, refEq2, f, a);
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
      return $Free($1._1, snoc2($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Finalize") {
      const $0 = v._1;
      const $1 = traverse_2(args.handleAction)(args.finalize);
      return $Free($1._1, snoc2($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Receive") {
      const $0 = v._2;
      const $1 = traverse_2(args.handleAction)(args.receive(v._1));
      return $Free($1._1, snoc2($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Action") {
      const $0 = v._2;
      const $1 = args.handleAction(v._1);
      return $Free($1._1, snoc2($1._2)((x2) => $Free($FreeView("Return", $0), CatNil)));
    }
    if (v.tag === "Query") {
      const $0 = v._2();
      const $1 = args.handleQuery(v._1._2);
      return $Free(
        $1._1,
        snoc2($1._2)((x2) => $Free(
          $FreeView(
            "Return",
            (() => {
              if (x2.tag === "Nothing") {
                return $0;
              }
              if (x2.tag === "Just") {
                return v._1._1(x2._1);
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
          return $Thunk($0._1, $0._2, (x2) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity10)($0._3(x2)), $0._4);
        })()
      );
    }
    fail();
  };
  var hoist2 = (dictFunctor) => (nat) => (c) => ({
    initialState: c.initialState,
    render: (x2) => bifunctorHTML.bimap(hoistSlot(dictFunctor)(nat))(identity10)(c.render(x2)),
    eval: (x2) => hoist(dictFunctor)(nat)(c.eval(x2))
  });
  var functorComponentSlotBox = {
    map: (f) => (slot4) => ({
      ...slot4,
      output: (x2) => {
        const $0 = slot4.output(x2);
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
            return $Thunk($1._1, $1._2, (x2) => $0($1._3(x2)), $1._4);
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
    const lookup22 = lookup3()(dictIsSymbol)(dictOrd);
    const pop22 = pop2()(dictIsSymbol)(dictOrd);
    const insert22 = insert2()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (comp) => (input) => (output) => ({ get: lookup22(label)(p), pop: pop22(label)(p), set: insert22(label)(p), component: comp, input, output });
  };

  // output-es/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value3) {
    var tag = Object.prototype.toString.call(value3);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value3);
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
  var identity13 = (x2) => x2;
  var tell = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot4) => (label) => (req2) => {
      const $0 = query2(slot4)(label)(req2());
      return $Free($0._1, snoc2($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil)));
    };
  };
  var request = () => (dictIsSymbol) => (dictOrd) => {
    const query2 = query()(dictIsSymbol)(dictOrd);
    return (slot4) => (label) => (req2) => query2(slot4)(label)(req2(identity13));
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
    return (x2) => $0($Free(
      $FreeView(
        "Bind",
        $HalogenF("GetRef", x2, identity12),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ));
  })();

  // output-es/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a) {
    return function(b) {
      return a === b;
    };
  }

  // output-es/Halogen.Store.Select/index.js
  var selectEmitter = (v) => (emitter) => (push2) => () => {
    let previousDerivedRef = Nothing;
    return emitter((x2) => () => {
      const previousDerived = previousDerivedRef;
      const newDerived = v.select(x2);
      const $0 = v.eq(newDerived);
      const $1 = (() => {
        if (previousDerived.tag === "Nothing") {
          return false;
        }
        if (previousDerived.tag === "Just") {
          return $0(previousDerived._1);
        }
        fail();
      })();
      if (!$1) {
        previousDerivedRef = $Maybe("Just", newDerived);
        push2(newDerived)();
      } else if ($1) {
      } else {
        fail();
      }
    })();
  };

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
          subscribers = deleteBy(reallyUnsafeRefEq)(k)($1);
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

  // output-es/Halogen.Store.Monad/index.js
  var monadStoreStoreT = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const $0 = bindReaderT(Monad0.Bind1());
    const ask = Monad0.Applicative0().pure;
    const $1 = monadEffectReader(dictMonadEffect);
    const monadEffectStoreT1 = monadEffectReader(dictMonadEffect);
    return {
      getStore: $0.bind(ask)((store) => $1.liftEffect((() => {
        const $2 = store.value;
        return () => $2.value;
      })())),
      updateStore: (action) => $0.bind(ask)((store) => $1.liftEffect((() => {
        const $2 = store.value;
        return () => {
          const current = $2.value;
          const newStore = store.reducer(current)(action);
          store.value.value = newStore;
          return store.listener(newStore)();
        };
      })())),
      emitSelected: (selector) => (x2) => Monad0.Applicative0().pure(selectEmitter(selector)(x2.emitter)),
      MonadEffect0: () => monadEffectStoreT1
    };
  };
  var runAndEmitStoreT = (dictMonad) => {
    const hoist3 = hoist2(dictMonad.Bind1().Apply0().Functor0());
    return (initialStore) => (reducer) => (component16) => _bind(_liftEffect(() => {
      const value3 = { value: initialStore };
      const v = create();
      return { value: value3, emitter: v.emitter, listener: v.listener, reducer };
    }))((hs) => _pure({ emitter: hs.emitter, component: hoist3((v) => v(hs))(component16) }));
  };
  var runStoreT = (dictMonad) => {
    const runAndEmitStoreT1 = runAndEmitStoreT(dictMonad);
    return (initialStore) => (reducer) => (component16) => _map((v) => v.component)(runAndEmitStoreT1(initialStore)(reducer)(component16));
  };
  var monadStoreHalogenM = (dictMonadStore) => {
    const MonadEffect0 = dictMonadStore.MonadEffect0();
    const lift9 = monadTransHalogenM.lift(MonadEffect0.Monad0());
    const monadEffectHalogenM4 = monadEffectHalogenM(MonadEffect0);
    return {
      getStore: lift9(dictMonadStore.getStore),
      updateStore: (x2) => lift9(dictMonadStore.updateStore(x2)),
      emitSelected: (x2) => lift9(dictMonadStore.emitSelected(x2)),
      MonadEffect0: () => monadEffectHalogenM4
    };
  };

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
    return (level2) => (tags) => (message2) => MonadEffect0.Monad0().Bind1().bind(MonadEffect0.liftEffect(now))((x2) => dictMonadLogger.log({ level: level2, message: message2, tags, timestamp: x2 }));
  };

  // output-es/Data.Log.Filter/index.js
  var minimumLevel = (dictMonadEffect) => (level2) => (logger) => (message2) => {
    if (ordLogLevel.compare(message2.level)(level2) !== "LT") {
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
  var escapeCodeToString = (x2) => {
    if (x2.tag === "Up") {
      return "\x1B[" + showIntImpl(x2._1) + "A";
    }
    if (x2.tag === "Down") {
      return "\x1B[" + showIntImpl(x2._1) + "B";
    }
    if (x2.tag === "Forward") {
      return "\x1B[" + showIntImpl(x2._1) + "C";
    }
    if (x2.tag === "Back") {
      return "\x1B[" + showIntImpl(x2._1) + "D";
    }
    if (x2.tag === "NextLine") {
      return "\x1B[" + showIntImpl(x2._1) + "E";
    }
    if (x2.tag === "PreviousLine") {
      return "\x1B[" + showIntImpl(x2._1) + "F";
    }
    if (x2.tag === "HorizontalAbsolute") {
      return "\x1B[" + showIntImpl(x2._1) + "G";
    }
    if (x2.tag === "Position") {
      return "\x1B[" + showIntImpl(x2._1) + ";" + showIntImpl(x2._2) + "H";
    }
    if (x2.tag === "EraseData") {
      if (x2._1 === "ToEnd") {
        return "\x1B[0J";
      }
      if (x2._1 === "FromBeginning") {
        return "\x1B[1J";
      }
      if (x2._1 === "Entire") {
        return "\x1B[2J";
      }
      fail();
    }
    if (x2.tag === "EraseLine") {
      if (x2._1 === "ToEnd") {
        return "\x1B[0K";
      }
      if (x2._1 === "FromBeginning") {
        return "\x1B[1K";
      }
      if (x2._1 === "Entire") {
        return "\x1B[2K";
      }
      fail();
    }
    if (x2.tag === "ScrollUp") {
      return "\x1B[" + showIntImpl(x2._1) + "S";
    }
    if (x2.tag === "ScrollDown") {
      return "\x1B[" + showIntImpl(x2._1) + "T";
    }
    if (x2.tag === "Graphics") {
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
      return "\x1B[" + go({ init: false, acc: graphicsParamToString(x2._1._1) })(listMap(graphicsParamToString)(x2._1._2)).acc + "m";
    }
    if (x2.tag === "SavePosition") {
      return "\x1B[s";
    }
    if (x2.tag === "RestorePosition") {
      return "\x1B[u";
    }
    if (x2.tag === "QueryPosition") {
      return "\x1B[6n";
    }
    if (x2.tag === "HideCursor") {
      return "\x1B[?25l";
    }
    if (x2.tag === "ShowCursor") {
      return "\x1B[?25h";
    }
    fail();
  };

  // output-es/Ansi.Output/index.js
  var withGraphics = (params) => (text) => escapeCodeToString($EscapeCode("Graphics", params)) + text + escapeCodeToString($EscapeCode(
    "Graphics",
    $NonEmpty(Reset, Nil)
  ));

  // output-es/Data.Log.Formatter.Pretty/index.js
  var toUnfoldable3 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
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
  var showSpecial = (dictApplicative) => (x2) => {
    const $0 = withGraphics($NonEmpty($GraphicsParam("PForeground", Yellow), Nil))(x2);
    return (label) => dictApplicative.pure([label + $0]);
  };
  var showJsDate = (dictMonadEffect) => (value3) => (label) => dictMonadEffect.liftEffect((() => {
    const $0 = dateMethodEff("toISOString", value3);
    return () => {
      const $1 = $0();
      return showSpecial(applicativeEffect)($1)(label)();
    };
  })());
  var tagLines = (dictMonadEffect) => (tags) => {
    if (tags.tag === "Leaf") {
      return Nothing;
    }
    return $Maybe("Just", dictMonadEffect.Monad0().Bind1().Apply0().Functor0().map((x2) => indentEachLine1(concat(x2)))(lineify(dictMonadEffect)(tags)));
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
    return (value3) => (label) => Monad0.Bind1().Apply0().Functor0().map(cons(label))((() => {
      const $0 = Monad0.Applicative0().pure([]);
      const $1 = tagLines(dictMonadEffect)(value3);
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
    const sequence1 = traversableArray.traverse(dictMonadEffect.Monad0().Applicative0())(identity5);
    return (tags) => sequence1(arrayMap(showField(dictMonadEffect))(toUnfoldable3(tags)));
  };
  var showTags = (dictMonadEffect) => {
    const Monad0 = dictMonadEffect.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (x2) => {
      const $1 = tagLines(dictMonadEffect)(x2);
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
  var logShow = (dictMonadEffect) => (dictShow) => (x2) => dictMonadEffect.liftEffect(log2(dictShow.show(x2)));
  var log3 = (dictMonadEffect) => (x2) => dictMonadEffect.liftEffect(log2(x2));

  // output-es/Logging/index.js
  var logMessage = (dictMonadEffect) => {
    const $0 = dictMonadEffect.Monad0().Bind1();
    const prettyFormatter2 = prettyFormatter(dictMonadEffect);
    return (logLevel) => minimumLevel(dictMonadEffect)(logLevel)((a) => $0.bind(prettyFormatter2(a))(log3(dictMonadEffect)));
  };

  // output-es/AppM/index.js
  var monadEffectLoggerT2 = /* @__PURE__ */ monadEffectLoggerT(monadEffectAff);
  var monadLoggerT = {
    Applicative0: () => applicativeLoggerT(monadAff),
    Bind1: () => bindLoggerT(monadAff)
  };
  var functorStoreT = {
    map: (x2) => {
      const $0 = _map(x2);
      return (v) => (x$1) => {
        const $1 = v(x$1);
        return (x$2) => $0($1(x$2));
      };
    }
  };
  var runStoreT2 = /* @__PURE__ */ runStoreT(monadLoggerT);
  var monadStoreGlobalStateActi = /* @__PURE__ */ monadStoreStoreT(monadEffectLoggerT2);
  var monadEffectAppM = /* @__PURE__ */ monadEffectReader(monadEffectLoggerT2);
  var monadLoggerAppM = { log: (message2) => (v) => (v$1) => v$1(message2), MonadEffect0: () => monadEffectAppM };
  var monadAffAppM = /* @__PURE__ */ monadAffReader(/* @__PURE__ */ monadAffLoggerT(monadAffAff));
  var runAppM = (component16) => _map(hoist2(functorAff)((() => {
    const logMessage2 = logMessage(monadEffectAff);
    return (loggerT) => loggerT(logMessage2(Info));
  })()))(runStoreT2(initialGlobalState)(reduce)(hoist2(functorStoreT)(unsafeCoerce)(component16)));

  // output-es/Data.Bifoldable/index.js
  var bifoldableTuple = {
    bifoldMap: (dictMonoid) => (f) => (g) => (v) => dictMonoid.Semigroup0().append(f(v._1))(g(v._2)),
    bifoldr: (f) => (g) => (z) => (v) => f(v._1)(g(v._2)(z)),
    bifoldl: (f) => (g) => (z) => (v) => g(f(z)(v._1))(v._2)
  };

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
  var lookup4 = /* @__PURE__ */ lookup(foldableArray)(eqString);
  var EndOfPath = /* @__PURE__ */ $RouteError("EndOfPath");
  var parsePath = /* @__PURE__ */ (() => {
    const $0 = bitraversableTuple.bitraverse(applicativeEither)((() => {
      const $02 = bitraverse((x2) => {
        const $03 = x2 === "" ? [] : split("/")(x2);
        if ($03.length === 2 && $03[0] === "" && $03[1] === "") {
          return $Either("Right", [""]);
        }
        return traverse((str) => {
          const v = _decodeURIComponent((v2) => Nothing, Just, str);
          if (v.tag === "Nothing") {
            return $Either("Left", $RouteError("MalformedURIComponent", str));
          }
          if (v.tag === "Just") {
            return $Either("Right", v._1);
          }
          fail();
        })($03);
      })((() => {
        const $03 = traverse((() => {
          const $04 = bitraverse((str) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          })((str) => {
            const v = _decodeURIComponent((v2) => Nothing, Just, str);
            if (v.tag === "Nothing") {
              return $Either("Left", $RouteError("MalformedURIComponent", str));
            }
            if (v.tag === "Just") {
              return $Either("Right", v._1);
            }
            fail();
          });
          return (x2) => $04((() => {
            const v = indexOf("=")(x2);
            if (v.tag === "Just") {
              return $Tuple(take(v._1)(x2), drop(v._1 + length2("=") | 0)(x2));
            }
            if (v.tag === "Nothing") {
              return $Tuple(x2, "");
            }
            fail();
          })());
        })());
        return (x2) => $03(x2 === "" ? [] : split("&")(x2));
      })());
      return (x2) => $02((() => {
        const v = indexOf("?")(x2);
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x2), drop(v._1 + length2("?") | 0)(x2));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x2, "");
        }
        fail();
      })());
    })())(Right);
    return (x2) => {
      const v = indexOf("#")(x2);
      const $1 = $0((() => {
        if (v.tag === "Just") {
          return $Tuple(take(v._1)(x2), drop(v._1 + length2("#") | 0)(x2));
        }
        if (v.tag === "Nothing") {
          return $Tuple(x2, "");
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
  var param = (key2) => $RouteParser(
    "Chomp",
    (state) => {
      const v = lookup4(key2)(state.params);
      if (v.tag === "Just") {
        return $RouteResult("Success", state, v._1);
      }
      return $RouteResult("Fail", $RouteError("MissingParam", key2));
    }
  );
  var functorRouteParser = {
    map: (f) => (m) => {
      if (m.tag === "Alt") {
        return $RouteParser("Alt", arrayMap(functorRouteParser.map(f))(m._1));
      }
      if (m.tag === "Chomp") {
        return $RouteParser(
          "Chomp",
          (x2) => {
            const $0 = m._1(x2);
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
  var as = (print2) => (decode) => (p) => $RouteParser(
    "Chomp",
    (state) => {
      const v = runRouteParser(state)(p);
      if (v.tag === "Fail") {
        return $RouteResult("Fail", v._1);
      }
      if (v.tag === "Success") {
        const v1 = decode(v._2);
        if (v1.tag === "Left") {
          return $RouteResult("Fail", $RouteError("Expected", v1._1, print2(v._2)));
        }
        if (v1.tag === "Right") {
          return $RouteResult("Success", v._1, v1._1);
        }
      }
      fail();
    }
  );
  var applyRouteParser = {
    apply: (fx) => (x2) => $RouteParser(
      "Chomp",
      (state) => {
        const v = runRouteParser(state)(fx);
        if (v.tag === "Fail") {
          return $RouteResult("Fail", v._1);
        }
        if (v.tag === "Success") {
          const $0 = runRouteParser(v._1)(x2);
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
        return snoc((() => {
          if (v.length === 0) {
            fail();
          }
          return sliceImpl(0, v.length - 1 | 0, v);
        })())($RouteParser("Prefix", v1._1, altRouteParser.alt($1._2)(v1._2)));
      }
    }
    return snoc(v)(v1);
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
  var semigroupRoutePrinter = { append: (v) => (v1) => (x2) => v1(v(x2)) };
  var printPath = (v) => (v.segments.length === 1 && v.segments[0] === "" ? "/" : joinWith("/")(mapMaybe(encodeURIComponent2)(v.segments))) + (v.params.length === 0 ? "" : "?" + joinWith("&")(mapMaybe((v$1) => {
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
  var param2 = (key2) => (val) => (state) => ({ ...state, params: [$Tuple(key2, val), ...state.params] });
  var monoidRoutePRinter = { mempty: (x2) => x2, Semigroup0: () => semigroupRoutePrinter };

  // output-es/Routing.Duplex/index.js
  var $RouteDuplex = (_1, _2) => ({ tag: "RouteDuplex", _1, _2 });
  var identity14 = (x2) => x2;
  var RouteDuplex = (value0) => (value1) => $RouteDuplex(value0, value1);
  var record = /* @__PURE__ */ $RouteDuplex(
    (v) => monoidRoutePRinter.mempty,
    /* @__PURE__ */ $RouteParser("Chomp", (a) => $RouteResult("Success", a, {}))
  );
  var prop2 = (dictIsSymbol) => () => () => () => (sym) => (v) => (v1) => $RouteDuplex(
    (r) => {
      const $0 = v1._1(r);
      const $1 = v._1(unsafeGet(dictIsSymbol.reflectSymbol(sym))(r));
      return (x2) => $1($0(x2));
    },
    applyRouteParser.apply(functorRouteParser.map((b) => (a) => unsafeSet(dictIsSymbol.reflectSymbol(sym))(a)(b))(v1._2))(v._2)
  );
  var profunctorRouteDuplex = { dimap: (f) => (g) => (v) => $RouteDuplex((x2) => v._1(f(x2)), functorRouteParser.map(g)(v._2)) };
  var prefix = (s) => (v) => $RouteDuplex(
    (a) => {
      const $0 = v._1(a);
      return (x2) => $0({ ...x2, segments: snoc(x2.segments)(s) });
    },
    $RouteParser("Prefix", s, v._2)
  );
  var path = /* @__PURE__ */ (() => {
    const $0 = foldrArray(prefix);
    const $1 = split("/");
    return (x2) => {
      const $2 = $1(x2);
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
  var buildParamsNil = { buildParams: (v) => (v1) => identity14 };
  var buildParamsCons = (dictIsSymbol) => () => () => () => () => (dictRouteDuplexBuildParams) => ({
    buildParams: (v) => (r) => (prev) => dictRouteDuplexBuildParams.buildParams($$Proxy)(r)(prop2(dictIsSymbol)()()()($$Proxy)(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(r)((() => {
      const $0 = dictIsSymbol.reflectSymbol($$Proxy);
      return $RouteDuplex(param2($0), param($0));
    })()))(prev))
  });
  var as2 = (f) => (g) => (v) => $RouteDuplex((x2) => v._1(f(x2)), as(identity14)(g)(v._2));
  var applyRouteDuplex = {
    apply: (v) => (v1) => $RouteDuplex(
      (x2) => {
        const $0 = v._1(x2);
        const $1 = v1._1(x2);
        return (x$1) => $1($0(x$1));
      },
      applyRouteParser.apply(v._2)(v1._2)
    ),
    Functor0: () => functorRouteDuplex
  };
  var applicativeRouteDuplex = {
    pure: /* @__PURE__ */ (() => {
      const $0 = RouteDuplex((v) => monoidRoutePRinter.mempty);
      return (x2) => $0($RouteParser("Chomp", (a) => $RouteResult("Success", a, x2)));
    })(),
    Apply0: () => applyRouteDuplex
  };

  // output-es/Routing.Duplex.Generic/index.js
  var identity15 = (x2) => x2;
  var noArgs = /* @__PURE__ */ (() => applicativeRouteDuplex.pure(NoArguments))();
  var gRouteNoArguments = { gRouteDuplexCtr: identity15 };
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
    const from2 = dictGeneric.from;
    const to = dictGeneric.to;
    return (dictGRouteDuplex) => {
      const $0 = dictGRouteDuplex.gRouteDuplex(end2);
      return (x2) => profunctorRouteDuplex.dimap(from2)(to)($0(x2));
    };
  };
  var gRouteConstructor = (dictIsSymbol) => () => (dictGRouteDuplexCtr) => ({
    gRouteDuplex: (end$p) => (r) => {
      const v = end$p(dictGRouteDuplexCtr.gRouteDuplexCtr(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(r)));
      return $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Constructor)(v._2));
    }
  });
  var gRouteAll = { gRouteDuplexCtr: (v) => $RouteDuplex((v1) => v._1(v1), functorRouteParser.map(Argument)(v._2)) };

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
  function _unsafeReadProtoTagged(nothing, just, name3, value3) {
    if (typeof window !== "undefined") {
      var ty = window[name3];
      if (ty != null && value3 instanceof ty) {
        return just(value3);
      }
    }
    var obj = value3;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name3) {
        return just(value3);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output-es/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = (name3) => (value3) => _unsafeReadProtoTagged(Nothing, Just, name3, value3);

  // output-es/Web.HTML.Window/foreign.js
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
  function confirm(str) {
    return function(window2) {
      return function() {
        return window2.confirm(str);
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
      return (x2) => {
        const $1 = $0(parser(x2));
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
  var $Route = (tag, _1) => ({ tag, _1 });
  var HomeIsSymbol = { reflectSymbol: () => "Home" };
  var AboutIsSymbol = { reflectSymbol: () => "About" };
  var InstructionsIsSymbol = { reflectSymbol: () => "Instructions" };
  var LevelSelectIsSymbol = { reflectSymbol: () => "LevelSelect" };
  var levelNameIsSymbol = { reflectSymbol: () => "levelName" };
  var suiteNameIsSymbol = { reflectSymbol: () => "suiteName" };
  var LevelIsSymbol = { reflectSymbol: () => "Level" };
  var Home = /* @__PURE__ */ $Route("Home");
  var About = /* @__PURE__ */ $Route("About");
  var Instructions = /* @__PURE__ */ $Route("Instructions");
  var LevelSelect = /* @__PURE__ */ $Route("LevelSelect");
  var genericRoute_ = {
    to: (x2) => {
      if (x2.tag === "Inl") {
        return Home;
      }
      if (x2.tag === "Inr") {
        if (x2._1.tag === "Inl") {
          return About;
        }
        if (x2._1.tag === "Inr") {
          if (x2._1._1.tag === "Inl") {
            return Instructions;
          }
          if (x2._1._1.tag === "Inr") {
            if (x2._1._1._1.tag === "Inl") {
              return LevelSelect;
            }
            if (x2._1._1._1.tag === "Inr") {
              return $Route("Level", x2._1._1._1._1);
            }
          }
        }
      }
      fail();
    },
    from: (x2) => {
      if (x2.tag === "Home") {
        return $Sum("Inl", NoArguments);
      }
      if (x2.tag === "About") {
        return $Sum("Inr", $Sum("Inl", NoArguments));
      }
      if (x2.tag === "Instructions") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
      }
      if (x2.tag === "LevelSelect") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
      }
      if (x2.tag === "Level") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", x2._1))));
      }
      fail();
    }
  };
  var showRoute = {
    show: /* @__PURE__ */ (() => {
      const $0 = genericShowConstructor(genericShowArgsNoArguments)(HomeIsSymbol);
      const $1 = genericShowConstructor(genericShowArgsNoArguments)(AboutIsSymbol);
      const $2 = genericShowConstructor(genericShowArgsNoArguments)(InstructionsIsSymbol);
      const $3 = genericShowConstructor(genericShowArgsNoArguments)(LevelSelectIsSymbol);
      const $4 = genericShowConstructor({ genericShowArgs: (v) => ["{ levelName: Underscore " + v.levelName + ", suiteName: Underscore " + v.suiteName + " }"] })(LevelIsSymbol);
      return (x2) => {
        const $5 = genericRoute_.from(x2);
        if ($5.tag === "Inl") {
          return $0["genericShow'"]($5._1);
        }
        if ($5.tag === "Inr") {
          if ($5._1.tag === "Inl") {
            return $1["genericShow'"]($5._1._1);
          }
          if ($5._1.tag === "Inr") {
            if ($5._1._1.tag === "Inl") {
              return $2["genericShow'"]($5._1._1._1);
            }
            if ($5._1._1.tag === "Inr") {
              if ($5._1._1._1.tag === "Inl") {
                return $3["genericShow'"]($5._1._1._1._1);
              }
              if ($5._1._1._1.tag === "Inr") {
                return $4["genericShow'"]($5._1._1._1._1);
              }
            }
          }
        }
        fail();
      };
    })()
  };
  var underscore = /* @__PURE__ */ as2((v) => v)((str) => {
    if (contains(" ")(str)) {
      return $Either("Left", str);
    }
    return $Either("Right", replaceAll(" ")("_")(str));
  });
  var routeCodec = /* @__PURE__ */ (() => {
    const $0 = root(sum(genericRoute_)(gRouteSum(gRouteConstructor(HomeIsSymbol)()(gRouteNoArguments))(gRouteSum(gRouteConstructor(AboutIsSymbol)()(gRouteNoArguments))(gRouteSum(gRouteConstructor(InstructionsIsSymbol)()(gRouteNoArguments))(gRouteSum(gRouteConstructor(LevelSelectIsSymbol)()(gRouteNoArguments))(gRouteConstructor(LevelIsSymbol)()(gRouteAll))))))({
      Home: prefix("home")(noArgs),
      About: prefix("about")(noArgs),
      Instructions: prefix("how-to-play")(noArgs),
      LevelSelect: prefix("level-select")(noArgs),
      Level: prefix("level")(buildParamsCons(levelNameIsSymbol)()()()()(buildParamsCons(suiteNameIsSymbol)()()()()(buildParamsNil)).buildParams($$Proxy)({
        suiteName: underscore,
        levelName: underscore
      })(record))
    }));
    return $RouteDuplex(
      $0._1,
      altRouteParser.alt($0._2)($RouteParser("Chomp", (a) => $RouteResult("Success", a, Home)))
    );
  })();
  var navigateTo = (dictMonadEffect) => (route) => dictMonadEffect.liftEffect(setHash2(printPath(routeCodec._1(route)(emptyRouteState))));
  var level = (v) => $Route("Level", { suiteName: replaceAll(" ")("_")(v.suiteName), levelName: replaceAll(" ")("_")(v.levelName) });

  // output-es/Data.Lens.Internal.Tagged/index.js
  var taggedProfunctor = { dimap: (v) => (g) => (v1) => g(v1) };
  var taggedChoice = { left: (v) => $Either("Left", v), right: (v) => $Either("Right", v), Profunctor0: () => taggedProfunctor };

  // output-es/Web.Storage.Storage/foreign.js
  function _getItem(key2) {
    return function(storage) {
      return function() {
        return storage.getItem(key2);
      };
    };
  }
  function setItem(key2) {
    return function(value3) {
      return function(storage) {
        return function() {
          storage.setItem(key2, value3);
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
    return (x2) => {
      const $1 = $0(x2);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Capability.Progress/index.js
  var $LevelProgress = (tag) => tag;
  var show = (record2) => "{ levelName: " + showStringImpl(record2.levelName) + ", suiteName: " + showStringImpl(record2.suiteName) + " }";
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
    const $1 = levelProgress2((x2) => $Maybe("Just", x2));
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

  // output-es/Halogen.HTML.Properties/index.js
  var step2 = /* @__PURE__ */ (() => {
    const $0 = Property("step");
    return (x2) => $0((() => {
      if (x2.tag === "Any") {
        return "any";
      }
      if (x2.tag === "Step") {
        return showNumberImpl(x2._1);
      }
      fail();
    })());
  })();
  var min2 = /* @__PURE__ */ Property("min");
  var max2 = /* @__PURE__ */ Property("max");
  var id = /* @__PURE__ */ Property("id");
  var href2 = /* @__PURE__ */ Property("href");
  var draggable2 = /* @__PURE__ */ Property("draggable");
  var classes = /* @__PURE__ */ (() => {
    const $0 = Property("className");
    const $1 = joinWith(" ");
    const $2 = arrayMap(unsafeCoerce);
    return (x2) => $0($1($2(x2)));
  })();
  var class_ = /* @__PURE__ */ Property("className");
  var list = /* @__PURE__ */ Attribute(Nothing)("list");
  var style = /* @__PURE__ */ Attribute(Nothing)("style");

  // output-es/Component.Layout.DefaultLayout/index.js
  var defaultLayout = (inner) => $VDom(
    "Elem",
    Nothing,
    "div",
    [id("default-layout")],
    [
      $VDom("Elem", Nothing, "div", [id("title")], [$VDom("Text", "A.B.E.D.")]),
      $VDom("Elem", Nothing, "div", [class_("inner")], [inner])
    ]
  );

  // output-es/Effect.Class/index.js
  var monadEffectEffect = { liftEffect: (x2) => x2, Monad0: () => monadEffect };

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
        $VDom(
          "Text",
          `Note: I am not a """web developer""". As a result, I don't know CSS and I have no idea how this will look on your browser. Since I know this ""game""" works on my machine, I suggest you play this game using the brave browser. Barring that, it'll probably look ok in chrome.`
        ),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "email here"),
        $VDom("Elem", Nothing, "br", [], []),
        $VDom("Text", "Source Code: "),
        $VDom(
          "Elem",
          Nothing,
          "a",
          [href2("github.com/MitchStevens/abed-ps")],
          [$VDom("Text", "github.com/MitchStevens/abed-ps")]
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
        "h1",
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
  function add(list2) {
    return function(token) {
      return function() {
        return list2.add(token);
      };
    };
  }
  function remove(list2) {
    return function(token) {
      return function() {
        return list2.remove(token);
      };
    };
  }

  // output-es/Web.DOM.Element/foreign.js
  var getProp = function(name3) {
    return function(doctype) {
      return doctype[name3];
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
  function setAttribute2(name3) {
    return function(value3) {
      return function(element) {
        return function() {
          element.setAttribute(name3, value3);
        };
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

  // output-es/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name3) {
    return function(node) {
      return function() {
        return node[name3];
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
    return (x2) => {
      const $1 = $0(x2);
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
      return document($0)();
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
    const htmlDocument = document($0)();
    return eventListener2("mousemove")(htmlDocument)(unsafeReadProtoTagged("MouseEvent"));
  };
  var globalKeyDownEventEmitter = () => {
    const $0 = windowImpl();
    const htmlDocument = document($0)();
    return eventListener2("keydown")(htmlDocument)(unsafeReadProtoTagged("KeyboardEvent"));
  };

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

  // output-es/Data.Zipper/index.js
  var $Zipper = (_1, _2, _3) => ({ tag: "Zipper", _1, _2, _3 });
  var unfoldable1Zipper = {
    unfoldr1: (f) => (b) => {
      const v = f(b);
      if (v._2.tag === "Nothing") {
        return $Zipper(Nil, v._1, Nil);
      }
      if (v._2.tag === "Just") {
        return $Zipper(Nil, v._1, unfoldable1List.unfoldr1(f)(v._2._1));
      }
      fail();
    }
  };
  var foldableZipper = {
    foldl: (f) => (z) => (v) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v$1 = go$a1;
          if (v$1.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v$1.tag === "Cons") {
            go$a0 = f(b)(v$1._1);
            go$a1 = v$1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(f(foldableList.foldr((b) => (a) => f(a)(b))(z)(v._1))(v._2))(v._3);
    },
    foldr: (f) => (z) => (v) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v$1 = go$a1;
          if (v$1.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v$1.tag === "Cons") {
            go$a0 = f(v$1._1)(b);
            go$a1 = v$1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go(f(v._2)(foldableList.foldr(f)(z)(v._3)))(v._1);
    },
    foldMap: (dictMonoid) => {
      const $0 = dictMonoid.Semigroup0();
      const foldMap1 = foldableList.foldMap(dictMonoid);
      return (f) => (v) => $0.append(foldMap1(f)(reverse2(v._1)))($0.append(f(v._2))(foldMap1(f)(v._3)));
    }
  };
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
  var fanout2 = /* @__PURE__ */ fanout(semigroupoidFn)(strongFn);
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

  // output-es/Data.Lens.Index/index.js
  var indexMap = (dictOrd) => ({
    ix: (k) => (dictStrong) => (dictChoice) => affineTraversal((s) => (b) => update(dictOrd)((v) => $Maybe("Just", b))(k)(s))((s) => {
      const $0 = lookup2(dictOrd)(k)(s);
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
        const $0 = lookup2(dictOrd)(k);
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
  var toUnfoldable12 = /* @__PURE__ */ (() => {
    const $0 = toUnfoldable2(unfoldableArray);
    return (x2) => $0(keys(x2));
  })();
  var showSet = (dictShow) => ({ show: (s) => "(fromFoldable " + showArrayImpl(dictShow.show)(toUnfoldable12(s)) + ")" });
  var foldableSet = {
    foldMap: (dictMonoid) => {
      const foldMap1 = foldableList.foldMap(dictMonoid);
      return (f) => {
        const $0 = foldMap1(f);
        return (x2) => $0(keys(x2));
      };
    },
    foldl: (f) => (x2) => {
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
      const $0 = go(x2);
      return (x$1) => $0(keys(x$1));
    },
    foldr: (f) => (x2) => {
      const $0 = foldableList.foldr(f)(x2);
      return (x$1) => $0(keys(x$1));
    }
  };
  var ordSet = (dictOrd) => {
    const $0 = dictOrd.Eq0();
    const eqSet1 = { eq: (v) => (v1) => eqMap($0)(eqUnit).eq(v)(v1) };
    return { compare: (s1) => (s2) => ordList(dictOrd).compare(keys(s1))(keys(s2)), Eq0: () => eqSet1 };
  };
  var map = (dictOrd) => (f) => foldableSet.foldl((m) => (a) => insert(dictOrd)(f(a))()(m))(Leaf);

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
      ))((x2) => {
        const $1 = (() => {
          if (x2.tag === "Nothing") {
            return () => 0;
          }
          if (x2.tag === "Just") {
            const $12 = x2._1;
            return () => result.push($12);
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
      ))((x2) => {
        const $1 = (() => {
          if (x2.tag === "Left") {
            const $12 = x2._1;
            return () => ls.push($12);
          }
          if (x2.tag === "Right") {
            const $12 = x2._1;
            return () => rs.push($12);
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
    partitionMap: (p) => foldlArray((acc) => (x2) => {
      const v = p(x2);
      if (v.tag === "Left") {
        return { ...acc, left: [...acc.left, v._1] };
      }
      if (v.tag === "Right") {
        return { ...acc, right: [...acc.right, v._1] };
      }
      fail();
    })({ left: [], right: [] }),
    partition,
    filterMap: mapMaybe,
    filter,
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
        return (x2) => $0($1(x2));
      };
    },
    wither: (dictApplicative) => {
      const compact = witherableArray.Filterable0().Compactable0().compact;
      const traverse1 = witherableArray.Traversable1().traverse(dictApplicative);
      return (p) => {
        const $0 = dictApplicative.Apply0().Functor0().map(compact);
        const $1 = traverse1(p);
        return (x2) => $0($1(x2));
      };
    },
    Filterable0: () => filterableArray,
    Traversable1: () => traversableArray
  };

  // output-es/Game.Edge/index.js
  var showEdge = {
    show: (v) => "Edge " + showLocation.show(v.loc) + " " + (() => {
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
    })()
  };
  var eqEdge = {
    eq: (x2) => (y2) => (() => {
      if (x2.dir === "Up") {
        return y2.dir === "Up";
      }
      if (x2.dir === "Right") {
        return y2.dir === "Right";
      }
      if (x2.dir === "Down") {
        return y2.dir === "Down";
      }
      return x2.dir === "Left" && y2.dir === "Left";
    })() && x2.loc.x === y2.loc.x && x2.loc.y === y2.loc.y
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
    eq: (x2) => (y2) => (() => {
      if (x2.dir === "Up") {
        return y2.dir === "Up";
      }
      if (x2.dir === "Right") {
        return y2.dir === "Right";
      }
      if (x2.dir === "Down") {
        return y2.dir === "Down";
      }
      return x2.dir === "Left" && y2.dir === "Left";
    })() && x2.loc.x === y2.loc.x && x2.loc.y === y2.loc.y
  };
  var ordRelativeEdge = { compare: (x2) => (y2) => ordEdge.compare(x2)(y2), Eq0: () => eqRelativeEdge };
  var relativeEdgeDirection = (v) => v.dir;

  // output-es/Data.Map.Unsafe/index.js
  var unsafeMapKey = (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        return $$$Map("Node", v._1, v._2, f(v._3), v._4, go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  };

  // output-es/Game.Board.Types/index.js
  var $BoardError = (tag, _1) => ({ tag, _1 });
  var submap2 = /* @__PURE__ */ submap(ordRelativeEdge);
  var member = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordLocation.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
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
      if (v.tag === "Other") {
        return "Other error: " + v._1;
      }
      fail();
    }
  };
  var toLocalInputs = (loc) => {
    const $0 = submap2($Maybe("Just", { loc, dir: Up }))($Maybe("Just", { loc, dir: Left2 }));
    const $1 = unsafeMapKey(relativeEdgeDirection);
    return (x2) => $1($0(x2));
  };
  var standardBoard = { size: 3, pieces: Leaf };
  var _size = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "size" })()()($$Proxy)(dictStrong)(x2));
  };
  var _size1 = /* @__PURE__ */ _size(strongForget);
  var _pieces = (dictStrong) => {
    const $0 = _Newtype()()(dictStrong.Profunctor0());
    return (x2) => $0(prop({ reflectSymbol: () => "pieces" })()()($$Proxy)(dictStrong)(x2));
  };
  var allOccupiedLocations = /* @__PURE__ */ _pieces(strongForget)((x2) => keys2(x2));
  var firstEmptyLocation = (board) => {
    const n = _size1(identity8)(board);
    const occupied = allOccupiedLocations(board);
    return find2((loc) => !member(loc)(occupied))(arrayBind(rangeImpl(0, n - 1 | 0))((j) => arrayBind(rangeImpl(
      0,
      n - 1 | 0
    ))((i) => [{ x: i, y: j }])));
  };

  // output-es/Game.Rotation/index.js
  var semigroupRotation = { append: (v) => (v1) => (v + v1 | 0) & 3 };
  var monoidRotation = { mempty: 0, Semigroup0: () => semigroupRotation };

  // output-es/Game.Board.Query/index.js
  var _pieces2 = /* @__PURE__ */ _pieces(strongForget);
  var ix = /* @__PURE__ */ (() => indexMap(ordLocation).ix)();
  var choiceForget2 = /* @__PURE__ */ choiceForget(monoidRotation);
  var _size2 = /* @__PURE__ */ _size(strongForget);
  var at = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var _pieces1 = /* @__PURE__ */ _pieces(strongFn);
  var member2 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordLocation.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var fromFoldable2 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var applicativeWriterT2 = /* @__PURE__ */ applicativeWriterT(monoidList);
  var monadStateWriterT2 = /* @__PURE__ */ monadStateWriterT(monoidList);
  var monadTellWriterT2 = /* @__PURE__ */ monadTellWriterT(monoidList);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable(ordRelativeEdge)(foldableList);
  var fromFoldable22 = /* @__PURE__ */ (() => foldableSet.foldr(Cons)(Nil))();
  var catMaybes2 = /* @__PURE__ */ mapMaybeWithKey(ordCardinalDirection)((v) => identity6);
  var fromFoldable3 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var toRelativeEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity8)));
        return dictMonadState.state((s) => $Tuple($2(s), s));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(-rot & 3) }));
    };
  };
  var toAbsoluteEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = _pieces2(ix($1)(strongForget)(choiceForget2)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongForget)(identity8)));
        return dictMonadState.state((s) => $Tuple($2(s), s));
      })())((rot) => Monad0.Applicative0().pure({ loc: $1, dir: rotateDirection($0)(rot) }));
    };
  };
  var isInsideBoard = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.x;
      const $1 = v.y;
      return Monad0.Bind1().bind(dictMonadState.state((s) => $Tuple(_size2(identity8)(s), s)))((n) => Monad0.Applicative0().pure(0 <= $0 && $0 < n && 0 <= $1 && $1 < n));
    };
  };
  var getPortOnEdge = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    return (v) => {
      const $0 = v.dir;
      return Monad0.Bind1().bind((() => {
        const $1 = at(v.loc)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces2($1(identity8))(s), s));
      })())((maybePieceInfo) => Monad0.Applicative0().pure((() => {
        if (maybePieceInfo.tag === "Just") {
          return lookup2(ordCardinalDirection)($0)(maybePieceInfo._1.piece.ports);
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
    return (dir2) => Monad0.Bind1().bind(dictMonadState.state((s) => $Tuple(_size2(identity8)(s), s)))((n) => Monad0.Applicative0().pure((() => {
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
    return (relEdge) => $0.bind(getPortOnEdge1(relEdge))((port2) => $0.bind(adjacentRelativeEdge1(relEdge))((adjRelEdge) => $0.bind(getPortOnEdge1(adjRelEdge))((adjPort) => {
      if ((() => {
        const $2 = applyMaybe.apply(port2.tag === "Just" ? $Maybe("Just", portMatches(port2._1)) : Nothing)(adjPort);
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
    return (capacity) => (vars) => {
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
          return dictMonadState.state((s) => $Tuple(_pieces2($2(identity8))(s), s));
        })()))((maybePiece) => {
          const v = (() => {
            if (maybePiece.tag === "Just") {
              return maybePiece._1.updateCapacity($1.dir)(capacity);
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
                return capacityRippleAcc(dictMonadState)(capacity)({
                  openSet: foldableList.foldr(Cons)($0)(fromFoldable2(filterImpl((r) => !member2(r.loc)(vars.closedSet), connected))),
                  closedSet
                });
              }
              return capacityRippleAcc(dictMonadState)(capacity)({ openSet: $0, closedSet });
            }));
          }
          if (v.tag === "Nothing") {
            return capacityRippleAcc(dictMonadState)(capacity)({ openSet: $0, closedSet });
          }
          fail();
        });
      }
      fail();
    };
  };
  var capacityRipple = (dictMonadState) => {
    const capacityRippleAcc1 = capacityRippleAcc(dictMonadState);
    return (relEdge) => (capacity) => capacityRippleAcc1(capacity)({ openSet: $List("Cons", relEdge, Nil), closedSet: Leaf });
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
      return $0.bind(connectedRelativeEdge1(relEdge))(traverse_17((adjRelEdge) => $0.bind(getPortOnEdge1(relEdge))((port2) => {
        if (port2.tag === "Just") {
          if (portType(port2._1) === "Input") {
            return $1.tell($List("Cons", $Tuple(relEdge, adjRelEdge), Nil));
          }
          if (portType(port2._1) === "Output") {
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
    return Bind1.bind(dictMonadState.state((s) => $Tuple(_pieces2(identity8)(s), s)))((pieceInfos) => Functor0.map(fromFoldable1)(Functor0.map(snd)(traverse_17(buildConnectionMapAt1)(fromFoldable22(keys2(pieceInfos))))));
  };
  var getBoardPorts = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const Bind1 = Monad0.Bind1();
    const Applicative0 = Monad0.Applicative0();
    const getBoardEdgePseudoLocation1 = getBoardEdgePseudoLocation(dictMonadState);
    const toRelativeEdge1 = toRelativeEdge(dictMonadState);
    const adjacentRelativeEdge1 = adjacentRelativeEdge(dictMonadState);
    const getPortOnEdge1 = getPortOnEdge(dictMonadState);
    return Bind1.Apply0().Functor0().map((x2) => catMaybes2(fromFoldable3(x2)))(traversableArray.traverse(Applicative0)((dir2) => Bind1.bind(getBoardEdgePseudoLocation1(dir2))((loc) => Bind1.bind(Bind1.bind(toRelativeEdge1({
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
  var $Output = (tag, _1) => ({ tag, _1 });
  var $Query = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var prop32 = /* @__PURE__ */ prop({ reflectSymbol: () => "inputs" })()();
  var getBoardPortEdge2 = /* @__PURE__ */ getBoardPortEdge(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var GetBoard = (value0) => $Query("GetBoard", value0);
  var AddPiece = (value0) => (value1) => (value22) => $Query("AddPiece", value0, value1, value22);
  var GetMouseOverLocation = (value0) => $Query("GetMouseOverLocation", value0);
  var SetGoalPorts = (value0) => (value1) => $Query("SetGoalPorts", value0, value1);
  var SetBoardSize = (value0) => (value1) => $Query("SetBoardSize", value0, value1);
  var Undo = (value0) => $Query("Undo", value0);
  var Redo = (value0) => $Query("Redo", value0);
  var Clear = (value0) => $Query("Clear", value0);
  var Initialise = /* @__PURE__ */ $Action3("Initialise");
  var PieceOutput = (value0) => $Action3("PieceOutput", value0);
  var MultimeterOutput = (value0) => $Action3("MultimeterOutput", value0);
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
    boardPorts: Leaf,
    inputs: Leaf,
    outputs: Leaf,
    lastEvalWithPortInfo: Leaf,
    isCreatingWire: Nothing,
    isMouseOverLocation: Nothing,
    isMouseOverBoardPort: Nothing
  });
  var _wireLocations = (dictWander) => {
    const Strong0 = dictWander.Strong0();
    const $0 = _Just(dictWander.Choice1());
    return (x2) => prop({ reflectSymbol: () => "isCreatingWire" })()()($$Proxy)(Strong0)($0(prop({ reflectSymbol: () => "locations" })()()($$Proxy)(Strong0)(x2)));
  };
  var _inputs = (dictStrong) => prop32($$Proxy)(dictStrong);
  var _board = (dictStrong) => (x2) => prop({ reflectSymbol: () => "boardHistory" })()()($$Proxy)(dictStrong)(dictStrong.Profunctor0().dimap((s) => $Tuple(
    s._2,
    (b) => $Zipper(s._1, b, s._3)
  ))((v) => v._2(v._1))(dictStrong.first(x2)));
  var boardPortInfo = (dictMonadState) => {
    const Monad0 = dictMonadState.Monad0();
    const $0 = Monad0.Bind1();
    const $1 = traversableWithIndexMap.traverseWithIndex(Monad0.Applicative0());
    return $0.bind(dictMonadState.state((s) => $Tuple(s.boardPorts, s)))((boardPorts) => $0.bind(dictMonadState.state((s) => $Tuple(
      _board(strongForget)(identity8)(s),
      s
    )))((board) => $1((dir2) => (port2) => {
      const $2 = lookup2(ordRelativeEdge)(getBoardPortEdge2(dir2)(board)._1);
      return dictMonadState.state((s) => $Tuple(
        (() => {
          const $3 = $2(s.lastEvalWithPortInfo);
          if ($3.tag === "Nothing") {
            return { connected: false, port: port2, signal: uintSemiring.zero };
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

  // output-es/Control.Monad.Reader.Class/index.js
  var monadAskFun = { ask: (x2) => x2, Monad0: () => monadFn };
  var monadReaderFun = { local: (f) => (g) => (x2) => g(f(x2)), MonadAsk0: () => monadAskFun };

  // output-es/Game.Board.PseudoPiece/index.js
  var psuedoPiece = (port2) => ({
    complexity: { space: 0, time: 0 },
    eval: (v) => Leaf,
    isSimplifiable: Nothing,
    name: (() => {
      const v = portType(port2);
      if (v === "Input") {
        return "psuedo-input";
      }
      if (v === "Output") {
        return "psuedo-output";
      }
      fail();
    })(),
    ports: $$$Map("Node", 1, 1, Right2, matchingPort(port2), Leaf, Leaf),
    shouldRipple: false,
    updateCapacity: (v) => (v1) => Nothing,
    updatePort: (v) => (v1) => Nothing
  });
  var getPsuedoPiecePort = (v) => {
    if (elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"])) {
      return lookup2(ordCardinalDirection)(Right2)(v.ports);
    }
    return Nothing;
  };

  // output-es/Game.Board.EvaluableBoard/index.js
  var submap3 = /* @__PURE__ */ submap(ordRelativeEdge);
  var at2 = /* @__PURE__ */ (() => atMap(ordRelativeEdge).at)();
  var catMaybes3 = /* @__PURE__ */ mapMaybeWithKey(ordCardinalDirection)((v) => identity6);
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
    const $0 = find(foldableList)((loc) => submap3($Maybe("Just", { loc, dir: Up }))($Maybe(
      "Just",
      { loc, dir: Left2 }
    ))(v1).tag === "Leaf")(v);
    if ($0.tag === "Just") {
      const $1 = $0._1;
      const $2 = Cons($1);
      const $3 = topologicalSort(deleteBy2(eqLocation.eq)($1)(v))(filterWithKey(ordRelativeEdge)((k) => (v2) => !(v2.loc.x === $1.x && v2.loc.y === $1.y))(v1));
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
        const $3 = lookup2(ordCardinalDirection)(dir2);
        return asks((x2) => $3(x2.psuedoPieceLocations));
      })())((loc) => $0.bind((() => {
        const $3 = lookup2(ordLocation)(loc);
        return asks((x2) => $3(x2.pieces));
      })())((v) => {
        const $3 = $0.bind(Monad0.Applicative0().pure(getPsuedoPiecePort(v)))((port2) => {
          const $32 = insert(ordRelativeEdge)({ loc, dir: Right2 })({ connected: false, port: port2, signal });
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
      return (inputs) => Monad0.Bind1().bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.psuedoPieceLocations)(ask1))((psuedoPieceLocations) => forWithIndex_3(psuedoPieceLocations)((dir2) => (loc) => for_8(lookup2(ordCardinalDirection)(dir2)(inputs))((signal) => setOuterPort2(dir2)(signal))));
    };
  };
  var getPorts = (dictMonadReader) => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const Monad0 = MonadAsk0.Monad0();
    const $0 = Monad0.Bind1();
    const ask1 = MonadAsk0.ask;
    const asks = (f) => MonadAsk0.Monad0().Bind1().Apply0().Functor0().map(f)(ask1);
    return $0.bind(asks((x2) => x2.pieces))((pieces) => $0.bind(asks((x2) => x2.psuedoPieceLocations))((psuedoPieceLocations) => Monad0.Applicative0().pure(mapMaybeWithKey(ordCardinalDirection)((v) => (loc) => {
      const $1 = lookup2(ordLocation)(loc)(pieces);
      const $2 = (() => {
        if ($1.tag === "Just") {
          return lookup2(ordCardinalDirection)(Right2)($1._1.ports);
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
      const $0 = lookup2(ordCardinalDirection)(dir2);
      return MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => $0(x2.psuedoPieceLocations))(ask1);
    })())((maybeLoc) => traversableMaybe.traverse(Monad0.Applicative0())((loc) => Bind1.Apply0().Functor0().map((v2) => {
      if (v2.tag === "Nothing") {
        return uintSemiring.zero;
      }
      if (v2.tag === "Just") {
        return v2._1.signal;
      }
      fail();
    })((() => {
      const $0 = lookup2(ordRelativeEdge)({ loc, dir: Right2 });
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
      const assign4 = (p, b) => $$void((() => {
        const $0 = p((v) => b);
        return dictMonadState.state((s) => {
          const s$p = $0(s);
          return $Tuple(s$p, s$p);
        });
      })());
      return (inRelEdge) => (capacity) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.connections)(ask1))((connections) => {
        const v = lookup2(ordRelativeEdge)(inRelEdge)(connections);
        if (v.tag === "Just") {
          const $0 = v._1;
          return Bind1.bind(Bind1.bind((() => {
            const $1 = at2($0)(strongForget);
            return dictMonadState.state((s) => $Tuple($1(identity8)(s), s));
          })())(traversableMaybe.traverse(Applicative0)((v1) => {
            const $1 = v1.signal;
            return Bind1.bind(assign4(
              at2(inRelEdge)(strongFn),
              $Maybe("Just", { connected: true, signal: $1, port: { portType: Input, capacity } })
            ))(() => Bind1.bind(assign4(
              at2($0)(strongFn),
              $Maybe("Just", { connected: true, signal: $1, port: { portType: Output, capacity } })
            ))(() => Applicative0.pure($1)));
          })))((maybeSignal) => Applicative0.pure((() => {
            if (maybeSignal.tag === "Nothing") {
              return uintSemiring.zero;
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
              return uintSemiring.zero;
            }
            if (v2.tag === "Just") {
              return v2._1.signal;
            }
            fail();
          })((() => {
            const $0 = at2(inRelEdge)(strongForget);
            return dictMonadState.state((s) => $Tuple($0(identity8)(s), s));
          })()))((signal) => Bind1.bind(assign4(
            at2(inRelEdge)(strongFn),
            $Maybe("Just", { connected: false, signal, port: { portType: Input, capacity } })
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
      return $0.map(catMaybes3)(Bind1.bind($0.map(filterWithKey(ordCardinalDirection)((v) => isOutput))(getPorts2))((outputPorts) => $1((dir2) => (port2) => getOuterPort2(dir2))(outputPorts)));
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
      return (loc) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.pieces)(ask1))((pieces) => for_8(lookup2(ordLocation)(loc)(pieces))((v) => Bind1.bind($0.map(fromFoldable4)($1((dir2) => (port2) => $0.map(Tuple(dir2))(getInputOnEdge2({
        loc,
        dir: dir2
      })(portCapacity(port2))))(filterWithKey(ordCardinalDirection)((v$1) => isInput)(v.ports))))((inputs) => {
        const $2 = elem(eqPieceId)(v.name)(["psuedo-input", "psuedo-output"]);
        const outputs = v.eval(inputs);
        const $3 = forWithIndex_3(filterWithKey(ordCardinalDirection)((v$1) => isOutput)(v.ports))((dir2) => (port2) => {
          const $32 = $Maybe(
            "Just",
            {
              connected: false,
              signal: (() => {
                const $33 = lookup2(ordCardinalDirection)(dir2)(outputs);
                if ($33.tag === "Nothing") {
                  return uintSemiring.zero;
                }
                if ($33.tag === "Just") {
                  return $33._1;
                }
                fail();
              })(),
              port: port2
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
      return (inputs) => Bind1.bind(MonadAsk0.Monad0().Bind1().Apply0().Functor0().map((x2) => x2.evalOrder)(ask1))((evalOrder) => Bind1.bind(injectInputs2(inputs))(() => Bind1.bind(traverse_17(evalWithPortInfoAt2)(evalOrder))(() => extractOutputs2)));
    };
  };
  var evalWithPortInfo1 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT2));
  var evaluableBoardPiece = (v) => ({
    complexity: { space: 0, time: 0 },
    eval: (inputs) => evalWithPortInfo1(inputs)(v)(Leaf)._1,
    isSimplifiable: Nothing,
    name: "evaluable",
    ports: getPorts1(v),
    shouldRipple: false,
    updateCapacity: (v1) => (v2) => Nothing,
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
    return (psuedoPiecePorts) => evalStateT(Functor0)(bindStateT2.bind(forWithIndex_3(psuedoPiecePorts)((dir2) => (port2) => bindStateT2.bind(getBoardEdgePseudoLocation2(dir2))((loc) => {
      const $1 = $Maybe(
        "Just",
        {
          piece: psuedoPiece(port2),
          rotation: (() => {
            if (dir2 === "Up") {
              return 1;
            }
            if (dir2 === "Right") {
              return 2;
            }
            if (dir2 === "Down") {
              return 3;
            }
            if (dir2 === "Left") {
              return 0;
            }
            fail();
          })()
        }
      );
      return $$void((() => {
        const $2 = _pieces3(at1(loc)(strongFn)((v) => $1));
        return monadStateStateT12.state((s) => {
          const s$p = $2(s);
          return $Tuple(s$p, s$p);
        });
      })());
    })))(() => bindStateT2.bind((() => {
      const $1 = functorMap.map((v) => v.piece);
      const $2 = monadStateStateT12.state((s) => $Tuple(_pieces12(identity8)(s), s));
      return (s) => Functor0.map((v1) => $Tuple($1(v1._1), v1._2))($2(s));
    })())((pieces) => bindStateT2.bind(buildConnectionMap2)((connections) => bindStateT2.bind($0((dir2) => (v) => getBoardEdgePseudoLocation2(dir2))(psuedoPiecePorts))((psuedoPieceLocations) => bindStateT2.bind((() => {
      const $1 = monadThrowStateT(MonadThrow0).throwError(Cyclic);
      const $2 = topologicalSort(fromFoldable12(keys2(pieces)))(connections);
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

  // output-es/Game.Level.Completion/index.js
  var $CompletionStatus = (tag, _1) => ({ tag, _1 });
  var $PortMismatch = (tag, _1) => ({ tag, _1 });
  var for_2 = /* @__PURE__ */ for_(applicativeEither)(foldableArray);
  var NotStarted = /* @__PURE__ */ $CompletionStatus("NotStarted");
  var ReadyForTesting = /* @__PURE__ */ $CompletionStatus("ReadyForTesting");
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
    const $0 = isPortMismatch(dir2)(lookup2(ordCardinalDirection)(dir2)(problem.goal.ports))(lookup2(ordCardinalDirection)(dir2)(evaluable.ports));
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
    return (x2) => {
      const $1 = $0(x2);
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
      const $0 = (state3, step4) => {
        if (step4.tag === "Loop") {
          if (gas === 0) {
            return more((v1$1) => loop(state3, step4._1, 30));
          }
          return loop(state3, step4._1, gas - 1 | 0);
        }
        if (step4.tag === "Done") {
          const $02 = step4._1;
          return more((v2) => done(state3, reverse(fromFoldableImpl(foldableList.foldr, $02))));
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
      const v = uncons(before);
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
    const v3 = uncons(v._1);
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
  var string = (str) => consumeWith((input) => {
    const v = stripPrefix(str)(input);
    if (v.tag === "Just") {
      return $Either("Right", { value: str, consumed: str, remainder: v._1 });
    }
    return $Either("Left", "Expected " + showStringImpl(str));
  });

  // output-es/Data.CodePoint.Unicode/index.js
  var isDecDigit = (c) => {
    const diff = c - 48 | 0;
    return diff <= 9 && diff >= 0;
  };

  // output-es/Parsing.String.Basic/index.js
  var satisfyCP = (p) => satisfy((x2) => p(toCharCode(x2)));
  var digit = /* @__PURE__ */ withErrorMessage(/* @__PURE__ */ satisfyCP(isDecDigit))("digit");

  // output-es/Component.DataAttribute/index.js
  var choice2 = /* @__PURE__ */ choice(foldableArray);
  var direction = {
    attrName: "data-direction",
    attrPrint: (x2) => toLower((() => {
      if (x2 === "Up") {
        return "Up";
      }
      if (x2 === "Right") {
        return "Right";
      }
      if (x2 === "Down") {
        return "Down";
      }
      if (x2 === "Left") {
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
  var y = /* @__PURE__ */ (() => {
    const $0 = Attribute(Nothing)("y");
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
  var offset = /* @__PURE__ */ Attribute(Nothing)("offset");
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

  // output-es/Halogen.Svg.Attributes.Baseline/index.js
  var $Baseline = (tag) => tag;
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
  function button(e) {
    return e.button;
  }

  // output-es/Component.Multimeter/index.js
  var $Action4 = (tag, _1) => ({ tag, _1 });
  var $Output2 = (_1, _2) => ({ tag: "SetCapacity", _1, _2 });
  var $Query2 = (tag, _1, _2) => ({ tag, _1, _2 });
  var power3 = /* @__PURE__ */ power(monoidString);
  var modify_ = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var gets = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var for_3 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var traverse_5 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var NewFocus = (value0) => (value1) => $Query2("NewFocus", value0, value1);
  var SetSignal = (value0) => (value1) => $Query2("SetSignal", value0, value1);
  var Initialise2 = /* @__PURE__ */ $Action4("Initialise");
  var initialState2 = (v) => ({ focus: Nothing, display: false, currentPosition: { x: 0, y: 0 } });
  var defaultValues = ["--------", "---", "----", "----"];
  var multimeterText = /* @__PURE__ */ (() => {
    const $0 = zipWith(apply)([
      (() => {
        const $02 = "BIN" + power3(" ")(5);
        return ($1) => $02 + $1;
      })(),
      (() => {
        const $02 = "DEC" + power3(" ")(10);
        return ($1) => $02 + $1;
      })(),
      ($02) => "Capacity:   " + $02,
      ($02) => "Connected:  " + $02
    ]);
    return (x2) => $0((() => {
      if (x2.tag === "Nothing") {
        return defaultValues;
      }
      if (x2.tag === "Just") {
        return ["FIX ME"];
      }
      fail();
    })());
  })();
  var component4 = (dictMonadEffect) => {
    const $0 = monadEffectHalogenM(dictMonadEffect);
    return {
      eval: mkEval({
        ...defaultEval,
        initialize: $Maybe("Just", Initialise2),
        handleAction: (v1) => {
          if (v1.tag === "Initialise") {
            const $1 = $0.liftEffect(globalMouseMoveEventEmitter);
            return $Free(
              $1._1,
              snoc2($1._2)((mouseMoveEmitter) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Subscribe", (v) => (k) => mouseMoveEmitter((x2) => k($Action4("GlobalMouseMove", x2))), identity12),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc2(snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil)))(() => {
                  const $2 = $0.liftEffect(globalKeyDownEventEmitter);
                  return $Free(
                    $2._1,
                    snoc2($2._2)((keyDownEmitter) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Subscribe", (v) => (k) => keyDownEmitter((x2) => k($Action4("GlobalKeyDown", x2))), identity12),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
                      ),
                      snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
                    ))
                  );
                })
              ))
            );
          }
          if (v1.tag === "GlobalMouseMove") {
            const $1 = v1._1;
            const $2 = modify_((v2) => ({ ...v2, currentPosition: { x: pageX($1), y: pageY($1) } }));
            return $Free(
              $2._1,
              snoc2($2._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v1.tag === "GlobalKeyDown") {
            const $1 = modify_((s) => ({ ...s, display: !s.display }));
            if (key(v1._1) === "s") {
              return $Free(
                $1._1,
                snoc2($1._2)(() => {
                  const $2 = gets((v2) => v2.focus);
                  const $3 = $Free(
                    $2._1,
                    snoc2($2._2)((maybeFocus) => for_3(maybeFocus)((v2) => {
                      const v3 = key(v1._1);
                      if (v3 === "1") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "2") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "3") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (v3 === "4") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      return $Free($FreeView("Return", void 0), CatNil);
                    }))
                  );
                  if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                    return $3;
                  }
                  return $Free($FreeView("Return", void 0), CatNil);
                })
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc2(CatNil)(() => {
                const $2 = gets((v2) => v2.focus);
                const $3 = $Free(
                  $2._1,
                  snoc2($2._2)((maybeFocus) => for_3(maybeFocus)((v2) => {
                    const v3 = key(v1._1);
                    if (v3 === "1") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, OneBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "2") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, TwoBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "3") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, FourBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    if (v3 === "4") {
                      return $Free(
                        $FreeView(
                          "Bind",
                          $HalogenF("Raise", $Output2(v2.relativeEdge, EightBit), void 0),
                          (x2) => $Free($FreeView("Return", x2), CatNil)
                        ),
                        CatNil
                      );
                    }
                    return $Free($FreeView("Return", void 0), CatNil);
                  }))
                );
                if (elem(eqString)(key(v1._1))(["1", "2", "3", "4"])) {
                  return $3;
                }
                return $Free($FreeView("Return", void 0), CatNil);
              })
            );
          }
          fail();
        },
        handleQuery: (v1) => {
          if (v1.tag === "NewFocus") {
            const $1 = v1._1;
            const $2 = v1._2;
            const $3 = modify_((v2) => ({ ...v2, focus: $1 }));
            return $Free(
              $3._1,
              snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $2)), CatNil))
            );
          }
          if (v1.tag === "SetSignal") {
            const $1 = v1._2;
            const $2 = v1._1;
            const $3 = gets((v2) => v2.focus);
            return $Free(
              $3._1,
              snoc2(snoc2($3._2)(traverse_5((focus2) => modify_((v2) => ({ ...v2, focus: $Maybe("Just", { ...focus2, info: { ...focus2.info, signal: $2 } }) })))))(() => $Free($FreeView("Return", $Maybe("Just", $1)), CatNil))
            );
          }
          fail();
        }
      }),
      initialState: initialState2,
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
  var $Query3 = (tag, _1, _2) => ({ tag, _1, _2 });
  var SetPortStates = (value0) => (value1) => $Query3("SetPortStates", value0, value1);
  var SetPiece = (value0) => (value1) => $Query3("SetPiece", value0, value1);
  var SetRotation = (value0) => (value1) => $Query3("SetRotation", value0, value1);
  var OnDrop = (value0) => (value1) => $Action5("OnDrop", value0, value1);
  var PortOnMouseLeave = /* @__PURE__ */ $Action5("PortOnMouseLeave");
  var initialState3 = (v) => ({
    piece: v.piece,
    location: v.location,
    rotation: 0,
    isRotating: Nothing,
    isDragging: false,
    portStates: functorMap.map((port2) => ({ port: port2, signal: uintSemiring.zero, connected: false }))(v.piece.ports)
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
  var clamp = (low) => (hi) => (x2) => {
    const v = ordInt.compare(low)(x2);
    const $0 = (() => {
      if (v === "LT") {
        return x2;
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
  var identity16 = (x2) => x2;
  var intercalate2 = (sep) => (xs) => foldlArray((v) => (v1) => {
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
  var portColor = (port2) => (signal) => (uintEq(signal)(uintSemiring.zero) ? shadeColor(-30) : identity16)((() => {
    const v = portCapacity(port2);
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
    const id4 = intercalate2("-")([
      "port-gradient",
      isInput(v.port) ? "in" : "out",
      uintEq(v.signal)(uintSemiring.zero) ? "off" : "on",
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
  var tell2 = /* @__PURE__ */ (() => monadTellWriterT(monoidArray)(monadIdentity).tell)();
  var applicativeWriterT3 = /* @__PURE__ */ applicativeWriterT(monoidArray)(applicativeIdentity);
  var for_4 = /* @__PURE__ */ for_(applicativeWriterT3)(foldableMaybe);
  var toUnfoldable4 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeWriterT3)(foldableArray);
  var show2 = /* @__PURE__ */ (() => showMap(showCardinalDirection)({
    show: (record2) => (record2.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record2.port) + ", signal: " + showSignal.show(record2.signal) + " }"
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
  var betweenPath = (to) => (from2) => {
    const v = sub1((() => {
      if (from2 === "Up") {
        return $Tuple(35, 25);
      }
      if (from2 === "Right") {
        return $Tuple(75, 35);
      }
      if (from2 === "Down") {
        return $Tuple(65, 75);
      }
      if (from2 === "Left") {
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
    if (from2 === "Up") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from2 === "Right") {
      return [renderCommand4Args("q")(Rel)(0)(v._2)(v._1)(v._2)];
    }
    if (from2 === "Down") {
      return [renderCommand4Args("q")(Rel)(v._1)(0)(v._1)(v._2)];
    }
    if (from2 === "Left") {
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
    const info3 = (() => {
      if ($0.tag === "Nothing") {
        return _crashWith("assertion failed: wire path created with no inputs. ports: " + show2(ports));
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    return {
      path: for_4(unconsImpl((v) => Nothing, (x2) => (xs) => $Maybe("Just", { head: x2, tail: xs }), toUnfoldable4(ports)))((v) => {
        if (v.head._1 === "Up") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell2([
            renderCommand2Args("m")(Rel)(35)(25)
          ]))(() => traverse_6((v$1) => tell2([
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
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Right") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell2([
            renderCommand2Args("m")(Rel)(75)(35)
          ]))(() => traverse_6((v$1) => tell2([
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
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Down") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell2([
            renderCommand2Args("m")(Rel)(65)(75)
          ]))(() => traverse_6((v$1) => tell2([
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
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        if (v.head._1 === "Left") {
          return bindWriterT(semigroupArray)(bindIdentity).bind(tell2([
            renderCommand2Args("m")(Rel)(25)(65)
          ]))(() => traverse_6((v$1) => tell2([
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
          ]))(zipWithImpl(Tuple, toUnfoldable4(ports), arrayMap(fst)([...v.tail, v.head]))));
        }
        fail();
      })._2,
      gradient: createPortGradient(info3),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info3.connected)
      )
    };
  };
  var renderWire = (portStates) => renderPathWithEvents(wirePath(portStates))($Action5(
    "PortOnMouseEnter",
    (() => {
      const $0 = findWithIndex(foldableWithIndexMap)((v) => (info3) => isInput(info3.port))(portStates);
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
  var elem2 = /* @__PURE__ */ (() => {
    const any1 = foldableArray.foldMap((() => {
      const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
      return { mempty: false, Semigroup0: () => semigroupDisj1 };
    })());
    return (x2) => any1((y2) => {
      if (x2 === "Up") {
        return y2 === "Up";
      }
      if (x2 === "Right") {
        return y2 === "Right";
      }
      if (x2 === "Down") {
        return y2 === "Down";
      }
      return x2 === "Left" && y2 === "Left";
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
        renderPathWithEvents(wirePath(filterKeys(ordCardinalDirection)((v2) => elem2(v2)([
          $2,
          $0
        ]))(portStates)))($Action5("PortOnMouseEnter", $0))(PortOnMouseLeave),
        renderPathWithEvents(wirePath(filterKeys(ordCardinalDirection)((v2) => elem2(v2)([
          $3,
          $1
        ]))(portStates)))($Action5("PortOnMouseEnter", $1))(PortOnMouseLeave)
      ]
    );
  };

  // output-es/Component.Rendering.Port/index.js
  var portPath = (info3) => {
    if (portType(info3.port) === "Input") {
      return {
        path: [
          renderCommand2Args("m")(Rel)(40)(0),
          ...(() => {
            const v2 = portType(info3.port);
            if (v2 === "Input") {
              return arrowPath(Down);
            }
            if (v2 === "Output") {
              if (info3.connected) {
                return stubPath(Up);
              }
              return arrowPath(Up);
            }
            fail();
          })(),
          ...betweenPath(Up)(Up)
        ],
        gradient: createPortGradient(info3),
        attrs: $Prop(
          "Attribute",
          Nothing,
          isConnected.attrName,
          isConnected.attrPrint(info3.connected)
        )
      };
    }
    return {
      path: [
        renderCommand2Args("m")(Rel)(10)(25),
        ...(() => {
          const v2 = portType(info3.port);
          if (v2 === "Input") {
            return arrowPath(Down);
          }
          if (v2 === "Output") {
            if (info3.connected) {
              return stubPath(Up);
            }
            return arrowPath(Up);
          }
          fail();
        })(),
        ...betweenPath(Up)(Up)
      ],
      gradient: createPortGradient(info3),
      attrs: $Prop(
        "Attribute",
        Nothing,
        isConnected.attrName,
        isConnected.attrPrint(info3.connected)
      )
    };
  };

  // output-es/Game.Piece.WirePiece/index.js
  var ordSet2 = /* @__PURE__ */ ordSet(ordCardinalDirection);
  var show3 = /* @__PURE__ */ (() => showSet(showCardinalDirection).show)();
  var length4 = /* @__PURE__ */ (() => foldableSet.foldl((c) => (v) => 1 + c | 0)(0))();
  var fromFoldable13 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableSet);
  var fromFoldable23 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordCardinalDirection)(a)()(m))(Leaf);
  var fromFoldable32 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var wirePieceNames = /* @__PURE__ */ (() => fromFoldable(ordSet2)(foldableArray)([
    $Tuple($$$Map("Node", 1, 1, Up, void 0, Leaf, Leaf), "left-piece"),
    $Tuple($$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf), "id-piece"),
    $Tuple($$$Map("Node", 1, 1, Down, void 0, Leaf, Leaf), "right-piece"),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf, Leaf),
        $$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf)
      ),
      "intersection-left-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf, Leaf),
        $$$Map("Node", 1, 1, Down, void 0, Leaf, Leaf)
      ),
      "intersection-junction-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf),
        $$$Map("Node", 1, 1, Down, void 0, Leaf, Leaf)
      ),
      "intersection-right-piece"
    ),
    $Tuple(
      unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        $$$Map("Node", 1, 1, Up, void 0, Leaf, Leaf),
        unsafeUnionWith(
          ordCardinalDirection.compare,
          $$const,
          $$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf),
          $$$Map("Node", 1, 1, Down, void 0, Leaf, Leaf)
        )
      ),
      "super-piece"
    )
  ]))();
  var mkWirePiece = (wire) => ({
    complexity: { space: toNumber(length4(wire.outputs)), time: 0 },
    eval: (inputs) => {
      const $0 = lookup2(ordCardinalDirection)(Left2)(inputs);
      const $1 = (() => {
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return functorMap.map((v) => $1)(wire.outputs);
    },
    isSimplifiable: $Maybe(
      "Just",
      $Simplification(
        "Connection",
        fromFoldable13(map(ordTuple(ordCardinalDirection)(ordCardinalDirection))((out) => $Tuple(
          out,
          Left2
        ))(wire.outputs))
      )
    ),
    name: (() => {
      const $0 = lookup2(ordSet2)(wire.outputs)(wirePieceNames);
      if ($0.tag === "Nothing") {
        return _crashWith("Can't find wire piece with outputs: " + show3(wire.outputs));
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    ports: insert(ordCardinalDirection)(Left2)({ portType: Input, capacity: wire.capacity })(functorMap.map((v) => ({ portType: Output, capacity: wire.capacity }))(wire.outputs)),
    shouldRipple: true,
    updateCapacity: (v) => (capacity) => $Maybe("Just", mkWirePiece({ ...wire, capacity })),
    updatePort: (dir2) => (portType2) => {
      if (dir2 === "Left") {
        return Nothing;
      }
      if (portType2.tag === "Just") {
        if (portType2._1 === "Input") {
          const newOutputs = insert(ordCardinalDirection)(dir2)()(wire.outputs);
          if (!eqMap(eqCardinalDirection)(eqUnit).eq(wire.outputs)(newOutputs)) {
            return $Maybe("Just", mkWirePiece({ ...wire, outputs: newOutputs }));
          }
          return Nothing;
        }
        if (portType2._1 === "Output") {
          return Nothing;
        }
        fail();
      }
      if (portType2.tag === "Nothing") {
        const newOutputs = $$delete(ordCardinalDirection)(dir2)(wire.outputs);
        if (!eqMap(eqCardinalDirection)(eqUnit).eq(wire.outputs)(newOutputs)) {
          if (newOutputs.tag === "Leaf") {
            return $Maybe(
              "Just",
              mkWirePiece({ ...wire, outputs: $$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf) })
            );
          }
          return $Maybe("Just", mkWirePiece({ ...wire, outputs: newOutputs }));
        }
        return Nothing;
      }
      fail();
    }
  });
  var rightPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable23([Down]) });
  var superPiece = /* @__PURE__ */ mkWirePiece({
    capacity: OneBit,
    outputs: /* @__PURE__ */ fromFoldable23([Up, Right2, Down])
  });
  var leftPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable23([Up]) });
  var isWirePiece = (piece) => {
    const $0 = piece.name;
    const go = (v) => {
      if (v.tag === "Leaf") {
        return false;
      }
      if (v.tag === "Node") {
        return go(v._5) || $0 === v._4 || go(v._6);
      }
      fail();
    };
    return go(wirePieceNames);
  };
  var idPiece = /* @__PURE__ */ mkWirePiece({ capacity: OneBit, outputs: /* @__PURE__ */ fromFoldable23([Right2]) });
  var dualWirePiece = (dualWire) => ({
    complexity: { space: 0, time: 0 },
    eval: (m) => fromFoldable32([
      $Tuple(
        dualWire.output1,
        (() => {
          const $0 = lookup2(ordCardinalDirection)(Left2)(m);
          if ($0.tag === "Nothing") {
            return uintSemiring.zero;
          }
          if ($0.tag === "Just") {
            return $0._1;
          }
          fail();
        })()
      ),
      $Tuple(
        dualWire.output2,
        (() => {
          const $0 = lookup2(ordCardinalDirection)(dualWire.input2)(m);
          if ($0.tag === "Nothing") {
            return uintSemiring.zero;
          }
          if ($0.tag === "Just") {
            return $0._1;
          }
          fail();
        })()
      )
    ]),
    isSimplifiable: $Maybe(
      "Just",
      $Simplification(
        "Connection",
        fromFoldable32([$Tuple(dualWire.output1, Left2), $Tuple(dualWire.output2, dualWire.input2)])
      )
    ),
    name: dualWire.name,
    ports: fromFoldable32([
      $Tuple(Left2, { portType: Input, capacity: dualWire.capacity }),
      $Tuple(dualWire.input2, { portType: Input, capacity: dualWire.capacity }),
      $Tuple(dualWire.output1, { portType: Output, capacity: dualWire.capacity }),
      $Tuple(dualWire.output2, { portType: Output, capacity: dualWire.capacity })
    ]),
    shouldRipple: false,
    updateCapacity: (v) => (capacity) => $Maybe("Just", dualWirePiece({ ...dualWire, capacity })),
    updatePort: (v) => (v1) => Nothing
  });
  var reverseChickenPiece = /* @__PURE__ */ dualWirePiece({
    name: "reverse-chicken-piece",
    capacity: OneBit,
    output1: Right2,
    input2: Up,
    output2: Down
  });
  var crossPiece = /* @__PURE__ */ dualWirePiece({
    name: "cross-piece",
    capacity: OneBit,
    output1: Right2,
    input2: Up,
    output2: Down
  });
  var cornerCutPiece = /* @__PURE__ */ dualWirePiece({
    name: "corner-cut-piece",
    capacity: OneBit,
    output1: Down,
    input2: Up,
    output2: Right2
  });
  var chickenPiece = /* @__PURE__ */ dualWirePiece({
    name: "chicken-piece",
    capacity: OneBit,
    output1: Down,
    input2: Right2,
    output2: Up
  });
  var allWirePieces = [idPiece, leftPiece, rightPiece, superPiece, crossPiece, cornerCutPiece, chickenPiece, reverseChickenPiece];

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
              $Transform(
                "Rotate",
                toNumber((() => {
                  if (dir2 === "Up") {
                    return 0;
                  }
                  if (dir2 === "Right") {
                    return 1;
                  }
                  if (dir2 === "Down") {
                    return 2;
                  }
                  if (dir2 === "Left") {
                    return 3;
                  }
                  fail();
                })()) * 90,
                50,
                50
              ),
              $Transform("Translate", 25, 0)
            ])
          ],
          arrayBind(fromFoldableImpl(
            foldableMaybe.foldr,
            lookup2(ordCardinalDirection)(dir2)(state.portStates)
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
            if (isWirePiece(state.piece)) {
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

  // output-es/Halogen.HTML/index.js
  var slot_ = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (component16) => (input) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p)(component16)(input)((v) => Nothing))
    );
  };
  var slot = () => (dictIsSymbol) => (dictOrd) => {
    const componentSlot2 = componentSlot()(dictIsSymbol)(dictOrd);
    return (label) => (p) => (component16) => (input) => (outputQuery) => $VDom(
      "Widget",
      $ComponentSlot("ComponentSlot", componentSlot2(label)(p)(component16)(input)((x2) => $Maybe("Just", outputQuery(x2))))
    );
  };
  var lazy = (f) => (a) => $VDom("Widget", $ComponentSlot("ThunkSlot", thunk1(f, a)));

  // output-es/Halogen.HTML.Properties.Extras/index.js
  var contentEditable2 = /* @__PURE__ */ Property("contentEditable");

  // output-es/Component.Piece/index.js
  var modify_2 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var traverse_7 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var sub12 = /* @__PURE__ */ (() => ringTuple(ringNumber)(ringNumber).sub)();
  var gets2 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
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
              snoc2($2._2)(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output3("Dropped", $1), void 0),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                CatNil
              ))
            );
          }
          if (v.tag === "OnDrag") {
            const $1 = modify_2((v1) => ({ ...v1, isDragging: true }));
            return $Free(
              $1._1,
              snoc2($1._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v.tag === "OnMouseDown") {
            const $1 = v._1;
            const $2 = getHTMLElementRef("piece");
            return $Free(
              $2._1,
              snoc2($2._2)(traverse_7((he) => {
                const $3 = $0.liftEffect((() => {
                  const $32 = clientWidth(he);
                  return () => {
                    const a$p = $32();
                    return 0.5 * a$p;
                  };
                })());
                return $Free(
                  $3._1,
                  snoc2($3._2)((r) => {
                    const $4 = $0.liftEffect((() => {
                      const $42 = getBoundingClientRect(he);
                      return () => {
                        const bb = $42();
                        return $Tuple((bb.right + bb.left) / 2, (bb.bottom + bb.top) / 2);
                      };
                    })());
                    return $Free(
                      $4._1,
                      snoc2($4._2)((c) => {
                        const v1 = sub12($Tuple(toNumber(clientX($1)), toNumber(clientY($1))))(c);
                        if (r * r > v1._1 * v1._1 + v1._2 * v1._2) {
                          return modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                        }
                        const $5 = $0.liftEffect(setDraggable(false)(he));
                        return $Free(
                          $5._1,
                          snoc2($5._2)(() => {
                            const $6 = gets2((v2) => v2.rotation);
                            return $Free(
                              $6._1,
                              snoc2($6._2)((rotation) => modify_2((v2) => ({
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
          if (v.tag === "OnAuxClick") {
            const $1 = gets2((v1) => v1.location);
            return $Free(
              $1._1,
              snoc2($1._2)((loc) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output3("Dropped", loc), void 0),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                CatNil
              ))
            );
          }
          if (v.tag === "OnMouseMove") {
            const $1 = v._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("GetRef", "piece", identity12),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc2(CatNil)(traverse_7((e) => {
                const $2 = gets2((v1) => v1.isRotating);
                return $Free(
                  $2._1,
                  snoc2($2._2)(traverse_7((v1) => {
                    const $3 = v1.initialClickPosition;
                    const $4 = gets2((v2) => v2.rotation);
                    return $Free(
                      $4._1,
                      snoc2($4._2)((rotation) => {
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
                          snoc2($5._2)((c) => {
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
            const $1 = gets2((v1) => v1.isRotating);
            return $Free(
              $1._1,
              snoc2($1._2)(traverse_7((v1) => {
                const closestSnapPoint = unsafeClamp(round(4 * v1.currentRotation / 6.283185307179586)) & 3;
                const $2 = gets2((v2) => v2.rotation);
                return $Free(
                  $2._1,
                  snoc2($2._2)((rotation) => {
                    const $3 = gets2((v2) => v2.location);
                    return $Free(
                      $3._1,
                      snoc2($3._2)((location3) => {
                        const $4 = modify_2((v2) => ({ ...v2, isRotating: Nothing }));
                        return $Free(
                          $4._1,
                          snoc2($4._2)(() => $Free(
                            $FreeView(
                              "Bind",
                              $HalogenF(
                                "Raise",
                                $Output3("Rotated", location3, (closestSnapPoint + (-rotation & 3) | 0) & 3),
                                void 0
                              ),
                              (x2) => $Free($FreeView("Return", x2), CatNil)
                            ),
                            CatNil
                          ))
                        );
                      })
                    );
                  })
                );
              }))
            );
          }
          if (v.tag === "OnKeyDown") {
            const $1 = gets2((v1) => v1.location);
            const $2 = snoc2($1._2)((loc) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Raise", $Output3("Rotated", loc, 1), void 0),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            ));
            if (key(v._1) === "r") {
              return $Free(
                $1._1,
                snoc2($2)(() => {
                  const $3 = gets2((v1) => v1.location);
                  const $4 = $Free(
                    $3._1,
                    snoc2($3._2)((loc) => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Raise", $Output3("Rotated", loc, 3), void 0),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
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
              snoc2(CatNil)(() => {
                const $3 = gets2((v1) => v1.location);
                const $4 = $Free(
                  $3._1,
                  snoc2($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("Raise", $Output3("Rotated", loc, 3), void 0),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
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
              snoc2($2._2)((portStates) => {
                const $3 = gets2((v1) => v1.location);
                return $Free(
                  $3._1,
                  snoc2($3._2)((loc) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "Raise",
                        $Output3(
                          "NewMultimeterFocus",
                          (() => {
                            const $4 = lookup2(ordCardinalDirection)($1)(portStates);
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
                      (x2) => $Free($FreeView("Return", x2), CatNil)
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
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          fail();
        },
        handleQuery: (v) => {
          if (v.tag === "SetPortStates") {
            const $1 = v._2;
            const $2 = v._1;
            const $3 = modify_2((v1) => ({ ...v1, portStates: $2 }));
            return $Free(
              $3._1,
              snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $1)), CatNil))
            );
          }
          if (v.tag === "SetPiece") {
            const $1 = v._2;
            const $2 = v._1;
            const $3 = modify_2((v1) => ({ ...v1, piece: $2 }));
            return $Free(
              $3._1,
              snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $1)), CatNil))
            );
          }
          if (v.tag === "SetRotation") {
            const $1 = v._2;
            const $2 = v._1;
            const $3 = modify_2((v1) => ({ ...v1, rotation: $2 }));
            return $Free(
              $3._1,
              snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $1)), CatNil))
            );
          }
          fail();
        },
        initialize: Nothing,
        receive: (v) => Nothing
      }),
      initialState: initialState3,
      render: lazy((state) => $VDom(
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
          draggable2((() => {
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
            (x2) => $Maybe(
              "Just",
              $Input(
                "RefUpdate",
                "piece",
                (() => {
                  if (x2.tag === "Created") {
                    return $Maybe("Just", x2._1);
                  }
                  if (x2.tag === "Removed") {
                    return Nothing;
                  }
                  fail();
                })()
              )
            )
          ),
          contentEditable2(true),
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
          $Prop(
            "Handler",
            "mouseup",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnMouseUp", ev)))
          ),
          $Prop(
            "Handler",
            "keydown",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnKeyDown", ev)))
          ),
          $Prop(
            "Handler",
            "auxclick",
            (ev) => $Maybe("Just", $Input("Action", $Action5("OnAuxClick", ev)))
          )
        ],
        [renderPiece(state)]
      ))
    };
  };

  // output-es/Debug/foreign.js
  var req = typeof module === "undefined" ? void 0 : module.require;
  var util = function() {
    try {
      return req === void 0 ? void 0 : req("util");
    } catch (e) {
      return void 0;
    }
  }();
  function _trace(x2, k) {
    if (util !== void 0) {
      console.log(util.inspect(x2, { depth: null, colors: true }));
    } else {
      console.log(x2);
    }
    return k({});
  }
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
    return (v) => (portType2) => {
      const $0 = v.dir;
      const $1 = v.loc;
      return Monad0.Bind1().bind((() => {
        const $2 = at3($1)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($2(identity8))(s), s));
      })())(traverse_17((info3) => for_8(info3.piece.updatePort($0)(portType2))((piece) => _trace(
        showEdge.show({ dir: $0, loc: $1 }),
        (v1) => $$void((() => {
          const $2 = _pieces13(ix2($1)(strongFn)(choiceFn)(prop({ reflectSymbol: () => "piece" })()()($$Proxy)(strongFn)((v$1) => piece)));
          return dictMonadState.state((s) => {
            const s$p = $2(s);
            return $Tuple(s$p, s$p);
          });
        })())
      ))));
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
  var setBoardSize = (dictMonadState) => {
    const $$get2 = dictMonadState.state((s) => $Tuple(s, s));
    return (dictMonadError) => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1();
      return (n) => $0.bind($$get2)((v) => {
        const $1 = v.pieces;
        const $2 = v.size;
        return $0.bind((n & 1) === 0 || n < 3 || n > 9 ? MonadThrow0.throwError($BoardError("BadBoardSize", n)) : MonadThrow0.Monad0().Applicative0().pure(n))((newSize) => {
          const dSize = intDiv(-(newSize - $2 | 0), 2);
          const firstPieceOusideSquare = find(foldableSet)((x2) => !all2((() => {
            const $3 = newSize - 1 | 0;
            return (x$1) => {
              if (x$1 < 0) {
                return false;
              }
              return x$1 <= $3;
            };
          })())([x2.x - dSize | 0, x2.y - dSize | 0]))(keys2($1));
          if (firstPieceOusideSquare.tag === "Just") {
            return MonadThrow0.throwError($BoardError("LocationOccupied", firstPieceOusideSquare._1));
          }
          if (firstPieceOusideSquare.tag === "Nothing") {
            const $3 = { size: newSize, pieces: unsafeMapKey(($32) => ({ x: $32.x - dSize | 0, y: $32.y - dSize | 0 }))($1) };
            return dictMonadState.state((v$1) => $Tuple(void 0, $3));
          }
          fail();
        });
      });
    };
  };
  var movePiece = (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const Bind1 = Monad0.Bind1();
    const $0 = Monad0.Applicative0();
    return (dictMonadState) => {
      const $$void = dictMonadState.Monad0().Bind1().Apply0().Functor0().map((v) => {
      });
      const assign4 = (p, b) => $$void((() => {
        const $1 = p((v) => b);
        return dictMonadState.state((s) => {
          const s$p = $1(s);
          return $Tuple(s$p, s$p);
        });
      })());
      const updatePortsAround1 = updatePortsAround(dictMonadState);
      return (src2) => (dst) => Bind1.bind((() => {
        const $1 = at3(src2)(strongForget);
        return dictMonadState.state((s) => $Tuple(_pieces4($1(identity8))(s), s));
      })())((v) => {
        if (v.tag === "Just") {
          const $1 = v._1;
          return Bind1.bind((() => {
            const $2 = MonadThrow0.throwError($BoardError("LocationOccupied", dst));
            return Monad0.Bind1().bind(Bind1.Apply0().Functor0().map(isJust)((() => {
              const $3 = at3(dst)(strongForget);
              return dictMonadState.state((s) => $Tuple(_pieces4($3(identity8))(s), s));
            })()))((b) => {
              if (b) {
                return $2;
              }
              return $0.pure();
            });
          })())(() => Bind1.bind((() => {
            const $2 = at3(src2)(strongFn);
            return assign4((x2) => _pieces13($2(x2)), Nothing);
          })())(() => Bind1.bind((() => {
            const $2 = at3(dst)(strongFn);
            return assign4((x2) => _pieces13($2(x2)), $Maybe("Just", $1));
          })())(() => Bind1.bind(updatePortsAround1(src2))(() => Bind1.bind(updatePortsAround1(dst))(() => Monad0.Applicative0().pure($1))))));
        }
        if (v.tag === "Nothing") {
          return MonadThrow0.throwError($BoardError("LocationNotOccupied", src2));
        }
        fail();
      });
    };
  };
  var getPieceInfo = (dictMonadState) => (dictMonadError) => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const Monad0 = MonadThrow0.Monad0();
    const pure = Monad0.Applicative0().pure;
    return (loc) => Monad0.Bind1().bind((() => {
      const $0 = at3(loc)(strongForget);
      return dictMonadState.state((s) => $Tuple(_pieces4($0(identity8))(s), s));
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
        return dictMonadState.state((s) => $Tuple(_pieces4($0(identity8))(s), s));
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
          })()))(() => Monad0.Applicative0().pure($0));
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
    return (src2) => (maybeDst) => {
      if (maybeDst.tag === "Just") {
        return movePiece1(src2)(maybeDst._1);
      }
      if (maybeDst.tag === "Nothing") {
        return removePiece1(src2);
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
        const $0 = _pieces13(ix2(loc)(strongFn)(choiceFn)(prop({ reflectSymbol: () => "rotation" })()()($$Proxy)(strongFn)((a) => (a + rot | 0) & 3)));
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
        return dictMonadState.state((s) => $Tuple(_pieces4($0(identity8))(s), s));
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
      return (loc) => (piece) => dictMonadError.MonadThrow0().Monad0().Bind1().bind(addPieceNoUpdate2(loc)(piece)(0))(() => updatePortsAround1(loc));
    };
  };

  // output-es/Component.Board.Render/index.js
  var slot1 = /* @__PURE__ */ slot()({ reflectSymbol: () => "piece" })(ordLocation);
  var component6 = /* @__PURE__ */ component5(monadEffectAppM);
  var slot2 = /* @__PURE__ */ slot()({ reflectSymbol: () => "multimeter" })(ordUnit);
  var component1 = /* @__PURE__ */ component4(monadEffectAppM);
  var _size3 = /* @__PURE__ */ _size(strongForget);
  var intercalate3 = (sep) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: v.acc + sep + v1 };
  })({ init: true, acc: "" })(xs).acc;
  var boardPortInfo2 = /* @__PURE__ */ boardPortInfo(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var getPieceInfo2 = /* @__PURE__ */ getPieceInfo(/* @__PURE__ */ monadStateStateT({
    Applicative0: () => applicativeExceptT(monadIdentity),
    Bind1: () => bindExceptT(monadIdentity)
  }))(/* @__PURE__ */ monadErrorStateT(/* @__PURE__ */ monadErrorExceptT(monadIdentity)));
  var render = (state) => {
    const board = state.boardHistory._2;
    const n = _size3(identity8)(board);
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
        style(intercalate3("; ")(["grid-template-columns: " + gridTemplate, "grid-template-rows:    " + gridTemplate]))
      ],
      arrayBind([
        arrayBind(rangeImpl(0, n - 1 | 0))((i) => arrayBind(rangeImpl(0, n - 1 | 0))((j) => {
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
                style(intercalate3("; ")(["grid-area: " + showIntImpl(j + 2 | 0) + " / " + showIntImpl(i + 2 | 0)])),
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
                    return $VDom(
                      "Elem",
                      Nothing,
                      "div",
                      [class_("location-text")],
                      [$VDom("Text", showIntImpl(loc.x + 1 | 0) + "," + showIntImpl(loc.y + 1 | 0))]
                    );
                  }
                  if (eitherPieceInfo.tag === "Right") {
                    return slot1($$Proxy)(loc)(component6)({ piece: eitherPieceInfo._1.piece, location: loc })(PieceOutput);
                  }
                  fail();
                })()
              ]
            )
          ];
        })),
        fromFoldableImpl(
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
              style(intercalate3("; ")([
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
                          toNumber((() => {
                            if (dir2 === "Up") {
                              return 0;
                            }
                            if (dir2 === "Right") {
                              return 1;
                            }
                            if (dir2 === "Down") {
                              return 2;
                            }
                            if (dir2 === "Left") {
                              return 3;
                            }
                            fail();
                          })()) * 90 + 180,
                          25,
                          12.5
                        )
                      ])
                    ],
                    [
                      renderPathWithEvents(portPath(portInfo))($Action3("BoardPortOnMouseEnter", dir2))(BoardPortOnMouseLeave)
                    ]
                  )
                ]
              )
            ]
          ))(boardPortInfo2(state)._1)
        ),
        [slot2($$Proxy)()(component1)({})(MultimeterOutput)]
      ])(identity4)
    );
  };

  // output-es/Data.Lens.Internal.Wander/index.js
  var wanderFunction = { wander: (t) => t(applicativeIdentity), Strong0: () => strongFn, Choice1: () => choiceFn };

  // output-es/Game.Board.PathSegment/index.js
  var $PathSegmentError = (tag, _1, _2) => ({ tag, _1, _2 });
  var toUnfoldable5 = /* @__PURE__ */ (() => {
    const $0 = unfoldableArray.unfoldr(stepUnfoldr);
    return (x2) => $0($MapIter("IterNode", x2, IterLeaf));
  })();
  var fromFoldable5 = /* @__PURE__ */ (() => {
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
          go$a0 = insert(ordCardinalDirection)(v._1)()(b);
          go$a1 = v._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(Leaf);
  })();
  var fromFoldable14 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var isSubmap2 = /* @__PURE__ */ isSubmap(ordCardinalDirection)(eqCardinalDirection);
  var toPiece = (v) => {
    const v1 = toUnfoldable5(v);
    if (v1.length === 1) {
      const rotation = (() => {
        if (v1[0]._1 === "Up") {
          return 1;
        }
        if (v1[0]._1 === "Right") {
          return 2;
        }
        if (v1[0]._1 === "Down") {
          return 3;
        }
        if (v1[0]._1 === "Left") {
          return 0;
        }
        fail();
      })();
      return {
        piece: mkWirePiece({
          capacity: OneBit,
          outputs: $$$Map("Node", 1, 1, rotateDirection(v1[0]._2)(-rotation), void 0, Leaf, Leaf)
        }),
        rotation
      };
    }
    if (v1.length === 2) {
      const v4 = sortBy(ordInt.compare)([
        ((() => {
          if (v1[0]._2 === "Up") {
            return 0;
          }
          if (v1[0]._2 === "Right") {
            return 1;
          }
          if (v1[0]._2 === "Down") {
            return 2;
          }
          if (v1[0]._2 === "Left") {
            return 3;
          }
          fail();
        })() - (() => {
          if (v1[0]._1 === "Up") {
            return 0;
          }
          if (v1[0]._1 === "Right") {
            return 1;
          }
          if (v1[0]._1 === "Down") {
            return 2;
          }
          if (v1[0]._1 === "Left") {
            return 3;
          }
          fail();
        })() | 0) & 3,
        ((() => {
          if (v1[1]._2 === "Up") {
            return 0;
          }
          if (v1[1]._2 === "Right") {
            return 1;
          }
          if (v1[1]._2 === "Down") {
            return 2;
          }
          if (v1[1]._2 === "Left") {
            return 3;
          }
          fail();
        })() - (() => {
          if (v1[1]._1 === "Up") {
            return 0;
          }
          if (v1[1]._1 === "Right") {
            return 1;
          }
          if (v1[1]._1 === "Down") {
            return 2;
          }
          if (v1[1]._1 === "Left") {
            return 3;
          }
          fail();
        })() | 0) & 3
      ]);
      if (v4.length === 2) {
        if (v4[0] === 1) {
          if (v4[1] === 1) {
            return {
              piece: reverseChickenPiece,
              rotation: (() => {
                if (v1[0]._1 === "Up") {
                  return 1;
                }
                if (v1[0]._1 === "Right") {
                  return 0;
                }
                if (v1[0]._1 === "Down") {
                  return 1;
                }
                if (v1[0]._1 === "Left") {
                  return 0;
                }
                fail();
              })()
            };
          }
          if (v4[1] === 3) {
            return {
              piece: cornerCutPiece,
              rotation: (() => {
                if ((((() => {
                  if (v1[1]._1 === "Up") {
                    return 0;
                  }
                  if (v1[1]._1 === "Right") {
                    return 1;
                  }
                  if (v1[1]._1 === "Down") {
                    return 2;
                  }
                  if (v1[1]._1 === "Left") {
                    return 3;
                  }
                  fail();
                })() - (() => {
                  if (v1[0]._1 === "Up") {
                    return 0;
                  }
                  if (v1[0]._1 === "Right") {
                    return 1;
                  }
                  if (v1[0]._1 === "Down") {
                    return 2;
                  }
                  if (v1[0]._1 === "Left") {
                    return 3;
                  }
                  fail();
                })() | 0) & 3) === 1) {
                  if (v1[0]._1 === "Up") {
                    return 3;
                  }
                  if (v1[0]._1 === "Right") {
                    return 2;
                  }
                  if (v1[0]._1 === "Down") {
                    return 1;
                  }
                  if (v1[0]._1 === "Left") {
                    return 0;
                  }
                  fail();
                }
                if (v1[1]._1 === "Up") {
                  return 3;
                }
                if (v1[1]._1 === "Right") {
                  return 2;
                }
                if (v1[1]._1 === "Down") {
                  return 1;
                }
                if (v1[1]._1 === "Left") {
                  return 0;
                }
                fail();
              })()
            };
          }
          return _crashWith("couldn't create a piece");
        }
        if (v4[0] === 2) {
          if (v4[1] === 2) {
            return {
              piece: crossPiece,
              rotation: (() => {
                if ((((() => {
                  if (v1[1]._1 === "Up") {
                    return 0;
                  }
                  if (v1[1]._1 === "Right") {
                    return 1;
                  }
                  if (v1[1]._1 === "Down") {
                    return 2;
                  }
                  if (v1[1]._1 === "Left") {
                    return 3;
                  }
                  fail();
                })() - (() => {
                  if (v1[0]._1 === "Up") {
                    return 0;
                  }
                  if (v1[0]._1 === "Right") {
                    return 1;
                  }
                  if (v1[0]._1 === "Down") {
                    return 2;
                  }
                  if (v1[0]._1 === "Left") {
                    return 3;
                  }
                  fail();
                })() | 0) & 3) === 1) {
                  if (v1[0]._1 === "Up") {
                    return 1;
                  }
                  if (v1[0]._1 === "Right") {
                    return 0;
                  }
                  if (v1[0]._1 === "Down") {
                    return 1;
                  }
                  if (v1[0]._1 === "Left") {
                    return 0;
                  }
                  fail();
                }
                if (v1[1]._1 === "Up") {
                  return 1;
                }
                if (v1[1]._1 === "Right") {
                  return 0;
                }
                if (v1[1]._1 === "Down") {
                  return 1;
                }
                if (v1[1]._1 === "Left") {
                  return 0;
                }
                fail();
              })()
            };
          }
          return _crashWith("couldn't create a piece");
        }
        if (v4[0] === 3 && v4[1] === 3) {
          return {
            piece: chickenPiece,
            rotation: (() => {
              if (v1[0]._1 === "Up") {
                return 1;
              }
              if (v1[0]._1 === "Right") {
                return 0;
              }
              if (v1[0]._1 === "Down") {
                return 1;
              }
              if (v1[0]._1 === "Left") {
                return 0;
              }
              fail();
            })()
          };
        }
      }
    }
    return _crashWith("couldn't create a piece");
  };
  var pathSegment = (connections) => {
    if ((() => {
      const $0 = unsafeUnionWith(
        ordCardinalDirection.compare,
        $$const,
        keys2(connections),
        fromFoldable5(values(connections))
      );
      return (() => {
        if ($0.tag === "Leaf") {
          return 0;
        }
        if ($0.tag === "Node") {
          return $0._2;
        }
        fail();
      })() === (() => {
        if (connections.tag === "Leaf") {
          return 0;
        }
        if (connections.tag === "Node") {
          return connections._2 * 2 | 0;
        }
        fail();
      })();
    })()) {
      return $Either("Right", connections);
    }
    return $Either("Left", $PathSegmentError("InvalidPathSegment", connections));
  };
  var fromPiece = (v) => {
    if (v.piece.isSimplifiable.tag === "Just" && v.piece.isSimplifiable._1.tag === "Connection") {
      return pathSegment(fromFoldable14(arrayMap((v1) => $Tuple(
        rotateDirection(v1._2)(v.rotation),
        rotateDirection(v1._1)(v.rotation)
      ))(toUnfoldable5(v.piece.isSimplifiable._1._1))));
    }
    return $Either("Left", $PathSegmentError("NoSimplificationForPiece", v.piece));
  };
  var combine = (v) => (v1) => {
    const conn3 = unsafeUnionWith(ordCardinalDirection.compare, $$const, v, v1);
    if (isSubmap2(conn3)(v) || isSubmap2(conn3)(v1)) {
      return $Either("Left", $PathSegmentError("CantCombinePathSegments", v, v1));
    }
    return pathSegment(conn3);
  };
  var combineSegmentWithExtant = (segment2) => (x2) => {
    const $0 = (() => {
      if (x2.tag === "Nothing") {
        return $Either("Right", segment2);
      }
      if (x2.tag === "Just") {
        const $02 = fromPiece(x2._1);
        return (() => {
          if ($02.tag === "Left") {
            const $1 = $02._1;
            return (v) => $Either("Left", $1);
          }
          if ($02.tag === "Right") {
            const $1 = $02._1;
            return (f) => f($1);
          }
          fail();
        })()((extantPathSegment) => combine(segment2)(extantPathSegment));
      }
      fail();
    })();
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return $Either("Right", toPiece($0._1));
    }
    fail();
  };

  // output-es/Game.Board.Path/index.js
  var $PathError = (tag, _1, _2) => ({ tag, _1, _2 });
  var zipWithA2 = /* @__PURE__ */ zipWithA(applicativeEither);
  var and4 = /* @__PURE__ */ and(foldableMap)(heytingAlgebraBoolean);
  var _pieces5 = /* @__PURE__ */ _pieces(strongForget);
  var at4 = /* @__PURE__ */ (() => atMap(ordLocation).at)();
  var PathIsEmpty = /* @__PURE__ */ $PathError("PathIsEmpty");
  var updateEndPoints = (dictMonadState) => {
    const $0 = dictMonadState.Monad0().Bind1();
    const toRelativeEdge2 = toRelativeEdge(dictMonadState);
    const adjacentRelativeEdge2 = adjacentRelativeEdge(dictMonadState);
    const updateRelEdge2 = updateRelEdge(dictMonadState);
    return (path2) => $0.bind($0.bind(toRelativeEdge2({ loc: path2.start, dir: path2.initial }))(adjacentRelativeEdge2))((headAdj) => updateRelEdge2(headAdj)($Maybe(
      "Just",
      Input
    )));
  };
  var toPath = (initial) => (locations) => (terminal) => {
    const $0 = unconsImpl((v) => Nothing, (x2) => (xs) => $Maybe("Just", { head: x2, tail: xs }), locations);
    if ($0.tag === "Nothing") {
      return $Either("Left", PathIsEmpty);
    }
    if ($0.tag === "Just") {
      const $1 = $0._1.head;
      const $2 = zipWithA2((curr) => (prev) => {
        const $22 = directionTo(curr)(prev);
        if ($22.tag === "Nothing") {
          return $Either("Left", $PathError("LocationsAreNotAdjacent", curr, prev));
        }
        if ($22.tag === "Just") {
          return $Either("Right", $22._1);
        }
        fail();
      })(locations)($0._1.tail);
      return (() => {
        if ($2.tag === "Left") {
          const $3 = $2._1;
          return (v) => $Either("Left", $3);
        }
        if ($2.tag === "Right") {
          const $3 = $2._1;
          return (f) => f($3);
        }
        fail();
      })()((segments) => $Either("Right", { initial, start: $1, segments, terminal }));
    }
    fail();
  };
  var partitionPath = (v) => {
    const v1 = unconsImpl((v$1) => Nothing, (x2) => (xs) => $Maybe("Just", { head: x2, tail: xs }), v.segments);
    if (v1.tag === "Nothing") {
      const $0 = pathSegment($$$Map("Node", 1, 1, v.initial, v.terminal, Leaf, Leaf));
      if ($0.tag === "Left") {
        return $Either("Left", $PathError("PathSegmentError", $0._1));
      }
      if ($0.tag === "Right") {
        return $Either("Right", $$$Map("Node", 1, 1, v.start, $0._1, Leaf, Leaf));
      }
      fail();
    }
    if (v1.tag === "Just") {
      const $0 = pathSegment($$$Map("Node", 1, 1, v.initial, v1._1.head, Leaf, Leaf));
      if ($0.tag === "Left") {
        return $Either("Left", $PathError("PathSegmentError", $0._1));
      }
      if ($0.tag === "Right") {
        const $1 = insert(ordLocation)(v.start)($0._1);
        const $2 = partitionPath({
          initial: (() => {
            if (v1._1.head === "Up") {
              return Down;
            }
            if (v1._1.head === "Right") {
              return Left2;
            }
            if (v1._1.head === "Down") {
              return Up;
            }
            if (v1._1.head === "Left") {
              return Right2;
            }
            fail();
          })(),
          start: (() => {
            if (v1._1.head === "Up") {
              return { x: v.start.x, y: v.start.y - 1 | 0 };
            }
            if (v1._1.head === "Right") {
              return { x: v.start.x + 1 | 0, y: v.start.y };
            }
            if (v1._1.head === "Down") {
              return { x: v.start.x, y: v.start.y + 1 | 0 };
            }
            if (v1._1.head === "Left") {
              return { x: v.start.x - 1 | 0, y: v.start.y };
            }
            fail();
          })(),
          segments: v1._1.tail,
          terminal: v.terminal
        });
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return $Either("Right", $1($2._1));
        }
      }
    }
    fail();
  };
  var addPathToBoard = (dictMonadState) => (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    const Applicative0 = Monad0.Applicative0();
    const Bind1 = Monad0.Bind1();
    const Functor0 = Bind1.Apply0().Functor0();
    const $0 = traversableWithIndexMap.traverseWithIndex(Applicative0);
    const $$void = Functor0.map((v) => {
    });
    const removePieceNoUpdate2 = removePieceNoUpdate(dictMonadError)(dictMonadState);
    const addPieceNoUpdate2 = addPieceNoUpdate(dictMonadError)(dictMonadState);
    return (path2) => {
      const v = partitionPath(path2);
      if (v.tag === "Left") {
        return Applicative0.pure(false);
      }
      if (v.tag === "Right") {
        return Bind1.bind(Functor0.map(and4)($0((loc) => (segment2) => Bind1.bind((() => {
          const $1 = at4(loc)(strongForget);
          return dictMonadState.state((s) => $Tuple(_pieces5($1(identity8))(s), s));
        })())((extant) => {
          const v1 = combineSegmentWithExtant(segment2)(extant);
          if (v1.tag === "Left") {
            return Applicative0.pure(false);
          }
          if (v1.tag === "Right") {
            const $1 = v1._1.piece;
            const $2 = v1._1.rotation;
            return Bind1.bind(dictMonadError.catchError($$void(removePieceNoUpdate2(loc)))((v2) => Applicative0.pure()))(() => Bind1.bind(addPieceNoUpdate2(loc)($1)($2))(() => Applicative0.pure(true)));
          }
          fail();
        }))(v._1)))((res) => Applicative0.pure(res));
      }
      fail();
    };
  };
  var addPath = (dictMonadState) => {
    const $$get2 = dictMonadState.state((s) => $Tuple(s, s));
    const updateEndPoints1 = updateEndPoints(dictMonadState);
    return (dictMonadError) => {
      const Monad0 = dictMonadError.MonadThrow0().Monad0();
      const $0 = Monad0.Applicative0();
      const Bind1 = Monad0.Bind1();
      const addPathToBoard2 = addPathToBoard(dictMonadState)(dictMonadError);
      const $1 = Bind1.Apply0();
      return (initialDir) => (locations) => (terminalDir) => {
        const v = toPath(initialDir)(locations)(terminalDir);
        if (v.tag === "Left") {
          return $0.pure(false);
        }
        if (v.tag === "Right") {
          const $2 = v._1;
          return Bind1.bind($$get2)((board) => Bind1.bind(dictMonadError.catchError(addPathToBoard2($2))((v1) => $1.apply($1.Functor0().map((v$1) => identity)(dictMonadState.state((v$1) => $Tuple(
            void 0,
            board
          ))))($0.pure(false))))((b) => Bind1.bind(updateEndPoints1($2))(() => $0.pure(b))));
        }
        fail();
      };
    };
  };

  // output-es/Game.TestCase/index.js
  var eq = /* @__PURE__ */ (() => eqMap(eqCardinalDirection)(eqSignal).eq)();

  // output-es/Web.DOM.NonElementParentNode/foreign.js
  function _getElementById(id4) {
    return function(node) {
      return function() {
        return node.getElementById(id4);
      };
    };
  }

  // output-es/Web.DOM.NonElementParentNode/index.js
  var getElementById = (eid) => {
    const $0 = _getElementById(eid);
    return (x2) => {
      const $1 = $0(x2);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
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

  // output-es/Web.UIEvent.MouseEvent.Extras/index.js
  var $MouseButton = (tag) => tag;
  var Primary = /* @__PURE__ */ $MouseButton("Primary");
  var Secondary = /* @__PURE__ */ $MouseButton("Secondary");
  var Auxiliary = /* @__PURE__ */ $MouseButton("Auxiliary");
  var Button4 = /* @__PURE__ */ $MouseButton("Button4");
  var Button5 = /* @__PURE__ */ $MouseButton("Button5");
  var button2 = (me) => {
    const v = button(me);
    if (v === 0) {
      return Primary;
    }
    if (v === 1) {
      return Auxiliary;
    }
    if (v === 2) {
      return Secondary;
    }
    if (v === 3) {
      return Button4;
    }
    if (v === 4) {
      return Button5;
    }
    return _crashWith("No such button " + showIntImpl(v));
  };

  // output-es/Component.Board/index.js
  var monadErrorStateT2 = /* @__PURE__ */ monadErrorStateT(/* @__PURE__ */ monadErrorExceptT(monadIdentity));
  var monadExceptT = {
    Applicative0: () => applicativeExceptT(monadIdentity),
    Bind1: () => bindExceptT(monadIdentity)
  };
  var monadStateStateT3 = /* @__PURE__ */ monadStateStateT(monadExceptT);
  var addPiece2 = /* @__PURE__ */ addPiece(monadErrorStateT2)(monadStateStateT3);
  var headShake2 = /* @__PURE__ */ headShake(/* @__PURE__ */ monadAffHalogenM(monadAffAppM));
  var addPath2 = /* @__PURE__ */ addPath(monadStateStateT3)(monadErrorStateT2);
  var removePiece2 = /* @__PURE__ */ removePiece(monadErrorStateT2)(monadStateStateT3);
  var for_5 = /* @__PURE__ */ for_(freeApplicative);
  var for_1 = /* @__PURE__ */ for_5(foldableEither);
  var gets3 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var debug2 = /* @__PURE__ */ log$p(monadLoggerAppM)(Debug);
  var show4 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showPort).show)();
  var modify_3 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
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
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var at5 = /* @__PURE__ */ (() => atMap(ordCardinalDirection).at)();
  var setBoardSize2 = /* @__PURE__ */ setBoardSize(monadStateStateT3)(monadErrorStateT2);
  var for_22 = /* @__PURE__ */ for_5(foldableMaybe);
  var bind2 = /* @__PURE__ */ (() => bindStateT(monadExceptT).bind)();
  var _pieces6 = /* @__PURE__ */ _pieces(strongForget);
  var forWithIndex_1 = /* @__PURE__ */ forWithIndex_(/* @__PURE__ */ applicativeStateT(monadExceptT))(foldableWithIndexMap);
  var monadEffectHalogenM2 = /* @__PURE__ */ monadEffectHalogenM(monadEffectAppM);
  var traverse_8 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var rotatePieceBy2 = /* @__PURE__ */ rotatePieceBy(monadErrorStateT2)(monadStateStateT3);
  var pieceDropped2 = /* @__PURE__ */ pieceDropped(monadStateStateT3)(monadErrorStateT2);
  var warn2 = /* @__PURE__ */ log$p(monadLoggerAppM)(Warn);
  var pieceIsSymbol = { reflectSymbol: () => "piece" };
  var show22 = (v) => {
    if (v.tag === "Left") {
      return "(Left " + showBoardError.show(v._1) + ")";
    }
    if (v.tag === "Right") {
      return "(Right { piece: (Piece " + v._1.piece.name + "), rotation: Rotation " + showIntImpl(v._1.rotation * 90 | 0) + "\xB0 })";
    }
    fail();
  };
  var tell1 = /* @__PURE__ */ tell()({ reflectSymbol: () => "multimeter" })(ordUnit);
  var capacityRipple2 = /* @__PURE__ */ capacityRipple(monadStateStateT3);
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
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var ix3 = /* @__PURE__ */ (() => indexMap(ordCardinalDirection).ix)();
  var traverse_12 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var bind4 = /* @__PURE__ */ (() => bindMaybeT(freeMonad).bind)();
  var liftEffect1 = /* @__PURE__ */ (() => monadEffectMaybe(monadEffectHalogenM2).liftEffect)();
  var modify_1 = /* @__PURE__ */ (() => {
    const $0 = monadStateMaybeT(monadStateHalogenM);
    return (f) => $0.state((s) => $Tuple(void 0, f(s)));
  })();
  var appendModifying = (p) => (x2) => {
    const $0 = p((a) => [...a, ...x2]);
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
      snoc2(CatNil)((x$1) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var _wireLocations2 = /* @__PURE__ */ _wireLocations(wanderFunction);
  var buildEvaluableBoard2 = /* @__PURE__ */ buildEvaluableBoard(monadErrorEither);
  var monadStateStateT1 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var evalWithPortInfo2 = /* @__PURE__ */ evalWithPortInfo(/* @__PURE__ */ monadReaderReaderT({
    Applicative0: () => applicativeStateT(monadIdentity),
    Bind1: () => bindStateT(monadIdentity)
  }))(/* @__PURE__ */ monadStateReaderT(monadStateStateT1));
  var show42 = /* @__PURE__ */ (() => showMap(showCardinalDirection)(showSignal).show)();
  var show6 = (record2) => (record2.connected ? "{ connected: true, port: " : "{ connected: false, port: ") + showPort.show(record2.port) + ", signal: " + showSignal.show(record2.signal) + " }";
  var traverseWithIndex_2 = /* @__PURE__ */ traverseWithIndex_(freeApplicative)(foldableWithIndexMap);
  var tell22 = /* @__PURE__ */ tell()(pieceIsSymbol)(ordLocation);
  var getBoardPortEdge3 = /* @__PURE__ */ getBoardPortEdge(monadStateStateT1);
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
  var boundingBoxFromMouseEvent = (me) => {
    const $0 = nullable(_target(me), Nothing, Just);
    return traversableMaybe.traverse(applicativeEffect)(getBoundingClientRect)((() => {
      if ($0.tag === "Just") {
        return _unsafeReadProtoTagged(Nothing, Just, "Element", $0._1);
      }
      if ($0.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })());
  };
  var component7 = {
    eval: /* @__PURE__ */ (() => {
      const liftBoardM = (boardM) => $Free(
        $FreeView(
          "Bind",
          $HalogenF(
            "State",
            (s) => $Tuple(_board(strongForget)(identity8)(s), s)
          ),
          (x2) => $Free($FreeView("Return", x2), CatNil)
        ),
        snoc2(CatNil)((board) => {
          const v = boardM(board);
          if (v.tag === "Left") {
            return $Free($FreeView("Return", $Either("Left", v._1)), CatNil);
          }
          if (v.tag === "Right") {
            const $0 = v._1._1;
            const $1 = handleAction($Action3("SetBoard", v._1._2));
            return $Free(
              $1._1,
              snoc2($1._2)(() => $Free($FreeView("Return", $Either("Right", $0)), CatNil))
            );
          }
          fail();
        })
      );
      const handleQuery = (v) => {
        if (v.tag === "GetBoard") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF(
                "State",
                (s) => $Tuple(_board(strongForget)(identity8)(s), s)
              ),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc2(CatNil)((x2) => $Free(
              $FreeView("Return", $Maybe("Just", v._1(x2))),
              CatNil
            ))
          );
        }
        if (v.tag === "AddPiece") {
          const $0 = v._1;
          const $1 = v._2;
          const $2 = liftBoardM(addPiece2($0)($1));
          return $Free(
            $2._1,
            snoc2($2._2)((result) => {
              const $3 = (() => {
                if (result.tag === "Left") {
                  return headShake2("[data-location='" + location2.attrPrint($0) + "']");
                }
                if (result.tag === "Right") {
                  return $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("Raise", $Output("BoardEvent", $BoardEvent("AddPieceEvent", $0, $1)), void 0),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    CatNil
                  );
                }
                fail();
              })();
              return $Free(
                $3._1,
                snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", v._3(result))), CatNil))
              );
            })
          );
        }
        if (v.tag === "AddPath") {
          const $0 = v._1;
          const $1 = v._2;
          const $2 = v._3;
          const $3 = liftBoardM(addPath2($0)($1)($2));
          return $Free(
            $3._1,
            snoc2($3._2)((result) => {
              if ((() => {
                if (result.tag === "Left") {
                  return false;
                }
                if (result.tag === "Right") {
                  return true;
                }
                fail();
              })()) {
                return $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("Raise", $Output("BoardEvent", $BoardEvent("AddPathEvent", $0, $1, $2)), void 0),
                    (x2) => $Free($FreeView("Return", x2), CatNil)
                  ),
                  snoc2(CatNil)(() => $Free(
                    $FreeView("Return", $Maybe("Just", v._4(result))),
                    CatNil
                  ))
                );
              }
              return $Free(
                $FreeView("Return", void 0),
                snoc2(CatNil)(() => $Free(
                  $FreeView("Return", $Maybe("Just", v._4(result))),
                  CatNil
                ))
              );
            })
          );
        }
        if (v.tag === "RemovePiece") {
          const $0 = v._1;
          const $1 = liftBoardM(removePiece2($0));
          return $Free(
            $1._1,
            snoc2($1._2)((result) => {
              const $2 = for_1(result)((info3) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output("BoardEvent", $BoardEvent("RemovePieceEvent", $0, info3)), void 0),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                CatNil
              ));
              return $Free(
                $2._1,
                snoc2($2._2)(() => $Free($FreeView("Return", $Maybe("Just", v._2(result))), CatNil))
              );
            })
          );
        }
        if (v.tag === "GetMouseOverLocation") {
          const $0 = gets3((v1) => v1.isMouseOverLocation);
          return $Free(
            $0._1,
            snoc2($0._2)((maybeDst) => $Free(
              $FreeView("Return", maybeDst.tag === "Just" ? $Maybe("Just", v._1(maybeDst._1)) : Nothing),
              CatNil
            ))
          );
        }
        if (v.tag === "SetGoalPorts") {
          const $0 = v._1;
          const $1 = v._2;
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF(
                "Lift",
                debug2($$$Map("Node", 1, 1, "boardPorts", $Tag("StringTag", show4($0)), Leaf, Leaf))("Set goal ports on board")
              ),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc2(CatNil)(() => {
              const $2 = modify_3((v1) => ({ ...v1, boardPorts: $0 }));
              return $Free(
                $2._1,
                snoc2($2._2)(() => {
                  const $3 = forWithIndex_2($0)((dir2) => (port2) => {
                    const $32 = assign2((() => {
                      const $33 = at5(dir2)(strongFn);
                      return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($33(x2));
                    })())($Maybe("Just", uintSemiring.zero));
                    if (isInput(port2)) {
                      return $32;
                    }
                    return $Free($FreeView("Return", void 0), CatNil);
                  });
                  return $Free(
                    $3._1,
                    snoc2($3._2)(() => {
                      const $4 = handleAction(EvaluateBoard);
                      return $Free(
                        $4._1,
                        snoc2($4._2)(() => $Free($FreeView("Return", $Maybe("Just", $1)), CatNil))
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
            snoc2($0._2)(() => {
              const $1 = handleAction(EvaluateBoard);
              return $Free(
                $1._1,
                snoc2($1._2)(() => {
                  const $2 = gets3((v1) => v1.outputs);
                  return $Free(
                    $2._1,
                    snoc2($2._2)((x2) => $Free($FreeView("Return", $Maybe("Just", v._2(x2))), CatNil))
                  );
                })
              );
            })
          );
        }
        if (v.tag === "SetBoardSize") {
          const $0 = liftBoardM(setBoardSize2(v._1));
          return $Free(
            $0._1,
            snoc2($0._2)((result) => $Free($FreeView("Return", $Maybe("Just", v._2(result))), CatNil))
          );
        }
        if (v.tag === "Undo") {
          const $0 = v._1;
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc2(snoc2($1._2)((x2) => $Free($FreeView("Return", moveLeft(x2)), CatNil)))((maybeZipper) => {
              const $2 = for_22(maybeZipper)((t) => {
                const $22 = modify_3((v1) => ({ ...v1, boardHistory: t }));
                return $Free($22._1, snoc2($22._2)(() => handleAction(EvaluateBoard)));
              });
              return $Free(
                $2._1,
                snoc2($2._2)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
              );
            })
          );
        }
        if (v.tag === "Redo") {
          const $0 = v._1;
          const $1 = gets3((v1) => v1.boardHistory);
          return $Free(
            $1._1,
            snoc2(snoc2($1._2)((x2) => $Free($FreeView("Return", moveRight(x2)), CatNil)))((maybeZipper) => {
              const $2 = for_22(maybeZipper)((t) => {
                const $22 = modify_3((v1) => ({ ...v1, boardHistory: t }));
                return $Free($22._1, snoc2($22._2)(() => handleAction(EvaluateBoard)));
              });
              return $Free(
                $2._1,
                snoc2($2._2)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
              );
            })
          );
        }
        if (v.tag === "Clear") {
          const $0 = v._1;
          const $1 = liftBoardM(bind2(monadStateStateT3.state((s) => $Tuple(_pieces6(identity8)(s), s)))((pieces) => forWithIndex_1(pieces)((loc) => (v1) => removePiece2(loc))));
          return $Free(
            $1._1,
            snoc2($1._2)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
          );
        }
        if (v.tag === "RunTestCase") {
          const $0 = v._1.expected;
          return handleQuery($Query("SetInputs", v._1.inputs, (received) => v._2({ received, passed: eq($0)(received) })));
        }
        fail();
      };
      const handleAction = (v) => {
        if (v.tag === "Initialise") {
          const $0 = monadEffectHalogenM2.liftEffect(globalKeyDownEventEmitter);
          return $Free(
            $0._1,
            snoc2($0._2)((emitter) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Subscribe", (v$1) => (k) => emitter((x2) => k($Action3("GlobalOnKeyDown", x2))), identity12),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc2(snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil)))(() => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s) => $Tuple(_board(strongForget)(identity8)(s), s)
                  ),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc2(snoc2(snoc2(CatNil)((x2) => $Free(
                  $FreeView("Return", $Output("NewBoardState", x2)),
                  CatNil
                )))(raise))(() => monadEffectHalogenM2.liftEffect(() => {
                  const $1 = windowImpl();
                  const parentNode2 = document($1)();
                  const $2 = getElementById("board-component")(parentNode2)();
                  return traverse_8((element) => setAttribute2("oncontextmenu")("return false;")(element))($2)();
                }))
              ))
            ))
          );
        }
        if (v.tag === "PieceOutput") {
          if (v._1.tag === "Rotated") {
            const $0 = liftBoardM(rotatePieceBy2(v._1._1)(v._1._2));
            return $Free(
              $0._1,
              snoc2($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          if (v._1.tag === "Dropped") {
            const $0 = v._1._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("Lift", debug2(Leaf)("Piece dropped at " + showLocation.show($0))),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc2(CatNil)(() => {
                const $1 = gets3((v1) => v1.isMouseOverLocation);
                return $Free(
                  $1._1,
                  snoc2($1._2)((maybeDst) => {
                    const $2 = liftBoardM(pieceDropped2($0)(maybeDst));
                    return $Free(
                      $2._1,
                      snoc2($2._2)((result) => {
                        const $3 = $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF("Lift", warn2(Leaf)(show22(result))),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          snoc2(CatNil)(() => headShake2("[data-location='" + location2.attrPrint($0) + "']"))
                        );
                        if ((() => {
                          if (result.tag === "Left") {
                            return true;
                          }
                          if (result.tag === "Right") {
                            return false;
                          }
                          fail();
                        })()) {
                          return $3;
                        }
                        return $Free($FreeView("Return", void 0), CatNil);
                      })
                    );
                  })
                );
              })
            );
          }
          if (v._1.tag === "NewMultimeterFocus") {
            return tell1($$Proxy)()(NewFocus(v._1._1));
          }
          if (v._1.tag === "RemoveThis") {
            const $0 = liftBoardM(removePiece2(v._1._1));
            return $Free(
              $0._1,
              snoc2($0._2)(() => $Free($FreeView("Return", void 0), CatNil))
            );
          }
          fail();
        }
        if (v.tag === "MultimeterOutput") {
          const $0 = v._1._1;
          const $1 = liftBoardM(capacityRipple2($0)(v._1._2));
          return $Free(
            $1._1,
            snoc2(snoc2($1._2)((x2) => $Free($FreeView("Return", void 0), CatNil)))(() => {
              const $2 = gets3((v1) => v1.lastEvalWithPortInfo);
              return $Free(
                $2._1,
                snoc2($2._2)((signals) => tell1($$Proxy)()(NewFocus((() => {
                  const $3 = lookup2(ordRelativeEdge)($0)(signals);
                  if ($3.tag === "Just") {
                    return $Maybe("Just", { info: $3._1, relativeEdge: $0 });
                  }
                  if ($3.tag === "Nothing") {
                    return Nothing;
                  }
                  fail();
                })())))
              );
            })
          );
        }
        if (v.tag === "ToggleInput") {
          const $0 = modifying((() => {
            const $02 = ix3(v._1)(strongFn)(choiceFn);
            return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($02(x2));
          })())((signal) => {
            if (uintEq(signal)(uintSemiring.zero)) {
              return heytingAlgebraSignal.tt;
            }
            return uintSemiring.zero;
          });
          return $Free($0._1, snoc2($0._2)(() => handleAction(EvaluateBoard)));
        }
        if (v.tag === "IncrementInput") {
          const $0 = v._1;
          const $1 = gets3((() => {
            const $12 = lookup2(ordCardinalDirection)($0);
            return (x2) => $12(x2.boardPorts);
          })());
          return $Free(
            $1._1,
            snoc2(snoc2($1._2)(traverse_12((port2) => modifying((() => {
              const $2 = ix3($0)(strongFn)(choiceFn);
              return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($2(x2));
            })())((signal) => {
              if (uintEq(signal)(maxValue(portCapacity(port2)))) {
                return uintSemiring.zero;
              }
              return uintAdd(signal)(uintSemiring.one);
            }))))(() => handleAction(EvaluateBoard))
          );
        }
        if (v.tag === "DecrementInput") {
          const $0 = v._1;
          const $1 = gets3((() => {
            const $12 = lookup2(ordCardinalDirection)($0);
            return (x2) => $12(x2.boardPorts);
          })());
          return $Free(
            $1._1,
            snoc2(snoc2($1._2)(traverse_12((port2) => modifying((() => {
              const $2 = ix3($0)(strongFn)(choiceFn);
              return (x2) => prop({ reflectSymbol: () => "inputs" })()()($$Proxy)(strongFn)($2(x2));
            })())((n) => {
              if (uintEq(n)(uintSemiring.zero)) {
                return maxValue(portCapacity(port2));
              }
              return uintSub(n)(uintSemiring.one);
            }))))(() => handleAction(EvaluateBoard))
          );
        }
        if (v.tag === "SetOutputs") {
          const $0 = v._1;
          const $1 = modify_3((v1) => ({ ...v1, outputs: $0 }));
          return $Free(
            $1._1,
            snoc2($1._2)(() => {
              const $2 = gets3((v1) => v1.isMouseOverBoardPort);
              return $Free(
                $2._1,
                snoc2($2._2)(traverse_12((dir2) => tell1($$Proxy)()(SetSignal((() => {
                  const $3 = lookup2(ordCardinalDirection)(dir2)($0);
                  if ($3.tag === "Nothing") {
                    return uintSemiring.zero;
                  }
                  if ($3.tag === "Just") {
                    return $3._1;
                  }
                  fail();
                })()))))
              );
            })
          );
        }
        if (v.tag === "BoardOnDragExit") {
          const $0 = modify_3((v1) => ({ ...v1, isCreatingWire: Nothing }));
          return $Free(
            $0._1,
            snoc2($0._2)(() => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Lift", debug2(Leaf)("Cancelled wire creation")),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            ))
          );
        }
        if (v.tag === "LocationOnMouseDown") {
          const $0 = v._1;
          const $1 = v._2;
          const $2 = bind4($Free(
            $FreeView("Return", nullable(_target($1), Nothing, Just)),
            CatNil
          ))((eventTarget) => bind4($Free(
            $FreeView("Return", _unsafeReadProtoTagged(Nothing, Just, "Element", eventTarget)),
            CatNil
          ))((element) => bind4(liftEffect1(getBoundingClientRect(element)))((bb) => {
            const initialDirection = getDirectionClicked($1)(bb);
            return modify_1((v1) => ({ ...v1, isCreatingWire: $Maybe("Just", { initialDirection, locations: [$0] }) }));
          })));
          return $Free(
            $2._1,
            snoc2($2._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
          );
        }
        if (v.tag === "LocationOnMouseOver") {
          const $0 = v._1;
          const $1 = gets3((v1) => v1.isCreatingWire);
          return $Free(
            $1._1,
            snoc2($1._2)(traverse_12((creatingWire) => {
              const $2 = last(creatingWire.locations);
              const $3 = appendModifying(_wireLocations2)([$0]);
              if ($2.tag === "Nothing" || !($2.tag === "Just" && $2._1.x === $0.x && $2._1.y === $0.y)) {
                return $3;
              }
              return $Free($FreeView("Return", void 0), CatNil);
            }))
          );
        }
        if (v.tag === "LocationOnMouseUp") {
          const $0 = v._2;
          const $1 = gets3((v1) => v1.isCreatingWire);
          const $2 = $Free(
            $1._1,
            snoc2($1._2)(traverse_12((v1) => {
              const $22 = v1.initialDirection;
              const $3 = v1.locations;
              const $4 = monadEffectHalogenM2.liftEffect(boundingBoxFromMouseEvent($0));
              return $Free(
                $4._1,
                snoc2($4._2)(traverse_12((bb) => handleQuery($Query("AddPath", $22, $3, getDirectionClicked($0)(bb), (v2) => {
                }))))
              );
            }))
          );
          if (button2($0) === "Primary") {
            return $2;
          }
          return $Free($FreeView("Return", void 0), CatNil);
        }
        if (v.tag === "SetBoard") {
          const $0 = v._1;
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("Lift", debug2(Leaf)("Updating board")),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc2(CatNil)(() => {
              const $1 = modify_3((s) => ({ ...s, boardHistory: $Zipper($List("Cons", s.boardHistory._2, s.boardHistory._1), $0, Nil) }));
              return $Free(
                $1._1,
                snoc2($1._2)(() => {
                  const $2 = handleAction(EvaluateBoard);
                  return $Free(
                    $2._1,
                    snoc2($2._2)(() => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF("Raise", $Output("NewBoardState", $0), void 0),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
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
          const $0 = gets3((v1) => v1.boardPorts);
          return $Free(
            $0._1,
            snoc2($0._2)((boardPorts) => {
              const $1 = gets3((v1) => v1.inputs);
              return $Free(
                $1._1,
                snoc2($1._2)((inputs) => {
                  const $2 = buildEvaluableBoard2(boardPorts);
                  return $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "State",
                        (s) => $Tuple(_board(strongForget)(identity8)(s), s)
                      ),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    snoc2(snoc2(CatNil)((x2) => $Free($FreeView("Return", $2(x2)), CatNil)))((eitherEvaluable) => {
                      if (eitherEvaluable.tag === "Left") {
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF(
                              "Lift",
                              warn2(Leaf)("Unable to build EvaluableBoard, BoardError: " + showBoardError.show(eitherEvaluable._1))
                            ),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          CatNil
                        );
                      }
                      if (eitherEvaluable.tag === "Right") {
                        const v1 = evalWithPortInfo2(inputs)(eitherEvaluable._1)(Leaf);
                        const $3 = v1._1;
                        const $4 = v1._2;
                        return $Free(
                          $FreeView(
                            "Bind",
                            $HalogenF(
                              "Lift",
                              debug2(unsafeUnionWith(
                                ordString.compare,
                                $$const,
                                $$$Map(
                                  "Node",
                                  1,
                                  1,
                                  "inputs",
                                  $Tag("StringTag", show42(inputs)),
                                  Leaf,
                                  Leaf
                                ),
                                $$$Map("Node", 1, 1, "outputs", $Tag("StringTag", show42($3)), Leaf, Leaf)
                              ))("Evaluating board")
                            ),
                            (x2) => $Free($FreeView("Return", x2), CatNil)
                          ),
                          snoc2(CatNil)(() => $Free(
                            $FreeView(
                              "Bind",
                              $HalogenF(
                                "Lift",
                                debug2((() => {
                                  const go = (m$p, z$p) => {
                                    if (m$p.tag === "Leaf") {
                                      return z$p;
                                    }
                                    if (m$p.tag === "Node") {
                                      return go(
                                        m$p._5,
                                        insert(ordString)(showRelativeEdge.show(m$p._3))($Tag(
                                          "StringTag",
                                          show6(m$p._4)
                                        ))(go(m$p._6, z$p))
                                      );
                                    }
                                    fail();
                                  };
                                  return go($4, Leaf);
                                })())("Signals from board eval")
                              ),
                              (x2) => $Free($FreeView("Return", x2), CatNil)
                            ),
                            snoc2(CatNil)(() => {
                              const $5 = modify_3((v2) => ({ ...v2, lastEvalWithPortInfo: $4 }));
                              return $Free(
                                $5._1,
                                snoc2($5._2)(() => {
                                  const $6 = handleAction($Action3("SetOutputs", $3));
                                  return $Free($6._1, snoc2($6._2)(() => handleAction(UpdatePieceComponents)));
                                })
                              );
                            })
                          ))
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
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("Lift", debug2(Leaf)("Updating piece components")),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc2(CatNil)(() => {
              const $0 = gets3((v1) => v1.lastEvalWithPortInfo);
              return $Free(
                $0._1,
                snoc2($0._2)((signals) => $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF(
                      "State",
                      (s) => $Tuple(_board(strongForget)(_pieces6(identity8))(s), s)
                    ),
                    (x2) => $Free($FreeView("Return", x2), CatNil)
                  ),
                  snoc2(CatNil)(traverseWithIndex_2((loc) => (info3) => {
                    const $1 = tell22($$Proxy)(loc)(SetPortStates(toLocalInputs(loc)(signals)));
                    return $Free(
                      $1._1,
                      snoc2($1._2)(() => {
                        const $2 = tell22($$Proxy)(loc)(SetPiece(info3.piece));
                        return $Free($2._1, snoc2($2._2)(() => tell22($$Proxy)(loc)(SetRotation(info3.rotation))));
                      })
                    );
                  }))
                ))
              );
            })
          );
        }
        if (v.tag === "LocationOnDragEnter") {
          const $0 = v._1;
          const $1 = monadEffectHalogenM2.liftEffect(preventDefault(v._2));
          return $Free($1._1, snoc2($1._2)(() => modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $0) }))));
        }
        if (v.tag === "LocationOnDragOver") {
          return monadEffectHalogenM2.liftEffect(preventDefault(v._2));
        }
        if (v.tag === "LocationOnDrop") {
          const $0 = v._2;
          const $1 = v._1;
          const $2 = modify_3((v1) => ({ ...v1, isMouseOverLocation: $Maybe("Just", $1) }));
          return $Free($2._1, snoc2($2._2)(() => monadEffectHalogenM2.liftEffect(preventDefault($0))));
        }
        if (v.tag === "LocationOnDragLeave") {
          return modify_3((v1) => ({ ...v1, isMouseOverLocation: Nothing }));
        }
        if (v.tag === "GlobalOnKeyDown") {
          const v1 = key(v._1);
          if (v1 === "z") {
            const $0 = handleQuery($Query("Undo", void 0));
            const $1 = $Free(
              $0._1,
              snoc2($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
            );
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "y") {
            const $0 = handleQuery($Query("Redo", void 0));
            const $1 = $Free(
              $0._1,
              snoc2($0._2)((x2) => $Free($FreeView("Return", void 0), CatNil))
            );
            if (ctrlKey(v._1)) {
              return $1;
            }
            return $Free($FreeView("Return", void 0), CatNil);
          }
          if (v1 === "e") {
            const $0 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free($0._1, snoc2($0._2)(traverse_12((dir2) => handleAction($Action3("IncrementInput", dir2)))));
          }
          if (v1 === "E") {
            const $0 = gets3((v2) => v2.isMouseOverBoardPort);
            return $Free($0._1, snoc2($0._2)(traverse_12((dir2) => handleAction($Action3("DecrementInput", dir2)))));
          }
          return $Free($FreeView("Return", void 0), CatNil);
        }
        if (v.tag === "BoardPortOnMouseEnter") {
          const $0 = v._1;
          const $1 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: $Maybe("Just", $0) }));
          return $Free(
            $1._1,
            snoc2($1._2)(() => {
              const $2 = getBoardPortEdge3($0);
              return $Free(
                $FreeView(
                  "Bind",
                  $HalogenF(
                    "State",
                    (s) => $Tuple(_board(strongForget)(identity8)(s), s)
                  ),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                snoc2(snoc2(CatNil)((x2) => $Free($FreeView("Return", $2(x2)._1), CatNil)))((relativeEdge) => {
                  const $3 = gets3((v1) => v1.lastEvalWithPortInfo);
                  return $Free(
                    $3._1,
                    snoc2($3._2)((signals) => tell1($$Proxy)()(NewFocus((() => {
                      const $4 = lookup2(ordRelativeEdge)(relativeEdge)(signals);
                      if ($4.tag === "Just") {
                        return $Maybe("Just", { info: $4._1, relativeEdge });
                      }
                      return Nothing;
                    })())))
                  );
                })
              );
            })
          );
        }
        if (v.tag === "BoardPortOnMouseLeave") {
          const $0 = modify_3((v1) => ({ ...v1, isMouseOverBoardPort: Nothing }));
          return $Free($0._1, snoc2($0._2)(() => tell1($$Proxy)()(NewFocus(Nothing))));
        }
        fail();
      };
      return mkEval({
        finalize: Nothing,
        handleAction,
        handleQuery,
        initialize: $Maybe("Just", Initialise),
        receive: (v) => Nothing
      });
    })(),
    initialState,
    render
  };

  // output-es/Component.Selector/index.js
  var $Action6 = (tag, _1) => ({ tag, _1 });
  var DoNothing = /* @__PURE__ */ $Action6("DoNothing");
  var render2 = (v) => {
    if (v.availablePieces.tag === "Leaf") {
      return $VDom("Text", "");
    }
    return $VDom(
      "Elem",
      Nothing,
      "div",
      [id("selector-component")],
      [
        $VDom(
          "Elem",
          Nothing,
          "span",
          [class_("pieces")],
          arrayMap((piece) => {
            const pieceId = piece.name;
            return $VDom(
              "Elem",
              Nothing,
              "div",
              [
                $Prop("Attribute", Nothing, "data-available-piece", pieceId),
                draggable2(true),
                classes(["available-piece"]),
                $Prop("Handler", "dragend", (ev) => $Maybe("Just", $Input("Action", $Action6("PieceDropped", pieceId)))),
                $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action6("AddPiece", pieceId))))
              ],
              [
                bifunctorHTML.bimap(functorComponentSlot.map((v1) => DoNothing))((v1) => DoNothing)(renderPiece(initialState3({
                  piece,
                  location: { x: 0, y: 0 }
                }))),
                $VDom("Text", pieceId)
              ]
            );
          })(fromFoldableImpl(foldableSet.foldr, v.availablePieces))
        ),
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", "Available pieces")])
      ]
    );
  };
  var $$eval = /* @__PURE__ */ mkEval({
    handleAction: (action) => $Free(
      $FreeView(
        "Bind",
        $HalogenF("Raise", action, void 0),
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      CatNil
    ),
    handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
    receive: (v) => Nothing,
    initialize: Nothing,
    finalize: Nothing
  });
  var component8 = { initialState: (x2) => x2, eval: $$eval, render: render2 };

  // output-es/Component.Sidebar.Segment/index.js
  var segment = (className2) => (segmentTitle) => (html) => $VDom(
    "Elem",
    Nothing,
    "div",
    [class_(className2)],
    [$VDom("Elem", Nothing, "h2", [], [segmentTitle]), html]
  );

  // output-es/DOM.HTML.Indexed.StepValue/index.js
  var $StepValue = (tag, _1) => ({ tag, _1 });

  // output-es/Web.HTML.HTMLInputElement/foreign.js
  function valueAsNumber(input) {
    return function() {
      return input.valueAsNumber;
    };
  }
  function setValueAsNumber(valueAsNumber2) {
    return function(input) {
      return function() {
        input.valueAsNumber = valueAsNumber2;
      };
    };
  }

  // output-es/Component.Sidebar.BoardSizeSlider/index.js
  var $Action7 = (tag, _1) => ({ tag, _1 });
  var $Output4 = (_1) => ({ tag: "BoardSizeChange", _1 });
  var $Query4 = (_1, _2) => ({ tag: "AmendBoardSizeSlider", _1, _2 });
  var type_3 = /* @__PURE__ */ (() => {
    const $0 = Property("type");
    return (x2) => $0(renderInputType(x2));
  })();
  var value2 = /* @__PURE__ */ Property("value");
  var gets4 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var modify_4 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var AmendBoardSizeSlider = (value0) => (value1) => $Query4(value0, value1);
  var InputRangeChange = /* @__PURE__ */ $Action7("InputRangeChange");
  var InputRangeMouseUp = /* @__PURE__ */ $Action7("InputRangeMouseUp");
  var inputRange = () => {
    const $0 = windowImpl();
    const htmlDocument = document($0)();
    const maybeElement = querySelector("#sidebar-component .board-size input")(htmlDocument)();
    const $1 = (() => {
      if (maybeElement.tag === "Just") {
        return _unsafeReadProtoTagged(Nothing, Just, "HTMLInputElement", maybeElement._1);
      }
      if (maybeElement.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })();
    if ($1.tag === "Nothing") {
      return throwException(error("couldn't find board size input element"))();
    }
    if ($1.tag === "Just") {
      return $1._1;
    }
    fail();
  };
  var getValue = () => {
    const $0 = inputRange();
    const value1 = valueAsNumber($0)();
    return unsafeClamp(floor(value1));
  };
  var component9 = (dictMonadAff) => {
    const $0 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    const headShake4 = headShake(monadAffHalogenM(dictMonadAff));
    return {
      eval: (() => {
        const handleAction = (v) => {
          if (v.tag === "Initialise") {
            const $1 = v._1;
            return $Free(
              $FreeView(
                "Bind",
                $HalogenF("State", (v$1) => $Tuple(void 0, $1)),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              CatNil
            );
          }
          if (v.tag === "InputRangeChange") {
            const $1 = $0.liftEffect(getValue);
            return $Free(
              $1._1,
              snoc2($1._2)((boardSize) => $Free(
                $FreeView(
                  "Bind",
                  $HalogenF("Raise", $Output4({ boardSize }), void 0),
                  (x2) => $Free($FreeView("Return", x2), CatNil)
                ),
                CatNil
              ))
            );
          }
          if (v.tag === "InputRangeMouseUp") {
            const $1 = $0.liftEffect(getValue);
            return $Free(
              $1._1,
              snoc2($1._2)((sliderValue) => {
                const $2 = gets4((v1) => v1.boardSize);
                return $Free(
                  $2._1,
                  snoc2($2._2)((boardSize) => {
                    const $3 = $0.liftEffect((() => {
                      const $32 = setValueAsNumber(toNumber(boardSize));
                      return () => {
                        const $42 = inputRange();
                        return $32($42)();
                      };
                    })());
                    const $4 = $Free($3._1, snoc2($3._2)(() => headShake4("#sidebar-component .board-size h2")));
                    if (sliderValue !== boardSize) {
                      return $4;
                    }
                    return $Free($FreeView("Return", void 0), CatNil);
                  })
                );
              })
            );
          }
          fail();
        };
        return mkEval({
          finalize: Nothing,
          handleAction: ($1) => handleAction($1),
          handleQuery: (v) => {
            const $1 = v._1;
            const $2 = v._2;
            const $3 = modify_4((v1) => ({ ...v1, boardSize: $1 }));
            return $Free(
              $3._1,
              snoc2($3._2)(() => {
                const $4 = handleAction(InputRangeMouseUp);
                return $Free(
                  $4._1,
                  snoc2($4._2)(() => $Free($FreeView("Return", $Maybe("Just", $2)), CatNil))
                );
              })
            );
          },
          initialize: Nothing,
          receive: (x2) => $Maybe("Just", $Action7("Initialise", x2))
        });
      })(),
      initialState: (x2) => x2,
      render: (state) => segment("board-size")($VDom("Text", "Board size: " + showIntImpl(state.boardSize)))($VDom(
        "Elem",
        Nothing,
        "span",
        [],
        [
          $VDom(
            "Elem",
            Nothing,
            "input",
            [
              type_3(InputRange),
              list("values"),
              min2(3),
              max2(9),
              step2($StepValue("Step", 2)),
              value2(showIntImpl(state.boardSize)),
              $Prop("Handler", "input", (ev) => $Maybe("Just", $Input("Action", InputRangeChange))),
              $Prop("Handler", "mouseup", (ev) => $Maybe("Just", $Input("Action", InputRangeMouseUp)))
            ],
            []
          ),
          $VDom(
            "Elem",
            Nothing,
            "datalist",
            [id("values")],
            [
              $VDom("Elem", Nothing, "option", [value2("3")], []),
              $VDom("Elem", Nothing, "option", [value2("5")], []),
              $VDom("Elem", Nothing, "option", [value2("7")], []),
              $VDom("Elem", Nothing, "option", [value2("9")], [])
            ]
          )
        ]
      ))
    };
  };

  // output-es/Component.Sidebar.Types/index.js
  var $Action8 = (tag, _1, _2) => ({ tag, _1, _2 });
  var $Button = (tag, _1) => ({ tag, _1 });
  var $InputField = (_1) => ({ tag: "BoardSize", _1 });
  var $Output5 = (tag, _1) => ({ tag, _1 });
  var $Query5 = (_1, _2) => ({ tag: "AmendBoardSizeSlider", _1, _2 });
  var AmendBoardSizeSlider2 = (value0) => (value1) => $Query5(value0, value1);
  var BackToLevelSelect = /* @__PURE__ */ $Button("BackToLevelSelect");
  var Undo2 = /* @__PURE__ */ $Button("Undo");
  var Redo2 = /* @__PURE__ */ $Button("Redo");
  var RunTests = /* @__PURE__ */ $Button("RunTests");
  var Clear2 = /* @__PURE__ */ $Button("Clear");
  var ButtonClicked = (value0) => (value1) => $Action8("ButtonClicked", value0, value1);
  var BoardSizeSliderOutput = (value0) => $Action8("BoardSizeSliderOutput", value0);
  var initialState4 = (x2) => x2;

  // output-es/Component.TestRunner.Render/index.js
  var min4 = (x2) => (y2) => {
    const v = ordInt.compare(x2)(y2);
    if (v === "LT") {
      return x2;
    }
    if (v === "EQ") {
      return x2;
    }
    if (v === "GT") {
      return y2;
    }
    fail();
  };
  var max4 = (x2) => (y2) => {
    const v = ordInt.compare(x2)(y2);
    if (v === "LT") {
      return y2;
    }
    if (v === "EQ") {
      return x2;
    }
    if (v === "GT") {
      return x2;
    }
    fail();
  };
  var render3 = (state) => {
    const outputDirs = fromFoldableImpl(
      foldableSet.foldr,
      keys2(filterWithKey(ordCardinalDirection)((v) => isOutput)(state.model.ports))
    );
    const numOutputs = outputDirs.length;
    const inputDirs = fromFoldableImpl(
      foldableSet.foldr,
      keys2(filterWithKey(ordCardinalDirection)((v) => isInput)(state.model.ports))
    );
    const numInputs = inputDirs.length;
    return $VDom(
      "Elem",
      Nothing,
      "div",
      [
        class_("test-runner"),
        style("grid-template-columns: repeat(" + showIntImpl((1 + numInputs | 0) + (2 * numOutputs | 0) | 0) + ", 1fr) [status] 100px")
      ],
      [
        $VDom(
          "Elem",
          Nothing,
          "span",
          [style("grid-column: 2 / span " + showIntImpl(numInputs))],
          [$VDom("Text", "In")]
        ),
        $VDom(
          "Elem",
          Nothing,
          "span",
          [style("grid-column: auto / span " + showIntImpl(numOutputs))],
          [$VDom("Text", "Ex.")]
        ),
        $VDom(
          "Elem",
          Nothing,
          "span",
          [style("grid-column: auto / span " + showIntImpl(numOutputs))],
          [$VDom("Text", "Out")]
        ),
        $VDom(
          "Elem",
          Nothing,
          "span",
          [style("grid-column: auto / span 1")],
          [$VDom("Text", "Status")]
        ),
        ...arrayMap((s) => $VDom(
          "Elem",
          Nothing,
          "span",
          [style("grid-row: 2")],
          [$VDom("Text", take2(1)(s))]
        ))(["", ...arrayMap(showCardinalDirection.show)([...inputDirs, ...outputDirs, ...outputDirs])]),
        ...(() => {
          const n = min4(5)(foldableZipper.foldl((c) => (v) => 1 + c | 0)(0)(state.testCases));
          const end3 = max4(n)((() => {
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
                  go$a0 = b + 1 | 0;
                  go$a1 = v._2;
                  continue;
                }
                fail();
              }
              return go$r;
            };
            return go(0)(state.testCases._1);
          })());
          const start = max4(0)(end3 - n | 0);
          const $0 = mapWithIndexArray((i) => (testCase) => {
            const $02 = state.model.ports;
            const renderSignals = (signals) => fromFoldableImpl(
              foldableMap.foldr,
              functorWithIndexMap.mapWithIndex((dir2) => (signal) => $VDom(
                "Text",
                printSignal($SignalRepresentation(
                  state.base,
                  (() => {
                    const $1 = lookup2(ordCardinalDirection)(dir2)($02);
                    if ($1.tag === "Nothing") {
                      return EightBit;
                    }
                    if ($1.tag === "Just") {
                      return portCapacity($1._1);
                    }
                    fail();
                  })()
                ))(signal)
              ))(signals)
            );
            return arrayBind([
              [$VDom("Text", showIntImpl(start + i | 0))],
              renderSignals(testCase.data.inputs),
              renderSignals(testCase.data.expected),
              (() => {
                const n$1 = (() => {
                  if (testCase.data.expected.tag === "Leaf") {
                    return 0;
                  }
                  if (testCase.data.expected.tag === "Node") {
                    return testCase.data.expected._2;
                  }
                  fail();
                })();
                if (testCase.outcome.tag === "Just") {
                  return renderSignals(testCase.outcome._1.received);
                }
                if (testCase.outcome.tag === "Nothing") {
                  return replicateImpl(n$1, $VDom("Elem", Nothing, "td", [], []));
                }
                fail();
              })()
            ])(identity4);
          })(sliceImpl(start, end3, fromFoldableImpl(foldableZipper.foldr, state.testCases)));
          if (0 < $0.length) {
            const cols = $0[0].length;
            return arrayBind(zipWithImpl(Tuple, rangeImpl(1, $0.length), $0))((v2) => {
              const $1 = v2._1;
              return arrayBind(zipWithImpl(Tuple, rangeImpl(1, cols), v2._2))((v3) => [
                $VDom(
                  "Elem",
                  Nothing,
                  "span",
                  [style("grid-area: " + showIntImpl(2 + $1 | 0) + " / " + showIntImpl(0 + v3._1 | 0))],
                  [v3._2]
                )
              ]);
            });
          }
          return [];
        })()
      ]
    );
  };

  // output-es/Data.Array.NonEmpty.Internal/foreign.js
  var traverse1Impl = function() {
    function Cont(fn) {
      this.fn = fn;
    }
    var emptyList = {};
    var ConsCell = function(head, tail) {
      this.head = head;
      this.tail = tail;
    };
    function finalCell(head) {
      return new ConsCell(head, emptyList);
    }
    function consList(x2) {
      return function(xs) {
        return new ConsCell(x2, xs);
      };
    }
    function listToArray(list2) {
      var arr = [];
      var xs = list2;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }
    return function(apply2, map2, f) {
      var buildFrom = function(x2, ys) {
        return apply2(map2(consList)(f(x2)))(ys);
      };
      var go = function(acc, currentLen, xs) {
        if (currentLen === 0) {
          return acc;
        } else {
          var last2 = xs[currentLen - 1];
          return new Cont(function() {
            var built = go(buildFrom(last2, acc), currentLen - 1, xs);
            return built;
          });
        }
      };
      return function(array) {
        var acc = map2(finalCell)(f(array[array.length - 1]));
        var result = go(acc, array.length - 1, array);
        while (result instanceof Cont) {
          result = result.fn();
        }
        return map2(listToArray)(result);
      };
    };
  }();

  // output-es/Data.Array.NonEmpty/index.js
  var toUnfoldable13 = (dictUnfoldable1) => (xs) => {
    const len = xs.length;
    return dictUnfoldable1.unfoldr1((i) => $Tuple(xs[i], i < (len - 1 | 0) ? $Maybe("Just", i + 1 | 0) : Nothing))(0);
  };

  // output-es/Component.TestRunner.Types/index.js
  var $Action9 = (tag, _1) => ({ tag, _1 });
  var $Output6 = (tag, _1) => ({ tag, _1 });
  var prop4 = /* @__PURE__ */ prop({ reflectSymbol: () => "testCases" })()();
  var prop1 = /* @__PURE__ */ prop({ reflectSymbol: () => "runNextTestOnPassed" })()();
  var AllTestsPassed = /* @__PURE__ */ $Output6("AllTestsPassed");
  var initialState5 = (v) => {
    const $0 = v.model;
    return {
      base: v.base,
      model: $0,
      testCases: toUnfoldable13(unfoldable1Zipper)(arrayMap((i) => ({ data: { inputs: i, expected: $0.eval(i) }, outcome: Nothing }))(v.inputs)),
      runNextTestOnPassed: true
    };
  };
  var _testCases = (dictStrong) => prop4($$Proxy)(dictStrong);
  var _runNextTestOnPassed = (dictStrong) => prop1($$Proxy)(dictStrong);

  // output-es/Component.TestRunner/index.js
  var modifying2 = (p) => (f) => {
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
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var showMap2 = /* @__PURE__ */ showMap(showCardinalDirection)(showSignal);
  var showRecord1 = {
    show: (record2) => "{ data: { expected: " + showMap2.show(record2.data.expected) + ", inputs: " + showMap2.show(record2.data.inputs) + " }," + (() => {
      if (record2.outcome.tag === "Just") {
        return (record2.outcome._1.passed ? " outcome: (Just { passed: true, received: " : " outcome: (Just { passed: false, received: ") + showMap2.show(record2.outcome._1.received) + " })";
      }
      if (record2.outcome.tag === "Nothing") {
        return " outcome: Nothing";
      }
      fail();
    })() + " }"
  };
  var assign3 = (p) => (b) => {
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
        (x2) => $Free($FreeView("Return", x2), CatNil)
      ),
      snoc2(CatNil)((x2) => $Free($FreeView("Return", void 0), CatNil))
    );
  };
  var gets5 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var modify_5 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var component10 = (dictMonadAff) => {
    const logShow2 = logShow(monadEffectHalogenM(dictMonadAff.MonadEffect0()))(showRecord1);
    return {
      eval: mkEval({
        ...defaultEval,
        handleAction: (v) => {
          if (v.tag === "Receive") {
            const $0 = v._1;
            return modify_5((v1) => ({ ...v1, base: $0.base }));
          }
          return $Free($FreeView("Return", void 0), CatNil);
        },
        handleQuery: (v) => {
          const $0 = v._2;
          const $1 = v._1;
          const $2 = modifying2((x2) => prop({ reflectSymbol: () => "testCases" })()()($$Proxy)(strongFn)((x$1) => $Zipper(
            x$1._1,
            x2(x$1._2),
            x$1._3
          )))((v1) => ({ ...v1, outcome: $Maybe("Just", $1) }));
          return $Free(
            $2._1,
            snoc2($2._2)(() => $Free(
              $FreeView(
                "Bind",
                $HalogenF(
                  "State",
                  (s) => $Tuple(
                    prop({ reflectSymbol: () => "testCases" })()()($$Proxy)(strongForget)((x2) => x2._2)(s),
                    s
                  )
                ),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc2(snoc2(CatNil)(logShow2))(() => {
                const $3 = assign3(_runNextTestOnPassed(strongFn))(false);
                if (!$1.passed) {
                  return $Free(
                    $3._1,
                    snoc2($3._2)(() => $Free(
                      $FreeView(
                        "Bind",
                        $HalogenF(
                          "State",
                          (s) => $Tuple(
                            prop({ reflectSymbol: () => "runNextTestOnPassed" })()()($$Proxy)(strongForget)(identity8)(s),
                            s
                          )
                        ),
                        (x2) => $Free($FreeView("Return", x2), CatNil)
                      ),
                      snoc2(CatNil)((runNextTestOnPassed) => {
                        const $4 = monadAffHalogenM(dictMonadAff).liftAff(_delay(Right, 1e3));
                        const $5 = snoc2($4._2)(() => {
                          const $52 = gets5((x2) => moveRight(x2.testCases));
                          return $Free(
                            $52._1,
                            snoc2($52._2)((v1) => {
                              if (v1.tag === "Just") {
                                return assign3(_testCases(strongFn))(v1._1);
                              }
                              if (v1.tag === "Nothing") {
                                return $Free(
                                  $FreeView(
                                    "Bind",
                                    $HalogenF("Raise", AllTestsPassed, void 0),
                                    (x2) => $Free($FreeView("Return", x2), CatNil)
                                  ),
                                  CatNil
                                );
                              }
                              fail();
                            })
                          );
                        });
                        if (runNextTestOnPassed) {
                          return $Free(
                            $4._1,
                            snoc2($5)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
                          );
                        }
                        return $Free(
                          $FreeView("Return", void 0),
                          snoc2(CatNil)(() => $Free(
                            $FreeView("Return", $Maybe("Just", $0)),
                            CatNil
                          ))
                        );
                      })
                    ))
                  );
                }
                return $Free(
                  $FreeView("Return", void 0),
                  snoc2(CatNil)(() => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF(
                        "State",
                        (s) => $Tuple(
                          prop({ reflectSymbol: () => "runNextTestOnPassed" })()()($$Proxy)(strongForget)(identity8)(s),
                          s
                        )
                      ),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    snoc2(CatNil)((runNextTestOnPassed) => {
                      const $4 = monadAffHalogenM(dictMonadAff).liftAff(_delay(Right, 1e3));
                      const $5 = snoc2($4._2)(() => {
                        const $52 = gets5((x2) => moveRight(x2.testCases));
                        return $Free(
                          $52._1,
                          snoc2($52._2)((v1) => {
                            if (v1.tag === "Just") {
                              return assign3(_testCases(strongFn))(v1._1);
                            }
                            if (v1.tag === "Nothing") {
                              return $Free(
                                $FreeView(
                                  "Bind",
                                  $HalogenF("Raise", AllTestsPassed, void 0),
                                  (x2) => $Free($FreeView("Return", x2), CatNil)
                                ),
                                CatNil
                              );
                            }
                            fail();
                          })
                        );
                      });
                      if (runNextTestOnPassed) {
                        return $Free(
                          $4._1,
                          snoc2($5)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
                        );
                      }
                      return $Free(
                        $FreeView("Return", void 0),
                        snoc2(CatNil)(() => $Free(
                          $FreeView("Return", $Maybe("Just", $0)),
                          CatNil
                        ))
                      );
                    })
                  ))
                );
              })
            ))
          );
        },
        receive: (x2) => $Maybe("Just", $Action9("Receive", x2))
      }),
      initialState: initialState5,
      render: render3
    };
  };

  // output-es/Game.Piece.BasicPiece/index.js
  var member3 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordCardinalDirection.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var fromFoldable6 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var basicPiece = (basic) => ({
    complexity: { space: 0, time: 0 },
    eval: basic.eval,
    isSimplifiable: Nothing,
    name: basic.name,
    ports: functorMap.map((portType2) => ({ portType: portType2, capacity: basic.capacity }))(basic.ports),
    shouldRipple: true,
    updateCapacity: (dir2) => (capacity) => {
      if (member3(dir2)(basic.ports)) {
        return $Maybe("Just", basicPiece({ ...basic, capacity }));
      }
      return Nothing;
    },
    updatePort: (v) => (v1) => Nothing
  });
  var notPiece = /* @__PURE__ */ basicPiece({
    name: "not-piece",
    eval: (m) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      complement((() => {
        const $0 = lookup2(ordCardinalDirection)(Left2)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf,
      Leaf
    ),
    ports: /* @__PURE__ */ fromFoldable6([
      /* @__PURE__ */ $Tuple(Left2, Input),
      /* @__PURE__ */ $Tuple(Right2, Output)
    ]),
    capacity: OneBit
  });
  var orPiece = /* @__PURE__ */ basicPiece({
    name: "or-piece",
    eval: (m) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      or((() => {
        const $0 = lookup2(ordCardinalDirection)(Left2)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })())((() => {
        const $0 = lookup2(ordCardinalDirection)(Up)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf,
      Leaf
    ),
    ports: /* @__PURE__ */ fromFoldable6([
      /* @__PURE__ */ $Tuple(Left2, Input),
      /* @__PURE__ */ $Tuple(Up, Input),
      /* @__PURE__ */ $Tuple(Right2, Output)
    ]),
    capacity: OneBit
  });
  var xorPiece = /* @__PURE__ */ basicPiece({
    name: "xor-piece",
    eval: (m) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      xor((() => {
        const $0 = lookup2(ordCardinalDirection)(Left2)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })())((() => {
        const $0 = lookup2(ordCardinalDirection)(Up)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf,
      Leaf
    ),
    ports: /* @__PURE__ */ fromFoldable6([
      /* @__PURE__ */ $Tuple(Left2, Input),
      /* @__PURE__ */ $Tuple(Up, Input),
      /* @__PURE__ */ $Tuple(Right2, Output)
    ]),
    capacity: OneBit
  });
  var andPiece = /* @__PURE__ */ basicPiece({
    name: "and-piece",
    eval: (m) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      and2((() => {
        const $0 = lookup2(ordCardinalDirection)(Left2)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })())((() => {
        const $0 = lookup2(ordCardinalDirection)(Up)(m);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf,
      Leaf
    ),
    ports: /* @__PURE__ */ fromFoldable6([
      /* @__PURE__ */ $Tuple(Left2, Input),
      /* @__PURE__ */ $Tuple(Up, Input),
      /* @__PURE__ */ $Tuple(Right2, Output)
    ]),
    capacity: OneBit
  });
  var allBasicPieces = [notPiece, orPiece, andPiece, xorPiece];

  // output-es/Game.Piece.FusePiece/index.js
  var foldMap2 = (v) => (v1) => {
    if (v1.tag === "Nothing") {
      return $Tuple(uintSemiring.zero, uintSemiring.zero);
    }
    if (v1.tag === "Just") {
      return v(v1._1);
    }
    fail();
  };
  var fromFoldable7 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var severSignal = (outputCapacity) => (signal) => {
    const n = from((() => {
      if (outputCapacity === "OneBit") {
        return 1;
      }
      if (outputCapacity === "TwoBit") {
        return 2;
      }
      if (outputCapacity === "FourBit") {
        return 4;
      }
      if (outputCapacity === "EightBit") {
        return 8;
      }
      fail();
    })());
    return $Tuple(shr(signal)(n), and2(signal)(uintSub(shl(uintSemiring.one)(n))(uintSemiring.one)));
  };
  var mkSeverPiece = (v) => {
    const $0 = v.outputCapacity;
    return {
      complexity: { space: 0, time: 0 },
      eval: (inputs) => {
        const v1 = foldMap2(severSignal($0))(lookup2(ordCardinalDirection)(Left2)(inputs));
        return fromFoldable7([$Tuple(Up, v1._1), $Tuple(Down, v1._2)]);
      },
      isSimplifiable: Nothing,
      name: "sever-piece",
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
          return Leaf;
        }
        fail();
      })(),
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity) => {
        if (dir2 === "Right") {
          return Nothing;
        }
        if (dir2 === "Left") {
          const $1 = halveCapacity(capacity);
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
          if (capacity === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity === "EightBit" && $0 === "EightBit");
        })()) {
          return $Maybe("Just", mkSeverPiece({ outputCapacity: capacity }));
        }
        return Nothing;
      },
      updatePort: (v$1) => (v1) => Nothing
    };
  };
  var severPiece = /* @__PURE__ */ mkSeverPiece({ outputCapacity: OneBit });
  var fuseSignals = (inputCapacity) => {
    const n = from((() => {
      if (inputCapacity === "OneBit") {
        return 1;
      }
      if (inputCapacity === "TwoBit") {
        return 2;
      }
      if (inputCapacity === "FourBit") {
        return 4;
      }
      if (inputCapacity === "EightBit") {
        return 8;
      }
      fail();
    })());
    return (v) => (v1) => or(shl(v)(n))(and2(v1)(uintSub(shl(uintSemiring.one)(n))(uintSemiring.one)));
  };
  var mkFusePiece = (v) => {
    const $0 = v.inputCapacity;
    return {
      complexity: { space: 0, time: 0 },
      eval: (inputs) => $$$Map(
        "Node",
        1,
        1,
        Right2,
        fuseSignals($0)((() => {
          const $1 = lookup2(ordCardinalDirection)(Up)(inputs);
          if ($1.tag === "Nothing") {
            return uintSemiring.zero;
          }
          if ($1.tag === "Just") {
            return $1._1;
          }
          fail();
        })())((() => {
          const $1 = lookup2(ordCardinalDirection)(Down)(inputs);
          if ($1.tag === "Nothing") {
            return uintSemiring.zero;
          }
          if ($1.tag === "Just") {
            return $1._1;
          }
          fail();
        })()),
        Leaf,
        Leaf
      ),
      isSimplifiable: Nothing,
      name: "fuse-piece",
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
          return Leaf;
        }
        fail();
      })(),
      shouldRipple: false,
      updateCapacity: (dir2) => (capacity) => {
        if (dir2 === "Left") {
          return Nothing;
        }
        if (dir2 === "Right") {
          const $1 = halveCapacity(capacity);
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
          if (capacity === "OneBit") {
            return $0 !== "OneBit";
          }
          if (capacity === "TwoBit") {
            return $0 !== "TwoBit";
          }
          if (capacity === "FourBit") {
            return $0 !== "FourBit";
          }
          return !(capacity === "EightBit" && $0 === "EightBit");
        })()) {
          const $1 = doubleCapacity(capacity);
          if ($1.tag === "Just") {
            return $Maybe("Just", mkFusePiece({ inputCapacity: capacity }));
          }
          if ($1.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        return Nothing;
      },
      updatePort: (v$1) => (v1) => Nothing
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
    const $0 = lookup2(ordPieceId)(pieceId)(pieceVault);
    if ($0.tag === "Nothing") {
      return _crashWith(message2);
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  };

  // output-es/Component.Sidebar.Render/index.js
  var member4 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordString.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = true;
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var fromFoldable15 = /* @__PURE__ */ foldrArray(Cons)(Nil);
  var slot_2 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "testRunner" })(ordUnit);
  var slot3 = /* @__PURE__ */ slot()({ reflectSymbol: () => "boardSizeSlider" })(ordUnit);
  var render4 = (dictMonadAff) => {
    const component16 = component10(dictMonadAff);
    const component17 = component9(dictMonadAff);
    return (state) => $VDom(
      "Elem",
      Nothing,
      "div",
      [id("sidebar-component")],
      [
        $VDom("Elem", Nothing, "h2", [], [$VDom("Text", state.problem.title)]),
        (() => {
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
          return $VDom(
            "Elem",
            Nothing,
            "h3",
            [class_("description")],
            fromFoldableImpl(
              foldableList.foldr,
              listMap((v) => {
                if (v.tag === "Left") {
                  return $VDom("Elem", Nothing, "span", [class_("piece-name")], [$VDom("Text", v._1)]);
                }
                if (v.tag === "Right") {
                  return $VDom("Text", v._1);
                }
                fail();
              })(reduceStrings(listMap((x2) => {
                if (!member4(x2)(pieceVault)) {
                  return $Either("Right", x2);
                }
                return $Either("Left", x2);
              })(fromFoldable15(split(" ")(state.problem.description)))))
            )
          );
        })(),
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
                if (state.completionStatus.tag === "PortMismatch") {
                  return "port-mismatch";
                }
                if (state.completionStatus.tag === "FailedRestriction") {
                  return "failed-restriction";
                }
                if (state.completionStatus.tag === "NotEvaluable") {
                  return "not-evaluable";
                }
                if (state.completionStatus.tag === "ReadyForTesting") {
                  return "ready-for-testing";
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
                        $VDom("Elem", Nothing, "b", [], [$VDom("Text", "Port mismatch: ")]),
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
                                  return "Remohttps://hackage.haskell.org/package/megaparsec-9.7.0/docs/Text-Megaparsec.html#t:MonadParsecve the port in the Updirection";
                                }
                                if (state.completionStatus._1._1.direction === "Right") {
                                  return "Remohttps://hackage.haskell.org/package/megaparsec-9.7.0/docs/Text-Megaparsec.html#t:MonadParsecve the port in the Rightdirection";
                                }
                                if (state.completionStatus._1._1.direction === "Down") {
                                  return "Remohttps://hackage.haskell.org/package/megaparsec-9.7.0/docs/Text-Megaparsec.html#t:MonadParsecve the port in the Downdirection";
                                }
                                if (state.completionStatus._1._1.direction === "Left") {
                                  return "Remohttps://hackage.haskell.org/package/megaparsec-9.7.0/docs/Text-Megaparsec.html#t:MonadParsecve the port in the Leftdirection";
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
                    $VDom("Elem", Nothing, "h3", [], [$VDom("Text", "Ready for testing:")]),
                    slot_2($$Proxy)()(component16)({ base: state.base, inputs: state.problem.testCases, model: state.problem.goal })
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
                        (() => {
                          const $0 = ButtonClicked(RunTests);
                          return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                        })()
                      ],
                      [$VDom("Text", "Run Tests again")]
                    ),
                    $VDom(
                      "Elem",
                      Nothing,
                      "button",
                      [
                        class_("back-to-level-select"),
                        (() => {
                          const $0 = ButtonClicked(BackToLevelSelect);
                          return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                        })()
                      ],
                      [$VDom("Text", "Back to Level Select ")]
                    )
                  ];
                }
                fail();
              })()
            )
          ]
        ),
        slot3($$Proxy)()(component17)({ boardSize: state.boardSize })(BoardSizeSliderOutput),
        segment("undo-redo")($VDom(
          "Elem",
          Nothing,
          "span",
          [],
          [
            $VDom(
              "Elem",
              Nothing,
              "span",
              [
                (() => {
                  const $0 = ButtonClicked(Undo2);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [$VDom("Text", "Undo")]
            ),
            $VDom("Text", "/"),
            $VDom(
              "Elem",
              Nothing,
              "span",
              [
                (() => {
                  const $0 = ButtonClicked(Redo2);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [$VDom("Text", "Redo")]
            )
          ]
        ))($VDom(
          "Elem",
          Nothing,
          "span",
          [],
          [
            $VDom(
              "Elem",
              Nothing,
              "span",
              [
                (() => {
                  const $0 = ButtonClicked(Undo2);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [$VDom("Text", "Ctrl-Z")]
            ),
            $VDom("Text", "/"),
            $VDom(
              "Elem",
              Nothing,
              "span",
              [
                (() => {
                  const $0 = ButtonClicked(Redo2);
                  return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
                })()
              ],
              [$VDom("Text", "Ctrl-Y")]
            )
          ]
        )),
        segment("clear-all")($VDom(
          "Elem",
          Nothing,
          "span",
          [
            (() => {
              const $0 = ButtonClicked(Clear2);
              return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
            })()
          ],
          [$VDom("Text", "Obliterate")]
        ))($VDom(
          "Elem",
          Nothing,
          "span",
          [
            (() => {
              const $0 = ButtonClicked(Clear2);
              return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
            })()
          ],
          [$VDom("Text", "Remove all pieces")]
        )),
        segment("give-up")($VDom(
          "Elem",
          Nothing,
          "span",
          [
            (() => {
              const $0 = ButtonClicked(BackToLevelSelect);
              return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
            })()
          ],
          [$VDom("Text", "Resign")]
        ))($VDom(
          "Elem",
          Nothing,
          "span",
          [
            (() => {
              const $0 = ButtonClicked(BackToLevelSelect);
              return $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0(ev))));
            })()
          ],
          [$VDom("Text", "Choose another level")]
        ))
      ]
    );
  };

  // output-es/Component.Sidebar/index.js
  var tell3 = /* @__PURE__ */ tell()({ reflectSymbol: () => "boardSizeSlider" })(ordUnit);
  var modify_6 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var headShake3 = /* @__PURE__ */ headShake(/* @__PURE__ */ monadAffHalogenM(monadAffAppM));
  var component11 = {
    eval: /* @__PURE__ */ mkEval({
      finalize: Nothing,
      handleAction: (v) => {
        if (v.tag === "Initialise") {
          const $0 = v._1;
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("State", (v$1) => $Tuple(void 0, $0)),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            snoc2(CatNil)(() => tell3($$Proxy)()(AmendBoardSizeSlider($0.boardSize)))
          );
        }
        if (v.tag === "PieceOnDrop") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("Raise", $Output5("PieceDropped", v._1), void 0),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "ButtonClicked") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("Raise", $Output5("ButtonOutput", v._1), void 0),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "BoardSizeSliderOutput") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("Raise", $Output5("InputFieldOutput", $InputField(v._1._1.boardSize)), void 0),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "DoNothing") {
          return $Free($FreeView("Return", void 0), CatNil);
        }
        fail();
      },
      handleQuery: (v) => {
        const $0 = v._2;
        const $1 = v._1;
        const $2 = modify_6((v1) => ({ ...v1, boardSize: $1 }));
        return $Free(
          $2._1,
          snoc2($2._2)(() => {
            const $3 = headShake3("#sidebar-component .board-size h3");
            return $Free(
              $3._1,
              snoc2($3._2)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
            );
          })
        );
      },
      initialize: Nothing,
      receive: (x2) => $Maybe("Just", $Action8("Initialise", x2))
    }),
    initialState: initialState4,
    render: /* @__PURE__ */ render4(monadAffAppM)
  };

  // output-es/Effect.Random/foreign.js
  var random = Math.random;

  // output-es/Effect.Random/index.js
  var randomInt = (low) => (high) => () => {
    const n = random();
    return unsafeClamp(floor((toNumber(high) - toNumber(low) + 1) * n + toNumber(low)));
  };

  // output-es/Data.UUID.Random/index.js
  var $UUIDv4 = (_1, _2) => ({ tag: "UUIDv4", _1, _2 });
  var eqUUIDv4 = { eq: (v) => (v1) => v._1 === v1._1 };
  var ordUUIDv4 = { compare: (v) => (v1) => ordString.compare(v._1)(v1._1), Eq0: () => eqUUIDv4 };
  var render5 = (is) => {
    const chunk = (i, j) => joinWith("")(arrayMap(toStringAs(16))(sliceImpl(i, j, is)));
    return joinWith("-")([chunk(0, 8), chunk(8, 12), chunk(12, 16), chunk(16, 20), chunk(20, 32)]);
  };
  var unsafeFromInts = (is) => $UUIDv4(render5(is), is);
  var make$p = (dictApplicative) => {
    const sequence1 = traversableArray.traverse(dictApplicative)(identity5);
    return (rand) => {
      const x2 = [rand(0)(15)];
      const x3 = [...x2, ...x2, ...x2];
      const x4 = [...x3, ...x2];
      const x8 = [...x4, ...x4];
      return dictApplicative.Apply0().Functor0().map(unsafeFromInts)(sequence1([...x8, ...x4, dictApplicative.pure(4), ...x3, rand(8)(11), ...x3, ...x8, ...x4]));
    };
  };
  var make$p1 = /* @__PURE__ */ make$p(applicativeEffect);

  // output-es/Component.Level/index.js
  var $Action10 = (tag, _1) => ({ tag, _1 });
  var boardIsSymbol = { reflectSymbol: () => "board" };
  var request2 = /* @__PURE__ */ request()(boardIsSymbol)(ordUnit);
  var slot12 = /* @__PURE__ */ slot()(boardIsSymbol)(ordUnit);
  var sidebarIsSymbol = { reflectSymbol: () => "sidebar" };
  var slot22 = /* @__PURE__ */ slot()(sidebarIsSymbol)(ordUnit);
  var slot32 = /* @__PURE__ */ slot()({ reflectSymbol: () => "selector" })(ordUnit);
  var getBoardPorts3 = /* @__PURE__ */ getBoardPorts(/* @__PURE__ */ monadStateStateT(monadIdentity));
  var traverse_9 = /* @__PURE__ */ traverse_(freeApplicative);
  var traverse_13 = /* @__PURE__ */ traverse_9(foldableMaybe);
  var for_6 = /* @__PURE__ */ for_(freeApplicative)(foldableMaybe);
  var gets6 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(f(s), s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var debug3 = /* @__PURE__ */ log$p(monadLoggerAppM)(Debug);
  var show5 = (record2) => "{ levelName: " + showStringImpl(record2.levelName) + ", suiteName: " + showStringImpl(record2.suiteName) + " }";
  var traverse_22 = /* @__PURE__ */ traverse_9(foldableArray);
  var info2 = /* @__PURE__ */ log$p(monadLoggerAppM)(Info);
  var monadEffectHalogenM3 = /* @__PURE__ */ monadEffectHalogenM(monadEffectAppM);
  var make = /* @__PURE__ */ (() => monadEffectHalogenM3.liftEffect(make$p1(randomInt)))();
  var modify_7 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var tell12 = /* @__PURE__ */ tell()(boardIsSymbol)(ordUnit);
  var _size4 = /* @__PURE__ */ _size(strongForget);
  var updateStore = /* @__PURE__ */ (() => monadStoreHalogenM(monadStoreGlobalStateActi).updateStore)();
  var tell23 = /* @__PURE__ */ tell()(sidebarIsSymbol)(ordUnit);
  var Initialise3 = /* @__PURE__ */ $Action10("Initialise");
  var BoardOutput = (value0) => $Action10("BoardOutput", value0);
  var SidebarOutput = (value0) => $Action10("SidebarOutput", value0);
  var SelectorOutput = (value0) => $Action10("SelectorOutput", value0);
  var component12 = {
    eval: /* @__PURE__ */ mkEval({
      finalize: Nothing,
      handleAction: (v) => {
        if (v.tag === "Initialise") {
          const $0 = gets6((v1) => v1.levelId);
          return $Free(
            $0._1,
            snoc2($0._2)((levelId) => $Free(
              $FreeView(
                "Bind",
                $HalogenF("Lift", debug3(Leaf)("Initialised level " + show5(levelId))),
                (x2) => $Free($FreeView("Return", x2), CatNil)
              ),
              snoc2(CatNil)(() => {
                const $1 = gets6((v1) => v1.level.marginalia);
                return $Free(
                  $1._1,
                  snoc2(snoc2($1._2)(traverse_22((m) => $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("Lift", info2(Leaf)("initialising marginalia")),
                      (x2) => $Free($FreeView("Return", x2), CatNil)
                    ),
                    snoc2(CatNil)(() => $Free(
                      make._1,
                      snoc2(make._2)((uuid) => modify_7((state) => ({ ...state, marginalia: insert(ordUUIDv4)(uuid)(m)(state.marginalia) })))
                    ))
                  ))))(() => {
                    const $2 = gets6((v1) => v1.level.problem.goal);
                    return $Free($2._1, snoc2($2._2)((v1) => tell12($$Proxy)()(SetGoalPorts(v1.ports))));
                  })
                );
              })
            ))
          );
        }
        if (v.tag === "BoardOutput") {
          if (v._1.tag === "NewBoardState") {
            const $0 = v._1._1;
            const $1 = gets6((v1) => v1.level.problem);
            return $Free(
              $1._1,
              snoc2($1._2)((problem) => modify_7((v1) => ({ ...v1, completionStatus: isReadyForTesting(problem)($0), boardSize: _size4(identity8)($0), boardPorts: getBoardPorts3($0)._1 })))
            );
          }
          if (v._1.tag === "BoardEvent") {
            return updateStore($GlobalStateAction($GameEvent("BoardEvent", v._1._1)));
          }
          fail();
        }
        if (v.tag === "SidebarOutput") {
          if (v._1.tag === "PieceDropped") {
            const $0 = v._1._1;
            const $1 = request2($$Proxy)()(GetMouseOverLocation);
            return $Free(
              $1._1,
              snoc2($1._2)((maybeLocation) => for_6(maybeLocation)((loc) => request2($$Proxy)()(AddPiece(loc)(pieceLookup($0)))))
            );
          }
          if (v._1.tag === "InputFieldOutput") {
            const $0 = v._1._1._1;
            const $1 = request2($$Proxy)()(SetBoardSize($0));
            return $Free(
              $1._1,
              snoc2($1._2)((v1) => {
                if (v1.tag === "Just") {
                  if (v1._1.tag === "Right") {
                    return modify_7((v2) => ({ ...v2, boardSize: $0 }));
                  }
                  if (v1._1.tag === "Left") {
                    const $2 = gets6((v2) => v2.boardSize);
                    return $Free($2._1, snoc2($2._2)((size4) => tell23($$Proxy)()(AmendBoardSizeSlider2(size4))));
                  }
                  fail();
                }
                if (v1.tag === "Nothing") {
                  return $Free($FreeView("Return", void 0), CatNil);
                }
                fail();
              })
            );
          }
          if (v._1.tag === "ButtonOutput") {
            if (v._1._1.tag === "AddPiece") {
              const $0 = v._1._1._1;
              const $1 = request2($$Proxy)()(GetBoard);
              return $Free(
                $1._1,
                snoc2($1._2)(traverse_13((board) => for_6(firstEmptyLocation(board))((loc) => request2($$Proxy)()(AddPiece(loc)(pieceLookup($0))))))
              );
            }
            if (v._1._1.tag === "BackToLevelSelect") {
              return monadEffectHalogenM3.liftEffect(navigateTo(monadEffectEffect)(LevelSelect));
            }
            if (v._1._1.tag === "Undo") {
              return tell12($$Proxy)()(Undo);
            }
            if (v._1._1.tag === "Redo") {
              return tell12($$Proxy)()(Redo);
            }
            if (v._1._1.tag === "RunTests") {
              const $0 = gets6((v1) => v1.level.problem);
              return $Free(
                $0._1,
                snoc2($0._2)((problem) => $Free($FreeView("Return", void 0), CatNil))
              );
            }
            if (v._1._1.tag === "Clear") {
              return tell12($$Proxy)()(Clear);
            }
            if (v._1._1.tag === "Base") {
              const $0 = v._1._1._1;
              return modify_7((v1) => ({ ...v1, base: $0 }));
            }
          }
          fail();
        }
        if (v.tag === "SelectorOutput") {
          if (v._1.tag === "AddPiece") {
            const $0 = v._1._1;
            const $1 = request2($$Proxy)()(GetBoard);
            return $Free(
              $1._1,
              snoc2($1._2)(traverse_13((board) => for_6(firstEmptyLocation(board))((loc) => request2($$Proxy)()(AddPiece(loc)(pieceLookup($0))))))
            );
          }
          if (v._1.tag === "PieceDropped") {
            const $0 = v._1._1;
            const $1 = request2($$Proxy)()(GetMouseOverLocation);
            return $Free(
              $1._1,
              snoc2($1._2)((maybeLocation) => for_6(maybeLocation)((loc) => request2($$Proxy)()(AddPiece(loc)(pieceLookup($0)))))
            );
          }
          if (v._1.tag === "DoNothing") {
            return $Free($FreeView("Return", void 0), CatNil);
          }
          fail();
        }
        if (v.tag === "MarginaliumOutput") {
          if (v._1.tag === "TriggerNext") {
            const $0 = v._1._1;
            return $Free(
              make._1,
              snoc2(make._2)((uuid) => modify_7((state) => ({ ...state, marginalia: insert(ordUUIDv4)(uuid)($0)(state.marginalia) })))
            );
          }
          if (v._1.tag === "RemoveThis") {
            const $0 = v._1._1;
            return modify_7((state) => ({ ...state, marginalia: $$delete(ordUUIDv4)($0)(state.marginalia) }));
          }
        }
        fail();
      },
      handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
      initialize: /* @__PURE__ */ $Maybe("Just", Initialise3),
      receive: (v) => Nothing
    }),
    initialState: (v) => ({
      levelId: v.levelId,
      level: v.level,
      completionStatus: NotStarted,
      boardSize: 3,
      boardPorts: getBoardPorts3(standardBoard)._1,
      marginalia: Leaf,
      base: v.level.options.base
    }),
    render: (v) => $VDom(
      "Elem",
      Nothing,
      "div",
      [id("puzzle-component")],
      [
        slot12($$Proxy)()(component7)({ board: standardBoard })(BoardOutput),
        slot22($$Proxy)()(component11)({
          problem: v.level.problem,
          completionStatus: v.completionStatus,
          boardSize: v.boardSize,
          boardPorts: v.boardPorts,
          base: v.base
        })(SidebarOutput),
        slot32($$Proxy)()(component8)({ availablePieces: v.level.problem.availablePieces })(SelectorOutput)
      ]
    )
  };

  // output-es/Game.Level.Problem/index.js
  var defaultProblem = {
    goal: idPiece,
    title: "default title",
    subtitle: Nothing,
    description: "default description",
    testCases: [],
    requiresAutomaticTesting: false,
    availablePieces: Leaf,
    otherRestrictions: []
  };

  // output-es/Game.Level/index.js
  var traverse2 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeArray))();
  var fromFoldable8 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var defaultLevelOptions = { enableBoardSizeChange: true, compulsory: false, base: Binary };
  var defaultLevel = { problem: defaultProblem, marginalia: [], options: defaultLevelOptions };
  var binaryTestInputs = (directions) => arrayBind(traverse2((v) => [uintSemiring.zero, uintSemiring.one])(directions))((inputs) => [
    fromFoldable8(zipWithImpl(Tuple, directions, inputs))
  ]);

  // output-es/Resources.LevelSuites.IntermediateSuite/index.js
  var fromFoldable9 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordPiece)(a)()(m))(Leaf);
  var intermediateSuite = {
    "Criss cross": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: crossPiece,
        title: "Cross over",
        description: "Propogate the signal on the left to the right, and the top to the bottom",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        availablePieces: /* @__PURE__ */ fromFoldable9([
          idPiece,
          superPiece,
          leftPiece,
          rightPiece,
          xorPiece
        ]),
        otherRestrictions: [
          {
            name: "Prohibited Piece",
            description: "You can't use the CrossOver piece in this level",
            restriction: (v2) => {
              const go = (v) => {
                if (v.tag === "Leaf") {
                  return true;
                }
                if (v.tag === "Node") {
                  return go(v._5) && !eqPiece.eq(v._4.piece)(crossPiece) && go(v._6);
                }
                fail();
              };
              return go(v2.pieces);
            }
          }
        ]
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
        availablePieces: /* @__PURE__ */ fromFoldable9([orPiece, notPiece])
      }
    },
    "Exclusive Or: Pick One": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: xorPiece,
        title: "Exclusive Or: Pick One",
        description: "Output true when EXACTLY one input is true. If both inputs are true, output false",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        availablePieces: /* @__PURE__ */ fromFoldable9([
          idPiece,
          notPiece,
          orPiece,
          andPiece,
          crossPiece
        ])
      }
    }
  };

  // output-es/Game.Piece.UnaryOperationPiece/index.js
  var fromFoldable10 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkUnaryOperation = (v) => ({
    complexity: { space: 0, time: 0 },
    eval: (inputs) => $$$Map(
      "Node",
      1,
      1,
      Right2,
      v.operation((() => {
        const $0 = lookup2(ordCardinalDirection)(Left2)(inputs);
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })()),
      Leaf,
      Leaf
    ),
    isSimplifiable: Nothing,
    name: v.name,
    ports: fromFoldable10([
      $Tuple(Left2, { portType: Input, capacity: v.capacity }),
      $Tuple(Right2, { portType: Output, capacity: v.capacity })
    ]),
    shouldRipple: false,
    updateCapacity: (v$1) => (v1) => Nothing,
    updatePort: (v$1) => (v1) => Nothing
  });
  var twoBitCrossOver = /* @__PURE__ */ mkUnaryOperation({
    name: "two-bit-cross-over",
    capacity: TwoBit,
    operation: (n) => uintAdd(shl(uintOrd.compare(and2(from(1))(n))(uintSemiring.zero) === "GT" ? uintSemiring.one : uintSemiring.zero)(uintSemiring.one))(uintOrd.compare(and2(from(2))(n))(uintSemiring.zero) === "GT" ? uintSemiring.one : uintSemiring.zero)
  });
  var mkShiftLeftBy = (bitShift) => (capacity) => mkUnaryOperation({ name: "shift-left-piece", capacity, operation: (n) => shl(n)(from(bitShift)) });

  // output-es/Resources.LevelSuites.ShiftingSuite/index.js
  var shiftingSuite = {
    "4 bit left shift": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: /* @__PURE__ */ mkShiftLeftBy(1)(FourBit),
        title: "4 bit left shift",
        description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl",
        testCases: /* @__PURE__ */ arrayMap(/* @__PURE__ */ singleton(Left2))(/* @__PURE__ */ arrayMap(mkSignal)([
          0,
          1,
          2,
          3,
          8,
          9,
          15
        ])),
        availablePieces: /* @__PURE__ */ foldlArray((m) => (a) => insert(ordPiece)(a)()(m))(Leaf)([
          severPiece,
          fusePiece,
          idPiece,
          leftPiece,
          rightPiece
        ])
      }
    }
  };

  // output-es/Resources.LevelSuites.TutorialSuite.Suite/index.js
  var fromFoldable11 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordPiece)(a)()(m))(Leaf);
  var tutorialSuite = {
    "From A to B": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: idPiece,
        title: "From A to B",
        subtitle: /* @__PURE__ */ $Maybe("Just", "Propagate the signal inputed on the Left to the Right"),
        testCases: /* @__PURE__ */ binaryTestInputs([Left2]),
        availablePieces: /* @__PURE__ */ fromFoldable11([])
      }
    },
    Negation: {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: notPiece,
        title: "Negation",
        description: "Negate the signal inputed on the Left and output it on the Right",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2]),
        availablePieces: /* @__PURE__ */ fromFoldable11([idPiece, notPiece])
      }
    },
    "Two enter, one leaves": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: orPiece,
        title: "Two enter, one leaves",
        description: "",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2, Up]),
        availablePieces: /* @__PURE__ */ fromFoldable11([idPiece, orPiece])
      }
    },
    "Take a Left": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: leftPiece,
        title: "Take a Left",
        description: "",
        testCases: /* @__PURE__ */ binaryTestInputs([Left2]),
        availablePieces: /* @__PURE__ */ fromFoldable11([idPiece, orPiece])
      }
    }
  };

  // output-es/Game.Piece.ArithmeticPiece/index.js
  var fromFoldable16 = /* @__PURE__ */ fromFoldable(ordCardinalDirection)(foldableArray);
  var mkSuccPiece = (capacity) => ({
    complexity: { space: 10, time: 0 },
    eval: (m) => {
      const $0 = lookup2(ordCardinalDirection)(Left2)(m);
      const s = (() => {
        if ($0.tag === "Nothing") {
          return uintSemiring.zero;
        }
        if ($0.tag === "Just") {
          return $0._1;
        }
        fail();
      })();
      return $$$Map(
        "Node",
        1,
        1,
        Right2,
        uintEq(s)(maxValue(capacity)) ? uintSemiring.zero : uintAdd(s)(uintSemiring.one),
        Leaf,
        Leaf
      );
    },
    isSimplifiable: Nothing,
    name: "succ",
    ports: fromFoldable16([
      $Tuple(Left2, { portType: Input, capacity }),
      $Tuple(Right2, { portType: Output, capacity })
    ]),
    shouldRipple: false,
    updateCapacity: (v) => (capacity$p) => $Maybe("Just", mkSuccPiece(capacity$p)),
    updatePort: (v) => (v1) => Nothing
  });
  var succPiece = /* @__PURE__ */ mkSuccPiece(TwoBit);

  // output-es/Resources.LevelSuites.TwoBitSuite/index.js
  var fromFoldable17 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordPiece)(a)()(m))(Leaf);
  var twoBitSuite = {
    "From 2A to 2B": {
      ...defaultLevel,
      problem: {
        ...defaultProblem,
        goal: /* @__PURE__ */ mkWirePiece({
          capacity: TwoBit,
          outputs: /* @__PURE__ */ $$$Map("Node", 1, 1, Right2, void 0, Leaf, Leaf)
        }),
        title: "From 2A to 2B",
        description: "This looks familiar, but the input and output ports have a capacity of 2 bits! Build a path between the left and the right, then use the '2' key to increase the capacity of the path. The capacity of each port is colour coded, only ports with the same capacity can connect!",
        availablePieces: /* @__PURE__ */ fromFoldable17([idPiece]),
        testCases: [
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(0), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(1), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(2), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(3), Leaf, Leaf)
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
        availablePieces: /* @__PURE__ */ fromFoldable17([fusePiece, idPiece]),
        testCases: [
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(0), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(1), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(2), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(3), Leaf, Leaf)
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
        availablePieces: /* @__PURE__ */ fromFoldable17([severPiece, fusePiece, idPiece]),
        testCases: [
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(0), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(1), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(2), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(3), Leaf, Leaf)
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
        availablePieces: /* @__PURE__ */ fromFoldable17([
          xorPiece,
          notPiece,
          fusePiece,
          severPiece
        ]),
        testCases: [
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(0), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(1), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(2), Leaf, Leaf),
          /* @__PURE__ */ $$$Map("Node", 1, 1, Left2, /* @__PURE__ */ from(3), Leaf, Leaf)
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
  var fromFoldable18 = /* @__PURE__ */ fromFoldable(ordRecord2)(foldableArray);
  var catMaybes4 = /* @__PURE__ */ mapMaybeWithKey(ordRecord2)((v) => identity6);
  var toUnfoldable6 = /* @__PURE__ */ (() => {
    const $0 = toArrayWithKey(Tuple);
    return (x2) => toUnfoldable(unfoldableArray)($0(x2));
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
    return $0.map((x2) => catMaybes4(fromFoldable18(arrayBind(x2)(identity4))))(traverse22((v) => {
      const $1 = v._1;
      return traverse22((v1) => $0.map(Tuple({ suiteName: $1, levelName: v1._1 }))(getLevelProgress(dictMonadEffect)({ suiteName: $1, levelName: v1._1 })))(toUnfoldable6(v._2));
    })(toUnfoldable6(allLevelSuites)));
  };

  // output-es/Component.LevelSelect/index.js
  var $Action11 = (tag, _1) => ({ tag, _1 });
  var lookup5 = /* @__PURE__ */ lookup2(/* @__PURE__ */ ordRecord()(/* @__PURE__ */ (() => {
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
  var foldMap3 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidMaybe(semigroupLevelProgress)))();
  var toUnfoldable7 = /* @__PURE__ */ (() => {
    const $0 = toArrayWithKey(Tuple);
    return (x2) => toUnfoldable(unfoldableArray)($0(x2));
  })();
  var getAllLevelProgress2 = /* @__PURE__ */ getAllLevelProgress(monadEffectEffect);
  var show7 = /* @__PURE__ */ (() => showMap({
    show: (record2) => "{ levelName: " + showStringImpl(record2.levelName) + ", suiteName: " + showStringImpl(record2.suiteName) + " }"
  })(showLevelProgress).show)();
  var modify_8 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var Initialise4 = /* @__PURE__ */ $Action11("Initialise");
  var component13 = (dictMonadAff) => {
    const monadEffectHalogenM4 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
    return {
      eval: mkEval({
        ...defaultEval,
        handleAction: (v1) => {
          if (v1.tag === "Initialise") {
            const $0 = monadEffectHalogenM4.liftEffect(getAllLevelProgress2);
            return $Free(
              $0._1,
              snoc2($0._2)((progress) => {
                const $1 = monadEffectHalogenM4.liftEffect(log2(show7(progress)));
                return $Free($1._1, snoc2($1._2)(() => modify_8((v2) => ({ ...v2, levelProgress: progress }))));
              })
            );
          }
          if (v1.tag === "NavigateTo") {
            const $0 = v1._1;
            const $1 = saveLevelProgress(monadEffectHalogenM4)($0)(Incomplete);
            return $Free($1._1, snoc2($1._2)(() => navigateTo(monadEffectHalogenM4)(level($0))));
          }
          fail();
        },
        initialize: $Maybe("Just", Initialise4)
      }),
      initialState: (v) => ({ levelProgress: Leaf }),
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
            [id("level-suites")],
            fromFoldableImpl(
              foldableObject.foldr,
              _mapWithKey(
                allLevelSuites,
                (suiteName) => (levelSuite) => $VDom(
                  "Elem",
                  Nothing,
                  "div",
                  [class_("level-suite")],
                  [
                    $VDom(
                      "Elem",
                      Nothing,
                      "h2",
                      [],
                      [
                        $VDom("Text", suiteName),
                        (() => {
                          const $0 = foldMap3((levelName) => lookup5({ suiteName, levelName })(state.levelProgress))(Object.keys(levelSuite));
                          if ($0.tag === "Just") {
                            if ($0._1 === "Completed") {
                              return $VDom(
                                "Elem",
                                Nothing,
                                "span",
                                [$Prop("Attribute", Nothing, "data-puzzle-progress", "completed")],
                                [$VDom("Text", "  \u2714")]
                              );
                            }
                            if ($0._1 === "Incomplete") {
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
                          if ($0.tag === "Nothing") {
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
                      arrayBind(toUnfoldable7(levelSuite))((v) => {
                        const $0 = v._1;
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
                                    (ev) => $Maybe("Just", $Input("Action", $Action11("NavigateTo", { suiteName, levelName: $0 })))
                                  )
                                ],
                                [
                                  $VDom("Text", $0),
                                  (() => {
                                    const $1 = lookup5({ suiteName, levelName: $0 })(state.levelProgress);
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
                              )
                            ]
                          )
                        ];
                      })
                    )
                  ]
                )
              )
            )
          )
        ]
      ))
    };
  };

  // output-es/Component.Routes/index.js
  var $Query6 = (_1, _2) => ({ tag: "Navigate", _1, _2 });
  var slot_1 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "home" })(ordUnit);
  var component14 = /* @__PURE__ */ component2(monadAffAppM);
  var slot_22 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "about" })(ordUnit);
  var component22 = /* @__PURE__ */ component(monadAffAppM);
  var slot_3 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "instructions" })(ordUnit);
  var component32 = /* @__PURE__ */ component3(monadAffAppM);
  var slot_4 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "levelSelect" })(ordUnit);
  var component42 = /* @__PURE__ */ component13(monadAffAppM);
  var slot_5 = /* @__PURE__ */ slot_()({ reflectSymbol: () => "level" })(ordUnit);
  var $$get = /* @__PURE__ */ $Free(
    /* @__PURE__ */ $FreeView(
      "Bind",
      /* @__PURE__ */ $HalogenF("State", (s) => $Tuple(s, s)),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var debug4 = /* @__PURE__ */ log$p(monadLoggerAppM)(Debug);
  var modify_9 = (f) => $Free(
    $FreeView(
      "Bind",
      $HalogenF("State", (s) => $Tuple(void 0, f(s))),
      (x2) => $Free($FreeView("Return", x2), CatNil)
    ),
    CatNil
  );
  var component15 = {
    eval: /* @__PURE__ */ mkEval({
      finalize: Nothing,
      handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
      handleQuery: (v) => {
        const $0 = v._2;
        const $1 = v._1;
        return $Free(
          $$get._1,
          snoc2($$get._2)((v1) => {
            const $2 = $FreeView(
              "Bind",
              $HalogenF("Lift", debug4(Leaf)("Navigated to " + showRoute.show($1))),
              (x2) => $Free($FreeView("Return", x2), CatNil)
            );
            const $3 = snoc2(CatNil)(() => modify_9((v2) => ({ ...v2, route: $1 })));
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
              return !(v1.route.tag === "Level" && $1.tag === "Level" && v1.route._1.levelName === $1._1.levelName && v1.route._1.suiteName === $1._1.suiteName);
            })()) {
              return $Free(
                $2,
                snoc2($3)(() => $Free($FreeView("Return", $Maybe("Just", $0)), CatNil))
              );
            }
            return $Free(
              $FreeView("Return", void 0),
              snoc2(CatNil)(() => $Free(
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
        return slot_1($$Proxy)()(component14)();
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
        const $0 = _lookup(
          Nothing,
          Just,
          replaceAll("_")(" ")(v.route._1.suiteName),
          allLevelSuites
        );
        if ($0.tag === "Just") {
          const $1 = _lookup(Nothing, Just, replaceAll("_")(" ")(v.route._1.levelName), $0._1);
          if ($1.tag === "Just") {
            return slot_5($$Proxy)()(component12)({
              levelId: { suiteName: replaceAll("_")(" ")(v.route._1.suiteName), levelName: replaceAll("_")(" ")(v.route._1.levelName) },
              level: $1._1
            });
          }
          if ($1.tag === "Nothing") {
            return $VDom("Text", "couldn't find that problem");
          }
          fail();
        }
        if ($0.tag === "Nothing") {
          return $VDom("Text", "couldn't find that problem");
        }
      }
      fail();
    }
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
      const $2 = document($1)();
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
    const $1 = document($0)();
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
  var traverse_10 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var traverse_14 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_23 = /* @__PURE__ */ traverse_14(foldableList);
  var parSequence_ = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity3);
  var traverse_32 = /* @__PURE__ */ traverse_14(foldableMaybe);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe2 = (sid) => (ref) => () => {
    const v = ref.value;
    const subs = v.subscriptions.value;
    return traverse_10(unsubscribe)((() => {
      const $0 = lookup2(ordInt)(sid);
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
  var evalQ = (render6) => (ref) => (q) => _bind(_liftEffect(() => ref.value))((v) => evalM(render6)(ref)(v.component.eval($HalogenQ(
    "Query",
    $CoyonedaF((x2) => $Maybe("Just", x2), q),
    (v$1) => Nothing
  ))));
  var evalM = (render6) => (initRef) => (v) => foldFree2((v1) => {
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
        })()))(() => _bind(handleLifecycle(v2.lifecycleHandlers)(render6(v2.lifecycleHandlers)(initRef)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Subscribe") {
      return _bind(fresh(SubscriptionId)(initRef))((sid) => _bind(_liftEffect(v1._1(sid)((x2) => {
        const $0 = handleAff(evalF(render6)(initRef)($Input("Action", x2)));
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
        return _map($0._3)(_sequential($0._1(applicativeParAff)((v3) => _bind(_liftEffect(() => v3.value))((dsx) => evalQ(render6)(dsx.selfRef)($1)))(v1$1.children)));
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
      return _sequential(foldFreeAp(applicativeParAff)(identity11)((() => {
        const $0 = evalM(render6)(initRef);
        return foldFreeAp(applicativeFreeAp)((x2) => $FreeAp("Lift", $0(x2)))(v1._1);
      })()));
    }
    if (v1.tag === "Fork") {
      const $0 = v1._1;
      return _bind(fresh(ForkId)(initRef))((fid) => _bind(_liftEffect(() => initRef.value))((v2) => {
        const $1 = v2.forks;
        return _bind(_liftEffect(() => ({ value: false })))((doneRef) => _bind(forkAff($$finally(_liftEffect((() => {
          const $2 = $$delete(ordInt)(fid);
          return () => {
            const $3 = $1.value;
            $1.value = $2($3);
            return doneRef.value = true;
          };
        })()))(evalM(render6)(initRef)($0))))((fiber) => _bind(_liftEffect((() => {
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
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(joinFiber)(lookup2(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Kill") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(killFiber(error("Cancelled")))(lookup2(ordInt)($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "GetRef") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => _pure(v1._2(lookup2(ordString)($0)(v2.refs))));
    }
    fail();
  })(v);
  var evalF = (render6) => (ref) => (v) => {
    if (v.tag === "RefUpdate") {
      const $0 = v._2;
      const $1 = v._1;
      return _liftEffect(() => {
        const $2 = ref.value;
        ref.value = { ...$2, refs: alter2((v$1) => $0)($1)($2.refs) };
      });
    }
    if (v.tag === "Action") {
      const $0 = v._1;
      return _bind(_liftEffect(() => ref.value))((v1) => evalM(render6)(ref)(v1.component.eval($HalogenQ("Action", $0, void 0))));
    }
    fail();
  };

  // output-es/Halogen.Aff.Driver.State/index.js
  var initDriverState = (component16) => (input) => (handler) => (lchs) => () => {
    const selfRef = { value: {} };
    const childrenIn = { value: Leaf };
    const childrenOut = { value: Leaf };
    const handlerRef = { value: handler };
    const pendingQueries = { value: $Maybe("Just", Nil) };
    const pendingOuts = { value: $Maybe("Just", Nil) };
    const pendingHandlers = { value: Nothing };
    const fresh2 = { value: 1 };
    const subscriptions = { value: $Maybe("Just", Leaf) };
    const forks = { value: Leaf };
    selfRef.value = {
      component: component16,
      state: component16.initialState(input),
      refs: Leaf,
      children: Leaf,
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
  var traverse_11 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var traverse_15 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_24 = /* @__PURE__ */ traverse_15(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_15(foldableMap);
  var parSequence_2 = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity3);
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
      const $0 = traverse_11(forkAff);
      return (x2) => handleAff($0(reverse2(x2)));
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
        return (x2) => handleAff($4(x2));
      })())($3)();
      return v.forks.value = Leaf;
    };
  };
  var runUI = (renderSpec2) => (component16) => (i) => {
    const squashChildInitializers = (lchs) => (preInits) => (st) => {
      const parentInitializer = evalM(render6)(st.selfRef)(st.component.eval($HalogenQ("Initialize", void 0)));
      return () => {
        const $0 = lchs.value;
        lchs.value = {
          initializers: $List(
            "Cons",
            _bind(parSequence_2(reverse2($0.initializers)))(() => _bind(parentInitializer)(() => _liftEffect((() => {
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
      render6(lchs)($0.selfRef)();
      const $1 = $$var.value;
      squashChildInitializers(lchs)(pre.initializers)($1)();
      return $$var;
    };
    const renderChild = (lchs) => (handler) => (childrenInRef) => (childrenOutRef) => (slot4) => () => {
      const a$p = childrenInRef.value;
      const childrenIn = slot4.pop(a$p);
      const $$var = (() => {
        if (childrenIn.tag === "Just") {
          childrenInRef.value = childrenIn._1._2;
          const dsx = childrenIn._1._1.value;
          const $02 = _pure();
          dsx.handlerRef.value = (x2) => {
            const $12 = slot4.output(x2);
            if ($12.tag === "Nothing") {
              return $02;
            }
            if ($12.tag === "Just") {
              return handler($12._1);
            }
            fail();
          };
          handleAff(evalM(render6)(dsx.selfRef)(dsx.component.eval($HalogenQ(
            "Receive",
            slot4.input,
            void 0
          ))))();
          return childrenIn._1._1;
        }
        if (childrenIn.tag === "Nothing") {
          return runComponent(lchs)((() => {
            const $02 = _pure();
            return (x2) => {
              const $12 = slot4.output(x2);
              if ($12.tag === "Nothing") {
                return $02;
              }
              if ($12.tag === "Just") {
                return handler($12._1);
              }
              fail();
            };
          })())(slot4.input)(slot4.component)();
        }
        fail();
      })();
      const a$p$1 = childrenOutRef.value;
      const $0 = warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur");
      if ((() => {
        const $12 = slot4.get(a$p$1);
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
      childrenOutRef.value = slot4.set($$var)($1);
      const $2 = $$var.value;
      if ($2.rendering.tag === "Nothing") {
        return throwException(error("Halogen internal error: child was not initialized in renderChild"))();
      }
      if ($2.rendering.tag === "Just") {
        return renderSpec2.renderChild($2.rendering._1);
      }
      fail();
    };
    const render6 = (lchs) => ($$var) => () => {
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
      v.childrenOut.value = Leaf;
      v.childrenIn.value = v.children;
      const $0 = v.pendingHandlers;
      const rendering = renderSpec2.render((() => {
        const $12 = _map((v$1) => {
        });
        return (x2) => handleAff(queueOrRun($0)($12(evalF(render6)(v.selfRef)(x2))));
      })())(renderChild(lchs)((() => {
        const $12 = _map((v$1) => {
        });
        return (x2) => queueOrRun(v.pendingQueries)(queueOrRun($0)($12(evalF(render6)(v.selfRef)($Input(
          "Action",
          x2
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
          const $22 = traverse_11(forkAff);
          return (x2) => handleAff($22(reverse2(x2)));
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
            evalM(render6)(st.selfRef)(st.component.eval($HalogenQ("Finalize", void 0))),
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
      const $0 = runComponent(lchs)((x2) => _liftEffect(sio.listener(x2)))(i)(component16)();
      const dsx = $0.value;
      return {
        query: (() => {
          const $1 = dsx.selfRef;
          return (q) => _bind(_liftEffect(() => disposed.value))((v) => {
            if (v) {
              return _pure(Nothing);
            }
            return evalQ(render6)($1)(q);
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
  var getEffProp2 = function(name3) {
    return function(node) {
      return function() {
        return node[name3];
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
  var identity19 = (x2) => x2;
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
  var mkSpec = (handler) => (renderChildRef) => (document2) => ({
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
      const render6 = (slot4) => {
        if (slot4.tag === "ComponentSlot") {
          const $0 = slot4._1;
          return renderComponentSlot($0);
        }
        if (slot4.tag === "ThunkSlot") {
          const $0 = slot4._1;
          const step4 = buildThunk2($0);
          return $Step$p(
            step4._1,
            $Maybe("Just", step4),
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
      const patch = (st, slot4) => {
        if (st.tag === "Just") {
          if (slot4.tag === "ComponentSlot") {
            const $0 = slot4._1;
            halt(st._1);
            return renderComponentSlot($0);
          }
          if (slot4.tag === "ThunkSlot") {
            const $0 = slot4._1;
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
        return render6(slot4);
      };
      return render6;
    },
    buildAttributes: buildProp(handler),
    document: document2
  });
  var renderSpec = (document2) => (container) => ({
    render: (handler) => (child) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return () => {
          const renderChildRef = { value: child };
          const machine = buildVDom(mkSpec(handler)(renderChildRef)(document2))(v);
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
    renderChild: identity19,
    removeChild: removeChild3,
    dispose: removeChild3
  });
  var runUI2 = (component16) => (i) => (element) => _bind(_liftEffect(() => {
    const $0 = windowImpl();
    return document($0)();
  }))((document2) => runUI(renderSpec(document2)(element))(component16)(i));

  // output-es/Main/index.js
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
        return old._1.tag === "Level" && $$new.tag === "Level" && old._1._1.levelName === $$new._1.levelName && old._1._1.suiteName === $$new._1.suiteName;
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
    return log$p({ log: (message2) => (v) => v(message2), MonadEffect0: () => monadEffectLoggerT1 })(Info)(Leaf)("Starting ABED")(logMessage(monadEffectAff)(Info));
  })())(() => _bind(awaitLoad)(() => _bind(runAppM(component15))((rootComponent) => _bind(_bind(rootElement)(runUI2(rootComponent)()))((v) => _liftEffect(initialiseRouting((route) => runHalogenAff(v.query($Query6(
    route,
    void 0
  ))))))))));

  // <stdin>
  main();
})();
