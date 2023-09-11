import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import Heading from "@tiptap/extension-heading";
import UploadImage from "./UploadImage";
import Bmenu from "./BMenu";
import FMenu from "./FMenu";
import AiText from "./AiText";

export default function Editor({
  options,
  editorRef,
}: {
  options?: any;
  editorRef?: any;
}) {
  const [textGen, settextGen] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const editor = useEditor({
    extensions: [
      Image,
      TextStyle,
      StarterKit,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Placeholder.configure({ placeholder: "Your story..." }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ],
    ...options,
  });

  if (editorRef) {
    editorRef.current = editor;
  }

  return (
    <div>
      {editor && <Bmenu editor={editor} />}
      {editor && <FMenu setTextGen={settextGen} setShowUploadImage={setShowUploadImage} editor={editor} />}
      {showUploadImage && <UploadImage editor={editor} setVisible={setShowUploadImage} />}
      {textGen && <AiText setVisible={settextGen} editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
