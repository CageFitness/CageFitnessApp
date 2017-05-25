#!/bin/bash
/Applications/Appcelerator\ Studio/plugins/com.appcelerator.titanium.liveview.core_1.1.0.1476939755/node_modules/liveview/bin/liveview server stop
appc run \
--platform ios \
--log-level info \
--sdk 6.0.4.GA \
--project-dir /Users/pabloliz/Projects/iquariusmedia.com/cagefitness.com/titanium/CageFitnessApp \
--target device \
--ios-version 10.3 \
--device-family universal \
--developer-name "Steven Holliday (3RC95J5NP5)" \
--device-id 5f5b161d39c57aabf8826de69cec7f2bb00f391e \
--pp-uuid e793dcca-9f37-4b29-9500-d9acec0b16fe \
--skip-js-minify \
--no-progress-bars \
--no-prompt \
--prompt-type socket-bundle \
--no-banner \
--liveview \

