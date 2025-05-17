const noOverflowClass = "no-overflow";

function openModal(modalID) {
  document.getElementById(modalID).showModal();
}
function closeModal(modalID) {
  const closingClassName = "closing";
  const modal = document.getElementById(modalID);
  Promise.race([
    new Promise((resolve) =>
      modal.addEventListener("animationend", () => resolve(), {
        once: true,
      })
    ),
    new Promise((resolve) => setTimeout(() => resolve(), 2000)),
  ]).then(() => {
    modal.close();
    modal.classList.remove(closingClassName);
  });
  modal.classList.add(closingClassName);
}

document.addEventListener("click", (e) => {
  const { target } = e;
  const widget = target.closest(".widget");
  if (widget) {
    switch (widget.dataset.controls) {
      case "modal":
        return openModal(widget.getAttribute("aria-controls"));
    }
  }
  const modal = target.closest(".modal");
  if (modal && target.closest(".modal-close")) return closeModal(modal.id);
});

const callbackWidget = document.querySelector(".widget.callback");
function highlightWidget() {
  const treshhold = callbackWidget.getBoundingClientRect().height;
  const totalH = document.body.scrollHeight;
  const windowH = window.innerHeight;
  const scrollY = window.scrollY;
  const isBottom = scrollY + windowH + treshhold >= totalH;
  callbackWidget.classList.toggle("contrast", !isBottom);
}
highlightWidget();
let debounce;
document.addEventListener("scroll", () => {
  clearTimeout(debounce);
  debounce = setTimeout(highlightWidget, 500);
});

const invalidClass = "invalid";
const phoneInput = document.getElementById("phoneInput");
// phoneInput.addEventListener("input", function () {
//   this.classList.remove(invalidClass);
// });

const mask = IMask(phoneInput, {
  mask: "+{20} (000) 000-00-00",
});

const form = document.getElementById("form-callback");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(mask);
  if (!mask.unmaskedValue || mask.unmaskedValue.length < 11)
    return phoneInput.classList.add(invalidClass);
  form.closest(".modal").classList.add("final");
  phoneInput.value = "";
});
