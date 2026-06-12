function toggleExame(element) {

        const box = element.nextElementSibling;

        if (box.style.display === "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }