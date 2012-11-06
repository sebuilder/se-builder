PROJECT="seleniumbuilder"
PWD=`pwd`
BUILD="build"
JS_VERSION=$(shell cat `find . -name loader.js` | grep 'builder.version = ".*"' | cut -d '"' -f 2 )
RDF_VERSION=$(shell grep -Go 'em:version\>\(.*\)\<' seleniumbuilder/install.rdf | grep -Go '>\(.*\)<' | sed -e 's/[><]*//g' )
NAME="${PROJECT}-${JS_VERSION}.xpi"
XPI="${PWD}/${BUILD}/${NAME}"
INSTALL_RDF=$(shell find . -name install.rdf)
.PHONY: xpi clean

help:
	@echo "Selenium Builder - v${JS_VERSION}\n"
	
	@echo "Available targets:"
	@echo "xpi: creates the plugin file"
	@echo "clean: deletes the generated artifacts"

xpi:
	@echo "Building latest '${XPI}'..."
	@mkdir -p ${BUILD}
	@find . -iname "*.rdf" | xargs grep -l "em:version" | xargs sed -i "" -e 's#<em:version>\([^<][^<]*\)</em:version>#<em:version>${JS_VERSION}</em:version>#'
	@cd seleniumbuilder; zip -r ../build/${NAME} .
	@echo "File generated at: build/${NAME}" 

clean:
	@echo "Removing '${PWD}/${BUILD}'..."
	@rm -rf ${BUILD}
