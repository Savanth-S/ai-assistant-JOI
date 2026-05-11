function Header({ speaking }) {
  return (
    <div className="chat-header">
      <div>
        <h2>
          Joi AI Assistant
        </h2>

        <p>
          Your futuristic personal
          secretary
        </p>
      </div>

      <div
        className={`ai-orb ${
          speaking
            ? "speaking"
            : ""
        }`}
      ></div>
    </div>
  );
}

export default Header;