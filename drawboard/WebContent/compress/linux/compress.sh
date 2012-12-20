#!/bin/sh
if [ -f $3 ]; then
rm $3
fi
if [ -f ${3}.uncompressed.${2} ]; then
rm ${3}.uncompressed.${2}
fi
cat $1|while read LINE
do
cat $LINE >> ${3}.uncompressed.${2}
done
if [ $4 -eq 1 ]; then
java -jar $5 --type $2 --charset utf-8 ${3}.uncompressed.${2}  -o $3
else
cat ${3}.uncompressed.${2} >> $3
fi
echo "${3} compress completely"