import java.io.*;
import java.net.*;

public class Arpabet {
	private static char WORD_SEPARATOR = '¼';
    private static char ALTERNATIVE_SEPARATOR = '©';
    private static String VERSION = "0.7a";
    private static String SOURCE_URL = "http://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/cmudict." + VERSION;
    private static String INDEX = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
	public static void main(String[] args) throws Exception {
        System.out.println("Beginning pull");
		final String input = new String(httpGet(SOURCE_URL));
        System.out.println("retrieved, length:  " + input.length() );
        
        final File f = new File("../Blender/blender-test/lib/cmudict." + VERSION + ".js");
        f.createNewFile();
        final FileWriter writer = new FileWriter(f);
        
        writer.append("var ARPABET;\n");
        writer.append("(function (ARPABET) {\n");
        
        String header = input.substring(0, input.lastIndexOf(";;; # =") );
        header = header.replace(";;; ", "");
        
        String copyright = header.substring(header.indexOf("Copyright"));
        copyright = copyright.replace("# ", "");
        copyright = copyright.replace("#" , "");
        copyright = copyright.replace("\n", "\\n"); // turn newlines into \n's
        writer.append("    function getCopyright() {\n");
        writer.append("        return \"" + copyright + "\";\n");
        writer.append("    }\n");
        writer.append("    ARPABET.getCopyright = getCopyright;\n\n");
        writer.append("    var INDEX = \"" + INDEX + "\";\n");
       
        writer.append("    var DICT = [\n");
        for (int i = 0; i < INDEX.length(); i++){
        	String firstChar = String.valueOf(INDEX.charAt(i) );
        	String next = (i + 1 < INDEX.length()) ? String.valueOf(INDEX.charAt(i + 1) ) : null;
        	String[] pull = getSectionAsArray(input, firstChar, next);
        	writer.append("        \"" + processSection(pull) + "\",\n");
        }
        writer.append("    ];\n");
        writer.append("    var OTHERS = \"" + getOthers(input) + "\";\n\n");

        
        writer.append("    ARPABET.FULL_STRESS    = 0;\n");
        writer.append("    ARPABET.NO_STRESS      = 1;\n");
        writer.append("    ARPABET.LIMITED_STRESS = 2;\n\n");
        
        writer.append("    function lookupWord(word) {\n");
        writer.append("        word = word.toUpperCase();\n");
        writer.append("        var idx = INDEX.indexOf(word.substring(0, 1));\n");
        writer.append("        var section = (idx !== -1) ? DICT[idx] : OTHERS;\n");
        writer.append("        var key = \"" + WORD_SEPARATOR + "\" + word.substring((idx !== -1) ? 1 : 0);\n");
        writer.append("        key += \"" + ALTERNATIVE_SEPARATOR + "\";\n\n");
        
        writer.append("        var altStart = section.indexOf(key);\n");
        writer.append("        if (altStart !== -1){;\n");
        writer.append("            altStart = altStart + key.length;\n");
        writer.append("            var altEnd = section.indexOf(\"" + WORD_SEPARATOR + "\", altStart);\n");
        writer.append("            altEnd = (altEnd !== -1) ? altEnd : section.length;\n");
        writer.append("            return section.substring(altStart, altEnd).split(\"" + ALTERNATIVE_SEPARATOR + "\");\n\n");

        writer.append("        }else return null;\n");        
        writer.append("    }\n\n");
        
        writer.append("    function lookup(sentence, alternatePhonemeSeparator, includeStress) {\n");
        writer.append("        var words = sentence.split(\" \");\n");
        writer.append("        var results = [];\n");
        writer.append("        var maxAlternatives = 0;\n");
        writer.append("        for(var i = 0; i < words.length; i++){\n");
        writer.append("            var result = lookupWord(words[i]);\n");
        writer.append("            if (result !== null){\n");
        writer.append("                results.push(result);\n");
        writer.append("                if (maxAlternatives < result.length)\n");
        writer.append("                    maxAlternatives = result.length;\n");
        writer.append("            }\n");
        writer.append("        }\n\n");
        
        writer.append("        var ret = new Array(maxAlternatives);\n");
        writer.append("        for(var i = 0; i < results.length; i++){\n");
        writer.append("            var result = results[i];\n");
        writer.append("            for(var j = 0; j < maxAlternatives; j++){\n");
        writer.append("                var val = result[(result.length > j) ? j : result.length - 1];\n");
        writer.append("                if (i > 0)\n");
        writer.append("                    ret[j] = ret[j] + val + \" .\";\n");
        writer.append("                else\n");
        writer.append("                    ret[j] = val + \" .\";\n\n");
        
        writer.append("                if (i + 1 < results.length)\n");
        writer.append("                    ret[j] = ret[j] + \" \";\n\n");
        writer.append("            }\n");
        writer.append("        }\n");
        writer.append("        if (!includeStress) includeStress = ARPABET.FULL_STRESS;\n");
        writer.append("        for(var j = 0; j < maxAlternatives; j++){\n");
        writer.append("            if (alternatePhonemeSeparator )\n");
        writer.append("                ret[j] = ret[j].replace(/ /g, alternatePhonemeSeparator);\n\n");
        
        writer.append("            switch (includeStress){\n");
        writer.append("                case ARPABET.NO_STRESS: \n");
        writer.append("                    ret[j] = ret[j].replace(/2/g, '');\n");
        writer.append("                    ret[j] = ret[j].replace(/3/g, '');\n");
        writer.append("                case ARPABET.LIMITED_STRESS: \n");
        writer.append("                    ret[j] = ret[j].replace(/1/g, '');\n");
        writer.append("            }\n");
        writer.append("        }\n");
        writer.append("        return ret;\n");
        writer.append("    }\n");
        writer.append("    ARPABET.lookup = lookup;\n");
        
        writer.append("})(ARPABET || (ARPABET = {}));\n");
        writer.close();
     }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static String[] getSectionAsArray(final String input, final String firstChar, final String next){
    	int begin = input.indexOf("\n" + firstChar);
    	int end   = (next != null) ? input.indexOf("\n" + next) : input.length();
    	
        String ret = input.substring(begin, end);   // initial pull
        ret = ret.replace("\n" + firstChar, "\n" + WORD_SEPARATOR); // keep a \n in result, for a future split()

        ret = ret.replace("  ", "" + ALTERNATIVE_SEPARATOR);
        
        ret = ret.substring(1); // ditch leading \n, nolonger needed
    	return ret.split("\n");
    }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static String getOthers(final String input){
    	int begin = input.indexOf("\n!");
    	int end   = input.indexOf("\nA");
    	
        String ret = input.substring(begin, end);   // initial pull
        ret = ret.replace("\n", "" + WORD_SEPARATOR); 
        ret = ret.replace("  ", "" + ALTERNATIVE_SEPARATOR);
        ret = ret.replace("\"", "\\\""); // some entries contain double quote, escape it
    	return ret;
    }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static String processSection(final String[] section){
    	final int nItems = section.length;
    	StringBuilder ret = new StringBuilder();
    	String key, paren = "(";
    	
    	// outer loop for non-alternatives only
    	for (int i = 0; i < nItems; i++){
    		if (section[i].contains(paren) ) continue; // skip; is an alternative
    		
    		ret.append(section[i]);
    		key = section[i].substring(0, section[i].indexOf(ALTERNATIVE_SEPARATOR) ) + paren; // key with '(' at end
    		for (int j = i + 1; j < nItems; j++){
    			if (section[j].startsWith(key) ){
    				ret.append(section[j].substring(section[j].indexOf(ALTERNATIVE_SEPARATOR)) );
    			}
    		}
    	}
    	return ret.toString();
    }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static byte[] httpGet(final String addr) throws Exception{
        DataInputStream response = null;
        HttpURLConnection con = null;
        try{
            final URL site = new URL(addr);
            con = (HttpURLConnection) site.openConnection();

            // set attributes prior to actually connecting
            con.setUseCaches(false);
            con.setConnectTimeout(0);
            con.setReadTimeout(0);

            // connect & check response, store cookie, & get response data
            con.connect();
            
            final int returnCode = con.getResponseCode();
            if (returnCode == HttpURLConnection.HTTP_OK){
                response = new DataInputStream(con.getInputStream() );
                int length = con.getContentLength();
                return (length != -1) ? getKnownLengthResponse(response, length) : getUnKnownLengthResponse(response);

            }else{
                throw new Exception(addr + " Web site responded: " + con.getResponseMessage() + ", response code: " + returnCode);
            }
        }finally{
            if (response != null) response.close();
            if (con != null) con.disconnect();
        }
    }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static byte[] getKnownLengthResponse(final DataInputStream response, final int length) throws IOException{
        final byte[] ret = new byte[length];
        response.readFully(ret);
        return ret;
    }
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    private static byte[] getUnKnownLengthResponse(final DataInputStream response) throws IOException {
        final int chunkSize = 1024;
        int index = 0;
        byte[] data = new byte[chunkSize];
        boolean trucking = true;
        while (trucking) {
            final int readLength = response.read( data , index , data.length - index);
            if ( readLength == -1) trucking = false;
            else {
                index += readLength ;
                if (index == data.length) {
                    final byte[] newData = new byte[data.length + chunkSize];
                    System.arraycopy(data , 0, newData, 0, index);
                    data = newData;
                }
            }
        }
        final byte[] trimmed = new byte[index];
        System.arraycopy(data, 0, trimmed, 0, index);
        return trimmed;
    }
}