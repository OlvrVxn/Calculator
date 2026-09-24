const display = document.getElementById("display");
const history = document.getElementById("history");
const message = document.getElementById("message");

let current = "";
let previous = "";
let operator = null;
let waiting = false;


/* DISPLAY */

function updateDisplay() {

    if (current === "") {

        display.innerHTML =
            '<span id="empty-face">૮ ˶ᵔ ᵕ ᵔ˶ ა</span>';

    } else {

        display.textContent = current;
    }
}


/* MESSAGE */

function showMessage(text) {
    message.textContent = text;
}


/* NUMBERS */

function numberClicked(value) {

    if (waiting) {

        current = "";
        waiting = false;
    }


    if (value === "." && current.includes(".")) {
        return;
    }


    if (value === "." && current === "") {
        current = "0";
    }


    current += value;

    showMessage("calculating... ♡");

    updateDisplay();
}


/* OPERATORS */

function operatorClicked(value) {

    if (current === "") {
        return;
    }


    if (previous !== "" && operator !== null) {
        calculate();
    }


    previous = current;

    operator = value;

    waiting = true;

    history.textContent =
        previous + " " + symbol(value);

    showMessage("what comes next? ✦");
}


/* SYMBOLS */

function symbol(value) {

    if (value === "*") {
        return "×";
    }

    if (value === "/") {
        return "÷";
    }

    if (value === "-") {
        return "−";
    }

    return value;
}


/* CALCULATE */

function calculate() {

    if (
        previous === "" ||
        current === "" ||
        operator === null
    ) {
        return;
    }


    let first = Number(previous);
    let second = Number(current);
    let answer;


    if (operator === "+") {

        answer = first + second;

    } else if (operator === "-") {

        answer = first - second;

    } else if (operator === "*") {

        answer = first * second;

    } else if (operator === "/") {

        if (second === 0) {

            display.textContent = "Oops!";

            showMessage(
                "can't divide by zero 🥹"
            );

            current = "";
            previous = "";
            operator = null;

            history.textContent = "";

            return;
        }

        answer = first / second;
    }


    answer =
        Math.round(
            (answer + Number.EPSILON) * 100000000
        ) / 100000000;


    history.textContent =
        previous +
        " " +
        symbol(operator) +
        " " +
        current +
        " =";


    current = String(answer);

    previous = "";

    operator = null;

    waiting = true;


    showMessage("ta-da! ✨");


    display.classList.remove("result-animation");

    void display.offsetWidth;

    display.classList.add("result-animation");


    updateDisplay();
}


/* CLEAR */

function clearCalculator() {

    current = "";

    previous = "";

    operator = null;

    waiting = false;

    history.textContent = "";

    showMessage("fresh start ♡");

    updateDisplay();
}


/* DELETE */

function deleteNumber() {

    if (waiting) {
        return;
    }

    current =
        current.slice(0, -1);

    showMessage("oops, deleted ♡");

    updateDisplay();
}


/* PERCENT */

function percentage() {

    if (current === "") {
        return;
    }

    current =
        String(Number(current) / 100);

    showMessage("percentage magic ✨");

    updateDisplay();
}


/* PLUS / MINUS */

function changeSign() {

    if (
        current === "" ||
        current === "0"
    ) {
        return;
    }

    current =
        String(Number(current) * -1);

    showMessage("switched the sign ♡");

    updateDisplay();
}


/* BUTTONS */

const buttons =
    document.querySelectorAll(".btn");


buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        /* Glow */

        button.classList.remove("clicked");

        void button.offsetWidth;

        button.classList.add("clicked");


        /* Number */

        if (
            button.classList.contains("number")
        ) {

            numberClicked(
                button.dataset.value
            );

            return;
        }


        /* Operator */

        if (
            button.dataset.action ===
            "operator"
        ) {

            operatorClicked(
                button.dataset.value
            );

            return;
        }


        /* Other buttons */

        if (
            button.dataset.action === "clear"
        ) {

            clearCalculator();

        } else if (
            button.dataset.action === "delete"
        ) {

            deleteNumber();

        } else if (
            button.dataset.action === "percent"
        ) {

            percentage();

        } else if (
            button.dataset.action === "sign"
        ) {

            changeSign();

        } else if (
            button.dataset.action === "equals"
        ) {

            calculate();
        }

    });

});


/* KEYBOARD */

document.addEventListener("keydown", function(event) {

    const key = event.key;


    if (
        key >= "0" &&
        key <= "9"
    ) {

        numberClicked(key);

        return;
    }


    if (key === ".") {

        numberClicked(".");

        return;
    }


    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        operatorClicked(key);

        return;
    }


    if (
        key === "Enter" ||
        key === "="
    ) {

        calculate();

        return;
    }


    if (key === "Backspace") {

        deleteNumber();

        return;
    }


    if (key === "Escape") {

        clearCalculator();

        return;
    }


    if (key === "%") {

        percentage();
    }

});


/* START */

updateDisplay();