import { useState } from "react";
import { Page, Card, TextField, Button } from "@shopify/polaris";

export default function AnnouncementPage() {
  const [text, setText] = useState("");

  async function save() {
    await fetch("/api/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  }

  return (
    <Page title="Announcement">
      <Card>
        <TextField
          label="Announcement Text"
          value={text}
          onChange={setText}
        />
        <Button onClick={save} primary>
          Save
        </Button>
      </Card>
    </Page>
  );
}