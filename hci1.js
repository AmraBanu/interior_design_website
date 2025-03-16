document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("room-canvas");
    let history = [];
    let redoStack = [];
    let selectedFurniture = null;

    function setRoomSize() {
        let width = document.getElementById("room-width").value;
        let height = document.getElementById("room-height").value;

        if (width && height) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            document.getElementById("room-preview").innerText = `Room: ${width}cm x ${height}cm`;
        } else {
            alert("Enter valid room dimensions.");
        }
    }

    function addCustomFurniture() {
        let name = document.getElementById("furniture-name").value || "Furniture";
        let width = document.getElementById("furniture-width").value || 50;
        let height = document.getElementById("furniture-height").value || 50;

        if (!canvas.style.width || !canvas.style.height) {
            alert("Set the room size first!");
            return;
        }

        let item = document.createElement("div");
        item.classList.add("furniture");
        item.style.width = width + "px";
        item.style.height = height + "px";
        item.style.background = "#666"; // Darker grey for better visibility
        item.innerHTML = `<div>${name}<br><span>${width}cm × ${height}cm</span></div>`; // Show name + dimensions

        item.style.position = "absolute";
        item.style.left = Math.random() * (canvas.clientWidth - width) + "px";
        item.style.top = Math.random() * (canvas.clientHeight - height) + "px";

        item.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent unselecting when clicking furniture
            selectFurniture(item);
        });

        makeDraggable(item);
        canvas.appendChild(item);
        history.push(item);
        redoStack = [];
    }

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

            let newX = e.clientX - offsetX - canvas.getBoundingClientRect().left;
            let newY = e.clientY - offsetY - canvas.getBoundingClientRect().top;

            // Ensure furniture stays inside the canvas
            newX = Math.max(0, Math.min(newX, canvas.clientWidth - item.clientWidth));
            newY = Math.max(0, Math.min(newY, canvas.clientHeight - item.clientHeight));

            item.style.left = newX + "px";
            item.style.top = newY + "px";
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

    // Remove selection when clicking outside furniture
    document.addEventListener("click", () => {
        if (selectedFurniture) {
            selectedFurniture.classList.remove("selected");
            selectedFurniture = null;
        }
    });

    function deleteSelectedFurniture() {
        if (selectedFurniture) {
            canvas.removeChild(selectedFurniture);
            history = history.filter(f => f !== selectedFurniture);
            selectedFurniture = null;
        } else {
            alert("No furniture selected.");
        }
    }

    function undoAction() {
        if (history.length > 0) {
            let lastItem = history.pop();
            redoStack.push(lastItem);
            canvas.removeChild(lastItem);
        }
    }

    function redoAction() {
        if (redoStack.length > 0) {
            let item = redoStack.pop();
            canvas.appendChild(item);
            makeDraggable(item);
            history.push(item);
        }
    }

    window.setRoomSize = setRoomSize;
    window.addCustomFurniture = addCustomFurniture;
    window.deleteSelectedFurniture = deleteSelectedFurniture;
    window.undoAction = undoAction;
    window.redoAction = redoAction;
});
