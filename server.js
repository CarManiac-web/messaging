    const socket = new WebSocket('ws://https://carmaniac-web.github.io/messaging/:8080'); // Ensure this is the correct URL

    socket.onmessage = function(event) {
        const messagesDiv = document.getElementById('messages');
        
        // Check if the message is a Blob
        if (event.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const message = JSON.parse(reader.result); // Parse the JSON
                    messagesDiv.innerHTML += `<div><strong>${message.username}:</strong> ${message.text}</div>`;
                } catch (err) {
                    console.error("Error parsing Blob message:", err);
                }
            };
            reader.readAsText(event.data); // Read the Blob as text
        } else {
            // Handle non-Blob cases
            try {
                const message = JSON.parse(event.data); // Assume it's a JSON string
                messagesDiv.innerHTML += `<div><strong>${message.username}:</strong> ${message.text}</div>`;
            } catch (err) {
                console.error("Error parsing non-Blob message:", err);
            }
        }
    };

    // Function to send a message
    function sendMessage() {
        const username = document.getElementById('username').value;
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;

        if (message && username) {
            socket.send(JSON.stringify({ username, text: message }));
            messageInput.value = ''; // Clear the input field after sending
        }
    }
