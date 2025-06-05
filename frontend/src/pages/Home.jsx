import { useState, useEffect } from "react";
import api from "../api";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 4;

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                setCurrentPage(1); // Reset to first page on reload
            })
            .catch((err) => alert(err));
    };

    const DeleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`)
            .then((response) => {
                if (response.status === 204) {
                    alert("Note deleted successfully");
                    getNotes();
                } else {
                    alert("Failed to delete note");
                }
            })
            .catch((error) => alert(error));
    };

    const CreateNote = (e) => {
        e.preventDefault();
        api.post("/api/notes/", {
            title: title,
            content: content
        })
            .then((response) => {
                if (response.status === 201) {
                    alert("Note created successfully");
                    setTitle("");
                    setContent("");
                    getNotes();
                } else {
                    alert("Failed to create note");
                }
            })
            .catch((error) => {
                alert(error.response?.data?.message || "Error creating note");
            });
    };

    // Pagination logic
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(notes.length / notesPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "40px auto",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
                minHeight: "80vh",
                borderRadius: "18px",
                boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
                padding: "32px 24px",
                display: "flex",
                gap: "40px",
                alignItems: "flex-start"
            }}
        >
            {/* Form Section */}
            <div style={{ flex: 1, minWidth: "320px" }}>
                <h2
                    style={{
                        borderBottom: "2px solid #b3c6e0",
                        paddingBottom: "10px",
                        color: "#2d3a4b",
                        letterSpacing: "1px",
                        fontWeight: 700,
                        fontSize: "2rem",
                        marginBottom: "24px"
                    }}
                >
                    Create a Note
                </h2>
                <form
                    onSubmit={CreateNote}
                    style={{
                        background: "rgba(255,255,255,0.97)",
                        border: "1px solid #dde6f2",
                        borderRadius: "14px",
                        padding: "28px 20px",
                        boxShadow: "0 4px 16px rgba(80,120,200,0.08)",
                        marginTop: "0"
                    }}
                >
                    <label htmlFor="title" style={{ fontWeight: "bold", color: "#2d3a4b", fontSize: "1.05rem" }}>
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        placeholder="Enter note title"
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "10px 0 20px 0",
                            border: "1.5px solid #b3c6e0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            outline: "none",
                            transition: "border 0.2s"
                        }}
                        onFocus={e => (e.target.style.border = "1.5px solid #3498db")}
                        onBlur={e => (e.target.style.border = "1.5px solid #b3c6e0")}
                    />
                    <label htmlFor="content" style={{ fontWeight: "bold", color: "#2d3a4b", fontSize: "1.05rem" }}>
                        Content:
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note here..."
                        style={{
                            width: "100%",
                            minHeight: "90px",
                            padding: "10px",
                            margin: "10px 0 20px 0",
                            border: "1.5px solid #b3c6e0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            outline: "none",
                            transition: "border 0.2s",
                            resize: "vertical"
                        }}
                        onFocus={e => (e.target.style.border = "1.5px solid #3498db")}
                        onBlur={e => (e.target.style.border = "1.5px solid #b3c6e0")}
                    ></textarea>
                    <input
                        type="submit"
                        value="Add Note"
                        style={{
                            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 28px",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            marginTop: "8px",
                            boxShadow: "0 2px 8px rgba(67,206,162,0.10)",
                            transition: "background 0.2s, box-shadow 0.2s"
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background =
                                "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 16px rgba(67,206,162,0.18)";
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background =
                                "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)";
                            e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(67,206,162,0.10)";
                        }}
                    />
                </form>
            </div>

            {/* Notes List Section */}
            <div style={{ flex: 2, minWidth: "350px" }}>
                <h2
                    style={{
                        borderBottom: "2px solid #b3c6e0",
                        paddingBottom: "10px",
                        color: "#2d3a4b",
                        letterSpacing: "1px",
                        fontWeight: 700,
                        fontSize: "2rem",
                        marginBottom: "24px"
                    }}
                >
                    Notes
                </h2>
                {notes.length === 0 && (
                    <p style={{ color: "#888", fontStyle: "italic", marginTop: "20px" }}>
                        No notes yet. Start by creating one!
                    </p>
                )}
                {currentNotes.map(note => (
                    <div
                        key={note.id}
                        style={{
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid #dde6f2",
                            borderRadius: "14px",
                            padding: "20px",
                            marginBottom: "20px",
                            boxShadow: "0 4px 16px rgba(80,120,200,0.08)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                            position: "relative"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(80,120,200,0.16)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(80,120,200,0.08)";
                        }}
                    >
                        <h3
                            style={{
                                margin: "0 0 8px 0",
                                color: "#2d3a4b",
                                fontWeight: 600,
                                fontSize: "1.25rem"
                            }}
                        >
                            {note.title}
                        </h3>
                        <p
                            style={{
                                margin: "0 0 16px 0",
                                color: "#4d5a6a",
                                fontSize: "1rem",
                                lineHeight: 1.6
                            }}
                        >
                            {note.content}
                        </p>
                        {note.created_at && (
                            <div style={{ color: "#888", fontSize: "0.95rem", marginBottom: "10px" }}>
                                Created on: {new Date(note.created_at).toLocaleDateString("en-GB")}
                            </div>
                        )}
                        <button
                            onClick={() => DeleteNote(note.id)}
                            style={{
                                background: "linear-gradient(90deg, #ff5858 0%, #f09819 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "7px 18px",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: "1rem",
                                boxShadow: "0 2px 8px rgba(255,88,88,0.10)",
                                transition: "background 0.2s, box-shadow 0.2s"
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background =
                                    "linear-gradient(90deg, #f09819 0%, #ff5858 100%)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 16px rgba(255,88,88,0.18)";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background =
                                    "linear-gradient(90deg, #ff5858 0%, #f09819 100%)";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 8px rgba(255,88,88,0.10)";
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px" }}>
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                background: currentPage === 1 ? "#eee" : "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                                color: currentPage === 1 ? "#aaa" : "#fff",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                fontWeight: 600,
                                fontSize: "1rem",
                                transition: "background 0.2s"
                            }}
                        >
                            Prev
                        </button>
                        <span style={{ fontWeight: 600, color: "#2d3a4b" }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                background: currentPage === totalPages ? "#eee" : "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                                color: currentPage === totalPages ? "#aaa" : "#fff",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                fontWeight: 600,
                                fontSize: "1rem",
                                transition: "background 0.2s"
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;