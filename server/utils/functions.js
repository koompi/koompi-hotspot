
module.exports = function() { 
    this.getParseFloat = (str,val) => {
        str = str.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1); 
        return Number(str);   
    }
}