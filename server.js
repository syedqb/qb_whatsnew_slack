import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { getCommits } from "./git.js";
import { summarize } from "./summarizer.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

app.post("/slack/whatsnew", async (req, res) => {

  const trigger_id = req.body.trigger_id;

  const modal = {
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "whatsnew_submit",
      title: {
        type: "plain_text",
        text: "What's New"
      },
      submit: {
        type: "plain_text",
        text: "Generate"
      },
      blocks: [
        {
          type: "input",
          block_id: "range",
          label: {
            type: "plain_text",
            text: "Select Date Range"
          },
          element: {
            type: "static_select",
            action_id: "range_select",
            options: [
              {
                text: { type: "plain_text", text: "Today" },
                value: "today"
              },
              {
                text: { type: "plain_text", text: "Last 7 days" },
                value: "7days"
              }
            ]
          }
        }
      ]
    }
  };

  await axios.post(
    "https://slack.com/api/views.open",
    modal,
    {
      headers: {
        Authorization: `Bearer ${BOT_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  res.send("");
});

app.post("/slack/interactivity", async (req, res) => {

  const payload = JSON.parse(req.body.payload);

  if (payload.type === "view_submission") {

    const range =
      payload.view.state.values.range.range_select.selected_option.value;

    const commits = await getCommits(range);

    const summary = await summarize(commits);

    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: process.env.CHANNEL_ID,
        text: summary
      },
      {
        headers: {
          Authorization: `Bearer ${BOT_TOKEN}`
        }
      }
    );

    res.json({ response_action: "clear" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});