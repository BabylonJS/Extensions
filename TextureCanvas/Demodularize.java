/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package src;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;

/**
 *
 * @author root
 */
public class Demodularize {

    public static void main(String[] args) throws IOException {
        Path source = Paths.get(parsePath(args[0]));
        File target = new File(parsePath(args[1]));
        if(target.exists()){
            target.delete();
        }
        String contents = new String(Files.readAllBytes(source));
        // Remove module property
        contents = contents.replace("Object.defineProperty(exports, \"__esModule\", { value: true });", "");
        // Fix imports
        contents = contents.replaceAll("require\\(.*\\)", "BABYLON");
        // Fix export
        contents = contents.replace("exports.", "BABYLON.");
        Files.write(target.toPath(), contents.getBytes());
    }
    
    private static String parsePath(String arg){
        String path = arg;
        if(arg.startsWith("\"")){
            path = arg.substring(1, arg.length() - 1);
        }
        return path;
    }
}
