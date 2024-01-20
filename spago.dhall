{-
Welcome to a Spago project!
You can edit this file as you like.

Need help? See the following resources:
- Spago documentation: https://github.com/purescript/spago
- Dhall language tour: https://docs.dhall-lang.org/tutorials/Language-Tour.html

When creating a new Spago project, you can use
`spago init --no-comments` or `spago init -C`
to generate this file without the comments in this block.
-}
{ name = "abed"
, dependencies =
  [ "aff"
  , "arrays"
  , "bifunctors"
  , "console"
  , "contravariant"
  , "control"
  , "datetime"
  , "debug"
  , "effect"
  , "either"
  , "enums"
  , "exceptions"
  , "filterable"
  , "foldable-traversable"
  , "foreign-object"
  , "gen"
  , "group"
  , "halogen"
  , "halogen-subscriptions"
  , "halogen-svg-elems"
  , "halogen-vdom"
  , "identity"
  , "integers"
  , "lists"
  , "maybe"
  , "monad-logger"
  , "newtype"
  , "node-process"
  , "now"
  , "numbers"
  , "ordered-collections"
  , "partial"
  , "prelude"
  , "profunctor"
  , "profunctor-lenses"
  , "record"
  , "refs"
  , "routing"
  , "routing-duplex"
  , "strings"
  , "tailrec"
  , "these"
  , "transformers"
  , "tuples"
  , "typelevel"
  , "unfoldable"
  , "unsafe-coerce"
  , "web-dom"
  , "web-events"
  , "web-html"
  , "web-storage"
  , "web-uievents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
