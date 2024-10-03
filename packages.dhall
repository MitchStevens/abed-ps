let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.9-20230629/packages.dhall
        sha256:f91d36c7e4793fe4d7e042c57fef362ff3f9e9ba88454cd38686701e30bf545a
in  upstream
  with halogen-svg-elems.repo = "https://github.com/MitchStevens/purescript-halogen-svg-elems.git"
  with halogen-svg-elems.version = "df7b35f"