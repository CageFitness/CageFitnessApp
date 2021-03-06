#!/bin/bash
appc run \
--platform ios \
--log-level info \
--project-dir /Users/pabloliz/Projects/iquariusmedia.com/cagefitness.com/titanium/CageFitnessApp \
--target device \
--ios-version 11.2 \
--device-family universal \
--developer-name "Steven Holliday (3RC95J5NP5)" \
--device-id 5f5b161d39c57aabf8826de69cec7f2bb00f391e \
--pp-uuid fac31be7-114d-43ac-8d05-e777df767f19 \
--skip-js-minify \
--no-progress-bars \
--no-prompt \
--prompt-type socket-bundle \
--no-banner \
--liveview \

