document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("room-canvas");
    let history = [];
    let redoStack = [];
    let selectedFurniture = null;

    // Expose functions to global scope
    window.setRoomSize = function() {
        const width = document.getElementById("room-width").value;
        const height = document.getElementById("room-height").value;

        if (width && height) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            document.getElementById("room-preview").innerText = `Room: ${width}cm x ${height}cm`;
        } else {
            alert("Enter valid room dimensions.");
        }
    };

    window.addCustomFurniture = function() {
        const name = document.getElementById("furniture-name").value || "Furniture";
        const width = document.getElementById("furniture-width").value || 50;
        const height = document.getElementById("furniture-height").value || 50;

        if (!canvas.style.width || !canvas.style.height) {
            alert("Set the room size first!");
            return;
        }

        const item = document.createElement("div");
        item.classList.add("furniture");
        item.style.width = width + "px";
        item.style.height = height + "px";
        item.style.background = "#666";
        item.innerHTML = `<div>${name}<br><span>${width}cm × ${height}cm</span></div>`;

        item.style.position = "absolute";
        item.style.left = Math.random() * (canvas.clientWidth - width) + "px";
        item.style.top = Math.random() * (canvas.clientHeight - height) + "px";

        item.addEventListener("click", (e) => {
            e.stopPropagation();
            selectFurniture(item);
        });

        makeDraggable(item);
        canvas.appendChild(item);
        history.push(item);
        redoStack = [];
    };

    function makeDraggable(item) {
        let offsetX, offsetY, isDragging = false;

        item.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - item.getBoundingClientRect().left;
            offsetY = e.clientY - item.getBoundingClientRect().top;
            item.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            const newX = e.clientX - offsetX - canvas.getBoundingClientRect().left;
            const newY = e.clientY - offsetY - canvas.getBoundingClientRect().top;

            item.style.left = Math.max(0, Math.min(newX, canvas.clientWidth - item.clientWidth)) + "px";
            item.style.top = Math.max(0, Math.min(newY, canvas.clientHeight - item.clientHeight)) + "px";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            item.style.cursor = "grab";
        });
    }

    function selectFurniture(item) {
        if (selectedFurniture) selectedFurniture.classList.remove("selected");
        selectedFurniture = item;
        selectedFurniture.classList.add("selected");
    }

    document.addEventListener("click", (e) => {
        if (e.target === canvas && selectedFurniture) {
            selectedFurniture.classList.remove("selected");
            selectedFurniture = null;
        }
    });

    window.deleteSelectedFurniture = function() {
        if (selectedFurniture) {
            canvas.removeChild(selectedFurniture);
            history = history.filter(f => f !== selectedFurniture);
            selectedFurniture = null;
        } else {
            alert("No furniture selected.");
        }
    };

    window.undoAction = function() {
        if (history.length > 0) {
            const lastItem = history.pop();
            redoStack.push(lastItem);
            canvas.removeChild(lastItem);
        }
    };

    window.redoAction = function() {
        if (redoStack.length > 0) {
            const item = redoStack.pop();
            canvas.appendChild(item);
            makeDraggable(item);
            history.push(item);
        }
    };
});
