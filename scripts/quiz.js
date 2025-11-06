function updateValue(slider) {
    document.getElementById("val-" + slider.id).textContent = slider.value;
}

document.getElementById("submit-btn").addEventListener("click", () => {
    const data = {};
    document.querySelectorAll("input[type='range']").forEach(slider => {
    data[slider.name] = slider.value;
    });
    alert("Your responses:\n" + JSON.stringify(data, null, 2));
});

document.getElementById("skip-btn").addEventListener("click", () => {    
    alert("Skipped");
});
