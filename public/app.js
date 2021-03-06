$("#message").keypress((e) => {
  if (e.which === 13 && $("#message").val() !== "") {
    // prevent script injections by encoding < and > .replace part from stackoverflow
    const newMessageText = $("#message")
      .val()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const time = getCurrentTimeAndDate().time;
    const date = getCurrentTimeAndDate().date;
    // reset input field
    $("#message").val("");
    // create html for a new message
    createMessage("right", newMessageText, time, date);
    // post message to server
    postData("/", { newMessageText });
  }
});

const getCurrentTimeAndDate = () => {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Date().toLocaleDateString();
  return { date: date, time: time };
};

// create the html for a message
const createMessage = (side, text, time, date) => {
  $("#chat-content").append(`
      <div class="chat-message-wrapper ${side}">
        <div class="chat-message">
          <div class="chat-message-text">${text}</div>
          <div class="chat-message-time">${time}</div>
          <div class="chat-message-date">${date}</div>
        </div>
      </div>
    `);
  scrollDown();
};

// scroll to bottom of the page
const scrollDown = () => {
  // with help of stackoverflow
  $(".chat-content").animate(
    { scrollTop: $(".chat-content").prop("scrollHeight") },
    2000
  );
};

// send user message to server
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    // Body data type must match "Content-Type" header
    body: JSON.stringify(data),
  });

  try {
    // create a new message from the response
    const newData = await response.json();
    const time = getCurrentTimeAndDate().time;
    const date = getCurrentTimeAndDate().date;
    createMessage("left", newData["response"], time, date);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};
