# Local npm binaries (lessc, spago, purs-backend-es, etc.) are on PATH for all recipes.
export PATH := $(CURDIR)/node_modules/.bin:$(PATH)

LESS_SRCS := $(wildcard less/*.less less/*.css)
PURS_SRCS := $(shell find src test piece-viewer/src -name '*.purs' 2>/dev/null)
SPAGO_CFG := spago.yaml spago.lock piece-viewer/spago.yaml

.PHONY: all abed piece-viewer css prod test clean deps

all: abed

# Ensure npm devDependencies (and spago packages via postinstall) exist.
deps: node_modules/.bin/spago

node_modules/.bin/spago:
	npm install

# --- CSS ---

css: dist/static/default.css

dist/static/default.css: less/default.less $(LESS_SRCS) | deps
	@mkdir -p dist/static
	lessc $< $@

# --- Main app ---

abed: dist/static/abed.js dist/static/default.css dist/index.html

dist/static/abed.js: $(PURS_SRCS) $(SPAGO_CFG) dist/static/default.css | deps
	spago bundle -p abed

# --- Piece viewer ---

piece-viewer: dist-piece-viewer/index.html

dist-piece-viewer/static/piece-viewer.js: $(PURS_SRCS) $(SPAGO_CFG) | deps
	spago bundle -p piece-viewer

dist-piece-viewer/index.html: dist-piece-viewer/static/piece-viewer.js \
                             piece-viewer/index.html \
                             piece-viewer/piece-viewer.css
	@mkdir -p dist-piece-viewer/static/images
	cp piece-viewer/index.html dist-piece-viewer/
	cp piece-viewer/piece-viewer.css dist-piece-viewer/static/
	if [ -d dist/static/images ]; then cp -r dist/static/images/. dist-piece-viewer/static/images/; fi

# --- Production bundle (purs-backend-es) ---

prod: dist/static/default.css | deps
	purs-backend-es build
	purs-backend-es bundle-app --no-build

# --- Tests ---

test: $(PURS_SRCS) $(SPAGO_CFG) | deps
	spago test -- --fail-fast

# --- Clean ---

clean:
	rm -rf dist/static/default.css dist/static/abed.js dist-piece-viewer output output-es .spec-results
