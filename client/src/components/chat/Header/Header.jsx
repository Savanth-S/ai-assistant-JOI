import "./Header.css";
function Header({
  speaking,
  assistantName,
}) {

  return (
    <div className="chat-header">

      <div>

        <h2>
          {assistantName || "Nova"}
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