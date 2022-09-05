const hex_to_ascii =  (hex) => {
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode( parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
 export default ( hex_to_ascii );