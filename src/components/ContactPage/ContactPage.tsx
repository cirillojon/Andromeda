import React from "react";

export default function ContactPage() {
  return (
    <div>
      ContactPage
      <form action="https://formspree.io/f/mjvnzjyz" method="POST">
        <label>
          Your email: <input type="email" name="email" />
        </label>
        <label>
          Your message:
          <textarea name="message"></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
