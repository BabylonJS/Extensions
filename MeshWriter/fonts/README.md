# So you want to build a 3-D font, eh?

A committed individual can transform an SVG-style path into something that MeshWriter will use.&nbsp;
An extremely committed individual can make a whole alphabet.&nbsp;
Here is the basic road map.

## How shapes are specified

### Basic shapes

Meshwriter curves follow SVG-style rules.  These include:&nbsp;   
  ~ 'M' move to, only at the beginning   
  ~ 'L' line, never at the beginning   
  ~ 'l' line   
  ~ 'Q' quadratic curve   
  ~ 'q' quadratic curve   
  ~ 'C' cubic curve   
  ~ 'c' cubic curve

Just below is an example from Comic (a gnarly font) showing the letter 'j' in SVG and in MeshWriter.&nbsp;
In MeshWriter, the commands are placed in arrays.&nbsp;
The length of the array indicates the command type.&nbsp;
  ~ 2: M or L   
  ~ 3: l   
  ~ 4: Q   
  ~ 5: q   
  ~ 6: C   
  ~ 7: c

**Key** **Point** Meshwriter shapes are superficially similar to SVG shapes but, instead of a parseable text string, commands are in arrays.&nbsp;
The size of the array indicates which command is specified.

Since 'j' has two shapes, including the dot, the fullPath shows two M commands.&nbsp;
In Meshwriter, this converted to two arrays, one for each shape.&nbsp;
So this means that shapeCmds has three levels.&nbsp;
At the top is an array containing all shapes, usually one or more.&nbsp;
Each shape is an array of commands, each command containing multiple coordinates.&nbsp;

	Three encodings for the letter 'j'
	fullPath  : "M 233.5 632.5 Q 209.5 632.5 192 649.5 Q 175 666.5 175 690 Q 175 714 192 731 Q 209.5 748 233.5 748 Q 257.5 748 275 731 Q 292.5 714 292.5 690 Q 292.5 666.5 275 649.5 Q 257.5 632.5 233.5 632.5 Z M 229.5 -116 Q 230 -57.5 212.5 183.5 L 195.5 459 Q 195.5 484 209.5 503.5 Q 224 523 246 523 Q 263 523 280 510.5 Q 297 498 298 485 L 314.5 197 L 328 -111 Q 328 -180.5 286.5 -237 Q 241.5 -298.5 177 -298.5 Q 69.5 -298.5 -3 -133 Q -9 -119.5 -9 -109 Q -9 -89 6.5 -74.5 Q 22.5 -60 42.5 -60 Q 72 -60 104 -125 Q 112 -142 132 -174 Q 151.5 -199 177 -199 Q 199 -199 214.5 -166 Q 226.5 -141 229.5 -116 Z",
	shapeCmds : [[[233.5,632.5],[209.5,632.5,192,649.5],[175,666.5,175,690],[175,714,192,731],[209.5,748,233.5,748],[257.5,748,275,731],[292.5,714,292.5,690],[292.5,666.5,275,649.5],[257.5,632.5,233.5,632.5]],[[229.5,-116],[230,-57.5,212.5,183.5],[195.5,459],[195.5,484,209.5,503.5],[224,523,246,523],[263,523,280,510.5],[297,498,298,485],[314.5,197],[328,-111],[328,-180.5,286.5,-237],[241.5,-298.5,177,-298.5],[69.5,-298.5,-3,-133],[-9,-119.5,-9,-109],[-9,-89,6.5,-74.5],[22.5,-60,42.5,-60],[72,-60,104,-125],[112,-142,132,-174],[151.5,-199,177,-199],[199,-199,214.5,-166],[226.5,-141,229.5,-116]]],
	sC        : ['D¸K3 DfK3DBKU CÃKxCÃL% CÃLVDBLy DfL½D¸L½ EEL½EiLy E®LVE®L% E®KxEiKU EEK3D¸K3','D°?Z D±@ODlD1 DIHX DIH­DfI1 D¥IXE.IX EPIXEsI? E·I%E¹H¯ F7DL FR?e FR>YE¢=i E$<nD#<n BM<nA<?8 A0?SA0?i A0?³AO@- Ap@JAº@J BR@JBµ?H C!?%CJ>g Cr>4D#>4 DP>4Dp>w Dª?(D°?Z'],

The third version, sC is an encoded version, saving 45% of the space.&nbsp;
This may be handy should we want a lot of fonts in one package.&nbsp;
The encoding is proprietary, simple and built into MeshWriter.&nbsp;
It puts an array of arrays into an ASCII string.&nbsp;

Furthermore it is optional; any given symbol may present either shapeCmds or sC.&nbsp;
I usually encode stable symbols after a while.

### Acquiring the shapes

My approach has been to visit https://opentype.js.org/glyph-inspector.html, upload my font and then acquire glyphs in semi-SVG form.&nbsp; 

I have not been able to use the output of Glyph Inspector without review and, often, tuning.&nbsp;
More on that below.

### Holes

Many letters have holes in them.&nbsp;
Glyph Inspector also outputs the holes.&nbsp;
Meshwriter supports holes.&nbsp;
The basic task here is that fonts need not line up the hole to the shape it is coming from.&nbsp;
For MeshWriter, we must.&nbsp;
The '%', shown just below, is a classic example.

	Commands for Percent '%', with three shapes and two holes 
	shapeCmds : [
	  [[338,-24],[260,-24],[649,724],[725,724],[338,-24]],
	  [[751,-14],[665,-14,622,45],[584,96,584,185],[584,272,624,325],[668,384,751,384],[834,384,878,325],[918,272,918,185],[918,96,880,45],[837,-14,751,-14]],
	  [[249,316],[163,316,120,375],[82,426,82,515],[82,602,122,655],[166,714,249,714],[332,714,376,655],[416,602,416,515],[416,426,378,375],[335,316,249,316]]
	],
	holeCmds  : [
	  [],
	  [[[674,185],[674,51,750,51],[828,51,828,185],[828,319,750,319],[674,319,674,185]]],
	  [[[172,515],[172,381,248,381],[326,381,326,515],[326,649,248,649],[172,649,172,515]]]
	]

**Key** **Point** Hole commands are always one array level deeper than shape commands.&nbsp;
This is necessary because a single shape may have multiple holes, like 'B'.

### Tuning A, lining up holes

The hole commands must line up with the shape commands and, AFAIK, this must be done manually.&nbsp;
Fonts do not seem to need to do this at all.&nbsp;
They might list the holes in any order and they may come before or after the shapes.&nbsp;
I seriously spend some time eyeballing shapes and holes and then organize them for correct results.

### Tuning B, rotation

Fonts may specify a Shape clockwise or counter-clockwise.&nbsp;
They may specify a Hole clockwise or counter-clockwise.&nbsp;
Any given font might pick any pair of directions.&nbsp;
Luckily, they seem to stick with it through all the symbols.

My experience is the Babylon is only happy with one direction; I forget which.&nbsp;
So, the output of the Glyph Inspector might need reversal for Babylon.&nbsp;
I put some font-level flags in place to handle this.&nbsp;
You will find them at the top of each font file.&nbsp; 
My scientific method is to try all combinations until I find the one that looks good.

	Declarations for each current font
	(helvetica neue) { reverseHoles : false , reverseShapes : true  };
	(comic)          { reverseHoles : false , reverseShapes : true  };
	(jura)           { reverseHoles : true  , reverseShapes : false };


## 'C' is for Cat

So let's start with a simple letter, C.&nbsp;
Because we believe life should be easy, we will use 'HelveticaNeue-Medium.ttf'.&nbsp;
(This is a modern font and its files are pretty well-behaved.)&nbsp;
Visit https://opentype.js.org/glyph-inspector.html, upload the font file, and then click on the letter C.&nbsp;
What you see should be similar to the screen capture immediately below.&nbsp;

![alt text](https://raw.githubusercontent.com/briantbutton/meshwriter/master/fonts/Figure1.png "Logo Title Text 1")

Note that the information we need is immediately visible.&nbsp;
The key thing is to get that information into MeshWriter in a form it can take.&nbsp;

## This

document is not

## Finished

yet

