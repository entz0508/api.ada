#!/bin/sh

forever stopall

#cd /data/www/api.adb/
#forever start app_adb.js
cd /data/www/api.ada/
forever start app_ada.js
#cd /data/www/api.jsu/
#forever start app_jsu.js
#cd /data/www/api.slpplatform/
#forever start app_slp_platform.js


cd /data/www/doc.api/
forever start doc.js	

cp /home/bluedora/.ssh/id_rsa /data/www/api.slpplatform/ssh
rm -f /data/www/api.slpplatform/ssh/rsa-key-slp-dla-photo-upload-dev.openssh
mv /data/www/api.slpplatform/ssh/id_rsa /data/www/api.slpplatform/ssh/rsa-key-slp-dla-photo-upload-dev.openssh

clear
forever list


