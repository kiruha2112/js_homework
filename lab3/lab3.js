const modal = document.getElementById("registerModal");
const registerBtn = document.getElementById("registerBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const form = document.getElementById("registerForm");
const showPasswordBtn = document.getElementById("showPasswordBtn");
const passwordInput = document.getElementById("password");

registerBtn.addEventListener("click", () => {
  modal.showModal();
});

closeModalBtn.addEventListener("click", () => modal.close());

modal.addEventListener("click", (e) => {
  const dialogRect = modal.getBoundingClientRect();
  if (
    e.clientX < dialogRect.left ||
    e.clientX > dialogRect.right ||
    e.clientY < dialogRect.top ||
    e.clientY > dialogRect.bottom
  ) {
    modal.close();
  }
});

showPasswordBtn.addEventListener("pointerdown", () => {
  passwordInput.type = "text";
});
showPasswordBtn.addEventListener("pointerup", () => {
  passwordInput.type = "password";
});

function validateField(input) {
  const errorElem = document.getElementById(input.getAttribute("aria-describedby"));

  if (input.validity.valid) {
    input.removeAttribute("aria-invalid");
    errorElem.hidden = true;
    errorElem.textContent = "";
    return true;
  }

  input.setAttribute("aria-invalid", "true");
  errorElem.hidden = false;

  if (input.validity.valueMissing) {
    errorElem.textContent = "Поле обязательно к заполнению.";
  } else if (input.validity.typeMismatch) {
    errorElem.textContent = "Введите корректный email.";
  } else if (input.validity.tooShort) {
    errorElem.textContent = `Минимум ${input.minLength} символов.`;
  } else {
    errorElem.textContent = "Некорректное значение.";
  }

  return false;
}

form.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = [...form.querySelectorAll("input")];
  let firstInvalid = null;

  inputs.forEach((input) => {
    if (!validateField(input) && !firstInvalid) {
      firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);
  console.log("Form data:", Object.fromEntries(data));
  modal.close();
});
