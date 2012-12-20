if exist %3 del %3
if exist %3.uncompressed.%2 del %3.uncompressed.%2
for /f %%i in (%1) do type %%i >> %3.uncompressed.%2
if %4==1 java -jar %5 --type %2 --charset utf-8 -o %3 %3.uncompressed.%2
if %4==0 type %3.uncompressed.%2 >> %3