<script> function sendMessage() {
    const input = document.getElementById('msg');
    const userMsg = input.value.trim();
    if (!userMsg) return;
  
    showMessage("You", userMsg);
  
    const botReply = getBotReply(userMsg);
    setTimeout(() => {
      showMessage("Bot", botReply);
    }, 500);
  
    input.value = '';
  }
  
  function showMessage(sender, text) {
    const chat = document.getElementById('chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender.toLowerCase();
    msgDiv.textContent = ${sender}: ${text};
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
  }
  
  function getBotReply(msg) {
    msg = msg.toLowerCase();
  
    if (msg.includes("syllabus")) return "The syllabus includes Algebra, Calculus, and Geometry.";
    if (msg.includes("exam")) return "The exam will be held next month.";
    if (msg.includes("teacher") || msg.includes("instructor")) return "Your instructor is Prof. Adeel.";
    if (msg.includes("timing") || msg.includes("class time")) return "Classes are every Monday and Wednesday at 10 AM.";
    if (msg.includes("assignment")) return "Assignment 1 is due on Friday.";
    
    return "Sorry, I didn't understand that. You can ask about syllabus, exam, teacher, class time, etc.";
  } </script>