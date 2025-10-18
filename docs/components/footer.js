document.addEventListener("DOMContentLoaded", async () => {

    try {
        response = await fetch("/components/footer.html");
        html = await response.text();

        const placeholder = document.getElementById("footer-placeholder");
        // Create a temporary DOM node from the fetched HTML
        const temp = document.createElement("div");
        temp.innerHTML = html.trim();
        const footerEl = temp.firstElementChild;
        placeholder.replaceWith(footerEl);

        // notify other scripts that navbar is ready
        window.dispatchEvent(new CustomEvent("footer:loaded", { detail: { navbar: navbarEl } }));
    } catch (error) {
        console.error("Error loading footer:", error);
    }
});
