document.addEventListener("DOMContentLoaded", () => {
    // console.log("Hello!!!");
});

const dropdownMenu = document.getElementById("dropdown-menu");
dropdownMenu.dataset.open = false;

function toggleMenu() {
    // if (!dropdownMenu.dataset.open) {
    //     dropdownMenu.dataset.open = true;
    //     dropdownMenu.hidden = false;
    // } else {
    //     dropdownMenu.dataset.open = false;
    //     dropdownMenu.hidden = true;
    // }
    dropdownMenu.classList.toggle("translate-x-full");
}
