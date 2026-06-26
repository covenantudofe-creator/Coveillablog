const axios = require("axios");

async function createArticle() {
  try {
    const res = await axios.post("http://127.0.0.1:5055/api/articles", {
      title: "The Dopamine Trap: Why We Spend Impulsively",
      slug: "the-dopamine-trap-why-we-spend-impulsively",

      content: `The Biology of the Buy

Have you ever made a purchase that felt exciting in the moment, only to regret it later?

That’s the reality of impulsive spending. Most impulsive purchases don’t come from necessity — they come from desire.

As adults, it becomes important to understand a simple truth: wants are insatiable.`,

      subtitle: "Understanding the psychology behind spending.",
      category: "Psychology",
      image: "https://i.pinimg.com/736x/74/26/3f/74263f98f533f068ac5049e6d02b7357.jpg",
    });

    console.log("Created:", res.data);
  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
  }
}

createArticle();