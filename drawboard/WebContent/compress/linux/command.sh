cd $RICHPIVOTDASHBOARD_BASE/src/main/webapp/compress/linux
pwd
sh ./compress.sh dojoCssList.txt css ../../css/cssAll.css 0;
sh ./compress.sh selfCssList.txt css ../../css/cssSelfAll.css 1 yuicompressor-2.4.7.jar;
sh ./compress.sh jsList.txt js ../../js/jsAll.js 1 yuicompressor-2.4.7.jar;
sh ./compress.sh dojoJsList.txt js ../../js/dojoJsAll.js 1 yuicompressor-2.4.7.jar;
cp ../dojo.js ../../js/DashboardRichpivot/dojo/dojo.js;
