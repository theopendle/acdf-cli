const handlebars = require('handlebars');

handlebars.registerHelper('lowerCase', string => string.toLowerCase());
handlebars.registerHelper('upperCase', string => string.toUpperCase());


module.exports = {
    handlebars: handlebars
}