const axios = require("axios");
const { Telegraf } = require("telegraf");
const { Configuration, OpenAIApi } = require("openai"); // OpenAI API client library

// API credentials
const newsApiKey = "f5842bf13a064296a20849e8cce350f6";
const telegramBotToken = "6299844656:AAHf-jYLCF4go4ZefBwu85MkaOy6VGuDJHk";
const telegramChatId = "733038963";
const openaiApiKey = "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";

// Initialize the Telegram bot
const bot = new Telegraf(telegramBotToken);

// Initialize the OpenAI API client
const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);

// Function to fetch news articles
async function fetchNewsArticles() {
  const newsApiUrl = `https://newsapi.org/v2/everything?q=tech,ai,business&pageSize=5&apiKey=${newsApiKey}`;

  try {
    const response = await axios.get(newsApiUrl);
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return [];
  }
}

// Function to generate a text summary using ChatGPT
async function generateSummary(text) {
  const prompt = `Summarize the following text:\n\n${text}`;

  const response = await openai.createCompletion({
    engine: "davinci",
    prompt: prompt,
  });
  console.log("efjkdfkhkjfdhgjkfdhg",response);

  // const summary = response.choices[0].text.trim();
  // console.log(summary ,"dhjkhdfjkh");

  return summary;
}

// Function to send a Telegram message
async function sendTelegramMessage(title, summary, image) {
  try {
    const message = `${title}\n\n${summary}`;
    await bot.telegram.sendPhoto(
      telegramChatId,
      { source: image },
      { caption: message }
    );
  } catch (error) {
    console.error("Error sending Telegram message:");
  }
}

// Main function
async function main() {
  try {
    // Fetch news articles
    const articles = await fetchNewsArticles();

    // Process each news article
    for (const article of articles) {
      const { title, description , urlToImage} = article;
      console.log(article);

      // const summary = await generateSummary(description);

      // const generatedImage = await generateAIImage(description);

      // const modifiedImage = await overlayTextOnImage(generatedImage, title);

      await sendTelegramMessage(title, description, urlToImage);

      // await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log("Bot has completed the task.");
  } catch (error) {
    console.error("Error running the bot:");
  }
}

// Run the bot
bot.startPolling();
main();
