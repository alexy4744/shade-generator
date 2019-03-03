// should transpile with babel

const MAX_PICKERS = 10;
const SPACING = 75;
const SPECTRUM_OPTIONS = {
  showInitial: true,
  showInput: true
};

let totalPickers = 5;

for (let i = 0; i < totalPickers; i++) {
  createRow();
  createPicker(i);
}

renderSwatches();

listenInputs();
listenButtons();

function createPicker(rowNumber) {
  const thisPicker = $("<input class='color-picker'/>");
  const row = $(".swatches-row").filter(
    (_, r) => $(r).data("row") === rowNumber + 1
  );

  if (!row.length) return;

  thisPicker
    .appendTo(row)
    .spectrum({
      color: generateRandomRGB(),
      ...SPECTRUM_OPTIONS
    })
    .on("change.spectrum", renderSwatches);

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
  const currentTotal = $(".swatches-row").length;
  if (currentTotal >= MAX_PICKERS) return null;

  const row = $("<div class='swatches-row'/>");

  row.data("row", currentTotal + 1).appendTo(".swatches");

  recalculateRowWidth();

  return row;
}

function createSwatch(row, rgb) {
  return $("<div class='swatch' title='Copy!'/>")
    .css("background", rgb)
    .click(() => {
      const placeholderInput = $("<input/>")
        .appendTo("body")
        .val(rgbToHex(...sanitizeRGB(rgb)))
        .select();

      document.execCommand("copy");
      placeholderInput.remove();
    })
    .appendTo(row);
}

// TODO: consumes a lot of memory
function renderSwatches() {
  const rows = $(".swatches-row").filter((_, r) => $(r).data("row"));

  const shadeDiffValue = chooseBiggerValue(
    $("input[name='shade-difference-range']").val(),
    $("input[name='shade-difference-number']").val()
  );
  const cutOffValue = chooseBiggerValue(
    $("input[name='cutoff-range']").val(),
    $("input[name='cutoff-number']").val()
  );

  // Delete all swatches in all rows
  rows
    .children()
    .filter((_, r) => $(r).hasClass("swatch"))
    .each((_, swatch) => $(swatch).remove());

  rows.each((_, row) => {
    for (let i = 0; i < cutOffValue; i++) {
      createSwatch(
        row,
        colorModifier(
          rgbToHex(
            ...sanitizeRGB(
              $(row)
                .find(".sp-preview-inner")
                .css("background-color")
            )
          ),
          i * shadeDiffValue
        )
      );
    }
  });
}

function recalculateRowWidth() {
  $(".swatches-row").each((_, row) =>
    $(row).css("width", `calc(${SPACING}% / ${totalPickers})`)
  );
}

/* Since browserify will enclose all of the functions in the file in an annonymous one on build,
  inputs and buttons have to be listened thru javascript so that it is in the same scope and
  functions can be invoked. */
function listenInputs() {
  for (const input of document.getElementsByTagName("input")) {
    input.oninput = function() {
      if (this.type === "range") {
        $("input[name = " + input.className + "-number]").val(this.value);
      } else {
        $("input[name = " + input.className + "-range]").val(this.value);
      }

      renderSwatches();
    };
  }
}

function listenButtons() {
  $(".new-picker").click(() => {
    addNewPicker();
    recalculateRowWidth();
  });

  $(".random-colors").click(setRandomPalette);
}

function setRandomPalette() {
  $(".color-picker").each((_, picker) => {
    $(picker).spectrum({
      color: generateRandomRGB(),
      ...SPECTRUM_OPTIONS
    });
  });

  renderSwatches();
}

/* UTILITIES */

// If diff is positive, it lightens, else it darkens
function colorModifier(hex, diff) {
  const rgb = hexToRGB(hex);
  if (!rgb) return "#000";

  const result = {
    r: 0,
    g: 0,
    b: 0
  };

  for (const color in rgb) {
    result[color] = rgb[color] - -diff;
  }

  return `rgb(${result.r}, ${result.g}, ${result.b})`;
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5623914#5623914
function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function rgbToHex(red, green, blue) {
  const rgb = blue | (green << 8) | (red << 16);
  return "#" + (0x1000000 + rgb).toString(16).slice(1);
}

function generateRandomRGB() {
  return `rgb(
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)}
  )`.replace(/\s/g, "");
}

/* Converts a rgb string to an array of rgb 
  rgb(0, 1, 2) => [0, 1, 2] */
function sanitizeRGB(rgbString) {
  // First splits the string by commas then remove all non digits to get only r, g, b values
  return rgbString.split(",").map(component => component.replace(/\D+/g, ""));
}

function chooseBiggerValue(value1, value2) {
  return value1 > value2 ? value1 : value2;
}
