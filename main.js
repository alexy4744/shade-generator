"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// should transpile with babel
var MAX_PICKERS = 10;
var SPACING = 75;
var SPECTRUM_OPTIONS = {
  showInitial: true,
  showInput: true
};
var totalPickers = 5;

for (var i = 0; i < totalPickers; i++) {
  createRow();
  createPicker(i);
}

renderSwatches();
listenInputs();
listenButtons();

function createPicker(rowNumber) {
  var thisPicker = $("<input class='color-picker'/>");
  var row = $(".swatches-row").filter(function (_, r) {
    return $(r).data("row") === rowNumber + 1;
  });
  if (!row.length) return;
  thisPicker.appendTo(row).spectrum(_objectSpread({
    color: generateRandomRGB()
  }, SPECTRUM_OPTIONS)).on("change.spectrum", renderSwatches);
  $("<hr>").appendTo(row);
  return thisPicker;
}

function addNewPicker() {
  createRow();
  createPicker(totalPickers);
  recalculateRowWidth();
  renderSwatches();
  totalPickers++;
}

function createRow() {
  var currentTotal = $(".swatches-row").length;
  if (currentTotal >= MAX_PICKERS) return null;
  var row = $("<div class='swatches-row'/>");
  row.data("row", currentTotal + 1).appendTo(".swatches");
  recalculateRowWidth();
  return row;
}

function createSwatch(row, rgb) {
  return $("<div class='swatch' title='Copy!'/>").css("background", rgb).click(function () {
    var placeholderInput = $("<input/>").appendTo("body").val(rgbToHex.apply(void 0, _toConsumableArray(sanitizeRGB(rgb)))).select();
    document.execCommand("copy");
    placeholderInput.remove();
  }).appendTo(row);
} // TODO: consumes a lot of memory


function renderSwatches() {
  var rows = $(".swatches-row").filter(function (_, r) {
    return $(r).data("row");
  });
  var shadeDiffValue = chooseBiggerValue($("input[name='shade-difference-range']").val(), $("input[name='shade-difference-number']").val());
  var cutOffValue = chooseBiggerValue($("input[name='cutoff-range']").val(), $("input[name='cutoff-number']").val()); // Delete all swatches in all rows

  rows.children().filter(function (_, r) {
    return $(r).hasClass("swatch");
  }).each(function (_, swatch) {
    return $(swatch).remove();
  });
  rows.each(function (_, row) {
    for (var _i = 0; _i < cutOffValue; _i++) {
      createSwatch(row, colorModifier(rgbToHex.apply(void 0, _toConsumableArray(sanitizeRGB($(row).find(".sp-preview-inner").css("background-color")))), _i * shadeDiffValue));
    }
  });
}

function recalculateRowWidth() {
  $(".swatches-row").each(function (_, row) {
    return $(row).css("width", "calc(".concat(SPACING, "% / ").concat(totalPickers, ")"));
  });
}

function listenInputs() {
  $(document.getElementsByTagName("input")).each(function (_, input) {
    input.oninput = function () {
      if (this.type === "range") {
        $("input[name = " + input.className + "-number]").val(this.value);
      } else {
        $("input[name = " + input.className + "-range]").val(this.value);
      }

      renderSwatches();
    };
  });
}

function listenButtons() {
  $(".new-picker").click(function () {
    addNewPicker();
    recalculateRowWidth();
  });
  $(".random-colors").click(setRandomPalette);
}

function setRandomPalette() {
  $(".color-picker").each(function (_, picker) {
    $(picker).spectrum(_objectSpread({
      color: generateRandomRGB()
    }, SPECTRUM_OPTIONS));
  });
  renderSwatches();
}
/* UTILITIES */
// If diff is positive, it lightens, else it darkens


function colorModifier(hex, diff) {
  var rgb = hexToRGB(hex);
  if (!rgb) return "#000";
  var result = {
    r: 0,
    g: 0,
    b: 0
  };

  for (var color in rgb) {
    result[color] = rgb[color] - -diff;
  }

  return "rgb(".concat(result.r, ", ").concat(result.g, ", ").concat(result.b, ")");
} // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5623914#5623914


function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(red, green, blue) {
  var rgb = blue | green << 8 | red << 16;
  return "#" + (0x1000000 + rgb).toString(16).slice(1);
}

function generateRandomRGB() {
  return "rgb(\n    ".concat(Math.floor(Math.random() * 255), ",\n    ").concat(Math.floor(Math.random() * 255), ",\n    ").concat(Math.floor(Math.random() * 255), "\n  )").replace(/\s/g, "");
}
/* Converts a rgb string to an array of rgb 
  rgb(0, 1, 2) => [0, 1, 2] */


function sanitizeRGB(rgbString) {
  // First splits the string by commas then remove all non digits to get only r, g, b values
  return rgbString.split(",").map(function (component) {
    return component.replace(/\D+/g, "");
  });
}

function chooseBiggerValue(value1, value2) {
  return value1 > value2 ? value1 : value2;
}
