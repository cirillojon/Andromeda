import { useEffect } from "react";

const DialogflowNameFlow = () => {
  useEffect(() => {
    const dialogflowStyleLink = document.createElement("link");
    dialogflowStyleLink.rel = "stylesheet";
    dialogflowStyleLink.href = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css";
    document.head.appendChild(dialogflowStyleLink);

    const dialogflowMessengerObject = document.createElement("script");
    dialogflowMessengerObject.src = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
    document.head.appendChild(dialogflowMessengerObject);

    dialogflowMessengerObject.addEventListener('load', () => {
      const style = document.createElement('style');
      style.innerHTML = `
        df-messenger {
          z-index: 999 !important;
          --df-messenger-font-color: #000 !important;
          --df-messenger-font-family: Google Sans !important;
          --df-messenger-chat-background: #f3f6fc !important;
          --df-messenger-message-user-background: #d3e3fd !important;
          --df-messenger-message-bot-background: #fff !important;
          --df-messenger-titlebar-title-font-size: 18px;
          --df-messenger-chat-border-radius: 8px;
        }
      `;
      document.head.appendChild(style);
    });
  }, []);

  return (
    <df-messenger
      location="us-east1"
      project-id="home-improvement-409614"
      agent-id="b58c78db-8774-4912-9650-cf75ed1b0ece"
      language-code="en"
      max-query-length="-1"
    >
      <df-messenger-chat chat-title="Project Helper"></df-messenger-chat>
    </df-messenger>
  );
};

export default DialogflowNameFlow;