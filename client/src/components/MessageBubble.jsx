import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Copy,
  Check,
} from "lucide-react";

import {
  useState,
} from "react";

function MessageBubble({
  message,
}) {

  const [copied, setCopied] =
    useState(false);

  const copyCode =
    async (code) => {

      try {

        await navigator.clipboard.writeText(
          code
        );

        setCopied(true);

        setTimeout(() => {

          setCopied(false);

        }, 2000);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div
      className={`message-row ${message.sender}`}
    >

      <div
        className={`message-bubble ${message.sender}`}
      >

        {message.sender === "ai" ? (

          <ReactMarkdown

            components={{

              code({
                inline,
                className,
                children,
                ...props
              }) {

                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                const codeString =
                  String(children).replace(
                    /\n$/,
                    ""
                  );

                return !inline &&
                  match ? (

                  <div className="code-block-wrapper">

                    {/* HEADER */}

                    <div className="code-header">

                      <span>
                        {match[1]}
                      </span>

                      <button
                        className="copy-btn"
                        onClick={() =>
                          copyCode(
                            codeString
                          )
                        }
                      >

                        {copied ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}

                      </button>

                    </div>

                    {/* CODE */}

                    <SyntaxHighlighter
                      style={oneDark}
                      language={
                        match[1]
                      }
                      PreTag="div"
                      {...props}
                    >

                      {codeString}

                    </SyntaxHighlighter>

                  </div>

                ) : (

                  <code
                    className={
                      className
                    }
                    {...props}
                  >
                    {children}
                  </code>
                );
              },

            }}

          >

            {message.text}

          </ReactMarkdown>

        ) : (

          message.text

        )}

      </div>

    </div>
  );
}

export default MessageBubble;