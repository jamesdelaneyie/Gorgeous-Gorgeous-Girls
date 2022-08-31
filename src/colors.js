import { rand } from "./math.js";
import chroma from "chroma-js";

let getColors = (palette) => {

    if(palette == "random") {

        var randomColor = rand(0, 360);
        
        var hairColor = chroma(randomColor, 0.8, 0.5, 'hsl').hex();
        var highlightColor = chroma(randomColor + 230, 0.8, 0.6, 'hsl').hex();
        var multiplyColor = chroma.blend(hairColor, highlightColor, 'multiply').hex();

        var hairColorBrightness = chroma(hairColor).luminance()
        var highlightColorBrightness = chroma(highlightColor).luminance()
        var multiplyColorBrightness = chroma(multiplyColor).luminance()

        if(multiplyColorBrightness > 0.25) {
            multiplyColor = chroma(multiplyColor).darken(0.8)
        }

        if(hairColorBrightness < highlightColorBrightness) {
            var replaceColor = highlightColor
            highlightColor = hairColor
            hairColor = replaceColor
        }

        hairColor = ""+hairColor+"";
        highlightColor = ""+highlightColor+"";
        multiplyColor = ""+multiplyColor+"";

    } else if (palette == "seagreen") {
        var hairColor = "#0fdd9a"
	    var highlightColor = "#0fdd9a"
	    var multiplyColor = "#0e9493"
    } else if (palette == "vampire") {
        var hairColor = "red"
	    var highlightColor = "#44160c"
	    var multiplyColor = "blue"
    } else {
        var hairColor = "white"
	    var highlightColor = "grey"
	    var multiplyColor = "black"
    }

    return { hairColor, highlightColor, multiplyColor }

}

export { getColors };