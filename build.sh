#!/bin/bash
/Applications/Appcelerator\ Studio/plugins/com.appcelerator.titanium.liveview.core_1.1.0.1476939755/node_modules/liveview/bin/liveview server stop
# appc run --liveview --platform ios --device-id B813DAFA-E585-4F68-A277-073880EE2729
# appc run --platform ios --liveview --target simulator --device-id B813DAFA-E585-4F68-A277-073880EE2729 
appc run --platform ios --liveview --target simulator --device-id B813DAFA-E585-4F68-A277-073880EE2729
# appc run --liveview --platform ios -C B813DAFA-E585-4F68-A277-073880EE2729
