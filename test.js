let obj = {"type":"doc","content":[{"type":"paragraph","content":[{"text":"$sin (\\pi - \\theta) = \\frac{h}{b}$","type":"text"}]},{"type":"paragraph","content":[{"text":"$h = b * sin(\\pi - \\theta)$","type":"text"}]},{"type":"paragraph","content":[{"text":"$A = \\frac{1}{2} b^2 sin(\\pi - \\theta)$","type":"text"}]}]}

function getAllText(obj, ret= "") {
    if (obj.type === "text") {
      return ret + obj.text + "\n";
    } else {
      let paragraph = obj.content;
      let temp = ""
      for (let index = 0; index < paragraph.length; index++) {
        const element = paragraph[index];
        temp += getAllText(element, ret);
      }
      return temp
    }
}

console.log(getAllText(obj))