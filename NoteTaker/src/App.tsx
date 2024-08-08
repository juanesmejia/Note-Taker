import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";

export type Tag = {
  id: string;
  label: string;
};

export type RawNote = {
  id: string;
} & RawNoteData;
export type RawNoteData = {
  title: string;
  markdown: string;
  tagId: string[];
};

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTag] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagId.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagId: tags.map((tag) => tag.id) },
      ];
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<h1>Hi</h1>} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
