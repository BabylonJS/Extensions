# Ascii Art Renderer

How cool (... or nerd - ish) could it be to render all your BJS scene in Ascii ART?

If you would like it, this extension is made for you.

## What is it ?

This is a simple Babylon JS post process converting your scene to Ascii Art.

## How to try ?

After cloning the babylon extension repository, open a command prompt in the Ascii Art Renderer folder.

First install the required dependencies:

```
npm install
```

Then run the tool with the following command:

```
gulp webserver
```

## How to use ?

Simply reference the script from the dist folder in your application after the Babylon JS main file.

Then, you only need to instantiate the post process to bring it to life.

```
// Creates the post process
var postProcess = new BABYLONX.AsciiArtPostProcess("AsciiArt", camera);
```