"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

function ToolPart({ part }) {
    const state = part.state;
    const toolName = part.toolName || "searchBooks";
    const query =
        part.input && typeof part.input === "object"
            ? part.input.query
            : undefined;

    switch (state) {
        case "input-streaming":
            return (
                <div className={styles.toolCall}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolName}>{toolName}</span>
                        <span
                            className={`${styles.stateBadge} ${styles.stateStreaming}`}
                        >
                            input-streaming
                        </span>
                    </div>

                    <div className={styles.toolBodyStreaming}>
                        <span className={styles.pulseDot} />
                        <span>
                            Streaming tool input
                            {query ? <>: "{query}"</> : "…"}
                        </span>
                    </div>
                </div>
            );

        case "input-available":
            return (
                <div className={styles.toolCall}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolName}>{toolName}</span>
                        <span
                            className={`${styles.stateBadge} ${styles.stateAvailable}`}
                        >
                            input-available
                        </span>
                    </div>

                    <p className={styles.toolQuery}>
                        About to search for:{" "}
                        <strong>{query ?? "…"}</strong>
                    </p>
                </div>
            );

        case "output-available": {
            const output =
                part.output && typeof part.output === "object"
                    ? part.output
                    : {};
            const results = Array.isArray(output.results)
                ? output.results
                : [];

            return (
                <div className={styles.toolCall}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolName}>{toolName}</span>
                        <span
                            className={`${styles.stateBadge} ${styles.stateComplete}`}
                        >
                            output-available
                        </span>
                    </div>

                    <p className={styles.toolQuery}>
                        Search: <strong>{query ?? "…"}</strong>
                    </p>

                    {results.length === 0 ? (
                        <p className={styles.toolEmpty}>
                            No books found
                            {query ? ` for "${query}"` : ""}.
                        </p>
                    ) : (
                        <ul className={styles.toolBooks}>
                            {results.map((book) => (
                                <li key={book.id} className={styles.toolBook}>
                                    {book.coverUrl && (
                                        <img
                                            className={styles.toolBookCover}
                                            src={book.coverUrl}
                                            alt={`${book.title} cover`}
                                        />
                                    )}

                                    <div className={styles.toolBookInfo}>
                                        <strong className={styles.toolBookTitle}>
                                            {book.title}
                                        </strong>

                                        <span className={styles.toolBookMeta}>
                                            {book.authors &&
                                            book.authors.length > 0
                                                ? book.authors.join(", ")
                                                : "Unknown author"}
                                            {book.firstPublishYear
                                                ? ` · ${book.firstPublishYear}`
                                                : ""}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        case "output-error":
            return (
                <div className={styles.toolCall}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolName}>{toolName}</span>
                        <span
                            className={`${styles.stateBadge} ${styles.stateError}`}
                        >
                            output-error
                        </span>
                    </div>

                    <p className={styles.toolErrorMessage}>
                        {part.errorText || "The book search failed."}
                    </p>
                </div>
            );

        default:
            return (
                <div className={styles.toolCall}>
                    <span className={styles.toolName}>{toolName}</span> —{" "}
                    {state}
                </div>
            );
    }
}

export default function Chat() {
    const { messages, sendMessage, status, stop, error, clearError } = useChat({
        transport: new DefaultChatTransport({
        api: "/api/chat",
        }),
    });
    const messagesContainerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [input, setInput] = useState("");

    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        function handleScroll() {
            const distanceFromBottom =
                container.scrollHeight -
                container.scrollTop -
                container.clientHeight;

            setIsAtBottom(distanceFromBottom < 50);
        }

        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const isLoading = status === "submitted" || status === "streaming";

    async function handleSubmit(e) {
        e.preventDefault();

        const text = input.trim();

        if (!text || isLoading) return;

        await sendMessage({ text });

        setInput("");
    }

    useLayoutEffect(() => {
        const container = messagesContainerRef.current;

        if (!container || !isAtBottom) return;

        container.scrollTop = container.scrollHeight;
    }, [messages, isAtBottom]);

    function scrollToLatest() {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }

        setIsAtBottom(true);
    }

    return (
        <div className={styles.chat}>
            <div
                ref={messagesContainerRef}
                className={styles.messages}
            >
            {messages.map((message) => (
            <div
                key={message.id}
                className={`${styles.message} ${
                    message.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage
                }`}
            >
            <strong className={styles.role}>
                {message.role === "user" ? "You" : "Assistant"}:
            </strong>{" "}

                {message.parts?.map((part, index) => {
                if (part.type === "text") {
                    return <span key={index}>{part.text}</span>;
                }

                if (
                    part.type === "dynamic-tool" ||
                    (typeof part.type === "string" &&
                        part.type.startsWith("tool-"))
                ) {
                    return <ToolPart key={index} part={part} />;
                }

                return null;
                })}
            </div>
            ))}
        </div>

        {!isAtBottom && (
            <button
                type="button"
                onClick={scrollToLatest}
                className={styles.jumpButton}
            >
                ↓ Jump to latest
            </button>
        )}

        {status === "submitted" && (
            <p className={styles.thinking}>
                <span>Thinking</span>
                <span className={styles.dots}>...</span>
            </p>
        )}

        {status === "error" && error && (
            <div className={styles.streamError} role="alert">
                <p className={styles.streamErrorMessage}>
                    {error.message || "Something went wrong. Please try again."}
                </p>
                <button
                    type="button"
                    onClick={clearError}
                    className={styles.errorDismiss}
                >
                    Dismiss
                </button>
            </div>
        )}

        <form
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                disabled={isLoading}
                autoComplete="off"
                className={styles.input}
            />

            {isLoading ? (
                <button
                    type="button"
                    onClick={stop}
                    className={`${styles.button} ${styles.stopButton}`}
                >
                    Stop
                </button>
            ) : (
                <button
                    type="submit"
                    className={`${styles.button} ${styles.sendButton}`}
                >
                    Send
                </button>
            )}
        </form>
        </div>
    );
}