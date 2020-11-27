"use strict";
var amountSlider = document.getElementById("myAmount");
var amountOutput = document.getElementById("inputAmount");
var roiSlider = document.getElementById("myRoi");
var roiOutput = document.getElementById("inputRoi");
var yearSlider = document.getElementById("myYears");
var yearOutput = document.getElementById("inputYears");

amountOutput.innerHTML = amountSlider.value;
roiOutput.innerHTML = roiSlider.value;
yearOutput.innerHTML = yearSlider.value;

var heading = document.getElementById("heading");
var amountLabel = document.getElementById("amount");

amountSlider.oninput = function () {
  amountOutput.innerHTML = this.value;
};
roiSlider.oninput = function () {
  roiOutput.innerHTML = this.value;
};
yearSlider.oninput = function () {
  yearOutput.innerHTML = this.value;
};

function showValAmount(newVal) {
  amountSlider.value = newVal;
  calculateIt();
}
function showValRoi(newVal) {
  roiSlider.value = newVal;
  calculateIt();
}
function showValYears(newVal) {
  yearSlider.value = newVal;
  calculateIt();
}

amountSlider.addEventListener("input", updateValueAmount);
roiSlider.addEventListener("input", updateValueRoi);
yearSlider.addEventListener("input", updateValueYears);

function updateValueAmount(e) {
  amountOutput.value = e.srcElement.value;
  calculateIt();
}
function updateValueRoi(e) {
  roiOutput.value = e.srcElement.value;
  calculateIt();
}
function updateValueYears(e) {
  yearOutput.value = e.srcElement.value;
  calculateIt();
}

AttachInputListeners();
var initialLoad = true;
var chart;
var calculatorMode;
getParams(); //get cal mode
changeMode(calculatorMode); //set cal mode
//calculateIt();

function changeMode(mode) {
  calculatorMode = mode;
  heading.innerHTML = mode === "sip" ? "SIP Calculator" : "Lumpsum Calculator";
  amountLabel.innerHTML =
    mode === "sip" ? "Monthly Investment" : "Total Investment";
  if (calculatorMode === "lumpsum") {
    document.getElementById("radio-2").checked = true;
  }
  calculateIt();
}

function calculateIt() {
  var investedAmount = document.getElementById("r1");
  var wealthGained = document.getElementById("r2");
  var totalValue = document.getElementById("r3");

  var A, R, N;

  A = Number(amountOutput.value);
  R = Number(roiOutput.value);
  N = Number(yearOutput.value);

  if (A >= 500 && R >= 1) {
    var MonthlyROI = R / (100 * 12);
    var months = N * 12;
    var sip = Math.round(A * ((Math.pow(1 + MonthlyROI, months) - 1) / MonthlyROI) * (1 + MonthlyROI));
    var lumpsum = Math.round(Math.pow(1 + R / 100, N) * A);

    let investedAmountVal;
    let wealthGainedVal;
    let totalValueVal;

    if (calculatorMode === "sip") {
      investedAmountVal = A * N * 12;
      wealthGainedVal = sip - investedAmountVal;
      totalValueVal = sip;
    } else {
      investedAmountVal = A;
      wealthGainedVal = lumpsum - investedAmountVal;
      totalValueVal = lumpsum;
    }
    investedAmount.innerHTML = "₹ " + investedAmountVal.toLocaleString();
    wealthGained.innerHTML = "₹ " + wealthGainedVal.toLocaleString();
    totalValue.innerHTML = "₹ " + totalValueVal.toLocaleString();

    if (!initialLoad) {
      chart.destroy();
    }
    DrawChart(investedAmountVal, wealthGainedVal);
    initialLoad = false;
  }
}

function DrawChart(investedAmountVal, wealthGainedVal) {
  var ctx = document.getElementById("myChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Invested Amount", "Est. Returns"],
      datasets: [
        {
          backgroundColor: ["#5367ff", "#00d09c"],
          data: [investedAmountVal, wealthGainedVal],
        },
      ],
    },
    options: {
      segmentShowStroke: false,
      responsive: true,
    },
  });
}

function getParams() {
  let urlVal = window.location.href;
  let url = new URL(urlVal);
  let cta = url.searchParams.get("cta");
  let mode = url.searchParams.get("mode");
  let logo = url.searchParams.get("logo");
  if (mode === "lumpsum") {
    calculatorMode = "lumpsum";
  } else if (mode === "sip") {
    calculatorMode = "sip";
  } else {
    calculatorMode = "sip"; //without param
  }
  if (cta === "hide") {
    let ctaDiv = document.getElementById("cta");
    ctaDiv.style.display = "none";
  }
  if (logo === "true") {
    document.getElementById("logo").style.display = "block";
  }
}

function AttachInputListeners() {
  amountOutput.addEventListener("input", (e) => {
    let val = Number(e.target.value);
    if (val < 0) {
      amountOutput.value = 500;
      calculateIt();
    }
    if (val > 200000) {
      amountOutput.value = 200000;
      calculateIt();
    }
  });

  roiOutput.addEventListener("input", (e) => {
    let val = Number(e.target.value);
    if (val < 0) {
      roiOutput.value = 1;
      calculateIt();
    }
    if (val > 30) {
      roiOutput.value = 30;
      calculateIt();
    }
  });

  yearOutput.addEventListener("input", (e) => {
    let val = Number(e.target.value);
    if (!Number.isInteger(val)) {
      val = Math.ceil(val);
      yearOutput.value = val;
      calculateIt();
    }
    if (val < 1) {
      yearOutput.value = 1;
      calculateIt();
    }
    if (val > 30) {
      yearOutput.value = 30;
      calculateIt();
    }
  });
}
