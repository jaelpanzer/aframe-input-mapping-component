how to include custom fonts

PROBLEM:
a-frame's built in fonts only include English alpha-numeric characters
even the repo for different font types only include English relevant characters
https://github.com/etiennepinchon/aframe-fonts


LOCALIZATION:
a-frame knows this limitation and thus has provided some steps to allow for custom fonts.


find a TrueType or OpenType font that supports the desired language / glyphs
- use https://fontdrop.info/ to see info about the supported glyphs in the font file

copy the character-set / glyphs needed
- uploading the font to http://torinak.com/font/lsfont.html allows you to copy the characters needed
- only copy the minimum characters needed by the language

sample character-set for latin:
1234567890
!"#$%&'()*+,-./
:;<=>?
@ABCDEFGHIJKLMNO
PQRSTUVWXYZ[\]^_
`abcdefghijklmno
pqrstuvwxyz{|}~
 ¡¢£¤¥¦§¨©ª«¬­®¯
°±²³´µ¶·¸¹º»¼½¾¿
ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ
ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß
àáâãäåæçèéêëìíîï
ðñòóôõö÷øùúûüýþÿ
ĀāĂăĄąĆćĈĉĊċČčĎď
ĐđĒēĔĕĖėĘęĚěĜĝĞğ
ĠġĢģĤĥĦħĨĩĪīĬĭĮį
İıĲĳĴĵĶķĸĹĺĻļĽľĿ
ŀŁłŃńŅņŇňŉŊŋŌōŎŏ
ŐőŒœŔŕŖŗŘřŚśŜŝŞş
ŠšŢţŤťŦŧŨũŪūŬŭŮů
ŰűŲųŴŵŶŷŸŹźŻżŽž


convert font file to msdf font
- go to https://msdf-bmfont.donmccurdy.com/
- upload font file
- under "select character set" paste the characters needed
- click "create msdf" button and download the generated msdf font file

make the font file accessible in javascript
- the downloaded zip file will contain a *.png and a -msdf.json 
- put both files in the same directory where your javascript can find them


sample html:
<a-text value="12345"
        font="Roboto-Regular-msdf.json"
        color="#33C3F0"
        negate="false">
</a-text>

sample javascript:
let captionEl = document.createElement('a-text');
setAttributes(captionEl, {
    width: 2,
    align: "left",
    font: "assets/fonts/_generated/Roboto-Regular-msdf.json",
    shader: "msdf",
    negate: "false",
    color: textColor,
    value: text
});
