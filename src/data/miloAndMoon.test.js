import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import story from "./miloAndMoon.js";
import scenes from "./miloScenes.js";

test("Milo and the Moon contains the complete seven chapter story", () => {
  assert.equal(story.title, "Milo and the Moon");
  assert.equal(story.chapters.length, 7);
  assert.deepEqual(story.chapters.map((chapter) => chapter.title), [
    "My Best Friend, Mara",
    "The Day Everything Changed",
    "A Goodbye I Wasn't Ready For",
    "Another Sad Goodbye",
    "Dear Moon",
    "Learning to Smile Again",
    "My Friend in the Sky",
  ]);
  assert.ok(story.chapters.reduce((count, chapter) => count + chapter.paragraphs.length, 0) >= 25);
});

test("Milo and the Moon includes all requested learning and author sections", () => {
  assert.equal(story.lesson.length, 5);
  assert.equal(story.activities.length, 4);
  assert.ok(story.activities.some((activity) => activity.drawingSpace));
  assert.equal(story.parentNote.length, 2);
  assert.equal(story.discussionQuestions.length, 5);
  assert.equal(story.author, "Udofe Godscovenant Patrick");
  assert.equal(story.authorDescription, "Creative Writer");
  assert.match(story.fictionDisclaimer, /This is a work of fiction\./);
});

test("the story has the specified title, subtitle, and gentle illness and grief themes", () => {
  assert.equal(story.subtitle, "A Little Story About Love, Loss, Memories, and Hope");
  const completeText = story.chapters.flatMap((chapter) => chapter.paragraphs).join(" ");
  assert.match(completeText, /advanced cancer/i);
  assert.match(completeText, /not my fault/i);
  assert.match(completeText, /not caused by my sadness/i);
  assert.match(completeText, /moon did not answer/i);
  assert.match(completeText, /Tom and Jerry/i);
  assert.match(completeText, /Avatar: The Last Airbender/i);
  assert.match(completeText, /Sokka/i);
});

test("the animated story includes the full sequence of cartoon scenes", () => {
  assert.equal(scenes.length, 10);
  assert.equal(scenes[0].title, "Meet Milo & Mara");
  assert.ok(scenes.every((scene) => scene.completed && scene.visualMood && scene.id && scene.title && scene.narration.length));
  assert.ok(scenes.every((scene) => Array.isArray(scene.dialogue) && scene.dialogue.length > 0));
});

test("Meet Milo uses the requested opening narration verbatim", () => {
  assert.equal(
    scenes[0].narration[0],
    "Hello, little ones! My name is Milo, and today, I want to tell you how I became friends with the moon. I hope that by the end of my story, you will love the moon a little more, too.",
  );
});

test("scene artwork references point to image files in public", () => {
  const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
  const imageScenes = scenes.filter((scene) => scene.image);
  assert.ok(imageScenes.length > 0);
  for (const scene of imageScenes) {
    assert.ok(existsSync(resolve(projectRoot, "public", decodeURIComponent(scene.image.slice(1)))), `${scene.id} artwork should exist`);
  }
});
