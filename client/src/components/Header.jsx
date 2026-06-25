function Header({
  speaking,
  assistantName,
}) {
  return (
    <div className="chat-header">
      <div>
        <h2>
          {assistantName ||
            "Persona"}
        </h2>

        <p>
          Your personal AI assistant
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